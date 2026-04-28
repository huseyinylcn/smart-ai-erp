/**
 * Commercial Flow Resolver Engine
 * Decides business actions based on Contract, QRP, and Company Policy
 */

export type FlowDecisionStatus = 'OK' | 'WARNING' | 'CRITICAL' | 'DECISION_REQUIRED';
export type SuggestedAction = 'CREATE_CONTRACT' | 'CREATE_QRP' | 'OVERRIDE' | 'SPLIT' | 'APPROVAL' | 'PROCEED_MANUAL';

export interface FlowOption {
  id: string;
  label: string;
  description: string;
  action: SuggestedAction;
  payload?: any;
}

export interface FlowDecision {
  status: FlowDecisionStatus;
  message: string;
  options?: FlowOption[];
  resolvedData?: {
    contractId?: string;
    qrpVersionId?: string;
    price?: number;
    priceSource: 'QRP' | 'MANUAL';
    split?: {
      qrpQty: number;
      manualQty: number;
    };
  };
}

export interface ResolverContext {
  partnerId: string;
  productId: string;
  qty: number;
  date: string;
  currency: string;
  policy: {
    contractMode: 'STRICT' | 'FLEXIBLE' | 'SMART';
    qrpMode: 'STRICT' | 'SMART';
    limitMode: 'STRICT' | 'APPROVAL' | 'FLEXIBLE';
  };
}

class CommercialFlowResolver {
  
  /**
   * Main resolver entry point
   */
  resolveOrderLine(context: ResolverContext, existingData: any): FlowDecision {
    
    // 1. Resolve Contract
    const contractDecision = this.resolveContract(context, existingData.contracts);
    if (contractDecision.status === 'CRITICAL' || contractDecision.status === 'DECISION_REQUIRED') {
      return contractDecision;
    }

    // 2. Resolve QRP
    const qrpDecision = this.resolveQRP(context, existingData.qrpVersions);
    if (qrpDecision.status === 'DECISION_REQUIRED' || qrpDecision.status === 'CRITICAL') {
      return qrpDecision;
    }

    // 3. Resolve Limits (if QRP matched)
    if (qrpDecision.resolvedData?.priceSource === 'QRP') {
      return this.resolveLimits(context, qrpDecision);
    }

    return qrpDecision;
  }

  private resolveContract(context: ResolverContext, contracts: any[]): FlowDecision {
    const activeContract = contracts.find(c => c.partnerId === context.partnerId && c.status === 'ACTIVE');
    
    if (activeContract) {
      return { status: 'OK', message: 'Active contract found.', resolvedData: { contractId: activeContract.id, priceSource: 'MANUAL' } };
    }

    const expiredContract = contracts.find(c => c.partnerId === context.partnerId && c.status === 'EXPIRED');
    if (expiredContract) {
      return {
        status: 'WARNING',
        message: 'Contract is EXPIRED.',
        options: [
          { id: 'renew', label: 'Renew Contract', description: 'Go to contract renewal page', action: 'CREATE_CONTRACT' },
          { id: 'override', label: 'Override & Continue', description: 'Use expired contract (Manager only)', action: 'OVERRIDE' }
        ]
      };
    }

    // No contract
    if (context.policy.contractMode === 'STRICT') {
      return { status: 'CRITICAL', message: 'No active contract. Strict policy blocks order.' };
    }

    if (context.policy.contractMode === 'SMART') {
      return {
        status: 'DECISION_REQUIRED',
        message: 'No contract found for this partner.',
        options: [
          { id: 'create_c', label: 'Create New Contract', description: 'Open quick contract form', action: 'CREATE_CONTRACT' },
          { id: 'manual_c', label: 'Proceed without Contract', description: 'Continue with manual pricing', action: 'PROCEED_MANUAL' }
        ]
      };
    }

    return { status: 'OK', message: 'Proceeding without contract (Flexible).', resolvedData: { priceSource: 'MANUAL' } };
  }

  private resolveQRP(context: ResolverContext, versions: any[]): FlowDecision {
    // Advanced matching logic
    const matched = versions.find(v => 
      v.validFrom <= context.date && 
      v.validTo >= context.date && 
      v.currency === context.currency &&
      v.items.some((i: any) => i.productId === context.productId)
    );

    if (matched) {
      const item = matched.items.find((i: any) => i.productId === context.productId);
      return {
        status: 'OK',
        message: `QRP Matched: ${matched.versionNo}`,
        resolvedData: {
          qrpVersionId: matched.id,
          price: item.price,
          priceSource: 'QRP'
        }
      };
    }

    // No QRP found
    if (context.policy.qrpMode === 'STRICT') {
      return { status: 'CRITICAL', message: 'No valid QRP found. Strict policy blocks order.' };
    }

    return {
      status: 'DECISION_REQUIRED',
      message: 'No price agreement (QRP) found for this product.',
      options: [
        { id: 'create_q', label: 'Create Quick QRP', description: 'Define price for this product now', action: 'CREATE_QRP' },
        { id: 'manual_q', label: 'Use Manual Price', description: 'Enter price manually for this order', action: 'PROCEED_MANUAL' }
      ]
    };
  }

  private resolveLimits(context: ResolverContext, qrpDecision: FlowDecision): FlowDecision {
    const qrpId = qrpDecision.resolvedData?.qrpVersionId;
    // Mock limit check
    const limit = 100;
    const used = 80;
    const remaining = limit - used;

    if (context.qty <= remaining) {
      return qrpDecision;
    }

    // Limit exceeded
    if (context.policy.limitMode === 'STRICT') {
      return { status: 'CRITICAL', message: `Limit exceeded. Remaining: ${remaining}.` };
    }

    if (context.policy.limitMode === 'FLEXIBLE') {
      return {
        status: 'WARNING',
        message: `Limit exceeded (${context.qty} > ${remaining}). Suggested: SPLIT.`,
        resolvedData: {
          ...qrpDecision.resolvedData!,
          split: { qrpQty: remaining, manualQty: context.qty - remaining }
        },
        options: [
          { id: 'split', label: 'Split Order Line', description: `Create 2 lines: ${remaining} (QRP) + ${context.qty - remaining} (Manual)`, action: 'SPLIT' },
          { id: 'approval', label: 'Request Over-limit Approval', description: 'Send to manager for approval', action: 'APPROVAL' }
        ]
      };
    }

    return {
      status: 'DECISION_REQUIRED',
      message: 'Quantity exceeds price agreement limit.',
      options: [
        { id: 'approval_req', label: 'Request Approval', description: 'Request manager approval to exceed limit', action: 'APPROVAL' },
        { id: 'manual_fix', label: 'Adjust Quantity', description: 'Change quantity to stay within limit', action: 'OVERRIDE' }
      ]
    };
  }
}

export const flowResolver = new CommercialFlowResolver();

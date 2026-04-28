/**
 * Enterprise Commercial Control Service (v4)
 * Central logic for QRP, Contracts, and Pricing
 */

export type PriceSource = 'QRP' | 'MANUAL';
export type ControlMode = 'STRICT' | 'APPROVAL' | 'FLEXIBLE';
export type UsageSource = 'ORDER' | 'SHIPMENT' | 'INVOICE';

export interface QRPVersion {
  id: string;
  parentQrpId: string;
  versionNo: number;
  validFrom: string;
  validTo: string;
  currency: string;
  controlMode: ControlMode;
  items: QRPItem[];
}

export interface QRPItem {
  productId: string;
  limitQty: number;
  price: number;
}

export interface UsageCache {
  usedQty: number;
  lastUpdated: number;
}

class CommercialControlService {
  // Simple in-memory cache for simulation (v4 Hybrid)
  private usageCache: Map<string, UsageCache> = new Map();

  /**
   * Calculate dynamic usage from truth source (simulation)
   */
  async getDynamicUsage(qrpVersionId: string, productId: string, source: UsageSource = 'SHIPMENT'): Promise<number> {
    // In a real system, this would be a DB SUM query:
    // SELECT SUM(qty) FROM orders WHERE qrpVersionId = ? AND productId = ? AND status != 'CANCELLED'
    
    // Simulation:
    const key = `${qrpVersionId}-${productId}`;
    return this.usageCache.get(key)?.usedQty || 0;
  }

  /**
   * Find best QRP version for a given context (Advanced Matching Engine)
   */
  findBestQRPVersion(context: {
    partnerId: string;
    productId: string;
    date: string;
    currency: string;
    contractId?: string;
  }, versions: QRPVersion[]): QRPVersion | null {
    
    const matches = versions.filter(v => {
      const dateMatch = context.date >= v.validFrom && context.date <= v.validTo;
      const currencyMatch = context.currency === v.currency;
      const productMatch = v.items.some(i => i.productId === context.productId);
      return dateMatch && currencyMatch && productMatch;
    });

    if (matches.length === 0) return null;

    // Priority Logic:
    // 1. Contract-linked
    // 2. Highest Version
    return matches.sort((a, b) => {
      if (context.contractId) {
        if (a.parentQrpId === context.contractId) return -1;
        if (b.parentQrpId === context.contractId) return 1;
      }
      return b.versionNo - a.versionNo;
    })[0];
  }

  /**
   * Currency Conversion Logic
   */
  convertPrice(price: number, fromRate: number, toRate: number): number {
    if (fromRate === toRate) return price;
    return (price * toRate) / fromRate;
  }

  /**
   * Final Sync Check (Concurrency Control)
   */
  async validateLimit(qrpVersionId: string, productId: string, newQty: number, limit: number): Promise<{
    allowed: boolean;
    remaining: number;
    error?: string;
  }> {
    const currentUsage = await this.getDynamicUsage(qrpVersionId, productId);
    const remaining = limit - currentUsage;
    
    if (newQty > remaining) {
      return { allowed: false, remaining, error: 'LIMIT_EXCEEDED' };
    }
    
    return { allowed: true, remaining: remaining - newQty };
  }

  /**
   * Audit Log Simulation
   */
  logOverride(data: {
    orderLineId: string;
    userId: string;
    oldPrice: number;
    newPrice: number;
    reason: string;
  }) {
    console.log('[COMMERCIAL AUDIT]', data);
    // In production, save to price_override_logs table
  }
}

export const commercialControl = new CommercialControlService();

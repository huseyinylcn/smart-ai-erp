import React from 'react';
import { 
  ArrowRight, CheckCircle2, Clock, 
  FileText, Package, CreditCard, 
  ChevronRight, Link as LinkIcon
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface DocNode {
  id: string;
  type: 'ORDER' | 'WAREHOUSE' | 'INVOICE' | 'PAYMENT';
  number: string;
  date: string;
  status: string;
  current?: boolean;
  path: string;
}

interface DocumentFlowProps {
  nodes: DocNode[];
}

const DocumentFlow: React.FC<DocumentFlowProps> = ({ nodes }) => {
  const getIcon = (type: DocNode['type']) => {
    switch (type) {
      case 'ORDER': return FileText;
      case 'WAREHOUSE': return Package;
      case 'INVOICE': return CreditCard;
      case 'PAYMENT': return CheckCircle2;
      default: return FileText;
    }
  };

  const getStatusColor = (status: string) => {
    const s = status.toUpperCase();
    if (s === 'POSTED' || s === 'COMPLETED' || s === 'RECEIVED') return 'text-emerald-500 bg-emerald-50 border-emerald-100';
    if (s === 'DRAFT' || s === 'PENDING') return 'text-slate-400 bg-slate-50 border-slate-100';
    if (s === 'SENT' || s === 'APPROVED') return 'text-blue-500 bg-blue-50 border-blue-100';
    return 'text-amber-500 bg-amber-50 border-amber-100';
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-8 shadow-sm">
      <div className="flex items-center space-x-3 mb-8">
        <div className="w-8 h-8 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600">
          <LinkIcon className="w-4 h-4" />
        </div>
        <h3 className="text-sm font-black uppercase tracking-widest text-slate-800 dark:text-white italic">Sənəd Zənciri (Traceability)</h3>
      </div>

      <div className="relative">
        {/* Connection Line */}
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 dark:bg-slate-800 -translate-y-1/2 hidden md:block"></div>

        <div className="flex flex-col md:flex-row items-center justify-between relative z-10 gap-8">
          {nodes.map((node, index) => {
            const Icon = getIcon(node.type);
            const isLast = index === nodes.length - 1;

            return (
              <React.Fragment key={node.id}>
                <div className={`flex flex-col items-center group transition-all ${node.current ? 'scale-110' : 'opacity-70 hover:opacity-100'}`}>
                  <Link to={node.path} className="relative">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-all ${
                      node.current 
                        ? 'bg-indigo-600 text-white ring-4 ring-indigo-50 dark:ring-indigo-900/20' 
                        : 'bg-white dark:bg-slate-800 text-slate-400 border border-slate-100 dark:border-slate-700 hover:border-indigo-200'
                    }`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    {node.current && (
                      <div className="absolute -top-2 -right-2 w-5 h-5 bg-emerald-500 text-white rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900 animate-bounce">
                        <CheckCircle2 className="w-3 h-3" />
                      </div>
                    )}
                  </Link>

                  <div className="mt-4 text-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">{node.type}</p>
                    <p className="text-xs font-black text-slate-800 dark:text-white">{node.number}</p>
                    <div className={`mt-2 px-2 py-0.5 rounded-lg border text-[9px] font-black uppercase inline-block ${getStatusColor(node.status)}`}>
                      {node.status}
                    </div>
                  </div>
                </div>

                {!isLast && (
                  <div className="md:hidden">
                    <ArrowRight className="w-5 h-5 text-slate-300 rotate-90" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DocumentFlow;

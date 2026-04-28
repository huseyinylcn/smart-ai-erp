import React from 'react';
import { CheckCircle2, XCircle, BarChart3, Table, FileJson, AlertTriangle } from 'lucide-react';

interface AIPreviewProps {
  response: any; // Standard AIResponse
  onApprove: (draft: any) => void;
  onReject: () => void;
}

const AIPreviewComponent: React.FC<AIPreviewProps> = ({ response, onApprove, onReject }) => {
  if (!response) return null;

  const { ui, draft, action } = response;

  return (
    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-amber-100 dark:border-amber-900/30 rounded-[2rem] p-6 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-amber-500 rounded-xl text-white">
            <FileJson className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-black text-slate-800 dark:text-white uppercase italic tracking-tight">{ui.title}</h4>
            <p className="text-[10px] font-bold text-slate-400 uppercase italic">{ui.description}</p>
          </div>
        </div>
        <div className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase italic ${action.impact === 'HIGH' ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
          Təsir: {action.impact}
        </div>
      </div>

      {/* DRAFT VISUALIZATION */}
      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 mb-6 border border-slate-100 dark:border-slate-800">
        {ui.type === 'TABLE' ? (
          <div className="space-y-3">
            <div className="flex items-center text-amber-600 space-x-2 mb-2">
              <Table className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase italic">Hesabat Strukturu</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {draft.data.metrics?.map((m: string) => (
                <div key={m} className="bg-white dark:bg-slate-800 p-2 rounded-lg text-[10px] font-bold text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-700 text-center uppercase italic">
                  {m}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center py-4 opacity-50">
            <BarChart3 className="w-8 h-8 mb-2" />
            <span className="text-[10px] font-bold uppercase italic">Vizualizasiya Hazırlanır...</span>
          </div>
        )}
      </div>

      {/* WARNINGS */}
      {action.impact === 'HIGH' && (
        <div className="flex items-center space-x-2 p-3 bg-rose-50 border border-rose-100 rounded-xl mb-6">
          <AlertTriangle className="w-4 h-4 text-rose-500" />
          <p className="text-[10px] font-bold text-rose-600 uppercase italic leading-tight">Bu əməliyyat maliyyə göstəricilərinə ciddi təsir edə bilər.</p>
        </div>
      )}

      {/* ACTIONS */}
      <div className="flex items-center space-x-3">
        <button 
          onClick={onReject}
          className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-xl text-[10px] font-black uppercase italic hover:bg-rose-50 hover:text-rose-600 transition-all"
        >
          <XCircle className="w-4 h-4 inline mr-2" /> Ləğv Et
        </button>
        <button 
          onClick={() => onApprove(draft)}
          className="flex-[2] py-3 bg-amber-600 text-white rounded-xl text-[10px] font-black uppercase italic shadow-xl shadow-amber-500/20 hover:bg-amber-700 transition-all"
        >
          <CheckCircle2 className="w-4 h-4 inline mr-2" /> Təsdiqlə və İcra Et
        </button>
      </div>
    </div>
  );
};

export default AIPreviewComponent;

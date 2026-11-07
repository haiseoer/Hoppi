import React from 'react';
import { ApprovalRequest } from '../types';
import { ShieldCheck, ShieldAlert, Check, X, UserX, Clock, Cpu, FileCode, ShoppingCart, Home } from 'lucide-react';

interface HitlApprovalModalProps {
  request: ApprovalRequest | null;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onClose: () => void;
}

export const HitlApprovalModal: React.FC<HitlApprovalModalProps> = ({
  request,
  onApprove,
  onReject,
  onClose,
}) => {
  if (!request) return null;

  const getRequesterIcon = (type: string) => {
    switch (type) {
      case 'guest':
        return <UserX className="w-5 h-5 text-amber-400" />;
      case 'code_agent':
        return <FileCode className="w-5 h-5 text-cyan-400" />;
      case 'sales_crm':
        return <ShoppingCart className="w-5 h-5 text-emerald-400" />;
      case 'lan_iot':
        return <Home className="w-5 h-5 text-purple-400" />;
      default:
        return <Cpu className="w-5 h-5 text-blue-400" />;
    }
  };

  const riskBadge = {
    low: { label: 'Rủi ro thấp', bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
    medium: { label: 'Rủi ro trung bình', bg: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
    high: { label: 'Rủi ro cao (Cần xem xét kỹ)', bg: 'bg-rose-500/20 text-rose-300 border-rose-500/30' },
  }[request.riskLevel];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-amber-500/40 shadow-[0_20px_50px_rgba(245,158,11,0.2)] p-6 overflow-hidden">
        {/* Glow corner */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-start justify-between gap-3 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30">
              {getRequesterIcon(request.requesterType)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-base">Yêu cầu Phê duyệt (HITL)</h3>
                <span className={`px-2 py-0.5 rounded-full border text-[10px] font-semibold ${riskBadge.bg}`}>
                  {riskBadge.label}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Chủ nhân Nguyễn Thanh Hải đang có quyền quyết định tối cao
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="my-4 space-y-3">
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium">Bên yêu cầu:</span>
              <span className="font-semibold text-cyan-400">{request.requesterName}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium">Thời điểm:</span>
              <span className="font-mono text-slate-300 text-[11px] flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" />
                {request.timestamp}
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800/80">
            <p className="text-xs font-semibold text-slate-200 mb-1">{request.actionTitle}</p>
            <p className="text-xs text-slate-300 leading-relaxed">{request.description}</p>
          </div>

          {request.payload && (
            <div className="p-3 rounded-lg bg-slate-950 font-mono text-[11px] text-cyan-300 border border-slate-800 overflow-x-auto">
              <pre>{JSON.stringify(request.payload, null, 2)}</pre>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
          <button
            onClick={() => onReject(request.id)}
            className="px-4 py-2 rounded-xl border border-rose-500/40 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
            <span>Từ chối yêu cầu</span>
          </button>
          <button
            onClick={() => onApprove(request.id)}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:opacity-95 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Chấp thuận & Thực thi ngay</span>
          </button>
        </div>
      </div>
    </div>
  );
};

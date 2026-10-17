import React from 'react';
import { AlertTriangle, Upload, FlaskConical, X, Check, Droplet } from 'lucide-react';

interface RejectionWarningModalProps {
  warning: {
    title?: string;
    message: string;
    filename?: string;
  } | null;
  onClose: () => void;
  onOpenUpload: () => void;
  onLoadDemoSample: () => void;
}

export const RejectionWarningModal: React.FC<RejectionWarningModalProps> = ({
  warning,
  onClose,
  onOpenUpload,
  onLoadDemoSample,
}) => {
  if (!warning) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-gradient-to-b from-[#131d2a] via-[#0d1622] to-[#07101a] border-2 border-amber-500/40 rounded-3xl shadow-2xl p-6 sm:p-7 text-slate-200">
        {/* Close icon */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition"
          aria-label="Kapat"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Warning Badge & Icon */}
        <div className="flex items-start gap-4 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 shadow-inner">
            <AlertTriangle className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-700/50">
              Yapay Zeka Görsel Doğrulama
            </span>
            <h3 className="text-base sm:text-lg font-bold text-white mt-1">
              {warning.title || 'Su / Mikroskopi Numunesi Tespit Edilemedi'}
            </h3>
            {warning.filename && (
              <p className="text-xs text-slate-400 font-mono mt-0.5 truncate max-w-xs">
                Dosya: {warning.filename}
              </p>
            )}
          </div>
        </div>

        {/* Reason from Gemini */}
        <div className="p-4 rounded-2xl bg-amber-950/25 border border-amber-500/30 mb-5">
          <p className="text-sm text-amber-200/90 leading-relaxed font-medium">
            "{warning.message}"
          </p>
        </div>

        {/* Helpful Scientific Guidelines */}
        <div className="space-y-2 mb-6 text-xs text-slate-300 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
          <span className="font-bold text-slate-200 flex items-center gap-1.5 mb-1.5">
            <Droplet className="w-3.5 h-3.5 text-teal-400" />
            Hangi fotoğraflar analiz edilebilir?
          </span>
          <div className="flex items-center gap-2 text-emerald-300">
            <Check className="w-3.5 h-3.5 shrink-0" />
            <span>Mikroskop görüntüleri, optik büyütülmüş su lamları</span>
          </div>
          <div className="flex items-center gap-2 text-emerald-300">
            <Check className="w-3.5 h-3.5 shrink-0" />
            <span>Su bardağı, deney tüpü, pet şişe veya arıtma filtreleri</span>
          </div>
          <div className="flex items-center gap-2 text-emerald-300">
            <Check className="w-3.5 h-3.5 shrink-0" />
            <span>Lifli atık sular, deniz/göl suyu veya biyoçömür numuneleri</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5">
          <button
            onClick={() => {
              onClose();
              onOpenUpload();
            }}
            className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-teal-500/20 transition"
          >
            <Upload className="w-4 h-4" />
            <span>Yeni Fotoğraf Seç</span>
          </button>

          <button
            onClick={() => {
              onClose();
              onLoadDemoSample();
            }}
            className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-300 font-semibold text-xs flex items-center justify-center gap-2 border border-slate-700 transition"
          >
            <FlaskConical className="w-4 h-4 text-amber-400" />
            <span>Örnek Numune ile Dene</span>
          </button>
        </div>
      </div>
    </div>
  );
};

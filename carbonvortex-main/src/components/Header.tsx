import React from 'react';
import { Smartphone, Monitor, ShieldCheck, Activity, Layers, Wind, Sparkles } from 'lucide-react';

interface HeaderProps {
  isMobileDeviceFrame: boolean;
  setIsMobileDeviceFrame: (val: boolean) => void;
  efficiency: number | null;
}

export const Header: React.FC<HeaderProps> = ({
  isMobileDeviceFrame,
  setIsMobileDeviceFrame,
  efficiency
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#07131e]/90 backdrop-blur-md border-b border-teal-900/40 px-4 py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
        {/* Brand and Scientific Tag */}
        <div className="flex items-center gap-3">
          {/* CarboVortex AI Logo: Carbon porous structure with vortex flow */}
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 via-emerald-600 to-cyan-700 shadow-lg shadow-teal-500/20 text-white font-bold ring-2 ring-teal-400/30">
            <div className="relative">
              <Wind className="w-5 h-5 text-white animate-spin" style={{ animationDuration: '12s' }} />
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="w-1.5 h-1.5 bg-teal-200 rounded-full" />
              </span>
            </div>
            <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#07131e]" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-extrabold tracking-tight text-white flex items-center gap-1.5">
                CarboVortex <span className="text-teal-400">AI</span>
              </h1>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-teal-950/80 text-teal-300 border border-teal-800/60 font-mono">
                v3.0 KarbonLab
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium tracking-tight">
              Ceviz Kabuğu Aktif Karbon & Yapay Zeka Su Analiz Platformu
            </p>
          </div>
        </div>

        {/* Live Lab Status Badges & Device Mode Toggle */}
        <div className="flex items-center gap-2">
          {/* Active Porous Carbon Bed Badge */}
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/90 border border-teal-500/30 text-xs text-teal-300 font-mono">
            <Layers className="w-3.5 h-3.5 text-teal-400" />
            <span>
              {efficiency !== null ? 'Gözenek Matrisi: Aktif (BET ~950 m²/g)' : 'Gözenek Matrisi: Beklemede'}
            </span>
            {efficiency !== null && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />}
          </div>

          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/40 text-xs text-emerald-300 font-semibold font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>{efficiency !== null ? `Verim: %${efficiency.toFixed(1)}` : 'Verim: Yükleme Bekleniyor...'}</span>
          </div>

          {/* Toggle between Mobile Phone Mockup vs Desktop Wide View */}
          <button
            onClick={() => setIsMobileDeviceFrame(!isMobileDeviceFrame)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 border border-slate-700 transition shadow-sm"
            title={isMobileDeviceFrame ? "Geniş Laboratuvar Ekranına Geç" : "Mobil Cihaz Görünümüne Geç"}
          >
            {isMobileDeviceFrame ? (
              <>
                <Monitor className="w-3.5 h-3.5 text-teal-400" />
                <span className="hidden sm:inline">Geniş Mod</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5 text-teal-400" />
                <span className="hidden sm:inline">Mobil Kasa</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

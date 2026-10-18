import React from 'react';
import { X, CheckCircle, AlertTriangle, ShieldCheck, Cpu, Info, Layers } from 'lucide-react';
import { MicroplasticParticle } from '../types';

interface ParticleDetailModalProps {
  particle: MicroplasticParticle | null;
  onClose: () => void;
}

export const ParticleDetailModal: React.FC<ParticleDetailModalProps> = ({
  particle,
  onClose
}) => {
  if (!particle) return null;

  const polymerDescriptions: Record<string, { full: string; formula: string; hazard: string }> = {
    PET: {
      full: 'Polietilen Tereftalat',
      formula: '(C10H8O4)n',
      hazard: 'Gıda ambalajları ve sentetik tekstil liflerinden kaynaklanır. İnsan ve sucul canlılar için endokrin bozucu riski taşır.'
    },
    PP: {
      full: 'Polipropilen',
      formula: '(C3H6)n',
      hazard: 'Şişe kapakları ve pipetlerden ufalanır. Hidrofobik yapısı toksinleri yüzeyinde biriktirir.'
    },
    PS: {
      full: 'Polistiren (Strafor)',
      formula: '(C8H8)n',
      hazard: 'Köpük ambalaj ve tek kullanımlık tabaklardan mikro-kürelere ayrışır. Ağır metalleri taşır.'
    },
    PE: {
      full: 'Polietilen (HDPE / LDPE)',
      formula: '(C2H4)n',
      hazard: 'Poşetler ve mikro boncuklar; su yüzeyinde asılı kalarak ışık geçirgenliğini azaltır.'
    },
    Naylon: {
      full: 'Poliamid (Nylon 6,6)',
      formula: '[NH−(CH2)6−NH−CO−(CH2)4−CO]n',
      hazard: 'Sentetik giysilerin makinede yıkanmasıyla suya karışan en yaygın mikro-iplik türü.'
    },
    PVC: {
      full: 'Polivinil Klorür',
      formula: '(C2H3Cl)n',
      hazard: 'Klorlu plastik boru ve inşaat atığı; fitalat ve toksik plastifiyan salınımı yapar.'
    }
  };

  const polyInfo = polymerDescriptions[particle.type] || {
    full: 'Sentetik Polimer',
    formula: 'Polimer Zinciri',
    hazard: 'Su ekosistemine zararlı mikroplastik parçacığı.'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-gradient-to-b from-[#0b1928] to-[#061019] border border-teal-500/40 rounded-2xl shadow-2xl p-5 text-slate-200">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <span
              className="w-3.5 h-3.5 rounded-full ring-2 ring-white/20"
              style={{ backgroundColor: particle.color }}
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-white">
                  {particle.customLabel || `${particle.type} Spektroskopik Tespiti`}
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-950 text-teal-300 border border-teal-800/60">
                  {particle.type} #{particle.id}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">{polyInfo.full}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Core Specs Grid */}
        <div className="grid grid-cols-2 gap-2.5 mb-4 font-mono text-xs">
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-slate-400 block text-[10px] uppercase">Mikro Boyut</span>
            <span className="text-white font-bold text-sm">{particle.sizeMicrons.toFixed(1)} µm</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-slate-400 block text-[10px] uppercase">Morfoloji (Şekil)</span>
            <span className="text-white font-bold text-sm">{particle.shape}</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-slate-400 block text-[10px] uppercase">AI Güven Skoru</span>
            <span className="text-teal-400 font-bold text-sm">%{Math.round(particle.confidence * 100)}</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-slate-400 block text-[10px] uppercase">Kimyasal Formül</span>
            <span className="text-emerald-400 font-bold text-sm">{polyInfo.formula}</span>
          </div>
        </div>

        {/* Active Carbon Pore Adsorption Status */}
        <div className="p-3 rounded-xl bg-teal-950/40 border border-teal-500/30 mb-4">
          <div className="flex items-center gap-2 mb-1.5">
            <Layers className="w-4 h-4 text-teal-400" />
            <span className="text-xs font-bold text-teal-300">
              Ceviz Kabuğu Aktif Karbon Tutunma Durumu
            </span>
          </div>
          <div className="flex items-start gap-2 text-xs">
            {particle.capturedByBiochar ? (
              <>
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <p className="text-slate-300">
                  <strong className="text-emerald-300">Filtre Gözeneklerinde Tutuldu: </strong>
                  {particle.notes}
                </p>
              </>
            ) : (
              <>
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <p className="text-slate-300">
                  <strong className="text-amber-300">Serbest Kalan Kalıntı: </strong>
                  {particle.notes}
                </p>
              </>
            )}
          </div>
        </div>

        {/* Hazard Note */}
        <div className="text-[11px] text-slate-400 bg-slate-900/40 p-2.5 rounded-lg border border-slate-800/80 flex items-start gap-2">
          <Info className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
          <p>{polyInfo.hazard}</p>
        </div>

        <button
          onClick={onClose}
          className="mt-4 w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs transition"
        >
          Kapat
        </button>
      </div>
    </div>
  );
};

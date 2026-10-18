import React from 'react';
import { CheckCircle2, TrendingDown, Layers, Droplet, Sparkles, Zap, AlertCircle, Clock } from 'lucide-react';
import { SampleData } from '../types';

interface OverviewCardsProps {
  sample: SampleData | null;
}

export const OverviewCards: React.FC<OverviewCardsProps> = ({ sample }) => {
  const isLoaded = sample !== null;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5 mb-5">
      {/* 1. Tespit Edilen Mikroplastik Sayısı */}
      <div className="col-span-1 rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-950/90 border border-slate-800 p-3.5 shadow-lg relative overflow-hidden group hover:border-teal-500/40 transition">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
            Tespit Edilen
          </span>
          <div className="w-7 h-7 rounded-lg bg-teal-950/80 border border-teal-800/50 flex items-center justify-center text-teal-400">
            <Droplet className="w-4 h-4" />
          </div>
        </div>

        {isLoaded ? (
          <>
            <div className="flex items-baseline gap-1.5">
              <span className={`text-2xl sm:text-3xl font-extrabold font-mono ${
                !sample.isDrinkable || sample.potabilityStatus === 'İÇİLEMEZ'
                  ? 'text-rose-400'
                  : 'text-emerald-400'
              }`}>
                {!sample.isDrinkable || sample.potabilityStatus === 'İÇİLEMEZ'
                  ? sample.initialConcentration
                  : sample.treatedConcentration}
              </span>
              <span className="text-xs text-slate-400 font-mono">adet/ml</span>
              {!sample.isDrinkable ? (
                <span className="text-[10px] px-1.5 py-0.5 rounded font-black bg-rose-950 text-rose-300 border border-rose-700 ml-auto">
                  AŞIRI YÜKSEK
                </span>
              ) : (
                <span className="text-[10px] px-1.5 py-0.5 rounded font-bold bg-emerald-950 text-emerald-300 border border-emerald-700 ml-auto">
                  ✓ TEMİZ (İÇİLEBİLİR)
                </span>
              )}
            </div>
            <div className="mt-2 flex items-center gap-1 text-[11px] font-medium">
              {!sample.isDrinkable || sample.potabilityStatus === 'İÇİLEMEZ' ? (
                <span className="text-rose-400 font-semibold flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>Ham Su: ❌ Kesinlikle İçilemez!</span>
                </span>
              ) : (
                <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>✅ Güvenli: İnsan Sağlığına Uygun</span>
                </span>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg sm:text-xl font-bold text-slate-400 font-mono">
                0 adet/ml
              </span>
            </div>
            <div className="mt-2 flex items-center gap-1 text-[11px] text-slate-500">
              <Clock className="w-3.5 h-3.5" />
              <span>Yükleme Bekleniyor...</span>
            </div>
          </>
        )}

        {/* Subtle background glow */}
        <div className="absolute -right-6 -bottom-6 w-20 h-20 bg-teal-500/10 rounded-full blur-xl pointer-events-none group-hover:bg-teal-500/20 transition" />
      </div>

      {/* 2. Arıtma Verimliliği (Kıyaslama) */}
      <div className="col-span-1 rounded-2xl bg-gradient-to-br from-emerald-950/30 via-slate-900/90 to-teal-950/20 border border-slate-800 p-3.5 shadow-lg relative overflow-hidden group hover:border-emerald-400/50 transition">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-medium text-emerald-300/80 uppercase tracking-wider">
            Arıtma Verimi (Kıyaslama)
          </span>
          <div className="w-7 h-7 rounded-lg bg-emerald-900/40 border border-emerald-500/40 flex items-center justify-center text-emerald-300">
            <Sparkles className="w-4 h-4" />
          </div>
        </div>

        {isLoaded ? (
          <>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-400">
                %{sample.efficiency.toFixed(1)}
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded font-bold ml-1 bg-emerald-500/20 text-emerald-300">
                2 Veri
              </span>
            </div>
            <div className="mt-2 text-[11px] text-slate-400 flex items-center gap-1 font-mono">
              <span className="w-1.5 h-1.5 rounded-full inline-block bg-emerald-400" />
              <span>qe: {sample.adsorptionCapacity} mg/g (Kıyaslandı)</span>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-baseline gap-1">
              <span className="text-lg sm:text-xl font-bold font-mono text-slate-400">
                Veri Bekleniyor
              </span>
            </div>
            <div className="mt-2 text-[11px] text-slate-500 flex items-center gap-1 font-mono">
              <span className="w-1.5 h-1.5 rounded-full inline-block bg-slate-600" />
              <span>2 veri ile kıyaslanır</span>
            </div>
          </>
        )}

        <div className="absolute -right-6 -bottom-6 w-20 h-20 bg-emerald-500/15 rounded-full blur-xl pointer-events-none group-hover:bg-emerald-500/25 transition" />
      </div>

      {/* 3. Aktivasyon Durumu */}
      <div className="col-span-2 rounded-2xl bg-gradient-to-br from-teal-950/30 via-slate-900/90 to-slate-950/90 border border-slate-800 p-3.5 shadow-lg relative overflow-hidden group hover:border-teal-400/50 transition flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-medium text-teal-300/90 uppercase tracking-wider flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-teal-400" />
              Aktivasyon & Gözenek Durumu
            </span>
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${
              isLoaded
                ? !sample.isDrinkable || sample.potabilityStatus === 'İÇİLEMEZ'
                  ? 'bg-rose-950 text-rose-300 border-rose-600'
                  : 'bg-emerald-950 text-emerald-300 border-emerald-500/50'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}>
              {isLoaded ? (
                !sample.isDrinkable || sample.potabilityStatus === 'İÇİLEMEZ' ? (
                  <>
                    <AlertCircle className="w-3 h-3 text-rose-400" />
                    Ham Su: KESİNLİKLE İÇİLEMEZ
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    İÇİLEBİLİR (GÜVENLİ)
                  </>
                )
              ) : (
                <>
                  <AlertCircle className="w-3 h-3 text-slate-500" />
                  Numune Bekleniyor
                </>
              )}
            </span>
          </div>

          <p className="text-sm font-bold text-white tracking-tight leading-snug">
            {isLoaded ? sample.activationType : 'Yükleme Bekleniyor...'}
          </p>
          <p className="text-xs text-slate-400 mt-1 line-clamp-1">
            {isLoaded
              ? sample.activationDetails
              : 'Aktif karbon gözenek adsorpsiyonu ve verimlilik hesaplaması için fotoğraf yükleyin.'}
          </p>
        </div>

        <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <span>
            Bulanıklık: {isLoaded ? `${sample.turbidityBefore} → ${sample.turbidityAfter} NTU` : '-- NTU'}
          </span>
          <span className="text-teal-400 font-medium">
            BET Yüzey Alanı: {isLoaded ? `${sample.betSurfaceArea || 950} m²/g` : '-- m²/g'}
          </span>
        </div>
        <div className="absolute -left-6 -bottom-6 w-24 h-24 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />
      </div>
    </div>
  );
};

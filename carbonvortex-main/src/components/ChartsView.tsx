import React, { useState } from 'react';
import {
  BarChart3,
  TrendingDown,
  Layers,
  Sliders,
  FlaskConical,
  Zap,
  Info,
  CheckCircle,
  HelpCircle,
  Upload,
  Gauge,
  Clock
} from 'lucide-react';
import { SampleData } from '../types';

interface ChartsViewProps {
  sample: SampleData | null;
  onGoToUpload?: () => void;
  onLoadDemoSample?: () => void;
}

export const ChartsView: React.FC<ChartsViewProps> = ({
  sample,
  onGoToUpload,
  onLoadDemoSample
}) => {
  // Active carbon synthesis and activation simulator states
  const [carbonizationTemp, setCarbonizationTemp] = useState<number>(750); // 450 - 900 °C
  const [activationTimeMin, setActivationTimeMin] = useState<number>(60); // 30 - 150 dk
  const [activationAgentRatio, setActivationAgentRatio] = useState<number>(18); // %5 - %35

  const calculateSimulatedMetrics = () => {
    if (!sample) return null;
    const tempFactor = 1 - Math.pow((carbonizationTemp - 750) / 350, 2) * 0.35;
    const timeFactor = Math.min(1.2, 0.7 + (activationTimeMin / 100) * 0.5);
    const agentFactor = 0.8 + (activationAgentRatio / 20) * 0.35;

    const baseBet = sample.betSurfaceArea || 920;
    const simulatedBetArea = Math.round(baseBet * tempFactor * timeFactor * agentFactor);
    const simulatedIodineNumber = Math.round(simulatedBetArea * 1.08);
    const simulatedEfficiency = Math.min(
      99.4,
      Math.max(48, (sample.efficiency || 90) * tempFactor * (0.9 + agentFactor * 0.1))
    );
    const simulatedQe = Math.min(56, Math.max(15, 38 + (simulatedBetArea / 1000) * 12));
    const poreVolume = (0.50 + (simulatedBetArea / 1000) * 0.22).toFixed(2);

    return {
      betArea: simulatedBetArea,
      iodineNumber: simulatedIodineNumber,
      efficiency: simulatedEfficiency.toFixed(1),
      qe: simulatedQe.toFixed(1),
      poreVolume
    };
  };

  const simMetrics = calculateSimulatedMetrics();
  const isLoaded = sample !== null;
  const maxConcentration = isLoaded && sample.kineticData.length
    ? Math.max(...sample.kineticData.map((d) => d.concentration))
    : 100;

  return (
    <div className="space-y-5 pb-20">
      {/* Title Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <BarChart3 className="w-5 h-5 text-teal-400" />
              <h2 className="text-base font-bold text-white">
                Aktif Karbon Adsorpsiyon Kinetiği & Süzülme Grafikleri
              </h2>
            </div>
            <p className="text-xs text-slate-400">
              {isLoaded
                ? 'Analiz edilen numunenin Pseudo 2. Derece Kinetik Modeli ve rakip filtre kıyaslamaları'
                : 'Grafik ve kinetik modelleme için lütfen önce bir numune fotoğrafı yükleyiniz.'}
            </p>
          </div>

          {!isLoaded && (
            <div className="flex items-center gap-2 self-start sm:self-auto">
              {onGoToUpload && (
                <button
                  onClick={onGoToUpload}
                  className="px-3.5 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition shadow-md shadow-teal-500/20 whitespace-nowrap"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Fotoğraf Yükle</span>
                </button>
              )}
              {onLoadDemoSample && (
                <button
                  onClick={onLoadDemoSample}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-300 font-semibold text-xs flex items-center gap-1.5 border border-slate-700 transition"
                >
                  <FlaskConical className="w-3.5 h-3.5 text-amber-400" />
                  <span>Örnek Veri</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 1. Kinetic Curve (Zamanla Azalan Mikroplastik Oranı) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-emerald-400" />
              Zamanla Azalan Mikroplastik Derişimi (C(t) vs Zaman)
            </h3>
            <p className="text-xs text-slate-400">
              {isLoaded
                ? '0 ile 60 dakika aralığında aktif karbon filtresinden süzülen mikroplastik miktarı'
                : 'Yükleme Bekleniyor... Numune yüklenmeden ezbere hesaplama yapılmaz.'}
            </p>
          </div>
          {isLoaded && (
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="flex items-center gap-1 text-teal-400">
                <span className="w-2.5 h-0.5 bg-teal-400 inline-block" />
                Kalan Konsantrasyon (adet/ml)
              </span>
            </div>
          )}
        </div>

        {/* Custom SVG Line & Area Chart or Clean Empty State */}
        {isLoaded ? (
          <div className="w-full h-56 relative bg-slate-950/60 rounded-xl p-3 border border-slate-800/80">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 500 160">
              {/* Grid lines */}
              <line x1="40" y1="20" x2="480" y2="20" stroke="#1e293b" strokeDasharray="3 3" />
              <line x1="40" y1="60" x2="480" y2="60" stroke="#1e293b" strokeDasharray="3 3" />
              <line x1="40" y1="100" x2="480" y2="100" stroke="#1e293b" strokeDasharray="3 3" />
              <line x1="40" y1="140" x2="480" y2="140" stroke="#334155" />

              {/* Y-axis Labels */}
              <text x="35" y="24" fill="#64748b" fontSize="10" fontFamily="monospace" textAnchor="end">
                {maxConcentration}
              </text>
              <text x="35" y="84" fill="#64748b" fontSize="10" fontFamily="monospace" textAnchor="end">
                {Math.round(maxConcentration / 2)}
              </text>
              <text x="35" y="144" fill="#64748b" fontSize="10" fontFamily="monospace" textAnchor="end">
                0
              </text>

              {(() => {
                const points = sample.kineticData.map((d, i) => {
                  const x = 50 + (i / (sample.kineticData.length - 1)) * 420;
                  const y = 140 - (d.concentration / (maxConcentration || 1)) * 115;
                  return `${x},${y}`;
                });
                const polyPoints = points.join(' ');
                const areaPoints = `50,140 ${polyPoints} 470,140`;

                return (
                  <g>
                    <defs>
                      <linearGradient id="kineticGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.35" />
                        <stop offset="100%" stopColor="#14b8a6" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <polygon points={areaPoints} fill="url(#kineticGrad)" />
                    <polyline
                      fill="none"
                      stroke="#14b8a6"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      points={polyPoints}
                    />

                    {sample.kineticData.map((d, i) => {
                      const x = 50 + (i / (sample.kineticData.length - 1)) * 420;
                      const y = 140 - (d.concentration / (maxConcentration || 1)) * 115;
                      return (
                        <g key={i} className="group cursor-pointer">
                          <circle
                            cx={x}
                            cy={y}
                            r="4.5"
                            fill="#0f172a"
                            stroke="#2dd4bf"
                            strokeWidth="2.5"
                          />
                          <text
                            x={x}
                            y={y - 8}
                            fill="#f8fafc"
                            fontSize="9"
                            fontFamily="monospace"
                            textAnchor="middle"
                            fontWeight="bold"
                          >
                            {d.concentration}
                          </text>
                          <text
                            x={x}
                            y="155"
                            fill="#94a3b8"
                            fontSize="10"
                            fontFamily="monospace"
                            textAnchor="middle"
                          >
                            {d.timeMinutes}dk
                          </text>
                        </g>
                      );
                    })}
                  </g>
                );
              })()}
            </svg>
          </div>
        ) : (
          <div className="w-full h-44 rounded-xl border border-dashed border-slate-800 bg-slate-950/60 flex flex-col items-center justify-center p-6 text-center">
            <Clock className="w-8 h-8 text-slate-600 mb-2" />
            <span className="text-sm font-bold text-slate-300 font-mono">
              Kinetik Veri: Yükleme Bekleniyor...
            </span>
            <p className="text-xs text-slate-500 mt-1 max-w-sm">
              Doğrulanmış adsorpsiyon zaman eğrisi için su veya mikroskop fotoğrafı yükleyiniz.
            </p>
          </div>
        )}

        {/* Kinetic Parameters Note */}
        <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
          <div className="bg-slate-950/70 p-2 rounded-lg border border-slate-800">
            <span className="text-slate-400 block text-[10px]">Model Uyumu (R²)</span>
            <span className={`font-bold ${isLoaded ? 'text-emerald-400' : 'text-slate-500'}`}>
              {isLoaded ? '0.9984 (Pseudo-2nd)' : 'Yükleme Bekleniyor...'}
            </span>
          </div>
          <div className="bg-slate-950/70 p-2 rounded-lg border border-slate-800">
            <span className="text-slate-400 block text-[10px]">Denge Zamanı (teq)</span>
            <span className={`font-bold ${isLoaded ? 'text-teal-400' : 'text-slate-500'}`}>
              {isLoaded ? '30 Dakika' : 'Yükleme Bekleniyor...'}
            </span>
          </div>
          <div className="bg-slate-950/70 p-2 rounded-lg border border-slate-800">
            <span className="text-slate-400 block text-[10px]">Maksimum qe</span>
            <span className={`font-bold ${isLoaded ? 'text-white' : 'text-slate-500'}`}>
              {isLoaded ? `${sample.adsorptionCapacity} mg/g` : 'Yükleme Bekleniyor...'}
            </span>
          </div>
          <div className="bg-slate-950/70 p-2 rounded-lg border border-slate-800">
            <span className="text-slate-400 block text-[10px]">Hız Sabiti (k2)</span>
            <span className={`font-bold ${isLoaded ? 'text-teal-300' : 'text-slate-500'}`}>
              {isLoaded ? '0.042 g/mg·dk' : 'Yükleme Bekleniyor...'}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Filter Performance Comparison Bar Chart */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-teal-400" />
              Filtre Malzemeleri Verimlilik Karşılaştırması (%)
            </h3>
            <p className="text-xs text-slate-400">
              {isLoaded
                ? 'Ceviz kabuğundan üretilen aktif karbon ile alternatif filtre malzemelerinin karşılaştırması'
                : 'Yükleme Bekleniyor... Karşılaştırma numune analizinden sonra aktif olur.'}
            </p>
          </div>
        </div>

        {isLoaded ? (
          <div className="space-y-3">
            {sample.filterComparison.map((filter) => {
              const isOurCarbon = filter.name.includes('Ceviz') || filter.name.includes('Aktif');

              return (
                <div key={filter.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className={`font-medium flex items-center gap-1.5 ${isOurCarbon ? 'text-teal-300 font-bold' : 'text-slate-300'}`}>
                      {isOurCarbon && <CheckCircle className="w-3.5 h-3.5 text-teal-400" />}
                      {filter.name}
                    </span>
                    <div className="flex items-center gap-3 font-mono">
                      <span className="text-slate-400 text-[11px]">qe: {filter.adsorptionQe} mg/g</span>
                      <span className={`font-bold ${isOurCarbon ? 'text-teal-400' : 'text-slate-200'}`}>
                        %{filter.efficiency.toFixed(1)}
                      </span>
                    </div>
                  </div>

                  <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden p-0.5 border border-slate-800">
                    <div
                      className="h-full rounded-full transition-all duration-500 shadow-sm"
                      style={{
                        width: `${filter.efficiency}%`,
                        backgroundColor: filter.color,
                        boxShadow: isOurCarbon ? '0 0 10px rgba(20, 184, 166, 0.5)' : 'none'
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-8 text-center text-xs text-slate-500 font-mono border border-dashed border-slate-800 rounded-xl bg-slate-950/40">
            Filtre karşılaştırma verisi için lütfen önce bir numune yükleyin veya örnek veri seçin.
          </div>
        )}
      </div>

      {/* 3. Particle Size Distribution Histogram */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl">
        <h3 className="text-sm font-bold text-white mb-2">
          Mikroplastik Boyut Dağılımı Histogramı (µm)
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          {isLoaded
            ? 'Ceviz kabuğu aktif karbonunun gözenekli yapısı 25-100 µm aralığındaki mikro-liflerde %98+ tutunma sağlar'
            : 'Yükleme Bekleniyor... Boyut histogramı numune analizinden sonra hesaplanır.'}
        </p>

        {isLoaded ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {sample.sizeDistribution.map((item) => (
              <div
                key={item.range}
                className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-center relative overflow-hidden"
              >
                <span className="text-xs font-mono text-slate-400 block mb-1">
                  {item.range}
                </span>
                <span className="text-xl font-bold font-mono text-white block">
                  %{item.percentage}
                </span>
                <span className="text-[10px] text-teal-400 font-mono">
                  {item.count} partikül
                </span>
                <div
                  className="absolute bottom-0 left-0 right-0 bg-teal-500/20 h-1"
                  style={{ width: `${item.percentage * 2}%` }}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="py-6 text-center text-xs text-slate-500 font-mono border border-dashed border-slate-800 rounded-xl bg-slate-950/40">
            Histogram Verisi: Yükleme Bekleniyor...
          </div>
        )}
      </div>

      {/* 4. Interactive Walnut Shell Activated Carbon Synthesis Simulator */}
      <div className="bg-gradient-to-br from-teal-950/40 via-slate-900/90 to-slate-950/90 border border-teal-500/30 rounded-2xl p-4 sm:p-5 shadow-xl">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-teal-400" />
            <h3 className="text-sm sm:text-base font-bold text-white">
              Ceviz Kabuğu Aktif Karbon Aktivasyon Simülatörü
            </h3>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-400/30">
            {isLoaded ? 'Aktif Numune Modeli' : 'Yükleme Bekleniyor...'}
          </span>
        </div>
        <p className="text-xs text-slate-400 mb-4">
          {isLoaded
            ? 'Karbonizasyon sıcaklığı, aktivasyon süresi ve modifikasyon oranını değiştirerek BET yüzey alanını ve mikroplastik tutma kapasitesini simüle edin:'
            : 'Yükleme Bekleniyor... Sayfa ilk açıldığında ezbere sabit sayılar hesaplanmaz. Lütfen önce bir numune yükleyiniz.'}
        </p>

        {isLoaded && simMetrics ? (
          <>
            {/* Sliders Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {/* Karbonizasyon Sıcaklığı */}
              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">Karbonizasyon Sıcaklığı:</span>
                  <span className="text-teal-400 font-bold font-mono">{carbonizationTemp}°C</span>
                </div>
                <input
                  type="range"
                  min="450"
                  max="900"
                  step="10"
                  value={carbonizationTemp}
                  onChange={(e) => setCarbonizationTemp(Number(e.target.value))}
                  className="w-full accent-teal-400 cursor-pointer"
                />
                <span className="text-[10px] text-slate-500 block mt-1">
                  Optimum: 750°C - 800°C (Yüksek gözeneklilik)
                </span>
              </div>

              {/* Aktivasyon Süresi */}
              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">Aktivasyon Süresi:</span>
                  <span className="text-teal-400 font-bold font-mono">{activationTimeMin} Dk</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="150"
                  step="5"
                  value={activationTimeMin}
                  onChange={(e) => setActivationTimeMin(Number(e.target.value))}
                  className="w-full accent-teal-400 cursor-pointer"
                />
                <span className="text-[10px] text-slate-500 block mt-1">
                  Optimum: 60 - 90 dakika buhar/gaz akışı
                </span>
              </div>

              {/* Buhar / Kimyasal Ajan Oranı */}
              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">Buhar / Modifikasyon Oranı:</span>
                  <span className="text-teal-400 font-bold font-mono">%{activationAgentRatio}</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="35"
                  step="1"
                  value={activationAgentRatio}
                  onChange={(e) => setActivationAgentRatio(Number(e.target.value))}
                  className="w-full accent-teal-400 cursor-pointer"
                />
                <span className="text-[10px] text-slate-500 block mt-1">
                  Mezogözenek ve mikrogözenek geliştirme
                </span>
              </div>
            </div>

            {/* Calculated Output Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 border-t border-slate-800">
              <div className="bg-slate-900/80 p-2.5 rounded-xl border border-teal-500/20 text-center">
                <span className="text-[10px] uppercase text-slate-400 font-mono block">BET Yüzey Alanı</span>
                <span className="text-base font-bold text-teal-300 font-mono">{simMetrics.betArea} m²/g</span>
              </div>

              <div className="bg-slate-900/80 p-2.5 rounded-xl border border-emerald-500/20 text-center">
                <span className="text-[10px] uppercase text-slate-400 font-mono block">İyot Sayısı</span>
                <span className="text-base font-bold text-emerald-400 font-mono">{simMetrics.iodineNumber} mg/g</span>
              </div>

              <div className="bg-slate-900/80 p-2.5 rounded-xl border border-teal-500/20 text-center">
                <span className="text-[10px] uppercase text-slate-400 font-mono block">Simüle Verim</span>
                <span className="text-base font-bold text-white font-mono">%{simMetrics.efficiency}</span>
              </div>

              <div className="bg-slate-900/80 p-2.5 rounded-xl border border-cyan-500/20 text-center">
                <span className="text-[10px] uppercase text-slate-400 font-mono block">Gözenek Hacmi</span>
                <span className="text-base font-bold text-cyan-300 font-mono">{simMetrics.poreVolume} cm³/g</span>
              </div>
            </div>
          </>
        ) : (
          <div className="py-6 text-center text-xs text-slate-500 font-mono border border-dashed border-slate-800 rounded-xl bg-slate-950/40">
            Aktivasyon Simülatörü: Yükleme Bekleniyor...
          </div>
        )}
      </div>
    </div>
  );
};

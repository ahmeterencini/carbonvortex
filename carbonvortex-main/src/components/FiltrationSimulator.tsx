import React, { useState, useEffect } from 'react';
import {
  Filter,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Sparkles,
  Layers,
  Info,
  ArrowRight,
  Droplets,
  Activity,
  Sliders,
  Gauge,
  Upload,
  FlaskConical,
  Clock
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SampleData } from '../types';

interface FiltrationSimulatorProps {
  sample: SampleData | null;
  onGoToReport: () => void;
  onGoToUpload?: () => void;
  onLoadDemoSample?: () => void;
}

export const FiltrationSimulator: React.FC<FiltrationSimulatorProps> = ({
  sample,
  onGoToReport,
  onGoToUpload,
  onLoadDemoSample,
}) => {
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<'column' | 'microPores'>('column');
  const [filteredVolumeMl, setFilteredVolumeMl] = useState<number>(sample ? 140 : 0);
  const [bedSaturation, setBedSaturation] = useState<number>(sample ? 38 : 0);
  const [flowRate, setFlowRate] = useState<number>(35); // mL/min

  // Particles passing through column / pores
  const [particles, setParticles] = useState(() => {
    if (!sample || !sample.particles || sample.particles.length === 0) {
      return [];
    }
    return sample.particles.map((p, i) => ({
      id: i,
      x: Math.max(15, Math.min(85, p.x)),
      y: Math.random() * 80,
      speed: 0.6 + Math.random() * 0.8,
      size: Math.max(4, Math.min(10, (p.sizeMicrons || 35) / 8)),
      type: p.type,
      color: p.color || '#ec4899',
      trapped: false,
    }));
  });

  // Keep particles in sync when sample changes
  useEffect(() => {
    if (sample && sample.particles) {
      setParticles(
        sample.particles.map((p, i) => ({
          id: i,
          x: Math.max(15, Math.min(85, p.x)),
          y: Math.random() * 75,
          speed: 0.6 + Math.random() * 0.8,
          size: Math.max(4, Math.min(10, (p.sizeMicrons || 35) / 8)),
          type: p.type,
          color: p.color || '#ec4899',
          trapped: false,
        }))
      );
      setFilteredVolumeMl(120);
      setBedSaturation(32);
    } else {
      setParticles([]);
      setFilteredVolumeMl(0);
      setBedSaturation(0);
    }
  }, [sample]);

  // Simulation tick loop
  useEffect(() => {
    let interval: any;
    if (isRunning && sample) {
      interval = setInterval(() => {
        setFilteredVolumeMl((prev) => {
          const next = prev + Math.round(flowRate / 10);
          return next > 1000 ? 1000 : next;
        });

        setBedSaturation((prev) => {
          if (prev >= 98) return 98;
          return +(prev + 0.15).toFixed(1);
        });

        // Move particles downward
        setParticles((prevParticles) =>
          prevParticles.map((p) => {
            // Once particle hits the active carbon bed (y between 38% and 68%), it gets trapped in pores!
            if (p.y > 38 && p.y < 70 && !p.trapped && Math.random() < 0.28) {
              return { ...p, trapped: true };
            }

            if (p.trapped) {
              return p; // Trapped in active carbon pore
            }

            let nextY = p.y + p.speed;
            if (nextY > 92) {
              // Recycle particle to top
              return {
                ...p,
                y: 5 + Math.random() * 10,
                x: 18 + Math.random() * 64,
                trapped: false,
              };
            }
            return { ...p, y: nextY };
          })
        );
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isRunning, flowRate, sample]);

  const handleReset = () => {
    setFilteredVolumeMl(0);
    setBedSaturation(0);
    setParticles((prev) =>
      prev.map((p) => ({
        ...p,
        y: 10 + Math.random() * 25,
        trapped: false,
      }))
    );
  };

  const handleCompleteConfetti = () => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#14b8a6', '#10b981', '#38bdf8'],
    });
    onGoToReport();
  };

  const trappedCount = particles.filter((p) => p.trapped).length;
  const trappedPercentage =
    particles.length > 0 ? Math.round((trappedCount / particles.length) * 100) : 0;

  if (!sample) {
    return (
      <div className="space-y-5 pb-20">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-8 sm:p-12 text-center shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 mx-auto mb-4">
            <Filter className="w-8 h-8" />
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white mb-2">
            Süzülme & Gözenek Simülatörü İçin Numune Bekleniyor
          </h2>
          <p className="text-sm text-slate-400 max-w-md mx-auto mb-6">
            Atık ceviz kabuğu aktif karbon kolonunun su süzme ve gözenek adsorpsiyon dinamiklerini canlandırmak için lütfen bir fotoğraf yükleyiniz veya hazır test numunesini çalıştırınız.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            {onGoToUpload && (
              <button
                onClick={onGoToUpload}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-teal-500/20 transition"
              >
                <Upload className="w-4 h-4" />
                <span>Fotoğraf Yükle</span>
              </button>
            )}
            {onLoadDemoSample && (
              <button
                onClick={onLoadDemoSample}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-300 font-semibold text-xs flex items-center justify-center gap-2 border border-slate-700 transition"
              >
                <FlaskConical className="w-4 h-4 text-amber-400" />
                <span>Örnek Veri Yükle</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-20">
      {/* Title & Info Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1.5 rounded-lg bg-teal-500/10 border border-teal-500/30 text-teal-400">
                <Filter className="w-5 h-5" />
              </span>
              <h2 className="text-base sm:text-lg font-bold text-white">
                Atık Ceviz Kabuğu Aktif Karbon Filtrasyon Süreci
              </h2>
            </div>
            <p className="text-xs text-slate-400">
              Ceviz kabuğundan üretilen granüler aktif karbonun gözeneklerinde mikroplastik tutunma (adsorpsiyon) ve su süzülme dinamikleri
            </p>
          </div>

          {/* Mode Switcher Buttons */}
          <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800 text-xs font-medium self-start sm:self-auto">
            <button
              onClick={() => setViewMode('column')}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                viewMode === 'column'
                  ? 'bg-teal-500 text-slate-950 font-bold shadow-md shadow-teal-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Kolon Filtrasyonu</span>
            </button>
            <button
              onClick={() => setViewMode('microPores')}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                viewMode === 'microPores'
                  ? 'bg-teal-500 text-slate-950 font-bold shadow-md shadow-teal-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Gözenek Adsorpsiyonu (SEM)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl">
        {/* Real-time Status HUD */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4 text-xs font-mono">
          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase block">Anlık Süzülen Hacim</span>
            <span className="text-sm font-bold text-teal-400">{filteredVolumeMl} mL</span>
          </div>

          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase block">Yatak Doygunluk Oranı</span>
            <span className="text-sm font-bold text-amber-400">%{bedSaturation}</span>
          </div>

          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase block">Hesaplanan Arıtma Verimi</span>
            <span className="text-sm font-bold text-emerald-400">%{sample.efficiency.toFixed(1)}</span>
          </div>

          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase block">Gözenekte Hapsedilen</span>
            <span className="text-sm font-bold text-white">
              {trappedCount} / {particles.length} Lif (%{trappedPercentage})
            </span>
          </div>
        </div>

        {/* Viewport 1: Column Filtration Simulation */}
        {viewMode === 'column' ? (
          <div className="relative w-full aspect-[4/3] sm:aspect-[16/9] max-h-[460px] rounded-xl overflow-hidden border border-slate-700/80 bg-slate-950 shadow-inner flex flex-col justify-between">
            {/* Top Zone: Raw Polluted Water Inflow or Clean Water Inflow */}
            <div className={`h-24 bg-gradient-to-b flex items-start justify-between p-4 z-10 pointer-events-none ${
              sample.isDrinkable
                ? 'from-emerald-950/40 via-teal-950/20 to-transparent'
                : 'from-rose-950/40 via-amber-950/20 to-transparent'
            }`}>
              <div>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded border block w-max ${
                  sample.isDrinkable
                    ? 'text-emerald-300 bg-emerald-950/80 border-emerald-800/40'
                    : 'text-rose-300 bg-rose-950/80 border-rose-800/40'
                }`}>
                  {sample.isDrinkable ? 'GİRİŞ: Berrak Temiz Su (İçilmeye Uygun)' : 'GİRİŞ: Ham Kirli Su'}
                </span>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  {sample.isDrinkable
                    ? 'Mikroplastik Yoğunluğu: 0 adet/ml (Temiz Su)'
                    : `Mikroplastik Yoğunluğu: ${sample.initialConcentration} adet/ml`}
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-mono text-amber-300 bg-slate-900/90 px-2.5 py-1 rounded-lg border border-slate-800">
                <Droplets className="w-3.5 h-3.5 text-blue-400 animate-bounce" />
                <span>Giriş Bulanıklığı: {sample.turbidityBefore} NTU</span>
              </div>
            </div>

            {/* Middle Zone: Porous Walnut Shell Activated Carbon Bed */}
            <div className="relative h-44 border-y-2 border-teal-500/40 bg-[#091f24] overflow-hidden">
              {/* Subtle Carbon Granules Texture */}
              <div
                className="absolute inset-0 opacity-40"
                style={{
                  backgroundImage: `radial-gradient(circle at 10px 10px, rgba(20, 184, 166, 0.3) 2px, transparent 0), radial-gradient(circle at 25px 25px, rgba(16, 185, 129, 0.25) 3px, transparent 0)`,
                  backgroundSize: '36px 36px',
                }}
              />

              {/* Water filtration streams */}
              <div className="absolute inset-0 flex justify-around pointer-events-none opacity-20">
                <div className="w-0.5 h-full bg-teal-400 animate-pulse" />
                <div className="w-0.5 h-full bg-teal-400 animate-pulse" style={{ animationDelay: '0.4s' }} />
                <div className="w-0.5 h-full bg-teal-400 animate-pulse" style={{ animationDelay: '0.8s' }} />
                <div className="w-0.5 h-full bg-teal-400 animate-pulse" style={{ animationDelay: '0.2s' }} />
                <div className="w-0.5 h-full bg-teal-400 animate-pulse" style={{ animationDelay: '0.6s' }} />
              </div>

              {/* Carbon Bed Label */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="px-4 py-1.5 rounded-full bg-slate-950/85 border border-teal-500/50 backdrop-blur-md text-center shadow-lg">
                  <span className="text-xs font-bold text-teal-300 font-mono flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-teal-400" />
                    Atık Ceviz Kabuğu Granüler Aktif Karbon (GAC) Yatağı
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono block">
                    Mezogözenek Adsorpsiyonu (BET: ~{sample.betSurfaceArea || 950} m²/g)
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Zone: Purified Clean Water Outflow */}
            <div className="h-24 bg-gradient-to-t from-teal-950/60 to-transparent flex items-end justify-between p-4 z-10 pointer-events-none">
              <div>
                <span className="text-[10px] font-mono text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/40 block w-max">
                  {sample.isDrinkable ? 'ÇIKIŞ: Güvenli İçme Suyu Kalitesi' : 'ÇIKIŞ: Süzülmüş Berrak Su'}
                </span>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  {sample.isDrinkable
                    ? 'Temiz su numunesi; DSÖ ve Sağlık Bakanlığı standartlarına tam uygundur.'
                    : `Mikroplastiklerden %${sample.efficiency.toFixed(1)} Arındırıldı (${sample.treatedConcentration} adet/ml kaldı)`}
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-400 bg-emerald-950/90 px-2.5 py-1 rounded-lg border border-emerald-700/60">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Çıkış Bulanıklığı: {sample.turbidityAfter} NTU</span>
              </div>
            </div>

            {/* Flowing Particles */}
            {particles.map((p) => (
              <div
                key={p.id}
                style={{
                  left: `${p.x}%`,
                  top: `${p.y}%`,
                  width: `${p.size}px`,
                  height: `${p.size}px`,
                  backgroundColor: p.color,
                }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full transition-transform duration-100 ${
                  p.trapped
                    ? 'ring-2 ring-white/90 scale-125 z-20 shadow-[0_0_8px_#2dd4bf]'
                    : 'opacity-90 shadow-sm'
                }`}
              >
                {p.trapped && (
                  <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[9px] font-bold text-teal-300 bg-slate-950/90 px-1 rounded pointer-events-none whitespace-nowrap">
                    {p.type} Tutuldu
                  </span>
                )}
              </div>
            ))}
          </div>
        ) : (
          /* Viewport 2: Microscopic Pore Adsorption (SEM Close-Up) */
          <div className="relative w-full aspect-[4/3] sm:aspect-[16/9] max-h-[460px] rounded-xl overflow-hidden border border-slate-700/80 bg-[#051119] shadow-inner p-6 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-lg text-xs font-mono text-teal-300">
                50.000x Taramalı Elektron Mikroskobu (SEM)
              </div>
              <div className="text-[11px] font-mono text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded border border-emerald-800/40">
                Gözenek Boyutu Dağılımı: 1.8 nm - 28 nm
              </div>
            </div>

            {/* Schematic Carbon Pore Cavities */}
            <div className="relative flex-1 my-4 flex items-center justify-center">
              {/* Outer Carbon Skeletal Matrix */}
              <div className="w-72 h-72 sm:w-88 sm:h-88 rounded-full border-4 border-dashed border-teal-500/40 relative flex items-center justify-center bg-teal-950/10">
                <div className="absolute inset-4 rounded-full border-2 border-slate-700/80 flex items-center justify-center bg-slate-950/80">
                  {/* Central Adsorption Pore */}
                  <div className="w-36 h-36 rounded-2xl bg-slate-900/90 border-2 border-teal-400/60 p-3 shadow-[0_0_25px_rgba(20,184,166,0.25)] flex flex-col items-center justify-center text-center">
                    <span className="text-xs font-bold text-teal-300 font-mono">
                      Aktif Gözenek Kafesi
                    </span>
                    <span className="text-[10px] text-slate-400 mt-1">
                      π-π Aromatik Etkileşim & Hidrofobik Bağ
                    </span>

                    {/* Trapped PET Fiber Inside Pore */}
                    <div className="mt-2 px-2.5 py-1 rounded bg-rose-950/80 border border-rose-500/50 text-[10px] font-bold text-rose-300 animate-pulse">
                      PET Lif Hapsedildi
                    </div>
                  </div>
                </div>

                {/* Satellite Mesopores */}
                <div className="absolute -top-3 left-1/4 px-2 py-1 rounded bg-slate-900 border border-teal-500/40 text-[10px] font-mono text-amber-300">
                  PP Elyaf Tutunması
                </div>
                <div className="absolute -bottom-3 right-1/4 px-2 py-1 rounded bg-slate-900 border border-teal-500/40 text-[10px] font-mono text-cyan-300">
                  PE Parçacığı (Adsorbe)
                </div>
              </div>
            </div>

            <div className="text-center text-xs text-slate-400 font-mono">
              Sitrik asit ve buharla modifiye edilen ceviz kabuğunda açılan mikrogözenekler mikroplastik moleküllerini kilitler.
            </div>
          </div>
        )}

        {/* Dynamic Controls: Flow Rate Slider & Flow Controls */}
        <div className="mt-4 pt-4 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
          <div>
            <div className="flex justify-between text-xs font-mono text-slate-300 mb-1.5">
              <span className="flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-teal-400" />
                Kolon Akış Hızı (Debi):
              </span>
              <span className="text-teal-400 font-bold">{flowRate} mL/dk</span>
            </div>
            <input
              type="range"
              min="10"
              max="70"
              step="5"
              value={flowRate}
              onChange={(e) => setFlowRate(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-400"
            />
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3 text-xs font-mono">
            <span className="text-slate-400">Yatak Temas Süresi:</span>
            <span className="font-bold text-teal-300 bg-slate-950 px-2.5 py-1 rounded border border-slate-800">
              {(1200 / flowRate).toFixed(1)} saniye
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-4">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition shadow-lg ${
              isRunning
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
                : 'bg-teal-500 hover:bg-teal-400 text-slate-950 shadow-teal-500/20'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-4 h-4" />
                <span>Akışı Duraklat</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>Süzülmeyi Başlat</span>
              </>
            )}
          </button>

          <button
            onClick={handleReset}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs flex items-center justify-center gap-1.5 border border-slate-700 transition"
          >
            <RotateCcw className="w-4 h-4 text-slate-400" />
            <span>Sıfırla</span>
          </button>

          <button
            onClick={handleCompleteConfetti}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-600/30 transition"
          >
            <span>TÜBİTAK Raporunu Oluştur</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Scientific Principle Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl">
        <h3 className="text-xs font-bold uppercase tracking-wider text-teal-400 flex items-center gap-1.5 mb-2 font-mono">
          <Info className="w-4 h-4" />
          Atık Ceviz Kabuğu Aktif Karbonun Gözenekli Adsorpsiyon Mekanizması
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed">
          Tarımsal bir atık olan sert ceviz kabukları yüksek lignin içeriği sayesinde aktive edildiğinde olağanüstü geniş bir iç yüzey alanına (<strong>BET: ~{sample.betSurfaceArea || 950} m²/g</strong>) ve zengin <strong>mikrogözenek/mezogözenek</strong> dağılımına sahip olur. Su kolondan geçerken, mikroplastik parçacıkları hem fiziksel eleme ile gözenek kafeslerine takılır hem de aromatik karbon halkaları ile plastik polimer zincirleri arasında oluşan <strong>π-π etkileşimi</strong> ve <strong>hidrofobik çekim</strong> kuvvetleriyle kalıcı olarak hapsedilir.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-4 pt-3 border-t border-slate-800 text-xs font-mono">
          <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] uppercase text-slate-400 block">BET Yüzey Alanı</span>
            <span className="text-sm font-bold text-teal-300">~{sample.betSurfaceArea || 950} m²/g</span>
          </div>
          <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] uppercase text-slate-400 block">İyot Sayısı</span>
            <span className="text-sm font-bold text-emerald-400">{sample.iodineNumber || 1050} mg/g</span>
          </div>
          <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] uppercase text-slate-400 block">Gözenek Hacmi</span>
            <span className="text-sm font-bold text-cyan-300">0.68 cm³/g</span>
          </div>
          <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] uppercase text-slate-400 block">Temas Süresi (EBCT)</span>
            <span className="text-sm font-bold text-white">12.5 Dakika</span>
          </div>
        </div>
      </div>
    </div>
  );
};

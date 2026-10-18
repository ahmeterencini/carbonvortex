import React, { useState } from 'react';
import {
  Scan,
  Sparkles,
  Maximize2,
  Filter,
  CheckCircle2,
  AlertCircle,
  Eye,
  Info,
  RefreshCw,
  Cpu,
  Layers,
  ShieldCheck,
  Upload,
  FlaskConical,
  Columns,
  ArrowRight,
  Sliders,
  Settings2,
  TrendingDown,
  Check,
  AlertOctagon,
} from 'lucide-react';
import { SampleData, MicroplasticParticle } from '../types';
import { ParticleDetailModal } from './ParticleDetailModal';
import { CarbonParameters, DEFAULT_CARBON_PARAMS } from '../utils/adsorptionCalculator';

interface AnalysisViewProps {
  sample: SampleData | null;
  onNavigateToCharts: () => void;
  onNavigateToFiltration: () => void;
  onNavigateToComparison: () => void;
  onGoToUpload: () => void;
  onLoadDemoSample: () => void;
  onRescanAndRecalculate: (params: CarbonParameters) => void;
}

export const AnalysisView: React.FC<AnalysisViewProps> = ({
  sample,
  onNavigateToCharts,
  onNavigateToFiltration,
  onNavigateToComparison,
  onGoToUpload,
  onLoadDemoSample,
  onRescanAndRecalculate,
}) => {
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanProgress, setScanProgress] = useState<number>(100);
  const [selectedParticle, setSelectedParticle] = useState<MicroplasticParticle | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('ALL');
  const [showLaserGrid, setShowLaserGrid] = useState<boolean>(true);
  const [showLabels, setShowLabels] = useState<boolean>(true);
  const [scanViewMode, setScanViewMode] = useState<'before' | 'after'>('before');

  // Dynamic parameter tuning state
  const [showParamsPanel, setShowParamsPanel] = useState<boolean>(false);
  const [betSurfaceArea, setBetSurfaceArea] = useState<number>(sample?.betSurfaceArea || 950);
  const [flowRate, setFlowRate] = useState<number>(35);
  const [contactTime, setContactTime] = useState<number>(30);
  const [recalcNotice, setRecalcNotice] = useState<string | null>(null);

  // If no sample is loaded yet, display empty state
  if (!sample) {
    return (
      <div className="space-y-5 pb-20">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-8 sm:p-12 text-center shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 mx-auto mb-4">
            <Scan className="w-8 h-8" />
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white mb-2">
            Yapay Zeka Spektroskopi İçin Numune Bekleniyor
          </h2>
          <p className="text-sm text-slate-400 max-w-md mx-auto mb-6">
            Henüz analiz edilmiş bir su veya filtre fotoğrafı bulunmuyor. Lütfen cihazınızdan bir mikroskop görseli yükleyin veya hızlı test için örnek veri paketini yükleyin.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={onGoToUpload}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-teal-500/20 transition"
            >
              <Upload className="w-4 h-4" />
              <span>Görsel / Fotoğraf Yükle</span>
            </button>
            <button
              onClick={onLoadDemoSample}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-300 font-semibold text-xs flex items-center justify-center gap-2 border border-slate-700 transition"
            >
              <FlaskConical className="w-4 h-4 text-amber-400" />
              <span>Örnek Veri Yükle</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleStartRescan = () => {
    setIsScanning(true);
    setScanProgress(0);
    setRecalcNotice(null);

    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);

          // Perform real scientific dynamic recalculation with chosen parameters
          const activeParams: CarbonParameters = {
            betSurfaceArea: betSurfaceArea,
            iodineNumber: Math.round(betSurfaceArea * 1.1),
            contactTimeMinutes: contactTime,
            flowRateMlMin: flowRate,
            activationType: 'Atık Ceviz Kabuğu Aktif Karbon Filtresi (GAC)',
          };

          onRescanAndRecalculate(activeParams);

          setRecalcNotice(
            `Optik spektrum yeniden tarandı. BET ${betSurfaceArea} m²/g ve ${flowRate} mL/dk parametreleriyle arıtma verimi dinamik olarak güncellendi.`
          );

          setTimeout(() => {
            setRecalcNotice(null);
          }, 4500);

          return 100;
        }
        return prev + 6;
      });
    }, 60);
  };

  const filteredParticles = sample.particles.filter((p) => {
    if (activeFilter === 'ALL') return true;
    return p.type === activeFilter;
  });

  const polymerTypes = ['ALL', ...Array.from(new Set(sample.particles.map((p) => p.type)))];

  return (
    <div className="space-y-5 pb-20">
      {/* 1. Safe Water Potability Banner (Temiz ve İnsan Sağlığına Uygun Uyarısı) */}
      {sample.isDrinkable && (
        <div className="bg-gradient-to-r from-emerald-950/95 via-slate-900 to-teal-950/95 border-2 border-emerald-400 rounded-2xl p-4 sm:p-5 shadow-2xl animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-900/80 border border-emerald-400 flex items-center justify-center text-emerald-300 shrink-0">
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-md bg-emerald-600 text-white font-black text-xs tracking-wider uppercase flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    SU ANALİZ RAPORU: TEMİZ & İÇİLEBİLİR (İNSAN SAĞLIĞINA UYGUN)
                  </span>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-black/70 text-emerald-300 border border-emerald-700 font-bold">
                    Mikroplastik Durumu: TEMİZ (0 adet/ml)
                  </span>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-teal-300 border border-teal-700/60 font-bold">
                    ✓ Güvenli Tüketim
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-200 font-medium">
                  {sample.potabilityWarning ||
                    'Bu görselde berrak ve temiz su tespit edilmiştir. Spektroskopik taramada insan sağlığına zararlı mikroplastik parçacığı saptanmamıştır. Dünya Sağlık Örgütü (DSÖ) ve Sağlık Bakanlığı içme suyu standartlarına tam uygundur; güvenle tüketilebilir.'}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] font-mono text-emerald-300">
                  <span>• Bulanıklık: {sample.turbidityBefore} NTU (İçme Limiti &lt; 1.0 NTU)</span>
                  <span>• Tespit Edilen Mikroplastik: 0 adet/ml (Sıfır Risk)</span>
                  <span>• Sağlık Uygunluğu: İnsan Sağlığı İçin Tam Güvenli</span>
                </div>
              </div>
            </div>

            <button
              onClick={onNavigateToComparison}
              className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-950/60 whitespace-nowrap self-stretch sm:self-auto justify-center transition"
            >
              <Columns className="w-4 h-4" />
              <span>Kıyasla Sekmesine Git (2 Veri)</span>
            </button>
          </div>
        </div>
      )}

      {/* 2. Critical Potability Warning Banner (Kirli Su İçilemez Uyarısı) */}
      {!sample.isDrinkable && (
        <div className="bg-gradient-to-r from-rose-950 via-slate-900 to-rose-950 border-2 border-rose-500 rounded-2xl p-4 sm:p-5 shadow-2xl animate-pulse">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-900 border border-rose-400 flex items-center justify-center text-rose-300 shrink-0">
                <AlertOctagon className="w-6 h-6 animate-bounce" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-md bg-rose-600 text-white font-black text-xs tracking-wider uppercase">
                    🛑 SU ANALİZ RAPORU: KESİNLİKLE İÇİLEMEZ (TEHLİKELİ)
                  </span>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-black/70 text-rose-300 border border-rose-700 font-bold">
                    Mikroplastik Yoğunluğu: {sample.microplasticRiskLevel || 'AŞIRI YÜKSEK (KRİTİK)'}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-200 font-medium">
                  {sample.potabilityWarning ||
                    'Bu numunede yüksek konsantrasyonda mikroplastik parçacıkları, polimer lifleri ve su kirliliği tespit edilmiştir. Doğrudan tüketilmesi zehirlenme ve hücresel hasar riski taşır. DSÖ ve Sağlık Bakanlığı içme suyu standartlarına KESİNLİKLE UYGUN DEĞİLDİR.'}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] font-mono text-rose-300">
                  <span>• Bulanıklık: {sample.turbidityBefore} NTU (İçme limiti &lt; 1.0)</span>
                  <span>• Tespit Edilen: {sample.initialConcentration} adet/ml</span>
                  <span>• Sağlık Riski: Toksik & Kimyasal Kirlilik</span>
                </div>
              </div>
            </div>

            <button
              onClick={onNavigateToComparison}
              className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-rose-950/60 whitespace-nowrap self-stretch sm:self-auto justify-center transition"
            >
              <Columns className="w-4 h-4" />
              <span>Kıyasla Sekmesine Git (2 Veri)</span>
            </button>
          </div>
        </div>
      )}

      {/* HUD Telemetry Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-teal-500/10 border border-teal-500/30 text-teal-400">
                <Cpu className="w-4 h-4" />
              </span>
              <h2 className="text-base font-bold text-white">
                Yapay Zeka Spektroskopik Lazer Taraması
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Fourier Dönüşümlü Kızılötesi (FTIR) & Derin Öğrenme Görüntü İşleme Modülü
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
            {/* Active Carbon Parameters Toggle */}
            <button
              onClick={() => setShowParamsPanel(!showParamsPanel)}
              className={`px-3 py-1.5 rounded-xl border font-mono text-xs font-semibold flex items-center gap-1.5 transition ${
                showParamsPanel
                  ? 'bg-teal-500 text-slate-950 border-teal-400'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-600'
              }`}
            >
              <Settings2 className="w-3.5 h-3.5" />
              <span>Karbon Parametreleri</span>
            </button>

            {/* Yeniden Tara Button */}
            <button
              onClick={handleStartRescan}
              disabled={isScanning}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-bold font-mono text-xs flex items-center gap-1.5 shadow-md shadow-teal-500/20 transition disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
              <span>Yeniden Tara</span>
            </button>

            {/* Yeni Görsel Ekle Button */}
            <button
              onClick={onGoToUpload}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-300 border border-slate-700 hover:border-teal-500/50 font-mono text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <Upload className="w-3.5 h-3.5 text-teal-400" />
              <span>Yeni Görsel Ekle</span>
            </button>

            {/* Mode: Ham Su vs Arıtılmış Görünüm */}
            <div className="flex rounded-lg bg-slate-950 p-1 border border-slate-800 text-xs font-mono">
              <button
                onClick={() => setScanViewMode('before')}
                className={`px-2.5 py-1 rounded transition ${
                  scanViewMode === 'before'
                    ? 'bg-rose-950 text-rose-300 font-bold border border-rose-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Ham Su
              </button>
              <button
                onClick={() => setScanViewMode('after')}
                className={`px-2.5 py-1 rounded transition ${
                  scanViewMode === 'after'
                    ? 'bg-teal-950 text-teal-300 font-bold border border-teal-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Arıtılmış Su
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Parameter Tuning Drawer */}
        {showParamsPanel && (
          <div className="mt-4 pt-4 border-t border-slate-800 bg-slate-950/70 p-4 rounded-xl border border-slate-800/80 animate-in fade-in duration-200">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-teal-300 uppercase tracking-wider font-mono flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-teal-400" />
                Dinamik Aktif Karbon Adsorpsiyon Parametreleri
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                Değişiklik yapıldığında 'Yeniden Tara' butonuna basarak arıtma verimini sıfırdan hesaplayabilirsiniz.
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs font-mono">
              {/* BET Area */}
              <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                <div className="flex justify-between mb-1.5 text-slate-300">
                  <span>BET Yüzey Alanı:</span>
                  <span className="text-teal-400 font-bold">{betSurfaceArea} m²/g</span>
                </div>
                <div className="flex gap-1.5 mt-2">
                  {[800, 950, 1100].map((val) => (
                    <button
                      key={val}
                      onClick={() => setBetSurfaceArea(val)}
                      className={`flex-1 py-1 rounded text-[11px] font-bold border transition ${
                        betSurfaceArea === val
                          ? 'bg-teal-500 text-slate-950 border-teal-400'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      {val} m²
                    </button>
                  ))}
                </div>
              </div>

              {/* Flow Rate */}
              <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                <div className="flex justify-between mb-1.5 text-slate-300">
                  <span>Kolon Akış Debisi:</span>
                  <span className="text-emerald-400 font-bold">{flowRate} mL/dk</span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="65"
                  step="5"
                  value={flowRate}
                  onChange={(e) => setFlowRate(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded appearance-none cursor-pointer accent-teal-400 mt-2"
                />
              </div>

              {/* Contact Time */}
              <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                <div className="flex justify-between mb-1.5 text-slate-300">
                  <span>Temas Süresi (EBCT):</span>
                  <span className="text-cyan-400 font-bold">{contactTime} dk</span>
                </div>
                <div className="flex gap-1.5 mt-2">
                  {[15, 30, 45].map((val) => (
                    <button
                      key={val}
                      onClick={() => setContactTime(val)}
                      className={`flex-1 py-1 rounded text-[11px] font-bold border transition ${
                        contactTime === val
                          ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      {val} dk
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Dynamic Calculation Notice Banner */}
        {recalcNotice && (
          <div className="mt-3 p-2.5 rounded-xl bg-teal-950/80 border border-teal-500/50 text-teal-300 text-xs font-mono flex items-center gap-2 animate-in fade-in duration-150">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{recalcNotice}</span>
          </div>
        )}

        {/* Scanning progress bar if scanning */}
        {isScanning && (
          <div className="mt-3">
            <div className="flex justify-between text-[11px] font-mono text-teal-400 mb-1">
              <span>Lazer Taraması, Polimer Ayrışımı & Adsorpsiyon Dinamiği Hesaplanıyor</span>
              <span>%{scanProgress}</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-teal-400 to-emerald-400 h-full transition-all duration-100 shadow-[0_0_8px_#2dd4bf]"
                style={{ width: `${scanProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Main Interactive Scanning Viewport */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl">
        <div className="flex items-center justify-between mb-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-300 font-medium">
              Görüntü Alanı: {scanViewMode === 'before' ? 'Arıtılmamış Su (Öncesi)' : 'Aktif Karbon Arıtımlı Su (Sonrası)'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowLaserGrid(!showLaserGrid)}
              className={`px-2 py-1 rounded text-[11px] font-mono border transition ${
                showLaserGrid
                  ? 'bg-teal-950 text-teal-300 border-teal-500/40'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              Izgara {showLaserGrid ? 'Açık' : 'Kapalı'}
            </button>
            <button
              onClick={() => setShowLabels(!showLabels)}
              className={`px-2 py-1 rounded text-[11px] font-mono border transition ${
                showLabels
                  ? 'bg-teal-950 text-teal-300 border-teal-500/40'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              Etiketler {showLabels ? 'Açık' : 'Kapalı'}
            </button>
          </div>
        </div>

        {/* Interactive Viewport Frame */}
        <div className="relative w-full aspect-[4/3] sm:aspect-[16/9] max-h-[460px] rounded-xl overflow-hidden border border-slate-700/80 bg-black select-none">
          {/* Base microscope image */}
          <img
            src={scanViewMode === 'before' ? sample.beforeImage : sample.afterImage}
            alt="Mikroskop Görüntüsü"
            className="w-full h-full object-cover"
          />

          {/* Laser Scanning Line Animation */}
          {isScanning && (
            <div className="absolute inset-0 pointer-events-none">
              <div
                className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-teal-400 to-transparent shadow-[0_0_15px_#2dd4bf] z-30 animate-scan-line"
              />
              <div className="absolute inset-0 bg-teal-500/10 pointer-events-none" />
            </div>
          )}

          {/* HUD Overlay Graphics */}
          {showLaserGrid && (
            <div className="absolute inset-0 pointer-events-none border border-teal-500/20">
              {/* Corner crosshairs */}
              <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-teal-400/80" />
              <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-teal-400/80" />
              <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-teal-400/80" />
              <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-teal-400/80" />

              {/* Optical center circle */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-24 h-24 sm:w-36 sm:h-36 rounded-full border border-teal-400/20 border-dashed animate-spin" style={{ animationDuration: '30s' }} />
              </div>
            </div>
          )}

          {/* Detected Particle Bounding Boxes & Tags (Only for detected particles) */}
          {scanViewMode === 'before' &&
            filteredParticles.map((particle) => {
              const isHovered = selectedParticle?.id === particle.id;

              return (
                <div
                  key={particle.id}
                  onClick={() => setSelectedParticle(particle)}
                  style={{
                    left: `${particle.x}%`,
                    top: `${particle.y}%`,
                  }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 group transition-transform ${
                    isHovered ? 'scale-125 z-30' : 'hover:scale-110'
                  }`}
                >
                  {/* Glowing Reticle Target */}
                  <div className="relative flex items-center justify-center">
                    <span
                      className="absolute w-7 h-7 rounded-full opacity-60 animate-ping pointer-events-none"
                      style={{ backgroundColor: particle.color }}
                    />
                    <span
                      className="w-4 h-4 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-[8px] font-bold text-white font-mono"
                      style={{ backgroundColor: particle.color }}
                    >
                      •
                    </span>
                  </div>

                  {/* Dynamic On-Image Tag Overlay */}
                  {showLabels && (
                    <div className="absolute top-5 left-1/2 -translate-x-1/2 pointer-events-none whitespace-nowrap">
                      <div className="px-2 py-0.5 rounded-md bg-slate-950/90 border border-slate-700/80 text-[10px] font-mono font-bold text-white shadow-xl flex items-center gap-1 backdrop-blur-md">
                        <span
                          className="w-2 h-2 rounded-full inline-block"
                          style={{ backgroundColor: particle.color }}
                        />
                        <span>{particle.customLabel || particle.type}</span>
                        <span className="text-slate-400 text-[9px] font-normal">
                          {particle.sizeMicrons.toFixed(0)}µm
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

          {/* Bottom telemetry on canvas */}
          <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between pointer-events-none text-[10px] font-mono text-slate-300 bg-slate-950/80 px-3 py-1.5 rounded-lg border border-slate-800 backdrop-blur-sm">
            <span>
              {sample.isDrinkable
                ? `Numune: ✅ Berrak ve Temiz Su • 0 Mikroplastik • İnsan Sağlığına Uygun & İçilebilir`
                : scanViewMode === 'before'
                ? `Tespit Edilen: ${sample.particles.length} Polimer Parçacığı • Konsantrasyon: ${sample.initialConcentration} adet/ml`
                : `Aktif Karbon Süzüntüsü • Kalan: ${sample.treatedConcentration} adet/ml (Verim: %${sample.efficiency.toFixed(1)})`}
            </span>
            <span className="text-emerald-400">
              {sample.isDrinkable ? 'Bulanıklık: ' + sample.turbidityBefore + ' NTU (Saf)' : `FTIR Optik Modülü • BET ~${sample.betSurfaceArea || 950} m²/g`}
            </span>
          </div>
        </div>
      </div>

      {/* Polymer Filter Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-300 font-mono flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-teal-400" />
            Polimer Türü Filtresi
          </span>
          <span className="text-[11px] text-slate-400 font-mono">
            Toplam: {sample.particles.length} Lif/Parçacık
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {polymerTypes.map((type) => {
            const isSelected = activeFilter === type;
            const count =
              type === 'ALL'
                ? sample.particles.length
                : sample.particles.filter((p) => p.type === type).length;

            return (
              <button
                key={type}
                onClick={() => setActiveFilter(type)}
                className={`px-3 py-1 rounded-xl text-xs font-mono font-medium border transition flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-teal-500 text-slate-950 font-bold border-teal-400 shadow-md shadow-teal-500/20'
                    : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                }`}
              >
                <span>{type}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isSelected ? 'bg-slate-900 text-teal-300' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Detected Particles Inventory */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl">
        <h3 className="text-sm font-bold text-white mb-3 flex items-center justify-between">
          <span>Tespit Edilen Mikroplastik Envanteri</span>
          <span className="text-xs font-normal text-slate-400">Detay için partiküle tıklayın</span>
        </h3>

        {filteredParticles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {filteredParticles.map((particle) => (
              <div
                key={particle.id}
                onClick={() => setSelectedParticle(particle)}
                className="p-3 rounded-xl bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800/80 hover:border-teal-500/50 cursor-pointer transition flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-3 h-3 rounded-full shrink-0 group-hover:scale-125 transition"
                    style={{ backgroundColor: particle.color }}
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-white font-mono">{particle.customLabel || particle.type}</span>
                      <span className="text-[10px] text-slate-400">({particle.shape})</span>
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      Boyut: {particle.sizeMicrons.toFixed(1)} µm • Güven: %{Math.round(particle.confidence * 100)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  {particle.capturedByBiochar ? (
                    <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/50">
                      Filtrelendi
                    </span>
                  ) : (
                    <span className="text-[10px] font-semibold text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800/50">
                      Serbest
                    </span>
                  )}
                  <Info className="w-3.5 h-3.5 text-slate-500 group-hover:text-teal-400 transition" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center text-xs font-mono border border-dashed border-emerald-500/40 rounded-xl bg-emerald-950/20 text-emerald-300 flex flex-col items-center justify-center gap-2">
            <ShieldCheck className="w-8 h-8 text-emerald-400" />
            <p className="text-sm font-bold text-emerald-200">
              Bu numunede hiçbir serbest mikroplastik partikülü saptanmamıştır!
            </p>
            <p className="text-slate-300 max-w-md text-[11px]">
              Görsel spektroskopik optik tarama sonucunda numune berrak, temiz ve içilebilir bulunmuştur. İnsan sağlığı için tamamen güvenli ve uygundur.
            </p>
          </div>
        )}
      </div>

      {/* Quick Navigation Footers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        <button
          onClick={onNavigateToComparison}
          className="py-3.5 px-4 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-teal-500/25 transition"
        >
          <Columns className="w-4 h-4" />
          <span>Arıtma Öncesi / Sonrası Karşılaştırmaya Geç</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          onClick={onNavigateToFiltration}
          className="py-3.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-300 font-semibold text-xs flex items-center justify-center gap-2 border border-slate-700 transition"
        >
          <Layers className="w-4 h-4" />
          <span>Süzülme & Gözenek Adsorpsiyonunu İncele</span>
        </button>
      </div>

      {/* Selected Particle Modal */}
      <ParticleDetailModal
        particle={selectedParticle}
        onClose={() => setSelectedParticle(null)}
      />
    </div>
  );
};

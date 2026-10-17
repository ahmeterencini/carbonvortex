import React, { useState, useRef } from 'react';
import {
  Upload,
  Camera,
  Image as ImageIcon,
  ArrowRight,
  Sliders,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Sparkles,
  Eye,
  FlaskConical,
  FileCheck2,
  Cpu
} from 'lucide-react';
import { SampleData } from '../types';

interface UploadViewProps {
  currentSample: SampleData | null;
  onCustomImageUploaded: (file: File) => void;
  onLoadDemoSample: () => void;
  onStartAnalysis: () => void;
  onResetSample?: () => void;
  isAnalyzing: boolean;
  analysisProgress: number;
  analysisStep: string;
}

export const UploadView: React.FC<UploadViewProps> = ({
  currentSample,
  onCustomImageUploaded,
  onLoadDemoSample,
  onStartAnalysis,
  onResetSample,
  isAnalyzing,
  analysisProgress,
  analysisStep
}) => {
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSliderMove = (clientX: number, containerRect: DOMRect) => {
    const offsetX = clientX - containerRect.left;
    const percentage = Math.max(0, Math.min(100, (offsetX / containerRect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onCustomImageUploaded(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onCustomImageUploaded(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-5 pb-20">
      {/* Real-time Analysis Progress Modal/Overlay */}
      {isAnalyzing && (
        <div className="bg-gradient-to-br from-slate-900 via-teal-950/70 to-slate-950 border-2 border-teal-500/70 rounded-2xl p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-300">
                <Cpu className="w-5 h-5 animate-spin" style={{ animationDuration: '4s' }} />
              </div>
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  Gerçek Zamanlı AI Analiz Simülasyonu Çalışıyor
                </h3>
                <p className="text-xs text-slate-300 font-mono mt-0.5">
                  {analysisStep}
                </p>
              </div>
            </div>
            <span className="text-lg font-mono font-extrabold text-teal-400">
              %{analysisProgress}
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden p-0.5 border border-slate-800">
            <div
              className="bg-gradient-to-r from-teal-400 via-emerald-400 to-teal-400 h-full rounded-full transition-all duration-150 shadow-[0_0_12px_#2dd4bf]"
              style={{ width: `${analysisProgress}%` }}
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 text-[11px] font-mono">
            <div className={`p-2 rounded-lg border transition ${analysisProgress >= 25 ? 'bg-teal-950/80 border-teal-500/50 text-teal-300' : 'bg-slate-950/50 border-slate-800 text-slate-500'}`}>
              ✓ Piksel Matrisi
            </div>
            <div className={`p-2 rounded-lg border transition ${analysisProgress >= 55 ? 'bg-teal-950/80 border-teal-500/50 text-teal-300' : 'bg-slate-950/50 border-slate-800 text-slate-500'}`}>
              ✓ FTIR Lazer Tarama
            </div>
            <div className={`p-2 rounded-lg border transition ${analysisProgress >= 85 ? 'bg-teal-950/80 border-teal-500/50 text-teal-300' : 'bg-slate-950/50 border-slate-800 text-slate-500'}`}>
              ✓ Polimer Etiketleme
            </div>
            <div className={`p-2 rounded-lg border transition ${analysisProgress >= 100 ? 'bg-teal-950/80 border-teal-500/50 text-teal-300' : 'bg-slate-950/50 border-slate-800 text-slate-500'}`}>
              ✓ Kinetik Hesabı
            </div>
          </div>
        </div>
      )}

      {/* When sample is loaded, provide an explicit, prominent 'Yeni Görsel Ekle' bar */}
      {currentSample && (
        <div className="bg-gradient-to-r from-teal-950/70 via-slate-900 to-teal-950/70 border-2 border-teal-500/70 rounded-2xl p-4 sm:p-5 shadow-xl animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/50 flex items-center justify-center text-teal-300 shrink-0 mt-0.5 sm:mt-0">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-1.5">
                    Yeni Görsel Ekle / Farklı Numune Yükle
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700/60 font-semibold">
                    ✓ Numune Yüklü
                  </span>
                </div>
                <p className="text-xs text-slate-300 max-w-xl">
                  Mevcut görsel yerine farklı bir su veya mikroskop fotoğrafı yükleyebilir, yeni bir numuneyi baştan tarayabilir veya mevcut analiz verilerini sıfırlayabilirsiniz.
                </p>
                <div className="mt-1 text-[11px] font-mono text-slate-400">
                  Şu anki görsel: <span className="text-teal-300 font-semibold">{currentSample.title}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto shrink-0">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-teal-500/25 transition"
              >
                <Upload className="w-4 h-4" />
                <span>Yeni Görsel Seç</span>
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-center gap-1.5 border border-slate-700 transition"
              >
                <Camera className="w-4 h-4 text-teal-400" />
                <span className="hidden sm:inline">Kamera</span>
              </button>
              {onResetSample && (
                <button
                  type="button"
                  onClick={onResetSample}
                  className="px-3 py-2.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/60 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                  title="Numuneyi ve sayaçları sıfırla"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Sıfırla</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Drag & Drop Upload Section (HERO) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-4">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <Upload className="w-5 h-5 text-teal-400" />
              {currentSample ? 'Görseli Değiştir veya Yeni Görsel Bırak' : 'Kendi Laboratuvar Numunenizi veya Fotoğrafınızı Yükleyin'}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Mikroskop, su bardağı veya filtre görseli yükleyin; yapay zeka FTIR optik tarama ve parçacık analizini gerçek zamanlı başlatsın.
            </p>
          </div>

          {currentSample && (
            <div className="flex items-center gap-1.5 self-start sm:self-auto text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-800/50">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Numune Yüklü: {currentSample.title.slice(0, 25)}...</span>
            </div>
          )}
        </div>

        {/* Drop Zone Box */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleFileDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-8 sm:p-10 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-teal-400 bg-teal-950/40 ring-4 ring-teal-500/20'
              : 'border-slate-700/80 hover:border-teal-500/60 bg-slate-950/60 hover:bg-slate-950/90'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/*"
            className="hidden"
          />

          <div className="flex flex-col items-center justify-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 group-hover:scale-110 transition shadow-inner">
              <Upload className="w-7 h-7" />
            </div>

            <div>
              <p className="text-base font-semibold text-slate-100">
                Görseli buraya sürükleyin veya <span className="text-teal-400 underline decoration-teal-400/50 hover:decoration-teal-300">dosya seçin</span>
              </p>
              <p className="text-xs text-slate-400 mt-1.5 max-w-md mx-auto">
                Mikroskop çekimi, su numunesi veya biyokütle filtre görseli (JPG, PNG, WEBP - Maks: 25MB)
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition shadow-sm"
              >
                <ImageIcon className="w-4 h-4 text-teal-400" />
                Galeriden Seç
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-900/50 hover:bg-teal-800/50 text-xs font-semibold text-teal-300 border border-teal-700/60 transition shadow-sm"
              >
                <Camera className="w-4 h-4 text-teal-400" />
                Kamera ile Çek
              </button>
            </div>
          </div>
        </div>

        {/* Demo Sample Loader Button (Explicitly requested by user) */}
        <div className="mt-4 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-950/40 p-3.5 rounded-xl border border-slate-800/60">
          <div className="flex items-center gap-2.5">
            <FlaskConical className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-slate-200">
                Fotoğrafınız Yok mu? Gerçekçi Laboratuvar Test Numunesi Yükleyin
              </h4>
              <p className="text-[11px] text-slate-400">
                Atık ceviz kabuğundan üretilen gözenekli aktif karbon filtresinin adsorpsiyon verisini simüle eder.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onLoadDemoSample}
            disabled={isAnalyzing}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-gradient-to-r from-teal-600/90 to-emerald-600/90 hover:from-teal-500 hover:to-emerald-500 disabled:opacity-50 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-teal-500/20 transition whitespace-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Örnek Veri Yükle</span>
          </button>
        </div>
      </div>

      {/* Dirty water potability alert */}
      {currentSample && !currentSample.isDrinkable && (
        <div className="bg-gradient-to-r from-rose-950 via-slate-900 to-rose-950 border-2 border-rose-500 rounded-2xl p-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-950 border border-rose-500 flex items-center justify-center text-rose-400 shrink-0">
              <AlertCircle className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase text-rose-300">
                  🛑 NUMUNE DURUMU: KESİNLİKLE İÇİLEMEZ
                </span>
                <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-black/60 text-rose-400 border border-rose-800">
                  {currentSample.microplasticRiskLevel || 'AŞIRI YÜKSEK MİKROPLASTİK'}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                {currentSample.potabilityWarning ||
                  'Bu görselde yoğun mikroplastik atıkları saptanmıştır. Tüketilmesi sağlık açısından tehlikelidir, içme suyuna uygun değildir.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Before / After Interactive Microscopic Split Slider */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Eye className="w-4 h-4 text-teal-400" />
              100x Mikroskopik Kıyaslama: Arıtma Öncesi vs Sonrası
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {currentSample
                ? 'İki durum arasındaki farkı incelemek için ortadaki ayırıcı çizgiyi sağa/sola sürükleyin'
                : 'Numune yüklendiğinde arıtma öncesi ve sonrası görüntüleri burada karşılaştırabilirsiniz.'}
            </p>
          </div>
          {currentSample && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-teal-950/80 hover:bg-teal-900 text-teal-300 border border-teal-700/60 text-xs font-semibold transition shadow-sm"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>+ Yeni Görsel Ekle</span>
              </button>
              <span className="text-[11px] font-mono text-slate-400 bg-slate-800/70 px-2 py-0.5 rounded hidden sm:inline-block">
                Slider: %{Math.round(sliderPosition)}
              </span>
            </div>
          )}
        </div>

        {currentSample ? (
          /* Loaded Split View Container */
          <div
            className="relative w-full aspect-[4/3] sm:aspect-[16/9] max-h-[380px] rounded-xl overflow-hidden border border-slate-700/80 select-none cursor-ew-resize bg-black shadow-inner"
            onMouseMove={(e) => {
              if (e.buttons === 1) {
                handleSliderMove(e.clientX, e.currentTarget.getBoundingClientRect());
              }
            }}
            onTouchMove={(e) => {
              if (e.touches[0]) {
                handleSliderMove(e.touches[0].clientX, e.currentTarget.getBoundingClientRect());
              }
            }}
            onClick={(e) => {
              handleSliderMove(e.clientX, e.currentTarget.getBoundingClientRect());
            }}
          >
            {/* After image (Base layer - treated clear water) */}
            <img
              src={currentSample.afterImage}
              alt="Arıtma Sonrası"
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Before image (Clipped layer - dirty untreated water) */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${sliderPosition}%` }}
            >
              <img
                src={currentSample.beforeImage}
                alt="Arıtma Öncesi"
                className="absolute inset-0 w-full h-full object-cover max-w-none"
                style={{
                  width: '100%',
                  height: '100%',
                }}
              />
            </div>

            {/* Divider line and handle */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-teal-400 shadow-[0_0_12px_#2dd4bf] z-20 flex items-center justify-center pointer-events-none"
              style={{ left: `calc(${sliderPosition}% - 2px)` }}
            >
              <div className="w-8 h-8 rounded-full bg-slate-900 border-2 border-teal-400 flex items-center justify-center shadow-lg text-teal-300">
                <Sliders className="w-4 h-4 rotate-90" />
              </div>
            </div>

            {/* Badges on left/right for clarity */}
            <div className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-md bg-rose-950/90 border border-rose-500/60 text-[11px] font-bold text-rose-300 backdrop-blur-sm pointer-events-none">
              ÖNCE: Ham Kirli Su (❌ İÇİLEMEZ)
            </div>
            <div className="absolute top-3 right-3 z-10 px-2.5 py-1 rounded-md bg-teal-950/90 border border-teal-500/60 text-[11px] font-bold text-teal-300 backdrop-blur-sm pointer-events-none">
              SONRA: Ceviz Kabuğu Aktif Karbon (Ön Arıtılmış)
            </div>

            <div className="absolute bottom-3 left-3 z-10 px-2.5 py-1 rounded-md bg-black/70 text-[11px] font-mono text-slate-300 backdrop-blur-sm pointer-events-none">
              Bulanıklık: {currentSample.turbidityBefore} NTU → {currentSample.turbidityAfter} NTU
            </div>
          </div>
        ) : (
          /* Empty Placeholder State */
          <div className="w-full aspect-[4/3] sm:aspect-[16/9] max-h-[300px] rounded-xl border border-dashed border-slate-800 bg-slate-950/60 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 mb-3">
              <Eye className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-slate-300">
              Mikroskopik Karşılaştırma İçin Numune Bekleniyor
            </p>
            <p className="text-xs text-slate-500 mt-1 max-w-sm">
              Yukarıdaki alandan fotoğraf yükleyin veya "Örnek Veri Yükle" butonuna tıklayarak arıtma öncesi/sonrası mikroskop analizini başlatın.
            </p>
          </div>
        )}
      </div>

      {/* Start AI Scan Button (If sample is loaded) */}
      {currentSample && (
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <button
            onClick={onStartAnalysis}
            className="flex-1 w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-teal-500 via-emerald-600 to-teal-500 text-slate-950 font-extrabold text-base tracking-wide flex items-center justify-center gap-2.5 shadow-xl shadow-teal-500/25 hover:shadow-teal-400/40 hover:scale-[1.01] active:scale-[0.99] transition duration-200"
          >
            <Sparkles className="w-5 h-5 animate-spin" style={{ animationDuration: '6s' }} />
            <span>Yapay Zeka Spektroskopi Ekranına Geç</span>
            <ArrowRight className="w-5 h-5 ml-1" />
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full sm:w-auto py-4 px-5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm flex items-center justify-center gap-2 border border-slate-700 transition shadow-lg shrink-0"
          >
            <Upload className="w-4 h-4 text-teal-400" />
            <span>+ Yeni Görsel Ekle</span>
          </button>
        </div>
      )}
    </div>
  );
};

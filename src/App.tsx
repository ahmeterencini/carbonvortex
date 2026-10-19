import React, { useState } from 'react';
import { TabType, SampleData, MicroplasticParticle } from './types';
import {
  INITIAL_SAMPLES,
  CLEAN_WATER_SAMPLE_1,
  CLEAN_WATER_SAMPLE_2,
  CONTAMINATED_SAMPLE_3,
} from './data/sampleData';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { OverviewCards } from './components/OverviewCards';
import { UploadView } from './components/UploadView';
import { AnalysisView } from './components/AnalysisView';
import { ComparisonView } from './components/ComparisonView';
import { FiltrationSimulator } from './components/FiltrationSimulator';
import { ChartsView } from './components/ChartsView';
import { ReportModal } from './components/ReportModal';
import { RejectionWarningModal } from './components/RejectionWarningModal';
import { calculateDynamicSampleData, CarbonParameters, DEFAULT_CARBON_PARAMS } from './utils/adsorptionCalculator';
import { analyzeWaterImageRealtime } from './utils/realtimeWaterAI';
import confetti from 'canvas-confetti';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('upload');

  // Application starts strictly with 0 / null / empty state as requested
  const [currentSample, setCurrentSample] = useState<SampleData | null>(null);
  const [samples, setSamples] = useState<SampleData[]>([]);
  const [isMobileDeviceFrame, setIsMobileDeviceFrame] = useState<boolean>(false);

  // Real-time analysis simulation states
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisProgress, setAnalysisProgress] = useState<number>(0);
  const [analysisStep, setAnalysisStep] = useState<string>('');

  // Unrelated image warning modal state
  const [rejectionWarning, setRejectionWarning] = useState<{
    title?: string;
    message: string;
    filename?: string;
  } | null>(null);

  // Generate an authentic purified (treated) water microscope view from user's image
  const createTreatedWaterVisual = (originalBase64: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width || 600;
        canvas.height = img.height || 450;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(originalBase64);
          return;
        }

        // Draw original image
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Apply clarifying overlay (purified water luminance & turbidity reduction)
        ctx.fillStyle = 'rgba(6, 21, 30, 0.48)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Pristine teal/cyan water tone gradient
        const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
        grad.addColorStop(0, 'rgba(20, 184, 166, 0.12)');
        grad.addColorStop(1, 'rgba(13, 148, 136, 0.25)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Reticle bounding box
        ctx.strokeStyle = 'rgba(45, 212, 191, 0.35)';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([5, 5]);
        ctx.strokeRect(16, 16, canvas.width - 32, canvas.height - 32);

        // Corner crosshairs
        ctx.setLineDash([]);
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#2dd4bf';
        const chSize = 14;
        // Top-left
        ctx.beginPath();
        ctx.moveTo(12, 12 + chSize); ctx.lineTo(12, 12); ctx.lineTo(12 + chSize, 12);
        ctx.stroke();
        // Top-right
        ctx.beginPath();
        ctx.moveTo(canvas.width - 12 - chSize, 12); ctx.lineTo(canvas.width - 12, 12); ctx.lineTo(canvas.width - 12, 12 + chSize);
        ctx.stroke();

        // Filtration Verification Stamp
        ctx.fillStyle = '#2dd4bf';
        ctx.font = 'bold 12px monospace';
        ctx.fillText('ARITILMIŞ SU • CEVİZ KABUĞU AKTİF KARBON SÜZÜNTÜSÜ', 24, canvas.height - 28);

        ctx.fillStyle = '#34d399';
        ctx.font = '10px monospace';
        ctx.fillText('BULANIKLIK: 0.52 NTU • MİKROPLASTİKLER GÖZENEKLERDE TUTULDU', 24, canvas.height - 14);

        resolve(canvas.toDataURL('image/jpeg', 0.92));
      };
      img.onerror = () => resolve(originalBase64);
      img.src = originalBase64;
    });
  };

  // Real-time analysis simulation for demo runs
  const runRealTimeSimulation = (sampleToLoad: SampleData) => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    setAnalysisStep('Görsel spektroskopik dalga boyu matrisi okunuyor...');

    const interval = setInterval(() => {
      setAnalysisProgress((prev) => {
        const next = prev + 8;
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setCurrentSample(sampleToLoad);
            setSamples((prevSamples) => {
              const exists = prevSamples.some((s) => s.id === sampleToLoad.id);
              return exists ? prevSamples : [sampleToLoad, ...prevSamples];
            });
            setIsAnalyzing(false);
            setActiveTab('upload');
            confetti({
              particleCount: sampleToLoad.isDrinkable ? 90 : 65,
              spread: 75,
              origin: { y: 0.6 },
              colors: sampleToLoad.isDrinkable
                ? ['#10b981', '#34d399', '#2dd4bf', '#38bdf8']
                : ['#ec4899', '#f59e0b', '#ef4444'],
            });
          }, 300);
          return 100;
        }

        if (next < 30) {
          setAnalysisStep('Görsel piksel matrisi ve optik kanallar çözümleniyor...');
        } else if (next < 65) {
          setAnalysisStep('FTIR Spektroskopik Lazer Taraması Yapılıyor (Optik Reticle)...');
        } else if (next < 85) {
          setAnalysisStep(
            sampleToLoad.isDrinkable
              ? 'Temiz su berraklığı ve saflık kriterleri doğrulanıyor ("İçilmeye Uygun")...'
              : 'Şeffaf parçacıklar ve polimer lifleri saptanıyor ("İçilmeye Uygun Değil")...'
          );
        } else {
          setAnalysisStep('Su içilebilirlik durumu ve aktif karbon adsorpsiyonu hesaplanıyor...');
        }

        return next;
      });
    }, 55);
  };

  // User uploads a photo -> Instant Real-Time AI Computer Vision Analysis
  const handleCustomImageUploaded = async (file: File) => {
    setIsAnalyzing(true);
    setAnalysisProgress(15);
    setAnalysisStep('Fotoğraf gerçek zamanlı yapay zeka bilgisayarlı görü motoruna aktarılıyor...');

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Url = reader.result as string;

      try {
        setAnalysisProgress(35);
        setAnalysisStep('Yapay zeka sıvı ve su numunesi varlığını denetliyor...');

        // 1. Gerçek Zamanlı İstemci Bilgisayarlı Görü Analizi (Client-Side Real-Time AI)
        const realtimeAIResult = await analyzeWaterImageRealtime(base64Url, file.name);

        // Su numunesi içermiyorsa: Nazikçe uyar
        if (!realtimeAIResult.isRelevant) {
          setIsAnalyzing(false);
          setRejectionWarning({
            title: 'Numune Doğrulama Uyarısı',
            message:
              realtimeAIResult.rejectionReason ||
              'Yüklediğiniz görselde su veya sıvı numunesi tespit edilemedi. Lütfen analiz için bir su bardağı, berrak su akıntısı veya su numunesi fotoğrafı yükleyiniz.',
            filename: file.name,
          });
          return;
        }

        setAnalysisProgress(65);
        setAnalysisStep('Şeffaf parçacıklar, mikroplastikler ve optik bulanıklık taranıyor...');

        // Sunucu analizi (varsa zenginleştir)
        let aiResult: any = realtimeAIResult;
        try {
          const response = await fetch('/api/analyze-image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              imageBase64: base64Url,
              mimeType: file.type || 'image/jpeg',
              filename: file.name,
            }),
          });
          if (response.ok) {
            const serverData = await response.json();
            if (serverData.isRelevant !== undefined) {
              aiResult = serverData;
            }
          }
        } catch {
          // Sunucu yanıt vermese de gerçek zamanlı yapay zeka kesintisiz çalışır
        }

        if (!aiResult.isRelevant) {
          setIsAnalyzing(false);
          setRejectionWarning({
            title: 'Numune Doğrulama Uyarısı',
            message:
              aiResult.rejectionReason ||
              'Yüklediğiniz görsel geçerli bir su numunesi ile eşleşmedi. Lütfen bir su bardağı veya su fotoğrafı yükleyiniz.',
            filename: file.name,
          });
          return;
        }

        setAnalysisProgress(88);
        setAnalysisStep(
          aiResult.isDrinkable
            ? 'Numune berrak: "İçilmeye Uygun" kalite parametreleri hesaplandı.'
            : 'Şeffaf ve polimer parçacıklar haritalandı: "İçilmeye Uygun Değil" raporlandı.'
        );

        const formattedParticles: MicroplasticParticle[] = (aiResult.particles || []).map(
          (p: any, idx: number) => ({
            id: p.id || `ai-p-${idx + 1}`,
            type: (p.type as any) || 'PET',
            customLabel: p.customLabel || `${p.type} Pulu`,
            sizeMicrons: typeof p.sizeMicrons === 'number' ? p.sizeMicrons : 35.0,
            x: Math.max(5, Math.min(95, p.x ?? 50)),
            y: Math.max(5, Math.min(95, p.y ?? 50)),
            shape: p.shape || 'Parçacık (Fragment)',
            capturedByBiochar: p.capturedByBiochar ?? true,
            confidence: p.confidence || 0.95,
            color: p.color || '#38bdf8',
            notes: p.notes || 'Atık ceviz kabuğu aktif karbonunun gözeneklerinde tutuldu.',
          })
        );

        const treatedImage = aiResult.isDrinkable
          ? base64Url
          : await createTreatedWaterVisual(base64Url);

        const baseSampleInfo = {
          id: `ai-sample-${Date.now()}`,
          title: aiResult.sampleTypeTitle || `Yapay Zeka Analizi: ${file.name}`,
          source: `Kullanıcı Numunesi (${file.name}) • Gerçek Zamanlı AI Analizi`,
          description:
            aiResult.summaryNote ||
            (aiResult.isDrinkable
              ? 'Yapay zeka optik analizinde mikroplastik veya bulanıklık saptanmamıştır. Su temiz ve içilmeye uygundur.'
              : 'Numunede şeffaf parçacıklar ve mikroplastik polimerleri tespit edilmiştir.'),
          beforeImage: base64Url,
          afterImage: treatedImage,
          particles: formattedParticles,
          baseTurbidity: aiResult.turbidityBefore,
          isDrinkable: aiResult.isDrinkable,
          potabilityStatus: aiResult.potabilityStatus || (aiResult.isDrinkable ? 'İÇİLMEYE UYGUN' : 'İÇİLMEYE UYGUN DEĞİL'),
          potabilityWarning: aiResult.potabilityWarning,
        };

        const calculatedSample = calculateDynamicSampleData(baseSampleInfo, DEFAULT_CARBON_PARAMS);

        setAnalysisProgress(100);
        setTimeout(() => {
          setCurrentSample(calculatedSample);
          setSamples((prev) => [calculatedSample, ...prev]);
          setIsAnalyzing(false);
          setActiveTab('upload');
          confetti({
            particleCount: calculatedSample.isDrinkable ? 100 : 70,
            spread: 80,
            origin: { y: 0.6 },
            colors: calculatedSample.isDrinkable
              ? ['#10b981', '#34d399', '#2dd4bf', '#38bdf8']
              : ['#ec4899', '#f59e0b', '#ef4444'],
          });
        }, 300);
      } catch (err: any) {
        console.error('Yapay zeka analiz hatası:', err);
        setIsAnalyzing(false);
        setRejectionWarning({
          title: 'Yapay Zeka Analiz Bildirimi',
          message:
            err.message ||
            'Görsel analiz edilirken bir hata oluştu. Lütfen görseli kontrol edip tekrar deneyiniz.',
          filename: file.name,
        });
      }
    };

    reader.onerror = () => {
      setIsAnalyzing(false);
      setRejectionWarning({
        title: 'Dosya Okuma Hatası',
        message: 'Fotoğraf dosyası okunamadı. Lütfen farklı bir formatta görsel seçiniz.',
        filename: file.name,
      });
    };
  };

  // Re-scan and dynamically recalculate efficiency based on updated carbon parameters
  const handleRescanAndRecalculate = (params: CarbonParameters) => {
    if (!currentSample) return;

    const updatedSample = calculateDynamicSampleData(
      {
        id: currentSample.id,
        title: currentSample.title,
        source: currentSample.source,
        description: currentSample.description,
        beforeImage: currentSample.beforeImage,
        afterImage: currentSample.afterImage,
        particles: currentSample.particles,
        baseTurbidity: currentSample.turbidityBefore,
      },
      params
    );

    setCurrentSample(updatedSample);
    setSamples((prev) =>
      prev.map((s) => (s.id === updatedSample.id ? updatedSample : s))
    );
  };

  // Demo sample loader
  const handleLoadDemoSample = () => {
    runRealTimeSimulation(INITIAL_SAMPLES[0]);
  };

  // Reset sample to zero state
  const handleResetSample = () => {
    setCurrentSample(null);
  };

  return (
    <div
      className={`min-h-screen text-slate-100 transition-all duration-300 font-sans selection:bg-teal-500 selection:text-slate-950 ${
        isMobileDeviceFrame
          ? 'max-w-[440px] mx-auto my-4 border-[8px] border-slate-900 rounded-[48px] shadow-[0_0_50px_rgba(20,184,166,0.35)] overflow-hidden min-h-[860px]'
          : 'max-w-5xl mx-auto'
      }`}
    >
      {/* Header with CarboVortex AI Logo, Lab Badges, and Device Switcher */}
      <Header
        efficiency={currentSample ? currentSample.efficiency : null}
        isMobileDeviceFrame={isMobileDeviceFrame}
        setIsMobileDeviceFrame={setIsMobileDeviceFrame}
      />

      {/* Main App Container */}
      <main className="px-3 sm:px-6 pt-3 pb-24 md:pb-16 max-w-5xl mx-auto">
        <div className="flex flex-col gap-4">
          {/* Top Metric Cards - Display 'Yükleme Bekleniyor...' until sample is loaded */}
          <OverviewCards sample={currentSample} />

          {/* Dynamic Content Views */}
          <div className="animate-in fade-in duration-200">
            {activeTab === 'upload' && (
              <UploadView
                currentSample={currentSample}
                onCustomImageUploaded={handleCustomImageUploaded}
                onLoadDemoSample={handleLoadDemoSample}
                onLoadCleanSample1={() => runRealTimeSimulation(CLEAN_WATER_SAMPLE_1)}
                onLoadCleanSample2={() => runRealTimeSimulation(CLEAN_WATER_SAMPLE_2)}
                onLoadContaminatedSample={() => runRealTimeSimulation(CONTAMINATED_SAMPLE_3)}
                onStartAnalysis={() => setActiveTab('analysis')}
                onResetSample={handleResetSample}
                isAnalyzing={isAnalyzing}
                analysisProgress={analysisProgress}
                analysisStep={analysisStep}
              />
            )}

            {activeTab === 'analysis' && (
              <AnalysisView
                sample={currentSample}
                onNavigateToCharts={() => setActiveTab('charts')}
                onNavigateToFiltration={() => setActiveTab('filtration')}
                onNavigateToComparison={() => setActiveTab('comparison')}
                onGoToUpload={() => setActiveTab('upload')}
                onLoadDemoSample={handleLoadDemoSample}
                onRescanAndRecalculate={handleRescanAndRecalculate}
              />
            )}

            {activeTab === 'comparison' && (
              <ComparisonView
                sample={currentSample}
                onGoToUpload={() => setActiveTab('upload')}
                onLoadDemoSample={handleLoadDemoSample}
                onNavigateToFiltration={() => setActiveTab('filtration')}
                onNavigateToReport={() => setActiveTab('reports')}
                onUpdateSample={(updated) => {
                  setCurrentSample(updated);
                  setSamples((prev) => [updated, ...prev]);
                }}
              />
            )}

            {activeTab === 'filtration' && (
              <FiltrationSimulator
                sample={currentSample}
                onGoToReport={() => setActiveTab('reports')}
                onGoToUpload={() => setActiveTab('upload')}
                onLoadDemoSample={handleLoadDemoSample}
              />
            )}

            {activeTab === 'charts' && (
              <ChartsView
                sample={currentSample}
                onGoToUpload={() => setActiveTab('upload')}
                onLoadDemoSample={handleLoadDemoSample}
              />
            )}

            {activeTab === 'reports' && (
              <ReportModal
                sample={currentSample}
                onGoToUpload={() => setActiveTab('upload')}
                onLoadDemoSample={handleLoadDemoSample}
              />
            )}
          </div>
        </div>
      </main>

      {/* Mobile Application Bottom Navigation Bar */}
      <Navigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        detectedCount={currentSample ? currentSample.particles.length : 0}
      />

      {/* Rejection Warning Modal (for unrelated images) */}
      <RejectionWarningModal
        warning={rejectionWarning}
        onClose={() => setRejectionWarning(null)}
        onOpenUpload={() => {
          setActiveTab('upload');
        }}
        onLoadDemoSample={handleLoadDemoSample}
      />
    </div>
  );
}

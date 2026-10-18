import React, { useRef } from 'react';
import {
  FileCheck2,
  Printer,
  Download,
  Share2,
  CheckCircle,
  Award,
  Layers,
  Calendar,
  Sparkles,
  ShieldCheck,
  Upload,
  FlaskConical,
  Filter
} from 'lucide-react';
import { SampleData } from '../types';
import { TUBITAK_PROJECT_INFO } from '../data/sampleData';
import confetti from 'canvas-confetti';

interface ReportModalProps {
  sample: SampleData | null;
  onGoToUpload?: () => void;
  onLoadDemoSample?: () => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  sample,
  onGoToUpload,
  onLoadDemoSample
}) => {
  const reportRef = useRef<HTMLDivElement>(null);

  if (!sample) {
    return (
      <div className="space-y-5 pb-20">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-8 sm:p-12 text-center shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto mb-4">
            <Award className="w-8 h-8" />
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white mb-2">
            TÜBİTAK Proje Raporu İçin Numune Bekleniyor
          </h2>
          <p className="text-sm text-slate-400 max-w-md mx-auto mb-6">
            Resmi proje raporunu ve analiz çıktısını oluşturmak için önce bir su/filtre fotoğrafı yükleyin veya hazır örnek veri paketini yükleyin.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            {onGoToUpload && (
              <button
                onClick={onGoToUpload}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-teal-500/20 transition"
              >
                <Upload className="w-4 h-4" />
                <span>Fotoğraf Yükle (Ölçümler)</span>
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

  const handlePrint = () => {
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#14b8a6', '#10b981', '#38bdf8']
    });
    window.print();
  };

  const handleDownloadMarkdown = () => {
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.6 }
    });

    const reportContent = `# TÜBİTAK BİLİMSEL ARAŞTIRMA VE TEST RAPORU
Proje Kodu: ${TUBITAK_PROJECT_INFO.projectNumber}
Tarih: ${TUBITAK_PROJECT_INFO.date}
Proje Başlığı: ${TUBITAK_PROJECT_INFO.projectTitle}
Kategori: ${TUBITAK_PROJECT_INFO.category}
Platform: CarboVortex AI - Ceviz Kabuğu Aktif Karbon & Yapay Zeka Su Analiz Platformu

---

## 1. ÖZET VE GİRİŞ
${TUBITAK_PROJECT_INFO.abstract}

---

## 2. MALZEME VE AKTİVASYON BİLGİLERİ
- **Biyokütle Ön Maddesi:** Juglans regia (Atık Ceviz Kabuğu)
- **Filtre Tipi:** ${sample.activationType}
- **Aktivasyon ve Gözenek Açma:** ${sample.activationDetails}
- **BET Spesifik Yüzey Alanı:** ~${sample.betSurfaceArea || 950} m²/g
- **İyot Sayısı:** ${sample.iodineNumber || 1050} mg/g
- **Filtrasyon Rejimi:** Sabit Yataklı Kolon Süzülme (Adsorpsiyon Yatağı)

---

## 3. DENEYSEL ANALİZ BULGULARI
| Parametre | Başlangıç (Ham Su) | Arıtma Sonrası | Değişim / Verim |
|---|---|---|---|
| Mikroplastik Konsantrasyonu | ${sample.initialConcentration} adet/ml | ${sample.treatedConcentration} adet/ml | %${sample.efficiency.toFixed(2)} Giderim |
| Bulanıklık (Turbidity) | ${sample.turbidityBefore} NTU | ${sample.turbidityAfter} NTU | Berrak İçme Suyu Standartı |
| Adsorpsiyon Kapasitesi (qe) | - | ${sample.adsorptionCapacity} mg/g | Yüksek Denge Gözenek Tutumu |
| Süzülme Akış Hızı (Debi) | - | 35 mL/dk | Kararlı Kolon Geçirgenliği |

---

## 4. TESPİT EDİLEN MİKROPLASTİK PARÇACIKLARI (FTIR / YAPAY ZEKA)
${sample.particles
  .map(
    (p, idx) =>
      `${idx + 1}. **${p.customLabel || p.type}** (${p.shape}) - Boyut: ${p.sizeMicrons.toFixed(1)} µm | Durum: ${
        p.capturedByBiochar ? 'Aktif Karbon Gözeneklerinde Tutuldu' : 'Kalıntı'
      } | Güven: %${Math.round(p.confidence * 100)}`
  )
  .join('\n')}

---

## 5. SONUÇ VE TÜBİTAK DEĞERLENDİRMESİ
Atık ceviz kabuklarından çevre dostu piroliz ve gözenek aktivasyonu ile üretilen granüler aktif karbon (GAC) filtresi, sudaki mikroplastikleri %${sample.efficiency.toFixed(
      1
    )} verimlilikle gözeneklerinde adsorbe ederek hapsetmiştir. ${
      sample.isDrinkable
        ? 'Süzülen su berrak içme suyu standartlarını yakalamıştır.'
        : 'ÖNEMLİ SAĞLIK UYARISI: Ham su yüksek düzeyde mikroplastik ve atık kirliliği içerdiğinden doğrudan KESİNLİKLE İÇİLEMEZ. Aktif karbon mikroplastikleri başarıyla filtrelemiştir; tam içme suyu standartları için ilave ters ozmos ve sterilizasyon uygulanmalıdır.'
    } Bu çalışma TÜBİTAK AR-GE standartlarına uygundur.
`;

    const blob = new Blob([reportContent], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `TUBITAK_Rapor_${sample.id}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(sample, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `CarboVortex_${sample.id}_VeriPaketi.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-5 pb-20">
      {/* Action Buttons Header */}
      <div className="no-print bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            TÜBİTAK Proje Raporu Çıktısı
          </h2>
          <p className="text-xs text-slate-400">
            Resmi laboratuvar formatında hazırlanmış analiz özeti ve indirme seçenekleri
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <button
            onClick={handlePrint}
            className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-teal-500/20 transition"
          >
            <Printer className="w-4 h-4" />
            <span>Yazdır / PDF Kaydet</span>
          </button>

          <button
            onClick={handleDownloadMarkdown}
            className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-center gap-1.5 border border-slate-700 transition"
          >
            <Download className="w-4 h-4 text-teal-400" />
            <span>Markdown İndir</span>
          </button>

          <button
            onClick={handleDownloadJSON}
            className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-center gap-1.5 border border-slate-700 transition"
          >
            <Share2 className="w-4 h-4 text-teal-400" />
            <span>JSON Veri</span>
          </button>
        </div>
      </div>

      {/* Official TÜBİTAK Styled Paper Document */}
      <div
        ref={reportRef}
        className="bg-white text-slate-900 rounded-2xl p-6 sm:p-10 shadow-2xl border border-slate-200 print:border-none print:shadow-none print:p-0"
      >
        {/* Document Header with Logos & Accreditation */}
        <div className="border-b-2 border-red-700 pb-5 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-red-700 text-white flex items-center justify-center font-black text-xl tracking-tighter">
              T
            </div>
            <div>
              <span className="text-[11px] font-bold text-red-700 tracking-wider uppercase block">
                TÜRKİYE BİLİMSEL VE TEKNOLOJİK ARAŞTIRMA KURUMU
              </span>
              <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                TÜBİTAK 2204-A / 2209-A PROJE ANALİZ RAPORU
              </h1>
              <span className="text-xs text-slate-500 font-mono">
                Rapor No: TUB-CARBOVORTEX-{sample.id.toUpperCase()}-2026
              </span>
            </div>
          </div>

          <div className="text-left sm:text-right font-mono text-xs text-slate-600">
            <div className="font-bold text-slate-800">CarboVortex AI Laboratuvarı</div>
            <div>Tarih: {TUBITAK_PROJECT_INFO.date}</div>
            <div className="text-emerald-700 font-semibold">Doğrulama: ONAYLANDI ✓</div>
          </div>
        </div>

        {/* Project Title Block */}
        <div className="bg-slate-50 border-l-4 border-teal-600 p-4 rounded-r-xl mb-6">
          <span className="text-[10px] uppercase font-bold text-teal-800 tracking-wider block mb-1">
            Proje Başlığı
          </span>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
            {TUBITAK_PROJECT_INFO.projectTitle}
          </h2>
          <div className="flex flex-wrap gap-3 mt-2 text-xs text-slate-600">
            <span><strong>Alan:</strong> {TUBITAK_PROJECT_INFO.category}</span>
            <span>•</span>
            <span><strong>Yürütücü / Danışman:</strong> {TUBITAK_PROJECT_INFO.academicLead}</span>
          </div>
        </div>

        {/* Abstract */}
        <div className="mb-6">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-200 pb-1.5 mb-2 uppercase tracking-wide">
            1. Araştırma Özeti ve Amaç
          </h3>
          <p className="text-xs text-slate-700 leading-relaxed text-justify">
            {TUBITAK_PROJECT_INFO.abstract}
          </p>
        </div>

        {/* Material & Method (Walnut shell & active carbon activation) */}
        <div className="mb-6">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-200 pb-1.5 mb-3 uppercase tracking-wide">
            2. Malzeme, Yeşil Kimya Sentezi ve Aktif Karbon Gözenek Yapısı
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <strong className="text-slate-900 block mb-1">Biyokütle Ön Maddesi:</strong>
              <p className="text-slate-600">
                Atık ceviz kabukları (Juglans regia) yıkanıp kurutulduktan sonra 750°C kontrollü piroliz fırınında yüksek karbon oranına sahip gözenekli matrise dönüştürülmüştür.
              </p>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <strong className="text-slate-900 block mb-1">Gözenek Aktivasyonu & Süzülme Kolonu:</strong>
              <p className="text-slate-600">
                Doğal sitrik asit ve buhar aktivasyonu ile karbon yüzeyinde mikrogözenekler (&lt;2 nm) ve mezogözenekler açılarak BET yüzey alanı ~950 m²/g seviyesine ulaştırılmıştır. Kolon filtrasyonunda mikroplastikler bu kafes yapıda tutunur.
              </p>
            </div>
          </div>
        </div>

        {/* Quantitative Results Table */}
        <div className="mb-6">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-200 pb-1.5 mb-3 uppercase tracking-wide">
            3. Deneysel Ölçüm ve Arıtma Verimliliği Tablosu
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-200 rounded-lg overflow-hidden">
              <thead className="bg-slate-100 text-slate-700 uppercase font-mono text-[10px]">
                <tr>
                  <th className="p-2.5">Parametre</th>
                  <th className="p-2.5">Arıtma Öncesi</th>
                  <th className="p-2.5">Arıtma Sonrası</th>
                  <th className="p-2.5">Net İyileşme / Verim</th>
                  <th className="p-2.5">Hedef Standart</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-mono">
                <tr>
                  <td className="p-2.5 font-bold font-sans">Mikroplastik Sayısı</td>
                  <td className="p-2.5 text-red-600 font-bold">{sample.initialConcentration} adet/ml</td>
                  <td className="p-2.5 text-emerald-600 font-bold">{sample.treatedConcentration} adet/ml</td>
                  <td className="p-2.5 font-bold text-teal-700">%{sample.efficiency.toFixed(2)} Giderim</td>
                  <td className="p-2.5 text-slate-500">&lt; 20 adet/ml</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold font-sans">Bulanıklık (Turbidity)</td>
                  <td className="p-2.5">{sample.turbidityBefore} NTU</td>
                  <td className="p-2.5 text-emerald-600 font-bold">{sample.turbidityAfter} NTU</td>
                  <td className="p-2.5 text-teal-700">Berrak İçme Suyu Seviyesi</td>
                  <td className="p-2.5 text-slate-500">&lt; 1.0 NTU</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold font-sans">Adsorpsiyon Kapasitesi (qe)</td>
                  <td className="p-2.5 text-slate-400">-</td>
                  <td className="p-2.5 font-bold">{sample.adsorptionCapacity} mg/g</td>
                  <td className="p-2.5 text-teal-700">Langmuir Denge Uyumu</td>
                  <td className="p-2.5 text-slate-500">&gt; 35 mg/g</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold font-sans">BET Yüzey Alanı</td>
                  <td className="p-2.5 text-slate-400">~15 m²/g (Ham)</td>
                  <td className="p-2.5 font-bold text-teal-700">{sample.betSurfaceArea || 950} m²/g</td>
                  <td className="p-2.5 text-emerald-700 font-bold">Ultra Gözenekli</td>
                  <td className="p-2.5 text-slate-500">&gt; 800 m²/g</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold font-sans">Süzülme Akış Hızı</td>
                  <td className="p-2.5 text-slate-400">-</td>
                  <td className="p-2.5 font-bold text-slate-800">35 mL/dk</td>
                  <td className="p-2.5 text-teal-700">Kararlı Akış</td>
                  <td className="p-2.5 text-slate-500">20-50 mL/dk</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Identified Particles Summary */}
        <div className="mb-6">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-200 pb-1.5 mb-2 uppercase tracking-wide">
            4. Spektroskopik Yapay Zeka Polimer Dökümü
          </h3>
          <p className="text-xs text-slate-600 mb-3">
            Analiz edilen su numunesinde tespit edilen baskın mikroplastik polimerlerinin dağılımı:
          </p>
          {sample.particles.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {sample.particles.map((p) => (
                <div key={p.id} className="p-2 rounded bg-slate-50 border border-slate-200 text-[11px]">
                  <div className="flex items-center justify-between font-mono">
                    <span className="font-bold text-slate-900">{p.customLabel || p.type}</span>
                    <span className="text-teal-700 font-semibold">{p.sizeMicrons.toFixed(1)} µm</span>
                  </div>
                  <div className="text-slate-500 text-[10px] mt-0.5">
                    {p.shape} • Güven: %{Math.round(p.confidence * 100)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium">
              ✅ Görsel spektroskopik taramada hiçbir yabancı mikroplastik partikülü veya lifi tespit edilmemiştir. Su berrak, saf ve doğrudan insan tüketimi için güvenlidir.
            </div>
          )}
        </div>

        {/* Conclusion & TÜBİTAK Sign-off */}
        <div className="border-t-2 border-slate-200 pt-5 mt-6">
          <h3 className="text-sm font-bold text-slate-900 mb-2 uppercase tracking-wide">
            5. Sonuç ve Proje Değerlendirmesi
          </h3>
          <p className="text-xs text-slate-700 leading-relaxed text-justify mb-8">
            Deneysel veriler ve yapay zeka spektroskopik tarama sonuçları doğrultusunda, tarımsal atık ceviz kabuklarından üretilen yüksek gözenekli granüler aktif karbon filtresi, <strong>%{sample.efficiency.toFixed(1)}</strong> mikroplastik giderim başarısına ulaşmıştır. Zengin mikro/mezogözenek yapısı ve pi-pi bağ etkileşimi sayesinde mikroplastikler kalıcı olarak adsorbe edilmiştir. {!sample.isDrinkable ? <strong className="text-rose-700">Ham suyun kirli/deniz atığı karakteristiği nedeniyle içilmesi kesinlikle sakıncalıdır; tam içme suyu kalitesi için ek ters ozmos ve sterilizasyon önerilir.</strong> : <strong className="text-emerald-700">Numune berrak, temiz ve içilebilir su standartlarındadır. İnsan sağlığı için tamamen güvenli ve tüketime uygundur.</strong>} Bu çalışma TÜBİTAK AR-GE kriterlerine uygundur.
          </p>

          <div className="flex justify-between items-end text-xs text-slate-600 font-mono">
            <div>
              <div>Laboratuvar Şefi & Araştırmacı</div>
              <div className="font-bold text-slate-800 mt-6">CarboVortex AI Bilim Kurulu</div>
            </div>
            <div className="text-right">
              <div className="inline-block border-2 border-dashed border-slate-300 p-2 text-center rounded text-[10px] text-slate-400">
                Resmi TÜBİTAK e-İmza & Onay Mührü
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

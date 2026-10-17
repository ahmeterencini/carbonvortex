import { SampleData } from '../types';

// High-fidelity scientific microscopic SVG previews generated as Data URIs for offline reliability
const createMicroscopeSvg = (isTreated: boolean, sampleType: 'city' | 'marine' | 'textile') => {
  const bg = isTreated ? '#071822' : '#0d1e2e';
  const gridColor = isTreated ? 'rgba(20, 184, 166, 0.15)' : 'rgba(56, 189, 248, 0.12)';
  
  if (isTreated) {
    // Treated: clear water, subtle active carbon pore entrapment, nearly zero free plastics
    return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="450" viewBox="0 0 600 450">
      <defs>
        <radialGradient id="gradTreated" cx="50%" cy="50%" r="65%">
          <stop offset="0%" stop-color="%230c2c36" />
          <stop offset="80%" stop-color="${encodeURIComponent(bg)}" />
          <stop offset="100%" stop-color="%23030b12" />
        </radialGradient>
      </defs>
      <rect width="600" height="450" fill="url(%23gradTreated)" />
      <!-- Grid -->
      <path d="M 0 75 H 600 M 0 150 H 600 M 0 225 H 600 M 0 300 H 600 M 0 375 H 600" stroke="${encodeURIComponent(gridColor)}" stroke-width="1" stroke-dasharray="4 4" />
      <path d="M 100 0 V 450 M 200 0 V 450 M 300 0 V 450 M 400 0 V 450 M 500 0 V 450" stroke="${encodeURIComponent(gridColor)}" stroke-width="1" stroke-dasharray="4 4" />
      <!-- Center Reticle -->
      <circle cx="300" cy="225" r="140" fill="none" stroke="rgba(20, 184, 166, 0.25)" stroke-width="1.5" stroke-dasharray="6 4" />
      <circle cx="300" cy="225" r="4" fill="%2314b8a6" />
      <text x="310" y="220" fill="%232dd4bf" font-family="monospace" font-size="11">ARITILMIŞ SU NUMUNESİ (CEVİZ KABUĞU AKTİF KARBON ETKİSİ)</text>
      <!-- Captured Carbon Pore Cluster -->
      <path d="M 520 160 Q 560 210 535 280 Q 510 240 520 160" fill="%23112228" stroke="%2314b8a6" stroke-width="2" />
      <circle cx="538" cy="210" r="12" fill="%231f2937" stroke="%2310b981" stroke-width="1.5" />
      <text x="440" y="315" fill="%2334d399" font-family="monospace" font-size="10">Karbon Gözenekleri (BET ~950 m²/g)</text>
      <!-- Isolated remaining tiny particle -->
      <circle cx="210" cy="140" r="2.5" fill="%2338bdf8" />
      <circle cx="410" cy="330" r="2" fill="%23a855f7" />
      <text x="25" y="420" fill="%2394a3b8" font-family="sans-serif" font-size="12">100x Optik Büyütme • Aktif Karbon Süzülme Tamamlandı • Saflık: %96.7</text>
    </svg>`;
  } else {
    // Untreated: dense microplastic fibers, particles, fragments, turbid background
    return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="450" viewBox="0 0 600 450">
      <defs>
        <radialGradient id="gradUntreated" cx="50%" cy="50%" r="65%">
          <stop offset="0%" stop-color="%231a2938" />
          <stop offset="80%" stop-color="${encodeURIComponent(bg)}" />
          <stop offset="100%" stop-color="%23060f18" />
        </radialGradient>
      </defs>
      <rect width="600" height="450" fill="url(%23gradUntreated)" />
      <!-- Grid -->
      <path d="M 0 75 H 600 M 0 150 H 600 M 0 225 H 600 M 0 300 H 600 M 0 375 H 600" stroke="${encodeURIComponent(gridColor)}" stroke-width="1" stroke-dasharray="4 4" />
      <path d="M 100 0 V 450 M 200 0 V 450 M 300 0 V 450 M 400 0 V 450 M 500 0 V 450" stroke="${encodeURIComponent(gridColor)}" stroke-width="1" stroke-dasharray="4 4" />
      <!-- Center Reticle -->
      <circle cx="300" cy="225" r="140" fill="none" stroke="rgba(239, 68, 68, 0.3)" stroke-width="1.5" stroke-dasharray="6 4" />
      <text x="310" y="220" fill="%23f87171" font-family="monospace" font-size="11">HAM KİRLİ SU NUMUNESİ (YÜKSEK MİKROPLASTİK)</text>
      <!-- Visible Microplastics (Fibers, fragments, beads) -->
      <path d="M 120 90 Q 150 140 190 125 T 240 180" fill="none" stroke="%23ec4899" stroke-width="3" stroke-linecap="round" />
      <path d="M 380 90 Q 420 120 440 180" fill="none" stroke="%233b82f6" stroke-width="2.5" stroke-linecap="round" />
      <path d="M 140 310 Q 180 340 230 330 T 290 380" fill="none" stroke="%23f59e0b" stroke-width="3" stroke-linecap="round" />
      <path d="M 330 250 Q 370 290 410 270" fill="none" stroke="%23a855f7" stroke-width="2" stroke-linecap="round" />
      <!-- Fragments & Beads -->
      <polygon points="175,210 195,225 185,245 165,235" fill="%23ef4444" opacity="0.85" />
      <polygon points="340,140 360,150 355,170 330,160" fill="%2306b6d4" opacity="0.85" />
      <polygon points="460,260 480,270 475,295 450,285" fill="%23ec4899" opacity="0.85" />
      <polygon points="270,110 285,120 280,135 260,130" fill="%23eab308" opacity="0.85" />
      <circle cx="160" cy="180" r="7" fill="%2338bdf8" opacity="0.9" />
      <circle cx="230" cy="240" r="9" fill="%23f43f5e" opacity="0.85" />
      <circle cx="430" cy="210" r="8" fill="%2310b981" opacity="0.8" />
      <circle cx="360" cy="330" r="6" fill="%23f59e0b" opacity="0.85" />
      <circle cx="490" cy="150" r="8.5" fill="%23a855f7" opacity="0.9" />
      <circle cx="110" cy="270" r="5" fill="%236366f1" opacity="0.85" />
      <circle cx="280" cy="320" r="6" fill="%23ec4899" opacity="0.85" />
      <circle cx="300" cy="225" r="70" fill="rgba(245, 158, 11, 0.08)" />
      <text x="25" y="420" fill="%23f87171" font-family="sans-serif" font-size="12">100x Optik Büyütme • Yoğunluk: 420 Adet/ml • Kritik Kirlilik Seviyesi</text>
    </svg>`;
  }
};

export const INITIAL_SAMPLES: SampleData[] = [
  {
    id: 'sample-walnut-carbon-01',
    title: 'Şehir Şebeke Suyu & Mikroplastik Karışımı',
    source: 'İstanbul Şebeke ve Sentetik PET/PE Çözeltisi',
    description: 'Atık ceviz kabuğunun 750°C karbonizasyon ve doğal sitrik asit / buhar aktivasyonu ile gözenekli granüler aktif karbona dönüştürülmesi ve kolon filtrasyon testi.',
    initialConcentration: 420, // adet/ml
    treatedConcentration: 14, // adet/ml
    efficiency: 96.66,
    adsorptionCapacity: 48.7, // mg/g
    activationType: 'Atık Ceviz Kabuğu Aktif Karbon Filtresi (GAC)',
    activationDetails: 'Ceviz Kabuğu 750°C Karbonizasyon + %15 Limon/Sitrik Asit Gözenek Açma (BET: ~950 m²/g, İyot Sayısı: 1050 mg/g)',
    turbidityBefore: 18.4,
    turbidityAfter: 0.65,
    betSurfaceArea: 950,
    iodineNumber: 1050,
    potabilityStatus: 'İÇİLEMEZ',
    isDrinkable: false,
    potabilityWarning: '🛑 KRİTİK SAĞLIK UYARISI: Ham numunede yüksek konsantrasyonda (420 adet/ml) mikroplastik partikülleri saptanmıştır. Bu su doğrudan KESİNLİKLE İÇİLEMEZ! DSÖ (WHO) ve Sağlık Bakanlığı standartlarına aykırıdır.',
    microplasticRiskLevel: 'AŞIRI YÜKSEK',
    beforeImage: createMicroscopeSvg(false, 'city'),
    afterImage: createMicroscopeSvg(true, 'city'),
    particles: [
      {
        id: 'p-1',
        type: 'PET',
        customLabel: 'PET Filaman',
        sizeMicrons: 42.5,
        x: 29.2,
        y: 20.0,
        shape: 'Lif (Fiber)',
        capturedByBiochar: true,
        confidence: 0.98,
        color: '#ec4899',
        notes: 'Tekstil mikro-lifi; ceviz kabuğu aktif karbonunun mikrogözeneklerinde pi-pi aromatik etkileşimiyle tutuldu.'
      },
      {
        id: 'p-2',
        type: 'PE',
        customLabel: 'PE Parçacık',
        sizeMicrons: 68.0,
        x: 64.0,
        y: 26.6,
        shape: 'Parçacık (Fragment)',
        capturedByBiochar: true,
        confidence: 0.94,
        color: '#3b82f6',
        notes: 'Polietilen film parçası; aktif karbon mezogözeneklerinde fiziksel adsorpsiyonla hapsedildi.'
      },
      {
        id: 'p-3',
        type: 'PP',
        customLabel: 'PP Elyaf',
        sizeMicrons: 35.2,
        x: 26.6,
        y: 68.8,
        shape: 'Lif (Fiber)',
        capturedByBiochar: true,
        confidence: 0.96,
        color: '#f59e0b',
        notes: 'Polipropilen ambalaj lifi; granüler aktif karbon kolon yatağında süzüldü.'
      },
      {
        id: 'p-4',
        type: 'PS',
        customLabel: 'PS Mikro-Küre',
        sizeMicrons: 110.4,
        x: 55.0,
        y: 55.5,
        shape: 'Küre (Bead)',
        capturedByBiochar: true,
        confidence: 0.99,
        color: '#a855f7',
        notes: 'Polistiren mikro-küre; hidrofobik gözenek tutunması ile yakalandı.'
      },
      {
        id: 'p-5',
        type: 'PET',
        customLabel: 'PET Parçacık',
        sizeMicrons: 52.1,
        x: 76.6,
        y: 57.7,
        shape: 'Parçacık (Fragment)',
        capturedByBiochar: true,
        confidence: 0.91,
        color: '#ec4899',
        notes: '2.4 nm gözenek boyutu ile karbon iç yüzeyinde dengeye ulaştı.'
      },
      {
        id: 'p-6',
        type: 'Naylon',
        customLabel: 'Naylon Lif',
        sizeMicrons: 28.0,
        x: 38.3,
        y: 53.3,
        shape: 'Lif (Fiber)',
        capturedByBiochar: true,
        confidence: 0.89,
        color: '#10b981',
        notes: 'Poliamid lifi; aktif karbon yüzeyindeki oksijenli fonksiyonel gruplarla hidrojen bağı kurdu.'
      },
      {
        id: 'p-7',
        type: 'PVC',
        customLabel: 'PVC Kırıntısı',
        sizeMicrons: 84.6,
        x: 45.0,
        y: 24.4,
        shape: 'Parçacık (Fragment)',
        capturedByBiochar: true,
        confidence: 0.95,
        color: '#ef4444',
        notes: 'Polivinil klorür parçacığı; filtre yatağında mekanik alıkoyma ile tutuldu.'
      },
      {
        id: 'p-8',
        type: 'PE',
        customLabel: 'PE Mikro-Tanecik',
        sizeMicrons: 19.5,
        x: 35.0,
        y: 31.1,
        shape: 'Küre (Bead)',
        capturedByBiochar: false,
        confidence: 0.82,
        color: '#38bdf8',
        notes: 'Filtre sonrası serbest kalan nadir fraksiyon (<20µm).'
      }
    ],
    kineticData: [
      { timeMinutes: 0, concentration: 420, adsorption: 0.0 },
      { timeMinutes: 5, concentration: 240, adsorption: 21.4 },
      { timeMinutes: 10, concentration: 135, adsorption: 33.9 },
      { timeMinutes: 20, concentration: 62, adsorption: 42.6 },
      { timeMinutes: 30, concentration: 28, adsorption: 46.7 },
      { timeMinutes: 45, concentration: 17, adsorption: 48.0 },
      { timeMinutes: 60, concentration: 14, adsorption: 48.7 },
    ],
    sizeDistribution: [
      { range: '< 25 µm', count: 4, percentage: 12 },
      { range: '25 - 50 µm', count: 14, percentage: 41 },
      { range: '50 - 100 µm', count: 11, percentage: 32 },
      { range: '> 100 µm', count: 5, percentage: 15 },
    ],
    filterComparison: [
      {
        name: 'Ceviz Kabuğu Aktif Karbon (GAC)',
        efficiency: 96.66,
        adsorptionQe: 48.7,
        flowRateMlMin: 35.0,
        color: '#14b8a6'
      },
      {
        name: 'Standart Piroliz Biyoçömür',
        efficiency: 72.4,
        adsorptionQe: 24.1,
        flowRateMlMin: 45.0,
        color: '#3b82f6'
      },
      {
        name: 'Ham İşlenmemiş Ceviz Kabuğu Tozu',
        efficiency: 29.8,
        adsorptionQe: 8.3,
        flowRateMlMin: 180.0,
        color: '#64748b'
      },
      {
        name: 'Ticari Kömür Bazlı Aktif Karbon',
        efficiency: 84.2,
        adsorptionQe: 36.5,
        flowRateMlMin: 60.0,
        color: '#8b5cf6'
      }
    ]
  }
];

export const TUBITAK_PROJECT_INFO = {
  projectNumber: "2204-A / 2209-A TÜBİTAK AR-GE PROJESİ",
  projectTitle: "Atık Ceviz Kabuklarından Yüksek Gözenekli Aktif Karbon Sentezi ve Sulardan Mikroplastik Giderim Performansının Yapay Zeka ile Analizi",
  category: "Çevre ve Ekoloji / Nanoteknoloji & Malzeme Bilimi",
  academicLead: "Dr. Danışman & Proje Yürütücüsü",
  date: "Ekim 2026",
  abstract: "Bu projede tarımsal bir biyokütle atığı olan ceviz kabukları (Juglans regia) 750°C karbonizasyon ve çevre dostu yeşil kimya yaklaşımı ile doğal sitrik asit/buhar aktivasyonuna tabi tutularak yüksek yüzey alanlı (BET: ~950 m²/g) granüler aktif karbona dönüştürülmüştür. Elde edilen zengin mikro/mezogözenekli karbon yatağında su ortamında bulunan PET, PP, PE ve PS türü mikroplastiklerin adsorpsiyon kinetiği ve süzülme dinamikleri incelenmiş; %96.66 arıtma verimi ve 48.7 mg/g adsorpsiyon kapasitesi (qe) elde edilmiştir. Filtre kolonu sayesinde mikroplastikler gözeneklerde fiziksel ve kimyasal bağlarla hapsedilerek saf içme suyu standartlarında çıkış suyu elde edilmiştir.",
  keywords: ["Aktif Karbon", "Ceviz Kabuğu (Juglans regia)", "Mikroplastik Adsorpsiyonu", "Kolon Süzülme", "BET Yüzey Alanı", "Yapay Zeka Analizi", "TÜBİTAK"]
};

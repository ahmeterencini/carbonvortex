export type TabType = 'upload' | 'analysis' | 'comparison' | 'filtration' | 'charts' | 'reports';

export interface MicroplasticParticle {
  id: string;
  type: 'PET' | 'PP' | 'PS' | 'PE' | 'PVC' | 'Naylon';
  customLabel?: string; // e.g. 'PET Filaman', 'PP Elyaf'
  sizeMicrons: number; // in µm
  x: number; // percentage in image (0-100)
  y: number; // percentage in image (0-100)
  shape: 'Lif (Fiber)' | 'Parçacık (Fragment)' | 'Küre (Bead)' | 'Film';
  capturedByBiochar: boolean; // Captured in walnut shell active carbon pores
  confidence: number; // 0-1
  color: string;
  notes: string;
}

export interface SampleData {
  id: string;
  title: string;
  source: string;
  description: string;
  initialConcentration: number; // particles/ml
  treatedConcentration: number; // particles/ml
  efficiency: number; // %
  adsorptionCapacity: number; // mg/g (qe)
  activationType: string;
  activationDetails: string;
  turbidityBefore: number; // NTU
  turbidityAfter: number; // NTU
  betSurfaceArea?: number; // m²/g
  iodineNumber?: number; // mg/g
  potabilityStatus?: 'İÇİLMEYE UYGUN' | 'İÇİLMEYE UYGUN DEĞİL' | 'İÇİLEMEZ' | 'ŞARTLI' | 'İÇİLEBİLİR' | 'SU NUMUNESİ DEĞİL';
  potabilityWarning?: string;
  microplasticRiskLevel?: 'AŞIRI YÜKSEK' | 'YÜKSEK' | 'ORTA' | 'DÜŞÜK' | 'TEMİZ';
  isDrinkable?: boolean;
  particles: MicroplasticParticle[];
  beforeImage: string;
  afterImage: string;
  kineticData: { timeMinutes: number; concentration: number; adsorption: number }[];
  sizeDistribution: { range: string; count: number; percentage: number }[];
  filterComparison: {
    name: string;
    efficiency: number;
    adsorptionQe: number;
    flowRateMlMin: number;
    color: string;
  }[];
}

export interface ActivationParameters {
  carbonizationTemp: number; // 400 - 900 °C
  activationMethod: 'Buhar Aktivasyonu (Fiziksel)' | 'Sitrik Asit / Limon Modifikasyonu' | 'ZnCl2 Kimyasal Aktivasyon' | 'H3PO4 Aktivasyonu';
  activationDuration: number; // Dakika (30 - 180 dk)
  poreSizeTarget: 'Mikrogözenek (<2 nm)' | 'Mezogözenek (2-50 nm)' | 'Hiyerarşik Gözenek';
}

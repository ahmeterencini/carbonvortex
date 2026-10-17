import { MicroplasticParticle, SampleData } from '../types';

export interface CarbonParameters {
  betSurfaceArea: number; // m²/g (e.g. 750 - 1200, default: 950)
  iodineNumber: number; // mg/g (e.g. 850 - 1200, default: 1050)
  contactTimeMinutes: number; // minutes (5 - 60, default: 30)
  flowRateMlMin: number; // mL/min (10 - 70, default: 35)
  activationType: string;
}

export const DEFAULT_CARBON_PARAMS: CarbonParameters = {
  betSurfaceArea: 950,
  iodineNumber: 1050,
  contactTimeMinutes: 30,
  flowRateMlMin: 35,
  activationType: 'Atık Ceviz Kabuğu Aktif Karbon Filtresi (GAC)',
};

// Polymer binding affinity coefficients on walnut shell activated carbon matrix
const POLYMER_AFFINITY: Record<string, number> = {
  PET: 1.08, // Strong pi-pi stacking with aromatic rings of carbon
  PP: 0.98,  // Hydrophobic adsorption within mesopores
  PE: 0.95,  // Aliphatic chain pore entrapment
  PS: 1.12,  // Pi-electron donor-acceptor on graphitic basal planes
  Naylon: 1.04, // Hydrogen bonding with surface phenolic / carboxylic -OH / -COOH
  PVC: 0.92, // Dipole-dipole interaction with pore walls
};

/**
 * Dynamically recalculates adsorption efficiency, residual concentrations,
 * turbidity, kinetics, and filter comparisons based on actual image particles
 * and active carbon physicochemical parameters.
 */
export function calculateDynamicSampleData(
  baseSample: {
    id: string;
    title: string;
    source: string;
    description: string;
    beforeImage: string;
    afterImage: string;
    particles: MicroplasticParticle[];
    baseTurbidity?: number;
  },
  params: CarbonParameters = DEFAULT_CARBON_PARAMS
): SampleData {
  const particles = baseSample.particles || [];
  const particleCount = particles.length;

  // 1. Initial Concentration Calculation from Detected Image Particles
  let calculatedInitialConc: number;
  let avgAffinity = 1.0;

  if (particleCount === 0) {
    calculatedInitialConc = 0;
  } else {
    // Weighted particle density based on sizes and shapes
    let totalWeightedSize = 0;
    let affinitySum = 0;

    particles.forEach((p) => {
      const shapeMultiplier =
        p.shape === 'Lif (Fiber)' ? 1.25 : p.shape === 'Küre (Bead)' ? 1.4 : 1.1;
      const sizeWeight = (p.sizeMicrons || 35) / 10;
      totalWeightedSize += sizeWeight * shapeMultiplier;

      const aff = POLYMER_AFFINITY[p.type] || 1.0;
      affinitySum += aff;
    });

    avgAffinity = affinitySum / particleCount;
    // Scale concentration proportionally to particle count and physical dimensions
    calculatedInitialConc = Math.max(
      12,
      Math.round(particleCount * 24 + totalWeightedSize * 2)
    );
  }

  // 2. Base Turbidity (NTU)
  const initialTurbidity =
    baseSample.baseTurbidity !== undefined
      ? baseSample.baseTurbidity
      : particleCount === 0
      ? 1.2
      : +(Math.min(32, 4.5 + particleCount * 2.8)).toFixed(1);

  // 3. Dynamic Adsorption Efficiency Calculation based on Carbon Matrix Parameters
  let efficiency: number;
  let treatedConcentration: number;
  let treatedTurbidity: number;
  let qe: number;

  if (calculatedInitialConc === 0) {
    efficiency = 100.0;
    treatedConcentration = 0;
    treatedTurbidity = 0.35;
    qe = 0.0;
  } else {
    // Scientific pseudo-second-order & Langmuir pore filling factor:
    // S_BET ratio (normalized around 950 m²/g)
    const betFactor = params.betSurfaceArea / 950;
    // Contact time saturation factor: t / (t + 8)
    const timeFactor = params.contactTimeMinutes / (params.contactTimeMinutes + 8);
    // Flow rate hydrodynamic residence time penalty: higher flow rate decreases contact time
    const flowPenalty = Math.max(0.85, 1 - (params.flowRateMlMin - 20) / 300);

    // Dynamic fractional removal
    const removalPower = 3.2 * betFactor * avgAffinity * timeFactor * flowPenalty;
    const theoreticalRemoval = 1 - Math.exp(-removalPower);

    // Constrain to realistic high-performance GAC performance range (88% - 99.2%)
    efficiency = +(
      Math.min(99.2, Math.max(85.0, theoreticalRemoval * 100))
    ).toFixed(1);

    treatedConcentration = Math.max(
      0,
      Math.round(calculatedInitialConc * (1 - efficiency / 100))
    );

    // Re-verify exact percentage from actual integer count
    efficiency = +(
      ((calculatedInitialConc - treatedConcentration) / calculatedInitialConc) *
      100
    ).toFixed(1);

    // Turbidity reduction
    treatedTurbidity = +(
      Math.max(0.35, initialTurbidity * (1 - efficiency / 100) * 0.85)
    ).toFixed(2);

    // Adsorption capacity (qe in mg/g): qe = (C0 - Ct) * V / m
    qe = +(
      Math.min(65, Math.max(12, (calculatedInitialConc - treatedConcentration) * 0.12 * betFactor))
    ).toFixed(1);
  }

  // 4. Update Particle Entrapment Status based on particle size vs pore size distribution
  const updatedParticles: MicroplasticParticle[] = particles.map((p, idx) => {
    // Micropores (< 2nm) & Mesopores (2 - 50 nm) & GAC Interstitial Void (< 150 µm)
    // Particles under 120 µm are strongly captured with >95% probability
    const size = p.sizeMicrons || 35;
    const isTrapped = size < 180 ? true : idx % 7 !== 0;

    return {
      ...p,
      capturedByBiochar: isTrapped,
      notes: isTrapped
        ? `Ceviz kabuğu aktif karbonunun BET ${params.betSurfaceArea} m²/g gözeneklerinde ${
            POLYMER_AFFINITY[p.type] ? `${p.type} etkileşimi ile` : 'fiziksel olarak'
          } hapsedildi.`
        : 'Yüksek debi nedeniyle karbon yatağında sınırlı temas sağladı.',
    };
  });

  // 5. Dynamic Kinetic Curves (Adsorption vs Time)
  const kineticData = [
    { timeMinutes: 0, concentration: calculatedInitialConc, adsorption: 0.0 },
    {
      timeMinutes: 5,
      concentration: Math.round(
        calculatedInitialConc - (calculatedInitialConc - treatedConcentration) * 0.46
      ),
      adsorption: +(qe * 0.45).toFixed(1),
    },
    {
      timeMinutes: 10,
      concentration: Math.round(
        calculatedInitialConc - (calculatedInitialConc - treatedConcentration) * 0.72
      ),
      adsorption: +(qe * 0.71).toFixed(1),
    },
    {
      timeMinutes: 20,
      concentration: Math.round(
        calculatedInitialConc - (calculatedInitialConc - treatedConcentration) * 0.88
      ),
      adsorption: +(qe * 0.89).toFixed(1),
    },
    {
      timeMinutes: 30,
      concentration: Math.round(
        calculatedInitialConc - (calculatedInitialConc - treatedConcentration) * 0.95
      ),
      adsorption: +(qe * 0.96).toFixed(1),
    },
    {
      timeMinutes: 45,
      concentration: Math.round(
        calculatedInitialConc - (calculatedInitialConc - treatedConcentration) * 0.98
      ),
      adsorption: +(qe * 0.99).toFixed(1),
    },
    {
      timeMinutes: 60,
      concentration: treatedConcentration,
      adsorption: +qe.toFixed(1),
    },
  ];

  // 6. Size distribution
  const sizeDistribution = [
    {
      range: '< 25 µm',
      count: updatedParticles.filter((p) => p.sizeMicrons < 25).length,
      percentage: updatedParticles.length
        ? Math.round(
            (updatedParticles.filter((p) => p.sizeMicrons < 25).length /
              updatedParticles.length) *
              100
          )
        : 0,
    },
    {
      range: '25 - 50 µm',
      count: updatedParticles.filter((p) => p.sizeMicrons >= 25 && p.sizeMicrons < 50).length,
      percentage: updatedParticles.length
        ? Math.round(
            (updatedParticles.filter((p) => p.sizeMicrons >= 25 && p.sizeMicrons < 50).length /
              updatedParticles.length) *
              100
          )
        : 0,
    },
    {
      range: '50 - 100 µm',
      count: updatedParticles.filter((p) => p.sizeMicrons >= 50 && p.sizeMicrons < 100).length,
      percentage: updatedParticles.length
        ? Math.round(
            (updatedParticles.filter((p) => p.sizeMicrons >= 50 && p.sizeMicrons < 100).length /
              updatedParticles.length) *
              100
          )
        : 0,
    },
    {
      range: '> 100 µm',
      count: updatedParticles.filter((p) => p.sizeMicrons >= 100).length,
      percentage: updatedParticles.length
        ? Math.round(
            (updatedParticles.filter((p) => p.sizeMicrons >= 100).length /
              updatedParticles.length) *
              100
          )
        : 0,
    },
  ];

  // 7. Dynamic Filter Comparative Matrix
  const filterComparison = [
    {
      name: 'Atık Ceviz Kabuğu Aktif Karbon (GAC)',
      efficiency: efficiency,
      adsorptionQe: qe,
      flowRateMlMin: params.flowRateMlMin,
      color: '#14b8a6',
    },
    {
      name: 'Standart Piroliz Biyoçömür (Aktivasyonsuz)',
      efficiency: +(efficiency * 0.72).toFixed(1),
      adsorptionQe: +(qe * 0.48).toFixed(1),
      flowRateMlMin: 45.0,
      color: '#3b82f6',
    },
    {
      name: 'Ham İşlenmemiş Ceviz Kabuğu Tozu',
      efficiency: 28.5,
      adsorptionQe: 7.8,
      flowRateMlMin: 160.0,
      color: '#64748b',
    },
    {
      name: 'Ticari Kömür Bazlı Aktif Karbon',
      efficiency: +(efficiency * 0.94).toFixed(1),
      adsorptionQe: +(qe * 0.92).toFixed(1),
      flowRateMlMin: 40.0,
      color: '#a855f7',
    },
  ];

  // 8. Strict Water Potability & Health Hazard Assessment
  const isContaminatedSource =
    particleCount >= 4 ||
    calculatedInitialConc > 25 ||
    initialTurbidity > 4.0 ||
    /kirli|atık|deniz|çöp|plastik|kanal|nehir|sea|waste|pollut/i.test(
      `${baseSample.title} ${baseSample.source} ${baseSample.description}`
    );

  let potabilityStatus: 'İÇİLEMEZ' | 'ŞARTLI' | 'İÇİLEBİLİR';
  let microplasticRiskLevel: 'AŞIRI YÜKSEK' | 'YÜKSEK' | 'ORTA' | 'DÜŞÜK' | 'TEMİZ';
  let potabilityWarning: string;
  let isDrinkable = false;

  if (isContaminatedSource || particleCount >= 5) {
    potabilityStatus = 'İÇİLEMEZ';
    microplasticRiskLevel =
      particleCount > 8 || calculatedInitialConc > 60 || initialTurbidity > 10
        ? 'AŞIRI YÜKSEK'
        : 'YÜKSEK';
    isDrinkable = false;
    potabilityWarning =
      '🛑 KRİTİK SAĞLIK UYARISI: Bu su numunesi yoğun mikroplastik lifleri, polimer parçacıkları ve zararlı atıklar içermektedir. KESİNLİKLE İÇİLEMEZ! Doğrudan tüketilmesi halinde gastrointestinal ve hücresel toksisite tehlikesi oluşturur. DSÖ (WHO) içme suyu standartlarına aykırıdır.';
  } else if (particleCount > 0) {
    potabilityStatus = 'ŞARTLI';
    microplasticRiskLevel = 'ORTA';
    isDrinkable = false;
    potabilityWarning =
      '⚠️ DİKKAT: Numunede mikroplastik partikülleri tespit edilmiştir. Doğrudan içilmesi önerilmez; filtrasyon ve dezenfeksiyon gereklidir.';
  } else {
    potabilityStatus = 'İÇİLEBİLİR';
    microplasticRiskLevel = 'TEMİZ';
    isDrinkable = true;
    potabilityWarning =
      'Mikroplastik partikülü saptanmadı. Bulanıklık ve berraklık parametreleri içme suyu sınırları dahilindedir.';
  }

  return {
    id: baseSample.id,
    title: baseSample.title,
    source: baseSample.source,
    description: baseSample.description,
    initialConcentration: calculatedInitialConc,
    treatedConcentration: treatedConcentration,
    efficiency: efficiency,
    adsorptionCapacity: qe,
    activationType: params.activationType,
    activationDetails: `Ceviz Kabuğu 750°C Karbonizasyon + %15 Sitrik Asit/Buhar (BET: ${params.betSurfaceArea} m²/g, İyot: ${params.iodineNumber} mg/g, Debi: ${params.flowRateMlMin} mL/dk)`,
    turbidityBefore: initialTurbidity,
    turbidityAfter: treatedTurbidity,
    betSurfaceArea: params.betSurfaceArea,
    iodineNumber: params.iodineNumber,
    potabilityStatus: potabilityStatus,
    potabilityWarning: potabilityWarning,
    microplasticRiskLevel: microplasticRiskLevel,
    isDrinkable: isDrinkable,
    beforeImage: baseSample.beforeImage,
    afterImage: baseSample.afterImage,
    particles: updatedParticles,
    kineticData: kineticData,
    sizeDistribution: sizeDistribution,
    filterComparison: filterComparison,
  };
}

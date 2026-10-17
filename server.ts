import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

// Allow large payloads for image uploads (base64)
app.use(express.json({ limit: '35mb' }));
app.use(express.urlencoded({ limit: '35mb', extended: true }));

// Server-side Google GenAI initialization with aistudio-build telemetry header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Response Schema for Gemini 3.8 Flash structured microplastic and water sample analysis
const microplasticAnalysisSchema = {
  type: Type.OBJECT,
  properties: {
    isRelevant: {
      type: Type.BOOLEAN,
      description:
        'Görsel su numunesi, mikroskop görüntüsü, sıvı çözelti, filtre/membran, aktif karbon matrisi veya plastik kirliliği ile ilişkili ise true, tamamen alakasız ise (insan, kedi, köpek, araba, bina, yemek vb.) false.',
    },
    rejectionReason: {
      type: Type.STRING,
      description:
        'Görsel alakasız ise (isRelevant: false) kullanıcıya yönelik kibar ve net Türkçe uyarı mesajı. İlgili ise boş string.',
    },
    sampleTypeTitle: {
      type: Type.STRING,
      description:
        'Numunenin bilimsel başlığı (Örn: "Şehir Şebeke Suyu & Mikro-Filaman Karışımı", "Deniz Kıyı Sediment Suyu", "Sentetik Tekstil Yıkama Atık Suyu", "Temiz Arıtılmış Su Örneği").',
    },
    summaryNote: {
      type: Type.STRING,
      description:
        'Görselde tespit edilen gerçek mikroplastik türleri ve atık ceviz kabuğundan üretilen aktif karbonun gözenek adsorpsiyonu hakkında 2-3 cümlelik Türkçe spektroskopik özet.',
    },
    initialConcentration: {
      type: Type.NUMBER,
      description:
        'Görseldeki gerçek parçacık ve kirlilik yoğunluğuna göre hesaplanan ham su mikroplastik sayısı (adet/ml). Temiz su ise 0-15, az kirli ise 20-80, orta ise 100-250, yoğun kirli ise 300+ adet/ml.',
    },
    treatedConcentration: {
      type: Type.NUMBER,
      description:
        'Atık ceviz kabuğu aktif karbon kolon filtrasyonu sonrası kalan mikroplastik sayısı (adet/ml). Matematiksel olarak initialConcentration * (1 - efficiency/100) olmalıdır.',
    },
    efficiency: {
      type: Type.NUMBER,
      description:
        'Yüzde arıtma verimi (Örn: %96.5). Eğer ham suda mikroplastik yoksa veya temizse %100.0, kirli numunelerde aktif karbon gözenek tutumuna göre %92-%99 arası dinamik hesaplanmalıdır.',
    },
    adsorptionCapacity: {
      type: Type.NUMBER,
      description: 'Aktif karbon adsorpsiyon kapasitesi qe (mg/g, 25.0 ile 54.0 arası).',
    },
    turbidityBefore: {
      type: Type.NUMBER,
      description: 'Ham su tahmini bulanıklık değeri NTU (berrak su ise 0.8-2.0, kirli su ise 10.0-35.0 NTU).',
    },
    turbidityAfter: {
      type: Type.NUMBER,
      description: 'Arıtılmış su berraklık bulanıklık değeri NTU (0.35 ile 0.95 arası standart içme suyu seviyesi).',
    },
    isDrinkable: {
      type: Type.BOOLEAN,
      description:
        'Görseldeki ham suyun içilebilir olup olmadığı. Eğer kirli su, deniz/atık su, plastik atık veya bulanık su ise KESİNLİKLE FALSE olmalıdır!',
    },
    potabilityStatus: {
      type: Type.STRING,
      description:
        'İçilebilirlik durumu: "KESİNLİKLE İÇİLEMEZ (TEHLİKELİ)" veya "İÇME SUYUNA UYGUN DEĞİL" veya "ŞARTLI" veya "İÇİLEBİLİR". Kirli/plastik atıklı sular için KESİNLİKLE "KESİNLİKLE İÇİLEMEZ (TEHLİKELİ)" olmalıdır.',
    },
    potabilityWarning: {
      type: Type.STRING,
      description:
        'İçilebilirlik ve sağlık riski hakkında net Türkçe açıklama. Kirli su için kesinlikle içilemez olduğunu ve toksisite tehlikesini açıkça vurgula.',
    },
    microplasticLevel: {
      type: Type.STRING,
      description:
        'Mikroplastik ve yabancı atık yoğunluk seviyesi: "AŞIRI YÜKSEK (KRİTİK)", "YÜKSEK", "ORTA", "DÜŞÜK", "TEMİZ".',
    },
    particles: {
      type: Type.ARRAY,
      description:
        'Görsel üzerinde GERÇEKÇİ OLARAK GÖRÜNEN mikroplastik parçacıklarının koordinatları ve spektroskopik verileri. Görselde hiç partikül yoksa boş dizi [] döndür.',
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          type: {
            type: Type.STRING,
            description: 'Polimer tipi: PET, PP, PS, PE, PVC veya Naylon',
          },
          customLabel: {
            type: Type.STRING,
            description:
              'Görsel üzerinde görünecek etiket. Örneğin: "PET Filaman", "PP Elyaf", "PS Mikro-Küre", "Naylon Lif", "PE Parçacık"',
          },
          sizeMicrons: {
            type: Type.NUMBER,
            description: 'Parçacık boyutu mikron cinsinden (µm, 15 ile 250 arası).',
          },
          x: {
            type: Type.NUMBER,
            description: 'Görsel üzerindeki gerçek yatay yüzde koordinatı (0 ile 100 arası).',
          },
          y: {
            type: Type.NUMBER,
            description: 'Görsel üzerindeki gerçek dikey yüzde koordinatı (0 ile 100 arası).',
          },
          shape: {
            type: Type.STRING,
            description: 'Şekil: "Lif (Fiber)", "Parçacık (Fragment)", "Küre (Bead)" veya "Film".',
          },
          confidence: {
            type: Type.NUMBER,
            description: 'Tespit güvenilirlik skoru (0.80 ile 0.99 arası).',
          },
          color: {
            type: Type.STRING,
            description:
              'Etiket rengi: PET için "#ec4899", PP için "#f59e0b", PE için "#38bdf8", PS için "#a855f7", Naylon için "#10b981", PVC için "#ef4444"',
          },
          capturedByBiochar: {
            type: Type.BOOLEAN,
            description: 'Aktif karbon gözenekleri tarafından yakalanıp tutulma durumu (çoğunlukla true).',
          },
          notes: {
            type: Type.STRING,
            description: 'Parçacığın kaynağı ve ceviz kabuğu aktif karbon adsorpsiyonu hakkında kısa Türkçe açıklama.',
          },
        },
        required: [
          'id',
          'type',
          'customLabel',
          'sizeMicrons',
          'x',
          'y',
          'shape',
          'confidence',
          'color',
          'capturedByBiochar',
          'notes',
        ],
      },
    },
  },
  required: [
    'isRelevant',
    'rejectionReason',
    'sampleTypeTitle',
    'summaryNote',
    'initialConcentration',
    'treatedConcentration',
    'efficiency',
    'adsorptionCapacity',
    'turbidityBefore',
    'turbidityAfter',
    'isDrinkable',
    'potabilityStatus',
    'potabilityWarning',
    'microplasticLevel',
    'particles',
  ],
};

// API Endpoint: Real AI Image Analysis with Gemini 3.8 Flash
app.post('/api/analyze-image', async (req, res) => {
  try {
    const { imageBase64, mimeType, filename } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'Görsel verisi (imageBase64) bulunamadı.' });
    }

    // Clean potential data URL prefix if present
    const cleanBase64 = imageBase64.includes('base64,')
      ? imageBase64.split('base64,')[1]
      : imageBase64;

    const detectedMime = mimeType || 'image/jpeg';

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: 'GEMINI_API_KEY ortam değişkeni yapılandırılmamış.',
      });
    }

    const promptText = `Sen su arıtma, mikroskopi, polimer kimyası ve aktif karbon adsorpsiyon teknolojisi alanında uzman bir bilimsel yapay zeka analiz motorusun.
Bu görsel, 'CarboVortex AI - Atık Ceviz Kabuğu Aktif Karbon & Yapay Zeka Su Analiz Platformu' için sunulmuştur.

ÖNEMLİ VE KESİN TALİMATLAR:
1. GÖRSEL UYGUNLUK TESPİTİ (isRelevant):
   - Görseli dikkatle incele. Eğer görsel bir su numunesi, mikroskop lamı, sıvı damlacığı, filtre membranı, aktif karbon yatağı, göl/deniz/atık su örneği veya plastik kalıntısı/lif/çöp içeriyorsa isRelevant: true yap.
   - EĞER görsel su, mikroskopi veya sıvı arıtımı ile TAMAMEN ALAKASIZ ise (örneğin kedi, köpek, araba, insan yüzü/selfie, mobilya, sokak, yemek tabağı, oyun ekranı vb.), isRelevant: false yap! rejectionReason alanına kullanıcıyı kırmadan, çok nazik ve açıklayıcı bir Türkçe uyarı yaz: "Yüklediğiniz görsel su numunesi veya mikroskop analizi içermiyor. Doğru bir mikroplastik ve gözenek adsorpsiyon analizi için lütfen bir su bardağı, mikroskop çekimi veya filtre fotoğrafı yükleyiniz." Bu durumda particles listesini [] boş bırak.

2. SU KALİTESİ, İÇİLEBİLİRLİK VE KİRLİLİK DÜZEYİ (HAYATİ KURAL):
   - Kural: KİRLİ SU, DENİZDEKİ PLASTİK ATIKLAR, ÇÖPLER, KANALİZASYON/ATIK SU VEYA YÜKSEK BULANIKLIK KESİNLİKLE İÇİLEMEZ!
   - Kullanıcı kirli bir su, deniz/okyanus plastik atığı, göl çöpü veya bulanık sıvı yüklediğinde:
     * isDrinkable: KESİNLİKLE false!
     * potabilityStatus: "KESİNLİKLE İÇİLEMEZ (TEHLİKELİ)"
     * microplasticLevel: "AŞIRI YÜKSEK (KRİTİK)"
     * potabilityWarning: "Bu görselde yüksek miktarda mikroplastik lifleri, polimer döküntüleri ve yoğun atık su kirliliği tespit edilmiştir. İnsan sağlığı için toksik ve tehlikelidir, İÇİLEMEZ! DSÖ (Dünya Sağlık Örgütü) ve Sağlık Bakanlığı içme suyu standartlarına kesinlikle aykırıdır."
   - ASLA kirli suya veya mikroplastik içeren suya "içilebilir kalitede" DEME!

3. GERÇEKÇİ PARÇACIK TESPİTİ (DİKKAT: EZBERE SAHTE ETİKET KOYMA):
   - Görselde GERÇEKTEN görünen mikro-lifleri, parçacıkları ve lekeleri tespit et.
   - Ezbere veya rastgele koordinat koyma! Gerçekte görselin hangi bölgesinde leke/lif varsa onun (x, y) yüzde konumunu ver.
   - Eğer görselde belirgin mikroplastik parçacığı yoksa, particles listesini BOŞ BIRAK ([]) veya sadece 1-2 şüpheli noktayı işaretle.
   - Boyutlarını mikron (µm) cinsinden tahmin et.
   - Polimer türlerini belirle: PET, PP, PS, PE, PVC, Naylon.

4. DİNAMİK KONSANTRASYON VE VERİM HESAPLAMASI:
   - initialConcentration: Görseldeki parçacık sıklığına göre gerçekçi ham derişimi hesapla (örneğin aşırı kirli/çöplü sularda 70-160 adet/ml).
   - Atık ceviz kabuğundan üretilen granüler aktif karbonun (GAC, BET ~950 m²/g) gözeneklerinde tutunma verimini (%94-%99) hesapla.
   - treatedConcentration: Arıtma sonrası kalan konsantrasyonu formüle göre dinamik olarak hesapla.
   - efficiency: ((initialConcentration - treatedConcentration) / initialConcentration) * 100 olarak ver.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: detectedMime,
              data: cleanBase64,
            },
          },
          {
            text: promptText,
          },
        ],
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: microplasticAnalysisSchema,
        systemInstruction:
          'Sen su analizi, mikroskopi, mikroplastik tespiti ve ceviz kabuğu aktif karbon filtreleme konusunda uzmanlaşmış bir spektroskopi ve görüntü işleme yapay zekasısın. Görseli titizlikle analiz et, asla ezbere veya sabit sahte koordinatlar uydurma. Her zaman verilen JSON şemasına tam uyumlu yanıt ver.',
      },
    });

    const textOutput = response.text;
    if (!textOutput) {
      throw new Error('Modelden yanıt metni alınamadı.');
    }

    const parsedData = JSON.parse(textOutput);
    return res.json(parsedData);
  } catch (error: any) {
    console.error('Gemini image analysis error:', error);
    return res.status(500).json({
      error: error?.message || 'Yapay zeka analiz işlemi sırasında bir hata oluştu.',
    });
  }
});

// Mount Vite or serve built files
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`CarboVortex AI Server running on http://0.0.0.0:${port}`);
  });
}

startServer();

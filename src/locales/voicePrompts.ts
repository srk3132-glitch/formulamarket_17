import type { Lang } from "@/lib/regions";
import { LANGUAGES_26, type LanguageMeta } from "./index";

/**
 * Authentic, culturally resonant voice guidance prompt for each of the 26 Indian languages.
 * Guides farmers through selecting crop, entering quantity & ask price, phone number, and publishing.
 */
export const VOICE_GUIDE_PROMPTS: Record<Lang, string> = {
  // English
  en: "Welcome to the farmer sell portal. Select your crop, set your quantity and ask price, enter your phone number, and publish your harvest directly to buyers with zero commission.",

  // Hindi
  hi: "किसान पोर्टल में आपका स्वागत है। अपनी फसल चुनें, मात्रा और भाव दर्ज करें, मोबाइल नंबर डालें और बिना किसी कमीशन के सीधे खरीदारों तक अपनी फसल पहुँचाएँ।",

  // Bengali
  bn: "কৃষক পোর্টালে আপনাকে স্বাগতম। আপনার ফসল নির্বাচন করুন, পরিমাণ ও দর লিখুন, মোবাইল নম্বর দিন এবং শূন্য কমিশনে সরাসরি ক্রেতাদের কাছে বিক্রি করুন।",

  // Telugu
  te: "రైతు పోర్టల్‌కు స్వాగతం. మీ పంటను ఎంచుకోండి, పరిమాణం మరియు ధర నమోదు చేయండి, మొబైల్ నంబర్ ఇవ్వండి మరియు జీరో కమిషన్‌తో నేరుగా కొనుగోలుదారులకు విక్రయించండి.",

  // Marathi
  mr: "शेतकरी पोर्टलवर आपले स्वागत आहे. आपले पीक निवडा, प्रमाण आणि अपेक्षित दर नोंदवा, मोबाइल क्रमांक टाका आणि शून्य कमिशनवर थेट खरेदीदारांना विका.",

  // Tamil
  ta: "விவசாயிகள் விற்பனை தளத்திற்கு நல்வரவு. உங்கள் பயிரைத் தேர்ந்தெடுத்து, அளவு மற்றும் விலையைக் குறிப்பிட்டு, மொபைல் எண்ணை உள்ளிட்டு கமிஷன் இன்றி நேரடியாக வாங்குபவர்களிடம் விற்பனை செய்யுங்கள்.",

  // Urdu
  ur: "کسان پورٹل میں خوش آمدید۔ اپنی فصل کا انتخاب کریں، مقدار اور قیمت درج کریں، موبائل نمبر ڈالیں اور بغیر کسی کمیشن کے براہ راست خریداروں کو فروخت کریں۔",

  // Gujarati
  gu: "ખેડૂત પોર્ટલ પર આપનું હાર્દિક સ્વાગત છે. તમારો પાક પસંદ કરો, જથ્થો અને ભાવ દાખલ કરો, મોબાઈલ નંબર લખો અને શૂન્ય કમિશન સાથે સીધા ખરીદદારોને વેચો.",

  // Kannada
  kn: "ರೈತರ ಪೋರ್ಟಲ್‌ಗೆ ಸುಸ್ವಾಗತ. ನಿಮ್ಮ ಬೆಳೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ, ಪ್ರಮಾಣ ಮತ್ತು ದರವನ್ನು ನಮೂದಿಸಿ, ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ನೀಡಿ ಮತ್ತು ಶೂನ್ಯ ಕಮಿಷನ್‌ನಲ್ಲಿ ನೇರವಾಗಿ ಖರೀದಿದಾರರಿಗೆ ಮಾರಾಟ ಮಾಡಿ.",

  // Malayalam
  ml: "കർഷക പോർട്ടലിലേക്ക് സ്വാഗതം. നിങ്ങളുടെ വിള തിരഞ്ഞെടുക്കുക, അളവും വിലയും രേഖപ്പെടുത്തുക, മൊബൈൽ നമ്പർ നൽകി കമ്മീഷനില്ലാതെ നേരിട്ട് വാങ്ങുന്നവർക്ക് വിൽക്കുക.",

  // Odia
  or: "କୃଷକ ପୋର୍ଟାଲକୁ ଆପଣଙ୍କୁ ସ୍ୱାଗତ। ନିଜ ଫସଲ ବାଛନ୍ତୁ, ପରିମାଣ ଏବଂ ବିକ୍ରି ଦର ଦିଅନ୍ତୁ, ମୋବାଇଲ୍ ନମ୍ବର ଦେଇ କୌଣସି କମିଶନ ବିନା ସିଧାସଳଖ ଗ୍ରାହକଙ୍କୁ ବିକ୍ରି କରନ୍ତୁ।",

  // Punjabi
  pa: "ਕਿਸਾਨ ਪੋਰਟਲ ਵਿੱਚ ਤੁਹਾਡਾ ਸੁਆਗਤ ਹੈ। ਆਪਣੀ ਫਸਲ ਚੁਣੋ, ਮਾਤਰਾ ਅਤੇ ਮੁੱਲ ਦਰਜ ਕਰੋ, ਮੋਬਾਈਲ ਨੰਬਰ ਭਰੋ ਅਤੇ ਬਿਨਾਂ ਕਿਸੇ ਕਮਿਸ਼ਨ ਦੇ ਸਿੱਧੇ ਖਰੀਦਦਾਰਾਂ ਨੂੰ ਵੇਚੋ।",

  // Assamese
  as: "কৃষক প’ৰ্টেললৈ আপোনাক স্বাগতম। আপোনাৰ শস্য বাছনি কৰক, পৰিমাণ আৰু মূল্য দিয়ক, ম’বাইল নম্বৰ দিয়ক আৰু শূন্য কমিছনত পোনপটীয়াকৈ ক্ৰেতাক বিক্ৰী কৰক।",

  // Maithili
  mai: "किसान पोर्टल मे अहाँक स्वागत अछि। अपन फसल चुनू, मात्रा आओर दर दर्ज करू, मोबाइल नंबर भरू आ बिना कोनो कमीशनक सीधे खरीदार कें बेचू।",

  // Santali
  sat: "ᱠᱤᱥᱟᱹᱬ ᱯᱳᱨᱴᱟᱞ ᱨᱮ ᱥᱟᱹᱜᱩᱱ ᱫᱟᱨᱟᱢ। ᱟᱢᱟᱜ ᱯᱷᱚᱥᱚᱞ ᱵᱟᱪᱷᱟᱣ ᱢᱮ, ᱞᱮᱠᱷᱟ ᱟᱨ ᱫᱟᱢ ᱮᱢ ᱢᱮ, ᱢᱚᱵᱟᱭᱤᱞ ᱱᱚᱢᱵᱚᱨ ᱮᱢ ᱠᱟᱛᱮ ᱵᱤᱱᱟᱹ ᱠᱚᱢᱤᱥᱚᱱ ᱛᱮ ᱟᱹᱠᱷᱨᱤᱧ ᱢᱮ।",

  // Kashmiri
  ks: "کِسان پورٹلَس منٛز خوش آمدید۔ پنٕنؠ فصل چُھنو، تعداد تہٕ قێمت دَرٕج کٔرِو، موبائل نَمبَر لؠکھِو تہٕ بِلا کمیشن سؠدھے خریدارن بٕچِو۔",

  // Nepali
  ne: "किसान पोर्टलमा तपाईंलाई स्वागत छ। आफ्नो बाली छान्नुहोस्, मात्रा र मूल्य राख्नुहोस्, मोबाइल नम्बर भर्नुहोस् र शून्य कमिसनमा सिधै खरिदकर्तालाई बेच्नुहोस्।",

  // Sindhi
  sd: "ڪسان پورٽل ۾ ڀلي ڪري آيا. پنهنجو فصل چونڊيو، مقدار ۽ اگهه داخل ڪريو، موبائل نمبر لکو ۽ بغير ڪنهن ڪميشن جي سڌو سنئون خريدارن کي وڪرو ڪريو.",

  // Konkani
  kok: "शेतकरी पोर्टलार तुमकां येवकार। तुमचें पीक विंचात, प्रमाण आनी दर बरोवन्, मोबाइल नंबर दियात आनी कसलेय कमिशन नासतना थेट गिरायकांक विका.",

  // Dogri
  doi: "किसान पोर्टल पर तुह् दा सुआगत ऐ। अपनी फसल चुनो, मात्रा ते मुल्ल पाओ, मोबाइल नंबर भरो ते बिना किश कमीशन दे सीधे ग्राहकें गी बेचो।",

  // Manipuri (Meitei)
  mni: "লৌমীগী পোৰ্তেলদা তরাম্না ওকচরি। নখোয়গী মহৈ-মরোং খনবীযু, চাং অমসুং মমল থারকউ, মোবাইল নম্বর চনবীদুনা কমিচন য়াওদনা হকথেংননা য়োল্লু।",

  // Bodo
  brx: "आबादारी पोर्टलआव नोंथांखौ बरायबाय। नोंथांनि फसलखौ सायख', बिबां आरो बेसेन होनानै थोंजोंनो बायग्राफोरनो फान।",

  // Sanskrit
  sa: "कृषक प्रवेशद्वारे भवतां स्वागतम्। स्वशस्यं चिनुत, परिमाणं मूल्यं च प्रविश्य, दूरभाषसंख्यां दत्त्वा साक्षात् क्रेतृभ्यः विक्रयणं कुरुत।",

  // Bhojpuri
  bho: "किसान पोर्टल में राउर स्वागत बा। आपन फसल चुनीं, मात्रा आ भाव डालीं, मोबाइल नंबर दर्ज करीं आ बिना कवनो दलाली के सीधे खरीदारन के बेचीं।",

  // Rajasthani
  raj: "किसान पोर्टल पर आपरो घणो स्वागत है। आपरी फसल चुणो, मात्रा अर भाव लगाओ, मोबाइल नंबर दर्ज करो अर बिना दलाली सीधो खरीदार ने बेचो।",

  // Tulu
  tcy: "ರೈತೆರೆ ಪೋರ್ಟಲ್‌ಗ್ ಸ್ವಾಗತ. ಈರೆನ ಬುಲೆನ್ ಆರಿಸಲೆ, ಪರಿಮಾಣ ಬೊಕ್ಕ ಬಿಲೆ ಬರೆದ್, ಮೊಬೈಲ್ ನಂಬರ್ ಕೊರ್ದು ಕಮಿಷನ್ ಇದ್ಯಾಂತೆ ನೇರವಾದ್ ಗಿರಾಕಿಲೆಗ್ ಮಾರ್ಲೆ.",
};

/**
 * Short, crisp welcome spoken when a language is selected or auto-detected.
 */
export const VOICE_WELCOME_PROMPTS: Record<Lang, string> = {
  en: "English language selected. Welcome to the farmer portal.",
  hi: "हिन्दी भाषा चुनी गई है। किसान पोर्टल में आपका स्वागत है।",
  bn: "বাংলা ভাষা নির্বাচিত হয়েছে। কৃষক পোর্টালে স্বাগতম।",
  te: "తెలుగు భాష ఎంపిక చేయబడింది. రైతు పోర్టల్‌కు స్వాగతం.",
  mr: "मराठी भाषा निवडली गेली आहे. शेतकरी पोर्टलवर आपले स्वागत आहे.",
  ta: "தமிழ் மொழி தேர்ந்தெடுக்கப்பட்டது. விவசாயிகள் தளத்திற்கு நல்வரவு.",
  ur: "اردو زبان منتخب کر لی گئی ہے۔ کسان پورٹل میں خوش آمدید۔",
  gu: "ગુજરાતી ભાષા પસંદ કરવામાં આવી છે. ખેડૂત પોર્ટલ પર આપનું સ્વાગત છે.",
  kn: "ಕನ್ನಡ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆ ಮಾಡಲಾಗಿದೆ. ರೈತರ ಪೋರ್ಟಲ್‌ಗೆ ಸುಸ್ವಾಗತ.",
  ml: "മലയാളം ഭാഷ തിരഞ്ഞെടുത്തു. കർഷക പോർട്ടലിലേക്ക് സ്വാഗതം.",
  or: "ଓଡ଼ିଆ ଭାଷା ଚୟନ କରାଗଲା। କୃଷକ ପୋର୍ଟାଲକୁ ସ୍ୱାଗତ।",
  pa: "ਪੰਜਾਬੀ ਭਾਸ਼ਾ ਚੁਣੀ ਗਈ ਹੈ। ਕਿਸਾਨ ਪੋਰਟਲ ਵਿੱਚ ਸੁਆਗਤ ਹੈ।",
  as: "অসমীয়া ভাষা বাছনি কৰা হ’ল। কৃষক প’ৰ্টেললৈ স্বাগতম।",
  mai: "मैथिली भाषा चुनल गेल। किसान पोर्टल मे अहाँक स्वागत अछि।",
  sat: "ᱥᱟᱱᱛᱟᱲᱤ ᱯᱟᱹᱨᱥᱤ ᱵᱟᱪᱷᱟᱣ ᱮᱱᱟ। ᱠᱤᱥᱟᱹᱬ ᱯᱳᱨᱴᱟᱞ ᱨᱮ ᱥᱟᱹᱜᱩᱱ ᱫᱟᱨᱟᱢ।",
  ks: "کٲشُر زَبان گٔیہِ مُنتَخَب۔ کِسان پورٹلَس منٛز خوش آمدید۔",
  ne: "नेपाली भाषा छानियो। किसान पोर्टलमा स्वागत छ।",
  sd: "سنڌي ٻولي چونڊجي وئي. ڪسان پورٽل ۾ ڀلي ڪري آيا.",
  kok: "कोंकणी भाषा निवडल्या। शेतकरी पोर्टलार तुमकां येवकार।",
  doi: "डोगरी भाषा चुनी गेई। किसान पोर्टल पर तुह् दा सुआगत ऐ।",
  mni: "মৈতৈলোন্ খল্লে। লৌমীগী পোৰ্তেলদা তরাম্না ওকচরি।",
  brx: "बर' रावखौ सायख'बाय। आबादारी पोर्टलआव बरायबाय।",
  sa: "संस्कृतभाषा चिता। कृषक प्रवेशद्वारे स्वागतम्।",
  bho: "भोजपुरी भाषा चुनल गइल। किसान पोर्टल में राउर स्वागत बा।",
  raj: "राजस्थानी भाषा चुणी गी। किसान पोर्टल पर आपरो स्वागत है।",
  tcy: "ತುಳು ಭಾಷೆನ್ ಆರಿಸಾಯ್ಂಡ್. ರೈತೆರೆ ಪೋರ್ಟಲ್‌ಗ್ ಸ್ವಾಗತ.",
};

/**
 * Intelligent Language Detector:
 * Parses spoken speech transcript from Web Speech API and recognizes the spoken Indian language.
 * Uses 3 layers of recognition:
 * 1. Unicode Script Range Detection (Telugu, Tamil, Kannada, Malayalam, Gujarati, Gurmukhi, Odia, Bengali, Urdu/Arabic, Ol Chiki, Meitei, Devanagari)
 * 2. Explicit Language Mention & Commands (e.g. "telugu", "speak in hindi", "tamil", "bengali", "marathi", etc.)
 * 3. Romanized / Phonetic Indian Greetings, Agricultural terms, and Regional Vocabulary
 */
export function detectLanguageFromTranscript(rawTranscript: string): Lang | null {
  if (!rawTranscript || !rawTranscript.trim()) return null;
  const transcript = rawTranscript.trim();
  const lower = transcript.toLowerCase();

  // -------------------------------------------------------------
  // LAYER 1: UNICODE SCRIPT DETECTION (100% High Precision Matches)
  // -------------------------------------------------------------

  // Telugu: \u0C00-\u0C7F
  if (/[\u0C00-\u0C7F]/.test(transcript)) return "te";

  // Tamil: \u0B80-\u0BFF
  if (/[\u0B80-\u0BFF]/.test(transcript)) return "ta";

  // Kannada & Tulu: \u0C80-\u0CFF
  if (/[\u0C80-\u0CFF]/.test(transcript)) {
    if (/(ತುಳು|ಸೊಲ್ಮೆಲು|ಎಂಚಿನ|ಕಾರ್ಲ|ಕುಡ್ಲ)/i.test(transcript)) return "tcy";
    return "kn";
  }

  // Malayalam: \u0D00-\u0D7F
  if (/[\u0D00-\u0D7F]/.test(transcript)) return "ml";

  // Gujarati: \u0A80-\u0AFF
  if (/[\u0A80-\u0AFF]/.test(transcript)) return "gu";

  // Gurmukhi (Punjabi): \u0A00-\u0A7F
  if (/[\u0A00-\u0A7F]/.test(transcript)) return "pa";

  // Odia: \u0B00-\u0B7F
  if (/[\u0B00-\u0B7F]/.test(transcript)) return "or";

  // Ol Chiki (Santali): \u1C50-\u1C7F
  if (/[\u1C50-\u1C7F]/.test(transcript)) return "sat";

  // Meitei Mayek (Manipuri): \uABC0-\uABFF
  if (/[\uABC0-\uABFF]/.test(transcript)) return "mni";

  // Bengali / Assamese / Manipuri (Eastern Nagari script \u0980-\u09FF)
  if (/[\u0980-\u09FF]/.test(transcript)) {
    // Assamese specific characters 'ৰ' (U+09F0) or 'ৱ' (U+09F1) or words
    if (/[\u09F0\u09F1]|অসমীয়া|নমস্কাৰ|কেনেকৈ|বতাহ/i.test(transcript)) return "as";
    if (/(মৈতৈ|লৌমী|পোৰ্তেল|খোৰুমজৰী)/i.test(transcript)) return "mni";
    return "bn";
  }

  // Perso-Arabic (Urdu, Kashmiri, Sindhi): \u0600-\u06FF
  if (/[\u0600-\u06FF]/.test(transcript)) {
    if (/(کٲشُر|کشمیر|سلام|وارَہ)/i.test(transcript)) return "ks";
    if (/(سنڌي|ڀلي|ڪسان|چوان)/i.test(transcript)) return "sd";
    return "ur";
  }

  // Devanagari script: \u0900-\u097F (used by Hindi, Marathi, Nepali, Bhojpuri, Maithili, Rajasthani, Sanskrit, Konkani, Dogri, Bodo)
  if (/[\u0900-\u097F]/.test(transcript)) {
    // Marathi specific markers
    if (/(आहे|नाही|शेतकरी|कांदा|बटाटा|नमस्कार|भाजी|टोमॅटो|दर|विकायचे|माझे|कसं|करा|होय|काय)/i.test(transcript)) return "mr";
    // Nepali specific markers
    if (/(छ|छैन|हो|किसान|नमस्ते|बाली|हुन्छ|कति|भाउ|गर्नुहोस्)/i.test(transcript)) return "ne";
    // Bhojpuri markers
    if (/(बा|बाटे|रउवा|का|कइसे|हमार|तोहार|खेती|भोजपुरी|गोड़ लागतानी|बेचे के बा)/i.test(transcript)) return "bho";
    // Maithili markers
    if (/(अछि|नहि|अहाँ|हमर|तोहर|मैथिली|प्रणाम|किएक|अहाँक)/i.test(transcript)) return "mai";
    // Rajasthani markers
    if (/(म्हारी|थारी|घणो|राम राम|खम्मा घणी|कोनी|राजस्थानी|मारवाड़ी|भाव बतावो)/i.test(transcript)) return "raj";
    // Sanskrit markers
    if (/(अस्ति|भवति|कृषक|स्वागतम्|नमः|शस्यम्|संस्कृत|विक्रयणम्)/i.test(transcript)) return "sa";
    // Konkani markers
    if (/(आसा|ना|तुमकां|पीक|कोंकणी|येवकार|गिरायक)/i.test(transcript)) return "kok";
    // Dogri markers
    if (/(तुह् दा|ऐ|मिगी|डोगरी|सुआगत|मुल्ल)/i.test(transcript)) return "doi";
    // Bodo in Devanagari
    if (/(आबादारी|नोंथां|सायख|बर'|बिबां|बायग्रा)/i.test(transcript)) return "brx";
    // Default Devanagari to Hindi
    return "hi";
  }

  // -------------------------------------------------------------
  // LAYER 2: EXPLICIT LANGUAGE NAMES & COMMANDS
  // (e.g. "telugu", "speak in tamil", "change language to marathi")
  // -------------------------------------------------------------
  const langDirectMatches: Array<{ pattern: RegExp; lang: Lang }> = [
    { pattern: /\b(telugu|andhra|telangana)\b/i, lang: "te" },
    { pattern: /\b(tamil|tamizh)\b/i, lang: "ta" },
    { pattern: /\b(hindi|hindustani)\b/i, lang: "hi" },
    { pattern: /\b(marathi|maharashtra)\b/i, lang: "mr" },
    { pattern: /\b(bengali|bangla)\b/i, lang: "bn" },
    { pattern: /\b(kannada|karnataka)\b/i, lang: "kn" },
    { pattern: /\b(malayalam|kerala)\b/i, lang: "ml" },
    { pattern: /\b(gujarati|gujrat)\b/i, lang: "gu" },
    { pattern: /\b(punjabi|punjab)\b/i, lang: "pa" },
    { pattern: /\b(odia|oriya|odisha)\b/i, lang: "or" },
    { pattern: /\b(urdu)\b/i, lang: "ur" },
    { pattern: /\b(assamese|asomiya|oxomiya|assam)\b/i, lang: "as" },
    { pattern: /\b(maithili)\b/i, lang: "mai" },
    { pattern: /\b(bhojpuri|bihari)\b/i, lang: "bho" },
    { pattern: /\b(rajasthani|marwari)\b/i, lang: "raj" },
    { pattern: /\b(santali|santhali)\b/i, lang: "sat" },
    { pattern: /\b(kashmiri|koshur)\b/i, lang: "ks" },
    { pattern: /\b(nepali)\b/i, lang: "ne" },
    { pattern: /\b(sindhi)\b/i, lang: "sd" },
    { pattern: /\b(konkani|goa)\b/i, lang: "kok" },
    { pattern: /\b(dogri)\b/i, lang: "doi" },
    { pattern: /\b(manipuri|meitei)\b/i, lang: "mni" },
    { pattern: /\b(bodo)\b/i, lang: "brx" },
    { pattern: /\b(sanskrit)\b/i, lang: "sa" },
    { pattern: /\b(tulu|kudla|mangalore)\b/i, lang: "tcy" },
    { pattern: /\b(english|angrezi)\b/i, lang: "en" },
  ];

  for (const item of langDirectMatches) {
    if (item.pattern.test(lower)) return item.lang;
  }

  // -------------------------------------------------------------
  // LAYER 3: REGIONAL PHONETICS, GREETINGS & AGRICULTURAL TERMS
  // -------------------------------------------------------------
  const phoneticMatches: Array<{ pattern: RegExp; lang: Lang }> = [
    // Telugu
    { pattern: /\b(namaskaram|bagunnara|tamata|ullipayalu|mirapa|biyyam|kandulu|raithu|ammali|dharalu|manchi|dhanyavadalu|polam|dhanyam)\b/i, lang: "te" },
    // Tamil
    { pattern: /\b(vanakkam|thakkali|vengayam|arisi|paruppu|vivasayi|vilai|virka|nandri|eppadi irukkinga|santhai|payir)\b/i, lang: "ta" },
    // Kannada
    { pattern: /\b(namaskara|hegidhdhira|eerulli|alugadde|tometo|akki|raita|beleya|marata|danyavada|bega|bili)\b/i, lang: "kn" },
    // Malayalam
    { pattern: /\b(namaskaram|thakkali|ulli|karshakan|vila|vilkan|nandi|engane undu|ari|nellu)\b/i, lang: "ml" },
    // Marathi
    { pattern: /\b(kasa kay|kanda|batata|shetkari|vikaycha|dhanyavad|bajarbhav|bhav kay|tandul|gahu)\b/i, lang: "mr" },
    // Bengali
    { pattern: /\b(nomoshkar|kemon achen|peyaj|krishak|daam|bikri|dhonnobad|tometo|dhan|alu)\b/i, lang: "bn" },
    // Gujarati
    { pattern: /\b(kem cho|majama|khedut|dungri|bataka|tameta|vechvu|aabhar|bhaav|ghau)\b/i, lang: "gu" },
    // Punjabi
    { pattern: /\b(sat sri akal|kiddan|kisan|kanak|vechna|chawal|dhanwad|mandi da mul|aalu)\b/i, lang: "pa" },
    // Odia
    { pattern: /\b(kemiti achanti|piaja|krushaka|chaula|dhanyabad|dara ketiki|basa)\b/i, lang: "or" },
    // Urdu
    { pattern: /\b(adab|kya haal hai|shukriya|farokht|qeemat|mandi|janaab|bechna hai)\b/i, lang: "ur" },
    // Bhojpuri
    { pattern: /\b(ka haal ba|pranam|raua|batawa|bechal|khet|hamar)\b/i, lang: "bho" },
    // Rajasthani
    { pattern: /\b(khamma ghani|ram ram sa|ghano chokho|bhaav batao|tharo)\b/i, lang: "raj" },
    // Tulu
    { pattern: /\b(solmelu|yenchina kathe|marle|bule)\b/i, lang: "tcy" },
    // Assamese
    { pattern: /\b(nomoskar|kene ase|bilahi|khekok|dhonnyobad|bajar)\b/i, lang: "as" },
    // Nepali
    { pattern: /\b(sanchai hunuhunchha|dhanyabad|kisan|bali|bhav)\b/i, lang: "ne" },
    // English agricultural keywords
    { pattern: /\b(farmer|crop|harvest|quintal|tomato|potato|onion|price|market|sell)\b/i, lang: "en" },
    // Hindi default
    { pattern: /\b(namaste|kisan|aloo|tamatar|pyaz|gehu|daam|bhav|bechna|dhanyawad)\b/i, lang: "hi" },
  ];

  for (const item of phoneticMatches) {
    if (item.pattern.test(lower)) return item.lang;
  }

  return null;
}

/**
 * Finds the best matching Web Speech API SpeechSynthesisVoice for a target language.
 * Handles Windows (Microsoft Voices), Chrome/Android (Google Voices), and Apple (Siri).
 * Includes dialect fallbacks for Devanagari & regional Indic languages.
 */
export function findBestVoice(
  voices: SpeechSynthesisVoice[],
  targetLangCode: Lang,
  speechLang: string,
): SpeechSynthesisVoice | null {
  if (!voices || voices.length === 0) return null;

  const code = targetLangCode.toLowerCase();
  const sLang = speechLang.toLowerCase().replace("_", "-");

  // 1. Exact speechLang match (e.g. "te-in", "hi-in", "ta-in")
  let voice = voices.find((v) => v.lang.toLowerCase().replace("_", "-") === sLang);
  if (voice) return voice;

  // 2. Lang code prefix match (e.g. "te", "ta", "hi", "mr", "bn")
  voice = voices.find((v) => v.lang.toLowerCase().replace("_", "-").startsWith(code));
  if (voice) return voice;

  // 3. Voice name match (e.g. "Telugu", "Hindi", "Tamil", "Marathi")
  const meta = LANGUAGES_26.find((l) => l.code === targetLangCode);
  if (meta) {
    const englishName = meta.name.toLowerCase();
    const nativeName = meta.nativeName.toLowerCase();
    voice = voices.find(
      (v) =>
        v.name.toLowerCase().includes(englishName) ||
        v.name.toLowerCase().includes(nativeName),
    );
    if (voice) return voice;
  }

  // 4. Regional Linguistic TTS Fallbacks (so Devanagari dialects use authentic Indian phonetic voices)
  if (["bho", "mai", "raj", "doi", "sa", "brx", "ne"].includes(code)) {
    voice = voices.find((v) => v.lang.toLowerCase().startsWith("hi"));
    if (voice) return voice;
  }
  if (code === "kok") {
    voice = voices.find(
      (v) => v.lang.toLowerCase().startsWith("mr") || v.lang.toLowerCase().startsWith("hi"),
    );
    if (voice) return voice;
  }
  if (code === "tcy") {
    voice = voices.find((v) => v.lang.toLowerCase().startsWith("kn"));
    if (voice) return voice;
  }
  if (code === "ks" || code === "sd") {
    voice = voices.find((v) => v.lang.toLowerCase().startsWith("ur"));
    if (voice) return voice;
  }
  if (code === "mni") {
    voice = voices.find((v) => v.lang.toLowerCase().startsWith("bn"));
    if (voice) return voice;
  }

  // 5. English India fallback
  if (code === "en") {
    voice = voices.find(
      (v) =>
        v.lang.toLowerCase().includes("en-in") ||
        v.name.toLowerCase().includes("india") ||
        v.lang.toLowerCase().startsWith("en"),
    );
    if (voice) return voice;
  }

  return null;
}

export type Lang = "en" | "hi" | "ta" | "te" | "kn" | "ml" | "mr" | "bn" | "gu" | "pa" | "or";

export type Place = { id: string; name: string };
export type District = { id: string; name: string; places: Place[] };
export type State = { id: string; name: string; districts: District[] };

export const STATES: State[] = [
  {
    id: "tn",
    name: "Tamil Nadu",
    districts: [
      {
        id: "ariyalur",
        name: "Ariyalur",
        places: [
          { id: "ariyalur-town", name: "Ariyalur Cashew & Maize Mandi" },
          { id: "jayankondam", name: "Jayankondam Groundnut Market" },
          { id: "sendurai", name: "Sendurai Agro Yard" },
        ],
      },
      {
        id: "chengalpattu",
        name: "Chengalpattu",
        places: [
          { id: "chengalpattu-market", name: "Chengalpattu Agro Yard" },
          { id: "maduranthakam", name: "Maduranthakam Paddy Market" },
          { id: "tambaram", name: "Tambaram Suburban Vegetable Terminal" },
        ],
      },
      {
        id: "chennai",
        name: "Chennai",
        places: [
          { id: "koyambedu", name: "Koyambedu Wholesale Market Complex (KWMC)" },
          { id: "kothawal-chavadi", name: "Kothawal Chavadi Spice & Pulse Market" },
          { id: "madhavaram", name: "Madhavaram Agro & Truck Terminal" },
        ],
      },
      {
        id: "coimbatore",
        name: "Coimbatore",
        places: [
          { id: "kurumbapakkam", name: "Kurumbapakkam" },
          { id: "mettupalayam", name: "Mettupalayam Agro Yard" },
          { id: "pollachi", name: "Pollachi Coconut & Veg Mandi" },
          { id: "sulur", name: "Sulur Market" },
          { id: "kinathukadavu", name: "Kinathukadavu Tomato Hub" },
        ],
      },
      {
        id: "cuddalore",
        name: "Cuddalore",
        places: [
          { id: "panruti", name: "Panruti Jackfruit & Cashew Capital" },
          { id: "cuddalore-ot", name: "Cuddalore Old Town Agro Market" },
          { id: "chidambaram", name: "Chidambaram Paddy & Sesame Mandi" },
        ],
      },
      {
        id: "dharmapuri",
        name: "Dharmapuri",
        places: [
          { id: "dharmapuri-market", name: "Dharmapuri Mango & Tomato Yard" },
          { id: "palacode", name: "Palacode Tomato Mandi" },
          { id: "harur", name: "Harur Millet & Grain Yard" },
          { id: "pennagaram", name: "Pennagaram Agri Yard" },
        ],
      },
      {
        id: "dindigul",
        name: "Dindigul",
        places: [
          { id: "oddanchatram", name: "Oddanchatram Central Vegetable Market" },
          { id: "dindigul-apmc", name: "Dindigul Onion Market Yard" },
          { id: "palani", name: "Palani Agro Mandi" },
          { id: "kodaikanal-hills", name: "Kodaikanal Hill Garlic & Veg Yard" },
        ],
      },
      {
        id: "erode",
        name: "Erode",
        places: [
          { id: "perundurai", name: "Perundurai Turmeric Complex" },
          { id: "erode-apmc", name: "Erode Semmampalayam Market" },
          { id: "bhavani", name: "Bhavani Agro Mandi" },
          { id: "gobichettipalayam", name: "Gobichettipalayam Banana Yard" },
          { id: "sathyamangalam", name: "Sathyamangalam Flower & Veg Market" },
        ],
      },
      {
        id: "kallakurichi",
        name: "Kallakurichi",
        places: [
          { id: "kallakurichi-paddy", name: "Kallakurichi Paddy Market" },
          { id: "ulundurpet", name: "Ulundurpet Groundnut Yard" },
          { id: "sankarapuram", name: "Sankarapuram Sugarcane & Grain Mandi" },
        ],
      },
      {
        id: "kanchipuram",
        name: "Kanchipuram",
        places: [
          { id: "kanchipuram-apmc", name: "Kanchipuram Agro Yard" },
          { id: "uthiramerur", name: "Uthiramerur Paddy & Pulses Market" },
          { id: "sriperumbudur", name: "Sriperumbudur Commercial Hub" },
        ],
      },
      {
        id: "kanyakumari",
        name: "Kanyakumari",
        places: [
          { id: "nagercoil", name: "Nagercoil Vadasery Banana Market" },
          { id: "thuckalay", name: "Thuckalay Coconut & Pepper Yard" },
          { id: "marthandam", name: "Marthandam Honey & Spices Mandi" },
        ],
      },
      {
        id: "karur",
        name: "Karur",
        places: [
          { id: "karur-market", name: "Karur Drumstick & Banana Market" },
          { id: "kulithalai", name: "Kulithalai Paddy & Betel Yard" },
          { id: "aravakurichi", name: "Aravakurichi Drumstick & Glory Lily Mandi" },
        ],
      },
      {
        id: "krishnagiri",
        name: "Krishnagiri",
        places: [
          { id: "hosur", name: "Hosur International Floriculture & Veg Terminal" },
          { id: "krishnagiri-mango", name: "Krishnagiri Totapuri Mango Yard" },
          { id: "pochampalli", name: "Pochampalli Agro Market" },
        ],
      },
      {
        id: "madurai",
        name: "Madurai",
        places: [
          { id: "madurai-central", name: "Madurai Mattuthavani Central Market" },
          { id: "usilampatti", name: "Usilampatti Market Yard" },
          { id: "melur", name: "Melur Agro Market" },
          { id: "vadipatti", name: "Vadipatti Veg Yard" },
          { id: "tirumangalam", name: "Tirumangalam Grain Mandi" },
        ],
      },
      {
        id: "mayiladuthurai",
        name: "Mayiladuthurai",
        places: [
          { id: "mayiladuthurai-paddy", name: "Mayiladuthurai Delta Paddy Mandi" },
          { id: "sirkazhi", name: "Sirkazhi Grain Market" },
          { id: "tharangambadi", name: "Tharangambadi Coconut & Agro Yard" },
        ],
      },
      {
        id: "nagapattinam",
        name: "Nagapattinam",
        places: [
          { id: "nagapattinam-market", name: "Nagapattinam Paddy & Marine Yard" },
          { id: "kilvelur", name: "Kilvelur Delta Grain Yard" },
          { id: "vedaranyam", name: "Vedaranyam Salt & Agro Produce Market" },
        ],
      },
      {
        id: "namakkal",
        name: "Namakkal",
        places: [
          { id: "namakkal-poultry", name: "Namakkal Maize & Feed Terminal" },
          { id: "tiruchengode", name: "Tiruchengode Groundnut & Sesame Mandi" },
          { id: "rasipuram", name: "Rasipuram Sago & Tapioca Market" },
        ],
      },
      {
        id: "nilgiris",
        name: "The Nilgiris",
        places: [
          { id: "ooty", name: "Udhagamandalam (Ooty) Vegetable Yard" },
          { id: "coonoor", name: "Coonoor Tea & Spices Auction" },
          { id: "kotagiri", name: "Kotagiri Carrot & Veg Mandi" },
          { id: "gudalur", name: "Gudalur Pepper & Ginger Market" },
        ],
      },
      {
        id: "perambalur",
        name: "Perambalur",
        places: [
          { id: "perambalur-shallots", name: "Perambalur Small Onion (Shallots) Hub" },
          { id: "veppanthattai", name: "Veppanthattai Cotton & Maize Market" },
          { id: "kunnam", name: "Kunnam Grain Yard" },
        ],
      },
      {
        id: "pudukkottai",
        name: "Pudukkottai",
        places: [
          { id: "pudukkottai-market", name: "Pudukkottai Grain & Groundnut Yard" },
          { id: "aranthangi", name: "Aranthangi Paddy Market" },
          { id: "alangudi", name: "Alangudi Cashew & Agri Mandi" },
        ],
      },
      {
        id: "ramanathapuram",
        name: "Ramanathapuram",
        places: [
          { id: "paramakudi", name: "Paramakudi Chilli & Cotton Yard" },
          { id: "ramanathapuram-chilli", name: "Ramanathapuram Mundu Chilli Market" },
          { id: "kamuthi", name: "Kamuthi Groundnut & Grain Market" },
        ],
      },
      {
        id: "ranipet",
        name: "Ranipet",
        places: [
          { id: "walajapet", name: "Walajapet Agro Produce Yard" },
          { id: "arakkonam", name: "Arakkonam Grain Market" },
          { id: "arcot", name: "Arcot Paddy & Vegetable Mandi" },
        ],
      },
      {
        id: "salem",
        name: "Salem",
        places: [
          { id: "salem-market", name: "Salem APMC Market Yard" },
          { id: "attur", name: "Attur Sago & Tapioca Mandi" },
          { id: "mettur", name: "Mettur Agro Market" },
          { id: "omalur", name: "Omalur Vegetable Yard" },
          { id: "sankagiri", name: "Sankagiri Cattle & Agri Yard" },
        ],
      },
      {
        id: "sivaganga",
        name: "Sivaganga",
        places: [
          { id: "karaikudi", name: "Karaikudi Chettinad Agro Market" },
          { id: "sivaganga-market", name: "Sivaganga Grain & Chilli Yard" },
          { id: "devakottai", name: "Devakottai Paddy Market" },
        ],
      },
      {
        id: "tenkasi",
        name: "Tenkasi",
        places: [
          { id: "tenkasi", name: "Tenkasi Border Agro Mandi" },
          { id: "sankarankovil", name: "Sankarankovil Cotton & Chilli Yard" },
          { id: "alangulam", name: "Alangulam Vegetable Hub" },
        ],
      },
      {
        id: "thanjavur",
        name: "Thanjavur",
        places: [
          { id: "thanjavur-paddy", name: "Thanjavur Delta Paddy Mandi" },
          { id: "kumbakonam", name: "Kumbakonam Betel & Grain Yard" },
          { id: "pattukkottai", name: "Pattukkottai Coconut Market" },
          { id: "thiruvaiyaru", name: "Thiruvaiyaru Agro Yard" },
        ],
      },
      {
        id: "theni",
        name: "Theni",
        places: [
          { id: "cumbum", name: "Cumbum Valley Grape & Banana Terminal" },
          { id: "theni-market", name: "Theni Cardamom & Veg Market" },
          { id: "periyakulam", name: "Periyakulam Mango & Citrus Mandi" },
        ],
      },
      {
        id: "thoothukudi",
        name: "Thoothukudi",
        places: [
          { id: "kovilpatti", name: "Kovilpatti Black Soil Chilli & Millet Market" },
          { id: "thoothukudi-market", name: "Thoothukudi Agro & Salt Produce Yard" },
          { id: "tiruchendur", name: "Tiruchendur Coconut & Banana Market" },
        ],
      },
      {
        id: "trichy",
        name: "Tiruchirappalli",
        places: [
          { id: "gandhi-market", name: "Gandhi Market Trichy" },
          { id: "thuraiyur", name: "Thuraiyur Onion & Veg Market" },
          { id: "manapparai", name: "Manapparai Agri & Cattle Yard" },
          { id: "lalgudi", name: "Lalgudi Paddy Mandi" },
        ],
      },
      {
        id: "tirunelveli",
        name: "Tirunelveli",
        places: [
          { id: "tirunelveli-apmc", name: "Tirunelveli Nainarkulam Market" },
          { id: "ambasamudram", name: "Ambasamudram Paddy Hub" },
          { id: "radhapuram", name: "Radhapuram Coconut & Groundnut Yard" },
        ],
      },
      {
        id: "tirupathur",
        name: "Tirupathur",
        places: [
          { id: "tirupathur-market", name: "Tirupathur Mango & Grain Yard" },
          { id: "vaniyambadi", name: "Vaniyambadi Agro Market" },
          { id: "ambur", name: "Ambur Vegetable Yard" },
        ],
      },
      {
        id: "tiruppur",
        name: "Tiruppur",
        places: [
          { id: "kangeyam", name: "Kangeyam Copra & Oil Mandi" },
          { id: "udumalpet", name: "Udumalpet Tomato & Veg Market" },
          { id: "dharapuram", name: "Dharapuram Agri Yard" },
          { id: "palladam", name: "Palladam Agro Hub" },
        ],
      },
      {
        id: "tiruvallur",
        name: "Tiruvallur",
        places: [
          { id: "tiruvallur-paddy", name: "Tiruvallur Watermelon & Paddy Yard" },
          { id: "ponneri", name: "Ponneri Rice & Veg Mandi" },
          { id: "gummidipoondi", name: "Gummidipoondi Grain Market" },
        ],
      },
      {
        id: "tiruvannamalai",
        name: "Tiruvannamalai",
        places: [
          { id: "arni", name: "Arni Rice Mill Capital Terminal" },
          { id: "tiruvannamalai-market", name: "Tiruvannamalai Groundnut Market" },
          { id: "polur", name: "Polur Paddy & Millet Market" },
        ],
      },
      {
        id: "tiruvarur",
        name: "Tiruvarur",
        places: [
          { id: "tiruvarur-paddy", name: "Tiruvarur Paddy Granary Mandi" },
          { id: "mannargudi", name: "Mannargudi Delta Grain Market" },
          { id: "thiruthuraipoondi", name: "Thiruthuraipoondi Organic Rice Hub" },
        ],
      },
      {
        id: "vellore",
        name: "Vellore",
        places: [
          { id: "vellore-market", name: "Vellore Central Market Yard" },
          { id: "gudiyatham", name: "Gudiyatham Banana & Cattle Market" },
          { id: "katpadi", name: "Katpadi Grain Terminal" },
        ],
      },
      {
        id: "villupuram",
        name: "Viluppuram",
        places: [
          { id: "tindivanam", name: "Tindivanam Groundnut Market Yard" },
          { id: "villupuram-apmc", name: "Villupuram Regulated Market" },
          { id: "gingee", name: "Gingee Paddy & Pulses Market" },
        ],
      },
      {
        id: "virudhunagar",
        name: "Virudhunagar",
        places: [
          { id: "virudhunagar-commodity", name: "Virudhunagar Oilseeds & Chilli Terminal" },
          { id: "rajapalayam", name: "Rajapalayam Cotton & Mango Market" },
          { id: "sattur", name: "Sattur Groundnut & Grain Market" },
        ],
      },
    ],
  },
  {
    id: "ap",
    name: "Andhra Pradesh",
    districts: [
      {
        id: "alluri-sitharama-raju",
        name: "Alluri Sitharama Raju",
        places: [
          { id: "araku", name: "Araku Valley Organic Coffee & Pepper Terminal" },
          { id: "paderu", name: "Paderu Hill Spices Mandi" },
          { id: "rampa-chodavaram", name: "Rampachodavaram Forest Honey & Spices" },
        ],
      },
      {
        id: "anakapalli",
        name: "Anakapalli",
        places: [
          { id: "anakapalle", name: "Anakapalle Jaggery Yard (Asia's Second Largest)" },
          { id: "chodavaram", name: "Chodavaram Sugarcane & Paddy Yard" },
          { id: "yelamanchili", name: "Yelamanchili Cashew & Grain Market" },
        ],
      },
      {
        id: "ananthapuramu",
        name: "Ananthapuramu",
        places: [
          { id: "anantapur-groundnut", name: "Anantapur Groundnut Yard" },
          { id: "guntakal", name: "Guntakal Cotton & Grain Yard" },
          { id: "tadipatri", name: "Tadipatri Sweet Lime & Cotton Mandi" },
        ],
      },
      {
        id: "annamayya",
        name: "Annamayya",
        places: [
          { id: "rayachoti", name: "Rayachoti Tomato & Mango Hub" },
          { id: "madanapalle", name: "Madanapalle Tomato Mandi (National Hub)" },
          { id: "rajampet", name: "Rajampet Papaya & Banana Market" },
        ],
      },
      {
        id: "bapatla",
        name: "Bapatla",
        places: [
          { id: "chirala", name: "Chirala Cashew & Coconut Market" },
          { id: "bapatla-paddy", name: "Bapatla Coastal Paddy & Aquaculture Hub" },
          { id: "repalle", name: "Repalle Grain & Blackgram Mandi" },
        ],
      },
      {
        id: "chittoor",
        name: "Chittoor",
        places: [
          { id: "chittoor-market", name: "Chittoor Mango & Jaggery Market" },
          { id: "palamaner", name: "Palamaner Vegetable Yard" },
          { id: "kuppam", name: "Kuppam Flower & Agri Market" },
          { id: "punganur", name: "Punganur Sugarcane & Cattle Hub" },
        ],
      },
      {
        id: "konaseema",
        name: "Dr. B.R. Ambedkar Konaseema",
        places: [
          { id: "amalapuram", name: "Amalapuram Konaseema Coconut Mandi" },
          { id: "ravulapalem", name: "Ravulapalem Banana Market Yard" },
          { id: "razole", name: "Razole Betel & Coconut Yard" },
        ],
      },
      {
        id: "east-godavari",
        name: "East Godavari",
        places: [
          { id: "rajahmundry", name: "Rajahmundry Kambala Cheruvu Market" },
          { id: "mandapeta", name: "Mandapeta Paddy & Rice Mill Complex" },
          { id: "kovvur", name: "Kovvur Tobacco & Paddy Mandi" },
        ],
      },
      {
        id: "eluru",
        name: "Eluru",
        places: [
          { id: "eluru-market", name: "Eluru Paddy & Fish Feed Mandi" },
          { id: "jangareddygudem", name: "Jangareddygudem Maize & Cashew Yard" },
          { id: "nuzvid", name: "Nuzvid Banganapalli Mango Hub" },
        ],
      },
      {
        id: "guntur",
        name: "Guntur",
        places: [
          { id: "guntur-market", name: "Guntur Mirchi Yard (Asia's Largest)" },
          { id: "tenali", name: "Tenali Rice & Blackgram Mandi" },
          { id: "mangalagiri", name: "Mangalagiri Vegetable & Cotton Mandi" },
        ],
      },
      {
        id: "kakinada",
        name: "Kakinada",
        places: [
          { id: "kakinada-port-yard", name: "Kakinada Grain & Agro Terminal" },
          { id: "samalkota", name: "Samalkota Sugar & Paddy Market" },
          { id: "peddapuram", name: "Peddapuram Sago & Tapioca Yard" },
        ],
      },
      {
        id: "krishna",
        name: "Krishna",
        places: [
          { id: "machilipatnam", name: "Machilipatnam Agri Yard" },
          { id: "gudivada", name: "Gudivada Rice & Pulse Mandi" },
          { id: "vuyyuru", name: "Vuyyuru Sugarcane & Delta Produce" },
        ],
      },
      {
        id: "kurnool",
        name: "Kurnool",
        places: [
          { id: "kurnool-market", name: "Kurnool Onion & Groundnut Yard" },
          { id: "adoni", name: "Adoni Cotton Market Yard" },
          { id: "yemmiganur", name: "Yemmiganur Cotton & Castor Market" },
        ],
      },
      {
        id: "nandyal",
        name: "Nandyal",
        places: [
          { id: "nandyal-gram", name: "Nandyal Bengal Gram Mandi" },
          { id: "allagadda", name: "Allagadda Paddy & Sunflower Yard" },
          { id: "dhone", name: "Dhone Sweet Orange & Cattle Yard" },
        ],
      },
      {
        id: "ntr",
        name: "NTR (Vijayawada)",
        places: [
          { id: "vijayawada", name: "Vijayawada Gollapudi Wholesale Market" },
          { id: "jaggayyapeta", name: "Jaggayyapeta Chillies & Cotton Market" },
          { id: "nandigama", name: "Nandigama Cotton & Pulses Mandi" },
        ],
      },
      {
        id: "palnadu",
        name: "Palnadu",
        places: [
          { id: "narasaraopet", name: "Narasaraopet Cotton & Chilli Yard" },
          { id: "chilakaluripet", name: "Chilakaluripet Tobacco & Chilli Yard" },
          { id: "sattenapalle", name: "Sattenapalle Agri Market" },
        ],
      },
      {
        id: "parvathipuram-manyam",
        name: "Parvathipuram Manyam",
        places: [
          { id: "parvathipuram-grain", name: "Parvathipuram Grain Mandi" },
          { id: "salur", name: "Salur Cashew & Grain Market" },
          { id: "palakonda", name: "Palakonda Agro Yard" },
        ],
      },
      {
        id: "prakasam",
        name: "Prakasam",
        places: [
          { id: "ongole", name: "Ongole Tobacco & Chilli Market" },
          { id: "markapur", name: "Markapur Pulses & Grain Yard" },
          { id: "kandukur", name: "Kandukur Cotton & Groundnut Mandi" },
        ],
      },
      {
        id: "nellore",
        name: "Sri Potti Sriramulu Nellore",
        places: [
          { id: "nellore-rice", name: "Nellore BPT Rice & Paddy Mandi" },
          { id: "gudur", name: "Gudur Lemon & Acid Lime Market" },
          { id: "kavali", name: "Kavali Groundnut & Grain Yard" },
        ],
      },
      {
        id: "sri-sathya-sai",
        name: "Sri Sathya Sai",
        places: [
          { id: "hindupur", name: "Hindupur Tamarind & Silk Cocoon Mandi" },
          { id: "kadiri", name: "Kadiri Groundnut & Sweet Orange Hub" },
          { id: "dharmavaram", name: "Dharmavaram Agri Market" },
        ],
      },
      {
        id: "srikakulam",
        name: "Srikakulam",
        places: [
          { id: "palasa", name: "Palasa Cashew Processing Capital" },
          { id: "srikakulam-town", name: "Srikakulam Central Agro Yard" },
          { id: "amadalavalasa", name: "Amadalavalasa Sugarcane & Paddy Mandi" },
        ],
      },
      {
        id: "tirupati",
        name: "Tirupati",
        places: [
          { id: "tirupati-market", name: "Tirupati Agro Wholesale Market" },
          { id: "srikalahasti", name: "Srikalahasti Paddy & Groundnut Yard" },
          { id: "venkatagiri", name: "Venkatagiri Agro Market" },
        ],
      },
      {
        id: "visakhapatnam",
        name: "Visakhapatnam",
        places: [
          { id: "bowdara", name: "Visakhapatnam Bowdara Road Wholesale" },
          { id: "gajuwaka", name: "Gajuwaka Agro & Fish Market" },
          { id: "anandapuram", name: "Anandapuram Floriculture & Veg Yard" },
        ],
      },
      {
        id: "vizianagaram",
        name: "Vizianagaram",
        places: [
          { id: "vizianagaram-jute", name: "Vizianagaram Jute & Mango Yard" },
          { id: "bobbili", name: "Bobbili Sugarcane & Grain Market" },
          { id: "gajapathinagaram", name: "Gajapathinagaram Agro Mandi" },
        ],
      },
      {
        id: "west-godavari",
        name: "West Godavari",
        places: [
          { id: "tadepalligudem", name: "Tadepalligudem Onion & Jaggery Market" },
          { id: "bhimavaram", name: "Bhimavaram Delta Agro Hub" },
          { id: "tanuku", name: "Tanuku Rice & Oilseeds Yard" },
        ],
      },
      {
        id: "kadapa",
        name: "YSR Kadapa",
        places: [
          { id: "pulivendula", name: "Pulivendula Banana & Citrus Mandi" },
          { id: "kadapa-apmc", name: "Kadapa APMC Yard" },
          { id: "proddatur", name: "Proddatur Turmeric & Cotton Market" },
        ],
      },
    ],
  },
  {
    id: "ts",
    name: "Telangana",
    districts: [
      {
        id: "adilabad",
        name: "Adilabad",
        places: [
          { id: "adilabad-cotton", name: "Adilabad White Gold Cotton Yard" },
          { id: "jainath", name: "Jainath Soybean & Cotton Mandi" },
          { id: "bela", name: "Bela Cotton & Pulse Market" },
        ],
      },
      {
        id: "bhadradri-kothagudem",
        name: "Bhadradri Kothagudem",
        places: [
          { id: "kothagudem", name: "Kothagudem Forest & Agri Produce" },
          { id: "palwancha", name: "Palwancha Grain & Veg Mandi" },
          { id: "bhadrachalam", name: "Bhadrachalam Tamarind & Forest Produce" },
        ],
      },
      {
        id: "hanamkonda",
        name: "Hanamkonda",
        places: [
          { id: "hanamkonda-market", name: "Hanamkonda Central Agro Mandi" },
          { id: "kazipet", name: "Kazipet Wholesale Market" },
          { id: "hasanparthy", name: "Hasanparthy Grain Yard" },
        ],
      },
      {
        id: "hyderabad",
        name: "Hyderabad",
        places: [
          { id: "bowenpally", name: "Bowenpally Wholesale Veg Mandi" },
          { id: "kothapet", name: "Kothapet Fruit Market Terminal" },
          { id: "gudimalkapur", name: "Gudimalkapur Flower & Veg Market" },
        ],
      },
      {
        id: "jagtial",
        name: "Jagtial",
        places: [
          { id: "jagtial-mango", name: "Jagtial Banganapalli Mango & Sesame Market" },
          { id: "korutla", name: "Korutla Paddy & Maize Mandi" },
          { id: "metpally", name: "Metpally Agro Produce Yard" },
        ],
      },
      {
        id: "jangaon",
        name: "Jangaon",
        places: [
          { id: "jangaon-market", name: "Jangaon Grain & Cotton Mandi" },
          { id: "palakurthi", name: "Palakurthi Paddy & Red Gram Yard" },
          { id: "station-ghanpur", name: "Station Ghanpur Agro Yard" },
        ],
      },
      {
        id: "jayashankar-bhupalpally",
        name: "Jayashankar Bhupalpally",
        places: [
          { id: "bhupalpally-paddy", name: "Bhupalpally Paddy Yard" },
          { id: "kataram", name: "Kataram Cotton & Grain Mandi" },
          { id: "mahadevpur", name: "Mahadevpur Forest & Agri Produce" },
        ],
      },
      {
        id: "jogulamba-gadwal",
        name: "Jogulamba Gadwal",
        places: [
          { id: "gadwal-cotton", name: "Gadwal Groundnut & Cotton Yard" },
          { id: "alampur", name: "Alampur Paddy & Castor Mandi" },
          { id: "ieeja", name: "Ieeja Cotton & Grain Market" },
        ],
      },
      {
        id: "kamareddy",
        name: "Kamareddy",
        places: [
          { id: "kamareddy-yard", name: "Kamareddy Agro Yard" },
          { id: "banswada", name: "Banswada Paddy & Maize Market" },
          { id: "yellareddy", name: "Yellareddy Forest & Agri Mandi" },
        ],
      },
      {
        id: "karimnagar",
        name: "Karimnagar",
        places: [
          { id: "karimnagar-market", name: "Karimnagar Central Market Yard" },
          { id: "huzurabad", name: "Huzurabad Paddy & Maize Mandi" },
          { id: "choppadandi", name: "Choppadandi Agro Market" },
        ],
      },
      {
        id: "khammam",
        name: "Khammam",
        places: [
          { id: "khammam-mirchi", name: "Khammam Mirchi Mandi" },
          { id: "sattupalli", name: "Sattupalli Oil Palm & Paddy Market" },
          { id: "madhira", name: "Madhira Cotton & Pulses Yard" },
          { id: "wyra", name: "Wyra Paddy & Grain Market" },
        ],
      },
      {
        id: "kumuram-bheem-asifabad",
        name: "Kumuram Bheem Asifabad",
        places: [
          { id: "asifabad", name: "Asifabad Cotton & Soybean Mandi" },
          { id: "kaghaznagar", name: "Kaghaznagar Grain Yard" },
          { id: "sirpur", name: "Sirpur Agro & Forest Produce" },
        ],
      },
      {
        id: "mahabubabad",
        name: "Mahabubabad",
        places: [
          { id: "mahabubabad-chilli", name: "Mahabubabad Red Chilli & Maize Yard" },
          { id: "kesamudram", name: "Kesamudram Big Chilli Mandi" },
          { id: "thorrur", name: "Thorrur Cotton & Grain Market" },
        ],
      },
      {
        id: "mahabubnagar",
        name: "Mahabubnagar",
        places: [
          { id: "badepally", name: "Badepally (Jadcherla) Cotton & Maize Yard" },
          { id: "mahabubnagar-yard", name: "Mahabubnagar Groundnut Market" },
          { id: "devarkadra", name: "Devarkadra Cattle & Agri Mandi" },
        ],
      },
      {
        id: "mancherial",
        name: "Mancherial",
        places: [
          { id: "mancherial-paddy", name: "Mancherial Paddy & Timber Yard" },
          { id: "bellampalli", name: "Bellampalli Agro Market" },
          { id: "chennur", name: "Chennur Cotton & Pulses Mandi" },
        ],
      },
      {
        id: "medak",
        name: "Medak",
        places: [
          { id: "medak-apmc", name: "Medak APMC Yard" },
          { id: "ramayampet", name: "Ramayampet Grain Mandi" },
          { id: "toopran", name: "Toopran Agro Produce Yard" },
        ],
      },
      {
        id: "medchal-malkajgiri",
        name: "Medchal-Malkajgiri",
        places: [
          { id: "medchal-veg", name: "Medchal Wholesale Vegetable Yard" },
          { id: "alwal", name: "Alwal Agro Market" },
          { id: "ghatkesar", name: "Ghatkesar Grain Terminal" },
        ],
      },
      {
        id: "mulugu",
        name: "Mulugu",
        places: [
          { id: "mulugu-town", name: "Mulugu Forest & Grain Mandi" },
          { id: "govindaraopet", name: "Govindaraopet Paddy Market" },
          { id: "venkatapuram", name: "Venkatapuram Chilli & Forest Yard" },
        ],
      },
      {
        id: "nagarkurnool",
        name: "Nagarkurnool",
        places: [
          { id: "nagarkurnool-castor", name: "Nagarkurnool Castor & Groundnut Yard" },
          { id: "kalwakurthy", name: "Kalwakurthy Paddy & Maize Mandi" },
          { id: "achampet", name: "Achampet Forest & Millet Hub" },
        ],
      },
      {
        id: "nalgonda",
        name: "Nalgonda",
        places: [
          { id: "miryalaguda", name: "Miryalaguda Paddy & Rice Mill Capital" },
          { id: "nalgonda-market", name: "Nalgonda Sweet Orange & Paddy Yard" },
          { id: "devarakonda", name: "Devarakonda Cotton & Castor Market" },
          { id: "nakrekal", name: "Nakrekal Agro Mandi" },
        ],
      },
      {
        id: "narayanpet",
        name: "Narayanpet",
        places: [
          { id: "narayanpet-yard", name: "Narayanpet Red Gram & Cotton Yard" },
          { id: "makthal", name: "Makthal Groundnut & Castor Mandi" },
          { id: "kosgi", name: "Kosgi Grain Market" },
        ],
      },
      {
        id: "nirmal",
        name: "Nirmal",
        places: [
          { id: "nirmal-soybean", name: "Nirmal Soybean & Turmeric Market" },
          { id: "bhainsa", name: "Bhainsa Cotton & Pulse Mandi" },
          { id: "khanapur", name: "Khanapur Paddy Yard" },
        ],
      },
      {
        id: "nizamabad",
        name: "Nizamabad",
        places: [
          { id: "nizamabad-yard", name: "Nizamabad APMC Turmeric Yard" },
          { id: "bodhan", name: "Bodhan Sugar & Paddy Yard" },
          { id: "armoor", name: "Armoor Turmeric & Soybean Mandi" },
        ],
      },
      {
        id: "peddapalli",
        name: "Peddapalli",
        places: [
          { id: "peddapalli-paddy", name: "Peddapalli Paddy Mandi" },
          { id: "sultanabad", name: "Sultanabad Rice & Grain Market" },
          { id: "manthani", name: "Manthani Cotton & Agro Yard" },
        ],
      },
      {
        id: "rajanna-sircilla",
        name: "Rajanna Sircilla",
        places: [
          { id: "sircilla-market", name: "Sircilla Central Agro Market" },
          { id: "vemulawada", name: "Vemulawada Paddy & Oilseeds Mandi" },
          { id: "boinpalli", name: "Boinpalli Agri Yard" },
        ],
      },
      {
        id: "rangareddy",
        name: "Rangareddy",
        places: [
          { id: "shamshabad", name: "Shamshabad Agro & Floriculture Hub" },
          { id: "chevella", name: "Chevella Exotic Veg & Greenery Yard" },
          { id: "shadnagar", name: "Shadnagar Tomato & Cotton Market" },
          { id: "ibrahimpatnam", name: "Ibrahimpatnam Grain Mandi" },
        ],
      },
      {
        id: "sangareddy",
        name: "Sangareddy",
        places: [
          { id: "zaheerabad", name: "Zaheerabad Ginger & Sugarcane Mandi" },
          { id: "sangareddy-cotton", name: "Sangareddy Cotton & Grain Yard" },
          { id: "narayankhed", name: "Narayankhed Red Gram & Millet Yard" },
        ],
      },
      {
        id: "siddipet",
        name: "Siddipet",
        places: [
          { id: "siddipet-integrated", name: "Siddipet Integrated Market Yard" },
          { id: "gajwel", name: "Gajwel Modern Veg & Grain Market" },
          { id: "husnabad", name: "Husnabad Cotton & Paddy Mandi" },
        ],
      },
      {
        id: "suryapet",
        name: "Suryapet",
        places: [
          { id: "suryapet-yard", name: "Suryapet Grain & Cotton Yard" },
          { id: "kodad", name: "Kodad Paddy & Rice Mill Terminal" },
          { id: "huzurnagar", name: "Huzurnagar Paddy & Pulses Market" },
        ],
      },
      {
        id: "vikarabad",
        name: "Vikarabad",
        places: [
          { id: "tandur", name: "Tandur Red Gram (GI Tagged Dal) Capital" },
          { id: "vikarabad-town", name: "Vikarabad Agro Market Yard" },
          { id: "pargi", name: "Pargi Cotton & Maize Mandi" },
        ],
      },
      {
        id: "wanaparthy",
        name: "Wanaparthy",
        places: [
          { id: "wanaparthy-hub", name: "Wanaparthy Groundnut & Paddy Hub" },
          { id: "kothakota", name: "Kothakota Agro Yard" },
          { id: "pebbair", name: "Pebbair Cotton & Groundnut Market" },
        ],
      },
      {
        id: "warangal",
        name: "Warangal",
        places: [
          { id: "enumamula", name: "Enumamula Market Yard (Major Hub)" },
          { id: "narsampet", name: "Narsampet Paddy & Chilli Market" },
          { id: "parkal", name: "Parkal Cotton & Cottonseed Market" },
        ],
      },
      {
        id: "yadadri-bhuvanagiri",
        name: "Yadadri Bhuvanagiri",
        places: [
          { id: "bhuvanagiri", name: "Bhuvanagiri Grain & Cotton Mandi" },
          { id: "choutuppal", name: "Choutuppal Agro Market Yard" },
          { id: "alair", name: "Alair Paddy & Vegetable Market" },
        ],
      },
    ],
  },
  {
    id: "kl",
    name: "Kerala",
    districts: [
      {
        id: "alappuzha",
        name: "Alappuzha",
        places: [
          { id: "kuttanad", name: "Kuttanad Below-Sea-Level Paddy Granary" },
          { id: "kayamkulam", name: "Kayamkulam Coconut Research & Mandi" },
          { id: "alappuzha-apmc", name: "Alappuzha Coir & Agro Market" },
          { id: "mavelikkara", name: "Mavelikkara Paddy & Vegetable Yard" },
        ],
      },
      {
        id: "ernakulam",
        name: "Ernakulam",
        places: [
          { id: "muvattupuzha", name: "Muvattupuzha Vazhakulam Pineapple Market" },
          { id: "aluva", name: "Aluva Wholesale Vegetable Market" },
          { id: "broadway-kochi", name: "Broadway Kochi Spices & General Mandi" },
          { id: "kothamangalam", name: "Kothamangalam Rubber & Spices Hub" },
        ],
      },
      {
        id: "idukki",
        name: "Idukki",
        places: [
          { id: "nedumkandam", name: "Nedumkandam Spices Board Cardamom Auction" },
          { id: "kattappana", name: "Kattappana High Range Spices Mandi" },
          { id: "thodupuzha", name: "Thodupuzha Pineapple & Rubber Market" },
          { id: "kumily", name: "Kumily Cardamom & Black Pepper Center" },
          { id: "adimali", name: "Adimali Cocoa & Nutmeg Yard" },
        ],
      },
      {
        id: "kannur",
        name: "Kannur",
        places: [
          { id: "kannur-market", name: "Kannur Coconut & Spices Market" },
          { id: "thalassery", name: "Thalassery Historic Pepper & Malabar Spices" },
          { id: "payyanur", name: "Payyanur Arecanut & Rubber Mandi" },
          { id: "mattannur", name: "Mattannur Agro Produce Yard" },
        ],
      },
      {
        id: "kasaragod",
        name: "Kasaragod",
        places: [
          { id: "kanhangad", name: "Kanhangad Arecanut & Coconut Market" },
          { id: "kasaragod-town", name: "Kasaragod Town Agro Produce Yard" },
          { id: "neeleswaram", name: "Neeleswaram Organic Paddy & Spice Hub" },
        ],
      },
      {
        id: "kollam",
        name: "Kollam",
        places: [
          { id: "kollam-cashew", name: "Kollam Cashew Processing Capital Terminal" },
          { id: "karunagappally", name: "Karunagappally Coconut & Copra Market" },
          { id: "punalur", name: "Punalur Rubber & Spices Mandi" },
          { id: "kottarakkara", name: "Kottarakkara Pepper & Tapioca Yard" },
        ],
      },
      {
        id: "kottayam",
        name: "Kottayam",
        places: [
          { id: "pala", name: "Pala Rubber & Spices Market" },
          { id: "maravoor", name: "Maravoor Estate Yard" },
          { id: "changanassery", name: "Changanassery Banana & Tapioca Market" },
          { id: "kanjirappally", name: "Kanjirappally Rubber & Pepper Mandi" },
          { id: "ettumanoor", name: "Ettumanoor Agro Produce Yard" },
        ],
      },
      {
        id: "kozhikode",
        name: "Kozhikode",
        places: [
          { id: "valiyangadi", name: "Valiyangadi (Big Bazaar) Historic Spice Yard" },
          { id: "vatakara", name: "Vatakara Coconut & Copra Terminal" },
          { id: "koyilandy", name: "Koyilandy Agro & Fish Market" },
          { id: "thamarassery", name: "Thamarassery Hill Produce Yard" },
        ],
      },
      {
        id: "malappuram",
        name: "Malappuram",
        places: [
          { id: "tirur", name: "Tirur Famous Betel Leaf (Vettila) Market" },
          { id: "manjeri", name: "Manjeri Central Agri Market" },
          { id: "perinthalmanna", name: "Perinthalmanna Tapioca & Banana Mandi" },
          { id: "nilambur", name: "Nilambur Forest & Spice Produce Yard" },
        ],
      },
      {
        id: "palakkad",
        name: "Palakkad",
        places: [
          { id: "palakkad-big-bazaar", name: "Palakkad Big Bazaar Grain Yard" },
          { id: "alathur", name: "Alathur Granary Paddy Mandi" },
          { id: "chittur", name: "Chittur Sugarcane & Jaggery Market" },
          { id: "pattambi", name: "Pattambi Paddy & Vegetable Market" },
          { id: "ottapalam", name: "Ottapalam Agro Market" },
        ],
      },
      {
        id: "pathanamthitta",
        name: "Pathanamthitta",
        places: [
          { id: "adoor", name: "Adoor Agro Produce Yard" },
          { id: "thiruvalla", name: "Thiruvalla Paddy & Sugar Market" },
          { id: "ranni", name: "Ranni Rubber & Cardamom Mandi" },
          { id: "konni", name: "Konni Forest & Spices Hub" },
        ],
      },
      {
        id: "trivandrum",
        name: "Thiruvananthapuram",
        places: [
          { id: "chalai", name: "Chalai Market Wholesale Vegetable & Spice Hub" },
          { id: "nedumangad", name: "Nedumangad Agriculture Market (Govt APMC)" },
          { id: "attingal", name: "Attingal Coconut & Banana Mandi" },
          { id: "neyyattinkara", name: "Neyyattinkara Agro Produce Yard" },
        ],
      },
      {
        id: "thrissur",
        name: "Thrissur",
        places: [
          { id: "sakthan", name: "Sakthan Thampuran Market Thrissur" },
          { id: "chalakudy", name: "Chalakudy Vegetable & Nutmeg Market" },
          { id: "kunnamkulam", name: "Kunnamkulam Betel Nut & Coconut Mandi" },
          { id: "wadakkanchery", name: "Wadakkanchery Banana & Paddy Hub" },
          { id: "irinjalakuda", name: "Irinjalakuda Coconut & Pepper Yard" },
        ],
      },
      {
        id: "wayanad",
        name: "Wayanad",
        places: [
          { id: "sulthan-bathery", name: "Sulthan Bathery Coffee & Pepper Yard" },
          { id: "kalpetta", name: "Kalpetta Hill Spices & Tea Market" },
          { id: "mananthavady", name: "Mananthavady Ginger & Cardamom Mandi" },
          { id: "meenangadi", name: "Meenangadi Agro & Organic Hub" },
        ],
      },
    ],
  },,
{
    "id": "mh",
    "name": "Maharashtra",
    "districts": [
      {
        "id": "nashik",
        "name": "Nashik",
        "places": [
          {
            "id": "lasalgaon",
            "name": "Lasalgaon Onion Mandi (Asia's Largest)"
          },
          {
            "id": "pimpalgaon",
            "name": "Pimpalgaon Baswant Tomato & Grape Hub"
          },
          {
            "id": "nashik-city",
            "name": "Nashik APMC Yard"
          },
          {
            "id": "yeola",
            "name": "Yeola Agro Market"
          }
        ]
      },
      {
        "id": "pune",
        "name": "Pune",
        "places": [
          {
            "id": "gultekdi",
            "name": "Gultekdi APMC Market Yard Pune"
          },
          {
            "id": "manchar",
            "name": "Manchar Potato & Onion Yard"
          },
          {
            "id": "junnar",
            "name": "Junnar Vegetable Hub"
          },
          {
            "id": "baramati",
            "name": "Baramati Agro Terminal"
          }
        ]
      },
      {
        "id": "nagpur",
        "name": "Nagpur",
        "places": [
          {
            "id": "nagpur-cotton",
            "name": "Kalamna Wholesale Market Yard (Nagpur)"
          },
          {
            "id": "katol",
            "name": "Katol Orange Mandi"
          },
          {
            "id": "saoner",
            "name": "Saoner Grain & Cotton Yard"
          }
        ]
      },
      {
        "id": "mumbai-suburban",
        "name": "Mumbai / Navi Mumbai",
        "places": [
          {
            "id": "vashi-apmc",
            "name": "Vashi Navi Mumbai Central APMC Terminal"
          },
          {
            "id": "dadar-market",
            "name": "Dadar Wholesale Flower & Produce Yard"
          }
        ]
      },
      {
        "id": "kolhapur",
        "name": "Kolhapur",
        "places": [
          {
            "id": "kolhapur-jaggery",
            "name": "Shahupuri Jaggery & Agro Mandi"
          },
          {
            "id": "gadhinglaj",
            "name": "Gadhinglaj Chilli & Grain Yard"
          }
        ]
      },
      {
        "id": "solapur",
        "name": "Solapur",
        "places": [
          {
            "id": "solapur-pomegranate",
            "name": "Solapur Pomegranate & Jowar Mandi"
          },
          {
            "id": "karmala",
            "name": "Karmala Agro Yard"
          }
        ]
      },
      {
        "id": "ahmednagar",
        "name": "Ahmednagar (Ahilyanagar)",
        "places": [
          {
            "id": "rahata",
            "name": "Rahata Pomegranate & Onion Market"
          },
          {
            "id": "sangamner",
            "name": "Sangamner Tomato & Vegetable Mandi"
          }
        ]
      },
      {
        "id": "aurangabad",
        "name": "Chhatrapati Sambhajinagar",
        "places": [
          {
            "id": "jadhavwadi",
            "name": "Jadhavwadi APMC Yard"
          },
          {
            "id": "paithan",
            "name": "Paithan Cotton & Sweet Lime Hub"
          }
        ]
      },
      {
        "id": "amravati",
        "name": "Amravati",
        "places": [
          {
            "id": "amravati-cotton",
            "name": "Amravati Cotton & Soybean Yard"
          },
          {
            "id": "warud",
            "name": "Warud Orange Capital Mandi"
          }
        ]
      },
      {
        "id": "jalgaon",
        "name": "Jalgaon",
        "places": [
          {
            "id": "jalgaon-banana",
            "name": "Jalgaon Golden Banana & Pulse Mandi"
          },
          {
            "id": "raver",
            "name": "Raver Banana Export Terminal"
          }
        ]
      }
    ]
  },
  {
    "id": "ka",
    "name": "Karnataka",
    "districts": [
      {
        "id": "bengaluru-urban",
        "name": "Bengaluru Urban",
        "places": [
          {
            "id": "yeshwanthpur",
            "name": "Yeshwanthpur APMC Wholesale Yard"
          },
          {
            "id": "binny-mill",
            "name": "Binny Mill Vegetable Market"
          },
          {
            "id": "singena-agrahara",
            "name": "Singena Agrahara Fruit Terminal"
          }
        ]
      },
      {
        "id": "kolar",
        "name": "Kolar",
        "places": [
          {
            "id": "kolar-tomato",
            "name": "Kolar APMC Tomato Market (2nd Largest in Asia)"
          },
          {
            "id": "malur",
            "name": "Malur Vegetable Terminal"
          },
          {
            "id": "srinivaspur",
            "name": "Srinivaspur Mango Capital Mandi"
          }
        ]
      },
      {
        "id": "hubballi-dharwad",
        "name": "Dharwad / Hubballi",
        "places": [
          {
            "id": "amaragol",
            "name": "Amaragol APMC Yard Hubballi"
          },
          {
            "id": "dharwad-market",
            "name": "Dharwad Chilli & Pulse Market"
          }
        ]
      },
      {
        "id": "mysuru",
        "name": "Mysuru",
        "places": [
          {
            "id": "bandipalya",
            "name": "Bandipalya APMC Yard Mysuru"
          },
          {
            "id": "nanjangud",
            "name": "Nanjangud Banana & Paddy Yard"
          }
        ]
      },
      {
        "id": "belagavi",
        "name": "Belagavi",
        "places": [
          {
            "id": "belagavi-vegetable",
            "name": "Belagavi Central Vegetable & Jaggery Mandi"
          },
          {
            "id": "bailhongal",
            "name": "Bailhongal Cotton Yard"
          }
        ]
      },
      {
        "id": "shivamogga",
        "name": "Shivamogga",
        "places": [
          {
            "id": "shivamogga-areca",
            "name": "Shivamogga Arecanut & Paddy Yard"
          },
          {
            "id": "sagar",
            "name": "Sagar Spice Market"
          }
        ]
      },
      {
        "id": "ballari",
        "name": "Ballari",
        "places": [
          {
            "id": "ballari-chilli",
            "name": "Ballari Chilli & Cotton Market Yard"
          },
          {
            "id": "hospet",
            "name": "Hospet Banana & Agro Mandi"
          }
        ]
      },
      {
        "id": "kalaburagi",
        "name": "Kalaburagi (Gulbarga)",
        "places": [
          {
            "id": "gulbarga-dal",
            "name": "Nehru Gunj Red Gram (Tur Dal) Mandi"
          },
          {
            "id": "sedam",
            "name": "Sedam Pulse Yard"
          }
        ]
      },
      {
        "id": "chikkamagaluru",
        "name": "Chikkamagaluru",
        "places": [
          {
            "id": "chikkamagaluru-coffee",
            "name": "Chikkamagaluru Coffee & Pepper Yard"
          },
          {
            "id": "tarikere",
            "name": "Tarikere Agro Yard"
          }
        ]
      },
      {
        "id": "davangere",
        "name": "Davangere",
        "places": [
          {
            "id": "davangere-maize",
            "name": "Davangere Maize & Paddy Market"
          },
          {
            "id": "harihar",
            "name": "Harihar Agro Yard"
          }
        ]
      }
    ]
  },
  {
    "id": "up",
    "name": "Uttar Pradesh",
    "districts": [
      {
        "id": "lucknow",
        "name": "Lucknow",
        "places": [
          {
            "id": "dubagga",
            "name": "Dubagga Mandi Lucknow"
          },
          {
            "id": "sitapur-road",
            "name": "Naveen Galla Mandi Sitapur Road"
          },
          {
            "id": "malihabad",
            "name": "Malihabad Mango Mandi"
          }
        ]
      },
      {
        "id": "agra",
        "name": "Agra",
        "places": [
          {
            "id": "khandari",
            "name": "Khandari Potato & Vegetable Mandi"
          },
          {
            "id": "fatehabad",
            "name": "Fatehabad Agro Market Yard"
          }
        ]
      },
      {
        "id": "kanpur-nagar",
        "name": "Kanpur",
        "places": [
          {
            "id": "chakeri",
            "name": "Chakeri Grain & Pulse Mandi"
          },
          {
            "id": "naubasta",
            "name": "Naubasta Naveen Mandi Samiti"
          }
        ]
      },
      {
        "id": "varanasi",
        "name": "Varanasi",
        "places": [
          {
            "id": "pahariya",
            "name": "Pahariya Mandi Samiti Varanasi"
          },
          {
            "id": "ramnagar",
            "name": "Ramnagar Vegetable Yard"
          }
        ]
      },
      {
        "id": "meerut",
        "name": "Meerut",
        "places": [
          {
            "id": "delhi-road",
            "name": "Delhi Road Naveen Mandi Meerut"
          },
          {
            "id": "mawana",
            "name": "Mawana Sugarcane & Grain Yard"
          }
        ]
      },
      {
        "id": "bareilly",
        "name": "Bareilly",
        "places": [
          {
            "id": "bareilly-mandi",
            "name": "Bareilly Delapeer Mandi Samiti"
          },
          {
            "id": "aonla",
            "name": "Aonla Agro Yard"
          }
        ]
      },
      {
        "id": "gorakhpur",
        "name": "Gorakhpur",
        "places": [
          {
            "id": "maheshra",
            "name": "Maheshra Naveen Mandi Gorakhpur"
          },
          {
            "id": "sahjanwa",
            "name": "Sahjanwa Paddy Yard"
          }
        ]
      },
      {
        "id": "aligarh",
        "name": "Aligarh",
        "places": [
          {
            "id": "dhani-mandi",
            "name": "Aligarh Dhanipur Mandi Samiti"
          },
          {
            "id": "khair",
            "name": "Khair Wheat & Mustard Yard"
          }
        ]
      }
    ]
  },
  {
    "id": "gj",
    "name": "Gujarat",
    "districts": [
      {
        "id": "ahmedabad",
        "name": "Ahmedabad",
        "places": [
          {
            "id": "jamalpur",
            "name": "Jamalpur APMC Wholesale Market"
          },
          {
            "id": "vasna",
            "name": "Vasna APMC Vegetable Terminal"
          },
          {
            "id": "naroda",
            "name": "Naroda Fruit & Grain Yard"
          }
        ]
      },
      {
        "id": "surat",
        "name": "Surat",
        "places": [
          {
            "id": "sahara-darwaja",
            "name": "Sardar Market Sahara Darwaja Surat"
          },
          {
            "id": "katargam",
            "name": "Katargam Agro Yard"
          }
        ]
      },
      {
        "id": "rajkot",
        "name": "Rajkot",
        "places": [
          {
            "id": "rajkot-bedi",
            "name": "Bedi APMC Yard Rajkot (Groundnut & Cotton)"
          },
          {
            "id": "gondal",
            "name": "Gondal APMC Chilli, Onion & Groundnut Mandi"
          }
        ]
      },
      {
        "id": "mehsana",
        "name": "Mehsana",
        "places": [
          {
            "id": "unjha",
            "name": "Unjha APMC (Asia's Largest Cumin & Isabgol Mandi)"
          },
          {
            "id": "kadi",
            "name": "Kadi Cotton & Cottonseed Yard"
          }
        ]
      },
      {
        "id": "vadodara",
        "name": "Vadodara",
        "places": [
          {
            "id": "sayajipura",
            "name": "Sayajipura APMC Market Yard"
          },
          {
            "id": "padra",
            "name": "Padra Vegetable & Pulse Hub"
          }
        ]
      },
      {
        "id": "junagadh",
        "name": "Junagadh",
        "places": [
          {
            "id": "talala",
            "name": "Talala Gir Kesar Mango Mandi"
          },
          {
            "id": "junagadh-apmc",
            "name": "Junagadh Groundnut & Wheat Yard"
          }
        ]
      }
    ]
  },
  {
    "id": "pb",
    "name": "Punjab",
    "districts": [
      {
        "id": "ludhiana",
        "name": "Ludhiana",
        "places": [
          {
            "id": "khanna",
            "name": "Khanna Grain Market (Asia's Largest Grain Mandi)"
          },
          {
            "id": "gill-road",
            "name": "Gill Road Mandi Ludhiana"
          },
          {
            "id": "samrala",
            "name": "Samrala Agro Yard"
          }
        ]
      },
      {
        "id": "amritsar",
        "name": "Amritsar",
        "places": [
          {
            "id": "bhagtanwala",
            "name": "Bhagtanwala Grain & Basmati Mandi"
          },
          {
            "id": "vallah",
            "name": "Vallah Vegetable & Fruit Terminal"
          }
        ]
      },
      {
        "id": "jalandhar",
        "name": "Jalandhar",
        "places": [
          {
            "id": "jalandhar-cantt",
            "name": "Maqsudan APMC Wholesale Mandi"
          },
          {
            "id": "nakodar",
            "name": "Nakodar Potato & Maize Yard"
          }
        ]
      },
      {
        "id": "bathinda",
        "name": "Bathinda",
        "places": [
          {
            "id": "bathinda-cotton",
            "name": "Bathinda White Gold Cotton Mandi"
          },
          {
            "id": "rampuraphul",
            "name": "Rampura Phul Grain Market"
          }
        ]
      },
      {
        "id": "patiala",
        "name": "Patiala",
        "places": [
          {
            "id": "nabha",
            "name": "Nabha Grain & Paddy Yard"
          },
          {
            "id": "samana",
            "name": "Samana Wheat & Basmati Mandi"
          }
        ]
      }
    ]
  },
  {
    "id": "hr",
    "name": "Haryana",
    "districts": [
      {
        "id": "karnal",
        "name": "Karnal",
        "places": [
          {
            "id": "karnal-basmati",
            "name": "Karnal Basmati Rice Hub Mandi"
          },
          {
            "id": "taraori",
            "name": "Taraori International Basmati Yard"
          },
          {
            "id": "gharaunda",
            "name": "Gharaunda Vegetable Terminal"
          }
        ]
      },
      {
        "id": "sirsa",
        "name": "Sirsa",
        "places": [
          {
            "id": "sirsa-cotton",
            "name": "Sirsa Cotton & Wheat Mandi"
          },
          {
            "id": "dabwali",
            "name": "Mandi Dabwali Kinnow & Mustard Yard"
          }
        ]
      },
      {
        "id": "hisar",
        "name": "Hisar",
        "places": [
          {
            "id": "hisar-grain",
            "name": "Nai Anaj Mandi Hisar"
          },
          {
            "id": "hansi",
            "name": "Hansi Agro Yard"
          }
        ]
      },
      {
        "id": "ambala",
        "name": "Ambala",
        "places": [
          {
            "id": "ambala-city",
            "name": "Ambala City Anaj Mandi"
          },
          {
            "id": "barara",
            "name": "Barara Paddy Yard"
          }
        ]
      },
      {
        "id": "gurugram",
        "name": "Gurugram",
        "places": [
          {
            "id": "khandsa",
            "name": "Khandsa Mandi Gurugram"
          },
          {
            "id": "sohna",
            "name": "Sohna Grain & Mustard Yard"
          }
        ]
      }
    ]
  },
  {
    "id": "rj",
    "name": "Rajasthan",
    "districts": [
      {
        "id": "jaipur",
        "name": "Jaipur",
        "places": [
          {
            "id": "muhana",
            "name": "Muhana Mandi Terminal (Jaipur)"
          },
          {
            "id": "surajpole",
            "name": "Surajpole Anaj Mandi"
          },
          {
            "id": "chomu",
            "name": "Chomu Vegetable & Groundnut Hub"
          }
        ]
      },
      {
        "id": "kota",
        "name": "Kota",
        "places": [
          {
            "id": "bhamashah",
            "name": "Bhamashah Krishi Upaj Mandi Kota"
          },
          {
            "id": "ramganj-mandi",
            "name": "Ramganj Mandi (Coriander Capital)"
          }
        ]
      },
      {
        "id": "jodhpur",
        "name": "Jodhpur",
        "places": [
          {
            "id": "basni",
            "name": "Basni Krishi Upaj Mandi"
          },
          {
            "id": "mathania",
            "name": "Mathania Red Chilli & Onion Hub"
          }
        ]
      },
      {
        "id": "bikaner",
        "name": "Bikaner",
        "places": [
          {
            "id": "bikaner-moth",
            "name": "Bikaner Moth Dal & Mustard Mandi"
          },
          {
            "id": "nokha",
            "name": "Nokha Peanut & Pulse Yard"
          }
        ]
      },
      {
        "id": "sri-ganganagar",
        "name": "Sri Ganganagar",
        "places": [
          {
            "id": "ganganagar-kinnow",
            "name": "Sri Ganganagar Kinnow & Wheat Yard"
          },
          {
            "id": "padampur",
            "name": "Padampur Cotton & Mustard Mandi"
          }
        ]
      }
    ]
  },
  {
    "id": "mp",
    "name": "Madhya Pradesh",
    "districts": [
      {
        "id": "indore",
        "name": "Indore",
        "places": [
          {
            "id": "chhoithram",
            "name": "Chhoithram Fruit & Vegetable Mandi"
          },
          {
            "id": "laxmibai-nagar",
            "name": "Laxmibai Nagar Grain & Soybean Mandi"
          }
        ]
      },
      {
        "id": "bhopal",
        "name": "Bhopal",
        "places": [
          {
            "id": "karond",
            "name": "Karond Krishi Upaj Mandi Bhopal"
          },
          {
            "id": "bairagarh",
            "name": "Bairagarh Agro Yard"
          }
        ]
      },
      {
        "id": "mandsaur",
        "name": "Mandsaur",
        "places": [
          {
            "id": "mandsaur-garlic",
            "name": "Mandsaur Garlic & Opium Mandi (National Hub)"
          },
          {
            "id": "pipliya-mandi",
            "name": "Pipliya Mandi Soybean & Spices Yard"
          }
        ]
      },
      {
        "id": "neemuch",
        "name": "Neemuch",
        "places": [
          {
            "id": "neemuch-herbal",
            "name": "Neemuch Medicinal Herb & Isabgol Mandi"
          },
          {
            "id": "jawad",
            "name": "Jawad Grain Yard"
          }
        ]
      },
      {
        "id": "ujjain",
        "name": "Ujjain",
        "places": [
          {
            "id": "chimanganj",
            "name": "Chimanganj Mandi Ujjain (Wheat & Gram)"
          },
          {
            "id": "nagda",
            "name": "Nagda Agro Yard"
          }
        ]
      }
    ]
  },
  {
    "id": "wb",
    "name": "West Bengal",
    "districts": [
      {
        "id": "kolkata",
        "name": "Kolkata",
        "places": [
          {
            "id": "koley-market",
            "name": "Koley Market Wholesale Vegetable Hub"
          },
          {
            "id": "postasta",
            "name": "Posta Wholesale Spice & Grain Market"
          },
          {
            "id": "mechua",
            "name": "Mechua Fruit Market"
          }
        ]
      },
      {
        "id": "darjeeling-siliguri",
        "name": "Siliguri / Darjeeling",
        "places": [
          {
            "id": "siliguri-regulated",
            "name": "Siliguri Regulated Market (North Bengal Hub)"
          },
          {
            "id": "matigara",
            "name": "Matigara Agro Yard"
          }
        ]
      },
      {
        "id": "purba-bardhaman",
        "name": "Purba Bardhaman",
        "places": [
          {
            "id": "bardhaman-rice",
            "name": "Bardhaman Rice Bowl APMC Yard"
          },
          {
            "id": "memari",
            "name": "Memari Potato & Paddy Mandi"
          }
        ]
      },
      {
        "id": "hooghly",
        "name": "Hooghly",
        "places": [
          {
            "id": "sheoraphuli",
            "name": "Sheoraphuli Hat Wholesale Market"
          },
          {
            "id": "tarakeswar",
            "name": "Tarakeswar Potato Capital Mandi"
          }
        ]
      },
      {
        "id": "nadia",
        "name": "Nadia",
        "places": [
          {
            "id": "krishnanagar",
            "name": "Krishnanagar Vegetable & Jute Yard"
          },
          {
            "id": "ranaghat",
            "name": "Ranaghat Agro Market"
          }
        ]
      }
    ]
  },
  {
    "id": "br",
    "name": "Bihar",
    "districts": [
      {
        "id": "patna",
        "name": "Patna",
        "places": [
          {
            "id": "meenabazar",
            "name": "Meena Bazar Gulzarbagh Mandi"
          },
          {
            "id": "bazar-samiti-patna",
            "name": "Bazar Samiti Musallahpur Hat"
          }
        ]
      },
      {
        "id": "muzaffarpur",
        "name": "Muzaffarpur",
        "places": [
          {
            "id": "muzaffarpur-shahi-litchi",
            "name": "Muzaffarpur Shahi Litchi & Maize Yard"
          },
          {
            "id": "ahiyapur",
            "name": "Ahiyapur Krishi Bazar"
          }
        ]
      },
      {
        "id": "bhagalpur",
        "name": "Bhagalpur",
        "places": [
          {
            "id": "bhagalpur-zardalu",
            "name": "Bhagalpur Zardalu Mango & Silk Yard"
          },
          {
            "id": "kahalgaon",
            "name": "Kahalgaon Agro Yard"
          }
        ]
      },
      {
        "id": "purnia",
        "name": "Purnia",
        "places": [
          {
            "id": "gulabbagh",
            "name": "Gulabbagh Mandi (Eastern India's Largest Maize Market)"
          },
          {
            "id": "kasba",
            "name": "Kasba Jute & Grain Yard"
          }
        ]
      }
    ]
  },
  {
    "id": "or_state",
    "name": "Odisha",
    "districts": [
      {
        "id": "khordha-bhubaneswar",
        "name": "Bhubaneswar / Khordha",
        "places": [
          {
            "id": "aiginia",
            "name": "Aiginia APMC Yard Bhubaneswar"
          },
          {
            "id": "unit-1-market",
            "name": "Unit-1 Haat Wholesale Vegetable Market"
          }
        ]
      },
      {
        "id": "cuttack",
        "name": "Cuttack",
        "places": [
          {
            "id": "chhatra-bazar",
            "name": "Chhatra Bazar Cuttack"
          },
          {
            "id": "malgodown",
            "name": "Malgodown Wholesale Pulse & Grain Mandi"
          }
        ]
      },
      {
        "id": "sambalpur",
        "name": "Sambalpur",
        "places": [
          {
            "id": "khetrajpur",
            "name": "Khetrajpur RMC Market Yard"
          },
          {
            "id": "bargarh-canal",
            "name": "Bargarh Rice & Vegetable Hub"
          }
        ]
      }
    ]
  },
  {
    "id": "as",
    "name": "Assam",
    "districts": [
      {
        "id": "kamrup-guwahati",
        "name": "Kamrup Metropolitan / Guwahati",
        "places": [
          {
            "id": "pamohi",
            "name": "Pamohi Central Agricultural Market Guwahati"
          },
          {
            "id": "fancy-bazar",
            "name": "Machkhowa & Fancy Bazar Wholesale Terminal"
          }
        ]
      },
      {
        "id": "cachar-silchar",
        "name": "Cachar / Silchar",
        "places": [
          {
            "id": "fatak-bazar",
            "name": "Fatak Bazar Silchar"
          }
        ]
      },
      {
        "id": "dibrugarh",
        "name": "Dibrugarh",
        "places": [
          {
            "id": "dibrugarh-market",
            "name": "New Market Agro Yard Dibrugarh"
          }
        ]
      }
    ]
  },
  {
    "id": "cg",
    "name": "Chhattisgarh",
    "districts": [
      {
        "id": "raipur",
        "name": "Raipur",
        "places": [
          {
            "id": "dumartarai",
            "name": "Dumartarai Wholesale Mandi Raipur"
          },
          {
            "id": "pandri",
            "name": "Pandri Galla Mandi"
          }
        ]
      },
      {
        "id": "durg",
        "name": "Durg / Bhilai",
        "places": [
          {
            "id": "durg-mandi",
            "name": "Durg Krishi Upaj Mandi"
          }
        ]
      }
    ]
  },
  {
    "id": "jh",
    "name": "Jharkhand",
    "districts": [
      {
        "id": "ranchi",
        "name": "Ranchi",
        "places": [
          {
            "id": "pandra",
            "name": "Pandra Krishi Bazar Samiti Ranchi"
          },
          {
            "id": "daily-market",
            "name": "Daily Market Main Road Ranchi"
          }
        ]
      },
      {
        "id": "jamshedpur",
        "name": "East Singhbhum (Jamshedpur)",
        "places": [
          {
            "id": "sakchi",
            "name": "Sakchi & Parsudih Bazar Samiti"
          }
        ]
      }
    ]
  },
  {
    "id": "hp",
    "name": "Himachal Pradesh",
    "districts": [
      {
        "id": "shimla",
        "name": "Shimla",
        "places": [
          {
            "id": "dhalli",
            "name": "Dhalli Apple & Vegetable Mandi (Shimla)"
          },
          {
            "id": "bhattakufer",
            "name": "Bhattakufer Fruit Terminal"
          }
        ]
      },
      {
        "id": "kullu",
        "name": "Kullu",
        "places": [
          {
            "id": "kullu-mandi",
            "name": "Kullu Valley Apple & Fruit Yard"
          },
          {
            "id": "bhuntar",
            "name": "Bhuntar Agro Yard"
          }
        ]
      }
    ]
  },
  {
    "id": "uk",
    "name": "Uttarakhand",
    "districts": [
      {
        "id": "dehradun",
        "name": "Dehradun",
        "places": [
          {
            "id": "niranjanpur",
            "name": "Niranjanpur Mandi Dehradun"
          },
          {
            "id": "rishikesh",
            "name": "Rishikesh Agro Yard"
          }
        ]
      },
      {
        "id": "udhamsingh-nagar",
        "name": "Udham Singh Nagar",
        "places": [
          {
            "id": "rudrapur",
            "name": "Rudrapur Grain & Paddy Mandi"
          },
          {
            "id": "kashipur",
            "name": "Kashipur Agro Yard"
          }
        ]
      }
    ]
  },
  {
    "id": "ga",
    "name": "Goa",
    "districts": [
      {
        "id": "north-goa",
        "name": "North Goa",
        "places": [
          {
            "id": "mapusa",
            "name": "Mapusa Friday Market & APMC Yard"
          },
          {
            "id": "panaji",
            "name": "Panaji Municipal Market"
          }
        ]
      },
      {
        "id": "south-goa",
        "name": "South Goa",
        "places": [
          {
            "id": "margao",
            "name": "Margao SGPDA Wholesale Fish & Agro Market"
          }
        ]
      }
    ]
  },
  {
    "id": "jk",
    "name": "Jammu and Kashmir",
    "districts": [
      {
        "id": "srinagar",
        "name": "Srinagar",
        "places": [
          {
            "id": "parimpora",
            "name": "Parimpora Fruit & Apple Mandi Srinagar"
          }
        ]
      },
      {
        "id": "jammu",
        "name": "Jammu",
        "places": [
          {
            "id": "narwal",
            "name": "Narwal Wholesale Fruit & Vegetable Mandi Jammu"
          }
        ]
      },
      {
        "id": "sopore",
        "name": "Baramulla (Sopore)",
        "places": [
          {
            "id": "sopore-apple",
            "name": "Sopore Apple Mandi (Asia's 2nd Largest Fruit Mandi)"
          }
        ]
      }
    ]
  },
  {
    "id": "dl",
    "name": "Delhi (NCT)",
    "districts": [
      {
        "id": "north-delhi",
        "name": "North / West Delhi",
        "places": [
          {
            "id": "azadpur",
            "name": "Azadpur Mandi (Asia's Largest Wholesale Market)"
          },
          {
            "id": "keshopur",
            "name": "Keshopur Vegetable & Fruit Yard"
          },
          {
            "id": "najafgarh",
            "name": "Najafgarh Grain Mandi"
          },
          {
            "id": "ghazipur",
            "name": "Ghazipur Wholesale Fruit & Flower Market"
          }
        ]
      }
    ]
  },
  {
    "id": "tr",
    "name": "Tripura",
    "districts": [
      {
        "id": "west-tripura",
        "name": "West Tripura (Agartala)",
        "places": [
          {
            "id": "maharajganj",
            "name": "Maharajganj Bazar Agartala"
          },
          {
            "id": "battala",
            "name": "Battala Vegetable Terminal"
          }
        ]
      }
    ]
  },
  {
    "id": "meghalaya",
    "name": "Meghalaya",
    "districts": [
      {
        "id": "east-khasi-hills",
        "name": "East Khasi Hills (Shillong)",
        "places": [
          {
            "id": "iewduh",
            "name": "Iewduh (Bara Bazar) Shillong"
          }
        ]
      }
    ]
  },
  {
    "id": "manipur",
    "name": "Manipur",
    "districts": [
      {
        "id": "imphal-west",
        "name": "Imphal West",
        "places": [
          {
            "id": "ima-keithel",
            "name": "Ima Keithel (Mother's Market) Imphal"
          }
        ]
      }
    ]
  },
  {
    "id": "nagaland",
    "name": "Nagaland",
    "districts": [
      {
        "id": "dimapur",
        "name": "Dimapur",
        "places": [
          {
            "id": "dimapur-market",
            "name": "Dimapur Daily Organic Produce Market"
          }
        ]
      }
    ]
  },
  {
    "id": "mizoram",
    "name": "Mizoram",
    "districts": [
      {
        "id": "aizawl",
        "name": "Aizawl",
        "places": [
          {
            "id": "bara-bazar-aizawl",
            "name": "Bara Bazar Central Market Aizawl"
          }
        ]
      }
    ]
  },
  {
    "id": "arunachal",
    "name": "Arunachal Pradesh",
    "districts": [
      {
        "id": "papum-pare",
        "name": "Papum Pare (Itanagar)",
        "places": [
          {
            "id": "itanagar-market",
            "name": "Ganga Market Itanagar"
          }
        ]
      }
    ]
  },
  {
    "id": "sikkim",
    "name": "Sikkim",
    "districts": [
      {
        "id": "east-sikkim",
        "name": "East Sikkim (Gangtok)",
        "places": [
          {
            "id": "lal-bazar",
            "name": "Lal Bazar Organic Agricultural Market Gangtok"
          }
        ]
      }
    ]
  },
  {
    "id": "ch",
    "name": "Chandigarh (UT)",
    "districts": [
      {
        "id": "chandigarh-ut",
        "name": "Chandigarh",
        "places": [
          {
            "id": "sector-26",
            "name": "Sector 26 Grain & Vegetable Market Chandigarh"
          }
        ]
      }
    ]
  },
  {
    "id": "py",
    "name": "Puducherry (UT)",
    "districts": [
      {
        "id": "puducherry-dist",
        "name": "Puducherry",
        "places": [
          {
            "id": "goubert-market",
            "name": "Goubert Market Wholesale Yard Puducherry"
          },
          {
            "id": "thattanchavady",
            "name": "Thattanchavady Regulated Agricultural Market"
          }
        ]
      }
    ]
  },
  {
    "id": "an",
    "name": "Andaman and Nicobar (UT)",
    "districts": [
      {
        "id": "south-andaman",
        "name": "South Andaman (Port Blair)",
        "places": [
          {
            "id": "mohanpura",
            "name": "Mohanpura Vegetable Market Port Blair"
          }
        ]
      }
    ]
  },
  {
    "id": "ladakh",
    "name": "Ladakh (UT)",
    "districts": [
      {
        "id": "leh",
        "name": "Leh",
        "places": [
          {
            "id": "leh-market",
            "name": "Leh Main Market Apricot & Agro Yard"
          }
        ]
      }
    ]
  }
];

export function findState(id: string) {
  return STATES.find((s) => s.id === id) ?? STATES[0]!;
}

export function findDistrict(stateId: string, districtId: string) {
  const state = findState(stateId);
  return state.districts.find((d) => d.id === districtId) ?? state.districts[0]!;
}

export function findPlace(stateId: string, districtId: string, placeId: string) {
  const district = findDistrict(stateId, districtId);
  return district.places.find((p) => p.id === placeId) ?? district.places[0]!;
}

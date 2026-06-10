/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Worker {
  id: string;
  name: string;
  name_hi?: string;
  phone: string;
  skills: string[]; // Category IDs
  city: string;
  area: string;
  address: string;
  location: {
    lat: number;
    lng: number;
  };
  photo: string; // Base64 or placeholder url/color/avatar
  registeredAt: string;
  isApproved: boolean; // Admin approval state
  rating?: number;
  completedJobs?: number;
  isVerified?: boolean;
  status?: "available" | "busy";
  customSkillText?: string;
  gender?: "male" | "female" | "other";
}

export interface Job {
  id: string;
  employerName: string;
  employerPhone: string;
  title: string;
  title_hi?: string;
  description: string;
  description_hi?: string;
  skillNeeded: string;
  city: string;
  area: string;
  address: string;
  dailyWage: string;
  postedAt: string;
  status: 'open' | 'closed';
  location: {
    lat: number;
    lng: number;
  };
  customSkillText?: string;
}

export interface Assignment {
  id: string;
  jobId: string;
  workerId: string;
  assignedAt: string;
  status: 'assigned' | 'completed' | 'cancelled';
  employerName: string;
  employerPhone: string;
  workerName: string;
  workerPhone: string;
  jobTitle: string;
  jobTitle_hi?: string;
  workerSkills?: string[];
}

export interface Category {
  id: string;
  name_en: string;
  name_hi: string;
  icon: string; // Lucide icon name
  description_en: string;
  description_hi: string;
}

export const CATEGORIES: Category[] = [
  {
    id: "mason",
    name_en: "Mason (Mistri)",
    name_hi: "राजमिस्त्री (मिस्त्री)",
    icon: "Hammer",
    description_en: "Brickwork, plastering, wall construction",
    description_hi: "दीवार बनाना, प्लास्टर, ईंट का काम"
  },
  {
    id: "plumber",
    name_en: "Plumber",
    name_hi: "प्लम्बर (नलसाज)",
    icon: "Droplets",
    description_en: "Pipe repairs, tap fitting, bathroom leaks",
    description_hi: "नल ठीक करना, पाइप रिपेयर, लीक ठीक करना"
  },
  {
    id: "electrician",
    name_en: "Electrician",
    name_hi: "बिजलीवाला / इलेक्ट्रिशियन",
    icon: "Zap",
    description_en: "Fan, wiring, lights, short circuit repairs",
    description_hi: "पंकहे, लाइटें, वायरिंग और बिजली ठीक करना"
  },
  {
    id: "painter",
    name_en: "Painter",
    name_hi: "पेंटर (रंगसाज)",
    icon: "Paintbrush",
    description_en: "Wall painting, wall putty, wood polish",
    description_hi: "दीवार पुताई, वॉल पुट्टी और पेंटिंग"
  },
  {
    id: "carpenter",
    name_en: "Carpenter",
    name_hi: "कारपेंटर (बढ़ई)",
    icon: "Wrench",
    description_en: "Door repairs, furniture makers, locks fitting",
    description_hi: "दरवाजे, सोफा, अलमारी की मरम्मत और फिटिंग"
  },
  {
    id: "ac_tech",
    name_en: "AC Technician",
    name_hi: "एसी मैकेनिक",
    icon: "Snowflake",
    description_en: "Air conditioner servicing and installation",
    description_hi: "एसी सर्विसिंग और गैस रीफिलिंग"
  },
  {
    id: "welder",
    name_en: "Welder",
    name_hi: "वेल्डर (लोहा सुधारक)",
    icon: "Flame",
    description_en: "Iron gates, window grills, steel welding",
    description_hi: "लोहे के गेट, ग्रिल की वेल्डिंग और मरम्मत"
  },
  {
    id: "tile_worker",
    name_en: "Tile Worker",
    name_hi: "टाइल लगाने वाला",
    icon: "Grid",
    description_en: "Floor tiles, marble fitting, granite cutting",
    description_hi: "फर्श टाइल्स, मार्बल और ग्रेनाइट फिटिंग"
  },
  {
    id: "digging",
    name_en: "Digging Worker",
    name_hi: "मिट्टी खुदाई मजदूर",
    icon: "Shovel",
    description_en: "Foundation digging, garden work, soil moving",
    description_hi: "भूमि खुदाई, नाली खोदना, मिट्टी हटाना"
  },
  {
    id: "construction",
    name_en: "Construction Labor",
    name_hi: "मजदूर / लेबर",
    icon: "HardHat",
    description_en: "General shift labor, cement carrying, sand work",
    description_hi: "मकान बनाने का सामान्य मजदूरी काम, सीमेंट ढोना"
  },
  {
    id: "driver",
    name_en: "Driver",
    name_hi: "गाड़ी चालक (ड्राइवर)",
    icon: "Car",
    description_en: "Car, truck, loader driver for personal/commercial",
    description_hi: "गाड़ी, लोडर, या ट्रक चलाने का काम"
  },
  {
    id: "guard",
    name_en: "Security Guard",
    name_hi: "चौकीदार / गार्ड",
    icon: "ShieldAlert",
    description_en: "Sociey guards, office, gatekeeper duties",
    description_hi: "गेटकीपिंग, सुरक्षा गार्ड और पहरेदारी काम"
  },
  {
    id: "gardener",
    name_en: "Gardener (Mali)",
    name_hi: "माली",
    icon: "Flower",
    description_en: "Plants pruning, grass trimming, fertilizing",
    description_hi: "पौधों की छंटाई, लॉन की कटाई, खाद डालना"
  },
  {
    id: "helper",
    name_en: "Helper (Sahayak)",
    name_hi: "मददगार / हेल्पर",
    icon: "HandHelping",
    description_en: "Warehouse loading, shop assistant, house shifting",
    description_hi: "सामान उठाना, दुकान पर सहायकी, शिफ्टिंग में मदद"
  },
  {
    id: "vendor_lumber",
    name_en: "Lumber & Timber Store",
    name_hi: "लकड़ी & लम्बर विक्रेता",
    icon: "TreePine",
    description_en: "Plywood, timber, doors, and building lumber supplies",
    description_hi: "प्लाईवुड, लकड़ी और दरवाजे के विक्रेता"
  },
  {
    id: "vendor_paint",
    name_en: "Paints & Putty Store",
    name_hi: "पेंट & हार्डवेयर विक्रेता",
    icon: "Paintbrush",
    description_en: "Wall paints, putty, brushes, hardware supplies",
    description_hi: "दीवार के पेंट, पुट्टी और हार्डवेयर विक्रेता"
  },
  {
    id: "vendor_plumbing",
    name_en: "Plumbing Supplies Store",
    name_hi: "प्लंबिंग पाइप्स & फिटिंग्स",
    icon: "Droplets",
    description_en: "CPVC pipes, plumbing fittings, water pumps, water tanks",
    description_hi: "नलसाजी पाइप, नल और सैनिटरी वेयर विक्रेता"
  },
  {
    id: "vendor_cement",
    name_en: "Cement & Sand Store",
    name_hi: "सीमेंट & रेत विक्रेता",
    icon: "Boxes",
    description_en: "UltraTech/ACC Cement, fine sand, aggregates delivery",
    description_hi: "सीमेंट, रेत और रोड़ी सप्लायर"
  },
  {
    id: "vendor_bricks",
    name_en: "Bricks Supplier",
    name_hi: "ईंट सप्लायर",
    icon: "Grid",
    description_en: "Red clay bricks, fly ash bricks, hollow block supply",
    description_hi: "लाल ईंटें और ब्लॉक सप्लायर"
  },
  {
    id: "vendor_steel",
    name_en: "Iron & Steel (Sariya) Store",
    name_hi: "लोहा, स्टील & सरिया विक्रेता",
    icon: "Anchor",
    description_en: "TMT bars, structural steel, iron mesh, binding wire",
    description_hi: "सरिया, टीएमटी बार, लोहे के पाइप और बीम विक्रेता"
  },
  {
    id: "vendor_clay_lime",
    name_en: "Clay & Lime (Mitti/Chuna) Store",
    name_hi: "मिट्टी और चूना सप्लायर",
    icon: "Flower",
    description_en: "Clay, dry lime, plaster of Paris, wall putty",
    description_hi: "मिट्टी, चूना सप्लायर, पीओपी और पुट्टी विक्रेता"
  },
  {
    id: "pop_gypsum",
    name_en: "POP & False Ceiling Specialist",
    name_hi: "पीओपी, जिप्सम & फॉल्स सीलिंग",
    icon: "Grid",
    description_en: "Plaster of Paris designer, Gypsum boards, decorative false ceilings",
    description_hi: "पीओपी डिजाइन, जिप्सम बोर्ड और सुंदर फॉल्स सीलिंग का काम"
  },
  {
    id: "vendor_hardware",
    name_en: "Hardware & Tools Store",
    name_hi: "हार्डवेयर & टूल्स विक्रेता",
    icon: "Wrench",
    description_en: "Nut-bolts, screws, hand tools, drill machines, general construction hardware",
    description_hi: "पेच, बोल्ट, कीलें, ड्रिल मशीन और निर्माण के लिए हार्डवेयर सामान"
  },
  {
    id: "other",
    name_en: "Other Skills / Stores",
    name_hi: "अन्य काम और दुकानें",
    icon: "Smile",
    description_en: "Any other manual work, skilled labor or specialized material stores",
    description_hi: "कोई भी अन्य काम या निर्माण सामग्री की दुकान"
  }
];

// Agra-exclusive locations with genuine coordinates
export const INDIAN_CITIES = [
  { 
    name_en: "Agra", 
    name_hi: "आगरा", 
    areas: [
      { name_en: "Tajganj", name_hi: "ताजगंज", lat: 27.1682, lng: 78.0422 },
      { name_en: "Sanjay Place", name_hi: "संजय प्लेस", lat: 27.1983, lng: 78.0055 },
      { name_en: "Kamla Nagar", name_hi: "कमला नगर", lat: 27.2144, lng: 78.0210 },
      { name_en: "Sikandra", name_hi: "सिकंदरा", lat: 27.2172, lng: 77.9515 },
      { name_en: "Dayalbagh", name_hi: "दयालबाग", lat: 27.2241, lng: 78.0125 },
      { name_en: "Bodla", name_hi: "बोदला", lat: 27.1895, lng: 77.9620 },
      { name_en: "Loha Mandi", name_hi: "लोहा मंडी", lat: 27.1903, lng: 77.9942 },
      { name_en: "Raja Ki Mandi", name_hi: "राजा की मंडी", lat: 27.1970, lng: 77.9980 },
      { name_en: "Hari Parbat", name_hi: "हरि पर्वत", lat: 27.1994, lng: 78.0123 },
      { name_en: "Shahganj", name_hi: "शाहगंज", lat: 27.1750, lng: 77.9810 },
      { name_en: "Khandari", name_hi: "खंदारी", lat: 27.2080, lng: 78.0070 },
      { name_en: "Sadar Bazar", name_hi: "सदर बाजार", lat: 27.1610, lng: 78.0120 },
      { name_en: "Agra Cantt", name_hi: "आगरा कैंट", lat: 27.1585, lng: 77.9950 },
      { name_en: "Fatehabad Road", name_hi: "फतेहाबाद रोड", lat: 27.1580, lng: 78.0560 },
      { name_en: "Shamsabad Road", name_hi: "शमसाबाद रोड", lat: 27.1450, lng: 78.0350 },
      { name_en: "Balkeshwar", name_hi: "बल्केश्वर", lat: 27.2185, lng: 78.0380 },
      { name_en: "Rambagh", name_hi: "रामबाग", lat: 27.2020, lng: 78.0350 },
      { name_en: "Itmad-ud-Daulah", name_hi: "एत्मादुद्दौला", lat: 27.1930, lng: 78.0310 },
      { name_en: "Foundry Nagar", name_hi: "फाउंड्री नगर", lat: 27.2100, lng: 78.0470 },
      { name_en: "Nunhai", name_hi: "नुनहाई", lat: 27.2250, lng: 78.0480 },
      { name_en: "Trans Yamuna Colony", name_hi: "ट्रांस यमुना कॉलोनी", lat: 27.2150, lng: 78.0510 },
      { name_en: "Jagdishpura", name_hi: "जगदीशपुरा", lat: 27.1850, lng: 77.9790 },
      { name_en: "Shastri Puram", name_hi: "शास्त्री पुरम", lat: 27.2050, lng: 77.9550 },
      { name_en: "Bichpuri", name_hi: "बिचपुरी", lat: 27.1740, lng: 77.9150 },
      { name_en: "Rohta", name_hi: "रोहता", lat: 27.1210, lng: 78.0050 },
      { name_en: "MG Road", name_hi: "एमजी रोड", lat: 27.1820, lng: 78.0110 }
    ]
  }
];

// Helper to calculate distance in KM using Haversine formula
export function getDistanceKM(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return Number(d.toFixed(1));
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

// Initial realistic worker profiles seeded in AGRA to guarantee instant matches!
export const INITIAL_WORKERS: Worker[] = [
  {
    id: "w-agra-1",
    name: "Rajesh Kumar Mistri",
    name_hi: "राजेश कुमार मिस्त्री",
    phone: "9876543210",
    skills: ["mason", "tile_worker"],
    city: "Agra",
    area: "Tajganj",
    address: "West Gate Taj Mahal, Tajganj, Agra",
    location: { lat: 27.1690, lng: 78.0410 },
    photo: "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&h=150&fit=crop&crop=face",
    registeredAt: "2026-05-15T08:30:00Z",
    isApproved: true,
    rating: 4.8,
    completedJobs: 42,
    isVerified: true,
    status: "available"
  },
  {
    id: "w-agra-2",
    name: "Ramesh Prasad Bijliwala",
    name_hi: "रमेश प्रसाद बिजलीवाला",
    phone: "9123456780",
    skills: ["electrician"],
    city: "Agra",
    area: "Sanjay Place",
    address: "Block 24, Sanjay Place, Agra",
    location: { lat: 27.1980, lng: 78.0050 },
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    registeredAt: "2026-05-18T10:15:00Z",
    isApproved: true,
    rating: 4.6,
    completedJobs: 29,
    isVerified: true,
    status: "busy"
  },
  {
    id: "w-agra-3",
    name: "Mohammad Salim Ahmed",
    name_hi: "मोहम्मद सलीम अहमद",
    phone: "9988776655",
    skills: ["plumber", "ac_tech"],
    city: "Agra",
    area: "Kamla Nagar",
    address: "F-Block, Kamla Nagar, Agra",
    location: { lat: 27.2140, lng: 78.0200 },
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    registeredAt: "2026-05-20T14:45:00Z",
    isApproved: true,
    rating: 4.9,
    completedJobs: 56,
    isVerified: true,
    status: "available"
  },
  {
    id: "w-agra-4",
    name: "Shyam Sundar Paintwala",
    name_hi: "श्याम सुंदर पेंटर",
    phone: "8877665544",
    skills: ["painter"],
    city: "Agra",
    area: "Loha Mandi",
    address: "Loha Mandi Chowk, Agra",
    location: { lat: 27.1900, lng: 77.9940 },
    photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face",
    registeredAt: "2026-05-22T09:00:00Z",
    isApproved: true,
    rating: 4.5,
    completedJobs: 18,
    isVerified: false,
    status: "available"
  },
  {
    id: "w-agra-5",
    name: "Vikram Singh Carpenter",
    name_hi: "विक्रम सिंह कारपेंटर",
    phone: "7766554433",
    skills: ["carpenter", "welder"],
    city: "Agra",
    area: "Sikandra",
    address: "Sikandra Bypass Road, Near Tomb, Agra",
    location: { lat: 27.2170, lng: 77.9510 },
    photo: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&h=150&fit=crop&crop=face",
    registeredAt: "2026-05-24T11:20:00Z",
    isApproved: true,
    rating: 4.7,
    completedJobs: 34,
    isVerified: true,
    status: "busy"
  },
  {
    id: "w-agra-6",
    name: "Reena Devi Shovelwali",
    name_hi: "रीना देवी खुदाईवाली",
    phone: "9822334455",
    skills: ["digging", "construction"],
    city: "Agra",
    area: "Dayalbagh",
    address: "Radhasoami Satsang Colony, Dayalbagh, Agra",
    location: { lat: 27.2240, lng: 78.0120 },
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
    registeredAt: "2026-05-25T16:00:00Z",
    isApproved: true,
    rating: 4.2,
    completedJobs: 12,
    isVerified: false,
    status: "available",
    gender: "female"
  },
  {
    id: "w-agra-7",
    name: "Sharma Paint & Hardware House",
    name_hi: "शर्मा पेंट्स & हार्डवेयर",
    phone: "9411223344",
    skills: ["vendor_paint"],
    city: "Agra",
    area: "Sanjay Place",
    address: "Shop 12, Shopping Complex, Sanjay Place, Agra",
    location: { lat: 27.1983, lng: 78.0055 },
    photo: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=150&h=150&fit=crop&crop=face",
    registeredAt: "2026-05-26T10:00:00Z",
    isApproved: true,
    rating: 4.8,
    completedJobs: 151,
    isVerified: true,
    status: "available"
  },
  {
    id: "w-agra-8",
    name: "Garg Plumbing & Pipe Traders",
    name_hi: "गर्ग प्लंबिंग & पाइप ट्रेडर्स",
    phone: "9149001122",
    skills: ["vendor_plumbing"],
    city: "Agra",
    area: "Tajganj",
    address: "VIP Road, Opp. Shilpgram parking, Tajganj, Agra",
    location: { lat: 27.1682, lng: 78.0422 },
    photo: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=150&h=150&fit=crop&crop=face",
    registeredAt: "2026-05-27T08:30:00Z",
    isApproved: true,
    rating: 4.7,
    completedJobs: 89,
    isVerified: true,
    status: "available"
  },
  {
    id: "w-agra-9",
    name: "Bansal Cement & Builders sand Store",
    name_hi: "बंसल सीमेंट & रेत भंडार",
    phone: "9837001122",
    skills: ["vendor_cement"],
    city: "Agra",
    area: "Kamla Nagar",
    address: "By-pass Crossing Close to flyover, Kamla Nagar, Agra",
    location: { lat: 27.2144, lng: 78.0210 },
    photo: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=150&h=150&fit=crop&crop=face",
    registeredAt: "2026-05-28T09:12:00Z",
    isApproved: true,
    rating: 4.9,
    completedJobs: 247,
    isVerified: true,
    status: "available"
  },
  {
    id: "w-agra-10",
    name: "Agra Bricks & Stone Kiln",
    name_hi: "आर्यन ईंट भट्ठा उद्योग",
    phone: "9557334455",
    skills: ["vendor_bricks"],
    city: "Agra",
    area: "Sikandra",
    address: "Industrial Road behind Akbar’s Tomb, Sikandra, Agra",
    location: { lat: 27.2172, lng: 77.9515 },
    photo: "https://images.unsplash.com/photo-1590069261209-f8e9b8642343?w=150&h=150&fit=crop&crop=face",
    registeredAt: "2026-05-29T11:45:00Z",
    isApproved: true,
    rating: 4.4,
    completedJobs: 64,
    isVerified: false,
    status: "busy"
  },
  {
    id: "w-agra-11",
    name: "Singhal Iron & TMT Sariya Suppliers",
    name_hi: "सिंघल लोहा & सरिया विक्रेता",
    phone: "9917556677",
    skills: ["vendor_steel"],
    city: "Agra",
    area: "Loha Mandi",
    address: "Loha Mandi main Market block B, Agra",
    location: { lat: 27.1903, lng: 77.9942 },
    photo: "https://images.unsplash.com/photo-1535813547-99c456a41d4a?w=150&h=150&fit=crop&crop=face",
    registeredAt: "2026-05-30T14:20:00Z",
    isApproved: true,
    rating: 4.8,
    completedJobs: 330,
    isVerified: true,
    status: "available"
  },
  {
    id: "w-agra-12",
    name: "Taj Timber & Wood Works",
    name_hi: "ताज टिंबर & लकड़ी विक्रेता",
    phone: "9219889900",
    skills: ["vendor_lumber"],
    city: "Agra",
    area: "Dayalbagh",
    address: "Underpass main road crossing, Dayalbagh, Agra",
    location: { lat: 27.2241, lng: 78.0125 },
    photo: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=150&h=150&fit=crop&crop=face",
    registeredAt: "2026-05-31T08:00:00Z",
    isApproved: true,
    rating: 4.6,
    completedJobs: 112,
    isVerified: true,
    status: "busy"
  },
  {
    id: "w-agra-13",
    name: "Agra Clay & Lime (Mitti-Chuna) Udyog",
    name_hi: "आगरा मिट्टी & चूना उद्योग सप्लायर",
    phone: "9832104561",
    skills: ["vendor_clay_lime"],
    city: "Agra",
    area: "Shahganj",
    address: "Chuna Mandi road near bypass, Shahganj, Agra",
    location: { lat: 27.1750, lng: 77.9810 },
    photo: "https://images.unsplash.com/photo-1576086213369-97a306d36557?w=150&h=150&fit=crop&crop=face",
    registeredAt: "2026-06-01T10:00:00Z",
    isApproved: true,
    rating: 4.5,
    completedJobs: 80,
    isVerified: true,
    status: "available"
  },
  {
    id: "w-agra-14",
    name: "Soni UltraTech Cement Agency",
    name_hi: "सोनी अल्ट्राटेक सीमेंट एजेंसी",
    phone: "9997120033",
    skills: ["vendor_cement"],
    city: "Agra",
    area: "Sanjay Place",
    address: "MG Road, Opp. LIC Building, Sanjay Place, Agra",
    location: { lat: 27.1983, lng: 78.0055 },
    photo: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=150&h=150&fit=crop",
    registeredAt: "2026-06-02T08:00:00Z",
    isApproved: true,
    rating: 4.9,
    completedJobs: 412,
    isVerified: true,
    status: "available"
  },
  {
    id: "w-agra-15",
    name: "RBM Bricks Yard Agra",
    name_hi: "आर बी एम ईन्ट उद्योग (भट्ठा)",
    phone: "9568112345",
    skills: ["vendor_bricks"],
    city: "Agra",
    area: "Sikandra",
    address: "Bypass Road, near Akbar Tomb, Sikandra, Agra",
    location: { lat: 27.2172, lng: 77.9515 },
    photo: "https://images.unsplash.com/photo-1590069261209-f8e9b8642343?w=150&h=150&fit=crop",
    registeredAt: "2026-06-02T09:15:00Z",
    isApproved: true,
    rating: 4.7,
    completedJobs: 139,
    isVerified: true,
    status: "available"
  },
  {
    id: "w-agra-16",
    name: "Agra Iron & Sariya Bhandar (Tata Tiscon)",
    name_hi: "आगरा लोहा & सरिया भण्डार",
    phone: "9837119955",
    skills: ["vendor_steel"],
    city: "Agra",
    area: "Loha Mandi",
    address: "Steel Market yard, Loha Mandi, Agra",
    location: { lat: 27.1903, lng: 77.9942 },
    photo: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=150&h=150&fit=crop",
    registeredAt: "2026-06-02T10:30:00Z",
    isApproved: true,
    rating: 4.8,
    completedJobs: 290,
    isVerified: true,
    status: "available"
  },
  {
    id: "w-agra-17",
    name: "Chaudhary Shuttering & Timber Supplies",
    name_hi: "चौधरी शटरिंग & इमरती लकड़ी",
    phone: "9456012399",
    skills: ["vendor_lumber"],
    city: "Agra",
    area: "Dayalbagh",
    address: "Dayalbagh Central Road, near Radhasoami Temple, Agra",
    location: { lat: 27.2241, lng: 78.0125 },
    photo: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=150&h=150&fit=crop",
    registeredAt: "2026-06-02T11:45:00Z",
    isApproved: true,
    rating: 4.7,
    completedJobs: 85,
    isVerified: true,
    status: "available"
  },
  {
    id: "w-agra-18",
    name: "Pooja Sharma POP Designer",
    name_hi: "पूजा शर्मा पी.ओ.पी. डिजाइनर",
    phone: "9123884455",
    skills: ["pop_gypsum"],
    city: "Agra",
    area: "Tajganj",
    address: "Basai Road, Fatehabad Marg, Tajganj, Agra",
    location: { lat: 27.1682, lng: 78.0422 },
    photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face",
    registeredAt: "2026-06-02T12:00:00Z",
    isApproved: true,
    rating: 4.8,
    completedJobs: 73,
    isVerified: true,
    status: "available",
    gender: "female"
  },
  {
    id: "w-agra-19",
    name: "Agra Gypsum & False Ceiling Decor",
    name_hi: "आगरा जिप्सम & फॉल्स सीलिंग डेकोरेटर्स",
    phone: "9557889911",
    skills: ["pop_gypsum"],
    city: "Agra",
    area: "Sanjay Place",
    address: "Block 28, Shop 4, Sanjay Place, Agra",
    location: { lat: 27.1983, lng: 78.0055 },
    photo: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=150&h=150&fit=crop",
    registeredAt: "2026-06-02T13:20:00Z",
    isApproved: true,
    rating: 4.9,
    completedJobs: 110,
    isVerified: true,
    status: "available"
  },
  {
    id: "w-agra-20",
    name: "Saraswat Paint and Wall Putty Store",
    name_hi: "सारस्वत पेंट & वॉल पुट्टी स्टोर",
    phone: "9808110022",
    skills: ["vendor_paint"],
    city: "Agra",
    area: "Kamla Nagar",
    address: "F-Block Main Road, near Water Tank, Kamla Nagar, Agra",
    location: { lat: 27.2144, lng: 78.0210 },
    photo: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=150&h=150&fit=crop",
    registeredAt: "2026-06-02T14:40:00Z",
    isApproved: true,
    rating: 4.6,
    completedJobs: 145,
    isVerified: true,
    status: "available"
  },
  {
    id: "w-agra-21",
    name: "Seema Kumari Paint Specialist",
    name_hi: "सीमा कुमारी पेंट विशेषज्ञ",
    phone: "9411225588",
    skills: ["painter"],
    city: "Agra",
    area: "Sadar Bazar",
    address: "Shop No. 15, Sadar Bazar Cantt, Agra",
    location: { lat: 27.1610, lng: 78.0120 },
    photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
    registeredAt: "2026-06-02T15:00:00Z",
    isApproved: true,
    rating: 4.5,
    completedJobs: 62,
    isVerified: true,
    status: "available",
    gender: "female"
  },
  {
    id: "w-agra-22",
    name: "Vijay Paints Distributors (Berger & Asian Paints)",
    name_hi: "विजय पेंट्स डिस्ट्रीब्यूटर (एशियन पेंट्स)",
    phone: "8899112233",
    skills: ["vendor_paint"],
    city: "Agra",
    area: "Bodla",
    address: "Bodla Crossing, Lohamandi-Bodla Road, Agra",
    location: { lat: 27.1895, lng: 77.9620 },
    photo: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=150&h=150&fit=crop",
    registeredAt: "2026-06-02T15:30:00Z",
    isApproved: true,
    rating: 4.8,
    completedJobs: 380,
    isVerified: true,
    status: "available"
  },
  {
    id: "w-agra-23",
    name: "Agra Plumbing & CPVC Pipe Depot",
    name_hi: "आगरा प्लंबिंग & सीपीवीसी पाइप डिपो",
    phone: "9832049933",
    skills: ["vendor_plumbing"],
    city: "Agra",
    area: "Rambagh",
    address: "Hathras Road, Rambagh Crossing, Agra",
    location: { lat: 27.2020, lng: 78.0350 },
    photo: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=150&h=150&fit=crop",
    registeredAt: "2026-06-02T16:10:00Z",
    isApproved: true,
    rating: 4.7,
    completedJobs: 175,
    isVerified: true,
    status: "available"
  },
  {
    id: "w-agra-24",
    name: "Naveen Sanitary & Pipes Store",
    name_hi: "नवीन सैनिटरी & पाइप सप्लायर्स",
    phone: "9719014566",
    skills: ["vendor_plumbing"],
    city: "Agra",
    area: "Balkeshwar",
    address: "Balkeshwar Main Market, near Shiv Temple, Agra",
    location: { lat: 27.2185, lng: 78.0380 },
    photo: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=150&h=150&fit=crop",
    registeredAt: "2026-06-02T16:50:00Z",
    isApproved: true,
    rating: 4.8,
    completedJobs: 215,
    isVerified: true,
    status: "available"
  },
  {
    id: "w-agra-25",
    name: "Sanjay Place Hardware & Mill Store",
    name_hi: "संजय प्लेस हार्डवेयर & मिल स्टोर",
    phone: "9917551100",
    skills: ["vendor_hardware"],
    city: "Agra",
    area: "Sanjay Place",
    address: "Shop 14, Commercial Lane, Sanjay Place, Agra",
    location: { lat: 27.1983, lng: 78.0055 },
    photo: "https://images.unsplash.com/photo-1530124560111-00511ff0a516?w=150&h=150&fit=crop",
    registeredAt: "2026-06-02T17:10:00Z",
    isApproved: true,
    rating: 4.9,
    completedJobs: 512,
    isVerified: true,
    status: "available"
  },
  {
    id: "w-agra-26",
    name: "Shree Krishna Nuts, Bolt & Tools Depot",
    name_hi: "श्री कृष्ण नट-बोल्ट & हार्डवेयर डिपो",
    phone: "9219881122",
    skills: ["vendor_hardware"],
    city: "Agra",
    area: "Nunhai",
    address: "Industrial Complex, Road No. 2, Nunhai, Agra",
    location: { lat: 27.2250, lng: 78.0480 },
    photo: "https://images.unsplash.com/photo-1540103711724-ebf833bde8d1?w=150&h=150&fit=crop",
    registeredAt: "2026-06-02T17:40:00Z",
    isApproved: true,
    rating: 4.8,
    completedJobs: 236,
    isVerified: true,
    status: "available"
  }
];

// Simple Text to Speech helper
export function speakText(text: string, lang: 'hi-IN' | 'en-US' = 'hi-IN') {
  if (!('speechSynthesis' in window)) return;
  // Cancel previous speech
  window.speechSynthesis.cancel();
  
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  
  // Try to find a voice matching the language
  const voices = window.speechSynthesis.getVoices();
  const matchedVoice = voices.find(voice => voice.lang.includes(lang.split('-')[0]));
  if (matchedVoice) {
    utterance.voice = matchedVoice;
  }
  
  // Adjust speaking rate slightly for clarity
  utterance.rate = 0.9;
  
  window.speechSynthesis.speak(utterance);
}

// Helper to parse complex PostgREST JSON errors from Supabase REST endpoints
async function handleResponseError(response: Response, fallbackPrefix: string): Promise<never> {
  let detail = "";
  try {
    // Attempt to clone the response to read body
    const cloned = response.clone();
    const json = await cloned.json();
    detail = json.message || json.error_description || json.details || json.msg || JSON.stringify(json);
  } catch (err) {
    detail = response.statusText ? `${response.status} ${response.statusText}` : `HTTP status ${response.status}`;
  }
  throw new Error(`${fallbackPrefix}: ${detail}`);
}

// REST Sync implementation via direct HTTPS calls (supressing third-party SDK size issues)
export async function fetchSupabaseWorkers(url: string, anonKey: string): Promise<Worker[]> {
  const cleanedUrl = url.replace(/\/$/, "");
  const response = await fetch(`${cleanedUrl}/rest/v1/workers?select=*`, {
    headers: {
      "apikey": anonKey,
      "Authorization": `Bearer ${anonKey}`,
      "Content-Type": "application/json"
    }
  });

  if (!response.ok) {
    await handleResponseError(response, "Supabase failed");
  }
  
  const data = await response.json();
  return data as Worker[];
}

export async function insertSupabaseWorker(url: string, anonKey: string, worker: Worker): Promise<void> {
  const cleanedUrl = url.replace(/\/$/, "");
  const response = await fetch(`${cleanedUrl}/rest/v1/workers`, {
    method: "POST",
    headers: {
      "apikey": anonKey,
      "Authorization": `Bearer ${anonKey}`,
      "Content-Type": "application/json",
      "Prefer": "resolution=merge-duplicates,return=minimal"
    },
    body: JSON.stringify(worker)
  });

  if (!response.ok) {
    await handleResponseError(response, "Supabase insert failed");
  }
}

export async function deleteSupabaseWorker(url: string, anonKey: string, workerId: string): Promise<void> {
  const cleanedUrl = url.replace(/\/$/, "");
  const response = await fetch(`${cleanedUrl}/rest/v1/workers?id=eq.${workerId}`, {
    method: "DELETE",
    headers: {
      "apikey": anonKey,
      "Authorization": `Bearer ${anonKey}`,
      "Content-Type": "application/json"
    }
  });

  if (!response.ok) {
    await handleResponseError(response, "Supabase delete failed");
  }
}

export async function updateSupabaseWorkerApproval(url: string, anonKey: string, workerId: string, isApproved: boolean): Promise<void> {
  const cleanedUrl = url.replace(/\/$/, "");
  const response = await fetch(`${cleanedUrl}/rest/v1/workers?id=eq.${workerId}`, {
    method: "PATCH",
    headers: {
      "apikey": anonKey,
      "Authorization": `Bearer ${anonKey}`,
      "Content-Type": "application/json",
      "Prefer": "return=minimal"
    },
    body: JSON.stringify({ isApproved })
  });

  if (!response.ok) {
    await handleResponseError(response, "Supabase patch failed");
  }
}

export async function updateSupabaseWorkerVerification(url: string, anonKey: string, workerId: string, isVerified: boolean): Promise<void> {
  const cleanedUrl = url.replace(/\/$/, "");
  const response = await fetch(`${cleanedUrl}/rest/v1/workers?id=eq.${workerId}`, {
    method: "PATCH",
    headers: {
      "apikey": anonKey,
      "Authorization": `Bearer ${anonKey}`,
      "Content-Type": "application/json",
      "Prefer": "return=minimal"
    },
    body: JSON.stringify({ isVerified })
  });

  if (!response.ok) {
    await handleResponseError(response, "Supabase patch failed");
  }
}

export async function updateSupabaseWorker(url: string, anonKey: string, worker: Worker): Promise<void> {
  const cleanedUrl = url.replace(/\/$/, "");
  const response = await fetch(`${cleanedUrl}/rest/v1/workers?id=eq.${worker.id}`, {
    method: "PATCH",
    headers: {
      "apikey": anonKey,
      "Authorization": `Bearer ${anonKey}`,
      "Content-Type": "application/json",
      "Prefer": "return=minimal"
    },
    body: JSON.stringify(worker)
  });

  if (!response.ok) {
    await handleResponseError(response, "Supabase patch failed");
  }
}

// Initial realistic jobs seeded in different areas of Agra for employers/companies
export const INITIAL_JOBS: Job[] = [
  {
    id: "job-agra-1",
    employerName: "Verma Construction Ltd",
    employerPhone: "9812345670",
    title: "Need Plumber for New Building",
    title_hi: "नयी बिल्डिंग के लिए प्लम्बर चाहिए",
    description: "Urgent requirement of a heavy pipeline fitter. Kitchen and bathroom line connections.",
    description_hi: "रसोई और बाथरूम में नए पाइप फिट करने के लिए प्लम्बर की जरुरत है। तुरंत शुरू करना है।",
    skillNeeded: "plumber",
    city: "Agra",
    area: "Sanjay Place",
    address: "Commercial Office Flat 104, Sanjay Place, Agra",
    dailyWage: "₹600 - ₹700",
    postedAt: "2026-05-28T09:00:00Z",
    status: "open",
    location: { lat: 27.1983, lng: 78.0055 }
  },
  {
    id: "job-agra-2",
    employerName: "Shri Hari Paints & Decorators",
    employerPhone: "9988998822",
    title: "Requirement of 3 Painters for Wall Putty",
    title_hi: "वॉल पुट्टी के लिए ३ पेंटर की जरुरत है",
    description: "Good hand-on wall putty and primer application work in internal rooms.",
    description_hi: "घर के अंदर पुट्टी और प्राइमर लगाने का काम। काम ३ से ४ दिन चलेगा।",
    skillNeeded: "painter",
    city: "Agra",
    area: "Tajganj",
    address: "Vipul Lodge Road, Tajganj, Agra",
    dailyWage: "₹450 - ₹500",
    postedAt: "2026-05-30T11:30:00Z",
    status: "open",
    location: { lat: 27.1682, lng: 78.0422 }
  },
  {
    id: "job-agra-3",
    employerName: "Gupta Electricals",
    employerPhone: "9766554433",
    title: "AC servicing and outdoor unit installation helper",
    title_hi: "एसी सर्विसिंग और आउटडोर यूनिट फिटिंग हेल्पर",
    description: "Need strong helper who understands basics of wiring and can hold ladder/unit.",
    description_hi: "वॉल फिटिंग और हैवी सामान उठने में सहायता के लिए हेल्पर। दैनिक मजदूरी रोज रात को मिल जाएगी।",
    skillNeeded: "helper",
    city: "Agra",
    area: "Kamla Nagar",
    address: "Underpass road near Block E, Kamla Nagar, Agra",
    dailyWage: "₹350 - ₹400",
    postedAt: "2026-06-01T08:15:00Z",
    status: "open",
    location: { lat: 27.2144, lng: 78.0210 }
  }
];

export async function fetchSupabaseJobs(url: string, anonKey: string): Promise<Job[]> {
  const cleanedUrl = url.replace(/\/$/, "");
  const response = await fetch(`${cleanedUrl}/rest/v1/jobs?select=*`, {
    headers: {
      "apikey": anonKey,
      "Authorization": `Bearer ${anonKey}`,
      "Content-Type": "application/json"
    }
  });

  if (!response.ok) {
    await handleResponseError(response, "Supabase failed fetching jobs");
  }
  
  const data = await response.json();
  return data as Job[];
}

export async function insertSupabaseJob(url: string, anonKey: string, job: Job): Promise<void> {
  const cleanedUrl = url.replace(/\/$/, "");
  const response = await fetch(`${cleanedUrl}/rest/v1/jobs`, {
    method: "POST",
    headers: {
      "apikey": anonKey,
      "Authorization": `Bearer ${anonKey}`,
      "Content-Type": "application/json",
      "Prefer": "resolution=merge-duplicates,return=minimal"
    },
    body: JSON.stringify(job)
  });

  if (!response.ok) {
    await handleResponseError(response, "Supabase job insert failed");
  }
}

export async function deleteSupabaseJob(url: string, anonKey: string, jobId: string): Promise<void> {
  const cleanedUrl = url.replace(/\/$/, "");
  const response = await fetch(`${cleanedUrl}/rest/v1/jobs?id=eq.${jobId}`, {
    method: "DELETE",
    headers: {
      "apikey": anonKey,
      "Authorization": `Bearer ${anonKey}`,
      "Content-Type": "application/json"
    }
  });

  if (!response.ok) {
    await handleResponseError(response, "Supabase job delete failed");
  }
}

export async function updateSupabaseJob(url: string, anonKey: string, job: Job): Promise<void> {
  const cleanedUrl = url.replace(/\/$/, "");
  const response = await fetch(`${cleanedUrl}/rest/v1/jobs?id=eq.${job.id}`, {
    method: "PATCH",
    headers: {
      "apikey": anonKey,
      "Authorization": `Bearer ${anonKey}`,
      "Content-Type": "application/json",
      "Prefer": "return=minimal"
    },
    body: JSON.stringify({
      title: job.title,
      title_hi: job.title_hi,
      description: job.description,
      description_hi: job.description_hi,
      skillNeeded: job.skillNeeded,
      city: job.city,
      area: job.area,
      address: job.address,
      dailyWage: job.dailyWage,
      postedAt: job.postedAt,
      status: job.status,
      location: job.location
    })
  });

  if (!response.ok) {
    await handleResponseError(response, "Supabase job update failed");
  }
}

export async function fetchSupabaseAssignments(url: string, anonKey: string): Promise<Assignment[]> {
  const cleanedUrl = url.replace(/\/$/, "");
  const response = await fetch(`${cleanedUrl}/rest/v1/assignments?select=*`, {
    headers: {
      "apikey": anonKey,
      "Authorization": `Bearer ${anonKey}`,
      "Content-Type": "application/json"
    }
  });

  if (!response.ok) {
    await handleResponseError(response, "Supabase failed fetching assignments");
  }
  
  const data = await response.json();
  return data as Assignment[];
}

export async function insertSupabaseAssignment(url: string, anonKey: string, assignment: Assignment): Promise<void> {
  const cleanedUrl = url.replace(/\/$/, "");
  const response = await fetch(`${cleanedUrl}/rest/v1/assignments`, {
    method: "POST",
    headers: {
      "apikey": anonKey,
      "Authorization": `Bearer ${anonKey}`,
      "Content-Type": "application/json",
      "Prefer": "resolution=merge-duplicates,return=minimal"
    },
    body: JSON.stringify(assignment)
  });

  if (!response.ok) {
    await handleResponseError(response, "Supabase assignment insert failed");
  }
}

export interface UserProfile {
  phone: string;
  name: string;
  role: string;
  lastLogin: string;
  status?: "active" | "suspended";
}

export async function insertSupabaseProfile(url: string, anonKey: string, profile: { phone: string; name: string; role: string; lastLogin: string; status?: string }): Promise<void> {
  const cleanedUrl = url.replace(/\/$/, "");
  const response = await fetch(`${cleanedUrl}/rest/v1/profiles`, {
    method: "POST",
    headers: {
      "apikey": anonKey,
      "Authorization": `Bearer ${anonKey}`,
      "Content-Type": "application/json",
      "Prefer": "resolution=merge-duplicates,return=minimal"
    },
    body: JSON.stringify({
      phone: profile.phone,
      name: profile.name,
      role: profile.role,
      lastLogin: profile.lastLogin,
      status: profile.status || "active"
    })
  });

  if (!response.ok) {
    await handleResponseError(response, "Supabase profile insert failed");
  }
}

export async function fetchSupabaseProfiles(url: string, anonKey: string): Promise<UserProfile[]> {
  const cleanedUrl = url.replace(/\/$/, "");
  const response = await fetch(`${cleanedUrl}/rest/v1/profiles?select=*`, {
    headers: {
      "apikey": anonKey,
      "Authorization": `Bearer ${anonKey}`,
      "Content-Type": "application/json"
    }
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("Profiles table not found (404)");
    }
    await handleResponseError(response, "Supabase failed fetching profiles");
  }
  
  const data = await response.json();
  return data as UserProfile[];
}

export async function updateSupabaseProfile(url: string, anonKey: string, phone: string, updates: Partial<UserProfile>): Promise<void> {
  const cleanedUrl = url.replace(/\/$/, "");
  const response = await fetch(`${cleanedUrl}/rest/v1/profiles?phone=eq.${phone}`, {
    method: "PATCH",
    headers: {
      "apikey": anonKey,
      "Authorization": `Bearer ${anonKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(updates)
  });

  if (!response.ok) {
    await handleResponseError(response, "Supabase profile update failed");
  }
}

export async function deleteSupabaseProfile(url: string, anonKey: string, phone: string): Promise<void> {
  const cleanedUrl = url.replace(/\/$/, "");
  const response = await fetch(`${cleanedUrl}/rest/v1/profiles?phone=eq.${phone}`, {
    method: "DELETE",
    headers: {
      "apikey": anonKey,
      "Authorization": `Bearer ${anonKey}`,
      "Content-Type": "application/json"
    }
  });

  if (!response.ok) {
    await handleResponseError(response, "Supabase profile deletion failed");
  }
}

export interface SystemLoginRecord {
  id: string;
  phone: string;
  name: string;
  role: string;
  timestamp: string;
}

export async function insertSupabaseLoginRecord(url: string, anonKey: string, loginRecord: { id: string; phone: string; name: string; role: string; timestamp: string }): Promise<void> {
  const cleanedUrl = url.replace(/\/$/, "");
  const response = await fetch(`${cleanedUrl}/rest/v1/login_records`, {
    method: "POST",
    headers: {
      "apikey": anonKey,
      "Authorization": `Bearer ${anonKey}`,
      "Content-Type": "application/json",
      "Prefer": "resolution=merge-duplicates,return=minimal"
    },
    body: JSON.stringify(loginRecord)
  });

  if (!response.ok) {
    await handleResponseError(response, "Supabase login record insert failed");
  }
}

export async function fetchSupabaseLoginRecords(url: string, anonKey: string): Promise<SystemLoginRecord[]> {
  const cleanedUrl = url.replace(/\/$/, "");
  const response = await fetch(`${cleanedUrl}/rest/v1/login_records?select=*&order=timestamp.desc&limit=100`, {
    headers: {
      "apikey": anonKey,
      "Authorization": `Bearer ${anonKey}`,
      "Content-Type": "application/json"
    }
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("Login records table not found (404)");
    }
    await handleResponseError(response, "Supabase failed fetching login records");
  }

  const data = await response.json();
  return data as SystemLoginRecord[];
}



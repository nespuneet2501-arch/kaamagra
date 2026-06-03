/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Hammer,
  Droplets,
  Zap,
  Paintbrush,
  Wrench,
  Snowflake,
  Flame,
  Grid,
  Shovel,
  HardHat,
  Car,
  Shield,
  HelpCircle,
  Volume2,
  VolumeX,
  Search,
  UserPlus,
  Settings,
  MapPin,
  Phone,
  Check,
  CheckCircle2,
  Trash2,
  Edit3,
  Plus,
  FileCode,
  Map as LucideMap,
  Filter,
  ArrowRight,
  ChevronDown,
  User,
  CheckCircle,
  Download,
  SearchX,
  TrendingUp,
  ThumbsUp,
  Briefcase,
  Clock,
  Mic,
  Camera,
  X,
  Award,
  AlertCircle,
  Database,
  Share2
} from "lucide-react";
import {
  Worker,
  Category,
  CATEGORIES,
  INDIAN_CITIES,
  INITIAL_WORKERS,
  getDistanceKM,
  speakText,
  fetchSupabaseWorkers,
  insertSupabaseWorker,
  deleteSupabaseWorker,
  updateSupabaseWorkerApproval,
  updateSupabaseWorkerVerification,
  updateSupabaseWorker,
  Job,
  INITIAL_JOBS,
  fetchSupabaseJobs,
  insertSupabaseJob,
  deleteSupabaseJob,
  updateSupabaseJob,
  Assignment,
  fetchSupabaseAssignments,
  insertSupabaseAssignment,
  insertSupabaseProfile,
  insertSupabaseLoginRecord,
  fetchSupabaseProfiles,
  updateSupabaseProfile,
  deleteSupabaseProfile,
  fetchSupabaseLoginRecords,
  UserProfile,
  SystemLoginRecord
} from "./types";

import { MasterAdminPanel } from "./components/MasterAdminPanel";

const SETUP_SQL_CODE = `-- 1. Create workers table
CREATE TABLE IF NOT EXISTS public.workers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  name_hi TEXT,
  phone TEXT NOT NULL,
  skills JSONB,
  city TEXT,
  area TEXT,
  address TEXT,
  location JSONB,
  photo TEXT,
  "registeredAt" TEXT,
  "isApproved" BOOLEAN DEFAULT false,
  rating NUMERIC,
  "completedJobs" INTEGER DEFAULT 0,
  "isVerified" BOOLEAN DEFAULT false
);

ALTER TABLE public.workers DISABLE ROW LEVEL SECURITY;

-- 2. Create jobs table
CREATE TABLE IF NOT EXISTS public.jobs (
  id TEXT PRIMARY KEY,
  "employerName" TEXT,
  "employerPhone" TEXT,
  title TEXT,
  title_hi TEXT,
  description TEXT,
  description_hi TEXT,
  "skillNeeded" TEXT,
  city TEXT,
  area TEXT,
  address TEXT,
  "dailyWage" TEXT,
  "postedAt" TEXT,
  status TEXT,
  location JSONB
);

ALTER TABLE public.jobs DISABLE ROW LEVEL SECURITY;

-- 3. Create assignments table
CREATE TABLE IF NOT EXISTS public.assignments (
  id TEXT PRIMARY KEY,
  "jobId" TEXT,
  "workerId" TEXT,
  "assignedAt" TEXT,
  status TEXT,
  "employerName" TEXT,
  "employerPhone" TEXT,
  "workerName" TEXT,
  "workerPhone" TEXT,
  "jobTitle" TEXT,
  "jobTitle_hi" TEXT,
  "workerSkills" JSONB
);

ALTER TABLE public.assignments DISABLE ROW LEVEL SECURITY;

-- 4. Create profiles table (worker profiles & employer profiles)
CREATE TABLE IF NOT EXISTS public.profiles (
  phone TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  "lastLogin" TEXT NOT NULL
);

ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- 5. Create login_records table for audit logging
CREATE TABLE IF NOT EXISTS public.login_records (
  id TEXT PRIMARY KEY,
  phone TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  "timestamp" TEXT NOT NULL
);

ALTER TABLE public.login_records DISABLE ROW LEVEL SECURITY;

-- 6. Seed initial Agra database records for immediate matching
INSERT INTO public.workers (id, name, name_hi, phone, skills, city, area, address, location, photo, "registeredAt", "isApproved", rating, "completedJobs", "isVerified")
VALUES
('w-agra-1', 'Rajesh Kumar Mistri', 'राजेश कुमार मिस्त्री', '9876543210', '["mason", "tile_worker"]'::jsonb, 'Agra', 'Tajganj', 'West Gate Taj Mahal, Tajganj, Agra', '{"lat": 27.1690, "lng": 78.0410}'::jsonb, 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&h=150&fit=crop&crop=face', '2026-05-15T08:30:00Z', true, 4.8, 42, true),
('w-agra-2', 'Ramesh Prasad Bijliwala', 'रमेश प्रसाद बिजलीवाला', '9123456780', '["electrician"]'::jsonb, 'Agra', 'Sanjay Place', 'Block 24, Sanjay Place, Agra', '{"lat": 27.1980, "lng": 78.0050}'::jsonb, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face', '2026-05-18T10:15:00Z', true, 4.6, 29, true),
('w-agra-3', 'Mohammad Salim Ahmed', 'मोहम्मद सलीम अहमद', '9988776655', '["plumber", "ac_tech"]'::jsonb, 'Agra', 'Kamla Nagar', 'F-Block, Kamla Nagar, Agra', '{"lat": 27.2140, "lng": 78.0200}'::jsonb, 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face', '2026-05-20T14:45:00Z', true, 4.9, 56, true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.jobs (id, "employerName", "employerPhone", title, title_hi, description, description_hi, "skillNeeded", city, area, address, "dailyWage", "postedAt", status, location)
VALUES
('job-agra-1', 'Verma Construction Ltd', '9812345670', 'Need Plumber for New Building', 'नयी बिल्डिंग के लिए प्लम्बर चाहिए', 'Urgent requirement of a heavy pipeline fitter. Kitchen and bathroom line connections.', 'रसोई और बाथरूम में नए पाइप फिट करने के लिए प्लम्बर की जरुरत है। तुरंत शुरू करना है।', 'plumber', 'Agra', 'Sanjay Place', 'Commercial Office Flat 104, Sanjay Place, Agra', '₹600 - ₹700', '2026-05-28T09:00:00Z', 'open', '{"lat": 27.1983, "lng": 78.0055}'::jsonb),
('job-agra-2', 'Shri Hari Paints & Decorators', '9988998822', 'Requirement of 3 Painters for Wall Putty', 'वॉल पुट्टी के लिए ३ पेंटर की जरुरत है', 'Good hand-on wall putty and primer application work in internal rooms.', 'घर के अंदर पुट्टी और प्राइमर लगाने का काम। काम ३ से ४ दिन चलेगा।', 'painter', 'Agra', 'Tajganj', 'Vipul Lodge Road, Tajganj, Agra', '₹450 - ₹500', '2026-05-30T11:30:00Z', 'open', '{"lat": 27.1682, "lng": 78.0422}'::jsonb)
ON CONFLICT (id) DO NOTHING;`;

// Sound synthesizer using Web Audio API
function playAudioTone(type: "success" | "click" | "error" | "voice-ding") {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === "success") {
      // Pleasant double rising tone
      osc.type = "sine";
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      osc.start();
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.15); // E5
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);
      osc.stop(ctx.currentTime + 0.45);
    } else if (type === "click") {
      // Small snappy tick
      osc.type = "triangle";
      osc.frequency.setValueAtTime(1000, ctx.currentTime);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } else if (type === "voice-ding") {
      // Friendly high ping
      osc.type = "sine";
      osc.frequency.setValueAtTime(880, ctx.currentTime); // A5
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } else if (type === "error") {
      // Flat low warning buzz
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(130, ctx.currentTime);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    }
  } catch (e) {
    // Browser gesture restriction or audio blocked
  }
}

export default function App() {
  // Navigation & Language States
  const [lang, setLang] = useState<"hi" | "en">("hi");
  const [activeTab, setActiveTab] = useState<string>("search_jobs");
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(true);

  // Worker Database (State-managed with LocalStorage persistence)
  const [workers, setWorkers] = useState<Worker[]>(() => {
    const saved = localStorage.getItem("kaam_workers");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_WORKERS;
      }
    }
    return INITIAL_WORKERS;
  });

  // Persist workers database to LocalStorage whenever altered
  useEffect(() => {
    try {
      localStorage.setItem("kaam_workers", JSON.stringify(workers));
    } catch (e) {
      console.warn("Storage quota limit reached for workers:", e);
    }
  }, [workers]);

  // Job Database (State-managed with LocalStorage persistence)
  const [jobs, setJobs] = useState<Job[]>(() => {
    const saved = localStorage.getItem("kaam_jobs");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_JOBS;
      }
    }
    return INITIAL_JOBS;
  });

  // Persist jobs database to LocalStorage whenever altered
  useEffect(() => {
    try {
      localStorage.setItem("kaam_jobs", JSON.stringify(jobs));
    } catch (e) {
      console.warn("Storage quota limit reached for jobs:", e);
    }
  }, [jobs]);

  // Supabase live database link state variables
  const [sbUrl, setSbUrl] = useState<string>(() => {
    return localStorage.getItem("supabase_sync_url") || ((import.meta as any).env?.VITE_SUPABASE_URL) || "https://zthlaxiglsxpstawelqf.supabase.co";
  });
  const [sbKey, setSbKey] = useState<string>(() => {
    return localStorage.getItem("supabase_sync_anon_key") || ((import.meta as any).env?.VITE_SUPABASE_ANON_KEY) || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp0aGxheGlnbHN4cHN0YXdlbHFmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAzMTYzOTEsImV4cCI6MjA5NTg5MjM5MX0.sVkfTdjPNTfGf2uxOFBqPQ1odzNHJVlXvVCs0rRXU34";
  });
  const [sbSyncing, setSbSyncing] = useState<boolean>(false);
  const [sbStatus, setSbStatus] = useState<"disconnected" | "connected" | "error">("disconnected");
  const [sbErrorMsg, setSbErrorMsg] = useState<string>("");

  const syncWithSupabase = async (urlStr: string, keyStr: string, forceNotice = false) => {
    // Gracefully clean up REST v1 suffixes if accidentally pasted in
    let cleanedUrlInput = urlStr.trim().replace(/\/$/, "");
    if (cleanedUrlInput.endsWith("/rest/v1")) {
      cleanedUrlInput = cleanedUrlInput.substring(0, cleanedUrlInput.length - 8);
    }
    cleanedUrlInput = cleanedUrlInput.replace(/\/$/, "");

    if (!cleanedUrlInput || !keyStr.trim()) {
      setSbStatus("disconnected");
      return;
    }

    if (!cleanedUrlInput.startsWith("http://") && !cleanedUrlInput.startsWith("https://")) {
      setSbStatus("error");
      setSbErrorMsg("Invalid Supabase URL: Must start with http:// or https://");
      return;
    }

    setSbSyncing(true);
    try {
      // 1. Synchronize Workers
      const remote = await fetchSupabaseWorkers(cleanedUrlInput, keyStr);
      setSbStatus("connected");
      setDbTablesMissing(false);
      setSbErrorMsg("");
      
      // Merge pulls and local listings dynamically based on ID matching
      setWorkers(prev => {
        const localMap = new Map<string, Worker>(prev.map(w => [w.id, w]));
        const remoteMap = new Map<string, Worker>(remote.map(w => [w.id, w]));
        
        // Find if there are local workers not on remote yet
        prev.forEach(w => {
          if (!remoteMap.has(w.id)) {
            // Push to remote in background
            insertSupabaseWorker(cleanedUrlInput, keyStr, w).catch(err => console.error("Error syncing local worker to remote:", err));
          }
        });

        // Combine
        const allKeys = Array.from(new Set([...Array.from(localMap.keys()), ...Array.from(remoteMap.keys())]));
        const merged = allKeys.map(id => {
          const loc = localMap.get(id);
          const rem = remoteMap.get(id);
          return rem || loc!;
        });
        
        return merged;
      });

      // 2. Synchronize Jobs
      const remoteJobs = await fetchSupabaseJobs(cleanedUrlInput, keyStr).catch(err => {
        console.warn("Could not fetch jobs table (may need table creation in Supabase):", err);
        return [] as Job[];
      });

      if (remoteJobs && remoteJobs.length > 0) {
        setJobs(prev => {
          const localMap = new Map<string, Job>(prev.map(j => [j.id, j]));
          const remoteMap = new Map<string, Job>(remoteJobs.map(j => [j.id, j]));

          prev.forEach(j => {
            if (!remoteMap.has(j.id)) {
              insertSupabaseJob(cleanedUrlInput, keyStr, j).catch(err => console.error("Error syncing local job:", err));
            }
          });

          const allKeys = Array.from(new Set([...Array.from(localMap.keys()), ...Array.from(remoteMap.keys())]));
          const merged = allKeys.map(id => {
            const loc = localMap.get(id);
            const rem = remoteMap.get(id);
            return rem || loc!;
          });

          return merged;
        });
      }

      // 3. Synchronize Assignments
      const remoteAssignments = await fetchSupabaseAssignments(cleanedUrlInput, keyStr).catch(err => {
        console.warn("Could not fetch assignments table (may need table creation in Supabase):", err);
        return [] as Assignment[];
      });

      if (remoteAssignments && remoteAssignments.length > 0) {
        setAssignments(prev => {
          const localMap = new Map<string, Assignment>(prev.map(a => [a.id, a]));
          const remoteMap = new Map<string, Assignment>(remoteAssignments.map(a => [a.id, a]));

          prev.forEach(a => {
            if (!remoteMap.has(a.id)) {
              insertSupabaseAssignment(cleanedUrlInput, keyStr, a).catch(err => console.error("Error syncing local assignment to remote:", err));
            }
          });

          const allKeys = Array.from(new Set([...Array.from(localMap.keys()), ...Array.from(remoteMap.keys())]));
          const merged = allKeys.map(id => {
            const loc = localMap.get(id);
            const rem = remoteMap.get(id);
            return rem || loc!;
          });

          return merged;
        });
      }

      // 4. Synchronize User Profiles
      const remoteProfiles = await fetchSupabaseProfiles(cleanedUrlInput, keyStr).catch(err => {
        console.warn("Could not fetch profiles table (may need table creation in Supabase):", err);
        return [] as UserProfile[];
      });

      if (remoteProfiles && remoteProfiles.length > 0) {
        setProfiles(prev => {
          const localMap = new Map<string, UserProfile>(prev.map(p => [p.phone, p]));
          const remoteMap = new Map<string, UserProfile>(remoteProfiles.map(p => [p.phone, p]));

          // Upload local profiles not on remote
          prev.forEach(p => {
            if (!remoteMap.has(p.phone)) {
              insertSupabaseProfile(cleanedUrlInput, keyStr, p).catch(err => console.error("Error syncing profile to remote:", err));
            }
          });

          const allKeys = Array.from(new Set([...Array.from(localMap.keys()), ...Array.from(remoteMap.keys())]));
          const merged = allKeys.map(phone => {
            const loc = localMap.get(phone);
            const rem = remoteMap.get(phone);
            return rem || loc!;
          });
          return merged;
        });
      }

      // 5. Synchronize Login Records
      const remoteLoginRecords = await fetchSupabaseLoginRecords(cleanedUrlInput, keyStr).catch(err => {
        console.warn("Could not fetch login records table (may need table creation in Supabase):", err);
        return [] as SystemLoginRecord[];
      });

      if (remoteLoginRecords && remoteLoginRecords.length > 0) {
        setLoginRecords(prev => {
          const localMap = new Map<string, SystemLoginRecord>(prev.map(lr => [lr.id, lr]));
          const remoteMap = new Map<string, SystemLoginRecord>(remoteLoginRecords.map(lr => [lr.id, lr]));

          // Upload local records not on remote
          prev.forEach(lr => {
            if (!remoteMap.has(lr.id)) {
              insertSupabaseLoginRecord(cleanedUrlInput, keyStr, lr).catch(err => console.error("Error syncing login record to remote:", err));
            }
          });

          const allKeys = Array.from(new Set([...Array.from(localMap.keys()), ...Array.from(remoteMap.keys())]));
          return allKeys.map(id => remoteMap.get(id) || localMap.get(id)!);
        });
      }

      if (forceNotice) {
        showNotification(
          lang === "hi" ? "सुपाबेस डेटाबेस से सफलतापूर्वक सिंक हो गया!" : "Successfully synchronized with Supabase cloud!",
          "success"
        );
      }
    } catch (err: any) {
      console.error(err);
      setSbStatus("error");
      const errMsg = (err.message || "").toLowerCase();
      if (
        errMsg.includes("does not exist") ||
        errMsg.includes("relation") ||
        errMsg.includes("404") ||
        errMsg.includes("not found") ||
        errMsg.includes("schema cache") ||
        errMsg.includes("could not find") ||
        errMsg.includes("table")
      ) {
        setDbTablesMissing(true);
        setSbErrorMsg(lang === "hi" ? "डेटाबेस में टेबल्स नहीं मिलें। कृपया SQL रन करें।" : "Tables do not exist in database. Please run the SQL schema script.");
      } else {
        setSbErrorMsg(err.message || "Failed client connection to database");
      }
      if (forceNotice) {
        showNotification(
          lang === "hi" ? "कनेक्शन एरर। करेटेंशियल जांचें।" : "Connection error. Double-check your credentials.",
          "error"
        );
      }
    } finally {
      setSbSyncing(false);
    }
  };

  const autoRecordProfileAndLoginOnSupabase = async (uName: string, uPhone: string, uRole: string) => {
    const timestamp = new Date().toISOString();
    const recordId = "log-" + Date.now() + "-" + Math.floor(Math.random() * 1000);

    // Save locally first for robust immediate feedback
    const newProfile: UserProfile = {
      phone: uPhone,
      name: uName,
      role: uRole,
      lastLogin: timestamp,
      status: "active"
    };

    setProfiles(prev => {
      const filtered = prev.filter(p => p.phone !== uPhone);
      return [...filtered, newProfile];
    });

    const newLoginRecord: SystemLoginRecord = {
      id: recordId,
      phone: uPhone,
      name: uName,
      role: uRole,
      timestamp
    };

    setLoginRecords(prev => [newLoginRecord, ...prev].slice(0, 100));

    if (!sbUrl || !sbKey) return;
    try {
      const cleanedUrl = sbUrl.trim().replace(/\/$/, "");
      
      // 1. Save profile to public.profiles
      await insertSupabaseProfile(cleanedUrl, sbKey, {
        phone: uPhone,
        name: uName,
        role: uRole,
        lastLogin: timestamp
      }).catch(err => {
        console.warn("Could not insert profile (table may not exist or require schema in Supabase):", err);
      });

      // 2. Save login record to public.login_records
      await insertSupabaseLoginRecord(cleanedUrl, sbKey, {
        id: recordId,
        phone: uPhone,
        name: uName,
        role: uRole,
        timestamp: timestamp
      }).catch(err => {
        console.warn("Could not insert login record (table may not exist or require schema in Supabase):", err);
      });

      console.log(`Automatic profile & login synced to Supabase for ${uName} (${uPhone})`);
    } catch (err) {
      console.error("Auto recording to Supabase failed silently:", err);
    }
  };

  // Sync automatically on mount
  useEffect(() => {
    if (sbUrl && sbKey) {
      syncWithSupabase(sbUrl, sbKey, false);
    }
  }, [sbUrl, sbKey]);

  // Customer Location System State
  const [customerCoords, setCustomerCoords] = useState<{ lat: number; lng: number } | null>({
    lat: 27.1682, // Defaulting to Tajganj coordinates in Agra
    lng: 78.0422
  });
  const [detectedLocName, setDetectedLocName] = useState<string>("Tajganj, Agra");
  const [gpsLoading, setGpsLoading] = useState<boolean>(false);

  // Search Screen Filter States
  const [selectedCityFilter, setSelectedCityFilter] = useState<string>("Agra");
  const [selectedAreaFilter, setSelectedAreaFilter] = useState<string>("");
  const [selectedSkillFilter, setSelectedSkillFilter] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeSearchSegment, setActiveSearchSegment] = useState<"kaamgar" | "material_stores">("kaamgar");

  // Customer Action Toast Notifications
  const [notification, setNotification] = useState<{
    text: string;
    type: "success" | "info" | "error";
  } | null>(null);

  const showNotification = (text: string, type: "success" | "info" | "error" = "success") => {
    setNotification({ text, type });
    playAudioTone(type === "error" ? "error" : "success");
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // Speaks out instructions if help is enabled
  const triggerVoiceGuidance = (textHi: string, textEn: string) => {
    if (!voiceEnabled) return;
    speakText(lang === "hi" ? textHi : textEn, lang === "hi" ? "hi-IN" : "en-US");
  };

  // Welcome announcement voice guidance on load
  useEffect(() => {
    const timer = setTimeout(() => {
      triggerVoiceGuidance(
        "काम खोजने के लिए नीचे दिए गए बटन पर जाएं या नया कामगार जोड़ने के लिए नया पंजीकरण दबाएं।",
        "Welcome to Kaam. Tap standard buttons to find local workers or click Register to seek work."
      );
    }, 1200);
    return () => clearTimeout(timer);
  }, [lang]);

  // Handle Geolocation API to detect customer coordinates
  const detectCustomerGPS = (silent = false) => {
    setGpsLoading(true);
    if (!silent) {
      playAudioTone("click");
    }
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setCustomerCoords({ lat, lng });
          setDetectedLocName(`Coordinates: ${lat.toFixed(4)}, ${lng.toFixed(4)}`);
          setGpsLoading(false);
          if (!silent) {
            showNotification(
              lang === "hi"
                ? "आपका वर्तमान जीपीएस स्थान ले लिया गया है!"
                : "Current GPS location fetched successfully!",
              "success"
            );
            triggerVoiceGuidance(
              "आपका स्थान सफलतापूर्वक मिल गया है। अब आपको सबसे पास के कारीगर दिखाई देंगे।",
              "Your location has been fetched. We will show you the closest workers first."
            );
          }
        },
        (error) => {
          console.error(error);
          setGpsLoading(false);
          if (!silent) {
            showNotification(
              lang === "hi"
                ? "जीपीएस सिग्नल नहीं मिला। वैकल्पिक स्थान चुनें।"
                : "GPS unavailable. Please select your area manually.",
              "error"
            );
          }
        },
        { enableHighAccuracy: true, timeout: 6000 }
      );
    } else {
      setGpsLoading(false);
      if (!silent) {
        showNotification(
          lang === "hi" ? "आपका ब्राउज़र जीपीएस सक्षम नहीं है।" : "GPS unsupported on this device.",
          "error"
        );
      }
    }
  };

  // Run automatic geolocation search on app mount to instantly sort nearest openings/workers
  useEffect(() => {
    detectCustomerGPS(true);
  }, []);

  // --- Session Login & Dual Role States ---
  const [currentUser, setCurrentUser] = useState<{ name: string; phone: string; role: "laborer" | "employer" | "admin" } | null>(() => {
    const saved = localStorage.getItem("kaam_logged_user");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const [loginRole, setLoginRole] = useState<"laborer" | "employer" | "admin" | "qr_scan">("laborer");
  const [loginName, setLoginName] = useState<string>("");
  const [loginPhone, setLoginPhone] = useState<string>("");
  const [adminPassword, setAdminPassword] = useState<string>("");

  // QR Simulator & Behalf entry states
  const [scannedWorkerId, setScannedWorkerId] = useState<string>("");
  const [scannedWorkerObj, setScannedWorkerObj] = useState<Worker | null>(null);
  const [isScanningActive, setIsScanningActive] = useState<boolean>(false);
  const [qrScanSuccess, setQrScanSuccess] = useState<boolean>(false);

  // Behalf states
  const [behalfName, setBehalfName] = useState<string>("");
  const [behalfPhone, setBehalfPhone] = useState<string>("");
  const [behalfArea, setBehalfArea] = useState<string>("Tajganj");
  const [behalfCity, setBehalfCity] = useState<string>("Agra");
  const [behalfAddress, setBehalfAddress] = useState<string>("");
  const [behalfSelectedSkills, setBehalfSelectedSkills] = useState<string[]>([]);

  // Job Assignments Database (State-managed with LocalStorage persistence & Supabase Sync)
  const [assignments, setAssignments] = useState<Assignment[]>(() => {
    const saved = localStorage.getItem("kaam_assignments");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  // Persist assignments to local storage
  useEffect(() => {
    try {
      localStorage.setItem("kaam_assignments", JSON.stringify(assignments));
    } catch (e) {
      console.warn("Storage quota limit reached for assignments:", e);
    }
  }, [assignments]);

  // Assign job modal state hooks
  const [assigningWorker, setAssigningWorker] = useState<Worker | null>(null);
  const [selectedJobToAssign, setSelectedJobToAssign] = useState<string>("");
  const [customJobToAssign, setCustomJobToAssign] = useState<string>("");

  // --- Job Posting Form States ---
  const [jobTitle, setJobTitle] = useState<string>("");
  const [jobDesc, setJobDesc] = useState<string>("");
  const [jobSkill, setJobSkill] = useState<string>("mason");
  const [jobCustomSkillText, setJobCustomSkillText] = useState<string>("");
  const [jobWage, setJobWage] = useState<string>("");
  const [jobArea, setJobArea] = useState<string>("Tajganj");
  const [jobAddress, setJobAddress] = useState<string>("");
  const [appliedJobs, setAppliedJobs] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("kaam_applied_jobs");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("kaam_applied_jobs", JSON.stringify(appliedJobs));
  }, [appliedJobs]);

  // --- Registration Flow State ---
  const [forceRegWizard, setForceRegWizard] = useState<boolean>(false);
  const [regStep, setRegStep] = useState<number>(1);
  const [regPhoto, setRegPhoto] = useState<string>("");
  const [regName, setRegName] = useState<string>("");
  const [regMobile, setRegMobile] = useState<string>("");
  const [regSelectedSkills, setRegSelectedSkills] = useState<string[]>([]);
  const [regCustomSkillText, setRegCustomSkillText] = useState<string>("");
  const [regCity, setRegCity] = useState<string>("Agra");
  const [regArea, setRegArea] = useState<string>("Tajganj");
  const [regAddress, setRegAddress] = useState<string>("");
  const [regIsRecording, setRegIsRecording] = useState<boolean>(false);

  // Dynamic voice instructions step by step during registration
  useEffect(() => {
    if (activeTab !== "register") return;
    
    // Play sound and trigger voice speaking for each step
    const voiceInstructions: Record<number, { hi: string; en: string }> = {
      1: {
        hi: "अपना सुंदर फोटो अपलोड करें या खींचें। आगे बढ़ने के लिए कैमरे के बटन पर दबाएं।",
        en: "Please upload or capture your photo to build your profile."
      },
      2: {
        hi: "माइक का बटन दबाकर अपना नाम बोलें या नीचे अपना नाम लिखें।",
        en: "Tap the microphone button and speak your name, or type it below."
      },
      3: {
        hi: "अपना चालू मोबाइल नंबर भरें, ताकि ग्राहक आपको फ़ोन कर सकें।",
        en: "Enter your active 10 digit mobile number so customers can call you."
      },
      4: {
        hi: "आप जो काम करते हैं, उसके बड़े चित्रों/बटन पर दबाकर अपना हुनर चुनें। आप एक से ज्यादा काम चुन सकते हैं।",
        en: "Select all categories of work you can do by tapping the big icons."
      },
      5: {
        hi: "अपना शहर और पास का इलाका चुनें, ताकि पास के लोग आपको बुला सकें।",
        en: "Select your city and neighborhood area for correct matching."
      },
      6: {
        hi: "बधाई हो! आपका सब ब्यौरा तैयार है। नीचे दिए गए हरे बटन 'पंजीकरण पूरा करें' पर दबाएं।",
        en: "Congratulations! Review your profile information and press Submit register button."
      }
    };

    const inst = voiceInstructions[regStep];
    if (inst) {
      triggerVoiceGuidance(inst.hi, inst.en);
    }
  }, [regStep, activeTab]);

  // Voice recording simulation for name
  const toggleVoiceNameInput = () => {
    playAudioTone("voice-ding");
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.lang = lang === "hi" ? "hi-IN" : "en-US";
      rec.continuous = false;
      rec.interimResults = false;

      rec.onstart = () => {
        setRegIsRecording(true);
      };
      rec.onresult = (e: any) => {
        const text = e.results[0][0].transcript;
        setRegName(text);
        setRegIsRecording(false);
        showNotification(
          lang === "hi" ? `नाम दर्ज: ${text}` : `Recognized: ${text}`,
          "success"
        );
      };
      rec.onerror = () => {
        setRegIsRecording(false);
        simulateVoiceInputFallback();
      };
      rec.onend = () => {
        setRegIsRecording(false);
      };
      try {
        rec.start();
      } catch (err) {
        simulateVoiceInputFallback();
      }
    } else {
      simulateVoiceInputFallback();
    }
  };

  const simulateVoiceInputFallback = () => {
    setRegIsRecording(true);
    setTimeout(() => {
      const mockNamesHi = ["रमेश मिस्त्री", "सुनील पेंटर", "अमित कुमार", "पंकज इलेक्ट्रिशियन", "राजू गार्ड"];
      const mockNamesEn = ["Ramesh Mistri", "Sunil Painter", "Amit Kumar", "Pankaj Electrician", "Raju Guard"];
      const randomName = lang === "hi" 
        ? mockNamesHi[Math.floor(Math.random() * mockNamesHi.length)]
        : mockNamesEn[Math.floor(Math.random() * mockNamesEn.length)];
      setRegName(randomName);
      setRegIsRecording(false);
      showNotification(
        lang === "hi" 
          ? `आवाज सिम्यूलेट की गई: "${randomName}"` 
          : `Voice Simulated: "${randomName}"`, 
        "success"
      );
    }, 2000);
  };

  const compressAndSetPhoto = (rawBase64: string, callback: (comp: string) => void) => {
    const img = new Image();
    img.src = rawBase64;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      // Target a high-quality thumbnail (150x150)
      const targetSize = 150;
      let w = img.width;
      let h = img.height;
      if (w > h) {
        if (w > targetSize) {
          h = Math.round((h * targetSize) / w);
          w = targetSize;
        }
      } else {
        if (h > targetSize) {
          w = Math.round((w * targetSize) / h);
          h = targetSize;
        }
      }
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(img, 0, 0, w, h);
        const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7);
        callback(compressedBase64);
      } else {
        callback(rawBase64);
      }
    };
    img.onerror = () => {
      callback(rawBase64);
    };
  };

  const handleChooseLibraryPhoto = (avatarUrl: string) => {
    playAudioTone("click");
    setRegPhoto(avatarUrl);
    showNotification(
      lang === "hi" ? "फोटो चुन लिया गया है!" : "Photo selected successfully!"
    );
  };

  const toggleRegSkill = (skillId: string) => {
    playAudioTone("click");
    if (regSelectedSkills.includes(skillId)) {
      setRegSelectedSkills(regSelectedSkills.filter((s) => s !== skillId));
    } else {
      setRegSelectedSkills([...regSelectedSkills, skillId]);
      // Speak category name when clicked for illiterate feedback
      const cat = CATEGORIES.find(c => c.id === skillId);
      if (cat) {
        const speakTextLabel = lang === 'hi' ? `${cat.name_hi} चुना गया` : `${cat.name_en} selected`;
        speakText(speakTextLabel, lang === "hi" ? "hi-IN" : "en-US");
      }
    }
  };

  const handleCompleteRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Fallback name if empty - allows vendor to select "Others" / change name
    let finalName = regName.trim();
    if (!finalName) {
      finalName = lang === "hi" ? "अन्य विक्रेता / मजदूर (Others)" : "Others (Laborer/Vendor)";
    }

    if (!regMobile.trim() || regMobile.length < 10) {
      showNotification(
        lang === "hi" ? "कृपया 10 अंकों का मोबाइल नंबर डालें!" : "Please enter a valid 10-digit mobile number!",
        "error"
      );
      setRegStep(3);
      return;
    }

    // Fallback category if none selected - assign it to "Others" (other)
    let finalSkills = [...regSelectedSkills];
    if (finalSkills.length === 0) {
      finalSkills = ["other"];
    }

    // Find coordinates for the chosen city & area to calculate distances
    const cityData = INDIAN_CITIES.find(c => c.name_en === regCity);
    const areaData = cityData?.areas.find(a => a.name_en === regArea);
    const lat = areaData?.lat || 27.1682;
    const lng = areaData?.lng || 78.0422;

    const newWorker: Worker = {
      id: "w-" + Date.now(),
      name: finalName,
      name_hi: lang === "hi" ? finalName : undefined,
      phone: regMobile,
      skills: finalSkills,
      city: regCity,
      area: regArea,
      address: regAddress || `${regArea}, ${regCity}`,
      location: { lat, lng },
      photo: regPhoto || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face",
      registeredAt: new Date().toISOString(),
      isApproved: true, // Autoapprove for demonstration in prototype
      rating: 5.0,
      completedJobs: 0,
      isVerified: true,
      customSkillText: regCustomSkillText || undefined
    };

    setWorkers([newWorker, ...workers]);
    
    if (sbUrl && sbKey) {
      insertSupabaseWorker(sbUrl, sbKey, newWorker)
        .then(() => {
          showNotification(
            lang === "hi" ? "प्रोफाइल सुपाबेस क्लाउड पर अपलोड हो गई!" : "Profile pushed online to Supabase!",
            "success"
          );
          // Also record general user profile and login tracing automatically
          autoRecordProfileAndLoginOnSupabase(finalName, regMobile, "laborer");
        })
        .catch(err => {
          console.error("Failed pushing profile to Supabase:", err);
          // Auto record anyway
          autoRecordProfileAndLoginOnSupabase(finalName, regMobile, "laborer");
        });
    }
    playAudioTone("success");
    showNotification(
      lang === "hi" 
        ? "बधाई हो! आपका पंजीकरण 'काम' ऐप पर सुरक्षित हो गया है!" 
        : "Congratulations! Your profile has been registered on KAAM!",
      "success"
    );

    // Reset registration form
    setRegPhoto("");
    setRegName("");
    setRegMobile("");
    setRegSelectedSkills([]);
    setRegCustomSkillText("");
    setRegStep(1);
    setRegAddress("");
    setActiveTab("search"); // Switch to search view so they can see themselves!
    
    // Dynamic speak completion
    setTimeout(() => {
      triggerVoiceGuidance(
        "बधाई हो! आपका नाम और काम रजिस्टर हो गया है। अब लोग आपको काम के लिए कॉल कर सकते हैं।",
        "Congratulations! Your registration is complete. You are now active in search listings."
      );
    }, 1500);
  };

  // --- Admin actions ---
  const [adminSearch, setAdminSearch] = useState<string>("");
  const [editingWorker, setEditingWorker] = useState<Worker | null>(null);
  const [editingProfile, setEditingProfile] = useState<UserProfile | null>(null);
  const [editProfileName, setEditProfileName] = useState<string>("");
  const [editProfilePhone, setEditProfilePhone] = useState<string>("");
  const [editProfileRole, setEditProfileRole] = useState<string>("");
  const [showSqlSchema, setShowSqlSchema] = useState<boolean>(false);
  const [dbTablesMissing, setDbTablesMissing] = useState<boolean>(false);

  // --- Admin/System Management state ---
  const [adminSubTab, setAdminSubTab] = useState<"overview" | "workers" | "employers" | "assignments" | "announcements" | "support" | "audit">("overview");
  const [profiles, setProfiles] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem("kaam_profiles");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [
      { phone: "9876543210", name: "Rajesh Kumar Mistri", role: "laborer", lastLogin: "2026-06-02T05:30:00Z", status: "active" },
      { phone: "9123456780", name: "Ramesh Prasad Bijliwala", role: "laborer", lastLogin: "2026-06-02T04:15:00Z", status: "active" },
      { phone: "9988776655", name: "Mohammad Salim Ahmed", role: "laborer", lastLogin: "2026-06-01T14:45:00Z", status: "active" },
      { phone: "9812345670", name: "Verma Construction Ltd", role: "employer", lastLogin: "2026-06-02T07:10:00Z", status: "active" },
      { phone: "9988998822", name: "Shri Hari Paints & Decorators", role: "employer", lastLogin: "2026-06-01T11:20:00Z", status: "active" },
    ];
  });

  const [loginRecords, setLoginRecords] = useState<SystemLoginRecord[]>(() => {
    const saved = localStorage.getItem("kaam_login_records");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [
      { id: "log-1", phone: "9876543210", name: "Rajesh Kumar Mistri", role: "laborer", timestamp: "2026-06-02T05:30:00Z" },
      { id: "log-2", phone: "9812345670", name: "Verma Construction Ltd", role: "employer", timestamp: "2026-06-02T07:10:00Z" },
      { id: "log-3", phone: "9988998822", name: "Shri Hari Paints & Decorators", role: "employer", timestamp: "2026-06-01T11:20:00Z" },
    ];
  });

  const [announcements, setAnnouncements] = useState<Array<{ id: string; title: string; message: string; target: string; timestamp: string; sender: string }>>(() => {
    const saved = localStorage.getItem("kaam_announcements");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [
      { id: "ann-1", title: "Tajganj Construction Drive", message: "Special labor requirement drive in West Gate construction area. High daily wages approved.", target: "laborers", timestamp: "2026-06-02T06:15:00Z", sender: "Master Admin" }
    ];
  });

  const [supportTickets, setSupportTickets] = useState<Array<{ id: string; userPhone: string; userName: string; userRole: string; issue: string; status: "open" | "resolved"; responseText?: string; timestamp: string }>>(() => {
    const saved = localStorage.getItem("kaam_support_tickets");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [
      { id: "ticket-1", userPhone: "9876543210", userName: "Rajesh Kumar Mistri", userRole: "laborer", issue: "Mason daily wage rates in Agra got lowered this week.", status: "open", timestamp: "2026-06-02T06:00:00Z" },
      { id: "ticket-2", userPhone: "9812345670", userName: "Verma Construction Ltd", userRole: "employer", issue: "Unable to verify GPS coordinate map pin in Tajganj.", status: "resolved", responseText: "Recommended updating mobile GPS permissions flag.", timestamp: "2026-06-01T08:00:00Z" }
    ];
  });

  const [auditLogs, setAuditLogs] = useState<Array<{ id: string; action: string; timestamp: string; admin: string; category: string }>>(() => {
    const saved = localStorage.getItem("kaam_audit_logs");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [
      { id: "audit-1", action: "System Management Initialized", timestamp: "2026-06-02T00:00:00Z", admin: "System", category: "system" }
    ];
  });

  // Persists
  useEffect(() => {
    try {
      localStorage.setItem("kaam_profiles", JSON.stringify(profiles));
    } catch (e) {
      console.warn("Storage quota limit reached for profiles:", e);
    }
  }, [profiles]);

  useEffect(() => {
    try {
      localStorage.setItem("kaam_login_records", JSON.stringify(loginRecords));
    } catch (e) {
      console.warn("Storage quota limit reached for login records:", e);
    }
  }, [loginRecords]);

  useEffect(() => {
    try {
      localStorage.setItem("kaam_announcements", JSON.stringify(announcements));
    } catch (e) {
      console.warn("Storage quota limit reached for announcements:", e);
    }
  }, [announcements]);

  useEffect(() => {
    try {
      localStorage.setItem("kaam_support_tickets", JSON.stringify(supportTickets));
    } catch (e) {
      console.warn("Storage quota limit reached for support tickets:", e);
    }
  }, [supportTickets]);

  useEffect(() => {
    try {
      localStorage.setItem("kaam_audit_logs", JSON.stringify(auditLogs));
    } catch (e) {
      console.warn("Storage quota limit reached for audit logs:", e);
    }
  }, [auditLogs]);

  const handleToggleApprove = (id: string) => {
    playAudioTone("click");
    setWorkers(workers.map(w => {
      if (w.id === id) {
        const nextState = !w.isApproved;
        showNotification(
          lang === "hi"
            ? `${w.name} की प्रोफाइल ${nextState ? "मंजूर" : "अमान्य"} की गई`
            : `${w.name}'s profile ${nextState ? "Approved" : "Unapproved"}`
        );
        if (sbUrl && sbKey) {
          updateSupabaseWorkerApproval(sbUrl, sbKey, id, nextState)
            .catch(err => console.error("Failed to sync approval to Supabase:", err));
        }
        return { ...w, isApproved: nextState };
      }
      return w;
    }));
  };

  const handleVerifyWorker = (id: string) => {
    playAudioTone("click");
    setWorkers(workers.map(w => {
      if (w.id === id) {
        const nextState = !w.isVerified;
        showNotification(
          lang === "hi"
            ? `${w.name} को ${nextState ? "सत्यापित बैच मिला" : "बैच हटाया गया"}`
            : `${w.name} ${nextState ? "Verified" : "Verification removed"}`
        );
        if (sbUrl && sbKey) {
          updateSupabaseWorkerVerification(sbUrl, sbKey, id, nextState)
            .catch(err => console.error("Failed to sync verification to Supabase:", err));
        }
        return { ...w, isVerified: nextState };
      }
      return w;
    }));
  };

  const handleDeleteWorker = (id: string) => {
    if (confirm(lang === 'hi' ? 'क्या आप इस कामगार को हटाना चाहते हैं?' : 'Are you sure you want to delete this worker?')) {
      playAudioTone("error");
      setWorkers(workers.filter(w => w.id !== id));
      if (sbUrl && sbKey) {
        deleteSupabaseWorker(sbUrl, sbKey, id)
          .catch(err => console.error("Failed to delete from Supabase:", err));
      }
      showNotification(
        lang === "hi" ? "कामगार प्रोफाइल डिलीट कर दी गई" : "Worker profile deleted successfully",
        "info"
      );
    }
  };

  const handleSaveEditedWorker = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingWorker) return;
    setWorkers(workers.map(w => w.id === editingWorker.id ? editingWorker : w));
    if (sbUrl && sbKey) {
      updateSupabaseWorker(sbUrl, sbKey, editingWorker)
        .catch(err => console.error("Failed to update on Supabase:", err));
    }
    setEditingWorker(null);
    showNotification(
      lang === "hi" ? "कामगार की जानकारी अपडेट की गई" : "Worker details updated successfully"
    );
  };

  const handleToggleWorkerAvailabilityStatus = (id: string) => {
    playAudioTone("click");
    setWorkers(prev => prev.map(w => {
      if (w.id === id) {
        const nextStatus = w.status === "busy" ? "available" : "busy";
        showNotification(
          lang === "hi"
            ? `${w.name} की स्थिति अब ${nextStatus === "available" ? "खाली / उपलब्ध" : "व्यस्त (काम पर)"} घोषित की गई`
            : `${w.name} is now declared ${nextStatus === "available" ? "Available / Empty" : "Busy / Working"}`
        );
        const updatedWorker = { ...w, status: nextStatus };
        if (sbUrl && sbKey) {
          updateSupabaseWorker(sbUrl, sbKey, updatedWorker)
            .catch(err => console.error("Failed to sync worker status to Supabase:", err));
        }
        return updatedWorker;
      }
      return w;
    }));
  };

  const handleToggleJobCompletionStatus = (id: string) => {
    playAudioTone("click");
    setJobs(prev => prev.map(j => {
      if (j.id === id) {
        const nextStatus = j.status === "completed" ? "open" : "completed";
        showNotification(
          lang === "hi"
            ? `काम की स्थिति अब ${nextStatus === "completed" ? "पूरा" : "लंबित (चालू)"} घोषित की गई!`
            : `Job status is now ${nextStatus === "completed" ? "Completed" : "Pending / Open"}!`
        );
        const updatedJob = { ...j, status: nextStatus };
        if (sbUrl && sbKey) {
          updateSupabaseJob(sbUrl, sbKey, updatedJob)
            .catch(err => console.error("Failed to sync status to Supabase:", err));
        }
        return updatedJob;
      }
      return j;
    }));
  };

  const handleEditProfileClick = (profile: UserProfile) => {
    setEditingProfile(profile);
    setEditProfileName(profile.name);
    setEditProfilePhone(profile.phone);
    setEditProfileRole(profile.role);
    playAudioTone("click");
  };

  const handleSaveEditedProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProfile) return;
    
    const updatedProfiles = profiles.map(p => {
      if (p.phone === editingProfile.phone) {
        const nextProfile = {
          ...p,
          name: editProfileName,
          phone: editProfilePhone,
          role: editProfileRole
        };
        if (sbUrl && sbKey) {
          updateSupabaseProfile(sbUrl, sbKey, editingProfile.phone, {
            name: editProfileName,
            phone: editProfilePhone,
            role: editProfileRole
          }).catch(err => console.error("Error updating Supabase profile:", err));
        }
        return nextProfile;
      }
      return p;
    });

    setProfiles(updatedProfiles);
    
    // Log Audit
    const newAudit = {
      id: "audit-" + Date.now(),
      action: `Edited administrative details for profile ${editProfileName} (${editProfilePhone})`,
      timestamp: new Date().toISOString(),
      admin: currentUser?.name || "Master Admin",
      category: "account"
    };
    setAuditLogs(prev => [newAudit, ...prev]);

    setEditingProfile(null);
    showNotification(
      lang === "hi" ? "प्रोफ़ाइल विवरण अपडेट कर दिए गए!" : "User profile details updated successfully",
      "success"
    );
    playAudioTone("success");
  };

  const handleToggleSuspendProfile = (phone: string) => {
    playAudioTone("click");
    let changedName = "";
    let nextStatus: string = "active";
    
    setProfiles(prev => prev.map(p => {
      if (p.phone === phone) {
        changedName = p.name;
        nextStatus = p.status === "suspended" ? "active" : "suspended";
        if (sbUrl && sbKey) {
          updateSupabaseProfile(sbUrl, sbKey, phone, { status: nextStatus as "active" | "suspended" })
            .catch(err => console.error("Failed to update profile status on Supabase:", err));
        }
        return { ...p, status: nextStatus as "active" | "suspended" };
      }
      return p;
    }));

    showNotification(
      lang === "hi"
        ? `${changedName || "सदस्य"} का खाता ${nextStatus === "suspended" ? "निलंबित" : "सक्रिय"} कर दिया गया है`
        : `${changedName || "User"}'s account has been ${nextStatus === "suspended" ? "suspended" : "activated"}`,
      nextStatus === "suspended" ? "info" : "success"
    );
    
    // Log audit
    const newAudit = {
      id: "audit-" + Date.now(),
      action: `${nextStatus === "suspended" ? "Suspended" : "Activated"} profile account of ${changedName || "User"} (${phone})`,
      timestamp: new Date().toISOString(),
      admin: currentUser?.name || "Master Admin",
      category: "account"
    };
    setAuditLogs(auditPrev => [newAudit, ...auditPrev]);
  };

  const handlePermanentDeleteProfile = (phone: string) => {
    if (!confirm(lang === "hi" ? "क्या आप इस खाते को स्थायी रूप से मिटाना चाहते हैं? यह वापस नहीं आएगा!" : "Are you sure you want to permanently delete this user profile? This action is irreversible!")) return;
    playAudioTone("error");
    
    let deletedName = "";
    setProfiles(prev => {
      const match = prev.find(p => p.phone === phone);
      if (match) deletedName = match.name;
      return prev.filter(p => p.phone !== phone);
    });

    // Also delete from workers table if they are registered as worker
    setWorkers(prev => prev.filter(w => w.phone !== phone));

    if (sbUrl && sbKey) {
      deleteSupabaseProfile(sbUrl, sbKey, phone).catch(err => console.error("Error deleting Supabase profile:", err));
      // Also delete from worker if any
      const matchWorker = workers.find(w => w.phone === phone);
      if (matchWorker) {
        deleteSupabaseWorker(sbUrl, sbKey, matchWorker.id).catch(err => console.error("Error deleting Supabase worker:", err));
      }
    }

    showNotification(
      lang === "hi" ? "खाता स्थायी रूप से हटा दिया गया!" : "Account permanently pruned from database registries!",
      "success"
    );

    // Audit log
    const newAudit = {
      id: "audit-" + Date.now(),
      action: `Permanently deleted account and all registry data of ${deletedName || "User"} (${phone})`,
      timestamp: new Date().toISOString(),
      admin: currentUser?.name || "Master Admin",
      category: "account"
    };
    setAuditLogs(prev => [newAudit, ...prev]);
  };

  const handleAssignJobSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assigningWorker) return;

    let finalJobTitle = "";
    let finalJobTitleHi = "";
    let finalJobId = "custom";

    if (selectedJobToAssign && selectedJobToAssign !== "custom") {
      const parentJob = jobs.find(j => j.id === selectedJobToAssign);
      if (parentJob) {
        finalJobTitle = parentJob.title;
        finalJobTitleHi = parentJob.title_hi || parentJob.title;
        finalJobId = parentJob.id;
      }
    } else {
      if (!customJobToAssign.trim()) {
        showNotification(
          lang === "hi" ? "कृपया काम का नाम लिखें!" : "Please write a custom job title!",
          "error"
        );
        return;
      }
      finalJobTitle = customJobToAssign.trim();
      finalJobTitleHi = customJobToAssign.trim();
    }

    const newAssignment: Assignment = {
      id: `assign-${Date.now()}`,
      jobId: finalJobId,
      workerId: assigningWorker.id,
      assignedAt: new Date().toLocaleDateString(lang === "hi" ? "hi-IN" : "en-US", {
        year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
      }),
      status: 'assigned',
      employerName: currentUser?.name || "Agra Employer",
      employerPhone: currentUser?.phone || "0000000000",
      workerName: assigningWorker.name,
      workerPhone: assigningWorker.phone,
      jobTitle: finalJobTitle,
      jobTitle_hi: finalJobTitleHi,
      workerSkills: assigningWorker.skills
    };

    // 1. Update local UI state
    setAssignments(prev => [newAssignment, ...prev]);

    // 2. Clear assignment form variables
    setAssigningWorker(null);
    setSelectedJobToAssign("");
    setCustomJobToAssign("");
    playAudioTone("success");

    // 3. Sync to Supabase cloud in background
    if (sbUrl && sbKey) {
      try {
        await insertSupabaseAssignment(sbUrl, sbKey, newAssignment);
        showNotification(
          lang === "hi" ? "कामगार को सफलतापूर्वक काम सौंपा गया और क्लाउड पर सिंक हुआ!" : "Task assigned on cloud and synchronized with Supabase!",
          "success"
        );
      } catch (err) {
        console.warn("Db sync failed (schema table assignments might be missing), but saved to local memory:", err);
        showNotification(
          lang === "hi" ? "काम सौंपा गया (लोकल डिवाइस डेटाबेस में सुरक्षित)!" : "Task assigned successfully (saved locally only)!",
          "success"
        );
      }
    } else {
      showNotification(
        lang === "hi" ? "काम सौंपा गया (लोकल डिवाइस डेटाबेस में सुरक्षित)!" : "Task assigned successfully (saved locally only)!",
        "success"
      );
    }
  };

  const handleDeleteAssignment = async (id: string) => {
    if (confirm(lang === "hi" ? "क्या आप इस काम के असाइनमेंट को हटाना चाहते हैं?" : "Are you sure you want to remove this task assignment?")) {
      playAudioTone("error");
      setAssignments(prev => prev.filter(a => a.id !== id));
      showNotification(
        lang === "hi" ? "असाइनमेंट हटाया गया!" : "Assignment removed successfully!",
        "info"
      );
      if (sbUrl && sbKey) {
        try {
          const cleanedUrl = sbUrl.replace(/\/$/, "");
          const res = await fetch(`${cleanedUrl}/rest/v1/assignments?id=eq.${id}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              "apikey": sbKey,
              "Authorization": `Bearer ${sbKey}`,
              "Prefer": "return=minimal"
            }
          });
          if (!res.ok) console.warn("Supabase assignment delete failed");
        } catch (err) {
          console.error("Supabase assignment delete error:", err);
        }
      }
    }
  };


  // --- Distance & Sorting & Filter Operations for App View ---
  const getWorkerCategoryDetails = (worker: Worker): Category[] => {
    return CATEGORIES.filter(c => (worker.skills || []).includes(c.id));
  };

  // Compute final lists
  const filteredWorkersForCustomer = workers.filter(worker => {
    // Check approval
    if (!worker.isApproved) return false;

    // Filter by city
    if (selectedCityFilter && worker.city !== selectedCityFilter) return false;

    // Filter by area
    if (selectedAreaFilter && worker.area !== selectedAreaFilter) return false;

    // Segment filter: Workers (no vendor skills) vs Material Stores (has vendor skills starting with vendor_)
    const isVendorSkill = (worker.skills || []).some(s => s.startsWith("vendor_"));
    if (activeSearchSegment === "material_stores") {
      if (!isVendorSkill) return false;
    } else {
      if (isVendorSkill) return false;
    }

    // Filter by skill category
    if (selectedSkillFilter && !(worker.skills || []).includes(selectedSkillFilter)) return false;

    // Search query matches name or skill title
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const nameMatch = worker.name.toLowerCase().includes(q) || (worker.name_hi && worker.name_hi.includes(q));
      const skillNameMatch = getWorkerCategoryDetails(worker).some(cat => 
        cat.name_en.toLowerCase().includes(q) || cat.name_hi.includes(q)
      );
      if (!nameMatch && !skillNameMatch) return false;
    }

    return true;
  }).map(worker => {
    // Add dynamic distance if customer coordinates exist
    let distance = 999;
    if (customerCoords) {
      distance = getDistanceKM(
        customerCoords.lat,
        customerCoords.lng,
        worker.location.lat,
        worker.location.lng
      );
    }
    return { ...worker, distance };
  }).sort((a, b) => a.distance - b.distance); // Show closest first.

  return (
    <div id="kaam-app-container" className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col antialiased selection:bg-emerald-100 pb-16">
      
      {/* Toast Notification Banner */}
      <AnimatePresence>
        {notification && (
          <motion.div
            id="toast-notification"
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className={`fixed top-4 left-4 right-4 z-50 p-4 rounded-xl shadow-xl flex items-center justify-between text-white ${
              notification.type === "error"
                ? "bg-red-600"
                : notification.type === "info"
                ? "bg-slate-800"
                : "bg-emerald-600"
            } md:max-w-md md:mx-auto`}
          >
            <div className="flex items-center space-x-3">
              {notification.type === "error" ? (
                <AlertCircle className="w-6 h-6 shrink-0" />
              ) : (
                <CheckCircle2 className="w-6 h-6 shrink-0" />
              )}
              <span className="font-semibold text-sm leading-snug">{notification.text}</span>
            </div>
            <button
              onClick={() => {
                playAudioTone("click");
                setNotification(null);
              }}
              className="text-white hover:opacity-80 p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main App Bar Header */}
      <header id="main-header" className="sticky top-0 z-40 bg-white border-b-2 border-[#FFD8C2] shadow-xs backdrop-blur-md bg-white/95">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          
          {/* Logo Brand with Bilingual title */}
          <div 
            onClick={() => {
              playAudioTone("click");
              setActiveTab("search");
            }}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-11 h-11 bg-[#FF4D00] rounded-xl flex items-center justify-center text-white font-black text-2xl shadow-lg transition-transform group-hover:scale-105">
              K
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-[#FF4D00] flex items-baseline leading-none">
                KAAM <span className="text-slate-800 font-extrabold ml-1.5 text-lg">काम</span>
              </h1>
              <p className="text-[10px] text-slate-500 font-extrabold uppercase tracking-widest">Smart Labor Connect</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            
            {/* Bilingual Voice Didi Toggle Button */}
            <button
              onClick={() => {
                const nextState = !voiceEnabled;
                setVoiceEnabled(nextState);
                playAudioTone("voice-ding");
                if (nextState) {
                  speakText(
                    lang === "hi" 
                      ? "आवाज सहायता चालू है" 
                      : "Voice guidance is now active",
                    lang === "hi" ? "hi-IN" : "en-US"
                  );
                }
              }}
              className={`p-2.5 rounded-xl border flex items-center space-x-1.5 transition-all duration-200 text-xs font-semibold ${
                voiceEnabled
                  ? "bg-amber-500/10 border-amber-400 text-amber-700 animate-bounce"
                  : "bg-slate-100 border-slate-200 text-slate-400"
              }`}
              title="Voice Instructions / आवाज निर्देश"
            >
              {voiceEnabled ? (
                <>
                  <Volume2 className="w-4 h-4 text-amber-600 shrink-0" />
                  <span className="hidden sm:inline">आवाज़ चालू</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-4 h-4 shrink-0" />
                  <span className="hidden sm:inline">आवाज़ बंद</span>
                </>
              )}
            </button>

            {/* Clear Language Switcher */}
            <button
              onClick={() => {
                const nextLang = lang === "hi" ? "en" : "hi";
                setLang(nextLang);
                playAudioTone("click");
                // Speak confirmation
                const word = nextLang === "hi" ? "हिंदी भाषा चुनी गई" : "Language set to English";
                speakText(word, nextLang === "hi" ? "hi-IN" : "en-US");
              }}
              className="px-3 py-2 rounded-xl bg-emerald-50 text-emerald-800 font-bold border border-emerald-100 text-xs transition hover:bg-emerald-100 flex items-center space-x-1"
            >
              <span>🌐</span>
              <span>{lang === "hi" ? "English" : "हिंदी"}</span>
            </button>
            
          </div>
        </div>

        {/* Global Sound Assistant Banner with Helpful prompts */}
        <div className="bg-emerald-800 text-white py-2 px-4 shadow-inner">
          <div className="max-w-3xl mx-auto flex items-center justify-between text-xs font-medium">
            <div className="flex items-center space-x-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
              </span>
              <span className="leading-tight truncate">
                {lang === "hi" 
                  ? "👉 निर्देश सुनने के लिए नीचे माइक/बटन छुएं" 
                  : "👉 Click buttons / speaker icon to hear instructions aloud"}
              </span>
            </div>
            <button
              onClick={() => {
                triggerVoiceGuidance(
                  "यह उत्तम मंच है। 'काम चाहिए' चुनकर आप १ मिनट से कम में अपना नाम रजिस्टर कर सकते हैं! ग्राहक डायरेक्ट कॉल कर सकते हैं।",
                  "This application links laborers with customers. Fill information under Register and people can call you instantly."
                );
              }}
              className="bg-yellow-500 text-slate-900 px-2 py-0.5 rounded-md font-bold text-[11px] flex items-center space-x-1 shrink-0 animate-pulse hover:bg-yellow-400"
            >
              <Volume2 className="w-3.5 h-3.5 shrink-0" />
              <span>{lang === "hi" ? "सुनें (Speak)" : "Listen"}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Supabase Live DB Connection Status Indicator (Top of the interface) */}
      <div className="bg-slate-50 border-b border-slate-200/60 py-2 px-4 shadow-[inset_0_-1px_0_0_rgba(0,0,0,0.05)]">
        <div className="max-w-3xl mx-auto flex items-center justify-between text-xs font-semibold">
          <div className="flex items-center space-x-2.5">
            <span className="text-[9px] uppercase font-black text-slate-400 tracking-wider">
              {lang === "hi" ? "डेटाबेस स्तर" : "Database"}
            </span>
            {sbStatus === "connected" ? (
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-300 px-2.5 py-0.5 rounded-full text-[11px] font-black flex items-center space-x-1.5 shadow-2xs">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>{lang === "hi" ? "डेटाबेस कनेक्टेड" : "Database Connected"}</span>
              </span>
            ) : sbStatus === "error" ? (
              <span className="bg-red-50 text-red-700 border border-red-200 px-2.5 py-0.5 rounded-full text-[11px] font-black flex items-center space-x-1.5 shadow-2xs">
                <span className="relative flex h-2 w-2 mb-0.5">
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
                <span className="truncate max-w-[170px] sm:max-w-none">
                  {lang === "hi" ? `करेक्शन विफल` : `Database Sync Warning`}
                </span>
              </span>
            ) : (
              <span className="bg-slate-100 text-slate-600 border border-slate-200 px-2.5 py-0.5 rounded-full text-[11px] font-black flex items-center space-x-1.5">
                <span className="relative flex h-2 w-2 mb-0.5">
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-slate-400"></span>
                </span>
                <span>{lang === "hi" ? "डिस्कनेक्टेड (लोकल स्टोरेज)" : "Disconnected (Local Storage)"}</span>
              </span>
            )}
          </div>
          
          <div className="text-[10px] text-slate-400 font-bold flex items-center space-x-1.5">
            <span>{lang === "hi" ? "क्लाउड लाइव सिंक" : "Cloud Sync"}</span>
            {sbSyncing ? (
              <span className="text-[#FF4D00] animate-spin font-bold">🔄</span>
            ) : (
              <span className="text-emerald-500 font-bold">●</span>
            )}
          </div>
        </div>
      </div>

      {/* Main Container */}
      <main className="flex-1 w-full max-w-3xl mx-auto px-4 py-4">

        {dbTablesMissing && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-3xl p-5 sm:p-6 mb-6 text-slate-800 shadow-xs space-y-4 text-left">
            <div className="flex items-start space-x-3">
              <span className="text-3xl">⚠️</span>
              <div className="space-y-1">
                <h3 className="font-extrabold text-sm sm:text-base text-amber-900 leading-tight">
                  {lang === "hi" ? "डेटाबेस टेबल्स तैयार नहीं हैं!" : "Missing Database Tables!"}
                </h3>
                <p className="text-xs text-amber-800 leading-relaxed font-bold">
                  {lang === "hi"
                    ? "सुपाबेस क्रेडेंशियल तो सही हैं, परन्तु आपके सुपाबेस डेटाबेस में 'workers', 'jobs' और 'assignments' टेबल्स मौजूद नहीं हैं।"
                    : "Connection established, but the necessary tables ('workers', 'jobs', and 'assignments') aren't found in your project."}
                </p>
              </div>
            </div>
            
            <div className="bg-amber-100/50 rounded-2xl p-4 border border-amber-200">
              <h4 className="text-xs font-black text-amber-900 uppercase tracking-wider mb-2">
                {lang === "hi" ? "निर्देश (Quick Setup Guide):" : "Instructions:"}
              </h4>
              <ol className="list-decimal list-inside text-xs text-amber-800 space-y-1.5 font-semibold">
                <li>
                  {lang === "hi"
                    ? "नीचे दिया गया SQL स्क्रिप्ट कोड कॉपी करें।"
                    : "Copy the database schema script by clicking 'Copy SQL' below."}
                </li>
                <li>
                  {lang === "hi"
                    ? "अपने Supabase Dashboard (https://supabase.com) में जाएं और बाएं मेनू से SQL Editor खोलें।"
                    : "Go to your Supabase Dashboard and open 'SQL Editor' from the left sidebar."}
                </li>
                <li>
                  {lang === "hi"
                    ? "'New query' पर क्लिक करें, इस कोड को वहां पेस्ट करें और 'Run' बटन दबाएं।"
                    : "Create a 'New query', paste the SQL code block, and click 'Run'."}
                </li>
                <li>
                  {lang === "hi"
                    ? "वापस आकर 'फिर से कनेक्ट करें' बटन दबाएं। काम की प्रक्रिया तुरंत सिंक होने लगेगी!"
                    : "Return here and click 'Retry Connection'. It will link up automatically!"}
                </li>
              </ol>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(SETUP_SQL_CODE);
                  playAudioTone("success");
                  showNotification(lang === "hi" ? "SQL स्क्रिप्ट कॉपी कर ली गई!" : "SQL schema script copied to clipboard!", "success");
                }}
                className="flex-1 py-3 bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs uppercase tracking-widest rounded-xl transition active:scale-98 shadow-sm flex items-center justify-center space-x-1.5"
              >
                <span>📋</span>
                <span>{lang === "hi" ? "SQL स्क्रिप्ट कॉपी करें" : "Copy SQL Script"}</span>
              </button>

              <button
                onClick={() => {
                  syncWithSupabase(sbUrl, sbKey, true);
                }}
                className="py-3 px-5 bg-white border-2 border-amber-300 hover:bg-amber-50 text-amber-900 font-extrabold text-xs uppercase tracking-widest rounded-xl transition active:scale-98"
              >
                <span>🔄</span>
                <span>{lang === "hi" ? "फिर से कनेक्ट करें" : "Retry Connection"}</span>
              </button>
            </div>
          </div>
        )}

        {/* Dynamic Dual Login Screen & Welcome Info */}
        {currentUser && (
          <div className="bg-white border-2 border-[#FFD8C2] rounded-3xl p-4 sm:p-5 mb-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center space-x-3.5 text-slate-800">
              <div className="w-12 h-12 bg-[#FFF0E6] text-[#FF4D00] rounded-2xl flex items-center justify-center font-black text-2xl shadow-xs">
                {currentUser.role === "laborer" ? "👷" : "🏢"}
              </div>
              <div className="text-left">
                <div className="text-[10px] uppercase font-extrabold tracking-wider text-[#FF4D00] bg-[#FFF0E6] px-2 py-0.5 rounded-md inline-block mb-1">
                  {currentUser.role === "laborer"
                    ? (lang === "hi" ? "कामगार मोड (Active Worker)" : "Laborer Workspace Active")
                    : (lang === "hi" ? "नियोक्ता / ठेकेदार (Active Boss)" : "Employer Workspace Active")}
                </div>
                <div className="text-sm font-black text-slate-800 leading-tight">
                  {lang === "hi" ? `नमस्ते, ${currentUser.name}!` : `Welcome back, ${currentUser.name}!`}
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                localStorage.removeItem("kaam_logged_user");
                setCurrentUser(null);
                setLoginName("");
                setLoginPhone("");
                setActiveTab("search_jobs");
                playAudioTone("click");
                showNotification(
                  lang === "hi" ? "सुरक्षित रूप से लॉग-आउट हो गए!" : "Logged out safely!",
                  "info"
                );
              }}
              className="w-full sm:w-auto px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs uppercase tracking-wider rounded-xl transition active:scale-95 cursor-pointer"
            >
              🔄 {lang === "hi" ? "लॉग-आउट / मोड बदलें" : "Disconnect Account / Logout"}
            </button>
          </div>
        )}

        {/* Dynamic Navigation Tabs when Logged In */}
        {currentUser ? (
          <div className={`grid ${
            currentUser.role === "laborer" ? "grid-cols-2" : "grid-cols-3"
          } gap-1.5 bg-slate-200/70 p-1.5 rounded-2xl mb-5`}>
            {currentUser.role === "admin" ? (
              <>
                <button
                  id="tab-btn-search-workers"
                  onClick={() => {
                    playAudioTone("click");
                    setActiveTab("search");
                  }}
                  className={`py-3 rounded-xl font-bold text-center text-xs sm:text-sm transition-all duration-200 flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-1.5 ${
                    activeTab === "search"
                      ? "bg-white text-blue-800 shadow-sm font-extrabold"
                      : "text-slate-600 hover:bg-white/50"
                  }`}
                >
                  <Search className="w-4 h-4 shrink-0 text-blue-600" />
                  <span className="leading-none">{lang === "hi" ? "कामगार सूची" : "Search Workers"}</span>
                </button>

                <button
                  id="tab-btn-find-jobs"
                  onClick={() => {
                    playAudioTone("click");
                    setActiveTab("search_jobs");
                  }}
                  className={`py-3 rounded-xl font-bold text-center text-xs sm:text-sm transition-all duration-200 flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-1.5 ${
                    activeTab === "search_jobs"
                      ? "bg-white text-blue-800 shadow-sm font-extrabold"
                      : "text-slate-600 hover:bg-white/50"
                  }`}
                >
                  <Briefcase className="w-4 h-4 shrink-0 text-blue-600" />
                  <span className="leading-none">{lang === "hi" ? "सभी विज्ञापन" : "All Jobs"}</span>
                </button>

                <button
                  id="tab-btn-emp-admin"
                  onClick={() => {
                    playAudioTone("click");
                    setActiveTab("admin");
                  }}
                  className={`py-3 rounded-xl font-bold text-[#1e40af] text-center text-xs sm:text-sm transition-all duration-200 flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-1.5 ${
                    activeTab === "admin"
                      ? "bg-blue-600 text-white shadow-sm font-black"
                      : "bg-blue-50/80 text-blue-700 hover:bg-blue-100"
                  }`}
                >
                  <Settings className="w-4 h-4 shrink-0 text-amber-400 animate-spin" />
                  <span className="leading-none">{lang === "hi" ? "👑 एडमिन पैनल" : "👑 Admin Panel"}</span>
                </button>
              </>
            ) : (currentUser.role === "laborer" || currentUser.role === "vendor") ? (
              <>
                <button
                  id="tab-btn-find-jobs"
                  onClick={() => {
                    playAudioTone("click");
                    if (currentUser?.role === "vendor") {
                      setActiveTab("search");
                      triggerVoiceGuidance(
                        "दुकान और सामग्री! यहाँ आप आगरा के अलग-अलग इलाकों में ईंट, सीमेंट, रेत, रोड़ी, सरिया और पुट्टी सप्लायरों को देख सकते हैं।",
                        "View suppliers! Find near materials layout for construction stores in Tajganj or Sanjay Place."
                      );
                    } else {
                      setActiveTab("search_jobs");
                      triggerVoiceGuidance(
                        "उपलब्ध काम! यहाँ आप ठेकेदारों और मकान मालिकों द्वारा डाले गए नया काम और दैनिक मजदूरी देख कर सीधा फ़ोन मिला सकते हैं।",
                        "Find Jobs. Browse active daily wage construction opportunities in Agra near Tajganj and Kamla Nagar."
                      );
                    }
                  }}
                  className={`py-3 rounded-xl font-bold text-center text-xs sm:text-sm transition-all duration-200 flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-1.5 ${
                    (currentUser?.role === "vendor" ? activeTab === "search" : activeTab === "search_jobs")
                      ? "bg-white text-emerald-800 shadow-sm"
                      : "text-slate-600 hover:bg-white/50"
                  }`}
                >
                  {currentUser?.role === "vendor" ? (
                    <Search className="w-4 h-4 shrink-0 text-emerald-600" />
                  ) : (
                    <Briefcase className="w-4 h-4 shrink-0 text-emerald-600" />
                  )}
                  <span className="leading-none">
                    {currentUser?.role === "vendor"
                      ? (lang === "hi" ? "दुकान/सामग्री" : "Search Listings")
                      : (lang === "hi" ? "काम ढूंढें" : "Find Jobs")}
                  </span>
                </button>

                <button
                  id="tab-btn-worker-reg"
                  onClick={() => {
                    playAudioTone("click");
                    setActiveTab("register");
                    setRegStep(1);
                  }}
                  className={`py-3 rounded-xl font-bold text-center text-xs sm:text-sm transition-all duration-200 flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-1.5 ${
                    activeTab === "register"
                      ? "bg-white text-emerald-800 shadow-sm"
                      : "text-slate-600 hover:bg-white/50"
                  }`}
                >
                  <UserPlus className="w-4 h-4 shrink-0 text-amber-600" />
                  <span className="leading-none">
                    {currentUser?.role === "vendor"
                      ? (lang === "hi" ? "दुकान दर्ज करें" : "Store Profile")
                      : (lang === "hi" ? "कार्ड बनाएं" : "Worker Profile")}
                  </span>
                </button>
              </>
            ) : (
              <>
                <button
                  id="tab-btn-search-workers"
                  onClick={() => {
                    playAudioTone("click");
                    setActiveTab("search");
                    triggerVoiceGuidance(
                      "कामगार खोजें। यहाँ आप राजमिस्त्री, पेंटर और प्लम्बरों को ढूंढकर सीधा बात कर सकते हैं।",
                      "Find workers. Browse skilled daily wage builders in Agra neighborhoods."
                    );
                  }}
                  className={`py-3 rounded-xl font-bold text-center text-xs sm:text-sm transition-all duration-200 flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-1.5 ${
                    activeTab === "search"
                      ? "bg-white text-emerald-800 shadow-sm"
                      : "text-slate-600 hover:bg-white/50"
                  }`}
                >
                  <Search className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span className="leading-none">{lang === "hi" ? "कामगार खोजें" : "Search Workers"}</span>
                </button>

                <button
                  id="tab-btn-post-job"
                  onClick={() => {
                    playAudioTone("click");
                    setActiveTab("post_job");
                    triggerVoiceGuidance(
                      "काम पोस्ट करें। अपना काम, जैसे प्लम्बिंग, पेंटिंग या भवन निर्माण का विवरण भरकर पोस्ट करें ताकि कामगार सीधे संपर्क कर सकें।",
                      "Post a Job. Upload tasks that local Agra builders can assist you on."
                    );
                  }}
                  className={`py-3 rounded-xl font-bold text-center text-xs sm:text-sm transition-all duration-200 flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-1.5 ${
                    activeTab === "post_job"
                      ? "bg-white text-emerald-800 shadow-sm"
                      : "text-slate-600 hover:bg-white/50"
                  }`}
                >
                  <Plus className="w-4 h-4 shrink-0 text-[#FF4D00]+" />
                  <span className="leading-none">{lang === "hi" ? "काम काम डालें" : "Post a Job"}</span>
                </button>

                <button
                  id="tab-btn-my-jobs"
                  onClick={() => {
                    playAudioTone("click");
                    setActiveTab("my_jobs");
                  }}
                  className={`py-3 rounded-xl font-bold text-center text-xs sm:text-sm transition-all duration-200 flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-1.5 ${
                    activeTab === "my_jobs"
                      ? "bg-white text-emerald-800 shadow-sm"
                      : "text-slate-600 hover:bg-white/50"
                  }`}
                >
                  <Clock className="w-4 h-4 shrink-0 text-amber-600" />
                  <span className="leading-none">{lang === "hi" ? "मेरे विज्ञापन" : "My job posts"}</span>
                </button>
              </>
            )}
          </div>
        ) : (
          /* Login Card when session is disconnected */
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-[#FFD8C2] shadow-sm space-y-6 text-slate-800 mb-10 text-center"
          >
            <div>
              <span className="text-5xl leading-none block mb-2">👋</span>
              <h2 className="text-xl sm:text-2xl font-black text-[#FF4D00] tracking-tight">
                {lang === "hi" ? "आगरा कामगार सेवा में प्रवेश" : "Enter Agra KAAM Services"}
              </h2>
              <p className="text-slate-500 font-bold text-xs sm:text-sm">
                {lang === "hi"
                  ? "कृपया आगे बढ़ने और डायरेक्ट बातचीत शुरू करने के लिए प्रवेश प्रकार चुनें।"
                  : "Please choose your entry role to seek daily labor or post construction activities."}
              </p>
            </div>

             {/* Selector Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <button
                type="button"
                id="role-select-laborer"
                onClick={() => {
                  setLoginRole("laborer");
                  playAudioTone("click");
                  triggerVoiceGuidance(
                    "कामगार मोड चुना गया। अपना नाम और फ़ोन नंबर दर्ज़ कर प्रवेश करें।",
                    "Laborer mode selected. Input your name and phone to view jobs and register."
                  );
                }}
                className={`p-3 rounded-2xl text-left border-3 transition-all cursor-pointer ${
                  loginRole === "laborer"
                    ? "border-[#FF4D00] bg-[#FFF5F0]"
                    : "border-slate-100 hover:border-slate-200 bg-slate-50"
                }`}
              >
                <div className="flex items-center space-x-2 mb-1.5">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                    loginRole === "laborer" ? "bg-[#FF4D00] text-white" : "bg-slate-200 text-slate-600"
                  }`}>
                    👷
                  </div>
                  <div className="font-black text-xs">
                    {lang === "hi" ? "कामगार लॉग-इन" : "Laborer"}
                  </div>
                </div>
                <p className="text-[9px] text-slate-500 leading-snug font-semibold">
                  {lang === "hi"
                    ? "मेरे पास हुनर है, मुझे दैनिक काम चाहिए।"
                    : "I have skills and seek job offers."}
                </p>
              </button>

              <button
                type="button"
                id="role-select-employer"
                onClick={() => {
                  setLoginRole("employer");
                  playAudioTone("click");
                  triggerVoiceGuidance(
                    "नियोक्ता मोड चुना गया। यहाँ आप नया काम पोस्ट कर सकते हैं और मजदूर खोज सकते हैं।",
                    "Employer mode selected. Under this, you can upload job vacancies and view workers."
                  );
                }}
                className={`p-3 rounded-2xl text-left border-3 transition-all cursor-pointer ${
                  loginRole === "employer"
                    ? "border-[#FF4D00] bg-[#FFF5F0]"
                    : "border-slate-100 hover:border-slate-200 bg-slate-50"
                }`}
              >
                <div className="flex items-center space-x-2 mb-1.5">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                    loginRole === "employer" ? "bg-[#FF4D00] text-white" : "bg-slate-200 text-slate-600"
                  }`}>
                    🏢
                  </div>
                  <div className="font-black text-xs">
                    {lang === "hi" ? "नियोक्ता / मालिक" : "Employer"}
                  </div>
                </div>
                <p className="text-[9px] text-slate-500 leading-snug font-semibold">
                  {lang === "hi"
                    ? "मुझे मकान बनवाने के लिए मजदूर चाहिए।"
                    : "I need work done, plastering, etc."}
                </p>
              </button>

              <button
                type="button"
                id="role-select-vendor"
                onClick={() => {
                  setLoginRole("vendor");
                  playAudioTone("click");
                  triggerVoiceGuidance(
                    "वेंडर मोड चुना गया। यहाँ आप अपनी दुकान दर्ज करके सामान बेच सकते हैं।",
                    "Vendor mode selected. Register your construction materials shop here."
                  );
                }}
                className={`p-3 rounded-2xl text-left border-3 transition-all cursor-pointer ${
                  loginRole === "vendor"
                    ? "border-[#FF4D00] bg-[#FFF5F0]"
                    : "border-slate-100 hover:border-slate-200 bg-slate-50"
                }`}
              >
                <div className="flex items-center space-x-2 mb-1.5">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                    loginRole === "vendor" ? "bg-[#FF4D00] text-white" : "bg-slate-200 text-slate-600"
                  }`}>
                    🏪
                  </div>
                  <div className="font-black text-xs">
                    {lang === "hi" ? "दुकान सप्लायर / वेंडर" : "Vendor Store"}
                  </div>
                </div>
                <p className="text-[9px] text-slate-500 leading-snug font-semibold">
                  {lang === "hi"
                    ? "मेरी दुकान है (सीमेंट, ईंट, लोहा, लकड़ी, मिट्टी/चूना)।"
                    : "I sell cement, bricks, clay, lime, iron, steel."}
                </p>
              </button>

              <button
                type="button"
                id="role-select-qr"
                onClick={() => {
                  setLoginRole("qr_scan");
                  playAudioTone("click");
                  triggerVoiceGuidance(
                    "क्यूआर स्कैन और अन्य प्रवेश मोड चुना गया। यहाँ आप किसी मजदूर का कार्ड स्कैन कर सकते हैं, या उनका नाम दर्ज कर सकते हैं।",
                    "QR Scan and Third-Party mode selected. Scan worker QR code or enter worker name directly."
                  );
                }}
                className={`p-3 rounded-2xl text-left border-3 transition-all cursor-pointer ${
                  loginRole === "qr_scan"
                    ? "border-[#FF4D00] bg-[#FFF5F0]"
                    : "border-slate-100 hover:border-slate-200 bg-slate-50"
                }`}
              >
                <div className="flex items-center space-x-2 mb-1.5">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                    loginRole === "qr_scan" ? "bg-[#FF4D00] text-white" : "bg-slate-200 text-slate-600"
                  }`}>
                    📷
                  </div>
                  <div className="font-black text-xs">
                    {lang === "hi" ? "क्यूआर / अन्य" : "QR & Behalf"}
                  </div>
                </div>
                <p className="text-[9px] text-slate-500 leading-snug font-semibold">
                  {lang === "hi"
                    ? "मजदूर का क्यूआर स्कैन करें या उनका कार्ड बनाएं।"
                    : "Scan printed QR badges or insert worker data."}
                </p>
              </button>
            </div>

            <div className="flex justify-end px-1 mt-3 mb-1">
              <button
                type="button"
                id="toggle-admin-login"
                onClick={() => {
                  playAudioTone("click");
                  if (loginRole === "admin") {
                    setLoginRole("laborer");
                  } else {
                    setLoginRole("admin");
                  }
                  setLoginName("");
                  setLoginPhone("");
                  setAdminPassword("");
                }}
                className="text-[10px] font-extrabold tracking-wider text-slate-400 hover:text-indigo-600 transition uppercase flex items-center space-x-1 cursor-pointer"
              >
                {loginRole === "admin" ? (
                  <>
                    <span>👤</span>
                    <span>{lang === "hi" ? "उपयोगकर्ता लॉगिन पर वापस" : "Back to User Portal"}</span>
                  </>
                ) : (
                  <>
                    <span>🔒</span>
                    <span>{lang === "hi" ? "व्यवस्थापक एडमिन प्रवेश" : "Master Admin Entry"}</span>
                  </>
                )}
              </button>
            </div>

            {/* Passcode-free standard inputs form */}
            <form
              id="role-login-form"
              onSubmit={(e) => {
                e.preventDefault();
                if (!loginName.trim()) {
                  showNotification(lang === "hi" ? "कृपया विवरण लिखें!" : "Please write down your details!", "error");
                  return;
                }

                if (loginRole === "admin") {
                  if (!loginName.includes("@")) {
                    showNotification(
                      lang === "hi" ? "कृपया एक मान्य ईमेल आईडी दर्ज करें!" : "Please enter a valid email address!",
                      "error"
                    );
                    return;
                  }
                  if (adminPassword !== "admin123") {
                    showNotification(
                      lang === "hi" ? "गलत पासवर्ड! कृपया सही एडमिन पासवर्ड दर्ज करें।" : "Wrong Password! Please enter correct admin credentials.",
                      "error"
                    );
                    return;
                  }

                  const adminUser = { name: loginName, phone: "0000000000", role: "admin" as const };
                  localStorage.setItem("kaam_logged_user", JSON.stringify(adminUser));
                  setCurrentUser(adminUser);
                  setActiveTab("admin");
                  playAudioTone("success");
                  showNotification(
                    lang === "hi" ? `व्यवस्थापक लॉग-इन सफल: ${loginName}` : `Admin logged in successfully: ${loginName}`,
                    "success"
                  );
                  return;
                }

                const cleanPhone = loginPhone.replace(/\D/g, "");
                if (cleanPhone.length !== 10) {
                  showNotification(lang === "hi" ? "कृपया सही १०-अंकों का मोबाइल नंबर लिखें!" : "Please enter a valid 10-digit mobile number!", "error");
                  return;
                }

                // Check profile suspension status
                const matchedProfile = profiles.find(p => p.phone === cleanPhone);
                if (matchedProfile && matchedProfile.status === "suspended") {
                  playAudioTone("error");
                  showNotification(
                    lang === "hi"
                      ? "सुरक्षा चेतावनी: आपका खाता प्रशासनिक कारणों से निलंबित कर दिया गया है।"
                      : "Security Block: Your account has been suspended by system administrators.",
                    "error"
                  );
                  // Log failed attempt
                  const newAudit = {
                    id: "audit-" + Date.now(),
                    action: `Blocked login attempt of suspended user ${loginName} (${cleanPhone})`,
                    timestamp: new Date().toISOString(),
                    admin: "System Security",
                    category: "system"
                  };
                  setAuditLogs(prev => [newAudit, ...prev].slice(0, 100));
                  return;
                }

                const user = { name: loginName, phone: cleanPhone, role: loginRole };
                localStorage.setItem("kaam_logged_user", JSON.stringify(user));
                setCurrentUser(user);
                
                // Automatically register user details and trigger login record inside Supabase in background
                autoRecordProfileAndLoginOnSupabase(loginName, cleanPhone, loginRole);

                if (loginRole === "laborer") {
                  setRegName(loginName);
                  setRegMobile(cleanPhone);
                  setActiveTab("search_jobs");
                } else if (loginRole === "vendor") {
                  setRegName(loginName);
                  setRegMobile(cleanPhone);
                  setActiveTab("register");
                  setRegStep(1);
                  setRegSelectedSkills(["vendor_cement"]);
                } else {
                  setActiveTab("search");
                }

                playAudioTone("success");
                showNotification(
                  lang === "hi" 
                    ? `सफलतापूर्वक लॉग-इन किया: ${loginName}!` 
                    : `Welcome aboard, ${loginName}!`,
                  "success"
                );
              }}
              className="space-y-4 max-w-sm mx-auto text-left pt-2"
            >
              {loginRole === "admin" ? (
                <>
                  <div>
                    <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-1.5">
                      {lang === "hi" ? "एडमिन ईमेल आईडी (Admin Email ID)" : "Admin Email Address"}
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">📧</span>
                      <input
                        type="email"
                        required
                        value={loginName}
                        onChange={(e) => setLoginName(e.target.value)}
                        placeholder="e.g., nespuneet2501@gmail.com"
                        className="h-11 w-full bg-slate-50 border-2 border-slate-200 focus:border-blue-600 focus:bg-white rounded-xl py-2 pl-10 pr-3 text-xs sm:text-sm font-extrabold text-slate-700 outline-none transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-1.5">
                      {lang === "hi" ? "पासवर्ड (Password)" : "Credentials Password"}
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔒</span>
                      <input
                        type="password"
                        required
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        placeholder="••••••••"
                        className="h-11 w-full bg-slate-50 border-2 border-slate-200 focus:border-blue-600 focus:bg-white rounded-xl py-2 pl-10 pr-3 text-xs sm:text-sm font-extrabold text-slate-700 outline-none transition"
                      />
                    </div>
                  </div>
                </>
              ) : loginRole === "qr_scan" ? (
                <div className="space-y-4 text-left border-2 border-slate-200 p-4 rounded-2xl bg-slate-50/50">
                  <div className="flex border-b border-slate-250 pb-2 mb-2">
                    <button
                      type="button"
                      onClick={() => {
                        setQrScanSuccess(false);
                        setScannedWorkerObj(null);
                        setScannedWorkerId("");
                        setIsScanningActive(false);
                        setBehalfName(""); // Turn off behalf mode
                        playAudioTone("click");
                      }}
                      className={`flex-1 text-center py-2 text-xs font-black uppercase tracking-wider transition ${
                        behalfName === "" ? "text-[#FF4D00] border-b-2 border-[#FF4D00]" : "text-slate-400 hover:text-slate-600"
                      }`}
                    >
                      📷 {lang === "hi" ? "क्यूआर पासपोर्ट" : "QR Badge Scan"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setQrScanSuccess(false);
                        setScannedWorkerObj(null);
                        setScannedWorkerId("");
                        setIsScanningActive(false);
                        // Initialize Behalf Form with demo placeholder
                        setBehalfName("Ramesh Pal");
                        setBehalfPhone("9876001122");
                        setBehalfArea("Tajganj");
                        setBehalfCity("Agra");
                        setBehalfSelectedSkills(["mason"]);
                        playAudioTone("click");
                      }}
                      className={`flex-1 text-center py-2 text-xs font-black uppercase tracking-wider transition ${
                        behalfName !== "" ? "text-[#FF4D00] border-b-2 border-[#FF4D00]" : "text-slate-400 hover:text-slate-600"
                      }`}
                    >
                      👥 {lang === "hi" ? "हुनर और नाम दर्ज" : "Register by Name"}
                    </button>
                  </div>

                  {behalfName !== "" ? (
                    /* BEHALF REGISTRATION FORM */
                    <div className="space-y-3.5">
                      <div className="bg-amber-50 p-2.5 rounded-xl border border-amber-200 text-[11px] text-amber-900 font-bold leading-tight">
                        📢 {lang === "hi" 
                          ? "तीसरे पक्ष द्वारा प्रविष्टि (Third Party Entry): किसी कामगार को लेबर जंक्शन पर खड़े होने से बचाने के लिए उनके विवरण को सीधे सक्रिय करें!"
                          : "Third party daily wage worker entry: Prevent physical junction standing by creating an active dispatch profile now!"}
                      </div>

                      <div>
                        <label className="block text-[10px] font-extrabold text-slate-500 uppercase mb-1">
                          {lang === "hi" ? "१. कामगार का पूरा नाम" : "1. Laborer Full Name"}
                        </label>
                        <input
                          type="text"
                          required
                          value={behalfName}
                          onChange={(e) => {
                            setBehalfName(e.target.value);
                            setLoginName(e.target.value);
                          }}
                          placeholder="e.g., Ramesh Pal"
                          className="w-full bg-white border border-slate-200 rounded-xl py-2.5 px-3 text-xs font-bold focus:ring-2 focus:ring-[#FF4D00] outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-extrabold text-slate-500 uppercase mb-1">
                          {lang === "hi" ? "२. सक्रिय मोबाइल नंबर" : "2. Active Mobile Phone"}
                        </label>
                        <input
                          type="tel"
                          required
                          maxLength={10}
                          value={behalfPhone}
                          onChange={(e) => {
                            setBehalfPhone(e.target.value);
                            setLoginPhone(e.target.value);
                          }}
                          placeholder="9876543210"
                          className="w-full bg-white border border-slate-200 rounded-xl py-2.5 px-3 text-xs font-mono font-bold focus:ring-2 focus:ring-[#FF4D00] outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-extrabold text-slate-500 uppercase mb-1">
                          {lang === "hi" ? "३. आगरा में कार्य स्थान (Area)" : "3. Working Area in Agra"}
                        </label>
                        <select
                          value={behalfArea}
                          onChange={(e) => setBehalfArea(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-xl py-2.5 px-3 text-xs font-bold focus:ring-2 focus:ring-[#FF4D00] outline-none"
                        >
                          {INDIAN_CITIES.find(c => c.name_en === "Agra")?.areas.map(a => (
                            <option key={a.name_en} value={a.name_en}>{lang === 'hi' ? a.name_hi : a.name_en}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-extrabold text-slate-500 uppercase mb-1.5">
                          {lang === "hi" ? "४. श्रेणी / हुनर चुनें (Skill Categories)" : "4. Select Skill Categories"}
                        </label>
                        <div className="flex flex-wrap gap-1.5">
                          {CATEGORIES.slice(0, 10).map(c => {
                            const isSel = behalfSelectedSkills.includes(c.id);
                            return (
                              <button
                                type="button"
                                key={c.id}
                                onClick={() => {
                                  playAudioTone("click");
                                  if (isSel) {
                                    setBehalfSelectedSkills(prev => prev.filter(x => x !== c.id));
                                  } else {
                                    setBehalfSelectedSkills(prev => [...prev, c.id]);
                                  }
                                }}
                                className={`px-2.5 py-1.5 rounded-lg text-[10px] font-extrabold transition ${
                                  isSel ? "bg-[#FF4D00] text-white" : "bg-white text-slate-600 border border-slate-200"
                                }`}
                              >
                                {lang === 'hi' ? c.name_hi : c.name_en}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="pt-2">
                        <button
                          type="button"
                          onClick={() => {
                            if (!behalfName.trim() || behalfPhone.length < 10) {
                              alert(lang === 'hi' ? "कृपया सही नाम और १० डिजिट का फोन नंबर दर्ज करें!" : "Please provide a valid name and 10-digit mobile phone!");
                              return;
                            }
                            let finalSkills = behalfSelectedSkills;
                            if (finalSkills.length === 0) {
                              finalSkills = ["other"];
                            }

                            // Build local worker
                            const newWorkerObj: Worker = {
                              id: `worker-${Date.now()}`,
                              name: behalfName,
                              phone: behalfPhone,
                              skills: finalSkills,
                              city: "Agra",
                              area: behalfArea,
                              address: behalfAddress || `${behalfArea}, Agra`,
                              location: { lat: 27.18, lng: 78.02 },
                              photo: "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&h=150&fit=crop&crop=face",
                              registeredAt: new Date().toISOString(),
                              isApproved: true,
                              rating: 5.0,
                              completedJobs: 0,
                              isVerified: true
                            };

                            setWorkers(prev => [newWorkerObj, ...prev]);

                            // Supabase Sync
                            if (sbUrl && sbKey) {
                              insertSupabaseWorker(sbUrl, sbKey, newWorkerObj).catch(err => console.error(err));
                            }

                            playAudioTone("success");
                            alert(lang === 'hi' ? `${behalfName} को सफलता से 'काम' सूची में दर्ज़ कर दिया गया है!` : `${behalfName} has been successfully active-listed!`);
                            
                            // Log worker in automatically
                            const userPayload = { name: behalfName, phone: behalfPhone, role: "laborer" as const };
                            localStorage.setItem("kaam_logged_user", JSON.stringify(userPayload));
                            setCurrentUser(userPayload);
                            
                            // Reset state & load search
                            setBehalfName("");
                            setBehalfPhone("");
                            setActiveTab("search");
                          }}
                          className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-black text-xs uppercase tracking-widest rounded-xl transition"
                        >
                          ✔️ {lang === "hi" ? "सक्रिय 'काम' लिस्टिंग में जोड़ें" : "Publish Daily Wage Listing"}
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* QR BADGE CODE SIMULATION AND DEVICE WEBCAM MOCK */
                    <div className="space-y-4 text-center">
                      {isScanningActive ? (
                        <div className="relative w-full h-48 rounded-2xl bg-black border-4 border-[#2D2D2D] overflow-hidden flex flex-col items-center justify-center p-3">
                          {/* Animated Red Laser bar */}
                          <motion.div
                            animate={{ y: [0, 180, 0] }}
                            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                            className="absolute left-0 right-0 h-1 bg-red-600 shadow-[0_0_10px_2px_rgba(239,68,68,0.8)] z-10"
                            style={{ top: 0 }}
                          />

                          {/* Outer Camera Reticle Rings */}
                          <div className="absolute inset-4 border-2 border-dashed border-emerald-500/40 rounded-xl pointer-events-none" />
                          <div className="absolute w-8 h-8 border-t-4 border-l-4 border-emerald-400 top-2 left-2" />
                          <div className="absolute w-8 h-8 border-t-4 border-r-4 border-emerald-400 top-2 right-2" />
                          <div className="absolute w-8 h-8 border-b-4 border-l-4 border-emerald-400 bottom-2 left-2" />
                          <div className="absolute w-8 h-8 border-b-4 border-r-4 border-emerald-400 bottom-2 right-2" />

                          <div className="text-emerald-400 text-[10px] font-mono tracking-widest z-20 font-bold mb-1.5 uppercase animate-pulse">
                            📸 {lang === "hi" ? "स्कैनर सक्रिय - लाइव रिटिकल" : "LIVE SCAN RETICLE ACTIVE"}
                          </div>

                          <p className="text-[10px] text-slate-300 z-20 font-semibold px-4 leading-tight mb-2">
                            {lang === "hi" 
                              ? "मजदूर का प्रिंटेड क्यूआर कार्ड कैमरे के सामने लाएं या नीचे दिए टेस्ट बटन से कार्ड स्कैन करें।"
                              : "Aim camera at any printed card. Press a test badge to simulate scanning."}
                          </p>

                          {/* Quick selection presets inside scan box to make test seamless */}
                          <div className="grid grid-cols-2 gap-2 w-full max-w-xs z-20 pt-1">
                            {workers.slice(0, 2).map((w, index) => (
                              <button
                                type="button"
                                key={w.id}
                                onClick={() => {
                                  playAudioTone("success");
                                  setQrScanSuccess(true);
                                  setScannedWorkerObj(w);
                                  setScannedWorkerId(w.id);
                                  setIsScanningActive(false);
                                }}
                                className="bg-white/90 hover:bg-white text-slate-850 p-1.5 rounded-lg border border-emerald-400 text-[10px] font-black truncate text-center transition"
                              >
                                🎯 Test QR {index + 1}: {w.name.split(" ")[0]}
                              </button>
                            ))}
                          </div>
                        </div>
                      ) : qrScanSuccess && scannedWorkerObj ? (
                        <div className="bg-emerald-50/80 rounded-2xl border-2 border-emerald-300 p-4 text-left space-y-3">
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl">✔️</span>
                            <div>
                              <span className="text-[10px] uppercase font-extrabold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded-md">
                                {lang === "hi" ? "स्कैन सफल!" : "QR CARD SCANNED!"}
                              </span>
                              <h5 className="font-extrabold text-sm text-slate-800 mt-1">{scannedWorkerObj.name}</h5>
                            </div>
                          </div>

                          <div className="bg-white p-2.5 rounded-xl border border-emerald-200 text-xs text-slate-600 space-y-1 font-semibold">
                            <p>📞 {lang === "hi" ? "फ़ोन नंबर" : "Phone"}: <span className="font-mono text-slate-700 text-xs font-bold">{scannedWorkerObj.phone}</span></p>
                            <p>📍 {lang === "hi" ? "इलाका" : "Area"}: <span className="text-slate-700 text-xs font-bold">{scannedWorkerObj.area}</span></p>
                            <p>🛠️ {lang === "hi" ? "श्रेणी" : "Skill"}: <span className="text-emerald-700 uppercase font-black">{scannedWorkerObj.skills[0]}</span></p>
                          </div>

                          <div className="flex gap-2 pt-1">
                            <button
                              type="button"
                              onClick={() => {
                                playAudioTone("success");
                                const userPayload = { name: scannedWorkerObj.name, phone: scannedWorkerObj.phone, role: "laborer" as const };
                                localStorage.setItem("kaam_logged_user", JSON.stringify(userPayload));
                                setCurrentUser(userPayload);
                                showNotification(
                                  lang === "hi" ? `${scannedWorkerObj.name} के रूप में सफलतापूर्वक प्रवेश किया!` : `Signed in as ${scannedWorkerObj.name}!`,
                                  "success"
                                );
                                setQrScanSuccess(false);
                                setScannedWorkerObj(null);
                                setActiveTab("search");
                              }}
                              className="flex-1 bg-[#FF4D00] hover:bg-[#D63F00] text-white text-[10px] font-black uppercase py-2.5 rounded-xl text-center shadow-xs transition"
                            >
                              🔑 LOG IN DIRECTLY
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                playAudioTone("success");
                                // Log active daily attendance dispatch
                                const newAssignment: Assignment = {
                                  id: `assign-${Date.now()}`,
                                  jobId: "daily-chowk-active",
                                  workerId: scannedWorkerObj.id,
                                  assignedAt: new Date().toLocaleDateString(lang === "hi" ? "hi-IN" : "en-US", {
                                    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                  }),
                                  status: 'assigned',
                                  employerName: lang === 'hi' ? "आगरा लेबर जंक्शन" : "Chowk Dispatcher",
                                  employerPhone: "1000000000",
                                  workerName: scannedWorkerObj.name,
                                  workerPhone: scannedWorkerObj.phone,
                                  jobTitle: lang === 'hi' ? "चौक पर दैनिक सक्रियता दर्ज़" : "Logged Active Chowk Availability Today",
                                  jobTitle_hi: "चौक पर दैनिक सक्रियता दर्ज़",
                                  workerSkills: scannedWorkerObj.skills
                                };
                                setAssignments(prev => [newAssignment, ...prev]);
                                alert(lang === 'hi' ? `${scannedWorkerObj.name} की उपलब्धता आगरा चौक पर एक्टिव हो गई है!` : `Log registered! ${scannedWorkerObj.name} is active in Agra area list!`);
                                setQrScanSuccess(false);
                                setScannedWorkerObj(null);
                              }}
                              className="flex-1 bg-green-600 hover:bg-green-700 text-white text-[10px] font-black uppercase py-2.5 rounded-xl text-center shadow-xs transition"
                            >
                              📌 MARK ACTIVE TODAY
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              setQrScanSuccess(false);
                              setScannedWorkerObj(null);
                            }}
                            className="w-full text-center text-[10px] text-slate-400 font-extrabold hover:underline uppercase block"
                          >
                            🔄 Scan Another Code
                          </button>
                        </div>
                      ) : (
                        <div className="bg-slate-50 p-6 rounded-2xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center space-y-3">
                          <span className="text-4xl animate-bounce">📷</span>
                          <h6 className="font-extrabold text-xs text-slate-700">{lang === "hi" ? "डिजिटल क्यूआर चेक-इन" : "QR Card Scanner"}</h6>
                          <p className="text-[10px] text-slate-500 leading-normal max-w-xs font-semibold">
                            {lang === "hi"
                              ? "इस सेवा द्वारा आप कामगार के प्रिंटेड कार्ड को लाइव स्कैन कर तुरंत चेक-इन या लॉगिन कर सकते हैं।"
                              : "Scan QR Badges pre-printed on stickers & pamphlets to directly log worker check-in records or sign-in."}
                          </p>
                          <button
                            type="button"
                            onClick={() => {
                              playAudioTone("click");
                              setIsScanningActive(true);
                            }}
                            className="px-5 py-2.5 bg-[#FF4D00] text-white font-extrabold text-xs uppercase rounded-xl transition shadow-xs"
                          >
                            📷 Turn On Camera Scanner
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-1.5">
                      {loginRole === "laborer"
                        ? (lang === "hi" ? "कामगार का नाम (Your Name)" : "Your Full Name")
                        : (lang === "hi" ? "नियोक्ता का नाम (Employer Name)" : "Boss / Company Name")}
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">👤</span>
                      <input
                        type="text"
                        required
                        maxLength={40}
                        value={loginName}
                        onChange={(e) => setLoginName(e.target.value)}
                        placeholder={loginRole === "laborer" ? (lang === "hi" ? "उदा. राजेश कुमार" : "e.g., Rajesh Kumar") : (lang === "hi" ? "उदा. आगरा बिल्डर्स" : "e.g., Agra Builders")}
                        className="h-11 w-full bg-slate-50 border-2 border-slate-200 focus:border-[#FF4D00] focus:bg-white rounded-xl py-2 pl-10 pr-3 text-xs sm:text-sm font-extrabold text-slate-700 outline-none transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-1.5">
                      {lang === "hi" ? "१०-अंकों का मोबाइल नंबर (Mobile Phone)" : "10-Digit Mobile Number"}
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">📞</span>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        value={loginPhone}
                        onChange={(e) => setLoginPhone(e.target.value)}
                        placeholder="9876543210"
                        className="h-11 w-full bg-slate-50 border-2 border-[#D2E0E6]/100 focus:border-[#FF4D00] focus:bg-white rounded-xl py-2 pl-10 pr-3 text-xs sm:text-sm font-mono font-extrabold tracking-wider text-slate-700 outline-none transition"
                      />
                    </div>
                  </div>
                </>
              )}

              {loginRole !== "qr_scan" && (
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3.5 bg-[#FF4D00] hover:bg-[#D63F00] text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-md transition active:scale-95 cursor-pointer"
                  >
                    🚪 {lang === "hi" ? "लॉग-इन करें और प्रवेश करें" : "Login & Enter App"}
                  </button>
                </div>
              )}
            </form>

            {/* One-Tap Playground Bypass Options */}
            <div className="pt-4 border-t border-slate-100 space-y-2">
              <div className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider">
                {lang === "hi" ? "फास्ट टेस्ट: १-क्लिक डेमो प्रवेश (Trial Access)" : "1-Click Playground Bypass"}
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 max-w-md mx-auto">
                <button
                  type="button"
                  onClick={() => {
                    const demoWorker = { name: "Rajesh Kumar Mistri", phone: "9876543210", role: "laborer" as const };
                    localStorage.setItem("kaam_logged_user", JSON.stringify(demoWorker));
                    setCurrentUser(demoWorker);
                    setRegName(demoWorker.name);
                    setRegMobile(demoWorker.phone);
                    setActiveTab("search_jobs");
                    playAudioTone("success");
                    showNotification(lang === "hi" ? "डेमो कामगार 'राजेश' के रूप में प्रवेश हुआ!" : "Entered as Worker Rajesh!", "success");
                  }}
                  className="w-full py-2 px-3 bg-[#E6F4EA] hover:bg-[#D2EBD9] text-[#137333] font-bold text-[11px] rounded-xl transition cursor-pointer"
                >
                  👷 {lang === "hi" ? "डेमो कामगार (राजेश कुमार)" : "Demo Worker (Rajesh Kumar)"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const demoEmployer = { name: "Agra Builders Corp", phone: "9812345670", role: "employer" as const };
                    localStorage.setItem("kaam_logged_user", JSON.stringify(demoEmployer));
                    setCurrentUser(demoEmployer);
                    setActiveTab("search");
                    playAudioTone("success");
                    showNotification(lang === "hi" ? "डेमो नियोक्ता 'आगरा बिल्डर्स' के रूप में प्रवेश हुआ!" : "Entered as Employer Agra Builders!", "success");
                  }}
                  className="w-full py-2 px-3 bg-[#FFF0E6] hover:bg-[#FFD8C2] text-[#FF4D00] font-bold text-[11px] rounded-xl transition cursor-pointer"
                >
                  🏢 {lang === "hi" ? "डेमो ठेकेदार (आगरा बिल्डर्स)" : "Demo Boss (Agra Builders)"}
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Dynamic Display Area based on tabs */}
        <AnimatePresence mode="wait">
          
          {/* TAB: SEARCH JOBS (For Laborers to find vacancies) */}
          {currentUser && currentUser.role === "laborer" && activeTab === "search_jobs" && (
            <motion.div
              key="search-jobs-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="space-y-5 text-left"
            >
              {/* Informational Hero Banner */}
              <div className="bg-emerald-900 text-white rounded-3xl p-5 shadow-xs relative overflow-hidden">
                <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-4 translate-y-4">
                  <Briefcase className="w-44 h-44" />
                </div>
                <h3 className="text-lg font-black mb-1 flex items-center space-x-2">
                  <span>💼</span>
                  <span>{lang === "hi" ? "आगरा में उपलब्ध काम" : "Direct Work Openings in Agra"}</span>
                </h3>
                <p className="text-emerald-100 text-xs font-semibold leading-relaxed">
                  {lang === "hi"
                    ? "नीचे मकान मालिकों और ठेकेदारों द्वारा डाले गए काम देखें। सीधा संपर्क और बातचीत करने के लिए हरे रंग का 'फ़ोन मिलाएँ' बटन दबाएं।"
                    : "Browse open jobs uploaded by supervisors in Agra. Press the call button to telephone them instantly."}
                </p>

                {/* Local Area & Skill quick selection row */}
                <div className="mt-4 pt-4 border-t border-emerald-800 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[9px] font-extrabold text-emerald-300 uppercase tracking-widest mb-1">
                      {lang === "hi" ? "पास का इलाका चुनें" : "Agra Neighborhood Area"}
                    </label>
                    <select
                      value={selectedAreaFilter}
                      onChange={(e) => {
                        setSelectedAreaFilter(e.target.value);
                        playAudioTone("click");
                        const choice = lang === 'hi' ? `${e.target.value} इलाका चुना गया` : `Area ${e.target.value} chosen`;
                        speakText(choice, lang === 'hi' ? 'hi-IN' : 'en-US');
                      }}
                      className="w-full bg-emerald-950 border border-emerald-800 rounded-xl py-2 px-2.5 text-xs font-bold text-white focus:outline-none focus:ring-1 focus:ring-yellow-400"
                    >
                      <option value="">{lang === "hi" ? "पूरे आगरा में (All Agra)" : "All Neighborhoods"}</option>
                      {INDIAN_CITIES[0].areas.map((a) => (
                        <option key={a.name_en} value={a.name_en}>
                          {lang === "hi" ? a.name_hi : a.name_en}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[9px] font-extrabold text-emerald-300 uppercase tracking-widest mb-1">
                      {lang === "hi" ? "काम का प्रकार फ़िल्टर" : "Required Skill Type"}
                    </label>
                    <select
                      value={selectedSkillFilter}
                      onChange={(e) => {
                        setSelectedSkillFilter(e.target.value);
                        playAudioTone("click");
                        const cat = CATEGORIES.find(c => c.id === e.target.value);
                        if (cat) {
                          const choice = lang === 'hi' ? `${cat.name_hi} काम चुना गया` : `${cat.name_en} selected`;
                          speakText(choice, lang === 'hi' ? 'hi-IN' : 'en-US');
                        }
                      }}
                      className="w-full bg-emerald-950 border border-emerald-800 rounded-xl py-2 px-2.5 text-xs font-bold text-white focus:outline-none focus:ring-1 focus:ring-yellow-400"
                    >
                      <option value="">{lang === "hi" ? "सभी हुनर प्रकार (All Skills)" : "All Work Categories"}</option>
                      {CATEGORIES.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {lang === "hi" ? cat.name_hi : cat.name_en}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Dynamic Job Cards Feed */}
              <div className="space-y-4">
                {(() => {
                  const items = jobs.filter((job) => {
                    if (selectedAreaFilter && job.area !== selectedAreaFilter) return false;
                    if (selectedSkillFilter && job.skillNeeded !== selectedSkillFilter) return false;
                    return true;
                  });

                  if (items.length === 0) {
                    return (
                      <div className="bg-white rounded-3xl p-10 text-center border-2 border-slate-100 text-slate-500">
                        <span className="text-4xl block mb-2">🔍</span>
                        <p className="font-extrabold text-sm text-slate-750">
                          {lang === "hi" ? "कोई काम विज्ञापन नहीं मिला! इलाका या हुनर फ़िल्टर बदलें।" : "No matches found! Clear neighborhood filter."}
                        </p>
                      </div>
                    );
                  }

                  return items.map((job) => {
                    const skillObj = CATEGORIES.find(c => c.id === job.skillNeeded) || CATEGORIES[CATEGORIES.length - 1];
                    const distKM = customerCoords
                      ? getDistanceKM(customerCoords.lat, customerCoords.lng, job.location.lat, job.location.lng)
                      : null;
                    const choiceDone = appliedJobs.includes(job.id);

                    return (
                      <motion.div
                        key={job.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-slate-100 hover:border-[#FF4D00]/20 transition-all shadow-xs flex flex-col sm:flex-row items-start justify-between gap-4"
                      >
                        <div className="space-y-3 text-left flex-grow">
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl bg-[#FFF5F0] p-2.5 rounded-xl text-[#FF4D00] inline-block font-bold">
                              {skillObj.id === "mason" && "🔨"}
                              {skillObj.id === "plumber" && "🚰"}
                              {skillObj.id === "electrician" && "⚡"}
                              {skillObj.id === "painter" && "🖌️"}
                              {skillObj.id === "carpenter" && "🪚"}
                              {skillObj.id === "ac_tech" && "❄️"}
                              {skillObj.id === "welder" && "🔥"}
                              {skillObj.id === "tile_worker" && "🧱"}
                              {skillObj.id === "digging" && "⛏️"}
                              {skillObj.id === "construction" && "👷"}
                              {skillObj.id === "driver" && "🚗"}
                              {skillObj.id === "guard" && "🛡️"}
                              {skillObj.id === "gardener" && "🌸"}
                              {skillObj.id === "helper" && "🤝"}
                              {skillObj.id === "other" && "⚙️"}
                            </span>
                            <div>
                              <div className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide">
                                {lang === "hi" ? skillObj.name_hi : skillObj.name_en}
                                {skillObj.id === "other" && job.customSkillText && ` (${job.customSkillText})`}
                              </div>
                              <h4 className="font-black text-sm sm:text-base text-slate-800 leading-tight">
                                {lang === "hi" ? (job.title_hi || job.title) : job.title}
                              </h4>
                            </div>
                          </div>

                          <p className="text-xs text-slate-600 font-semibold leading-relaxed">
                            {lang === "hi" ? (job.description_hi || job.description) : job.description}
                          </p>

                          <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] font-bold">
                            <span className="px-2.5 py-1 bg-slate-50 border border-slate-200 text-slate-600 rounded-lg flex items-center space-x-1">
                              <span>📍</span>
                              <span>{lang === "hi" ? job.area : job.area}</span>
                            </span>
                            {distKM !== null && (
                              <span className="px-2.5 py-1 bg-blue-50 border border-blue-100 text-blue-700 rounded-lg font-bold">
                                🚀 {distKM} KM {lang === 'hi' ? 'दूर (Near you)' : 'away'}
                              </span>
                            )}
                            <span className="px-2.5 py-1 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-lg font-extrabold text-[11px] uppercase tracking-wider">
                              💰 {job.dailyWage}
                            </span>
                            
                            {/* Dynamically Dated Badge */}
                            {job.postedAt && (
                              <span className="px-2.5 py-1 bg-purple-50 border border-purple-100 text-purple-700 rounded-lg font-semibold text-[11px] flex items-center space-x-1">
                                <span>📅</span>
                                <span>{lang === 'hi' ? 'तारीख:' : 'Posted:'} {new Date(job.postedAt).toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-US', { day: 'numeric', month: 'short' })}</span>
                              </span>
                            )}

                            {/* Color-coded Status Indicator Badge */}
                            {job.status === "completed" ? (
                              <span className="px-2.5 py-1 bg-red-150 border border-red-300 text-red-700 rounded-lg font-black text-[10px] tracking-wider uppercase flex items-center space-x-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
                                <span>{lang === 'hi' ? 'पूरा हो गया (Completed)' : 'Completed'}</span>
                              </span>
                            ) : (
                              <span className="px-2.5 py-1 bg-green-100 border border-green-300 text-green-800 rounded-lg font-black text-[10px] tracking-wider uppercase flex items-center space-x-1 animate-pulse">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                <span>{lang === 'hi' ? 'लंबित (Pending/Open)' : 'Pending (Requires Labor)'}</span>
                              </span>
                            )}
                          </div>

                          <div className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest pt-1">
                            {lang === 'hi' ? "काम पोस्ट करने वाला (Company):" : "PUBLISHED BY:"}{" "}
                            <span className="text-slate-800 font-black">{job.employerName}</span>
                          </div>
                        </div>

                        {/* Direct Callback Actions */}
                        <div className="flex flex-col gap-2 w-full sm:w-44 shrink-0 justify-end self-center sm:self-auto">
                          <a
                            href={`tel:${job.employerPhone}`}
                            onClick={() => {
                              playAudioTone("click");
                              triggerVoiceGuidance(
                                `${job.employerName} को फ़ोन मिलाया जा रहा है!`,
                                `Dialing supervisor ${job.employerName} now.`
                              );
                            }}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-black py-2.5 px-4 rounded-xl text-center text-xs tracking-wider flex items-center justify-center space-x-2 shadow-sm min-h-[44px] cursor-pointer"
                          >
                            <Phone className="w-4 h-4 shrink-0" />
                            <span>{lang === "hi" ? "फ़ोन मिलाएँ (Call)" : "Call Employer"}</span>
                          </a>

                          {/* Quick verification completion action which allows laborers, admins and employers to toggle status */}
                          <button
                            type="button"
                            onClick={() => {
                              handleToggleJobCompletionStatus(job.id);
                            }}
                            className={`font-black py-2.5 px-3 rounded-xl text-xs flex items-center justify-center space-x-1.5 transition transition-all duration-200 min-h-[44px] cursor-pointer border ${
                              job.status === "completed"
                                ? "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200"
                                : "bg-red-50 hover:bg-red-100 text-red-600 border-red-200"
                            }`}
                          >
                            <span>🔄</span>
                            <span>
                              {job.status === "completed"
                                ? (lang === "hi" ? "लंबित घोषित करें" : "Mark Pending")
                                : (lang === "hi" ? "कार्य पूरा घोषित करें" : "Mark Task Done")}
                            </span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              if (choiceDone) return;
                              setAppliedJobs(prev => [...prev, job.id]);
                              playAudioTone("success");
                              showNotification(
                                lang === "hi"
                                  ? `${job.employerName} को आपकी दिलचस्पी भेज दी गई है!`
                                  : `Expressed interest successfully to ${job.employerName}!`,
                                "success"
                              );
                              triggerVoiceGuidance(
                                "आपकी रूचि दर्ज़ कर ली गयी है। अब आप भी फोन का बटन दबाकर उनसे तुरंत बात कर लें।",
                                "Your profile is shared. Please double discuss by placing a call too."
                              );
                            }}
                            className={`font-extrabold py-2 px-3 rounded-xl text-xs flex items-center justify-center space-x-1.5 transition transition-all duration-200 min-h-[44px] cursor-pointer ${
                              choiceDone
                                ? "bg-slate-100 border border-slate-200 text-slate-400 cursor-not-allowed"
                                : "bg-orange-50 hover:bg-orange-100 text-[#FF4D00] border border-[#FFD8C2]"
                            }`}
                          >
                            <CheckCircle className={`w-4 h-4 shrink-0 ${choiceDone ? "text-slate-400" : "text-[#FF4D00]"}`} />
                            <span>{choiceDone ? (lang === 'hi' ? 'आवेदन भेजा गया' : 'Applied') : (lang === 'hi' ? 'काम की सूचना दें' : 'Inform interest')}</span>
                          </button>
                        </div>
                      </motion.div>
                    );
                  });
                })()}
              </div>
            </motion.div>
          )}

          {/* TAB: POST A JOB (For Employers) */}
          {currentUser && currentUser.role === "employer" && activeTab === "post_job" && (
            <motion.div
              key="post-job-view"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-slate-100 shadow-sm text-left max-w-xl mx-auto space-y-6"
            >
              <div>
                <h3 className="text-xl font-black text-slate-805 mb-1 flex items-center space-x-2">
                  <span>🧱</span>
                  <span className="text-slate-850">{lang === "hi" ? "दैनिक काम (रोजगार) पोस्ट करें" : "Publish Daily Wage Work"}</span>
                </h3>
                <p className="text-xs text-slate-500 font-bold">
                  {lang === "hi"
                    ? "आगरा में अपने घरेलू या कमर्शियल काम का ब्यौरा भरें। कामगार इसे देखकर सीधे आपसे फ़ोन पर संपर्क करेंगे।"
                    : "Post construction chores so workers around Agra can find your site details."}
                </p>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!jobTitle.trim()) {
                    showNotification(lang === "hi" ? "कृपया काम का शीर्षक लिखें!" : "Please write a job title!", "error");
                    return;
                  }
                  if (!jobWage.trim()) {
                    showNotification(lang === "hi" ? "कृपया दर जैसे ₹500/दिन लिखें!" : "Please express rate like ₹500/day!", "error");
                    return;
                  }

                  const matchedAreaObj = INDIAN_CITIES[0].areas.find((a) => a.name_en === jobArea) || INDIAN_CITIES[0].areas[0];

                  let finalJobSkill = jobSkill;
                  if (!finalJobSkill || !CATEGORIES.some(c => c.id === finalJobSkill)) {
                    finalJobSkill = "other";
                  }

                  const newJob: Job = {
                    id: "job-" + Date.now(),
                    employerName: currentUser.name,
                    employerPhone: currentUser.phone,
                    title: jobTitle,
                    title_hi: jobTitle,
                    description: jobDesc || "Daily construction labor requirement",
                    description_hi: jobDesc || "दैनिक मजदूरी काम की जरुरत",
                    skillNeeded: finalJobSkill,
                    city: "Agra",
                    area: jobArea,
                    address: jobAddress || `${jobArea}, Agra`,
                    dailyWage: jobWage,
                    postedAt: new Date().toISOString(),
                    status: "open",
                    location: {
                      lat: matchedAreaObj.lat,
                      lng: matchedAreaObj.lng,
                    },
                    customSkillText: jobCustomSkillText || undefined
                  };

                  setJobs((prev) => [newJob, ...prev]);

                  if (sbUrl && sbKey) {
                    insertSupabaseJob(sbUrl, sbKey, newJob).catch((e) => console.error("Cloud insert issue:", e));
                  }

                  // Reset form
                  setJobTitle("");
                  setJobDesc("");
                  setJobWage("");
                  setJobAddress("");
                  setJobCustomSkillText("");

                  playAudioTone("success");
                  showNotification(
                    lang === "hi" ? "नया काम सफलतापूर्वक पोस्ट हुआ!" : "Job publication successful!",
                    "success"
                  );
                  setActiveTab("my_jobs");
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-[10px] font-extrabold text-[#FF4D00] uppercase tracking-widest mb-1.5">
                    {lang === "hi" ? "काम का नाम / शीर्षक (Title)" : "Job Heading Title Name"}
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={60}
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder={lang === "hi" ? "उदा. नयी बिल्डिंग के लिए १ प्लम्बर" : "e.g., Need 2 Masons urgently"}
                    className="h-11 w-full bg-slate-50 border-2 border-slate-200 focus:border-[#FF4D00] focus:bg-white rounded-xl py-2 px-3 text-xs sm:text-sm font-extrabold text-slate-700 outline-none transition"
                  />
                  {/* Quick helper tag choices */}
                  <div className="flex flex-wrap items-center gap-1.5 mt-2">
                    {[
                      { hi: "राजमिस्त्री की जरुरत", en: "Mason Mistri needed" },
                      { hi: "पाइप फिटिंग प्लम्बर", en: "Urgent Plumber helper" },
                      { hi: "दीवार पुताई पेंटर", en: "Wall Painting worker" },
                      { hi: "सामान उठाने हेतु हेल्पर", en: "Helper load shifts" },
                    ].map((tag, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setJobTitle(lang === "hi" ? tag.hi : tag.en);
                          playAudioTone("click");
                        }}
                        className="py-1 px-2.5 bg-[#FFF5F0] hover:bg-[#FFE6D5] text-[#FF4D00] rounded-lg text-[10px] font-bold transition cursor-pointer"
                      >
                        ⚡ {lang === "hi" ? tag.hi : tag.en}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-1.5">
                      {lang === "hi" ? "आवश्यक हुनर (Required Skill)" : "Worker Skill Needed"}
                    </label>
                    <select
                      value={jobSkill}
                      onChange={(e) => {
                        setJobSkill(e.target.value);
                        playAudioTone("click");
                      }}
                      className="h-11 w-full bg-slate-50 border-2 border-slate-200 focus:border-[#FF4D00] focus:bg-white rounded-xl px-3 text-slate-700 text-xs sm:text-sm font-extrabold outline-none transition"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {lang === "hi" ? cat.name_hi : cat.name_en}
                        </option>
                      ))}
                    </select>
                    {jobSkill === "other" && (
                      <div className="mt-2 text-left">
                        <label className="block text-[9px] font-extrabold text-[#FF4D00] uppercase mb-1">
                          {lang === "hi" ? "नया या अन्य काम का नाम लिखें" : "Write custom work type / category name"}
                        </label>
                        <input
                          type="text"
                          required
                          value={jobCustomSkillText}
                          onChange={(e) => setJobCustomSkillText(e.target.value)}
                          placeholder={lang === "hi" ? "उदा. पीओपी या फॉल्स सीलिंग" : "e.g., Gypsum POP / paint work"}
                          className="h-9 w-full bg-slate-50 border border-slate-200 focus:border-[#FF4D00] focus:bg-white rounded-lg px-2.5 text-xs font-bold text-slate-700 outline-none transition"
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-1.5">
                      {lang === "hi" ? "दैनिक मजदूरी दर offered (Daily Wage)" : "Daily Wage Rate Offer"}
                    </label>
                    <input
                      type="text"
                      required
                      value={jobWage}
                      onChange={(e) => setJobWage(e.target.value)}
                      placeholder="e.g. ₹500/day"
                      className="h-11 w-full bg-slate-50 border-2 border-slate-200 focus:border-[#FF4D00] focus:bg-white rounded-xl py-2 px-3 text-xs sm:text-sm font-extrabold text-slate-700 outline-none transition"
                    />
                    <div className="flex gap-1 mt-1.5 flex-wrap">
                      {["₹400/day", "₹500/day", "₹600/day", "₹700/day"].map((p) => {
                        const rateStr = lang === "hi" ? p.replace("/day", " / दिन") : p;
                        return (
                          <button
                            key={p}
                            type="button"
                            onClick={() => {
                              setJobWage(rateStr);
                              playAudioTone("click");
                            }}
                            className="py-1 px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded text-[10px] font-bold cursor-pointer"
                          >
                            {rateStr}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-1.5">
                      {lang === "hi" ? "आगरा का क्षेत्र (Area)" : "Neighborhood Area"}
                    </label>
                    <select
                      value={jobArea}
                      onChange={(e) => {
                        setJobArea(e.target.value);
                        playAudioTone("click");
                      }}
                      className="h-11 w-full bg-slate-50 border-2 border-slate-200 focus:border-[#FF4D00] focus:bg-white text-slate-700 rounded-xl px-3 text-xs sm:text-sm font-extrabold outline-none transition animate-none"
                    >
                      {INDIAN_CITIES[0].areas.map((a) => (
                        <option key={a.name_en} value={a.name_en}>
                          {lang === "hi" ? a.name_hi : a.name_en}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-1.5">
                      {lang === "hi" ? "काम स्थल का पता (Site Address)" : "Full Site Address"}
                    </label>
                    <input
                      type="text"
                      value={jobAddress}
                      onChange={(e) => setJobAddress(e.target.value)}
                      placeholder={lang === "hi" ? "उदा. ब्लॉक ए, गली नंबर २" : "e.g., Block A, Kamla Nagar"}
                      className="h-11 w-full bg-slate-50 border-2 border-slate-200 focus:border-[#FF4D00] focus:bg-white rounded-xl py-2 px-3 text-xs sm:text-sm font-extrabold text-slate-700 outline-none transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-1.5">
                    {lang === "hi" ? "काम का पूरा ब्यौरा (Description)" : "Job Description Detail"}
                  </label>
                  <textarea
                    rows={2}
                    value={jobDesc}
                    onChange={(e) => setJobDesc(e.target.value)}
                    placeholder={lang === "hi" ? "उदा. २ दिन का काम है, सुबह ९ बजे शुरू होगा।" : "e.g., Concrete and steel welding work."}
                    className="w-full bg-slate-50 border-2 border-slate-200 focus:border-[#FF4D00] focus:bg-white rounded-xl p-2.5 text-xs sm:text-sm font-extrabold text-slate-700 outline-none transition"
                  />
                </div>

                <div className="pt-3">
                  <button
                    type="submit"
                    className="w-full py-3.5 bg-[#FF4D00] hover:bg-[#D63F00] text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-md transition active:scale-95 cursor-pointer"
                  >
                    🚀 {lang === "hi" ? "काम का विज्ञापन पोस्ट करें" : "Publish Job Vacancy Now"}
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* TAB: MY POSTED JOBS (For Employers) */}
          {currentUser && currentUser.role === "employer" && activeTab === "my_jobs" && (
            <motion.div
              key="my-jobs-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-4 text-left"
            >
              <div>
                <h3 className="text-xl font-black text-slate-800 mb-1">
                  {lang === "hi" ? "आपके द्वारा पोस्ट किए गए काम" : "Your Published Vacancies"}
                </h3>
                <p className="text-slate-500 text-xs font-bold font-semibold leading-relaxed">
                  {lang === "hi"
                    ? "आगरा के कामगार इसी विवरण को देखकर आपसे सीधे कॉल पर बातचीत करेंगे।"
                    : "Review vacancies you have uploaded. Workers will find your cell here to call."}
                </p>
              </div>

              <div className="space-y-4">
                {(() => {
                  const items = jobs.filter(
                    (j) => j.employerPhone === currentUser.phone
                  );

                  if (items.length === 0) {
                    return (
                      <div className="bg-white rounded-3xl p-10 border-2 border-slate-100 text-center text-slate-500">
                        <span className="text-4xl block mb-2">📋</span>
                        <p className="font-bold text-sm">
                          {lang === "hi" ? "आपने अभी तक कोई काम पोस्ट नहीं किया है।" : "No vacancies created by your account yet."}
                        </p>
                        <button
                          onClick={() => setActiveTab("post_job")}
                          className="mt-4 px-4 py-2.5 bg-[#FF4D00] hover:bg-[#D63F00] text-white text-xs font-black uppercase tracking-wider rounded-xl transition shadow-xs cursor-pointer"
                        >
                          ➕ {lang === "hi" ? "नया काम पोस्ट करें" : "Post new work now"}
                        </button>
                      </div>
                    );
                  }

                  return items.map((job) => {
                    const skillObj = CATEGORIES.find((c) => c.id === job.skillNeeded) || CATEGORIES[CATEGORIES.length - 1];
                    return (
                      <div
                        key={job.id}
                        className="bg-white rounded-3xl p-5 border-2 border-slate-100 shadow-xs flex flex-col sm:flex-row items-start justify-between gap-4 text-left"
                      >
                        <div className="space-y-2 flex-grow text-left">
                          <div className="flex items-center space-x-2">
                            <span className="bg-[#FFF5F0] text-[#FF4D00] p-1.5 rounded-lg text-sm font-bold shrink-0">
                              🤝
                            </span>
                            <h4 className="font-black text-sm sm:text-base text-slate-800 leading-tight">
                              {job.title}
                            </h4>
                          </div>

                          <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                            {job.description}
                          </p>

                          <div className="flex flex-wrap gap-2 pt-1 text-[11px] font-bold">
                            <span className="px-2 py-0.5 bg-slate-50 border border-slate-200 text-slate-600 rounded">
                              📍 {job.area}
                            </span>
                            <span className="px-2 py-0.5 bg-[#FFF5F0] text-[#FF4D00] font-extrabold rounded">
                              💰 {job.dailyWage}
                            </span>
                            {job.postedAt && (
                              <span className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded border border-purple-250">
                                📅 {lang === 'hi' ? 'तारीख:' : 'Posted:'} {new Date(job.postedAt).toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-US')}
                              </span>
                            )}
                            {job.status === "completed" ? (
                              <span className="px-2.5 py-0.5 bg-red-100 text-red-700 border border-red-300 rounded font-black inline-flex items-center space-x-1">
                                <span className="h-1.5 w-1.5 rounded-full bg-red-650 inline-block"></span>
                                <span>{lang === 'hi' ? 'पूरा हो गया (Completed)' : 'Completed'}</span>
                              </span>
                            ) : (
                              <span className="px-2.5 py-0.5 bg-green-50 text-green-700 rounded border border-green-200 font-black inline-flex items-center space-x-1 animate-pulse">
                                <span className="h-1.5 w-1.5 rounded-full bg-green-500 inline-block"></span>
                                <span>{lang === 'hi' ? 'लंबित कार्य (Pending)' : 'Pending'}</span>
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto shrink-0 justify-end self-center sm:self-auto">
                          <button
                            type="button"
                            onClick={() => {
                              handleToggleJobCompletionStatus(job.id);
                            }}
                            className={`px-3 py-2 border font-extrabold text-xs rounded-xl flex items-center justify-center space-x-1 transition cursor-pointer ${
                              job.status === "completed"
                                ? "bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-300"
                                : "bg-red-50 hover:bg-red-100 text-red-700 border-red-300"
                            }`}
                          >
                            <span>🔄</span>
                            <span>
                              {job.status === "completed"
                                ? (lang === 'hi' ? 'लंबित करें' : 'Mark Pending')
                                : (lang === 'hi' ? 'पूरा मार्क करें' : 'Mark Completed')}
                            </span>
                          </button>

                          <button
                            onClick={() => {
                              setJobs((prev) => prev.filter((j) => j.id !== job.id));

                              if (sbUrl && sbKey) {
                                deleteSupabaseJob(sbUrl, sbKey, job.id).catch((e) =>
                                  console.error("Cloud deletion issue:", e)
                                );
                              }

                              playAudioTone("click");
                              showNotification(
                                lang === "hi" ? "काम विज्ञापन बंद/हटा दिया गया!" : "Listing successfully deleted!",
                                "info"
                              );
                            }}
                            className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-extrabold text-xs rounded-xl flex items-center justify-center space-x-1.5 transition cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>{lang === "hi" ? "हटाएं" : "Delete"}</span>
                          </button>
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            </motion.div>
          )}

          {/* TAB 1: CUSTOMER LISTINGS SEARCH */}
          {currentUser && activeTab === "search" && (
            <motion.div
              key="search-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              id="customer-search-panel"
              className="space-y-5"
            >
              
              {/* GPS Target Locator HUD Card & Manually setting Location */}
              <div id="gps-locator-hud" className="bg-emerald-900 text-white rounded-2xl p-5 shadow-md relative overflow-hidden">
                <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-4 translate-y-4">
                  <MapPin className="w-44 h-44" />
                </div>
                
                <h3 className="text-lg font-bold mb-1 flex items-center space-x-2">
                  <span>📍</span>
                  <span>{lang === "hi" ? "आपका वर्तमान स्थान" : "Your Location"}</span>
                </h3>
                <p className="text-emerald-100 text-xs mb-4">
                  {lang === "hi" 
                    ? "जीपीएस का उपयोग कर पास के सबसे नजदीक मजदूरों को पहले देखें।" 
                    : "Find workers nearest to you in real-time."}
                </p>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-emerald-950/40 p-3 rounded-xl border border-emerald-800">
                  <div className="flex items-center space-x-2.5">
                    <div className="p-2.5 rounded-lg bg-emerald-800 text-emerald-200">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-[10px] text-emerald-300 font-bold uppercase tracking-wider">{lang === "hi" ? "सक्रिय स्थान" : "Active Location"}</div>
                      <div className="font-bold text-sm text-yellow-400">{detectedLocName || (lang === 'hi' ? 'तलाश की जा रही है...' : 'Locating...')}</div>
                    </div>
                  </div>

                  <button
                    onClick={detectCustomerGPS}
                    disabled={gpsLoading}
                    className="w-full sm:w-auto px-4 py-2.5 bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-bold rounded-xl text-xs flex items-center justify-center space-x-1.5 transition active:scale-95 shrink-0"
                  >
                    <LucideMap className="w-4 h-4" />
                    <span>{gpsLoading ? (lang === 'hi' ? 'खोज जारी...' : 'Locating...') : (lang === "hi" ? "मेरा स्थान लें" : "Use Real GPS")}</span>
                  </button>
                </div>

                {/* Quick Filters selection widgets */}
                <div className="mt-4 pt-4 border-t border-emerald-800 grid grid-cols-2 gap-2">
                  
                  <div>
                    <label className="block text-[10px] font-bold text-emerald-200 uppercase tracking-wider mb-1">
                      {lang === "hi" ? "शहर बदलें" : "City Selection"}
                    </label>
                    <select
                      value={selectedCityFilter}
                      onChange={(e) => {
                        setSelectedCityFilter(e.target.value);
                        setSelectedAreaFilter(""); // Reset area on city change
                        playAudioTone("click");
                        // Find first area of selected city to put as view center
                        const cityObj = INDIAN_CITIES.find(c => c.name_en === e.target.value);
                        if (cityObj && cityObj.areas.length > 0) {
                          setCustomerCoords({ lat: cityObj.areas[0].lat, lng: cityObj.areas[0].lng });
                          setDetectedLocName(`${cityObj.areas[0].name_en}, ${cityObj.name_en}`);
                        }
                      }}
                      className="w-full bg-emerald-950 border border-emerald-800 rounded-lg py-1.5 px-2 text-xs font-semibold text-white focus:outline-none focus:ring-1 focus:ring-yellow-400"
                    >
                      {INDIAN_CITIES.map((c) => (
                        <option key={c.name_en} value={c.name_en}>
                          {lang === "hi" ? c.name_hi : c.name_en}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-emerald-200 uppercase tracking-wider mb-1">
                      {lang === "hi" ? "क्षेत्र चुनें (एरिया)" : "Select Area"}
                    </label>
                    <select
                      value={selectedAreaFilter}
                      onChange={(e) => {
                        setSelectedAreaFilter(e.target.value);
                        playAudioTone("click");
                        const cityObj = INDIAN_CITIES.find(c => c.name_en === selectedCityFilter);
                        const areaObj = cityObj?.areas.find(a => a.name_en === e.target.value);
                        if (areaObj) {
                          setCustomerCoords({ lat: areaObj.lat, lng: areaObj.lng });
                          setDetectedLocName(`${areaObj.name_en}, ${selectedCityFilter}`);
                        }
                      }}
                      className="w-full bg-emerald-950 border border-emerald-800 rounded-lg py-1.5 px-2 text-xs font-semibold text-white focus:outline-none focus:ring-1 focus:ring-yellow-400"
                    >
                      <option value="">{lang === "hi" ? "सभी क्षेत्र (All Areas)" : "All Neighborhoods"}</option>
                      {INDIAN_CITIES.find((c) => c.name_en === selectedCityFilter)?.areas.map((a) => (
                        <option key={a.name_en} value={a.name_en}>
                          {lang === "hi" ? a.name_hi : a.name_en}
                        </option>
                      ))}
                    </select>
                  </div>

                </div>

              </div>

              {/* Segmented Choice: Workers (Kaamgar) vs Material Stores */}
              <div className="bg-slate-100 p-1 rounded-2xl grid grid-cols-2 gap-1 px-1.5 shadow-xs border border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    playAudioTone("click");
                    setActiveSearchSegment("kaamgar");
                    setSelectedSkillFilter("");
                    speakText(
                      lang === "hi" ? "कामगार खोजने की श्रेणी चालू है!" : "Search construction workers active", 
                      lang === "hi" ? "hi-IN" : "en-US"
                    );
                  }}
                  className={`py-3 px-3 rounded-xl font-bold text-xs sm:text-sm tracking-wider uppercase transition-all duration-200 flex items-center justify-center space-x-1.5 cursor-pointer ${
                    activeSearchSegment === "kaamgar"
                      ? "bg-emerald-700 text-white shadow-sm font-black"
                      : "text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  <span className="text-sm">👷</span>
                  <span>{lang === "hi" ? "कामगार ढूंढें" : "Find Labor"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    playAudioTone("click");
                    setActiveSearchSegment("material_stores");
                    setSelectedSkillFilter("");
                    speakText(
                      lang === "hi" ? "दुकान और सामग्री खोजने की श्रेणी लागू है!" : "Search material shops active", 
                      lang === "hi" ? "hi-IN" : "en-US"
                    );
                  }}
                  className={`py-3 px-3 rounded-xl font-bold text-xs sm:text-sm tracking-wider uppercase transition-all duration-200 flex items-center justify-center space-x-1.5 cursor-pointer ${
                    activeSearchSegment === "material_stores"
                      ? "bg-emerald-700 text-white shadow-sm font-black"
                      : "text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  <span className="text-sm">🏪</span>
                  <span>{lang === "hi" ? "मटेरियल स्टोर" : "Material Supplies"}</span>
                </button>
              </div>

              {/* Categorical Large Icons Filter Bar inside search tab */}
              <div id="skills-filter-section" className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    {lang === "hi" ? "काम की श्रेणी चुनें (Select Skill Category)" : "Browse Skills"}
                  </h4>
                  {selectedSkillFilter && (
                    <button
                      onClick={() => {
                        playAudioTone("click");
                        setSelectedSkillFilter("");
                      }}
                      className="text-xs font-bold text-emerald-700 hover:underline flex items-center space-x-1"
                    >
                      <span>🔄</span>
                      <span>{lang === "hi" ? "सभी दिखाएं" : "Clear Filter"}</span>
                    </button>
                  )}
                </div>

                {/* Horizontal row of fast categories with icons */}
                <div className="flex items-center space-x-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-thin">
                  {(() => {
                    const totalCount = workers.filter((w) => {
                      if (selectedCityFilter && w.city !== selectedCityFilter) return false;
                      if (selectedAreaFilter && w.area !== selectedAreaFilter) return false;
                      const isVendorSkill = w.skills.some(s => s.startsWith("vendor_"));
                      if (activeSearchSegment === "material_stores") {
                        return isVendorSkill;
                      } else {
                        return !isVendorSkill;
                      }
                    }).length;
                    return (
                      <button
                        onClick={() => {
                          playAudioTone("click");
                          setSelectedSkillFilter("");
                        }}
                        className={`px-4 py-2.5 rounded-full font-bold text-xs shrink-0 transition ${
                          selectedSkillFilter === ""
                            ? "bg-emerald-700 text-white shadow-sm"
                            : "bg-white text-slate-700 border border-slate-200"
                        }`}
                      >
                        {activeSearchSegment === "material_stores" 
                          ? `🏪 ${lang === "hi" ? "सभी दुकानें" : "All Stores"} (${totalCount})`
                          : `✨ ${lang === "hi" ? "सभी कामगार" : "All Workers"} (${totalCount})`}
                      </button>
                    );
                  })()}

                  {CATEGORIES.filter((cat) => {
                    const isVendor = cat.id.startsWith("vendor_");
                    return activeSearchSegment === "material_stores" ? isVendor : !isVendor;
                  }).map((cat) => {
                    const isSelected = selectedSkillFilter === cat.id;
                    const catCount = workers.filter((w) => {
                      if (selectedCityFilter && w.city !== selectedCityFilter) return false;
                      if (selectedAreaFilter && w.area !== selectedAreaFilter) return false;
                      return w.skills && w.skills.includes(cat.id);
                    }).length;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => {
                          playAudioTone("click");
                          setSelectedSkillFilter(cat.id);
                          const phrase = lang === 'hi' ? `${cat.name_hi} श्रेणी चुनी गई` : `${cat.name_en} selected`;
                          speakText(phrase, lang === 'hi' ? 'hi-IN' : 'en-US');
                        }}
                        className={`px-4 py-2.5 rounded-full font-bold text-xs shrink-0 transition flex items-center space-x-1.5 ${
                          isSelected
                            ? "bg-emerald-700 text-white shadow-xs"
                            : "bg-white text-slate-700 border border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <span>
                          {cat.id === "mason" && "🔨"}
                          {cat.id === "plumber" && "🚰"}
                          {cat.id === "electrician" && "⚡"}
                          {cat.id === "painter" && "🖌️"}
                          {cat.id === "carpenter" && "🪚"}
                          {cat.id === "ac_tech" && "❄️"}
                          {cat.id === "welder" && "🔥"}
                          {cat.id === "tile_worker" && "🧱"}
                          {cat.id === "digging" && "⛏️"}
                          {cat.id === "construction" && "👷"}
                          {cat.id === "driver" && "🚗"}
                          {cat.id === "guard" && "🛡️"}
                          {cat.id === "gardener" && "🌸"}
                          {cat.id === "helper" && "🤝"}
                          {cat.id === "vendor_lumber" && "🌲"}
                          {cat.id === "vendor_paint" && "🎨"}
                          {cat.id === "vendor_plumbing" && "🚰"}
                          {cat.id === "vendor_cement" && "🧱"}
                          {cat.id === "vendor_bricks" && "🟥"}
                          {cat.id === "vendor_steel" && "🔩"}
                          {cat.id === "vendor_clay_lime" && "🏺"}
                          {cat.id === "other" && "⚙️"}
                        </span>
                        <span>{lang === "hi" ? cat.name_hi : cat.name_en} ({catCount})</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Text Search Box */}
              <div id="search-input-wrapper" className="relative">
                <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder={
                    lang === "hi" 
                      ? "मजदूर का नाम या काम खोजें (उदा: राजेश, नलसाज)..." 
                      : "Search worker name or category (e.g., Rajesh, Plumber)..."
                  }
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-semibold transition shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-transparent"
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      playAudioTone("click");
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Workers / Shops Listing Header with stats */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {activeSearchSegment === "material_stores" ? (
                    lang === "hi" 
                      ? `आपके निकटतम सप्लायर और दुकानें (${filteredWorkersForCustomer.length})` 
                      : `Nearby Stores & Suppliers found (${filteredWorkersForCustomer.length})`
                  ) : (
                    lang === "hi" 
                      ? `आपके निकटतम कामगार और कारीगर (${filteredWorkersForCustomer.length})` 
                      : `Nearby Workers & Builders found (${filteredWorkersForCustomer.length})`
                  )}
                </span>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-1 rounded-md flex items-center space-x-1">
                  <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                  <span>{lang === "hi" ? "निकटतम पहले" : "Nearest First"}</span>
                </span>
              </div>

              {/* Listing Map/Cards list of Workers / Materials Stores */}
              <div id="workers-results-list" className="space-y-3.5">
                {filteredWorkersForCustomer.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-white rounded-2xl p-8 text-center border border-slate-200/60"
                  >
                    <SearchX className="w-12 h-12 mx-auto text-slate-400 mb-3" />
                    <p className="font-bold text-slate-700">
                      {activeSearchSegment === "material_stores" ? (
                        lang === "hi" ? "कोई दुकान या सप्लायर नहीं मिला" : "No stores or suppliers found"
                      ) : (
                        lang === "hi" ? "कोई कामगार नहीं मिला" : "No workers found"
                      )}
                    </p>
                    <p className="text-slate-500 text-xs mt-1">
                      {lang === "hi"
                        ? "कृपया अन्य शहर, क्षेत्र या सामग्री प्रकार का फ़िल्टर बदलें।"
                        : "Try changing your neighborhood area filter or material types."}
                    </p>
                    <button
                      onClick={() => {
                        setSelectedAreaFilter("");
                        setSelectedSkillFilter("");
                        setSearchQuery("");
                        playAudioTone("click");
                      }}
                      className="mt-4 px-4 py-2 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 rounded-lg text-xs font-bold"
                    >
                      {lang === "hi" ? "सभी फिल्टर रीसेट करें" : "Reset Filters"}
                    </button>
                  </motion.div>
                ) : (
                  filteredWorkersForCustomer.map((worker) => {
                    const cats = getWorkerCategoryDetails(worker);
                    return (
                      <motion.div
                        layout
                        key={worker.id}
                        id={`worker-card-${worker.id}`}
                        className="bg-white rounded-2xl p-4 border border-slate-200/60 hover:shadow-md transition duration-200 flex flex-col justify-between space-y-4"
                      >
                        <div className="flex items-start space-x-3.5">
                          {/* Worker Avatar with optional voice read of this worker name */}
                          <div className="relative shrink-0">
                            <img
                              src={worker.photo}
                              alt={worker.name}
                              referrerPolicy="no-referrer"
                              className="w-16 h-16 rounded-xl object-cover border-2 border-slate-100 bg-slate-100"
                              onError={(e) => {
                                // Fallback image if unsplash blocked or offline
                                (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/pixel-art/svg?seed=${worker.name}`;
                              }}
                            />
                            {worker.isVerified && (
                              <span className="absolute -bottom-1 -right-1 bg-emerald-600 text-white p-0.5 rounded-full text-[9px] font-bold" title="Verified Worker">
                                <Check className="w-3.5 h-3.5" />
                              </span>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-1.5 flex-wrap">
                              <h3 className="font-extrabold text-slate-800 text-base truncate leading-tight">
                                {lang === "hi" ? (worker.name_hi || worker.name) : worker.name}
                              </h3>
                              
                              {/* Audio button to call-out and speak worker's name + skills */}
                              <button
                                type="button"
                                onClick={() => {
                                  playAudioTone("voice-ding");
                                  const skilltext = cats.map(c => lang === 'hi' ? c.name_hi : c.name_en).join(', ');
                                  const path = lang === 'hi' 
                                    ? `कारीगर का नाम है ${worker.name_hi || worker.name}। ये ${skilltext} का काम करते हैं।`
                                    : `Worker username is ${worker.name}. Skilled in ${skilltext}.`;
                                  speakText(path, lang === 'hi' ? 'hi-IN' : 'en-US');
                                }}
                                className="text-emerald-700 hover:scale-110 p-0.5 bg-emerald-50 rounded-full shrink-0"
                                title="Listen to name / नाम सुनें"
                              >
                                <Volume2 className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            {/* Skills Tag row */}
                            <div className="flex flex-wrap gap-1 mt-1.5">
                              {cats.map(cat => (
                                <span key={cat.id} className="inline-flex items-center bg-emerald-50 text-emerald-800 text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-md">
                                  {lang === "hi" ? cat.name_hi : cat.name_en}
                                  {cat.id === "other" && worker.customSkillText && ` (${worker.customSkillText})`}
                                </span>
                              ))}
                            </div>

                            {/* Distance indicator and simple area */}
                            <div className="flex items-center space-x-2.5 mt-2.5 text-[11px] text-slate-500 font-semibold flex-wrap gap-1.5">
                              <span className="flex items-center space-x-1">
                                <span className="text-emerald-700 font-extrabold">📍 {worker.area}</span>
                              </span>
                              <span>•</span>
                              <span className="bg-amber-100 text-amber-900 font-extrabold px-1.5 py-0.5 rounded text-[10px] tracking-wide shrink-0">
                                {worker.distance === 999 
                                  ? (lang === 'hi' ? "स्थान अज्ञात" : "Distance unknown")
                                  : `${worker.distance} KM ${lang === 'hi' ? 'दूर' : 'away'}`}
                              </span>

                              {/* Green and Red Laborer OccupState status */}
                              {!(worker.skills || []).some(s => s.startsWith("vendor_")) && (
                                <span className="shrink-0">
                                  {worker.status === "busy" ? (
                                    <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 text-[9px] font-black text-red-700 bg-red-100 border border-red-200 rounded-lg uppercase tracking-wider">
                                      <span className="h-1.5 w-1.5 bg-red-600 rounded-full inline-block"></span>
                                      <span>{lang === "hi" ? "🔴 काम पर (Busy)" : "🔴 Busy"}</span>
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 text-[9px] font-black text-emerald-800 bg-emerald-100 border border-emerald-200 rounded-lg uppercase tracking-wider animate-pulse">
                                      <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full inline-block"></span>
                                      <span>{lang === "hi" ? "🟢 खाली (Available)" : "🟢 Available"}</span>
                                    </span>
                                  )}
                                </span>
                              )}
                            </div>

                            {/* Dynamic Physical/Shop Street Address for purchasing materials */}
                            {worker.address && (
                              <div className="mt-2 text-[11px] font-bold text-rose-800 bg-rose-50 border border-rose-100 p-2 rounded-xl flex items-start space-x-1">
                                <span className="text-sm shrink-0">🏠</span>
                                <span className="leading-tight">
                                  <strong className="font-extrabold">{lang === 'hi' ? 'दुकान/पता:' : 'Address:'}</strong> {worker.address}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Customer Direct actions */}
                        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100">
                          
                          {/* Anchor element to call directly */}
                          <a
                            href={`tel:${worker.phone}`}
                            onClick={() => {
                              playAudioTone("click");
                              showNotification(
                                lang === "hi" 
                                  ? `कॉल किया जा रहा है: ${worker.phone}` 
                                  : `Calling worker mobile: ${worker.phone}`
                              );
                            }}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 px-2 rounded-xl font-bold text-[11px] sm:text-xs flex items-center justify-center space-x-1 transition active:scale-95 shadow-sm cursor-pointer"
                          >
                            <Phone className="w-3.5 h-3.5 shrink-0" />
                            <span>{lang === "hi" ? "फ़ोन कॉल" : "Call"}</span>
                          </a>

                          {/* Anchor element to send WhatsApp */}
                          <a
                            href={`https://wa.me/91${worker.phone}?text=नमस्ते ${worker.name}, मुझे 'काम' ऐप से आपका नंबर मिला। क्या आप काम के लिए उपलब्ध हैं?`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => {
                              playAudioTone("click");
                              showNotification(
                                lang === "hi"
                                  ? "व्हाट्सएप चैट खोली जा रही है..."
                                  : "Opening WhatsApp chat..."
                              );
                            }}
                            className="bg-slate-800 hover:bg-slate-900 text-white py-2.5 px-2 rounded-xl font-bold text-[11px] sm:text-xs flex items-center justify-center space-x-1 transition active:scale-95 cursor-pointer"
                          >
                            <span className="font-bold text-emerald-400">💬</span>
                            <span>{lang === "hi" ? "व्हाट्सएप" : "WhatsApp"}</span>
                          </a>

                          {/* Interactive Web Share button */}
                          <button
                            type="button"
                            onClick={async () => {
                              playAudioTone("click");
                              const name = lang === "hi" ? (worker.name_hi || worker.name) : worker.name;
                              const skillList = cats.map(c => lang === "hi" ? c.name_hi : c.name_en).join(", ");
                              const shareText = lang === "hi"
                                ? `कामगार का नाम: ${name}\nहुनर प्रकार: ${skillList}\nफ़ोन नंबर: ${worker.phone}\n'काम' (KAAM) ऐप से शेयर किया गया।`
                                : `Worker Name: ${name}\nSkills: ${skillList}\nMobile: ${worker.phone}\nShared via 'KAAM' Agra Labor Connect App.`;

                              if (navigator.share) {
                                try {
                                  await navigator.share({
                                    title: `KAAM - ${name}`,
                                    text: shareText,
                                    url: window.location.href,
                                  });
                                  showNotification(
                                    lang === "hi" ? "सफलतापूर्वक शेयर किया गया!" : "Shared successfully!",
                                    "success"
                                  );
                                } catch (err) {
                                  console.warn("Share cancelled or failed:", err);
                                }
                              } else {
                                // Fallback: copy to clipboard
                                try {
                                  await navigator.clipboard.writeText(`${shareText}\n${window.location.href}`);
                                  showNotification(
                                    lang === "hi"
                                      ? "विवरण कॉपी कर लिया गया है! इसे व्हाट्सएप या सोशल मीडिया पर शेयर करें।"
                                      : "Details copied! Paste it on WhatsApp or social media.",
                                    "success"
                                  );
                                  triggerVoiceGuidance(
                                    "विवरण कॉपी कर लिया गया है, आप इसे कहीं भी भेज सकते हैं।",
                                    "Details copied to clipboard, you can share it now."
                                  );
                                } catch (err) {
                                  console.error("Clipboard failure:", err);
                                  showNotification(
                                    lang === "hi" ? "कॉपी करने में त्रुटि।" : "Failed to copy details.",
                                    "error"
                                  );
                                }
                              }
                            }}
                            className="bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-2 rounded-xl font-bold text-[11px] sm:text-xs flex items-center justify-center space-x-1 transition active:scale-95 shadow-sm cursor-pointer"
                          >
                            <Share2 className="w-3.5 h-3.5 shrink-0" />
                            <span>{lang === "hi" ? "शेयर करें" : "Share"}</span>
                          </button>

                        </div>

                        {/* Employer Assign Job action */}
                        {currentUser && (currentUser.role === "employer" || currentUser.role === "admin") && (
                          <div className="pt-1.5 mt-1 text-center">
                            <button
                              type="button"
                              onClick={() => {
                                playAudioTone("click");
                                setAssigningWorker(worker);
                              }}
                              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white py-2.5 px-4 rounded-xl font-extrabold text-xs flex items-center justify-center space-x-1.5 transition active:scale-95 shadow-sm cursor-pointer"
                            >
                              <span>🤝 {lang === "hi" ? "इस कामगार को काम सौंपें" : "Assign Task to Worker"}</span>
                            </button>
                          </div>
                        )}
                      </motion.div>
                    );
                  })
                )}
              </div>
            </motion.div>
          )}

          {/* TAB 2: ILLITERATE-FRIENDLY WORKER REGISTRATION */}
          {currentUser && activeTab === "register" && (() => {
            const matchingWorkerInDb = workers.find(w => w.phone === currentUser.phone);
            
            if (matchingWorkerInDb && !forceRegWizard) {
              return (
                <motion.div
                  key="register-card-finished"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-3xl p-6 border-4 border-[#2D2D2D] text-left space-y-6"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
                    <div>
                      <span className="text-[10px] uppercase font-black tracking-widest text-[#FFF5F0] bg-[#FF4D00] px-2 py-0.5 rounded-lg">
                        🛡️ {lang === 'hi' ? "सत्यापित कामगार डिजिटल पहचान" : "Verified Worker QR Passport"}
                      </span>
                      <h3 className="text-xl font-black text-slate-800 mt-1">
                        {lang === 'hi' ? "आपका 'काम' डिजिटल परिचय पत्र" : "Your Kaam Digital Identity Card"}
                      </h3>
                      <p className="text-xs text-slate-500 font-semibold mt-0.5">
                        {lang === 'hi'
                          ? "मजदूर चौक या दुकान पर काम पाने के लिए यह डिजिटल पहचान कार्ड उपयोगी है।"
                          : "This digital identity card is useful for securing labor job slots or supplier matching."}
                      </p>
                    </div>
                    <div>
                      <button
                        type="button"
                        onClick={() => {
                          setForceRegWizard(true);
                          setRegStep(1);
                        }}
                        className="px-3.5 py-2 bg-[#FFF5F0] hover:bg-[#FFEAE0] text-[#FF4D00] border border-[#FF4D00]/25 font-bold text-xs uppercase tracking-wider rounded-xl transition cursor-pointer"
                      >
                        ✏️ {lang === "hi" ? "विवरण बदलें" : "Edit Details"}
                      </button>
                    </div>
                  </div>

                  {/* HIGH-CONTRAST SYSTEM BADGE WRAPPER */}
                  <div id="printable-worker-passport" className="mx-auto max-w-sm rounded-[24px] border-4 border-[#2D2D2D] bg-[#FFFBF5] overflow-hidden shadow-md flex flex-col">
                    {/* Badge Header Banner */}
                    <div className="bg-[#FF4D00] px-4 py-3 text-white flex items-center justify-between border-b-4 border-[#2D2D2D]">
                      <div className="flex items-center space-x-2">
                        <span className="text-xl">☀️</span>
                        <div>
                          <h4 className="text-[10px] font-black tracking-widest uppercase leading-none">KAAM APPLICATION</h4>
                          <p className="text-[8px] font-bold text-orange-200 tracking-wider">AGRA DISTRICT DISPATCH CARD</p>
                        </div>
                      </div>
                      <div className="bg-white/20 text-white rounded px-1.5 py-0.5 text-[8px] font-black tracking-widest uppercase">
                        {lang === 'hi' ? "सत्यापित" : "VERIFIED"}
                      </div>
                    </div>

                    {/* Badge Content Card */}
                    <div className="p-4 flex gap-4">
                      {/* Left: QR code visual and scan instructions */}
                      <div className="flex-1 flex flex-col items-center justify-center space-y-1.5">
                        <div className="bg-white p-2 rounded-xl border-3 border-[#2D2D2D] shadow-xs flex items-center justify-center">
                          {/* Rich High-Fidelity Custom SVG QR representation */}
                          <svg className="w-24 h-24 text-slate-900" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                            {/* Target squares at 3 corners */}
                            <path d="M5 5h20v20H5V5zm6 6v8h8v-8h-8z" fill="currentColor"/>
                            <path d="M5 75h20v20H5V75zm6 6v8h8v-8h-8z" fill="currentColor"/>
                            <path d="M75 5h20v20H75V5zm6 6v8h8v-8h-8z" fill="currentColor"/>
                            
                            {/* Core identification dot code points representing Agra registry */}
                            <circle cx="15" cy="15" r="3" fill="currentColor"/>
                            <circle cx="15" cy="85" r="3" fill="currentColor"/>
                            <circle cx="85" cy="15" r="3" fill="currentColor"/>
                            <circle cx="50" cy="50" r="4.5" fill="#FF4D00"/>{/* Center tracking point */}

                            {/* Outer simulated geometric barcode patterns */}
                            <rect x="35" y="10" width="10" height="4" rx="1" fill="currentColor"/>
                            <rect x="55" y="10" width="15" height="4" rx="1" fill="currentColor"/>
                            <rect x="35" y="20" width="4" height="10" rx="1" fill="currentColor"/>
                            <rect x="45" y="20" width="15" height="4" rx="1" fill="currentColor"/>
                            <rect x="65" y="20" width="4" height="15" rx="1" fill="currentColor"/>

                            <rect x="35" y="32" width="20" height="4" rx="1" fill="currentColor"/>
                            <rect x="35" y="42" width="10" height="4" rx="1" fill="currentColor"/>
                            <rect x="60" y="42" width="10" height="4" rx="1" fill="currentColor"/>

                            <rect x="10" y="35" width="4" height="15" rx="1" fill="currentColor"/>
                            <rect x="20" y="35" width="4" height="10" rx="1" fill="currentColor"/>
                            <rect x="20" y="55" width="30" height="4" rx="1" fill="currentColor"/>

                            <rect x="55" y="55" width="4" height="15" rx="1" fill="currentColor"/>
                            <rect x="65" y="55" width="25" height="4" rx="1" fill="currentColor"/>
                            <rect x="75" y="35" width="4" height="15" rx="1" fill="currentColor"/>
                            <rect x="85" y="35" width="4" height="25" rx="1" fill="currentColor"/>

                            <rect x="55" y="65" width="15" height="4" rx="1" fill="currentColor"/>
                            <rect x="35" y="75" width="15" height="4" rx="1" fill="currentColor"/>
                            <rect x="55" y="75" width="4" height="15" rx="1" fill="#FF4D00"/>
                            <rect x="65" y="75" width="25" height="4" rx="1" fill="currentColor"/>
                            <rect x="65" y="85" width="15" height="4" rx="1" fill="currentColor"/>
                            <rect x="35" y="85" width="15" height="4" rx="1" fill="currentColor"/>
                          </svg>
                        </div>
                        <span className="text-[7.5px] uppercase font-extrabold text-[#FF4D00] tracking-widest animate-pulse leading-none text-center">
                          {lang === 'hi' ? "★ स्कैन करें ★" : "★ SCAN BADGE ★"}
                        </span>
                      </div>

                      {/* Right: Personal details */}
                      <div className="flex-1 space-y-3 text-left flex flex-col justify-between">
                        <div>
                          <span className="text-[8px] uppercase font-extrabold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded">
                            {matchingWorkerInDb.skills && matchingWorkerInDb.skills.length > 0 
                              ? matchingWorkerInDb.skills[0].toUpperCase() 
                              : "BUILDER"}
                          </span>
                          <h5 className="font-extrabold text-sm text-slate-850 leading-tight mt-1">{matchingWorkerInDb.name}</h5>
                          <p className="text-[9px] font-mono text-slate-500 mt-0.5">📞 {matchingWorkerInDb.phone}</p>
                        </div>

                        <div className="border-t pt-1.5 border-dashed border-slate-350 text-[10px] text-slate-600 space-y-1 font-semibold leading-relaxed">
                          <p>📍 {lang === 'hi' ? "स्थान:" : "Area:"} <span className="text-slate-850 font-bold">{matchingWorkerInDb.area}</span></p>
                          <p>⭐ {lang === 'hi' ? "रेटिंग:" : "Rating:"} <span className="text-slate-855 font-bold">{matchingWorkerInDb.rating || "5.0"} Verified</span></p>
                          <p>💼 {lang === 'hi' ? "अनुभव:" : "Work count:"} <span className="text-[#FF4D00] font-black">{matchingWorkerInDb.completedJobs || "0"} jobs done</span></p>
                        </div>
                      </div>
                    </div>

                    {/* Badge Footer Instructions */}
                    <div className="bg-[#2D2D2D] p-2 text-center text-[8px] text-amber-200 tracking-wider font-extrabold leading-none uppercase select-none border-t border-[#2D2D2D]">
                      {lang === 'hi' 
                        ? "आगरा विकास प्राधिकरण लेबर जंक्शन डिजिटल कार्ड"
                        : "Official Agra Kaam Daily-Wage Dispatch Passport"}
                    </div>
                  </div>

                  {/* Voice instructions card */}
                  <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 flex items-start space-x-3 text-left">
                    <span className="text-2xl mt-0.5 animate-pulse">📢</span>
                    <div className="space-y-1">
                      <h4 className="text-xs font-black text-amber-900 uppercase">
                        {lang === 'hi' ? "सहायक आवाज निर्देश (Voice Assistant Guide)" : "Audio helper guidance"}
                      </h4>
                      <p className="text-[11px] text-amber-800 font-bold leading-relaxed">
                        {lang === 'hi'
                          ? "मजदूर चौक, ताजमहल रोड या संजय पैलेस चौराहे पर खड़े होने की आवश्यकता नहीं है। इस क्यूआर कोड को ठेकेदारों के सामने प्रस्तुत करें। वे इसे स्कैन कर सीधे आपके खाते में काम भेज देंगे।"
                          : "Do not stand at Agra Sanjay Palace chowks. Display this card to builders so they scan and directly allocate work to you without intermediates."}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            }

            return (
              <motion.div
                key="register-view"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-3xl p-5 border border-slate-200/60 shadow-xs"
              >
                {/* Registration Status Progress Bar */}
              <div id="progress-bar-block" className="mb-6">
                <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase mb-2">
                  <span>{lang === "hi" ? "पंजीकरण प्रगति" : "Easy Registration Progress"}</span>
                  <span className="text-emerald-700">{regStep} / 6</span>
                </div>
                
                {/* Horizontal progress dots */}
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5, 6].map((step) => (
                    <div
                      key={step}
                      className={`h-2.5 flex-1 rounded-full transition-all duration-300 ${
                        step < regStep
                          ? "bg-emerald-600"
                          : step === regStep
                          ? "bg-amber-500 animate-pulse scale-y-110"
                          : "bg-slate-100"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* STEP 1: CAPTURE PHOTO WITH ELEGANT GRAPHIC */}
              {regStep === 1 && (
                <div className="space-y-5 text-center">
                  
                  {/* Simulated poster QR Code visual decoration */}
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/60 flex items-center justify-between text-left max-w-sm mx-auto">
                    <div className="flex items-center space-x-2.5">
                      <div className="bg-white p-1.5 rounded-lg border border-slate-200 shadow-xs shrink-0">
                        {/* Elegant SVG QR code icon */}
                        <svg className="w-9 h-9 text-slate-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <rect x="3" y="3" width="7" height="7" rx="1" />
                          <rect x="14" y="3" width="7" height="7" rx="1" />
                          <rect x="3" y="14" width="7" height="7" rx="1" />
                          <rect x="14" y="14" width="3" height="3" rx="0.5" />
                          <rect x="18" y="18" width="3" height="3" rx="0.5" />
                          <rect x="14" y="18" width="3" height="3" rx="0.5" />
                          <rect x="18" y="14" width="3" height="3" rx="0.5" />
                        </svg>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-extrabold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded-md leading-none">
                          {lang === "hi" ? "क्यूआर कोड स्कैन सफल" : "QR Code Scanned"}
                        </span>
                        <p className="text-xs text-slate-600 font-semibold mt-1">
                          {lang === "hi" ? "पोस्टर या स्टिकर से 'काम' ऐप खुला" : "Arrived safely from pamphlet QR code"}
                        </p>
                      </div>
                    </div>
                    <span className="text-emerald-600 text-lg">✅</span>
                  </div>

                  <div className="flex items-center justify-center">
                    <span className="text-4xl">📸</span>
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-800 leading-tight">
                    {lang === "hi" ? "अपना सुंदर फोटो अपलोड करें" : "Step 1: Upload or Choose Photo"}
                  </h3>
                  <p className="text-slate-500 text-xs px-2">
                    {lang === "hi"
                      ? "ग्राहक आपका चेहरा देखकर आपको आसानी से पहचान सकते हैं। नीचे दी गई किसी एक फोटो पर दबाएं या कैमरे से फोटो लें।"
                      : "A clean profile photo helps clients trust and select you."}
                  </p>

                  {/* Simulated Camera & Preset Selector interface for illiterate people to fast select */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/50 space-y-4">
                    <div className="flex justify-center">
                      <div className="relative">
                        <img
                          src={regPhoto || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop"}
                          alt="Worker placeholder"
                          className="w-28 h-28 rounded-2xl object-cover border-4 border-white shadow-md bg-slate-200"
                        />
                        <div className="absolute -bottom-1.5 -right-1.5 bg-emerald-700 text-white p-2 rounded-xl shadow-md">
                          <Camera className="w-5 h-5" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <span className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">
                        {lang === "hi" ? "त्वरित फोटो चुनें (Quick Photo Choice)" : "Quick Preset Avatars"}
                      </span>
                      <div className="grid grid-cols-4 gap-2">
                        {[
                          "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&h=150&fit=crop&crop=face",
                          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
                          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
                          "https://images.unsplash.com/photo-1542103749-8ef59b94f47e?w=150&h=150&fit=crop&crop=face"
                        ].map((avatarUrl, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => handleChooseLibraryPhoto(avatarUrl)}
                            className={`p-1 rounded-xl border-2 transition ${
                              regPhoto === avatarUrl 
                                ? "border-amber-500 scale-105 bg-slate-100" 
                                : "border-transparent hover:border-slate-300"
                            }`}
                          >
                            <img src={avatarUrl} alt="Preset worker" className="w-full h-11 rounded-lg object-cover" />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Real Device Camera & Gallery Uploads */}
                    <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                      
                      {/* OPTION 1: CAMERA WITH CAPTURE INJECTED */}
                      <label 
                        id="camera-capture-trigger"
                        className="w-full sm:w-auto cursor-pointer inline-flex items-center justify-center space-x-2 bg-[#FF4D00] hover:bg-[#D63F00] text-white font-extrabold px-5 py-3.5 rounded-2xl text-xs sm:text-sm shadow-md transition active:scale-95 cursor-pointer"
                      >
                        <Camera className="w-4 h-4 shrink-0" />
                        <span>{lang === "hi" ? "कैमरा से फोटो खींचें" : "Take Photo with Camera"}</span>
                        <input
                          type="file"
                          accept="image/*"
                          capture="user"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const r = new FileReader();
                              r.onloadend = () => {
                                compressAndSetPhoto(r.result as string, (compressed) => {
                                  setRegPhoto(compressed);
                                  showNotification(
                                    lang === "hi" ? "कैमरा फोटो सफलतापूर्वक जुड़ गया!" : "Camera snapshot loaded successfully!",
                                    "success"
                                  );
                                });
                              };
                              r.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>

                      {/* OPTION 2: GALLERY SELECTOR */}
                      <label 
                        id="gallery-picker-trigger"
                        className="w-full sm:w-auto cursor-pointer inline-flex items-center justify-center space-x-2 bg-slate-800 hover:bg-slate-900 text-white font-extrabold px-5 py-3.5 rounded-2xl text-xs sm:text-sm shadow-md transition active:scale-95 border-2 border-slate-800 cursor-pointer"
                      >
                        <span className="text-xs sm:text-sm">🖼️</span>
                        <span>{lang === "hi" ? "गैलरी से फोटो चुनें" : "Choose from Gallery"}</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const r = new FileReader();
                              r.onloadend = () => {
                                compressAndSetPhoto(r.result as string, (compressed) => {
                                  setRegPhoto(compressed);
                                  showNotification(
                                    lang === "hi" ? "गैलरी फोटो सफलतापूर्वक जुड़ गया!" : "Gallery photo loaded successfully!",
                                    "success"
                                  );
                                });
                              };
                              r.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>

                    </div>
                  </div>

                  <div className="pt-4 flex justify-between">
                    <div></div>
                    <button
                      onClick={() => {
                        playAudioTone("click");
                        setRegStep(2);
                      }}
                      className="bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold px-6 py-3 rounded-2xl text-sm flex items-center space-x-1 shadow-sm transition active:scale-95"
                    >
                      <span>{lang === "hi" ? "आगे बढ़ें" : "Next Step"}</span>
                      <ArrowRight className="w-4 h-4 shrink-0" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: SPEAK OR ENTER NAME WITH MICROPHONE ANIMATION */}
              {regStep === 2 && (
                <div className="space-y-5 text-center">
                  <div className="flex items-center justify-center">
                    <span className="text-4xl">🎙️</span>
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-800 leading-tight">
                    {lang === "hi" ? "अपना नाम लिखें या बोलें" : "Step 2: Enter or Speak Your Name"}
                  </h3>
                  <p className="text-slate-500 text-xs px-2">
                    {lang === "hi"
                      ? "पेज पर नीचे दिया गया माइक बटन दबाकर अपना नाम बोलें, नाम अपने आप लिख जाएगा।"
                      : "Tap microhpone button or use form input to specify your name."}
                  </p>

                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/50 space-y-5">
                    
                    {/* Glowing Mic button */}
                    <div className="flex flex-col items-center justify-center">
                      <button
                        type="button"
                        onClick={toggleVoiceNameInput}
                        className={`w-20 h-20 rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-300 ${
                          regIsRecording 
                            ? "bg-red-500 animate-ping" 
                            : "bg-amber-500 hover:bg-amber-400"
                        }`}
                      >
                        <Mic className="w-8 h-8 shrink-0" />
                      </button>
                      <span className="block mt-2 text-xs font-bold text-slate-600 animate-pulse">
                        {regIsRecording
                          ? (lang === "hi" ? "🔴 बोला जा रहा है... (सुन रहे हैं)" : "🔴 Active... Speak name")
                          : (lang === "hi" ? "👉 माइक दबाकर नाम बोलें" : "👉 Tap mic to Speak Name")}
                      </span>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1.5 tracking-wider">
                        {lang === "hi" ? "अथवा कीबोर्ड से टाइप करें" : "Or write using keyboard"}
                      </label>
                      <input
                        type="text"
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        placeholder={lang === "hi" ? "जैसे: हरीश कुमार मिस्त्री" : "e.g. Harish Kumar"}
                        className="w-full bg-white text-center text-lg font-bold border border-slate-200 rounded-2xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                      />
                      
                      <div className="mt-2 text-center">
                        <button
                          type="button"
                          onClick={() => {
                            setRegName(lang === "hi" ? "अन्य विक्रेता / मजदूर" : "Others (Laborer/Vendor)");
                            playAudioTone("click");
                          }}
                          className="text-emerald-700 hover:text-emerald-800 text-xs font-extrabold underline cursor-pointer"
                        >
                          ✨ {lang === "hi" ? "नाम उपलब्ध नहीं? 'अन्य (Others)' दर्ज करें" : "Name not present? Tap to use 'Others'"}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-between">
                    <button
                      onClick={() => {
                        playAudioTone("click");
                        setRegStep(1);
                      }}
                      className="border border-slate-200 text-slate-600 font-bold px-5 py-3 rounded-2xl text-sm"
                    >
                      {lang === "hi" ? "पीछे" : "Back"}
                    </button>
                    <button
                      onClick={() => {
                        playAudioTone("click");
                        if (!regName.trim()) {
                          setRegName(lang === "hi" ? "अन्य विक्रेता / मजदूर (Others)" : "Others (Laborer/Vendor)");
                        }
                        setRegStep(3);
                      }}
                      className="bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold px-6 py-3 rounded-2xl text-sm flex items-center space-x-1 shadow-sm transition active:scale-95"
                    >
                      <span>{lang === "hi" ? "आगे बढ़ें" : "Next Step"}</span>
                      <ArrowRight className="w-4 h-4 shrink-0" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: PHONE NUMBER */}
              {regStep === 3 && (
                <div className="space-y-5 text-center">
                  <div className="flex items-center justify-center">
                    <span className="text-4xl">📱</span>
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-800 leading-tight">
                    {lang === "hi" ? "अपना चालू मोबाइल नंबर दर्ज करें" : "Step 3: Enter Your Mobile Number"}
                  </h3>
                  <p className="text-slate-500 text-xs px-2">
                    {lang === "hi"
                      ? "ग्राहक आपको काम देने के लिए इसी नंबर पर फोन करेंगे। गलत नंबर न डालें!"
                      : "Clients will contact you on this number directly. Make sure it is correct."}
                  </p>

                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/50 space-y-4">
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-slate-400">
                        +91
                      </span>
                      <input
                        type="tel"
                        pattern="[0-9]{10}"
                        maxLength={10}
                        placeholder={lang === "hi" ? "जैसे: 9876543210 (10 अंक)" : "10-digit number"}
                        value={regMobile}
                        onChange={(e) => {
                          const val = e.target.value.replace(/[^0-9]/g, "");
                          setRegMobile(val);
                        }}
                        className="w-full bg-white font-bold text-xl py-4 pl-14 pr-4 tracking-widest border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-transparent text-center"
                      />
                    </div>

                    {/* Simple Quick Fill Buttons to satisfy Automatic mobile option requested */}
                    <div className="pt-1 flex justify-center">
                      <button
                        type="button"
                        onClick={() => {
                          playAudioTone("click");
                          // Generate random Indian number start with 9, 8 or 7
                          const num = Math.floor(7000000000 + Math.random() * 2999999999).toString();
                          setRegMobile(num);
                          showNotification(
                            lang === 'hi' ? "परीक्षण मोबाइल नंबर स्वतः भरा गया" : "Simulated test number auto-filled",
                            "info"
                          );
                        }}
                        className="text-[11px] font-extrabold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-3 py-1.5 rounded-lg"
                      >
                        ⚡ {lang === "hi" ? "नंबर स्वतः भरें (Auto Fill)" : "Simulate Auto Phone Number"}
                      </button>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-between">
                    <button
                      onClick={() => {
                        playAudioTone("click");
                        setRegStep(2);
                      }}
                      className="border border-slate-200 text-slate-600 font-bold px-5 py-3 rounded-2xl text-sm"
                    >
                      {lang === "hi" ? "पीछे" : "Back"}
                    </button>
                    <button
                      onClick={() => {
                        playAudioTone("click");
                        if (!regMobile.trim() || regMobile.length < 10) {
                          showNotification(
                            lang === "hi" ? "कृपया 10 अंकों का संख्यात्मक नंबर डालें!" : "Please insert a valid 10-digit mobile number!",
                            "error"
                          );
                          return;
                        }
                        setRegStep(4);
                      }}
                      className="bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold px-6 py-3 rounded-2xl text-sm flex items-center space-x-1 shadow-sm transition active:scale-95"
                    >
                      <span>{lang === "hi" ? "आगे बढ़ें" : "Next Step"}</span>
                      <ArrowRight className="w-4 h-4 shrink-0" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: SKILL SELECTION WITH LARGEST VISUAL ICONS */}
              {regStep === 4 && (
                <div className="space-y-4">
                  <div className="text-center">
                    <span className="text-4xl">🛠️</span>
                    <h3 className="text-xl font-extrabold text-slate-800 leading-tight mt-2">
                      {lang === "hi" ? "आप क्या काम करते हैं? चुनें" : "Step 4: Select Your Skills"}
                    </h3>
                    <p className="text-slate-500 text-xs mt-1">
                      {lang === "hi"
                        ? "नीचे दिए गए बड़े चित्रों में से अपने सभी हुनर चुनें। आप एक से ज्यादा काम भी चुन सकते हैं।"
                        : "You can select multiple skills we support."}
                    </p>
                  </div>

                  {/* Gigantic Grid with simple taps */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[340px] overflow-y-auto p-1 bg-slate-50 rounded-2xl border border-slate-100">
                    {CATEGORIES.map((cat) => {
                      const isSelected = regSelectedSkills.includes(cat.id);
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => toggleRegSkill(cat.id)}
                          className={`p-3.5 rounded-2xl flex flex-col items-center justify-center text-center transition-all duration-200 relative ${
                            isSelected
                              ? "bg-emerald-600 text-white shadow-md ring-2 ring-emerald-400"
                              : "bg-white text-slate-700 border border-slate-200/80 hover:border-slate-300"
                          }`}
                        >
                          <div className={`text-3xl mb-2 ${isSelected ? "scale-110" : ""}`}>
                            {cat.id === "mason" && "🔨"}
                            {cat.id === "plumber" && "🚰"}
                            {cat.id === "electrician" && "⚡"}
                            {cat.id === "painter" && "🖌️"}
                            {cat.id === "carpenter" && "🪚"}
                            {cat.id === "ac_tech" && "❄️"}
                            {cat.id === "welder" && "🔥"}
                            {cat.id === "tile_worker" && "🧱"}
                            {cat.id === "digging" && "⛏️"}
                            {cat.id === "construction" && "👷"}
                            {cat.id === "driver" && "🚗"}
                            {cat.id === "guard" && "🛡️"}
                            {cat.id === "gardener" && "🌸"}
                            {cat.id === "helper" && "🤝"}
                            {cat.id === "vendor_lumber" && "🌲"}
                            {cat.id === "vendor_paint" && "🎨"}
                            {cat.id === "vendor_plumbing" && "🚰"}
                            {cat.id === "vendor_cement" && "🧱"}
                            {cat.id === "vendor_bricks" && "🟥"}
                            {cat.id === "vendor_steel" && "🔩"}
                            {cat.id === "vendor_clay_lime" && "🏺"}
                            {cat.id === "other" && "⚙️"}
                          </div>
                          
                          <div className="font-extrabold text-xs sm:text-sm leading-tight">
                            {lang === "hi" ? cat.name_hi : cat.name_en}
                          </div>

                          {isSelected && (
                            <span className="absolute top-1.5 right-1.5 bg-yellow-400 text-slate-900 rounded-full p-0.5">
                              <Check className="w-3.5 h-3.5" />
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {regSelectedSkills.includes("other") && (
                    <div className="bg-amber-50 p-3.5 rounded-2xl border border-amber-200 text-left space-y-1">
                      <label className="block text-[10px] font-extrabold text-[#FF4D00] uppercase">
                        {lang === "hi" ? "विशेष हुनर / सप्लायर सामान यहाँ लिखें" : "Specify custom skill/vendor products here"}
                      </label>
                      <input
                        type="text"
                        value={regCustomSkillText}
                        onChange={(e) => setRegCustomSkillText(e.target.value)}
                        placeholder={lang === "hi" ? "उदा. पीओपी फॉल्स सीलिंग, जिप्सम वर्क, पेंट सप्लायर" : "e.g., POP False Ceiling, Gypsum Work, Paint supplier"}
                        className="w-full bg-white border border-amber-300 focus:ring-2 focus:ring-[#FF4D00] rounded-xl py-2.5 px-3 text-xs font-bold text-slate-850 outline-none transition"
                      />
                    </div>
                  )}

                  <div className="pt-3 flex justify-between">
                    <button
                      onClick={() => {
                        playAudioTone("click");
                        setRegStep(3);
                      }}
                      className="border border-slate-200 text-slate-600 font-bold px-5 py-3 rounded-2xl text-sm"
                    >
                      {lang === "hi" ? "पीछे" : "Back"}
                    </button>
                    
                    <button
                      onClick={() => {
                        playAudioTone("click");
                        // If no category selected, automatically assign to "Others" (other)
                        if (regSelectedSkills.length === 0) {
                          setRegSelectedSkills(["other"]);
                        }
                        setRegStep(5);
                      }}
                      className="bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold px-6 py-3 rounded-2xl text-sm flex items-center space-x-1 shadow-sm transition active:scale-95"
                    >
                      <span>{lang === "hi" ? "आगे बढ़ें" : "Next Step"}</span>
                      <ArrowRight className="w-4 h-4 shrink-0" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 5: LOCATION SELECTION */}
              {regStep === 5 && (
                <div className="space-y-4">
                  <div className="text-center">
                    <span className="text-4xl">📍</span>
                    <h3 className="text-xl font-extrabold text-slate-800 leading-tight mt-2">
                      {lang === "hi" ? "अपना कार्य स्थान चुनें" : "Step 5: Where do you work?"}
                    </h3>
                    <p className="text-slate-500 text-xs mt-1">
                      {lang === "hi" 
                        ? "अपना सही शहर एवं इलाका चुनें ताकि स्थानीय ग्राहक आपको आसानी से ढूंढ सकें।"
                        : "Select your active city and local area neighborhood."}
                    </p>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/50 space-y-4">
                    
                    {/* City Selector */}
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">
                        {lang === "hi" ? "१. अपना शहर चुनें" : "1. Choose Your City"}
                      </label>
                      <select
                        value={regCity}
                        onChange={(e) => {
                          setRegCity(e.target.value);
                          // Default first area
                          const areas = INDIAN_CITIES.find(c => c.name_en === e.target.value)?.areas || [];
                          if (areas.length > 0) {
                            setRegArea(areas[0].name_en);
                          }
                          playAudioTone("click");
                        }}
                        className="w-full bg-white border border-slate-200 rounded-xl py-3.5 px-3 font-bold text-base focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                      >
                        {INDIAN_CITIES.map((c) => (
                          <option key={c.name_en} value={c.name_en}>
                            {lang === "hi" ? c.name_hi : c.name_en}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Area Neighborhood Selector */}
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">
                        {lang === "hi" ? "२. अपना निकटतम इलाका (Area)" : "2. Choose Nearest Area"}
                      </label>
                      <select
                        value={regArea}
                        onChange={(e) => {
                          setRegArea(e.target.value);
                          playAudioTone("click");
                        }}
                        className="w-full bg-white border border-slate-200 rounded-xl py-3.5 px-3 font-bold text-base focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                      >
                        {INDIAN_CITIES.find((c) => c.name_en === regCity)?.areas.map((a) => (
                          <option key={a.name_en} value={a.name_en}>
                            {lang === "hi" ? a.name_hi : a.name_en}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Brief physical address helper */}
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">
                        {lang === "hi" ? "३. पूरा पता / गली का नाम (वैकल्पिक)" : "3. Gali, Chowk or Address (Optional)"}
                      </label>
                      <input
                        type="text"
                        value={regAddress}
                        onChange={(e) => setRegAddress(e.target.value)}
                        placeholder={lang === "hi" ? "जैसे: हनुमान मंदिर के पास, गली नंबर २" : "e.g., Near Shiv Temple, Gali No. 4"}
                        className="w-full bg-white border border-slate-200 rounded-xl py-3 px-3 text-sm font-semibold focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                      />
                    </div>

                  </div>

                  <div className="pt-3 flex justify-between">
                    <button
                      onClick={() => {
                        playAudioTone("click");
                        setRegStep(4);
                      }}
                      className="border border-slate-200 text-slate-600 font-bold px-5 py-3 rounded-2xl text-sm"
                    >
                      {lang === "hi" ? "पीछे" : "Back"}
                    </button>
                    <button
                      onClick={() => {
                        playAudioTone("click");
                        setRegStep(6);
                      }}
                      className="bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold px-6 py-3 rounded-2xl text-sm flex items-center space-x-1 shadow-sm transition active:scale-95"
                    >
                      <span>{lang === "hi" ? "आखिरी कदम देखें" : "Review Details"}</span>
                      <ArrowRight className="w-4 h-4 shrink-0" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 6: REVIEW SUMMARY AND GREEN SUBMIT */}
              {regStep === 6 && (
                <form onSubmit={handleCompleteRegistration} className="space-y-4">
                  <div className="text-center">
                    <span className="text-4xl">🎉</span>
                    <h3 className="text-xl font-extrabold text-slate-800 leading-tight mt-2">
                      {lang === "hi" ? "सब जानकारी चेक करें!" : "Review and Publish Profile!"}
                    </h3>
                    <p className="text-slate-500 text-xs mt-1">
                      {lang === "hi" 
                        ? "यदि कुछ गलत है तो पीछे जाकर बदलें, नहीं तो नीचे दिया गया हरा बटन दबाएं।"
                        : "Almost done! Verify your details before going live."}
                    </p>
                  </div>

                  <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100 flex flex-col space-y-3.5">
                    
                    <div className="flex items-center space-x-3.5">
                      <img
                        src={regPhoto || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face"}
                        alt="Reg Preview"
                        className="w-14 h-14 rounded-xl object-cover shrink-0 border-2 border-emerald-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/pixel-art/svg?seed=${regName}`;
                        }}
                      />
                      <div>
                        <div className="text-[10px] text-emerald-800 font-bold uppercase tracking-wider">{lang === "hi" ? "कामगार का नाम" : "Worker Name"}</div>
                        <div className="text-lg font-bold text-slate-800">{regName || (lang == 'hi' ? '[खाली]' : '[Empty]')}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3.5 text-xs pt-2 border-t border-emerald-200">
                      <div>
                        <span className="block text-slate-500 font-bold">{lang === "hi" ? "📞 फ़ोन नंबर" : "Phone"}</span>
                        <span className="font-bold text-slate-800 text-sm">{regMobile}</span>
                      </div>
                      <div>
                        <span className="block text-slate-500 font-bold">{lang === "hi" ? "📍 स्थान देखें" : "Location"}</span>
                        <span className="font-bold text-emerald-800 text-sm">{regArea}, {regCity}</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-emerald-200">
                      <span className="block text-xs text-slate-500 font-bold mb-1">{lang === "hi" ? "चुना गया काम (Your Skills):" : "Selected Skills:"}</span>
                      <div className="flex flex-wrap gap-1">
                        {regSelectedSkills.map((sId) => {
                          const catObj = CATEGORIES.find(c => c.id === sId);
                          return (
                            <span key={sId} className="bg-emerald-600 text-white font-bold text-[11px] px-2.5 py-1 rounded-md">
                              {lang === "hi" ? catObj?.name_hi : catObj?.name_en}
                            </span>
                          );
                        })}
                      </div>
                    </div>

                    {regAddress && (
                      <div className="pt-2 border-t border-emerald-200 text-xs">
                        <span className="block text-slate-500 font-bold mb-0.5">{lang === "hi" ? "पूरा पता" : "Physical Address"}</span>
                        <span className="font-bold text-slate-700">{regAddress}</span>
                      </div>
                    )}

                  </div>

                  <div className="pt-4 flex justify-between space-x-2">
                    <button
                      type="button"
                      onClick={() => {
                        playAudioTone("click");
                        setRegStep(5);
                      }}
                      className="border border-slate-200 text-slate-600 font-bold px-4 py-3.5 rounded-2xl text-xs sm:text-sm"
                    >
                      {lang === "hi" ? "पीछे बदलें" : "Edit Info"}
                    </button>
                    
                    <button
                      type="submit"
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white font-extrabold text-sm sm:text-base py-3.5 px-6 rounded-2xl shadow-md transition active:scale-95 flex items-center justify-center space-x-2 border-2 border-green-500 animate-pulse"
                    >
                      <Check className="w-5 h-5 shrink-0" />
                      <span>{lang === "hi" ? "रजिस्टर करें (सबमिट)" : "Publish My Profile"}</span>
                    </button>
                  </div>
                </form>
              )}

            </motion.div>
          );
        })()}

          {/* TAB 3: ADMIN PANEL (MANAGEMENT SCREEN / ANALYTICS) */}
          {currentUser && activeTab === "admin" && (
            <motion.div
              key="admin-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="space-y-5"
            >
              <MasterAdminPanel
                lang={lang}
                workers={workers}
                setWorkers={setWorkers}
                jobs={jobs}
                setJobs={setJobs}
                assignments={assignments}
                setAssignments={setAssignments}
                profiles={profiles}
                setProfiles={setProfiles}
                loginRecords={loginRecords}
                setLoginRecords={setLoginRecords}
                announcements={announcements}
                setAnnouncements={setAnnouncements}
                supportTickets={supportTickets}
                setSupportTickets={setSupportTickets}
                auditLogs={auditLogs}
                setAuditLogs={setAuditLogs}
                sbUrl={sbUrl}
                sbKey={sbKey}
                sbStatus={sbStatus}
                sbErrorMsg={sbErrorMsg}
                syncWithSupabase={syncWithSupabase}
                dbTablesMissing={dbTablesMissing}
                showSqlSchema={showSqlSchema}
                setShowSqlSchema={setShowSqlSchema}
                SETUP_SQL_CODE={SETUP_SQL_CODE}
                handleToggleApprove={handleToggleApprove}
                handleVerifyWorker={handleVerifyWorker}
                handleDeleteWorker={handleDeleteWorker}
                setEditingWorker={setEditingWorker}
                handleToggleSuspendProfile={handleToggleSuspendProfile}
                handlePermanentDeleteProfile={handlePermanentDeleteProfile}
                handleEditProfileClick={handleEditProfileClick}
                handleToggleWorkerAvailabilityStatus={handleToggleWorkerAvailabilityStatus}
              />
            </motion.div>
          )}

        </AnimatePresence>

        {/* JOB ASSIGNMENT DIALOG OVERLAY */}
        {assigningWorker && (
          <div id="job-assign-modal" className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="bg-white rounded-3xl p-5 sm:p-6 w-full max-w-md border-4 border-[#2D2D2D] shadow-2xl space-y-4 text-left"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-black text-sm uppercase tracking-wider text-slate-800 flex items-center space-x-1.5">
                  <span>🤝</span>
                  <span>{lang === "hi" ? "कामगार को काम सौंपें" : "Assign Job to Worker"}</span>
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    playAudioTone("click");
                    setAssigningWorker(null);
                  }}
                  className="text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 p-1.5 rounded-lg transition shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="bg-[#FFF5F0] border-2 border-[#FFD8C2] rounded-2xl p-3 flex items-start space-x-3">
                <img
                  src={assigningWorker.photo}
                  alt={assigningWorker.name}
                  className="w-11 h-11 rounded-lg object-cover bg-slate-100 shrink-0"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/pixel-art/svg?seed=${assigningWorker.name}`;
                  }}
                />
                <div className="min-w-0">
                  <h4 className="font-extrabold text-[#FF4D00] text-sm truncate">{assigningWorker.name}</h4>
                  <div className="flex items-center space-x-1.5 text-xs text-slate-500 font-semibold mt-0.5">
                    <span className="truncate">📱 {assigningWorker.phone}</span>
                    <span>•</span>
                    <span className="truncate">📍 {assigningWorker.area}</span>
                  </div>
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {assigningWorker.skills.map(s => {
                      const matchedCat = CATEGORIES.find(c => c.id === s);
                      return (
                        <span key={s} className="bg-slate-200/60 text-slate-700 font-bold px-1.5 py-0.5 rounded text-[8px] uppercase tracking-wider">
                          {matchedCat ? (lang === "hi" ? matchedCat.name_hi : matchedCat.name_en) : s}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>

              <form onSubmit={handleAssignJobSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-1.5">
                    {lang === "hi" ? "काम चुनें (Select Job Category/Vacancy)" : "Select Job Vacancy"}
                  </label>
                  <select
                    required
                    value={selectedJobToAssign}
                    onChange={(e) => {
                      setSelectedJobToAssign(e.target.value);
                      playAudioTone("click");
                    }}
                    className="w-full bg-slate-50 border-2 border-slate-200 text-slate-800 rounded-xl py-2.5 px-3 text-xs sm:text-sm font-extrabold outline-none transition focus:border-blue-600"
                  >
                    <option value="">-- {lang === "hi" ? "एक काम चुनें" : "Select from list"} --</option>
                    
                    {/* Employer's active job vacancy listings */}
                    {jobs.filter(j => j.employerPhone === currentUser?.phone).map(j => (
                      <option key={j.id} value={j.id}>
                        📁 {lang === "hi" ? (j.title_hi || j.title) : j.title} (Wage: ₹{j.wages}/day)
                      </option>
                    ))}
                    
                    <option value="custom">✍️ {lang === "hi" ? "कोई अन्य नया काम लिखें (Custom Task Title)" : "Enter a custom job title"}</option>
                  </select>
                </div>

                {/* Custom job title input shown if custom option selected, or if the employer currently has no posted jobs */}
                {(!selectedJobToAssign || selectedJobToAssign === "custom" || jobs.filter(j => j.employerPhone === currentUser?.phone).length === 0) && (
                  <div>
                    <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-1.5">
                      {lang === "hi" ? "नए काम का शीर्षक (Custom Task Title)" : "Task Title / Description"}
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={60}
                      value={customJobToAssign}
                      onChange={(e) => setCustomJobToAssign(e.target.value)}
                      placeholder={lang === "hi" ? "उदा. आगरा फोर्ट पेंटिंग कार्य" : "e.g., Plastering work in Tajganj"}
                      className="w-full bg-slate-50 border-2 border-slate-200 focus:border-blue-600 focus:bg-white rounded-xl py-2.5 px-3 text-xs sm:text-sm font-extrabold text-slate-700 outline-none transition"
                    />
                  </div>
                )}

                <div className="pt-2 flex items-center justify-end space-x-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      playAudioTone("click");
                      setAssigningWorker(null);
                    }}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider rounded-xl transition cursor-pointer"
                  >
                    {lang === "hi" ? "रद्द करें" : "Cancel"}
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md transition active:scale-95 cursor-pointer"
                  >
                    🤝 {lang === "hi" ? "सौंपें (Confirm)" : "Assign Task"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* MASTER ADMIN PROFILE EDIT OVERLAY */}
        {editingProfile && (
          <div id="admin-profile-edit-modal" className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="bg-white rounded-3xl p-6 w-full max-w-md border-4 border-[#2D2D2D] shadow-2xl space-y-4 text-left font-semibold text-slate-800"
            >
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="font-black text-sm uppercase tracking-wider text-slate-800 flex items-center space-x-1.5">
                  <span>🛠️</span>
                  <span>{lang === "hi" ? "उपयोगकर्ता विवरण अधिभावी (Admin Control)" : "Administrative Override"}</span>
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    playAudioTone("click");
                    setEditingProfile(null);
                  }}
                  className="text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 p-1.5 rounded-lg transition shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveEditedProfile} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">
                    {lang === "hi" ? "नाम (User Name)" : "User Full Name"}
                  </label>
                  <input
                    type="text"
                    required
                    value={editProfileName}
                    onChange={(e) => setEditProfileName(e.target.value)}
                    className="w-full bg-slate-50 border-2 border-slate-200 focus:border-indigo-600 focus:bg-white rounded-xl py-2 px-3 text-xs sm:text-sm font-bold outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">
                    {lang === "hi" ? "फ़ोन नंबर (Unique Phone Key)" : "Phone Mapping (Key ID)"}
                  </label>
                  <input
                    type="text"
                    required
                    value={editProfilePhone}
                    onChange={(e) => setEditProfilePhone(e.target.value)}
                    className="w-full bg-slate-50 border-2 border-slate-200 focus:border-indigo-600 focus:bg-white rounded-xl py-2 px-3 text-xs sm:text-sm font-bold outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">
                    {lang === "hi" ? "नियुक्त भूमिका (System Role)" : "Platform Security Role mapping"}
                  </label>
                  <select
                    value={editProfileRole}
                    onChange={(e) => setEditProfileRole(e.target.value)}
                    className="w-full bg-slate-50 border-2 border-slate-200 text-slate-800 rounded-xl py-2 px-3 text-xs sm:text-sm font-bold outline-none transition focus:border-indigo-600"
                  >
                    <option value="laborer">👷 Daily Wage Builder (Laborer)</option>
                    <option value="employer">🏢 Landlord/boss (Employer)</option>
                    <option value="admin">🔒 High Security Administrator (Admin)</option>
                  </select>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => {
                      playAudioTone("click");
                      setEditingProfile(null);
                    }}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs uppercase tracking-wider rounded-xl transition cursor-pointer"
                  >
                    {lang === "hi" ? "रद्द करें" : "Cancel"}
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md transition active:scale-95 cursor-pointer"
                  >
                    💾 {lang === "hi" ? "सहेजें (Save)" : "Override Database"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

      </main>

      {/* Persistent Bilingual Footer explanation with help links */}
      <footer className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t-4 border-[#2D2D2D] py-3.5 px-4 shadow-lg">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs text-slate-500">
          <div className="flex items-center space-x-1.5 font-bold">
            <span className="text-[#FF4D00] font-extrabold text-sm animate-pulse">●</span>
            <span className="text-slate-800">{lang === "hi" ? "KAAM काम डिजिटल सर्विस लाइव" : "KAAM Service Live in Area"}</span>
          </div>

          {/* Dedicated Daily Stats matching Vibrant Palette theme */}
          <div className="flex items-center space-x-3 text-[10px] font-black text-[#FF4D00] uppercase tracking-wider bg-[#FFF0E6] px-3 py-1 rounded-full border border-[#FFD8C2] shadow-xs">
            <span>📈 {lang === "hi" ? "४,२९१ कामगार पंजीकृत" : "4,291 Workers Registered"}</span>
            <span className="opacity-50">•</span>
            <span>🤝 {lang === "hi" ? "१२,८५० लोगों का संपर्क" : "12,850 Connections"}</span>
          </div>
          
          <button
            onClick={() => {
              playAudioTone("click");
              setSelectedAreaFilter("");
              setSelectedSkillFilter("");
              setSelectedCityFilter("Agra");
              setSearchQuery("");
              setActiveTab("search");
              showNotification(
                lang === 'hi' ? "प्लेटफ़ॉर्म रीसेट किया गया" : "Platform state reset"
              );
              triggerVoiceGuidance(
                "प्लेटफ़ॉर्म रीसेट हो गया है। आप फिर से देख सकते हैं।",
                "Applet state has been refreshed. Explore listing database."
              );
            }}
            className="text-[11px] font-extrabold text-[#FF4D00] hover:underline"
          >
            🔄 {lang === "hi" ? "शुरू से शुरू करें" : "Reset App Views"}
          </button>
        </div>
      </footer>

    </div>
  );
}

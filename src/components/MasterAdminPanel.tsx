import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  Search, Trash2, Edit3, Plus, Check, Download, Briefcase, 
  Clock, Database, Shield, AlertCircle, HelpCircle, HardHat, 
  TrendingUp, Award, User, Settings, CheckCircle2, CheckCircle
} from "lucide-react";
import { Worker, Job, Assignment, UserProfile, SystemLoginRecord } from "../types";

export interface MasterAdminProps {
  lang: "hi" | "en";
  workers: Worker[];
  setWorkers: React.Dispatch<React.SetStateAction<Worker[]>>;
  jobs: Job[];
  setJobs: React.Dispatch<React.SetStateAction<Job[]>>;
  assignments: Assignment[];
  setAssignments: React.Dispatch<React.SetStateAction<Assignment[]>>;
  profiles: UserProfile[];
  setProfiles: React.Dispatch<React.SetStateAction<UserProfile[]>>;
  loginRecords: SystemLoginRecord[];
  setLoginRecords: React.Dispatch<React.SetStateAction<SystemLoginRecord[]>>;
  announcements: Array<{ id: string; title: string; message: string; target: string; timestamp: string; sender: string }>;
  setAnnouncements: React.Dispatch<React.SetStateAction<Array<{ id: string; title: string; message: string; target: string; timestamp: string; sender: string }>>>;
  supportTickets: Array<{ id: string; userPhone: string; userName: string; userRole: string; issue: string; status: "open" | "resolved"; responseText?: string; timestamp: string }>;
  setSupportTickets: React.Dispatch<React.SetStateAction<Array<{ id: string; userPhone: string; userName: string; userRole: string; issue: string; status: "open" | "resolved"; responseText?: string; timestamp: string }>>>;
  auditLogs: Array<{ id: string; action: string; timestamp: string; admin: string; category: string }>;
  setAuditLogs: React.Dispatch<React.SetStateAction<Array<{ id: string; action: string; timestamp: string; admin: string; category: string }>>>;
  
  sbUrl: string;
  sbKey: string;
  sbStatus: "disconnected" | "connected" | "error";
  sbErrorMsg: string;
  syncWithSupabase: (urlStr: string, keyStr: string, forceNotice?: boolean) => Promise<void>;
  dbTablesMissing: boolean;
  showSqlSchema: boolean;
  setShowSqlSchema: React.Dispatch<React.SetStateAction<boolean>>;
  SETUP_SQL_CODE: string;

  // Global triggers
  handleToggleApprove: (id: string) => void;
  handleVerifyWorker: (id: string) => void;
  handleDeleteWorker: (id: string) => void;
  setEditingWorker: React.Dispatch<React.SetStateAction<Worker | null>>;
  
  // Custom master profile triggers
  handleToggleSuspendProfile: (phone: string) => void;
  handlePermanentDeleteProfile: (phone: string) => void;
  handleEditProfileClick: (profile: UserProfile) => void;
  handleToggleWorkerAvailabilityStatus?: (id: string) => void;
}

export const MasterAdminPanel: React.FC<MasterAdminProps> = ({
  lang,
  workers,
  setWorkers,
  jobs,
  setJobs,
  assignments,
  setAssignments,
  profiles,
  setProfiles,
  loginRecords,
  setLoginRecords,
  announcements,
  setAnnouncements,
  supportTickets,
  setSupportTickets,
  auditLogs,
  setAuditLogs,
  sbUrl,
  sbKey,
  sbStatus,
  sbErrorMsg,
  syncWithSupabase,
  dbTablesMissing,
  showSqlSchema,
  setShowSqlSchema,
  SETUP_SQL_CODE,
  handleToggleApprove,
  handleVerifyWorker,
  handleDeleteWorker,
  setEditingWorker,
  handleToggleSuspendProfile,
  handlePermanentDeleteProfile,
  handleEditProfileClick,
  handleToggleWorkerAvailabilityStatus
}) => {
  const [adminSubTab, setAdminSubTab] = useState<"overview" | "workers" | "employers" | "assignments" | "announcements" | "support" | "audit">("overview");
  const [searchQuery, setSearchQuery] = useState("");
  
  // SVG Graphic trends configuration state
  const [trendTimescale, setTrendTimescale] = useState<"daily" | "weekly" | "monthly">("weekly");

  // Announcement fields
  const [annTitle, setAnnTitle] = useState("");
  const [annMessage, setAnnMessage] = useState("");
  const [annTarget, setAnnTarget] = useState<"all" | "laborers" | "employers">("all");

  // Support inputs
  const [activeTicketId, setActiveTicketId] = useState<string | null>(null);
  const [ticketReply, setTicketReply] = useState("");

  // Manual Task Assigner States
  const [adminAssignWorkerId, setAdminAssignWorkerId] = useState("");
  const [adminAssignJobId, setAdminAssignJobId] = useState("");
  const [adminCustomJobTitle, setAdminCustomJobTitle] = useState("");
  const [adminAssignEmployerName, setAdminAssignEmployerName] = useState("");
  const [adminAssignEmployerPhone, setAdminAssignEmployerPhone] = useState("");

  const playClickAudio = () => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "triangle";
      osc.frequency.setValueAtTime(1000, ctx.currentTime);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch (e) {}
  };

  const notify = (msg: string, isError = false) => {
    // Falls back silently since parents handle toasts. We will perform normal window notification if enabled
    console.log(`[Admin Notice] ${msg}`);
  };

  // CSV Exporter helper
  const handleExportCSV = (type: "profiles" | "workers" | "jobs" | "assignments" | "audit") => {
    playClickAudio();
    let headers: string[] = [];
    let rows: string[][] = [];
    let filename = `kaam_${type}_report_${new Date().toISOString().slice(0, 10)}.csv`;

    if (type === "profiles") {
      headers = ["phone", "name", "role", "lastLogin", "status"];
      rows = profiles.map(p => [p.phone, p.name, p.role, p.lastLogin || "", p.status || "active"]);
    } else if (type === "workers") {
      headers = ["id", "name", "phone", "skills", "city", "area", "rating", "isApproved", "isVerified"];
      rows = workers.map(w => [w.id, w.name, w.phone, JSON.stringify(w.skills), w.city || "", w.area || "", String(w.rating), String(w.isApproved), String(w.isVerified)]);
    } else if (type === "jobs") {
      headers = ["id", "employerName", "employerPhone", "title", "skillNeeded", "city", "wages", "status"];
      rows = jobs.map(j => [j.id, j.employerName || "", j.employerPhone || "", j.title, j.skillNeeded || "", j.city || "", j.dailyWage || "", j.status || ""]);
    } else if (type === "assignments") {
      headers = ["id", "jobId", "workerId", "workerName", "workerPhone", "employerName", "assignedAt", "status"];
      rows = assignments.map(a => [a.id, a.jobId || "custom", a.workerId || "", a.workerName || "", a.workerPhone || "", a.employerName || "", a.assignedAt || "", a.status || ""]);
    } else if (type === "audit") {
      headers = ["id", "action", "timestamp", "admin", "category"];
      rows = auditLogs.map(al => [al.id, al.action, al.timestamp, al.admin, al.category]);
    }

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(r => r.map(cell => `"${(cell || "").replace(/"/g, '""')}"`).join(","))].join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle support solution submission
  const handleResolveTicket = (ticketId: string) => {
    if (!ticketReply.trim()) return;
    playClickAudio();
    setSupportTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        // Log action
        const newAudit = {
          id: "audit-" + Date.now(),
          action: `Resolved client ticket #${ticketId} response: "${ticketReply.substring(0, 30)}..."`,
          timestamp: new Date().toISOString(),
          admin: "Master Admin Office",
          category: "system"
        };
        setAuditLogs(al => [newAudit, ...al]);

        return {
          ...t,
          status: "resolved",
          responseText: ticketReply
        };
      }
      return t;
    }));
    setTicketReply("");
    setActiveTicketId(null);
  };

  // Handle broadcast message addition
  const handleBroadcastAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle.trim() || !annMessage.trim()) return;
    playClickAudio();

    const newAnn = {
      id: "ann-" + Date.now(),
      title: annTitle,
      message: annMessage,
      target: annTarget,
      timestamp: new Date().toISOString(),
      sender: "Master Admin"
    };

    setAnnouncements(prev => [newAnn, ...prev]);

    // Audit log dispatch action
    const newAudit = {
      id: "audit-" + Date.now(),
      action: `Broadcast Announcement to ${annTarget}: "${annTitle}"`,
      timestamp: new Date().toISOString(),
      admin: "Master Admin Office",
      category: "system"
    };
    setAuditLogs(prev => [newAudit, ...prev]);

    setAnnTitle("");
    setAnnMessage("");
    notify("Broadcast dispatch active!");
  };

  // Helper values
  const totalProfilesCount = profiles.length;
  const laborersCount = profiles.filter(p => p.role === "laborer").length;
  const employersCount = profiles.filter(p => p.role === "employer").length;
  const suspendedCount = profiles.filter(p => p.status === "suspended").length;

  // Chart data calculations
  const trendData = trendTimescale === "daily" 
    ? [ { label: "Mon", laborers: 2, employers: 1 }, { label: "Tue", laborers: 4, employers: 3 }, { label: "Wed", laborers: 7, employers: 5 }, { label: "Thu", laborers: 9, employers: 6 }, { label: "Fri", laborers: 12, employers: 8 }, { label: "Sat", laborers: 15, employers: 9 }, { label: "Sun", laborers: 18, employers: 11 } ]
    : trendTimescale === "weekly"
    ? [ { label: "Week 1", laborers: 10, employers: 5 }, { label: "Week 2", laborers: 22, employers: 11 }, { label: "Week 3", laborers: 35, employers: 18 }, { label: "Week 4", laborers: 56, employers: 24 } ]
    : [ { label: "March", laborers: 40, employers: 20 }, { label: "April", laborers: 90, employers: 42 }, { label: "May", laborers: 160, employers: 78 }, { label: "June", laborers: 240, employers: 112 } ];

  return (
    <div className="space-y-6 text-slate-800">
      
      {/* Dynamic Sub-tab System Navigation rail */}
      <div className="bg-white rounded-2xl border-4 border-[#2D2D2D] p-2 flex flex-wrap gap-1.5 shadow-md">
        <button
          type="button"
          onClick={() => { playClickAudio(); setAdminSubTab("overview"); }}
          className={`flex-1 min-w-[100px] text-center px-3 py-2.5 rounded-xl text-xs sm:text-xs font-black uppercase tracking-wider transition-all duration-150 flex items-center justify-center space-x-1 cursor-pointer ${
            adminSubTab === "overview"
              ? "bg-[#2D2D2D] text-white"
              : "bg-slate-50 text-slate-700 hover:bg-slate-100"
          }`}
        >
          <span>📊</span>
          <span>{lang === "hi" ? "डैशबोर्ड" : "Dashboard"}</span>
        </button>

        <button
          type="button"
          onClick={() => { playClickAudio(); setAdminSubTab("workers"); }}
          className={`flex-1 min-w-[100px] text-center px-3 py-2.5 rounded-xl text-xs sm:text-xs font-black uppercase tracking-wider transition-all duration-150 flex items-center justify-center space-x-1 cursor-pointer ${
            adminSubTab === "workers"
              ? "bg-[#2D2D2D] text-white"
              : "bg-slate-50 text-slate-700 hover:bg-slate-100"
          }`}
        >
          <span>👷</span>
          <span>{lang === "hi" ? "कामगार सूची" : "Kaamgars"}</span>
        </button>

        <button
          type="button"
          onClick={() => { playClickAudio(); setAdminSubTab("employers"); }}
          className={`flex-1 min-w-[100px] text-center px-3 py-2.5 rounded-xl text-xs sm:text-xs font-black uppercase tracking-wider transition-all duration-150 flex items-center justify-center space-x-1 cursor-pointer ${
            adminSubTab === "employers"
              ? "bg-[#2D2D2D] text-white"
              : "bg-slate-50 text-slate-700 hover:bg-slate-100"
          }`}
        >
          <span>🏢</span>
          <span>{lang === "hi" ? "मालिक सूची" : "Employers"}</span>
        </button>

        <button
          type="button"
          onClick={() => { playClickAudio(); setAdminSubTab("assignments"); }}
          className={`flex-1 min-w-[100px] text-center px-3 py-2.5 rounded-xl text-xs sm:text-xs font-black uppercase tracking-wider transition-all duration-150 flex items-center justify-center space-x-1 cursor-pointer ${
            adminSubTab === "assignments"
              ? "bg-[#2D2D2D] text-white"
              : "bg-slate-50 text-slate-700 hover:bg-slate-100"
          }`}
        >
          <span>🤝</span>
          <span>{lang === "hi" ? "कार्य आवंटन " : "Matches"}</span>
        </button>

        <button
          type="button"
          onClick={() => { playClickAudio(); setAdminSubTab("announcements"); }}
          className={`flex-1 min-w-[100px] text-center px-3 py-2.5 rounded-xl text-xs sm:text-xs font-black uppercase tracking-wider transition-all duration-150 flex items-center justify-center space-x-1 cursor-pointer ${
            adminSubTab === "announcements"
              ? "bg-[#2D2D2D] text-white"
              : "bg-slate-50 text-slate-700 hover:bg-slate-100"
          }`}
        >
          <span>📢</span>
          <span>{lang === "hi" ? "विज्ञप्ति" : "Broadcasts"}</span>
        </button>

        <button
          type="button"
          onClick={() => { playClickAudio(); setAdminSubTab("support"); }}
          className={`flex-1 min-w-[100px] text-center px-3 py-2.5 rounded-xl text-xs sm:text-xs font-black uppercase tracking-wider transition-all duration-150 flex items-center justify-center space-x-1 cursor-pointer ${
            adminSubTab === "support"
              ? "bg-[#2D2D2D] text-white"
              : "bg-slate-50 text-slate-700 hover:bg-slate-100"
          }`}
        >
          <span>💬</span>
          <span>{lang === "hi" ? "शिकायतें" : "Support"}</span>
        </button>

        <button
          type="button"
          onClick={() => { playClickAudio(); setAdminSubTab("audit"); }}
          className={`flex-1 min-w-[100px] text-center px-3 py-2.5 rounded-xl text-xs sm:text-xs font-black uppercase tracking-wider transition-all duration-150 flex items-center justify-center space-x-1 cursor-pointer ${
            adminSubTab === "audit"
              ? "bg-[#2D2D2D] text-white"
              : "bg-slate-50 text-slate-700 hover:bg-slate-100"
          }`}
        >
          <span>🛡️</span>
          <span>{lang === "hi" ? "सुरक्षा लॉग" : "Audit Logs"}</span>
        </button>
      </div>

      {/* --- SUBVIEW 1: OVERVIEW & GROWTH ANALYTICS GRAPH (डैशबोर्ड) --- */}
      {adminSubTab === "overview" && (
        <div className="space-y-6">
          
          {/* Top Scoreboard Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl border-4 border-[#2D2D2D] shadow-sm">
              <span className="text-[10px] uppercase font-black text-slate-400 block tracking-wider">
                👥 {lang === "hi" ? "कुल पंजीकृत उपयोगकरता" : "Total Users profiles"}
              </span>
              <span className="text-3xl font-black text-[#2D2D2D] block mt-1">{totalProfilesCount}</span>
              <span className="text-[10px] text-slate-500 font-bold block mt-1">
                👷 {laborersCount} {lang === "hi" ? "मजदूर" : "Kaamgars"} • 🏢 {employersCount} {lang === "hi" ? "मालिक" : "Employers"}
              </span>
            </div>

            <div className="bg-white p-4 rounded-2xl border-4 border-[#2D2D2D] shadow-sm">
              <span className="text-[10px] uppercase font-black text-emerald-600 block tracking-wider">
                📡 {lang === "hi" ? "सक्रिय कामगार सूची" : "Listed Kaamgars"}
              </span>
              <span className="text-3xl font-black text-emerald-600 block mt-1">{workers.length}</span>
              <span className="text-[10px] text-slate-500 font-bold block mt-1">
                ✔️ {workers.filter(w => w.isApproved).length} {lang === "hi" ? "मंजूर" : "Approved"}
              </span>
            </div>

            <div className="bg-white p-4 rounded-2xl border-4 border-[#2D2D2D] shadow-sm">
              <span className="text-[10px] uppercase font-black text-indigo-600 block tracking-wider">
                🤝 {lang === "hi" ? "सफल कार्य आवंटन" : "Completed Assignments"}
              </span>
              <span className="text-3xl font-black text-indigo-600 block mt-1">{assignments.length}</span>
              <span className="text-[10px] text-slate-500 font-bold block mt-1">
                💼 {jobs.length} {lang === "hi" ? "कुल पोस्टेड काम" : "Total Posted Jobs"}
              </span>
            </div>

            <div className="bg-white p-4 rounded-2xl border-4 border-[#2D2D2D] shadow-sm">
              <span className="text-[10px] uppercase font-black text-red-500 block tracking-wider">
                🔒 {lang === "hi" ? "निलंबित खाते (Suspended)" : "Suspended Accounts"}
              </span>
              <span className="text-3xl font-black text-red-500 block mt-1">{suspendedCount}</span>
              <span className="text-[10px] text-slate-500 font-bold block mt-1">
                🔒 {lang === "hi" ? "सुरक्षा कारणों से बंद" : "Locked profiles"}
              </span>
            </div>
          </div>

          {/* Real-time Interactive SVG Platform Growth Trend Graph & Active users panel */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Bento Grid: Registration growth Curve */}
            <div className="bg-white rounded-3xl border-4 border-[#2D2D2D] p-5 shadow-sm md:col-span-2 text-left">
              <div className="flex items-center justify-between border-b pb-3.5 mb-4">
                <div>
                  <h3 className="text-base font-black tracking-tight flex items-center space-x-1.5 text-slate-800">
                    <TrendingUp className="w-5 h-5 text-indigo-600 shrink-0" />
                    <span>{lang === "hi" ? "प्लेटफ़ॉर्म ग्रोथ लाइव ट्रैकिंग (User Growth Trends)" : "Platform Growth Live Curve"}</span>
                  </h3>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase mt-0.5 tracking-wider">
                    {lang === "hi" ? "सुपाबेस प्रोफाइल एवं दैनिक सक्रियता वक्र" : "Real time registration rate and growth matrix"}
                  </p>
                </div>

                <div className="flex bg-slate-100 p-1 rounded-xl">
                  {(["daily", "weekly", "monthly"] as const).map(timescale => (
                    <button
                      key={timescale}
                      onClick={() => { playClickAudio(); setTrendTimescale(timescale); }}
                      className={`px-2.5 py-1 text-[10px] font-black uppercase rounded-lg transition-all ${
                        trendTimescale === timescale
                          ? "bg-white text-slate-800 shadow-xs"
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      {timescale === "daily" ? (lang === "hi" ? "दैनिक" : "Daily") : timescale === "weekly" ? (lang === "hi" ? "साप्ताहिक" : "Weekly") : (lang === "hi" ? "मासिक" : "Monthly")}
                    </button>
                  ))}
                </div>
              </div>

              {/* Vector SVG Line Chart illustration */}
              <div className="relative h-64 w-full bg-slate-50 rounded-2xl flex flex-col justify-between p-4 overflow-hidden border-2 border-dashed border-slate-200">
                
                {/* Visual grid lines */}
                <div className="absolute inset-x-0 top-1/4 border-b border-slate-100"></div>
                <div className="absolute inset-x-0 top-2/4 border-b border-slate-100"></div>
                <div className="absolute inset-x-0 top-3/4 border-b border-slate-100"></div>

                {/* Legend indicator */}
                <div className="flex items-center space-x-4 text-[10px] font-bold z-10">
                  <div className="flex items-center space-x-1.5">
                    <span className="w-3 h-1.5 bg-emerald-500 rounded"></span>
                    <span>👷 {lang === "hi" ? "कामगार पंजीयन" : "Kaamgars (Green)"}</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <span className="w-3 h-1.5 bg-[#FF4D00] rounded"></span>
                    <span>🏢 {lang === "hi" ? "नियोक्ता पंजीयन" : "Employers (Orange)"}</span>
                  </div>
                </div>

                {/* SVG Curves Container */}
                <svg className="absolute inset-0 w-full h-full p-4 pointer-events-auto" viewBox="0 0 100 100" preserveAspectRatio="none">
                  {/* Laborers curve line */}
                  <path
                    d={
                      trendTimescale === "daily"
                        ? "M 5 95 C 20 80, 40 60, 50 50 C 60 40, 80 20, 95 10"
                        : trendTimescale === "weekly"
                        ? "M 5 90 C 30 75, 45 40, 65 30 C 75 25, 90 20, 95 5"
                        : "M 5 95 C 40 85, 55 50, 75 35 C 80 30, 90 20, 95 5"
                    }
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                  {/* Employers curve line */}
                  <path
                    d={
                      trendTimescale === "daily"
                        ? "M 5 95 C 15 90, 35 75, 50 70 C 60 65, 80 40, 95 25"
                        : trendTimescale === "weekly"
                        ? "M 5 95 C 25 85, 45 70, 65 55 C 75 50, 90 40, 95 20"
                        : "M 5 95 C 30 90, 50 80, 70 65 C 80 55, 90 45, 95 20"
                    }
                    fill="none"
                    stroke="#FF4D00"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                </svg>

                {/* X Axis label timeline */}
                <div className="flex justify-between items-end text-[9px] text-slate-400 font-mono font-black border-t border-slate-200 pt-1.5 z-10 bg-slate-50">
                  {trendData.map(item => (
                    <span key={item.label}>{item.label}</span>
                  ))}
                </div>

              </div>
              
              <div className="mt-3.5 flex flex-wrap gap-2.5 items-center justify-between text-xs font-semibold text-slate-500 bg-slate-50/50 p-3 rounded-xl border">
                <span>📊 {lang === "hi" ? "पंजीकरण दर: +१५% पिछले ७ दिनों में" : "Pace of signups: +15% over last 7 days"}</span>
                <button
                  onClick={() => handleExportCSV("profiles")}
                  className="text-[10px] font-black uppercase text-indigo-600 flex items-center space-x-1 hover:underline cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{lang === "hi" ? "उपयोगकर्ता शीट CSV डाउनलोड करें" : "Export profiles spreadsheet"}</span>
                </button>
              </div>

            </div>

            {/* Live Online Users audit trace panel */}
            <div className="bg-white rounded-3xl border-4 border-[#2D2D2D] p-5 shadow-sm text-left flex flex-col justify-between">
              <div>
                <div className="border-b pb-3.5 mb-3.5">
                  <h3 className="text-base font-black tracking-tight flex items-center space-x-1.5 text-slate-800">
                    <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping shrink-0"></span>
                    <span>{lang === "hi" ? "दैनिक सक्रिय सदस्य" : "Online Users Monitor"}</span>
                  </h3>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase mt-0.5 tracking-wider">
                    {lang === "hi" ? "हाल ही में लॉगिन करने वाले" : "Estimated actively synced profiles online"}
                  </p>
                </div>

                <div className="space-y-3 max-h-[180px] overflow-y-auto pr-1">
                  {profiles.slice(0, 5).map((p, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <div className="flex items-center space-x-2.5">
                        <span className="text-lg">{p.role === "laborer" ? "👷" : "🏢"}</span>
                        <div className="min-w-0">
                          <h4 className="text-[11px] font-extrabold truncate text-slate-700 leading-none">{p.name}</h4>
                          <span className="text-[9px] text-slate-400 font-mono italic">{p.role === "laborer" ? (lang === "hi" ? "कामगार" : "Builder") : (lang === "hi" ? "मालिक" : "Owner")} • {p.phone.slice(0, 5)}...</span>
                        </div>
                      </div>
                      <span className="text-[8px] font-mono tracking-widest text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded uppercase font-black whitespace-nowrap">
                        ● Live Syncing
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3.5 border-t border-slate-100">
                <button
                  onClick={() => { playClickAudio(); setAdminSubTab("audit"); }}
                  className="w-full text-center text-[10px] text-indigo-600 hover:text-indigo-800 font-black uppercase tracking-wider flex items-center justify-center space-x-1 hover:underline cursor-pointer"
                >
                  <span>🛡️ View Active System Logs</span>
                </button>
              </div>

            </div>

          </div>

          {/* Connected database & setup SQL dashboard */}
          <div className="bg-[#FAF9F6] border-4 border-[#2D2D2D] rounded-3xl p-5 shadow-sm text-left">
            <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between border-b pb-4 mb-4 gap-3">
              <div>
                <h3 className="text-base font-black tracking-tight text-slate-800 flex items-center space-x-2">
                  <Database className="w-5 h-5 text-emerald-600" />
                  <span>{lang === "hi" ? "सुपाबेस क्लाउड डाटाबेस मॉनिटर" : "Supabase Live Connection & Status"}</span>
                </h3>
                <p className="text-[10px] font-bold text-slate-400 mt-0.5 uppercase tracking-wider flex items-center space-x-1.5">
                  <span>URL: <span className="font-mono text-indigo-600 text-[11px]">{sbUrl}</span></span>
                </p>
              </div>
              
              <div className="flex items-center space-x-1.5">
                {sbStatus === "connected" ? (
                  <span className="px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-black uppercase border-2 border-emerald-500 rounded-full flex items-center space-x-1">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse mr-1"></span>
                    <span>{lang === "hi" ? "लाइव सिंक: कनेक्टेड" : "Live DB: Connected"}</span>
                  </span>
                ) : sbStatus === "error" ? (
                  <span className="px-3 py-1.5 bg-red-50 text-red-600 text-xs font-black uppercase border-2 border-red-500 rounded-full flex items-center space-x-1">
                    <span>⚠️</span>
                    <span>{lang === "hi" ? "सिंक असफल (Failed)" : "Sync Failed"}</span>
                  </span>
                ) : (
                  <span className="px-3 py-1.5 bg-slate-100 text-slate-500 text-xs font-black uppercase border rounded-full flex items-center space-x-1">
                    <span>●</span>
                    <span>{lang === "hi" ? "डिस्कनेक्टेड" : "Offline Storage Only"}</span>
                  </span>
                )}

                <button
                  onClick={() => syncWithSupabase(sbUrl, sbKey, true)}
                  className="px-3.5 py-1.5 bg-[#2D2D2D] text-white hover:bg-slate-800 text-xs font-black uppercase rounded-xl shadow-xs transition ml-2 cursor-pointer"
                >
                  🔄 Force Sync
                </button>
              </div>
            </div>

            {sbErrorMsg && (
              <div className="bg-red-50 border-2 border-red-100 p-3 rounded-2xl mb-4 text-xs font-semibold text-red-700 flex items-start space-x-2 animate-bounce">
                <span>🚨</span>
                <div>
                  <h4 className="font-extrabold text-[11px] text-red-800 uppercase tracking-wide mb-0.5">Database Error Registered</h4>
                  <p>{sbErrorMsg}</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-2xl border-2 border-slate-200 text-slate-600 text-xs font-semibold space-y-2">
                <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">💾 Connected tables registry state</h4>
                <div className="grid grid-cols-2 gap-2 text-[10px] font-mono uppercase bg-slate-50 p-2 rounded-xl">
                  <div className="flex justify-between border-b pb-1">
                    <span>workers table:</span>
                    <span className="font-black text-emerald-600">ONLINE</span>
                  </div>
                  <div className="flex justify-between border-b pb-1">
                    <span>jobs table:</span>
                    <span className="font-black text-emerald-600">ONLINE</span>
                  </div>
                  <div className="flex justify-between border-b pb-1">
                    <span>assignments table:</span>
                    <span className="font-black text-emerald-600">ONLINE</span>
                  </div>
                  <div className="flex justify-between border-b pb-1">
                    <span>profiles:</span>
                    <span className="font-black text-emerald-600">ONLINE</span>
                  </div>
                  <div className="flex justify-between col-span-2">
                    <span>login_records table:</span>
                    <span className="font-black text-indigo-600">SYNCCED</span>
                  </div>
                </div>
                <p className="text-[10px] text-slate-400 mt-1.5 leading-relaxed">
                  * Live status displays the synchronization mapping connected index. If your connection status fails, you may need to apply database rules via the SQL panel.
                </p>
              </div>

              <div className="bg-white p-4 rounded-2xl border-2 border-slate-200 text-slate-700 text-xs font-semibold flex flex-col justify-between">
                <div>
                  <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">🛠️ SQL Blueprint setup rule code</h4>
                  <p className="text-slate-500 text-[11px] leading-relaxed mt-1">
                    If tables do not exist in your Supabase schema cache, click below to toggle SQL blueprint code, copy it, and paste it into the Supabase SQL editor workspace.
                  </p>
                </div>
                
                <div className="pt-3">
                  <button
                    onClick={() => { playClickAudio(); setShowSqlSchema(!showSqlSchema); }}
                    className="w-full text-center py-2.5 bg-orange-50 border-2 border-orange-200 text-[#FF4D00] font-black text-xs uppercase tracking-wider rounded-xl hover:bg-orange-100/50 transition cursor-pointer"
                  >
                    📝 {showSqlSchema ? (lang === "hi" ? "SQL कोड विवरण छुपाएं" : "Collapse SQL blueprint") : (lang === "hi" ? "SQL ब्लूप्रिंट कोड देखें" : "View SQL schema blueprint")}
                  </button>
                </div>
              </div>
            </div>

            {showSqlSchema && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 bg-slate-900 text-slate-100 rounded-2xl border-4 border-slate-800 relative"
              >
                <div className="absolute right-4 top-4 flex space-x-2">
                  <button
                    onClick={() => {
                      playClickAudio();
                      navigator.clipboard.writeText(SETUP_SQL_CODE);
                      notify("SQL Schema Copied!");
                    }}
                    className="p-1 px-3 bg-slate-800 hover:bg-slate-700 text-slate-100 text-[9px] font-bold uppercase rounded-lg border border-slate-700 cursor-pointer"
                  >
                    Copy Rules Code
                  </button>
                </div>
                <pre className="text-[9px] sm:text-[10px] font-mono leading-relaxed overflow-x-auto max-h-[220px] whitespace-pre-wrap text-emerald-400">
                  {SETUP_SQL_CODE}
                </pre>
              </motion.div>
            )}

          </div>

        </div>
      )}

      {/* --- SUBVIEW 2: KAAMGAR REGISTRY (कामगारों का विवरण) --- */}
      {adminSubTab === "workers" && (
        <div className="bg-white rounded-3xl border-4 border-[#2D2D2D] p-5 shadow-sm space-y-4 text-left">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b pb-3.5">
            <div>
              <h3 className="text-base font-black flex items-center space-x-1.5">
                <span>👷</span>
                <span>{lang === "hi" ? "कामगार पंजीयन रिकॉर्ड्स (Kaamgar Registry)" : "Agra Laborers & Kaamgars Registry"}</span>
              </h3>
              <p className="text-slate-400 font-semibold text-[10px] uppercase tracking-wider mt-0.5">
                {lang === "hi" ? "काम ढूंढने के लिए लिस्टेड मजदूर व राजमिस्त्री" : "Approve, verify, suspend or modify builder metadata"}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleExportCSV("workers")}
                className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs uppercase tracking-wider rounded-xl transition flex items-center space-x-1 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{lang === "hi" ? "CSV एक्सपोर्ट" : "Export Excel CSV"}</span>
              </button>
              
              <button 
                onClick={() => {
                  playClickAudio();
                  // Trigger parent worker formulation if needed. We can trigger demo registration index
                  const triggerReg = document.getElementById("tab-btn-register") || document.getElementById("tab-register");
                  if (triggerReg) triggerReg.click();
                  notify("Redirecting to registering panel...");
                }}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider rounded-xl transition flex items-center space-x-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{lang === "hi" ? "नया जोड़ें" : "Add New Worker"}</span>
              </button>
            </div>
          </div>

          {/* Quick inline search bar */}
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={lang === "hi" ? "नाम या फोन से खोजें..." : "Filter kaamgars by name, phone or skill..."}
              className="h-11 w-full bg-slate-50 border-2 border-slate-200 focus:border-blue-600 focus:bg-white rounded-xl py-2 pl-10 pr-3 text-xs sm:text-sm font-semibold text-slate-700 outline-none transition"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="py-3 px-3">{lang === "hi" ? "फोटो" : "Face"}</th>
                  <th className="py-3 px-2">{lang === "hi" ? "विवरण" : "Kaamgar profile info"}</th>
                  <th className="py-3 px-2">{lang === "hi" ? "इलाका (Area)" : "Location area"}</th>
                  <th className="py-3 px-2">{lang === "hi" ? "हुनर (Skills)" : "Specialized category"}</th>
                  <th className="py-3 px-2 text-center">{lang === "hi" ? "मंजूरी / सयापन" : "Approve / Badge"}</th>
                  <th className="py-3 px-2 text-center">{lang === "hi" ? "उपलब्धता" : "Availability"}</th>
                  <th className="py-3 px-2 text-center">{lang === "hi" ? "स्थिति" : "Lock Status"}</th>
                  <th className="py-3 px-3 text-right">{lang === "hi" ? "कार्रवाई" : "Actions control"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                {workers
                  .filter(w => {
                    const term = searchQuery.toLowerCase();
                    return w.name.toLowerCase().includes(term) || w.phone.includes(term) || w.area.toLowerCase().includes(term);
                  })
                  .map(w => {
                    const matchProfStatus = profiles.find(p => p.phone === w.phone)?.status || "active";
                    return (
                      <tr key={w.id} className="hover:bg-slate-50/50">
                        <td className="py-3 px-3">
                          <img
                            src={w.photo}
                            alt={w.name}
                            className="w-10 h-10 rounded-lg object-cover bg-slate-100"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/pixel-art/svg?seed=${w.name}`;
                            }}
                          />
                        </td>
                        
                        <td className="py-3 px-2">
                          <span className="block font-extrabold text-slate-800 text-sm">{w.name}</span>
                          <span className="block text-[10px] text-slate-400 font-mono italic">ID: {w.id} • Phone: {w.phone}</span>
                        </td>
                        
                        <td className="py-3 px-2">
                          <span className="block font-bold">{w.area}</span>
                          <span className="block text-[10px] text-slate-400 font-mono">{w.city}</span>
                        </td>
                        
                        <td className="py-3 px-2">
                          <div className="flex flex-wrap gap-1">
                            {w.skills.map(s => (
                              <span key={s} className="bg-slate-100 text-slate-600 text-[8px] font-bold uppercase py-0.5 px-1.5 rounded border">
                                {s.replace("_", " ")}
                              </span>
                            ))}
                          </div>
                        </td>

                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center space-x-1.5">
                            {/* Toggle Approval checkbox */}
                            <button
                              onClick={() => handleToggleApprove(w.id)}
                              className={`p-1.5 rounded-lg border font-black text-[9px] uppercase tracking-wider cursor-pointer ${
                                w.isApproved 
                                  ? "bg-emerald-50 border-emerald-300 text-emerald-700" 
                                  : "bg-red-50 border-red-200 text-red-600 animate-pulse"
                              }`}
                              title={w.isApproved ? "Approved profile" : "Unapproved profile"}
                            >
                              {w.isApproved ? "Approved ✔️" : "Pending ⚠️"}
                            </button>

                            {/* Toggle Verification star badge */}
                            <button
                              onClick={() => handleVerifyWorker(w.id)}
                              className={`p-1.5 rounded-lg border font-black text-[9px] uppercase tracking-wider cursor-pointer ${
                                w.isVerified 
                                  ? "bg-blue-50 border-blue-300 text-blue-700 shadow-xs" 
                                  : "bg-slate-50 border-slate-200 text-slate-400"
                              }`}
                              title={w.isVerified ? "Gold Star verified kaamgar badge is active" : "Verify builder profile and load gold badge"}
                            >
                              ⭐ {w.isVerified ? "Gold badge" : "Add badge"}
                            </button>
                          </div>
                        </td>

                        <td className="py-3 px-2 text-center">
                          <button
                            onClick={() => {
                              if (handleToggleWorkerAvailabilityStatus) {
                                handleToggleWorkerAvailabilityStatus(w.id);
                              } else {
                                setWorkers(prev => prev.map(worker => {
                                  if (worker.id === w.id) {
                                    const nextStatus = worker.status === "busy" ? "available" : "busy";
                                    return { ...worker, status: nextStatus };
                                  }
                                  return worker;
                                }));
                              }
                            }}
                            className={`p-2 rounded-xl border text-[9px] font-extrabold uppercase tracking-wider cursor-pointer transition ${
                              w.status === "busy" 
                                ? "bg-red-50 border-red-200 text-red-600" 
                                : "bg-emerald-50 border-emerald-200 text-emerald-800"
                            }`}
                          >
                            {w.status === "busy" 
                              ? (lang === "hi" ? "🔴 व्यस्त (Busy)" : "🔴 Busy") 
                              : (lang === "hi" ? "🟢 खाली (Available)" : "🟢 Available")}
                          </button>
                        </td>

                        <td className="py-3 px-2 text-center">
                          <button
                            onClick={() => handleToggleSuspendProfile(w.phone)}
                            className={`p-1.5 rounded-lg border text-[9px] font-black uppercase tracking-wider cursor-pointer ${
                              matchProfStatus === "suspended"
                                ? "bg-red-100 border-red-300 text-red-700 font-extrabold"
                                : "bg-emerald-100 border-emerald-200 text-emerald-800"
                            }`}
                          >
                            {matchProfStatus === "suspended" ? "🔒 LOCKED (Suspended)" : "✔️ ACTIVE"}
                          </button>
                        </td>

                        <td className="py-3 px-3 text-right">
                          <div className="flex items-center justify-end space-x-1.5">
                            <button
                              onClick={() => {
                                playClickAudio();
                                const profileToEdit = profiles.find(p => p.phone === w.phone);
                                if (profileToEdit) {
                                  handleEditProfileClick(profileToEdit);
                                } else {
                                  setEditingWorker(w);
                                }
                              }}
                              className="p-1.5 rounded-lg border bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 cursor-pointer"
                              title={lang === "hi" ? "बदलें" : "Edit Profile details"}
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => {
                                playClickAudio();
                                handlePermanentDeleteProfile(w.phone);
                              }}
                              className="p-1.5 rounded-lg border bg-red-50 border-red-200 text-red-600 hover:bg-red-100 cursor-pointer"
                              title={lang === "hi" ? "हटाएं" : "Delete profile database entries"}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- SUBVIEW 3: EMPLOYER SHEET (ठेकेदार और मालिक) --- */}
      {adminSubTab === "employers" && (
        <div className="bg-white rounded-3xl border-4 border-[#2D2D2D] p-5 shadow-sm space-y-4 text-left">
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b pb-3.5">
            <div>
              <h3 className="text-base font-black flex items-center space-x-1.5">
                <span>🏢</span>
                <span>{lang === "hi" ? "नियोक्ता और मालिक पंजीयन शीट (Employer Sheets)" : "Agra Employers & Maliks database"}</span>
              </h3>
              <p className="text-slate-400 font-semibold text-[10px] uppercase tracking-wider mt-0.5">
                {lang === "hi" ? "काम पोस्ट करने वाले और मजदूरों को काम सौंपने वाले उपयोगकर्ता" : "View active jobs posted, toggle login locking status"}
              </p>
            </div>

            <button
              onClick={() => handleExportCSV("profiles")}
              className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs uppercase tracking-wider rounded-xl transition flex items-center space-x-1 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{lang === "hi" ? "CSV एक्सपोर्ट" : "Export profiles spreadsheet"}</span>
            </button>
          </div>

          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={lang === "hi" ? "ठेकेदार का नाम या फ़ोन नंबर..." : "Filter Malik database by phone or name..."}
              className="h-11 w-full bg-slate-50 border-2 border-slate-200 focus:border-indigo-600 focus:bg-white rounded-xl py-2 pl-10 pr-3 text-xs sm:text-sm font-semibold text-slate-700 outline-none transition"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="py-3 px-3">{lang === "hi" ? "मालिक/कंपनी का नाम" : "Employer Name"}</th>
                  <th className="py-3 px-2">{lang === "hi" ? "मोबाइल फ़ोन नंबर" : "Mobile Phone"}</th>
                  <th className="py-3 px-2">{lang === "hi" ? "पंजीकृत भूमिका" : "Registered Role"}</th>
                  <th className="py-3 px-2 text-center">{lang === "hi" ? "कुल पोस्टेड काम" : "Active Posted Jobs"}</th>
                  <th className="py-3 px-2 text-center">{lang === "hi" ? "सुरक्षा लॉक नियंत्रण" : "Account status control"}</th>
                  <th className="py-3 px-3 text-right">{lang === "hi" ? "हटाएं" : "Prune Profile"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                {profiles
                  .filter(p => {
                    const term = searchQuery.toLowerCase();
                    const isEmployer = p.role === "employer";
                    const isMatched = p.name.toLowerCase().includes(term) || p.phone.includes(term);
                    return isEmployer && isMatched;
                  })
                  .map(p => (
                    <tr key={p.phone} className="hover:bg-slate-50/50">
                      <td className="py-3.5 px-3">
                        <span className="font-extrabold text-[#FF4D00] block text-sm">🏢 {p.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono block italic">Last Active: {p.lastLogin || "unknown"}</span>
                      </td>

                      <td className="py-3.5 px-2 font-mono">
                        {p.phone}
                      </td>

                      <td className="py-3.5 px-2">
                        <span className="font-bold text-[9px] bg-slate-100 text-slate-600 uppercase tracking-widest px-2 py-0.5 rounded-full border">
                          {p.role}
                        </span>
                      </td>

                      <td className="py-3.5 px-2 text-center font-mono font-black text-slate-800 text-sm">
                        {jobs.filter(j => j.employerPhone === p.phone).length} {lang === "hi" ? "विज्ञापन" : "Jobs"}
                      </td>

                      <td className="py-3.5 px-2 text-center">
                        <button
                          onClick={() => handleToggleSuspendProfile(p.phone)}
                          className={`px-3 py-1.5 rounded-lg border text-[10px] font-black uppercase tracking-wider cursor-pointer ${
                            p.status === "suspended"
                              ? "bg-red-100 border-red-300 text-red-700"
                              : "bg-emerald-50 border-emerald-200 text-emerald-800"
                          }`}
                        >
                          {p.status === "suspended" ? "🔒 Suspended (Click to open)" : "✔️ Active (Click to lock)"}
                        </button>
                      </td>

                      <td className="py-3.5 px-3 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            onClick={() => handleEditProfileClick(p)}
                            className="p-1.5 rounded-lg border bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 cursor-pointer"
                            title={lang === "hi" ? "विवरण बदलें" : "Modify profile data"}
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handlePermanentDeleteProfile(p.phone)}
                            className="p-1.5 rounded-lg border bg-red-100 border-red-200 text-red-600 hover:bg-red-200 transition cursor-pointer"
                            title={lang === "hi" ? "खाता हटाएँ" : "Permanently remove profile data"}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* --- SUBVIEW 4: ALLOCATIONS DISPATCH (काम आवंटन ब्यौरा) --- */}
      {adminSubTab === "assignments" && (
        <div className="bg-white rounded-3xl border-4 border-[#2D2D2D] p-5 shadow-sm space-y-4 text-left">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b pb-3.5">
            <div>
              <h3 className="text-base font-black flex items-center space-x-1.5">
                <span>🤝</span>
                <span>{lang === "hi" ? "कार्य आवंटन व संपर्क डेटाबेस (Connections)" : "Job allocations Dispatch"}</span>
              </h3>
              <p className="text-slate-400 font-semibold text-[10px] uppercase tracking-wider mt-0.5">
                {lang === "hi" ? "नियोक्ताओं द्वारा कामगारों को अलॉट किए गए एग्रीमेंट" : "Tracked active agreement sheets between Builders and owners in Agra"}
              </p>
            </div>

            <div className="flex space-x-1.5">
              <button
                onClick={() => handleExportCSV("assignments")}
                className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs uppercase tracking-wider rounded-xl transition flex items-center space-x-1 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{lang === "hi" ? "CSV एक्सपोर्ट" : "Export Spreadsheet"}</span>
              </button>
              
              {assignments.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    if (confirm(lang === "hi" ? "क्या आप पूरा आवंटन मिटाना चाहते हैं?" : "Clear all allocations history?")) {
                      playClickAudio();
                      setAssignments([]);
                      localStorage.removeItem("kaam_assignments");
                    }
                  }}
                  className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 font-bold text-xs rounded-xl border border-red-200 cursor-pointer"
                >
                  🗑️ Purge allocations
                </button>
              )}
            </div>
          </div>

          {/* Interactive Manual Administrative Dispatch Tool */}
          <div className="bg-slate-50 rounded-2xl border-2 border-slate-200 p-4 space-y-4">
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-[#FF4D00] flex items-center space-x-1.5">
              <span>👑</span>
              <span>{lang === "hi" ? "त्वरित नया कार्य आवंटन (Manual Task Assignment)" : "Manually Assign Task to Laborer"}</span>
            </h4>
            <p className="text-[11px] text-slate-500 font-semibold leading-tight">
              {lang === "hi"
                ? "यहाँ एडमिन किसी भी कामगार को सीधे किसी खाली काम या कस्टमाइज्ड काम पर भेज सकते हैं।"
                : "Choose any registered builder or supplier and directly link them to an active job post or custom assignment."}
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!adminAssignWorkerId) {
                  alert(lang === 'hi' ? "कृपया कामगार को चुनें!" : "Please select a worker!");
                  return;
                }

                const targetWorker = workers.find(w => w.id === adminAssignWorkerId);
                if (!targetWorker) return;

                let finalJobTitle = "";
                let finalJobTitleHi = "";
                let finalJobId = "custom";

                if (adminAssignJobId && adminAssignJobId !== "custom") {
                  const parentJob = jobs.find(j => j.id === adminAssignJobId);
                  if (parentJob) {
                    finalJobTitle = parentJob.title;
                    finalJobTitleHi = parentJob.title_hi || parentJob.title;
                    finalJobId = parentJob.id;
                  }
                } else {
                  if (!adminCustomJobTitle.trim()) {
                    alert(lang === 'hi' ? "कृपया नया काम का नाम लिखें!" : "Please enter a custom job title!");
                    return;
                  }
                  finalJobTitle = adminCustomJobTitle.trim();
                  finalJobTitleHi = adminCustomJobTitle.trim();
                }

                const employerName = adminAssignEmployerName.trim() || (lang === 'hi' ? "मुख्य एडमिन ऑफिस" : "Master Admin");
                const employerPhone = adminAssignEmployerPhone.trim() || "0000000000";

                const newAssignment: Assignment = {
                  id: `assign-${Date.now()}`,
                  jobId: finalJobId,
                  workerId: targetWorker.id,
                  assignedAt: new Date().toLocaleDateString(lang === "hi" ? "hi-IN" : "en-US", {
                    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                  }),
                  status: 'assigned',
                  employerName,
                  employerPhone,
                  workerName: targetWorker.name,
                  workerPhone: targetWorker.phone,
                  jobTitle: finalJobTitle,
                  jobTitle_hi: finalJobTitleHi,
                  workerSkills: targetWorker.skills
                };

                setAssignments(prev => [newAssignment, ...prev]);

                // Reset
                setAdminAssignWorkerId("");
                setAdminAssignJobId("");
                setAdminCustomJobTitle("");
                setAdminAssignEmployerName("");
                setAdminAssignEmployerPhone("");

                // Audit Log Record
                const newAudit = {
                  id: "audit-" + Date.now(),
                  action: `Admin manually assigned Worker/Supplier "${targetWorker.name}" to task "${finalJobTitle}" on behalf of "${employerName}"`,
                  timestamp: new Date().toISOString(),
                  admin: "Master Admin Office",
                  category: "job" as const
                };
                setAuditLogs(prev => [newAudit, ...prev]);
                alert(lang === 'hi' ? "सफलतापूर्वक कार्य आबंटित किया गया!" : "Task successfully assigned!");
              }}
              className="grid grid-cols-1 md:grid-cols-2 gap-3"
            >
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">
                  {lang === "hi" ? "१. कामगार / सप्लायर चुनें" : "1. Choose Worker / Supplier"}
                </label>
                <select
                  required
                  value={adminAssignWorkerId}
                  onChange={(e) => {
                    setAdminAssignWorkerId(e.target.value);
                    playClickAudio();
                  }}
                  className="w-full bg-white border border-slate-200 rounded-xl p-2.5 font-bold text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="">{lang === "hi" ? "-- चुनें कामगार/सप्लायर --" : "-- Select Active Laborer/Vendor --"}</option>
                  {workers.map(w => {
                    const primarySkill = w.skills && w.skills.length > 0 ? w.skills[0] : "other";
                    return (
                      <option key={w.id} value={w.id}>
                        {w.name} ({primarySkill.toUpperCase()} | {w.area})
                      </option>
                    );
                  })}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">
                  {lang === "hi" ? "२. उपलब्ध रिक्त काम चुनें (या नया लिखें)" : "2. Choose Available Vacancy"}
                </label>
                <select
                  value={adminAssignJobId}
                  onChange={(e) => {
                    setAdminAssignJobId(e.target.value);
                    playClickAudio();
                  }}
                  className="w-full bg-white border border-slate-200 rounded-xl p-2.5 font-bold text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="">{lang === "hi" ? "-- कस्टमाइज्ड नया काम दर्ज करें --" : "-- Enter Custom New Task Name --"}</option>
                  {jobs.map(j => (
                    <option key={j.id} value={j.id}>
                      {j.title} ({j.area})
                    </option>
                  ))}
                  <option value="custom">{lang === "hi" ? "✍️ नया काम का नाम लिखें..." : "✍️ Write Custom Job Title..."}</option>
                </select>
              </div>

              {(!adminAssignJobId || adminAssignJobId === "custom") && (
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">
                    {lang === "hi" ? "✍️ कस्टमाइज्ड काम का नाम" : "Custom Task/Job Title"}
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={60}
                    value={adminCustomJobTitle}
                    onChange={(e) => setAdminCustomJobTitle(e.target.value)}
                    placeholder={lang === "hi" ? "जैसे: ५ कमरों की पुट्टी और पेंटिंग का काम" : "e.g., 5-Room Wall Putty and painting work"}
                    className="w-full bg-white border border-slate-200 rounded-xl p-2.5 font-bold text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              )}

              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">
                  {lang === "hi" ? "नियोक्ता का नाम" : "Employer / Boss Name"}
                </label>
                <input
                  type="text"
                  maxLength={40}
                  value={adminAssignEmployerName}
                  onChange={(e) => setAdminAssignEmployerName(e.target.value)}
                  placeholder={lang === "hi" ? "उदा: राजेश गुप्ता (बिल्डर)" : "e.g., Rajesh Gupta (Tech Builder)"}
                  className="w-full bg-white border border-slate-200 rounded-xl p-2.5 font-bold text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">
                  {lang === "hi" ? "नियोक्ता का मोबाइल नंबर" : "Employer Phone Number"}
                </label>
                <input
                  type="tel"
                  maxLength={10}
                  value={adminAssignEmployerPhone}
                  onChange={(e) => setAdminAssignEmployerPhone(e.target.value)}
                  placeholder="9876543210"
                  className="w-full bg-white border border-[#2D2D2D]/30 rounded-xl p-2.5 font-mono font-bold text-xs focus:ring-2 focus:ring-indigo-500 outline-none text-slate-700"
                />
              </div>

              <div className="md:col-span-2 pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-[#FF4D00] hover:bg-[#D63F00] text-white font-extrabold text-xs uppercase tracking-widest rounded-xl shadow-xs transition active:scale-97 cursor-pointer"
                >
                  🤝 {lang === "hi" ? "काम अलॉट करें और ब्यौरा लॉग करें" : "Assign Task to Laborer / Supplier"}
                </button>
              </div>
            </form>
          </div>

          {assignments.length === 0 ? (
            <div className="text-center py-12 text-slate-400 font-semibold">
              <div className="text-4xl mb-2">🤝</div>
              <p className="text-xs text-slate-500">
                {lang === "hi" ? "अभी तक किसी भी कामगार को काम नहीं सौंपा गया है।" : "No task allocations recorded in active logs."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs font-semibold border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="py-3 px-2">{lang === "hi" ? "कार्य शीर्षक / आईडी" : "Task description"}</th>
                    <th className="py-3 px-2">{lang === "hi" ? "कामगार विवरण" : "Assigned builder"}</th>
                    <th className="py-3 px-2">{lang === "hi" ? "नियोक्ता विवरण" : "Employer مالک"}</th>
                    <th className="py-3 px-2 text-center">{lang === "hi" ? "आवंटन स्थिति" : "Agreement Status"}</th>
                    <th className="py-3 px-2 text-right">{lang === "hi" ? "कार्य" : "Prune log"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                  {assignments.map(a => (
                    <tr key={a.id} className="hover:bg-slate-50/50">
                      <td className="py-3 px-2">
                        <span className="font-extrabold text-slate-800 block text-xs sm:text-xs">
                          {lang === "hi" ? (a.jobTitle_hi || a.jobTitle) : a.jobTitle}
                        </span>
                        <span className="text-[9px] font-mono font-bold bg-[#E8F0FE] text-[#1a73e8] px-1.5 py-0.5 rounded uppercase mt-0.5 inline-block">
                          Job ID: {a.jobId || "custom"}
                        </span>
                      </td>

                      <td className="py-3 px-2">
                        <span className="block font-extrabold text-slate-800">{a.workerName}</span>
                        <span className="block text-[10px] text-slate-400 font-mono italic">{a.workerPhone}</span>
                      </td>

                      <td className="py-3 px-2">
                        <span className="block font-bold text-slate-700">{a.employerName}</span>
                        <span className="block text-[10px] text-slate-400 font-mono italic">{a.employerPhone}</span>
                      </td>

                      <td className="py-3 px-2 text-center">
                        <select
                          value={a.status || "ongoing"}
                          onChange={(e) => {
                            playClickAudio();
                            const nextStat = e.target.value as any;
                            setAssignments(prev => prev.map(item => item.id === a.id ? { ...item, status: nextStat } : item));
                            
                            // Log Audit Action
                            const newAudit = {
                              id: "audit-" + Date.now(),
                              action: `Updated allocation relationship status for #${a.id} to "${nextStat.toUpperCase()}"`,
                              timestamp: new Date().toISOString(),
                              admin: "Master Admin Office",
                              category: "job"
                            };
                            setAuditLogs(prev => [newAudit, ...prev]);
                            notify("Status updated!");
                          }}
                          className={`text-[10px] font-black uppercase rounded-lg p-1.5 border outline-none tracking-wider ${
                            a.status === "completed"
                              ? "bg-emerald-50 border-emerald-300 text-emerald-700"
                              : a.status === "cancelled"
                              ? "bg-red-50 border-red-200 text-red-600"
                              : "bg-amber-50 border-amber-200 text-amber-700 animate-pulse"
                          }`}
                        >
                          <option value="ongoing">⏳ Ongoing</option>
                          <option value="completed">✔️ Completed</option>
                          <option value="cancelled">❌ Cancelled</option>
                        </select>
                      </td>

                      <td className="py-3 px-2 text-right">
                        <button
                          onClick={() => {
                            playClickAudio();
                            if (confirm(lang === "hi" ? "आवंटन हटाएँ?" : "Delete allocation log record?")) {
                              setAssignments(prev => prev.filter(item => item.id !== a.id));
                            }
                          }}
                          className="p-1 px-2.5 bg-red-50 border-2 border-red-100 text-red-600 rounded-lg text-[10px] font-bold hover:bg-red-100 transition cursor-pointer"
                        >
                          🗑️
                        </button>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>
      )}

      {/* --- SUBVIEW 5: ANNOUNCEMENTS OFFICE (विज्ञप्ति केंद्र) --- */}
      {adminSubTab === "announcements" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Dispatch Form banner */}
          <div className="bg-white rounded-3xl border-4 border-[#2D2D2D] p-5 shadow-sm text-left md:col-span-1">
            <div className="border-b pb-3 mb-4">
              <h3 className="text-base font-black flex items-center space-x-1.5">
                <span>📢</span>
                <span>{lang === "hi" ? "नया संदेश प्रसारण" : "Network Message Dispatch"}</span>
              </h3>
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                {lang === "hi" ? "आगरा में सभी फोन स्क्रीन्स पर दिखाएँ" : "Draft alert announcements for users"}
              </p>
            </div>

            <form onSubmit={handleBroadcastAnnouncement} className="space-y-4">
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 tracking-wider mb-1">
                  {lang === "hi" ? "घोषणा का शीर्षक (Alert Title)" : "Alert Header/Title"}
                </label>
                <input
                  type="text"
                  required
                  value={annTitle}
                  onChange={(e) => setAnnTitle(e.target.value)}
                  placeholder={lang === "hi" ? "उदा. आगरा में नयी लेबर रेट..." : "e.g., Extreme Hot Weather Warning"}
                  className="w-full bg-slate-50 border-2 border-slate-200 focus:border-indigo-600 focus:bg-white rounded-xl py-2 px-3 text-xs sm:text-xs font-bold outline-none transition"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 tracking-wider mb-1">
                  {lang === "hi" ? "विस्तृत विवरण (Message Body)" : "Broadcast message body context"}
                </label>
                <textarea
                  required
                  rows={4}
                  value={annMessage}
                  onChange={(e) => setAnnMessage(e.target.value)}
                  placeholder={lang === "hi" ? "मकान मालिकों और ठेकेदारों के लिए विशेष निर्देश..." : "Instruct daily wage laborers about construction guidelines in Sanjay Place..."}
                  className="w-full bg-slate-50 border-2 border-slate-200 focus:border-indigo-600 focus:bg-white rounded-xl py-2 px-3 text-xs sm:text-xs font-bold outline-none transition leading-relaxed resize-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 tracking-wider mb-1">
                  {lang === "hi" ? "लक्षित उपयोगकर्ता (Target Audience)" : "Target Audience Segment"}
                </label>
                <select
                  value={annTarget}
                  onChange={(e) => { playClickAudio(); setAnnTarget(e.target.value as any); }}
                  className="w-full bg-slate-50 border-2 border-slate-200 text-slate-800 rounded-xl py-2 px-3 text-xs sm:text-xs font-black outline-none transition"
                >
                  <option value="all">👥 {lang === "hi" ? "सभी लोग (All Users)" : "All Members"}</option>
                  <option value="laborers">👷 {lang === "hi" ? "केवल दैनिक कामगार (Kaamgars Only)" : "Builders Only"}</option>
                  <option value="employers">🏢 {lang === "hi" ? "केवल मकान मालिक व ठेकेदार (Employers Only)" : "Owners Only"}</option>
                </select>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-xs transition active:scale-95 cursor-pointer"
                >
                  📢 DISPATCH BROADCAST LIVE
                </button>
              </div>
            </form>
          </div>

          {/* History stream panel */}
          <div className="bg-white rounded-3xl border-4 border-[#2D2D2D] p-5 shadow-sm text-left md:col-span-2">
            <div className="border-b pb-3 mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-base font-black flex items-center space-x-1.5">
                  <span>📰</span>
                  <span>{lang === "hi" ? "सक्रिय संदेश इतिहास (Broadcast History)" : "Broadcast alerts history stream"}</span>
                </h3>
                <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">
                  {lang === "hi" ? "हाल ही में भेजे गए अलर्ट विज्ञप्तियां" : "Active alerts reflecting on user client endpoints"}
                </p>
              </div>

              {announcements.length > 0 && (
                <button
                  onClick={() => { playClickAudio(); setAnnouncements([]); }}
                  className="px-2.5 py-1 text-[10px] font-black uppercase text-red-600 hover:bg-red-50 rounded bg-white border border-red-100 cursor-pointer"
                >
                  Clear History
                </button>
              )}
            </div>

            {announcements.length === 0 ? (
              <div className="text-center py-12 text-slate-400 font-semibold space-y-2">
                <div className="text-4xl">📭</div>
                <p className="text-xs text-slate-500">
                  {lang === "hi" ? "अभी तक कोई भी विज्ञप्ति जारी नहीं की गयी।" : "No system broadcasts logged in the archive."}
                </p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
                {announcements.map(ann => (
                  <div key={ann.id} className="relative border-2 border-indigo-100 bg-indigo-50/20 rounded-2xl p-4 space-y-2">
                    <button
                      onClick={() => {
                        playClickAudio();
                        setAnnouncements(prev => prev.filter(item => item.id !== ann.id));
                      }}
                      className="absolute right-3.5 top-3.5 text-slate-400 hover:text-red-500 text-sm font-bold bg-white w-6 h-6 rounded-full flex items-center justify-center border hover:border-red-200 transition cursor-pointer"
                      title="Remove broadcast"
                    >
                      ×
                    </button>

                    <div className="flex items-center space-x-2">
                      <span className="text-[9px] font-mono font-black uppercase tracking-widest bg-indigo-600 text-white px-2.5 py-0.5 rounded-full">
                        AUDIENCE: {ann.target}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono font-semibold">dispatched: {ann.timestamp.substring(11, 16)} UTC</span>
                    </div>

                    <h4 className="font-extrabold text-[#FF4D00] text-sm leading-tight">{ann.title}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed font-semibold">{ann.message}</p>
                    <div className="text-[10px] text-slate-400 font-bold italic pt-1 border-t border-dashed">
                      Dispatched under administrator authority signature.
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

      {/* --- SUBVIEW 6: CIVIC COMPLAINTS (शिकायतें व सेवा सुधार) --- */}
      {adminSubTab === "support" && (
        <div className="bg-white rounded-3xl border-4 border-[#2D2D2D] p-5 shadow-sm space-y-4 text-left">
          <div className="border-b pb-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h3 className="text-base font-black flex items-center space-x-1.5">
                <span>💬</span>
                <span>{lang === "hi" ? "नागरिक सहायता डेस्क (Client FeedbackDesk)" : "Kaam support workspace"}</span>
              </h3>
              <p className="text-slate-400 font-semibold text-[10px] uppercase tracking-wider mt-0.5">
                {lang === "hi" ? "मजदूरों एवं नियोक्ताओं द्वारा दर्ज़ समस्याएं" : "Listen, diagnose and reply live to user grievances"}
              </p>
            </div>

            {supportTickets.length > 0 && (
              <button
                onClick={() => {
                  playClickAudio();
                  setSupportTickets([]);
                  localStorage.removeItem("kaam_support_tickets");
                }}
                className="px-3.5 py-1.5 bg-red-50 border border-red-200 hover:bg-red-100 text-red-600 font-black text-xs uppercase tracking-wider rounded-xl transition cursor-pointer"
              >
                Clear Tickets Sheet
              </button>
            )}
          </div>

          {supportTickets.length === 0 ? (
            <div className="text-center py-12 text-slate-400 font-semibold space-y-2">
              <div className="text-4xl">🕊️</div>
              <p className="text-xs text-[#9090A0]">
                {lang === "hi" ? "सभी शिकायतें सुलझा ली गयी हैं। सहायता डेस्क पर शांति है!" : "All tickets sorted! Peace rules the support helpdesk."}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {supportTickets.map(t => (
                <div key={t.id} className={`p-4 border-2 rounded-2xl space-y-3 ${t.status === "resolved" ? "bg-slate-50 border-slate-100 opacity-80" : "bg-amber-50/10 border-amber-200/80 shadow-xs animate-pulse-slow"}`}>
                  <div className="flex items-center justify-between border-b pb-2">
                    <div className="flex items-center space-x-2.5">
                      <span className="text-base">{t.userRole === "laborer" ? "👷" : "🏢"}</span>
                      <div>
                        <h4 className="text-xs font-black text-slate-800">{t.userName}</h4>
                        <span className="text-[10px] text-slate-400 font-mono font-semibold">User phone: {t.userPhone} • ID: #{t.id}</span>
                      </div>
                    </div>

                    <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${t.status === "resolved" ? "bg-emerald-100 text-emerald-800 border" : "bg-amber-100 text-amber-800 border animate-pulse"}`}>
                      {t.status === "resolved" ? "✔️ Resolved" : "⏳ Open / Unresolved"}
                    </span>
                  </div>

                  <div className="text-xs text-slate-600 font-semibold leading-relaxed p-2.5 bg-white rounded-xl border border-dashed">
                    <span className="font-extrabold text-slate-400 uppercase tracking-widest text-[9px] block mb-1">Issue Reported:</span>
                    {t.issue}
                  </div>

                  {t.status === "resolved" && t.responseText && (
                    <div className="text-xs text-emerald-800 font-semibold leading-relaxed p-2.5 bg-emerald-50/40 border border-emerald-100 rounded-xl">
                      <span className="font-extrabold text-emerald-600 uppercase tracking-widest text-[9px] block mb-1">Admin Response Reply:</span>
                      ✔️ {t.responseText}
                    </div>
                  )}

                  {t.status === "open" && (
                    <div className="space-y-2 pt-1.5 text-left">
                      {activeTicketId === t.id ? (
                        <div className="space-y-2 text-left">
                          <textarea
                            rows={3}
                            value={ticketReply}
                            onChange={(e) => setTicketReply(e.target.value)}
                            placeholder="Type resolution reply message..."
                            className="w-full bg-white border-2 border-slate-300 rounded-xl p-2 text-xs font-semibold outline-none leading-relaxed"
                          />
                          <div className="flex justify-end space-x-2">
                            <button
                              type="button"
                              onClick={() => { playClickAudio(); setActiveTicketId(null); setTicketReply(""); }}
                              className="px-3 py-1.5 bg-slate-100 text-slate-600 font-bold text-[10px] uppercase rounded-xl cursor-pointer"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={() => handleResolveTicket(t.id)}
                              className="px-3.5 py-1.5 bg-emerald-600 text-white font-black text-[10px] uppercase rounded-xl shadow-xs cursor-pointer"
                            >
                              Submit Reply & Resolve
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => { playClickAudio(); setActiveTicketId(t.id); }}
                          className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-[10px] uppercase rounded-xl shadow-xs flex items-center space-x-1 transition cursor-pointer"
                        >
                          <span>✍️ Reply Response Ticket</span>
                        </button>
                      )}
                    </div>
                  )}

                </div>
              ))}
            </div>
          )}

        </div>
      )}

      {/* --- SUBVIEW 7: PRIVACY & SYSTEM AUDIT TRAIL LOGS (सुरक्षा लॉग) --- */}
      {adminSubTab === "audit" && (
        <div className="bg-white rounded-3xl border-4 border-[#2D2D2D] p-5 shadow-sm space-y-4 text-left">
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b pb-3.5">
            <div>
              <h3 className="text-base font-black flex items-center space-x-1.5">
                <Shield className="w-5 h-5 text-indigo-600 shrink-0" />
                <span>{lang === "hi" ? "सुरक्षा एवं विधिक अनुपालन लॉग (System Security Audit Trail)" : "Platform Security & System Audit Logs"}</span>
              </h3>
              <p className="text-slate-400 font-semibold text-[10px] uppercase tracking-wider mt-0.5">
                {lang === "hi" ? "एडमिन द्वारा की गयी कार्रवाइयां और विफलताएं" : "Chronological catalog of administrative actions, logins and blocks"}
              </p>
            </div>

            <div className="flex space-x-1.5">
              <button
                onClick={() => handleExportCSV("audit")}
                className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs uppercase tracking-wider rounded-xl transition flex items-center space-x-1 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{lang === "hi" ? "CSV इतिहास डाउनलोड करें" : "Export Audit CSV"}</span>
              </button>
              
              {auditLogs.length > 1 && (
                <button
                  onClick={() => {
                    if (confirm(lang === "hi" ? "पूरा सुरक्षा इतिहास साफ़ करें?" : "Erase system audit history?")) {
                      playClickAudio();
                      setAuditLogs([
                        { id: "audit-reset", action: "Audit trail state purged by administrative command authority", timestamp: new Date().toISOString(), admin: "Master Admin System", category: "system" }
                      ]);
                      localStorage.setItem("kaam_audit_logs", JSON.stringify([
                        { id: "audit-reset", action: "Audit trail state purged by administrative command authority", timestamp: new Date().toISOString(), admin: "Master Admin System", category: "system" }
                      ]));
                    }
                  }}
                  className="px-2 px-3.5 bg-red-50 border border-red-200 text-red-600 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Purge Logs
                </button>
              )}
            </div>
          </div>

          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search chronological action logs by category, admin name or action..."
              className="h-11 w-full bg-slate-50 border-2 border-slate-200 focus:border-indigo-600 focus:bg-white rounded-xl py-2 pl-10 pr-3 text-xs sm:text-sm font-semibold text-slate-700 outline-none transition"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-[11px] font-semibold border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="py-2.5 px-2">{lang === "hi" ? "दिनांक व समय (ISO)" : "Timestamp"}</th>
                  <th className="py-2.5 px-2">{lang === "hi" ? "श्रेणी" : "Category"}</th>
                  <th className="py-2.5 px-2">{lang === "hi" ? "कर्त्ता / अधिकारी" : "Admin Operator"}</th>
                  <th className="py-2.5 px-2">{lang === "hi" ? "पंजीकृत कार्रवाई (Trace Event)" : "Activity Log Details"}</th>
                  <th className="py-2.5 px-2 text-right">{lang === "hi" ? "प्रामाणिकता" : "Signature"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600">
                {auditLogs
                  .filter(al => {
                    const term = searchQuery.toLowerCase();
                    return al.action.toLowerCase().includes(term) || al.admin.toLowerCase().includes(term) || al.category.toLowerCase().includes(term);
                  })
                  .map(al => (
                    <tr key={al.id} className="hover:bg-slate-50/50">
                      <td className="py-3 px-2 font-mono text-[9px] text-slate-400">
                        ⏱️ {al.timestamp}
                      </td>

                      <td className="py-3 px-2">
                        <span className={`px-2 py-0.5 rounded text-[8px] uppercase tracking-wider font-extrabold border ${
                          al.category === "system"
                            ? "bg-red-50 border-red-200 text-red-600"
                            : al.category === "job"
                            ? "bg-amber-50 border-amber-200 text-amber-700"
                            : "bg-indigo-50 border-indigo-200 text-indigo-700"
                        }`}>
                          {al.category}
                        </span>
                      </td>

                      <td className="py-3 px-2 font-black text-slate-800 text-[10px]">
                        💼 {al.admin}
                      </td>

                      <td className="py-3 px-2 text-slate-700 text-xs font-semibold max-w-[340px] truncate leading-tight">
                        {al.action}
                      </td>

                      <td className="py-3 px-2 text-right font-mono text-[8px] font-bold text-indigo-600 bg-indigo-50/20 rounded-xl inline-block mt-2 font-black uppercase">
                        SECURED ✔️
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

    </div>
  );
};

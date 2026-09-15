import React from "react";
import { 
  Layers, 
  Send, 
  Users, 
  Activity, 
  Settings,
  Server,
  MessageSquare
} from "lucide-react";

interface MobileNavProps {
  currentTab: "overview" | "whatsapp" | "campaigns" | "groups" | "queue" | "settings" | "api";
  setCurrentTab: (tab: "overview" | "whatsapp" | "campaigns" | "groups" | "queue" | "settings" | "api") => void;
  activeCampaignsCount: number;
  onOpenServerModal: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  currentTab,
  setCurrentTab,
  activeCampaignsCount,
  onOpenServerModal,
}) => {
  return (
    <nav 
      id="mobile-bottom-nav" 
      className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] pb-[max(0.5rem,env(safe-area-inset-bottom))]"
    >
      <div className="grid grid-cols-6 items-center max-w-md mx-auto">
        {/* 1. Visão Geral */}
        <button
          onClick={() => setCurrentTab("overview")}
          className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all ${
            currentTab === "overview"
              ? "text-slate-900 font-bold"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          <div className={`p-1 rounded-lg ${currentTab === "overview" ? "bg-slate-100" : ""}`}>
            <Layers className="w-4 h-4" />
          </div>
          <span className="text-[9px] mt-0.5 tracking-tight">Início</span>
        </button>

        {/* 2. Mexer no WhatsApp */}
        <button
          onClick={() => setCurrentTab("whatsapp")}
          className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all ${
            currentTab === "whatsapp"
              ? "text-emerald-700 font-bold"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          <div className={`p-1 rounded-lg ${currentTab === "whatsapp" ? "bg-emerald-100 text-emerald-700" : ""}`}>
            <MessageSquare className="w-4 h-4" />
          </div>
          <span className="text-[9px] mt-0.5 tracking-tight">WhatsApp</span>
        </button>

        {/* 3. Disparar (Center Highlight Button) */}
        <button
          onClick={() => setCurrentTab("campaigns")}
          className="flex flex-col items-center justify-center -mt-3 group"
        >
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg transition-transform active:scale-95 ${
            currentTab === "campaigns"
              ? "bg-slate-900 text-white shadow-slate-900/30"
              : "bg-emerald-600 text-white shadow-emerald-600/30"
          }`}>
            <Send className="w-4 h-4" />
          </div>
          <span className={`text-[9px] mt-1 font-bold ${
            currentTab === "campaigns" ? "text-slate-900" : "text-emerald-700"
          }`}>
            Disparo
          </span>
        </button>

        {/* 4. Grupos */}
        <button
          onClick={() => setCurrentTab("groups")}
          className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all ${
            currentTab === "groups"
              ? "text-slate-900 font-bold"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          <div className={`p-1 rounded-lg ${currentTab === "groups" ? "bg-slate-100" : ""}`}>
            <Users className="w-4 h-4" />
          </div>
          <span className="text-[9px] mt-0.5 tracking-tight">Grupos</span>
        </button>

        {/* 5. Fila ao Vivo */}
        <button
          onClick={() => setCurrentTab("queue")}
          className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl relative transition-all ${
            currentTab === "queue"
              ? "text-slate-900 font-bold"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          <div className={`p-1 rounded-lg relative ${currentTab === "queue" ? "bg-slate-100" : ""}`}>
            <Activity className="w-4 h-4" />
            {activeCampaignsCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            )}
          </div>
          <span className="text-[9px] mt-0.5 tracking-tight">Fila</span>
        </button>

        {/* 6. Servidor / Ajustes */}
        <button
          onClick={() => setCurrentTab("settings")}
          className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all ${
            currentTab === "settings"
              ? "text-slate-900 font-bold"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          <div className={`p-1 rounded-lg ${currentTab === "settings" ? "bg-slate-100" : ""}`}>
            <Settings className="w-4 h-4" />
          </div>
          <span className="text-[9px] mt-0.5 tracking-tight">Ajustes</span>
        </button>
      </div>
    </nav>
  );
};

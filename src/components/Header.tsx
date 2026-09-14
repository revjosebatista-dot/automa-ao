import React from "react";
import { 
  Radio, 
  Smartphone, 
  BatteryMedium, 
  ShieldCheck, 
  RefreshCw, 
  Layers, 
  Send, 
  Users, 
  Activity, 
  Settings, 
  Database,
  ExternalLink,
  Server,
  Download
} from "lucide-react";
import { WhatsAppInstance } from "../types";

interface HeaderProps {
  instance: WhatsAppInstance;
  currentTab: "overview" | "campaigns" | "groups" | "queue" | "settings";
  setCurrentTab: (tab: "overview" | "campaigns" | "groups" | "queue" | "settings") => void;
  onOpenQrModal: () => void;
  onOpenServerModal: () => void;
  onOpenInstallModal: () => void;
  onSyncGroups: () => void;
  isSyncing: boolean;
  activeCampaignsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  instance,
  currentTab,
  setCurrentTab,
  onOpenQrModal,
  onOpenServerModal,
  onOpenInstallModal,
  onSyncGroups,
  isSyncing,
  activeCampaignsCount,
}) => {
  const isConnected = instance.status === "connected";

  return (
    <header id="app-header" className="bg-white border-b border-slate-200 sticky top-0 z-40">
      {/* Top Bar: Brand, Device Status & Quick Actions */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          
          {/* Logo & Platform info */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-xs shadow-emerald-500/20 shrink-0">
              <Radio className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-bold text-base sm:text-lg tracking-tight text-slate-900">AutoBroadcast</span>
                <span className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-1.5 sm:px-2 py-0.5 rounded-full border border-emerald-200">
                  PRO
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden md:block">
                Disparo & Automação de Vídeos em Grupos WhatsApp
              </p>
            </div>
          </div>

          {/* Quick Actions & Device Status */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Server Status Pill (Live Diagnostics) */}
            <button
              id="header-server-status-btn"
              onClick={onOpenServerModal}
              className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200/80 border border-slate-200/90 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-700 transition-all cursor-pointer"
              title="Clique para verificar saúde e status dos servidores"
            >
              <div className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </div>
              <span className="text-[11px] sm:text-xs">Servidores</span>
              <span className="hidden sm:inline text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-bold">
                Online
              </span>
            </button>

            {/* Device & Instance Badge */}
            <div 
              onClick={onOpenQrModal}
              className="cursor-pointer group flex items-center gap-2 sm:gap-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-2.5 sm:px-3.5 py-1.5 rounded-xl transition-all"
              title="Clique para gerenciar conexão do WhatsApp"
            >
              <div className="relative">
                <div className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full ${isConnected ? "bg-emerald-500" : "bg-amber-500"}`} />
                {isConnected && (
                  <div className="absolute -inset-0.5 bg-emerald-500 rounded-full animate-ping opacity-75" />
                )}
              </div>
              
              <div className="text-left hidden xs:block sm:block">
                <div className="flex items-center gap-1">
                  <Smartphone className="w-3 h-3 text-slate-400 hidden sm:inline" />
                  <span className="text-xs font-semibold text-slate-800">
                    {isConnected ? instance.phone : "Desconectado"}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                  <span className="truncate max-w-[90px] sm:max-w-[120px] font-medium">{instance.name}</span>
                  {isConnected && (
                    <span className="hidden sm:inline text-emerald-700 font-mono font-bold">
                      {instance.battery}%
                    </span>
                  )}
                </div>
              </div>

              <div className="text-xs font-medium text-emerald-600 group-hover:text-emerald-700">
                {isConnected ? "Gerenciar" : "Conectar"}
              </div>
            </div>

            {/* Sync Button */}
            <button
              id="header-sync-btn"
              onClick={onSyncGroups}
              disabled={isSyncing}
              className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium border border-slate-300 p-2 sm:px-3 sm:py-2 rounded-xl transition-all shadow-xs disabled:opacity-50"
              title="Sincronizar grupos"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-slate-500 ${isSyncing ? "animate-spin text-emerald-600" : ""}`} />
              <span className="hidden md:inline">{isSyncing ? "Sincronizando..." : "Sincronizar"}</span>
            </button>

            {/* Install / Download App Button */}
            <button
              id="header-install-app-btn"
              onClick={onOpenInstallModal}
              className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-2.5 sm:px-3 py-2 rounded-xl transition-all shadow-xs"
              title="Baixar ou instalar aplicativo no celular ou computador"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Baixar App</span>
            </button>
          </div>
        </div>

        {/* Desktop Navigation Tabs */}
        <nav className="hidden sm:flex space-x-2 lg:space-x-4 border-t border-slate-100 overflow-x-auto py-2 scrollbar-none">
          <button
            id="nav-tab-overview"
            onClick={() => setCurrentTab("overview")}
            className={`flex items-center gap-2 px-3 py-2 text-xs lg:text-sm font-semibold rounded-lg transition-all whitespace-nowrap ${
              currentTab === "overview"
                ? "bg-slate-900 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Visão Geral</span>
          </button>

          <button
            id="nav-tab-campaigns"
            onClick={() => setCurrentTab("campaigns")}
            className={`flex items-center gap-2 px-3 py-2 text-xs lg:text-sm font-semibold rounded-lg transition-all whitespace-nowrap ${
              currentTab === "campaigns"
                ? "bg-slate-900 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Send className="w-4 h-4" />
            <span>Disparar Vídeos</span>
            {activeCampaignsCount > 0 && (
              <span className="bg-emerald-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                {activeCampaignsCount}
              </span>
            )}
          </button>

          <button
            id="nav-tab-groups"
            onClick={() => setCurrentTab("groups")}
            className={`flex items-center gap-2 px-3 py-2 text-xs lg:text-sm font-semibold rounded-lg transition-all whitespace-nowrap ${
              currentTab === "groups"
                ? "bg-slate-900 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Grupos de WhatsApp</span>
          </button>

          <button
            id="nav-tab-queue"
            onClick={() => setCurrentTab("queue")}
            className={`flex items-center gap-2 px-3 py-2 text-xs lg:text-sm font-semibold rounded-lg transition-all whitespace-nowrap ${
              currentTab === "queue"
                ? "bg-slate-900 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Fila ao Vivo & Anti-Ban</span>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </button>

          <button
            id="nav-tab-settings"
            onClick={() => setCurrentTab("settings")}
            className={`flex items-center gap-2 px-3 py-2 text-xs lg:text-sm font-semibold rounded-lg transition-all whitespace-nowrap ${
              currentTab === "settings"
                ? "bg-slate-900 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Supabase & Servidor</span>
          </button>
        </nav>
      </div>
    </header>
  );
};

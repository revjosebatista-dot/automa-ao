import React from "react";
import { 
  Send, 
  Users, 
  CheckCircle2, 
  Clock, 
  ShieldAlert, 
  Film, 
  TrendingUp,
  Database
} from "lucide-react";
import { BroadcastCampaign, WhatsAppGroup, SystemSettings } from "../types";

interface MetricCardsProps {
  campaigns: BroadcastCampaign[];
  groups: WhatsAppGroup[];
  settings: SystemSettings;
  onOpenNewCampaign: () => void;
  onViewQueue: () => void;
}

export const MetricCards: React.FC<MetricCardsProps> = ({
  campaigns,
  groups,
  settings,
  onOpenNewCampaign,
  onViewQueue,
}) => {
  const activeCampaign = campaigns.find(c => c.status === "running");
  const totalSent = campaigns.reduce((acc, c) => acc + c.sentCount, 0);
  const totalTarget = campaigns.reduce((acc, c) => acc + c.targetGroupsCount, 0);
  const totalMembers = groups.reduce((acc, g) => acc + g.membersCount, 0);
  const deliveryRate = totalTarget > 0 ? ((totalSent / totalTarget) * 100).toFixed(1) : "100";

  return (
    <div id="metrics-grid" className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {/* Metric 1: Vídeos Disparados */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-3.5 sm:p-5 shadow-xs transition-all hover:border-slate-300">
        <div className="flex items-center justify-between">
          <span className="text-[11px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider truncate">Disparos</span>
          <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Film className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
        </div>
        <div className="mt-2 sm:mt-3 flex items-baseline gap-1.5 sm:gap-2">
          <span className="text-xl sm:text-2xl font-bold text-slate-900 font-mono">{totalSent}</span>
          <span className="text-[10px] sm:text-xs text-slate-400 font-medium truncate">/ {totalTarget || totalSent}</span>
        </div>
        <div className="mt-2 sm:mt-3 flex items-center justify-between text-[11px] sm:text-xs pt-2 sm:pt-3 border-t border-slate-100">
          <span className="text-emerald-700 font-semibold flex items-center gap-0.5 truncate">
            <TrendingUp className="w-3 h-3 inline shrink-0" /> {deliveryRate}%
          </span>
          <span className="text-slate-400 text-[10px] hidden xs:inline sm:inline">Taxa</span>
        </div>
      </div>

      {/* Metric 2: Grupos & Membros */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-3.5 sm:p-5 shadow-xs transition-all hover:border-slate-300">
        <div className="flex items-center justify-between">
          <span className="text-[11px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider truncate">Grupos</span>
          <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
            <Users className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
        </div>
        <div className="mt-2 sm:mt-3 flex items-baseline gap-1.5 sm:gap-2">
          <span className="text-xl sm:text-2xl font-bold text-slate-900 font-mono">{groups.length}</span>
          <span className="text-[10px] sm:text-xs text-slate-400 font-medium">ativos</span>
        </div>
        <div className="mt-2 sm:mt-3 flex items-center justify-between text-[11px] sm:text-xs pt-2 sm:pt-3 border-t border-slate-100">
          <span className="text-slate-600 font-medium truncate">Alcance:</span>
          <span className="font-mono font-bold text-slate-900 bg-slate-100 px-1.5 sm:px-2 py-0.5 rounded text-[10px] sm:text-xs">
            {totalMembers.toLocaleString("pt-BR")}
          </span>
        </div>
      </div>

      {/* Metric 3: Fila Ativa & Delay Anti-Ban */}
      <div 
        onClick={onViewQueue}
        className="bg-white border border-slate-200/80 rounded-2xl p-3.5 sm:p-5 shadow-xs cursor-pointer hover:border-emerald-300 hover:shadow-emerald-500/5 transition-all group"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider">Fila</span>
            {activeCampaign && (
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            )}
          </div>
          <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors shrink-0">
            <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
        </div>
        <div className="mt-2 sm:mt-3">
          {activeCampaign ? (
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl sm:text-2xl font-bold text-emerald-600 font-mono animate-pulse">
                {activeCampaign.nextDispatchIn}s
              </span>
              <span className="text-[10px] sm:text-xs text-slate-500 font-medium">delay</span>
            </div>
          ) : (
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl sm:text-2xl font-bold text-slate-400 font-mono">0</span>
              <span className="text-[10px] sm:text-xs text-slate-400">em espera</span>
            </div>
          )}
        </div>
        <div className="mt-2 sm:mt-3 flex items-center justify-between text-[11px] sm:text-xs pt-2 sm:pt-3 border-t border-slate-100">
          <span className="truncate text-slate-700 font-medium text-[10px] sm:text-xs">
            {activeCampaign ? "Em envio" : "Livre"}
          </span>
          <span className="text-emerald-600 font-semibold group-hover:underline text-[10px] sm:text-xs">Ver &rarr;</span>
        </div>
      </div>

      {/* Metric 4: Supabase & Sistema */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-3.5 sm:p-5 shadow-xs transition-all hover:border-slate-300">
        <div className="flex items-center justify-between">
          <span className="text-[11px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider">Sistema</span>
          <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center shrink-0">
            <Database className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
        </div>
        <div className="mt-2 sm:mt-3 flex items-baseline gap-1.5">
          <span className="text-sm sm:text-lg font-bold text-slate-800">Supabase</span>
          <span className="text-[9px] sm:text-xs bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded-full">
            OK
          </span>
        </div>
        <div className="mt-2 sm:mt-3 flex items-center justify-between text-[11px] sm:text-xs pt-2 sm:pt-3 border-t border-slate-100">
          <span className="text-slate-500 font-medium text-[10px] sm:text-xs truncate">
            Limite:
          </span>
          <span className="font-mono font-bold text-slate-800 text-[10px] sm:text-xs">
            {settings.dailyMessageLimit}/dia
          </span>
        </div>
      </div>
    </div>
  );
};

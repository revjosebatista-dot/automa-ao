import React, { useState } from "react";
import { 
  Activity, 
  Pause, 
  Play, 
  FastForward, 
  Trash2, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  Radio, 
  Search, 
  FileText, 
  AlertCircle,
  Zap
} from "lucide-react";
import { BroadcastCampaign, DispatchLog } from "../types";

interface LiveQueueMonitorProps {
  campaigns: BroadcastCampaign[];
  logs: DispatchLog[];
  onToggleCampaign: (id: string) => void;
  onDeleteCampaign: (id: string) => void;
  onSimulateStep: () => void;
  isSimulating: boolean;
}

export const LiveQueueMonitor: React.FC<LiveQueueMonitorProps> = ({
  campaigns,
  logs,
  onToggleCampaign,
  onDeleteCampaign,
  onSimulateStep,
  isSimulating,
}) => {
  const [searchLog, setSearchLog] = useState("");
  const activeCampaign = campaigns.find((c) => c.status === "running");

  const filteredLogs = logs.filter(
    (l) =>
      l.groupName.toLowerCase().includes(searchLog.toLowerCase()) ||
      l.messageId.toLowerCase().includes(searchLog.toLowerCase())
  );

  return (
    <div id="live-queue-monitor" className="space-y-6">
      {/* Top Banner: Real-time Dispatch status */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-3 w-3 relative">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${activeCampaign ? "bg-emerald-400 opacity-75" : "bg-slate-300"}`}></span>
                <span className={`relative inline-flex rounded-full h-3 w-3 ${activeCampaign ? "bg-emerald-500" : "bg-slate-400"}`}></span>
              </span>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Fila de Disparos ao Vivo & Motor Anti-Ban
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Monitoramento em tempo real do processador de filas com algoritmo de humanização Baileys.
            </p>
          </div>

          {/* Quick Simulation / Acceleration Button */}
          <div className="flex items-center gap-3">
            <button
              id="simulate-next-step-btn"
              onClick={onSimulateStep}
              disabled={!activeCampaign || isSimulating}
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold py-2.5 px-4 rounded-xl transition-all shadow-xs shadow-emerald-600/20"
              title="Acelerar o envio para o próximo grupo na fila para fins de demonstração"
            >
              <Zap className="w-4 h-4" />
              <span>Acelerar Próximo Disparo</span>
            </button>
          </div>
        </div>

        {/* Active Campaign Card */}
        {activeCampaign ? (
          <div className="mt-6 bg-slate-50 border border-slate-200/80 rounded-2xl p-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200">
                    Disparando Agora
                  </span>
                  <h3 className="font-bold text-slate-900 text-base">{activeCampaign.title}</h3>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Vídeo: <strong className="text-slate-800 font-mono">{activeCampaign.videoName}</strong> ({activeCampaign.videoSize})
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onToggleCampaign(activeCampaign.id)}
                  className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-100 text-slate-800 text-xs font-semibold py-2 px-3.5 rounded-xl border border-slate-300 transition-all shadow-2xs"
                >
                  <Pause className="w-3.5 h-3.5" />
                  Pausar Fila
                </button>
                <button
                  onClick={() => onDeleteCampaign(activeCampaign.id)}
                  className="inline-flex items-center gap-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold py-2 px-3 rounded-xl border border-rose-200 transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Cancelar
                </button>
              </div>
            </div>

            {/* Progress Bar & Next timer */}
            <div className="mt-5">
              <div className="flex justify-between text-xs font-medium text-slate-700 mb-1.5">
                <span>
                  Progresso: <strong>{activeCampaign.sentCount}</strong> de <strong>{activeCampaign.targetGroupsCount}</strong> grupos concluídos
                </span>
                <span className="font-mono text-emerald-700 font-bold">
                  {Math.round((activeCampaign.sentCount / activeCampaign.targetGroupsCount) * 100)}%
                </span>
              </div>
              <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                <div 
                  className="bg-emerald-500 h-full transition-all duration-500 rounded-full"
                  style={{ width: `${(activeCampaign.sentCount / activeCampaign.targetGroupsCount) * 100}%` }}
                />
              </div>
            </div>

            {/* Current Target & Anti-ban countdown */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-200/60 text-xs">
              <div className="flex items-center gap-2 bg-white p-3 rounded-xl border border-slate-200">
                <Radio className="w-4 h-4 text-emerald-600 animate-pulse" />
                <div>
                  <span className="text-slate-500 block text-[11px]">Grupo Alvo Atual:</span>
                  <span className="font-semibold text-slate-900 truncate max-w-[260px] block">
                    {activeCampaign.currentGroup || "Aguardando próximo grupo..."}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-white p-3 rounded-xl border border-slate-200">
                <Clock className="w-4 h-4 text-indigo-600" />
                <div>
                  <span className="text-slate-500 block text-[11px]">Próximo Disparo em:</span>
                  <span className="font-mono font-bold text-emerald-700 text-sm">
                    {activeCampaign.nextDispatchIn} segundos
                  </span>
                  <span className="text-[10px] text-slate-400 ml-1.5">(Intervalo Anti-Ban)</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-6 p-8 border-2 border-dashed border-slate-200 rounded-2xl text-center bg-slate-50">
            <CheckCircle2 className="w-10 h-10 text-slate-400 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-slate-800">Fila Vazia ou Concluída</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Nenhuma campanha em execução no momento. Vá para a aba <strong>Disparar Vídeos</strong> para iniciar um novo envio em massa.
            </p>
          </div>
        )}
      </div>

      {/* Campaigns List (Running, Paused, Completed) */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-600" />
          Histórico de Campanhas de Vídeos
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="pb-3 pl-2">Campanha</th>
                <th className="pb-3">Vídeo</th>
                <th className="pb-3">Progresso</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right pr-2">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {campaigns.map((camp) => (
                <tr key={camp.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 pl-2 font-medium text-slate-900 max-w-[220px] truncate">
                    {camp.title}
                  </td>
                  <td className="py-3.5 text-slate-600 font-mono text-[11px]">
                    {camp.videoName} ({camp.videoSize})
                  </td>
                  <td className="py-3.5">
                    <span className="font-mono font-semibold text-slate-800">
                      {camp.sentCount} / {camp.targetGroupsCount}
                    </span>
                  </td>
                  <td className="py-3.5">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        camp.status === "running"
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                          : camp.status === "paused"
                          ? "bg-amber-100 text-amber-800 border border-amber-200"
                          : "bg-slate-100 text-slate-700 border border-slate-200"
                      }`}
                    >
                      {camp.status === "running" ? "Executando" : camp.status === "paused" ? "Pausada" : "Concluída"}
                    </span>
                  </td>
                  <td className="py-3.5 text-right pr-2">
                    <div className="inline-flex items-center gap-1.5">
                      {camp.status !== "completed" && (
                        <button
                          onClick={() => onToggleCampaign(camp.id)}
                          className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"
                          title={camp.status === "running" ? "Pausar" : "Continuar"}
                        >
                          {camp.status === "running" ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                        </button>
                      )}
                      <button
                        onClick={() => onDeleteCampaign(camp.id)}
                        className="p-1.5 hover:bg-rose-50 text-rose-600 rounded-lg transition-colors"
                        title="Remover"
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

      {/* Live Dispatch Logs Table */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-600" />
              Logs de Envio em Tempo Real
            </h3>
            <p className="text-xs text-slate-500">Histórico detalhado de cada disparo com confirmação de entrega do WhatsApp.</p>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por grupo ou ID..."
              value={searchLog}
              onChange={(e) => setSearchLog(e.target.value)}
              className="bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:border-emerald-500 text-xs rounded-xl pl-9 pr-3 py-2 w-56 text-slate-800"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="pb-3 pl-2">Horário</th>
                <th className="pb-3">Grupo de Destino</th>
                <th className="pb-3">Message ID (WhatsApp)</th>
                <th className="pb-3">Delay Aplicado</th>
                <th className="pb-3 text-right pr-2">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 pl-2 text-slate-500">{log.timestamp}</td>
                  <td className="py-3 text-slate-900 font-sans font-medium">{log.groupName}</td>
                  <td className="py-3 text-slate-500 text-[11px]">{log.messageId}</td>
                  <td className="py-3 text-emerald-700 font-semibold">{log.delayUsed}s</td>
                  <td className="py-3 text-right pr-2">
                    <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full text-[10px] font-sans font-semibold">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Entregue
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

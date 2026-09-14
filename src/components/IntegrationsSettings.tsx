import React, { useState } from "react";
import { 
  Database, 
  Key, 
  ShieldCheck, 
  Sliders, 
  Save, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  ExternalLink,
  Server
} from "lucide-react";
import { SystemSettings } from "../types";

interface IntegrationsSettingsProps {
  settings: SystemSettings;
  onSaveSettings: (newSettings: SystemSettings) => void;
}

export const IntegrationsSettings: React.FC<IntegrationsSettingsProps> = ({
  settings,
  onSaveSettings,
}) => {
  const [formData, setFormData] = useState<SystemSettings>(settings);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <form id="integrations-settings-form" onSubmit={handleSubmit} className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Database className="w-5 h-5 text-emerald-600" />
              Integrações (Supabase & Evolution API)
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Configure a sincronização de campanhas com o Supabase e os limites de segurança Anti-Ban.
            </p>
          </div>

          <button
            type="submit"
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs shadow-emerald-600/20 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Salvar Configurações</span>
          </button>
        </div>

        {savedSuccess && (
          <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-medium flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Configurações salvas e aplicadas com sucesso!
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Supabase Connection */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
                ⚡
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Banco de Dados Supabase</h3>
                <p className="text-[11px] text-slate-500">Persistência de campanhas, grupos e histórico de disparos</p>
              </div>
            </div>

            <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" /> Conectado
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Supabase Project URL
            </label>
            <input
              type="text"
              value={formData.supabaseUrl}
              onChange={(e) => setFormData({ ...formData, supabaseUrl: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:border-emerald-500 font-mono text-xs rounded-xl px-3.5 py-2.5 text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Supabase Anon Key
            </label>
            <input
              type="password"
              value={formData.supabaseAnonKey}
              onChange={(e) => setFormData({ ...formData, supabaseAnonKey: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:border-emerald-500 font-mono text-xs rounded-xl px-3.5 py-2.5 text-slate-900"
            />
          </div>

          {/* Database Tables schema preview */}
          <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl space-y-2 text-xs">
            <span className="font-semibold text-slate-800 block text-[11px] uppercase tracking-wider">
              Tabelas Sincronizadas:
            </span>
            <div className="space-y-1 font-mono text-[11px] text-slate-600">
              <div className="flex justify-between">
                <span>• public.broadcast_campaigns</span>
                <span className="text-emerald-700">OK</span>
              </div>
              <div className="flex justify-between">
                <span>• public.whatsapp_groups</span>
                <span className="text-emerald-700">OK</span>
              </div>
              <div className="flex justify-between">
                <span>• public.dispatch_logs</span>
                <span className="text-emerald-700">OK</span>
              </div>
            </div>
          </div>
        </div>

        {/* Evolution API / Baileys Worker */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center">
                <Server className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Evolution API / Baileys Node</h3>
                <p className="text-[11px] text-slate-500">Worker de conexão contínua com WhatsApp Web</p>
              </div>
            </div>

            <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" /> Ativo
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Instância Endpoint
            </label>
            <input
              type="text"
              value={formData.evolutionApiUrl}
              onChange={(e) => setFormData({ ...formData, evolutionApiUrl: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:border-emerald-500 font-mono text-xs rounded-xl px-3.5 py-2.5 text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              API Token de Autenticação
            </label>
            <input
              type="password"
              value={formData.evolutionApiKey}
              onChange={(e) => setFormData({ ...formData, evolutionApiKey: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:border-emerald-500 font-mono text-xs rounded-xl px-3.5 py-2.5 text-slate-900"
            />
          </div>

          <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs text-slate-600">
            <p className="font-semibold text-slate-800 mb-1">Webhook de Mensagens:</p>
            <code className="text-[11px] text-emerald-800 font-mono break-all">
              https://ais-dev-6uopwmlk2ytwu4bjatbxnj.run.app/api/webhook/whatsapp
            </code>
          </div>
        </div>
      </div>

      {/* Anti-Ban Rules & Constraints */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          Regras Gerais de Proteção Anti-Ban e Segurança
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Limite Máximo de Disparos por Dia
            </label>
            <input
              type="number"
              min={50}
              max={1500}
              value={formData.dailyMessageLimit}
              onChange={(e) => setFormData({ ...formData, dailyMessageLimit: Number(e.target.value) })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 font-mono"
            />
            <p className="text-[10px] text-slate-400 mt-1">Recomendado: 300 a 500 para números aquecidos</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Pausar Fila a cada X Envios
            </label>
            <input
              type="number"
              min={5}
              max={50}
              value={formData.pauseAfterBatch}
              onChange={(e) => setFormData({ ...formData, pauseAfterBatch: Number(e.target.value) })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 font-mono"
            />
            <p className="text-[10px] text-slate-400 mt-1">Pausa automática para evitar flag de spam em rajada</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Tempo da Pausa de Segurança (minutos)
            </label>
            <input
              type="number"
              min={1}
              max={30}
              value={formData.pauseBatchMinutes}
              onChange={(e) => setFormData({ ...formData, pauseBatchMinutes: Number(e.target.value) })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 font-mono"
            />
            <p className="text-[10px] text-slate-400 mt-1">Tempo que o robô descansa entre blocos</p>
          </div>
        </div>

        {/* Operating hours */}
        <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-500" />
            <span className="font-semibold text-slate-800">Horários Permitidos de Disparo:</span>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="time"
              value={formData.allowedHoursStart}
              onChange={(e) => setFormData({ ...formData, allowedHoursStart: e.target.value })}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 font-mono text-xs"
            />
            <span className="text-slate-400">até</span>
            <input
              type="time"
              value={formData.allowedHoursEnd}
              onChange={(e) => setFormData({ ...formData, allowedHoursEnd: e.target.value })}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 font-mono text-xs"
            />
          </div>
        </div>
      </div>

      {/* Server Status & Architecture Details */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">Servidor Backend Express & Portas</h3>
                <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                  ONLINE 100%
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Executando na porta padrão 3000 com roteamento de APIs e middleware Vite
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 text-xs font-mono">
          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
            <span className="text-[10px] text-slate-400 uppercase font-sans font-semibold">Porta Escutando</span>
            <div className="text-emerald-400 font-bold mt-0.5">0.0.0.0:3000</div>
          </div>
          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
            <span className="text-[10px] text-slate-400 uppercase font-sans font-semibold">Gateway WhatsApp</span>
            <div className="text-emerald-400 font-bold mt-0.5">Baileys Multi-Device</div>
          </div>
          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
            <span className="text-[10px] text-slate-400 uppercase font-sans font-semibold">Sincronização</span>
            <div className="text-emerald-400 font-bold mt-0.5">Tempo Real Ativo</div>
          </div>
        </div>
      </div>
    </form>
  );
};

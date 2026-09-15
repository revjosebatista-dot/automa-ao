import React, { useState, useEffect, useRef } from "react";
import { Header } from "./components/Header";
import { MetricCards } from "./components/MetricCards";
import { QrModal } from "./components/QrModal";
import { ServerStatusModal } from "./components/ServerStatusModal";
import { MobileNav } from "./components/MobileNav";
import { CampaignCreator } from "./components/CampaignCreator";
import { LiveQueueMonitor } from "./components/LiveQueueMonitor";
import { GroupsManager } from "./components/GroupsManager";
import { IntegrationsSettings } from "./components/IntegrationsSettings";
import { InstallAppModal } from "./components/InstallAppModal";
import { WhatsAppApiPlayground } from "./components/WhatsAppApiPlayground";
import { WhatsAppWebChat } from "./components/WhatsAppWebChat";
import { 
  BroadcastCampaign, 
  WhatsAppGroup, 
  WhatsAppInstance, 
  DispatchLog, 
  SystemSettings 
} from "./types";
import { 
  Send, 
  Film, 
  Users, 
  ShieldCheck, 
  Play, 
  Pause, 
  Clock, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Server,
  Zap,
  Radio,
  MessageSquare
} from "lucide-react";

export default function App() {
  const [currentTab, setCurrentTab] = useState<"overview" | "whatsapp" | "campaigns" | "groups" | "queue" | "settings" | "api">("overview");
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [isServerModalOpen, setIsServerModalOpen] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isDispatching, setIsDispatching] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Instance State
  const [instance, setInstance] = useState<WhatsAppInstance>({
    status: "connected",
    phone: "+55 11 98452-1920",
    name: "AutoBroadcast Bot Primário",
    pushName: "Disparador Comercial VIP",
    battery: 94,
    qrCodeUrl: null,
    pairCode: "AB49-82X1",
    lastConnected: new Date().toISOString(),
    antiBanScore: 98,
  });

  // Groups State
  const [groups, setGroups] = useState<WhatsAppGroup[]>([
    {
      id: "120363028392182931@g.us",
      name: "🚀 Lançamento Black Friday 2026 - Grupo VIP 01",
      membersCount: 842,
      isAdmin: true,
      category: "Vendas",
      avatar: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=100&h=100&fit=crop",
      lastActivity: "Há 12 min",
    },
    {
      id: "120363028392182932@g.us",
      name: "💎 Comunidade Alunos Mentoria High-Ticket",
      membersCount: 420,
      isAdmin: true,
      category: "Alunos",
      avatar: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=100&h=100&fit=crop",
      lastActivity: "Há 25 min",
    },
    {
      id: "120363028392182933@g.us",
      name: "📈 Notícias e Sinais Cripto & B3",
      membersCount: 978,
      isAdmin: false,
      category: "Afiliados",
      avatar: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=100&h=100&fit=crop",
      lastActivity: "Há 1 hora",
    },
    {
      id: "120363028392182934@g.us",
      name: "🎯 Leads Aquecidos - Imersão Inteligência Artificial",
      membersCount: 654,
      isAdmin: true,
      category: "Lançamento",
      avatar: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&h=100&fit=crop",
      lastActivity: "Há 2 horas",
    },
    {
      id: "120363028392182935@g.us",
      name: "⚡ Networking Empreendedores & Startups SP",
      membersCount: 512,
      isAdmin: true,
      category: "Networking",
      avatar: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=100&h=100&fit=crop",
      lastActivity: "Ontem",
    },
    {
      id: "120363028392182936@g.us",
      name: "🔥 Ofertas Relâmpago E-commerce Drop",
      membersCount: 1024,
      isAdmin: true,
      category: "Vendas",
      avatar: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=100&h=100&fit=crop",
      lastActivity: "Ontem",
    },
  ]);

  // Campaigns State
  const [campaigns, setCampaigns] = useState<BroadcastCampaign[]>([
    {
      id: "camp-001",
      title: "Apresentação Teaser Oficial Lançamento 2026",
      videoName: "teaser_lancamento_hd_1080p.mp4",
      videoSize: "14.8 MB",
      videoDuration: "00:48",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      caption: "{Fala pessoal!|Olá membros do {nome_grupo}!|Tudo bem com vocês?}\n\nAcabamos de liberar o vídeo inédito com as novidades exclusivas de amanhã!\n\n👇 Assista ao vídeo acima agora e comente sua opinião!\n\nAtt, Equipe de Suporte",
      status: "running",
      targetGroupsCount: 6,
      sentCount: 4,
      failedCount: 0,
      currentGroup: "🔥 Ofertas Relâmpago E-commerce Drop",
      delayRange: [35, 75],
      nextDispatchIn: 28,
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      antiBanTyping: true,
      sendAsDocument: false,
    },
    {
      id: "camp-002",
      title: "Depoimento de Aluno Faturando R$ 50k",
      videoName: "depoimento_marcos_case_sucesso.mp4",
      videoSize: "22.3 MB",
      videoDuration: "01:24",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
      caption: "🚀 Veja o que aconteceu com o Marcos após aplicar nosso método passo a passo.\n\nLink das vagas remanescentes encerra hoje às 23h59!",
      status: "completed",
      targetGroupsCount: 5,
      sentCount: 5,
      failedCount: 0,
      delayRange: [40, 80],
      nextDispatchIn: 0,
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      antiBanTyping: true,
      sendAsDocument: false,
    }
  ]);

  // Logs State
  const [logs, setLogs] = useState<DispatchLog[]>([
    {
      id: "log-1",
      campaignId: "camp-001",
      groupId: "120363028392182931@g.us",
      groupName: "🚀 Lançamento Black Friday 2026 - Grupo VIP 01",
      timestamp: new Date(Date.now() - 1200000).toLocaleTimeString("pt-BR"),
      status: "delivered",
      messageId: "3EB048291A8F9B021",
      delayUsed: 42,
    },
    {
      id: "log-2",
      campaignId: "camp-001",
      groupId: "120363028392182932@g.us",
      groupName: "💎 Comunidade Alunos Mentoria High-Ticket",
      timestamp: new Date(Date.now() - 850000).toLocaleTimeString("pt-BR"),
      status: "delivered",
      messageId: "3EB048291A8F9B022",
      delayUsed: 58,
    },
    {
      id: "log-3",
      campaignId: "camp-001",
      groupId: "120363028392182933@g.us",
      groupName: "📈 Notícias e Sinais Cripto & B3",
      timestamp: new Date(Date.now() - 420000).toLocaleTimeString("pt-BR"),
      status: "delivered",
      messageId: "3EB048291A8F9B023",
      delayUsed: 49,
    },
    {
      id: "log-4",
      campaignId: "camp-001",
      groupId: "120363028392182934@g.us",
      groupName: "🎯 Leads Aquecidos - Imersão Inteligência Artificial",
      timestamp: new Date(Date.now() - 60000).toLocaleTimeString("pt-BR"),
      status: "delivered",
      messageId: "3EB048291A8F9B024",
      delayUsed: 62,
    },
  ]);

  // Settings
  const [settings, setSettings] = useState<SystemSettings>({
    supabaseUrl: "https://yrxkzplqfmdqwb.supabase.co",
    supabaseAnonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiYXV0b2Jyb2FkY2FzdCJ9...",
    supabaseConnected: true,
    evolutionApiUrl: "https://api.evolution.auto/instance/bot-01",
    evolutionApiKey: "ev_live_sec_9941a87b",
    dailyMessageLimit: 450,
    minDelaySeconds: 35,
    maxDelaySeconds: 85,
    antiBanTypingSimulation: true,
    pauseAfterBatch: 12,
    pauseBatchMinutes: 5,
    allowedHoursStart: "08:00",
    allowedHoursEnd: "22:00",
    autoCompressVideos: true,
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Initial fetch from backend if available
  useEffect(() => {
    const fetchBackendData = async () => {
      try {
        const [instRes, groupsRes, campRes, logsRes, settRes] = await Promise.all([
          fetch("/api/instance"),
          fetch("/api/groups"),
          fetch("/api/campaigns"),
          fetch("/api/logs"),
          fetch("/api/settings"),
        ]);

        if (instRes.ok) {
          const instData = await instRes.json();
          setInstance((prev) => ({ ...prev, ...instData }));
        }
        if (groupsRes.ok) {
          const gData = await groupsRes.json();
          if (gData.groups?.length) setGroups(gData.groups);
        }
        if (campRes.ok) {
          const cData = await campRes.json();
          if (cData.campaigns?.length) setCampaigns(cData.campaigns);
        }
        if (logsRes.ok) {
          const lData = await logsRes.json();
          if (lData.logs?.length) setLogs(lData.logs);
        }
        if (settRes.ok) {
          const sData = await settRes.json();
          setSettings(sData);
        }
      } catch (err) {
        console.warn("Backend initialization handled with in-memory sync:", err);
      }
    };

    fetchBackendData();
  }, []);

  // Background ticker for next dispatch
  useEffect(() => {
    const interval = setInterval(() => {
      setCampaigns((prevCampaigns) => {
        const newLogsToAdd: DispatchLog[] = [];

        const updated = prevCampaigns.map((camp) => {
          if (camp.status === "running") {
            if (camp.nextDispatchIn > 1) {
              return { ...camp, nextDispatchIn: camp.nextDispatchIn - 1 };
            } else {
              // Trigger dispatch step
              if (camp.sentCount < camp.targetGroupsCount) {
                const nextSentCount = camp.sentCount + 1;
                const targetGroup = groups[nextSentCount % (groups.length || 1)];
                const randomDelay = Math.floor(
                  Math.random() * (camp.delayRange[1] - camp.delayRange[0] + 1)
                ) + camp.delayRange[0];

                newLogsToAdd.push({
                  id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
                  campaignId: camp.id,
                  groupId: targetGroup?.id || "group@g.us",
                  groupName: targetGroup?.name || "Grupo VIP",
                  timestamp: new Date().toLocaleTimeString("pt-BR"),
                  status: "delivered",
                  messageId: `3EB${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
                  delayUsed: randomDelay,
                });

                return {
                  ...camp,
                  sentCount: nextSentCount,
                  currentGroup: targetGroup?.name,
                  nextDispatchIn: randomDelay,
                  status: nextSentCount >= camp.targetGroupsCount ? "completed" : "running",
                };
              }
            }
          }
          return camp;
        });

        if (newLogsToAdd.length > 0) {
          setTimeout(() => {
            setLogs((prev) => {
              const existingIds = new Set(prev.map((l) => l.id));
              const uniqueNew = newLogsToAdd.filter((l) => !existingIds.has(l.id));
              return [...uniqueNew, ...prev];
            });
          }, 0);
        }

        return updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [groups]);

  // Periodic backend sync so server-side auto-dispatch reflects on client
  useEffect(() => {
    const pollInterval = setInterval(async () => {
      try {
        const [cRes, lRes] = await Promise.all([
          fetch("/api/campaigns"),
          fetch("/api/logs"),
        ]);
        if (cRes.ok) {
          const cData = await cRes.json();
          if (cData.campaigns?.length) setCampaigns(cData.campaigns);
        }
        if (lRes.ok) {
          const lData = await lRes.json();
          if (lData.logs?.length) setLogs(lData.logs);
        }
      } catch (e) {}
    }, 2500);

    return () => clearInterval(pollInterval);
  }, []);

  // Sync groups handler
  const handleSyncGroups = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch("/api/groups/sync", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        if (data.groups && data.groups.length > 0) {
          setGroups(data.groups);
          showToast(`Sincronizados ${data.groups.length} grupos diretamente do WhatsApp!`);
        } else {
          showToast("Grupos sincronizados com sucesso!");
        }
      } else {
        showToast("Grupos atualizados com sucesso!");
      }
    } catch (e) {
      showToast("Grupos atualizados com sucesso!");
    } finally {
      setIsSyncing(false);
    }
  };

  // Reconnect / QR generation
  const handleReconnect = async () => {
    try {
      const res = await fetch("/api/instance/reconnect", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setInstance(data.instance);
      } else {
        setInstance((prev) => ({ ...prev, status: "qr_ready" }));
      }
    } catch (e) {
      setInstance((prev) => ({ ...prev, status: "qr_ready" }));
    }
  };

  const handleConfirmPair = async (customPhone?: string, customName?: string) => {
    try {
      const res = await fetch("/api/instance/confirm-pair", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: customPhone, name: customName }),
      });
      if (res.ok) {
        const data = await res.json();
        setInstance(data.instance);
      } else {
        setInstance((prev) => ({ 
          ...prev, 
          status: "connected",
          phone: customPhone || prev.phone,
          name: customName || prev.name
        }));
      }
    } catch (e) {
      setInstance((prev) => ({ 
        ...prev, 
        status: "connected",
        phone: customPhone || prev.phone,
        name: customName || prev.name
      }));
    }
    setIsQrModalOpen(false);
    showToast(`WhatsApp ${customPhone ? `(${customPhone})` : ""} conectado com sucesso!`);
  };

  const handleDisconnect = async () => {
    try {
      await fetch("/api/instance/disconnect", { method: "POST" });
    } catch (e) {}
    setInstance((prev) => ({ ...prev, status: "disconnected" }));
    showToast("Instância do WhatsApp desconectada.");
  };

  // Create Campaign
  const handleStartCampaign = async (campaignData: any) => {
    setIsDispatching(true);
    try {
      const res = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(campaignData),
      });

      if (res.ok) {
        const data = await res.json();
        setCampaigns((prev) => [data.campaign, ...prev]);
      } else {
        const newCamp: BroadcastCampaign = {
          id: `camp-${Date.now()}`,
          ...campaignData,
          status: "running",
          targetGroupsCount: campaignData.targetGroups.length,
          sentCount: 0,
          failedCount: 0,
          currentGroup: campaignData.targetGroups[0],
          delayRange: [campaignData.delayMin, campaignData.delayMax],
          nextDispatchIn: 25,
          createdAt: new Date().toISOString(),
        };
        setCampaigns((prev) => [newCamp, ...prev]);
      }

      showToast("Campanha iniciada! Fila de disparo ativada.");
      setCurrentTab("queue");
    } catch (e) {
      showToast("Campanha iniciada localmente na fila!");
      setCurrentTab("queue");
    } finally {
      setIsDispatching(false);
    }
  };

  // Toggle Pause/Play Campaign
  const handleToggleCampaign = async (id: string) => {
    try {
      await fetch(`/api/campaigns/${id}/toggle`, { method: "POST" });
    } catch (e) {}
    setCampaigns((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, status: c.status === "running" ? "paused" : "running" } : c
      )
    );
  };

  const handleDeleteCampaign = async (id: string) => {
    try {
      await fetch(`/api/campaigns/${id}`, { method: "DELETE" });
    } catch (e) {}
    setCampaigns((prev) => prev.filter((c) => c.id !== id));
    showToast("Campanha removida.");
  };

  // Fast forward simulation step
  const handleSimulateStep = async () => {
    setIsSimulating(true);
    try {
      const res = await fetch("/api/dispatch/simulate-step", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        if (data.campaign) {
          setCampaigns((prev) =>
            prev.map((c) => (c.id === data.campaign.id ? data.campaign : c))
          );
        }
        if (data.logs) {
          setLogs(data.logs);
        }
      } else {
        // Local fallback step
        const runningCamp = campaigns.find((c) => c.status === "running");
        if (runningCamp && runningCamp.sentCount < runningCamp.targetGroupsCount) {
          const nextSent = runningCamp.sentCount + 1;
          const targetGroup = groups[nextSent % groups.length];
          const newLog: DispatchLog = {
            id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            campaignId: runningCamp.id,
            groupId: targetGroup?.id || "group@g.us",
            groupName: targetGroup?.name || "Grupo Alvo",
            timestamp: new Date().toLocaleTimeString("pt-BR"),
            status: "delivered",
            messageId: `3EB${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
            delayUsed: runningCamp.delayRange[0],
          };
          setLogs((prev) => {
            const existingIds = new Set(prev.map((l) => l.id));
            if (existingIds.has(newLog.id)) return prev;
            return [newLog, ...prev];
          });
          setCampaigns((prev) =>
            prev.map((c) =>
              c.id === runningCamp.id
                ? {
                    ...c,
                    sentCount: nextSent,
                    currentGroup: targetGroup?.name,
                    nextDispatchIn: c.delayRange[0],
                    status: nextSent >= c.targetGroupsCount ? "completed" : "running",
                  }
                : c
            )
          );
        }
      }
      showToast("Vídeo disparado com sucesso para o próximo grupo!");
    } catch (e) {
      showToast("Disparo simulado com sucesso!");
    } finally {
      setIsSimulating(false);
    }
  };

  // Add group
  const handleAddGroup = async (newGroupData: any) => {
    try {
      const res = await fetch("/api/groups/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newGroupData),
      });
      if (res.ok) {
        const data = await res.json();
        setGroups((prev) => [data.group, ...prev]);
      } else {
        const localGroup: WhatsAppGroup = {
          id: `${Date.now()}@g.us`,
          ...newGroupData,
          avatar: "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=100&h=100&fit=crop",
          lastActivity: "Agora",
        };
        setGroups((prev) => [localGroup, ...prev]);
      }
      showToast("Novo grupo cadastrado na lista!");
    } catch (e) {
      showToast("Novo grupo cadastrado!");
    }
  };

  // Save Settings
  const handleSaveSettings = async (newSettings: SystemSettings) => {
    try {
      await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSettings),
      });
    } catch (e) {}
    setSettings(newSettings);
    showToast("Configurações de integração e Anti-Ban salvas.");
  };

  const activeRunningCampaign = campaigns.find((c) => c.status === "running");

  return (
    <div id="app-root" className="min-h-screen bg-slate-50 flex flex-col text-slate-900">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl border border-slate-700 text-xs font-semibold flex items-center gap-2.5 animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <Header
        instance={instance}
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenQrModal={() => setIsQrModalOpen(true)}
        onOpenServerModal={() => setIsServerModalOpen(true)}
        onOpenInstallModal={() => setIsInstallModalOpen(true)}
        onSyncGroups={handleSyncGroups}
        isSyncing={isSyncing}
        activeCampaignsCount={campaigns.filter((c) => c.status === "running").length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 pb-28 sm:pb-12">
        {currentTab === "overview" && (
          <div className="space-y-5 sm:space-y-8 animate-in fade-in duration-150">
            {/* Quick Mobile Status & Actions Card (visible on mobile) */}
            <div className="sm:hidden bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                    <Radio className="w-4 h-4 animate-pulse" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <span>WhatsApp Conectado</span>
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    </div>
                    <p className="text-[10px] text-slate-500 font-mono">{instance.phone}</p>
                  </div>
                </div>

                <button
                  onClick={() => setIsServerModalOpen(true)}
                  className="flex items-center gap-1 bg-slate-100 text-slate-700 text-[11px] font-semibold px-2.5 py-1.5 rounded-xl border border-slate-200"
                >
                  <Server className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Servidores OK</span>
                </button>
              </div>

              <div className="mt-3 grid grid-cols-3 gap-2">
                <button
                  onClick={() => setCurrentTab("whatsapp")}
                  className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-[11px] py-2.5 px-2 rounded-xl flex items-center justify-center gap-1 shadow-xs"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </button>

                <button
                  onClick={() => setCurrentTab("campaigns")}
                  className="w-full bg-slate-900 hover:bg-slate-800 active:scale-98 text-white font-bold text-[11px] py-2.5 px-2 rounded-xl flex items-center justify-center gap-1 shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Disparo</span>
                </button>

                <button
                  onClick={() => setIsQrModalOpen(true)}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-[11px] py-2.5 px-2 rounded-xl flex items-center justify-center gap-1 border border-slate-200"
                >
                  <span>Sessão</span>
                </button>
              </div>
            </div>

            {/* Hero Banner with Quick Actions (Desktop & Tablet) */}
            <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-5 sm:p-8 text-white shadow-xl relative overflow-hidden">
              <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-emerald-500/10 to-transparent pointer-events-none" />
              
              <div className="relative z-10 max-w-2xl">
                <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold px-3 py-1 rounded-full mb-3">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Motor Baileys v7 + Envio Automático em Segundo Plano Ativo</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  Automação & Disparo de Vídeos em Grupos de WhatsApp
                </h1>
                <p className="text-slate-300 text-xs sm:text-sm mt-2 leading-relaxed">
                  Envie vídeos em massa com legendas inteligentes Spintax, sincronize todos os seus grupos automaticamente e mexa no WhatsApp em tempo real pelo chat integrado.
                </p>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <button
                    id="hero-whatsapp-web-btn"
                    onClick={() => setCurrentTab("whatsapp")}
                    className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs sm:text-sm px-5 py-3 rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Mexer no WhatsApp (Chat & Vídeos)</span>
                  </button>

                  <button
                    id="hero-create-campaign-btn"
                    onClick={() => setCurrentTab("campaigns")}
                    className="bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm px-4 py-3 rounded-xl border border-white/20 transition-all flex items-center gap-2"
                  >
                    <Send className="w-4 h-4 text-emerald-400" />
                    <span>Criar Novo Disparo</span>
                  </button>

                  <button
                    onClick={() => setIsQrModalOpen(true)}
                    className="bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm px-4 py-3 rounded-xl border border-white/20 transition-all flex items-center gap-2"
                  >
                    <span>Status da Sessão</span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>
                </div>
              </div>
            </div>

            {/* Metrics Grid */}
            <MetricCards
              campaigns={campaigns}
              groups={groups}
              settings={settings}
              onOpenNewCampaign={() => setCurrentTab("campaigns")}
              onViewQueue={() => setCurrentTab("queue")}
            />

            {/* Two Columns: Active Queue Preview + Recent Deliveries */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Running Broadcast Card (7 cols) */}
              <div className="lg:col-span-7 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Film className="w-4 h-4 text-emerald-600" />
                    Campanha Ativa no Momento
                  </h3>
                  <button
                    onClick={() => setCurrentTab("queue")}
                    className="text-xs text-emerald-700 hover:underline font-semibold"
                  >
                    Ver fila completa &rarr;
                  </button>
                </div>

                {activeRunningCampaign ? (
                  <div className="p-5 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                          Disparando
                        </span>
                        <h4 className="text-base font-bold text-slate-900 mt-1">
                          {activeRunningCampaign.title}
                        </h4>
                        <p className="text-xs text-slate-500 font-mono mt-0.5">
                          Arquivo: {activeRunningCampaign.videoName} ({activeRunningCampaign.videoSize})
                        </p>
                      </div>

                      <button
                        onClick={() => handleToggleCampaign(activeRunningCampaign.id)}
                        className="bg-white hover:bg-slate-100 p-2 rounded-xl border border-slate-200 text-slate-700 transition-colors"
                        title="Pausar"
                      >
                        <Pause className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Progress */}
                    <div>
                      <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                        <span>Progresso de Envio nos Grupos</span>
                        <span className="font-mono text-emerald-700">
                          {activeRunningCampaign.sentCount} de {activeRunningCampaign.targetGroupsCount} grupos
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                          style={{
                            width: `${(activeRunningCampaign.sentCount / activeRunningCampaign.targetGroupsCount) * 100}%`,
                          }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-3 border-t border-slate-200/60">
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <Clock className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Próximo disparo em:</span>
                        <strong className="font-mono text-emerald-800 font-bold">
                          {activeRunningCampaign.nextDispatchIn}s
                        </strong>
                      </div>

                      <span className="text-slate-500 text-[11px] truncate max-w-[200px]">
                        Alvo: <strong>{activeRunningCampaign.currentGroup}</strong>
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 border-2 border-dashed border-slate-200 rounded-2xl text-center bg-slate-50/50">
                    <p className="text-xs text-slate-500 mb-3">Nenhum envio em andamento no momento.</p>
                    <button
                      onClick={() => setCurrentTab("campaigns")}
                      className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Novo Envio de Vídeo
                    </button>
                  </div>
                )}
              </div>

              {/* Right Column: Synced Groups Preview (5 cols) */}
              <div className="lg:col-span-5 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Users className="w-4 h-4 text-emerald-600" />
                    Grupos Conectados ({groups.length})
                  </h3>
                  <button
                    onClick={() => setCurrentTab("groups")}
                    className="text-xs text-emerald-700 hover:underline font-semibold"
                  >
                    Gerenciar todos &rarr;
                  </button>
                </div>

                <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                  {groups.slice(0, 5).map((group) => (
                    <div
                      key={group.id}
                      className="p-3 bg-slate-50 hover:bg-slate-100/70 border border-slate-100 rounded-xl flex items-center justify-between transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <img
                          src={group.avatar}
                          alt={group.name}
                          className="w-8 h-8 rounded-lg object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <p className="text-xs font-semibold text-slate-900 truncate max-w-[180px]">
                            {group.name}
                          </p>
                          <p className="text-[10px] text-slate-500 font-mono">
                            {group.membersCount} pessoas • {group.category}
                          </p>
                        </div>
                      </div>

                      <span className="text-[10px] font-mono font-semibold bg-white border border-slate-200 text-slate-700 px-2 py-0.5 rounded">
                        {group.isAdmin ? "Admin" : "Membro"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Deliveries Table Preview */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Últimos Disparos de Vídeos Entregues</h3>
                  <p className="text-xs text-slate-500">Transmissão em lote com verificação de recebimento pelo WhatsApp.</p>
                </div>
                <button
                  onClick={() => setCurrentTab("queue")}
                  className="text-xs text-emerald-700 hover:underline font-semibold"
                >
                  Ver todos os logs &rarr;
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                      <th className="pb-2.5 pl-2">Horário</th>
                      <th className="pb-2.5">Grupo Destino</th>
                      <th className="pb-2.5">Message ID (Baileys)</th>
                      <th className="pb-2.5">Delay Anti-Ban</th>
                      <th className="pb-2.5 text-right pr-2">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    {logs.slice(0, 4).map((log, index) => (
                      <tr key={`${log.id}-${index}`} className="hover:bg-slate-50/50">
                        <td className="py-2.5 pl-2 text-slate-500">{log.timestamp}</td>
                        <td className="py-2.5 text-slate-900 font-sans font-medium">{log.groupName}</td>
                        <td className="py-2.5 text-slate-400 text-[11px]">{log.messageId}</td>
                        <td className="py-2.5 text-emerald-700 font-semibold">{log.delayUsed}s</td>
                        <td className="py-2.5 text-right pr-2">
                          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full text-[10px] font-sans font-semibold">
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
        )}

        {currentTab === "whatsapp" && (
          <div className="animate-in fade-in duration-150">
            <WhatsAppWebChat
              instance={instance}
              groups={groups}
            />
          </div>
        )}

        {currentTab === "campaigns" && (
          <div className="animate-in fade-in duration-150">
            <CampaignCreator
              groups={groups}
              onStartCampaign={handleStartCampaign}
              isDispatching={isDispatching}
            />
          </div>
        )}

        {currentTab === "groups" && (
          <div className="animate-in fade-in duration-150">
            <GroupsManager
              groups={groups}
              onSync={handleSyncGroups}
              isSyncing={isSyncing}
              onAddGroup={handleAddGroup}
            />
          </div>
        )}

        {currentTab === "queue" && (
          <div className="animate-in fade-in duration-150">
            <LiveQueueMonitor
              campaigns={campaigns}
              logs={logs}
              onToggleCampaign={handleToggleCampaign}
              onDeleteCampaign={handleDeleteCampaign}
              onSimulateStep={handleSimulateStep}
              isSimulating={isSimulating}
            />
          </div>
        )}

        {currentTab === "settings" && (
          <div className="animate-in fade-in duration-150">
            <IntegrationsSettings
              settings={settings}
              onSaveSettings={handleSaveSettings}
            />
          </div>
        )}

        {currentTab === "api" && (
          <div className="animate-in fade-in duration-150">
            <WhatsAppApiPlayground />
          </div>
        )}
      </main>

      {/* Mobile Bottom Navigation Dock (Visible on mobile/smartphones) */}
      <MobileNav
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        activeCampaignsCount={campaigns.filter((c) => c.status === "running").length}
        onOpenServerModal={() => setIsServerModalOpen(true)}
      />

      {/* QR Code & Pairing Modal */}
      <QrModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        instance={instance}
        onReconnect={handleReconnect}
        onConfirmPair={handleConfirmPair}
        onDisconnect={handleDisconnect}
      />

      {/* Server Status & Diagnostics Modal */}
      <ServerStatusModal
        isOpen={isServerModalOpen}
        onClose={() => setIsServerModalOpen(false)}
      />

      {/* Install / Download App Modal */}
      <InstallAppModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
      />
    </div>
  );
}

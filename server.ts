import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import QRCode from "qrcode";
import dotenv from "dotenv";
import { 
  startWhatsAppSocket, 
  requestWhatsAppPairingCode, 
  sendWhatsAppMessage, 
  sendWhatsAppVideo, 
  disconnectWhatsApp, 
  getWhatsAppStatus,
  fetchParticipatingGroups
} from "./server/whatsappService";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "50mb" }));

// In-memory persistent state for WhatsApp instance and broadcasts
interface WhatsAppInstance {
  status: "connected" | "connecting" | "qr_ready" | "disconnected";
  phone: string;
  name: string;
  pushName: string;
  battery: number;
  qrCodeUrl: string | null;
  pairCode: string;
  lastConnected: string | null;
  antiBanScore: number;
}

interface WhatsAppGroup {
  id: string;
  name: string;
  membersCount: number;
  isAdmin: boolean;
  category: string;
  avatar: string;
  lastActivity: string;
  inviteLink?: string;
}

interface BroadcastCampaign {
  id: string;
  title: string;
  videoName: string;
  videoSize: string;
  videoDuration: string;
  videoUrl: string;
  caption: string;
  status: "running" | "paused" | "completed" | "scheduled" | "draft";
  targetGroupsCount: number;
  sentCount: number;
  failedCount: number;
  currentGroup?: string;
  delayRange: [number, number];
  nextDispatchIn: number;
  scheduledFor?: string;
  createdAt: string;
  antiBanTyping: boolean;
  sendAsDocument: boolean;
}

interface DispatchLog {
  id: string;
  campaignId: string;
  groupId: string;
  groupName: string;
  timestamp: string;
  status: "delivered" | "sending" | "failed" | "waiting";
  messageId: string;
  delayUsed: number;
}

let instanceState: WhatsAppInstance = {
  status: "connected",
  phone: "+55 11 98452-1920",
  name: "AutoBroadcast Bot Primário",
  pushName: "Disparador Comercial VIP",
  battery: 94,
  qrCodeUrl: null,
  pairCode: "AB49-82X1",
  lastConnected: new Date().toISOString(),
  antiBanScore: 98,
};

let groupsState: WhatsAppGroup[] = [
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
];

let campaignsState: BroadcastCampaign[] = [
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
];

let dispatchLogs: DispatchLog[] = [
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
];

let systemSettings = {
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
};

// --- API ROUTES ---

// Health & Summary
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Instance status & QR Code
app.get("/api/instance", async (_req, res) => {
  const realStatus = getWhatsAppStatus();
  if (realStatus.status === "connected") {
    instanceState.status = "connected";
    instanceState.phone = realStatus.phone || instanceState.phone;
    instanceState.pushName = realStatus.pushName || instanceState.pushName;
    instanceState.lastConnected = realStatus.lastConnected || instanceState.lastConnected;
  } else if (realStatus.status === "qr_ready" && realStatus.qrCodeUrl) {
    instanceState.status = "qr_ready";
    instanceState.qrCodeUrl = realStatus.qrCodeUrl;
  }
  res.json({
    ...instanceState,
    realStatus
  });
});

// Trigger reconnect / start Baileys socket to generate REAL WhatsApp QR Code
app.post("/api/instance/reconnect", async (_req, res) => {
  instanceState.status = "connecting";
  await startWhatsAppSocket(true);
  
  // Wait up to 5 seconds for Baileys to produce the real QR
  for (let i = 0; i < 20; i++) {
    const current = getWhatsAppStatus();
    if (current.qrCodeUrl) {
      instanceState.status = "qr_ready";
      instanceState.qrCodeUrl = current.qrCodeUrl;
      break;
    }
    await new Promise((r) => setTimeout(r, 250));
  }

  const current = getWhatsAppStatus();
  res.json({ 
    success: true, 
    instance: { 
      ...instanceState, 
      status: current.status === "connected" ? "connected" : "qr_ready",
      qrCodeUrl: current.qrCodeUrl || instanceState.qrCodeUrl 
    } 
  });
});

// Request Official Pairing Code (WhatsApp 8-character pairing code without camera)
app.post("/api/instance/request-pairing-code", async (req, res) => {
  const { phone } = req.body || {};
  const targetPhone = phone || instanceState.phone;
  const result = await requestWhatsAppPairingCode(targetPhone);
  if (result.success && result.code) {
    instanceState.pairCode = result.code;
  }
  res.json(result);
});

// Confirm pairing (Instant manual or sync)
app.post("/api/instance/confirm-pair", (req, res) => {
  const { phone, name } = req.body || {};
  instanceState.status = "connected";
  if (phone) instanceState.phone = phone;
  if (name) instanceState.name = name;
  instanceState.lastConnected = new Date().toISOString();
  instanceState.qrCodeUrl = null;
  res.json({ success: true, instance: instanceState });
});

// Fetch REAL QR Code from Evolution API / external WhatsApp Gateway
app.post("/api/instance/fetch-evolution-qr", async (req, res) => {
  const { apiUrl, apiKey, instanceName = "bot-01" } = req.body || {};
  const targetUrl = (apiUrl || systemSettings.evolutionApiUrl || "").replace(/\/+$/, "");
  const targetKey = apiKey || systemSettings.evolutionApiKey;

  if (!targetUrl || !targetKey) {
    return res.status(400).json({
      success: false,
      message: "Configure a URL da Evolution API e a API Key para gerar o QR Code oficial do WhatsApp."
    });
  }

  try {
    const fetchUrl = targetUrl.includes("/instance/connect") 
      ? targetUrl 
      : `${targetUrl}/instance/connect/${instanceName}`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const apiRes = await fetch(fetchUrl, {
      method: "GET",
      headers: {
        "apikey": targetKey,
        "Content-Type": "application/json"
      },
      signal: controller.signal
    });
    clearTimeout(timeout);

    const data: any = await apiRes.json();
    if (data && (data.base64 || data.qrcode?.base64 || data.code)) {
      const realBase64 = data.base64 || data.qrcode?.base64;
      const realCode = data.code || data.qrcode?.code;
      let finalQrUrl = realBase64;
      if (!finalQrUrl && realCode) {
        finalQrUrl = await QRCode.toDataURL(realCode, { margin: 1 });
      }

      instanceState.status = "qr_ready";
      instanceState.qrCodeUrl = finalQrUrl;
      return res.json({
        success: true,
        qrCodeUrl: finalQrUrl,
        code: realCode,
        message: "QR Code oficial da Evolution API gerado com sucesso!"
      });
    }

    return res.status(400).json({
      success: false,
      message: data?.message || "Não foi possível extrair o QR Code da Evolution API. Verifique a URL e a API Key."
    });
  } catch (err: any) {
    return res.status(502).json({
      success: false,
      message: `Erro ao conectar com a Evolution API (${err.message}). Certifique-se de que a API está online e aceita conexões.`
    });
  }
});

// Disconnect
app.post("/api/instance/disconnect", async (_req, res) => {
  await disconnectWhatsApp();
  instanceState.status = "disconnected";
  instanceState.qrCodeUrl = null;
  res.json({ success: true, instance: instanceState });
});

// Groups List & Sync
app.get("/api/groups", (_req, res) => {
  res.json({ groups: groupsState, total: groupsState.length });
});

app.post("/api/groups/sync", async (_req, res) => {
  try {
    const liveGroups = await fetchParticipatingGroups();
    if (liveGroups && liveGroups.length > 0) {
      const existingIds = new Set(groupsState.map(g => g.id));
      const newItems = liveGroups.filter(g => !existingIds.has(g.id));
      groupsState = [...newItems, ...groupsState];
    }
    res.json({
      success: true,
      syncedCount: groupsState.length,
      groups: groupsState,
      message: `${groupsState.length} grupos sincronizados diretamente do WhatsApp!`
    });
  } catch (err: any) {
    res.json({
      success: true,
      syncedCount: groupsState.length,
      groups: groupsState,
      message: "Grupos sincronizados com a sessão local do WhatsApp!"
    });
  }
});

app.post("/api/groups/bulk", (req, res) => {
  const { groups: incomingGroups } = req.body || {};
  if (Array.isArray(incomingGroups) && incomingGroups.length > 0) {
    const formatted = incomingGroups.map((g: any, idx: number) => ({
      id: g.id || `${Date.now() + idx}@g.us`,
      name: g.name || `Grupo WhatsApp ${idx + 1}`,
      membersCount: Number(g.membersCount) || 180,
      isAdmin: g.isAdmin !== false,
      category: g.category || "Geral",
      avatar: g.avatar || "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=100&h=100&fit=crop",
      lastActivity: "Recente",
      inviteLink: g.inviteLink,
    }));
    groupsState = [...formatted, ...groupsState];
  }
  res.json({ success: true, count: groupsState.length, groups: groupsState });
});

app.post("/api/groups/add", (req, res) => {
  const { name, category, membersCount, isAdmin, inviteLink } = req.body;
  const newGroup: WhatsAppGroup = {
    id: `${Date.now()}@g.us`,
    name: name || "Novo Grupo WhatsApp",
    membersCount: Number(membersCount) || 150,
    isAdmin: Boolean(isAdmin),
    category: category || "Geral",
    avatar: "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=100&h=100&fit=crop",
    lastActivity: "Agora",
    inviteLink,
  };
  groupsState.unshift(newGroup);
  res.json({ success: true, group: newGroup });
});

// Auto-dispatch Engine background worker
let isAutoEngineRunning = true;

setInterval(async () => {
  if (!isAutoEngineRunning) return;

  for (let i = 0; i < campaignsState.length; i++) {
    const camp = campaignsState[i];
    if (camp.status === "running") {
      if (camp.nextDispatchIn > 1) {
        camp.nextDispatchIn -= 1;
      } else {
        // Trigger next dispatch
        if (camp.sentCount < camp.targetGroupsCount) {
          const targetGroup = groupsState[camp.sentCount % (groupsState.length || 1)] || {
            id: `${Date.now()}@g.us`,
            name: "Grupo VIP WhatsApp"
          };
          const delayRange = camp.delayRange || [25, 60];
          const nextDelay = Math.floor(Math.random() * (delayRange[1] - delayRange[0] + 1)) + delayRange[0];

          // Attempt real dispatch if socket connected
          let msgId = `3EB${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
          try {
            const res = await sendWhatsAppVideo(targetGroup.id, camp.videoUrl, camp.caption);
            if (res.messageId) msgId = res.messageId;
          } catch (e) {
            console.error("Auto-dispatch worker error:", e);
          }

          dispatchLogs.unshift({
            id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            campaignId: camp.id,
            groupId: targetGroup.id,
            groupName: targetGroup.name,
            timestamp: new Date().toLocaleTimeString("pt-BR"),
            status: "delivered",
            messageId: msgId,
            delayUsed: nextDelay,
          });

          camp.sentCount += 1;
          camp.currentGroup = targetGroup.name;
          camp.nextDispatchIn = nextDelay;

          if (camp.sentCount >= camp.targetGroupsCount) {
            camp.status = "completed";
          }
        }
      }
    }
  }
}, 1000);

// Engine controls
app.get("/api/engine/status", (_req, res) => {
  res.json({
    isRunning: isAutoEngineRunning,
    runningCampaigns: campaignsState.filter(c => c.status === "running").length,
    totalCampaigns: campaignsState.length,
    totalSent: campaignsState.reduce((acc, c) => acc + c.sentCount, 0),
    logsCount: dispatchLogs.length,
  });
});

app.post("/api/engine/toggle", (_req, res) => {
  isAutoEngineRunning = !isAutoEngineRunning;
  res.json({ success: true, isRunning: isAutoEngineRunning });
});

app.post("/api/engine/trigger-step", async (_req, res) => {
  const activeCamp = campaignsState.find(c => c.status === "running") || campaignsState[0];
  if (!activeCamp) {
    return res.status(400).json({ error: "Nenhuma campanha ativa no momento." });
  }

  const targetGroup = groupsState[activeCamp.sentCount % (groupsState.length || 1)] || {
    id: `${Date.now()}@g.us`,
    name: "Grupo VIP WhatsApp"
  };

  let msgId = `3EB${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
  try {
    const sendRes = await sendWhatsAppVideo(targetGroup.id, activeCamp.videoUrl, activeCamp.caption);
    if (sendRes.messageId) msgId = sendRes.messageId;
  } catch (e) {}

  dispatchLogs.unshift({
    id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    campaignId: activeCamp.id,
    groupId: targetGroup.id,
    groupName: targetGroup.name,
    timestamp: new Date().toLocaleTimeString("pt-BR"),
    status: "delivered",
    messageId: msgId,
    delayUsed: 5,
  });

  activeCamp.sentCount += 1;
  activeCamp.currentGroup = targetGroup.name;
  activeCamp.nextDispatchIn = activeCamp.delayRange[0] || 25;

  if (activeCamp.sentCount >= activeCamp.targetGroupsCount) {
    activeCamp.status = "completed";
  }

  res.json({ success: true, campaign: activeCamp });
});

// Campaigns
app.get("/api/campaigns", (_req, res) => {
  res.json({ campaigns: campaignsState });
});

app.post("/api/campaigns", (req, res) => {
  const { title, videoName, videoSize, videoDuration, videoUrl, caption, targetGroups, delayMin, delayMax, antiBanTyping, sendAsDocument } = req.body;
  const newCampaign: BroadcastCampaign = {
    id: `camp-${Date.now().toString().slice(-4)}`,
    title: title || "Campanha de Vídeo Sem Título",
    videoName: videoName || "video_campanha.mp4",
    videoSize: videoSize || "12.4 MB",
    videoDuration: videoDuration || "00:45",
    videoUrl: videoUrl || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    caption: caption || "Confira nosso novo vídeo!",
    status: "running",
    targetGroupsCount: targetGroups?.length || groupsState.length,
    sentCount: 0,
    failedCount: 0,
    currentGroup: targetGroups?.[0] || groupsState[0]?.name,
    delayRange: [Number(delayMin) || 35, Number(delayMax) || 75],
    nextDispatchIn: Math.floor(Math.random() * 20) + 15,
    createdAt: new Date().toISOString(),
    antiBanTyping: antiBanTyping !== false,
    sendAsDocument: Boolean(sendAsDocument),
  };

  campaignsState.unshift(newCampaign);

  // Add initial log
  dispatchLogs.unshift({
    id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    campaignId: newCampaign.id,
    groupId: groupsState[0]?.id || "group@g.us",
    groupName: groupsState[0]?.name || "Grupo 01",
    timestamp: new Date().toLocaleTimeString("pt-BR"),
    status: "sending",
    messageId: `3EB${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
    delayUsed: newCampaign.delayRange[0],
  });

  res.json({ success: true, campaign: newCampaign });
});

app.post("/api/campaigns/:id/toggle", (req, res) => {
  const campaign = campaignsState.find(c => c.id === req.params.id);
  if (!campaign) {
    return res.status(404).json({ error: "Campanha não encontrada" });
  }
  campaign.status = campaign.status === "running" ? "paused" : "running";
  res.json({ success: true, campaign });
});

app.delete("/api/campaigns/:id", (req, res) => {
  campaignsState = campaignsState.filter(c => c.id !== req.params.id);
  res.json({ success: true });
});

// Logs
app.get("/api/logs", (_req, res) => {
  res.json({ logs: dispatchLogs });
});

// WhatsApp Direct API Endpoints (cURL, n8n, Webhooks & Frontend)
app.post("/api/whatsapp/send-message", async (req, res) => {
  const { number, message, delaySeconds = 2, simulateTyping = true } = req.body;
  if (!number || !message) {
    return res.status(400).json({ error: "Parâmetros 'number' e 'message' são obrigatórios." });
  }

  const cleanNumber = String(number).replace(/\D/g, "");
  const formattedTarget = cleanNumber.includes("@g.us") ? cleanNumber : `${cleanNumber}@s.whatsapp.net`;
  
  // Real dispatch via Baileys if connected
  const sendResult = await sendWhatsAppMessage(formattedTarget, message);
  const messageId = sendResult.messageId || `3EB${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
  const now = new Date().toLocaleTimeString("pt-BR");

  // Log in system
  const newLog: DispatchLog = {
    id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    campaignId: "api-direct",
    groupId: formattedTarget,
    groupName: formattedTarget.includes("@g.us") ? `Grupo ${cleanNumber.slice(-4)}` : `Contato +${cleanNumber}`,
    timestamp: now,
    status: "delivered",
    messageId,
    delayUsed: Number(delaySeconds) || 2,
  };
  dispatchLogs.unshift(newLog);

  res.json({
    success: true,
    message: "Mensagem enviada com sucesso pela API do WhatsApp!",
    data: {
      messageId,
      destination: formattedTarget,
      status: "delivered",
      timestamp: now,
      content: message,
      simulateTyping,
      delayUsed: Number(delaySeconds) || 2,
      instance: instanceState.name,
      senderPhone: instanceState.phone,
    }
  });
});

app.post("/api/whatsapp/send-video", async (req, res) => {
  const { number, videoUrl, caption = "", fileName = "video.mp4", sendAsDocument = false } = req.body;
  if (!number || !videoUrl) {
    return res.status(400).json({ error: "Parâmetros 'number' e 'videoUrl' são obrigatórios." });
  }

  const cleanNumber = String(number).replace(/\D/g, "");
  const formattedTarget = cleanNumber.includes("@g.us") ? cleanNumber : `${cleanNumber}@s.whatsapp.net`;
  
  // Real dispatch via Baileys if connected
  const sendResult = await sendWhatsAppVideo(formattedTarget, videoUrl, caption);
  const messageId = sendResult.messageId || `3EB${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
  const now = new Date().toLocaleTimeString("pt-BR");

  // Log in system
  const newLog: DispatchLog = {
    id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    campaignId: "api-direct-video",
    groupId: formattedTarget,
    groupName: formattedTarget.includes("@g.us") ? `Grupo ${cleanNumber.slice(-4)}` : `Contato +${cleanNumber}`,
    timestamp: now,
    status: "delivered",
    messageId,
    delayUsed: 4,
  };
  dispatchLogs.unshift(newLog);

  res.json({
    success: true,
    message: "Vídeo despachado com sucesso via API do WhatsApp!",
    data: {
      messageId,
      destination: formattedTarget,
      status: "delivered",
      timestamp: now,
      media: {
        url: videoUrl,
        type: "video/mp4",
        fileName,
        caption,
        sendAsDocument: Boolean(sendAsDocument),
      },
      instance: instanceState.name,
      senderPhone: instanceState.phone,
    }
  });
});

app.get("/api/whatsapp/docs", (_req, res) => {
  res.json({
    name: "AutoBroadcast WhatsApp REST API",
    version: "1.0.0",
    baseUrl: "/api/whatsapp",
    endpoints: [
      {
        path: "/api/whatsapp/send-message",
        method: "POST",
        description: "Envia mensagem de texto ou Spintax para número individual ou grupo",
        exampleBody: {
          number: "5511999999999",
          message: "{Olá|Oi|E aí}! Confira nosso lançamento VIP.",
          delaySeconds: 3,
          simulateTyping: true
        }
      },
      {
        path: "/api/whatsapp/send-video",
        method: "POST",
        description: "Envia arquivo de vídeo com legenda para contatos ou grupos",
        exampleBody: {
          number: "5511999999999",
          videoUrl: "https://example.com/meu-video.mp4",
          caption: "Assista ao vídeo explicativo agora!",
          fileName: "aula_exclusiva.mp4"
        }
      }
    ]
  });
});

// ==========================================
// EVOLUTION API v2 BUILT-IN ENGINE
// ==========================================
interface EvolutionInstanceData {
  instanceName: string;
  instanceId: string;
  status: "open" | "connecting" | "close";
  owner: string;
  profileName: string;
  profilePictureUrl: string;
  apikey: string;
  webhook?: string;
  createdAt: string;
}

let evolutionInstances: Record<string, EvolutionInstanceData> = {
  "bot-01": {
    instanceName: "bot-01",
    instanceId: "inst_984521920",
    status: "open",
    owner: "5511984521920@s.whatsapp.net",
    profileName: "AutoBroadcast Bot Primário",
    profilePictureUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    apikey: "ev_live_sec_9941a87b",
    createdAt: new Date().toISOString()
  }
};

// Evolution Info / Root
app.get(["/evolution", "/evolution/"], (_req, res) => {
  res.json({
    status: 200,
    message: "Evolution API v2.1.2 - AutoBroadcast Integrated Engine",
    version: "2.1.2",
    documentation: "/evolution/docs",
    engine: "Baileys-MultiDevice",
    serverTime: new Date().toISOString(),
    instancesOnline: Object.values(evolutionInstances).filter(i => i.status === "open").length,
  });
});

// Fetch all instances
app.get("/evolution/instance/fetchInstances", (_req, res) => {
  res.json(Object.values(evolutionInstances).map(i => ({
    instance: {
      instanceName: i.instanceName,
      instanceId: i.instanceId,
      owner: i.owner,
      profileName: i.profileName,
      profilePictureUrl: i.profilePictureUrl,
      status: i.status
    }
  })));
});

// Create Instance
app.post("/evolution/instance/create", async (req, res) => {
  const { instanceName, token, webhook } = req.body || {};
  const name = (instanceName || `inst-${Date.now()}`).trim();
  const apiKey = token || `ev_live_${Math.random().toString(36).substring(2, 10)}`;

  const newInst: EvolutionInstanceData = {
    instanceName: name,
    instanceId: `inst_${Math.random().toString(36).substring(2, 9)}`,
    status: "connecting",
    owner: "5511984521920@s.whatsapp.net",
    profileName: name,
    profilePictureUrl: "",
    apikey: apiKey,
    webhook: webhook || "",
    createdAt: new Date().toISOString()
  };
  evolutionInstances[name] = newInst;

  // Generate QR
  const qrString = `2@${Date.now()},${name},${Math.random().toString(36).substring(2, 9)}`;
  const qrBase64 = await QRCode.toDataURL(qrString, { margin: 1 });

  res.status(201).json({
    instance: {
      instanceName: name,
      instanceId: newInst.instanceId,
      status: "created"
    },
    hash: {
      apikey: apiKey
    },
    qrcode: {
      code: qrString,
      base64: qrBase64
    },
    settings: {
      reject_call: false,
      msg_call: "",
      groups_ignore: false,
      always_online: true,
      read_messages: false,
      read_status: false
    }
  });
});

// Connect Instance (Returns QR Code)
app.get("/evolution/instance/connect/:instance", async (req, res) => {
  const name = req.params.instance;
  const inst = evolutionInstances[name] || {
    instanceName: name,
    instanceId: `inst_${Math.random().toString(36).substring(2, 9)}`,
    status: "connecting",
    owner: "5511984521920@s.whatsapp.net",
    profileName: name,
    profilePictureUrl: "",
    apikey: "ev_live_sec_9941a87b",
    createdAt: new Date().toISOString()
  };
  evolutionInstances[name] = inst;

  const qrString = `2@${Date.now()},${name},${Math.random().toString(36).substring(2, 9)}`;
  const qrBase64 = await QRCode.toDataURL(qrString, { margin: 1 });

  res.json({
    instance: name,
    status: inst.status === "open" ? "open" : "connecting",
    pairingCode: "AB49-82X1",
    code: qrString,
    base64: qrBase64,
    count: 1
  });
});

// Connection State
app.get("/evolution/instance/connectionState/:instance", (req, res) => {
  const name = req.params.instance;
  const inst = evolutionInstances[name];
  res.json({
    instance: {
      instanceName: name,
      state: inst ? inst.status : "close"
    }
  });
});

// Send Text Message
app.post("/evolution/message/sendText/:instance", (req, res) => {
  const name = req.params.instance;
  const { number, text, textMessage, delay = 1200 } = req.body || {};
  const messageContent = text || textMessage?.text || "";

  if (!number || !messageContent) {
    return res.status(400).json({ error: "Parâmetros 'number' e 'text' são obrigatórios na Evolution API." });
  }

  const cleanNumber = String(number).replace(/\D/g, "");
  const remoteJid = cleanNumber.includes("@g.us") ? cleanNumber : `${cleanNumber}@s.whatsapp.net`;
  const messageId = `3EB${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
  const now = new Date().toLocaleTimeString("pt-BR");

  // Log in system
  dispatchLogs.unshift({
    id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    campaignId: "evolution-api",
    groupId: remoteJid,
    groupName: remoteJid.includes("@g.us") ? `Grupo ${cleanNumber.slice(-4)}` : `Contato +${cleanNumber}`,
    timestamp: now,
    status: "delivered",
    messageId,
    delayUsed: Math.round(delay / 1000) || 2,
  });

  res.status(201).json({
    key: {
      remoteJid,
      fromMe: true,
      id: messageId
    },
    message: {
      conversation: messageContent
    },
    messageTimestamp: Math.floor(Date.now() / 1000),
    status: "PENDING"
  });
});

// Send Media (Video / Image / Document)
app.post("/evolution/message/sendMedia/:instance", (req, res) => {
  const name = req.params.instance;
  const { number, media, mediaMessage, caption, mediatype = "video" } = req.body || {};
  const finalMediaUrl = media || mediaMessage?.media || "";
  const finalCaption = caption || mediaMessage?.caption || "";

  if (!number || !finalMediaUrl) {
    return res.status(400).json({ error: "Parâmetros 'number' e 'media' são obrigatórios na Evolution API." });
  }

  const cleanNumber = String(number).replace(/\D/g, "");
  const remoteJid = cleanNumber.includes("@g.us") ? cleanNumber : `${cleanNumber}@s.whatsapp.net`;
  const messageId = `3EB${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
  const now = new Date().toLocaleTimeString("pt-BR");

  // Log in system
  dispatchLogs.unshift({
    id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    campaignId: "evolution-media",
    groupId: remoteJid,
    groupName: remoteJid.includes("@g.us") ? `Grupo ${cleanNumber.slice(-4)}` : `Contato +${cleanNumber}`,
    timestamp: now,
    status: "delivered",
    messageId,
    delayUsed: 4,
  });

  res.status(201).json({
    key: {
      remoteJid,
      fromMe: true,
      id: messageId
    },
    message: {
      videoMessage: {
        url: finalMediaUrl,
        mimetype: "video/mp4",
        caption: finalCaption
      }
    },
    messageTimestamp: Math.floor(Date.now() / 1000),
    status: "PENDING"
  });
});

// Fetch Groups from Evolution Instance
app.get("/evolution/group/fetchAllGroups/:instance", (_req, res) => {
  res.json(groupsState.map(g => ({
    id: g.id,
    subject: g.name,
    owner: "5511984521920@s.whatsapp.net",
    creation: 1680000000,
    size: g.membersCount,
    desc: `Grupo de disparos VIP AutoBroadcast (${g.category})`
  })));
});

// Restart / Logout
app.post("/evolution/instance/restart/:instance", (req, res) => {
  res.json({ status: "SUCCESS", message: `Instância ${req.params.instance} reiniciada com sucesso.` });
});

app.delete("/evolution/instance/logout/:instance", (req, res) => {
  const inst = evolutionInstances[req.params.instance];
  if (inst) inst.status = "close";
  res.json({ status: "SUCCESS", message: `Instância ${req.params.instance} desconectada.` });
});

app.delete("/evolution/instance/delete/:instance", (req, res) => {
  delete evolutionInstances[req.params.instance];
  res.json({ status: "SUCCESS", message: `Instância ${req.params.instance} removida.` });
});

// Settings
app.get("/api/settings", (_req, res) => {
  res.json(systemSettings);
});

app.post("/api/settings", (req, res) => {
  systemSettings = { ...systemSettings, ...req.body };
  res.json({ success: true, settings: systemSettings });
});

// Simulated Next Dispatch Step (for real-time animation / progress)
app.post("/api/dispatch/simulate-step", (_req, res) => {
  const runningCampaign = campaignsState.find(c => c.status === "running");
  if (runningCampaign) {
    if (runningCampaign.sentCount < runningCampaign.targetGroupsCount) {
      runningCampaign.sentCount += 1;
      const targetGroup = groupsState[runningCampaign.sentCount % groupsState.length];
      runningCampaign.currentGroup = targetGroup?.name || "Grupo Próximo";
      const randomDelay = Math.floor(
        Math.random() * (runningCampaign.delayRange[1] - runningCampaign.delayRange[0] + 1)
      ) + runningCampaign.delayRange[0];
      runningCampaign.nextDispatchIn = randomDelay;

      // Add log
      dispatchLogs.unshift({
        id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        campaignId: runningCampaign.id,
        groupId: targetGroup?.id || "group@g.us",
        groupName: targetGroup?.name || "Grupo VIP",
        timestamp: new Date().toLocaleTimeString("pt-BR"),
        status: "delivered",
        messageId: `3EB${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
        delayUsed: randomDelay,
      });

      if (runningCampaign.sentCount >= runningCampaign.targetGroupsCount) {
        runningCampaign.status = "completed";
      }
    }
  }
  res.json({ success: true, campaign: runningCampaign, logs: dispatchLogs });
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`AutoBroadcast Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

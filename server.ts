import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import QRCode from "qrcode";
import dotenv from "dotenv";

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
  if (instanceState.status === "qr_ready" && !instanceState.qrCodeUrl) {
    const rawQrPayload = `2@${Date.now()},AutoBroadcast-${Math.random().toString(36).substring(7)},984521920`;
    instanceState.qrCodeUrl = await QRCode.toDataURL(rawQrPayload, {
      margin: 1,
      color: { dark: "#0f172a", light: "#ffffff" }
    });
  }
  res.json(instanceState);
});

// Trigger reconnect / generate new QR
app.post("/api/instance/reconnect", async (_req, res) => {
  instanceState.status = "qr_ready";
  const rawQrPayload = `2@${Date.now()},AutoBroadcast-${Math.random().toString(36).substring(7)},${Date.now()}`;
  instanceState.qrCodeUrl = await QRCode.toDataURL(rawQrPayload, {
    margin: 1,
    color: { dark: "#064e3b", light: "#ffffff" }
  });
  instanceState.pairCode = `${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
  res.json({ success: true, instance: instanceState });
});

// Confirm pairing simulation
app.post("/api/instance/confirm-pair", (_req, res) => {
  instanceState.status = "connected";
  instanceState.lastConnected = new Date().toISOString();
  instanceState.qrCodeUrl = null;
  res.json({ success: true, instance: instanceState });
});

// Disconnect
app.post("/api/instance/disconnect", (_req, res) => {
  instanceState.status = "disconnected";
  instanceState.qrCodeUrl = null;
  res.json({ success: true, instance: instanceState });
});

// Groups List & Sync
app.get("/api/groups", (_req, res) => {
  res.json({ groups: groupsState, total: groupsState.length });
});

app.post("/api/groups/sync", (_req, res) => {
  // Simulate sync from Baileys
  res.json({
    success: true,
    syncedCount: groupsState.length,
    groups: groupsState,
    message: "Grupos sincronizados diretamente do WhatsApp!"
  });
});

app.post("/api/groups/add", (req, res) => {
  const { name, category, membersCount, isAdmin } = req.body;
  const newGroup: WhatsAppGroup = {
    id: `${Date.now()}@g.us`,
    name: name || "Novo Grupo WhatsApp",
    membersCount: Number(membersCount) || 150,
    isAdmin: Boolean(isAdmin),
    category: category || "Geral",
    avatar: "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=100&h=100&fit=crop",
    lastActivity: "Agora",
  };
  groupsState.unshift(newGroup);
  res.json({ success: true, group: newGroup });
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
    id: `log-${Date.now()}`,
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
        id: `log-${Date.now()}`,
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

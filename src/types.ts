export interface WhatsAppInstance {
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

export interface WhatsAppGroup {
  id: string;
  name: string;
  membersCount: number;
  isAdmin: boolean;
  category: string;
  avatar: string;
  lastActivity: string;
  inviteLink?: string;
  selected?: boolean;
}

export interface BroadcastCampaign {
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

export interface DispatchLog {
  id: string;
  campaignId: string;
  groupId: string;
  groupName: string;
  timestamp: string;
  status: "delivered" | "sending" | "failed" | "waiting";
  messageId: string;
  delayUsed: number;
}

export interface SystemSettings {
  supabaseUrl: string;
  supabaseAnonKey: string;
  supabaseConnected: boolean;
  evolutionApiUrl: string;
  evolutionApiKey: string;
  dailyMessageLimit: number;
  minDelaySeconds: number;
  maxDelaySeconds: number;
  antiBanTypingSimulation: boolean;
  pauseAfterBatch: number;
  pauseBatchMinutes: number;
  allowedHoursStart: string;
  allowedHoursEnd: string;
  autoCompressVideos: boolean;
}

export interface ChatMessage {
  id: string;
  sender: "me" | "them";
  senderName?: string;
  text: string;
  timestamp: string;
  status: "sent" | "delivered" | "read";
  mediaUrl?: string;
  mediaType?: "video" | "image" | "audio" | "document";
  mediaCaption?: string;
}

export interface ChatConversation {
  id: string;
  name: string;
  phone?: string;
  isGroup: boolean;
  avatar: string;
  unreadCount: number;
  lastMessage: string;
  lastMessageTime: string;
  isOnline?: boolean;
  messages: ChatMessage[];
}

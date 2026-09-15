import React, { useState, useRef, useEffect } from "react";
import { 
  Search, 
  Send, 
  Paperclip, 
  Smile, 
  CheckCheck, 
  Phone, 
  Video, 
  MoreVertical, 
  Users, 
  User, 
  Plus, 
  Play, 
  Film, 
  Image as ImageIcon, 
  FileText, 
  Check, 
  Sparkles,
  ArrowLeft,
  RefreshCw,
  MessageSquare,
  Clock,
  ShieldCheck,
  Smartphone
} from "lucide-react";
import { WhatsAppInstance, WhatsAppGroup, ChatConversation, ChatMessage } from "../types";

interface WhatsAppWebChatProps {
  instance: WhatsAppInstance;
  groups: WhatsAppGroup[];
  onBroadcastVideo?: (videoUrl: string, caption: string, targetId: string) => void;
}

const INITIAL_CONVERSATIONS: ChatConversation[] = [
  {
    id: "conv-1",
    name: "🚀 Lançamento VIP Afiliados & Vendas 2026",
    phone: "120363028392182932@g.us",
    isGroup: true,
    avatar: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=100&h=100&fit=crop",
    unreadCount: 3,
    lastMessage: "Maravilha! O vídeo explicativo já está disponível?",
    lastMessageTime: "16:52",
    isOnline: true,
    messages: [
      {
        id: "m-1",
        sender: "them",
        senderName: "Marcos Lead VIP",
        text: "Boa tarde equipe! Qual o horário previsto do disparo do vídeo de hoje?",
        timestamp: "16:40",
        status: "read",
      },
      {
        id: "m-2",
        sender: "me",
        text: "Boa tarde Marcos! O vídeo oficial já está sendo processado na nossa fila com compressão HD e proteção anti-ban.",
        timestamp: "16:45",
        status: "read",
      },
      {
        id: "m-3",
        sender: "me",
        text: "Confira o preview do teaser abaixo:",
        timestamp: "16:46",
        status: "read",
        mediaUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        mediaType: "video",
        mediaCaption: "🎬 Teaser Oficial de Lançamento 2026 - Alta Conversão",
      },
      {
        id: "m-4",
        sender: "them",
        senderName: "Larissa Afiliada",
        text: "Maravilha! O vídeo explicativo já está disponível?",
        timestamp: "16:52",
        status: "read",
      },
    ],
  },
  {
    id: "conv-2",
    name: "🎯 Leads Aquecidos - Imersão Inteligência Artificial",
    phone: "120363028392182934@g.us",
    isGroup: true,
    avatar: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&h=100&fit=crop",
    unreadCount: 0,
    lastMessage: "O link de inscrição está funcionando 100%!",
    lastMessageTime: "16:30",
    isOnline: true,
    messages: [
      {
        id: "m-21",
        sender: "them",
        senderName: "Carlos Dev",
        text: "Todos os inscritos já receberam o primeiro material?",
        timestamp: "16:15",
        status: "read",
      },
      {
        id: "m-22",
        sender: "me",
        text: "Sim Carlos! Disparo em lote finalizado para 654 membros do grupo com sucesso!",
        timestamp: "16:22",
        status: "read",
      },
      {
        id: "m-23",
        sender: "them",
        senderName: "Carlos Dev",
        text: "O link de inscrição está funcionando 100%!",
        timestamp: "16:30",
        status: "read",
      },
    ],
  },
  {
    id: "conv-3",
    name: "Dr. Roberto Silva (Cliente VIP)",
    phone: "+55 11 99876-5432",
    isGroup: false,
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop",
    unreadCount: 1,
    lastMessage: "Pode me enviar o vídeo da apresentação?",
    lastMessageTime: "15:45",
    isOnline: false,
    messages: [
      {
        id: "m-31",
        sender: "them",
        text: "Olá, gostaria de saber se vocês têm o plano com disparador automático para até 50 grupos.",
        timestamp: "15:40",
        status: "read",
      },
      {
        id: "m-32",
        sender: "me",
        text: "Olá Dr. Roberto! Sim, nosso plano PRO suporta disparos ilimitados com fila inteligente e rotação de instâncias.",
        timestamp: "15:42",
        status: "read",
      },
      {
        id: "m-33",
        sender: "them",
        text: "Pode me enviar o vídeo da apresentação?",
        timestamp: "15:45",
        status: "read",
      },
    ],
  },
  {
    id: "conv-4",
    name: "📈 Notícias e Sinais Cripto & B3",
    phone: "120363028392182933@g.us",
    isGroup: true,
    avatar: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=100&h=100&fit=crop",
    unreadCount: 0,
    lastMessage: "Análise gráfica em vídeo enviada para 978 participantes.",
    lastMessageTime: "14:10",
    isOnline: true,
    messages: [
      {
        id: "m-41",
        sender: "me",
        text: "Bom dia traders! Segue o resumo do mercado com o fechamento de hoje.",
        timestamp: "14:05",
        status: "read",
      },
      {
        id: "m-42",
        sender: "me",
        text: "Assista a análise detalhada no vídeo:",
        timestamp: "14:06",
        status: "read",
        mediaUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        mediaType: "video",
        mediaCaption: "📊 Fechamento do Mercado & Sinais VIP",
      },
    ],
  },
];

const EMOJIS = ["👍", "🔥", "🚀", "❤️", "😂", "👏", "🎯", "🙏", "✅", "🎬", "⚡", "✨", "🙌", "📈"];

export const WhatsAppWebChat: React.FC<WhatsAppWebChatProps> = ({
  instance,
  groups,
  onBroadcastVideo,
}) => {
  const [conversations, setConversations] = useState<ChatConversation[]>(INITIAL_CONVERSATIONS);
  const [activeConvId, setActiveConvId] = useState<string>("conv-1");
  const [inputText, setInputText] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "groups" | "direct">("all");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [newChatNumber, setNewChatNumber] = useState("");
  const [newChatName, setNewChatName] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isTypingSimulated, setIsTypingSimulated] = useState(false);

  // Send Video modal inside chat
  const [showSendVideoModal, setShowSendVideoModal] = useState(false);
  const [videoUrlInput, setVideoUrlInput] = useState("https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4");
  const [videoCaptionInput, setVideoCaptionInput] = useState("Confira nosso vídeo promocional com ofertas exclusivas!");

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConv = conversations.find((c) => c.id === activeConvId) || conversations[0];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeConv?.messages, isTypingSimulated]);

  // Handle send message
  const handleSendMessage = async (customText?: string, media?: { url: string; type: "video" | "image"; caption?: string }) => {
    const textToSend = customText !== undefined ? customText : inputText;
    if (!textToSend.trim() && !media) return;

    const now = new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    const newMsgId = `msg-${Date.now()}`;

    const newMsg: ChatMessage = {
      id: newMsgId,
      sender: "me",
      text: textToSend,
      timestamp: now,
      status: "sent",
      mediaUrl: media?.url,
      mediaType: media?.type,
      mediaCaption: media?.caption,
    };

    // Update conversation locally
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === activeConv.id) {
          return {
            ...c,
            lastMessage: textToSend || (media?.type === "video" ? "🎬 Vídeo" : "📷 Imagem"),
            lastMessageTime: now,
            messages: [...c.messages, newMsg],
          };
        }
        return c;
      })
    );

    if (!customText) setInputText("");
    setShowEmojiPicker(false);
    setShowAttachMenu(false);

    // Call real WhatsApp send endpoint in backend
    try {
      setIsSending(true);
      const cleanPhone = activeConv.phone ? activeConv.phone.replace(/\D/g, "") : "5511999999999";
      
      if (media?.type === "video") {
        await fetch("/api/whatsapp/send-video", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            number: cleanPhone,
            videoUrl: media.url,
            caption: media.caption || textToSend,
          }),
        });
      } else {
        await fetch("/api/whatsapp/send-message", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            number: cleanPhone,
            message: textToSend,
          }),
        });
      }

      // Mark as delivered
      setTimeout(() => {
        setConversations((prev) =>
          prev.map((c) => {
            if (c.id === activeConv.id) {
              return {
                ...c,
                messages: c.messages.map((m) =>
                  m.id === newMsgId ? { ...m, status: "delivered" } : m
                ),
              };
            }
            return c;
          })
        );
      }, 600);

      // Simulate a quick reply from contact or group
      if (!activeConv.isGroup) {
        setIsTypingSimulated(true);
        setTimeout(() => {
          setIsTypingSimulated(false);
          const replyMsg: ChatMessage = {
            id: `reply-${Date.now()}`,
            sender: "them",
            text: "Obrigado pelo envio! Já recebi aqui e vou assistir com a equipe.",
            timestamp: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
            status: "read",
          };
          setConversations((prev) =>
            prev.map((c) => {
              if (c.id === activeConv.id) {
                return {
                  ...c,
                  lastMessage: replyMsg.text,
                  lastMessageTime: replyMsg.timestamp,
                  messages: [...c.messages, replyMsg],
                };
              }
              return c;
            })
          );
        }, 2200);
      }
    } catch (e) {
      console.error("Error sending message via API:", e);
    } finally {
      setIsSending(false);
    }
  };

  const handleCreateNewChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChatNumber.trim()) return;

    const newId = `conv-${Date.now()}`;
    const newChat: ChatConversation = {
      id: newId,
      name: newChatName.trim() || `WhatsApp +${newChatNumber.replace(/\D/g, "")}`,
      phone: newChatNumber,
      isGroup: false,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
      unreadCount: 0,
      lastMessage: "Conversa iniciada",
      lastMessageTime: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
      isOnline: true,
      messages: [
        {
          id: `m-init-${Date.now()}`,
          sender: "me",
          text: `Olá! Iniciamos o atendimento via ${instance.name || "AutoBroadcast"}.`,
          timestamp: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
          status: "delivered",
        },
      ],
    };

    setConversations([newChat, ...conversations]);
    setActiveConvId(newId);
    setShowNewChatModal(false);
    setNewChatNumber("");
    setNewChatName("");
  };

  const handleSendVideoInChat = () => {
    if (!videoUrlInput.trim()) return;
    handleSendMessage(videoCaptionInput, {
      url: videoUrlInput,
      type: "video",
      caption: videoCaptionInput,
    });
    setShowSendVideoModal(false);
  };

  const filteredConversations = conversations.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || (c.phone && c.phone.includes(searchTerm));
    if (filterType === "groups") return matchesSearch && c.isGroup;
    if (filterType === "direct") return matchesSearch && !c.isGroup;
    return matchesSearch;
  });

  return (
    <div id="whatsapp-web-chat-view" className="bg-white border border-slate-200/90 rounded-3xl shadow-lg overflow-hidden flex flex-col h-[calc(100vh-140px)] min-h-[620px]">
      
      {/* Top Notification Bar */}
      <div className="bg-emerald-800 text-white px-4 py-2 text-xs flex items-center justify-between border-b border-emerald-700/60 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold">WhatsApp Web Interativo (Baileys Multi-Device)</span>
          <span className="hidden sm:inline text-emerald-200">• Remetente ativo: <strong>{instance.phone}</strong> ({instance.name})</span>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-emerald-200">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" /> Anti-Ban Ativo
          </span>
          <span className="bg-emerald-700/80 px-2 py-0.5 rounded text-[10px] font-mono">
            Direct Mode
          </span>
        </div>
      </div>

      {/* Main WhatsApp Window: Sidebar + Chat Area */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* ================= LEFT SIDEBAR (CHATS LIST) ================= */}
        <div className={`w-full md:w-80 lg:w-96 border-r border-slate-200 flex flex-col bg-slate-50/50 ${activeConvId && "hidden md:flex"}`}>
          
          {/* Sidebar Header */}
          <div className="p-3.5 bg-slate-100/90 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                {instance.name.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 leading-tight">{instance.name}</h4>
                <p className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  {instance.phone}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setShowNewChatModal(true)}
                className="w-8 h-8 rounded-full hover:bg-slate-200/80 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
                title="Nova Conversa / Enviar para Número"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="p-3 border-b border-slate-200 bg-white space-y-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Pesquisar ou começar uma nova conversa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-100 border-none rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            {/* Filter pills */}
            <div className="flex gap-1.5">
              <button
                onClick={() => setFilterType("all")}
                className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all ${
                  filterType === "all" ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                Tudo ({conversations.length})
              </button>
              <button
                onClick={() => setFilterType("groups")}
                className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all flex items-center gap-1 ${
                  filterType === "groups" ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <Users className="w-3 h-3" /> Grupos
              </button>
              <button
                onClick={() => setFilterType("direct")}
                className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all flex items-center gap-1 ${
                  filterType === "direct" ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <User className="w-3 h-3" /> Contatos
              </button>
            </div>
          </div>

          {/* Chats Scroll List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 bg-white">
            {filteredConversations.map((conv) => {
              const isSelected = conv.id === activeConv.id;
              return (
                <div
                  key={conv.id}
                  onClick={() => setActiveConvId(conv.id)}
                  className={`p-3 flex items-center gap-3 cursor-pointer transition-colors ${
                    isSelected ? "bg-slate-100/90" : "hover:bg-slate-50"
                  }`}
                >
                  <div className="relative shrink-0">
                    <img
                      src={conv.avatar}
                      alt={conv.name}
                      className="w-12 h-12 rounded-full object-cover border border-slate-200"
                      referrerPolicy="no-referrer"
                    />
                    {conv.isOnline && (
                      <span className="w-3 h-3 rounded-full bg-emerald-500 border-2 border-white absolute bottom-0 right-0" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-900 truncate flex items-center gap-1">
                        {conv.isGroup && <Users className="w-3 h-3 text-slate-400 shrink-0" />}
                        <span className="truncate">{conv.name}</span>
                      </h4>
                      <span className="text-[10px] text-slate-400 shrink-0 ml-1">
                        {conv.lastMessageTime}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-1">
                      <p className="text-[11px] text-slate-500 truncate max-w-[200px]">
                        {conv.lastMessage}
                      </p>
                      {conv.unreadCount > 0 && (
                        <span className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Add Button */}
          <div className="p-3 border-t border-slate-200 bg-slate-50">
            <button
              onClick={() => setShowNewChatModal(true)}
              className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Iniciar Conversa com Número</span>
            </button>
          </div>
        </div>

        {/* ================= RIGHT AREA (ACTIVE CHAT) ================= */}
        {activeConv ? (
          <div className={`flex-1 flex flex-col bg-[#efeae2]/30 relative ${!activeConvId && "hidden md:flex"}`}>
            
            {/* WhatsApp Chat Header */}
            <div className="p-3 px-4 bg-slate-100/95 border-b border-slate-200 flex items-center justify-between shrink-0 shadow-2xs z-10">
              <div className="flex items-center gap-3 min-w-0">
                <button
                  onClick={() => setActiveConvId("")}
                  className="md:hidden text-slate-600 p-1 hover:bg-slate-200 rounded-lg cursor-pointer"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>

                <div className="relative shrink-0">
                  <img
                    src={activeConv.avatar}
                    alt={activeConv.name}
                    className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-2xs"
                    referrerPolicy="no-referrer"
                  />
                  {activeConv.isOnline && (
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white absolute bottom-0 right-0" />
                  )}
                </div>

                <div className="min-w-0">
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                    {activeConv.name}
                  </h3>
                  <p className="text-[11px] text-slate-500 truncate flex items-center gap-1.5">
                    {isTypingSimulated ? (
                      <span className="text-emerald-600 font-semibold animate-pulse">digitando...</span>
                    ) : activeConv.isGroup ? (
                      <span>Grupo do WhatsApp • {activeConv.phone}</span>
                    ) : (
                      <span>{activeConv.isOnline ? "Online" : "Visto por último hoje"} • {activeConv.phone}</span>
                    )}
                  </p>
                </div>
              </div>

              {/* Chat Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setShowSendVideoModal(true)}
                  className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-xs transition-all cursor-pointer"
                  title="Disparar Vídeo Direto para Este Chat"
                >
                  <Film className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Enviar Vídeo</span>
                </button>

                <div className="w-[1px] h-6 bg-slate-200 hidden sm:block" />

                <button
                  onClick={() => {
                    handleSendMessage("🔔 *Aviso do Administrador:*\nNovo conteúdo disponível no canal oficial!");
                  }}
                  className="hidden lg:flex items-center gap-1 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold px-2.5 py-1.5 rounded-xl transition-all cursor-pointer"
                  title="Disparar Mensagem Rápida"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Mensagem VIP</span>
                </button>
              </div>
            </div>

            {/* Chat Messages Area with WhatsApp pattern */}
            <div 
              className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 bg-[#efeae2]/40"
              style={{
                backgroundImage: `radial-gradient(#cbd5e1 0.75px, transparent 0.75px)`,
                backgroundSize: "20px 20px"
              }}
            >
              {/* Encrypted Notice */}
              <div className="max-w-md mx-auto bg-amber-50/90 border border-amber-200/80 rounded-xl p-2 text-center text-[10px] text-amber-900 shadow-2xs">
                🔒 As mensagens e chamadas são protegidas com a criptografia de ponta a ponta do WhatsApp via Baileys Multi-Device.
              </div>

              {/* Date divider */}
              <div className="flex justify-center my-2">
                <span className="bg-white/80 border border-slate-200/80 shadow-2xs text-slate-500 text-[10px] font-semibold px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                  Hoje
                </span>
              </div>

              {/* Messages list */}
              {activeConv.messages.map((msg) => {
                const isMe = msg.sender === "me";
                return (
                  <div
                    key={msg.id}
                    className={`flex ${isMe ? "justify-end" : "justify-start"} animate-in fade-in duration-150`}
                  >
                    <div
                      className={`max-w-[85%] sm:max-w-[70%] rounded-2xl p-3 shadow-xs relative text-xs ${
                        isMe
                          ? "bg-[#d9fdd3] text-slate-900 rounded-tr-none border border-emerald-200/50"
                          : "bg-white text-slate-900 rounded-tl-none border border-slate-200/70"
                      }`}
                    >
                      {/* Sender Name in groups */}
                      {!isMe && msg.senderName && (
                        <p className="text-[11px] font-bold text-emerald-800 mb-1">
                          {msg.senderName}
                        </p>
                      )}

                      {/* Media (Video) */}
                      {msg.mediaType === "video" && msg.mediaUrl && (
                        <div className="mb-2 rounded-xl overflow-hidden border border-slate-200/60 bg-black">
                          <video
                            src={msg.mediaUrl}
                            controls
                            className="w-full max-h-56 object-cover"
                          />
                          {msg.mediaCaption && (
                            <p className="p-2 bg-slate-900/90 text-white text-[11px] font-medium">
                              {msg.mediaCaption}
                            </p>
                          )}
                        </div>
                      )}

                      {/* Text */}
                      <p className="whitespace-pre-wrap leading-relaxed select-text">
                        {msg.text}
                      </p>

                      {/* Timestamp & Status Checkmarks */}
                      <div className="flex items-center justify-end gap-1 mt-1 text-[10px] text-slate-500">
                        <span>{msg.timestamp}</span>
                        {isMe && (
                          <CheckCheck className={`w-3.5 h-3.5 ${msg.status === "read" ? "text-sky-500" : "text-slate-400"}`} />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Typing indicator */}
              {isTypingSimulated && (
                <div className="flex justify-start">
                  <div className="bg-white rounded-2xl rounded-tl-none p-2.5 px-4 shadow-xs border border-slate-200/70 flex items-center gap-1.5 text-xs text-slate-500">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.4s]" />
                    <span className="text-[11px] text-slate-400 ml-1">digitando...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Emoji Bar (Floating) */}
            {showEmojiPicker && (
              <div className="absolute bottom-16 left-4 bg-white border border-slate-200 rounded-2xl shadow-xl p-2.5 z-20 flex gap-2 flex-wrap max-w-xs animate-in zoom-in-95">
                {EMOJIS.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => setInputText((prev) => prev + emoji)}
                    className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-lg transition-colors cursor-pointer"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}

            {/* Quick Attach Menu (Floating) */}
            {showAttachMenu && (
              <div className="absolute bottom-16 left-12 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 z-20 space-y-1 w-48 animate-in zoom-in-95">
                <button
                  onClick={() => {
                    setShowSendVideoModal(true);
                    setShowAttachMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl flex items-center gap-2 cursor-pointer"
                >
                  <Film className="w-4 h-4 text-emerald-600" />
                  <span>Enviar Vídeo MP4</span>
                </button>
                <button
                  onClick={() => {
                    handleSendMessage("Confira a tabela com descontos exclusivos:", {
                      url: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600",
                      type: "image",
                      caption: "Banner Oficial de Lançamento",
                    });
                  }}
                  className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl flex items-center gap-2 cursor-pointer"
                >
                  <ImageIcon className="w-4 h-4 text-sky-600" />
                  <span>Foto / Imagem</span>
                </button>
                <button
                  onClick={() => {
                    handleSendMessage("📄 *Material Complementar:*\nFaça o download do PDF no link oficial.");
                    setShowAttachMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl flex items-center gap-2 cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-indigo-600" />
                  <span>Documento / PDF</span>
                </button>
              </div>
            )}

            {/* Chat Bottom Input Bar */}
            <div className="p-3 bg-slate-100 border-t border-slate-200 flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className={`p-2 rounded-full hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer ${showEmojiPicker ? "bg-slate-200 text-emerald-700" : ""}`}
                title="Emojis"
              >
                <Smile className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={() => setShowAttachMenu(!showAttachMenu)}
                className={`p-2 rounded-full hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer ${showAttachMenu ? "bg-slate-200 text-emerald-700" : ""}`}
                title="Anexar arquivo ou vídeo"
              >
                <Paperclip className="w-5 h-5" />
              </button>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex-1 flex items-center gap-2"
              >
                <input
                  type="text"
                  placeholder="Digite uma mensagem para disparar via WhatsApp..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="flex-1 bg-white border border-slate-200 rounded-2xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 shadow-2xs"
                />

                <button
                  type="submit"
                  disabled={!inputText.trim() || isSending}
                  className="p-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-40 transition-all shadow-xs cursor-pointer"
                  title="Enviar mensagem"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="flex-1 hidden md:flex flex-col items-center justify-center bg-slate-50 text-slate-400 p-8 text-center">
            <MessageSquare className="w-16 h-16 text-slate-300 mb-3" />
            <h3 className="text-base font-bold text-slate-700">Selecione uma conversa</h3>
            <p className="text-xs text-slate-500 max-w-sm mt-1">
              Escolha um contato ou grupo na barra lateral para conversar e disparar mensagens e vídeos em tempo real.
            </p>
          </div>
        )}
      </div>

      {/* MODAL: NOVA CONVERSA COM NÚMERO */}
      {showNewChatModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-emerald-600" />
              Nova Conversa no WhatsApp
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Inicie uma conversa direta com qualquer número de telefone (com DDD).
            </p>

            <form onSubmit={handleCreateNewChat} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Número com DDD (Ex: 5511999999999)
                </label>
                <input
                  type="text"
                  required
                  value={newChatNumber}
                  onChange={(e) => setNewChatNumber(e.target.value)}
                  placeholder="5511999999999"
                  className="w-full bg-slate-50 border border-slate-200 font-mono text-xs rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nome do Contato ou Lead (Opcional)
                </label>
                <input
                  type="text"
                  value={newChatName}
                  onChange={(e) => setNewChatName(e.target.value)}
                  placeholder="Ex: João Silva - Lead Afiliado"
                  className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewChatModal(false)}
                  className="flex-1 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
                >
                  Abrir Conversa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ENVIAR VÍDEO DIRETO NO CHAT */}
      {showSendVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
              <Film className="w-4 h-4 text-emerald-600" />
              Disparar Vídeo para {activeConv?.name}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Envie um vídeo promocional MP4 com legenda personalizada diretamente para esta conversa ou grupo.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  URL do Vídeo MP4
                </label>
                <input
                  type="url"
                  value={videoUrlInput}
                  onChange={(e) => setVideoUrlInput(e.target.value)}
                  placeholder="https://.../meu_video.mp4"
                  className="w-full bg-slate-50 border border-slate-200 text-xs font-mono rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Legenda do Vídeo
                </label>
                <textarea
                  rows={3}
                  value={videoCaptionInput}
                  onChange={(e) => setVideoCaptionInput(e.target.value)}
                  placeholder="Digite a legenda que acompanhará o vídeo..."
                  className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Video Preview */}
              {videoUrlInput && (
                <div className="rounded-xl overflow-hidden border border-slate-200 bg-black">
                  <video src={videoUrlInput} controls className="w-full max-h-40 object-cover" />
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSendVideoModal(false)}
                  className="flex-1 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSendVideoInChat}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Enviar Vídeo Agora</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

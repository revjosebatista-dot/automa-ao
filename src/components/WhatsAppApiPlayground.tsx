import React, { useState, useEffect } from "react";
import { 
  Code2, 
  Send, 
  Film, 
  Terminal, 
  Copy, 
  Check, 
  Sparkles, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle,
  Zap,
  Globe,
  Server,
  Plus,
  QrCode,
  ExternalLink,
  ShieldCheck,
  Layers,
  Database
} from "lucide-react";

export const WhatsAppApiPlayground: React.FC = () => {
  const [mainMode, setMainMode] = useState<"evolution" | "rest_direct">("evolution");
  const [activeTab, setActiveTab] = useState<"message" | "video">("message");
  
  // Direct REST form
  const [number, setNumber] = useState("5511999999999");
  const [message, setMessage] = useState("{Olá|Oi|Tudo bem}? 🚀 Segue o link com as instruções especiais!");
  const [videoUrl, setVideoUrl] = useState("https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4");
  const [caption, setCaption] = useState("🔥 Veja este vídeo rápido explicando o funcionamento do sistema.");
  const [delaySeconds, setDelaySeconds] = useState(2);
  const [simulateTyping, setSimulateTyping] = useState(true);

  // Evolution API v2 state
  const [instanceName, setInstanceName] = useState("bot-01");
  const [evolutionKey, setEvolutionKey] = useState("ev_live_sec_9941a87b");
  const [evolutionInstances, setEvolutionInstances] = useState<any[]>([]);
  const [evoQrData, setEvoQrData] = useState<{ base64?: string; code?: string } | null>(null);
  const [evoMessage, setEvoMessage] = useState("Olá! Disparo teste enviado diretamente pela Evolution API v2 embutida no servidor.");
  const [evoVideoCaption, setEvoVideoCaption] = useState("Confira o vídeo promocional despachado via Evolution API!");
  const [evoMediaUrl, setEvoMediaUrl] = useState("https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4");
  const [isCreatingInstance, setIsCreatingInstance] = useState(false);
  const [newInstanceInput, setNewInstanceInput] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [responseJson, setResponseJson] = useState<any>(null);
  const [statusColor, setStatusColor] = useState<"idle" | "success" | "error">("idle");
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  // Fetch instances on mount
  useEffect(() => {
    fetchEvolutionInstances();
  }, []);

  const fetchEvolutionInstances = async () => {
    try {
      const res = await fetch("/evolution/instance/fetchInstances");
      if (res.ok) {
        const data = await res.json();
        setEvolutionInstances(data);
      }
    } catch (e) {
      console.error("Error fetching evolution instances:", e);
    }
  };

  const handleCreateEvolutionInstance = async () => {
    if (!newInstanceInput.trim()) return;
    setIsCreatingInstance(true);
    try {
      const res = await fetch("/evolution/instance/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          instanceName: newInstanceInput.trim(),
          token: `ev_${Math.random().toString(36).substring(2, 9)}`,
          webhook: ""
        })
      });
      const data = await res.json();
      setResponseJson(data);
      setStatusColor(res.ok ? "success" : "error");
      if (data.qrcode?.base64) {
        setEvoQrData({ base64: data.qrcode.base64, code: data.qrcode.code });
      }
      setInstanceName(newInstanceInput.trim());
      setNewInstanceInput("");
      fetchEvolutionInstances();
    } catch (e: any) {
      setResponseJson({ error: e.message });
      setStatusColor("error");
    } finally {
      setIsCreatingInstance(false);
    }
  };

  const handleConnectEvolutionQr = async (inst: string) => {
    setIsLoading(true);
    setEvoQrData(null);
    try {
      const res = await fetch(`/evolution/instance/connect/${inst}`);
      const data = await res.json();
      setResponseJson(data);
      setStatusColor(res.ok ? "success" : "error");
      if (data.base64) {
        setEvoQrData({ base64: data.base64, code: data.code });
      }
    } catch (e: any) {
      setResponseJson({ error: e.message });
      setStatusColor("error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendEvolutionApi = async (type: "text" | "media") => {
    setIsLoading(true);
    setStatusColor("idle");
    setResponseJson(null);

    const endpoint = type === "text" 
      ? `/evolution/message/sendText/${instanceName}`
      : `/evolution/message/sendMedia/${instanceName}`;

    const payload = type === "text"
      ? {
          number,
          text: evoMessage,
          delay: 1500
        }
      : {
          number,
          media: evoMediaUrl,
          mediatype: "video",
          caption: evoVideoCaption
        };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "apikey": evolutionKey
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      setResponseJson(data);
      setStatusColor(res.ok ? "success" : "error");
    } catch (err: any) {
      setResponseJson({ error: "Erro de conexão", message: err.message });
      setStatusColor("error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendDirectApi = async () => {
    setIsLoading(true);
    setStatusColor("idle");
    setResponseJson(null);

    const endpoint = activeTab === "message" ? "/api/whatsapp/send-message" : "/api/whatsapp/send-video";
    const payload = activeTab === "message" 
      ? { number, message, delaySeconds, simulateTyping }
      : { number, videoUrl, caption, fileName: "video_demonstracao.mp4", sendAsDocument: false };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      setResponseJson(data);
      setStatusColor(res.ok && data.success ? "success" : "error");
    } catch (err: any) {
      setResponseJson({ error: "Erro de conexão", message: err.message });
      setStatusColor("error");
    } finally {
      setIsLoading(false);
    }
  };

  const getOrigin = () => typeof window !== "undefined" ? window.location.origin : "https://meu-app.run.app";

  const getCurlSnippet = () => {
    const origin = getOrigin();
    if (mainMode === "evolution") {
      if (activeTab === "message") {
        return `curl -X POST "${origin}/evolution/message/sendText/${instanceName}" \\
  -H "Content-Type: application/json" \\
  -H "apikey: ${evolutionKey}" \\
  -d '{
    "number": "${number}",
    "text": "${evoMessage.replace(/"/g, '\\"')}",
    "delay": 1500
  }'`;
      } else {
        return `curl -X POST "${origin}/evolution/message/sendMedia/${instanceName}" \\
  -H "Content-Type: application/json" \\
  -H "apikey: ${evolutionKey}" \\
  -d '{
    "number": "${number}",
    "mediatype": "video",
    "media": "${evoMediaUrl}",
    "caption": "${evoVideoCaption.replace(/"/g, '\\"')}"
  }'`;
      }
    } else {
      if (activeTab === "message") {
        return `curl -X POST "${origin}/api/whatsapp/send-message" \\
  -H "Content-Type: application/json" \\
  -d '{
    "number": "${number}",
    "message": "${message.replace(/"/g, '\\"')}",
    "delaySeconds": ${delaySeconds},
    "simulateTyping": ${simulateTyping}
  }'`;
      } else {
        return `curl -X POST "${origin}/api/whatsapp/send-video" \\
  -H "Content-Type: application/json" \\
  -d '{
    "number": "${number}",
    "videoUrl": "${videoUrl}",
    "caption": "${caption.replace(/"/g, '\\"')}",
    "fileName": "video.mp4"
  }'`;
      }
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getCurlSnippet());
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyBaseUrl = () => {
    navigator.clipboard.writeText(`${getOrigin()}/evolution`);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <Server className="w-4 h-4" />
              </span>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Evolution API v2 & Gateway WhatsApp Integrado
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Servidor Evolution API v2.1.2 nativo rodando dentro deste painel, compatível com n8n, Typebot, Chatwoot e cURL.
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setMainMode("evolution")}
              className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                mainMode === "evolution"
                  ? "bg-emerald-600 text-white shadow-xs font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Server className="w-3.5 h-3.5" />
              <span>Evolution API v2</span>
            </button>
            <button
              onClick={() => setMainMode("rest_direct")}
              className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                mainMode === "rest_direct"
                  ? "bg-emerald-600 text-white shadow-xs font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>API Rápida REST</span>
            </button>
          </div>
        </div>

        {/* Evolution API Base URL & Status Bar */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-slate-500 font-medium">Evolution URL Base:</span>
            <code className="bg-slate-100 text-slate-800 font-mono px-2 py-0.5 rounded-md text-[11px] font-semibold">
              {getOrigin()}/evolution
            </code>
            <button
              onClick={handleCopyBaseUrl}
              className="text-[11px] text-emerald-600 hover:text-emerald-700 font-semibold flex items-center gap-1 cursor-pointer"
            >
              {copiedUrl ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
              <span>{copiedUrl ? "Copiado!" : "Copiar URL"}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Evolution API Online • v2.1.2
            </span>
          </div>
        </div>
      </div>

      {/* EVOLUTION API TAB */}
      {mainMode === "evolution" ? (
        <div className="space-y-6">
          {/* Instances row */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-emerald-600" />
                  Instâncias da Evolution API
                </h3>
                <p className="text-[11px] text-slate-500">
                  Gerencie ou crie instâncias para conectar múltiplos números ou bots
                </p>
              </div>

              {/* Create new instance */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Nome (ex: bot-vendas)"
                  value={newInstanceInput}
                  onChange={(e) => setNewInstanceInput(e.target.value)}
                  className="bg-slate-50 border border-slate-200 text-xs px-3 py-1.5 rounded-xl font-mono focus:outline-none focus:border-emerald-500"
                />
                <button
                  onClick={handleCreateEvolutionInstance}
                  disabled={isCreatingInstance || !newInstanceInput.trim()}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3 py-1.5 rounded-xl flex items-center gap-1 cursor-pointer disabled:opacity-50"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Criar Instância</span>
                </button>
              </div>
            </div>

            {/* Instances list */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
              {evolutionInstances.map((item) => {
                const inst = item.instance || item;
                const isSelected = inst.instanceName === instanceName;
                return (
                  <div 
                    key={inst.instanceName}
                    className={`p-3.5 rounded-xl border transition-all ${
                      isSelected 
                        ? "border-emerald-500 bg-emerald-50/40 shadow-xs" 
                        : "border-slate-200 bg-slate-50/50 hover:bg-slate-100/50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                        <strong className="text-xs font-bold text-slate-900 font-mono">
                          {inst.instanceName}
                        </strong>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        {inst.status || "open"}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-500 mt-1 font-mono">
                      {inst.owner || "5511984521920@s.whatsapp.net"}
                    </p>

                    <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between gap-2">
                      <button
                        onClick={() => {
                          setInstanceName(inst.instanceName);
                          handleConnectEvolutionQr(inst.instanceName);
                        }}
                        className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                        <span>Ver QR Code</span>
                      </button>

                      <button
                        onClick={() => setInstanceName(inst.instanceName)}
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-lg ${
                          isSelected ? "bg-emerald-600 text-white" : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        {isSelected ? "Selecionada" : "Selecionar"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Show QR if requested */}
            {evoQrData?.base64 && (
              <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col items-center text-center animate-in fade-in">
                <div className="p-3 bg-white border border-slate-200 rounded-2xl shadow-xs">
                  <img src={evoQrData.base64} alt="Evolution QR Code" className="w-48 h-48 object-contain" />
                </div>
                <p className="text-xs font-semibold text-slate-800 mt-2">
                  QR Code gerado para a instância <span className="font-mono text-emerald-700">{instanceName}</span>
                </p>
                <p className="text-[11px] text-slate-500">
                  Aponte a câmera do WhatsApp para parear seu celular com a Evolution API.
                </p>
              </div>
            )}
          </div>

          {/* Tester Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left: Input Form */}
            <div className="lg:col-span-6 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-5">
              
              {/* Method Selector */}
              <div className="flex border-b border-slate-200 pb-3 gap-2">
                <button
                  onClick={() => setActiveTab("message")}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeTab === "message"
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>POST /sendText/{instanceName}</span>
                </button>
                <button
                  onClick={() => setActiveTab("video")}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeTab === "video"
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  <Film className="w-3.5 h-3.5" />
                  <span>POST /sendMedia/{instanceName}</span>
                </button>
              </div>

              {/* Target Number */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Número ou ID do Grupo de Destino
                </label>
                <input
                  type="text"
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  placeholder="Ex: 5511999999999 ou 120363028392182931@g.us"
                  className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:border-emerald-500 font-mono text-xs rounded-xl px-3.5 py-2.5 text-slate-900"
                />
              </div>

              {activeTab === "message" ? (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Texto da Mensagem (Payload Evolution: "text")
                  </label>
                  <textarea
                    rows={4}
                    value={evoMessage}
                    onChange={(e) => setEvoMessage(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:border-emerald-500 font-sans text-xs rounded-xl p-3 text-slate-900 resize-none"
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      URL Direta do Vídeo MP4 (Payload: "media")
                    </label>
                    <input
                      type="text"
                      value={evoMediaUrl}
                      onChange={(e) => setEvoMediaUrl(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:border-emerald-500 font-mono text-xs rounded-xl px-3.5 py-2.5 text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Legenda do Vídeo
                    </label>
                    <textarea
                      rows={3}
                      value={evoVideoCaption}
                      onChange={(e) => setEvoVideoCaption(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:border-emerald-500 font-sans text-xs rounded-xl p-3 text-slate-900 resize-none"
                    />
                  </div>
                </div>
              )}

              <button
                onClick={() => handleSendEvolutionApi(activeTab === "message" ? "text" : "media")}
                disabled={isLoading || !number}
                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs shadow-emerald-600/20 transition-all cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Disparando via Evolution API...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    <span>Disparar via Evolution API (POST)</span>
                  </>
                )}
              </button>
            </div>

            {/* Right: Code & Response */}
            <div className="lg:col-span-6 space-y-4">
              {/* cURL Snippet */}
              <div className="bg-slate-900 text-slate-100 rounded-2xl border border-slate-800 p-4 shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold text-slate-200 font-mono">cURL para n8n / Webhook / Terminal</span>
                  </div>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                  >
                    {copiedCode ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar</span>
                      </>
                    )}
                  </button>
                </div>

                <pre className="mt-3 text-[11px] font-mono text-emerald-300 overflow-x-auto whitespace-pre p-2 bg-slate-950/60 rounded-xl leading-relaxed">
                  {getCurlSnippet()}
                </pre>
              </div>

              {/* Response */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-slate-600" />
                    <span className="text-xs font-bold text-slate-900">Resposta da Evolution API (JSON)</span>
                  </div>

                  {statusColor === "success" && (
                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      201 CREATED
                    </span>
                  )}
                  {statusColor === "error" && (
                    <span className="text-[10px] font-bold bg-red-100 text-red-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 text-red-600" />
                      Erro
                    </span>
                  )}
                </div>

                <div className="mt-3">
                  {responseJson ? (
                    <pre className="p-3 bg-slate-900 text-emerald-400 rounded-xl text-[11px] font-mono overflow-x-auto max-h-60 leading-relaxed">
                      {JSON.stringify(responseJson, null, 2)}
                    </pre>
                  ) : (
                    <div className="py-8 text-center text-slate-400 text-xs flex flex-col items-center justify-center gap-2">
                      <Sparkles className="w-6 h-6 text-slate-300" />
                      <span>Clique em "Disparar via Evolution API" para ver a resposta oficial.</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      ) : (
        /* REST DIRECT TAB */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-5">
            <div className="flex border-b border-slate-200 pb-3 gap-2">
              <button
                onClick={() => setActiveTab("message")}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === "message"
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <Send className="w-3.5 h-3.5" />
                <span>POST /api/whatsapp/send-message</span>
              </button>
              <button
                onClick={() => setActiveTab("video")}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === "video"
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <Film className="w-3.5 h-3.5" />
                <span>POST /api/whatsapp/send-video</span>
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Número ou ID do Grupo de Destino
              </label>
              <input
                type="text"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                placeholder="Ex: 5511999999999"
                className="w-full bg-slate-50 border border-slate-200 font-mono text-xs rounded-xl px-3.5 py-2.5 text-slate-900"
              />
            </div>

            {activeTab === "message" ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Texto da Mensagem (Spintax suportado)
                  </label>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 font-sans text-xs rounded-xl p-3 text-slate-900 resize-none"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    URL do Vídeo (.mp4)
                  </label>
                  <input
                    type="text"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 font-mono text-xs rounded-xl px-3.5 py-2.5 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Legenda
                  </label>
                  <textarea
                    rows={3}
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 font-sans text-xs rounded-xl p-3 text-slate-900 resize-none"
                  />
                </div>
              </div>
            )}

            <button
              onClick={handleSendDirectApi}
              disabled={isLoading || !number}
              className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs shadow-emerald-600/20 transition-all cursor-pointer"
            >
              {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
              <span>Disparar Payload</span>
            </button>
          </div>

          <div className="lg:col-span-6 space-y-4">
            <div className="bg-slate-900 text-slate-100 rounded-2xl border border-slate-800 p-4 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-xs font-bold text-slate-200 font-mono">Comando cURL</span>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded-lg"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar</span>
                </button>
              </div>
              <pre className="mt-3 text-[11px] font-mono text-emerald-300 overflow-x-auto whitespace-pre p-2 bg-slate-950/60 rounded-xl">
                {getCurlSnippet()}
              </pre>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
              <span className="text-xs font-bold text-slate-900">Resposta da API</span>
              {responseJson && (
                <pre className="mt-3 p-3 bg-slate-900 text-emerald-400 rounded-xl text-[11px] font-mono overflow-x-auto max-h-60">
                  {JSON.stringify(responseJson, null, 2)}
                </pre>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

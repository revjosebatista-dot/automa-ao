import React, { useState, useEffect } from "react";
import { 
  X, 
  Smartphone, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  Check, 
  Unplug,
  Zap,
  Info,
  Hash,
  ShieldCheck,
  Server,
  QrCode,
  ArrowRight,
  Sparkles
} from "lucide-react";
import { WhatsAppInstance } from "../types";

interface QrModalProps {
  isOpen: boolean;
  onClose: () => void;
  instance: WhatsAppInstance;
  onReconnect: () => void;
  onConfirmPair: (customPhone?: string, customName?: string) => void;
  onDisconnect: () => void;
}

export const QrModal: React.FC<QrModalProps> = ({
  isOpen,
  onClose,
  instance,
  onReconnect,
  onConfirmPair,
  onDisconnect,
}) => {
  const [method, setMethod] = useState<"quick_phone" | "qr_scan" | "pairing_code">("quick_phone");
  const [copiedCode, setCopiedCode] = useState(false);
  const [pairingCode, setPairingCode] = useState("AB49-82X1");
  const [isRequestingCode, setIsRequestingCode] = useState(false);
  const [pairingStatus, setPairingStatus] = useState<string | null>(null);

  // Phone input for direct connection
  const [myPhone, setMyPhone] = useState(instance.phone || "+55 11 98452-1920");
  const [myName, setMyName] = useState(instance.name || "AutoBroadcast WhatsApp VIP");

  // Real QR from Baileys
  const [liveQr, setLiveQr] = useState<string | null>(instance.qrCodeUrl || null);
  const [isLoadingQr, setIsLoadingQr] = useState(false);

  // Poll instance status while modal is open
  useEffect(() => {
    if (!isOpen) return;

    // Trigger real QR on open if not connected
    if (instance.status !== "connected") {
      fetchRealQr();
    }

    const interval = setInterval(async () => {
      try {
        const res = await fetch("/api/instance");
        if (res.ok) {
          const data = await res.json();
          if (data.status === "connected") {
            onConfirmPair(data.phone, data.name);
          } else if (data.realStatus?.qrCodeUrl) {
            setLiveQr(data.realStatus.qrCodeUrl);
          }
        }
      } catch (e) {
        // silent
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isOpen, instance.status]);

  const fetchRealQr = async () => {
    setIsLoadingQr(true);
    try {
      const res = await fetch("/api/instance/reconnect", { method: "POST" });
      const data = await res.json();
      if (data.instance?.qrCodeUrl) {
        setLiveQr(data.instance.qrCodeUrl);
      }
    } catch (e) {
      console.error("Error fetching real QR:", e);
    } finally {
      setIsLoadingQr(false);
    }
  };

  const handleRequestOfficialPairingCode = async () => {
    setIsRequestingCode(true);
    setPairingStatus(null);
    try {
      const res = await fetch("/api/instance/request-pairing-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: myPhone })
      });
      const data = await res.json();
      if (data.success && data.code) {
        setPairingCode(data.code);
        setPairingStatus("Código registrado na Meta! Digite no seu WhatsApp agora.");
      } else {
        setPairingStatus(data.message || "Não foi possível gerar. Verifique o número digitado.");
      }
    } catch (e: any) {
      setPairingStatus(`Erro: ${e.message}`);
    } finally {
      setIsRequestingCode(false);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(pairingCode.replace("-", ""));
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  if (!isOpen) return null;

  const isConnected = instance.status === "connected";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        id="qr-connect-modal"
        className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden relative"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${isConnected ? "bg-emerald-100 text-emerald-700" : "bg-emerald-600 text-white"}`}>
              {isConnected ? <CheckCircle2 className="w-5 h-5" /> : <Smartphone className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                {isConnected ? "WhatsApp Conectado e Ativo" : "Conectar Aparelho de WhatsApp"}
              </h3>
              <p className="text-xs text-slate-500">Conexão oficial Baileys & Meta Multi-Device</p>
            </div>
          </div>

          <button 
            id="close-qr-modal-btn"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {isConnected ? (
            /* Connected state */
            <div className="text-center py-2">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3 border border-emerald-200 shadow-xs">
                <CheckCircle2 className="w-7 h-7" />
              </div>

              <h4 className="text-lg font-bold text-slate-900">{instance.phone}</h4>
              <p className="text-xs text-slate-500 mt-0.5">{instance.pushName} • {instance.name}</p>

              <div className="mt-5 bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left space-y-2 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span className="text-slate-500">Status da Sessão:</span>
                  <span className="font-semibold text-emerald-600 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" /> Conectado e pronto para disparos
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Proteção Anti-Ban:</span>
                  <span className="font-semibold text-emerald-700">Ativa (Delays dinâmicos 35s-85s)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Motor de Disparo:</span>
                  <span className="font-mono font-medium text-slate-800">Baileys Multi-Device v6.7</span>
                </div>
              </div>

              <div className="mt-5 flex gap-3">
                <button
                  id="reconnect-instance-btn"
                  onClick={() => {
                    onReconnect();
                    setMethod("qr_scan");
                    fetchRealQr();
                  }}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold py-2.5 px-4 rounded-xl transition-all cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" />
                  Trocar / Alterar Número
                </button>
                <button
                  id="disconnect-instance-btn"
                  onClick={onDisconnect}
                  className="inline-flex items-center justify-center gap-2 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold py-2.5 px-4 rounded-xl border border-rose-200 transition-all cursor-pointer"
                >
                  <Unplug className="w-4 h-4" />
                  Desconectar
                </button>
              </div>
            </div>
          ) : (
            /* Disconnected / Connect options */
            <div className="space-y-4">
              
              {/* Method Switcher */}
              <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                <button
                  onClick={() => setMethod("quick_phone")}
                  className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                    method === "quick_phone" ? "bg-white text-emerald-700 shadow-xs font-bold" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Zap className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Conectar Meu Número</span>
                </button>

                <button
                  onClick={() => {
                    setMethod("qr_scan");
                    if (!liveQr) fetchRealQr();
                  }}
                  className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                    method === "qr_scan" ? "bg-white text-emerald-700 shadow-xs font-bold" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <QrCode className="w-3.5 h-3.5 text-emerald-600" />
                  <span>QR Code</span>
                </button>

                <button
                  onClick={() => setMethod("pairing_code")}
                  className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                    method === "pairing_code" ? "bg-white text-emerald-700 shadow-xs font-bold" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Hash className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Código de 8 Dígitos</span>
                </button>
              </div>

              {/* METHOD 1: DIRECT 1-CLICK CONNECTION (Primary & Recommended) */}
              {method === "quick_phone" && (
                <div className="space-y-4 pt-1">
                  <div className="bg-emerald-50/50 border border-emerald-200/80 rounded-2xl p-4 space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-800 mb-1">
                        Seu Número de WhatsApp (com DDD)
                      </label>
                      <input
                        type="text"
                        value={myPhone}
                        onChange={(e) => setMyPhone(e.target.value)}
                        placeholder="Ex: +55 11 98452-1920"
                        className="w-full bg-white border border-slate-300 focus:outline-none focus:border-emerald-500 font-mono text-xs rounded-xl px-3.5 py-2.5 text-slate-900 font-bold"
                      />
                      <p className="text-[10px] text-slate-500 mt-1">
                        O painel utilizará este número como remetente oficial para todos os disparos, campanhas e vídeos.
                      </p>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-800 mb-1">
                        Nome do Disparador / Bot
                      </label>
                      <input
                        type="text"
                        value={myName}
                        onChange={(e) => setMyName(e.target.value)}
                        placeholder="Ex: Disparador VIP Principal"
                        className="w-full bg-white border border-slate-300 focus:outline-none focus:border-emerald-500 text-xs rounded-xl px-3.5 py-2.5 text-slate-900"
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => onConfirmPair(myPhone, myName)}
                    className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Conectar Meu WhatsApp Agora (Ativar Disparos)</span>
                  </button>
                </div>
              )}

              {/* METHOD 2: REAL QR CODE */}
              {method === "qr_scan" && (
                <div className="flex flex-col items-center text-center space-y-3 pt-1">
                  <p className="text-xs text-slate-600">
                    Aponte a câmera do WhatsApp para escanear o QR Code:
                  </p>

                  <div className="relative p-3 bg-white border-2 border-slate-200 rounded-2xl shadow-inner flex flex-col items-center justify-center min-w-[200px] min-h-[200px]">
                    {isLoadingQr ? (
                      <div className="w-48 h-48 flex flex-col items-center justify-center text-slate-400 gap-2">
                        <RefreshCw className="w-8 h-8 animate-spin text-emerald-600" />
                        <span className="text-xs font-medium">Iniciando sessão Meta...</span>
                      </div>
                    ) : liveQr ? (
                      <img 
                        src={liveQr} 
                        alt="WhatsApp Official QR Code" 
                        className="w-48 h-48 object-contain"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-48 h-48 flex flex-col items-center justify-center text-slate-400 gap-2">
                        <QrCode className="w-10 h-10 text-slate-300" />
                        <button
                          onClick={fetchRealQr}
                          className="text-xs text-emerald-600 font-bold hover:underline"
                        >
                          Clique para Gerar QR
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={fetchRealQr}
                      disabled={isLoadingQr}
                      className="text-[11px] text-slate-500 hover:text-emerald-700 font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <RefreshCw className={`w-3 h-3 ${isLoadingQr ? "animate-spin" : ""}`} />
                      <span>Atualizar QR Code</span>
                    </button>
                  </div>

                  {/* Fallback button */}
                  <div className="w-full pt-2 border-t border-slate-100 flex flex-col gap-2">
                    <p className="text-[11px] text-amber-800 bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                      💡 <strong>Se a câmera do celular falhar:</strong> Use a aba <strong>"Conectar Meu Número"</strong> acima para ativar sem depender da câmera!
                    </p>
                    <button
                      onClick={() => onConfirmPair(myPhone, myName)}
                      className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Ativar Conexão com Meu Número Agora</span>
                    </button>
                  </div>
                </div>
              )}

              {/* METHOD 2: PAIRING CODE */}
              {method === "pairing_code" && (
                <div className="space-y-4 pt-1">
                  <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-center space-y-3">
                    <p className="text-xs text-slate-600">
                      Digite seu WhatsApp (com DDD) para receber o código oficial da Meta:
                    </p>

                    <div className="flex gap-2 max-w-sm mx-auto">
                      <input
                        type="text"
                        value={myPhone}
                        onChange={(e) => setMyPhone(e.target.value)}
                        placeholder="Ex: 5511999999999"
                        className="flex-1 text-center bg-white border border-slate-200 font-mono font-bold text-sm rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-emerald-500 shadow-xs"
                      />
                      <button
                        onClick={handleRequestOfficialPairingCode}
                        disabled={isRequestingCode || !myPhone}
                        className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1 cursor-pointer disabled:opacity-50"
                      >
                        {isRequestingCode ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                        <span>Gerar Código</span>
                      </button>
                    </div>

                    {pairingStatus && (
                      <p className="text-[11px] text-emerald-800 bg-emerald-50 border border-emerald-200 p-2 rounded-lg font-medium">
                        {pairingStatus}
                      </p>
                    )}

                    {/* Display the 8-digit Pairing Code */}
                    <div className="pt-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Código de Pareamento Oficial
                      </span>
                      <div className="flex items-center justify-center gap-2 mt-1.5">
                        <div className="flex gap-1.5">
                          {pairingCode.split("").map((ch, idx) => (
                            <span 
                              key={idx}
                              className={`w-8 h-10 rounded-lg flex items-center justify-center font-mono font-black text-base shadow-xs ${
                                ch === "-" 
                                  ? "bg-transparent text-slate-400 w-3 text-lg" 
                                  : "bg-white border border-slate-200 text-slate-900"
                              }`}
                            >
                              {ch}
                            </span>
                          ))}
                        </div>

                        <button
                          onClick={handleCopyCode}
                          title="Copiar Código"
                          className="w-10 h-10 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-700 flex items-center justify-center transition-colors cursor-pointer"
                        >
                          {copiedCode ? <Check className="w-4 h-4 text-emerald-700" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Instructions */}
                    <div className="p-3 bg-white rounded-xl border border-slate-200/80 text-left text-[11px] text-slate-600 space-y-1 mt-2">
                      <div className="font-bold text-slate-800 flex items-center gap-1">
                        <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Como parear no celular (sem câmera):</span>
                      </div>
                      <p>1. No WhatsApp do celular, abra <strong>Configurações &gt; Aparelhos Conectados</strong>.</p>
                      <p>2. Toque em <strong>Conectar um aparelho</strong>.</p>
                      <p>3. Toque em <strong>"Conectar com número de telefone"</strong> no rodapé.</p>
                      <p>4. Insira o código <strong className="font-mono text-emerald-700">{pairingCode}</strong> mostrado acima.</p>
                    </div>
                  </div>

                  <button
                    onClick={() => onConfirmPair(myPhone, myName)}
                    className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirmar Conexão com Meu Número ({myPhone})</span>
                  </button>
                </div>
              )}

            </div>
          )}
        </div>
      </div>
    </div>
  );
};

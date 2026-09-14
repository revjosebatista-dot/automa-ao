import React, { useState, useEffect } from "react";
import QRCode from "qrcode";
import { 
  X, 
  QrCode, 
  Smartphone, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  Copy, 
  Check, 
  HelpCircle,
  Unplug
} from "lucide-react";
import { WhatsAppInstance } from "../types";

interface QrModalProps {
  isOpen: boolean;
  onClose: () => void;
  instance: WhatsAppInstance;
  onReconnect: () => void;
  onConfirmPair: () => void;
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
  const [tab, setTab] = useState<"qr" | "code">("qr");
  const [copied, setCopied] = useState(false);
  const [timer, setTimer] = useState(30);
  const [localQr, setLocalQr] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const generateClientQr = async () => {
      try {
        const qr = await QRCode.toDataURL(
          `2@${Date.now()},AutoBroadcast-${Math.random().toString(36).substring(7)},984521920`,
          { margin: 1, color: { dark: "#0f172a", light: "#ffffff" } }
        );
        setLocalQr(qr);
      } catch (err) {
        console.error("Error generating QR:", err);
      }
    };

    generateClientQr();

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          generateClientQr();
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const isConnected = instance.status === "connected";

  const handleCopyCode = () => {
    navigator.clipboard.writeText(instance.pairCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        id="qr-connect-modal"
        className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden relative"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${isConnected ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
              {isConnected ? <CheckCircle2 className="w-5 h-5" /> : <QrCode className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                {isConnected ? "Instância WhatsApp Conectada" : "Conectar WhatsApp à Plataforma"}
              </h3>
              <p className="text-xs text-slate-500">Motor Baileys v7 + Evolution Webhook</p>
            </div>
          </div>

          <button 
            id="close-qr-modal-btn"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {isConnected ? (
            /* Connected state */
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 border border-emerald-200 shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <h4 className="text-lg font-bold text-slate-900">{instance.phone}</h4>
              <p className="text-xs text-slate-500 mt-1">{instance.pushName} • {instance.name}</p>

              <div className="mt-6 bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left space-y-2.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span className="text-slate-500">Status da Sessão:</span>
                  <span className="font-semibold text-emerald-600 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" /> Ativa e autenticada
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Nível da Bateria do Aparelho:</span>
                  <span className="font-mono font-bold text-slate-800">{instance.battery}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Protocolo de Envio:</span>
                  <span className="font-mono font-medium text-slate-800">WhatsApp Web Multi-Device</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Proteção Anti-Ban:</span>
                  <span className="font-semibold text-emerald-700">Ativa (Delays dinâmicos 35s-85s)</span>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  id="reconnect-instance-btn"
                  onClick={onReconnect}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold py-2.5 px-4 rounded-xl transition-all"
                >
                  <RefreshCw className="w-4 h-4" />
                  Gerar Novo QR Code
                </button>
                <button
                  id="disconnect-instance-btn"
                  onClick={onDisconnect}
                  className="inline-flex items-center justify-center gap-2 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold py-2.5 px-4 rounded-xl border border-rose-200 transition-all"
                >
                  <Unplug className="w-4 h-4" />
                  Desconectar
                </button>
              </div>
            </div>
          ) : (
            /* Disconnected / Pairing state */
            <div>
              {/* Switch Tab */}
              <div className="flex bg-slate-100 p-1 rounded-xl mb-5">
                <button
                  onClick={() => setTab("qr")}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                    tab === "qr" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  <QrCode className="w-3.5 h-3.5" />
                  Ler QR Code
                </button>
                <button
                  onClick={() => setTab("code")}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                    tab === "code" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  Código de Pareamento
                </button>
              </div>

              {tab === "qr" ? (
                <div className="flex flex-col items-center">
                  <div className="relative p-4 bg-white border-2 border-slate-200 rounded-2xl shadow-inner">
                    {(instance.qrCodeUrl || localQr) ? (
                      <img 
                        src={instance.qrCodeUrl || localQr || ""} 
                        alt="WhatsApp QR Code" 
                        className="w-52 h-52 object-contain"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-52 h-52 bg-slate-50 rounded-xl flex flex-col items-center justify-center border border-dashed border-slate-300">
                        <QrCode className="w-12 h-12 text-slate-400 animate-pulse" />
                        <span className="text-xs text-slate-500 mt-2">Gerando QR Code seguro...</span>
                      </div>
                    )}

                    {/* Expiration Progress Bar */}
                    <div className="mt-3 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-emerald-500 h-full transition-all duration-1000 ease-linear"
                        style={{ width: `${(timer / 30) * 100}%` }}
                      />
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 mt-2 font-mono flex items-center gap-1">
                    <RefreshCw className="w-3 h-3 animate-spin text-slate-400" />
                    Atualiza em <strong className="text-slate-800">{timer}s</strong>
                  </p>

                  {/* Steps instructions */}
                  <div className="w-full mt-4 bg-slate-50 rounded-xl p-3.5 border border-slate-100 text-xs text-slate-600 space-y-1.5 text-left">
                    <p className="font-semibold text-slate-800 mb-1">Como escanear no seu celular:</p>
                    <p>1. Abra o WhatsApp no celular</p>
                    <p>2. Toque em <strong>Mais opções</strong> (⋮) ou <strong>Configurações</strong> (⚙️)</p>
                    <p>3. Selecione <strong>Aparelhos conectados</strong> &rarr; <strong>Conectar um aparelho</strong></p>
                    <p>4. Aponte a câmera para a tela</p>
                  </div>
                </div>
              ) : (
                /* Pairing code */
                <div className="text-center py-2">
                  <p className="text-xs text-slate-600 mb-3">
                    Digite este código no seu WhatsApp em: <br />
                    <em>Aparelhos Conectados &rarr; Conectar com número de telefone</em>
                  </p>

                  <div className="bg-slate-900 text-emerald-400 font-mono text-2xl font-bold py-3.5 px-6 rounded-2xl tracking-widest inline-flex items-center gap-3 border border-slate-800 shadow-md">
                    <span>{instance.pairCode}</span>
                    <button 
                      onClick={handleCopyCode}
                      className="p-1 hover:bg-slate-800 rounded-lg text-slate-300 hover:text-white transition-colors"
                      title="Copiar código"
                    >
                      {copied ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
                    </button>
                  </div>

                  {copied && (
                    <p className="text-[11px] text-emerald-600 font-medium mt-2 animate-in fade-in">
                      Código copiado para a área de transferência!
                    </p>
                  )}

                  <div className="w-full mt-6 bg-slate-50 rounded-xl p-3.5 border border-slate-100 text-xs text-slate-600 space-y-1.5 text-left">
                    <p className="font-semibold text-slate-800">Dica Anti-Ban:</p>
                    <p className="text-slate-500">
                      Utilize sempre números aquecidos (com mais de 3 semanas de uso) para disparos de vídeos em grupos.
                    </p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-6 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
                <button
                  id="simulate-confirm-pair-btn"
                  onClick={onConfirmPair}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs py-3 px-4 rounded-xl transition-all shadow-xs shadow-emerald-600/20 flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Simular Conexão Concluída
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

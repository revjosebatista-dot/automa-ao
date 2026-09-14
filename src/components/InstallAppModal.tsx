import React, { useState, useEffect } from "react";
import { 
  Download, 
  X, 
  Smartphone, 
  Apple, 
  Monitor, 
  Share2, 
  PlusSquare, 
  Check, 
  HelpCircle,
  FileCode2,
  ExternalLink
} from "lucide-react";

interface InstallAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallAppModal: React.FC<InstallAppModalProps> = ({ isOpen, onClose }) => {
  const [activePlatform, setActivePlatform] = useState<"ios" | "android" | "pc" | "code">("ios");
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Listen for PWA prompt on supported browsers
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleNativeInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden animate-in zoom-in-95">
        
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">Baixar e Instalar o App</h3>
              <p className="text-xs text-slate-300">Instale no celular, computador ou baixe o código-fonte</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-slate-200 bg-slate-50 p-1.5 gap-1 text-xs font-semibold text-slate-600">
          <button
            onClick={() => setActivePlatform("ios")}
            className={`flex-1 py-2 px-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              activePlatform === "ios" ? "bg-white text-emerald-700 shadow-xs border border-slate-200/80 font-bold" : "hover:bg-slate-100"
            }`}
          >
            <Apple className="w-3.5 h-3.5" />
            <span>iPhone / iPad</span>
          </button>
          <button
            onClick={() => setActivePlatform("android")}
            className={`flex-1 py-2 px-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              activePlatform === "android" ? "bg-white text-emerald-700 shadow-xs border border-slate-200/80 font-bold" : "hover:bg-slate-100"
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Android</span>
          </button>
          <button
            onClick={() => setActivePlatform("pc")}
            className={`flex-1 py-2 px-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              activePlatform === "pc" ? "bg-white text-emerald-700 shadow-xs border border-slate-200/80 font-bold" : "hover:bg-slate-100"
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>PC / Mac</span>
          </button>
          <button
            onClick={() => setActivePlatform("code")}
            className={`flex-1 py-2 px-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              activePlatform === "code" ? "bg-white text-emerald-700 shadow-xs border border-slate-200/80 font-bold" : "hover:bg-slate-100"
            }`}
          >
            <FileCode2 className="w-3.5 h-3.5" />
            <span>Código ZIP</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          
          {/* iOS Section */}
          {activePlatform === "ios" && (
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">1</div>
                  <p className="text-xs text-slate-700">Abra o site no navegador <strong>Safari</strong> do seu iPhone.</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">2</div>
                  <p className="text-xs text-slate-700 flex items-center gap-1.5">
                    Toque no botão <strong>Compartilhar</strong> <Share2 className="w-3.5 h-3.5 text-blue-600 inline" /> (quadrado com a seta para cima na barra inferior).
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">3</div>
                  <p className="text-xs text-slate-700 flex items-center gap-1.5">
                    Role e toque em <strong>"Adicionar à Tela de Início"</strong> <PlusSquare className="w-3.5 h-3.5 text-slate-600 inline" />.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">4</div>
                  <p className="text-xs text-slate-700">Toque em <strong>Adicionar</strong> no canto superior direito.</p>
                </div>
              </div>
              <p className="text-[11px] text-slate-500 text-center">
                ✨ O aplicativo ficará salvo na tela inicial do seu celular, abrindo direto em tela cheia e sem barras de navegação!
              </p>
            </div>
          )}

          {/* Android Section */}
          {activePlatform === "android" && (
            <div className="space-y-3">
              {deferredPrompt && (
                <button
                  onClick={handleNativeInstall}
                  className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Instalar Agora no Android (1 Clique)</span>
                </button>
              )}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">1</div>
                  <p className="text-xs text-slate-700">Abra o site no navegador <strong>Google Chrome</strong> do Android.</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">2</div>
                  <p className="text-xs text-slate-700">Toque nos <strong>três pontinhos</strong> (⋮) no canto superior direito.</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">3</div>
                  <p className="text-xs text-slate-700">Selecione <strong>"Instalar aplicativo"</strong> ou <strong>"Adicionar à tela inicial"</strong>.</p>
                </div>
              </div>
            </div>
          )}

          {/* PC / Desktop Section */}
          {activePlatform === "pc" && (
            <div className="space-y-3">
              {deferredPrompt ? (
                <button
                  onClick={handleNativeInstall}
                  className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Instalar Aplicativo no Computador</span>
                </button>
              ) : (
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                  <p className="text-xs text-slate-700">
                    No <strong>Google Chrome</strong>, <strong>Edge</strong> ou <strong>Brave</strong>:
                  </p>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">1</div>
                    <p className="text-xs text-slate-700">Olhe na barra de endereço (onde fica a URL do site).</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">2</div>
                    <p className="text-xs text-slate-700">Clique no ícone de <strong>computador com setinha</strong> ou <strong>"Instalar aplicativo"</strong>.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">3</div>
                    <p className="text-xs text-slate-700">O AutoBroadcast abrirá como uma janela de aplicativo dedicada na barra de tarefas!</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ZIP Code Section */}
          {activePlatform === "code" && (
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5 text-xs text-slate-700">
                <p className="font-semibold text-slate-900">Como baixar o projeto completo para rodar na sua máquina:</p>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-slate-900">1.</span>
                    <span>No topo desta tela do Google AI Studio, localize o menu de <strong>Opções / Configurações</strong> (ou o botão com três pontinhos <strong>···</strong> no canto superior direito).</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-slate-900">2.</span>
                    <span>Clique em <strong>"Export to GitHub"</strong> ou <strong>"Download as ZIP"</strong>.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-slate-900">3.</span>
                    <span>Extraia a pasta e execute: <code className="bg-slate-200 px-1 py-0.5 rounded font-mono text-[11px]">npm install && npm run dev</code></span>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="text-[11px] text-slate-500">
            {isInstalled ? (
              <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                <Check className="w-3.5 h-3.5" /> App já instalado nesta máquina
              </span>
            ) : (
              <span>Compatível com iOS, Android, Windows e macOS</span>
            )}
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-all"
          >
            Entendi
          </button>
        </div>

      </div>
    </div>
  );
};

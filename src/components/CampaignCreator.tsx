import React, { useState } from "react";
import { 
  Film, 
  Upload, 
  Sparkles, 
  Shuffle, 
  Users, 
  Clock, 
  ShieldCheck, 
  Play, 
  AlertTriangle, 
  Check, 
  Sliders, 
  Send,
  FileVideo,
  FileText
} from "lucide-react";
import { WhatsAppGroup } from "../types";

interface CampaignCreatorProps {
  groups: WhatsAppGroup[];
  onStartCampaign: (campaignData: any) => void;
  isDispatching: boolean;
}

const SAMPLE_VIDEOS = [
  {
    name: "pitch_lancamento_oficial_2026.mp4",
    title: "🚀 Teaser Lançamento Oficial (48s)",
    size: "14.8 MB",
    duration: "00:48",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  },
  {
    name: "depoimento_aluno_resultado.mp4",
    title: "📈 Depoimento Aluno Resultado (1m15s)",
    size: "24.1 MB",
    duration: "01:15",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
  },
  {
    name: "demo_tutorial_passo_a_passo.mp4",
    title: "⚡ Demonstração Prática Produto (32s)",
    size: "9.2 MB",
    duration: "00:32",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
  }
];

export const CampaignCreator: React.FC<CampaignCreatorProps> = ({
  groups,
  onStartCampaign,
  isDispatching,
}) => {
  const [title, setTitle] = useState("Disparo Oficial de Vídeo - Grupo VIPs");
  const [selectedVideo, setSelectedVideo] = useState(SAMPLE_VIDEOS[0]);
  const [caption, setCaption] = useState(
    "{Fala pessoal!|Olá membros do {nome_grupo}!|Tudo bem com vocês?}\n\nAcabamos de liberar o vídeo inédito com todas as informações que vocês pediram!\n\n👉 Aperte o play no vídeo acima para assistir agora mesmo.\n\nQualquer dúvida estou por aqui!"
  );
  const [testedCaption, setTestedCaption] = useState<string | null>(null);
  const [selectedGroupIds, setSelectedGroupIds] = useState<string[]>(
    groups.map((g) => g.id)
  );
  const [minDelay, setMinDelay] = useState(35);
  const [maxDelay, setMaxDelay] = useState(75);
  const [antiBanTyping, setAntiBanTyping] = useState(true);
  const [sendAsDocument, setSendAsDocument] = useState(false);
  const [customFileUploaded, setCustomFileUploaded] = useState(false);

  // Group selection toggle
  const toggleGroup = (id: string) => {
    setSelectedGroupIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const selectAllGroups = () => {
    setSelectedGroupIds(groups.map((g) => g.id));
  };

  const deselectAllGroups = () => {
    setSelectedGroupIds([]);
  };

  // Insert tag into caption
  const insertTag = (tag: string) => {
    setCaption((prev) => prev + " " + tag);
  };

  // Test Spintax resolution
  const handleTestSpintax = () => {
    const resolved = caption
      .replace(/{([^{}]+)}/g, (_, choices) => {
        const parts = choices.split("|");
        return parts[Math.floor(Math.random() * parts.length)].trim();
      })
      .replace(/{nome_grupo}/g, "Grupo VIP Exemplo")
      .replace(/{data}/g, new Date().toLocaleDateString("pt-BR"))
      .replace(/{hora}/g, new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }));
    
    setTestedCaption(resolved);
  };

  // Handle local file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const blobUrl = URL.createObjectURL(file);
      setSelectedVideo({
        name: file.name,
        title: `📁 ${file.name}`,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        duration: "Detectando...",
        url: blobUrl,
      });
      setCustomFileUploaded(true);
    }
  };

  // Calculate estimated reach
  const totalAudience = groups
    .filter((g) => selectedGroupIds.includes(g.id))
    .reduce((acc, g) => acc + g.membersCount, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedGroupIds.length === 0) {
      alert("Por favor selecione pelo menos 1 grupo de destino.");
      return;
    }

    onStartCampaign({
      title,
      videoName: selectedVideo.name,
      videoSize: selectedVideo.size,
      videoDuration: selectedVideo.duration,
      videoUrl: selectedVideo.url,
      caption,
      targetGroups: groups.filter((g) => selectedGroupIds.includes(g.id)).map((g) => g.name),
      delayMin: minDelay,
      delayMax: maxDelay,
      antiBanTyping,
      sendAsDocument,
    });
  };

  return (
    <form id="campaign-creator-form" onSubmit={handleSubmit} className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Film className="w-5 h-5 text-emerald-600" />
              Novo Disparo em Massa de Vídeo
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Envie vídeos com alta taxa de conversão para múltiplos grupos de WhatsApp com proteção Anti-Ban Spintax e delays humanizados.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs bg-slate-100 border border-slate-200 text-slate-700 px-3 py-1.5 rounded-xl font-mono">
              Grupos: <strong className="text-slate-900">{selectedGroupIds.length}</strong> / {groups.length}
            </span>
            <span className="text-xs bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-1.5 rounded-xl font-mono">
              Alcance: <strong className="text-emerald-900">{totalAudience.toLocaleString("pt-BR")}</strong> pessoas
            </span>
          </div>
        </div>

        {/* Campaign Title */}
        <div className="mt-5">
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Identificação / Nome da Campanha
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white focus:outline-none rounded-xl px-4 py-2.5 text-sm text-slate-900 transition-colors"
            placeholder="Ex: Campanha Teaser Black Friday 2026"
          />
        </div>
      </div>

      {/* Main Grid: Video Selection & Caption */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Col: Video Player & Presets (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <FileVideo className="w-4 h-4 text-emerald-600" />
                Vídeo Selecionado para Envio
              </span>
              <span className="text-[11px] font-mono text-slate-500">{selectedVideo.size}</span>
            </h3>

            {/* Live Video Preview Player */}
            <div className="relative rounded-xl overflow-hidden bg-slate-950 aspect-video border border-slate-800 shadow-inner flex items-center justify-center">
              <video
                key={selectedVideo.url}
                src={selectedVideo.url}
                controls
                preload="metadata"
                className="w-full h-full object-contain"
              />
            </div>

            {/* Video Meta Info */}
            <div className="mt-3 p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs space-y-1">
              <div className="flex justify-between text-slate-600">
                <span>Arquivo:</span>
                <span className="font-mono font-medium text-slate-800 truncate max-w-[200px]">
                  {selectedVideo.name}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Duração Estimada:</span>
                <span className="font-mono text-slate-800 font-semibold">{selectedVideo.duration}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Formato de Transmissão:</span>
                <span className="text-emerald-700 font-medium">MP4 H.264 (WhatsApp Fast-Start)</span>
              </div>
            </div>

            {/* Quick Sample Selector */}
            <div className="mt-4">
              <span className="block text-xs font-semibold text-slate-700 mb-2">
                Ou selecione um vídeo de teste:
              </span>
              <div className="space-y-1.5">
                {SAMPLE_VIDEOS.map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setSelectedVideo(sample);
                      setCustomFileUploaded(false);
                    }}
                    className={`w-full text-left p-2.5 rounded-xl border text-xs flex items-center justify-between transition-all ${
                      selectedVideo.name === sample.name
                        ? "bg-emerald-50/70 border-emerald-300 text-emerald-950 font-medium"
                        : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <span className="truncate">{sample.title}</span>
                    <span className="font-mono text-[11px] text-slate-400">{sample.size}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Upload Custom Video */}
            <div className="mt-4 pt-3 border-t border-slate-100">
              <label className="cursor-pointer flex items-center justify-center gap-2 w-full py-2.5 px-3 border border-dashed border-slate-300 hover:border-emerald-500 rounded-xl bg-slate-50 hover:bg-emerald-50/40 text-xs font-medium text-slate-700 hover:text-emerald-800 transition-all">
                <Upload className="w-4 h-4 text-slate-500" />
                <span>Carregar Vídeo do Meu Computador</span>
                <input
                  type="file"
                  accept="video/mp4,video/webm,video/quicktime"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Format toggle: Video inline vs Document */}
            <div className="mt-4 p-3 bg-slate-50 border border-slate-200/80 rounded-xl space-y-2">
              <span className="block text-xs font-semibold text-slate-800">Modo de Envio no WhatsApp:</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSendAsDocument(false)}
                  className={`py-2 px-3 rounded-lg text-xs font-medium border text-center transition-all ${
                    !sendAsDocument
                      ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  Inline (Com Play)
                </button>
                <button
                  type="button"
                  onClick={() => setSendAsDocument(true)}
                  className={`py-2 px-3 rounded-lg text-xs font-medium border text-center transition-all ${
                    sendAsDocument
                      ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  Documento (HD 100%)
                </button>
              </div>
              <p className="text-[11px] text-slate-500">
                {!sendAsDocument
                  ? "O vídeo aparece com capa e botão de play direto no chat dos grupos."
                  : "Envia o arquivo original sem compressão do WhatsApp, ideal para vídeos em alta fidelidade."}
              </p>
            </div>
          </div>
        </div>

        {/* Right Col: Caption with Spintax, Tags & Group Picker (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* Caption Editor */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-emerald-600" />
                Legenda do Vídeo com Spintax
              </label>
              <button
                type="button"
                onClick={handleTestSpintax}
                className="inline-flex items-center gap-1 text-xs text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-200 font-semibold transition-colors"
              >
                <Shuffle className="w-3.5 h-3.5" />
                Testar Variação Spintax
              </button>
            </div>

            <textarea
              rows={6}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white focus:outline-none rounded-xl p-3.5 text-sm text-slate-900 font-sans leading-relaxed transition-colors"
              placeholder="Digite a legenda que acompanha o vídeo..."
            />

            {/* Dynamic Tags Bar */}
            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-semibold text-slate-500 mr-1">Inserir Variáveis:</span>
              <button
                type="button"
                onClick={() => insertTag("{nome_grupo}")}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs px-2.5 py-1 rounded-lg font-mono transition-colors"
              >
                {"{nome_grupo}"}
              </button>
              <button
                type="button"
                onClick={() => insertTag("{data}")}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs px-2.5 py-1 rounded-lg font-mono transition-colors"
              >
                {"{data}"}
              </button>
              <button
                type="button"
                onClick={() => insertTag("{hora}")}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs px-2.5 py-1 rounded-lg font-mono transition-colors"
              >
                {"{hora}"}
              </button>
              <button
                type="button"
                onClick={() => insertTag("{Olá|Fala pessoal|E aí time}")}
                className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs px-2.5 py-1 rounded-lg font-mono border border-emerald-200 transition-colors"
              >
                + Spintax Saudação
              </button>
            </div>

            {/* Tested variation preview box */}
            {testedCaption && (
              <div className="mt-4 p-3.5 bg-emerald-50/60 border border-emerald-200 rounded-xl">
                <span className="block text-[11px] font-bold text-emerald-900 uppercase tracking-wider mb-1">
                  Exemplo de como um grupo específico receberá:
                </span>
                <p className="text-xs text-emerald-950 whitespace-pre-line font-medium leading-relaxed">
                  {testedCaption}
                </p>
              </div>
            )}
          </div>

          {/* Group Target Selection */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-emerald-600" />
                Grupos Alvo de Disparo ({selectedGroupIds.length} selecionados)
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={selectAllGroups}
                  className="text-xs text-emerald-700 hover:underline font-semibold"
                >
                  Marcar Todos
                </button>
                <span className="text-slate-300">•</span>
                <button
                  type="button"
                  onClick={deselectAllGroups}
                  className="text-xs text-slate-500 hover:underline font-medium"
                >
                  Desmarcar
                </button>
              </div>
            </div>

            <div className="max-h-56 overflow-y-auto space-y-2 pr-1">
              {groups.map((group) => {
                const isSelected = selectedGroupIds.includes(group.id);
                return (
                  <div
                    key={group.id}
                    onClick={() => toggleGroup(group.id)}
                    className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      isSelected
                        ? "bg-emerald-50/50 border-emerald-300"
                        : "bg-white border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                        isSelected ? "bg-emerald-600 border-emerald-600 text-white" : "border-slate-300 bg-white"
                      }`}>
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <img 
                        src={group.avatar} 
                        alt={group.name}
                        className="w-8 h-8 rounded-lg object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <p className="text-xs font-semibold text-slate-900 truncate max-w-[280px]">
                          {group.name}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          {group.category} • {group.membersCount} participantes
                        </p>
                      </div>
                    </div>

                    <span className="text-[10px] font-mono font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                      {group.isAdmin ? "Admin" : "Membro"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Anti-Ban & Delay Settings */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Configurações do Algoritmo Anti-Ban
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Delay Mínimo entre Disparos: <span className="font-mono text-emerald-700">{minDelay}s</span>
                </label>
                <input
                  type="range"
                  min={15}
                  max={60}
                  value={minDelay}
                  onChange={(e) => setMinDelay(Number(e.target.value))}
                  className="w-full accent-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Delay Máximo entre Disparos: <span className="font-mono text-emerald-700">{maxDelay}s</span>
                </label>
                <input
                  type="range"
                  min={40}
                  max={150}
                  value={maxDelay}
                  onChange={(e) => setMaxDelay(Number(e.target.value))}
                  className="w-full accent-emerald-600"
                />
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="anti-ban-typing"
                  checked={antiBanTyping}
                  onChange={(e) => setAntiBanTyping(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600 accent-emerald-600"
                />
                <label htmlFor="anti-ban-typing" className="text-xs text-slate-700 font-medium cursor-pointer">
                  Simular presença natural (mostrar status <em>"gravando vídeo..."</em> antes do envio)
                </label>
              </div>
            </div>
          </div>

          {/* Action Trigger Button */}
          <div className="pt-2">
            <button
              id="start-campaign-btn"
              type="submit"
              disabled={isDispatching || selectedGroupIds.length === 0}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-sm font-bold py-3.5 px-6 rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Iniciar Disparo em Massa de Vídeo nos {selectedGroupIds.length} Grupos</span>
            </button>
          </div>
        </div>

      </div>
    </form>
  );
};

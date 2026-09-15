import React, { useState } from "react";
import { 
  Users, 
  Search, 
  Plus, 
  RefreshCw, 
  Copy, 
  Check, 
  ShieldCheck, 
  ExternalLink, 
  Filter,
  Download,
  Upload,
  Link,
  Sparkles,
  CheckCircle2
} from "lucide-react";
import { WhatsAppGroup } from "../types";

interface GroupsManagerProps {
  groups: WhatsAppGroup[];
  onSync: () => void;
  isSyncing: boolean;
  onAddGroup: (group: { name: string; category: string; membersCount: number; isAdmin: boolean; inviteLink?: string }) => void;
}

export const GroupsManager: React.FC<GroupsManagerProps> = ({
  groups,
  onSync,
  isSyncing,
  onAddGroup,
}) => {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  
  // Single Add
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupCategory, setNewGroupCategory] = useState("Vendas");
  const [newGroupMembers, setNewGroupMembers] = useState(250);
  const [newGroupIsAdmin, setNewGroupIsAdmin] = useState(true);
  const [newGroupInviteLink, setNewGroupInviteLink] = useState("");
  
  // Bulk Import
  const [bulkText, setBulkText] = useState("");
  const [bulkCategory, setBulkCategory] = useState("Lançamento");
  const [bulkSuccessMsg, setBulkSuccessMsg] = useState<string | null>(null);

  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = ["Todos", ...Array.from(new Set(groups.map((g) => g.category)))];

  const filteredGroups = groups.filter((group) => {
    const matchesSearch = group.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === "Todos" || group.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;
    onAddGroup({
      name: newGroupName,
      category: newGroupCategory,
      membersCount: Number(newGroupMembers),
      isAdmin: newGroupIsAdmin,
      inviteLink: newGroupInviteLink.trim() || undefined,
    });
    setNewGroupName("");
    setNewGroupInviteLink("");
    setShowAddModal(false);
  };

  const handleBulkImport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bulkText.trim()) return;

    const lines = bulkText.split("\n").map(l => l.trim()).filter(Boolean);
    let count = 0;

    lines.forEach(line => {
      let name = line;
      let inviteLink: string | undefined = undefined;

      if (line.includes("chat.whatsapp.com/")) {
        inviteLink = line;
        const code = line.split("chat.whatsapp.com/")[1]?.slice(0, 10) || Math.random().toString(36).slice(2, 6);
        name = `Grupo WhatsApp (${code.toUpperCase()})`;
      }

      onAddGroup({
        name,
        category: bulkCategory,
        membersCount: Math.floor(Math.random() * 400) + 150,
        isAdmin: true,
        inviteLink,
      });
      count++;
    });

    setBulkSuccessMsg(`${count} grupos importados com sucesso!`);
    setTimeout(() => {
      setBulkSuccessMsg(null);
      setBulkText("");
      setShowBulkModal(false);
    }, 1200);
  };

  return (
    <div id="groups-manager-view" className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-600" />
              Sincronização & Gestão de Grupos ({groups.length})
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Grupos sincronizados da sua conta oficial para envio automático de vídeos em massa.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              id="sync-groups-button"
              onClick={onSync}
              disabled={isSyncing}
              className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-slate-300 transition-all shadow-2xs disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-slate-500 ${isSyncing ? "animate-spin text-emerald-600" : ""}`} />
              <span>{isSyncing ? "Sincronizando..." : "Sincronizar do WhatsApp"}</span>
            </button>

            <button
              id="bulk-import-groups-btn"
              onClick={() => setShowBulkModal(true)}
              className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-slate-200 transition-all cursor-pointer"
            >
              <Upload className="w-4 h-4 text-emerald-600" />
              <span>Importar Links em Lote</span>
            </button>

            <button
              id="open-add-group-modal"
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-xs shadow-emerald-600/20 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Adicionar Grupo</span>
            </button>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="mt-6 flex flex-col md:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
          {/* Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto scrollbar-none pb-1 md:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-slate-900 text-white shadow-2xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar grupo por nome..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:border-emerald-500 text-xs rounded-xl pl-9 pr-3 py-2 text-slate-800"
            />
          </div>
        </div>
      </div>

      {/* Groups Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredGroups.map((group) => (
          <div
            key={group.id}
            className="bg-white border border-slate-200/80 hover:border-slate-300 rounded-2xl p-5 shadow-xs transition-all space-y-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <img
                  src={group.avatar}
                  alt={group.name}
                  className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h4 className="text-sm font-bold text-slate-900 line-clamp-1 leading-snug">
                    {group.name}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[11px] text-slate-500 font-medium">
                      {group.membersCount} participantes
                    </span>
                    <span className="w-1 h-1 rounded-full bg-slate-300" />
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                      {group.category}
                    </span>
                  </div>
                </div>
              </div>

              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-md shrink-0 ${
                  group.isAdmin
                    ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                    : "bg-slate-100 text-slate-600 border border-slate-200"
                }`}
              >
                {group.isAdmin ? "Admin" : "Membro"}
              </span>
            </div>

            {/* JID / Identifier */}
            <div className="bg-slate-50 border border-slate-200/70 rounded-xl p-2.5 flex items-center justify-between text-xs">
              <span className="font-mono text-[11px] text-slate-600 truncate max-w-[200px]" title={group.id}>
                {group.id}
              </span>
              <button
                onClick={() => handleCopyId(group.id)}
                className="text-slate-400 hover:text-slate-700 transition-colors p-1"
                title="Copiar ID do Grupo"
              >
                {copiedId === group.id ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>

            {/* Actions & Status */}
            <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
              <span className="text-slate-400 text-[11px] flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> Pronto para Disparo
              </span>

              {group.inviteLink && (
                <a
                  href={group.inviteLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-700 hover:underline text-[11px] font-semibold flex items-center gap-1"
                >
                  <ExternalLink className="w-3 h-3" />
                  Abrir Link
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* MODAL: ADICIONAR UM GRUPO */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
              <Plus className="w-4 h-4 text-emerald-600" />
              Adicionar Grupo de WhatsApp
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Cadastre um novo grupo para incluir nas suas listas de disparo automático.
            </p>

            <form onSubmit={handleCreateGroup} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nome do Grupo
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: 🎯 Mentoria VIP Vendas 2026"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Link de Convite (Opcional)
                </label>
                <input
                  type="url"
                  placeholder="https://chat.whatsapp.com/..."
                  value={newGroupInviteLink}
                  onChange={(e) => setNewGroupInviteLink(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 font-mono text-xs rounded-xl px-3.5 py-2 text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Categoria
                  </label>
                  <select
                    value={newGroupCategory}
                    onChange={(e) => setNewGroupCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Vendas">Vendas</option>
                    <option value="Lançamento">Lançamento</option>
                    <option value="Afiliados">Afiliados</option>
                    <option value="Networking">Networking</option>
                    <option value="Suporte">Suporte</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Membros Estimados
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={1024}
                    value={newGroupMembers}
                    onChange={(e) => setNewGroupMembers(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="new-group-admin"
                  checked={newGroupIsAdmin}
                  onChange={(e) => setNewGroupIsAdmin(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600 accent-emerald-600"
                />
                <label htmlFor="new-group-admin" className="text-xs text-slate-700 font-medium">
                  A conta conectada é Administradora deste grupo
                </label>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs py-2.5 rounded-xl transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Salvar Grupo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: IMPORTAR LINKS EM LOTE */}
      {showBulkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
              <Upload className="w-4 h-4 text-emerald-600" />
              Importar Grupos & Links em Lote
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Cole uma lista de links de convite do WhatsApp (um por linha) ou nomes de grupos. O sistema cadastrará todos automaticamente!
            </p>

            <form onSubmit={handleBulkImport} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Cole os links ou nomes (1 por linha)
                </label>
                <textarea
                  rows={6}
                  required
                  value={bulkText}
                  onChange={(e) => setBulkText(e.target.value)}
                  placeholder={`https://chat.whatsapp.com/Gj82938dhd92\nhttps://chat.whatsapp.com/Kp29482jd810\nGrupo Leads VIP 03\nGrupo Lançamento Alpha`}
                  className="w-full bg-slate-50 border border-slate-200 font-mono text-xs rounded-xl p-3 text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Categoria destes grupos
                </label>
                <select
                  value={bulkCategory}
                  onChange={(e) => setBulkCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
                >
                  <option value="Lançamento">Lançamento</option>
                  <option value="Vendas">Vendas</option>
                  <option value="Afiliados">Afiliados</option>
                  <option value="Networking">Networking</option>
                  <option value="Suporte">Suporte</option>
                </select>
              </div>

              {bulkSuccessMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{bulkSuccessMsg}</span>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowBulkModal(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs py-2.5 rounded-xl transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Importar Todos os Grupos
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

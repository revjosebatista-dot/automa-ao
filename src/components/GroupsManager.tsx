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
  Download
} from "lucide-react";
import { WhatsAppGroup } from "../types";

interface GroupsManagerProps {
  groups: WhatsAppGroup[];
  onSync: () => void;
  isSyncing: boolean;
  onAddGroup: (group: { name: string; category: string; membersCount: number; isAdmin: boolean }) => void;
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
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupCategory, setNewGroupCategory] = useState("Vendas");
  const [newGroupMembers, setNewGroupMembers] = useState(250);
  const [newGroupIsAdmin, setNewGroupIsAdmin] = useState(true);
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
    });
    setNewGroupName("");
    setShowAddModal(false);
  };

  return (
    <div id="groups-manager-view" className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-600" />
              Gerenciador de Grupos do WhatsApp
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Todos os grupos sincronizados da sua conta do WhatsApp para segmentação e disparos.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="sync-groups-button"
              onClick={onSync}
              disabled={isSyncing}
              className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-slate-300 transition-all shadow-2xs disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-slate-500 ${isSyncing ? "animate-spin text-emerald-600" : ""}`} />
              <span>{isSyncing ? "Sincronizando..." : "Sincronizar com WhatsApp"}</span>
            </button>

            <button
              id="open-add-group-modal"
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-xs shadow-emerald-600/20"
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
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
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
                  <h3 className="text-sm font-bold text-slate-900 line-clamp-1" title={group.name}>
                    {group.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-semibold uppercase tracking-wider bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                      {group.category}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">
                      {group.membersCount} membros
                    </span>
                  </div>
                </div>
              </div>

              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                  group.isAdmin
                    ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                    : "bg-slate-50 text-slate-600 border-slate-200"
                }`}
              >
                {group.isAdmin ? "Admin" : "Membro"}
              </span>
            </div>

            {/* JID / Group WhatsApp ID */}
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center justify-between text-[11px] font-mono text-slate-500">
              <span className="truncate max-w-[200px]">{group.id}</span>
              <button
                onClick={() => handleCopyId(group.id)}
                className="p-1 hover:bg-slate-200 rounded text-slate-600 transition-colors ml-2"
                title="Copiar ID do Grupo"
              >
                {copiedId === group.id ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Última atividade: {group.lastActivity}</span>
              <span className="text-emerald-700 font-semibold">Pronto para envio</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Adicionar Novo Grupo */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-1">Adicionar Grupo à Lista</h3>
            <p className="text-xs text-slate-500 mb-4">
              Cadastre um novo grupo ou cole o link de convite do WhatsApp.
            </p>

            <form onSubmit={handleCreateGroup} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nome do Grupo
                </label>
                <input
                  type="text"
                  required
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="Ex: Grupo VIP Ofertas 2026"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Categoria / Tag
                </label>
                <select
                  value={newGroupCategory}
                  onChange={(e) => setNewGroupCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
                >
                  <option value="Vendas">Vendas</option>
                  <option value="Alunos">Alunos</option>
                  <option value="Afiliados">Afiliados</option>
                  <option value="Lançamento">Lançamento</option>
                  <option value="Networking">Networking</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Quantidade Estimada de Membros
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
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs py-2.5 rounded-xl transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 rounded-xl shadow-xs transition-colors"
                >
                  Salvar Grupo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

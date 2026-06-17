import { useState } from "react";
import { Search, Plus, MoreHorizontal, Mail, ChevronUp, ChevronDown, Trash2, Edit } from "lucide-react";
import { UserFormModal, getInitials, getAvatarColor, ROLE_STYLES, ROLE_ICONS } from "./components/UserFormModal.tsx"
import type { UserForm, Role, Status } from "./components/UserFormModal.tsx"

{/* MARKER-MAKE-KIT-INVOKED */ }

interface UserData {
  id: number;
  name: string;
  email: string;
  role: Role;
  status: Status;
  joinedAt: string;
  avatarColor: string;
}

const MOCK_USERS_INITIAL: UserData[] = [
  { id: 1, name: "Ana Souza", email: "ana.souza@email.com", role: "Admin", status: "Ativo", joinedAt: "2024-01-15", avatarColor: "bg-violet-100 text-violet-700" },
  { id: 2, name: "Bruno Lima", email: "bruno.lima@email.com", role: "Editor", status: "Ativo", joinedAt: "2024-03-08", avatarColor: "bg-blue-100 text-blue-700" },
  { id: 3, name: "Carla Mendes", email: "carla.mendes@email.com", role: "Viewer", status: "Inativo", joinedAt: "2023-11-22", avatarColor: "bg-rose-100 text-rose-700" },
  { id: 4, name: "Diego Ferreira", email: "diego.ferreira@email.com", role: "Editor", status: "Ativo", joinedAt: "2024-05-10", avatarColor: "bg-amber-100 text-amber-700" },
  { id: 5, name: "Elena Costa", email: "elena.costa@email.com", role: "Viewer", status: "Ativo", joinedAt: "2024-02-28", avatarColor: "bg-emerald-100 text-emerald-700" },
  { id: 6, name: "Felipe Rocha", email: "felipe.rocha@email.com", role: "Admin", status: "Ativo", joinedAt: "2023-09-14", avatarColor: "bg-indigo-100 text-indigo-700" },
  { id: 7, name: "Gabriela Nunes", email: "gabriela.nunes@email.com", role: "Editor", status: "Inativo", joinedAt: "2024-04-03", avatarColor: "bg-pink-100 text-pink-700" },
  { id: 8, name: "Henrique Pinto", email: "henrique.pinto@email.com", role: "Viewer", status: "Ativo", joinedAt: "2024-06-01", avatarColor: "bg-cyan-100 text-cyan-700" },
];

type SortKey = "name" | "email" | "role" | "joinedAt";

type ModalState =
  | { type: "none" }
  | { type: "create" }
  | { type: "edit"; user: UserData };

export default function App() {
  const [users, setUsers] = useState<UserData[]>(MOCK_USERS_INITIAL);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<Role | "Todos">("Todos");
  const [statusFilter, setStatusFilter] = useState<Status | "Todos">("Todos");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortAsc, setSortAsc] = useState(true);
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const [modal, setModal] = useState<ModalState>({ type: "none" });

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc((v) => !v);
    else { setSortKey(key); setSortAsc(true); }
  };

  const handleCreate = (form: UserForm) => {
    const newUser: UserData = {
      id: Date.now(),
      name: form.name.trim(),
      email: form.email.trim(),
      role: form.role,
      status: form.status,
      joinedAt: new Date().toISOString().split("T")[0],
      avatarColor: getAvatarColor(form.name.trim()),
    };
    setUsers((prev) => [newUser, ...prev]);
    setModal({ type: "none" });
  };

  const handleEdit = (form: UserForm) => {
    if (modal.type !== "edit") return;
    setUsers((prev) =>
      prev.map((u) =>
        u.id === modal.user.id
          ? { ...u, name: form.name.trim(), email: form.email.trim(), role: form.role, status: form.status, avatarColor: getAvatarColor(form.name.trim()) }
          : u
      )
    );
    setModal({ type: "none" });
  };

  const handleDelete = (id: number) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    setOpenMenu(null);
  };

  const filtered = users
    .filter((u) => {
      const q = search.toLowerCase();
      return (
        (u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)) &&
        (roleFilter === "Todos" || u.role === roleFilter) &&
        (statusFilter === "Todos" || u.status === statusFilter)
      );
    })
    .sort((a, b) => {
      const va = a[sortKey], vb = b[sortKey];
      return sortAsc ? va.localeCompare(vb) : vb.localeCompare(va);
    });

  const SortIcon = ({ col }: { col: SortKey }) =>
    sortKey === col
      ? sortAsc ? <ChevronUp size={13} /> : <ChevronDown size={13} />
      : <ChevronUp size={13} className="opacity-0 group-hover:opacity-30" />;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-foreground">Usuários</h1>
            <p className="text-muted-foreground mt-0.5" style={{ fontSize: "0.875rem" }}>
              {users.length} usuários cadastrados
            </p>
          </div>
          <button
            onClick={() => setModal({ type: "create" })}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity cursor-pointer"
          >
            <Plus size={16} />
            Novo usuário
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-6 space-y-4">
        {/* Filters */}
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-56">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar por nome ou e-mail..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-border bg-input-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 transition"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as Role | "Todos")}
            className="px-3 py-2 rounded-lg border border-border bg-input-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 cursor-pointer"
          >
            <option value="Todos">Todas as funções</option>
            <option value="Admin">Admin</option>
            <option value="Editor">Editor</option>
            <option value="Viewer">Viewer</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as Status | "Todos")}
            className="px-3 py-2 rounded-lg border border-border bg-input-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 cursor-pointer"
          >
            <option value="Todos">Todos os status</option>
            <option value="Ativo">Ativo</option>
            <option value="Inativo">Inativo</option>
          </select>
        </div>

        {/* Table */}
        <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  {(["name", "email", "role", "joinedAt"] as SortKey[]).map((col) => (
                    <th
                      key={col}
                      onClick={() => toggleSort(col)}
                      className="group text-left px-5 py-3 text-muted-foreground cursor-pointer select-none hover:text-foreground transition-colors"
                    >
                      <span className="inline-flex items-center gap-1">
                        {{ name: "Nome", email: "E-mail", role: "Função", joinedAt: "Membro desde" }[col]}
                        <SortIcon col={col} />
                      </span>
                    </th>
                  ))}
                  <th className="text-left px-5 py-3 text-muted-foreground">Status</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-16 text-muted-foreground">
                      Nenhum usuário encontrado.
                    </td>
                  </tr>
                ) : (
                  filtered.map((user, idx) => (
                    <tr
                      key={user.id}
                      className={`border-b border-border last:border-0 hover:bg-accent/40 transition-colors ${idx % 2 === 0 ? "" : "bg-muted/10"}`}
                    >
                      {/* Name + avatar */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs shrink-0 ${user.avatarColor}`}>
                            {getInitials(user.name)}
                          </span>
                          <span className="text-foreground">{user.name}</span>
                        </div>
                      </td>
                      {/* Email */}
                      <td className="px-5 py-3.5 text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <Mail size={13} className="shrink-0" />
                          {user.email}
                        </div>
                      </td>
                      {/* Role */}
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${ROLE_STYLES[user.role]}`}>
                          {ROLE_ICONS[user.role]}
                          {user.role}
                        </span>
                      </td>
                      {/* Joined */}
                      <td className="px-5 py-3.5 text-muted-foreground">
                        {new Date(user.joinedAt).toLocaleDateString("pt-BR")}
                      </td>
                      {/* Status */}
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs border ${user.status === "Ativo" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-gray-50 text-gray-500 border-gray-200"}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${user.status === "Ativo" ? "bg-emerald-500" : "bg-gray-400"}`} />
                          {user.status}
                        </span>
                      </td>
                      {/* Actions */}
                      <td className="px-5 py-3.5">
                        <div className="relative flex justify-end">
                          <button
                            onClick={() => setOpenMenu(openMenu === user.id ? null : user.id)}
                            className="p-1.5 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                          >
                            <MoreHorizontal size={16} />
                          </button>
                          {openMenu === user.id && (
                            <div
                              className="absolute right-0 top-8 z-10 w-36 rounded-lg border border-border bg-card shadow-md py-1"
                              onMouseLeave={() => setOpenMenu(null)}
                            >
                              <button
                                onClick={() => { setModal({ type: "edit", user }); setOpenMenu(null); }}
                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-accent transition-colors cursor-pointer"
                              >
                                <Edit size={14} /> Editar
                              </button>
                              <button
                                onClick={() => handleDelete(user.id)}
                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                              >
                                <Trash2 size={14} /> Remover
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="px-5 py-3 border-t border-border bg-muted/20 flex items-center justify-between text-muted-foreground" style={{ fontSize: "0.8125rem" }}>
            <span>{filtered.length} de {users.length} usuários</span>
            <span>Página 1 de 1</span>
          </div>
        </div>
      </div>

      {/* Modals */}
      {modal.type === "create" && (
        <UserFormModal
          mode="create"
          onClose={() => setModal({ type: "none" })}
          onSave={handleCreate}
        />
      )}
      {modal.type === "edit" && (
        <UserFormModal
          mode="edit"
          initialValues={{ name: modal.user.name, email: modal.user.email, role: modal.user.role, status: modal.user.status }}
          onClose={() => setModal({ type: "none" })}
          onSave={handleEdit}
        />
      )}
    </div>
  );
}
import { useState } from "react";
import { Plus, Save, X, Shield, Edit, User } from "lucide-react";

export type Role = "Admin" | "Editor" | "Viewer";
export type Status = "Ativo" | "Inativo";

export interface UserForm {
    name: string;
    email: string;
    role: Role;
    status: Status;
}

export const ROLE_STYLES: Record<Role, string> = {
    Admin: "bg-violet-50 text-violet-700 border border-violet-200",
    Editor: "bg-blue-50 text-blue-700 border border-blue-200",
    Viewer: "bg-gray-50 text-gray-600 border border-gray-200",
};

export const ROLE_ICONS: Record<Role, React.ReactNode> = {
    Admin: <Shield size={11} />,
    Editor: <Edit size={11} />,
    Viewer: <User size={11} />,
};

export const AVATAR_COLOR_LIST = [
    "bg-violet-100 text-violet-700",
    "bg-blue-100 text-blue-700",
    "bg-rose-100 text-rose-700",
    "bg-amber-100 text-amber-700",
    "bg-emerald-100 text-emerald-700",
    "bg-indigo-100 text-indigo-700",
    "bg-pink-100 text-pink-700",
    "bg-cyan-100 text-cyan-700",
    "bg-teal-100 text-teal-700",
    "bg-orange-100 text-orange-700",
];

export function getInitials(name: string): string {
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function getAvatarColor(name: string): string {
    return AVATAR_COLOR_LIST[name.charCodeAt(0) % AVATAR_COLOR_LIST.length];
}

interface UserFormModalProps {
    mode: "create" | "edit";
    initialValues?: UserForm;
    onClose: () => void;
    onSave: (form: UserForm) => void;
}

export function UserFormModal({ mode, initialValues, onClose, onSave }: UserFormModalProps) {
    const defaultForm: UserForm = initialValues ?? { name: "", email: "", role: "Viewer", status: "Ativo" };
    const [form, setForm] = useState<UserForm>(defaultForm);
    const [errors, setErrors] = useState<Partial<Record<keyof UserForm, string>>>({});

    const set = <K extends keyof UserForm>(key: K, value: UserForm[K]) =>
        setForm((f) => ({ ...f, [key]: value }));

    const validate = () => {
        const e: typeof errors = {};
        if (!form.name.trim()) e.name = "Nome é obrigatório.";
        if (!form.email.trim()) e.email = "E-mail é obrigatório.";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "E-mail inválido.";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) onSave(form);
    };

    const isEdit = mode === "edit";
    const previewName = form.name.trim();

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="w-full max-w-md rounded-2xl bg-card border border-border shadow-xl">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                    <div>
                        <h2 className="text-foreground">{isEdit ? "Editar usuário" : "Novo usuário"}</h2>
                        <p className="text-muted-foreground mt-0.5" style={{ fontSize: "0.8125rem" }}>
                            {isEdit
                                ? "Atualize os dados do usuário abaixo."
                                : "Preencha os dados para cadastrar um novo usuário."}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} noValidate>
                    <div className="px-6 py-5 space-y-4">
                        {/* Name */}
                        <div className="space-y-1.5">
                            <label htmlFor="u-name" className="text-foreground" style={{ fontSize: "0.875rem" }}>
                                Nome completo
                            </label>
                            <input
                                id="u-name"
                                type="text"
                                placeholder="Ex: João Silva"
                                value={form.name}
                                onChange={(e) => set("name", e.target.value)}
                                className={`w-full px-3 py-2 rounded-lg border bg-input-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 transition ${errors.name ? "border-destructive" : "border-border"}`}
                            />
                            {errors.name && <p className="text-destructive" style={{ fontSize: "0.75rem" }}>{errors.name}</p>}
                        </div>

                        {/* Email */}
                        <div className="space-y-1.5">
                            <label htmlFor="u-email" className="text-foreground" style={{ fontSize: "0.875rem" }}>
                                E-mail
                            </label>
                            <input
                                id="u-email"
                                type="email"
                                placeholder="joao@empresa.com"
                                value={form.email}
                                onChange={(e) => set("email", e.target.value)}
                                className={`w-full px-3 py-2 rounded-lg border bg-input-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 transition ${errors.email ? "border-destructive" : "border-border"}`}
                            />
                            {errors.email && <p className="text-destructive" style={{ fontSize: "0.75rem" }}>{errors.email}</p>}
                        </div>

                        {/* Role + Status */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <label htmlFor="u-role" className="text-foreground" style={{ fontSize: "0.875rem" }}>
                                    Função
                                </label>
                                <select
                                    id="u-role"
                                    value={form.role}
                                    onChange={(e) => set("role", e.target.value as Role)}
                                    className="w-full px-3 py-2 rounded-lg border border-border bg-input-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 cursor-pointer transition"
                                >
                                    <option value="Admin">Admin</option>
                                    <option value="Editor">Editor</option>
                                    <option value="Viewer">Viewer</option>
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label htmlFor="u-status" className="text-foreground" style={{ fontSize: "0.875rem" }}>
                                    Status
                                </label>
                                <select
                                    id="u-status"
                                    value={form.status}
                                    onChange={(e) => set("status", e.target.value as Status)}
                                    className="w-full px-3 py-2 rounded-lg border border-border bg-input-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 cursor-pointer transition"
                                >
                                    <option value="Ativo">Ativo</option>
                                    <option value="Inativo">Inativo</option>
                                </select>
                            </div>
                        </div>

                        {/* Preview */}
                        {previewName && (
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border">
                                <span className={`w-9 h-9 rounded-full flex items-center justify-center text-xs shrink-0 ${getAvatarColor(previewName)}`}>
                                    {getInitials(previewName)}
                                </span>
                                <div className="min-w-0">
                                    <p className="text-foreground truncate" style={{ fontSize: "0.875rem" }}>{previewName}</p>
                                    <p className="text-muted-foreground truncate" style={{ fontSize: "0.75rem" }}>{form.email || "—"}</p>
                                </div>
                                <span className={`ml-auto shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${ROLE_STYLES[form.role]}`}>
                                    {ROLE_ICONS[form.role]}
                                    {form.role}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-lg border border-border bg-card text-foreground hover:bg-accent transition-colors cursor-pointer"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity cursor-pointer"
                        >
                            {isEdit ? <Save size={16} /> : <Plus size={16} />}
                            {isEdit ? "Salvar alterações" : "Cadastrar usuário"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
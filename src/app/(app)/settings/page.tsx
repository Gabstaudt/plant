"use client";

import { useMemo, useState } from "react";
import {
  Bell,
  Settings as SettingsIcon,
  User,
  ShieldCheck,
  Check,
  Edit3,
  Plus,
  X,
} from "lucide-react";

import PageHeader from "@/app/components/layout/PageHeader";

type Permission = {
  id: string;
  label: string;
  description: string;
  group: "NAV" | "PLANTS" | "SENSORS" | "ALERTS" | "REPORTS" | "USERS" | "SETTINGS";
};

const permissions: Permission[] = [
  { id: "nav:dashboard", label: "Dashboard na sidebar", description: "Exibir Dashboard no menu lateral.", group: "NAV" },
  { id: "nav:plants", label: "Plantas na sidebar", description: "Exibir Plantas no menu lateral.", group: "NAV" },
  { id: "nav:sensors", label: "Sensores na sidebar", description: "Exibir Sensores no menu lateral.", group: "NAV" },
  { id: "nav:alerts", label: "Alertas na sidebar", description: "Exibir Alertas no menu lateral.", group: "NAV" },
  { id: "nav:reports", label: "Relatórios na sidebar", description: "Exibir Relatórios no menu lateral.", group: "NAV" },
  { id: "nav:users", label: "Usuários na sidebar", description: "Exibir Usuários no menu lateral.", group: "NAV" },
  { id: "nav:settings", label: "Configurações na sidebar", description: "Exibir Configurações no menu lateral.", group: "NAV" },

  { id: "plants:create", label: "Criar plantas", description: "Adicionar novas plantas ao sistema.", group: "PLANTS" },
  { id: "plants:update", label: "Editar plantas", description: "Editar dados e condições das plantas.", group: "PLANTS" },
  { id: "plants:delete", label: "Excluir plantas", description: "Remover plantas do sistema.", group: "PLANTS" },
  { id: "plants:view:details", label: "Ver detalhes da planta", description: "Acessar detalhes completos da planta.", group: "PLANTS" },

  { id: "sensors:create", label: "Criar sensores", description: "Cadastrar novos sensores.", group: "SENSORS" },
  { id: "sensors:update", label: "Editar sensores", description: "Editar configurações de sensores.", group: "SENSORS" },
  { id: "sensors:delete", label: "Excluir sensores", description: "Remover sensores do sistema.", group: "SENSORS" },
  { id: "sensors:view:readings", label: "Ver leituras", description: "Exibir histórico de leituras.", group: "SENSORS" },
  { id: "sensors:view:settings", label: "Ver configurações", description: "Exibir aba de configurações.", group: "SENSORS" },

  { id: "alerts:manage", label: "Gerenciar alertas", description: "Criar e editar regras de alertas.", group: "ALERTS" },
  { id: "alerts:resolve", label: "Resolver alertas", description: "Marcar alertas como resolvidos.", group: "ALERTS" },
  { id: "alerts:view:details", label: "Ver detalhes do alerta", description: "Acessar detalhes completos do alerta.", group: "ALERTS" },

  { id: "reports:view", label: "Ver relatórios", description: "Acessar relatórios e métricas.", group: "REPORTS" },
  { id: "reports:export", label: "Exportar relatórios", description: "Baixar relatórios em PDF/CSV.", group: "REPORTS" },

  { id: "users:manage", label: "Gerenciar usuários", description: "Aprovar usuários e alterar permissões.", group: "USERS" },
  { id: "users:roles", label: "Gerenciar perfis", description: "Criar e editar perfis do ecossistema.", group: "USERS" },

  { id: "settings:view", label: "Ver configurações", description: "Acessar tela de configurações.", group: "SETTINGS" },
  { id: "settings:update", label: "Alterar configurações", description: "Editar preferências e segurança.", group: "SETTINGS" },
];

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={[
        "relative inline-flex h-7 w-12 items-center rounded-full transition-colors",
        checked ? "bg-[var(--plant-primary)]" : "bg-black/10",
      ].join(" ")}
    >
      <span
        className={[
          "inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow-sm",
          checked ? "translate-x-6" : "translate-x-1",
        ].join(" ")}
      />
    </button>
  );
}

export default function SettingsPage() {
  const [profile, setProfile] = useState({
    name: "João Silva",
    email: "joao@plantmonitor.com",
    birth: "1996-01-12",
  });
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [passwords, setPasswords] = useState({
    current: "",
    next: "",
    confirm: "",
  });
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    digest: true,
    weekly: true,
  });

  const [roleName, setRoleName] = useState("Gerente");
  const [rolePerms, setRolePerms] = useState<Record<string, boolean>>(() =>
    permissions.reduce((acc, p) => ({ ...acc, [p.id]: false }), {}),
  );
  const [roles, setRoles] = useState<
    { id: string; name: string; summary: string; perms: Record<string, boolean> }[]
  >([
    {
      id: "r-1",
      name: "Gerente",
      summary: "Pode criar/editar plantas e sensores.",
      perms: permissions.reduce((acc, p) => {
        if (
          ["nav:dashboard", "nav:plants", "nav:sensors", "nav:alerts", "settings:view"].includes(
            p.id,
          )
        ) {
          acc[p.id] = true;
        }
        if (p.id.startsWith("plants:") || p.id.startsWith("sensors:")) acc[p.id] = true;
        return acc;
      }, {} as Record<string, boolean>),
    },
    {
      id: "r-2",
      name: "Leitor",
      summary: "Acesso apenas visualização.",
      perms: permissions.reduce((acc, p) => {
        if (p.id.startsWith("nav:")) acc[p.id] = true;
        if (["plants:view:details", "sensors:view:readings", "alerts:view:details"].includes(p.id)) {
          acc[p.id] = true;
        }
        return acc;
      }, {} as Record<string, boolean>),
    },
  ]);
  const [editingRoleId, setEditingRoleId] = useState<string | null>(null);
  const [roleModalOpen, setRoleModalOpen] = useState(false);

  const selectedCount = useMemo(
    () => Object.values(rolePerms).filter(Boolean).length,
    [rolePerms],
  );

  function togglePermission(id: string) {
    setRolePerms((p) => ({ ...p, [id]: !p[id] }));
  }

  function startNewRole() {
    setEditingRoleId(null);
    setRoleName("Novo Perfil");
    setRolePerms(permissions.reduce((acc, p) => ({ ...acc, [p.id]: false }), {}));
    setRoleModalOpen(true);
  }

  function startEditRole(id: string) {
    const role = roles.find((r) => r.id === id);
    if (!role) return;
    setEditingRoleId(role.id);
    setRoleName(role.name);
    setRolePerms({ ...role.perms });
    setRoleModalOpen(true);
  }

  function saveRole() {
    const summary = `${selectedCount} permissões ativas`;
    if (editingRoleId) {
      setRoles((prev) =>
        prev.map((r) =>
          r.id === editingRoleId ? { ...r, name: roleName, summary, perms: rolePerms } : r,
        ),
      );
      setRoleModalOpen(false);
      return;
    }
    const id = `r-${Math.random().toString(36).slice(2, 8)}`;
    setRoles((prev) => [
      ...prev,
      { id, name: roleName, summary, perms: rolePerms },
    ]);
    setEditingRoleId(id);
    setRoleModalOpen(false);
  }

  const groupedPermissions = useMemo(() => {
    const groups = new Map<string, Permission[]>();
    permissions.forEach((p) => {
      const list = groups.get(p.group) ?? [];
      list.push(p);
      groups.set(p.group, list);
    });
    return Array.from(groups.entries());
  }, []);

  return (
    <div className="p-4 md:p-6">
      <PageHeader
        title="Configurações"
        subtitle="Gerencie as configurações do sistema e suas preferências"
      />

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-black/10 bg-white p-5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[var(--plant-primary)]/10 grid place-items-center">
              <User className="h-5 w-5 text-[var(--plant-primary)]" />
            </div>
            <div>
              <div className="text-base font-semibold text-[var(--plant-graphite)]">
                Perfil do Usuário
              </div>
              <div className="text-sm text-black/45">
                Gerencie suas informações pessoais
              </div>
            </div>
          </div>

          <div className="mt-5 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-[var(--plant-graphite)]">Nome</label>
              <input
                value={profile.name}
                onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
                className="mt-2 w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm outline-none
                           focus:ring-2 focus:ring-[var(--plant-primary)]/20 focus:border-[var(--plant-primary)]/30"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[var(--plant-graphite)]">E-mail</label>
              <input
                value={profile.email}
                onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
                className="mt-2 w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm outline-none
                           focus:ring-2 focus:ring-[var(--plant-primary)]/20 focus:border-[var(--plant-primary)]/30"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[var(--plant-graphite)]">Data de nascimento</label>
              <input
                type="date"
                value={profile.birth}
                onChange={(e) => setProfile((p) => ({ ...p, birth: e.target.value }))}
                className="mt-2 w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm outline-none
                           focus:ring-2 focus:ring-[var(--plant-primary)]/20 focus:border-[var(--plant-primary)]/30"
              />
            </div>

            {showPasswordFields ? (
              <div className="rounded-xl border border-black/10 bg-[var(--plant-ice)]/60 p-4 space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-[var(--plant-graphite)]">
                    Senha atual
                  </label>
                  <input
                    type="password"
                    value={passwords.current}
                    onChange={(e) =>
                      setPasswords((p) => ({ ...p, current: e.target.value }))
                    }
                    className="mt-2 w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm outline-none
                               focus:ring-2 focus:ring-[var(--plant-primary)]/20 focus:border-[var(--plant-primary)]/30"
                  />
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--plant-graphite)]">
                      Nova senha
                    </label>
                    <input
                      type="password"
                      value={passwords.next}
                      onChange={(e) =>
                        setPasswords((p) => ({ ...p, next: e.target.value }))
                      }
                      className="mt-2 w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm outline-none
                                 focus:ring-2 focus:ring-[var(--plant-primary)]/20 focus:border-[var(--plant-primary)]/30"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[var(--plant-graphite)]">
                      Confirmar nova senha
                    </label>
                    <input
                      type="password"
                      value={passwords.confirm}
                      onChange={(e) =>
                        setPasswords((p) => ({ ...p, confirm: e.target.value }))
                      }
                      className="mt-2 w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm outline-none
                                 focus:ring-2 focus:ring-[var(--plant-primary)]/20 focus:border-[var(--plant-primary)]/30"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button className="btn btn-primary rounded-full px-5 py-2">
                    Salvar Senha
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowPasswordFields(false)}
                    className="rounded-full border border-black/10 px-5 py-2 text-sm font-semibold text-[var(--plant-graphite)] hover:bg-black/5"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : null}

            <div className="flex flex-wrap items-center gap-3">
              <button className="btn btn-primary rounded-full px-6 py-2">
                Salvar Perfil
              </button>
              <button
                type="button"
                onClick={() => setShowPasswordFields(true)}
                className="rounded-full border border-black/10 px-6 py-2 text-sm font-semibold text-[var(--plant-graphite)] hover:bg-black/5"
              >
                Trocar Senha
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-black/10 bg-white p-5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[var(--plant-primary)]/10 grid place-items-center">
              <Bell className="h-5 w-5 text-[var(--plant-primary)]" />
            </div>
            <div>
              <div className="text-base font-semibold text-[var(--plant-graphite)]">
                Notificações
              </div>
              <div className="text-sm text-black/45">
                Configure como receber alertas e notificações
              </div>
            </div>
          </div>

          <div className="mt-5 space-y-4">
            {[
              {
                key: "email",
                title: "Notificações por E-mail",
                desc: "Receber alertas por e-mail",
              },
              {
                key: "push",
                title: "Notificações Push",
                desc: "Notificações do navegador em tempo real",
              },
              {
                key: "digest",
                title: "Resumo de Alertas",
                desc: "Resumo diário dos alertas",
              },
              {
                key: "weekly",
                title: "Relatório Semanal",
                desc: "Relatório semanal por e-mail",
              },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-sm font-semibold text-[var(--plant-graphite)]">
                    {item.title}
                  </div>
                  <div className="text-xs text-black/45">{item.desc}</div>
                </div>
                <Toggle
                  checked={notifications[item.key as keyof typeof notifications]}
                  onChange={(v) =>
                    setNotifications((n) => ({ ...n, [item.key]: v }))
                  }
                />
              </div>
            ))}

            <button className="btn btn-primary rounded-full px-6 py-2">
              Salvar Notificações
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-black/10 bg-white p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[var(--plant-primary)]/10 grid place-items-center">
              <SettingsIcon className="h-5 w-5 text-[var(--plant-primary)]" />
            </div>
            <div className="text-base font-semibold text-[var(--plant-graphite)]">
              Perfis e Permissões
            </div>
            <div className="text-sm text-black/45">
              Crie perfis personalizados com permissões específicas
            </div>
          </div>
          <button
            type="button"
            onClick={startNewRole}
            className="btn btn-primary rounded-full px-4 py-2 text-sm"
          >
            <span className="inline-flex -ml-1 mr-2 h-4 w-4 items-center justify-center">
              <Plus className="h-4 w-4" />
            </span>
            Novo Perfil
          </button>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {roles.map((r) => (
            <div
              key={r.id}
              className={[
                "rounded-xl border px-4 py-3",
                r.id === editingRoleId
                  ? "border-[var(--plant-primary)]/30 bg-[var(--plant-primary)]/10"
                  : "border-black/10 bg-white",
              ].join(" ")}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-semibold text-[var(--plant-graphite)]">
                    {r.name}
                  </div>
                  <div className="text-xs text-black/45">{r.summary}</div>
                </div>
                <button
                  onClick={() => startEditRole(r.id)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-black/10 hover:bg-black/5"
                >
                  <Edit3 className="h-4 w-4 text-black/50" />
                </button>
              </div>
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                {Object.entries(r.perms)
                  .filter(([, v]) => v)
                  .slice(0, 4)
                  .map(([key]) => {
                    const perm = permissions.find((p) => p.id === key);
                    return (
                      <span
                        key={key}
                        className="rounded-full border border-[var(--plant-primary)]/20 bg-[var(--plant-primary)]/10 px-2 py-0.5 text-[var(--plant-primary)]"
                      >
                        {perm?.label ?? key}
                      </span>
                    );
                  })}
                {Object.values(r.perms).filter(Boolean).length > 4 ? (
                  <span className="rounded-full border border-black/10 bg-black/5 px-2 py-0.5 text-black/50">
                    +{Object.values(r.perms).filter(Boolean).length - 4}
                  </span>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-black/10 bg-white p-5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[var(--plant-primary)]/10 grid place-items-center">
              <ShieldCheck className="h-5 w-5 text-[var(--plant-primary)]" />
            </div>
            <div>
              <div className="text-base font-semibold text-[var(--plant-graphite)]">
                Segurança
              </div>
              <div className="text-sm text-black/45">
                Controle o acesso e autenticação do sistema
              </div>
            </div>
          </div>

          <div className="mt-5 space-y-3 text-sm text-black/55">
            <div className="flex items-center justify-between rounded-xl border border-black/10 px-4 py-3">
              <span>Login em dois fatores</span>
              <Toggle checked={false} onChange={() => {}} />
            </div>
            <div className="flex items-center justify-between rounded-xl border border-black/10 px-4 py-3">
              <span>Confirmação por e-mail</span>
              <Toggle checked={true} onChange={() => {}} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-black/10 bg-white p-5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[var(--plant-primary)]/10 grid place-items-center">
              <SettingsIcon className="h-5 w-5 text-[var(--plant-primary)]" />
            </div>
            <div>
              <div className="text-base font-semibold text-[var(--plant-graphite)]">
                Preferências do Sistema
              </div>
              <div className="text-sm text-black/45">
                Ajustes gerais do sistema
              </div>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            <div className="flex items-center justify-between rounded-xl border border-black/10 px-4 py-3 text-sm">
              <span>Idioma</span>
              <span className="text-black/45">Português (BR)</span>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-black/10 px-4 py-3 text-sm">
              <span>Fuso horário</span>
              <span className="text-black/45">America/São Paulo</span>
            </div>
          </div>
        </div>
      </div>

      {roleModalOpen ? (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/40"
            onClick={() => setRoleModalOpen(false)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-4xl max-h-[85vh] overflow-hidden rounded-2xl bg-white shadow-xl">
              <div className="flex items-center justify-between border-b border-black/10 px-5 py-4">
                <div>
                  <div className="text-lg font-semibold text-[var(--plant-graphite)]">
                    {editingRoleId ? "Editar Perfil" : "Novo Perfil"}
                  </div>
                  <div className="text-sm text-black/45">
                    Configure permissões por sessão
                  </div>
                </div>
                <button
                  onClick={() => setRoleModalOpen(false)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-black/10 hover:bg-black/5"
                >
                  <X className="h-4 w-4 text-black/50" />
                </button>
              </div>

              <div className="px-5 py-4 max-h-[calc(85vh-140px)] overflow-y-auto">
                <div className="grid gap-4 md:grid-cols-[320px_1fr]">
                  <div className="rounded-xl border border-black/10 p-4">
                    <label className="block text-sm font-semibold text-[var(--plant-graphite)]">
                      Nome do Perfil
                    </label>
                    <input
                      value={roleName}
                      onChange={(e) => setRoleName(e.target.value)}
                      placeholder="Ex: Gerente"
                      className="mt-2 w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm outline-none
                                 focus:ring-2 focus:ring-[var(--plant-primary)]/20 focus:border-[var(--plant-primary)]/30"
                    />

                    <div className="mt-4 flex items-center justify-between rounded-lg border border-black/10 bg-[var(--plant-ice)] px-3 py-2 text-xs font-semibold text-[var(--plant-graphite)]">
                      <span>Permissões selecionadas</span>
                      <span className="rounded-full bg-[var(--plant-primary)]/15 px-2 py-0.5 text-[var(--plant-primary)]">
                        {selectedCount}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {groupedPermissions.map(([group, groupPerms]) => (
                      <div key={group} className="rounded-xl border border-black/10 p-4">
                        <div className="text-sm font-semibold text-[var(--plant-graphite)]">
                          {group === "NAV"
                            ? "O que contém na navbar"
                            : group === "PLANTS"
                            ? "Plantas"
                            : group === "SENSORS"
                            ? "Sensores"
                            : group === "ALERTS"
                            ? "Alertas"
                            : group === "REPORTS"
                            ? "Relatórios"
                            : group === "USERS"
                            ? "Usuários"
                            : "Configurações"}
                        </div>
                        <div className="mt-3 grid gap-3 md:grid-cols-2">
                          {groupPerms.map((perm) => (
                            <button
                              key={perm.id}
                              type="button"
                              onClick={() => togglePermission(perm.id)}
                              className={[
                                "flex items-start gap-3 rounded-xl border px-4 py-3 text-left transition",
                                rolePerms[perm.id]
                                  ? "border-[var(--plant-primary)]/30 bg-[var(--plant-primary)]/10"
                                  : "border-black/10 bg-white hover:bg-black/5",
                              ].join(" ")}
                            >
                              <span
                                className={[
                                  "mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full border",
                                  rolePerms[perm.id]
                                    ? "border-[var(--plant-primary)] bg-[var(--plant-primary)] text-white"
                                    : "border-black/10 text-black/40",
                                ].join(" ")}
                              >
                                {rolePerms[perm.id] ? <Check className="h-4 w-4" /> : null}
                              </span>
                              <div>
                                <div className="text-sm font-semibold text-[var(--plant-graphite)]">
                                  {perm.label}
                                </div>
                                <div className="text-xs text-black/45">{perm.description}</div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-black/10 px-5 py-4">
                <button
                  type="button"
                  onClick={() => setRoleModalOpen(false)}
                  className="rounded-xl px-5 py-2 text-sm font-semibold border border-black/15 bg-white text-[var(--plant-graphite)] hover:bg-black/5"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={saveRole}
                  className="btn btn-primary rounded-full px-6 py-2"
                >
                  Salvar Perfil
                </button>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}

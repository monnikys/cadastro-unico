import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { LayoutDashboard, Building2, Users, Search, CircleUser } from "lucide-react";

const nav = [
  { to: "/", label: "Visão geral", icon: LayoutDashboard },
  { to: "/planos", label: "Planos e patrocinadores", icon: Building2 },
  { to: "/dependentes", label: "Dependentes", icon: Users },
  { to: "/consulta", label: "Consulta por CPF", icon: Search },
] as const;

export function Shell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <header className="bg-brand text-primary-foreground">
        <div className="mx-auto max-w-7xl px-6 pt-6 pb-24">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-xl bg-primary-foreground/15 font-display text-lg font-bold">
                C
              </span>
              <div>
                <p className="font-display text-base font-semibold tracking-tight">
                  Centrus · Cadastro Único
                </p>
                <p className="text-xs text-primary-foreground/70">
                  Base consolidada de participantes e dependentes
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-primary-foreground/10 px-3 py-1.5 text-xs">
              <CircleUser className="size-4" />
              Atualizado em 18/08/2026
            </div>
          </div>

          <nav className="mt-8 flex flex-wrap gap-1.5">
            {nav.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                activeOptions={{ exact: to === "/" }}
                className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-primary-foreground/75 transition-colors hover:bg-primary-foreground/10 hover:text-primary-foreground data-[status=active]:bg-primary-foreground data-[status=active]:text-primary"
              >
                <Icon className="size-4" />
                {label}
              </Link>
            ))}
          </nav>

          <div className="mt-10">
            <h1 className="text-3xl font-semibold sm:text-4xl">{title}</h1>
            <p className="mt-2 max-w-2xl text-sm text-primary-foreground/75">{subtitle}</p>
          </div>
        </div>
      </header>

      <main className="mx-auto -mt-16 max-w-7xl px-6 pb-16">{children}</main>

      <footer className="border-t border-border py-6">
        <p className="mx-auto max-w-7xl px-6 text-xs text-muted-foreground">
          Painel demonstrativo · dados fictícios para fins de visualização
        </p>
      </footer>
    </div>
  );
}

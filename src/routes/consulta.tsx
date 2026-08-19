import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Mail, MapPin, Phone, Search, IdCard } from "lucide-react";
import { Shell } from "@/components/dashboard/Shell";
import { Panel } from "@/components/dashboard/StatCard";
import { dependentes, participantes, planos } from "@/data/cadastro";
import type { Participante } from "@/data/cadastro";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const Route = createFileRoute("/consulta")({
  head: () => ({
    meta: [
      { title: "Consulta por CPF | Cadastro Único" },
      {
        name: "description",
        content:
          "Consulte a ficha completa do participante por CPF: dados de contato, plano, situação e dependentes.",
      },
      { property: "og:title", content: "Consulta por CPF | Cadastro Único" },
      {
        property: "og:description",
        content: "Ficha individual do participante com contatos, plano e dependentes vinculados.",
      },
    ],
  }),
  component: ConsultaPage,
});

function ConsultaPage() {
  const [busca, setBusca] = useState("");
  const [selecionado, setSelecionado] = useState(participantes[0]!.cpf);

  const resultados = useMemo(() => {
    const q = busca.trim().toLowerCase();
    if (!q) return participantes;
    return participantes.filter(
      (p) => p.nome.toLowerCase().includes(q) || p.cpf.includes(q),
    );
  }, [busca]);

  const pessoa: Participante =
    participantes.find((p) => p.cpf === selecionado) ?? participantes[0]!;
  const plano = planos.find((p) => p.sigla === pessoa.plano);
  const deps = dependentes.filter((d) => d.cpfTitular === pessoa.cpf);

  return (
    <Shell
      title="Consulta por CPF"
      subtitle="Localize um participante e visualize sua ficha cadastral completa e vínculos familiares."
    >
      <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
        <Panel title="Participantes" description="Busque por nome ou CPF">
          <div className="relative">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Nome ou CPF"
              className="pl-9"
            />
          </div>
          <ul className="mt-3 space-y-1.5">
            {resultados.map((p) => (
              <li key={p.cpf}>
                <button
                  onClick={() => setSelecionado(p.cpf)}
                  className={`w-full rounded-lg px-3 py-2 text-left transition-colors ${
                    p.cpf === pessoa.cpf
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  }`}
                >
                  <span className="block truncate text-sm font-medium">{p.nome}</span>
                  <span
                    className={`block text-xs tabular-nums ${
                      p.cpf === pessoa.cpf ? "text-primary-foreground/70" : "text-muted-foreground"
                    }`}
                  >
                    {p.cpf}
                  </span>
                </button>
              </li>
            ))}
            {resultados.length === 0 ? (
              <li className="px-3 py-6 text-center text-sm text-muted-foreground">
                Nenhum participante encontrado.
              </li>
            ) : null}
          </ul>
        </Panel>

        <div className="space-y-4">
          <Panel title="Ficha do participante">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h3 className="font-display text-2xl font-semibold">{pessoa.nome}</h3>
                <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground tabular-nums">
                  <IdCard className="size-4" /> {pessoa.cpf}
                </p>
              </div>
              <Badge variant="secondary">{pessoa.situacao}</Badge>
            </div>

            <dl className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Field label="Plano" value={`${pessoa.plano} — ${plano?.descricao ?? ""}`} />
              <Field label="Patrocinador" value={plano?.patrocinador ?? "—"} />
              <Field label="Inscrição" value={pessoa.inscricao} />
              <Field label="Idade" value={`${pessoa.idade} anos`} />
              <Field label="Sexo" value={pessoa.sexo === "F" ? "Feminino" : "Masculino"} />
              <Field label="UF" value={pessoa.uf} icon={<MapPin className="size-3.5" />} />
              <Field label="E-mail" value={pessoa.email} icon={<Mail className="size-3.5" />} />
              <Field
                label="Telefone"
                value={pessoa.telefone}
                icon={<Phone className="size-3.5" />}
              />
            </dl>
          </Panel>

          <Panel title="Dependentes vinculados" description={`${deps.length} registro(s)`}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>CPF</TableHead>
                  <TableHead>Parentesco</TableHead>
                  <TableHead className="text-right">Idade</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {deps.map((d) => (
                  <TableRow key={d.cpf}>
                    <TableCell className="font-medium">{d.nome}</TableCell>
                    <TableCell className="tabular-nums text-muted-foreground">{d.cpf}</TableCell>
                    <TableCell>{d.parentesco}</TableCell>
                    <TableCell className="text-right tabular-nums">{d.idade}</TableCell>
                  </TableRow>
                ))}
                {deps.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="py-8 text-center text-muted-foreground">
                      Nenhum dependente vinculado.
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
          </Panel>
        </div>
      </div>
    </Shell>
  );
}

function Field({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-border bg-muted/40 px-3 py-2">
      <dt className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
        {label}
      </dt>
      <dd className="mt-0.5 flex items-center gap-1.5 text-sm text-foreground">
        {icon}
        <span className="truncate">{value}</span>
      </dd>
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Building2, Layers, Users } from "lucide-react";
import { Shell } from "@/components/dashboard/Shell";
import { Panel, StatCard } from "@/components/dashboard/StatCard";
import { nf, planos, totalParticipantes } from "@/data/cadastro";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/planos")({
  head: () => ({
    meta: [
      { title: "Planos e Patrocinadores | Cadastro Único" },
      {
        name: "description",
        content:
          "Relação de planos previdenciários, patrocinadores, CNPJ e quantidade de participantes vinculados.",
      },
      { property: "og:title", content: "Planos e Patrocinadores | Cadastro Único" },
      {
        property: "og:description",
        content: "Planos, patrocinadores e participantes vinculados a cada contrato.",
      },
    ],
  }),
  component: PlanosPage,
});

const situacaoStyle: Record<string, string> = {
  Ativo: "bg-success/15 text-success border-transparent",
  "Em saldamento": "bg-warning/20 text-warning-foreground border-transparent",
  Encerrado: "bg-muted text-muted-foreground border-transparent",
};

function PlanosPage() {
  const patrocinadores = Array.from(new Set(planos.map((p) => p.patrocinador)));
  const [filtro, setFiltro] = useState<string | null>(null);
  const lista = filtro ? planos.filter((p) => p.patrocinador === filtro) : planos;

  return (
    <Shell
      title="Planos e patrocinadores"
      subtitle="Contratos vigentes, entidades patrocinadoras e volume de participantes por plano."
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Planos cadastrados" value={String(planos.length)} icon={Layers} />
        <StatCard label="Patrocinadores" value={String(patrocinadores.length)} icon={Building2} />
        <StatCard
          label="Participantes vinculados"
          value={nf.format(totalParticipantes)}
          icon={Users}
        />
      </div>

      <Panel
        title="Filtrar por patrocinador"
        description="Selecione uma entidade para restringir a tabela"
        className="mt-4"
      >
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant={filtro === null ? "default" : "outline"}
            onClick={() => setFiltro(null)}
          >
            Todos
          </Button>
          {patrocinadores.map((p) => (
            <Button
              key={p}
              size="sm"
              variant={filtro === p ? "default" : "outline"}
              onClick={() => setFiltro(p)}
            >
              {p}
            </Button>
          ))}
        </div>
      </Panel>

      <Panel title="Relação de planos" className="mt-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sigla</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Patrocinador</TableHead>
              <TableHead>CNPJ</TableHead>
              <TableHead>Situação</TableHead>
              <TableHead className="text-right">Participantes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {lista.map((p) => (
              <TableRow key={p.sigla}>
                <TableCell className="font-semibold">{p.sigla}</TableCell>
                <TableCell className="text-muted-foreground">{p.descricao}</TableCell>
                <TableCell>{p.patrocinador}</TableCell>
                <TableCell className="tabular-nums text-muted-foreground">{p.cnpj}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={situacaoStyle[p.situacao]}>
                    {p.situacao}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-medium tabular-nums">
                  {nf.format(p.participantes)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Panel>
    </Shell>
  );
}

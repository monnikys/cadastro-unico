import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Baby, HeartHandshake, Users } from "lucide-react";
import { Shell } from "@/components/dashboard/Shell";
import { Panel, StatCard } from "@/components/dashboard/StatCard";
import { dependentes, nf, totalDependentes } from "@/data/cadastro";
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

export const Route = createFileRoute("/dependentes")({
  head: () => ({
    meta: [
      { title: "Dependentes | Cadastro Único" },
      {
        name: "description",
        content:
          "Consulta de dependentes vinculados aos titulares: parentesco, idade, plano e CPF do titular.",
      },
      { property: "og:title", content: "Dependentes | Cadastro Único" },
      {
        property: "og:description",
        content: "Vínculos de dependentes por titular, parentesco e plano previdenciário.",
      },
    ],
  }),
  component: DependentesPage,
});

function DependentesPage() {
  const [busca, setBusca] = useState("");

  const lista = useMemo(() => {
    const q = busca.trim().toLowerCase();
    if (!q) return dependentes;
    return dependentes.filter((d) =>
      [d.nome, d.cpf, d.titular, d.cpfTitular, d.plano].some((v) =>
        v.toLowerCase().includes(q),
      ),
    );
  }, [busca]);

  const conjuges = dependentes.filter((d) => d.parentesco === "Cônjuge").length;
  const menores = dependentes.filter((d) => d.idade < 21).length;

  return (
    <Shell
      title="Dependentes"
      subtitle="Vínculos familiares registrados no cadastro, com titular, parentesco e plano de origem."
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Dependentes"
          value={nf.format(totalDependentes)}
          hint="Total na base"
          icon={Baby}
        />
        <StatCard
          label="Cônjuges"
          value={`${Math.round((conjuges / dependentes.length) * 100)}%`}
          hint="Da amostra exibida"
          icon={HeartHandshake}
        />
        <StatCard
          label="Menores de 21"
          value={`${Math.round((menores / dependentes.length) * 100)}%`}
          hint="Da amostra exibida"
          icon={Users}
        />
      </div>

      <Panel
        title="Buscar dependente"
        description="Pesquise por nome, CPF do dependente, titular ou plano"
        className="mt-4"
      >
        <Input
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Ex.: Helena, 118.446.702-31 ou PBD"
          className="max-w-md"
        />

        <div className="mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Dependente</TableHead>
                <TableHead>CPF</TableHead>
                <TableHead>Parentesco</TableHead>
                <TableHead>Idade</TableHead>
                <TableHead>Titular</TableHead>
                <TableHead>CPF do titular</TableHead>
                <TableHead>Plano</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lista.map((d) => (
                <TableRow key={d.cpf}>
                  <TableCell className="font-medium">{d.nome}</TableCell>
                  <TableCell className="tabular-nums text-muted-foreground">{d.cpf}</TableCell>
                  <TableCell>{d.parentesco}</TableCell>
                  <TableCell className="tabular-nums">{d.idade}</TableCell>
                  <TableCell>{d.titular}</TableCell>
                  <TableCell className="tabular-nums text-muted-foreground">
                    {d.cpfTitular}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{d.plano}</Badge>
                  </TableCell>
                </TableRow>
              ))}
              {lista.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-10 text-center text-muted-foreground">
                    Nenhum dependente encontrado para esta busca.
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </div>
      </Panel>
    </Shell>
  );
}

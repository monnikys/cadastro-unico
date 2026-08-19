import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Users } from "lucide-react";
import { Shell } from "@/components/dashboard/Shell";
import { Panel, StatCard } from "@/components/dashboard/StatCard";
import { participantes, planos } from "@/data/cadastro";
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

export const Route = createFileRoute("/participantes")({
  head: () => ({
    meta: [
      { title: "Participantes por plano | Cadastro Único" },
      {
        name: "description",
        content:
          "Relação de participantes por plano, com identificação de múltiplos vínculos previdenciários.",
      },
    ],
  }),
  component: ParticipantesPage,
});

function ParticipantesPage() {
  const [busca, setBusca] = useState("");
  const [planoSelecionado, setPlanoSelecionado] = useState("todos");

  const lista = useMemo(() => {
    const termo = busca.trim().toLowerCase();

    return participantes.filter(
      (participante) =>
        (!termo ||
          participante.nome.toLowerCase().includes(termo) ||
          participante.cpf.includes(termo)) &&
        (planoSelecionado === "todos" ||
          participante.planos.some((plano) => plano.sigla === planoSelecionado)),
    );
  }, [busca, planoSelecionado]);

  const planoAtivo = planos.find((plano) => plano.sigla === planoSelecionado);

  return (
    <Shell
      title="Participantes por plano"
      subtitle="Consulte todos os participantes de cada plano. Cada CPF é exibido uma única vez, mesmo quando possui mais de um vínculo."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard
          label="Participantes exibidos"
          value={String(lista.length)}
          hint={planoAtivo ? "Vinculados ao " + planoAtivo.sigla : "Todos os planos"}
          icon={Users}
        />
        <StatCard
          label="Com mais de um plano"
          value={String(lista.filter((participante) => participante.planos.length > 1).length)}
          hint="CPFs com vínculos adicionais"
          icon={Users}
        />
      </div>

      <Panel
        title="Relação de participantes"
        description="Selecione um plano para listar todos os seus participantes. O indicador + plano mostra vínculos adicionais."
        className="mt-4"
      >
        <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_220px]">
          <div className="relative">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={busca}
              onChange={(event) => setBusca(event.target.value)}
              placeholder="Buscar por nome ou CPF"
              className="pl-9"
            />
          </div>
          <select
            aria-label="Filtrar por plano"
            value={planoSelecionado}
            onChange={(event) => setPlanoSelecionado(event.target.value)}
            className="h-10 rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
          >
            <option value="todos">Todos os planos</option>
            {planos.map((plano) => (
              <option key={plano.sigla} value={plano.sigla}>
                {plano.sigla} — {plano.descricao}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Participante</TableHead>
                <TableHead>CPF</TableHead>
                <TableHead>Planos vinculados</TableHead>
                <TableHead>UF</TableHead>
                <TableHead className="text-right">Idade</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lista.map((participante) => {
                const planosExibidos =
                  planoSelecionado === "todos"
                    ? participante.planos.slice(0, 1)
                    : participante.planos.filter((plano) => plano.sigla === planoSelecionado);
                const planosAdicionais = participante.planos.length - planosExibidos.length;

                return (
                  <TableRow key={participante.cpf}>
                    <TableCell className="font-medium">{participante.nome}</TableCell>
                    <TableCell className="tabular-nums text-muted-foreground">
                      {participante.cpf}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {planosExibidos.map((plano) => (
                          <Badge key={plano.sigla} variant="secondary">
                            {plano.sigla}
                          </Badge>
                        ))}
                        {planosAdicionais > 0 ? (
                          <Badge variant="outline">
                            +{planosAdicionais} {planosAdicionais === 1 ? "plano" : "planos"}
                          </Badge>
                        ) : null}
                      </div>
                    </TableCell>
                    <TableCell>{participante.uf}</TableCell>
                    <TableCell className="text-right tabular-nums">{participante.idade}</TableCell>
                  </TableRow>
                );
              })}
              {lista.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                    Nenhum participante encontrado para os filtros selecionados.
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

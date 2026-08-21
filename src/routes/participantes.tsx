import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Users } from "lucide-react";
import { Shell } from "@/components/dashboard/Shell";
import { Panel, StatCard } from "@/components/dashboard/StatCard";
import {
  CENTRUSFUNC,
  nf,
  participantes,
  planos,
  totalColaboradoresCentrus,
  totalParticipantes,
} from "@/data/cadastro";
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
          (planoSelecionado === CENTRUSFUNC
            ? participante.colaboradorCentrus === true
            : participante.planos.some((plano) => plano.sigla === planoSelecionado))),
    );
  }, [busca, planoSelecionado]);

  const planoAtivo = planos.find((plano) => plano.sigla === planoSelecionado);
  const centrusFuncAtivo = planoSelecionado === CENTRUSFUNC;

  const LIMITE_RESULTADOS = 100;
  const resultados = lista.slice(0, LIMITE_RESULTADOS);

  return (
    <Shell
      title="Participantes por plano"
      subtitle="Consulte todos os participantes de cada plano. Cada CPF é exibido uma única vez, mesmo quando possui mais de um vínculo."
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Participantes exibidos"
          value={nf.format(lista.length)}
          hint={
            centrusFuncAtivo
              ? "Colaboradores ativos da Centrus"
              : planoAtivo
                ? "Vinculados ao " + planoAtivo.sigla
                : "Todos os planos"
          }
          icon={Users}
        />
        <StatCard
          label="Com mais de um plano"
          value={nf.format(lista.filter((participante) => participante.planos.length > 1).length)}
          hint="CPFs com vínculos adicionais"
          icon={Users}
        />
        <StatCard
          label="Colaboradores Centrus"
          value={nf.format(totalColaboradoresCentrus)}
          hint={`${Math.round((totalColaboradoresCentrus / totalParticipantes) * 100)}% da base de participantes`}
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
            <option value={CENTRUSFUNC}>CENTRUSFUNC — Colaboradores ativos da Centrus</option>
          </select>
        </div>

        <div className="mt-4 max-h-130 overflow-y-auto rounded-md border">
          <Table>
            <TableHeader className="sticky top-0 z-10 bg-background">
              <TableRow>
                <TableHead>Participante</TableHead>
                <TableHead>CPF</TableHead>
                <TableHead>Planos vinculados</TableHead>
                <TableHead>UF</TableHead>
                <TableHead className="text-right">Idade</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {resultados.map((participante) => {
                const planosExibidos =
                  planoSelecionado === "todos" || centrusFuncAtivo
                    ? participante.planos.slice(0, 1)
                    : participante.planos.filter((plano) => plano.sigla === planoSelecionado);
                const planosAdicionais = participante.planos.length - planosExibidos.length;

                return (
                  <TableRow key={participante.cpf}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <span>{participante.nome}</span>
                        {participante.colaboradorCentrus ? (
                          <Badge className="border-transparent bg-success/15 text-[10px] text-success">
                            Centrus
                          </Badge>
                        ) : null}
                      </div>
                    </TableCell>
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
        {lista.length > LIMITE_RESULTADOS ? (
          <p className="mt-2 px-1 text-xs text-muted-foreground">
            Mostrando {LIMITE_RESULTADOS} de {lista.length} participantes. Refine a busca ou o plano
            para ver outros registros.
          </p>
        ) : null}
      </Panel>
    </Shell>
  );
}

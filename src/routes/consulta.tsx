import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Mail, MapPin, Phone, Search, IdCard } from "lucide-react";
import { Shell } from "@/components/dashboard/Shell";
import { Panel } from "@/components/dashboard/StatCard";
import { CENTRUSFUNC, dependentes, participantes, planos } from "@/data/cadastro";
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
  const [planoSelecionado, setPlanoSelecionado] = useState("todos");
  const [selecionado, setSelecionado] = useState<string | null>(null);

  const LIMITE_RESULTADOS = 50;

  const resultadosFiltrados = useMemo(() => {
    const q = busca.trim().toLowerCase();
    // Só listamos participantes quando há busca por nome/CPF: selecionar
    // apenas o plano não deve exibir a base inteira do plano.
    if (!q) return [];
    return participantes.filter((p) => {
      const combinaBusca = !q || p.nome.toLowerCase().includes(q) || p.cpf.includes(q);
      const combinaPlano =
        planoSelecionado === "todos" ||
        (planoSelecionado === CENTRUSFUNC
          ? p.colaboradorCentrus === true
          : p.planos.some((vinculo) => vinculo.sigla === planoSelecionado));
      return combinaBusca && combinaPlano;
    });
  }, [busca, planoSelecionado]);

  const resultados = resultadosFiltrados.slice(0, LIMITE_RESULTADOS);

  const pessoa: Participante | null =
    resultados.find((p) => p.cpf === selecionado) ?? resultados[0] ?? null;
  const planosDaPessoa =
    pessoa?.planos.flatMap((vinculo) => {
      const plano = planos.find((item) => item.sigla === vinculo.sigla);
      return plano
        ? [{ ...vinculo, descricao: plano.descricao, patrocinador: plano.patrocinador }]
        : [];
    }) ?? [];
  const deps = pessoa ? dependentes.filter((d) => d.cpfTitular === pessoa.cpf) : [];

  return (
    <Shell
      title="Consulta por CPF"
      subtitle="Localize um participante e visualize sua ficha cadastral completa e vínculos familiares."
    >
      <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
        <Panel
          title="Participantes"
          description="Busque por nome, CPF ou plano. Clique em um participante para ver seus planos vinculados."
        >
          <div className="relative">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Nome ou CPF"
              className="pl-9"
            />
          </div>
          <label className="mt-3 block text-sm font-medium" htmlFor="filtro-plano">
            Plano
          </label>
          <select
            id="filtro-plano"
            value={planoSelecionado}
            onChange={(event) => setPlanoSelecionado(event.target.value)}
            className="mt-1 h-10 w-full rounded-md border border-input bg-background px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
          >
            <option value="todos">Todos os planos</option>
            {planos.map((plano) => (
              <option key={plano.sigla} value={plano.sigla}>
                {plano.sigla}
              </option>
            ))}
            <option value={CENTRUSFUNC}>CENTRUSFUNC — Colaboradores da Centrus</option>
          </select>
          <ul className="mt-3 space-y-1.5">
            {resultados.map((p) => (
              <li key={p.cpf}>
                <button
                  onClick={() => setSelecionado(p.cpf)}
                  className={`w-full rounded-lg px-3 py-2 text-left transition-colors ${
                    p.cpf === pessoa?.cpf ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                  }`}
                >
                  <span className="block truncate text-sm font-medium">{p.nome}</span>
                  <span
                    className={`block text-xs tabular-nums ${
                      p.cpf === pessoa?.cpf ? "text-primary-foreground/70" : "text-muted-foreground"
                    }`}
                  >
                    {p.cpf}
                  </span>
                  <span className="mt-1 flex flex-wrap gap-1">
                    {p.planos
                      .filter((vinculo, indice) =>
                        planoSelecionado === "todos" || planoSelecionado === CENTRUSFUNC
                          ? indice === 0
                          : vinculo.sigla === planoSelecionado,
                      )
                      .map((vinculo) => (
                        <Badge
                          key={vinculo.sigla}
                          variant="secondary"
                          className={
                            p.cpf === pessoa?.cpf
                              ? "bg-primary-foreground/15 text-primary-foreground"
                              : undefined
                          }
                        >
                          {vinculo.sigla}
                        </Badge>
                      ))}
                    {p.colaboradorCentrus ? (
                      <Badge
                        variant="secondary"
                        className={
                          p.cpf === pessoa?.cpf
                            ? "bg-primary-foreground/15 text-primary-foreground"
                            : "bg-success/15 text-success"
                        }
                      >
                        Centrus
                      </Badge>
                    ) : null}
                    {p.planos.length > 1 ? (
                      <Badge
                        variant="outline"
                        className={
                          p.cpf === pessoa?.cpf
                            ? "border-primary-foreground/30 text-primary-foreground"
                            : undefined
                        }
                      >
                        +{p.planos.length - 1}{" "}
                        {p.planos.length === 2 ? "plano vinculado" : "planos vinculados"}
                      </Badge>
                    ) : null}
                  </span>
                </button>
              </li>
            ))}
            {resultados.length === 0 ? (
              <li className="px-3 py-6 text-center text-sm text-muted-foreground">
                {busca.trim()
                  ? "Nenhum participante encontrado."
                  : "Digite um nome ou CPF para localizar um participante."}
              </li>
            ) : null}
          </ul>
          {resultadosFiltrados.length > LIMITE_RESULTADOS ? (
            <p className="mt-2 px-1 text-xs text-muted-foreground">
              Mostrando {LIMITE_RESULTADOS} de {resultadosFiltrados.length} resultados. Refine a
              busca para ver outros participantes.
            </p>
          ) : null}
        </Panel>

        <div className="space-y-4">
          {pessoa ? (
            <>
              <Panel title="Ficha do participante">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h3 className="font-display text-2xl font-semibold">{pessoa.nome}</h3>
                    <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground tabular-nums">
                      <IdCard className="size-4" /> {pessoa.cpf}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="secondary">
                      {pessoa.planos.length}{" "}
                      {pessoa.planos.length === 1 ? "plano vinculado" : "planos vinculados"}
                    </Badge>
                    {pessoa.colaboradorCentrus ? (
                      <Badge className="border-transparent bg-success/15 text-success">
                        Colaborador ativo da Centrus
                      </Badge>
                    ) : null}
                  </div>
                </div>

                <dl className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <Field
                    label="Vínculo com a Centrus"
                    value={
                      pessoa.colaboradorCentrus
                        ? "Funcionário ativo da Centrus"
                        : "Não vinculado como funcionário"
                    }
                  />
                  <Field
                    label="Planos"
                    value={planosDaPessoa
                      .map((plano) => `${plano.sigla} — ${plano.descricao}`)
                      .join(" • ")}
                  />
                  <Field
                    label="Patrocinadores"
                    value={
                      [...new Set(planosDaPessoa.map((plano) => plano.patrocinador))].join(" • ") ||
                      "—"
                    }
                  />
                  <Field
                    label="Inscrições por plano"
                    value={planosDaPessoa
                      .map((plano) => `${plano.sigla}: ${plano.inscricao}`)
                      .join(" • ")}
                  />
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

                <div className="mt-6">
                  <h4 className="text-sm font-semibold">Dados dos planos</h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Plano</TableHead>
                        <TableHead>Patrocinador</TableHead>
                        <TableHead>Inscrição</TableHead>
                        <TableHead>Situação</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {planosDaPessoa.map((plano) => (
                        <TableRow key={plano.sigla}>
                          <TableCell>
                            <p className="font-medium">{plano.sigla}</p>
                            <p className="text-xs text-muted-foreground">{plano.descricao}</p>
                          </TableCell>
                          <TableCell>{plano.patrocinador}</TableCell>
                          <TableCell className="tabular-nums">{plano.inscricao}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">{plano.situacao}</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
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
                        <TableCell className="tabular-nums text-muted-foreground">
                          {d.cpf}
                        </TableCell>
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
            </>
          ) : (
            <Panel title="Ficha do participante">
              <p className="py-10 text-center text-sm text-muted-foreground">
                Busque por nome, CPF ou selecione um plano para visualizar a ficha do participante.
              </p>
            </Panel>
          )}
        </div>
      </div>
    </Shell>
  );
}

function Field({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
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

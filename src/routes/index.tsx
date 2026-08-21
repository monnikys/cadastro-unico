import { createFileRoute } from "@tanstack/react-router";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  LabelList,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Users, Baby, CalendarClock, Building2 } from "lucide-react";
import { useMemo, useState } from "react";
import { Shell } from "@/components/dashboard/Shell";
import { Panel, StatCard } from "@/components/dashboard/StatCard";
import {
  calcularFaixaEtaria,
  calcularPorEstado,
  calcularPorGenero,
  CENTRUSFUNC,
  colaboradoresCentrus,
  dependentes,
  evolucao,
  idadeMedia,
  nf,
  participantes,
  planos,
  totalColaboradoresCentrus,
  totalParticipantes,
} from "@/data/cadastro";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Cadastro Único | Painel de Participantes Centrus" },
      {
        name: "description",
        content:
          "Painel executivo do Cadastro Único: participantes por plano, distribuição geográfica, faixa etária e dependentes.",
      },
      { property: "og:title", content: "Cadastro Único | Painel de Participantes" },
      {
        property: "og:description",
        content: "Visão geral de participantes, planos, dependentes e distribuição por estado.",
      },
    ],
  }),
  component: VisaoGeral,
});

const PALETTE = ["#0e4a6e", "#2a9d9c", "#5cc9a7", "#e0a244", "#7c6bd6"];

const axis = { stroke: "var(--color-muted-foreground)", fontSize: 12 };
const tooltipStyle = {
  background: "var(--color-card)",
  border: "1px solid var(--color-border)",
  borderRadius: 12,
  fontSize: 12,
  color: "var(--color-foreground)",
};

function VisaoGeral() {
  const [planoSelecionado, setPlanoSelecionado] = useState("todos");
  const [anoSelecionado, setAnoSelecionado] = useState("todos");
  const centrusFuncAtivo = planoSelecionado === CENTRUSFUNC;
  const planoAtivo = !centrusFuncAtivo
    ? planos.find((plano) => plano.sigla === planoSelecionado)
    : undefined;
  const planosVisiveis = planoAtivo ? [planoAtivo] : planos;
  const barraCentrusFunc = { sigla: CENTRUSFUNC, participantes: totalColaboradoresCentrus };
  // A opção CENTRUSFUNC não é um plano: na visão "todos os planos" ela
  // aparece como uma barra extra ao lado dos planos reais, para comparar de
  // relance quantos participantes são colaboradores ativos da Centrus.
  const dadosGraficoParticipantes = centrusFuncAtivo
    ? [barraCentrusFunc]
    : planoSelecionado === "todos"
      ? [...planosVisiveis, barraCentrusFunc]
      : planosVisiveis;

  // Amostra real (nunca aproximada) usada em todos os indicadores e
  // gráficos abaixo: os colaboradores da Centrus, os participantes do
  // plano selecionado, ou a base inteira.
  const filtro = useMemo(() => {
    const amostra = centrusFuncAtivo
      ? colaboradoresCentrus
      : planoAtivo
        ? participantes.filter((p) => p.planos.some((v) => v.sigla === planoAtivo.sigla))
        : participantes;
    const cpfsDaAmostra = new Set(amostra.map((p) => p.cpf));
    const dependentesDoFiltro =
      planoSelecionado === "todos"
        ? dependentes.length
        : dependentes.filter((d) => cpfsDaAmostra.has(d.cpfTitular)).length;
    const idadeMediaFiltrada = amostra.length
      ? amostra.reduce((total, p) => total + p.idade, 0) / amostra.length
      : idadeMedia;

    return {
      amostra,
      dependentes: dependentesDoFiltro,
      idadeMedia: idadeMediaFiltrada,
      patrocinadores:
        centrusFuncAtivo || planoAtivo
          ? 1
          : new Set(planos.map((plano) => plano.patrocinador)).size,
      porEstado: calcularPorEstado(amostra),
      porGenero: calcularPorGenero(amostra),
      faixaEtaria: calcularFaixaEtaria(amostra),
    };
  }, [centrusFuncAtivo, planoAtivo, planoSelecionado]);

  const participantesFiltrados = filtro.amostra.length;
  const proporcao = participantesFiltrados / totalParticipantes;

  const anosDisponiveis = useMemo(
    () => Array.from(new Set(evolucao.map((item) => item.ano))).sort((a, b) => a - b),
    [],
  );

  const evolucaoBase = useMemo(
    () =>
      anoSelecionado === "todos"
        ? evolucao
        : evolucao.filter((item) => item.ano === Number(anoSelecionado)),
    [anoSelecionado],
  );

  // A evolução histórica não pode ser recalculada a partir da amostra atual
  // (é uma série no tempo, não uma contagem no presente), então continua
  // aproximada pela proporção do filtro sobre o total.
  const evolucaoFiltrada = useMemo(
    () =>
      evolucaoBase.map((item) => ({
        ...item,
        rotulo: anoSelecionado === "todos" ? `${item.mes}/${String(item.ano).slice(2)}` : item.mes,
        ativos: Math.round(item.ativos * proporcao),
        dependentes: Math.round(item.dependentes * proporcao),
      })),
    [evolucaoBase, proporcao, anoSelecionado],
  );

  const contextoPlano = planoAtivo
    ? planoAtivo.sigla
    : centrusFuncAtivo
      ? CENTRUSFUNC
      : "todos os planos";
  const contextoAno =
    anoSelecionado === "todos"
      ? `${anosDisponiveis[0]}–${anosDisponiveis[anosDisponiveis.length - 1]}`
      : anoSelecionado;

  return (
    <Shell
      title="Visão geral do cadastro"
      subtitle={
        planoAtivo
          ? `Indicadores consolidados do ${planoAtivo.descricao}.`
          : centrusFuncAtivo
            ? "Indicadores consolidados dos colaboradores ativos da Centrus vinculados a algum plano."
            : "Indicadores consolidados da base de participantes, planos e dependentes vinculados à fundação."
      }
    >
      <div className="surface-card mb-4 flex flex-col gap-3 p-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-display text-sm font-semibold text-foreground">Filtro de plano</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Selecione um plano para atualizar todos os indicadores e gráficos da visão geral.
          </p>
        </div>
        <label
          className="grid gap-1 text-xs font-medium text-muted-foreground"
          htmlFor="filtro-plano"
        >
          Plano
          <select
            id="filtro-plano"
            value={planoSelecionado}
            onChange={(event) => setPlanoSelecionado(event.target.value)}
            className="h-10 min-w-64 rounded-md border border-input bg-background px-3 text-sm font-medium text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
          >
            <option value="todos">Todos os planos</option>
            {planos.map((plano) => (
              <option key={plano.sigla} value={plano.sigla}>
                {plano.sigla} — {plano.descricao}
              </option>
            ))}
            <option value={CENTRUSFUNC}>CENTRUSFUNC — Colaboradores ativos da Centrus</option>
          </select>
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Participantes"
          value={nf.format(participantesFiltrados)}
          hint={`CPFs ativos em ${contextoPlano}`}
          icon={Users}
        />
        <StatCard
          label="Idade média"
          value={`${filtro.idadeMedia.toFixed(1)} anos`}
          hint={`Média da amostra de ${contextoPlano}`}
          icon={CalendarClock}
        />
        <StatCard
          label="Dependentes"
          value={nf.format(filtro.dependentes)}
          hint={`Vínculos estimados em ${contextoPlano}`}
          icon={Baby}
        />
        <StatCard
          label="Patrocinadores"
          value={String(filtro.patrocinadores)}
          hint={`Instituidores em ${contextoPlano}`}
          icon={Building2}
        />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Panel
          title="Participantes por plano"
          description={
            planoAtivo
              ? `Participantes vinculados ao ${planoAtivo.descricao}`
              : centrusFuncAtivo
                ? "Colaboradores ativos da Centrus vinculados a algum plano"
                : "Distribuição de CPFs entre os planos vigentes"
          }
          className="lg:col-span-2"
        >
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={dadosGraficoParticipantes} margin={{ left: -16, right: 8 }}>
              <CartesianGrid vertical={false} stroke="var(--color-border)" />
              <XAxis dataKey="sigla" tickLine={false} axisLine={false} {...axis} />
              <YAxis tickLine={false} axisLine={false} {...axis} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "var(--color-muted)" }} />
              <Bar
                dataKey="participantes"
                name="Participantes"
                radius={[8, 8, 0, 0]}
                isAnimationActive={false}
              >
                {dadosGraficoParticipantes.map((_, i) => (
                  <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
                ))}
                <LabelList
                  dataKey="participantes"
                  position="top"
                  formatter={(value: number) => nf.format(value)}
                  style={{ fill: "var(--color-foreground)", fontSize: 12, fontWeight: 600 }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Participantes por gênero" description={`Base de ${contextoPlano}`}>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={filtro.porGenero}
                dataKey="quantidade"
                nameKey="genero"
                innerRadius={62}
                outerRadius={96}
                paddingAngle={3}
                stroke="none"
                isAnimationActive={false}
              >
                {filtro.porGenero.map((_, i) => (
                  <Cell key={i} fill={PALETTE[i]} />
                ))}
              </Pie>
              <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
        </Panel>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Panel title="Faixa etária" description={`Quantidade de participantes em ${contextoPlano}`}>
          <div className="space-y-3">
            {filtro.faixaEtaria.map((f) => {
              const max = Math.max(...filtro.faixaEtaria.map((x) => x.quantidade));
              return (
                <div key={f.faixa}>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{f.faixa}</span>
                    <span className="font-medium text-foreground">{nf.format(f.quantidade)}</span>
                  </div>
                  <div className="mt-1.5 h-2 rounded-full bg-muted">
                    <div
                      className="bg-brand h-2 rounded-full"
                      style={{ width: `${(f.quantidade / max) * 100}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Panel>

        <Panel
          title="Distribuição por estado"
          description={`Participantes de ${contextoPlano} por UF`}
        >
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={filtro.porEstado} layout="vertical" margin={{ left: 8 }}>
              <CartesianGrid horizontal={false} stroke="var(--color-border)" />
              <XAxis type="number" tickLine={false} axisLine={false} {...axis} />
              <YAxis
                type="category"
                dataKey="uf"
                width={56}
                tickLine={false}
                axisLine={false}
                {...axis}
              />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "var(--color-muted)" }} />
              <Bar
                dataKey="participantes"
                name="Participantes"
                fill={PALETTE[1]}
                radius={[0, 6, 6, 0]}
                isAnimationActive={false}
              />
            </BarChart>
          </ResponsiveContainer>
        </Panel>
      </div>

      <Panel
        title="Evolução do cadastro"
        description={`Participantes e dependentes de ${contextoPlano} ao longo de ${contextoAno}`}
        className="mt-4"
      >
        <div className="mb-4 flex justify-end">
          <label
            className="grid gap-1 text-xs font-medium text-muted-foreground"
            htmlFor="filtro-ano"
          >
            Ano
            <select
              id="filtro-ano"
              value={anoSelecionado}
              onChange={(event) => setAnoSelecionado(event.target.value)}
              className="h-10 min-w-40 rounded-md border border-input bg-background px-3 text-sm font-medium text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              <option value="todos">Todos os anos</option>
              {anosDisponiveis.map((ano) => (
                <option key={ano} value={ano}>
                  {ano}
                </option>
              ))}
            </select>
          </label>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={evolucaoFiltrada} margin={{ left: -16, right: 8 }}>
            <CartesianGrid vertical={false} stroke="var(--color-border)" />
            <XAxis dataKey="rotulo" tickLine={false} axisLine={false} {...axis} />
            <YAxis tickLine={false} axisLine={false} {...axis} />
            <Tooltip contentStyle={tooltipStyle} />
            <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
            <Line
              type="monotone"
              dataKey="ativos"
              name="Participantes"
              stroke={PALETTE[0]}
              strokeWidth={2.5}
              isAnimationActive={false}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="dependentes"
              name="Dependentes"
              stroke={PALETTE[1]}
              strokeWidth={2.5}
              isAnimationActive={false}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </Panel>
    </Shell>
  );
}

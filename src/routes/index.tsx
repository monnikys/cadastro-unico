import { createFileRoute } from "@tanstack/react-router";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
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
  evolucao,
  faixaEtaria,
  idadeMedia,
  nf,
  participantes,
  planos,
  porEstado,
  porGenero,
  totalDependentes,
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
  const planoAtivo = planos.find((plano) => plano.sigla === planoSelecionado);
  const planosVisiveis = planoAtivo ? [planoAtivo] : planos;
  const participantesFiltrados = planosVisiveis.reduce(
    (total, plano) => total + plano.participantes,
    0,
  );
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

  const dadosFiltrados = useMemo(() => {
    const escalarQuantidade = <T extends { quantidade: number }>(dados: T[]) =>
      dados.map((item) => ({ ...item, quantidade: Math.round(item.quantidade * proporcao) }));
    const escalarParticipantes = <T extends { participantes: number }>(dados: T[]) =>
      dados.map((item) => ({ ...item, participantes: Math.round(item.participantes * proporcao) }));

    const amostraDoPlano = planoAtivo
      ? participantes.filter((participante) =>
          participante.planos.some((plano) => plano.sigla === planoAtivo.sigla),
        )
      : participantes;
    const idadeMediaFiltrada = amostraDoPlano.length
      ? amostraDoPlano.reduce((total, participante) => total + participante.idade, 0) /
        amostraDoPlano.length
      : idadeMedia;

    return {
      dependentes: Math.round(totalDependentes * proporcao),
      idadeMedia: planoAtivo ? idadeMediaFiltrada : idadeMedia,
      patrocinadores: new Set(planosVisiveis.map((plano) => plano.patrocinador)).size,
      porEstado: escalarParticipantes(porEstado),
      porGenero: escalarQuantidade(porGenero),
      faixaEtaria: escalarQuantidade(faixaEtaria),
      evolucao: evolucaoBase.map((item) => ({
        ...item,
        rotulo: anoSelecionado === "todos" ? `${item.mes}/${String(item.ano).slice(2)}` : item.mes,
        ativos: Math.round(item.ativos * proporcao),
        dependentes: Math.round(item.dependentes * proporcao),
      })),
    };
  }, [planoAtivo, planosVisiveis, proporcao, evolucaoBase, anoSelecionado]);

  const contextoPlano = planoAtivo ? planoAtivo.sigla : "todos os planos";
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
          value={`${dadosFiltrados.idadeMedia.toFixed(1)} anos`}
          hint={`Média da amostra de ${contextoPlano}`}
          icon={CalendarClock}
        />
        <StatCard
          label="Dependentes"
          value={nf.format(dadosFiltrados.dependentes)}
          hint={`Vínculos estimados em ${contextoPlano}`}
          icon={Baby}
        />
        <StatCard
          label="Patrocinadores"
          value={String(dadosFiltrados.patrocinadores)}
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
              : "Distribuição de CPFs entre os planos vigentes"
          }
          className="lg:col-span-2"
        >
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={planosVisiveis} margin={{ left: -16, right: 8 }}>
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
                {planosVisiveis.map((_, i) => (
                  <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Participantes por gênero" description={`Base de ${contextoPlano}`}>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={dadosFiltrados.porGenero}
                dataKey="quantidade"
                nameKey="genero"
                innerRadius={62}
                outerRadius={96}
                paddingAngle={3}
                stroke="none"
                isAnimationActive={false}
              >
                {dadosFiltrados.porGenero.map((_, i) => (
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
            {dadosFiltrados.faixaEtaria.map((f) => {
              const max = Math.max(...dadosFiltrados.faixaEtaria.map((x) => x.quantidade));
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
            <BarChart data={dadosFiltrados.porEstado} layout="vertical" margin={{ left: 8 }}>
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
          <LineChart data={dadosFiltrados.evolucao} margin={{ left: -16, right: 8 }}>
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

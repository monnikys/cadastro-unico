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
import { Shell } from "@/components/dashboard/Shell";
import { Panel, StatCard } from "@/components/dashboard/StatCard";
import {
  evolucao,
  faixaEtaria,
  idadeMedia,
  nf,
  planos,
  porEstado,
  porGenero,
  totalDependentes,
  totalParticipantes,
  totalPatrocinadores,
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
  return (
    <Shell
      title="Visão geral do cadastro"
      subtitle="Indicadores consolidados da base de participantes, planos e dependentes vinculados à fundação."
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Participantes"
          value={nf.format(totalParticipantes)}
          hint="CPFs ativos na base"
          icon={Users}
        />
        <StatCard
          label="Idade média"
          value={`${idadeMedia.toFixed(1)} anos`}
          hint="Média ponderada"
          icon={CalendarClock}
        />
        <StatCard
          label="Dependentes"
          value={nf.format(totalDependentes)}
          hint="Vínculos registrados"
          icon={Baby}
        />
        <StatCard
          label="Patrocinadores"
          value={String(totalPatrocinadores)}
          hint="Instituidores e patrocinadores"
          icon={Building2}
        />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Panel
          title="Participantes por plano"
          description="Distribuição de CPFs entre os planos vigentes"
          className="lg:col-span-2"
        >
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={planos} margin={{ left: -16, right: 8 }}>
              <CartesianGrid vertical={false} stroke="var(--color-border)" />
              <XAxis dataKey="sigla" tickLine={false} axisLine={false} {...axis} />
              <YAxis tickLine={false} axisLine={false} {...axis} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "var(--color-muted)" }} />
              <Bar dataKey="participantes" name="Participantes" radius={[8, 8, 0, 0]} isAnimationActive={false}>
                {planos.map((_, i) => (
                  <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Participantes por gênero" description="Base total de CPFs">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={porGenero}
                dataKey="quantidade"
                nameKey="genero"
                innerRadius={62}
                outerRadius={96}
                paddingAngle={3}
                stroke="none"
                isAnimationActive={false}
              >
                {porGenero.map((_, i) => (
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
        <Panel title="Faixa etária" description="Quantidade de participantes por faixa">
          <div className="space-y-3">
            {faixaEtaria.map((f) => {
              const max = Math.max(...faixaEtaria.map((x) => x.quantidade));
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

        <Panel title="Distribuição por estado" description="Participantes por UF de endereço">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={porEstado} layout="vertical" margin={{ left: 8 }}>
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
        description="Participantes e dependentes ao longo do ano"
        className="mt-4"
      >
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={evolucao} margin={{ left: -16, right: 8 }}>
            <CartesianGrid vertical={false} stroke="var(--color-border)" />
            <XAxis dataKey="mes" tickLine={false} axisLine={false} {...axis} />
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

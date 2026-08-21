// Dados de demonstração do painel Cadastro Único (estrutura baseada no modelo original)
//
// A base de participantes/dependentes é gerada por um gerador
// pseudo-aleatório com semente fixa: os mesmos dados aparecem em toda
// carga da página (servidor e cliente), simulando uma base realista em
// escala. Todos os totais agregados (planos, porEstado, faixaEtaria,
// porGenero, evolução, colaboradores Centrus etc.) são derivados desta
// mesma base — nunca números "soltos" — para que as abas de
// Participantes, Dependentes e Visão Geral fiquem sempre consistentes
// entre si.

export type Plano = {
  sigla: string;
  descricao: string;
  participantes: number;
  patrocinador: string;
  cnpj: string;
  situacao: "Ativo" | "Em saldamento" | "Encerrado";
};

export type VinculoPlano = {
  sigla: string;
  inscricao: string;
  situacao: "Ativo" | "Assistido" | "Autopatrocinado";
};

export type Participante = {
  cpf: string;
  nome: string;
  planos: VinculoPlano[];
  uf: string;
  idade: number;
  sexo: "M" | "F";
  email: string;
  telefone: string;
  // Presente e true apenas quando o participante também é colaborador
  // ativo do quadro de funcionários da Centrus.
  colaboradorCentrus?: boolean;
};

export type Dependente = {
  nome: string;
  cpf: string;
  titular: string;
  cpfTitular: string;
  parentesco: string;
  idade: number;
  // Um dependente pode estar vinculado a mais de um plano, desde que o
  // titular também possua vínculo em cada um deles.
  planos: string[];
};

// ---------------------------------------------------------------------------
// Gerador determinístico (mulberry32): mesma semente => mesmos dados sempre.
// ---------------------------------------------------------------------------

function mulberry32(seed: number) {
  let s = seed >>> 0;
  return function random() {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rng = mulberry32(20260821);

function randInt(min: number, max: number) {
  return Math.floor(rng() * (max - min + 1)) + min;
}

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(rng() * arr.length)]!;
}

// Fisher-Yates: ao contrário de `sort(() => rng() - 0.5)`, consome sempre
// exatamente arr.length-1 números aleatórios, garantindo o mesmo resultado
// no servidor (SSR) e no cliente para a mesma semente.
function embaralhar<T>(arr: readonly T[]): T[] {
  const copia = arr.slice();
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const tmp = copia[i]!;
    copia[i] = copia[j]!;
    copia[j] = tmp;
  }
  return copia;
}

function pickWeighted<T>(items: readonly (readonly [T, number])[]): T {
  const total = items.reduce((soma, [, peso]) => soma + peso, 0);
  let r = rng() * total;
  for (const [item, peso] of items) {
    if (r < peso) return item;
    r -= peso;
  }
  return items[items.length - 1]![0];
}

function semAcentos(texto: string) {
  return texto.normalize("NFD").replace(/[̀-ͯ]/g, "");
}

const PRIMEIRO_NOME_M = [
  "Roberto",
  "Jorge",
  "Fernando",
  "Paulo",
  "Ricardo",
  "Eduardo",
  "Marcelo",
  "André",
  "Gustavo",
  "Leonardo",
  "Sérgio",
  "Bruno",
  "Marcos",
  "Cesar",
  "Fabio",
  "Kleber",
  "Diego",
  "Gilberto",
  "Mauricio",
  "Emerson",
  "Henrique",
  "Wagner",
  "Thiago",
  "Gabriel",
  "Rodrigo",
  "Felipe",
  "Lucas",
  "Carlos",
  "Daniel",
  "Rafael",
  "Alexandre",
  "Vinicius",
  "Renato",
  "Julio",
  "Otavio",
  "Igor",
];
const PRIMEIRO_NOME_F = [
  "Ana",
  "Beatriz",
  "Carla",
  "Juliana",
  "Renata",
  "Larissa",
  "Vanessa",
  "Mônica",
  "Camila",
  "Flavia",
  "Tatiana",
  "Regina",
  "Fernanda",
  "Priscila",
  "Marina",
  "Elisa",
  "Luciana",
  "Ingrid",
  "Sofia",
  "Clara",
  "Helena",
  "Patricia",
  "Aline",
  "Bianca",
  "Debora",
  "Simone",
  "Vera",
  "Cristina",
  "Amanda",
  "Natalia",
  "Gabriela",
  "Isabela",
  "Roberta",
  "Silvia",
];
const SOBRENOMES = [
  "Peixoto",
  "Nunes",
  "Almeida",
  "Andrade",
  "Furtado",
  "Lima",
  "Cabral",
  "Ribeiro",
  "Mendes",
  "Souza",
  "Moraes",
  "Campos",
  "Freire",
  "Tavares",
  "Lopes",
  "Nascimento",
  "Barros",
  "Duarte",
  "Cavalcanti",
  "Vieira",
  "Sampaio",
  "Rocha",
  "Albuquerque",
  "Pinheiro",
  "Pires",
  "Monteiro",
  "Farias",
  "Queiroz",
  "Teixeira",
  "Ramos",
  "Brito",
  "Oliveira",
  "Leal",
  "Rezende",
  "Pereira",
  "Alves",
  "Kowalski",
  "Machado",
  "Esteves",
  "Ibrahim",
  "Quintana",
  "Lobato",
  "Uchoa",
  "Holanda",
  "Teles",
  "Bezerra",
  "Vargas",
  "Xavier",
  "Jardim",
  "Gonçalves",
  "Zanetti",
  "Castro",
  "Henriques",
  "Costa",
  "Silva",
  "Santos",
  "Carvalho",
  "Martins",
  "Dias",
  "Correia",
  "Fonseca",
  "Guedes",
  "Aragão",
];

const UF_DDD: Record<string, string> = {
  DF: "61",
  SP: "11",
  RJ: "21",
  MG: "31",
  RS: "51",
  PR: "41",
  BA: "71",
  PE: "81",
  CE: "85",
  GO: "62",
  ES: "27",
  SC: "48",
  AM: "92",
  MA: "98",
  PA: "91",
  AL: "82",
  PB: "83",
  RN: "84",
  MT: "65",
  MS: "67",
  TO: "63",
  RO: "69",
  PI: "86",
  SE: "79",
};

const UF_PESO: Array<readonly [string, number]> = [
  ["DF", 30],
  ["SP", 14],
  ["RJ", 10],
  ["MG", 8],
  ["RS", 5],
  ["PR", 4.5],
  ["BA", 4],
  ["PE", 3.5],
  ["CE", 2.5],
  ["GO", 3],
  ["ES", 2.5],
  ["SC", 3],
  ["AM", 2],
  ["MA", 2],
  ["PA", 2],
  ["AL", 1],
  ["PB", 1],
  ["RN", 1],
  ["MT", 1],
  ["MS", 1],
  ["TO", 1],
  ["RO", 1],
  ["PI", 1],
  ["SE", 1],
];

const PLANO_PESO: Array<readonly ["PBB" | "PBDC" | "PCD" | "CP+", number]> = [
  ["PBB", 10],
  ["PBDC", 50],
  ["PCD", 6],
  ["CP+", 34],
];

const SITUACAO_POR_PLANO: Record<
  string,
  Array<readonly ["Ativo" | "Assistido" | "Autopatrocinado", number]>
> = {
  PBB: [
    ["Ativo", 45],
    ["Assistido", 25],
    ["Autopatrocinado", 30],
  ],
  PBDC: [
    ["Ativo", 10],
    ["Assistido", 75],
    ["Autopatrocinado", 15],
  ],
  PCD: [
    ["Ativo", 35],
    ["Assistido", 30],
    ["Autopatrocinado", 35],
  ],
  "CP+": [
    ["Ativo", 35],
    ["Assistido", 35],
    ["Autopatrocinado", 30],
  ],
};

function dataInscricaoAleatoria(idade: number) {
  const anoAtual = 2026;
  const anoMinimo = Math.max(1980, anoAtual - idade + 18);
  const ano = randInt(anoMinimo, 2025);
  const mes = randInt(1, 12);
  const dia = randInt(1, 28);
  return `${String(dia).padStart(2, "0")}/${String(mes).padStart(2, "0")}/${ano}`;
}

function gerarCpf(usados: Set<string>) {
  let cpf = "";
  do {
    const n = () => randInt(0, 9);
    cpf = `${n()}${n()}${n()}.${n()}${n()}${n()}.${n()}${n()}${n()}-${n()}${n()}`;
  } while (usados.has(cpf));
  usados.add(cpf);
  return cpf;
}

const TOTAL_PARTICIPANTES = 2985;
const TOTAL_COLABORADORES_CENTRUS = 100;

function gerarParticipantes(): Participante[] {
  const cpfsUsados = new Set<string>();
  const emailsUsados = new Set<string>();
  const lista: Participante[] = [];

  for (let i = 0; i < TOTAL_PARTICIPANTES; i++) {
    const sexo: "M" | "F" = rng() < 0.58 ? "M" : "F";
    const primeiroNome = pick(sexo === "M" ? PRIMEIRO_NOME_M : PRIMEIRO_NOME_F);
    const sobrenome1 = pick(SOBRENOMES);
    const sobrenome2 = pick(SOBRENOMES);
    const nome = `${primeiroNome} ${sobrenome1} ${sobrenome2}`;

    const emailBase = `${semAcentos(primeiroNome)}.${semAcentos(sobrenome2)}`.toLowerCase();
    let email = `${emailBase}@exemplo.com.br`;
    let sufixo = 1;
    while (emailsUsados.has(email)) {
      sufixo += 1;
      email = `${emailBase}${sufixo}@exemplo.com.br`;
    }
    emailsUsados.add(email);

    const uf = pickWeighted(UF_PESO);
    const ddd = UF_DDD[uf] ?? "61";
    const idade = randInt(24, 78);

    const siglaPrincipal = pickWeighted(PLANO_PESO);
    const situacaoPrincipal = pickWeighted(SITUACAO_POR_PLANO[siglaPrincipal]!);
    const planosVinculo: VinculoPlano[] = [
      {
        sigla: siglaPrincipal,
        inscricao: dataInscricaoAleatoria(idade),
        situacao: situacaoPrincipal,
      },
    ];

    if (rng() < 0.13) {
      const outrasSiglas = (["PBB", "PBDC", "PCD", "CP+"] as const).filter(
        (s) => s !== siglaPrincipal,
      );
      const siglaSecundaria = pick(outrasSiglas);
      const situacaoSecundaria = pickWeighted(SITUACAO_POR_PLANO[siglaSecundaria]!);
      planosVinculo.push({
        sigla: siglaSecundaria,
        inscricao: dataInscricaoAleatoria(idade),
        situacao: situacaoSecundaria,
      });
    }

    lista.push({
      cpf: gerarCpf(cpfsUsados),
      nome,
      planos: planosVinculo,
      uf,
      idade,
      sexo,
      email,
      telefone: `(${ddd}) 9${randInt(1000, 9999)}-${randInt(1000, 9999)}`,
    });
  }

  // Define exatamente TOTAL_COLABORADORES_CENTRUS pessoas como colaboradoras
  // ativas da Centrus: precisam ter vínculo Ativo no CP+, o plano próprio da
  // fundação para o quadro de funcionários.
  const indicesEmbaralhados = embaralhar(lista.map((_, i) => i));
  let marcados = 0;
  for (const indice of indicesEmbaralhados) {
    if (marcados >= TOTAL_COLABORADORES_CENTRUS) break;
    const participante = lista[indice]!;
    const vinculoCp = participante.planos.find((v) => v.sigla === "CP+");
    if (vinculoCp) {
      vinculoCp.situacao = "Ativo";
    } else {
      participante.planos.push({
        sigla: "CP+",
        inscricao: dataInscricaoAleatoria(participante.idade),
        situacao: "Ativo",
      });
    }
    participante.colaboradorCentrus = true;
    marcados += 1;
  }

  return lista;
}

const PARENTESCO_PESO: Array<readonly ["Cônjuge" | "Filho(a)" | "Enteado(a)", number]> = [
  ["Cônjuge", 35],
  ["Filho(a)", 45],
  ["Enteado(a)", 20],
];

const QTD_DEPENDENTES_PESO: Array<readonly [number, number]> = [
  [0, 45],
  [1, 40],
  [2, 12],
  [3, 3],
];

function gerarDependentes(titulares: Participante[]): Dependente[] {
  const cpfsUsados = new Set<string>(titulares.map((p) => p.cpf));
  const lista: Dependente[] = [];

  for (const titular of titulares) {
    const qtd = pickWeighted(QTD_DEPENDENTES_PESO);
    for (let i = 0; i < qtd; i++) {
      const parentesco = pickWeighted(PARENTESCO_PESO);
      const sexoDependente: "M" | "F" = rng() < 0.5 ? "M" : "F";
      const primeiroNome = pick(sexoDependente === "M" ? PRIMEIRO_NOME_M : PRIMEIRO_NOME_F);
      const sobrenomeTitular = titular.nome.split(" ").slice(1)[0] ?? pick(SOBRENOMES);
      const nome = `${primeiroNome} ${sobrenomeTitular} ${pick(SOBRENOMES)}`;

      const idade =
        parentesco === "Cônjuge" ? Math.max(18, titular.idade + randInt(-8, 8)) : randInt(0, 32);

      const siglasTitular = titular.planos.map((v) => v.sigla);
      const planosDependente =
        siglasTitular.length > 1 && rng() < 0.25 ? siglasTitular : [pick(siglasTitular)];

      lista.push({
        nome,
        cpf: gerarCpf(cpfsUsados),
        titular: titular.nome,
        cpfTitular: titular.cpf,
        parentesco,
        idade,
        planos: planosDependente,
      });
    }
  }

  return lista;
}

// Caso proposital: um titular (que já tem plano próprio) também aparece
// como dependente de outro titular — por exemplo, um cônjuge que tem seu
// próprio plano mas também consta como dependente no plano do parceiro.
function criarCasoTitularTambemDependente(
  listaParticipantes: Participante[],
  listaDependentes: Dependente[],
): void {
  const dependenteAlvo = listaDependentes.find((d) => d.parentesco === "Cônjuge");
  if (!dependenteAlvo) return;
  const participanteAlvo = listaParticipantes.find(
    (p) => p.cpf !== dependenteAlvo.cpfTitular && p.nome !== dependenteAlvo.titular,
  );
  if (!participanteAlvo) return;

  dependenteAlvo.nome = participanteAlvo.nome;
  dependenteAlvo.cpf = participanteAlvo.cpf;
  dependenteAlvo.idade = participanteAlvo.idade;
}

export const participantes: Participante[] = gerarParticipantes();
export const dependentes: Dependente[] = gerarDependentes(participantes);
criarCasoTitularTambemDependente(participantes, dependentes);

const PLANOS_META: Array<Omit<Plano, "participantes">> = [
  {
    sigla: "PBB",
    descricao: "PLANO BASICO DE BENEFICIOS",
    patrocinador: "Associação Nacional dos Servidores",
    cnpj: "03.658.417/0001-72",
    situacao: "Ativo",
  },
  {
    sigla: "PBDC",
    descricao: "PLANO DE BENEFICIO DEFINIDO CENTRUS",
    patrocinador: "Banco Central do Brasil",
    cnpj: "00.038.166/0001-05",
    situacao: "Em saldamento",
  },
  {
    sigla: "PCD",
    descricao: "PLANO DE CONTRIBUICAO DEFINIDA",
    patrocinador: "Cooperativa Agroindustrial Central",
    cnpj: "12.774.508/0001-19",
    situacao: "Encerrado",
  },
  {
    sigla: "CP+",
    descricao: "PLANO INSTITUIDO CP+",
    patrocinador: "Centrus - Fundação Banco Central",
    cnpj: "00.493.019/0001-40",
    situacao: "Ativo",
  },
];

export const planos: Plano[] = PLANOS_META.map((meta) => ({
  ...meta,
  participantes: participantes.filter((p) => p.planos.some((v) => v.sigla === meta.sigla)).length,
}));

export const totalParticipantes = participantes.length;
export const totalDependentes = dependentes.length;
export const idadeMedia = participantes.reduce((s, p) => s + p.idade, 0) / participantes.length;
export const totalPatrocinadores = new Set(PLANOS_META.map((p) => p.patrocinador)).size;

const UFS_PRINCIPAIS = ["DF", "SP", "RJ", "MG", "RS", "PR", "BA", "PE", "CE"];

export function calcularPorEstado(lista: Participante[]) {
  const contagem = new Map<string, number>();
  for (const p of lista) contagem.set(p.uf, (contagem.get(p.uf) ?? 0) + 1);
  const principais = UFS_PRINCIPAIS.map((uf) => ({ uf, participantes: contagem.get(uf) ?? 0 }));
  const outros = [...contagem.entries()]
    .filter(([uf]) => !UFS_PRINCIPAIS.includes(uf))
    .reduce((soma, [, quantidade]) => soma + quantidade, 0);
  return [...principais, { uf: "Outros", participantes: outros }];
}

const FAIXAS: Array<readonly [string, number, number]> = [
  ["Até 30 anos", 0, 30],
  ["31 a 40 anos", 31, 40],
  ["41 a 50 anos", 41, 50],
  ["51 a 60 anos", 51, 60],
  ["61 a 70 anos", 61, 70],
  ["Acima de 70", 71, 999],
];

export function calcularFaixaEtaria(lista: Participante[]) {
  return FAIXAS.map(([faixa, min, max]) => ({
    faixa,
    quantidade: lista.filter((p) => p.idade >= min && p.idade <= max).length,
  }));
}

export function calcularPorGenero(lista: Participante[]) {
  return [
    { genero: "Masculino", quantidade: lista.filter((p) => p.sexo === "M").length },
    { genero: "Feminino", quantidade: lista.filter((p) => p.sexo === "F").length },
  ];
}

export const porEstado = calcularPorEstado(participantes);
export const faixaEtaria = calcularFaixaEtaria(participantes);
export const porGenero = calcularPorGenero(participantes);

const MESES = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

function gerarEvolucao(totalAtivosFinal: number, totalDependentesFinal: number) {
  const pontos: Array<{ mes: string; ano: number; ativos: number; dependentes: number }> = [];
  const anoInicio = 2024;
  const totalMeses = 32; // Jan/2024 a Ago/2026
  const inicioAtivos = Math.round(totalAtivosFinal * 0.85);
  const inicioDependentes = Math.round(totalDependentesFinal * 0.85);

  for (let i = 0; i < totalMeses; i++) {
    const progresso = i / (totalMeses - 1);
    const ruido = 1 + (rng() - 0.5) * 0.01;
    const ativos =
      i === totalMeses - 1
        ? totalAtivosFinal
        : Math.round((inicioAtivos + (totalAtivosFinal - inicioAtivos) * progresso) * ruido);
    const dependentesQtd =
      i === totalMeses - 1
        ? totalDependentesFinal
        : Math.round(
            (inicioDependentes + (totalDependentesFinal - inicioDependentes) * progresso) * ruido,
          );
    const mesIndex = i % 12;
    const ano = anoInicio + Math.floor(i / 12);
    pontos.push({ mes: MESES[mesIndex]!, ano, ativos, dependentes: dependentesQtd });
  }
  return pontos;
}

export const evolucao = gerarEvolucao(totalParticipantes, totalDependentes);

// Identificador usado nos filtros de plano para representar a opção
// "CENTRUSFUNC": colaboradores ativos da Centrus que também são
// participantes de algum plano. Não é um plano real, por isso fica fora
// do array `planos` (evita distorcer totais como `totalParticipantes`).
export const CENTRUSFUNC = "CENTRUSFUNC";

export const colaboradoresCentrus = participantes.filter((p) => p.colaboradorCentrus);
export const totalColaboradoresCentrus = colaboradoresCentrus.length;

export const nf = new Intl.NumberFormat("pt-BR");

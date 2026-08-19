// Dados de demonstração do painel Cadastro Único (estrutura baseada no modelo original)

export type Plano = {
  sigla: string;
  descricao: string;
  participantes: number;
  patrocinador: string;
  cnpj: string;
  situacao: "Ativo" | "Em saldamento" | "Encerrado";
};

export const planos: Plano[] = [
  {
    sigla: "PBD",
    descricao: "Plano de Benefício Definido",
    participantes: 4820,
    patrocinador: "Banco Central do Brasil",
    cnpj: "00.038.166/0001-05",
    situacao: "Em saldamento",
  },
  {
    sigla: "PCV",
    descricao: "Plano de Contribuição Variável",
    participantes: 3164,
    patrocinador: "Centrus - Fundação Banco Central",
    cnpj: "00.493.019/0001-40",
    situacao: "Ativo",
  },
  {
    sigla: "PGA",
    descricao: "Plano de Gestão Administrativa",
    participantes: 1287,
    patrocinador: "Centrus - Fundação Banco Central",
    cnpj: "00.493.019/0001-40",
    situacao: "Ativo",
  },
  {
    sigla: "PIC",
    descricao: "Plano Instituído Corporativo",
    participantes: 942,
    patrocinador: "Associação Nacional dos Servidores",
    cnpj: "03.658.417/0001-72",
    situacao: "Ativo",
  },
  {
    sigla: "PPR",
    descricao: "Plano Previdenciário Rural",
    participantes: 615,
    patrocinador: "Cooperativa Agroindustrial Central",
    cnpj: "12.774.508/0001-19",
    situacao: "Encerrado",
  },
];

export const totalParticipantes = planos.reduce((s, p) => s + p.participantes, 0);
export const idadeMedia = 54.7;
export const totalDependentes = 6431;
export const totalPatrocinadores = 4;

export const porEstado = [
  { uf: "DF", participantes: 5210 },
  { uf: "SP", participantes: 1840 },
  { uf: "RJ", participantes: 1305 },
  { uf: "MG", participantes: 927 },
  { uf: "RS", participantes: 486 },
  { uf: "PR", participantes: 421 },
  { uf: "BA", participantes: 338 },
  { uf: "PE", participantes: 217 },
  { uf: "CE", participantes: 104 },
  { uf: "Outros", participantes: 80 },
];

export const faixaEtaria = [
  { faixa: "Até 30 anos", quantidade: 412 },
  { faixa: "31 a 40 anos", quantidade: 1136 },
  { faixa: "41 a 50 anos", quantidade: 2248 },
  { faixa: "51 a 60 anos", quantidade: 3389 },
  { faixa: "61 a 70 anos", quantidade: 2274 },
  { faixa: "Acima de 70", quantidade: 1369 },
];

export const porGenero = [
  { genero: "Masculino", quantidade: 6472 },
  { genero: "Feminino", quantidade: 4356 },
];

export const evolucao = [
  { mes: "Jan", ativos: 10420, dependentes: 6120 },
  { mes: "Fev", ativos: 10465, dependentes: 6178 },
  { mes: "Mar", ativos: 10521, dependentes: 6215 },
  { mes: "Abr", ativos: 10590, dependentes: 6260 },
  { mes: "Mai", ativos: 10664, dependentes: 6304 },
  { mes: "Jun", ativos: 10712, dependentes: 6351 },
  { mes: "Jul", ativos: 10778, dependentes: 6392 },
  { mes: "Ago", ativos: 10828, dependentes: 6431 },
];

export type Participante = {
  cpf: string;
  nome: string;
  plano: string;
  uf: string;
  idade: number;
  sexo: "M" | "F";
  email: string;
  telefone: string;
  situacao: "Ativo" | "Assistido" | "Autopatrocinado";
  inscricao: string;
};

export const participantes: Participante[] = [
  {
    cpf: "184.902.371-05",
    nome: "Ana Carolina Peixoto",
    plano: "PCV",
    uf: "DF",
    idade: 47,
    sexo: "F",
    email: "ana.peixoto@exemplo.com.br",
    telefone: "(61) 99812-4477",
    situacao: "Ativo",
    inscricao: "12/03/2009",
  },
  {
    cpf: "225.771.008-44",
    nome: "Roberto Nunes de Almeida",
    plano: "PBD",
    uf: "DF",
    idade: 68,
    sexo: "M",
    email: "roberto.almeida@exemplo.com.br",
    telefone: "(61) 98443-1120",
    situacao: "Assistido",
    inscricao: "05/07/1988",
  },
  {
    cpf: "310.448.229-71",
    nome: "Mariana Torres Vasconcelos",
    plano: "PGA",
    uf: "SP",
    idade: 39,
    sexo: "F",
    email: "mariana.torres@exemplo.com.br",
    telefone: "(11) 99120-8865",
    situacao: "Ativo",
    inscricao: "18/09/2014",
  },
  {
    cpf: "402.117.633-90",
    nome: "Jorge Luiz Andrade",
    plano: "PIC",
    uf: "RJ",
    idade: 55,
    sexo: "M",
    email: "jorge.andrade@exemplo.com.br",
    telefone: "(21) 98801-3390",
    situacao: "Autopatrocinado",
    inscricao: "23/01/2001",
  },
  {
    cpf: "556.903.114-28",
    nome: "Beatriz Furtado Lima",
    plano: "PCV",
    uf: "MG",
    idade: 61,
    sexo: "F",
    email: "beatriz.lima@exemplo.com.br",
    telefone: "(31) 99633-2214",
    situacao: "Assistido",
    inscricao: "14/11/1995",
  },
  {
    cpf: "671.220.845-13",
    nome: "Fernando Cabral Ribeiro",
    plano: "PBD",
    uf: "RS",
    idade: 72,
    sexo: "M",
    email: "fernando.ribeiro@exemplo.com.br",
    telefone: "(51) 99887-4402",
    situacao: "Assistido",
    inscricao: "02/02/1984",
  },
];

export type Dependente = {
  nome: string;
  cpf: string;
  titular: string;
  cpfTitular: string;
  parentesco: string;
  idade: number;
  plano: string;
};

export const dependentes: Dependente[] = [
  {
    nome: "Lucas Peixoto Martins",
    cpf: "902.114.338-70",
    titular: "Ana Carolina Peixoto",
    cpfTitular: "184.902.371-05",
    parentesco: "Filho(a)",
    idade: 16,
    plano: "PCV",
  },
  {
    nome: "Helena Nunes de Almeida",
    cpf: "118.446.702-31",
    titular: "Roberto Nunes de Almeida",
    cpfTitular: "225.771.008-44",
    parentesco: "Cônjuge",
    idade: 65,
    plano: "PBD",
  },
  {
    nome: "Rafael Torres Vasconcelos",
    cpf: "774.330.219-08",
    titular: "Mariana Torres Vasconcelos",
    cpfTitular: "310.448.229-71",
    parentesco: "Filho(a)",
    idade: 9,
    plano: "PGA",
  },
  {
    nome: "Clara Andrade Souza",
    cpf: "530.887.104-66",
    titular: "Jorge Luiz Andrade",
    cpfTitular: "402.117.633-90",
    parentesco: "Filho(a)",
    idade: 21,
    plano: "PIC",
  },
  {
    nome: "Otávio Furtado Lima",
    cpf: "641.209.773-52",
    titular: "Beatriz Furtado Lima",
    cpfTitular: "556.903.114-28",
    parentesco: "Cônjuge",
    idade: 64,
    plano: "PCV",
  },
  {
    nome: "Sofia Cabral Ribeiro",
    cpf: "883.550.226-14",
    titular: "Fernando Cabral Ribeiro",
    cpfTitular: "671.220.845-13",
    parentesco: "Filho(a)",
    idade: 33,
    plano: "PBD",
  },
];

export const nf = new Intl.NumberFormat("pt-BR");

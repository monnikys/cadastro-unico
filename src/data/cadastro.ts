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
    sigla: "PBB",
    descricao: "PLANO BASICO DE BENEFICIOS",
    participantes: 942,
    patrocinador: "Associação Nacional dos Servidores",
    cnpj: "03.658.417/0001-72",
    situacao: "Ativo",
  },
  {
    sigla: "PBDC",
    descricao: "PLANO DE BENEFICIO DEFINIDO CENTRUS",
    participantes: 4820,
    patrocinador: "Banco Central do Brasil",
    cnpj: "00.038.166/0001-05",
    situacao: "Em saldamento",
  },
  {
    sigla: "PCD",
    descricao: "PLANO DE CONTRIBUICAO DEFINIDA",
    participantes: 615,
    patrocinador: "Cooperativa Agroindustrial Central",
    cnpj: "12.774.508/0001-19",
    situacao: "Encerrado",
  },
  {
    sigla: "CENTRUSPREV+",
    descricao: "PLANO INSTITUIDO CENTRUSPREV+",
    participantes: 3164,
    patrocinador: "Centrus - Fundação Banco Central",
    cnpj: "00.493.019/0001-40",
    situacao: "Ativo",
  },
  {
    sigla: "PGA",
    descricao: "PLANO DE GESTAO ADMINISTRATIVA",
    participantes: 1287,
    patrocinador: "Centrus - Fundação Banco Central",
    cnpj: "00.493.019/0001-40",
    situacao: "Ativo",
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
};

export const participantes: Participante[] = [
  {
    cpf: "184.902.371-05",
    nome: "Ana Carolina Peixoto",
    // Exemplo: um único cadastro pode estar vinculado a mais de um plano.
    planos: [
      { sigla: "CENTRUSPREV+", inscricao: "12/03/2009", situacao: "Ativo" },
      { sigla: "PBB", inscricao: "18/06/2016", situacao: "Ativo" },
    ],
    uf: "DF",
    idade: 47,
    sexo: "F",
    email: "ana.peixoto@exemplo.com.br",
    telefone: "(61) 99812-4477",
  },
  {
    cpf: "225.771.008-44",
    nome: "Roberto Nunes de Almeida",
    planos: [{ sigla: "PBDC", inscricao: "05/07/1988", situacao: "Assistido" }],
    uf: "DF",
    idade: 68,
    sexo: "M",
    email: "roberto.almeida@exemplo.com.br",
    telefone: "(61) 98443-1120",
  },
  {
    cpf: "310.448.229-71",
    nome: "Mariana Torres Vasconcelos",
    planos: [{ sigla: "PGA", inscricao: "18/09/2014", situacao: "Ativo" }],
    uf: "SP",
    idade: 39,
    sexo: "F",
    email: "mariana.torres@exemplo.com.br",
    telefone: "(11) 99120-8865",
  },
  {
    cpf: "402.117.633-90",
    nome: "Jorge Luiz Andrade",
    planos: [{ sigla: "PBB", inscricao: "23/01/2001", situacao: "Autopatrocinado" }],
    uf: "RJ",
    idade: 55,
    sexo: "M",
    email: "jorge.andrade@exemplo.com.br",
    telefone: "(21) 98801-3390",
  },
  {
    cpf: "556.903.114-28",
    nome: "Beatriz Furtado Lima",
    planos: [{ sigla: "CENTRUSPREV+", inscricao: "14/11/1995", situacao: "Assistido" }],
    uf: "MG",
    idade: 61,
    sexo: "F",
    email: "beatriz.lima@exemplo.com.br",
    telefone: "(31) 99633-2214",
  },
  {
    cpf: "671.220.845-13",
    nome: "Fernando Cabral Ribeiro",
    planos: [{ sigla: "PBDC", inscricao: "02/02/1984", situacao: "Assistido" }],
    uf: "RS",
    idade: 72,
    sexo: "M",
    email: "fernando.ribeiro@exemplo.com.br",
    telefone: "(51) 99887-4402",
  },
  {
    cpf: "093.518.274-60",
    nome: "Carla Mendes de Souza",
    planos: [{ sigla: "PBB", inscricao: "08/05/2012", situacao: "Ativo" }],
    uf: "DF",
    idade: 44,
    sexo: "F",
    email: "carla.souza@exemplo.com.br",
    telefone: "(61) 99741-2680",
  },
  {
    cpf: "127.684.350-19",
    nome: "Paulo Henrique Moraes",
    planos: [{ sigla: "PBDC", inscricao: "17/10/1991", situacao: "Assistido" }],
    uf: "SP",
    idade: 66,
    sexo: "M",
    email: "paulo.moraes@exemplo.com.br",
    telefone: "(11) 99358-1742",
  },
  {
    cpf: "158.239.706-84",
    nome: "Juliana Campos Freire",
    planos: [{ sigla: "CENTRUSPREV+", inscricao: "21/08/2018", situacao: "Ativo" }],
    uf: "MG",
    idade: 36,
    sexo: "F",
    email: "juliana.freire@exemplo.com.br",
    telefone: "(31) 99147-6358",
  },
  {
    cpf: "206.971.485-32",
    nome: "Ricardo Tavares Lopes",
    planos: [
      { sigla: "PBDC", inscricao: "14/04/1994", situacao: "Assistido" },
      { sigla: "PGA", inscricao: "09/01/2008", situacao: "Assistido" },
    ],
    uf: "RJ",
    idade: 63,
    sexo: "M",
    email: "ricardo.lopes@exemplo.com.br",
    telefone: "(21) 99520-3814",
  },
  {
    cpf: "274.603.918-57",
    nome: "Patrícia Azevedo Martins",
    planos: [{ sigla: "PGA", inscricao: "03/06/2016", situacao: "Ativo" }],
    uf: "PR",
    idade: 41,
    sexo: "F",
    email: "patricia.martins@exemplo.com.br",
    telefone: "(41) 99835-7406",
  },
  {
    cpf: "318.750.264-09",
    nome: "Eduardo Nascimento Barros",
    planos: [{ sigla: "PCD", inscricao: "25/09/2010", situacao: "Autopatrocinado" }],
    uf: "RS",
    idade: 52,
    sexo: "M",
    email: "eduardo.barros@exemplo.com.br",
    telefone: "(51) 99462-8157",
  },
  {
    cpf: "347.186.529-73",
    nome: "Renata Duarte Cavalcanti",
    planos: [{ sigla: "CENTRUSPREV+", inscricao: "11/02/2020", situacao: "Ativo" }],
    uf: "PE",
    idade: 33,
    sexo: "F",
    email: "renata.cavalcanti@exemplo.com.br",
    telefone: "(81) 99681-4325",
  },
  {
    cpf: "386.294.715-48",
    nome: "Marcelo Vieira Sampaio",
    planos: [{ sigla: "PBB", inscricao: "19/07/2005", situacao: "Ativo" }],
    uf: "BA",
    idade: 49,
    sexo: "M",
    email: "marcelo.sampaio@exemplo.com.br",
    telefone: "(71) 99136-5290",
  },
  {
    cpf: "429.805.176-26",
    nome: "Larissa Rocha Albuquerque",
    planos: [
      { sigla: "CENTRUSPREV+", inscricao: "16/03/2017", situacao: "Ativo" },
      { sigla: "PCD", inscricao: "08/11/2021", situacao: "Ativo" },
    ],
    uf: "CE",
    idade: 38,
    sexo: "F",
    email: "larissa.albuquerque@exemplo.com.br",
    telefone: "(85) 99705-2486",
  },
  {
    cpf: "463.179.280-95",
    nome: "André Luiz Pinheiro",
    planos: [{ sigla: "PBDC", inscricao: "28/01/1987", situacao: "Assistido" }],
    uf: "DF",
    idade: 70,
    sexo: "M",
    email: "andre.pinheiro@exemplo.com.br",
    telefone: "(61) 98417-9503",
  },
  {
    cpf: "509.327.641-08",
    nome: "Bianca Moreira Farias",
    planos: [{ sigla: "PGA", inscricao: "12/12/2019", situacao: "Ativo" }],
    uf: "SP",
    idade: 31,
    sexo: "F",
    email: "bianca.farias@exemplo.com.br",
    telefone: "(11) 99574-2168",
  },
  {
    cpf: "548.913.762-41",
    nome: "Gustavo Pires Monteiro",
    planos: [{ sigla: "PCD", inscricao: "04/10/2013", situacao: "Ativo" }],
    uf: "GO",
    idade: 46,
    sexo: "M",
    email: "gustavo.monteiro@exemplo.com.br",
    telefone: "(62) 99348-6701",
  },
  {
    cpf: "612.478.930-64",
    nome: "Vanessa Ribeiro Costa",
    planos: [{ sigla: "PBB", inscricao: "15/04/2007", situacao: "Autopatrocinado" }],
    uf: "ES",
    idade: 54,
    sexo: "F",
    email: "vanessa.costa@exemplo.com.br",
    telefone: "(27) 99816-4372",
  },
  {
    cpf: "658.042.197-30",
    nome: "Leonardo Farias Queiroz",
    planos: [{ sigla: "CENTRUSPREV+", inscricao: "09/09/2015", situacao: "Ativo" }],
    uf: "SC",
    idade: 43,
    sexo: "M",
    email: "leonardo.queiroz@exemplo.com.br",
    telefone: "(48) 99642-5809",
  },
  {
    cpf: "703.156.824-97",
    nome: "Mônica Teixeira Ramos",
    planos: [{ sigla: "PBDC", inscricao: "22/06/1990", situacao: "Assistido" }],
    uf: "RJ",
    idade: 67,
    sexo: "F",
    email: "monica.ramos@exemplo.com.br",
    telefone: "(21) 98735-6194",
  },
  {
    cpf: "746.289.503-16",
    nome: "Thiago César Brito",
    planos: [
      { sigla: "PGA", inscricao: "30/01/2011", situacao: "Ativo" },
      { sigla: "CENTRUSPREV+", inscricao: "07/08/2019", situacao: "Ativo" },
    ],
    uf: "DF",
    idade: 45,
    sexo: "M",
    email: "thiago.brito@exemplo.com.br",
    telefone: "(61) 99207-8541",
  },
  {
    cpf: "805.617.294-38",
    nome: "Camila Oliveira Leal",
    planos: [{ sigla: "PCD", inscricao: "13/05/2022", situacao: "Ativo" }],
    uf: "MA",
    idade: 29,
    sexo: "F",
    email: "camila.leal@exemplo.com.br",
    telefone: "(98) 99654-3708",
  },
  {
    cpf: "849.360.725-51",
    nome: "Sérgio Augusto Lima",
    planos: [{ sigla: "PBB", inscricao: "27/11/1999", situacao: "Assistido" }],
    uf: "MG",
    idade: 62,
    sexo: "M",
    email: "sergio.lima@exemplo.com.br",
    telefone: "(31) 98847-1026",
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
    plano: "CENTRUSPREV+",
  },
  {
    nome: "Helena Nunes de Almeida",
    cpf: "118.446.702-31",
    titular: "Roberto Nunes de Almeida",
    cpfTitular: "225.771.008-44",
    parentesco: "Cônjuge",
    idade: 65,
    plano: "PBDC",
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
    plano: "PBB",
  },
  {
    nome: "Otávio Furtado Lima",
    cpf: "641.209.773-52",
    titular: "Beatriz Furtado Lima",
    cpfTitular: "556.903.114-28",
    parentesco: "Cônjuge",
    idade: 64,
    plano: "CENTRUSPREV+",
  },
  {
    nome: "Sofia Cabral Ribeiro",
    cpf: "883.550.226-14",
    titular: "Fernando Cabral Ribeiro",
    cpfTitular: "671.220.845-13",
    parentesco: "Filho(a)",
    idade: 33,
    plano: "PBDC",
  },
];

export const nf = new Intl.NumberFormat("pt-BR");

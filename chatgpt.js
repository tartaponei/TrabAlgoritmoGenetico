// Definição dos parâmetros do algoritmo genético
const TAMANHO_POPULACAO = 50; // Tamanho da população
const TAXA_MUTACAO = 0.1; // Taxa de mutação
const NUMERO_GERACOES = 100; // Número de gerações

// Definição dos dados do problema
const PESOS = [2, 3, 4, 5]; // Pesos dos itens
const VALORES = [3, 4, 5, 6]; // Valores dos itens
const CAPACIDADE_MOCHILA = 8; // Capacidade máxima de peso da mochila

// Função para criar um indivíduo aleatório
function criarIndividuo() {
  const individuo = [];
  for (let i = 0; i < PESOS.length; i++) {
    individuo.push(Math.random() < 0.5 ? 0 : 1);
  }
  console.log(individuo);
  return individuo;
}

// Função para calcular o valor total de um indivíduo
function calcularValor(individuo) {
  let valorTotal = 0;
  let pesoTotal = 0;
  for (let i = 0; i < individuo.length; i++) {
    if (individuo[i] === 1) {
      valorTotal += VALORES[i];
      pesoTotal += PESOS[i];
    }
  }
  if (pesoTotal > CAPACIDADE_MOCHILA) {
    return 0; // Retorna 0 se o peso total exceder a capacidade da mochila
  }
  return valorTotal;
}

// Função para selecionar indivíduos para reprodução (roleta viciada)
function selecionarIndividuos(populacao) {
  const valoresFitness = populacao.map(calcularValor);
  const somaFitness = valoresFitness.reduce((a, b) => a + b, 0);
  const probabilidades = valoresFitness.map((valor) => valor / somaFitness);
  const selecionados = [];
  for (let i = 0; i < TAMANHO_POPULACAO; i++) {
    let acumulador = 0;
    const rand = Math.random();
    for (let j = 0; j < populacao.length; j++) {
      acumulador += probabilidades[j];
      if (rand <= acumulador) {
        selecionados.push(populacao[j]);
        break;
      }
    }
  }
  return selecionados;
}

// Função para realizar a reprodução (crossover) entre dois indivíduos
function reproduzir(individuo1, individuo2) {
  const pontoCorte = Math.floor(Math.random() * (individuo1.length - 1)) + 1;
  const filho1 = individuo1.slice(0, pontoCorte).concat(individuo2.slice(pontoCorte));
  const filho2 = individuo2.slice(0, pontoCorte).concat(individuo1.slice(pontoCorte));
  return [filho1, filho2];
}

// Função para realizar a mutação em um indivíduo
function mutar(individuo) {
  const indiceAleatorio = Math.floor(Math.random() * individuo.length);
  individuo[indiceAleatorio] = individuo[indiceAleatorio] === 1 ? 0 : 1;
  return individuo;
}

// Função principal do algoritmo genético
function algoritmoGenetico() {
  let populacao = [];
  for (let i = 0; i < TAMANHO_POPULACAO; i++) {
    populacao.push(criarIndividuo());
  }

  for (let geracao = 0; geracao < NUMERO_GERACOES; geracao++) {
    const selecionados = selecionarIndividuos(populacao);
    const proximaGeracao = [];

    while (proximaGeracao.length < TAMANHO_POPULACAO) {
      const indicePai1 = Math.floor(Math.random() * selecionados.length);
      const indicePai2 = Math.floor(Math.random() * selecionados.length);
      const pais = [selecionados[indicePai1], selecionados[indicePai2]];

      const filhos = reproduzir(pais[0], pais[1]);

      for (let i = 0; i < filhos.length; i++) {
        if (Math.random() < TAXA_MUTACAO) {
          mutar(filhos[i]);
        }
        proximaGeracao.push(filhos[i]);
        if (proximaGeracao.length >= TAMANHO_POPULACAO) {
          break;
        }
      }
    }

    populacao = proximaGeracao;
  }

  const melhoresIndividuos = populacao.map((individuo) => ({
    individuo,
    valor: calcularValor(individuo),
  }));
  melhoresIndividuos.sort((a, b) => b.valor - a.valor);

  console.log('Melhor solução encontrada:');
  console.log('Indivíduo:', melhoresIndividuos[0].individuo);
  console.log('Valor:', melhoresIndividuos[0].valor);
  console.log('Peso total:', melhoresIndividuos[0].pesoTotal);
}

// Executar o algoritmo genético
algoritmoGenetico();

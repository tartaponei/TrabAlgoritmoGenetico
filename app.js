// Problema: carregar o máximo de carga possível no transporte via caminhão sem ultrapassar o limite de carga
// Maximizar quantidade e minimizar peso
// Obs.:
// - Os pesos são em fator de tonelada
// - Fitness é a quantidade; quanto maior, melhor
// - O resultado é um vetor contendo 0 (índice não incluso no caminhão) ou 1 (índice não incluso no caminhão)

// Constantes do problema
const PESOS = [2, 3, 4, 5, 8, 9, 10, 0.5, 1, 4.5]; // pesos dos itens em toneladas
//const VALORES = [3, 4, 5, 6]; // valores dos itens
const CAPACIDADE_MOCHILA = 18; // capacidade máxima em toneladas do caminhão

// Constantes do algoritmo
const TAMANHO_POPULACAO = 50; // tamanho da população
const TAXA_MUTACAO = 0.1; // taxa de mutação
const TAXA_CRUZAMENTO = 0.7; // taxa de cruzamento
const NUMERO_GERACOES = 100; // número de gerações

// cria um indivíduo aleatório
function criarIndividuo() {
    const individuo = [];
    for (let i = 0; i < PESOS.length; i++) {
        individuo.push(Math.random() < 0.5 ? 0 : 1); // escolhe aleatoriamente um número entre 0 e 1. se for menor que 0.5 é 0 se for maior é 1
    }
    console.log(individuo);
    return individuo;
}

// calcula o peso total de um indivíduo
function calcularQtde(individuo) {
    let pesoTotal = 0;
    let qtdeTotal = 0;

    for (let i = 0; i < individuo.length; i++) {
        if (individuo[i] === 1) {
            pesoTotal += PESOS[i];
            qtdeTotal += 1;
        }
    }
    if (pesoTotal > CAPACIDADE_MOCHILA) { return 0; }
    return qtdeTotal;
}

// seleção (roleta estocástica de escolha)
function selecionarIndividuos(populacao) {
    var valoresFitness = populacao.map(calcularQtde); // aplica calcularQtde pra cada item do array
    var somaFitness = valoresFitness.reduce((a, b) => a + b, 0); // soma todos os valores do array

    var probabSelecao = valoresFitness.map((valor) => valor / somaFitness); // calcula probabilidade de ser selecionado pea razão fitness / soma dos fitnesses
    var selecionados = [];
    
    for (let i = 0; i < TAMANHO_POPULACAO; i++) {
        let acumulador = 0;
        const marcadorRoleta = Math.random(); // número aleatório pra ficar oindicador da roleta e selecionar alguém

        for (let j = 0; j < populacao.length; j++) {
            acumulador += probabSelecao[j];

            if (marcadorRoleta <= acumulador) {
                selecionados.push(populacao[j]);
                break;
            }
        }
    }
    return selecionados;
  }

// cruzamento entre dois indivíduos
function reproduzir(individuo1, individuo2) {
    if (Math.random() < TAXA_CRUZAMENTO) {
        var pontoCorte = Math.floor(Math.random() * (individuo1.length - 1)) + 1;

        var filho1 = individuo1.slice(0, pontoCorte).concat(individuo2.slice(pontoCorte));
        var filho2 = individuo2.slice(0, pontoCorte).concat(individuo1.slice(pontoCorte));
        return [filho1, filho2];
    } 
    else { return [individuo1, individuo2]; } // senão retorna o que já tava
}

// mutação
function mutar(individuo) {
    const indiceAleatorio = Math.floor(Math.random() * individuo.length);
    individuo[indiceAleatorio] = individuo[indiceAleatorio] === 1 ? 0 : 1; // se o gene escolhido for 1 vira 0 e vice versa
    return individuo;
}
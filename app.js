// Problema: carregar o máximo de carga possível no transporte via caminhão sem ultrapassar o limite de carga
// Maximizar quantidade e minimizar peso
// Obs.:
// - Os pesos são em fator de tonelada
// - Fitness é a quantidade; quanto maior, melhor
// - O resultado é um vetor contendo 0 (índice não incluso no caminhão) ou 1 (índice não incluso no caminhão)

// constantes do problema
const PESOS = [2, 3, 4, 5, 8, 9, 10, 0.5, 1, 4.5]; // pesos dos itens em toneladas
//const VALORES = [3, 4, 5, 6]; // valores dos itens
var CAPACIDADE_CAMINHAO = 18; // capacidade máxima em toneladas do caminhão

// constantes do algoritmo
var TAM_POPULACAO = 80; // tamanho da população
var TAXA_MUTACAO = 0.1; // taxa de mutação
var TAXA_CRUZAMENTO = 0.7; // taxa de cruzamento
var NUM_GERACOES = 100; // número de gerações

function addDadosEntrada() {
    // let valorPesoMax = document.getElementById("valorPesoMax");
    let valoresPesoItens = document.getElementById("valoresPesoItens");
    let valorNumItens = document.getElementById("valorNumItens");

    // let valorTamPopulacao = document.getElementById("valorTamPopulacao");
    // let valorNumGeracoes = document.getElementById("valorNumGeracoes");
    // let valorTaxaMutacao = document.getElementById("valorTaxaMutacao");
    // let valorTaxaCruzamento = document.getElementById("valorTaxaCruzamento");

    // valorPesoMax.innerHTML = CAPACIDADE_CAMINHAO;
    valoresPesoItens.innerHTML = '[ ' + PESOS + ' ]';
    valorNumItens.innerHTML = PESOS.length;

    // valorTamPopulacao.innerHTML = TAM_POPULACAO;
    // valorNumGeracoes.innerHTML = NUM_GERACOES;
    // valorTaxaMutacao.innerHTML = TAXA_MUTACAO * 100;
    // valorTaxaCruzamento.innerHTML = TAXA_CRUZAMENTO * 100;
}

// cria um indivíduo aleatório
function criarIndividuo() {
    const individuo = [];
    for (let i = 0; i < PESOS.length; i++) {
        individuo.push(Math.random() < 0.5 ? 0 : 1); // escolhe aleatoriamente um número entre 0 e 1. se for menor que 0.5 é 0 se for maior é 1
    }
    //console.log(individuo);
    return individuo;
}

// calcula a quantidade total de um indivíduo
function calcularQtde(individuo) {
    let pesoTotal = 0;
    let qtdeTotal = 0;

    for (let i = 0; i < individuo.length; i++) {
        if (individuo[i] === 1) {
            pesoTotal += PESOS[i];
            qtdeTotal += 1;
        }
    }
    if (pesoTotal > CAPACIDADE_CAMINHAO) { return 0; }
    //console.log(qtdeTotal);
    return qtdeTotal;
}

//calcula peso
function calcularPeso(individuo) {
    let pesoTotal = 0;

    for (let i = 0; i < individuo.length; i++) {
        if (individuo[i] === 1) {
            pesoTotal += PESOS[i];
        }
    }
    if (pesoTotal > CAPACIDADE_CAMINHAO) { return 0; }
    //console.log(qtdeTotal);
    return pesoTotal;
}


// seleção (roleta estocástica de escolha)
function selecionar(populacao) {
    let valoresFitness = populacao.map(calcularQtde); // aplica calcularQtde pra cada item do array
    let somaFitness = valoresFitness.reduce((a, b) => a + b, 0); // soma todos os valores do array

    //console.log(somaFitness);

    let probabSelecao = valoresFitness.map((valor) => valor / somaFitness); // calcula probabilidade de ser selecionado pea razão fitness / soma dos fitnesses
    let selecionados = [];
    
    for (let i = 0; i < TAM_POPULACAO; i++) {
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
        let pontoCorte = Math.floor(Math.random() * (individuo1.length - 1)) + 1;

        let filho1 = individuo1.slice(0, pontoCorte).concat(individuo2.slice(pontoCorte));
        let filho2 = individuo2.slice(0, pontoCorte).concat(individuo1.slice(pontoCorte));
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

// main
function algoritmoGenetico() {
    let valorPesoMax = document.getElementById("valorPesoMax").value;
    CAPACIDADE_CAMINHAO = valorPesoMax;

    let valorNumGeracoes = document.getElementById("valorNumGeracoes").value;
    NUM_GERACOES = valorNumGeracoes;

    let valorTamPopulacao = document.getElementById("valorTamPopulacao").value;
    TAM_POPULACAO = valorTamPopulacao;

    let valorTaxaMutacao = document.getElementById("valorTaxaMutacao").value;
    TAXA_MUTACAO = valorTaxaMutacao / 100;

    let valorTaxaCruzamento = document.getElementById("valorTaxaCruzamento").value;
    TAXA_CRUZAMENTO = valorTaxaCruzamento / 100;

    let populacao = [];
    for (let i = 0; i < TAM_POPULACAO; i++) {
        populacao.push(criarIndividuo());
    }
  
    // começo das gerações
    for (let geracao = 0; geracao < NUM_GERACOES; geracao++) {
        // seleção
        const selecionados = selecionar(populacao);
        //console.log(selecionados);
        const proximaGeracao = [];
  
        while (proximaGeracao.length < TAM_POPULACAO) {
            const indicePai1 = Math.floor(Math.random() * selecionados.length);
            const indicePai2 = Math.floor(Math.random() * selecionados.length);

            const pais = [selecionados[indicePai1], selecionados[indicePai2]];
    
            // cruzamento de  2 aleatórios
            const filhos = reproduzir(pais[0], pais[1]);
    
            for (let i = 0; i < filhos.length; i++) {
                // mutação dos filhos gerados no cruzamento
                if (Math.random() < TAXA_MUTACAO) {
                    mutar(filhos[i]);
                }

                proximaGeracao.push(filhos[i]);

                if (proximaGeracao.length >= TAM_POPULACAO) {
                    break;
                }
            }
        }
  
        populacao = proximaGeracao;
    }
  
    const melhoresIndividuos = populacao.map((individuo) => ({
        individuo,
        qtdeTotal: calcularQtde(individuo),
        pesoTotal: calcularPeso(individuo)
    }));
    melhoresIndividuos.sort((a, b) => b.qtdeTotal - a.qtdeTotal);

    let resultado = document.getElementById("resultado");
    
    resultado.style.display = 'block';

    resultado.innerHTML = `
        <h2>Melhor solução encontrada:</h2>
        <p>Indivíduo: [ 
    ` + melhoresIndividuos[0].individuo + ` ]</p>
        <p> Peso total da carga no caminhão:
    ` + melhoresIndividuos[0].pesoTotal + `t </p>
        <p> Quantidade de itens no caminhão:
    ` + melhoresIndividuos[0].qtdeTotal + ` itens </p>`;
  
    console.log('Melhor solução encontrada:');
    console.log('Indivíduo:', melhoresIndividuos[0].individuo);
    console.log('Peso da carga:', melhoresIndividuos[0].pesoTotal, ', da máxima de', CAPACIDADE_CAMINHAO);
    console.log('Quantidade de itens:', melhoresIndividuos[0].qtdeTotal, ', da máxima de', PESOS.length);
}

//algoritmoGenetico();
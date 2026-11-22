const palavras = [
    {
        resposta: "FLASH",
        linha: 6,
        coluna: 4,
        direcao: "H",
        pista: "Memória não volátil utilizada em cartões e unidades USB."
    },
    {
        resposta: "DUALCORE",
        linha: 3,
        coluna: 5,
        direcao: "V",
        pista: "Processador que possui dois núcleos de processamento."
    },
    {
        resposta: "REGISTRADORES",
        linha: 2,
        coluna: 7,
        direcao: "V",
        pista: "Pequenas áreas internas que armazenam dados durante o processamento."
    },
    {
        resposta: "CPU",
        linha: 4,
        coluna: 3,
        direcao: "H",
        pista: "Componente que executa instruções e coordena operações do computador."
    },
    {
        resposta: "ULA",
        linha: 4,
        coluna: 6,
        direcao: "V",
        pista: "Parte que realiza cálculos e operações lógicas."
    },
    {
        resposta: "EEPROM",
        linha: 11,
        coluna: 3,
        direcao: "H",
        pista: "Memória não volátil que pode ser apagada e reprogramada eletricamente."
    },
    {
        resposta: "CACHE",
        linha: 4,
        coluna: 3,
        direcao: "V",
        pista: "Memória rápida que guarda dados frequentemente acessados pelo processador."
    },
    {
        resposta: "ROM",
        linha: 11,
        coluna: 6,
        direcao: "V",
        pista: "Memória que conserva informações mesmo sem alimentação elétrica."
    },
    {
        resposta: "DATABUS",
        linha: 14,
        coluna: 1,
        direcao: "H",
        pista: "Conjunto de linhas responsável pelo transporte de informações entre componentes."
    },
    {
        resposta: "RAM",
        linha: 9,
        coluna: 6,
        direcao: "H",
        pista: "Memória temporária utilizada pelos programas em execução."
    },
    {
        resposta: "MEMORIADEMASSA",
        linha: 1,
        coluna: 2,
        direcao: "V",
        pista: "Meio utilizado para guardar arquivos e programas de forma persistente."
    },
    {
        resposta: "ADDRESSBUS",
        linha: 12,
        coluna: 1,
        direcao: "V",
        pista: "Conjunto de linhas que indica a localização dos dados na memória."
    }
];

let linhas = 0;
let colunas = 0;

const tabuleiro = document.getElementById("tabuleiro");
const horizontais = document.getElementById("horizontais");
const verticais = document.getElementById("verticais");

const casas = {};
const numeros = {};

function obterPosicao(palavra, indice) {

    let linha = palavra.linha;
    let coluna = palavra.coluna;

    if (palavra.direcao === "H") {
        coluna += indice;
    } else {
        linha += indice;
    }

    return { linha, coluna };
}

// Define a numeração das palavras
function numerarPalavras() {

    const posicoes = new Map();

    palavras.forEach(palavra => {

        const chave = `${palavra.linha}-${palavra.coluna}`;

        if (!posicoes.has(chave)) {
            posicoes.set(chave, posicoes.size + 1);
        }

        palavra.numero = posicoes.get(chave);

    });

}

// Cria as casas do tabuleiro
function criarTabuleiro() {

    palavras.forEach(palavra => {

        for (let i = 0; i < palavra.resposta.length; i++) {

            const posicao = obterPosicao(palavra, i);

            const chave = `${posicao.linha}-${posicao.coluna}`;

            const letra = palavra.resposta[i];

            casas[chave] = letra;

            linhas = Math.max(linhas, posicao.linha);
            colunas = Math.max(colunas, posicao.coluna);

        }

        const chaveInicial = `${palavra.linha}-${palavra.coluna}`;

        numeros[chaveInicial] = palavra.numero;

    });

    tabuleiro.style.gridTemplateColumns =
        `repeat(${colunas}, 32px)`;

    tabuleiro.innerHTML = "";

    for (let linha = 1; linha <= linhas; linha++) {

        for (let coluna = 1; coluna <= colunas; coluna++) {

            const chave = `${linha}-${coluna}`;

            const casa = document.createElement("div");

            if (casas[chave]) {

                casa.classList.add("casa");

                const input = document.createElement("input");

                input.type = "text";
                input.maxLength = 1;
                input.id = chave;
                input.autocomplete = "off";

                input.addEventListener("input", function () {

                    this.value = this.value
                        .toUpperCase()
                        .replace(/[^A-Z]/g, "");

                });

                casa.appendChild(input);

                if (numeros[chave]) {

                    const numero = document.createElement("span");

                    numero.classList.add("numero");
                    numero.textContent = numeros[chave];

                    casa.appendChild(numero);

                }

            } else {

                casa.classList.add("vazia");

            }

            tabuleiro.appendChild(casa);

        }
    }
}

// Cria as pistas horizontais e verticais
function criarPistas() {

    palavras.forEach(palavra => {

        const item = document.createElement("li");

        item.value = palavra.numero;

        item.textContent = palavra.pista;

        item.addEventListener("click", function () {

            const primeiraCasa = obterPosicao(palavra, 0);

            const chave =
                `${primeiraCasa.linha}-${primeiraCasa.coluna}`;

            document.getElementById(chave).focus();

        });

        if (palavra.direcao === "H") {
            horizontais.appendChild(item);
        } else {
            verticais.appendChild(item);
        }

    });

}

// Inicializa o jogo
numerarPalavras();
criarTabuleiro();
criarPistas();

function conferirRespostas() {
    let acertos = 0;

    palavras.forEach(palavra => {
        let respostaJogador = "";

        for (let i = 0; i < palavra.resposta.length; i++) {
            const posicao = obterPosicao(palavra, i);
            const campo = document.getElementById(posicao);

            respostaJogador += campo.value.toUpperCase();
        }

        const correta = respostaJogador === palavra.resposta;

        for (let i = 0; i < palavra.resposta.length; i++) {
            const posicao = obterPosicao(palavra, i);
            const campo = document.getElementById(posicao);

            campo.classList.remove("correta", "incorreta");

            if (correta) {
                campo.classList.add("correta");
            } else {
                campo.classList.add("incorreta");
            }
        }

        if (correta) {
            acertos++;
        }
    });

    document.getElementById("resultado").textContent =
        `Acertos: ${acertos} de ${palavras.length}`;
}

document.getElementById("btn-conferir")
    .addEventListener("click", conferirRespostas);
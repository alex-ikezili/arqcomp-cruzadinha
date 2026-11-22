const palavras = [
    {
        resposta: "FLASH",
        linha: 13,
        coluna: 2,
        direcao: "H",
        pista: "Memória não volátil utilizada em cartões e unidades USB."
    },
    {
        resposta: "DUALCORE",
        linha: 7,
        coluna: 8,
        direcao: "V",
        pista: "Processador que possui dois núcleos de processamento."
    },
    {
        resposta: "REGISTRADORES",
        linha: 1,
        coluna: 5,
        direcao: "V",
        pista: "Pequenas áreas internas que armazenam dados durante o processamento."
    },
    {
        resposta: "CPU",
        linha: 5,
        coluna: 12,
        direcao: "H",
        pista: "Componente que executa instruções e coordena operações do computador."
    },
    {
        resposta: "ULA",
        linha: 5,
        coluna: 14,
        direcao: "V",
        pista: "Parte que realiza cálculos e operações lógicas."
    },
    {
        resposta: "EEPROM",
        linha: 6,
        coluna: 2,
        direcao: "V",
        pista: "Memória não volátil que pode ser apagada e reprogramada eletricamente."
    },
    {
        resposta: "CACHE",
        linha: 1,
        coluna: 1,
        direcao: "V",
        pista: "Memória rápida que guarda dados frequentemente acessados pelo processador."
    },
    {
        resposta: "ROM",
        linha: 10,
        coluna: 4,
        direcao: "H",
        pista: "Memória que conserva informações mesmo sem alimentação elétrica."
    },
    {
        resposta: "DATABUS",
        linha: 9,
        coluna: 7,
        direcao: "H",
        pista: "Conjunto de linhas responsável pelo transporte de informações entre componentes."
    },
    {
        resposta: "RAM",
        linha: 5,
        coluna: 10,
        direcao: "V",
        pista: "Memória volátil usada para guardar dados enquanto o sistema está ligado."
    },
    {
        resposta: "MEMORIADEMASSA",
        linha: 7,
        coluna: 1,
        direcao: "H",
        pista: "Meio utilizado para guardar arquivos e programas de forma persistente."
    },
    {
        resposta: "ADDRESSBUS",
        linha: 2,
        coluna: 1,
        direcao: "H",
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
const palavrasPorCasa = {};

let chavesOrdenadas = [];
let palavraAtivaIndice = null;
let orientacaoAtiva = "H";

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

function chaveDaPosicao(linha, coluna) {
    return `${linha}-${coluna}`;
}

function chaveParaPosicao(chave) {
    const [linha, coluna] = chave.split("-").map(Number);
    return { linha, coluna };
}

function focarCasa(chave) {
    const campo = document.getElementById(chave);

    if (campo) {
        campo.focus();
        campo.select();
    }
}

function ativarPalavra(indicePalavra) {
    palavraAtivaIndice = indicePalavra;
    orientacaoAtiva = palavras[indicePalavra].direcao;
}

function ativarPalavraPelaCasa(chave, direcaoPreferida = orientacaoAtiva) {
    const opcoes = palavrasPorCasa[chave] || [];

    if (opcoes.length === 0) {
        return;
    }

    let escolhida = opcoes.find(opcao => opcao.direcao === direcaoPreferida);

    if (!escolhida && palavraAtivaIndice !== null) {
        escolhida = opcoes.find(opcao => opcao.indicePalavra === palavraAtivaIndice);
    }

    if (!escolhida) {
        escolhida = opcoes[0];
    }

    palavraAtivaIndice = escolhida.indicePalavra;
    orientacaoAtiva = escolhida.direcao;
}

function obterEntradaAtivaDaCasa(chave) {
    const opcoes = palavrasPorCasa[chave] || [];

    let entrada = opcoes.find(opcao => (
        opcao.indicePalavra === palavraAtivaIndice
        && opcao.direcao === orientacaoAtiva
    ));

    if (!entrada) {
        ativarPalavraPelaCasa(chave);
        entrada = (palavrasPorCasa[chave] || []).find(opcao => (
            opcao.indicePalavra === palavraAtivaIndice
            && opcao.direcao === orientacaoAtiva
        ));
    }

    return entrada || null;
}

function focarNaPalavra(chaveAtual, deslocamento) {
    const entrada = obterEntradaAtivaDaCasa(chaveAtual);

    if (!entrada) {
        return;
    }

    const palavra = palavras[entrada.indicePalavra];
    const proximoIndice = entrada.indiceLetra + deslocamento;

    if (proximoIndice < 0 || proximoIndice >= palavra.resposta.length) {
        return;
    }

    const proximaPosicao = obterPosicao(palavra, proximoIndice);
    const proximaChave = chaveDaPosicao(proximaPosicao.linha, proximaPosicao.coluna);

    focarCasa(proximaChave);
}

function numerarPalavras() {
    const posicoes = new Map();

    palavras.forEach(palavra => {
        const chave = chaveDaPosicao(palavra.linha, palavra.coluna);

        if (!posicoes.has(chave)) {
            posicoes.set(chave, posicoes.size + 1);
        }

        palavra.numero = posicoes.get(chave);
    });
}

function criarTabuleiro() {
    palavras.forEach((palavra, indicePalavra) => {
        for (let i = 0; i < palavra.resposta.length; i++) {
            const posicao = obterPosicao(palavra, i);
            const chave = chaveDaPosicao(posicao.linha, posicao.coluna);
            const letra = palavra.resposta[i];

            casas[chave] = letra;

            if (!palavrasPorCasa[chave]) {
                palavrasPorCasa[chave] = [];
            }

            palavrasPorCasa[chave].push({
                indicePalavra,
                indiceLetra: i,
                direcao: palavra.direcao
            });

            linhas = Math.max(linhas, posicao.linha);
            colunas = Math.max(colunas, posicao.coluna);
        }

        const chaveInicial = chaveDaPosicao(palavra.linha, palavra.coluna);
        numeros[chaveInicial] = palavra.numero;
    });

    chavesOrdenadas = Object.keys(casas).sort((a, b) => {
        const posA = chaveParaPosicao(a);
        const posB = chaveParaPosicao(b);

        if (posA.linha === posB.linha) {
            return posA.coluna - posB.coluna;
        }

        return posA.linha - posB.linha;
    });

    tabuleiro.style.gridTemplateColumns = `repeat(${colunas}, var(--cell-size))`;
    tabuleiro.innerHTML = "";

    for (let linha = 1; linha <= linhas; linha++) {
        for (let coluna = 1; coluna <= colunas; coluna++) {
            const chave = chaveDaPosicao(linha, coluna);
            const casa = document.createElement("div");

            if (casas[chave]) {
                casa.classList.add("casa");

                const input = document.createElement("input");
                input.type = "text";
                input.maxLength = 1;
                input.id = chave;
                input.autocomplete = "off";

                input.addEventListener("focus", () => {
                    ativarPalavraPelaCasa(chave);
                });

                input.addEventListener("click", () => {
                    ativarPalavraPelaCasa(chave);
                });

                input.addEventListener("input", function () {
                    this.value = this.value.toUpperCase().replace(/[^A-Z]/g, "");
                    this.classList.remove("correta", "incorreta");

                    if (this.value) {
                        focarNaPalavra(chave, 1);
                    }
                });

                input.addEventListener("keydown", function (event) {
                    if (event.key === "Backspace" && this.value === "") {
                        event.preventDefault();
                        focarNaPalavra(chave, -1);
                        return;
                    }

                    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
                        event.preventDefault();
                        ativarPalavraPelaCasa(chave, "H");
                        focarNaPalavra(chave, event.key === "ArrowRight" ? 1 : -1);
                        return;
                    }

                    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
                        event.preventDefault();
                        ativarPalavraPelaCasa(chave, "V");
                        focarNaPalavra(chave, event.key === "ArrowDown" ? 1 : -1);
                    }
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

function criarPistas() {
    palavras.forEach((palavra, indicePalavra) => {
        const item = document.createElement("li");
        item.classList.add("pista-item");
        item.value = palavra.numero;
        item.textContent = palavra.pista;
        palavra.elementoPista = item;

        item.addEventListener("click", () => {
            ativarPalavra(indicePalavra);

            const primeiraCasa = obterPosicao(palavra, 0);
            const chave = chaveDaPosicao(primeiraCasa.linha, primeiraCasa.coluna);
            focarCasa(chave);
        });

        if (palavra.direcao === "H") {
            horizontais.appendChild(item);
        } else {
            verticais.appendChild(item);
        }
    });
}

function conferirRespostas() {
    let acertos = 0;
    const estadoCasas = {};

    palavras.forEach(palavra => {
        let respostaJogador = "";

        for (let i = 0; i < palavra.resposta.length; i++) {
            const posicao = obterPosicao(palavra, i);
            const chave = chaveDaPosicao(posicao.linha, posicao.coluna);
            const campo = document.getElementById(chave);

            respostaJogador += campo.value.toUpperCase();
        }

        const correta = respostaJogador === palavra.resposta;

        if (palavra.elementoPista) {
            palavra.elementoPista.classList.remove("pista-correta", "pista-incorreta");
            palavra.elementoPista.classList.add(correta ? "pista-correta" : "pista-incorreta");
        }

        for (let i = 0; i < palavra.resposta.length; i++) {
            const posicao = obterPosicao(palavra, i);
            const chave = chaveDaPosicao(posicao.linha, posicao.coluna);

            if (!estadoCasas[chave]) {
                estadoCasas[chave] = [];
            }

            estadoCasas[chave].push(correta);
        }

        if (correta) {
            acertos++;
        }
    });

    Object.keys(casas).forEach(chave => {
        const campo = document.getElementById(chave);
        const status = estadoCasas[chave] || [];

        campo.classList.remove("correta", "incorreta");

        if (status.length === 0) {
            return;
        }

        const todasCorretas = status.every(valor => valor);
        campo.classList.add(todasCorretas ? "correta" : "incorreta");
    });

    document.getElementById("resultado").textContent = `Acertos: ${acertos} de ${palavras.length}`;
}

function reiniciarJogo() {
    Object.keys(casas).forEach(chave => {
        const campo = document.getElementById(chave);
        campo.value = "";
        campo.classList.remove("correta", "incorreta");
    });

    palavras.forEach(palavra => {
        if (palavra.elementoPista) {
            palavra.elementoPista.classList.remove("pista-correta", "pista-incorreta");
        }
    });

    document.getElementById("resultado").textContent = `Acertos: 0 de ${palavras.length}`;

    if (chavesOrdenadas.length > 0) {
        focarCasa(chavesOrdenadas[0]);
    }
}

numerarPalavras();
criarTabuleiro();
criarPistas();

document.getElementById("btn-conferir").addEventListener("click", conferirRespostas);
document.getElementById("btn-reiniciar").addEventListener("click", reiniciarJogo);

if (chavesOrdenadas.length > 0) {
    focarCasa(chavesOrdenadas[0]);
}

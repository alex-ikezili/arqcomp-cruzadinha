
const palavras = [
    { resposta: "FLASH", linha: 6, coluna: 4, direcao: "H" },
    { resposta: "DUALCORE", linha: 3, coluna: 5, direcao: "V" },
    { resposta: "REGISTRADORES", linha: 2, coluna: 7, direcao: "V" },
    { resposta: "CPU", linha: 4, coluna: 3, direcao: "H" },
    { resposta: "ULA", linha: 4, coluna: 6, direcao: "V" },
    { resposta: "EEPROM", linha: 11, coluna: 3, direcao: "H" },
    { resposta: "CACHE", linha: 4, coluna: 3, direcao: "V" },
    { resposta: "ROM", linha: 11, coluna: 6, direcao: "V" },
    { resposta: "DATABUS", linha: 14, coluna: 1, direcao: "H" },
    { resposta: "RAM", linha: 9, coluna: 6, direcao: "H" },
    { resposta: "MEMORIADEMASSA", linha: 1, coluna: 2, direcao: "V" },
    { resposta: "ADDRESSBUS", linha: 12, coluna: 1, direcao: "V" }
];

// Calcula automaticamente o tamanho necessário
let linhas = 0;
let colunas = 0;

// Armazena as letras e suas posições
const casas = {};

function criarTabuleiro() {

    palavras.forEach(palavra => {

        for (let i = 0; i < palavra.resposta.length; i++) {

            let linha = palavra.linha;
            let coluna = palavra.coluna;

            if (palavra.direcao === "H") {
                coluna += i;
            } else {
                linha += i;
            }

            const chave = `${linha}-${coluna}`;
            const letra = palavra.resposta[i];

            // Verifica conflitos entre letras
            if (casas[chave] && casas[chave] !== letra) {
                console.error("Conflito na posição:", chave);
                return;
            }

            casas[chave] = letra;

            // Identifica as dimensões necessárias
            linhas = Math.max(linhas, linha);
            colunas = Math.max(colunas, coluna);
        }
    });

    const tabuleiro = document.getElementById("tabuleiro");

    // Define a quantidade de colunas do CSS
    tabuleiro.style.gridTemplateColumns =
        `repeat(${colunas}, 32px)`;

    tabuleiro.innerHTML = "";

    for (let linha = 1; linha <= linhas; linha++) {

        for (let coluna = 1; coluna <= colunas; coluna++) {

            const chave = `${linha}-${coluna}`;
            const casa = document.createElement("div");

            if (casas[chave]) {

                casa.classList.add("casa");
                casa.textContent = casas[chave];

            } else {

                casa.classList.add("vazia");

            }

            tabuleiro.appendChild(casa);
        }
    }
}

criarTabuleiro();

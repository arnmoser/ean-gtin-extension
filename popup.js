// popup.js
// Lógica principal do Gerador EAN GTIN

const generateBtn = document.getElementById('generateBtn');
const copyBtn = document.getElementById('copyBtn');
const resultsDiv = document.getElementById('results');
let codigoAtual = '';

generateBtn.addEventListener('click', function () {
    const tipo = parseInt(document.getElementById('gtinType').value);
    const prefixo = document.getElementById('prefixInput').value;

    console.log("Botão clicado!", tipo, prefixo);

    const codigo = gerarEAN(tipo, prefixo);
    if(!codigo) {
        resultsDiv.textContent = "Prefixo Inválido para o Tipo Escolhido";
        copyBtn.disabled = true;
        return;
    }
    codigoAtual = codigo;

    resultsDiv.innerHTML = ''; // Limpa o que estava escrito antes


    console.log("Código gerado:", codigo);

    const p = document.createElement('p');
    p.textContent = codigo;
    resultsDiv.appendChild(p);

    copyBtn.textContent = "Copiar Código"; //reseta texto do botão
    copyBtn.disabled = false;

    p.addEventListener('click', function () {
        copiarParaClipboard(codigo);
    });
});

//evento do botão de copiar
copyBtn.addEventListener('click', function () {
  if(!codigoAtual) return;
    copiarParaClipboard(codigoAtual);
});

// Função para copiar

function copiarParaClipboard(texto) {
    navigator.clipboard.writeText(texto)
        .then(() => {
            console.log("Código copiado:", texto);
            copyBtn.textContent = "Copiado!";
            setTimeout(() => copyBtn.textContent = "Copiar Código", 2000);
        })
        .catch(err => console.error("Erro ao copiar:", err));
}





// Função Geradora de códigos EAN

function gerarEAN(tipo, prefixo) {

    // 1 - Calcular quantos digitos faltam com base no tipo e prefixo
    let digitosNecessarios = tipo - 1 - prefixo.length;
    if (digitosNecessarios <= 0) {
        console.error("Prefixo longo demais para o tipo de GTIN escolhido");
        return null;
    }

    // 2 - Gerar Números aleatórios para preencher
    function gerarNumeroAleatorio() {

        const minimo = Math.pow(10, digitosNecessarios - 1);
        const maximo = Math.pow(10, digitosNecessarios) - 1;

        const numero = Math.floor(Math.random() * (maximo - minimo + 1)) + minimo;

        return numero.toString().padStart(digitosNecessarios, '0');
    }
    // 3 - Calcular o digito verificador com o algoritmo EAN
    function calcularDigitoVerificador(base) {
        // 1 - Converter em array de digitos numéricos
        const digitos = base.split('').map(Number);
        // 2 - inverter a ordem
        digitos.reverse();
        // 3 - Aplicar pesos: 3 para posições pares, 1 para impares
        let soma = 0;
        for (let i = 0; i < digitos.length; i++) {
            const peso = (i % 2 === 0) ? 3 : 1;
            soma += digitos[i] * peso;
        }

        // 4 - calcular o próximos múltiplo de 10
        const proximoMultiplo = Math.ceil(soma / 10) * 10;

        // 5 - O digito Verificador é a diferença
        let verificador = proximoMultiplo - soma;

        // 6 - Se der 10, o digito é 0
        if (verificador === 10) verificador = 0;

        return verificador;
    }


    // 4 - Concatenar prefixo + parte aleatório + digito verificador
    const parteAleatoria = gerarNumeroAleatorio();
    const base = prefixo + parteAleatoria;
    const verificador = calcularDigitoVerificador(base);
    const codigoCompleto = base + verificador;

    return codigoCompleto;
}


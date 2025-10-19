// popup.js
// Lógica principal do Gerador EAN GTIN
import { gerarEAN } from './generator.js';
import { copiarParaClipboard } from './utils.js';

const generateBtn = document.getElementById('generateBtn');
const copyBtn = document.getElementById('copyBtn');
const resultsDiv = document.getElementById('results');
let codigoAtual = '';

generateBtn.addEventListener('click', function () {
    const tipo = parseInt(document.getElementById('gtinType').value);
    const prefixo = document.getElementById('prefixInput').value;

    const codigo = gerarEAN(tipo, prefixo);

    if(!codigo) {
        resultsDiv.textContent = "Prefixo inválido para o tipo escolhido";
        copyBtn.disable = true;
        return;
    }

        codigoAtual = codigo;
        mostrarCodigo(codigo);
        copyBtn.disabled = false;
        copyBtn.textContent = 'Copiar Código';
});
     
//evento do botão de copiar
copyBtn.addEventListener('click', function () {
  if(!codigoAtual) return;
    copiarParaClipboard(codigoAtual)
    .then(() => {
        copyBtn.textContent = 'Copiado!';
        setTimeout(() => (copyBtn.textContent = 'Copiar Código'), 2000);
        })
        .catch((err) => console.error('Erro ao copiar:', err));
});

// Função que atualiza a UI com o código gerado

function mostrarCodigo(codigo) {
    resultsDiv.innerHTML = '';
    const p = document.createElement('p');
    p.className = 'result-item';
    p.textContent = codigo;
    p.title = 'Clique para copiar';
    p.style.cursor = 'pointer';
    resultsDiv.appendChild(p);

    p.addEventListener('click', () => {
        copiarParaClipboard(codigo);
        copyBtn.textContent = 'Copiado!';
        setTimeout(() => (copyBtn.textContent = 'Copiar Código'), 2000);
    })
}


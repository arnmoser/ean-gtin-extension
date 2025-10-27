// popup.js
// Lógica principal do Gerador EAN GTIN
import { gerarEAN } from './generator.js';
import { copiarParaClipboard } from './utils.js';

const generateBtn = document.getElementById('generateBtn');
const copyBtn = document.getElementById('copyBtn');
const resultsDiv = document.getElementById('results');

const multiCheck = document.getElementById('multiCheck');
const multiOptions = document.getElementById('multiOptions');
const quantityInput = document.getElementById('quantityInput');
const downloadCsvBtn = document.getElementById('downloadCsvBtn');


let codigosAtuais = [];
let gerando = false;

function renderCodes(codes) {
    resultsDiv.innerHTML = '';
    const frag = document.createDocumentFragment();

    codes.forEach((codigo) => {
        const p = document.createElement('p');
        p.className = 'result-item';
        p.textContent = codigo;
        p.title = 'Clique para copiar esse código';
        p.addEventListener('click', () => copiarParaClipboard(codigo));
        frag.appendChild(p);
    });
    resultsDiv.appendChild(frag);
};


multiCheck.addEventListener('change',()=>{
    if(multiCheck.checked) {
        multiOptions.style.display = 'block';
    } else {
        multiOptions.style.display = 'none';
        downloadCsvBtn.style.display = 'none';
    }
});


// função que  desabilita ou habilita inputs durante geração
function setUiDisabled(disabled) {
    generateBtn.disabled = disabled;
    copyBtn.disabled = disabled || (codigosAtuais.length === 0);
    quantityInput.disabled = disabled;
    multiCheck.disabled = disabled;
}

generateBtn.addEventListener('click', async ()=>{
    if(gerando) return;
    gerando = true;
    setUiDisabled(true);
    resultsDiv.textContent = '';

    const tipo = parseInt(document.getElementById('gtinType').value, 10);
    if(Number.isNaN(tipo)){
        resultsDiv.textContent = 'Tipo inválido.';
        gerando = false;
        setUiDisabled(false);
        return;
    }
    
    const prefixo = document.getElementById('prefixInput').value.trim();

    // validação local antes de chamar generator
    if(!/^\d*$/.test(prefixo)){
        resultsDiv.textContent = 'Prefixo inválido - digite apenas digitos'
        copyBtn.disabled = true;
        gerando = false;
        setUiDisabled(false);
        return;
    }

   
    // Decisão para gerar um OU vários
    let qty = 1;
    if(multiCheck && multiCheck.checked) {
        const max = parseInt(quantityInput.max, 10) || 100;
        qty = parseInt(quantityInput.value, 10) || 1;
        if (qty < 1) qty= 1;
        if (qty > max) qty = max;
    }

    // gerar N códigos

    codigosAtuais = [];

    for (let i = 0; i < qty; i++){
        const codigo = gerarEAN(tipo, prefixo);
        if (!codigo){
            //falha: prefixo incompatível (gera erro de validação)
            resultsDiv.textContent = 'Prefixo inválido para o tipo selecionado'
            codigosAtuais = [];
            copyBtn.disabled = true;
            downloadCsvBtn.style.display = 'none';
            gerando = false;
            setUiDisabled(false);
            return;

        }
    codigosAtuais.push(codigo);
    }

    renderCodes(codigosAtuais);

    downloadCsvBtn.style.display = codigosAtuais.length > 1 ? 'inline-block' : 'none';

    
    copyBtn.disabled = codigosAtuais.length === 0;
    gerando = false;
    setUiDisabled(false);
    });
    
//evento do botão de copiar
copyBtn.addEventListener('click', function () {
  if(!codigosAtuais || codigosAtuais.length === 0) return;
  const texto = codigosAtuais.join('\n');  
  copiarParaClipboard(texto)
    .then(() => {
        copyBtn.textContent = 'Copiado!';
        setTimeout(() => (copyBtn.textContent = 'Copiar Código'), 2000);
        })
        .catch((err) => console.error('Erro ao copiar:', err));
});

// Gerar o CSV e baixar:

    downloadCsvBtn.addEventListener('click', () => {
        if(!codigosAtuais || codigosAtuais.length === 0) return;
        // monta CSV simples (uma coluna: codigo)
        const header = 'codigo\n';
        const rows = codigosAtuais.join('\n');
        const csvContent = header + rows;

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const now = new Date().toISOString().slice(0,19).replace(/[:T]/g,'-'); //timestamp para filename
        a.download = `ean-codes-${now}.csv`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
})
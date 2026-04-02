// popup.js
// Lógica principal do Gerador EAN GTIN com suporte a barcodes

import { gerarEAN } from './generator.js';
import { copiarParaClipboard } from './utils.js';
import { criarPreviewBarcode, gerarBarcodesEmZip, baixarBarcodesZip, canvasToPNG, baixarBarcodeImagem } from './barcode.js';

const generateBtn = document.getElementById('generateBtn');
const copyBtn = document.getElementById('copyBtn');
const resultsDiv = document.getElementById('results');

const multiCheck = document.getElementById('multiCheck');
const multiOptions = document.getElementById('multiOptions');
const quantityInput = document.getElementById('quantityInput');
const downloadCsvBtn = document.getElementById('downloadCsvBtn');
const downloadBarcodeZipBtn = document.getElementById('downloadBarcodeZipBtn');

let codigosAtuais = [];
let gerando = false;

/**
 * Renderiza os códigos com previews de barcode
 * @param {Array<string>} codes - Array de códigos EAN/GTIN
 * @param {number} tipo - Tipo de GTIN (13 ou 14)
 */
async function renderCodes(codes, tipo) {
    resultsDiv.innerHTML = '';
    const frag = document.createDocumentFragment();

    for (const codigo of codes) {
        const wrapper = document.createElement('div');
        wrapper.className = 'result-item-wrapper';

        // Criar elemento de código
        const p = document.createElement('p');
        p.className = 'result-item';
        p.textContent = codigo;
        p.title = 'Clique para copiar esse código';
        p.addEventListener('click', () => copiarParaClipboard(codigo));
        wrapper.appendChild(p);

        // Criar container para barcode
        const barcodeContainer = document.createElement('div');
        barcodeContainer.className = 'barcode-container';
        barcodeContainer.style.marginTop = '6px';

        try {
            // Gerar preview do barcode
            await criarPreviewBarcode(codigo, barcodeContainer, tipo);

            // Criar ações para o barcode
            const actions = document.createElement('div');
            actions.className = 'barcode-actions';

            // Botão para baixar como PNG
            const btnDownloadPng = document.createElement('button');
            btnDownloadPng.textContent = 'PNG';
            btnDownloadPng.className = 'btn btn-small';
            btnDownloadPng.addEventListener('click', async () => {
                try {
                    btnDownloadPng.disabled = true;
                    btnDownloadPng.textContent = 'Gerando...';

                    const canvas = barcodeContainer.querySelector('canvas');
                    if (!canvas) {
                        throw new Error('Canvas não encontrado');
                    }

                    const pngBlob = await canvasToPNG(canvas);
                    baixarBarcodeImagem(codigo, pngBlob);

                    btnDownloadPng.textContent = 'Baixado!';
                    setTimeout(() => {
                        btnDownloadPng.textContent = 'PNG';
                        btnDownloadPng.disabled = false;
                    }, 2000);
                } catch (error) {
                    console.error('Erro ao baixar PNG:', error);
                    alert('Erro ao gerar PNG: ' + error.message);
                    btnDownloadPng.textContent = 'PNG';
                    btnDownloadPng.disabled = false;
                }
            });


            // Botão para copiar código
            const btnCopiar = document.createElement('button');
            btnCopiar.textContent = 'Copiar';
            btnCopiar.className = 'btn btn-small';
            btnCopiar.addEventListener('click', () => {
                copiarParaClipboard(codigo).then(() => {
                    btnCopiar.textContent = 'Copiado!';
                    setTimeout(() => {
                        btnCopiar.textContent = 'Copiar';
                    }, 1500);
                }).catch(err => console.error('Erro ao copiar:', err));
            });

            actions.appendChild(btnCopiar);
            actions.appendChild(btnDownloadPng);

            wrapper.appendChild(barcodeContainer);
            wrapper.appendChild(actions);
        } catch (error) {
            console.error(`Erro ao gerar barcode para ${codigo}:`, error);
            const errorMsg = document.createElement('p');
            errorMsg.style.color = '#e14d4d';
            errorMsg.style.fontSize = '12px';
            errorMsg.textContent = `Erro ao gerar barcode: ${error.message}`;
            wrapper.appendChild(errorMsg);
        }

        frag.appendChild(wrapper);
    }

    resultsDiv.appendChild(frag);
}

multiCheck.addEventListener('change', () => {
    if (multiCheck.checked) {
        multiOptions.style.display = 'block';
    } else {
        multiOptions.style.display = 'none';
        downloadCsvBtn.style.display = 'none';
        downloadBarcodeZipBtn.style.display = 'none';
    }
});

/**
 * Desabilita ou habilita inputs durante geração
 */
function setUiDisabled(disabled) {
    generateBtn.disabled = disabled;
    copyBtn.disabled = disabled || (codigosAtuais.length === 0);
    quantityInput.disabled = disabled;
    multiCheck.disabled = disabled;
    downloadCsvBtn.disabled = disabled;
    downloadBarcodeZipBtn.disabled = disabled;
}

generateBtn.addEventListener('click', async () => {
    if (gerando) return;
    gerando = true;
    setUiDisabled(true);
    resultsDiv.textContent = 'Gerando códigos...';

    const tipo = parseInt(document.getElementById('gtinType').value, 10);
    if (Number.isNaN(tipo)) {
        resultsDiv.textContent = 'Tipo inválido.';
        gerando = false;
        setUiDisabled(false);
        return;
    }

    const prefixo = document.getElementById('prefixInput').value.trim();

    // Validação local antes de chamar generator
    if (!/^\d*$/.test(prefixo)) {
        resultsDiv.textContent = 'Prefixo inválido - digite apenas dígitos';
        copyBtn.disabled = true;
        gerando = false;
        setUiDisabled(false);
        return;
    }

    // Decisão para gerar um OU vários
    let qty = 1;
    if (multiCheck && multiCheck.checked) {
        const max = parseInt(quantityInput.max, 10) || 100;
        qty = parseInt(quantityInput.value, 10) || 1;
        if (qty < 1) qty = 1;
        if (qty > max) qty = max;
    }

    // Gerar N códigos
    codigosAtuais = [];

    for (let i = 0; i < qty; i++) {
        const codigo = gerarEAN(tipo, prefixo);
        if (!codigo) {
            // Falha: prefixo incompatível
            resultsDiv.textContent = 'Prefixo inválido para o tipo selecionado';
            codigosAtuais = [];
            copyBtn.disabled = true;
            downloadCsvBtn.style.display = 'none';
            downloadBarcodeZipBtn.style.display = 'none';
            gerando = false;
            setUiDisabled(false);
            return;
        }
        codigosAtuais.push(codigo);
    }

    // Renderizar com barcodes
    try {
        await renderCodes(codigosAtuais, tipo);
    } catch (error) {
        console.error('Erro ao renderizar barcodes:', error);
        resultsDiv.innerHTML = '<p style="color: #e14d4d;">Erro ao gerar barcodes. Verifique o console.</p>';
    }

    downloadCsvBtn.style.display = codigosAtuais.length > 1 ? 'inline-block' : 'none';
    downloadBarcodeZipBtn.style.display = codigosAtuais.length > 1 ? 'inline-block' : 'none';

    copyBtn.disabled = codigosAtuais.length === 0;
    gerando = false;
    setUiDisabled(false);
});

// Evento do botão de copiar
copyBtn.addEventListener('click', function () {
    if (!codigosAtuais || codigosAtuais.length === 0) return;
    const texto = codigosAtuais.join('\n');
    copiarParaClipboard(texto)
        .then(() => {
            copyBtn.textContent = 'Copiado!';
            setTimeout(() => (copyBtn.textContent = 'Copiar Código'), 2000);
        })
        .catch((err) => console.error('Erro ao copiar:', err));
});

// Gerar o CSV e baixar
downloadCsvBtn.addEventListener('click', () => {
    if (!codigosAtuais || codigosAtuais.length === 0) return;
    // Montar CSV simples (uma coluna: codigo)
    const header = 'codigo\n';
    const rows = codigosAtuais.join('\n');
    const csvContent = header + rows;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const now = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-'); // Timestamp para filename
    a.download = `ean-codes-${now}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
});

// Gerar ZIP com barcodes
downloadBarcodeZipBtn.addEventListener('click', async () => {
    if (!codigosAtuais || codigosAtuais.length === 0) return;

    const tipo = parseInt(document.getElementById('gtinType').value, 10);
    const btnText = downloadBarcodeZipBtn.textContent;

    try {
        downloadBarcodeZipBtn.disabled = true;
        downloadBarcodeZipBtn.textContent = 'Gerando ZIP...';

        const zipBlob = await gerarBarcodesEmZip(codigosAtuais, tipo, (current, total) => {
            downloadBarcodeZipBtn.textContent = `${current}/${total}`;
        });

        baixarBarcodesZip(zipBlob);

        downloadBarcodeZipBtn.textContent = 'ZIP Baixado!';
        setTimeout(() => {
            downloadBarcodeZipBtn.textContent = btnText;
            downloadBarcodeZipBtn.disabled = false;
        }, 2000);
    } catch (error) {
        console.error('Erro ao gerar ZIP:', error);
        alert('Erro ao gerar ZIP com barcodes: ' + error.message);
        downloadBarcodeZipBtn.textContent = btnText;
        downloadBarcodeZipBtn.disabled = false;
    }
});
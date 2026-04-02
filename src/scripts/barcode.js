// barcode.js
// Módulo responsável pela geração de imagens de código de barras EAN/GTIN
// Nota: JsBarcode e JSZip devem estar disponíveis globalmente via script tag

/**
 * Gera uma imagem de código de barras para um código EAN/GTIN usando Canvas
 * @param {string} codigo - O código EAN/GTIN (ex: 7891234567890)
 * @param {number} tipo - Tipo de GTIN (13 ou 14)
 * @returns {Promise<HTMLCanvasElement>} Canvas contendo o barcode
 */
export async function gerarBarcodeElement(codigo, tipo = 13) {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const formato = tipo === 14 ? 'ITF14' : 'EAN13';

    try {
      // Passa o canvas diretamente (sem seletor) – o elemento não precisa estar no DOM
      window.JsBarcode(canvas, codigo, {
        format: formato,
        width: 2,
        height: 80,
        displayValue: true,
        fontSize: 14,
        margin: 10,
        lineColor: '#000000',
        background: '#ffffff',
      });

      resolve(canvas);
    } catch (error) {
      reject(new Error(`Erro ao gerar barcode: ${error.message}`));
    }
  });
}

/**
 * Converte um Canvas para PNG Blob
 * @param {HTMLCanvasElement} canvas - Canvas DOM
 * @returns {Promise<Blob>} Blob PNG
 */
export async function canvasToPNG(canvas) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Não foi possível gerar blob PNG do canvas'));
        }
      },
      'image/png',
      0.95
    );
  });
}

/**
 * Baixa um arquivo com o código de barras PNG
 * @param {string} codigo - Código EAN/GTIN
 * @param {Blob} blob - Blob da imagem PNG
 */
export function baixarBarcodeImagem(codigo, blob) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `ean-${codigo}.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Gera múltiplos barcodes e cria um ZIP com todas as imagens
 * @param {Array<string>} codigos - Array de códigos EAN/GTIN
 * @param {number} tipo - Tipo de GTIN (13 ou 14)
 * @param {Function} onProgress - Callback para progresso (opcional)
 * @returns {Promise<Blob>} Blob do arquivo ZIP
 */
export async function gerarBarcodesEmZip(
  codigos,
  tipo = 13,
  onProgress = null
) {
  // Verificar se JSZip está disponível
  if (typeof window.JSZip === 'undefined') {
    throw new Error('JSZip não está carregado. Verifique se o script foi incluído.');
  }

  const zip = new window.JSZip();
  const totalCodigos = codigos.length;
  const formato = tipo === 14 ? 'ITF14' : 'EAN13';

  for (let i = 0; i < totalCodigos; i++) {
    const codigo = codigos[i];

    try {
      // Chamar callback de progresso
      if (onProgress) {
        onProgress(i + 1, totalCodigos);
      }

      // Criar canvas temporário (não precisa ser inserido no DOM)
      const canvas = document.createElement('canvas');

      // Gerar barcode passando o canvas diretamente
      window.JsBarcode(canvas, codigo, {
        format: formato,
        width: 2,
        height: 80,
        displayValue: true,
        fontSize: 14,
        margin: 10,
        lineColor: '#000000',
        background: '#ffffff',
      });

      // Converter para Blob
      const blob = await canvasToPNG(canvas);
      const arrayBuffer = await blob.arrayBuffer();

      // Adicionar ao ZIP
      zip.file(`ean-${codigo}.png`, arrayBuffer);
    } catch (error) {
      console.error(`Erro ao processar barcode ${codigo}:`, error);
      // Continuar com próximo código mesmo com erro
    }

    // Pequena pausa para não travar a UI em grandes quantidades
    if (i % 10 === 0 && i > 0) {
      await new Promise((resolve) => setTimeout(resolve, 10));
    }
  }

  // Gerar ZIP
  const zipBlob = await zip.generateAsync({ type: 'blob' });
  return zipBlob;
}

/**
 * Baixa um arquivo ZIP contendo múltiplos barcodes
 * @param {Blob} zipBlob - Blob do arquivo ZIP
 * @param {string} nomeArquivo - Nome do arquivo (padrão: ean-barcodes-TIMESTAMP.zip)
 */
export function baixarBarcodesZip(zipBlob, nomeArquivo = null) {
  if (!nomeArquivo) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
    nomeArquivo = `ean-barcodes-${timestamp}.zip`;
  }

  const url = URL.createObjectURL(zipBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = nomeArquivo;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Cria uma preview de barcode em um elemento DOM
 * @param {string} codigo - Código EAN/GTIN
 * @param {HTMLElement} container - Elemento container onde exibir o canvas
 * @param {number} tipo - Tipo de GTIN (13 ou 14)
 * @returns {Promise<HTMLCanvasElement>} Canvas do barcode
 */
export async function criarPreviewBarcode(codigo, container, tipo = 13) {
  // Cria o canvas e o adiciona ao container
  const canvas = document.createElement('canvas');
  canvas.className = 'barcode-preview';
  container.appendChild(canvas);

  try {
    const formato = tipo === 14 ? 'ITF14' : 'EAN13';
    // Passa o canvas diretamente (não precisa de ID ou seletor)
    window.JsBarcode(canvas, codigo, {
      format: formato,
      width: 2,
      height: 80,
      displayValue: true,
      fontSize: 14,
      margin: 10,
      lineColor: '#000000',
      background: '#ffffff',
    });

    return canvas;
  } catch (error) {
    // Em caso de erro, remove o canvas do container
    if (container.contains(canvas)) {
      container.removeChild(canvas);
    }
    throw error;
  }
}
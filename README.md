# EAN GTIN Generator

Uma extensão profissional para Chrome que facilita a **geração rápida e validada de códigos de barras EAN/GTIN** com suporte a múltiplas gerações e exportação em CSV.

---

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Características Principais](#características-principais)
- [Requisitos e Instalação](#requisitos-e-instalação)
- [Como Usar](#como-usar)
- [Funcionalidades Detalhadas](#funcionalidades-detalhadas)
- [Arquitetura e Tecnologias](#arquitetura-e-tecnologias)
- [Como Contribuir](#como-contribuir)
- [Licença](#licença)
- [Suporte e Contato](#suporte-e-contato)

---

## 🎯 Visão Geral

**EAN GTIN Generator** é uma ferramenta essencial para desenvolvedores, gerentes de inventário e especialistas em e-commerce que precisam gerar códigos de barras válidos rapidamente. 

### Público-Alvo
- Desenvolvedores trabalhando com sistemas de varejo e inventário
- Empresas de e-commerce que precisam de códigos de barras para produtos
- Equipes de testes de software que necessitam dados realistas
- Profissionais de logística e supply chain

### Diferencial do Projeto
- ✅ Implementação completa do **algoritmo de validação EAN** (checksum)
- ✅ Geração em lote com exportação para **CSV**
- ✅ Interface intuitiva e responsiva
- ✅ Integração nativa com o Chrome (Manifest V3)
- ✅ Sem dependências externas, código otimizado
- ✅ Clipboard direto para cópia rápida dos códigos

---

## ✨ Características Principais

| Recurso | Descrição |
|---------|-----------|
| **Geração Única** | Gere um código EAN/GTIN com um clique |
| **Geração em Lote** | Gere até 100 códigos simultaneamente |
| **Suporte a Prefixo** | Customize o prefixo numérico do código |
| **Validação EAN** | Implementação correta do algoritmo de checksum |
| **Exportação CSV** | Baixe os códigos gerados em formato CSV |
| **Cópia Rápida** | Copie códigos para a área de transferência com um clique |
| **Tipos Suportados** | GTIN-13 (EAN-13) e GTIN-14 |

---

## 🔧 Requisitos e Instalação

### Requisitos
- **Google Chrome** (versão 88+) ou navegadores baseados em Chromium (Edge, Brave, etc.)
- Node.js 18+ (apenas para desenvolvimento)

### Instalação em Modo de Desenvolvimento

#### Passo 1: Clonar o Repositório
```bash
git clone https://github.com/arnmoser/ean-gtin-extension.git
cd ean-gtin-extension
```

#### Passo 2: Instalar Dependências
```bash
npm install
```

#### Passo 3: Carregar a Extensão no Chrome
1. Abra o Chrome e navegue para `chrome://extensions`
2. Ative o **"Modo do desenvolvedor"** (canto superior direito)
3. Clique em **"Carregar extensão sem compactar"**
4. Selecione a pasta do projeto

#### Passo 4: Validação
- A extensão aparecerá na lista de extensões
- Clique no ícone da extensão na barra de ferramentas para abrir o popup

### Instalação em Produção (via Chrome Web Store)
> A extensão está em desenvolvimento. Um guia de publicação será adicionado quando estiver pronta para distribuição pública.

---

## 📖 Como Usar

### Interface Principal

Após clicar no ícone da extensão, você terá acesso a:

```
┌─────────────────────────────────────────┐
│  Gerador EAN / GTIN                    │
├─────────────────────────────────────────┤
│ Tipo:  [GTIN-13 (EAN-13) ▼]             │
│                                         │
│ Prefixo (opcional):                     │
│ [_________________________]              │
│                                         │
│ ☐ Gerar múltiplos códigos               │
│                                         │
│ [      GERAR       ]                    │
│                                         │
│ ┌───────────────────────────────────┐   │
│ │ Resultados:                       │   │
│ │                                   │   │
│ │ • 7891234005678                   │   │
│ └───────────────────────────────────┘   │
│                                         │
│ [    COPIAR CÓDIGO    ] [BAIXAR CSV]    │
└─────────────────────────────────────────┘
```

### Exemplos de Uso

#### Exemplo 1: Gerar um Código Simples
1. Deixe o **Tipo** como **"GTIN-13 (EAN-13)"**
2. Deixe o campo de **Prefixo** vazio (ou deixe em branco)
3. Clique em **"Gerar"**
4. Um código válido de 13 dígitos será gerado
5. Clique em **"Copiar Código"** para cópia automática

**Saída Esperada:**
```
7829837465234
```

#### Exemplo 2: Gerar com Prefixo Personalizado
1. Selecione **"GTIN-13 (EAN-13)"**
2. Digite um prefixo: `789` (o seu código empresa)
3. Clique em **"Gerar"**
4. Um código será gerado iniciando com `789`

**Saída Esperada:**
```
7891234567890  (prefixo: 789 + números aleatórios + checksum)
```

#### Exemplo 3: Gerar Múltiplos Códigos e Exportar
1. Marque a caixa **"Gerar múltiplos códigos"**
2. Defina a quantidade como `50`
3. Digite um prefixo opcional (ex: `7891234`)
4. Clique em **"Gerar"**
5. Após geração, clique em **"Baixar Códigos EAN em CSV"**
6. Um arquivo `ean-codes-TIMESTAMP.csv` será baixado

**Conteúdo do CSV:**
```csv
codigo
7891234012348
7891234098765
7891234567890
...
```

---

## 🎨 Funcionalidades Detalhadas

### 1. **Gerador de Códigos EAN**
- Implementa o **algoritmo EAN-13 oficial**
- Calcula automaticamente o dígito verificador (checksum)
- Suporta prefixos customizados
- Validação de comprimento de prefixo

**Como funciona:**
```javascript
// Exemplo interno:
Prefixo: 789
Números aleatórios: 1234567
Base: 7891234567
Checksum calculado: 0
Código Final: 7891234567890
```

### 2. **Algoritmo de Verificação EAN**
Implementa o padrão oficial ISO/IEC 13-13:

```
1. Inverter os dígitos
2. Multiplicar posições pares por 3, posições ímpares por 1
3. Somar todos os resultados
4. Calcular o próximo múltiplo de 10
5. Subtrair para obter o dígito verificador
```

### 3. **Geração em Lote**
- Gere 1 a 100 códigos em uma única operação
- Performance otimizada
- Evita duplicação de índices aleatórios

### 4. **Exportação CSV**
- Formato padrão: uma coluna chamada `codigo`
- Filename automático com timestamp: `ean-codes-2025-06-15-14-30-45.csv`
- Compatível com Excel, Google Sheets e softwares de acesso a dados

### 5. **Integração com Clipboard**
- API nativa `navigator.clipboard`
- Feedback visual ao copiar
- Suporta múltiplos códigos (quebra de linha)

### 6. **Validação de Entrada**
- Prefixo: apenas dígitos numéricos
- Quantidade: entre 1 e 100
- Tipo: GTIN-13 ou GTIN-14
- Mensagens de erro claras em português

---

## 🏗️ Arquitetura e Tecnologias

### Stack Tecnológico

| Componente | Tecnologia | Descrição |
|-----------|-----------|-----------|
| **Extensão** | Chrome Manifest V3 | Arquitetura moderna e segura |
| **Frontend** | HTML5 + CSS3 + JavaScript (ES6+) | Interface responsiva |
| **Backend** | JavaScript (Worker) | Service Worker para tarefas assíncronas |
| **APIs** | Clipboard API, Storage API | Integração com sistema operacional |
| **Linting** | ESLint + Prettier | Code quality e formatação |

### Arquitetura de Módulos

```
ean-gtin-extension/
├── manifest.json              # Configuração da extensão (Manifest V3)
├── background.js              # Service Worker (reservado para uso futuro)
├── src/
│   ├── popup.html             # Interface principal (UI)
│   ├── styles/
│   │   └── popup.css          # Estilos responsivos
│   └── scripts/
│       ├── popup.js           # Lógica de controle de UI e eventos
│       ├── generator.js       # Algoritmo EAN (núcleo da extensão)
│       └── utils.js           # Funções auxiliares (clipboard, etc.)
└── icons/                     # Assets da extensão
```

### Padrões de Projeto Utilizados

1. **Modularização ES6**
   - Uso de `export/import` para separação de responsabilidades
   - Cada módulo tem uma única responsabilidade

2. **Validação em Camadas**
   - Validação de entrada na interface
   - Validação lógica dentro do gerador

3. **Programação Assíncrona**
   - Uso de `async/await` para operações de clipboard
   - Prevenção de múltiplas cliques durante geração

4. **Documentação de Algoritmo**
   - Comentários explicativos no código
   - Implementação clara do checksum EAN

### Detalhes Técnicos

#### Manifest V3
- **Permissões utilizadas:** `storage`, `clipboardWrite`
- **Worker:** `background.js` como Service Worker
- **Popup:** UI dinâmica renderizada via `popup.html`

#### Cálculo do Checksum EAN-13
O algoritmo implementado segue o padrão international:

```javascript
// Exemplo: 789123456789X (X = dígito verificador)
Base: 789123456789

// Passo 1: Reverter
[9, 8, 7, 6, 5, 4, 3, 2, 1, 3, 9, 8, 7]

// Passo 2-3: Aplicar pesos e somar
9×3 + 8×1 + 7×3 + 6×1 + ... = 145

// Passo 4-5: Próximo múltiplo de 10 - soma
150 - 145 = 5

// Dígito verificador: 5
// Código Final: 7891234567895
```

---

## 🤝 Como Contribuir

Contribuições são bem-vindas! Por favor, siga o guia abaixo:

### Passos para Contribuir

1. **Forkar o Repositório**
   ```bash
   # Clique em "Fork" no GitHub
   ```

2. **Clonar Seu Fork**
   ```bash
   git clone https://github.com/SEU_USUARIO/ean-gtin-extension.git
   cd ean-gtin-extension
   ```

3. **Criar Uma Branch para Sua Feature**
   ```bash
   git checkout -b feat/sua-feature-descritiva
   ```

4. **Instalar Dependências**
   ```bash
   npm install
   ```

5. **Fazer Suas Alterações**
   - Mantenha o código limpo e bem documentado
   - Siga o padrão de código existente

6. **Validar com Lint**
   ```bash
   npm run lint        # Verificar erros
   npm run lint:fix    # Corrigir automaticamente
   ```

7. **Commit de Suas Mudanças**
   ```bash
   git add .
   git commit -m "feat: descrição clara da mudança"
   # Use tipos convencionais: feat:, fix:, docs:, style:, refactor:, perf:, test:, chore:
   ```

8. **Push para Seu Fork**
   ```bash
   git push origin feat/sua-feature-descritiva
   ```

9. **Abrir um Pull Request**
   - Vá a `github.com/arnmoser/ean-gtin-extension`
   - Clique em "New Pull Request"
   - Descreva sua contribuição detalhadamente

### Diretrizes de Código

- **Style:** ESLint + Prettier (configurado no projeto)
- **Comments:** Código bem documentado em português ou inglês
- **Performance:** Evite operações bloqueantes
- **Acessibilidade:** ARIA labels quando apropriado
- **Testes:** Teste manualmente em modo desenvolvimento

### Áreas de Contribuição Bem-vindas

- 🐛 **Correções de bugs**
- ✨ **Novas funcionalidades:**
  - Suporte a mais tipos GTIN (GTIN-8, GTIN-12)
  - Temas dark mode / light mode
  - Histórico de códigos gerados
  - Validação de códigos EAN existentes
- 🎨 **Melhorias de UI/UX**
- 📚 **Documentação**
- 🌍 **Tradução para outros idiomas**
- 🧪 **Testes automatizados**

---

## 📄 Licença

Este projeto está licenciado sob a **ISC License** (Interactive Systems Corporation License).

### O que você pode fazer:
✅ Usar para fins comerciais e pessoais  
✅ Modificar e distribuir  
✅ Usar em software privado  

### Restrições:
❌ Sem garantia - use por sua conta e risco  
❌ Sem responsabilidade por danos  

Para detalhes completos, consulte o arquivo `LICENSE` no repositório.

---

## 💬 Suporte e Contato

### Como Obter Ajuda

#### 1. **Reportar Bugs**
   - Abra uma [issue no GitHub](https://github.com/arnmoser/ean-gtin-extension/issues)
   - Inclua:
     - Versão do Chrome
     - Passos para reproduzir
     - Screenshot ou GIF (se possível)
     - Mensagens de erro (console do Chrome)

#### 2. **Sugerir Melhorias**
   - Use a tag `enhancement` em uma issue
   - Descreva o caso de uso
   - Explique o benefício da mudança

#### 3. **Discussões Gerais**
   - Utilize a aba **Discussions** no GitHub

### Canais de Contato

| Contato | Informação |
|---------|-----------|
| **Issues** | [GitHub Issues](https://github.com/arnmoser/ean-gtin-extension/issues) |
| **Discussões** | [GitHub Discussions](https://github.com/arnmoser/ean-gtin-extension/discussions) |
| **Repositório** | [github.com/arnmoser/ean-gtin-extension](https://github.com/arnmoser/ean-gtin-extension) |

### Tempo de Resposta
- Bugs críticos: 24-48 horas
- Outras issues: até 1 semana
- Pull requests: até 5 dias úteis

---

## 📊 Status do Projeto

| Item | Status |
|------|--------|
| **Desenvolvimento** | ✅ Ativo |
| **Versão Atual** | v0.1.0 (Alfa) |
| **Chrome Web Store** | ⏳ Em planejamento |
| **Testes Automatizados** | ⏳ Próximos passos |
| **Suporte a GTIN-8** | ⏳ Planejado |

---

## 🎓 Referências e Recursos

- [Padrão EAN-13 - Wikipedia](https://pt.wikipedia.org/wiki/EAN-13)
- [ISO/IEC 13-13:2012](https://www.iso.org/standard/35145.html)
- [Chrome Extension Developer Guide](https://developer.chrome.com/docs/extensions/)
- [Manifest V3 Documentation](https://developer.chrome.com/docs/extensions/mv3/)

---

## 🙏 Agradecimentos

Obrigado a todos os contribuidores e usuários que utilizam esta ferramenta para gerenciar seus códigos de barras!

---

**Desenvolvido com ❤️ para a comunidade de desenvolvimento**

Última atualização: Março 2026
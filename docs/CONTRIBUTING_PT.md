# 🤝 Contribuindo para o Wheel of Creation

Antes de tudo, **obrigado** por considerar contribuir para o Wheel of Creation! São pessoas como você que tornam este addon melhor para toda a comunidade de Minecraft Bedrock.

Este documento fornece diretrizes e informações sobre como contribuir para este projeto. Por favor, leia-o antes de enviar qualquer contribuição.

---

## 📋 Índice

- [Código de Conduta](#-código-de-conduta)
- [Como Posso Contribuir?](#-como-posso-contribuir)
    - [Reportar Bugs](#-reportar-bugs)
    - [Sugerir Funcionalidades](#-sugerir-funcionalidades)
    - [Traduções](#-traduções)
    - [Contribuições de Código](#-contribuições-de-código)
- [Configuração do Ambiente](#-configuração-do-ambiente)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Padrões de Código](#-padrões-de-código)
- [Processo de Pull Request](#-processo-de-pull-request)
- [Reconhecimento](#-reconhecimento)

---

## 📜 Código de Conduta

Este projeto segue um código de conduta simples:

- **Seja respeitoso** — Trate todos com respeito. Sem assédio, discriminação ou comportamento tóxico.
- **Seja construtivo** — Críticas são bem-vindas quando são construtivas e ajudam a melhorar o projeto.
- **Seja paciente** — Este é um projeto de uma pessoa só, mantido no tempo livre. Respostas podem levar alguns dias.
- **Seja colaborativo** — Todos estamos aqui para tornar o Minecraft Bedrock melhor.

> ⚠️ **Nota**: Este addon é inspirado no TerraFirmaCraft mas NÃO é afiliado a ele. Por favor, não crie issues comparando funcionalidades ou pedindo réplicas exatas das mecânicas do TFC.

### 💰 Aviso de Transparência

> Este projeto gera receita mínima através do **CurseForge Rewards** para cobrir custos de desenvolvimento. Contribuições voluntárias via Pull Request são consideradas **doações ao projeto** sob a licença GPL v3.
>
> **Se você busca uma colaboração remunerada ou por objetivos, por favor entre em contato comigo antes de começar a trabalhar.**

---

## 🌟 Como Posso Contribuir?

### 🐛 Reportar Bugs

Encontrou um bug? Veja como reportá-lo de forma eficaz:

1. **Pesquise issues existentes** — Verifique se o bug já foi reportado.
2. **Crie uma nova issue** com a label `bug`.
3. **Inclua estas informações**:
    - Versão do Minecraft Bedrock
    - Dispositivo/plataforma (Windows, Android, iOS, Xbox, etc.)
    - Passos para reproduzir o erro
    - Comportamento esperado vs comportamento atual
    - Screenshots ou vídeos se possível
    - Qualquer mensagem de erro do content log

**Exemplo de bom relatório de bug:**

```
Título: Plantações não crescem no bioma Cherry Grove

Versão do Minecraft: 1.21.50
Plataforma: Windows 11
Passos:
1. Criar terra arada no bioma Cherry Grove
2. Plantar sementes de trigo
3. Esperar vários dias do jogo
4. A plantação nunca avança além do estágio 0

Esperado: O trigo deveria crescer normalmente
Atual: O trigo fica no estágio 0 indefinidamente

Erro no Content Log: Nenhum visível
```

### 💡 Sugerir Funcionalidades

Tem uma ideia? Adoraria ouvi-la!

1. **Confira o Roadmap** — Sua ideia pode já estar planejada.
2. **Crie uma issue** com a label `enhancement`.
3. **Descreva sua ideia** incluindo:
    - Qual problema ela resolve?
    - Como funcionaria?
    - Como se encaixa na visão do addon de sobrevivência realista?

> 🎯 **Lembre-se**: Este addon busca **realismo e desafio**, não conveniência. Funcionalidades que tornem o jogo mais fácil não serão consideradas.

### 🌍 Traduções

Quer traduzir o addon para seu idioma?

**Textos dentro do jogo** (`Resource/texts/`):

1. Copie `en_US.lang` como modelo
2. Crie um novo arquivo com seu código de locale (ex: `fr_FR.lang`)
3. Traduza todas as strings mantendo as chaves intactas
4. Envie um PR

**Documentação**:

1. Copie o README em inglês ou outros documentos
2. Crie versões traduzidas na pasta `docs/`
3. Use a convenção de nomes: `README_XX.md` onde XX é o código do idioma

### 💻 Contribuições de Código

Pronto para programar? Incrível! Veja como:

1. **Faça fork do repositório**
2. **Crie uma branch de funcionalidade** (`git checkout -b feature/funcionalidade-incrivel`)
3. **Faça suas alterações**
4. **Teste exaustivamente** dentro do jogo
5. **Faça commit com mensagens claras**
6. **Push para seu fork**
7. **Abra um Pull Request**

---

## 🛠️ Configuração do Ambiente

### Pré-requisitos

- [Node.js](https://nodejs.org/) v18 ou superior
- [npm](https://www.npmjs.com/) ou [pnpm](https://pnpm.io/)
- Minecraft Bedrock Edition (última versão)
- Um editor de código (VS Code recomendado)

### Passos de Configuração

```bash
# 1. Clone seu fork
git clone https://github.com/SEU_USUARIO/wheel_of_creation.git
cd wheel_of_creation

# 2. Instale as dependências
npm install

# 3. Inicie o modo de desenvolvimento (observa mudanças)
npm run dev

# 4. Compile para produção
npm run build
```

### Linkar com o Minecraft

Os scripts de desenvolvimento devem linkar automaticamente às suas pastas de desenvolvimento do Minecraft. Se não:

**Windows:**

```
%LOCALAPPDATA%\Packages\Microsoft.MinecraftUWP_8wekyb3d8bbwe\LocalState\games\com.mojang\development_behavior_packs
%LOCALAPPDATA%\Packages\Microsoft.MinecraftUWP_8wekyb3d8bbwe\LocalState\games\com.mojang\development_resource_packs
```

**Android:**

```
/storage/emulated/0/Android/data/com.mojang.minecraftpe/files/games/com.mojang/development_behavior_packs
/storage/emulated/0/Android/data/com.mojang.minecraftpe/files/games/com.mojang/development_resource_packs
```

---

## 📁 Estrutura do Projeto

```
wheel_of_creation/
├── Behavior/                    # Behavior Pack
│   ├── blocks/                  # Definições JSON de blocos
│   ├── items/                   # Definições JSON de itens
│   ├── scripts/                 # Código fonte TypeScript
│   │   ├── config.ts            # Dados de configuração de biomas
│   │   ├── main.ts              # Ponto de entrada
│   │   ├── features/            # Mecânicas de jogo
│   │   │   ├── blocks/          # Componentes de blocos
│   │   │   │   ├── Crop.ts      # Classe base de plantações
│   │   │   │   ├── StemCrop.ts  # Lógica Abóbora/Melancia
│   │   │   │   ├── ColumnCrop.ts# Lógica Cana-de-açúcar
│   │   │   │   ├── Farmland.ts  # Hidratação do solo
│   │   │   │   └── crops/       # Configurações de plantações
│   │   │   ├── items/           # Comportamentos de itens
│   │   │   └── environment/     # Sistema de clima
│   │   ├── data/                # Persistência de dados
│   │   └── utils/               # Funções utilitárias
│   ├── loot_tables/             # Tabelas de drops
│   ├── recipes/                 # Receitas de crafting
│   └── trading/                 # Trocas de aldeões
├── Resource/                    # Resource Pack
│   ├── models/                  # Modelos 3D
│   ├── textures/                # Texturas
│   └── texts/                   # Localização
├── scripts/                     # Scripts de build
├── docs/                        # Documentação
└── build/                       # Saída de build
```

---

## 📏 Padrões de Código

### TypeScript

- Use **TypeScript** para todos os arquivos de scripts
- Siga os padrões de código e convenções de nomes existentes
- Use nomes de variáveis e funções significativos
- Adicione comentários para lógica complexa
- Use o wrapper `safeExecute()` para tratamento de erros

```typescript
// ✅ Bom
private handleRandomTick(e: BlockComponentRandomTickEvent) {
    const { block, dimension } = e;
    const biome = dimension.getBiome(block.location);
    const temperature = getBiomeTemperature(biome.id, block.location);
    // ...
}

// ❌ Ruim
private tick(e: any) {
    var t = e.block.dimension.getBiome(e.block.location);
    // ...
}
```

### Arquivos JSON

- Use formatação apropriada (2 espaços de indentação)
- Siga as convenções de schema do Minecraft
- Mantenha identificadores consistentes com o namespace `woc:`

### Commits

Use mensagens de commit claras e descritivas:

```
✅ Bom:
feat: adicionar plantação de arroz com requisitos de água de arrozal
fix: plantações não crescem no bioma Pale Garden
docs: atualizar tradução para português

❌ Ruim:
arrumei coisas
update
asdfgh
```

---

## 🔄 Processo de Pull Request

1. **Garanta que seu código funciona** — Teste no jogo exaustivamente
2. **Atualize a documentação** se necessário
3. **Preencha o template do PR** completamente
4. **Aguarde a revisão** — Vou revisar assim que possível
5. **Atenda ao feedback** se mudanças forem solicitadas
6. **Comemore** quando for merged! 🎉

### Checklist do PR

- [ ] O código compila sem erros
- [ ] Testado no Minecraft Bedrock (última versão)
- [ ] Sem erros de console no content log
- [ ] Segue o estilo de código existente
- [ ] Documentação atualizada se necessário
- [ ] Mensagens de commit claras

---

## 🏆 Reconhecimento

Todos os contribuidores serão reconhecidos! Seu nome de usuário do GitHub será adicionado a:

- A seção de créditos do README
- Créditos dentro do jogo (para contribuições significativas)
- Notas de versão quando sua contribuição for incluída

---

## ❓ Dúvidas?

- **GitHub Issues** — Para bugs e solicitações de funcionalidades
- **GitHub Discussions** — Para perguntas e ideias

---

<div align="center">

**Obrigado por ajudar a tornar o Wheel of Creation melhor!** 🌾

_Cada contribuição, por menor que seja, é valorizada e apreciada._

</div>

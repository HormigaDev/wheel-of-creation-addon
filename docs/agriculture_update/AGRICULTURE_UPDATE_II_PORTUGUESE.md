<div align="center">

# 🍳 Wheel of Creation: Agriculture Update II

### _Dieta, Nutrição e Culinária — Minecraft Bedrock_

[![Minecraft](https://img.shields.io/badge/Minecraft-Bedrock%201.21+-green?style=for-the-badge&logo=minecraft)](https://minecraft.net)
[![License](https://img.shields.io/badge/License-GPL%20v3-blue?style=for-the-badge)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-Script%20API-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)

🌐 **[🇺🇸 Read in English](./AGRICULTURE_UPDATE_II_ENGLISH.md)** | **[🇪🇸 Leer en Español](./AGRICULTURE_UPDATE_II_SPANISH.md)**

---

**O segundo capítulo da Agriculture Update chega com 4 novas culturas, 29 receitas de culinária, um sistema completo de dieta com 7 nutrientes que afeta suas estatísticas de combate, e um rebalanceamento dos alimentos vanilla que faz cozinhar realmente importar.**

> 🎮 **Requer [Agriculture Update I](./AGRICULTURE_UPDATE_I_PORTUGUESE.md)** — Esta atualização se baseia nos sistemas de cultivo da primeira versão. Familiarize-se com as mecânicas base antes de mergulhar.

![Screenshot_UpdateII](../../assets/portada_update_ii.png)

</div>

---

<div align="center">

### ✅ O que há de novo na Agriculture Update II

</div>

> Esta atualização foca em **o que acontece após a colheita**. Enquanto a Update I reimaginou como as plantas crescem, a Update II reimagina **por que você as cultiva**. Comida não é mais apenas pontos de fome — é um recurso estratégico que impacta diretamente sua força, resistência e saúde máxima.

---

## 📋 Tabela de Conteúdos

- [Novas Culturas](#-novas-culturas)
    - [Tomates](#-tomates)
    - [Repolhos](#-repolhos)
    - [Cebolas](#-cebolas)
    - [Arroz (Cultura Aquática)](#-arroz--cultura-aquática)
- [Culinária e Receitas](#-culinária-e-receitas)
    - [Ingredientes](#-ingredientes-base)
    - [Sanduíches](#-sanduíches)
    - [Pratos com Tigela](#-pratos-com-tigela--ensopados)
    - [Outras Receitas](#-outras-receitas)
- [Sistema de Dieta e Nutrição](#-sistema-de-dieta-e-nutrição)
    - [Os 7 Grupos de Nutrientes](#-os-7-grupos-de-nutrientes)
    - [Como a Digestão Funciona](#-como-a-digestão-funciona)
    - [Buffs e Debuffs](#-buffs-e-debuffs)
    - [Livro de Dieta](#-livro-de-dieta)
- [Rebalanceamento de Comida Vanilla](#-rebalanceamento-de-comida-vanilla)
- [Trades do Fazendeiro Atualizados](#-trades-do-fazendeiro-atualizados)
- [Dicas e Estratégias](#-dicas-e-estratégias)

---

## 🌱 Novas Culturas

Agriculture Update II introduz **4 novas culturas**, cada uma com condições de crescimento e mecânicas únicas. Uma delas — o Arroz — introduz uma categoria completamente nova: **Culturas Aquáticas**.

![Screenshot_NewCrops](../../assets/agriculture_update_2/new_crops.png)

---

### 🍅 Tomates

A cultura mais produtiva do jogo, mas também a mais exigente. Os tomates têm a **maior chance de ervas daninhas** (18%) de qualquer cultura, tornando sementes Selecionadas e fertilizante praticamente obrigatórios.

| Propriedade           | Valor                               |
| --------------------- | ----------------------------------- |
| **ID**                | `woc:tomatoes`                      |
| **Estágios de Crec.** | 8 (0–7)                             |
| **Tempo de Crec.**    | 56 dias no jogo (~18,7 horas reais) |
| **Faixa Hidratação**  | 5–7 (muito estreita)                |
| **Faixa Temperatura** | 15–30°C                             |
| **Drops Base**        | 4 Tomates + 2 Sementes              |
| **Prob. Ervas**       | 18% ⚠️                              |
| **Biomas Preferidos** | Planície, Savana, Selva, Floresta   |

> 💡 **Dica**: A faixa estreita de hidratação do tomate (5–7) exige precisão na colocação de água. Úmido demais e apodrece, seco demais e murcha. Use o Inspetor de Culturas constantemente.

![Screenshot_Tomatoes](../../assets/agriculture_update_2/tomatoes.png)

---

### 🥬 Repolhos

Uma potência de clima frio. Os repolhos prosperam em temperaturas onde a maioria das culturas morreria, tornando-os o complemento perfeito das Beterrabas em biomas gelados. Também são ingrediente-chave para muitas receitas culinárias.

| Propriedade           | Valor                             |
| --------------------- | --------------------------------- |
| **ID**                | `woc:cabbages`                    |
| **Estágios de Crec.** | 8 (0–7)                           |
| **Tempo de Crec.**    | 72 dias no jogo (~24 horas reais) |
| **Faixa Hidratação**  | 4–8                               |
| **Faixa Temperatura** | -10 a 15°C                        |
| **Drops Base**        | 1 Repolho + 2 Sementes            |
| **Prob. Ervas**       | 2%                                |
| **Biomas Preferidos** | Taiga, Arvoredo, Prado, Frios     |

> 💡 **Dica**: Os repolhos têm o maior tempo de crescimento entre as culturas base (72 dias). Planeje com antecedência e use fertilizante para acelerar. Seu baixo risco de ervas daninhas os torna muito fáceis de manter uma vez plantados.

![Screenshot_Cabbages](../../assets/agriculture_update_2/cabbages.png)

---

### 🧅 Cebolas

Uma cultura versátil de clima temperado que funciona como cenouras — a cebola colhida é replantada. Cebolas aparecem em muitas receitas, tornando-as um ingrediente básico que você sempre vai querer ter em estoque.

| Propriedade           | Valor                               |
| --------------------- | ----------------------------------- |
| **ID**                | `woc:onions`                        |
| **Estágios de Crec.** | 4 (0–3)                             |
| **Tempo de Crec.**    | 64 dias no jogo (~21,3 horas reais) |
| **Faixa Hidratação**  | 3–7                                 |
| **Faixa Temperatura** | 5–25°C                              |
| **Drops Base**        | 3 Cebolas                           |
| **Prob. Ervas**       | 6%                                  |
| **Biomas Preferidos** | Planície, Prado, Floresta           |

> 💡 **Dica**: Como cenouras e batatas, cebolas usam a própria cultura como semente. Replante pelo menos uma de cada colheita para manter seu suprimento.

![Screenshot_Onions](../../assets/agriculture_update_2/onions.png)

---

### 🍚 Arroz — Cultura Aquática

O arroz introduz a primeira **Cultura Aquática** do addon — uma categoria completamente nova. Diferente de todas as outras culturas, o arroz **NÃO** cresce em terra arada. Deve ser plantado em blocos de **terra, lama ou grama** que estejam **submersos em água**.

| Propriedade           | Valor                                     |
| --------------------- | ----------------------------------------- |
| **ID**                | `woc:rices`                               |
| **Estágios de Crec.** | 5 base + 4 panícula                       |
| **Tempo de Crec.**    | 64 dias no jogo (~21,3 horas reais)       |
| **Faixa Temperatura** | 18–34°C                                   |
| **Drops Base**        | 1 Panícula de Arroz + 1 Semente           |
| **Solos Válidos**     | Terra, Lama, Bloco de Grama               |
| **Biomas Preferidos** | Pântano, Selva, Rio, Cavernas Exuberantes |

#### Como o Arroz Cresce

O arroz tem um sistema único de **crescimento em dois blocos**:

```
     Fase 1: Base              Fase 2: Panícula
    ┌──────────┐              ┌──────────┐
    │          │              │ 🌾 Panícula│  ← Parte coletável
    │~~Água~~~~│              │~~Água~~~~~│
    │ 🌱 Base  │              │ 🌿 Base   │  ← Submersa na água
    │  [Solo]  │              │  [Solo]   │
    └──────────┘              └──────────┘
    70% do tempo               30% do tempo
```

1. **Plante** a panícula de arroz em terra/lama/grama submersa em água
2. A **base** cresce por 5 estágios debaixo d'água (70% do tempo)
3. Quando a base amadurece, brota uma **panícula** acima do nível da água
4. A panícula cresce por 4 estágios (30% do tempo)
5. **Colha** a panícula madura para obter Panículas de Arroz e sementes
6. Quebrar qualquer um dos dois blocos destrói ambos

#### Construindo um Arrozal

> 🌊 O arrozal ideal é uma piscina rasa (1 bloco de profundidade) de água sobre terra ou lama, em um bioma quente (Pântano, Selva, Rio). Você pode aplicar fertilizante diretamente no bloco base para aumentar a colheita.

![Screenshot_Rice](../../assets/agriculture_update_2/rices_1.png)
![Screenshot_Rice2](../../assets/agriculture_update_2/rices_underwater.png)

#### Processamento do Arroz

Panículas de Arroz cruas devem ser **debulhadas** antes de cozinhar:

| Entrada                            | Estação           | Resultado |
| ---------------------------------- | ----------------- | --------- |
| 1× Panícula de Arroz (Selvagem)    | Cortador de Pedra | 1× Arroz  |
| 1× Panícula de Arroz (Selecionada) | Cortador de Pedra | 2× Arroz  |

---

## 🍳 Culinária e Receitas

Agriculture Update II introduz **29 novos alimentos** em múltiplas categorias. Cozinhar não é só diversão — o sistema de dieta faz cada escolha de comida impactar seu desempenho em combate.

![Screenshot_Cooking](../../assets/agriculture_update_2/cooking.png)

---

### 🥩 Ingredientes Base

Estes são itens intermediários usados em receitas mais complexas.

<details>
<summary><b>🥩 Bacon (Clique para expandir)</b></summary>

| Propriedade | Valor                                                              |
| ----------- | ------------------------------------------------------------------ |
| **Receita** | 1× Costeleta de Porco Crua → 2× Bacon                              |
| **Estação** | Cortador de Pedra                                                  |
| **Uso**     | Ingrediente para sanduíches, cozinhe na fornalha para Bacon Cozido |

</details>

<details>
<summary><b>🍳 Ovo Frito (Clique para expandir)</b></summary>

| Propriedade | Valor                                        |
| ----------- | -------------------------------------------- |
| **Receita** | 1× Ovo → 1× Ovo Frito                        |
| **Estação** | Fornalha / Defumador                         |
| **Uso**     | Ingrediente para sanduíches e Bacon com Ovos |

</details>

<details>
<summary><b>🥬 Folha de Repolho (Clique para expandir)</b></summary>

| Propriedade | Valor                                                          |
| ----------- | -------------------------------------------------------------- |
| **Receita** | 1× Repolho → 2× Folha de Repolho                               |
| **Estação** | Mesa de Craft                                                  |
| **Uso**     | Ingrediente-chave para charutos, bolinhos, sanduíches, saladas |

</details>

<details>
<summary><b>🫓 Massa de Trigo (Clique para expandir)</b></summary>

| Propriedade | Valor                                                             |
| ----------- | ----------------------------------------------------------------- |
| **Receita** | 8× Trigo + 1× Balde de Água → 3× Massa de Trigo (+ devolve Balde) |
| **Estação** | Mesa de Craft (com forma)                                         |
| **Uso**     | Ingrediente para Pão e Bolinhos                                   |

</details>

<details>
<summary><b>🥓 Bacon Cozido (Clique para expandir)</b></summary>

| Propriedade | Valor                                                |
| ----------- | ---------------------------------------------------- |
| **Receita** | 1× Bacon → 1× Bacon Cozido                           |
| **Estação** | Fornalha / Defumador                                 |
| **Uso**     | Ingrediente para Sanduíche de Bacon e Bacon com Ovos |

</details>

<details>
<summary><b>🍼 Garrafa de Leite (Clique para expandir)</b></summary>

| Propriedade | Valor                                                                          |
| ----------- | ------------------------------------------------------------------------------ |
| **Receita** | 8× Frasco de Vidro + 1× Balde de Leite → 8× Garrafa de Leite (+ devolve Balde) |
| **Estação** | Mesa de Craft (com forma)                                                      |
| **Uso**     | Fonte de nutrientes lácteos, empilhável até 16                                 |

</details>

<details>
<summary><b>🍞 Pão (Nova Receita) (Clique para expandir)</b></summary>

| Propriedade | Valor                                                                    |
| ----------- | ------------------------------------------------------------------------ |
| **Receita** | 1× Massa de Trigo → 1× Pão                                               |
| **Estação** | Fornalha / Defumador                                                     |
| **Nota**    | Substitui a receita vanilla do pão. Agora requer Massa de Trigo primeiro |

</details>

---

### 🥪 Sanduíches

Refeições portáteis e empilháveis, perfeitas para aventuras. Todos empilham até 64.

<details>
<summary><b>🥪 Todas as Receitas de Sanduíches (Clique para expandir)</b></summary>

| Sanduíche                  | Ingredientes                                    | Resultado              |
| -------------------------- | ----------------------------------------------- | ---------------------- |
| 🥚 **Sanduíche de Ovo**    | Ovo Frito + Pão                                 | 2× Sanduíche de Ovo    |
| 🐔 **Sanduíche de Frango** | Frango Cozido + Pão + Folha de Repolho + Tomate | 2× Sanduíche de Frango |
| 🥓 **Sanduíche de Bacon**  | Bacon Cozido + Pão + Folha de Repolho + Tomate  | 2× Sanduíche de Bacon  |

Todos fabricados na **Mesa de Craft** (sem forma).

![Screenshot_Sandwiches](../../assets/agriculture_update_2/sandwiches.png)
![ScreenshotChickenSandwich](../../assets/agriculture_update_2/craftings/chicken_sandwich.png)
![ScreenshotEggSandwich](../../assets/agriculture_update_2/craftings/egg_sandwich.png)
![ScreenBaconSandwich](../../assets/agriculture_update_2/craftings/bacon_sandwich.png)

</details>

---

### 🥣 Pratos com Tigela e Ensopados

Refeições fartas servidas em tigelas. Empilham até 16 e devolvem a tigela ao serem comidas.

<details>
<summary><b>🥩 Ensopados de Carne (Clique para expandir)</b></summary>

| Prato                    | Ingredientes                                    | Estação       |
| ------------------------ | ----------------------------------------------- | ------------- |
| 🥩 **Ensopado de Carne** | Tigela + Carne Cozida + Batata Assada + Cenoura | Mesa de Craft |
| 🍗 **Sopa de Frango**    | Tigela + Frango Cozido + Cenoura + Cebola       | Mesa de Craft |
| 🥓 **Bacon com Ovos**    | Tigela + Bacon Cozido + Ovo Frito               | Mesa de Craft |
| 🦴 **Caldo de Osso**     | Tigela + Osso + Cebola                          | Mesa de Craft |
| 🥩 **Bife com Batatas**  | Tigela + Carne Cozida + Batata Assada           | Mesa de Craft |

![Screenshot_MeatStews](../../assets/agriculture_update_2/meat_stews.png)
![ScreenshotBeefStew](../../assets/agriculture_update_2/craftings/beef_stew.png)
![ScreenshotChickenSoup](../../assets/agriculture_update_2/craftings/chicken_soup.png)
![ScreenshotBaconAndEggs](../../assets/agriculture_update_2/craftings/bacon_and_eggs.png)
![ScreenshotBoneBroth](../../assets/agriculture_update_2/craftings/bone_broth.png)
![ScreenshotBeefAndPotato](../../assets/agriculture_update_2/craftings/beef_and_potato.png)

</details>

<details>
<summary><b>🐟 Ensopados de Peixe (Clique para expandir)</b></summary>

| Prato                       | Ingredientes                                      | Estação       |
| --------------------------- | ------------------------------------------------- | ------------- |
| 🐟 **Ensopado de Peixe**    | Tigela + Salmão Cozido + Batata Assada + Cebola   | Mesa de Craft |
| 🐟 **Ensopado de Bacalhau** | Tigela + Bacalhau Cozido + Batata Assada + Tomate | Mesa de Craft |

![Screenshot_FishStews](../../assets/agriculture_update_2/fish_stews.png)
![ScreenshotFishStew](../../assets/agriculture_update_2/craftings/fish_stew.png)
![ScreenshotBakedCodStew](../../assets/agriculture_update_2/craftings/baked_cod_stew.png)

</details>

<details>
<summary><b>🥗 Tigelas de Vegetais e Arroz (Clique para expandir)</b></summary>

| Prato                      | Ingredientes                                         | Estação       |
| -------------------------- | ---------------------------------------------------- | ------------- |
| 🍚 **Arroz Cozido**        | Tigela + 2× Arroz                                    | Mesa de Craft |
| 🍳 **Arroz Frito**         | Tigela + Arroz + Ovo + Cebola                        | Mesa de Craft |
| 🍄 **Arroz com Cogumelos** | Tigela + Arroz + Cogumelo Marrom + Cogumelo Vermelho | Mesa de Craft |
| 🥗 **Salada Mista**        | Tigela + Folha de Repolho + Cenoura + Tomate         | Mesa de Craft |
| 🍅 **Molho de Tomate**     | Tigela + 2× Tomate + Cebola                          | Mesa de Craft |
| 🎃 **Sopa de Abóbora**     | Tigela + Abóbora + Cebola                            | Mesa de Craft |
| 🥬 **Sopa de Legumes**     | Tigela + Folha de Repolho + Cenoura + Cebola         | Mesa de Craft |

![Screenshot_VegetableBowls](../../assets/agriculture_update_2/vegetable_bowls.png)
![ScreenshotCookedRice](../../assets/agriculture_update_2/craftings/cooked_rice.png)
![ScreenshotFriedRice](../../assets/agriculture_update_2/craftings/fried_rice.png)
![ScreenshotMushroomRice](../../assets/agriculture_update_2/craftings/mushroom_rice.png)
![ScreenshotMixedSalad](../../assets/agriculture_update_2/craftings/mixed_salad.png)
![ScreenshotPumpkinSoup](../../assets/agriculture_update_2/craftings/pumpkin_soup.png)
![ScreenshotVegetableSoup](../../assets/agriculture_update_2/craftings/vegetable_soup.png)

</details>

---

### 🥟 Outras Receitas

<details>
<summary><b>🥟 Bolinhos — 5 Variantes (Clique para expandir)</b></summary>

Todos usam a mesma base: **Folha de Repolho + Massa de Trigo + Carne Cozida** → 2× Bolinhos

| Variante             | Carne Utilizada           |
| -------------------- | ------------------------- |
| Bolinhos de Carne    | Carne Cozida              |
| Bolinhos de Frango   | Frango Cozido             |
| Bolinhos de Carneiro | Carneiro Cozido           |
| Bolinhos de Porco    | Costeleta de Porco Cozida |
| Bolinhos de Coelho   | Coelho Cozido             |

Fabricados na **Mesa de Craft** (sem forma).

![Screenshot_Dumplings](../../assets/agriculture_update_2/craftings/dumplings/dp_from_beef.png)
![Screenshot_Dumplings](../../assets/agriculture_update_2/craftings/dumplings/dp_from_chicken.png)
![Screenshot_Dumplings](../../assets/agriculture_update_2/craftings/dumplings/dp_from_mutton.png)
![Screenshot_Dumplings](../../assets/agriculture_update_2/craftings/dumplings/dp_from_porkchop.png)
![Screenshot_Dumplings](../../assets/agriculture_update_2/craftings/dumplings/dp_from_rabbit.png)

</details>

<details>
<summary><b>🥬 Charutos de Repolho — 5 Variantes (Clique para expandir)</b></summary>

Todos usam: **Folha de Repolho + Vegetal** → 2× Charutos de Repolho

| Variante              | Recheio   |
| --------------------- | --------- |
| Charutos de Beterraba | Beterraba |
| Charutos de Cenoura   | Cenoura   |
| Charutos de Cebola    | Cebola    |
| Charutos de Batata    | Batata    |
| Charutos de Tomate    | Tomate    |

Fabricados na **Mesa de Craft** (sem forma).

![Screenshot_CabbageRolls](../../assets/agriculture_update_2/craftings/cabbage_rolls/cr_from_beetroot.png)
![Screenshot_CabbageRolls](../../assets/agriculture_update_2/craftings/cabbage_rolls/cr_from_carrot.png)
![Screenshot_CabbageRolls](../../assets/agriculture_update_2/craftings/cabbage_rolls/cr_from_onion.png)
![Screenshot_CabbageRolls](../../assets/agriculture_update_2/craftings/cabbage_rolls/cr_from_potato.png)
![Screenshot_CabbageRolls](../../assets/agriculture_update_2/craftings/cabbage_rolls/cr_from_tomato.png)

</details>

---

## 🥗 Sistema de Dieta e Nutrição

A peça central da Agriculture Update II. Cada alimento que você come contribui para **7 grupos de nutrientes**, e seu equilíbrio nutricional afeta diretamente sua **saúde máxima, dano de ataque e resistência a dano**.

Este sistema recompensa a **variedade alimentar** e penaliza hábitos alimentares monótonos.

![Screenshot_DietSystem](../../assets/agriculture_update_2/diet_system.png)

---

### 📊 Os 7 Grupos de Nutrientes

| #   | Nutriente        | Ícone | Taxa de Queima      | Descrição                                   |
| --- | ---------------- | ----- | ------------------- | ------------------------------------------- |
| 0   | 🍎 **Frutas**    | 🔴    | Rápida (1,4×)       | Maçãs, frutas vermelhas, fatias de melancia |
| 1   | 🥩 **Proteínas** | 🟠    | Lenta (0,9×)        | Carne, peixe, ovos                          |
| 2   | 🥬 **Legumes**   | 🟢    | Normal (1,1×)       | Cenouras, repolhos, cebolas, tomates        |
| 3   | 🌾 **Grãos**     | 🟡    | Normal (1,0×)       | Pão, arroz, alimentos à base de trigo       |
| 4   | 🍬 **Açúcares**  | 🟣    | Muito Rápida (1,6×) | Biscoitos, bolo, mel, alimentos dourados    |
| 5   | 🥛 **Lácteos**   | ⬜    | Lenta (0,7×)        | Garrafas de leite                           |
| 6   | 🧈 **Gorduras**  | ⬛    | Muito Lenta (0,6×)  | Bacon, carnes cozidas, alimentos gordurosos |

> Cada nutriente vai de **0% a 100%**. Mais alto é melhor — mas manter todos equilibrados é o verdadeiro desafio.

---

### ⚙️ Como a Digestão Funciona

Seu corpo não processa todos os nutrientes igualmente. O sistema simula digestão realista:

#### Alimentação e Absorção

- Quando você come, os nutrientes do alimento são **adicionados ao seu perfil**
- Um **histórico de 20 alimentos recentes** é rastreado
- **Penalidade por repetição**: comer o mesmo alimento repetidamente reduz sua eficácia em 10% por repetição nas últimas 10 refeições (mínimo de 20% de eficácia)
- Isso significa que **comer alimentos variados é significativamente mais eficaz** do que comer bife sem parar

#### Queima de Nutrientes (Digestão)

- A cada **~20 segundos**, seu corpo queima aleatoriamente 1–3 nutrientes
- **Açúcares queimam mais rápido** (1,6×), **Gorduras mais devagar** (0,6×)
- Atividade física acelera a queima: sprint (×2,5), nadar (×2,0), escalar (×1,8)
- Temperaturas extremas aumentam o consumo de nutrientes (seu corpo trabalha mais)

#### Sinergias

- Se Açúcares + Grãos estão ambos altos (>40%), Proteína e Gordura queimam 50% mais devagar (seu corpo tem energia rápida disponível)
- Atividade intensa (sprint) acelera a queima de Frutas e Açúcares especificamente

---

### 💪 Buffs e Debuffs

Seu equilíbrio nutricional produz três estatísticas relevantes para combate. São recalculadas a cada **~60 segundos**.

#### ❤️ Saúde Máxima (10–40 HP)

| Peso do Nutriente | Contribuição |
| ----------------- | ------------ |
| Açúcares          | 30%          |
| Frutas            | 25%          |
| Legumes           | 20%          |
| Grãos             | 15%          |
| Lácteos           | 5%           |
| Gorduras          | 5%           |

| Qualidade da Dieta | HP Máx    | Corações  |
| ------------------ | --------- | --------- |
| Fome               | 10 HP     | 5 ❤️      |
| Pobre              | 14–18 HP  | 7–9 ❤️    |
| **Normal**         | **20 HP** | **10 ❤️** |
| Boa                | 24–28 HP  | 12–14 ❤️  |
| Excelente          | 32–40 HP  | 16–20 ❤️  |

#### ⚔️ Dano de Ataque (×0,6 – ×1,6)

| Peso do Nutriente | Contribuição |
| ----------------- | ------------ |
| Proteínas         | 40%          |
| Grãos             | 25%          |
| Frutas            | 15%          |
| Açúcares          | 10%          |
| Legumes           | 10%          |

Um guerreiro bem alimentado causa até **60% mais dano**. Um desnutrido causa **40% menos**.

#### 🛡️ Resistência a Dano (×0,6 – ×1,4)

| Peso do Nutriente | Contribuição |
| ----------------- | ------------ |
| Gorduras          | 35%          |
| Lácteos           | 25%          |
| Proteínas         | 20%          |
| Grãos             | 10%          |
| Legumes           | 10%          |

Com Gorduras e Lácteos altos, o dano recebido é reduzido em até **40%**. Negligenciá-los aumenta o dano recebido em **40%**.

> ⚠️ **Fator de Equilíbrio**: Maximizar apenas um nutriente enquanto ignora os outros suprime seus buffs. O sistema usa uma **curva smoothstep** que recompensa dietas equilibradas em vez de maximizar um único nutriente.

> ℹ️ **Nota**: Os debuffs (estatísticas abaixo do normal) podem ser desativados na configuração do addon. Os buffs estão sempre ativos.

---

### 📖 Livro de Dieta

O **Livro de Dieta** é sua janela para o status nutricional. Fabrique-o e segure-o para ver seus 7 níveis de nutrientes na barra de ação.

![Screenshot_DietBook](../../assets/agriculture_update_2/diet_book.png)

---

## ⚖️ Rebalanceamento de Comida Vanilla

Agriculture Update II **rebalanceia todos os alimentos vanilla** para tornar o sistema culinário significativo. Alimentos vanilla agora fornecem significativamente menos nutrição e saturação.

<details>
<summary><b>📊 Mudanças Completas da Comida Vanilla (Clique para expandir)</b></summary>

| Alimento                  | Nutrição Original | Nova Nutrição | Mudança |
| ------------------------- | ----------------- | ------------- | ------- |
| Carne Cozida              | 8                 | 3             | -62%    |
| Costeleta de Porco Cozida | 8                 | 3             | -62%    |
| Frango Cozido             | 6                 | 3             | -50%    |
| Carneiro Cozido           | 6                 | 3             | -50%    |
| Pão                       | 5                 | 3             | -40%    |
| Batata Assada             | 5                 | 2             | -60%    |
| Salmão Cozido             | 6                 | 3             | -50%    |
| Bacalhau Cozido           | 5                 | 3             | -40%    |
| Maçã                      | 4                 | 2             | -50%    |
| Cenoura                   | 3                 | 1             | -67%    |
| Batata                    | 1                 | 1             | —       |
| Beterraba                 | 1                 | 1             | —       |

> 💡 **Por quê?** Um simples bife não deveria ser tão eficaz quanto um Ensopado de Carne cuidadosamente preparado com batatas e cenouras. Este rebalanceamento cria uma curva de progressão onde cozinhar se torna uma vantagem genuína de sobrevivência.

</details>

---

## 🏪 Trades do Fazendeiro Atualizados

Os Villagers Fazendeiros agora oferecem trocas por todas as novas culturas e sementes no **Tier 4** (requer 150 XP).

<details>
<summary><b>🏪 Novas Trocas do Fazendeiro — Tier 4 (Clique para expandir)</b></summary>

#### Compra (O Fazendeiro compra de você)

| Cultura | Quantidade | Preço       |
| ------- | ---------- | ----------- |
| Tomate  | 20         | 1 Esmeralda |
| Repolho | 12         | 1 Esmeralda |
| Cebola  | 22         | 1 Esmeralda |
| Arroz   | 26         | 1 Esmeralda |

#### Venda (O Fazendeiro vende para você)

| Semente                     | Preço        |
| --------------------------- | ------------ |
| Sementes de Tomate Seletas  | 6 Esmeraldas |
| Sementes de Repolho Seletas | 6 Esmeraldas |
| Cebola Seleta               | 6 Esmeraldas |
| Panícula de Arroz Seleta    | 6 Esmeraldas |

</details>

---

## 💡 Dicas e Estratégias

### 🏆 Estratégias de Dieta

<details>
<summary><b>🌟 Iniciante: Começando com a Nutrição</b></summary>

1. Fabrique um **Livro de Dieta** o mais rápido possível
2. Foque em cultivar **Trigo** (Grãos), **Cenouras** (Legumes), e coletar **Maçãs** (Frutas) primeiro
3. Cozinhe **Pão** com Massa de Trigo para aporte constante de Grãos
4. Prepare **Saladas Mistas** para nutrientes vegetais
5. Não coma o mesmo alimento mais de duas vezes seguidas — variedade é fundamental!

</details>

<details>
<summary><b>🌟 Intermediário: Build de Combate Equilibrado</b></summary>

1. Monte fazendas para as **4 novas culturas** em biomas apropriados
2. Alterne entre **Ensopado de Carne** (Proteína + Grãos), **Salada Mista** (Legumes), e **Frutas** (Maçãs/Frutas Vermelhas)
3. Use **Garrafas de Leite** para Lácteos — fabrique em quantidade
4. Mantenha **Bacon** em estoque para Gorduras
5. Monitore seu Livro de Dieta e atenda qualquer nutriente que caia abaixo de 30%

</details>

<details>
<summary><b>🌟 Avançado: Maximizando Estatísticas de Combate</b></summary>

1. **Para dano máximo**: Priorize Proteínas (ensopados de carne, bolinhos) e Grãos (pão, arroz)
2. **Para HP máximo**: Equilibre Açúcares (biscoitos, mel), Frutas e Legumes
3. **Para resistência máxima**: Acumule Gorduras (bacon) e Lácteos (garrafas de leite)
4. Use **sinergias**: mantenha Açúcares + Grãos acima de 40% para desacelerar a queima de Proteína/Gordura
5. Antes de lutas contra chefes, coma um conjunto diverso de alimentos para preencher todos os nutrientes
6. Explore a penalidade por repetição: alterne entre 5+ tipos diferentes de alimentos

</details>

### ⚠️ Erros Comuns

| Erro                             | Por que é ruim                                            | Solução                              |
| -------------------------------- | --------------------------------------------------------- | ------------------------------------ |
| Comer carne cozida sem parar     | A penalidade por repetição reduz a eficácia               | Alterne entre diferentes alimentos   |
| Ignorar Gorduras e Lácteos       | Recebe 40% mais dano                                      | Coma bacon e garrafas de leite       |
| Não cultivar arroz               | Perde ingrediente-chave para múltiplas receitas           | Construa um arrozal no pântano       |
| Plantar tomates sem fertilizante | 18% de prob. de ervas daninhas vai arruinar sua plantação | Sempre fertilize os campos de tomate |
| Esquecer de debulhar o arroz     | Panículas cruas não servem em receitas                    | Use o cortador de pedra              |

---

<div align="center">

### 📌 Mais Atualizações a Caminho

Agriculture Update II faz parte da série de addons **Wheel of Creation** em desenvolvimento. Fique atento para futuras atualizações que expandirão a jogabilidade ainda mais.

---

**[← Voltar para Agriculture Update I](./AGRICULTURE_UPDATE_I_PORTUGUESE.md)** | **[↑ Voltar ao README Principal](../../README.md)**

---

_Última Atualização: Fevereiro 2026 | Versão 0.0.2 | Agriculture Update II_

**Feito com ❤️ por HormigaDev — Open Source sob GPL-3.0**

![ScreenshotEnd](../../assets/end.png)

</div>

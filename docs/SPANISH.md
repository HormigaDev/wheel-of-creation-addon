<div align="center">

# 🌾 Wheel of Creation: Agriculture Update

### _Una Revolución Agrícola Realista para Minecraft Bedrock_

[![Minecraft](https://img.shields.io/badge/Minecraft-Bedrock%201.21+-green?style=for-the-badge&logo=minecraft)](https://minecraft.net)
[![License](https://img.shields.io/badge/License-GPL%20v3-blue?style=for-the-badge)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-Script%20API-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)

---

**Transforma tu experiencia de agricultura en Minecraft con un sistema agrícola integral que introduce mecánicas climáticas basadas en biomas, genética de cultivos, hidratación del suelo y ciclos de crecimiento de plantas realistas.**

> 🎮 **Inspirado en [TerraFirmaCraft](https://terrafirmacraft.com/)** — Este addon se inspira en algunas mecánicas del popular mod de Java TerraFirmaCraft. Sin embargo, **NO** es un port oficial. Todos los sistemas han sido completamente reimaginados y reinterpretados para Minecraft Bedrock Edition por **HormigaDev**.

[SCREENSHOT 1 - Imagen principal que muestra una granja con varios cultivos en diferentes etapas de crecimiento]

</div>

---

<div align="center">

### 🚧 Agriculture Update I — ¡Más próximamente!

Esta es la **primera versión** de la serie Agriculture Update. Mantente atento a la **Agriculture Update II**, que introducirá:

🥗 **Sistema de Dieta y Nutrición** | 🍳 **Recetas de Cocina** | 🌽 **Nuevas Variedades de Cultivos** | 🥧 **Procesamiento de Alimentos**

</div>

---

## 📋 Tabla de Contenidos

- [Resumen](#-resumen)
- [Características Clave](#-características-clave)
- [Primeros Pasos](#-primeros-pasos)
- [Mecánicas de Juego](#-mecánicas-de-juego)
    - [Sistema de Clima](#-sistema-de-clima)
    - [Suelo e Hidratación](#-suelo--hidratación)
    - [Tipos de Cultivos](#-tipos-de-cultivos)
    - [Sistema de Calidad de Cultivos](#-sistema-de-calidad-de-cultivos)
    - [Compostador Mejorado](#-compostador-mejorado)
    - [Inspector de Cultivos](#-inspector-de-cultivos)
- [Guía de Referencia de Cultivos](#-guía-de-referencia-de-cultivos)
- [Compatibilidad de Biomas](#-compatibilidad-de-biomas)
- [Consejos y Estrategias](#-consejos--estrategias)
- [Instalación](#-instalación)
- [Créditos](#-créditos)

---

## 🌍 Resumen

**Wheel of Creation: Agriculture Update** reimagina el sistema de cultivo de Minecraft desde cero. Se acabaron los días de usar polvo de hueso sin pensar y tener tierras de cultivo infinitas. Este addon introduce una sofisticada simulación agrícola donde:

- 🌡️ **La temperatura importa** — Los cultivos tienen rangos de temperatura óptimos y pueden morir por calor o frío extremo.
- 💧 **La hidratación es dinámica** — La humedad del suelo fluctúa según el bioma, el clima y la proximidad al agua.
- 🧬 **La genética afecta el rendimiento** — Las semillas "Silvestres" vs "Selectas" producen resultados dramáticamente diferentes.
- 🌿 **La maleza compite** — Los cultivos descuidados pueden ser invadidos por plantas invasoras.
- 🍂 **Los cultivos pueden fallar** — La sequía, la podredumbre y las temperaturas extremas pueden matar tus plantas.
- ⏰ **Crecimiento Offline** — ¡Los cultivos crecen incluso con los chunks descargados! ¡Explora libremente!

[SCREENSHOT 2 - Comparación lado a lado: Granja Vanilla vs Granja Natural Order]

---

<div align="center">

### ⏰ CRECIMIENTO OFFLINE REAL — ¡Un Cambio Revolucionario!

</div>

> 🚀 **¡No necesitas quedarte cerca de tu granja!** A diferencia del Minecraft vanilla, los cultivos en este addon **crecen incluso cuando los chunks están descargados**. Dado que los tiempos de crecimiento son realísticamente largos (días a semanas), puedes explorar el mundo libremente, ir a minar o embarcarte en aventuras. Cuando regreses y el juego asigne un random tick al bloque del cultivo, **calculará automáticamente todo el tiempo transcurrido** y determinará:
>
> - ✅ Cuántas etapas de crecimiento deberían haber pasado
> - ✅ Si el cultivo ya debería estar maduro
> - ✅ Si las condiciones ambientales causaron su muerte durante tu ausencia
>
> **Esto NO es un detalle menor** — ¡cambia completamente cómo puedes jugar!

---

<div align="center">

### 🌐 ¡PERFECTO PARA SERVIDORES MULTIJUGADOR!

</div>

> 🎮 **¡Dale propósito al rol de Granjero!** Este addon es ideal para **servidores multijugador** (probado en servidores de terceros, **aún no probado en Realms**). Las mecánicas realistas de agricultura crean una necesidad genuina de granjeros dedicados:
>
> - 👨‍🌾 **Los jugadores granjeros se vuelven esenciales** — No cualquiera puede cultivar eficientemente
> - 📈 **Crea economías impulsadas por jugadores** — Los granjeros pueden comerciar sus valiosas cosechas
> - 🏘️ **Fomenta la especialización** — Algunos cultivan, otros exploran, otros construyen
> - 🤝 **Promueve la cooperación comunitaria** — Las aldeas necesitan granjeros para prosperar
>
> **¡Transforma la economía de tu servidor con una jugabilidad agrícola significativa!**

---

## ✨ Características Clave

<table>
<tr>
<td width="50%">

### 🌡️ Clima basado en Biomas

Cada bioma tiene características únicas:

- Humedad base (0-10)
- Temperatura (°C)
- Tasa de evaporación
- Probabilidad de podredumbre
- Probabilidad de maleza
- Sensibilidad a la lluvia

</td>
<td width="50%">

### 💧 Sistema de Suelo Dinámico

El bloque de tierra de cultivo personalizado rastrea:

- Nivel de hidratación (0-10)
- Nivel de fertilizante (0-10)
- Cambios visuales de textura
- Respuesta al clima

</td>
</tr>
<tr>
<td>

### 🌱 Ciclos de Crecimiento Realistas

Los cultivos tardan tiempo real en madurar:

- Trigo: ~48 días de juego
- Patatas: ~60 días de juego
- Calabazas/Sandías: Ciclos de ~64 días (tallo + fruto)
- Velocidad afectada por las condiciones

</td>
<td>

### 🧬 Sistema de Genética de Semillas

Dos niveles de calidad para las semillas:

- **Silvestre (Estándar)**: Menor rendimiento, mayor riesgo de maleza.
- **Selecta (Premium)**: Mayor rendimiento, resistencia a enfermedades.

</td>
</tr>
</table>

[SCREENSHOT 3 - Inspector de Cultivos mostrando estadísticas detalladas de un cultivo sano]

---

## 🚀 Primeros Pasos

### Primeros Pasos

1. **Crea una Azada** — Cualquier azada funcionará.
2. **Labra el Suelo** — Usa la azada en bloques de hierba/tierra para crear `woc:farmland`.
3. **Revisa las Condiciones** — Fabrica un **Inspector de Cultivos** para analizar el suelo y el clima.
4. **Elige Sabiamente** — Planta cultivos adecuados para la temperatura y humedad de tu bioma.
5. **Mantén tu Granja** — Aplica fertilizante, asegura fuentes de agua y monitorea la salud.

[SCREENSHOT 4 - Jugador usando una azada para crear tierra de cultivo]

### Consejos Rápidos para Principiantes

> ⚠️ **Importante**: Las semillas estándar de Minecraft (`minecraft:wheat_seeds`) producen cultivos "Silvestres". Para obtener mejores rendimientos, necesitas obtener semillas "Selectas" a través de un cultivo cuidadoso.

---

## ⚙️ Mecánicas de Juego

### 🌡️ Sistema de Clima

Cada bioma en Minecraft tiene ahora un perfil climático completo que afecta al cultivo:

```
┌─────────────────────────────────────────────────────────────┐
│ ESTRUCTURA DE DATOS DEL BIOMA │
├─────────────────────────────────────────────────────────────┤
│ [0] Humedad Base (0-10) - Humedad inicial suelo │
│ [1] Temperatura (°C) - Supervivencia cultivo │
│ [2] Factor Evaporación (0-1) - Prob. pérdida de agua │
│ [3] Factor Podredumbre (0-1) - Prob. de enfermedad │
│ [4] Prob. de Maleza (0-1) - Riesgo plantas parásitas│
│ [5] Sensibilidad Lluvia (0-1) - Impacto del clima │
└─────────────────────────────────────────────────────────────┘
```

#### Ejemplos de Clima:

| Bioma             | Humedad | Temp (°C) | Evap. | Podr. | Maleza | Sens. Lluvia |
| ----------------- | :-----: | :-------: | :---: | :---: | :----: | :----------: |
| 🏜️ Desierto       |    0    |    45     |  40%  |  0%   |   0%   |     90%      |
| 🌴 Jungla         |    9    |    30     |  0%   |  3%   |  12%   |     80%      |
| 🌲 Taiga          |    6    |     5     |  2%   |  1%   |   2%   |     40%      |
| 🌻 Llanuras       |    5    |    18     |  2%   |  1%   |   5%   |     40%      |
| ❄️ Picos Helados  |    0    |    -25    |  25%  |  0%   |   0%   |      0%      |
| 🍄 Isla Champiñón |   10    |    20     |  0%   |  5%   |   8%   |     90%      |

[SCREENSHOT 5 - Mismo cultivo plantado en desierto vs jungla mostrando diferente salud]

---

### 💧 Suelo e Hidratación

El bloque de **Tierra de Cultivo** personalizado (`woc:farmland`) es la base de la agricultura. Rastrea y muestra activamente los niveles de humedad.

#### Mecánicas de Hidratación

- **Fuentes de Agua**: Cada bloque de agua a 3 bloques de distancia añade +2 de hidratación (máx +4).
- **Altitud**: Las altitudes altas reducen la humedad, las bajas la aumentan.
- **Clima**: La lluvia aumenta la hidratación en la mayoría de los biomas (efecto reducido en zonas áridas).
- **Temperatura**: Las temperaturas altas (>35°C) reducen la hidratación en 2.

#### Retroalimentación Visual

| Nivel de Hidratación | Apariencia                       |
| :------------------: | -------------------------------- |
|         0-7          | Textura seca (aspecto agrietado) |
|         8-10         | Textura húmeda (suelo oscuro)    |

[SCREENSHOT 6 - Tierra de cultivo mostrando texturas seca y húmeda lado a lado]

#### Sistema de Fertilizante

Aplica **Fertilizante** a la tierra de cultivo para potenciar el rendimiento:

- **Nivel Máximo**: 10 unidades por bloque.
- **Efectos**:
    - 🚀 Mayor velocidad de crecimiento.
    - 🌾 Mayor rendimiento de cosecha (+50% por nivel de fertilizante).
    - 🛡️ Probabilidad de maleza reducida.
    - 📈 Vida útil extendida para cultivos de tallo/columna.

> 💡 **Consejo Pro**: El fertilizante se consume gradualmente mientras los cultivos crecen. ¡Revisa tu suelo regularmente!

---

### 🌾 Tipos de Cultivos

El addon presenta tres categorías distintas de cultivos, cada una con mecánicas únicas:

#### 1️⃣ Cultivos Base

_Cultivos tradicionales en hileras que crecen en etapas verticales_

| Cultivo       | Etapas | Tiempo Crec. | Hidro Mín | Hidro Máx | Rango Temp | Biomas Preferidos            |
| ------------- | :----: | :----------: | :-------: | :-------: | :--------: | ---------------------------- |
| 🌾 Trigo      |   7    |   48 días    |     2     |     9     |   5-32°C   | Llanuras, Girasoles, Pradera |
| 🥕 Zanahorias |   3    |   32 días    |     4     |     8     |   8-26°C   | Taiga, Arboleda, Bosque      |
| 🥔 Patatas    |   3    |   60 días    |     4     |     7     |  10-24°C   | Sabana, Colinas, Mesa        |
| 🫒 Remolachas |   3    |   24 días    |     2     |     9     |  -5-18°C   | Nieve, Hielo, Frío           |

[SCREENSHOT 7 - Todos los cultivos base en varias etapas de crecimiento]

#### 2️⃣ Cultivos de Tallo

_Producen múltiples frutos a lo largo de su vida_

| Cultivo     | Crec. Tallo | Ciclo Fruto | Frutos Mín | Frutos Máx | Biomas Preferidos         |
| ----------- | :---------: | :---------: | :--------: | :--------: | ------------------------- |
| 🎃 Calabaza |   64 días   |   10 días   |     3      |     8      | Llanuras, Bosque, Pradera |
| 🍈 Sandía   |   64 días   |   8 días    |     4      |     10     | Jungla, Pantano, Río      |

**Ciclo de Vida del Cultivo de Tallo**:

1. Plantar semilla → El tallo crece a través de 7 etapas.
2. Al madurar → El tallo produce frutos en bloques adyacentes.
3. El tallo sigue produciendo hasta alcanzar su vida útil máxima.
4. Las semillas de calidad producen más frutos durante un período más largo.

[SCREENSHOT 8 - Tallo de calabaza maduro con fruto apareciendo]

#### 3️⃣ Cultivos de Columna

_Plantas de crecimiento vertical con requisitos únicos_

| Cultivo        | Altura Máx |   Tiempo Crec.   | Agua Requerida | Biomas Preferidos           |
| -------------- | :--------: | :--------------: | :------------: | --------------------------- |
| 🎋 Caña Azúcar | 3 bloques  | 16 días/segmento |  ✅ Adyacente  | Pantano, Jungla, Río, Playa |

**Mecánicas de Cultivo de Columna**:

- El bloque inferior es el "cerebro" que controla el crecimiento.
- Nuevos segmentos aparecen arriba hasta la altura máxima.
- Requiere fuente de agua adyacente (o tierra de cultivo con alta hidratación).
- Cada raíz puede producir segmentos limitados antes de morir.

[SCREENSHOT 9 - Caña de azúcar creciendo cerca de una fuente de agua]

---

### 🧬 Sistema de Calidad de Cultivos

Una de las características más importantes es el sistema de **calidad genética**:

<table>
<tr>
<th width="50%">🌿 Calidad Silvestre</th>
<th width="50%">⭐ Calidad Selecta</th>
</tr>
<tr>
<td>

- Obtenida de semillas vainilla de Minecraft.
- **70% de velocidad de crecimiento**.
- **50% de rendimiento base**.
- Mayor susceptibilidad a maleza (100%).
- Mayor susceptibilidad a podredumbre (200%).
- Menor producción de frutos en tallos.
- 50% prob. de soltar semillas Selectas al cosechar.

</td>
<td>

- Obtenida de semillas con prefijo `woc:`.
- **100% de velocidad de crecimiento**.
- **100%+ de rendimiento base**.
- Susceptibilidad a maleza reducida (5-10%).
- Susceptibilidad a podredumbre normal (100%).
- Máxima producción de frutos en tallos.
- Siempre suelta semillas Selectas.

</td>
</tr>
</table>

#### Cómo obtener Semillas Selectas

> 🏆 **Fuente Principal: ¡Aldeanos Agricultores!**
>
> La forma más confiable de obtener semillas Selectas es mediante el **comercio con Aldeanos Agricultores**. Ellos ofrecen semillas Selectas de alta calidad como parte de sus intercambios. ¡Este es el método recomendado para empezar tu colección de semillas premium!

| Tipo de Semilla      | Cómo obtenerla                                      |
| -------------------- | --------------------------------------------------- |
| `woc:wheat_seeds`    | 🏪 **Aldeano Agricultor** o cosecha Silvestre (50%) |
| `woc:beetroot_seeds` | 🏪 **Aldeano Agricultor** o cosecha Silvestre (50%) |
| `woc:carrot`         | 🏪 **Aldeano Agricultor** o cosecha Silvestre (50%) |
| `woc:potato`         | 🏪 **Aldeano Agricultor** o cosecha Silvestre (50%) |
| `woc:melon_seeds`    | 🏪 **Aldeano Agricultor** o cosecha tallo Silvestre |
| `woc:pumpkin_seeds`  | 🏪 **Aldeano Agricultor** o cosecha tallo Silvestre |

> 💡 **Consejo Pro**: ¡Encuentra una aldea pronto y protege a tus Agricultores! Son la clave del éxito agrícola.

[SCREENSHOT 10 - Comparación de cosecha lado a lado: Rendimiento Silvestre vs Selecto]

---

### ♻️ Compostador Mejorado

Un rediseño completo del sistema de compostaje que produce **Fertilizante**:

[SCREENSHOT 11 - Compostador Mejorado en acción con materiales siendo añadidos]

#### Cómo Funciona

El Compostador Mejorado requiere **entradas equilibradas** de dos tipos de materiales:

<table>
<tr>
<th>🟢 Materiales Verdes (Nitrógeno)</th>
<th>🟤 Materiales Marrones (Carbono)</th>
</tr>
<tr>
<td>

**Nivel Alto (100% éxito)**

- Bloque de Sandía, Calabaza
- Bloque de Heno, Pastel

**Nivel Medio (85% éxito)**

- Trigo, Zanahoria, Patata, Remolacha
- Rodaja de Sandía, Cactus, Enredaderas
- Lirio de agua, Todas las Hojas

**Nivel Bajo (50% éxito)**

- Todas las Semillas, Algas
- Hierba, Helecho

</td>
<td>

**Nivel Alto (100% éxito)**

- Tallos de Champiñón
- Bloques de Champiñón

**Nivel Medio (85% éxito)**

- Champiñones Marrones/Rojos
- Tierra Estéril, Podzol
- Arbusto Seco

**Nivel Bajo (50% éxito)**

- Palos
- Raíces colgantes, Algas secas
- Raíces de manglar

</td>
</tr>
</table>

#### Proceso de Compostaje

```
Llenar Ambos Lados Usar Polvo de Hueso Recoger Fertilizante
↓ ↓ ↓
┌────────────────┐ ┌────────────────┐ ┌────────────────┐
│ 🟢🟢🟢🟢 │ │ │ │ │
│ ═══════════ │ → │ ✨ ACTIVAR │ → │ 💚 4-8 Fert. │
│ 🟤🟤🟤🟤 │ │ │ │ │
└────────────────┘ └────────────────┘ └────────────────┘
(4 Verdes + 4 Marrones) (Polvo de Hueso) (Salida aleatoria)
```

#### Indicadores Visuales

- El nivel de llenado sube al añadir materiales.
- Partículas verdes = Éxito con material verde.
- Partículas marrones = Éxito con material marrón.
- Humo = El material falló al compostar.

---

### 🔍 Inspector de Cultivos

El **Inspector de Cultivos** es una herramienta esencial para cualquier granjero serio. Sostenlo en tu mano principal para ver información en tiempo real en la barra de acción.

[SCREENSHOT 12 - Jugador sosteniendo el Inspector de Cultivos mirando diferentes objetivos]

#### Información Mostrada

**Al mirar al cielo/nada:**

```
Bioma: Llanuras 18°C
```

**Al mirar Tierra de Cultivo:**

```
Bioma: Llanuras 18°C
H: 7 F: 3 T: 18°C
Suelo listo para plantar
```

**Al mirar un Cultivo en Crecimiento:**

```
Bioma: Llanuras 18°C
H: 7 F: 3 T: 18°C
| Crecimiento: 45% (3/7) | Salud: Muy Buena (100% Vel.)
```

**Al mirar un Cultivo de Tallo Maduro:**

```
Bioma: Jungla 30°C
H: 9 F: 5 T: 30°C
| Rendimiento: 4 / 8 Frutos (Selecto) | Salud: Óptima (120% Vel.)
```

#### Indicadores de Estado de Salud

| Estado        |    Color     | Significado                                           |
| ------------- | :----------: | ----------------------------------------------------- |
| Óptima        |  🟣 Morado   | Vel. máxima (120%), fertilizado + condiciones ideales |
| Muy Buena     |   🟢 Verde   | Vel. normal (100%), todas las condiciones cumplidas   |
| Buena         | 🟡 Amarillo  | Crecimiento estable, pequeñas imperfecciones          |
| Regular       |  🟠 Naranja  | Condiciones subóptimas                                |
| Mala (Agua)   |   🔴 Rojo    | Falta de agua, crecimiento reducido                   |
| Dormido       |   🔵 Azul    | Demasiado frío, crecimiento pausado                   |
| Fatal (Podr.) | ⚫ Rojo Osc. | Muriendo por exceso de humedad                        |
| Fatal (Seco)  | ⚫ Rojo Osc. | Muriendo por deshidratación                           |
| Fatal (Calor) | ⚫ Rojo Osc. | Muriendo por calor extremo                            |
| Fatal (Frío)  | ⚫ Rojo Osc. | Muriendo por frío extremo                             |

**Al mirar el Compostador Mejorado:**

```
Estado Compostador:
Verde: 3/4 Marrón: 2/4
Añadir materiales...
```

**Al mirar Cultivos Muertos:**

```
Bioma: Desierto 45°C
Trigo Muerto
```

#### Receta de Fabricación

[SCREENSHOT 13 - Receta de fabricación del Inspector de Cultivos]

---

## 📊 Guía de Referencia de Cultivos

### Especificaciones Completas de Cultivos

<details>
<summary><b>🌾 Trigo (Clic para expandir)</b></summary>

| Propiedad             | Valor                               |
| --------------------- | ----------------------------------- |
| **ID**                | `woc:wheat`                         |
| **Etapas Crec.**      | 7                                   |
| **Tiempo Crec.**      | 48 días de juego (~16 horas reales) |
| **Rango Hidratación** | 2-9                                 |
| **Rango Temp.**       | 5-32°C                              |
| **Drops Base**        | 1 Trigo                             |
| **Drops Semilla**     | 2 Semillas                          |
| **Prob. Maleza**      | 5%                                  |
| **Biomas Preferidos** | Llanuras, Girasoles, Pradera        |

**Consejos:**

- El cultivo más versátil, tolera un amplio rango de humedad.
- Excelente para principiantes.
- Crece bien en biomas templados.

</details>

<details>
<summary><b>🥕 Zanahorias (Clic para expandir)</b></summary>

| Propiedad             | Valor                             |
| --------------------- | --------------------------------- |
| **ID**                | `woc:carrots`                     |
| **Etapas Crec.**      | 3                                 |
| **Tiempo Crec.**      | 32 días de juego                  |
| **Rango Hidratación** | 4-8                               |
| **Rango Temp.**       | 8-26°C                            |
| **Drops Base**        | 2 Zanahorias                      |
| **Drops Semilla**     | 0 (usa la zanahoria como semilla) |
| **Prob. Maleza**      | 2%                                |
| **Biomas Preferidos** | Taiga, Arboleda, Pradera, Bosque  |

**Consejos:**

- El bajo riesgo de maleza las hace confiables.
- Prefieren áreas boscosas y frescas.
- Requisitos de humedad medios.

</details>

<details>
<summary><b>🥔 Patatas (Clic para expandir)</b></summary>

| Propiedad             | Valor                               |
| --------------------- | ----------------------------------- |
| **ID**                | `woc:potatoes`                      |
| **Etapas Crec.**      | 3                                   |
| **Tiempo Crec.**      | 60 días de juego (~20 horas reales) |
| **Rango Hidratación** | 4-7                                 |
| **Rango Temp.**       | 10-24°C                             |
| **Drops Base**        | 3 Patatas                           |
| **Drops Semilla**     | 0 (usa la patata como semilla)      |
| **Prob. Maleza**      | 15%                                 |
| **Biomas Preferidos** | Sabana, Colinas, Montaña, Mesa      |

**Consejos:**

- Mayor susceptibilidad a la maleza - ¡usa semillas Selectas!
- Tolerancia a la humedad estrecha.
- Tiempo de crecimiento largo pero alto rendimiento.
- Prospera en biomas secos y elevados.

</details>

<details>
<summary><b>🫒 Remolachas (Clic para expandir)</b></summary>

| Propiedad             | Valor                              |
| --------------------- | ---------------------------------- |
| **ID**                | `woc:beetroots`                    |
| **Etapas Crec.**      | 3                                  |
| **Tiempo Crec.**      | 24 días de juego (~8 horas reales) |
| **Rango Hidratación** | 2-9                                |
| **Rango Temp.**       | -5 a 18°C                          |
| **Drops Base**        | 1 Remolacha                        |
| **Drops Semilla**     | 1 Semilla                          |
| **Prob. Maleza**      | 8%                                 |
| **Biomas Preferidos** | Nieve, Hielo, Frío, Helado         |

**Consejos:**

- ¡Único cultivo que prospera en temperaturas bajo cero!
- El cultivo base de crecimiento más rápido.
- Amplia tolerancia a la humedad.
- Perfecto para granjas en biomas fríos.

</details>

<details>
<summary><b>🎃 Calabaza (Clic para expandir)</b></summary>

| Propiedad              | Valor                                       |
| ---------------------- | ------------------------------------------- |
| **ID**                 | `woc:pumpkin_stem`                          |
| **Etapas Tallo**       | 7                                           |
| **Tiempo Crec. Tallo** | 64 días de juego                            |
| **Ciclo de Fruto**     | 10 días por fruto                           |
| **Rango Hidratación**  | 3-8                                         |
| **Rango Temp.**        | 5-35°C                                      |
| **Frutos Mín/Máx**     | 3-8 por vida útil                           |
| **Prob. Maleza**       | 3%                                          |
| **Biomas Preferidos**  | Llanuras, Bosque, Colinas, Pradera, Montaña |

**Consejos:**

- Rango de temperatura muy flexible.
- Requisitos de agua medios.
- Bajo riesgo de maleza.
- Buena para granjas en tierras altas templadas.

</details>

<details>
<summary><b>🍈 Sandía (Clic para expandir)</b></summary>

| Propiedad              | Valor                |
| ---------------------- | -------------------- |
| **ID**                 | `woc:melon_stem`     |
| **Etapas Tallo**       | 7                    |
| **Tiempo Crec. Tallo** | 64 días de juego     |
| **Ciclo de Fruto**     | 8 días por fruto     |
| **Rango Hidratación**  | 6-9                  |
| **Rango Temp.**        | 18-45°C              |
| **Frutos Mín/Máx**     | 4-10 por vida útil   |
| **Prob. Maleza**       | 8%                   |
| **Biomas Preferidos**  | Jungla, Pantano, Río |

**Consejos:**

- Requiere alta humedad y temperatura.
- Producción de frutos más rápida de los cultivos de tallo.
- Mayor riesgo de maleza - ¡usa fertilizante!
- Prospera en biomas tropicales.

</details>

<details>
<summary><b>🎋 Caña de Azúcar (Clic para expandir)</b></summary>

| Propiedad              | Valor                                 |
| ---------------------- | ------------------------------------- |
| **ID**                 | `woc:column_sugar_cane`               |
| **Altura Máxima**      | 3 bloques                             |
| **Tiempo Crecimiento** | 16 días por segmento                  |
| **Rango Hidratación**  | 8-10                                  |
| **Rango Temp.**        | 10-45°C                               |
| **Agua Requerida**     | ✅ Adyacente o alta hidratación       |
| **Drops Base**         | 1 por segmento                        |
| **Prob. Maleza**       | 1%                                    |
| **Biomas Preferidos**  | Pantano, Río, Jungla, Playa, Desierto |

**Consejos:**

- Riesgo de maleza muy bajo.
- Requiere fuente de agua cerca O tierra con hidratación 8+.
- Tolerancia térmica extrema.
- Cada raíz produce segmentos limitados (5 + nivel fertilizante).

</details>

---

## 🗺️ Compatibilidad de Biomas

Usa esta tabla para planificar tus granjas según la ubicación:

### Colocación Óptima de Cultivos por Categoría de Bioma

| Tipo de Bioma           | Mejores Cultivos             | Evitar           |
| ----------------------- | ---------------------------- | ---------------- |
| **❄️ Helado/Frío**      | Remolachas                   | Sandías, Patatas |
| **🌲 Taiga/Bosque**     | Zanahorias, Trigo            | Sandías          |
| **🌻 Llanuras/Pradera** | Trigo, Calabazas, Zanahorias | —                |
| **🏔️ Montañas/Colinas** | Patatas, Calabazas           | Sandías          |
| **🌴 Jungla/Pantano**   | Sandías, Caña de Azúcar      | Remolachas       |
| **🏜️ Desierto/Mesa**    | Patatas, Caña de Azúcar\*    | Todos los demás  |
| **🌊 Playa/Río**        | Caña de Azúcar               | Casi todos       |

\*Requiere sistema de irrigación

[SCREENSHOT 14 - Mapa del mundo mostrando zonas de cultivo óptimas]

---

## 💡 Consejos y Estrategias

### 🏆 Estrategias de Granjero Pro

<details>
<summary><b>🌟 Estrategia Principiante: Inicio Seguro</b></summary>

1. Comienza en bioma de **Llanuras o Bosque**.
2. Cultiva **Trigo** primero — es el más tolerante.
3. Fabrica un **Inspector de Cultivos** inmediatamente.
4. Construye cerca del agua (a 3 bloques de la tierra de cultivo).
5. Cambia a semillas Selectas antes de expandirte.

</details>

<details>
<summary><b>🌟 Estrategia Intermedia: Diversificación</b></summary>

1. Monta un **Compostador Mejorado** pronto.
2. Planta diversos cultivos para asegurar materiales de fertilizante constantes.
3. Adapta los cultivos a las fortalezas de tu bioma.
4. Usa fertilizante en cultivos de alto valor (Sandías, Calabazas).
5. Mantén un banco de semillas de variedades Selectas.

</details>

<details>
<summary><b>🌟 Estrategia Avanzada: Explotación de Biomas</b></summary>

1. Establece **granjas satélite** en biomas óptimos:
    - Bioma nevado → Granja de remolacha
    - Jungla → Imperio de sandías
    - Pantano → Plantación de caña de azúcar
2. Usa portales del Nether para viajar rápido entre granjas.
3. Aplica fertilizante máximo (10) para cultivos de tallo.
4. Sincroniza las cosechas con la lluvia para irrigación natural.

</details>

### ⚠️ Errores Comunes a Evitar

| Error                            | Por qué es malo                     | Solución                                    |
| -------------------------------- | ----------------------------------- | ------------------------------------------- |
| Usar semillas Silvestres siempre | Penalización del 50% en rendimiento | Invierte en producción de semillas Selectas |
| Ignorar el Inspector de Cultivos | Los cultivos mueren de repente      | Revisa las condiciones antes de plantar     |
| Plantar sandías en biomas fríos  | Daño por temperatura fatal          | Adapta los cultivos al clima                |
| Regar en exceso en junglas       | La podredumbre mata el cultivo      | Usa tierra con hidratación controlada       |
| Descuidar el fertilizante        | Más maleza, menos rendimiento       | Mantén el Compostador Mejorado activo       |

---

## Instalación

### Requisitos

- Minecraft Bedrock Edition **1.21.0** o superior.
- **Funciones Experimentales**: Próximas funciones de creador (se activan automáticamente).

### Pasos de Instalación

1. Descarga el archivo `.mcaddon` desde [Curseforge](https://curseforge.com).
2. Haz doble clic en el archivo para importarlo a Minecraft.
3. Crea un mundo nuevo o añádelo a uno existente.
4. Activa el **Behavior Pack** (Pack de Comportamiento) y el **Resource Pack** (Pack de Recursos).
5. Asegúrate de que ambos packs muestren la versión `0.0.1` o superior.

[SCREENSHOT 15 - Ajustes del mundo mostrando el addon activado]

### ⚠️ Notas de Compatibilidad

- Este addon **reemplaza** el comportamiento de los cultivos vainilla.
- Las granjas vainilla existentes seguirán funcionando pero no se beneficiarán de las nuevas funciones.
- La nueva tierra de cultivo debe crearse con una azada sobre bloques de hierba/tierra.

---

## 🏗️ Construir desde el Código Fuente

Para desarrolladores que quieran contribuir o personalizar:

```bash

# Clonar el repositorio

git clone https://github.com/tu-repo/wheel_of_creation.git

# Instalar dependencias

npm install

# Modo desarrollo (watch)

npm run dev

# Construir para producción

npm run build
```

### Estructura del Proyecto

```
wheel_of_creation/
├── Behavior/ # Pack de Comportamiento
│ ├── blocks/ # Definiciones de bloques (JSON)
│ ├── items/ # Definiciones de ítems (JSON)
│ ├── scripts/ # Código fuente TypeScript
│ │ ├── features/ # Mecánicas centrales del juego
│ │ │ ├── blocks/ # Componentes de bloque (Cultivo, Tierra, etc.)
│ │ │ ├── items/ # Lógica de ítems (Inspector de Cultivos)
│ │ │ └── environment/ # Sistema meteorológico
│ │ ├── data/ # Persistencia de marcadores
│ │ └── utils/ # Utilidades (Tiempos, Colores, etc.)
│ ├── loot_tables/ # Configuraciones de botín
│ └── recipes/ # Recetas de fabricación
├── Resource/ # Pack de Recursos
│ ├── models/ # Modelos 3D (geometría)
│ ├── textures/ # Texturas de bloques e ítems
│ └── texts/ # Archivos de localización
└── scripts/ # Scripts de construcción
```

---

## 🌐 Localización

El addon está totalmente traducido a:

- 🇺🇸 Inglés (en_US)
- 🇪🇸 Español (es_ES)
- 🇧🇷 Portugués - Brasil (pt_BR)

¿Quieres añadir tu idioma? ¡Revisa `Resource/texts/` para ver los archivos de referencia!

---

## 📜 Créditos

<div align="center">

### Creado con 💚 por **HormigaDev**

---

| Rol                            | Contribuyente                                              |
| ------------------------------ | ---------------------------------------------------------- |
| 🎨 **Creador y Desarrollador** | [HormigaDev](https://github.com/HormigaDev)                |
| 💡 **Inspiración**             | [TerraFirmaCraft](https://terrafirmacraft.com/) (Mod Java) |
| 🎮 **Plataforma**              | Minecraft Bedrock Edition                                  |

---

**Wheel of Creation: Agriculture Update** es parte de la serie de addons **Wheel of Creation**, que trae mecánicas realistas e inmersivas a Minecraft Bedrock Edition.

> ⚠️ **Descargo de responsabilidad**: Este addon está inspirado en TerraFirmaCraft pero **NO** es un port oficial ni un proyecto afiliado. Todas las mecánicas, código y recursos han sido reimaginados y desarrollados desde cero por HormigaDev para Minecraft Bedrock Edition.

</div>

---

## 📄 Licencia

Este proyecto está bajo la licencia **GNU General Public License v3.0 (GPL-3.0)**.

Esto significa que eres libre de:

- ✅ Usar, modificar y distribuir este addon.
- ✅ Crear obras derivadas.
- ✅ Usar con fines comerciales.

Bajo las siguientes condiciones:

- 📋 Las obras derivadas también deben estar bajo la licencia GPL-3.0.
- 📋 Debes incluir el aviso de copyright original.
- 📋 Debes divulgar tu código fuente.

**¡Las contribuciones son bienvenidas!** Siéntete libre de enviar pull requests, reportar errores o sugerir nuevas funciones.

Consulta el archivo [LICENSE](LICENSE) para más detalles.

---

## 💪 Apoya el Desarrollo

<div align="center">

### ❤️ Ayuda a Mantener Este Proyecto Vivo

</div>

Este proyecto **es y siempre será de código abierto y gratuito**. Mi objetivo es mejorar el ecosistema de Minecraft Bedrock y dar a la comunidad acceso a mecánicas de juego más profundas e inmersivas.

Sin embargo, quiero ser honesto contigo: **desarrollar addons de esta complejidad requiere cientos de horas**. Los sistemas de biomas, la genética de cultivos, los cálculos de crecimiento offline, las optimizaciones de rendimiento, y las pruebas constantes en diferentes dispositivos—todo esto requiere una inversión de tiempo significativa que muchas veces viene a costa de otras responsabilidades.

Si disfrutas de este nivel de profundidad en tu experiencia de Minecraft y quieres ver la **Wild Update**, la **Diplomacy Update** y el contenido futuro lanzado más rápido, considera apoyar el proyecto. Cada contribución, sin importar cuán pequeña sea, me ayuda a dedicar más tiempo al desarrollo en lugar de otros trabajos.

<div align="center">

### 🌟 Tu Apoyo Hace la Diferencia

| Lo Que Tu Apoyo Permite                                      |
| ------------------------------------------------------------ |
| ⏰ Más tiempo de desarrollo para próximas actualizaciones    |
| 🐛 Corrección de errores y optimizaciones más rápidas        |
| 🌍 Más idiomas y mejor documentación                         |
| 🧪 Pruebas en más dispositivos y escenarios                  |
| ☕ Café para impulsar las sesiones de programación nocturnas |

---

[![PayPal](https://img.shields.io/badge/PayPal-Donar-00457C?style=for-the-badge&logo=paypal&logoColor=white)](https://www.paypal.com/donate/?hosted_button_id=UCL7EE2G44KPQ)

**[Haz clic aquí para donar vía PayPal](https://www.paypal.com/donate/?hosted_button_id=UCL7EE2G44KPQ)**

---

</div>

> 🙏 **Gracias** a todos los que ya han apoyado o contribuido a este proyecto. Ya sea a través de donaciones, reportes de errores, traducciones, o simplemente corriendo la voz—ustedes son lo que hace increíble al código abierto.

---

## 💬 Únete a la Comunidad

<div align="center">

[![Discord](https://img.shields.io/badge/Discord-BBEL%20Studios-5865F2?style=for-the-badge&logo=discord&logoColor=white)](https://discord.gg/m7cs2EUc8z)

**¿Quieres conversar, compartir comentarios, o simplemente pasar el rato?**

¡Únete al servidor de Discord de **BBEL Studios**! Habla directamente conmigo, comparte tus granjas, reporta errores, sugiere ideas, o simplemente conecta con otros jugadores.

**[👉 Haz clic aquí para unirte al Discord](https://discord.gg/m7cs2EUc8z)**

</div>

---

<div align="center">

**[⬆ Volver arriba](#-wheel-of-creation-addon)**

---

_Última actualización: Febrero 2026 | Versión 0.0.1 | Agriculture Update I_

**Hecho con ❤️ por HormigaDev — Código abierto bajo GPL-3.0**

[SCREENSHOT 16 - Hermoso atardecer sobre una granja próspera - imagen de cierre]

</div>

# 🏗️ Technical Architecture: High-Performance Persistence

Este proyecto implementa un sistema de persistencia personalizado diseñado para superar las limitaciones técnicas de Minecraft Bedrock Edition. A continuación, detallo la lógica detrás de mi elección de usar **Scoreboards** sobre las tradicionales **Dynamic Properties**.

---

## 🇺🇸 English: Why Scoreboards?

### The Challenge

Minecraft Bedrock's `Dynamic Properties` face a strict **1MB storage limit** per world/entity. In a complex agricultural simulation where thousands of blocks (crops) require individual data tracking (timestamps, hydration, growth progress), this limit is reached almost instantly, leading to data loss or world corruption.

### The Solution: Scoreboard-Based Storage

**I utilize Scoreboard Objectives** with "fake players" as unique keys (formatted as `x:y:z:dim`) to bypass the storage bottleneck.

- **⚡ Performance:** Scoreboards are stored in a high-speed memory table within the Bedrock engine, offering significantly faster read/write access than serializing/deserializing JSON properties.
- **🧬 Bit-Packing:** To minimize the memory footprint and API calls, **I pack** multiple variables into a single 32-bit integer:
    - **Bits 0-27:** Growth Progress.
    - **Bits 28-31:** Hydration Level (4-bit cache).
- **⏳ 64-bit Precision:** Since Bedrock scoreboards are signed 32-bit integers, **I split** my timestamps into two **31-bit segments (Low/High)**. This ensures stability across years of real-time gameplay without sign-bit overflow.

---

## 🇪🇸 Español: ¿Por qué Scoreboards?

### El Desafío

Las `Dynamic Properties` de Bedrock enfrentan un límite estricto de **1MB de almacenamiento** por mundo. En una simulación agrícola donde miles de cultivos requieren rastreo individual (timestamps, hidratación, progreso), este límite se alcanza casi al instante, provocando pérdida de datos o corrupción del mundo.

### La Solución: Almacenamiento basado en Scoreboards

**Utilizo Scoreboard Objectives** con "jugadores ficticios" como llaves únicas (formato `x:y:z:dim`) para evitar este cuello de botella.

- **⚡ Rendimiento:** Los scoreboards están optimizados para un acceso rápido en memoria por el motor del juego, superando la velocidad de serialización de las propiedades dinámicas tradicionales.
- **🧬 Bit-Packing:** Optimizo el espacio **empaquetando** múltiples variables en un solo entero de 32 bits:
    - **Bits 0-27:** Progreso de Crecimiento.
    - **Bits 28-31:** Nivel de Hidratación (caché de 4 bits).
- **⏳ Precisión de 64 bits:** Dado que los scoreboards son enteros de 32 bits con signo, **divido** mis timestamps en dos **segmentos de 31 bits (Bajo/Alto)**. Esto garantiza estabilidad durante años de juego real sin errores de desbordamiento de signo.

---

## 🇧🇷 Português: Por que Scoreboards?

### O Desafio

As `Dynamic Properties` do Bedrock enfrentam um limite rígido de **1MB de armazenamento** por mundo. Em uma simulação agrícola complexa onde milhares de cultivos exigem rastreamento individual (timestamps, hidratação, progresso), esse limite é atingido quase instantaneamente, resultando em perda de dados.

### A Solução: Armazenamento baseado em Scoreboards

**Utilizo Scoreboard Objectives** com "jogadores fictícios" como chaves exclusivas (formato `x:y:z:dim`) para contornar esse gargalo de armazenamento.

- **⚡ Desempenho:** Scoreboards são armazenados em uma tabela de memória de alta velocidade pelo motor do Bedrock, oferecendo acesso de leitura/gravação muito mais rápido do que a serialização de propriedades dinâmicas.
- **🧬 Bit-Packing:** Para minimizar o uso de memória e chamadas de API, **compacto** várias variáveis em um único inteiro de 32 bits:
    - **Bits 0-27:** Progresso de Crescimento.
    - **Bits 28-31:** Nível de Hidratación (cache de 4 bits).
- **⏳ Precisão de 64 bits:** Como os scoreboards do Bedrock são inteiros de 32 bits com sinal, **divido** meus timestamps em dois **segmentos de 31 bits (Baixo/Alto)**. Isso garante estabilidade ao longo de anos de jogo em tempo real, sem transbordamento do bit de sinal.

---

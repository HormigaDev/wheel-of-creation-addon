# 🤝 Contribuir a Wheel of Creation

Antes que nada, **¡gracias** por considerar contribuir a Wheel of Creation! Son personas como tú las que hacen este addon mejor para toda la comunidad de Minecraft Bedrock.

Este documento proporciona guías e información sobre cómo contribuir a este proyecto. Por favor léelo antes de enviar cualquier contribución.

---

## 📋 Tabla de Contenidos

- [Código de Conducta](#-código-de-conducta)
- [¿Cómo Puedo Contribuir?](#-cómo-puedo-contribuir)
    - [Reportar Errores](#-reportar-errores)
    - [Sugerir Funcionalidades](#-sugerir-funcionalidades)
    - [Traducciones](#-traducciones)
    - [Contribuciones de Código](#-contribuciones-de-código)
- [Configuración del Entorno](#-configuración-del-entorno)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Estándares de Código](#-estándares-de-código)
- [Proceso de Pull Request](#-proceso-de-pull-request)
- [Reconocimiento](#-reconocimiento)

---

## 📜 Código de Conducta

Este proyecto sigue un código de conducta simple:

- **Sé respetuoso** — Trata a todos con respeto. Sin acoso, discriminación ni comportamiento tóxico.
- **Sé constructivo** — Las críticas son bienvenidas cuando son constructivas y ayudan a mejorar el proyecto.
- **Sé paciente** — Este es un proyecto de una sola persona mantenido en tiempo libre. Las respuestas pueden tardar unos días.
- **Sé colaborativo** — Todos estamos aquí para hacer mejor Minecraft Bedrock.

> ⚠️ **Nota**: Este addon está inspirado en TerraFirmaCraft pero NO está afiliado con él. Por favor no crees issues comparando funcionalidades o pidiendo réplicas exactas de mecánicas de TFC.

---

## 🌟 ¿Cómo Puedo Contribuir?

### 🐛 Reportar Errores

¿Encontraste un bug? Así es como reportarlo efectivamente:

1. **Busca en issues existentes** — Verifica si el bug ya ha sido reportado.
2. **Crea un nuevo issue** con la etiqueta `bug`.
3. **Incluye esta información**:
    - Versión de Minecraft Bedrock
    - Dispositivo/plataforma (Windows, Android, iOS, Xbox, etc.)
    - Pasos para reproducir el error
    - Comportamiento esperado vs comportamiento actual
    - Capturas de pantalla o videos si es posible
    - Cualquier mensaje de error del content log

**Ejemplo de buen reporte de bug:**

```
Título: Los cultivos no crecen en el bioma Cherry Grove

Versión de Minecraft: 1.21.50
Plataforma: Windows 11
Pasos:
1. Crear tierra de cultivo en el bioma Cherry Grove
2. Plantar semillas de trigo
3. Esperar varios días del juego
4. El cultivo nunca avanza más allá del estado 0

Esperado: El trigo debería crecer normalmente
Actual: El trigo se queda en estado 0 indefinidamente

Error en Content Log: Ninguno visible
```

### 💡 Sugerir Funcionalidades

¿Tienes una idea? ¡Nos encantaría escucharla!

1. **Revisa el Roadmap** — Tu idea podría ya estar planeada.
2. **Crea un issue** con la etiqueta `enhancement`.
3. **Describe tu idea** incluyendo:
    - ¿Qué problema resuelve?
    - ¿Cómo funcionaría?
    - ¿Cómo encaja con la visión del addon de supervivencia realista?

> 🎯 **Recuerda**: Este addon busca **realismo y desafío**, no conveniencia. Las funcionalidades que hagan el juego más fácil no serán consideradas.

### 🌍 Traducciones

¿Quieres traducir el addon a tu idioma?

**Textos dentro del juego** (`Resource/texts/`):

1. Copia `en_US.lang` como plantilla
2. Crea un nuevo archivo con tu código de locale (ej: `fr_FR.lang`)
3. Traduce todas las cadenas manteniendo las claves intactas
4. Envía un PR

**Documentación**:

1. Copia el README en inglés u otros documentos
2. Crea versiones traducidas en la carpeta `docs/`
3. Usa la convención de nombres: `README_XX.md` donde XX es el código del idioma

### 💻 Contribuciones de Código

¿Listo para programar? ¡Excelente! Así es cómo:

1. **Haz fork del repositorio**
2. **Crea una rama de funcionalidad** (`git checkout -b feature/funcionalidad-increible`)
3. **Realiza tus cambios**
4. **Prueba exhaustivamente** dentro del juego
5. **Haz commit con mensajes claros**
6. **Push a tu fork**
7. **Abre un Pull Request**

---

## 🛠️ Configuración del Entorno

### Requisitos Previos

- [Node.js](https://nodejs.org/) v18 o superior
- [npm](https://www.npmjs.com/) o [pnpm](https://pnpm.io/)
- Minecraft Bedrock Edition (última versión)
- Un editor de código (VS Code recomendado)

### Pasos de Configuración

```bash
# 1. Clona tu fork
git clone https://github.com/TU_USUARIO/wheel_of_creation.git
cd wheel_of_creation

# 2. Instala dependencias
npm install

# 3. Inicia modo desarrollo (observa cambios)
npm run dev

# 4. Compila para producción
npm run build
```

### Enlazar con Minecraft

Los scripts de desarrollo deberían enlazar automáticamente a tus carpetas de desarrollo de Minecraft. Si no:

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

## 📁 Estructura del Proyecto

```
wheel_of_creation/
├── Behavior/                    # Behavior Pack
│   ├── blocks/                  # Definiciones JSON de bloques
│   ├── items/                   # Definiciones JSON de items
│   ├── scripts/                 # Código fuente TypeScript
│   │   ├── config.ts            # Datos de configuración de biomas
│   │   ├── main.ts              # Punto de entrada
│   │   ├── features/            # Mecánicas de juego
│   │   │   ├── blocks/          # Componentes de bloques
│   │   │   │   ├── Crop.ts      # Clase base de cultivos
│   │   │   │   ├── StemCrop.ts  # Lógica Calabaza/Sandía
│   │   │   │   ├── ColumnCrop.ts# Lógica Caña de azúcar
│   │   │   │   ├── Farmland.ts  # Hidratación del suelo
│   │   │   │   └── crops/       # Configuraciones de cultivos
│   │   │   ├── items/           # Comportamientos de items
│   │   │   └── environment/     # Sistema de clima
│   │   ├── data/                # Persistencia de datos
│   │   └── utils/               # Funciones utilitarias
│   ├── loot_tables/             # Tablas de drops
│   ├── recipes/                 # Recetas de crafteo
│   └── trading/                 # Trades de aldeanos
├── Resource/                    # Resource Pack
│   ├── models/                  # Modelos 3D
│   ├── textures/                # Texturas
│   └── texts/                   # Localización
├── scripts/                     # Scripts de compilación
├── docs/                        # Documentación
└── build/                       # Salida de compilación
```

---

## 📏 Estándares de Código

### TypeScript

- Usa **TypeScript** para todos los archivos de scripts
- Sigue los patrones de código y convenciones de nombres existentes
- Usa nombres de variables y funciones significativos
- Añade comentarios para lógica compleja
- Usa el wrapper `safeExecute()` para manejo de errores

```typescript
// ✅ Bien
private handleRandomTick(e: BlockComponentRandomTickEvent) {
    const { block, dimension } = e;
    const biome = dimension.getBiome(block.location);
    const temperature = getBiomeTemperature(biome.id, block.location);
    // ...
}

// ❌ Mal
private tick(e: any) {
    var t = e.block.dimension.getBiome(e.block.location);
    // ...
}
```

### Archivos JSON

- Usa formato apropiado (2 espacios de indentación)
- Sigue las convenciones de esquema de Minecraft
- Mantén identificadores consistentes con el namespace `woc:`

### Commits

Usa mensajes de commit claros y descriptivos:

```
✅ Bien:
feat: añadir cultivo de arroz con requisitos de agua de arrozal
fix: cultivos no crecen en bioma Pale Garden
docs: actualizar traducción al español

❌ Mal:
arreglé cosas
update
asdfgh
```

---

## 🔄 Proceso de Pull Request

1. **Asegúrate de que tu código funciona** — Prueba en el juego exhaustivamente
2. **Actualiza la documentación** si es necesario
3. **Completa la plantilla del PR** completamente
4. **Espera la revisión** — Revisaré tan pronto como sea posible
5. **Atiende el feedback** si se solicitan cambios
6. **¡Celebra** cuando sea fusionado! 🎉

### Lista de Verificación del PR

- [ ] El código compila sin errores
- [ ] Probado en Minecraft Bedrock (última versión)
- [ ] Sin errores de consola en el content log
- [ ] Sigue el estilo de código existente
- [ ] Documentación actualizada si es necesario
- [ ] Mensajes de commit claros

---

## 🏆 Reconocimiento

¡Todos los contribuidores serán reconocidos! Tu nombre de usuario de GitHub será añadido a:

- La sección de créditos del README
- Créditos dentro del juego (para contribuciones significativas)
- Notas de versión cuando tu contribución sea incluida

---

## ❓ ¿Preguntas?

- **GitHub Issues** — Para bugs y solicitudes de funcionalidades
- **GitHub Discussions** — Para preguntas e ideas

---

<div align="center">

**¡Gracias por ayudar a hacer Wheel of Creation mejor!** 🌾

_Cada contribución, sin importar cuán pequeña, es valorada y apreciada._

</div>

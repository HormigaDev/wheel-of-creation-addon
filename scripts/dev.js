require('dotenv').config({ override: true });
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Directorio raíz del proyecto (padre de scripts/)
const rootDir = path.join(__dirname, '..');

// Leer el nombre del proyecto desde package.json
const packageJson = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf-8'));
const projectName = packageJson.name;

// Directorios de origen y destino
const behaviorSrc = path.join(rootDir, 'Behavior');
const resourceSrc = path.join(rootDir, 'Resource');
const behaviorDir = process.env.DEVELOPMENT_BEHAVIOR_DIR;
const resourceDir = process.env.DEVELOPMENT_RESOURCE_DIR;
const behaviorDest = behaviorDir ? path.join(behaviorDir, projectName) : null;
const resourceDest = resourceDir ? path.join(resourceDir, projectName) : null;

// Debounce para evitar múltiples copias en cambios rápidos
let debounceTimer = null;
const DEBOUNCE_MS = 300;

/**
 * Copia una carpeta recursivamente a un destino
 * @param {string} src - Carpeta origen
 * @param {string} dest - Carpeta destino
 */
function copyFolderSync(src, dest) {
    // Crear la carpeta destino si no existe
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }

    const entries = fs.readdirSync(src, { withFileTypes: true });

    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            copyFolderSync(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

/**
 * Elimina una carpeta recursivamente
 * @param {string} dir - Carpeta a eliminar
 */
function removeFolderSync(dir) {
    if (fs.existsSync(dir)) {
        fs.rmSync(dir, { recursive: true, force: true });
    }
}

/**
 * Obtiene todos los archivos con extensiones específicas recursivamente
 * @param {string} dir - Directorio a escanear
 * @param {string[]} extensions - Extensiones a buscar (ej: ['.js', '.ts'])
 * @returns {string[]} - Lista de rutas de archivos
 */
function getFilesRecursively(dir, extensions) {
    const files = [];
    if (!fs.existsSync(dir)) return files;

    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            files.push(...getFilesRecursively(fullPath, extensions));
        } else if (extensions.includes(path.extname(entry.name).toLowerCase())) {
            files.push(fullPath);
        }
    }

    return files;
}

/**
 * Compila TypeScript a JavaScript
 * @returns {boolean} - true si la compilación fue exitosa
 */
function compileTypeScript() {
    const tsconfigPath = path.join(rootDir, 'tsconfig.json');

    if (!fs.existsSync(tsconfigPath)) {
        return true;
    }

    const scriptsDir = path.join(rootDir, 'Behavior', 'scripts');
    if (!fs.existsSync(scriptsDir)) {
        return true;
    }

    // Verificar si hay archivos .ts
    const tsFiles = getFilesRecursively(scriptsDir, ['.ts']);
    if (tsFiles.length === 0) {
        return true;
    }

    try {
        // Limpiar directorio dist antes de compilar
        const distDir = path.join(rootDir, 'dist');
        removeFolderSync(distDir);

        // Ejecutar tsc desde la raíz
        execSync('npx tsc', {
            cwd: rootDir,
            stdio: 'pipe',
        });

        console.log(`   🔷 TypeScript compiled (${tsFiles.length} files)`);
        return true;
    } catch (err) {
        console.error('   ❌ TypeScript compilation failed:');
        if (err.stdout) console.error(err.stdout.toString());
        if (err.stderr) console.error(err.stderr.toString());
        return false;
    }
}

/**
 * Copia los packs al directorio de desarrollo
 */
function copyPacks() {
    const timestamp = new Date().toLocaleTimeString();
    console.log(`\n[${timestamp}] 🔄 Syncing packs...`);

    // Compilar TypeScript primero
    const compileSuccess = compileTypeScript();
    if (!compileSuccess) {
        console.log('   ⚠️  Skipping sync due to TypeScript errors');
        return;
    }

    if (behaviorDest) {
        removeFolderSync(behaviorDest);
        copyFolderSync(behaviorSrc, behaviorDest);

        // Reemplazar scripts con los compilados desde dist/ en la raíz
        const compiledDir = path.join(rootDir, 'dist');
        const destScriptsDir = path.join(behaviorDest, 'scripts');

        if (fs.existsSync(compiledDir)) {
            removeFolderSync(destScriptsDir);
            copyFolderSync(compiledDir, destScriptsDir);
        }

        console.log(`   ✅ Behavior → ${behaviorDest}`);
    }

    if (resourceDest) {
        removeFolderSync(resourceDest);
        copyFolderSync(resourceSrc, resourceDest);
        console.log(`   ✅ Resource → ${resourceDest}`);
    }
}

/**
 * Copia con debounce para evitar múltiples copias en cambios rápidos
 */
function debouncedCopy() {
    if (debounceTimer) {
        clearTimeout(debounceTimer);
    }
    debounceTimer = setTimeout(() => {
        copyPacks();
        debounceTimer = null;
    }, DEBOUNCE_MS);
}

/**
 * Observa una carpeta recursivamente para detectar cambios
 * @param {string} dir - Directorio a observar
 * @param {Function} callback - Función a ejecutar cuando hay cambios
 * @returns {fs.FSWatcher[]} - Array de watchers
 */
function watchRecursive(dir, callback) {
    const watchers = [];

    function addWatchers(currentDir) {
        try {
            const watcher = fs.watch(currentDir, { persistent: true }, (eventType, filename) => {
                if (filename) {
                    callback(eventType, path.join(currentDir, filename));
                }
            });

            watcher.on('error', (err) => {
                console.error(`⚠️  Watcher error in ${currentDir}:`, err.message);
            });

            watchers.push(watcher);

            const entries = fs.readdirSync(currentDir, { withFileTypes: true });
            for (const entry of entries) {
                if (entry.isDirectory()) {
                    addWatchers(path.join(currentDir, entry.name));
                }
            }
        } catch (err) {
            console.error(`⚠️  Could not watch ${currentDir}:`, err.message);
        }
    }

    addWatchers(dir);
    return watchers;
}

// Verificar variables de entorno
if (!behaviorDir) {
    console.warn('⚠️  DEVELOPMENT_BEHAVIOR_DIR environment variable is not set');
}
if (!resourceDir) {
    console.warn('⚠️  DEVELOPMENT_RESOURCE_DIR environment variable is not set');
}

if (!behaviorDest && !resourceDest) {
    console.error(
        '❌ No development directories configured. Set DEVELOPMENT_BEHAVIOR_DIR and/or DEVELOPMENT_RESOURCE_DIR in .env',
    );
    process.exit(1);
}

// Copia inicial
console.log(`📦 Development mode: ${projectName}`);
copyPacks();

// Iniciar watchers
console.log('\n👀 Watching for changes...');
console.log(`   📂 ${behaviorSrc}`);
console.log(`   📂 ${resourceSrc}`);
console.log('\n   Press Ctrl+C to stop.\n');

const behaviorWatchers = watchRecursive(behaviorSrc, (eventType, filePath) => {
    const relativePath = path.relative(behaviorSrc, filePath);
    console.log(`   📝 [Behavior] ${eventType}: ${relativePath}`);
    debouncedCopy();
});

const resourceWatchers = watchRecursive(resourceSrc, (eventType, filePath) => {
    const relativePath = path.relative(resourceSrc, filePath);
    console.log(`   📝 [Resource] ${eventType}: ${relativePath}`);
    debouncedCopy();
});

// Manejar cierre limpio
process.on('SIGINT', () => {
    console.log('\n\n🛑 Stopping watchers...');
    behaviorWatchers.forEach((w) => w.close());
    resourceWatchers.forEach((w) => w.close());
    console.log('👋 Goodbye!');
    process.exit(0);
});

// Mantener el proceso vivo
process.stdin.resume();

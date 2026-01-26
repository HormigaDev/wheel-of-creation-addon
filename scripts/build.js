const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const { minify } = require('terser');
const { execSync } = require('child_process');

// Directorio raíz del proyecto (un nivel arriba de scripts/)
const rootDir = path.join(__dirname, '..');

// Leer el nombre y versión del proyecto desde package.json
const packageJson = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf-8'));
const projectName = packageJson.name;
const projectVersion = `v${packageJson.version}`;

console.log(`📦 Building project: ${projectName} (${projectVersion})`);

const buildDir = path.join(rootDir, 'build');
const tsOutDir = path.join(rootDir, 'dist');

/**
 * Obtiene todos los archivos con extensiones específicas recursivamente
 * @param {string} dir - Directorio a escanear
 * @param {string[]} extensions - Extensiones a buscar (ej: ['.js', '.json'])
 * @returns {string[]} - Lista de rutas de archivos
 */
function getFilesRecursively(dir, extensions) {
    const files = [];
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
 * Elimina comentarios de una cadena
 * @param {string} content - Contenido con comentarios
 * @returns {string} - Contenido sin comentarios
 */
function stripComments(content) {
    // Eliminar comentarios de línea (//) y de bloque (/* */)
    // Maneja strings para no eliminar // dentro de strings
    let result = '';
    let inString = false;
    let stringChar = '';
    let inLineComment = false;
    let inBlockComment = false;
    let i = 0;

    while (i < content.length) {
        const char = content[i];
        const nextChar = content[i + 1];

        if (inLineComment) {
            if (char === '\n') {
                inLineComment = false;
                result += char;
            }
            i++;
            continue;
        }

        if (inBlockComment) {
            if (char === '*' && nextChar === '/') {
                inBlockComment = false;
                i += 2;
            } else {
                i++;
            }
            continue;
        }

        if (inString) {
            result += char;
            if (char === '\\' && i + 1 < content.length) {
                result += content[i + 1];
                i += 2;
                continue;
            }
            if (char === stringChar) {
                inString = false;
            }
            i++;
            continue;
        }

        if (char === '"' || char === "'") {
            inString = true;
            stringChar = char;
            result += char;
            i++;
            continue;
        }

        if (char === '/' && nextChar === '/') {
            inLineComment = true;
            i += 2;
            continue;
        }

        if (char === '/' && nextChar === '*') {
            inBlockComment = true;
            i += 2;
            continue;
        }

        result += char;
        i++;
    }

    return result;
}

/**
 * Minifica un archivo JSON (elimina comentarios y espacios)
 * @param {string} filePath - Ruta del archivo JSON
 */
function minifyJsonFile(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf-8');
        // Eliminar comentarios
        content = stripComments(content);
        // Parsear y re-serializar sin espacios
        const parsed = JSON.parse(content);
        const minified = JSON.stringify(parsed);
        fs.writeFileSync(filePath, minified, 'utf-8');
    } catch (err) {
        console.warn(`⚠️  Warning: Could not minify JSON ${filePath}: ${err.message}`);
    }
}

/**
 * Minifica un archivo JS usando terser
 * @param {string} filePath - Ruta del archivo JS
 */
async function minifyJsFile(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf-8');
        const result = await minify(content, {
            compress: true,
            mangle: true,
            format: {
                comments: false,
            },
        });
        if (result.code) {
            fs.writeFileSync(filePath, result.code, 'utf-8');
        }
    } catch (err) {
        console.warn(`⚠️  Warning: Could not minify JS ${filePath}: ${err.message}`);
    }
}

/**
 * Minifica todos los archivos .js y .json en un directorio
 * @param {string} dir - Directorio a procesar
 */
async function minifyDirectory(dir) {
    const jsonFiles = getFilesRecursively(dir, ['.json']);
    const jsFiles = getFilesRecursively(dir, ['.js']);

    console.log(`   🔧 Minifying ${jsonFiles.length} JSON files...`);
    for (const file of jsonFiles) {
        minifyJsonFile(file);
    }

    console.log(`   🔧 Minifying ${jsFiles.length} JS files...`);
    for (const file of jsFiles) {
        await minifyJsFile(file);
    }
}

/**
 * Copia una carpeta recursivamente a un destino
 * @param {string} src - Carpeta origen
 * @param {string} dest - Carpeta destino
 */
function copyFolderSync(src, dest) {
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
 * Carpetas donde se deben elevar archivos de subcarpetas a la raíz
 */
const FLATTEN_FOLDERS = ['blocks', 'features', 'feature_rules', 'items', 'entities'];

/**
 * Eleva todos los archivos de subcarpetas a la raíz de la carpeta especificada
 * @param {string} dir - Carpeta a procesar
 */
function flattenSubfolders(dir) {
    if (!fs.existsSync(dir)) return;

    const entries = fs.readdirSync(dir, { withFileTypes: true });
    const subfolders = entries.filter((e) => e.isDirectory());

    for (const subfolder of subfolders) {
        const subfolderPath = path.join(dir, subfolder.name);
        flattenRecursive(subfolderPath, dir);
        // Eliminar la subcarpeta vacía
        removeFolderSync(subfolderPath);
    }
}

/**
 * Mueve recursivamente todos los archivos de una carpeta a un destino
 * @param {string} src - Carpeta origen
 * @param {string} dest - Carpeta destino (raíz)
 */
function flattenRecursive(src, dest) {
    const entries = fs.readdirSync(src, { withFileTypes: true });

    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            flattenRecursive(srcPath, dest);
        } else {
            // Si ya existe un archivo con el mismo nombre, agregar sufijo
            let finalDestPath = destPath;
            let counter = 1;
            while (fs.existsSync(finalDestPath)) {
                const ext = path.extname(entry.name);
                const base = path.basename(entry.name, ext);
                finalDestPath = path.join(dest, `${base}_${counter}${ext}`);
                counter++;
            }
            fs.renameSync(srcPath, finalDestPath);
        }
    }
}

/**
 * Procesa las carpetas especificadas para elevar archivos de subcarpetas
 * @param {string} baseDir - Directorio base del pack
 */
function processFlattenFolders(baseDir) {
    console.log('   📂 Flattening subfolders in specified directories...');
    for (const folder of FLATTEN_FOLDERS) {
        const folderPath = path.join(baseDir, folder);
        if (fs.existsSync(folderPath)) {
            flattenSubfolders(folderPath);
            console.log(`      ✓ ${folder}/`);
        }
    }
}

/**
 * Comprime una carpeta en un archivo zip usando archiver
 * @param {string} sourceDir - Carpeta a comprimir
 * @param {string} outputPath - Ruta del archivo zip de salida
 * @returns {Promise<void>}
 */
function zipFolder(sourceDir, outputPath) {
    return new Promise((resolve, reject) => {
        // Eliminar archivo existente si existe
        if (fs.existsSync(outputPath)) {
            fs.unlinkSync(outputPath);
        }

        const output = fs.createWriteStream(outputPath);
        const archive = archiver('zip', { zlib: { level: 9 } });

        output.on('close', () => resolve());
        archive.on('error', (err) => reject(err));

        archive.pipe(output);
        archive.directory(sourceDir, false);
        archive.finalize();
    });
}

/**
 * Comprime múltiples archivos en un zip usando archiver
 * @param {string[]} files - Archivos a comprimir
 * @param {string} outputPath - Ruta del archivo zip de salida
 * @returns {Promise<void>}
 */
function zipFiles(files, outputPath) {
    return new Promise((resolve, reject) => {
        if (fs.existsSync(outputPath)) {
            fs.unlinkSync(outputPath);
        }

        const output = fs.createWriteStream(outputPath);
        const archive = archiver('zip', { zlib: { level: 9 } });

        output.on('close', () => resolve());
        archive.on('error', (err) => reject(err));

        archive.pipe(output);

        for (const file of files) {
            archive.file(file, { name: path.basename(file) });
        }

        archive.finalize();
    });
}

/**
 * Compila TypeScript a JavaScript
 * @returns {boolean} - true si la compilación fue exitosa
 */
function compileTypeScript() {
    const tsconfigPath = path.join(rootDir, 'tsconfig.json');

    if (!fs.existsSync(tsconfigPath)) {
        console.log('⚠️  No tsconfig.json found, skipping TypeScript compilation');
        return true;
    }

    const scriptsDir = path.join(rootDir, 'Behavior', 'scripts');
    if (!fs.existsSync(scriptsDir)) {
        console.log('⚠️  No Behavior/scripts folder found, skipping TypeScript compilation');
        return true;
    }

    // Verificar si hay archivos .ts
    const tsFiles = getFilesRecursively(scriptsDir, ['.ts']);
    if (tsFiles.length === 0) {
        console.log('⚠️  No TypeScript files found, skipping compilation');
        return true;
    }

    console.log(`🔷 Compiling ${tsFiles.length} TypeScript files...`);

    try {
        // Limpiar directorio dist antes de compilar
        removeFolderSync(tsOutDir);

        // Ejecutar tsc desde la raíz del proyecto
        execSync('npx tsc', {
            cwd: rootDir,
            stdio: 'inherit',
        });

        console.log('   ✅ TypeScript compilation successful');
        return true;
    } catch (err) {
        console.error('❌ TypeScript compilation failed');
        return false;
    }
}

/**
 * Prepara el Behavior pack copiando los archivos JS compilados
 * @param {string} behaviorDestFolder - Carpeta destino del behavior pack
 */
function prepareScriptsFolder(behaviorDestFolder) {
    const destScriptsDir = path.join(behaviorDestFolder, 'scripts');

    // Si existe el directorio compilado, usarlo
    if (fs.existsSync(tsOutDir)) {
        // Eliminar la carpeta scripts existente (que tiene los .ts)
        removeFolderSync(destScriptsDir);
        // Copiar los archivos compilados
        copyFolderSync(tsOutDir, destScriptsDir);
        console.log('   ✅ Copied compiled JavaScript files');
    }
}

async function build() {
    // Crear carpeta build si no existe
    if (!fs.existsSync(buildDir)) {
        fs.mkdirSync(buildDir, { recursive: true });
    }

    // 0. Compilar TypeScript primero
    console.log('🔷 TypeScript Compilation');
    const compileSuccess = compileTypeScript();
    if (!compileSuccess) {
        throw new Error('TypeScript compilation failed');
    }

    // Nombres de archivos con versión
    const behaviorFolderName = `${projectName}_behavior`;
    const resourceFolderName = `${projectName}_resource`;
    const behaviorPackName = `${projectVersion}-${projectName}_behavior.mcpack`;
    const resourcePackName = `${projectVersion}-${projectName}_resource.mcpack`;
    const addonName = `${projectVersion}-${projectName}.mcaddon`;

    // Rutas
    const behaviorDestFolder = path.join(buildDir, behaviorFolderName);
    const resourceDestFolder = path.join(buildDir, resourceFolderName);
    const behaviorPackPath = path.join(buildDir, behaviorPackName);
    const resourcePackPath = path.join(buildDir, resourcePackName);
    const addonPath = path.join(buildDir, addonName);

    // 1. Copiar Behavior/ a dist/<nombre>_behavior
    console.log(`📁 Copying Behavior/ to ${behaviorDestFolder}`);
    removeFolderSync(behaviorDestFolder);
    copyFolderSync(path.join(rootDir, 'Behavior'), behaviorDestFolder);

    // 1.5. Reemplazar scripts con los compilados
    console.log('📂 Preparing scripts folder...');
    prepareScriptsFolder(behaviorDestFolder);

    // 2. Copiar Resource/ a dist/<nombre>_resource
    console.log(`📁 Copying Resource/ to ${resourceDestFolder}`);
    removeFolderSync(resourceDestFolder);
    copyFolderSync(path.join(rootDir, 'Resource'), resourceDestFolder);

    // 2.5. Elevar archivos de subcarpetas en carpetas específicas
    console.log('📂 Processing folder structure...');
    processFlattenFolders(behaviorDestFolder);

    // 3. Minificar archivos .js y .json
    console.log('🔧 Minifying Behavior pack...');
    await minifyDirectory(behaviorDestFolder);
    console.log('🔧 Minifying Resource pack...');
    await minifyDirectory(resourceDestFolder);

    // 4. Comprimir carpetas y renombrar a .mcpack
    console.log(`📦 Creating ${behaviorPackName}`);
    await zipFolder(behaviorDestFolder, behaviorPackPath);

    console.log(`📦 Creating ${resourcePackName}`);
    await zipFolder(resourceDestFolder, resourcePackPath);

    // 5. Eliminar las carpetas copiadas
    console.log('🗑️  Removing temporary folders...');
    removeFolderSync(behaviorDestFolder);
    removeFolderSync(resourceDestFolder);

    // 6. Comprimir los .mcpack en un .mcaddon
    console.log(`📦 Creating ${addonName}`);
    await zipFiles([behaviorPackPath, resourcePackPath], addonPath);

    console.log('');
    console.log('🎉 Build complete! Files created:');
    console.log(`   📄 build/${behaviorPackName}`);
    console.log(`   📄 build/${resourcePackName}`);
    console.log(`   📄 build/${addonName}`);
}

build().catch((err) => {
    console.error('❌ Build failed:', err);
    process.exit(1);
});

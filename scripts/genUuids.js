const { v4: uuidv4 } = require('uuid');
const { existsSync, readFileSync, writeFileSync } = require('fs');
const { join } = require('path');

const resourcePath = join(__dirname, '..', 'Resource');
const behaviorPath = join(__dirname, '..', 'Behavior');

const resourceManifestPath = join(resourcePath, 'manifest.json');
const behaviorManifestPath = join(behaviorPath, 'manifest.json');

function main() {
    if (!existsSync(resourcePath)) {
        console.log('Resource folder not found, skipping Resource manifest update.');
        return;
    }

    let oldResourceUuid = null;
    let oldResourceVersion = null;
    let newResourceHeaderUuid = null;

    if (existsSync(resourceManifestPath)) {
        console.log('Updating Resource manifest...');
        const resourceManifest = JSON.parse(readFileSync(resourceManifestPath, 'utf-8'));

        oldResourceUuid = resourceManifest.header?.uuid;
        oldResourceVersion = resourceManifest.header?.version;

        newResourceHeaderUuid = uuidv4();
        resourceManifest.header.uuid = newResourceHeaderUuid;
        console.log(`  Header UUID: ${oldResourceUuid} -> ${newResourceHeaderUuid}`);

        if (resourceManifest.modules && Array.isArray(resourceManifest.modules)) {
            for (const module of resourceManifest.modules) {
                if ('uuid' in module) {
                    const oldUuid = module.uuid;
                    const newUuid = uuidv4();
                    module.uuid = newUuid;
                    console.log(`  Module UUID: ${oldUuid} -> ${newUuid}`);
                }
            }
        }

        writeFileSync(resourceManifestPath, JSON.stringify(resourceManifest, null, 4));
        console.log('Resource manifest updated successfully.\n');
    } else {
        console.log('Resource manifest.json not found.');
    }

    if (existsSync(behaviorManifestPath)) {
        console.log('Updating Behavior manifest...');
        const behaviorManifest = JSON.parse(readFileSync(behaviorManifestPath, 'utf-8'));

        if (behaviorManifest.dependencies && Array.isArray(behaviorManifest.dependencies)) {
            for (const dependency of behaviorManifest.dependencies) {
                if (
                    'uuid' in dependency &&
                    'version' in dependency &&
                    dependency.uuid === oldResourceUuid &&
                    JSON.stringify(dependency.version) === JSON.stringify(oldResourceVersion)
                ) {
                    console.log(
                        `  Dependency UUID: ${dependency.uuid} -> ${newResourceHeaderUuid}`,
                    );
                    dependency.uuid = newResourceHeaderUuid;
                }
            }
        }

        const oldHeaderUuid = behaviorManifest.header?.uuid;
        const newHeaderUuid = uuidv4();
        behaviorManifest.header.uuid = newHeaderUuid;
        console.log(`  Header UUID: ${oldHeaderUuid} -> ${newHeaderUuid}`);

        if (behaviorManifest.modules && Array.isArray(behaviorManifest.modules)) {
            for (const module of behaviorManifest.modules) {
                if ('uuid' in module) {
                    const oldUuid = module.uuid;
                    const newUuid = uuidv4();
                    module.uuid = newUuid;
                    console.log(`  Module UUID: ${oldUuid} -> ${newUuid}`);
                }
            }
        }

        writeFileSync(behaviorManifestPath, JSON.stringify(behaviorManifest, null, 4));
        console.log('Behavior manifest updated successfully.\n');
    } else {
        console.log('Behavior manifest.json not found.');
    }

    console.log('UUID generation complete!');
}

main();

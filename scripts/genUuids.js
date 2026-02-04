const { v4: uuidv4 } = require('uuid');
const { existsSync, readFileSync, writeFileSync } = require('fs');
const { join } = require('path');

const resourcePath = join(__dirname, '..', 'Resource');
const behaviorPath = join(__dirname, '..', 'Behavior');

const resourceManifestPath = join(resourcePath, 'manifest.json');
const behaviorManifestPath = join(behaviorPath, 'manifest.json');

function main() {
    // Track old and new UUIDs for cross-dependencies
    let oldResourceUuid = null;
    let oldResourceVersion = null;
    let newResourceHeaderUuid = null;

    let oldBehaviorUuid = null;
    let oldBehaviorVersion = null;
    let newBehaviorHeaderUuid = null;

    // First pass: Read old UUIDs from both manifests
    if (existsSync(resourceManifestPath)) {
        const resourceManifest = JSON.parse(readFileSync(resourceManifestPath, 'utf-8'));
        oldResourceUuid = resourceManifest.header?.uuid;
        oldResourceVersion = resourceManifest.header?.version;
    }

    if (existsSync(behaviorManifestPath)) {
        const behaviorManifest = JSON.parse(readFileSync(behaviorManifestPath, 'utf-8'));
        oldBehaviorUuid = behaviorManifest.header?.uuid;
        oldBehaviorVersion = behaviorManifest.header?.version;
    }

    // Generate new UUIDs
    newResourceHeaderUuid = uuidv4();
    newBehaviorHeaderUuid = uuidv4();

    // Update Resource manifest
    if (existsSync(resourceManifestPath)) {
        console.log('Updating Resource manifest...');
        const resourceManifest = JSON.parse(readFileSync(resourceManifestPath, 'utf-8'));

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

        // Update dependency to Behavior Pack
        if (resourceManifest.dependencies && Array.isArray(resourceManifest.dependencies)) {
            for (const dependency of resourceManifest.dependencies) {
                if (
                    'uuid' in dependency &&
                    'version' in dependency &&
                    dependency.uuid === oldBehaviorUuid &&
                    JSON.stringify(dependency.version) === JSON.stringify(oldBehaviorVersion)
                ) {
                    console.log(
                        `  Dependency UUID (BP): ${dependency.uuid} -> ${newBehaviorHeaderUuid}`,
                    );
                    dependency.uuid = newBehaviorHeaderUuid;
                }
            }
        }

        writeFileSync(resourceManifestPath, JSON.stringify(resourceManifest, null, 4));
        console.log('Resource manifest updated successfully.\n');
    } else {
        console.log('Resource manifest.json not found.\n');
    }

    // Update Behavior manifest
    if (existsSync(behaviorManifestPath)) {
        console.log('Updating Behavior manifest...');
        const behaviorManifest = JSON.parse(readFileSync(behaviorManifestPath, 'utf-8'));

        behaviorManifest.header.uuid = newBehaviorHeaderUuid;
        console.log(`  Header UUID: ${oldBehaviorUuid} -> ${newBehaviorHeaderUuid}`);

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

        // Update dependency to Resource Pack
        if (behaviorManifest.dependencies && Array.isArray(behaviorManifest.dependencies)) {
            for (const dependency of behaviorManifest.dependencies) {
                if (
                    'uuid' in dependency &&
                    'version' in dependency &&
                    dependency.uuid === oldResourceUuid &&
                    JSON.stringify(dependency.version) === JSON.stringify(oldResourceVersion)
                ) {
                    console.log(
                        `  Dependency UUID (RP): ${dependency.uuid} -> ${newResourceHeaderUuid}`,
                    );
                    dependency.uuid = newResourceHeaderUuid;
                }
            }
        }

        writeFileSync(behaviorManifestPath, JSON.stringify(behaviorManifest, null, 4));
        console.log('Behavior manifest updated successfully.\n');
    } else {
        console.log('Behavior manifest.json not found.\n');
    }

    console.log('UUID generation complete!');
}

main();

import fs from 'fs';
import path from 'path';
import { MongoMemoryServer } from 'mongodb-memory-server';

const createTempDir = (name) => {
  const dir = path.resolve('./tmp', `${name}-${Date.now()}`);
  fs.mkdirSync(dir, { recursive: true });
  return dir;
};

const dbPath = createTempDir('mongo-seed-test');
const cacheDir = path.resolve('node_modules/.cache/mongodb-memory-server');
if (!fs.existsSync(cacheDir)) {
  fs.mkdirSync(cacheDir, { recursive: true });
}
console.log('dbPath', dbPath);
console.log('cacheDir', cacheDir);

try {
  const mongod = await MongoMemoryServer.create({
    instance: { dbPath, storageEngine: 'ephemeralForTest' },
    binary: { downloadDir: cacheDir }
  });
  const uri = await mongod.getUri();
  console.log('started', uri);
  await mongod.stop();
  console.log('stopped');
} catch (error) {
  console.error('ERROR:', error);
  process.exit(1);
}

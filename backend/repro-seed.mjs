import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { MongoMemoryServer } from 'mongodb-memory-server';
import csv from 'csv-parser';

dotenv.config();
const createTempDir = (name) => {
  const dir = path.resolve('./tmp', `${name}-${Date.now()}`);
  fs.mkdirSync(dir, { recursive: true });
  return dir;
};
const cacheDir = path.resolve('node_modules/.cache/mongodb-memory-server');
fs.mkdirSync(cacheDir, { recursive: true });
const dbPath = createTempDir('mongo-seed');
console.log('dbPath', dbPath);
try {
  const mongod = await MongoMemoryServer.create({
    instance: { dbPath, storageEngine: 'ephemeralForTest', port: 0, ip: '127.0.0.1' },
    binary: { downloadDir: cacheDir }
  });
  console.log('uri', mongod.getUri());
  await mongod.stop();
  console.log('stopped');
} catch (err) {
  console.error('ERROR', err);
}

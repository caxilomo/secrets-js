#!/usr/bin/env node

import fs from 'fs';
import crypto from 'crypto';
import {
  encryptedFileExists,
  keysExists,
  loadSecrets,
  truncate,
} from './appiclation/services';
import { GenerateKeypairHandler } from './appiclation/generate-keypair/generate-keypair.handler';
import { GenerateKeypairCommand } from './appiclation/generate-keypair/generate-keypair.command';
import { ListHandler } from './appiclation/list/list.handler';
import { ListCommand } from './appiclation/list/list.command';

const args = process.argv;
const privateKeyPath = process.env.PWD + '/private.pem';
const publicKeyPath = process.env.PWD + '/public.pem';
const encryptedDataPath = process.env.PWD + '/.env.enc';
const decryptedDataPath = process.env.PWD + '/.env';

const subcommand = args[2];

const commandHandler = {
  'generate-keypair': handleGenerateKeyPair,
  list: handleList,
  set: handleSet,
  get: handleGet,
  dump: handleDump,
};

if (commandHandler.hasOwnProperty(subcommand)) {
  try {
    commandHandler[subcommand]();
  } catch (error) {
    console.log(error.message);

    process.exit(1);
  }
} else {
  console.log('Usage: secrets [generate-keypair|list|set|get|dump]\n');
}

process.exit(0);

function handleGenerateKeyPair() {
  const handler: GenerateKeypairHandler = new GenerateKeypairHandler();
  const command: GenerateKeypairCommand = new GenerateKeypairCommand(
    privateKeyPath,
    publicKeyPath,
  );

  const result = handler.handle(command);

  console.table(result);
}

function handleList() {
  const handler: ListHandler = new ListHandler();
  const command: ListCommand = new ListCommand(encryptedDataPath);

  const result = handler.handle(command);

  console.table(result);
}

function encrypt(toEncrypt, publicKey) {
  const buffer = Buffer.from(toEncrypt, 'utf8');
  const encrypted = crypto.publicEncrypt(publicKey, buffer);

  return encrypted.toString('base64');
}

function decrypt(toDecrypt, privateKey) {
  const buffer = Buffer.from(toDecrypt, 'base64');
  const decrypted = crypto.privateDecrypt(privateKey, buffer);

  return decrypted.toString('utf8');
}

function handleSet() {
  if (!keysExists(privateKeyPath, publicKeyPath)) {
    console.log('Keypair not found, run before:\n\tsecrets generate-keypair');
    process.exit(1);
  }

  const publicKey = fs.readFileSync(publicKeyPath, 'utf8').toString();
  const key = args[3];
  const value = args[4];
  const encryptedValue = encrypt(value, publicKey);
  fs.appendFileSync(
    encryptedDataPath,
    key.toUpperCase() + '=' + encryptedValue + '\n',
  );

  console.table([{ key: key.toUpperCase(), value: truncate(encryptedValue) }]);
}

function handleGet() {
  if (!encryptedFileExists(encryptedDataPath)) {
    console.error('Secrets file not found.\n');
    process.exit(1);
  }

  if (!keysExists(privateKeyPath, publicKeyPath)) {
    console.log('Keypair not found, run before:\n\tsecrets generate-keypair');
    process.exit(1);
  }

  const keyToFind = args[3].toUpperCase();
  const privateKey = fs.readFileSync(privateKeyPath, 'utf8').toString();
  loadSecrets(encryptedDataPath).forEach((secret) => {
    if (secret.key === keyToFind) {
      secret.value = decrypt(secret.value, privateKey);
      console.table([secret]);

      process.exit(0);
    }
  });

  console.error('Secret not found.\n');
}

function handleDump() {
  if (!encryptedFileExists(encryptedDataPath)) {
    console.error('Secrets file not found.\n');
    process.exit(1);
  }

  if (!keysExists(privateKeyPath, publicKeyPath)) {
    console.log('Keypair not found, run before:\n\tsecrets generate-keypair');
    process.exit(1);
  }

  const privateKey = fs.readFileSync(privateKeyPath, 'utf8').toString();
  const dumpedContent = [];
  loadSecrets(encryptedDataPath).forEach((secret) => {
    secret.value = decrypt(secret.value, privateKey);
    dumpedContent.push(secret.key + '=' + secret.value);
  });

  fs.writeFileSync(decryptedDataPath, dumpedContent.join('\n'));

  console.log('Secrets dumped to: ' + decryptedDataPath + '\n');
}

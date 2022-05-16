#!/usr/bin/env node

import { GenerateKeypairHandler } from './appiclation/generate-keypair/generate-keypair.handler';
import { GenerateKeypairCommand } from './appiclation/generate-keypair/generate-keypair.command';
import { ListHandler } from './appiclation/list/list.handler';
import { ListCommand } from './appiclation/list/list.command';
import { SetHandler } from './appiclation/set/set.handler';
import { SetCommand } from './appiclation/set/set.command';
import { GetHandler } from './appiclation/get/get.handler';
import { GetCommand } from './appiclation/get/get.command';
import { DumpHandler } from './appiclation/dump/dump.handler';
import { DumpCommand } from './appiclation/dump/dump.command';

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

function handleSet() {
  const handler: SetHandler = new SetHandler();
  const command: SetCommand = new SetCommand(
    privateKeyPath,
    publicKeyPath,
    encryptedDataPath,
    args[3],
    args[4],
  );

  const result = handler.handle(command);

  console.table(result);
}

function handleGet() {
  const handler: GetHandler = new GetHandler();
  const command: GetCommand = new GetCommand(
    privateKeyPath,
    publicKeyPath,
    encryptedDataPath,
    args[3].toUpperCase(),
  );

  const result = handler.handle(command);

  console.table(result);
}

function handleDump() {
  const handler: DumpHandler = new DumpHandler();
  const command: DumpCommand = new DumpCommand(
    privateKeyPath,
    publicKeyPath,
    encryptedDataPath,
    decryptedDataPath,
  );

  const result = handler.handle(command);

  console.log('Secrets dumped to: ' + result + '\n');
}

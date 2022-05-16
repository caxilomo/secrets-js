import { DumpCommand } from './dump.command';
import {
  decrypt,
  encryptedFileExists,
  keysExists,
  loadSecrets,
} from '../services';
import { SecretsFileNotFoundException } from '../../domain/exception/secrets-file-not-found.exception';
import { KeyPairNotFoundException } from '../../domain/exception/key-pair-not-found.exception';
import fs from 'fs';

export class DumpHandler {
  handle(command: DumpCommand) {
    if (!encryptedFileExists(command.encryptedDataPath)) {
      throw new SecretsFileNotFoundException();
    }

    if (!keysExists(command.privateKeyPath, command.publicKeyPath)) {
      throw new KeyPairNotFoundException();
    }

    const privateKey = fs
      .readFileSync(command.privateKeyPath, 'utf8')
      .toString();
    const dumpedContent = [];
    loadSecrets(command.encryptedDataPath).forEach((secret) => {
      secret.value = decrypt(secret.value, privateKey);
      dumpedContent.push(secret.key + '=' + secret.value);
    });

    fs.writeFileSync(command.decryptedDataPath, dumpedContent.join('\n'));

    return command.decryptedDataPath;
  }
}

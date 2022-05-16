import {
  decrypt,
  encryptedFileExists,
  keysExists,
  loadSecrets,
} from '../services';
import { SecretsFileNotFoundException } from '../../domain/exception/secrets-file-not-found.exception';
import { KeyPairNotFoundException } from '../../domain/exception/key-pair-not-found.exception';
import fs from 'fs';
import { GetCommand } from './get.command';

export class GetHandler {
  handle(command: GetCommand) {
    if (!encryptedFileExists(command.encryptedDataPath)) {
      throw new SecretsFileNotFoundException();
    }

    if (!keysExists(command.privateKeyPath, command.publicKeyPath)) {
      throw new KeyPairNotFoundException();
    }

    const privateKey = fs
      .readFileSync(command.privateKeyPath, 'utf8')
      .toString();

    const secrets = loadSecrets(command.encryptedDataPath).map((secret) => {
      if (secret.key === command.keyToFind) {
        secret.value = decrypt(secret.value, privateKey);

        return secret;
      }
    });

    if (0 === secrets.length) {
      throw new SecretsFileNotFoundException();
    }

    return secrets;
  }
}

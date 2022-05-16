import { encrypt, keysExists, truncate } from '../services';
import { KeyPairNotFoundException } from '../../domain/exception/key-pair-not-found.exception';
import fs from 'fs';
import { SetCommand } from './set.command';
import crypto from 'crypto';

export class SetHandler {
  handle(command: SetCommand) {
    if (!keysExists(command.privateKeyPath, command.publicKeyPath)) {
      throw new KeyPairNotFoundException();
    }

    const publicKey = fs.readFileSync(command.publicKeyPath, 'utf8').toString();
    const encryptedValue = encrypt(command.value, publicKey);
    fs.appendFileSync(
      command.encryptedDataPath,
      command.key.toUpperCase() + '=' + encryptedValue + '\n',
    );

    return [
      { key: command.key.toUpperCase(), value: truncate(encryptedValue) },
    ];
  }
}

import { keysExists, truncate } from '../services';
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
    const encryptedValue = this.encrypt(command.value, publicKey);
    fs.appendFileSync(
      command.encryptedDataPath,
      command.key.toUpperCase() + '=' + encryptedValue + '\n',
    );

    return [
      { key: command.key.toUpperCase(), value: truncate(encryptedValue) },
    ];
  }

  encrypt(toEncrypt, publicKey) {
    const buffer = Buffer.from(toEncrypt, 'utf8');
    const encrypted = crypto.publicEncrypt(publicKey, buffer);

    return encrypted.toString('base64');
  }
}

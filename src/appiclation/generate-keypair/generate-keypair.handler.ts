import crypto from 'crypto';
import fs from 'fs';
import { keysExists, truncate } from '../services';
import { GenerateKeypairCommand } from './generate-keypair.command';
import { KeypairAlreadyExistsException } from '../../domain/exception/keypair-already-exists.exception';

export class GenerateKeypairHandler {
  handle(command: GenerateKeypairCommand) {
    if (keysExists(command.privateKeyPath, command.publicKeyPath)) {
      throw new KeypairAlreadyExistsException();
    }

    const keyPair = crypto.generateKeyPairSync('rsa', {
      modulusLength: 4096,
    });

    const publicKey = keyPair.publicKey.export({
      type: 'pkcs1',
      format: 'pem',
    });

    const privateKey = keyPair.privateKey.export({
      type: 'pkcs1',
      format: 'pem',
    });

    fs.writeFileSync(command.publicKeyPath, publicKey);

    fs.writeFileSync(command.privateKeyPath, privateKey);

    return [
      {
        type: 'public',
        path: command.publicKeyPath,
        value: truncate(publicKey),
      },
      {
        type: 'private',
        path: command.privateKeyPath,
        value: truncate(privateKey),
      },
    ];
  }
}

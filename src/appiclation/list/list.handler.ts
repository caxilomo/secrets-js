import { encryptedFileExists, loadSecrets } from '../services';
import { ListCommand } from './list.command';
import { SecretsFileNotFoundException } from '../../domain/exception/secrets-file-not-found.exception';

export class ListHandler {
  handle(command: ListCommand) {
    if (!encryptedFileExists(command.encryptedDataPath)) {
      throw new SecretsFileNotFoundException();
    }

    return loadSecrets(command.encryptedDataPath, true);
  }
}

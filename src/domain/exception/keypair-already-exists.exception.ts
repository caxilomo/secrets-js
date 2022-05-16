export class KeypairAlreadyExistsException extends Error {
  constructor() {
    super('Keypair already exists. Remove it before generate new keypair.');
  }
}

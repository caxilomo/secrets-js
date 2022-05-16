export class KeyPairNotFoundException extends Error {
  constructor() {
    super('Keypair not found, run before:\n\tsecrets generate-keypair');
  }
}

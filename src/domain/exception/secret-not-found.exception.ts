export class SecretNotFoundException extends Error {
  constructor() {
    super('Secret not found.');
  }
}

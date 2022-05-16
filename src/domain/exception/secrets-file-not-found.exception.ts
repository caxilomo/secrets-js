export class SecretsFileNotFoundException extends Error {
  constructor() {
    super('Secrets file not found.');
  }
}

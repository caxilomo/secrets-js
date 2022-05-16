export class GetCommand {
  constructor(
    readonly privateKeyPath: string,
    readonly publicKeyPath: string,
    readonly encryptedDataPath: string,
    readonly keyToFind: string,
  ) {}
}

export class DumpCommand {
  constructor(
    readonly privateKeyPath: string,
    readonly publicKeyPath: string,
    readonly encryptedDataPath: string,
    readonly decryptedDataPath: string,
  ) {}
}

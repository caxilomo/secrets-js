export class SetCommand {
  constructor(
    readonly privateKeyPath: string,
    readonly publicKeyPath: string,
    readonly encryptedDataPath: string,
    readonly key: string,
    readonly value: string,
  ) {}
}

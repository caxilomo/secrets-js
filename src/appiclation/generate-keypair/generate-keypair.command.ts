export class GenerateKeypairCommand {
  constructor(
    readonly privateKeyPath: string,
    readonly publicKeyPath: string,
  ) {}
}

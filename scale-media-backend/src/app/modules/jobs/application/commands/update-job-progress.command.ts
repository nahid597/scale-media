export class UpdateJobProgressCommand {
  constructor(public readonly id: string, public readonly progress: number) {}
}

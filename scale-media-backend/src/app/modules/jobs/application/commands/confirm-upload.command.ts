export class ConfirmUploadCommand {
  constructor(
    public readonly jobId: string,
    public readonly uploadId: string,
    public readonly fileKey: string,
    public readonly userId: string,
    public readonly metadata?: Record<string, unknown>
  ) {}
}

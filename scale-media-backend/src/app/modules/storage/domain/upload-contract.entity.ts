export class UploadContract {
  constructor(public uploadUrl: string, public objectKey: string, public expiresIn: number) {}
}

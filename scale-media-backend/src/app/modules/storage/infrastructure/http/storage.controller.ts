import { Body, Controller, Post, Req } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreateUploadDto } from '../../application/dto/create-upload.dto';
import { CreateUploadCommand } from '../../application/command/create-upload.command';

@Controller('uploads')
export class StorageController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('presign')
  async createUploadUrl(@Body() dto: CreateUploadDto, @Req() req: any) {
    const userId = req?.user?.id || 'anonymous';
    return this.commandBus.execute(new CreateUploadCommand(userId, dto.extension));
  }
}

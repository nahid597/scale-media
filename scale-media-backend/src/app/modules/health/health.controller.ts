import { Controller, Get } from '@nestjs/common';
import {
  HealthCheckService,
  MemoryHealthIndicator,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';

@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly db: TypeOrmHealthIndicator,
    private readonly memory: MemoryHealthIndicator
  ) {}

  @Get()
  check() {
    return this.health.check([
      async () => this.db.pingCheck('database'),
      async () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
    ]);
  }
}

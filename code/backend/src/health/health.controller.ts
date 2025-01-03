import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';
import { HttpHealthIndicator } from '@nestjs/terminus';
import { MongooseHealthIndicator } from '@nestjs/terminus';
import { DiskHealthIndicator } from '@nestjs/terminus';
import { MemoryHealthIndicator } from '@nestjs/terminus';

@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly http: HttpHealthIndicator,
    private readonly mongoose: MongooseHealthIndicator,
    private readonly disk: DiskHealthIndicator,
    private readonly memory: MemoryHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      async () =>
        this.http.pingCheck('https://www.google.com', 'https://www.google.com'),
      async () => this.mongoose.pingCheck('mongo'),
      async () =>
        this.disk.checkStorage('disk_health', {
          thresholdPercent: 0.9, 
          path: '/',
        }),
      async () =>
        this.memory.checkHeap('memory_heap', 300 * 1024 * 1024),
      async () =>
        this.memory.checkRSS('memory_rss', 300 * 1024 * 1024), 
    ]);
  }
}

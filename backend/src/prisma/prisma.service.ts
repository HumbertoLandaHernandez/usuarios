import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleDestroy {
  constructor(config: ConfigService) {
    super({
      adapter: new PrismaPg({ connectionString: config.getOrThrow<string>('DATABASE_URL') }),
      // El hash nunca sale en las consultas salvo que se pida con omit: { Contrasena: false }
      omit: { usuario: { Contrasena: true } },
    });
  }

  onModuleDestroy() {
    return this.$disconnect();
  }
}

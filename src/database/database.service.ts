import { Injectable, OnApplicationShutdown, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class DatabaseService extends PrismaClient implements OnModuleInit,OnApplicationShutdown {
  constructor(){
    super({
      errorFormat:"pretty",
      log:['warn','error','info',{emit:'event',level:'query'}]
    })
  }
  async onModuleInit() {
    this.$connect()
  }
  async onApplicationShutdown() {
    await this.$disconnect()
  }
}

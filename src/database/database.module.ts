import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { AuthRepository } from './repositories/auth.repo';

@Module({
  providers: [DatabaseService,AuthRepository],
  exports:[AuthRepository]
})
export class DatabaseModule implements OnModuleInit{
  private readonly logger=new Logger(DatabaseModule.name)
  onModuleInit() {
    this.logger.log("Database module initialized")
  }
}

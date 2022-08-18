import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { environment } from '../environments/environment';
import { UserModule } from './modules/user/user.module';
@Module({
  imports: [MongooseModule.forRoot(environment.db_uri), UserModule],
  controllers: [],
  providers: [],
})

export class AppModule {}

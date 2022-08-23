import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { environment } from '../environments/environment';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
@Module({
  imports: [UserModule, AuthModule, MongooseModule.forRoot(environment.db_uri)],
  controllers: [],
  providers: [],
})
export class AppModule {}

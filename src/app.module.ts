import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';


@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot('mongodb://mongo:cGLfqkVZSCcyOKMkTdWSPUuVPUbFMHNv@monorail.proxy.rlwy.net:56929',{
      dbName :'auth-db',
    }),
    AuthModule],
 
})
export class AppModule {
  
}

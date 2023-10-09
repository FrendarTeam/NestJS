import { ConfigModule } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

ConfigModule.forRoot({ envFilePath: `.${process.env.NODE_ENV}.env` });

console.log(`[🔥DB - ${process.env.NODE_ENV}] `);

export const typeORMConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: 3306,
  password: process.env.DB_PASSWORD,
  username: process.env.DB_USER,
  database: process.env.DB_DB,
  entities: [__dirname + '/../../**/*.entity.{js,ts}'],
  synchronize: false,
  //   keepConnectionAlive: true,
  //   migrations: ['./dist/migrations/*.{js,ts}'],
  //   charset: 'utf8mb4',
  //   logging: process.env.NODE_ENV !== 'production' ? true : false,
  //   timezone: 'Z',
  //   extra: {
  //     connectionLimit: 20,
  //   },
};

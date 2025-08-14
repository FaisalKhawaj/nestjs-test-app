import { registerAs } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
config();

config({ path: `.env.${process.env.NODE_ENV}` });

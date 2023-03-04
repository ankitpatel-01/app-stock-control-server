import { DataSource, DataSourceOptions } from 'typeorm';

export const dataSourceOptions: DataSourceOptions = {
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: '@Ankit!123',
    database: 'stock_control',
    entities: ['dist/**/*.entity.js'],
    migrations: ['dist/database/migration/*.js'],
    synchronize: true,
    logging: true,
}

const dataSource = new DataSource(dataSourceOptions);

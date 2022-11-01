module.exports = {
  port: Number.parseInt(process.env.DATABASE_PORT, 10),
  host: process.env.DATABASE_HOST,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_DATABASE,
  logging: false,
  entities: ['dist/**/*.entity{.ts,.js}'],
  synchronize: false,
  type: 'mysql'
};
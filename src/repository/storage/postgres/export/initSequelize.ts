import { Sequelize } from 'sequelize';

// Initialize Sequelize with database credentials
export const sequelize = new Sequelize('ploshadka', 'postgres', 'postgres', {
  host: '127.0.0.1',
  dialect: 'postgres', // or 'mysql' | 'sqlite' | 'mariadb' | 'mssql' based on your database
});

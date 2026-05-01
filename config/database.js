import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const commonOptions = {
  logging: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};

const createLocalInstance = () => {
  return new Sequelize(
    process.env.DB_NAME || 'salonx',
    process.env.DB_USER || 'postgres',
    process.env.DB_PASSWORD || 'password',
    {
      ...commonOptions,
      host: process.env.DB_HOST || 'localhost',
      dialect: process.env.DB_DIALECT || 'postgres',
      port: process.env.DB_PORT || 5432,
    }
  );
};

const createUrlInstance = () => {
  if (!process.env.DB_URL) return null;
  return new Sequelize(process.env.DB_URL, {
    ...commonOptions,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  });
};

// Default to local instance (skip remote URL)
let activeInstance = createLocalInstance();

// Export activeInstance directly
export const getActiveInstance = () => activeInstance;

export const switchToLocal = () => {
  console.log("Switching to local database configuration...");
  activeInstance = createLocalInstance();
  return activeInstance;
};

export const getIsUsingUrl = () => !!(process.env.DB_URL && activeInstance.options.replication === undefined);

export default activeInstance;

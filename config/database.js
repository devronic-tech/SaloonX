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

let activeInstance = createUrlInstance() || createLocalInstance();

// Proxy to allow switching instances dynamically
const sequelizeProxy = new Proxy({}, {
  get(target, prop) {
    const val = activeInstance[prop];
    if (typeof val === 'function') {
      return val.bind(activeInstance);
    }
    return val;
  }
});

export const switchToLocal = () => {
  console.log("Switching to local database configuration...");
  activeInstance = createLocalInstance();
  return activeInstance;
};

export const getIsUsingUrl = () => !!(process.env.DB_URL && activeInstance.options.replication === undefined); // Simple check

export default sequelizeProxy;

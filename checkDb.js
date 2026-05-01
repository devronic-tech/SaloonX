import { switchToLocal } from './config/database.js';
import sequelize from './config/database.js';

// Import all models to register them
import './models/User.js';
import './models/otpModel.js';
import './models/ownerModel.js';
import './models/ownerOtp.js';
import './models/salonModel.js';
import './models/Service.js';

switchToLocal();

async function syncTables() {
  try {
    console.log('Syncing database tables...');
    await sequelize.sync({ force: true });
    console.log('Tables synced successfully.');
    
    const [results] = await sequelize.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
    console.log('Tables:', JSON.stringify(results, null, 2));
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await sequelize.close();
  }
}

syncTables();
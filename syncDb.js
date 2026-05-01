import "dotenv/config";

// Import all models FIRST (they will register with the initial DB instance)
import "./models/User.js";
console.log('Imported User');
import "./models/otpModel.js";
console.log('Imported Otp');
import "./models/ownerModel.js";
console.log('Imported Owner');
import "./models/ownerOtp.js";
console.log('Imported OwnerOtp');
import "./models/salonModel.js";
console.log('Imported Salon');
import "./models/Service.js";
console.log('Imported Service');

// Now import and switch to local
import { switchToLocal, getActiveInstance } from "./config/database.js";

switchToLocal();
const sequelize = getActiveInstance();

async function syncTables() {
  try {
    console.log('Before sync - checking models...');
    
    // Check registered models
    console.log('Registered models:', Object.keys(sequelize.models));
    
    console.log('Syncing database tables with force: true...');
    await sequelize.sync({ force: true });
    console.log('Tables synced successfully.');
    
    const [results] = await sequelize.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
    console.log('Tables:', JSON.stringify(results, null, 2));
  } catch (error) {
    console.error('Error:', error.message);
    console.error(error.stack);
  } finally {
    await sequelize.close();
  }
}

syncTables();
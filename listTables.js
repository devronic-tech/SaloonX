import "dotenv/config";
import sequelize, { switchToLocal } from "./config/database.js";

// Force local database
switchToLocal();

async function checkTables() {
  try {
    await sequelize.authenticate();
    console.log('Connected to database');
    
    const [results] = await sequelize.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
    console.log('Tables:', JSON.stringify(results, null, 2));
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await sequelize.close();
  }
}

checkTables();
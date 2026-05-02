import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('salonx', 'postgres', '@Pass7234', { 
  host: 'localhost', 
  dialect: 'postgres', 
  port: 5433 
});

async function getOwner() {
  try {
    const result = await sequelize.query(
      "SELECT id, email FROM owners LIMIT 1",
      { type: sequelize.QueryTypes.SELECT }
    );
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await sequelize.close();
  }
}

getOwner();
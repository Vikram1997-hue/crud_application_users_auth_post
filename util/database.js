const Sequelize = require('sequelize');

const sequelize = new Sequelize('sequelize_first_project', 'user_1', 'test123', {
    host: 'localhost',
    dialect: 'postgresql',
    pool: { max: 5, min: 0, idle: 3000 },
    logging: false,
});



sequelize.authenticate().then(() => {
    console.log('Connection successful');
})
.catch((err) => {
    console.error(`Error in connection attempt: ${err}\tBHAI KA NAAAAAM ${err.name}`);
});



module.exports = sequelize;

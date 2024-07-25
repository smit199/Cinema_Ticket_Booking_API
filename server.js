const dotenv = require('dotenv');
const mongoose = require('mongoose');
const app = require('./app');

process.on('uncaughtException', err => {
    console.log(err.name, err.message);
    process.exit(1);
});

dotenv.config({path: './config/.env'});
dotenv.config({path: `./config/.env.${process.env.NODE_ENV}`});
mongoose.connect(process.env.DATABASE);

const server = app.listen(process.env.PORT, () => {
    console.log(`Application is running on port ${process.env.PORT}`);
});

module.exports = server;

// To globally handle any unhandled or rejected promises error
process.on('unhandledRejection', err => {
    console.log(err.name, err.message);
    server.close(() => process.exit(1));
});
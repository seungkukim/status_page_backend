const Sequelize = require('sequelize');
const Post = require('./Post');
const Status = require('./Status');

const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

db.sequelize = sequelize;

db.Post = Post;
db.Status = Status;

Post.init(sequelize);
Status.init(sequelize);

Post.associate(db);
Status.associate(db);

module.exports = db;

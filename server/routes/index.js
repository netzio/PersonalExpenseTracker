const userRoutes = require('./user.routes');

module.exports = function (app) {
  app.use('/api/users', userRoutes);
};

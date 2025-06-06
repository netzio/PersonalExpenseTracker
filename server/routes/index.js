const userRoutes = require('./user.routes');
const authRoutes = require('./auth.routes');

module.exports = function (app) {
  app.use('/api/users', userRoutes);
  app.use('/api/auth', authRoutes);
};

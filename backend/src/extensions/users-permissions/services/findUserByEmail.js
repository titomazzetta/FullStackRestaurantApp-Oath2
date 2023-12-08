// Path: ./src/extensions/users-permissions/services/findUserByEmail.js

module.exports = async function findUserByEmail(email) {
    try {
      const users = await strapi.entityService.findMany('plugin::users-permissions.user', {
        filters: { email: email },
        limit: 1,
      });
      return users[0] || null;
    } catch (error) {
      strapi.log.error('findUserByEmail error:', error);
      throw new Error('Error finding user by email');
    }
  }
  
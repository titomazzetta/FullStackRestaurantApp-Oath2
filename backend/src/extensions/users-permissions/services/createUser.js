// Path: ./src/extensions/users-permissions/services/createUser.js

module.exports = async function createUser(userData) {
    try {
      const user = await strapi.entityService.create('plugin::users-permissions.user', {
        data: userData,
      });
      return user;
    } catch (error) {
      strapi.log.error('createUser error:', error);
      throw new Error('Error creating new user');
    }
  }
  
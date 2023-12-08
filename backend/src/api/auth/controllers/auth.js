const { google } = require('googleapis');
const { sanitize } = require('@strapi/utils');
const findUserByEmail = require('../../../extensions/users-permissions/services/findUserByEmail');
const createUser = require('../../../extensions/users-permissions/services/createUser');

module.exports = {
  async googleAuth(ctx) {
    const { access_token } = ctx.request.body;

    try {
      const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET
      );
      oauth2Client.setCredentials({ access_token });

      const oauth2 = google.oauth2({
        auth: oauth2Client,
        version: 'v2',
      });
      const userInfoResponse = await oauth2.userinfo.get();
      const userInfo = userInfoResponse.data;

      console.log("User Info from Google:", userInfo);

      let user = await findUserByEmail(userInfo.email);

      if (!user) {
        console.log("User not found, creating new user...");
        const authenticatedRole = await strapi.query('plugin::users-permissions.role').findOne({
          where: { type: 'authenticated' },
        });

        user = await createUser({
          username: userInfo.email.split('@')[0],
          email: userInfo.email,
          provider: 'google',
          confirmed: true,
          blocked: false,
          role: authenticatedRole.id,
        });

        console.log("Created User:", user);
      } else {
        console.log("User found:", user);
      }

      const jwt = strapi.plugins['users-permissions'].services.jwt.issue({
        id: user.id,
      });

      const sanitizedUser = await sanitize.contentAPI.output(user, strapi.getModel('plugin::users-permissions.user'), {
        auth: ctx.state.auth,
      });

      ctx.body = {
        jwt,
        user: sanitizedUser,
      };

    } catch (error) {
      console.error('Error in googleAuth:', error);
      ctx.throw(500, 'Internal server error');
    }
  },
};

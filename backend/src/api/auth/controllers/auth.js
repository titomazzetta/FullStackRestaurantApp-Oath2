// src/api/auth/controllers/auth.js

const { google } = require('googleapis');
const { Octokit } = require("@octokit/rest");
const axios = require('axios');

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

  async githubAuth(ctx) {
    const { access_token } = ctx.request.body;

    if (!access_token) {
      return ctx.badRequest('Access token is missing');
    }

    try {
      const octokit = new Octokit({
        auth: access_token,
      });

      const githubResponse = await octokit.rest.users.getAuthenticated();
      const githubUserData = githubResponse.data;

      console.log("User Info from GitHub:", githubUserData);

      // Fallback email address using GitHub username
      const fallbackEmail = `${githubUserData.login}@users.noreply.github.com`;

      let user = await findUserByEmail(githubUserData.email || fallbackEmail);

      if (!user) {
        console.log("User not found, creating new user...");
        const authenticatedRole = await strapi.query('plugin::users-permissions.role').findOne({
          where: { type: 'authenticated' },
        });
        

        user = await createUser({
          username: githubUserData.login,
          email: githubUserData.email || fallbackEmail,
          provider: 'github',
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

      const sanitizedUser = sanitize.contentAPI.output(user, strapi.getModel('plugin::users-permissions.user'), {
        auth: ctx.state.auth,
      });

      ctx.body = {
        jwt,
        user: sanitizedUser,
      };

    } catch (error) {
      console.error('Error in githubAuth:', error);
      ctx.throw(500, 'Internal server error');
    }
  },

};

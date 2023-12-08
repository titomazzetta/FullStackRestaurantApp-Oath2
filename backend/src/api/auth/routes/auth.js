// src/api/auth/routes/auth.js

module.exports = {
    routes: [
      {
        method: 'POST',
        path: '/auth/google',
        handler: 'auth.googleAuth',
        config: {
          auth: false,
        },
      },
    ],
  };
  
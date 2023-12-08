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
    {
      method: 'POST',
      path: '/auth/github',
      handler: 'auth.githubAuth',
      config: {
        auth: false,
      },
    },
  ],
};

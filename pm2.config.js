module.exports = {
    apps: [
      {
        name: 'timeshub',
        script: 'bin/www',
        env: {
          NODE_ENV: 'production', 
        },
        env_file: '.env', 
      },
    ],
};
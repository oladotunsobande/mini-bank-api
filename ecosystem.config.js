module.exports = {
  apps: [
    {
      name: 'MONO-BANK-API',
      script: './node_modules/.bin/ts-node',
      args: 'src/server.ts',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
    },
  ],
};

module.exports = {
  apps: [{
    name: 'backend',
    script: 'dist/app.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production'
    }
  }]
}

// 실행: pm2 start ecosystem.config.js 
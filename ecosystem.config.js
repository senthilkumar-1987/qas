module.exports = {
    apps : [
        {
            name: "SIRIM-SERVER",
            script: "./app.js",
            max_memory_restart: '5G',
            env_development: {
                "PORT": 443,
                "NODE_ENV": "development"
            },
            env_production: {
                "PORT": 443,
                "NODE_ENV": "production",
            }
        }
    ]
}
var config = {
	dev : {
		DB_PATH : process.env.MONGOHQ_URL || "mongodb://localhost/27017/DB",

		FACEBOOK : {
			CLIENT_ID 		: 'xxxxxxxxxxxxxxxxxxxxxxxxxxx',
			CLIENT_SECRET 	: 'xxxxxxxxxxxxxxxxxxxxxxxxxxx',
			CALLBACK_URL	: 'http://localhost:3000/auth/facebook/callback'
		}
	},

	production : {
		DB_PATH : process.env.MONGOHQ_URL
	}

};

module.exports = function(mode) {
	return config[mode || process.argv[2] || 'dev'] || config.dev;
}

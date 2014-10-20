var config = {
	dev : {
		DB_PATH : "mongodb://localhost/27017/DB",

		FACEBOOK : {
			CLIENT_ID 		: '670211293040806',
			CLIENT_SECRET 	: '007688ba3bc825cfec329a4511152750',
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

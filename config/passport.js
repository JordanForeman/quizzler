// config/passport.js

// Packages
var FacebookStrategy	= require('passport-facebook');

// Models
var User				= require('../app/models/user');

// config
var config = require('../config')();

module.exports = function(passport) {

	// used to serialize user for the session
	passport.serializeUser(function(user, done){
		done(null, user.id);
	});

	// used to deserialize the user
	passport.deserializeUser(function(id, done){
		User.findById(id, function(err, user){
			done(err, user);
		});
	});

	//=========================================================
	//	FACEBOOK
	//=========================================================

	passport.use(new FacebookStrategy({

		// pull in our app id and secret from our configuration
		clientID		: config.FACEBOOK.CLIENT_ID,
		clientSecret	: config.FACEBOOK.CLIENT_SECRET,
		callbackURL		: config.FACEBOOK.CALLBACK_URL

	},

	// facebook will send back the token and profile
	function(token, refreshToken, profile, done) {

		process.nextTick(function(){

			// find the user in the database based on their facebook id
			User.findOne({ 'facebook.id ' : profile.id }, function(err, user){

				if (err)
					return done(err);

				// if user is found, then log them in
				if (user) {
					return done(null, user);
				} else {
					// if there is no user found with that facebook id, create them
					var newUser				= new User();

					// set all of the facebook information in our user model
					newUser.facebook.id 	= profile.id;
					newUser.facebook.token 	= token;
					newUser.facebook.name 	= profile.name.givenName + ' ' + profile.name.familyName;
					newUser.facebook.email	= profile.emails[0].value;

					// save our new user
					newUser.save(function(err){
						if (err)
							throw err;

						return done(null, newUser);
					});
				}

			});

		});

	}));


};

var router 		= require('express').Router(),
	passport 	= require('passport');

router.get('/', function(req, res){
	res.render('index.ejs', {title: 'Welcome to Chirply!'});
});

router.get('/auth/facebook', passport.authenticate('facebook', {scope : ['email', 'user_photos']}));

router.get('/auth/facebook/callback',
		passport.authenticate('facebook', {
			successRedirect : '/profile',
			failureRedirect : '/'
		}));

router.get('/logout', function(req, res){
	req.logout();
	res.redirect('/');
});

module.exports 	= router;
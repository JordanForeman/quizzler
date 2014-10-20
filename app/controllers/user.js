var router 		= require('express').Router();

router.get('/profile', isLoggedIn, function(req, res){
	res.render('')
});

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home pages
	res.redirect('/');
}

module.exports 	= router;

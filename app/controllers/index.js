var router = require('express').Router();

router.get('/', function(req, res){
	res.render('index.ejs', {title: 'Welcome to Quizzler!'});
});

module.exports = router;
var router = require('express').Router();

router.get('/', function(req, res){
	res.render('index.ejs', {title: 'Welcome to Quizzler!'});
});

router.get('/snippetTester', function(req, res){
	res.render('test');
});

module.exports = router;
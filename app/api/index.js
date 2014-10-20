var router = require('express').Router(),
	Quiz = require('../models/quiz');

// test route to make sure everything is working
router.get('/', function(req, res){
	res.json({message: 'hooray! welcome to our api!' });
});

router.get('/quiz/:id', function(req, res){
	var quizId = req.params.id;
	Quiz.findOne({_id: quizId})
		.populate('questions results')
		.exec(function(err, quiz){
			if (err) {
				return console.log(err);
			}
			res.json(quiz);
		});
});

module.exports = router;

var router = require('express').Router(),
	Quiz = require('../models/quiz'),
	QuizResult = require('../models/quizResult'),
	Question = require('../models/question');

router.get('/new', function(req, res){
	res.render('createQuiz.ejs');
});

router.get('/:id', function(req, res, next){
	var quizId = req.params.id;
	
	Quiz.findOne({_id: quizId})
		.populate('questions results')
		.exec(function(err, quiz){
			if (err) {
				return next(err);
			}
			res.render('quizView.ejs', {quiz: quiz});
		});
});

module.exports = router;

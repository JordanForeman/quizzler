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

// TODO: add quiz id to user's list of liked quizzes
router.post('/quiz/like/:id', function(req, res, next){
	var quizId = req.params.id;

	Quiz.findOne({_id: quizId})
		.exec(function(err, quiz){
			if (err) return next(err);

			quiz.likes++;
			quiz.save(function(err){
				if (err)
					console.log(err)

				return next(err);
			});
		});
});

module.exports = router;

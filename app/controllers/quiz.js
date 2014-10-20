var router = require('express').Router(),
	Quiz = require('../models/quiz'),
	QuizResult = require('../models/quizResult'),
	Question = require('../models/question');

router.get('/new', function(req, res){
	res.render('createQuiz2.ejs');
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

router.post('/new', function(req, res){

	var payload = req.body,
		quiz = new Quiz({
			title: payload['quizTitle'],
			scoringModel: payload['quizType'],
			description: payload['quizDescription'],

			startPrompt: payload['quizStartText'],
			restartPrompt: payload['quizRestartText']
		}),
		numQuestions = payload['numQuestions'],
		numResults = payload['numResults'];

	// Generate Questions
	var i, questionsArray = [];
	for (i = 1; i <= numQuestions; i++) {
		var questionId = 'quizQuestion' + i
			question = new Question({
				description: payload[questionId],
				quiz: quiz._id,
				choices: []
			});

		// Answers
		for (var j = 0; j < 4; j++) {
			var answer = {},
				answerValue = '';

			switch(j) {
				case 0:
					answerValue = 'a';
					break;
				case 1:
					answerValue = 'b';
					break;
				case 2:
					answerValue = 'c';
					break;
				case 3:
					answerValue = 'd';
					break;
				default:
					break;
			}

			answer['value'] = answerValue;
			answer['description'] = payload[questionId + '-' + answerValue];

			question.choices.push(answer);
		}

		questionsArray.push(question.id);
		question.save(function(err){
			if (err)
				throw err;
		});
	}
	quiz.questions = questionsArray;

	// Generate Results
	var resultsArray = [];
	for (i = 1; i <= numResults; i++) {
		var resultId = 'quizResult' + i
			result = new QuizResult({
				title: payload[resultId],
				quiz: quiz._id,
				description: payload[resultId + '-description'],
				image: '',
				value: payload[resultId + '-value']
			});

		resultsArray.push(result.id);
		result.save(function(err){
			if (err)
				throw err;
		});
	}
	quiz.results = resultsArray;

	// Save Quiz to DB
	quiz.save(function(err){
		if (err)
			throw err;
	});
	console.log("Successfully saved quiz " + quiz.id);
	return res.redirect('/quiz/' + quiz.id);

});

module.exports = router;

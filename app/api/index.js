var router = require('express').Router(),
	cors = require('cors'),
	Question = require('../models/question'),
	Result = require('../models/quizResult'),
	Quiz = require('../models/quiz');

router.use(cors());

// test route to make sure everything is working
router.get('/', function(req, res){
	res.json({message: 'hooray! welcome to our api!' });
});

// ======================
//
// Quiz endpoints
//
// ======================
router.get('/quiz/data/:id', function(req, res){
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

router.get('/quiz/:id', function(req, res){
	var quizId = req.params.id;
	Quiz.findOne({_id: quizId})
		.populate('questions results')
		.exec(function(err, quiz){
			if (err)
				res.status(500).end();
			res.render('view', {quiz: quiz, pageType: 'QuizView'}, function(err, html){
				if (err)
					return res.status(500);
				res.jsonp({ view: html });
			});
		});
});

router.post('/new/quiz', function(req, res){

	var payload = req.body,
		questions = payload.questions,
		results = payload.results;

	console.log('========== Received Quiz Payload ===========')
	console.log(payload);

	// Delete objects that can't be automatically processed by mongoose
	delete payload.init;
	payload.questions = [];
	payload.results = [];


	quiz = new Quiz(payload);

	console.log('========== Questions ===========')
	for (var i = 0; i < questions.length; i++) {
		var question = new Question(questions[i]);
		question.quiz = quiz;
		question.save();

		quiz.questions.push(question._id);
		console.log(question._id);
	};

	console.log('========== Results ===========')
	for (var j = 0; j < results.length; j++) {
		var result = new Result(results[j]);
		result.quiz = quiz;
		result.save();

		quiz.results.push(result._id);
		console.log(result._id);
	};

	quiz.save();

	res.end(JSON.stringify({
		message: "Success",
		quizData: quiz
	}));

});

module.exports = router;

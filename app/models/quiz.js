var mongoose = require('mongoose'),
	scoringModels = {
		MOST_COMMON: "mostcommon",
		SUMRANGE: "sumrange"
	};

var quizSchema = mongoose.Schema({

	title: String,
	scoringModel: String,
	description: String,

	startPrompt: String,
	restartPrompt: String,

	questions: [{
		ref: 'Question',
		type: mongoose.Schema.Types.ObjectId
	}],
	results: [{
		ref: 'QuizResult',
		type: mongoose.Schema.Types.ObjectId
	}]

});

module.exports = mongoose.model('Quiz', quizSchema);
var mongoose = require('mongoose');

var quizSchema = mongoose.Schema({

	title: String,
	scoringModel: String,
	description: String,

	startPrompt: String,
	restartPrompt: String,

	likes: Number,
	image: String,

	scoringModel: {
		type: String,
		enum: ['mostcommon', 'sumrange']
	},

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
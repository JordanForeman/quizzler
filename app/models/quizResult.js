var mongoose = require('mongoose');

var quizResultSchema = new mongoose.Schema({

	value: {
		value: String,
		threshold: {
			min: Number,
			max: Number
		}
	},
	quiz: mongoose.Schema.Types.ObjectId,
	title: String,
	description: String,
	image: String

});

module.exports = mongoose.model('QuizResult', quizResultSchema);

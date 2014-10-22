var mongoose = require('mongoose');

var questionSchema = new mongoose.Schema({

	title: String,
	quiz: mongoose.Schema.Types.ObjectId,
	choices: [{
		value: mongoose.Schema.Types.Mixed,
		description: String
	}],
	image: String

});

module.exports = mongoose.model('Question', questionSchema);

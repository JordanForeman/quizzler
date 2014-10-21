var mongoose = require('mongoose');

var questionSchema = new mongoose.Schema({

	title: String,
	quiz: mongoose.Schema.Types.ObjectId,
	choices: [{
		value: String,
		description: String
	}]

});

module.exports = mongoose.model('Question', questionSchema);

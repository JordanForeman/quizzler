var app = window.app || {};

app.Quiz = {

	title: '',
	scoringModel: 'mostcommon',
	description: '',

	startPrompt: 'Take Quiz',
	restartPrompt: 'Retake Quiz',

	questions: [],
	results: [],

	init: function() {

		this.questions = [{
			choices: []
		}];

		this.results = [{
			value: "a"
		}];

		return this;
	}

};

var app = window.app || {};

app.QuizView = app.QuizView || {

	quizId: '',
	element: null,
	quizData: {},
	decisions: [],
	
	init: function(selector, QuizId) {

		this.element = $(selector);
		this.loadData(QuizId, this.generateQuiz);
	},

	startQuiz: function() {
		this.progressQuiz.bind(this)();
	},

	retakeQuiz: function() {
		this.flushDecisions();
		this.progressQuiz();
	},

	getFirstScreen: function() {
		return $(this.element).find('ul li:first-of-type');
	},

	getLastScreen: function() {
		return $(this.element).find('ul li:last-of-type');
	},

	getCurrentScreen: function() {
		return $(this.element).find('ul li.active');
	},

	getNextScreen: function() {
		var nextScreen = $(this.element).find('ul li.active').nextElementSibling;

		if (!nextScreen) {
			return this.getFirstScreen();
		}

		return nextScreen;
	},

	loadData: function(quizId, callBack) {
		$.ajax({
			url: '/api/quiz/' + quizId,
			success: callBack
		});
	},

	generateQuiz: function(data) {
		app.QuizView.quizData = data;
		console.log(app.QuizView.quizData);

		app.QuizView.generateQuizHTML();
		app.QuizView.addListeners();
	},

	generateQuizHTML: function() {

		// Quiz Screen List Container
		var Screens = document.createElement('ul');

		// Landing
		var landingHTMLString = '<li class="transition horizontal active"><section id="landingHeader" class="header"><h1>';
			landingHTMLString+= this.quizData.title + '</h1></section><section class="content">';
			landingHTMLString+= this.quizData.description + '<button id="takeQuizButton">';
			landingHTMLString+= this.quizData.startPrompt + '</button></section></li>';
		$(this.element).append(landingHTMLString);

		// Questions
		[].forEach.call(this.quizData.questions, function(question){

			var questionHTMLString = '<li class="transition vertical"><section id="" class="header"><h2>';
				questionHTMLString+= question.description + '</h2></section><section class="content"><ul class="answers">';

				[].forEach.call(question.choices, function(choice){
					questionHTMLString+= '<li data-answer="';
					questionHTMLString+= choice.value + '"><button>';
					questionHTMLString+= choice.description + '</button></li>';
				});

				questionHTMLString+= '</ul></section></li>';
			$(app.QuizView.element).append(questionHTMLString);

		});

		// Ending Slide
		var endingHTMLString = '<li class="transition horizontal results"><section id="resultHeader" class="header"><h2 id="quizResultTitle"></h2></section><section class="content"><div id="quizResultContents"></div><button id="retakeQuizButton">'
			endingHTMLString+= this.quizData.restartPrompt + '</button>/section></li>';
		$(this.element).append(endingHTMLString);

	},

	flushDecisions: function() {
		this.decisions = [];
	},

	addListeners: function() {
		$('.answers li').click(app.QuizView.answerQuestion);
		$('#takeQuizButton').click(app.QuizView.startQuiz.bind(this));
		$('#retakeQuizButton').click(app.QuizView.retakeQuiz.bind(this));
	},

	answerQuestion: function() {
		var answer = $(this).data('value');
		app.QuizView.decisions.push(answer);
		app.QuizView.progressQuiz();
	},

	addLoader: function(screen) {
		var loader = '<div class="loader"></div>';
		$(this.getCurrentScreen()).html(loader);
	},

	removeLoader: function(screen) {
		$(this.getCurrentScreen()).find('.loader').remove();
	},

	getResults: function(results) {
		switch(this.quizData.scoringModel) {
			case "mostcommon":
				return this.getMostCommon(results)
				break;
			default: 
				break;
		}
	},

	getMostCommon: function(results) {
		var counts = {};
		for(var index = 0; index < this.decisions.length; index++) {
		  if(this.decisions[index] in counts) {
			counts[this.decisions[index]]++;
		  } else {
			counts[this.decisions[index]] = 1;
		  }
		}
		
		var chosenValue = this.decisions[0];
		for(var value in counts) {
		  if(counts[value] > counts[chosenValue]) {
			chosenValue = value;
		  }
		}
		
		var chosenResult = null;
		if(results != null) {
		  for(var index = 0; index < results.length; index++) {
			if(results[index]["value"] == chosenValue) {
			  chosenResult = results[index];
			}
		  }
		}
		
		return chosenResult;
	},

	finishQuiz: function(result) {

		$('#resultHeader').css('background-image', result['image']);
		$('#quizResultTitle').html(result['title']);
		$('#quizResultContents').html(result['description']);

	},

	progressQuiz: function() {
	
		var currentScreen = this.getCurrentScreen(),
			nextScreen = this.getNextScreen();

		if ( $(currentScreen).hasClass('closing') ) {

			// Finish closing, start opening next screen
			$(currentScreen).removeClass('closing').removeClass('active');
			$(nextScreen).addClass('opening').addClass('active');

			this.addLoader(currentScreen);
			setTimeout(this.progressQuiz.bind(this), 1000);

		} else if($(currentScreen).hasClass('opening')) {

			if ($(currentScreen).hasClass('results')) {
				var result = this.getResult();
				this.finishQuiz(result);
			}

			$(currentScreen).removeClass('opening');
			this.removeLoader(currentScreen);

		} else {
			$(currentScreen).addClass('closing');
			setTimeout(this.progressQuiz.bind(this), 300);
		}
	}

};

var app = window.app || {};
app.Social = app.Social || window.Social || {};

app.QuizView = app.QuizView || {

	quizId: '',
	element: null,
	quizData: {},
	decisions: [],
	
	init: function(selector, QuizId) {

		// initialize social library
		app.Social.init({
			FACEBOOK_APP_ID: '670211293040806',
			TWITTER_ACCOUNT: 'jordanforeman'
		});

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
		return $(this.element).find('> ul li:first-of-type').first();
	},

	getLastScreen: function() {
		return $(this.element).find('> ul li:last-of-type').first();
	},

	getCurrentScreen: function() {
		return $(this.element).find('> ul li.active').first();
	},

	getNextScreen: function() {
		var nextScreen = $(this.element).find('> ul li.active').next();

		if (!nextScreen.length) {
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

		// Quiz String
		var QuizHTMLString = '';

		// Landing
		QuizHTMLString += '<ul><li class="transition horizontal active"><section id="landingHeader" class="header"><h1>';
		QuizHTMLString += this.quizData.title + '</h1></section><section class="content">';
		QuizHTMLString += this.quizData.description + '<button id="takeQuizButton">';
		QuizHTMLString += this.quizData.startPrompt + '</button></section></li>';

		// Questions
		[].forEach.call(this.quizData.questions, function(question){

			QuizHTMLString += '<li class="transition vertical"><section id="" class="header"><h2>';
			QuizHTMLString += question.title + '</h2></section><section class="content"><ul class="answers">';

			[].forEach.call(question.choices, function(choice){
				QuizHTMLString += '<li data-answer="';
				QuizHTMLString += choice.value + '"><button>';
				QuizHTMLString += choice.description + '</button></li>';
			});

			QuizHTMLString += '</ul></section></li>';

		});

		// Ending Slide
		QuizHTMLString += '<li class="transition horizontal results"><section id="resultHeader" class="header"><h2 id="quizResultTitle"></h2></section><section class="content"><div id="quizResultContents"></div><div class="social"><ul class="social-toolbar"><li class="share-facebook"><span class="icon-facebook"></span> Share </li><li class="share-pinterest"><span class="icon-pinterest"></span> Pin </li><li class="share-twitter"><span class="icon-twitter"></span> Tweet </li></ul></div><button id="retakeQuizButton">'
		QuizHTMLString += this.quizData.restartPrompt + '</button></section></li></ul>';
		
		$(this.element).append(QuizHTMLString);

	},

	flushDecisions: function() {
		this.decisions = [];
	},

	addListeners: function() {
		$('.answers li').click(app.QuizView.answerQuestion);
		$('#takeQuizButton').click(app.QuizView.startQuiz.bind(this));
		$('#retakeQuizButton').click(app.QuizView.retakeQuiz.bind(this));

		// Social Sharing
		$('.share-facebook').click(app.Social.Facebook.shareEvent);
		$('.share-pinterest').click(app.Social.Pinterest.shareEvent);
		$('.share-twitter').click(app.Social.Twitter.shareEvent);
		$('.share-google-plus').click(app.Social.GooglePlus.shareEvent);
	},

	answerQuestion: function() {
		var answer = $(this).data('answer');
		app.QuizView.decisions.push(answer);
		app.QuizView.progressQuiz();
	},

	addLoader: function(screen) {
		var loader = '<div class="loader"></div>',
			container = $(this.getCurrentScreen()).find('.content');
		$(container).append(loader);
	},

	removeLoader: function(screen) {
		$(this.getCurrentScreen()).find('.loader').remove();
	},

	getResults: function() {
		switch(this.quizData.scoringModel) {
			case "mostcommon":
				return this.getMostCommon()
				break;
			default: 
				break;
		}
	},

	getMostCommon: function() {
		var counts = {},
			results = this.quizData.results;

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
		
		return chosenResult || {};
	},

	getRangedResult: function() {
		
		var pointTotal = 0;
		[].forEach.call(this.decisions, function(decision){
			pointTotal += decision;
		});

		var bestResult = null;
		[].forEach.call(this.quizData.results, function(result){

			var min = result.threshold.min,
				max = result.threshold.max;

			// Perfect Match!
			if (pointTotal > min && pointTotal < max)
				return result;

			// Better at least have one
			if (!bestResult)
				bestResult = result;

			// We've got a good result, but is it the best?
			// TODO: narrow down results
		});

		return bestResult;

	},

	finishQuiz: function(result) {

		$('#resultHeader').css('background-image', (result['image'] ? 'url('+result['image']+')' : ''));
		$('#quizResultTitle').html(result['title']);
		$('#quizResultContents').html(result['description']);

		// Set social share data
		$('.share-pinterest').attr('data-media-url', result['image']).attr('data-share-description', result['description']);
		$('.share-facebook').attr('data-media-url', result['image']).attr('data-share-description', result['description']).attr('data-share-title', result['title']);
		$('.share-twitter').attr('data-share-description', result['description']);

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
				var result = this.getResults();
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

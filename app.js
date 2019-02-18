let tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";

firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);



let playerWidth = 640;
let playerHeight = 390;

let player;
let currentQuestion = -1; //index of which question is currently displayed
let pausedForQuestion = false; //whether video is paused while student answers question

function onYouTubeIframeAPIReady() {
	player = new YT.Player('player', {
		height: playerHeight,
		width: playerWidth,
		videoId: 'yZYjgVphAV0',
		host: 'https://www.youtube.com',
		events: {
			'onReady': onPlayerReady,
			'onStateChange': onPlayerStateChange
		}
	});
}

// Plays video once API has loaded
function onPlayerReady(event){
	event.target.playVideo();
}


// Fires when video begins/pauses
	// Used to pause video at specified time(s)
function onPlayerStateChange(event) {
	if (event.data == YT.PlayerState.PLAYING) {
		if (currentQuestion < questions.length - 1) {
			currentQuestion++;
			var delayTime;
			setTimeout(setQuestion, questions[currentQuestion].delay * 1000, currentQuestion, questions);
		}
	}
}

function pauseVideo() {
	player.pauseVideo();
}

function Question(delay, answers) {
	this.delay = delay;
	this.answers = answers;
	var self = this;
	this.render = function() {
		// console.log("rendering question");
		$('.answersRow').empty();
		self.answers.forEach((answer, i) => {
			var parent = "#answersRowOne";
			if (i > 1) {
				parent = "#answersRowTwo"
			}
			answer.render(parent);
		});

	}
}

// One answer to a given question, whether it's correct, and the feedback to give
function Answer(text, correct, feedback) {
	this.text = text;
	this.correct = correct;
	this.feedback = feedback;
	var self = this;

	this.render = function(parent) {
		$('<div/>', {
			class: "answer",
			text: self.text
		})
		.on('click', self.respondToAnswer)
		.appendTo(parent);
	}

	// When answer is clicked, show feedback
	this.respondToAnswer = function() {
		$('.answersRow').empty();
		$('<div/>', {
			class: "answer",
			text: self.feedback
		})
		.on('click', self.finishFeedback)
		.appendTo('#answersRowOne');
	}

	// When feedback is clicked, proceed or repeat question
	this.finishFeedback = function() {
		$('.answersRow').empty();
		// If answer was correct, proceed with video
		if (self.correct) {
			player.playVideo();
		// If answer was wrong, go back to question
		} else {
			questions[currentQuestion].render();
		}
	}
}

function setQuestion(index, questions) {
	player.pauseVideo();
	question = questions[index];
	let parent = "#answersRowOne";
	question.render();

}



let q1 = new Question(2, [new Answer("Radient heat for a wire wrapped around a mica sheet", true, "You go it!"), new Answer("Direct heat from a wire wrapped around a mica sheet", false, "Nice Try")]);
let q2 = new Question(3, [new Answer("Because I said so", false, "It is just!"), new Answer("Because it is just", true, "Indeed."), new Answer("Maybe not after all", false, "too bad"), new Answer("Lorem Ipsum", false, "this is feedback")]);
let questions = [q1, q2];
	

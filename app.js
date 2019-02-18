let tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";

firstScriptTag = document.getElementsByTagName('script')[0];
console.log(firstScriptTag);
console.log(firstScriptTag.parentNode);
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
		videoId: 'WYcw_DcZsak',
		host: 'https://www.youtube.com',
		events: {
			'onReady': onPlayerReady,
			'onStateChange': onPlayerStateChange
		}
	});
	console.log("API is ready:");
	console.log(player);
}

// Plays video once API has loaded
function onPlayerReady(event){
	// alert("Player is ready!");
	console.log("player is ready");
	event.target.playVideo();
}


// Fires when video begins/pauses
	// Used to pause video at specified time(s)
function onPlayerStateChange(event) {
	console.log("State change");
	if (event.data == YT.PlayerState.PLAYING) {
		if (currentQuestion < questions.length - 1) {
			currentQuestion++;
			var delayTime;
			// if (currentQuestion == 0) {
			// 	delayTime = questions[currentQuestion].time;
			// } else {

			// }
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
}

function Answer(text, correct, feedback) {
	this.text = text;
	this.correct = correct;
	this.feedback = feedback;
}

function setQuestion(index, questions) {
	player.pauseVideo();
	question = questions[index];
	let parent = "#answersRowOne";

	$('.answersRow').empty();
	question.answers.forEach((answer, i) => {
		var row
		if (i > 1) {
			parent = "#answersRowTwo";
		}
		$('<div/>', {
			class: "answer",
			text: answer.text
		}).on('click', ev => {
			if (answer.correct) {
				player.playVideo();
			}
			$('.answersRow').empty();
			$('<div/>', {
				class: "answer",
				text: answer.feedback
			}).appendTo('#answersRowOne');
		}).appendTo(parent);
	});

}



let q1 = new Question(2, [new Answer("Radient heat for a wire wrapped around a mica sheet", true, "You go it!"), new Answer("Direct heat from a wire wrapped around a mica sheet", false, "Nice Try")]);
let q2 = new Question(3, [new Answer("Because I said so", false, "It is just!"), new Answer("Because it is just", true, "Indeed."), new Answer("Maybe not after all", false, "too bad"), new Answer("Lorem Ipsum", false, "this is feedback")]);
let questions = [q1, q2];
	

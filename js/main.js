// kick animation using William Malone's code 
// http://www.williammalone.com/articles/create-html5-canvas-javascript-sprite-animation/

// Copyright 2013 William Malone (www.williammalone.com)
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
 
(function() {
	// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
	// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
	// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel
	// MIT license

    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] 
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
 
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());



// stopping the oscillating indicators, recording values of indicators and keeping track of goals
var verticalBallStopped = false;
var horizontalBallStopped = false;
var powerBallStopped = false;
var x1, x2, x3;
var chanceCount = 0;
// recording the direction of the jump by the player, goal or not and the end co-ordinates of the ball
var direction;
var endTop = 440;
var endLeft = 390;
var score = 0;     
// variables to store user information
var thisName;
var thisTel;
var thisEmail;
var thisCity;

var states = {
  VERTICAL: 0, 
  HORIZONTAL: 1,
  POWER: 2,
  SHOT: 3
}
var state = states.VERTICAL;

function kick(el, et) {
  
	var player,
		playerImage,
		canvas,
		isItOver;
		
	isItOver = false;

	function gameLoop () {
	  if (isItOver == false) {
	    window.requestAnimationFrame(gameLoop);

	    player.update();
	    player.render();
	  }
	}
	
	function sprite (options) {
	
		var that = {},
			frameIndex = 0,
			tickCount = 0,
			ticksPerFrame = options.ticksPerFrame || 0,
			numberOfFrames = options.numberOfFrames || 1;
		
		that.context = options.context;
		that.width = options.width;
		that.height = options.height;
		that.image = options.image;
		
		that.update = function () {

            tickCount += 1;

            if (tickCount > ticksPerFrame) {

				    tickCount = 0;
				
                // If the current frame index is in range
                if (frameIndex < numberOfFrames - 2) {
                    // Go to the next frame
                    frameIndex += 1;
                }
                else if (frameIndex == numberOfFrames - 2) {
                    frameIndex += 1;
                    // start moving the ball
                    moveBall(el, et);
                    // make the goal keeper jump
                    keeperJump();
                }
                else if (frameIndex < numberOfFrames - 1) {
                    frameIndex += 1;
                }
                else {
                    // frameIndex = 0; // don't repeat the animation
                    isItOver = true;
                }
            }
        };
		
		that.render = function () {
		
		  // Clear the canvas
		  that.context.clearRect(0, 0, that.width, that.height);
		  
		  // Draw the animation
		  that.context.drawImage(
		    that.image,
		    frameIndex * that.width / numberOfFrames,
		    0,
		    that.width / numberOfFrames,
		    that.height,
		    0,
		    0,
		    that.width / numberOfFrames,
		    that.height);
		};
		
		return that;
	}
	
	// Get canvas
	canvas = document.getElementById("kickAnimation");
	canvas.width = 150;
	canvas.height = 270;
	
	// Create sprite sheet
	playerImage = new Image();	
	
	// Create sprite
	player = sprite({
		context: canvas.getContext("2d"),
		width: 300,
		height: 270,
		image: playerImage,
		numberOfFrames: 2,
		ticksPerFrame: 20
	});
	
	// Load sprite sheet
	playerImage.addEventListener("load", gameLoop);
	playerImage.src = "img/barçaplayer.png";
	
}

function keeperJump() {
  const randomDirection = Math.random() < 0.5 ? "left" : "right";

  if (x3 < 0.55) return; // Exit if x3 condition isn't met

  window.setTimeout(() => {
    document.getElementById('goal-keeper-state-1').style.display = "none";
    document.getElementById(`goal-keeper-state-${randomDirection === "left" ? 2 : 3}`).style.display = "block";
    direction = randomDirection;
  }, 0);
}


function moveBall(el, et) {
  var path = "M " + "390" + "," + "440" + " "+ el + "," + et; // Ml Mt Ql Qt El Et " Q " + "460" + "," + "340" + 
	  pathAnimator = new PathAnimator( path ),	// initiate a new pathAnimator object
	  objToAnimate = document.getElementById('zee-ball'),	// The object that will move along the path
	  speed = 0.5,	 		// seconds that will take going through the whole path
	  reverse = false,	// go back of forward along the path
	  startOffset = 0		// between 0% to 100%
	  
  // start animating the ball
  pathAnimator.start( speed, step, reverse, startOffset, finish);

  // make the ball smaller in size with respect to the distance from the eye please!

  function step( point, angle ){
	  // do something every "frame" with: point.x, point.y & angle
	  objToAnimate.style.cssText = "top:" + point.y + "px;" +
								  "left:" + point.x + "px;" +
								  "transform:rotate("+ angle +"deg);" +
								  "-webkit-transform:rotate("+ angle +"deg);";
  }
  
  function finish() {
    const isGoal = (endTop >= 98 && endTop <= 292 && endLeft >= 114 && endLeft <= 710);
    const isSuccessfulRightGoal = (direction === "right" && endLeft < 362);
    const isSuccessfulLeftGoal = (direction === "left" && endLeft >= 362);

    if (isGoal && (isSuccessfulRightGoal || isSuccessfulLeftGoal)) {
      incrementScore();
      showModalBasedOnScore(modalElem5, modalElem7, modalElem6);
    } else {
      showMissModal(modalElem4, modalElem6);
      updateScoreOnMiss();
    }
  }

  function showModalBasedOnScore(successModal, highScoreModal, tryAgainModal) {
    if (chanceCount < 4) {
      successModal.setAttribute("class", "modal active");
    } else {
      const message = score > 4 ? highScoreModal : tryAgainModal;
      message.innerHTML = `Has marcat ${score} gol(s) de 5. Fes click una altre vegada`;
      message.setAttribute("class", "modal active");
    }
  }

  function showMissModal(missModal, tryAgainModal) {
    if (chanceCount < 4) {
      missModal.setAttribute("class", "modal active");
    } else {
      tryAgainModal.innerHTML = `Has marcat ${score} gol(s) de 5. Fes click una altre vegada`;
      tryAgainModal.setAttribute("class", "modal active");
    }
  }

}

// to osciallte the vertical direction indicator
function oscillateSmallBall(indicatorId, requiredState) {
  if (state !== requiredState) return;

  const indicator = document.getElementById(indicatorId);
  const currentClass = indicator.getAttribute('class');
  const newClass = currentClass === 'small-ball one-end' ? 'small-ball other-end' : 'small-ball one-end';
  indicator.setAttribute('class', newClass);
}

const verticalIndicatorOscillate = window.setInterval(() => oscillateSmallBall('vertical-direction-indicator', states.VERTICAL), 320);
const horizontalIndicatorOscillate = window.setInterval(() => oscillateSmallBall('horizontal-direction-indicator', states.HORIZONTAL), 320);
const powerLevelOscillate = window.setInterval(() => oscillateSmallBall('power-level-indicator', states.POWER), 320);


function refreshScene() {
  resetIndicators(['vertical-direction-indicator', 'horizontal-direction-indicator', 'power-level-indicator']);
  verticalBallStopped = horizontalBallStopped = powerBallStopped = false;

  // Reset ball
  resetElementStyle('zee-ball', '', '');

  // Clear the canvas to make the player vanish
  const context = document.getElementById('kickAnimation').getContext('2d');
  context.clearRect(0, 0, 150, 270);

  // Reset goal keeper position
  resetGoalKeeper();
}

function resetIndicators(indicators) {
  indicators.forEach(id => {
    resetElementStyle(id, '', 'small-ball one-end');
  });
}

function resetElementStyle(elementId, style, className) {
  const element = document.getElementById(elementId);
  element.setAttribute('style', style);
  element.setAttribute('class', className);
}

function resetGoalKeeper() {
  document.getElementById('goal-keeper-state-1').style.display = "block";
  document.getElementById('goal-keeper-state-2').style.display = "none";
  document.getElementById('goal-keeper-state-3').style.display = "none";
}


function stopVerticalBall() {
      var element = document.getElementById('vertical-direction-indicator'),
        style = window.getComputedStyle(element),
        top = style.getPropertyValue('top');
      x1 = parseInt(top.substring(0,3), 10);
      x1 = (459-x1)/117;
      console.log(x1);
      // fix the position of the small ball to wherever it is
      element.setAttribute("class", "small-ball");
      element.style.top = top;
      verticalBallStopped = true;
      state = states.HORIZONTAL;
}

function stopHorizontalBall() {
      var element = document.getElementById('horizontal-direction-indicator'),
        style = window.getComputedStyle(element),
        left = style.getPropertyValue('left');
      x2 = parseInt(left.substring(0,3), 10);
      x2 = (x2-60)/119;
      console.log(x2);
      // fix the position of the small ball to wherever it is
      element.setAttribute("class", "small-ball");
      element.style.left = left;
      horizontalBallStopped = true;
      state = states.POWER;
}

function stopPowerBallAndKick() {
  const element = document.getElementById('power-level-indicator');
  const right = parseInt(window.getComputedStyle(element).getPropertyValue('right').substring(0, 3), 10);

  x3 = (191 - right) / 121;
  console.log(x3);

  // Fix the small ball position
  element.setAttribute("class", "small-ball");
  element.style.right = `${right}px`;
  powerBallStopped = true;

  // Calculate the ending position of the ball
  const Et = 440 - ((0.8 + x1) / 1.8) * x3 * 440 + 0.3 * x3 * ((Math.abs(0.5 - x2)) / 0.5) * 440;
  const El = 405 + x3 * (x2 - 0.5) * 810;

  // Set ending coordinates of the ball
  endTop = Et;
  endLeft = El;

  // Kick the ball
  console.log(`${El} ${Et}`);
  kick(El.toString(), Et.toString());
  state = states.SHOT;
}

function kickingProcess() {
  if (!verticalBallStopped && !horizontalBallStopped && !powerBallStopped) {
    stopVerticalBall();
  } else if (verticalBallStopped && !horizontalBallStopped && !powerBallStopped) {
    stopHorizontalBall();
  } else if (verticalBallStopped && horizontalBallStopped && !powerBallStopped) {
    stopPowerBallAndKick();
  } else if (verticalBallStopped && horizontalBallStopped && powerBallStopped) {
    if (chanceCount < 4) {
      chanceCount++;
    } else {
      resetScoreBoard();
      chanceCount = 0;
      score = 0;
    }
    closeModals();
    refreshScene();
    state = states.VERTICAL;
  }
}

function resetScoreBoard() {
  const scoreBoardItems = document.getElementById('score-board').getElementsByTagName('li');
  Array.from(scoreBoardItems).forEach(item => item.setAttribute('class', ''));
}

function closeModals() {
  [modalElem4, modalElem5, modalElem6, modalElem7].forEach(modal => {
    modal.setAttribute("class", "modal");
  });
}


function incrementScore() {
  if (chanceCount >= 0 && chanceCount < 5) {
    document.getElementById('score-board').getElementsByTagName('li')[chanceCount].setAttribute('class', 'scored');
    score += 1;
  }
}

function updateScoreOnMiss() {
  if (chanceCount >= 0 && chanceCount < 5) {
    document.getElementById('score-board').getElementsByTagName('li')[chanceCount].setAttribute('class', 'missed');
  }
}


// =======================================================================================================

window.onclick = function() {
  kickingProcess();
}

// all the modals to be displayed
modalElem1 = document.getElementById('modal-1');
modalElem2 = document.getElementById('modal-2');
modalElem3 = document.getElementById('modal-3');
modalElem4 = document.getElementById('modal-4');
modalElem5 = document.getElementById('modal-5');
modalElem6 = document.getElementById('modal-6');
modalElem7 = document.getElementById('modal-7');

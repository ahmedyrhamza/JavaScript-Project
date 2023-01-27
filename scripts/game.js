import { Bird } from "./bird.js";
import { Bomb } from "./bomb.js";

//Selectors
let limit = document.querySelector("#limit");
let welcomeName = document.querySelector("h1");
let welcomeScore = document.querySelector("#WelcomePopUp > span:nth-child(3)")
let gameBgMusic = document.querySelector("#gameBgMusic");
let shootSound = document.querySelector("#shootSound");
let bombTimer = document.querySelector("#bombTimer");
let startBtn = document.querySelector("button");
let birdsKilled = document.querySelector("#birds");
let scoreDiv = document.querySelector("#score");
let welcomeBg = document.querySelector("#welcome");
let welcomePopUp = document.querySelector("#WelcomePopUp");
let playerName = document.querySelector("#name");
const birdsData = [["./resourses/whiteBird.gif", 5, 200, 2],["./resourses/blackBird.gif", 10, 175, 3],["./resourses/blueBird.gif", -10, 225, 1]];

/******************************************************************* PLAYER NAME *******************************************************************/
let inputName = location.search.split("&")[1].split("=")[1];
let userName = "";
for (let i = 0; i < inputName.length; i++) {
    if (inputName[i - 1] === '+' || i == 0) {
        userName += inputName[i].toUpperCase();
    }
    else if (inputName[i] === '+') {
        userName += ' ';
    }
    else {
        userName += inputName[i].toLowerCase();
    }
}
let checkFirstTimeFlag = false;
let index;
for (let i = 0; i < localStorage.length; i++) {
    if (userName == JSON.parse(localStorage[localStorage.key(i)]).name) {
        checkFirstTimeFlag = true;
        index = i;
    }
}
if (checkFirstTimeFlag) {
    welcomeName.innerHTML += `Back ${userName}`;
    welcomeScore.innerHTML += `.. Your last score: ${JSON.parse(localStorage[localStorage.key(index)]).score}`;
}
else {
    welcomeName.innerHTML += `${userName}`;
}
playerName.innerText = userName;

// click sound---------------------------------------------------------------------------------------------------------------------------------------
shootSound.volume = 0.5;
window.addEventListener("click", function() {
    if(shootSound.paused) {
        shootSound.play();
    }
    else {
        shootSound.currentTime = 0;
    }
});



// start game----------------------------------------------------------------------------------------------------------------------------------------
startBtn.onclick = function () {

    //restarting the data
    let seconds = 60;
    Bird.count = 0;
    Bird.score = 0;
    scoreDiv.innerText = Bird.count;
    birdsKilled.innerText = Bird.score;
    //remove welcome popup widow
    welcomeBg.classList.add("out");
    welcomePopUp.classList.add("out");
    this.blur();
    //background sound
    gameBgMusic.play();
    gameBgMusic.volume = 0.1

/******************************************************************* BIRD *******************************************************************/
// bird creation
    let createBirdsId = setInterval(function () {

        let bird = Math.floor(Math.random() * 3);
        let birdPlace = Math.floor(Math.random() * (window.innerHeight - 175) + (25));
        let birdObject = new Bird(birdsData[bird][0], birdsData[bird][1], birdsData[bird][2], birdPlace, birdsData[bird][3]);
// bird moving
        let rightInterval = setInterval(() => {

            if (birdObject.left < window.innerWidth) {
                birdObject.moveRight();
            } else {
                clearInterval(rightInterval);
                birdObject.bird.remove();
            }
        }, 30);//speed of birds
// bird death
        birdObject.bird.onclick = function () {

            birdObject.kill();
        };
    }, 600);//number of birds

/******************************************************************* BOMB *******************************************************************/
// bomb creation
    let bombCreate = setInterval(() => {

        let bombObject = new Bomb();
// bomb moving
        let fallInterval = setInterval(() => {

            if (bombObject.down < window.innerHeight) {
                bombObject.fall();
            } 
            else {
                clearInterval(fallInterval);
                bombObject.bomb.remove();
                bombTimer.pause();
                bombTimer.currentTime = 0;
            }
        }, 30); // moving down speed
// bomb explosion
        bombObject.bomb.addEventListener("click", function() {

            bombObject.explosion();
            //delay to remove after half sec
            setTimeout(function () {
                bombObject.bomb.remove();
            }, 500);
        }, {once:true});
    }, 7000); //number of bombs


/******************************************************************* Timer *******************************************************************/
    let timer = setInterval(function () {

        seconds -= 10;
        limit.innerText = `0:${seconds}`;
        if (seconds == 0) {
            clearInterval(createBirdsId);
            clearInterval(bombCreate);
            clearInterval(timer);
            if (Bird.score >= 50 && Bird.count >= 25) {
                /******************************SweetAlert2 => (external library)*******************************/
                // win popup window 
                Swal.fire({
                    title: "YOU WON!",
                    text: "Play Again ?",
                    color: '#ffffff',
                    position: 'center',
                    imageUrl: 'resourses/Win.gif',
                    imageWidth: 400,
                    imageHeight: 200,
                    imageAlt: 'Winner image',
                    confirmButtonText: "Play Again",
                    confirmButtonColor: '#18A558',
                    showCancelButton: true,
                    allowOutsideClick: false,
                }).then(function (result) {
                    gameBgMusic.pause();
                    gameBgMusic.currentTime = 0;
                    if (result.value) {
                        welcomeName.innerHTML = `Welcome Back ${userName}`;
                        welcomeScore.innerHTML = `We hope you enjoy our game.. Your last score: ${Bird.score}`;
                        welcomeBg.classList.remove("out");
                        welcomePopUp.classList.remove("out");
                    } 
                    else if (result.dismiss == "cancel") {
                        window.location.href = "index.html";
                    }
                });
            } 
            else {
                // lose popup window
                Swal.fire({
                    title: "YOU LOST!",
                    text: "You have to kill 25 (Black and White) birds and Your score must be more than 50! \n Wanna Try Again ?",
                    color: '#ffffff',
                    imageUrl: 'resourses/Lost.gif',
                    imageWidth: 400,
                    imageHeight: 200,
                    imageAlt: 'Loser image',
                    showCancelButton: true,
                    confirmButtonText: "Play Again",
                    confirmButtonColor: '#18A558',
                    allowOutsideClick: false,
                }).then(function (result) {
                    gameBgMusic.pause();
                    gameBgMusic.currentTime = 0;
                    if (result.value) {
                        welcomeName.innerHTML = `Welcome Back ${userName}`;
                        welcomeScore.innerHTML = `We hope you enjoy our game.. Your last score: ${Bird.score}`;
                        welcomeBg.classList.remove("out");
                        welcomePopUp.classList.remove("out");
                        // setTimeout(function () {
                        //     startBtn.click();
                        // }, 2000);
                    } 
                    else if (result.dismiss == "cancel") {
                        window.location.href = `index.html`;
                    }
                });
            }
            // save player data on brower's local storage
            localStorage.setItem(userName, JSON.stringify({
                name: userName,
                score: Bird.score
            }));
        }
    }, 1000);
};

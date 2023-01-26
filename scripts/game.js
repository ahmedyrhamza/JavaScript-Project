//Selectors
let bodyElm = document.querySelector("body");
let limit = document.querySelector("#limit");
let result = document.querySelector("#result");
let welcomeName = document.querySelector("h1");
let welcomeScore = document.querySelector("#WelcomePopUp > span:nth-child(3)")
let gameBgMusic = document.querySelector("#gameBgMusic");
let shootSound = document.querySelector("#shootSound");
let bombTimer = document.querySelector("#bombTimer");
let explosionSound = document.querySelector("#explosion");
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

/******************************************************************* CLASSES *******************************************************************/
class Bird {
    static count = 0;
    static score = 0;

    constructor(src, birdScore, width, top, zIndex) {
        let birdImg = document.createElement("img");
        birdImg.setAttribute("draggable", "false");
        this.bird = birdImg;
        this.bird.src = src;
        this.bird.style.position = "absolute";
        this.bird.style.width = width + "px";
        this.bird.style.top = top + "px";
        this.bird.classList.add("bird");
        this.bird.style.left = "-150px";
        this.bird.style.zIndex = zIndex;
        bodyElm.append(this.bird);
        this.left = -150;
        this.top = top;
        this.birdScore = birdScore;
    }

    moveRight() {
        this.left += 10;
        this.bird.style.left = this.left + "px";
    }

    kill() {
        this.bird.src = "./resourses/deadBird.gif";
        if (this.bird.style.width == "225px") {
            this.bird.style.width = 125 + "px";
        } 
        else if (this.bird.style.width == "200px") {
            this.bird.style.width = 100 + "px";
        }
        else {
            this.bird.style.width = 85 + "px";
        }

        let down = setInterval(() => {
            if (this.top > window.innerHeight) {
                clearInterval(down);
                this.bird.remove();
            }
            this.top += 20;
            this.bird.style.top = this.top + "px";
        }, 20);

        if (this.bird.style.zIndex == 2 || this.bird.style.zIndex == 3) {
            Bird.count++;
        }
        Bird.score += this.birdScore;
        if (Bird.score < 0) {
            Bird.score = 0;
        }
        birdsKilled.innerText = Bird.count;
        scoreDiv.innerText = Bird.score;
    }
};


class Bomb {

    constructor() {
        let bombImg = document.createElement("img");
        bombImg.setAttribute("draggable", "false");
        this.bomb = bombImg;
        this.bomb.src = "./resourses/bomb.png";
        this.bomb.style.position = "absolute";
        this.bomb.style.width = "200px";
        this.bomb.style.zIndex = 4;
        this.bomb.style.top = "-200px";
        this.bomb.style.left = Math.round(Math.random() * (window.innerWidth - parseInt(this.bomb.width) - 100) + (100)) + "px";
        bodyElm.append(this.bomb);
        bombTimer.play();
        this.down = -200;
    }

    fall() {
        this.down += 10;
        this.bomb.style.top = this.down + "px";
    }

    explosion() {
        explosionSound.play();
        bombTimer.pause();
        bombTimer.currentTime = 0;
        this.bomb.src = "./resourses/pauline-roy-ezgif-com-gif-maker-1.gif";
        this.bomb.style.transform = "scale(4)";
        let birdsObjs = document.querySelectorAll(".bird");
        let bombLeft = parseInt(this.bomb.style.left) + parseInt(this.bomb.width);
        let bombTop = parseInt(this.bomb.style.top) + parseInt(this.bomb.height);
        birdsObjs.forEach(bird => {
            let birdLeft = parseInt(bird.style.left) + parseInt(bird.width);
            let birdTop = parseInt(bird.style.top) + parseInt(bird.height);
            let distance = Math.sqrt(Math.pow((bombLeft - birdLeft),2) + Math.pow((bombTop - birdTop),2));
            if (distance < 400) {
                bird.click();
            }
        });
    }
};

// click sound---------------------------------------------------------------------------------------------------------------------------------------
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
        bombObject.bomb.onclick = function () {

            bombObject.explosion();
            //delay to remove after half sec
            setTimeout(function () {
                bombObject.bomb.remove();
            }, 500);
        };
    }, 7000); //number of bombs


/******************************************************************* Timer *******************************************************************/
    let timer = setInterval(function () {

        seconds -= 1;
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

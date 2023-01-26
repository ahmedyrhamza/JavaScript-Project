let bodyElm = document.querySelector("body");
let explosionSound = document.querySelector("#explosion");
let bombTimer = document.querySelector("#bombTimer");


export class Bomb {

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
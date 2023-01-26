let bodyElm = document.querySelector("body");
let birdsKilled = document.querySelector("#birds");
let scoreDiv = document.querySelector("#score");


export class Bird {

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
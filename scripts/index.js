//selectors
let leaderboard = [];
let tableBodyElm = document.querySelector("tbody");
let bgMusic = document.querySelector("#bgMusic");
// let minScore = JSON.parse(localStorage[localStorage.key(0)]).score;
// let deletedKey = localStorage.key(0);

window.addEventListener("load",function() {

    bgMusic.play();
    bgMusic.volume = 0.8;

    // if (this.localStorage.length > 5) {
    //     for (let i = 1; i < localStorage.length; i++) {
    //         if (minScore > JSON.parse(localStorage[localStorage.key(i)]).score) {
    //             minScore = JSON.parse(localStorage[localStorage.key(i)]).score;
    //             deletedKey = localStorage.key(i);
    //         }
    //     }
    //     this.localStorage.removeItem(deletedKey);
    // }
    if (localStorage.length != 0) {
        // change json into array of objects
        for (let i = 0; i < localStorage.length; i++) {
            leaderboard.push(JSON.parse(localStorage[localStorage.key(i)]));
        }
        // sort the array
        leaderboard.sort((firstOjectScore, secondOjectScore) => secondOjectScore.score - firstOjectScore.score);
        // display to user
        if (leaderboard.length < 4) {
            for (let i = 0; i < leaderboard.length; i++) {
                if (leaderboard[i].name != 'undefined' && leaderboard[i].score != 'undefined') {
                    let trElm = document.createElement("tr");
                    let tdName = document.createElement("td");
                    let tdScore = document.createElement("td");
                    tdName.innerText = leaderboard[i].name;
                    tdScore.innerText = leaderboard[i].score;
                    trElm.appendChild(tdName);
                    trElm.appendChild(tdScore);
                    tableBodyElm.appendChild(trElm);
                }
            }
        }
        else {
            for (let i = 0; i < 5; i++) {
                if (leaderboard[i].name != 'undefined' && leaderboard[i].score != 'undefined') {
                    let trElm = document.createElement("tr");
                    let tdName = document.createElement("td");
                    let tdScore = document.createElement("td");
                    tdName.innerText = leaderboard[i].name;
                    tdScore.innerText = leaderboard[i].score;
                    trElm.appendChild(tdName);
                    trElm.appendChild(tdScore);
                    tableBodyElm.appendChild(trElm);
                }
            }
        }
    }
});
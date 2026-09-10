// js/app.js

const views = document.querySelectorAll(".view");
const navigationButtons = document.querySelectorAll(".nav-btn");

function showView(viewName) {

    views.forEach((view) => {
        view.classList.add("hidden");
    });

    const selectedView = document.querySelector(`#view-${viewName}`);

    if (selectedView) {
        selectedView.classList.remove("hidden");
    }
}


navigationButtons.forEach((button) => {

    button.addEventListener("click", () => {

        const viewName = button.dataset.view;

        showView(viewName);

    });

});


const configForm = document.querySelector("#config-form");

configForm.addEventListener("submit", (event) => {

    event.preventDefault();

    showView("game");

});
const target = document.querySelector("#target")
const map = document.querySelector("#game-arena")

let counter = 0;



function randomPlace() {
    const maxX = map.clientWidth - target.offsetWidth;
    const maxY = map.clientHeight - target.offsetHeight;

    const randomX = Math.floor(Math.random() * maxX)
    const randomY = Math.floor(Math.random() * maxY)

    target.style.left = `${randomX}px`;
    target.style.top = `${randomY}px`;

}

const time = document.querySelector("#game-time")
const gameScore = document.querySelector("#game-score")
const gameRecord = document.querySelector("#game-record")



const viewGame = document.querySelector("#view-game")
const viewResults = document.querySelector("#view-results")

const resultScore = document.querySelector('#result-score')

const homeRecord = document.querySelector('#home-record')

function runTimer(str) {
    if (str === "start") {
        let timeLeft = Number(time.textContent);
        
        const countdown = setInterval(() => {
            
            if (timeLeft === 0) {
                clearInterval(countdown);
                viewGame.classList.add("hidden")
                resultScore.textContent = gameRecord.textContent
                viewResults.classList.remove("hidden")
                return;
            }

            timeLeft--;
            time.textContent = timeLeft;
        }, 1000);
    }

}
target.addEventListener("click", () => {
    counter++
    gameScore.textContent = counter
    if (Number(gameRecord.textContent) < Number(gameScore.textContent)){
        gameRecord.textContent = Number(counter);
        homeRecord.textContent =
 gameRecord.textContent
    } 
    if (counter === 1) {
        runTimer("start")
    }
    randomPlace()
})
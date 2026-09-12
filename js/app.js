
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

let gameMode = "classic"

navigationButtons.forEach((button) => {

    button.addEventListener("click", () => {

        const viewName = button.dataset.view;

        showView(viewName);

    });

});


const configForm = document.querySelector("#config-form");

configForm.addEventListener("submit", (event) => {

    event.preventDefault();
    gameMode = document.querySelector(`input[name="mode"]:checked`).value
    if(gameMode === "precision"){
        precisionHud.classList.remove("hidden")
        precisionHud.classList.add("flex")
    }else{
        precisionHud.classList.add("hidden")
        precisionHud.classList.remove("flex")        
    }

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
const duration = document.querySelector("#duration")



const viewGame = document.querySelector("#view-game")
const viewResults = document.querySelector("#view-results")

const resultScore = document.querySelector('#result-score')

const homeRecord = document.querySelector('#home-record')

function runTimer() {
        let timeLeft = Number(time.textContent);

        const countdown = setInterval(() => {

            if (timeLeft === 0) {
                clearInterval(countdown);
                viewGame.classList.add("hidden")
                resultScore.textContent = counter
                resultMisses.textContent = missesCounter
                let Accuracy = (Number(counter) * 100) / (Number(missesCounter) + Number(counter))
                resultAccuracy.textContent = Accuracy
                viewResults.classList.remove("hidden")
                return;
            }

            timeLeft--;
            time.textContent = timeLeft;
        }, 1000);
    

}

const gameArena = document.querySelector("#game-arena")
const resultMisses = document.querySelector("#result-misses")
const resultAccuracy = document.querySelector("#result-accuracy")
const gameAccuracy = document.querySelector("#game-accuracy") 
const precisionHud = document.querySelector("#precision-hud")



let missesCounter = 0
gameArena.addEventListener("click", (e) => {
    if(gameMode === "precision"){
        missesCounter++;
        gameAccuracy.textContent = `${Math.round((counter * 100) / (counter + missesCounter))}%`
        document.querySelector("#game-misses").textContent = missesCounter
    }
})


target.addEventListener("click", (e) => {
    e.stopPropagation();
    counter++
    gameScore.textContent = counter
    if(gameMode === "precision"){
                gameAccuracy.textContent = `${Math.round((counter * 100) / (counter + missesCounter))}%`
    }

    if (counter === 1){
        time.textContent = duration.value
        runTimer()
    } 
    randomPlace()
})

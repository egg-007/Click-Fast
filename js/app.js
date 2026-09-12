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

let gameMode = "classic";

navigationButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const viewName = button.dataset.view;
    if (viewName === "history") {
      renderHistory();
    }
    showView(viewName);
  });
});

const configForm = document.querySelector("#config-form");

configForm.addEventListener("submit", (event) => {
  event.preventDefault();
  counter = 0;
  missesCounter = 0;
  gameScore.textContent = 0;
  document.querySelector("#game-misses").textContent = 0;
  gameAccuracy.textContent = "100%";

  gameMode = document.querySelector(`input[name="mode"]:checked`).value;
  if (gameMode === "precision") {
    precisionHud.classList.remove("hidden");
    precisionHud.classList.add("flex");
  } else {
    precisionHud.classList.add("hidden");
    precisionHud.classList.remove("flex");
  }
  if (difficulty.value === "easy") {
    target.style.width = "80px";
    target.style.height = "80px";
  }

  if (difficulty.value === "medium") {
    target.style.width = "60px";
    target.style.height = "60px";
  }

  if (difficulty.value === "hard") {
    target.style.width = "40px";
    target.style.height = "40px";
  }
  time.textContent = duration.value;
  showView("game");
});
const target = document.querySelector("#target");
const map = document.querySelector("#game-arena");

let counter = 0;

function randomPlace() {
  const maxX = map.clientWidth - target.offsetWidth;
  const maxY = map.clientHeight - target.offsetHeight;

  const randomX = Math.floor(Math.random() * maxX);
  const randomY = Math.floor(Math.random() * maxY);

  target.style.left = `${randomX}px`;
  target.style.top = `${randomY}px`;
}

const time = document.querySelector("#game-time");
const gameScore = document.querySelector("#game-score");
const gameRecord = document.querySelector("#game-record");
const duration = document.querySelector("#duration");
const difficulty = document.querySelector("#difficulty");

const viewGame = document.querySelector("#view-game");
const viewResults = document.querySelector("#view-results");

const resultScore = document.querySelector("#result-score");

const homeRecord = document.querySelector("#home-record");

let records = JSON.parse(localStorage.getItem("clickFast.records")) || {};
let history = JSON.parse(localStorage.getItem("clickFast.history")) || [];

const historyList = document.querySelector("#history-list");

function renderHistory() {
  historyList.innerHTML = "";

  if (history.length === 0) {
    historyList.innerHTML = `<p class="text-slate-400">No games played yet.</p>`;
    return;
  }

  history.forEach((game) => {
    historyList.innerHTML += `
            <div class="rounded-lg bg-slate-900 p-4">
                <p>Mode: ${game.mode}</p>
                <p>Difficulty: ${game.difficulty}</p>
                <p>Duration: ${game.duration}s</p>
                <p>Score: ${game.score}</p>
            </div>
        `;
  });
}

function runTimer() {
  let timeLeft = Number(time.textContent);

  const countdown = setInterval(() => {
    if (timeLeft === 0) {
      clearInterval(countdown);
      viewGame.classList.add("hidden");
      resultScore.textContent = counter;
      if (gameMode === "precision") {
        resultMisses.textContent = missesCounter;
        resultAccuracy.textContent =
          counter + missesCounter === 0
            ? "0%"
            : `${Math.round((counter * 100) / (counter + missesCounter))}%`;
      } else {
        resultMisses.textContent = "not measured";
        resultAccuracy.textContent = "not measured";
      }
      const recordKey = `${gameMode}_${difficulty.value}_${duration.value}`;
      if (!records[recordKey] || counter > records[recordKey]) {
        records[recordKey] = counter;
        localStorage.setItem("clickFast.records", JSON.stringify(records));
      }
      gameRecord.textContent = records[recordKey];
      homeRecord.textContent = records[recordKey];

      history.push({
        mode: gameMode,
        difficulty: difficulty.value,
        duration: duration.value,
        score: counter,
        misses: gameMode === "precision" ? missesCounter : null,
        accuracy:
          gameMode === "precision"
            ? Math.round((counter * 100) / (counter + missesCounter))
            : null,
      });
      if (history.length > 20) {
        history.shift();
      }
      localStorage.setItem("clickFast.history", JSON.stringify(history));
      viewResults.classList.remove("hidden");
      return;
    }

    timeLeft--;
    time.textContent = timeLeft;
  }, 1000);
}

const gameArena = document.querySelector("#game-arena");
const resultMisses = document.querySelector("#result-misses");
const resultAccuracy = document.querySelector("#result-accuracy");
const gameAccuracy = document.querySelector("#game-accuracy");
const precisionHud = document.querySelector("#precision-hud");

let missesCounter = 0;
gameArena.addEventListener("click", (e) => {
  if (gameMode === "precision") {
    missesCounter++;
    gameAccuracy.textContent = `${Math.round((counter * 100) / (counter + missesCounter))}%`;
    document.querySelector("#game-misses").textContent = missesCounter;
  }
});

target.addEventListener("click", (e) => {
  e.stopPropagation();
  counter++;
  gameScore.textContent = counter;
  if (gameMode === "precision") {
    gameAccuracy.textContent = `${Math.round((counter * 100) / (counter + missesCounter))}%`;
  }

  if (counter === 1) {
    time.textContent = duration.value;
    runTimer();
  }
  randomPlace();
});

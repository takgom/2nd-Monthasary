const startScreen = document.getElementById("startScreen");
const openDiaryButton = document.getElementById("openDiary");
const spreads = Array.from(document.querySelectorAll(".spread"));
const prevButton = document.getElementById("prevSpread");
const nextButton = document.getElementById("nextSpread");
const pageStatus = document.getElementById("pageStatus");
const musicButton = document.getElementById("musicButton");
const bgMusic = document.getElementById("bgMusic");

let currentSpread = 0;
let isFlipping = false;

function updateBook(direction = "next") {
  spreads.forEach((spread, index) => {
    spread.classList.toggle("active", index === currentSpread);
    spread.classList.remove("flipping-next", "flipping-prev");
  });

  const activeSpread = spreads[currentSpread];
  activeSpread.classList.add(direction === "next" ? "flipping-next" : "flipping-prev");

  prevButton.disabled = currentSpread === 0;
  nextButton.disabled = currentSpread === spreads.length - 1;

  if (currentSpread === 0) {
    pageStatus.textContent = "Opening letter";
  } else if (currentSpread === spreads.length - 1) {
    pageStatus.textContent = "Final letters";
  } else {
    pageStatus.textContent = `Memory ${currentSpread} of 10`;
  }

  window.setTimeout(() => {
    activeSpread.classList.remove("flipping-next", "flipping-prev");
    isFlipping = false;
  }, 950);
}

function nextSpread() {
  if (isFlipping || currentSpread >= spreads.length - 1) return;
  isFlipping = true;
  currentSpread += 1;
  updateBook("next");
}

function previousSpread() {
  if (isFlipping || currentSpread <= 0) return;
  isFlipping = true;
  currentSpread -= 1;
  updateBook("prev");
}

async function playMusic() {
  try {
    await bgMusic.play();
    musicButton.setAttribute("aria-pressed", "true");
    musicButton.textContent = "Pause music";
  } catch (error) {
    musicButton.setAttribute("aria-pressed", "false");
    musicButton.textContent = "Play music";
  }
}

openDiaryButton.addEventListener("click", async () => {
  startScreen.classList.add("hidden");
  await playMusic();
});

nextButton.addEventListener("click", nextSpread);
prevButton.addEventListener("click", previousSpread);

musicButton.addEventListener("click", async () => {
  const isPlaying = musicButton.getAttribute("aria-pressed") === "true";

  if (isPlaying) {
    bgMusic.pause();
    musicButton.setAttribute("aria-pressed", "false");
    musicButton.textContent = "Play music";
    return;
  }

  await playMusic();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight") nextSpread();
  if (event.key === "ArrowLeft") previousSpread();
});

updateBook();

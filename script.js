const startScreen = document.getElementById("startScreen");
const openDiaryButton = document.getElementById("openDiary");
const spreads = Array.from(document.querySelectorAll(".spread"));
const prevButton = document.getElementById("prevSpread");
const nextButton = document.getElementById("nextSpread");
const pageStatus = document.getElementById("pageStatus");
const musicButton = document.getElementById("musicButton");
const bgMusic = document.getElementById("bgMusic");

let currentSpread = 0;
let mobileSide = "left";
let isFlipping = false;

function isPhone() {
  return window.matchMedia("(max-width: 760px)").matches;
}

function updateMobileSide() {
  spreads.forEach((spread, index) => {
    spread.classList.remove("mobile-left", "mobile-right");
    if (index === currentSpread) {
      spread.classList.add(mobileSide === "left" ? "mobile-left" : "mobile-right");
    }
  });
}

function updateStatus() {
  if (currentSpread === 0) {
    pageStatus.textContent = isPhone() && mobileSide === "right" ? "Opening letter" : "Cover";
    return;
  }

  if (currentSpread === spreads.length - 1) {
    pageStatus.textContent = isPhone()
      ? (mobileSide === "left" ? "Letter 1" : "Final letter")
      : "Final letters";
    return;
  }

  pageStatus.textContent = isPhone()
    ? (mobileSide === "left" ? `Photo ${currentSpread}` : `Memory ${currentSpread}`)
    : `Memory ${currentSpread} of 10`;
}

function updateBook(direction = "next") {
  spreads.forEach((spread, index) => {
    spread.classList.toggle("active", index === currentSpread);
    spread.classList.remove("flipping-next", "flipping-prev");
  });

  const activeSpread = spreads[currentSpread];
  activeSpread.classList.add(direction === "next" ? "flipping-next" : "flipping-prev");

  prevButton.disabled = currentSpread === 0 && mobileSide === "left";
  nextButton.disabled = currentSpread === spreads.length - 1 && mobileSide === "right";

  updateMobileSide();
  updateStatus();

  window.setTimeout(() => {
    activeSpread.classList.remove("flipping-next", "flipping-prev");
    isFlipping = false;
  }, 950);
}

function nextSpread() {
  if (isFlipping) return;

  if (isPhone()) {
    if (mobileSide === "left") {
      mobileSide = "right";
      updateBook("next");
      return;
    }

    if (currentSpread >= spreads.length - 1) return;
    isFlipping = true;
    currentSpread += 1;
    mobileSide = "left";
    updateBook("next");
    return;
  }

  if (currentSpread >= spreads.length - 1) return;
  isFlipping = true;
  currentSpread += 1;
  updateBook("next");
}

function previousSpread() {
  if (isFlipping) return;

  if (isPhone()) {
    if (mobileSide === "right") {
      mobileSide = "left";
      updateBook("prev");
      return;
    }

    if (currentSpread <= 0) return;
    isFlipping = true;
    currentSpread -= 1;
    mobileSide = "right";
    updateBook("prev");
    return;
  }

  if (currentSpread <= 0) return;
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

window.addEventListener("resize", () => {
  updateMobileSide();
  updateStatus();
});

updateBook();

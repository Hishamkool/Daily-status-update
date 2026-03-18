/* genie */
const genieContainer = document.querySelector(".genie-container");
const genie = document.getElementById("lottie-genie");
const genieTooltip = document.getElementById("genie-tooltip");
const genieText = document.getElementById("genie-text"); // tips
const previousTipBtn = document.getElementById("previous-tip");
const nextTipBTn = document.getElementById("next-tip");
const pauseIcon = document.getElementById("pause-button");

const tips = [
  `Hi Im Genie 😄👋🏻,\nWelcome to Vonnue Daily Logs!`,
  "Click on me to toggle tips! ↖️",
  "In today's entry, you can paste time in formats like: 03h 05m, 12h 12m 52s, 12:14:15 or 10:20",

  "If you already have totals, enter them in 'Previous Totals' like: 100:14:15 (hours can be any length, minutes & seconds must be below 59)",

  "After submitting today's entry, stats are updated in the copy section — just click copy and paste it into Slack",

  "Once previous stats exist, the toggle button turns OFF. Turn it ON to edit, but note: this will reset all logs",

  "Before clearing data or editing totals, export a backup using JSON so you can restore later",

  "Your submitted days are highlighted in the date picker so you can track logged entries easily",

  "Leave counter shows absent days from your first logged entry up to your latest entry",
  "Export your logs to JSON regularly for backup",
  "Day Streaks is currently under development. ⚠️ ",
  "Click 'Push Today' to update your streak",
  "Stay consistent to build streak momentum 🔥",
];

let isVisible = true; // show or hide tooltip
let tipIndex = 0; // tip number 3, 4 ,5
let tipsTimeout = null; // timer to move to the next tip
let textAnimationSpeed = 35; // ms of text animation
let typingTimeout = null; // timer for adding characters - typing speed
/* state */
let isPaused = false; //tip paused ?
let isTyping = false; // animating text ?
let currentTip = "";
let currentChar = 0;

tippy(genie, {
  content: "Click to toggle tips!",
  theme: "light",
  placement: "top",
  animation: "scale",
  touch: true,
  hideOnClick: true,
  trigger: "mouseenter",
});

/* even listners */
// document.addEventListener("click", handleOutsideClick); //if you need to close tips when clicking outside
genie.addEventListener("click", toggleTooltip);
genieTooltip.addEventListener("mouseenter", () => {
  if (isTyping) {
    clearTimeout(typingTimeout);
    typingTimeout = null;
    genieText.textContent = currentTip;
    isTyping = false;
  }
  isPaused = true;
  pauseIcon.style.opacity = "1";
  if (tipsTimeout) {
    clearTimeout(tipsTimeout);
    tipsTimeout = null;
  }
});
genieTooltip.addEventListener("mouseleave", () => {
  isPaused = false;
  pauseIcon.style.opacity = "0";
  if (!isTyping) {
    // startAutoRotation();
    if (tipsTimeout) {
      clearTimeout(tipsTimeout);
    }

    tipsTimeout = setTimeout(() => {
      nextTip();
    }, 600);
  }
});
previousTipBtn?.addEventListener("click", previousTip);
nextTipBTn?.addEventListener("click", nextTip);

/* init functions when document loads */
initGenieTips(); // put this inside main
function initGenieTips() {
  tipIndex = 0;
  renderTip();
  showTooltip();
}

// handles the active and inactive state of tooltip
function showTooltip() {
  genie.setAttribute("loop", true);
  genie.play();
  genieContainer.classList.add("active");
  isVisible = true;
  requestAnimationFrame(() => {
    applyDynamicSpacing();
  });
}

function toggleTooltip() {
  if (isVisible) {
    hideTooltip();
  } else {
    showTooltip();
  }
}
function renderTip() {
  //   genieText.textContent = /* tipIndex + 1 + ") " + */ tips[tipIndex];
  textAnimate(tips[tipIndex]);
  // re-calculate spacing after DOM updates
  requestAnimationFrame(() => {
    if (isVisible) applyDynamicSpacing();
  });
}

function hideTooltip() {
  genie.removeAttribute("loop");
  genieContainer.classList.remove("active");
  isVisible = false;
  stopAutoRotation();
  resetSpacing();
}
function handleOutsideClick(e) {
  if (!genieContainer.contains(e.target)) {
    hideTooltip();
  }
}

function nextTip() {
  stopAutoRotation();
  tipIndex = (tipIndex + 1) % tips.length;
  renderTip();
}

function previousTip() {
  stopAutoRotation();
  tipIndex = (tipIndex - 1 + tips.length) % tips.length;
  renderTip();
}

function stopAutoRotation() {
  if (tipsTimeout) {
    clearTimeout(tipsTimeout);
    tipsTimeout = null;
  }
  if (typingTimeout) {
    clearTimeout(typingTimeout);
    typingTimeout = null;
  }
}
function startAutoRotation() {
  if (isPaused) return;
  if (tipsTimeout) {
    clearTimeout(tipsTimeout);
  }

  const duration = generateTypingDuration(tips[tipIndex]);
  tipsTimeout = setTimeout(() => {
    nextTip();
  }, duration);
}
// after manual next or previous
function restartAuto() {
  stopAutoRotation();
  startAutoRotation();
}

// adding margin to geneicontainer for placing the tooltip
function applyDynamicSpacing() {
  resetSpacing();
  const tooltipRect = genieTooltip.getBoundingClientRect();

  genieContainer.style.marginBottom = tooltipRect.height + "px";
}

function resetSpacing() {
  genieContainer.style.margin = "";
}

// functionality for typing animation
function textAnimate(tip) {
  if (typingTimeout) {
    clearTimeout(typingTimeout);
    typingTimeout = null;
  }
  currentTip = tip;
  currentChar = 0;
  genieText.textContent = "";
  isTyping = true;
  stopAutoRotation();

  function type() {
    if (currentChar < currentTip.length) {
      genieText.textContent += currentTip[currentChar];
      currentChar++;
      typingTimeout = setTimeout(type, textAnimationSpeed);
    } else {
      typingTimeout = null;
      startAutoRotation();
    }
  }
  type();
}

function generateTypingDuration(tip) {
  return tip.length * textAnimationSpeed + 500;
}

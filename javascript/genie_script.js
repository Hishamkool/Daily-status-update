/* genie */
const genieContainer = document.querySelector(".genie-container");
const genie = document.getElementById("lottie-genie");
const genieTooltip = document.getElementById("genie-tooltip");
const genieText = document.getElementById("genie-text"); // tips
const previousTipBtn = document.getElementById("previous-tip");
const nextTipBtn = document.getElementById("next-tip");
const pauseIcon = document.getElementById("pause-button");

const tips = [
  // "Lorem ipsum dolor sit amet consectetur adipisicing elit. Esse ipsa nobis, rerum recusandae tempore laborum culpa non quibusdam fuga a. Odit temporibus harum id, recusandae in esse ducimus optio? Libero.Lorem ipsum dolor sit amet consectetur adipisicing elit. Esse ipsa nobis, rerum recusandae tempore laborum culpa non quibusdam fuga a. Odit temporibus harum id, recusandae in esse ducimus optio? Libero.Lorem ipsum dolor sit amet consectetur adipisicing elit. Esse ipsa nobis, rerum recusandae tempore laborum culpa non quibusdam fuga a. Odit temporibus harum id, recusandae in esse ducimus optio? Libero.Lorem ipsum dolor sit amet consectetur adipisicing elit. Esse ipsa nobis, rerum recusandae tempore laborum culpa non quibusdam fuga a. Odit temporibus harum id, recusandae in esse ducimus optio? Libero.Lorem ipsum dolor sit amet consectetur adipisicing elit. Esse ipsa nobis, rerum recusandae tempore laborum culpa non quibusdam fuga a. Odit temporibus harum id, recusandae in esse ducimus optio? Libero.Lorem ipsum dolor sit amet consectetur adipisicing elit. Itaque modi vel temporibus eius nisi necessitatibus rem mollitia id. Labore perferendis nam atque, voluptate magni ea neque maxime quidem quis obcaecati!",
  // 👋 Introduction & Getting Started
  `Hi, I'm Genie 😄👋🏻,\nWelcome to Vonnue Daily Logs!`,
  "Click on Genie to show or hide tips! ↖️",

  // ⏱️ Setting Up Totals
  "If you already have totals, enter them in 'Previous Totals' like: 100:14:15 (hours can be any length; minutes & seconds must be below 59). h, m, s are separated by ':'. This creates a starting point for calculating totals.",
  "If you don't have previous totals, just leave it blank and continue with today's entry. Previous totals will be generated automatically as you progress.",
  "In today's entry, you can paste time in formats like: 12h 12m 52s, 03h 05m, 12:14:15, or 10:20.",

  // 📤 Submitting & Using Data
  "After submitting today's entry, stats are updated in the copy section — just click copy and paste them into Slack.",

  // ✏️ Managing Logs
  "You can update existing stats by selecting a date that you have already submitted from today's entry. Modify only the required fields and hit submit again.",
  "You can delete a log from the delete log section by providing a date or the serial number of the log, which can be obtained from the output table.",
  "Once previous stats exist, the toggle button turns OFF automatically. Turn it ON to edit, but note: this will reset all logs.",

  // 💾 Export & Import
  "Your data is stored locally in your browser. Clearing browser data or switching devices may remove it, so export a JSON backup before clearing data or editing totals to restore it later using the import log feature.",
  "You can also export your report in Excel or CSV format for easier viewing and sharing.",
  "Note: Importing a log will clear all existing records before importing.",

  // 📅 Tracking & Insights
  "Your submitted days are highlighted in the date picker so you can track logged entries easily.",
  "The leave counter shows absent days from your first logged entry up to your latest entry.",

  // 🔄 Backup & Streaks
  "Export your logs to JSON regularly for backup.",
  "Click 'Log today's push' after you push your code to GitHub or GitLab to continue streak",
  "Daily streaks resets only if you miss a working day (weekends are excluded).",
  "Stay consistent to build streak momentum 🔥",
];

let isVisible = true; // show or hide tooltip
let tipIndex = 0; // tip number 3, 4 ,5
let tipsTimer = null; // timer to move to the next tip
let textAnimationSpeed = 35; // ms of text animation
let typingTimer = null; // timer for adding characters - typing speed
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
genieTooltip.addEventListener("mouseenter", handleTooltipEnter);
genieTooltip.addEventListener("mouseleave", handleTooltipLeave);

previousTipBtn?.addEventListener("click", previousTip);
nextTipBtn?.addEventListener("click", nextTip);

/* init functions when document loads */
initGenieTips(); // put this inside main
function initGenieTips() {
  tipIndex = 0;
  renderTip();
  showTooltip();
}

function handleTooltipEnter() {
  completeTyping(); //instantly show full tip without animation

  isPaused = true;
  pauseIcon.textContent = "⏸️";

  if (tipsTimer) {
    clearTimeout(tipsTimer);
    tipsTimer = null;
  }
}
function handleTooltipLeave() {
  isPaused = false;
  pauseIcon.textContent = "▶️";

  if (!isTyping) {
    startAutoRotation();
  }
}

// handles the active and inactive state of tooltip
function showTooltip() {
  genie.setAttribute("loop", true);
  genie.play();
  genieContainer.classList.add("active");
  isVisible = true;
  isPaused = false;
  requestAnimationFrame(() => {
    applyDynamicSpacing();
  });
  if (isTyping && !typingTimer) {
    type();
  } else {
    startAutoRotation();
  }
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
  if (typingTimer) {
    clearTimeout(typingTimer);
    typingTimer = null;
  }
  isTyping = false;
  resetSpacing();
}
function handleOutsideClick(e) {
  if (!genieContainer.contains(e.target)) {
    hideTooltip();
  }
}

function nextTip() {
  isPaused = false;
  stopAutoRotation();
  tipIndex = (tipIndex + 1) % tips.length;
  renderTip();
}

function previousTip() {
  isPaused = false;
  stopAutoRotation();
  tipIndex = (tipIndex - 1 + tips.length) % tips.length;
  renderTip();
}

function stopAutoRotation() {
  if (tipsTimer) {
    clearTimeout(tipsTimer);
    tipsTimer = null;
  }
  /*   if (typingTimeout) {
    clearTimeout(typingTimeout);
    typingTimeout = null;
  } */
}
function startAutoRotation() {
  if (isPaused) return;
  if (tipsTimer) {
    clearTimeout(tipsTimer);
  }

  const duration = generateTypingDuration(tips[tipIndex]);
  tipsTimer = setTimeout(() => {
    nextTip();
  }, duration);
}
// after manual next or previous
function restartAuto() {
  stopAutoRotation();
  startAutoRotation();
}
//since height changes as text animates
const resizeObserver = new ResizeObserver(() => {
  applyDynamicSpacing();
});
resizeObserver.observe(genieTooltip);
// adding margin to geneicontainer for placing the tooltip
function applyDynamicSpacing() {
  const tooltipRect = genieTooltip.getBoundingClientRect();
  genieContainer.style.marginBottom = tooltipRect.height + "px";
}

function resetSpacing() {
  genieContainer.style.margin = "";
}

// functionality for typing animation
function textAnimate(tip) {
  if (typingTimer) {
    clearTimeout(typingTimer);
    typingTimer = null;
  }
  currentTip = tip;
  currentChar = 0;
  genieText.textContent = "";
  isTyping = true;
  stopAutoRotation(); //stops rotation for type to complete
  type();
}
function type() {
  if (isPaused) return;
  if (currentChar < currentTip.length) {
    genieText.textContent += currentTip[currentChar];
    currentChar++;
    typingTimer = setTimeout(type, textAnimationSpeed);
  } else {
    typingTimer = null;
    isTyping = false;
    startAutoRotation(); //starts after typing
  }
}
function generateTypingDuration(tip) {
  // return tip.length * textAnimationSpeed + 500;
  return 1000;
}

function completeTyping() {
  if (isTyping) {
    clearTimeout(typingTimer);
    typingTimer = null;
    genieText.textContent = currentTip;
    currentChar = currentTip.length;
    isTyping = false;
    startAutoRotation();
  }
}

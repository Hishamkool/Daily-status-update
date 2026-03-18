/* genie */
const genieContainer = document.querySelector(".genie-container");
const genie = document.getElementById("lottie-genie");
const genieTooltip = document.getElementById("genie-tooltip");
const genieText = document.getElementById("genie-text"); // tips
const previousTipBtn = document.getElementById("previous-tip");
const nextTipBTn = document.getElementById("next-tip");

const tips = [
  `Hi Im Genie 😄👋🏻,\nWelcome to Daily Logs!`,
  "Click on me to toggle tips! ↖️",
  "Day Streaks is currently under development. ⚠️ ",
  "Click 'Push Today' to update your streak",
  "Track your leaves to avoid streak breaks",
  "Export your logs to JSON regularly for backup",
  "Stay consistent to build streak momentum 🔥",
];

let isVisible = true;
let tipIndex = 0;
let intervalID = null;
let textAnimationSpeed = 35;
let typingTimeout = null;
tippy(genieContainer, {
  content: "Click to toggle tips!",
  theme: "light",
  placement: "top",
  animation: "scale",
});

/* even listners */
// document.addEventListener("click", handleOutsideClick); //if you need to close tips when clicking outside
genie.addEventListener("click", toggleTooltip);
genieTooltip.addEventListener("mouseenter", stopAutoRotation);
genieTooltip.addEventListener("mouseleave", startAutoRotation);
previousTipBtn?.addEventListener("click", previousTip);
nextTipBTn?.addEventListener("click", nextTip);

/* init functions when document loads */
initGenieTips(); // put this inside main
function initGenieTips() {
  tipIndex = 0;
  renderTip();
  showTooltip();
  startAutoRotation();
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
  tipIndex = (tipIndex + 1) % tips.length;
  renderTip();
  restartAuto();
}

function previousTip() {
  tipIndex = (tipIndex - 1 + tips.length) % tips.length;
  renderTip();
  restartAuto();
}

function stopAutoRotation() {
  if (intervalID) {
    clearInterval(intervalID);
    intervalID = null;
  }
}
function startAutoRotation() {
  stopAutoRotation();
  const duration = generateTypingDuration(tips[tipIndex]);
  intervalID = setTimeout(() => {
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
  genieText.textContent = "";

  stopAutoRotation();
  let char = 0;
  function type() {
    if (char < tip.length) {
      genieText.textContent += tip[char];
      char++;
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

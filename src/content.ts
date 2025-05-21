const applySpeed = (speed: number) => {
  const video = document.querySelector("video") as HTMLVideoElement | null;
  if (video) {
    video.playbackRate = speed;
    console.log("[YT Speed Controller] Applied speed:", speed);
  }
};

const waitForVideoAndApplySpeed = (speed: number) => {
  const checkInterval = setInterval(() => {
    const video = document.querySelector("video") as HTMLVideoElement | null;
    if (video) {
      video.playbackRate = speed;
      console.log("[YT Speed Controller] Applied speed after URL change:", speed);
      clearInterval(checkInterval);
    }
  }, 300);
};

const loadAndApplyStoredSpeed = () => {
  chrome.storage.local.get(["currentSpeed"]).then((result) => {
    if (result.currentSpeed !== undefined) {
      waitForVideoAndApplySpeed(result.currentSpeed);
    }
  });
};

let lastUrl = location.href;

setInterval(() => {
  const currentUrl = location.href;
  if (currentUrl !== lastUrl) {
    lastUrl = currentUrl;
    loadAndApplyStoredSpeed();
  }
}, 500);

loadAndApplyStoredSpeed();

chrome.runtime.onMessage.addListener((message) => {
  const { type, value } = message;
  if (type === "SET_PLAYBACK_SPEED") {
    applySpeed(value);
  }
});

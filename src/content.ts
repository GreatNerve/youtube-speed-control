const applySpeed = (speed: number) => {
  const video = document.querySelector("video") as HTMLVideoElement | null;
  if (video) {
    video.playbackRate = speed;
    console.log("[YT Speed Controller] Applied speed:", speed);
  }
};

chrome.storage.local.get(["currentSpeed"]).then((result) => {
  if (result.currentSpeed !== undefined) {
    applySpeed(result.currentSpeed);
  }
});

chrome.runtime.onMessage.addListener((message) => {
  const { type, value } = message;

  switch (type) {
    case "SET_PLAYBACK_SPEED":
      applySpeed(value);
      break;

    case "UPDATE_SPEED_SETTINGS":
    case "UPDATE_STEP_SETTINGS":
      console.log("[YT Speed Controller] Updated settings:", message);
      break;

    default:
      console.warn("[YT Speed Controller] Unknown message type:", type);
  }
});

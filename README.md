# YouTube Speed Control

A lightweight and customizable Chrome extension that enhances YouTube's playback speed menu. It allows you to fine-tune video speed beyond the default options using a configurable step size and maximum speed.

> Boost your productivity while watching tutorials, lectures, or any videos at your preferred speed.

---

## Features

- Add custom playback speed options to YouTube's existing speed menu
- User-configurable:
  - **Max Speed** (e.g., 5x)
  - **Step Size** (e.g., 0.1x, 0.25x, etc.)
- Remembers your last selected speed
- Clean native-looking UI inside YouTube
- Automatically removes old or duplicate menu entries

---

## Installation

### 1. Download and build

```bash
git clone https://github.com/GreatNerve/youtube-speed-control.git
cd youtube-speed-control
npm i
npm run build
```

### 2. Load Extension in Chrome

To install the extension manually in your browser:

1. Open **Google Chrome**
2. Visit: `chrome://extensions`
3. Toggle **Developer mode** (top-right)
4. Click **Load unpacked**
5. Select the folder where you extracted the extension

You should now see the extension in your extensions list, and it will be active on YouTube.

---

## Usage

1. Open any YouTube video
2. Click the ⚙ **Settings** icon in the player
3. Open the **Playback speed** menu
4. Choose from newly added custom speeds (e.g., 0.25x to 5x)

The chosen speed is saved and auto-applied across videos.

---

## Repository

GitHub - GreatNerve/youtube-speed-control

---


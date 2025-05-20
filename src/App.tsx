import { useCallback, useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import YoutubeLogo from "./assets/youtube-logo.svg";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LoaderCircle } from "lucide-react";

export const MessageType = {
  UPDATE_SPEED: "UPDATE_SPEED_SETTINGS",
  UPDATE_STEP: "UPDATE_STEP_SETTINGS",
  SET_SPEED: "SET_PLAYBACK_SPEED",
} as const;

export type MessageKeyType = (typeof MessageType)[keyof typeof MessageType];

function App() {
  const [maxSpeed, setMaxSpeed] = useState<number>(2);
  const [step, setStep] = useState<number>(0.25);
  const [currentSpeed, setCurrentSpeed] = useState<number>(1);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [speedOptions, setSpeedOptions] = useState<number[]>([]);

  useEffect(() => {
    chrome.storage.local.get(["maxSpeed", "step", "currentSpeed"]).then((result) => {
      console.log("[YT Speed Controller] Loaded settings:", result);
      if (result.maxSpeed !== undefined) {
        setMaxSpeed(result.maxSpeed);
      }
      if (result.step !== undefined) {
        setStep(result.step);
      }
      if (result.currentSpeed !== undefined) {
        setCurrentSpeed(result.currentSpeed);
      }
      setIsLoaded(true);
    });
  }, []);

  useEffect(() => {
    const speeds: number[] = [];
    for (let s = step; s <= maxSpeed; s += step) {
      const rounded = Math.round(s * 100) / 100;
      if (!speeds.includes(rounded)) speeds.push(rounded);
    }
    if (!speeds.includes(1)) speeds.push(1);
    speeds.sort((a, b) => a - b);
    setSpeedOptions(speeds);
  }, [maxSpeed, step]);

  const sendMessageToContentScript = useCallback(
    (messageKey: MessageKeyType, value: number) => {
      chrome.tabs.query(
        { url: "*://www.youtube.com/*" },
        (tabs: chrome.tabs.Tab[]) => {
          tabs.forEach((tab) => {
            if (tab.id !== undefined) {
              chrome.tabs.sendMessage(tab.id, {
                type: messageKey,
                value: value,
              });
            }
          });
        }
      );
    },
    []
  );

  const handleMaxSpeedChange = useCallback(
    (value: string) => {
      const newMaxSpeed = parseFloat(value);
      setMaxSpeed(newMaxSpeed);
      chrome.storage.local.set({ maxSpeed: newMaxSpeed }).then(() => {
        sendMessageToContentScript(MessageType.UPDATE_SPEED, newMaxSpeed);
      });
    },
    [sendMessageToContentScript]
  );

  const handleStepChange = useCallback(
    (value: string) => {
      const newStep = parseFloat(value);
      setStep(newStep);
      chrome.storage.local.set({ step: newStep }).then(() => {
        sendMessageToContentScript(MessageType.UPDATE_STEP, newStep);
      });
    },
    [sendMessageToContentScript]
  );

  const handleSpeedChange = useCallback(
    (value: string) => {
      const newSpeed = parseFloat(value);
      setCurrentSpeed(newSpeed);
      chrome.storage.local.set({ currentSpeed: newSpeed }).then(() => {
        sendMessageToContentScript(MessageType.SET_SPEED, newSpeed);
      });
    },
    [sendMessageToContentScript]
  );

  return (
    <section className="flex flex-col items-center justify-start w-[350px] bg-white rounded-lg shadow-lg p-4">
      <div className="flex flex-col items-center justify-center w-full">
        <img
          src={YoutubeLogo}
          alt="YouTube Logo"
          className="w-11/12 max-w-48 my-3"
        />
        <h1 className="text-xl font-bold text-center">
          YouTube Speed Controller
        </h1>
      </div>

      {isLoaded ? (
        <div className="flex flex-col items-center justify-center w-full mt-4 space-y-4">
          <div className="w-full">
            <Label htmlFor="current-speed" className="font-bold">Current Speed</Label>
            <Select
              value={currentSpeed.toString()}
              onValueChange={handleSpeedChange}
            >
              <SelectTrigger className="w-full mt-1">
                <SelectValue placeholder="Select speed" />
              </SelectTrigger>
              <SelectContent>
                {speedOptions.map((speed) => (
                  <SelectItem key={speed} value={speed.toString()}>
                    {speed === 1 ? "Normal (1x)" : `${speed}x`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="w-full pt-2 border-t">
            <Label htmlFor="max-speed">Max Speed</Label>
            <Select
              value={maxSpeed.toString()}
              onValueChange={handleMaxSpeedChange}
            >
              <SelectTrigger className="w-full mt-1">
                <SelectValue placeholder="Select max speed" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1x</SelectItem>
                <SelectItem value="2">2x</SelectItem>
                <SelectItem value="3">3x</SelectItem>
                <SelectItem value="4">4x</SelectItem>
                <SelectItem value="5">5x</SelectItem>
                <SelectItem value="10">10x</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="w-full">
            <Label htmlFor="step">Speed Step</Label>
            <Select value={step.toString()} onValueChange={handleStepChange}>
              <SelectTrigger className="w-full mt-1">
                <SelectValue placeholder="Select step" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0.25">0.25</SelectItem>
                <SelectItem value="0.5">0.5</SelectItem>
                <SelectItem value="1">1</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center w-full mt-4 space-x-2 text-gray-500">
          <LoaderCircle className="w-5 h-5 animate-spin" />
          <p className="text-sm">Loading settings...</p>
        </div>
      )}

      <footer className="mt-6 mb-2">
        <p className="text-xs text-gray-500 text-center">
          Made by{" "}
          <a
            href="https://greatnerve.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            Dheeraj Sharma
          </a>
        </p>
      </footer>
    </section>
  );
}

export default App;
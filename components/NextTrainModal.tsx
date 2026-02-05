'use client';

import { useEffect, useState } from "react";
import { X, TrainFront } from 'lucide-react';
import { convertStationIdToName, MtrLine, MtrStation } from "@/constants/mtr";
import { getRemainingSeconds } from "@/lib/utils";

interface NextTrainModalProps {
  isOpen: boolean;
  line?: MtrLine;
  station?: MtrStation;
  data: TrainScheduleData;
  onClose: () => void;
};

export interface TrainScheduleData {
  up?: NextTrainData[];
  down?: NextTrainData[];
};

export interface NextTrainData {
  dest: string;
  plat: string;
  seq: string;
  time: string;
};

export default function NextTrainModal({ isOpen, line, station, data, onClose }: NextTrainModalProps) {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [trainUpData, setTrainUpData] = useState<NextTrainData[]>([]);
  const [trainDownData, setTrainDownData] = useState<NextTrainData[]>([]);

  useEffect(() => {
    setTrainUpData(data.up || []);
    setTrainDownData(data.down || []);
  }, [data]);

  if (!isOpen || !line || !station) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden relative animate-in zoom-in-95 duration-200">
        <div className="p-5 flex justify-between items-center text-white" style={{ backgroundColor: line.color ?? "#333333" }}>
          <div className="flex items-center gap-2">
            <TrainFront className="w-6 h-6" />
            <h3 className="text-xl font-bold">{station.name} Station</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full transition">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6">
          <div className="flex border-b border-gray-200 shrink-0">
            {trainUpData.length > 0 && trainDownData.length > 0 && (
              <>
                <button
                  className={`flex-1 py-2 text-center ${activeTabIndex === 0 ? 'border-b-2 border-blue-500 font-semibold' : 'text-gray-500'}`}
                  onClick={() => setActiveTabIndex(0)}
                >
                  Up Direction
                </button>
                <button
                  className={`flex-1 py-2 text-center ${activeTabIndex === 1 ? 'border-b-2 border-blue-500 font-semibold' : 'text-gray-500'}`}
                  onClick={() => setActiveTabIndex(1)}
                >
                  Down Direction
                </button>
              </>
            )}
          </div>
          <div className="mt-4 space-y-4 max-h-80 overflow-y-auto">
            {trainUpData.length == 0 && trainDownData.length == 0 && (
              <p className="text-center text-gray-500">No train information available.</p>
            )}
            {activeTabIndex === 0 && trainUpData.map((train, index) => (
              <NextTrainInfo key={index} train={train} />
            ))}
            {activeTabIndex === 1 && trainDownData.map((train, index) => (
              <NextTrainInfo key={index} train={train} />
            ))}
          </div>
        </div>
      </div>

      <div className="absolute inset-0 -z-10" onClick={onClose}></div>
    </div>
  );
}

function NextTrainInfo({ train }: { train: NextTrainData }) {
  const [secondsRemaining, setSecondsRemaining] = useState<number>(0);

  useEffect(() => {
    // Initial set
    setSecondsRemaining(getRemainingSeconds(train.time) || 0);

    // Update every second
    const intervalId = setInterval(() => {
      setSecondsRemaining(getRemainingSeconds(train.time) || 0);
    }, 1000);

    // Cleanup
    return () => clearInterval(intervalId);
  }, [train.time]);

  let timeDisplay = "N/A";
  let colorClass = "text-gray-500";
  if (secondsRemaining <= 0) {
    timeDisplay = "Arriving";
    colorClass = "text-green-600 font-bold animate-pulse";
  } else {
    const minutes = Math.floor(secondsRemaining / 60);
    const seconds = Math.floor(secondsRemaining % 60);
    // Pad seconds with 0 (e.g., 1:05)
    const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
    timeDisplay = `${minutes}:${formattedSeconds}`;
    
    if (minutes < 1) {
      colorClass = "text-orange-600 font-semibold";
    }
  }
  return (
    <div className="flex flex-wrap items-center space-x-2 p-3 bg-gray-100 rounded-lg">
      <div className="flex-1 text-sm font-medium">{`Platform ${train.plat}`}</div>
      <div className="flex-2 text-center text-sm text-gray-500">{convertStationIdToName(train.dest)}</div>
      <div className={`flex-1 text-right text-sm ${colorClass}`}>{timeDisplay}</div>
    </div>
  );
}
'use client';

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Search, ZoomIn, ZoomOut, X, TrainFront } from 'lucide-react';
import NextTrainModal, { TrainScheduleData } from "@/components/NextTrainModal";
import { MTR_DATA } from "@/constants/mtr";

// --- 1. Map Configuration ---
// In a real app, you would map ALL stations here. 
// Values are percentages (0-100) relative to the image size.
// I have mapped a few key interchange stations as examples based on the map provided.
const STATION_COORDINATES: Record<string, { x: number; y: number }> = {
  'CEN': { x: 48, y: 78 }, // Central
  'ADM': { x: 52, y: 78 }, // Admiralty
  'TST': { x: 53, y: 72 }, // Tsim Sha Tsui
  'MOK': { x: 52, y: 48 }, // Mong Kok
  'KOT': { x: 56, y: 40 }, // Kowloon Tong
  'SOH': { x: 40, y: 92 }, // South Horizons
  'POA': { x: 88, y: 48 }, // Po Lam
  'TUC': { x: 18, y: 65 }, // Tung Chung
};


export default function Home() {
  // --- State ---
  const [selectedLineId, setSelectedLineId] = useState<string>('');
  const [selectedStationId, setSelectedStationId] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [trainSchedule, setTrainSchedule] = useState<TrainScheduleData>({});
  
  // Map State
  const [scale, setScale] = useState(1);
  const constraintsRef = useRef(null);
  
  // Line Selector Modal State (for interchange stations)
  const [lineSelectorOpen, setLineSelectorOpen] = useState(false);
  const [pendingStationId, setPendingStationId] = useState<string | null>(null);
  const [availableLinesForStation, setAvailableLinesForStation] = useState<any[]>([]);

  // --- Logic ---

  // 1. Core Fetch Logic (Refactored to accept args)
  const fetchNextTrain = (lineId: string, stationId: string) => {
    if (!lineId || !stationId) {
      alert('Please select both line and station.');
      return;
    }

    const url = `https://rt.data.gov.hk/v1/transport/mtr/getSchedule.php?line=${lineId}&sta=${stationId}`;
    
    // Optimistic UI updates
    setSelectedLineId(lineId);
    setSelectedStationId(stationId);

    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (data.status !== 1) {
          // Sometimes API returns status 0 if no data, but we still want to show modal
           console.warn("API Status not 1", data.message);
        }
        
        const key = `${lineId}-${stationId}`;
        const resultTrainSchedule = data.data && data.data[key] ? data.data[key] : { UP: [], DOWN: [] };

        setTrainSchedule({
          up: resultTrainSchedule.UP || [],
          down: resultTrainSchedule.DOWN || []
        });
        setIsModalOpen(true);
      })
      .catch(err => {
        console.error(err);
        alert('Failed to fetch next train info.');
      });
  };

  // 2. Handle Manual Dropdown Changes
  const handleManualFetch = () => {
    fetchNextTrain(selectedLineId, selectedStationId);
  };

  const handleLineChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLineId(e.target.value);
    setSelectedStationId('');
  };

  // 3. Handle Map Clicks
  const handleMapMarkerClick = (stationCode: string) => {
    // Find all lines that contain this station
    const linesServingStation = MTR_DATA.filter(line => 
      line.stations.some(s => s.id === stationCode)
    );

    if (linesServingStation.length === 0) {
      alert("Station data not found in local configuration.");
      return;
    }

    if (linesServingStation.length === 1) {
      // Only one line, fetch immediately
      fetchNextTrain(linesServingStation[0].id, stationCode);
    } else {
      // Multiple lines (Interchange), ask user
      setPendingStationId(stationCode);
      setAvailableLinesForStation(linesServingStation);
      setLineSelectorOpen(true);
    }
  };

  // 4. Handle Line Selection from Interchange Modal
  const confirmInterchangeLine = (lineId: string) => {
    if (pendingStationId) {
      fetchNextTrain(lineId, pendingStationId);
      setLineSelectorOpen(false);
      setPendingStationId(null);
    }
  };

  // 5. Zoom Controls
  const handleZoom = (delta: number) => {
    setScale(prev => Math.min(Math.max(prev + delta, 1), 4));
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 overflow-hidden relative">
      
      {/* --- Header --- */}
      <header className="absolute top-0 left-0 right-0 z-20 bg-white/90 backdrop-blur shadow-sm px-4 py-3 flex justify-between items-center">
        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <TrainFront className="w-5 h-5 text-blue-600" />
          MTR Next Train
        </h2>
        <div className="flex gap-2">
          <button onClick={() => handleZoom(-0.5)} className="p-2 bg-gray-200 rounded-full hover:bg-gray-300">
            <ZoomOut className="w-5 h-5" />
          </button>
          <button onClick={() => handleZoom(0.5)} className="p-2 bg-gray-200 rounded-full hover:bg-gray-300">
            <ZoomIn className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* --- Map Area --- */}
      <div className="flex-1 overflow-hidden bg-blue-50 relative cursor-grab active:cursor-grabbing" ref={constraintsRef}>
        <motion.div
          drag
          dragConstraints={constraintsRef}
          dragElastic={0.1}
          animate={{ scale: scale }}
          transition={{ duration: 0.3 }}
          className="w-full h-full flex items-center justify-center origin-center"
        >
          <div className="relative">
            <img 
              src="/MTR_routemap.jpg"
              alt="MTR Map" 
              className="max-w-none h-screen md:h-auto md:w-screen object-contain select-none pointer-events-none" 
            />

            {/* Render Clickable Stations */}
            {Object.entries(STATION_COORDINATES).map(([code, coords]) => (
              <button
                key={code}
                onClick={(e) => {
                  e.stopPropagation(); // Prevent drag start if possible
                  handleMapMarkerClick(code);
                }}
                className="absolute w-8 h-8 -ml-4 -mt-4 rounded-full border-2 border-white shadow-lg bg-transparent hover:bg-black/20 transition-colors z-10 group flex items-center justify-center"
                style={{ left: `${coords.x}%`, top: `${coords.y}%` }}
              >
                {/* Visual Indicator (Pulsing Dot) */}
                <span className="absolute w-3 h-3 bg-blue-600 rounded-full animate-ping opacity-75"></span>
                <span className="absolute w-3 h-3 bg-blue-600 rounded-full"></span>
                
                {/* Tooltip on Hover */}
                <span className="absolute bottom-full mb-2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none">
                  {code}
                </span>
              </button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* --- Bottom Controls (Fixed) --- */}
      <div className="z-30 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] p-4 pb-8 md:pb-4">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-3 items-end">
          <div className="flex-1 w-full grid grid-cols-2 gap-3">
            <div className="flex flex-col">
              <label className="text-xs font-semibold text-gray-500 mb-1">Line</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-lg bg-gray-50 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                value={selectedLineId}
                onChange={handleLineChange}
              >
                <option value="">Select Line</option>
                {MTR_DATA.map((line) => (
                  <option key={line.id} value={line.id}>
                    {line.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col">
              <label className="text-xs font-semibold text-gray-500 mb-1">Station</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-lg bg-gray-50 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                value={selectedStationId}
                onChange={(e) => setSelectedStationId(e.target.value)}
                disabled={!selectedLineId}
              >
                <option value="">Select Station</option>
                {MTR_DATA.find(line => line.id == selectedLineId)?.stations.map((station) => (
                  <option key={station.id} value={station.id}>
                    {station.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button
            className="w-full md:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
            onClick={handleManualFetch}
          >
            <Search className="w-4 h-4" />
            Check
          </button>
        </div>
      </div>

      {/* --- Interchange Selection Modal --- */}
      {lineSelectorOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-lg">Select Line</h3>
              <button onClick={() => setLineSelectorOpen(false)} className="p-1 hover:bg-gray-200 rounded-full">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-4 grid gap-3">
              <p className="text-sm text-gray-500 mb-2">This station connects multiple lines. Which one do you want to check?</p>
              {availableLinesForStation.map((line) => (
                <button
                  key={line.id}
                  onClick={() => confirmInterchangeLine(line.id)}
                  className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-all hover:border-gray-300 group"
                >
                  <span 
                    className="w-4 h-4 rounded-full mr-3 shadow-sm" 
                    style={{ backgroundColor: line.color || '#999' }}
                  ></span>
                  <span className="font-medium text-gray-700 group-hover:text-gray-900">{line.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* --- Result Modal --- */}
      <NextTrainModal
        isOpen={isModalOpen}
        line={MTR_DATA.find(line => line.id == selectedLineId)}
        station={MTR_DATA.find(line => line.id == selectedLineId)?.stations.find(station => station.id == selectedStationId)}
        data={trainSchedule}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
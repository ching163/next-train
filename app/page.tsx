'use client';

import { useState, useRef, useEffect } from "react";
import { motion, useMotionValue } from "framer-motion";
import { Search, ZoomIn, ZoomOut, X, TrainFront } from 'lucide-react';
import NextTrainModal, { TrainScheduleData } from "@/components/NextTrainModal";
import { MTR_DATA } from "@/constants/mtr";

// --- 1. Map Configuration ---
// Values are percentages (0-100) relative to the image size.
// These coordinates are hand‑tuned against /public/MTR_routemap.jpg
// so that each code in MTR_STATION roughly aligns with its station circle.
// If you tweak or replace the map image, you may need to adjust these.
const STATION_COORDINATES: Record<string, { x: number; y: number }> = {
  // Airport Express (AEL)
  HOK: { x: 52, y: 77 }, // Hong Kong
  KOW: { x: 48, y: 69 }, // Kowloon
  TSY: { x: 33, y: 72 }, // Tsing Yi
  AIR: { x: 16, y: 79 }, // Airport
  AWE: { x: 11, y: 72 }, // AsiaWorld Expo

  // Tung Chung Line (TCL)
  OLY: { x: 44, y: 63 },
  NAC: { x: 41, y: 63 },
  LAK: { x: 37, y: 60 },
  SUN: { x: 24, y: 77 },
  TUC: { x: 19, y: 82 },

  // Tuen Ma Line (TML) – New Territories east to Tuen Mun west
  WKS: { x: 63, y: 22 }, // Wu Kai Sha
  MOS: { x: 60, y: 24 },
  HEO: { x: 58, y: 26 },
  TSH: { x: 56, y: 28 },
  SHM: { x: 54, y: 30 },
  CIO: { x: 52, y: 32 },
  STW: { x: 50, y: 34 },
  CKT: { x: 48, y: 36 },
  TAW: { x: 46, y: 38 }, // Tai Wai (interchange)
  HIK: { x: 44, y: 40 },
  DIH: { x: 59, y: 46 }, // Diamond Hill (interchange with KTL)
  KAT: { x: 64, y: 47 },
  SUW: { x: 69, y: 47 },
  TKW: { x: 73, y: 47 },
  HOM: { x: 70, y: 56 }, // Ho Man Tin (interchange)
  HUH: { x: 67, y: 64 }, // Hung Hom (interchange)
  ETS: { x: 59, y: 69 },
  AUS: { x: 55, y: 67 },
  MEF: { x: 33, y: 54 }, // also on TWL
  TWW: { x: 28, y: 52 },
  KSR: { x: 23, y: 49 },
  YUL: { x: 19, y: 47 },
  LOP: { x: 16, y: 45 },
  TIS: { x: 14, y: 43 },
  SIH: { x: 12, y: 41 },
  TUM: { x: 10, y: 38 },

  // Tseung Kwan O Line (TKL) – right‑hand peninsula
  NOP: { x: 66, y: 82 }, // North Point (also Island Line)
  QUB: { x: 70, y: 82 }, // Quarry Bay (also Island Line)
  YAT: { x: 79, y: 69 }, // Yau Tong (also KTL)
  TIK: { x: 83, y: 67 }, // Tiu Keng Leng (also KTL)
  TKO: { x: 88, y: 64 }, // Tseung Kwan O
  LHP: { x: 93, y: 63 }, // LOHAS Park
  HAH: { x: 89, y: 58 }, // Hang Hau
  POA: { x: 91, y: 53 }, // Po Lam

  // East Rail Line (EAL) – vertical spine to the north
  ADM: { x: 56, y: 77 }, // Admiralty (many interchanges)
  EXC: { x: 58, y: 74 },
  // HUH already defined on TML
  MKK: { x: 57, y: 55 }, // Mong Kok East
  KOT: { x: 56, y: 44 }, // Kowloon Tong (interchange)
  SHT: { x: 54, y: 39 },
  FOT: { x: 54, y: 35 },
  RAC: { x: 54, y: 31 },
  UNI: { x: 54, y: 27 },
  TAP: { x: 54, y: 24 },
  TWO: { x: 54, y: 21 },
  FAN: { x: 54, y: 18 },
  SHS: { x: 54, y: 15 },
  LOW: { x: 54, y: 11 },
  LMC: { x: 58, y: 11 },

  // South Island Line (SIL) – bottom‑left island branch
  OCP: { x: 39, y: 86 },
  WCH: { x: 35, y: 88 },
  LET: { x: 32, y: 90 },
  SOH: { x: 30, y: 93 },

  // Tsuen Wan Line (TWL) – red line across middle
  CEN: { x: 49, y: 78 }, // Central
  TST: { x: 53, y: 73 },
  JOR: { x: 54, y: 70 },
  YMT: { x: 55, y: 66 },
  MOK: { x: 55, y: 61 },
  PRE: { x: 55, y: 57 },
  SSP: { x: 47, y: 56 },
  CSW: { x: 42, y: 56 },
  LCK: { x: 38, y: 56 },
  KWF: { x: 34, y: 56 },
  KWH: { x: 31, y: 56 },
  TWH: { x: 28, y: 56 },
  TSW: { x: 24, y: 56 },

  // Island Line (ISL) – bottom central blue line
  KET: { x: 37, y: 79 },
  HKU: { x: 40, y: 79 },
  SYP: { x: 43, y: 79 },
  SHW: { x: 46, y: 79 },
  WAC: { x: 59, y: 78 },
  CAB: { x: 63, y: 78 },
  TIH: { x: 67, y: 78 },
  FOH: { x: 70, y: 78 },
  TAK: { x: 73, y: 78 },
  SWH: { x: 76, y: 78 },
  SKW: { x: 79, y: 78 },
  HFC: { x: 82, y: 78 },
  CHW: { x: 86, y: 78 },

  // Kwun Tong Line (KTL) – green east‑Kowloon line
  WHA: { x: 63, y: 70 },
  SKM: { x: 52, y: 52 },
  LOF: { x: 59, y: 49 },
  WTS: { x: 61, y: 47 },
  CHH: { x: 63, y: 45 },
  KOB: { x: 66, y: 44 },
  NTK: { x: 69, y: 44 },
  KWT: { x: 72, y: 44 },
  LAT: { x: 75, y: 44 },

  // Disneyland Resort Line (DRL)
  DIS: { x: 27, y: 82 },
};


export default function Home() {
  // --- State ---
  const [selectedLineId, setSelectedLineId] = useState<string>('');
  const [selectedStationId, setSelectedStationId] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [trainSchedule, setTrainSchedule] = useState<TrainScheduleData>({});
  
  // Map State
  // scale = 1 should always mean: "fit whole map into viewport"
  const [scale, setScale] = useState(1);
  const constraintsRef = useRef<HTMLDivElement | null>(null);
  const mapWrapperRef = useRef<HTMLDivElement | null>(null);
  const [dragBounds, setDragBounds] = useState<{ left: number; right: number; top: number; bottom: number }>({
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  });
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
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

  // 6. Recalculate drag bounds whenever scale or layout changes
  useEffect(() => {
    const updateBounds = () => {
      const container = constraintsRef.current;
      const map = mapWrapperRef.current;
      if (!container || !map) return;

      const containerRect = container.getBoundingClientRect();
      const mapRect = map.getBoundingClientRect();

      const extraWidth = Math.max(0, mapRect.width - containerRect.width);
      const extraHeight = Math.max(0, mapRect.height - containerRect.height);

      // Base bounds where edges align with viewport edges (no blank space).
      const alignX = extraWidth / 2;
      const alignY = extraHeight / 2;

      // Allow a bit of over-pan so stations at the extreme edges
      // can be comfortably brought into view, but keep at least
      // 10% of the map visible at all times.
      const minVisibleWidth = Math.min(mapRect.width, containerRect.width) * 0.1;
      const minVisibleHeight = Math.min(mapRect.height, containerRect.height) * 0.1;

      const halfTotalWidth = (mapRect.width + containerRect.width) / 2;
      const halfTotalHeight = (mapRect.height + containerRect.height) / 2;

      const maxAllowedX = Math.max(alignX, halfTotalWidth - minVisibleWidth);
      const maxAllowedY = Math.max(alignY, halfTotalHeight - minVisibleHeight);

      setDragBounds({
        left: -maxAllowedX,
        right: maxAllowedX,
        top: -maxAllowedY,
        bottom: maxAllowedY,
      });
    };

    updateBounds();
    window.addEventListener('resize', updateBounds);
    return () => window.removeEventListener('resize', updateBounds);
  }, [scale]);

  // 7. Keep map within bounds when zooming or when bounds shrink
  useEffect(() => {
    if (scale <= 1) {
      // Reset to centered view when fully zoomed out
      x.set(0);
      y.set(0);
      return;
    }

    const currentX = x.get();
    const currentY = y.get();

    const clampedX = Math.min(Math.max(currentX, dragBounds.left), dragBounds.right);
    const clampedY = Math.min(Math.max(currentY, dragBounds.top), dragBounds.bottom);

    x.set(clampedX);
    y.set(clampedY);
  }, [dragBounds, scale, x, y]);

  return (
    <div className="flex flex-col h-screen bg-gray-100 overflow-hidden">
      
      {/* --- Header --- */}
      <header className="z-20 bg-white/90 backdrop-blur shadow-sm px-4 py-3 flex justify-between items-center shrink-0">
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

      {/* --- Map Area (fills space between header and bottom controls) --- */}
      <div
        className="flex-1 overflow-hidden bg-blue-50 relative cursor-grab active:cursor-grabbing"
        ref={constraintsRef}
      >
        <motion.div
          drag={scale > 1}
          // When zoomed in, limit panning so that at least part of the
          // map always remains visible within the viewport.
          dragConstraints={scale > 1 ? dragBounds : { left: 0, right: 0, top: 0, bottom: 0 }}
          dragElastic={0.1}
          dragMomentum={false}
          animate={{ scale }}
          transition={{ duration: 0.3 }}
          className="w-full h-full flex items-center justify-center origin-center"
          style={{ x, y }}
        >
          {/* This wrapper shrinks/grows with the image, so 100% of the map
              is visible at scale = 1, and station buttons stay in sync. */}
          <div ref={mapWrapperRef} className="relative max-w-full max-h-full">
            <img 
              src="/MTR_routemap.jpg"
              alt="MTR Map" 
              className="block max-w-full max-h-[80vh] w-auto h-auto object-contain select-none pointer-events-none" 
            />

            {/* Render Clickable Stations */}
            {Object.entries(STATION_COORDINATES).map(([code, coords]) => (
              <button
                key={code}
                onClick={(e) => {
                  e.stopPropagation(); // Prevent drag start if possible
                  handleMapMarkerClick(code);
                }}
                className="absolute w-5 h-5 rounded-full border border-white shadow-md bg-transparent hover:bg-black/20 transition-colors z-10 group flex items-center justify-center -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${coords.x}%`,
                  top: `${coords.y}%`,
                }}
              >
                {/* Visual Indicator (Pulsing Dot) */}
                <span className="absolute w-2 h-2 bg-blue-600 rounded-full animate-ping opacity-75"></span>
                <span className="absolute w-2 h-2 bg-blue-600 rounded-full"></span>
                
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
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
  // --- Airport Express (AEL) & Tung Chung Line (TCL) ---
  HOK: { x: 42, y: 72 }, // Hong Kong
  KOW: { x: 36, y: 66 }, // Kowloon
  OLY: { x: 37, y: 58 }, // Olympic
  NAC: { x: 36, y: 50 }, // Nam Cheong (Interchange TML)
  LAK: { x: 32, y: 44 }, // Lai King (Interchange TWL)
  TSY: { x: 28, y: 50 }, // Tsing Yi
  SUN: { x: 23, y: 58 }, // Sunny Bay
  TUC: { x: 17, y: 66 }, // Tung Chung
  AIR: { x: 14, y: 62 }, // Airport
  AWE: { x: 12, y: 56 }, // AsiaWorld-Expo

  // --- Tuen Ma Line (TML) ---
  // West / Tuen Mun section
  TUM: { x: 10, y: 36 }, // Tuen Mun
  SIH: { x: 10, y: 26 }, // Siu Hong
  TIS: { x: 13, y: 17 }, // Tin Shui Wai
  LOP: { x: 17, y: 22 }, // Long Ping
  YUL: { x: 17, y: 27 }, // Yuen Long
  KSR: { x: 17, y: 32 }, // Kam Sheung Road
  TWW: { x: 28, y: 40 }, // Tsuen Wan West
  MEF: { x: 37, y: 44 }, // Mei Foo (Interchange TWL)
  // NAC defined above
  AUS: { x: 46, y: 66 }, // Austin
  ETS: { x: 52, y: 71 }, // East Tsim Sha Tsui
  HUH: { x: 58, y: 68 }, // Hung Hom (Interchange EAL)
  HOM: { x: 62, y: 62 }, // Ho Man Tin (Interchange KTL)
  TKW: { x: 69, y: 59 }, // To Kwa Wan
  SUW: { x: 71, y: 54 }, // Sung Wong Toi
  KAT: { x: 73, y: 48 }, // Kai Tak
  DIH: { x: 69, y: 42 }, // Diamond Hill (Interchange KTL)
  HIK: { x: 65, y: 37 }, // Hin Keng
  TAW: { x: 60, y: 37 }, // Tai Wai (Interchange EAL)
  // East / Ma On Shan section
  CKT: { x: 67, y: 31 }, // Che Kung Temple
  STW: { x: 67, y: 26 }, // Sha Tin Wai
  CIO: { x: 71, y: 21 }, // City One
  SHM: { x: 75, y: 21 }, // Shek Mun
  TSH: { x: 79, y: 21 }, // Tai Shui Hang
  HEO: { x: 83, y: 21 }, // Heng On
  MOS: { x: 87, y: 21 }, // Ma On Shan
  WKS: { x: 91, y: 21 }, // Wu Kai Sha

  // --- East Rail Line (EAL) ---
  ADM: { x: 48, y: 78 }, // Admiralty (Terminus)
  EXC: { x: 53, y: 75 }, // Exhibition Centre
  // HUH defined above
  MKK: { x: 58, y: 54 }, // Mong Kok East
  KOT: { x: 58, y: 42 }, // Kowloon Tong (Interchange KTL)
  // TAW defined above
  SHT: { x: 60, y: 31 }, // Sha Tin
  FOT: { x: 60, y: 26 }, // Fo Tan
  RAC: { x: 63, y: 25 }, // Racecourse
  UNI: { x: 58, y: 20 }, // University
  TAP: { x: 53, y: 20 }, // Tai Po Market
  TWO: { x: 48, y: 20 }, // Tai Wo
  FAN: { x: 43, y: 20 }, // Fanling
  SHS: { x: 39, y: 17 }, // Sheung Shui
  LOW: { x: 35, y: 15 }, // Lo Wu
  LMC: { x: 32, y: 22 }, // Lok Ma Chau

  // --- Tsuen Wan Line (TWL) ---
  CEN: { x: 44, y: 78 }, // Central
  // ADM defined above
  TST: { x: 52, y: 71 }, // Tsim Sha Tsui
  JOR: { x: 52, y: 66 }, // Jordan
  YMT: { x: 52, y: 60 }, // Yau Ma Tei
  MOK: { x: 52, y: 54 }, // Mong Kok
  PRE: { x: 52, y: 48 }, // Prince Edward
  SSP: { x: 47, y: 44 }, // Sham Shui Po
  CSW: { x: 43, y: 44 }, // Cheung Sha Wan
  LCK: { x: 40, y: 44 }, // Lai Chi Kok
  // MEF defined above
  // LAK defined above
  KWF: { x: 28, y: 44 }, // Kwai Fong
  KWH: { x: 24, y: 44 }, // Kwai Hing
  TWH: { x: 20, y: 44 }, // Tai Wo Hau
  TSW: { x: 16, y: 44 }, // Tsuen Wan

  // --- Kwun Tong Line (KTL) ---
  WHA: { x: 64, y: 64 }, // Whampoa
  // HOM defined above
  // YMT defined above
  // MOK defined above
  // PRE defined above
  SKM: { x: 55, y: 46 }, // Shek Kip Mei
  // KOT defined above
  LOF: { x: 62, y: 42 }, // Lok Fu
  WTS: { x: 65, y: 42 }, // Wong Tai Sin
  // DIH defined above
  CHH: { x: 75, y: 42 }, // Choi Hung
  KOB: { x: 80, y: 45 }, // Kowloon Bay
  NTK: { x: 80, y: 50 }, // Ngau Tau Kok
  KWT: { x: 80, y: 56 }, // Kwun Tong
  LAT: { x: 80, y: 62 }, // Lam Tin
  YAT: { x: 82, y: 68 }, // Yau Tong
  TIK: { x: 86, y: 68 }, // Tiu Keng Leng

  // --- Tseung Kwan O Line (TKL) ---
  NOP: { x: 71, y: 79 }, // North Point
  QUB: { x: 76, y: 79 }, // Quarry Bay
  // YAT defined above
  // TIK defined above
  TKO: { x: 90, y: 64 }, // Tseung Kwan O
  LHP: { x: 93, y: 69 }, // LOHAS Park
  HAH: { x: 93, y: 58 }, // Hang Hau
  POA: { x: 93, y: 52 }, // Po Lam

  // --- Island Line (ISL) ---
  KET: { x: 23, y: 79 }, // Kennedy Town
  HKU: { x: 28, y: 79 }, // HKU
  SYP: { x: 32, y: 79 }, // Sai Ying Pun
  SHW: { x: 38, y: 79 }, // Sheung Wan
  // CEN defined above
  // ADM defined above
  WAC: { x: 53, y: 79 }, // Wan Chai
  CAB: { x: 58, y: 79 }, // Causeway Bay
  TIH: { x: 62, y: 79 }, // Tin Hau
  FOH: { x: 66, y: 79 }, // Fortress Hill
  // NOP defined above
  // QUB defined above
  TAK: { x: 81, y: 79 }, // Tai Koo
  SWH: { x: 85, y: 79 }, // Sai Wan Ho
  SKW: { x: 88, y: 84 }, // Shau Kei Wan
  HFC: { x: 90, y: 89 }, // Heng Fa Chuen
  CHW: { x: 92, y: 95 }, // Chai Wan

  // --- South Island Line (SIL) ---
  // ADM defined above
  OCP: { x: 53, y: 85 }, // Ocean Park
  WCH: { x: 44, y: 91 }, // Wong Chuk Hang
  LET: { x: 38, y: 95 }, // Lei Tung
  SOH: { x: 34, y: 95 }, // South Horizons

  // --- Disneyland Resort Line (DRL) ---
  // SUN defined above
  DIS: { x: 26, y: 66 }, // Disneyland Resort
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
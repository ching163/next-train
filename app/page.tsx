'use client'

import NextTrainModal, { TrainScheduleData } from "@/components/NextTrainModal";
import { MTR_DATA } from "@/constants/mtr";
import { useState } from "react";

export default function Home() {
  const [selectedLineId, setSelectedLineId] = useState<string>();
  const [selectedStationId, setSelectedStationId] = useState<string>();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [trainSchedule, setTrainSchedule] = useState<TrainScheduleData>({});

  const handleLineChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLineId = e.target.value;
    setSelectedLineId(newLineId);
    setSelectedStationId('');
  }

  const handleStationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStationId = e.target.value;
    setSelectedStationId(newStationId);
  }

  const fetchNextTrain = () => {
    // https://rt.data.gov.hk/v1/transport/mtr/getSchedule.php?line=TKL&sta=TKO
    if (!selectedLineId || !selectedStationId) {
      alert('Please select both line and station.');
      return;
    }
    const url = `https://rt.data.gov.hk/v1/transport/mtr/getSchedule.php?line=${selectedLineId}&sta=${selectedStationId}`;
    fetch(url)
      .then(res => res.json())
      .then(data => {
        console.log(data);
        // display a popup with the next train info
        if (data.status != 1) {
          throw new Error(data.message || 'Failed to fetch next train info.');
        }
        // get both up and down side train info
        const resultTrainSchedule = data.data[`${selectedLineId}-${selectedStationId}`];
        // display up and down in different tabs
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
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <main className="flex min-h-screen w-full flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">Next Train Finder</h2>
        <div className="max-w-full mx-auto p-4 border rounded-lg shadow-lg">
          <div className="flex flex-wrap space-x-2 mb-2">
            <div className=" flex-1 flex flex-col">
              <label>Line:</label>
              <select
                className="border rounded"
                value={selectedLineId}
                onChange={handleLineChange}
              >
                <option>-- Select a Line -- </option>
                {MTR_DATA.map((line) => (
                  <option key={line.id} value={line.id}>
                    {line.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1 flex flex-col">
              <label>Station:</label>
              <select
                className="border rounded"
                value={selectedStationId}
                onChange={handleStationChange}
              >
                <option>-- Select a Station -- </option>
                {MTR_DATA.find(line => line.id == selectedLineId)?.stations.map((station) => (
                  <option key={station.id} value={station.id}>
                    {station.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button
            className="w-full p-1 bg-blue-500 text-white rounded"
            onClick={fetchNextTrain}
          >
            Get Next Train
          </button>
        </div>
      </main>

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

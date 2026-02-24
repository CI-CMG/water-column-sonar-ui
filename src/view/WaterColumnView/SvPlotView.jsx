import {
  useEffect,
  useState,
} from "react";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import {
  selectFrequencies,
  selectSv,
} from ".././../reducers/store/storeSlice.ts";
import { useAppSelector } from "../../app/hooks";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
);

// Sv Label: https://github.com/CI-CMG/water-column-sonar-ui/issues/114
const options = {
  responsive: true,
  plugins: {
    title: {
      display: true,
      text: 'Volume Backscattering Strength, Sv (dB re 1 m^2 m^-3)',
    },
  },
  // maintainAspectRatio: false,
};

/* -------- Line Plot of Sv Data ---------- */
export default function SvPlotView() {
  const frequencies = useAppSelector(selectFrequencies);
  const sv = useAppSelector(selectSv);
  const [chartData, setChartData] = useState(null)


  useEffect(() => {
    if(frequencies !== null && sv !== null) {
      setChartData({
        labels: frequencies.map(x => `${String(x/1000)} kHz`),
        datasets: [
          {
            label: 'Sv',
            data: sv,
            borderColor: 'rgb(53, 162, 235)',
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
          },
        ],
      });
    }
  }, [frequencies, sv]);

  return (
    <div className="SvPlotView">
      {
        chartData ?
        <>
          <Line options={options} data={chartData} height="125px" />
        </>
        :
        <></>
      }
    </div>
  );
}

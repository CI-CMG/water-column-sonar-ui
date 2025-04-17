// import {
//   // React,
//   useEffect
// } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  // Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  // Legend
);

const options = {
  responsive: true,
  plugins: {
    title: {
      display: true,
      text: 'Volume Backscattering Strength, Sv (dB re 1 m-1)',
    },
  },
};

const data = {
  labels: ['18 kHz', '38 kHz', '70 kHz', '120 kHz'],
  datasets: [
    {
      label: 'Sv',
      data: [-10, -70, -20, -40],
      borderColor: 'rgb(53, 162, 235)',
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
      // borderColor: 'rgb(255, 105, 180, 0.5)',
      // backgroundColor: 'rgba(255, 182, 193, 0.75)',
    },
  ],
};

export default function SvPlotView() {

  return (
    <div className="SvPlotView">
      <Line options={options} data={data} />
    </div>
  );
}

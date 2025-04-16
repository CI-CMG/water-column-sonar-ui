//////////////////////////////////////////////////////////////////////////////////
import {
  useState,
  useEffect,
} from "react";
import Spinner from 'react-bootstrap/Spinner';
import PropTypes from "prop-types";
import WaterColumnColors from "./WaterColumnColors.jsx";
// import {
//   useSearchParams
// } from 'react-router';

function legendValue(percent, max, min) {
  const range = Math.abs(max - min);
  const decimal = percent / 100;
  const value = min + (range * decimal);

  return `${Number.parseFloat(value).toFixed(2)}`;
}

//////////////////////////////////////////////////////////////////////////////////
const ColorMap = ({
  min,
  max,
  selectedColorPalette,
}) => {
  // const [searchParams, setSearchParams] = useSearchParams();
  // const [isLoading, setLoading] = useState(true);
  
  const width = 300;
  const height = 20;
  const fill = 'black';
  // const palette = WaterColumnColors[selectedColorPalette];
  const legend0 = "A"; // legendValue(0, max, min);
  const legend25 = "B"; // legendValue(25, max, min);
  const legend50 = "C"; //legendValue(50, max, min);
  const legend75 = "D"; // legendValue(75, max, min);
  const legend100 = "E"; //legendValue(100, max, min);

  useEffect(() => {
    console.log('Loading the color map.')
  }, [])

  // if (isLoading) {
  //   return <>
  //     <Spinner animation="border" role="status">
  //       <span className="visually-hidden">Loading...</span>
  //     </Spinner>
  //   </>;
  // }
  return (
    <>
      <p>Color Map WIP</p>
      <svg height={height} width={width} xmlns="http://www.w3.org/2000/svg">
        {
          Array.from({ length: 5 }, (color, index) => (
            <text x="5" y={15*index} fill="red" key={index}>{color}</text>
          ))
        }
      </svg>
      <p>mid</p>
      <svg height={height} width={width} xmlns="http://www.w3.org/2000/svg">
        <text
          x={width * .03}
          y={height}
          fill={fill}
        >
          {legend0}
        </text>
        <text
          x={width * .25}
          y={height}
          fill={fill}
        >
          {legend25}
        </text>
        <text
          x={width * .50}
          y={height}
          fill={fill}
        >
          {legend50}
        </text>
        <text
          x={width * .75}
          y={height}
          fill={fill}
        >
          {legend75}
        </text>
        <text
          x={width * .97}
          y={height}
          fill={fill}
        >
          {legend100}
        </text>
      </svg>
      <p>Color Map WIP</p>
    </>
  );
};

export default ColorMap;

ColorMap.propTypes = {
  min: PropTypes.instanceOf(Number),
  max: PropTypes.instanceOf(Number),
  selectedColorPalette: PropTypes.instanceOf(String),
};

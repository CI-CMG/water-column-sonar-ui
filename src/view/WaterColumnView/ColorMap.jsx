//////////////////////////////////////////////////////////////////////////////////
import {
  useRef,
  useState,
  useEffect,
} from "react";
import { useInterval } from 'usehooks-ts'
// import Spinner from 'react-bootstrap/Spinner';
import PropTypes from "prop-types";
import * as d3 from 'd3'
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

const generateDataset = () => {
  // WaterColumnColors['viridis'].length
  // Array(WaterColumnColors['viridis'].length).fill(0).map(() => ([
  //   ([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]).map((x) => x*10)
  // ]))
  return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((x) => x*20);
}

//////////////////////////////////////////////////////////////////////////////////
const ColorMap = ({
  min,
  max,
  selectedColorPalette,
}) => {
  // const [searchParams, setSearchParams] = useSearchParams();
  // const [isLoading, setLoading] = useState(true);

  // https://2019.wattenberger.com/blog/react-and-d3
  const ref = useRef();
  const [dataset, setDataset] = useState(generateDataset());

  const width = 360;
  const height = 30;

  useEffect(() => {
    const svgElement = d3.select(ref.current)
    svgElement.selectAll("rect")
      .data(dataset, d => d)
      .join("rect")
        .attr("width", 0)
        .attr("height", 10)
        .attr("x", d => d)
        .attr("y", 0)
        .attr("fill", function(d, i){return WaterColumnColors['viridis'][i]})
  }, [dataset]);

  // useInterval(() => {
  //   const newDataset = generateDataset()
  //   setDataset(newDataset)
  // }, 2000);

  // if (isLoading) {
  //   return <>
  //     <Spinner animation="border" role="status">
  //       <span className="visually-hidden">Loading...</span>
  //     </Spinner>
  //   </>;
  // }
  return (
    <>
      <svg height={height} width={width} ref={ref} />
      {/* <svg height={height} width={width} xmlns="http://www.w3.org/2000/svg">
        {
          Array.from({ length: 5 }, (color, index) => (
            <text x="5" y={15*index} fill="red" key={index}>{color}</text>
          ))
        }
      </svg> */}
      {/* <svg height={height} width={width} xmlns="http://www.w3.org/2000/svg">
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
      </svg> */}
    </>
  );
};

export default ColorMap;

ColorMap.propTypes = {
  min: PropTypes.instanceOf(Number),
  max: PropTypes.instanceOf(Number),
  selectedColorPalette: PropTypes.instanceOf(String),
};

//////////////////////////////////////////////////////////////////////////////////
import {
  useRef,
  useState,
  useEffect,
} from "react";
// import { useInterval } from 'usehooks-ts';
// import Spinner from 'react-bootstrap/Spinner';
import PropTypes from "prop-types";
import * as d3 from 'd3'
import { range } from 'd3-array';
import { scaleOrdinal } from 'd3-scale';
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
  minSv,
  maxSv,
  selectedColorPalette,
}) => {
  // const [searchParams, setSearchParams] = useSearchParams();
  // const [isLoading, setLoading] = useState(true);

  // https://2019.wattenberger.com/blog/react-and-d3
  const ref = useRef();
  const [dataset, setDataset] = useState(generateDataset());
  // const minSv = -80;
  // const maxSv = -30;

  const width = 350;
  const height = 30;

  // old implementation
  // https://github.com/CI-CMG/echofish-ui/blob/master/src/main/frontend/src/components/waterColumn/ColorPaletteValues.vue

  useEffect(() => { // https://github.com/CI-CMG/echofish-ui/blob/master/src/main/frontend/src/components/waterColumn/ColorPaletteValues.vue
    const minSv = -80;
    const maxSv = -30;

    const palette = WaterColumnColors[selectedColorPalette];
    console.log(palette);

    const colorValueArray = d3.range(
      minSv,
      maxSv,
      (maxSv - minSv) / palette.length,
    );
    const colorScaleFunction = scaleOrdinal().domain(colorValueArray).range(palette);

    d3.select('#colorPalette').selectAll('*').remove();

    const svg = d3.select('#colorPalette')
      .append('svg')
      .attr('height', height)
      .attr('width', width);

    svg.selectAll('.bars')
      .data(range(palette.length), d => d)
      .enter()
      .append('rect')
      .attr('class', 'bars')
      .attr('x', i => ((i * width) / palette.length))
      .attr('y', 0)
      .attr('width', width / palette.length)
      .attr('height', height)
      .style('fill', d => colorScaleFunction(d));

    // svg.selectAll('rect')
    //   .on('mouseover', this.handleMouseOver)
    //   .on('mouseout', this.handleMouseOut);
  }, [dataset, selectedColorPalette]);

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
    <div id="colorMap">
      <div>
        <span id="colorPalette"/>
      </div>
      {/* <p>{selectedColorPalette}</p>
      <div id="res"></div>
      <svg height={height} width={width} ref={ref} /> */}
    </div>
  );
};

export default ColorMap;

ColorMap.propTypes = {
  // min: PropTypes.instanceOf(Number),
  // max: PropTypes.instanceOf(Number),
  selectedColorPalette: PropTypes.instanceOf(String),
};

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

  const width = 350;
  const height = 30;

  useEffect(() => {
    // const svgElement = d3.select(ref.current)
    // svgElement.selectAll("rect")
    //   .data(dataset, d => d)
    //   .join("rect")
    //     .attr("width", 5)
    //     .attr("height", 10)
    //     .attr("x", d => d)
    //     .attr("y", 0)
    //     .attr("fill", function(d, i){return WaterColumnColors['viridis'][i]})
    const tileWidth = 10; // individual tile widths
    var svg2 = d3.select("#res").append("svg").attr("width", 300).attr("height", 100)
    // data should be the quantized Sv values
    var data = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];
    var myColor = d3.scaleOrdinal().domain(data).range([
      "gold", "blue", "green", "yellow",
      "black", "grey", "darkgreen", "pink",
      "brown", "slateblue", "grey1", "orange",
    ]);
    svg2.selectAll(".firstrow")
      .data(data)
      .enter()
      .append("rect")
      .attr("width", tileWidth)
      .attr("height", tileWidth)
      .attr("x", function(d, i){return 30 + i*60})
      .attr("y", 50)
      .attr("fill", function(d){return myColor(d) })
  
    // Option 2: use a palette:
    // Include <script src="https://d3js.org/d3-scale-chromatic.v1.min.js"></script> in your code!
    // var myColor = d3.scaleOrdinal().domain(data).range(d3.schemeSet3);
    // svg2.selectAll(".firstrow").data(data).enter().append("circle").attr("cx", function(d,i){return 30 + i*60}).attr("cy", 150).attr("r", 19).attr("fill", function(d){return myColor(d) })
  


    // svg2.append("circle").attr("cx", 50).attr("cy",100).attr("r",20)
    // .style("fill", "#69b3a2");
  
    // // With Hex code
    // svg2.append("circle").attr("cx",50).attr("cy",100).attr("r",20)
    //   .style("fill", d3.color("steelblue") );
    
    // // With RGBA (last number is the opacity)
    // svg2.append("circle").attr("cx",150).attr("cy",100).attr("r",20)
    //   .style("fill", "rgba(198, 45, 205, 0.8)" )
    
    // // With RGB
    // svg2.append("circle").attr("cx",250).attr("cy",100).attr("r",20)
    //   .style("fill", "rgb(12,240,233)" )
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
    <div id="colorMap">
      <p>{selectedColorPalette}</p>
      <div id="res"></div>
      <svg height={height} width={width} ref={ref} />
      {/* <svg height={height} width={width} xmlns="http://www.w3.org/2000/svg">
        {
          Array.from({ length: 5 }, (color, index) => (
            <text x="5" y={15*index} fill="red" key={index}>{color}</text>
          ))
        }
      </svg> */}
    </div>
  );
};

export default ColorMap;

ColorMap.propTypes = {
  min: PropTypes.instanceOf(Number),
  max: PropTypes.instanceOf(Number),
  selectedColorPalette: PropTypes.instanceOf(String),
};

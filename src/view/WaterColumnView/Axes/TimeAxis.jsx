//////////////////////////////////////////////////////////////////////////////////
import {
  useEffect,
} from "react";
import * as d3 from 'd3';
import {
  selectDepthMinIndex,
  selectDepthMaxIndex,
  selectTimeMinIndex,
  selectTimeMaxIndex,
} from "../../../reducers/store/storeSlice.ts";
import { useAppSelector } from "../../../app/hooks.ts";


//////////////////////////////////////////////////////////////////////////////////
const TimeAxis = () => {
  const timeMinIndex = useAppSelector(selectTimeMinIndex);
  const timeMaxIndex = useAppSelector(selectTimeMaxIndex);
  const depthMinIndex = useAppSelector(selectDepthMinIndex);
  const depthMaxIndex = useAppSelector(selectDepthMaxIndex);

  const margin = ({top: 10, right: 30, bottom: 25, left: 10})
  const height = 100
  const width = 200

  useEffect(() => {
    d3.select('#timeAxisLabel').selectAll('*').remove();

    const x = d3.scaleLinear()
    .domain([timeMinIndex, timeMaxIndex])
    .range([margin.left, (width - margin.right)]);

    const y = d3.scaleLinear()
      .domain([depthMaxIndex, depthMinIndex]) // maxDepth, minDepth
      .range([(height - margin.bottom), margin.top])

    const svg = d3.select('#timeAxisLabel')
      .append('svg')
      .attr("viewBox", [0, 0, width, height]);

    const xAxis = g => g
      .attr("transform", `translate(0, ${height - margin.bottom})`)
      .call(d3.axisBottom(x).ticks(3));
  
    const yAxis = g => g
      .attr("transform", `translate(${width - margin.right}, 0)`)
      .call(d3.axisRight(y).ticks(3));

    svg.append("g")
      .call(xAxis);

    svg.append("g")
      .call(yAxis);

    // gx.transition()
    //   .duration(750)
    //   .call(d3.axisBottom(x));
    
  }, [timeMinIndex, timeMaxIndex]);

  return (
    <div id="timeAxis">
      <span id="timeAxisLabel"/>
    </div>
  );
};

export default TimeAxis;

//////////////////////////////////////////////////////////////////////////////////
import {
  useEffect,
} from "react";
import * as d3 from 'd3';
import {
  selectDepthMinIndex,
  selectDepthMaxIndex,
} from "../../../reducers/store/storeSlice.ts";
import { useAppSelector } from "../../../app/hooks.ts";


//////////////////////////////////////////////////////////////////////////////////
const DepthAxis = () => {
  const depthMinIndex = useAppSelector(selectDepthMinIndex);
  const depthMaxIndex = useAppSelector(selectDepthMaxIndex);

  const margin = ({top: 10, right: 30, bottom: 25, left: 10})
  const height = 100
  const width = 200

  useEffect(() => {
    d3.select('#depthAxisLabel').selectAll('*').remove();

    const y = d3.scaleLinear()
      .domain([depthMaxIndex, depthMinIndex]) // maxDepth, minDepth
      .range([(height - margin.bottom), margin.top])

    const svg = d3.select('#depthAxisLabel')
      .append('svg')
      .attr("viewBox", [0, 0, width, height]);

    const yAxis = g => g
      .attr("transform", `translate(${width - margin.right}, 0)`)
      .call(d3.axisRight(y).ticks(3));

    svg.append("g")
      .call(yAxis);

    // gx.transition()
    //   .duration(750)
    //   .call(d3.axisBottom(x));
    
  }, [margin.left, margin.right, margin.bottom, margin.top, depthMaxIndex, depthMinIndex]);

  return (
    <div id="depthAxis">
      <span id="depthAxisLabel"/>
    </div>
  );
};

export default DepthAxis;

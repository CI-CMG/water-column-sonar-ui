//////////////////////////////////////////////////////////////////////////////////
import { useLayoutEffect, useEffect, useRef, useState, useMemo } from "react";
import * as d3 from "d3";
import {
  selectDepthMinIndex,
  selectDepthMaxIndex,
} from "../../../reducers/store/storeSlice.ts";
import { useAppSelector } from "../../../app/hooks.ts";

//////////////////////////////////////////////////////////////////////////////////
const DepthAxis = () => {
  const ref = useRef(null);
  const [size, setSize] = useState([0, 0]);
  const depthMinIndex = useAppSelector(selectDepthMinIndex);
  const depthMaxIndex = useAppSelector(selectDepthMaxIndex);
  const height = ref.current ? ref.current.offsetHeight : 0;
  const width = ref.current ? ref.current.offsetWidth : 0;

  const domain = useMemo(() => {
    return [depthMinIndex, depthMaxIndex]
  }, [depthMinIndex, depthMaxIndex]);
  
  const range = useMemo(() => {
    return [0, height - 1]
  }, [height]);
  const selected = d3.select("#depthAxisLabel");

  useLayoutEffect(() => {
    // updates component on window resize
    const updateSize = () => {
      setSize([window.innerWidth, window.innerHeight]);
    }
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const y = d3
    .scaleLinear()
    .domain(domain)
    .range(range)
    .unknown(null);

  useEffect(() => {
    selected.selectAll("*").remove();

    selected
      .attr("width", width)
      .attr("height", height - 1)
      .append("g")
      .call(d3.axisRight(y));
  }, []);

  useEffect(() => {
    selected
      .transition()
      .duration(500)
      .call(d3.axisRight(y));
  }, [domain, ref, selected, size, y]);

  return (
    <div ref={ref} className="depthAxis">
      <svg id="depthAxisLabel" />
    </div>
  );
};

export default DepthAxis;

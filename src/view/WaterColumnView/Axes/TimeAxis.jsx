//////////////////////////////////////////////////////////////////////////////////
import { useLayoutEffect, useEffect, useRef, useState, useMemo } from "react";
import * as d3 from "d3";
import {
  selectTimeMinIndex,
  selectTimeMaxIndex,
} from "../../../reducers/store/storeSlice.ts";
import { useAppSelector } from "../../../app/hooks.ts";

//////////////////////////////////////////////////////////////////////////////////
const TimeAxis = () => {
  const ref = useRef(null);
  const [size, setSize] = useState([0, 0]);
  const timeMinIndex = useAppSelector(selectTimeMinIndex);
  const timeMaxIndex = useAppSelector(selectTimeMaxIndex);
  const height = ref.current ? ref.current.offsetHeight : 0;
  const width = ref.current ? ref.current.offsetWidth : 0;

  const domain = useMemo(() => {
    return [timeMinIndex, timeMaxIndex];
  }, [timeMinIndex, timeMaxIndex]);

  const range = useMemo(() => {
    return [0, width - 1];
  }, [width]);

  const selected = d3.select("#timeAxisLabel");

  useLayoutEffect(() => {
    // updates component on window resize
    const updateSize = () => {
      setSize([window.innerWidth, window.innerHeight]);
    };
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const x = d3.scaleLinear().domain(domain).range(range).unknown(null);
  // const formatMeters = (f => d => `${f(d)} m`)(d3.format("d"));
  const xAxis = d3.axisBottom(x); // .tickFormat(formatMeters);

  useEffect(() => {
    selected.selectAll("*").remove();

    selected
      .attr("width", width - 1)
      .attr("height", height)
      .append("g")
      .call(xAxis);
  }, []);

  useEffect(() => {
    selected.transition().duration(500).call(xAxis);
  }, [domain, ref, selected, size, x]);

  return (
    <div ref={ref} className="timeAxis">
      <svg id="timeAxisLabel"></svg>
    </div>
  );
};

export default TimeAxis;

//////////////////////////////////////////////////////////////////////////////////
import { useLayoutEffect, useEffect, useRef, useState, useMemo } from "react";
import * as d3 from "d3";
import { transition } from 'd3-transition';
import {
  selectTimeMinIndex,
  selectTimeMaxIndex,
  selectTimeArray,
} from "../../../reducers/store/storeSlice.ts";
import { useAppSelector } from "../../../app/hooks.ts";

//////////////////////////////////////////////////////////////////////////////////
const TimeAxis = () => {
  const timeArray = useAppSelector(selectTimeArray);

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
  const xAxis = d3.axisBottom(x).ticks(4);

  useEffect(() => { // For the initial axis update
    selected.selectAll("*").remove();
    
    selected
      .attr("width", width - 2)
      .attr("height", height)
      .append("g")
      .call(
        xAxis.tickFormat((d) => {
          if (timeArray !== null && d !== null) {
            const minIndex = Math.max(0, timeMinIndex);
            const selectTime = timeArray[d - minIndex];

            if (selectTime !== null && !isNaN(Number(selectTime))) {
              const tempDate = new Date(selectTime * 1_000_000);
              return d3.isoFormat(tempDate);
            }
          }
          return "";
        })
      );
  }, []);

  useEffect(() => { // ...and subsequent axis update
    selected
      .transition()
      .duration(500)
      .call(
        xAxis.tickFormat((d) => {
          if (timeArray !== null && d !== null) {
            const minIndex = Math.max(0, timeMinIndex);
            const selectTime = timeArray[d - minIndex];

            if (selectTime !== null && !isNaN(Number(selectTime))) {
              const tempDate = new Date(Number(selectTime)/1_000_000);
              return d3.isoFormat(tempDate);
            }
          }
          return "";
        })
      );
  }, [
    domain,
    ref,
    selected,
    size,
    x,
    timeArray,
    xAxis,
    timeMinIndex,
    timeMaxIndex,
  ]);

  return (
    <div ref={ref} className="timeAxis">
      <svg id="timeAxisLabel"></svg>
    </div>
  );
};

export default TimeAxis;

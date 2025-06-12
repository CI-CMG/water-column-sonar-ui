//////////////////////////////////////////////////////////////////////////////////
import {
  useEffect,
  useRef,
} from "react";
import * as d3 from "d3";
import {
  selectTimeMinIndex,
  selectTimeMaxIndex,
} from "../../../reducers/store/storeSlice.ts";
import { useAppSelector } from "../../../app/hooks.ts";

//////////////////////////////////////////////////////////////////////////////////
/*
Note: there is a problem when the page loads where the component changes sizes
on reload and the ref returns the wrong dimension. Maybe solved.
*/
const TimeAxis = () => {
  const ref = useRef(null);
  const timeMinIndex = useAppSelector(selectTimeMinIndex);
  const timeMaxIndex = useAppSelector(selectTimeMaxIndex);

  // const margin = { top: 10, right: 1, bottom: 25, left: 1 };

  useEffect(() => {
    d3.select("#timeAxisLabel").selectAll("*").remove();

    const width = ref.current ? ref.current.offsetWidth : 0;
    const height = ref.current ? ref.current.offsetHeight : 0;
    // console.log(`widthW: ${width}, heightH: ${height}`)

    const x = d3
      .scaleLinear()
      .domain([timeMinIndex, timeMaxIndex])
      // .range([margin.left, width - margin.right]);
      .range([10, width-10]);

    d3.select("#timeAxisLabel")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width-10, height])
      .append("g")
      .style("font-size", "12px")
      .call(d3.axisBottom(x).ticks(5));
  }, []);

  useEffect(() => {
    const width = ref.current ? ref.current.offsetWidth : 0;
    const x = d3
      .scaleLinear()
      .domain([timeMinIndex, timeMaxIndex])
      // .range([margin.left, width - margin.right]);
      .range([10, width-10]);

    d3.select("#timeAxisLabel")
      .transition()
      .duration(800)
      .style("font-size", "12px")
      .call(d3.axisBottom(x).ticks(5));

    // const width2 = ref.current ? ref.current.offsetWidth : 0;
    // const height2 = ref.current ? ref.current.offsetHeight : 0;
    // console.log(`width2: ${width2}, height™: ${height2}`)
  }, [timeMinIndex, timeMaxIndex, ref]);

  // useEffect(() => {
  //   // this dynamically gets the width of component
  //   console.log('width', ref.current ? ref.current.offsetWidth : 0);
  //   console.log('height', ref.current ? ref.current.offsetHeight : 0);
  // }, [ref.current]);

  return (
    <div ref={ref} className="timeAxis">
      <svg id="timeAxisLabel"></svg>
    </div>
  );
};

export default TimeAxis;

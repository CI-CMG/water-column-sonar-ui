//////////////////////////////////////////////////////////////////////////////////
import { useEffect } from "react";
import * as d3 from "d3";
import {
  selectTimeMinIndex,
  selectTimeMaxIndex,
} from "../../../reducers/store/storeSlice.ts";
import { useAppSelector } from "../../../app/hooks.ts";

//////////////////////////////////////////////////////////////////////////////////
const TimeAxis = () => {
  const timeMinIndex = useAppSelector(selectTimeMinIndex);
  const timeMaxIndex = useAppSelector(selectTimeMaxIndex);

  const margin = { top: 10, right: 1, bottom: 25, left: 1 };
  const height = 40;
  const width = window.innerWidth;

  useEffect(() => {
    d3.select("#timeAxisLabel").selectAll("*").remove();

    const x = d3
      .scaleLinear()
      .domain([timeMinIndex, timeMaxIndex])
      .range([margin.left, width - margin.right]);

    d3.select("#timeAxisLabel")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .append("g")
      .call(d3.axisBottom(x).ticks(4)).style("font-size", "40px");
  }, []); // only called the first time

  useEffect(() => {
    const x = d3
      .scaleLinear()
      .domain([timeMinIndex, timeMaxIndex])
      .range([margin.left, width - margin.right]);

    d3.select("#timeAxisLabel")
      .transition()
      .duration(500)
      .call(d3.axisBottom(x).ticks(4));
  }, [timeMinIndex, timeMaxIndex, margin]);

  return <svg id="timeAxisLabel"></svg>;
};

export default TimeAxis;

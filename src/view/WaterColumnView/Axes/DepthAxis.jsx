//////////////////////////////////////////////////////////////////////////////////
import { useLayoutEffect, useEffect, useRef, useState, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks.ts";
import * as d3 from "d3";
import {
  selectShip,
  selectCruise,
  selectSensor,
  //
  selectDepthMinIndex,
  selectDepthMaxIndex,
  selectDepthArray,
  //
  // timeAsync,
  depthArrayAsync,
} from "../../../reducers/store/storeSlice.ts";
// import { useAppSelector } from "../../../app/hooks.ts";
// import { fetchDepthArray } from "../../../reducers/store/storeAPI.ts"

//////////////////////////////////////////////////////////////////////////////////
const DepthAxis = () => {
  const dispatch = useAppDispatch();
  const ship = useAppSelector(selectShip);
  const cruise = useAppSelector(selectCruise);
  const sensor = useAppSelector(selectSensor);
  const depthArray = useAppSelector(selectDepthArray);

  const ref = useRef(null);
  const [size, setSize] = useState([0, 0]);
  const depthMinIndex = useAppSelector(selectDepthMinIndex);
  const depthMaxIndex = useAppSelector(selectDepthMaxIndex);
  // const depthArray = useAppSelector(selectDepthArray);
  const height = ref.current ? ref.current.offsetHeight : 0;
  const width = ref.current ? ref.current.offsetWidth : 0;

  const domain = useMemo(() => {
    return [depthMinIndex, depthMaxIndex];
  }, [depthMinIndex, depthMaxIndex]);

  const range = useMemo(() => {
    return [0, height - 1];
  }, [height]);
  const selected = d3.select("#depthAxisLabel");

  useEffect(() => { // TODO: this might be better elsewhere?
      dispatch(depthArrayAsync({ ship, cruise, sensor, indexStart: depthMinIndex, indexEnd: depthMaxIndex }));
  }, [dispatch, ship, cruise, sensor, depthMinIndex, depthMaxIndex]);

  useLayoutEffect(() => {
    // updates component on window resize
    const updateSize = () => {
      setSize([window.innerWidth, window.innerHeight]);
    };
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const y = d3.scaleLinear().domain(domain).range(range).unknown(null);
  // https://observablehq.com/@d3/axis-ticks
  // For ordinal scales, such as band and point scales, the scale does not implement scale.ticks because an ordinal scale has no way of knowing which ordinal values from the scale’s domain to prioritize. For an ordinal axis, use axis.tickValues to instead specify which tick values you want.
  // TODO: 
  // const y = d3.scalePoint().domain(domain).range(range).unknown(null);
  // const formatMeters = (f => d => `${f(d)} m`)(d3.format("d"));
  const yAxis = d3.axisRight(y).ticks(4); // .tickFormat(formatMeters);

  useEffect(() => {
    selected.selectAll("*").remove();
    selected
      .attr("width", width)
      .attr("height", height - 1)
      .append("g")
      .call(yAxis);
  }, []);

  useEffect(() => {
    // console.log(depthArray);
    // console.log(depthArray.length);
    if(depthArray !== null) {
      console.log(depthArray.length);
      // const y2 = d3.scalePoint().domain(depthArray).range(range);
      const y2 = d3.scalePoint().domain(Array.from([1,2,3,4,5,6,7,8,9,10])).range(range);
      const yAxis2 = d3.axisRight(y2);
      selected.transition().duration(500).call(yAxis2);
    }
  }, [domain, ref, selected, size, yAxis, depthArray]);

  return (
    <div ref={ref} className="depthAxis">
      <svg id="depthAxisLabel" />
    </div>
  );
};

export default DepthAxis;

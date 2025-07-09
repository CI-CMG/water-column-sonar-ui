//////////////////////////////////////////////////////////////////////////////////
import { useLayoutEffect, useEffect, useRef, useState, useMemo } from "react";
import * as d3 from "d3";
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

  useEffect(() => {
    // initial axis update
    selected.selectAll("*").remove();

    selected
      // .attr("width", width - 1)
      .attr("width", width - 2)
      .attr("height", height)
      .append("g")
      .call(
        xAxis.tickFormat((d) => {
          if (timeArray !== null && d !== null) {
            const minIndex = Math.max(0, timeMinIndex);
            const asdf = timeArray[d - minIndex];

            if (isNaN(asdf)) {
              return "";
            }
            if (asdf !== null) {
              const tempDate = new Date(asdf * 1000);

              return d3.isoFormat(tempDate);
            }
          }
          return "";
        })
      );
  }, []);

  useEffect(() => {
    // subsequent axis update
    selected
      .transition()
      .duration(300)
      .call(
        xAxis.tickFormat((d) => {
          if (timeArray !== null && d !== null) {
            const minIndex = Math.max(0, timeMinIndex);
            // console.log(
            //   `d: ${d}, timeMinIndex: ${timeMinIndex}, timeMaxIndex: ${timeMaxIndex}, timeArray: ${timeArray.length}`
            // );
            // debugger;
            const asdf = timeArray[d - minIndex];
            // console.log(
            //   `timeArray: ${timeArray[0]}, ${timeArray[timeArray.length - 1]}`
            // );

            if (isNaN(asdf)) {
              // console.log("NaN Found! _+_+_+_+_+");
              return "";
            }
            if (asdf !== null) {
              // console.log(`for asdf: ${asdf}`);
              const tempDate = new Date(asdf * 1000);
              // console.log(`tempDate: ${tempDate}`);

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

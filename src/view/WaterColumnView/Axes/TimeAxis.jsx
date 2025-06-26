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

// const fetchFoo = (amount) => {
//   return new Promise(resolve =>
//       setTimeout(() => {
//         resolve({ data: amount })
//       }, 1000),
//     );
// }

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
    selected.selectAll("*").remove();

    selected
      .attr("width", width - 1)
      .attr("height", height)
      .append("g")
      .call(xAxis
        .tickFormat((d) => {
            // return `${d} sec`;
            
            if(timeArray !== null && d !== null) {
              const asdf = timeMinIndex + d; // d is the offset from left side
              if(asdf < 0) {
                return ''; // d3.isoFormat(new Date())
              }
              return d3.isoFormat(new Date(timeArray[asdf]*1000));
            } else {
              return '';
            }
          })
      );
  }, []);

  useEffect(() => {
    selected
      .transition()
      .duration(500)
      .call(
        xAxis
          .tickFormat((d) => {
            // return `${d} sec`;
            
            if(timeArray !== null && d !== null) {
              const asdf = d - timeMinIndex;
              if(asdf < 0) {
                return ''; // d3.isoFormat(new Date())
              }
              return d3.isoFormat(new Date(timeArray[asdf]*1000));
            } else {
              return '';
            }
          })
      );
  }, [domain, ref, selected, size, timeArray, timeMinIndex, x, xAxis]);

  return (
    <div ref={ref} className="timeAxis">
      <svg id="timeAxisLabel"></svg>
    </div>
  );
};

export default TimeAxis;

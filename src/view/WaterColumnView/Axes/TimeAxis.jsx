//////////////////////////////////////////////////////////////////////////////////
import {
  useLayoutEffect,
  useEffect,
  useRef,
  useState,
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
  const [size, setSize] = useState([0, 0]);
  
  useLayoutEffect(() => { // update on window resize
    function updateSize() {
      console.info('updating size');
      setSize([window.innerWidth, window.innerHeight]);
    }
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  useEffect(() => {
    d3.select("#timeAxisLabel").selectAll("*").remove();

    const width = ref.current ? ref.current.offsetWidth : 0;
    const height = ref.current ? ref.current.offsetHeight : 0;

    const x = d3
      .scaleLinear()
      .domain([timeMinIndex, timeMaxIndex])
      .range([0, width]);

    d3.select("#timeAxisLabel")
      .attr("width", width - 1)
      .attr("height", height)
      .append("g")
      .call(d3.axisBottom(x));
  }, []);

  useEffect(() => {
    const width = ref.current ? ref.current.offsetWidth : 0;
    const height = ref.current ? ref.current.offsetHeight : 0;
    console.log(`time: width: ${width}, height: ${height}`);

    const x = d3
      .scaleLinear()
      .domain([timeMinIndex, timeMaxIndex])
      .range([0, width - 1]);

    d3.select("#timeAxisLabel")
      .transition()
      .duration(500)
      .call(d3.axisBottom(x));

    // const width2 = ref.current ? ref.current.offsetWidth : 0;
    // const height2 = ref.current ? ref.current.offsetHeight : 0;
    // console.log(`width2: ${width2}, height™: ${height2}`)
  }, [timeMinIndex, timeMaxIndex, ref, size]);

  return (
    <div ref={ref} className="timeAxis">
      <svg id="timeAxisLabel"></svg>
    </div>
  );
};

export default TimeAxis;

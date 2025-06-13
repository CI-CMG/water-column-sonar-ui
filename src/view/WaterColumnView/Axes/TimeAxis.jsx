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
  
  useLayoutEffect(() => { // update when the window resizes
    console.log('start uselayouteffect')
    function updateSize() {
      console.info('updating size');
      setSize([window.innerWidth, window.innerHeight]);
    }
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const selected = d3.select("#timeAxisLabel");

  useEffect(() => {
    console.log('initialize before')  
    selected.selectAll("*").remove();

    const width = ref.current ? ref.current.offsetWidth : 0;
    const height = ref.current ? ref.current.offsetHeight : 0;

    const x = d3
      .scaleLinear()
      .domain([timeMinIndex, timeMaxIndex])
      .range([0, width]);

    selected
      .attr("width", width - 1)
      .attr("height", height)
      .append("g")
      // .attr("transform", `translate(0, 1)`)
      .call(d3.axisBottom(x));
    
    console.log('initialize after');
  }, []);

  useEffect(() => { // handles the refresh of the axis
    console.log('refresh before');
    console.log(ref);
    const width = ref.current ? ref.current.offsetWidth : 0;
    // const height = ref.current ? ref.current.offsetHeight : 0;
    // console.log(`time: width: ${width}, height: ${height}`);

    console.log('refresh before1');
    const x = d3
      .scaleLinear()
      .domain([timeMinIndex, timeMaxIndex])
      .range([0, width - 1]);

    console.log('refresh before2');
    selected
      .transition()
      .duration(500)
      // .attr("transform", `translate(0, 1)`)
      .call(d3.axisBottom(x));
    
    console.log('refresh after');

  }, [timeMinIndex, timeMaxIndex, ref, size]);

  return (
    <div ref={ref} className="timeAxis">
      <svg id="timeAxisLabel"></svg>
    </div>
  );
};

export default TimeAxis;

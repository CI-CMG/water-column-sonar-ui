//////////////////////////////////////////////////////////////////////////////////
import {
  useLayoutEffect,
  useEffect,
  useRef,
  useState,
} from "react";
import * as d3 from "d3";
import {
  selectDepthMinIndex,
  selectDepthMaxIndex,
} from "../../../reducers/store/storeSlice.ts";
import { useAppSelector } from "../../../app/hooks.ts";

//////////////////////////////////////////////////////////////////////////////////
const DepthAxis = () => {
  const ref = useRef(null);
  const depthMinIndex = useAppSelector(selectDepthMinIndex);
  const depthMaxIndex = useAppSelector(selectDepthMaxIndex);
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
    d3.select("#depthAxisLabel").selectAll("*").remove();

    const width = ref.current ? ref.current.offsetWidth : 0;
    const height = ref.current ? ref.current.offsetHeight : 0;
    console.log(`depth: width: ${width}, height: ${height}`);

    const y = d3
      .scaleLinear()
      .domain([depthMinIndex, depthMaxIndex])
      .range([0, height]);

    d3.select("#depthAxisLabel")
      .attr("width", width)
      .attr("height", height - 1)
      // .attr("viewBox", [0, 0, width, height])
      .append("g")
      // .attr("transform", `translate(0, 0)`)
      .call(d3.axisRight(y));
  }, []);

  useEffect(() => {
    const width = ref.current ? ref.current.offsetWidth : 0;
    const height = ref.current ? ref.current.offsetHeight : 0;
    console.log(`depth: width: ${width}, height: ${height}`);

    const y = d3
      .scaleLinear()
      .domain([depthMinIndex, depthMaxIndex])
      .range([0, height - 1]);

    d3.select("#depthAxisLabel")
      .transition()
      .duration(500)
      // .attr("transform", `translate(0, 0)`)
      .call(d3.axisRight(y));
  }, [depthMinIndex, depthMaxIndex, ref, size]);

  return (
    <div ref={ref} className="depthAxis">
      <svg id="depthAxisLabel"></svg>
    </div>
  );
};

export default DepthAxis;

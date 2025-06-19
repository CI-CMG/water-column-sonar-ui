//////////////////////////////////////////////////////////////////////////////////
import { useLayoutEffect, useEffect, useRef, useState, useMemo } from "react";
import {
  // useAppDispatch,
  useAppSelector,
} from "../../../app/hooks.ts";
import * as d3 from "d3";
import {
  // selectShip,
  // selectCruise,
  // selectSensor,
  //
  selectDepthMinIndex,
  selectDepthMaxIndex,
  selectDepthArray,
  //
  // timeAsync,
  // depthArrayAsync,
} from "../../../reducers/store/storeSlice.ts";

//////////////////////////////////////////////////////////////////////////////////
const DepthAxis = () => {
  const depthArray = useAppSelector(selectDepthArray);

  const ref = useRef(null);
  const [size, setSize] = useState([0, 0]);
  const depthMinIndex = useAppSelector(selectDepthMinIndex); // TODO: min/max will be replaced by the array
  const depthMaxIndex = useAppSelector(selectDepthMaxIndex);
  const height = ref.current ? ref.current.offsetHeight : 0;
  const width = ref.current ? ref.current.offsetWidth : 0;

  const domain = useMemo(() => {
    return [depthMinIndex, depthMaxIndex]; // read all depths once and then format from 
  }, [depthMinIndex, depthMaxIndex]);      // that 

  const range = useMemo(() => {
    return [0, height - 1];
  }, [height]);
  const selected = d3.select("#depthAxisLabel");

  useLayoutEffect(() => {
    // updates component on window resize
    const updateSize = () => {
      setSize([window.innerWidth, window.innerHeight]);
    };
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // Array.from({length: 101 - 10 + 1}, (_, a) => a + 10)
  // domain=[-53, 560], range=[0, 612]
  const y = d3.scaleLinear().domain(domain).range(range); //.unknown(null);
  const yAxis = d3.axisRight(y); //.ticks(4); // .tickFormat(formatMeters);

  useEffect(() => { // on updates to the axes
    selected.selectAll("*").remove();

    selected
      .attr("width", width)
      .attr("height", height - 1)
      .append("g")
      .call(yAxis);
  }, []);

  useEffect(() => {
    // console.log(depthArray.length);
    // const foo = ['a', 'b', 'c' , 'd'];
    selected
      .transition()
      .duration(500)
      .call(
        yAxis
          // .tickFormat(function(d, i) {
          //   return d + ": " + depthArray[i] + ' m';
          // })
      );
  }, [domain, ref, selected, size, y, depthArray, yAxis]);

  return (
    <div ref={ref} className="depthAxis">
      <svg id="depthAxisLabel" />
    </div>
  );
};

export default DepthAxis;

//////////////////////////////////////////////////////////////////////////////////
import {
  useEffect,
} from "react";
import PropTypes from "prop-types";
import * as d3 from 'd3'
import { range } from 'd3-array';
import { scaleOrdinal } from 'd3-scale';
import WaterColumnColors from "./WaterColumnColors.jsx";
import {
  selectSvMin,
  selectSvMax,
} from "../../reducers/store/storeSlice.js";
import { useAppSelector } from "../../app/hooks.js";


const handleMouseOut = () => {
  d3.select('#colorPaletteValue').text('...');
}

//////////////////////////////////////////////////////////////////////////////////
const ColorMap = ({
  selectedColorPalette,
}) => {
  const minSv = useAppSelector(selectSvMin);
  const maxSv = useAppSelector(selectSvMax);

  // const [isLoading, setLoading] = useState(true);

  // https://2019.wattenberger.com/blog/react-and-d3
  const width = 350;
  const height = 30;

  useEffect(() => { // https://github.com/CI-CMG/echofish-ui/blob/master/src/main/frontend/src/components/waterColumn/ColorPaletteValues.vue
    const handleMouseOver = (d) => {
      const miSv = minSv;
      const maSv = maxSv;

      const palette = WaterColumnColors[selectedColorPalette]; // this.colorPalettes[this.selectedPalette];
      const printValLeft = ((maSv - miSv) / palette.length) * d.currentTarget.__data__ + miSv;
      const printValRight = printValLeft + (maSv - miSv) / palette.length;
      d3.select('#colorPaletteValue')
        .html(
          `Highlighted Sv Range: ${String(printValLeft.toFixed(2))} to ${String(printValRight.toFixed(2))} dB`
        );
    }

    const palette = WaterColumnColors[selectedColorPalette];
    console.log(palette);

    const colorValueArray = d3.range(
      minSv,
      maxSv,
      (maxSv - minSv) / palette.length,
    );
    const colorScaleFunction = scaleOrdinal().domain(colorValueArray).range(palette);

    d3.select('#colorPalette').selectAll('*').remove();

    const svg = d3.select('#colorPalette')
      .append('svg')
      .attr('height', height)
      .attr('width', width);

    svg.selectAll('.bars')
      .data(range(palette.length), d => d)
      .enter()
      .append('rect')
      .attr('class', 'bars')
      .attr('x', i => ((i * width) / palette.length))
      .attr('y', 0)
      .attr('width', width / palette.length)
      .attr('height', height)
      .style('fill', d => colorScaleFunction(d));

    svg.selectAll('rect')
      .on('mouseover', (d) => handleMouseOver(d)) // TODO: leaving off here with problem getting minSv???
      .on('mouseout', handleMouseOut);

  }, [selectedColorPalette, minSv, maxSv]);

  // TODO: useInterval

  return (
    <div id="colorMap">
      <div>
        <span id="colorPalette"/>
      </div>
      
      <span id="colorPaletteValue">...</span>
    </div>
  );
};

export default ColorMap;

ColorMap.propTypes = {
  selectedColorPalette: PropTypes.instanceOf(String).isRequired,
};

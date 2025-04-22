import {
  useEffect,
  useState,
} from 'react';
import L from 'leaflet';
import { useLeafletContext } from '@react-leaflet/core';
import { scaleLinear, scaleThreshold } from 'd3-scale';
import * as d3 from 'd3';
import { useSearchParams } from 'react-router';
import { color } from 'd3-color';
import { get } from "@zarrita/ndarray"; // https://www.npmjs.com/package/zarrita
import { slice } from "zarrita";
import { WaterColumnColors } from './WaterColumnColors.jsx';
import PropTypes from 'prop-types';


// const palette = WaterColumnColors['viridis'];

const minDB = -150; // min-db
const maxDB = 10; // max-db
const TILE_SIZE = 512; // TODO: need to get from the zarr store!

function drawTile(coordinateKey, canvas, svArray, selectedFrequency, paletteName) {
    const palette = WaterColumnColors[paletteName]

    const parts = coordinateKey.split('_');
    const x = Number.parseInt(parts[0], 10);
    const y = Number.parseInt(parts[1], 10);
    const z = Number.parseInt(parts[2], 10);

    const ctx = canvas.getContext('2d');

    if (ctx) {
      const dataDimension = svArray.shape;
      const maxBoundsY = Math.abs(dataDimension[0]);
      const maxBoundsX = Math.abs(dataDimension[1]);

      const indicesLeft = TILE_SIZE * x;
      const indicesRight = Math.min(TILE_SIZE * x + TILE_SIZE, maxBoundsX);
      const indicesTop = TILE_SIZE * y;
      const indicesBottom = Math.min(TILE_SIZE * y + TILE_SIZE, maxBoundsY);

      const greyMapFunc = scaleLinear().domain([minDB, maxDB]).range([0, 255]).clamp(true);
      const colorfunc = scaleThreshold()
        .domain(d3.range(0, 255, 255 / palette.length))
        .range(palette);

      const maxBoundsValue = [[-1 * Math.ceil(dataDimension[0] / TILE_SIZE) * TILE_SIZE, 0], [0, Math.ceil(dataDimension[1] / TILE_SIZE) * TILE_SIZE]];
      const maxTileBoundsX = Math.abs(maxBoundsValue[1][1]) / TILE_SIZE;
      const maxTileBoundsY = Math.abs(maxBoundsValue[0][0]) / TILE_SIZE;

      // Diagnostic for getting X-Y-Z location of tiles
      if (y >= maxTileBoundsY || y < 0 || x < 0 || x >= maxTileBoundsX) {
        ctx.font = '12px serif';
        ctx.fillStyle = '#BEBEBE';
        ctx.fillText(`{${x}, ${y}, ${z}}`, 20, 40);
        return;
      }

      // TODO: make more like get(latitudePromise, [zarr.slice(2, 4)]);
      get(svArray, [slice(indicesTop, indicesBottom), slice(indicesLeft, indicesRight), selectedFrequency]) // selectedF is from url
        .then((d1) => {
          const d = d1; // as RawArray;
          const [height, width] = d.shape;
          const uintc8 = new Uint8ClampedArray(d.data.length * 4).fill(255);

          for (let i = 0; i < d.data.length; i++) {
            if (!Number.isNaN(d.data[i]) && d.data[i] > minDB && d.data[i] < maxDB) {
              const pixelColor = color(colorfunc(greyMapFunc(d.data[i])).substring(0, 7));
              uintc8[i * 4] = pixelColor.r;
              uintc8[i * 4 + 1] = pixelColor.g;
              uintc8[i * 4 + 2] = pixelColor.b;
            }
          }
          ctx.putImageData(new ImageData(uintc8, width, height), 0, 0);
        });
    }
}

/* -------- Leaflet Layer that Plots Sv Data ---------- */
const CustomLayer = ({
  svArray,
  selectedFrequency, // passed in value is actual frequency value e.g. "18000"
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedColorMap, setSelectedColorMap] = useState(Object.keys(WaterColumnColors).map((x, y) => {
    return {'key': y, 'value': x}; 
  })[searchParams.get('color')]);
  // const [frequencyIndex, setFrequencyIndex] = useState(0);
  // useEffect(() => {
  //   setFrequencyIndex(Number(searchParams.get('frequency')));
  // }, [searchParams]);
  // const frequencyIndex = frequencyArray[selectedFrequency]; // 18 kHz to '1'
  const { layerContainer } = useLeafletContext();

  const createLeafletElement = () => {
    const Grid = L.GridLayer.extend({
      getTileSize: function() {
        return new L.Point(TILE_SIZE, TILE_SIZE);
      },

      createTile: function (coords) {
          const coordinateKey = `${coords.x}_${coords.y}_${coords.z}`;
          const canvas = document.createElement('canvas');
          var tileSize = this.getTileSize();
          canvas.setAttribute('width', tileSize.x);
          canvas.setAttribute('height', tileSize.y);
          drawTile(coordinateKey, canvas, svArray, selectedFrequency, selectedColorMap.value); // TODO: pass in array

          return canvas;
      }
    });
    return new Grid();
  };

  useEffect(() => {
    if (svArray !== null) {
      layerContainer.addLayer(createLeafletElement());
    }
  }, [searchParams]); // frequencyIndex

};

export default CustomLayer;

CustomLayer.propTypes = {
    svArray: PropTypes.instanceOf(Object), // Promise
    selectedFrequency: PropTypes.instanceOf(Number)
};

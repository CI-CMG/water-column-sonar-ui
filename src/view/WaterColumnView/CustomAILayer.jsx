import {
  useEffect,
} from 'react';
import L from 'leaflet';
import {
  useLeafletContext,
} from '@react-leaflet/core';
import { scaleLinear, scaleThreshold } from 'd3-scale';
import * as d3 from 'd3';
import { color } from 'd3-color';
import { WaterColumnColors } from './WaterColumnColors.jsx';
import {
  selectStoreAttributes,
  selectStoreShape,
  selectCruise,
  selectFrequencyIndex,
  selectColorIndex,
} from "../../reducers/store/storeSlice.ts";
import { useAppSelector } from "../../app/hooks.ts";
import { fetchAISvTile } from "../../reducers/store/storeAPI.ts"


function drawTile(coords, canvas, colorIndex, tileSize, storeShape, minDB, maxDB, selectFrequency, cruise) {
  // const palette = WaterColumnColors[Object.keys(WaterColumnColors)[colorIndex]];
  const palette = WaterColumnColors['blueRed'];
  const ctx = canvas.getContext('2d');

  if (ctx) {
    const dataDimension = storeShape; // [2538, 4228924, 4]; // TODO: here need to get the sv dimension
    const maxBoundsY = Math.abs(dataDimension[0]);
    const maxBoundsX = Math.abs(dataDimension[1]);

    const indicesLeft = tileSize * coords.x;
    const indicesRight = Math.min(tileSize * coords.x + tileSize, maxBoundsX);
    const indicesTop = tileSize * coords.y;
    const indicesBottom = Math.min(tileSize * coords.y + tileSize, maxBoundsY);

    const greyMapFunc = scaleLinear()
      .domain([minDB, maxDB])
      .range([0, 255])
      .clamp(true);
    const colorfunc = scaleThreshold()
      .domain(d3.range(0, 255, 255 / palette.length))
      .range(palette)

    // const maxBoundsValue = [[-1 * Math.ceil(dataDimension[0] / tileSize) * tileSize, 0], [0, Math.ceil(dataDimension[1] / tileSize) * tileSize]];
    // const maxTileBoundsX = Math.abs(maxBoundsValue[1][1]) / tileSize;
    // const maxTileBoundsY = Math.abs(maxBoundsValue[0][0]) / tileSize;

    // Diagnostic for getting X-Y-Z location of tiles
    // if (coords.y >= maxTileBoundsY || coords.y < 0 || coords.x < 0 || coords.x >= maxTileBoundsX) {
    ctx.font = '24px serif';
    ctx.fillStyle = '#ff0fdf';
    ctx.fillText(`{${coords.x}, ${coords.y}, ${coords.z}}`, 20, 40);
    // return;
    // }

    fetchAISvTile('Henry_B._Bigelow', cruise, 'EK60', indicesTop, indicesBottom, indicesLeft, indicesRight, selectFrequency)
      .then((d1) => {
        const d = d1; // as RawArray;
        const [height, width] = d.shape;
        const uintc8 = new Uint8ClampedArray(4 * d.data.length).fill(255);

        // TODO: need to make background transparent
        for (let i = 0; i < d.data.length; i++) {
          if (!Number.isNaN(d.data[i]) && d.data[i] > minDB && d.data[i] < maxDB) {
            const pixelColor = color(colorfunc(greyMapFunc(d.data[i])).substring(0, 7));
            uintc8[i * 4] = pixelColor.r;
            uintc8[i * 4 + 1] = pixelColor.g;
            uintc8[i * 4 + 2] = pixelColor.b;
          } else {
            // set to transparent
            // uintc8[i * 4] = pixelColor.r;
            // uintc8[i * 4 + 1] = pixelColor.g;
            uintc8[i * 4 + 2] = 255;
          }
        }

        // ctx.globalCompositeOperation = "source-over";
        ctx.putImageData(new ImageData(uintc8, width, height), 0, 0);
        
        // TODO: need to make background transparent

        return;
      });
  }
  return;
}

/* For Visualizing Alex's AI Results */
const CustomAILayer = () => {
  const context = useLeafletContext();

  const attributes = useAppSelector(selectStoreAttributes);
  const storeShape = useAppSelector(selectStoreShape);
  const cruise = useAppSelector(selectCruise);
  
  const frequencyIndex = useAppSelector(selectFrequencyIndex);
  const colorIndex = useAppSelector(selectColorIndex);

  useEffect(() => {
    const container = context.layerContainer || context.map;

    const createDataLayer = () => {
      const GridLayerExtended = L.GridLayer.extend({
        getTileSize: function() {
           return new L.Point(attributes.tile_size, attributes.tile_size);
        },

        createTile: (coords, done) => {
          let error;
          let tile = L.DomUtil.create('canvas', 'leaflet-tile');
          tile.setAttribute('width', container.options.tileSize);
          tile.setAttribute('height', container.options.tileSize);          
          drawTile(coords, tile, colorIndex, attributes.tile_size, storeShape, 0, 40, frequencyIndex, cruise);
          setTimeout(() => { done(error, tile) }, 10);
          return tile;
        },
      });

      return new GridLayerExtended({
        // opacity: 0.75, // Opacity of the tiles. Can be used in the createTile() function.
        opacity: 0.90,
        updateInterval: 25, // Tiles will not update more than once every updateInterval milliseconds when panning
        className: "echoFishGridLayer",
      });
    };

    const dataLayer = createDataLayer();
    // console.log('creating new layer');
    container.addLayer(dataLayer);

    return () => {
      // console.log(`removing dataLayer, freq: ${frequencyIndex}`)
      container.removeLayer(dataLayer);
    };

  }, [attributes, storeShape, context, colorIndex, frequencyIndex, cruise]);

  return null;
};

export default CustomAILayer;

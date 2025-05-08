import {
  useEffect,
  useState,
} from 'react';
import L from 'leaflet';
import {
  // createElementHook,
  // createElementObject,
  // useLayerLifecycle,
  useLeafletContext,
} from '@react-leaflet/core';
import { scaleLinear, scaleThreshold } from 'd3-scale';
import * as d3 from 'd3';
import { useSearchParams } from 'react-router';
import { color } from 'd3-color';
import { WaterColumnColors } from './WaterColumnColors.jsx';
import {
  selectStoreAttributes,
  selectStoreShape,
  selectCruise,
  selectSvMin,
  selectSvMax,
  selectFrequencyIndex,
} from ".././../reducers/store/storeSlice.ts";
import { useAppSelector } from "../../app/hooks";
import { fetchSvTile } from "../../reducers/store/storeAPI.ts"


function drawTile(coords, canvas, paletteName, tileSize, storeShape, minDB, maxDB, selectFrequency, cruise) {
  // this guy needs access to the svArray, move into function
  const palette = WaterColumnColors[paletteName]
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

    const maxBoundsValue = [[-1 * Math.ceil(dataDimension[0] / tileSize) * tileSize, 0], [0, Math.ceil(dataDimension[1] / tileSize) * tileSize]];
    const maxTileBoundsX = Math.abs(maxBoundsValue[1][1]) / tileSize;
    const maxTileBoundsY = Math.abs(maxBoundsValue[0][0]) / tileSize;

    // Diagnostic for getting X-Y-Z location of tiles
    if (coords.y >= maxTileBoundsY || coords.y < 0 || coords.x < 0 || coords.x >= maxTileBoundsX) {
      ctx.font = '12px serif';
      ctx.fillStyle = '#BEBEBE';
      ctx.fillText(`{${coords.x}, ${coords.y}, ${coords.z}}`, 20, 40);
      return;
    }

    // ctx.font = '12px serif';
    // ctx.fillStyle = '#0000FF';
    // ctx.fillText(`{${x}, ${y}, ${z}}`, 20, 40);
    // ctx.fillText(`{${indicesLeft}, ${indicesRight}, ${indicesTop}, ${indicesBottom}}`, 20, 60);

    // TODO: get the cruise
    fetchSvTile('Henry_B._Bigelow', cruise, 'EK60', indicesTop, indicesBottom, indicesLeft, indicesRight, selectFrequency)
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
        return; // This sped things up a lot!
      });
  }
  return;
}

const CustomLayer = () => {
  const context = useLeafletContext();

  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedColorMap, setSelectedColorMap] = useState(Object.keys(WaterColumnColors).map((x, y) => {
    return {'key': y, 'value': x}; 
  })[searchParams.get('color')]); // getting from url, TODO: should get from redux

  const attributes = useAppSelector(selectStoreAttributes);
  const storeShape = useAppSelector(selectStoreShape);
  const cruise = useAppSelector(selectCruise);
  const svMin = useAppSelector(selectSvMin);
  const svMax = useAppSelector(selectSvMax);
  const frequencyIndex = useAppSelector(selectFrequencyIndex);

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
          
          drawTile(coords, tile, selectedColorMap.value, attributes.tile_size, storeShape, svMin, svMax, frequencyIndex, cruise);

          setTimeout(() => { done(error, tile) }, 10);
  
          return tile;
        },

        // redraw(): () => { // where does this go?!
      });

      return new GridLayerExtended({
        opacity: 0.95, // Opacity of the tiles. Can be used in the createTile() function.
        updateInterval: 25, // Tiles will not update more than once every updateInterval milliseconds when panning
        className: "echoFishGridLayer",
      });
    };
    
    // wait to start accessing the store
    if (attributes && storeShape) {
      console.log('creating new layer');
      container.addLayer(createDataLayer());
    }

    return () => {
      console.log(`removed custom layer: ${frequencyIndex}`)
      container.removeLayer(createDataLayer());
    };

  }, [attributes, storeShape, context, selectedColorMap.value, svMin, svMax, frequencyIndex, cruise]);

  return null;
};

export default CustomLayer;

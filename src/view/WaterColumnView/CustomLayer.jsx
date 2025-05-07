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


function drawTile(coordinateKey, canvas, paletteName, tileSize, storeShape, minDB, maxDB, selectFrequency, cruise) {
  // this guy needs access to the svArray, move into function
  const palette = WaterColumnColors[paletteName]

  const parts = coordinateKey.split('_');
  const x = Number.parseInt(parts[0], 10);
  const y = Number.parseInt(parts[1], 10);
  const z = Number.parseInt(parts[2], 10);

  const ctx = canvas.getContext('2d');

  if (ctx) {
    const dataDimension = storeShape; // [2538, 4228924, 4]; // TODO: here need to get the sv dimension
    const maxBoundsY = Math.abs(dataDimension[0]);
    const maxBoundsX = Math.abs(dataDimension[1]);

    const indicesLeft = tileSize * x;
    const indicesRight = Math.min(tileSize * x + tileSize, maxBoundsX);
    const indicesTop = tileSize * y;
    const indicesBottom = Math.min(tileSize * y + tileSize, maxBoundsY);

    const greyMapFunc = scaleLinear().domain([minDB, maxDB]).range([0, 255]).clamp(true);
    const colorfunc = scaleThreshold()
      .domain(d3.range(0, 255, 255 / palette.length))
      .range(palette);

    const maxBoundsValue = [[-1 * Math.ceil(dataDimension[0] / tileSize) * tileSize, 0], [0, Math.ceil(dataDimension[1] / tileSize) * tileSize]];
    const maxTileBoundsX = Math.abs(maxBoundsValue[1][1]) / tileSize;
    const maxTileBoundsY = Math.abs(maxBoundsValue[0][0]) / tileSize;

    // Diagnostic for getting X-Y-Z location of tiles
    if (y >= maxTileBoundsY || y < 0 || x < 0 || x >= maxTileBoundsX) {
      ctx.font = '12px serif';
      ctx.fillStyle = '#BEBEBE';
      ctx.fillText(`{${x}, ${y}, ${z}}`, 20, 40);
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

/* -------- Leaflet Layer that Plots Sv Data ---------- */
const CustomLayer = () => {

  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedColorMap, setSelectedColorMap] = useState(Object.keys(WaterColumnColors).map((x, y) => {
    return {'key': y, 'value': x}; 
  })[searchParams.get('color')]); // getting from url, should get from redux

  // const [initialized, setInitialized] = useState(false);

  const attributes = useAppSelector(selectStoreAttributes);
  const storeShape = useAppSelector(selectStoreShape);
  const cruise = useAppSelector(selectCruise);
  const svMin = useAppSelector(selectSvMin);
  const svMax = useAppSelector(selectSvMax);
  const frequencyIndex = useAppSelector(selectFrequencyIndex);

  const context = useLeafletContext();

  useEffect(() => {
    const createLeafletElement = () => {
      const Grid = L.GridLayer.extend({
        getTileSize: function() {
          return new L.Point(attributes.tile_size, attributes.tile_size);
        },
  
        createTile: function (coords) {
          // for each tile dispatch a request with given x-y-z coordinates
          const coordinateKey = `${coords.x}_${coords.y}_${coords.z}`;
          
          var tileSize = this.getTileSize();
          
          const canvas = document.createElement('canvas');
          canvas.setAttribute('width', tileSize.x);
          canvas.setAttribute('height', tileSize.y);
          
          drawTile(
            coordinateKey,
            canvas,
            selectedColorMap.value,
            attributes.tile_size, // TODO: would be better to get tileSize from the chunk scheme than from metadata
            storeShape,
            svMin,
            svMax,
            frequencyIndex,
            cruise
          );
  
          return canvas;
        }
      });

      return new Grid();
    };
    
    // wait to start accessing the store
    if (attributes && storeShape) { // && !initialized) {
      console.log('creating new layer');
      // setInitialized(true); // this fixes multiple layers, but doesnt allow updates when buttons change
      // layerContainer.eachLayer(function (layer) { // removes old layers
      //   layerContainer.removeLayer(layer);
      // });
      const container = context.layerContainer || context.map;
      container.addLayer(createLeafletElement());
    }

    return () => {
      console.log(`removed custom layer: ${frequencyIndex}`)
    };

  }, [attributes, storeShape, context, selectedColorMap.value, svMin, svMax, frequencyIndex, cruise]);
};

export default CustomLayer;

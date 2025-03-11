import { useEffect } from 'react';
import L from 'leaflet';
import { useLeafletContext } from '@react-leaflet/core';

const CustomLayer = () => {
    const { layerContainer } = useLeafletContext();

    const createLeafletElement = () => {
      const Grid = L.GridLayer.extend({
        createTile: function (coords) {
        //   const tile = L.DomUtil.create("canvas", "leaflet-tile");
        //   tile.style.outline = "1px solid black";
        //   return tile;

            var tile = document.createElement('div');
            tile.innerHTML = [coords.x, coords.y, coords.z].join(', ');
            tile.style.outline = '1px solid green';
            return tile;
        }
      });
      return new Grid({ tileSize: 100 });
    };

    useEffect(() => {
      layerContainer.addLayer(createLeafletElement());
    }, []);

    return null;
};

export default CustomLayer;

// // const gridLayer = new L.GridLayer.extend({})
// L.GridLayer.DebugCoords = L.GridLayer.extend({
//   createTile: function (coords) {
//       var tile = document.createElement('div');
//       tile.innerHTML = [coords.x, coords.y, coords.z].join(', ');
//       tile.style.outline = '1px solid red';
//       return tile;
//   }
// });
// L.gridLayer.debugCoords = function(opts) {
//     return new L.GridLayer.DebugCoords(opts);
// };
// container.addLayer( L.gridLayer.debugCoords() );

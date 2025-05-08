import {
  useEffect,
} from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useSearchParams } from 'react-router';
import WaterColumnInformationPanel from "./WaterColumnInformationPanel";
import WaterColumnVisualization from "./WaterColumnVisualization";
import {
  updateShip,
  updateCruise,
  updateSensor,
  selectShip,
  selectCruise,
  selectSensor,
  //
  selectDepthIndex,
  selectTimeIndex,
  selectFrequencyIndex,
  selectStoreAttributes,
  selectStoreShape,
  //
  storeAttributesAsync,
  storeShapeAsync,
  frequenciesAsync,
  latitudeAsync,
  longitudeAsync,
  timeAsync,
  depthAsync,
  bottomAsync,
  svAsync,
  ////
  // updateDepthIndex,
  updateTimeIndex,
  updateFrequencyIndex,
} from "../../reducers/store/storeSlice";

/* -------- Main View of Water Column Page ---------- */
export default function WaterColumnView() {
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const initialTimeIndex = Number(searchParams.get('time'));
  const initialFrequencyIndex = Number(searchParams.get('frequency'));

  const ship = useAppSelector(selectShip);
  const cruise = useAppSelector(selectCruise);
  const sensor = useAppSelector(selectSensor);
  const attributes = useAppSelector(selectStoreAttributes);
  const storeShape = useAppSelector(selectStoreShape);
  const indexDepth = useAppSelector(selectDepthIndex);
  const timeIndex = useAppSelector(selectTimeIndex); // we are opening the page for the first time
  const frequencyIndex = useAppSelector(selectFrequencyIndex);

  useEffect(() => { // initialize query parameters:
    // /water-column?ship=Henry_B._Bigelow&cruise=HB1906&sensor=EK60&frequency=0&color=2&time=1024
    if(ship === null){
      dispatch(updateShip(searchParams.get('ship'))); // store in redux
    }
    if(cruise === null){
      dispatch(updateCruise(searchParams.get('cruise')));
    }
    if(sensor === null) {
      dispatch(updateSensor(searchParams.get('sensor')));
    }
    if(timeIndex === null) {
      // console.log(`intialTimeIndex: ${initialTimeIndex}`);
      dispatch(updateTimeIndex(initialTimeIndex));
    }
    if(frequencyIndex === null) {
      dispatch(updateFrequencyIndex(initialFrequencyIndex));
    }
    
    if(ship !== null && cruise !== null && sensor !== null) {
      dispatch(storeAttributesAsync({ ship, cruise, sensor })); // don't need to update each time
      dispatch(storeShapeAsync({ ship, cruise, sensor }));
      dispatch(frequenciesAsync({ ship, cruise, sensor })); // don't need to update each time
    }
  }, [dispatch, searchParams, ship, cruise, sensor, timeIndex, initialTimeIndex, initialFrequencyIndex, frequencyIndex]);

  useEffect(() => { // make async requests for all infomation panel values
    if(ship && cruise && sensor && frequencyIndex !== null) {
      dispatch(latitudeAsync({ ship, cruise, sensor, indexTime: timeIndex }));
      dispatch(longitudeAsync({ ship, cruise, sensor, indexTime: timeIndex }));
      dispatch(timeAsync({ ship, cruise, sensor, indexTime: timeIndex }));
      dispatch(depthAsync({ ship, cruise, sensor, indexDepth: indexDepth }));
      dispatch(bottomAsync({ ship, cruise, sensor, indexTime: timeIndex }));
      dispatch(svAsync({
        ship,
        cruise,
        sensor,
        indexDepth: indexDepth, // TODO: wire this up to mouse click
        indexTime: timeIndex,
        indexFrequency: frequencyIndex,
      }));
    }
  }, [dispatch, searchParams, ship, cruise, sensor, frequencyIndex, timeIndex, indexDepth]);

  return (
    <div className="WaterColumnView">
      {
        (storeShape !== null && attributes !== null && frequencyIndex !== null)
        ?
          <>
            <WaterColumnVisualization
              tileSize={attributes.tile_size}
              storeShape={storeShape}
              initialTimeIndex={initialTimeIndex}
            />
            <WaterColumnInformationPanel />
          </>
        :
          <></>
      }
    </div>
  );
}
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useSearchParams } from "react-router";
import WaterColumnInformationPanel from "./InformationPanel/WaterColumnInformationPanel";
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
  selectColorIndex,
  //
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
  speedAsync,
  distanceAsync,
  //
  updateTimeIndex,
  updateFrequencyIndex,
  updateColorIndex,
} from "../../reducers/store/storeSlice";

/* -------- Main View of Water Column Page ---------- */
export default function WaterColumnView() {
  useEffect(() => {
    document.title = `Water Column`;
  }, []);

  const [loadedCruiseInfo, setLoadedCruiseInfo] = useState(false);

  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const initialTimeIndex = Number(searchParams.get("time"));
  const initialFrequencyIndex = Number(searchParams.get("frequency"));
  const initialColorIndex = Number(searchParams.get("color"));

  const ship = useAppSelector(selectShip);
  const cruise = useAppSelector(selectCruise);
  const sensor = useAppSelector(selectSensor);
  const attributes = useAppSelector(selectStoreAttributes);
  const storeShape = useAppSelector(selectStoreShape);
  const indexDepth = useAppSelector(selectDepthIndex);
  const indexTime = useAppSelector(selectTimeIndex); // we are opening the page for the first time
  const indexFrequency = useAppSelector(selectFrequencyIndex);
  const indexColor = useAppSelector(selectColorIndex);

  useEffect(() => {
    // initialize query parameters:
    // /water-column?ship=Henry_B._Bigelow&cruise=HB1906&sensor=EK60&frequency=0&color=2&time=1024
    if (ship === null) {
      dispatch(updateShip(searchParams.get("ship"))); // store in redux
    }
    if (cruise === null) {
      dispatch(updateCruise(searchParams.get("cruise")));
    }
    if (sensor === null) {
      dispatch(updateSensor(searchParams.get("sensor")));
    }
    if (indexTime === null) {
      dispatch(updateTimeIndex(initialTimeIndex));
    }
    if (indexFrequency === null) {
      dispatch(updateFrequencyIndex(initialFrequencyIndex));
    }
    if (indexColor === null) {
      dispatch(updateColorIndex(initialColorIndex));
    }

    if (
      ship !== null &&
      cruise !== null &&
      sensor !== null &&
      !loadedCruiseInfo
    ) {
      setLoadedCruiseInfo(true); // only need to call once per cruise
      dispatch(storeAttributesAsync({ ship, cruise, sensor }));
      dispatch(storeShapeAsync({ ship, cruise, sensor }));
      dispatch(frequenciesAsync({ ship, cruise, sensor }));
    }
  }, [
    dispatch,
    searchParams,
    ship,
    cruise,
    sensor,
    initialTimeIndex,
    initialFrequencyIndex,
    initialColorIndex,
    indexTime,
    indexFrequency,
    indexColor,
    loadedCruiseInfo,
  ]);

  useEffect(() => {
    // make async requests for all infomation panel values
    if (ship && cruise && sensor && indexFrequency !== null) {
      dispatch(latitudeAsync({ ship, cruise, sensor, indexTime }));
      dispatch(longitudeAsync({ ship, cruise, sensor, indexTime }));
      dispatch(timeAsync({ ship, cruise, sensor, indexTime }));
      dispatch(depthAsync({ ship, cruise, sensor, indexDepth }));
      dispatch(bottomAsync({ ship, cruise, sensor, indexTime }));
      dispatch(speedAsync({ ship, cruise, sensor, indexTime }));
      dispatch(distanceAsync({ ship, cruise, sensor, indexTime }));
      dispatch(
        svAsync({
          ship,
          cruise,
          sensor,
          indexDepth,
          indexTime,
          indexFrequency,
        }),
      );
    }
  }, [
    dispatch,
    searchParams,
    ship,
    cruise,
    sensor,
    indexDepth,
    indexTime,
    indexFrequency,
    indexColor,
  ]);

  return (
    <div className="WaterColumnView">
      {storeShape !== null && attributes !== null && indexFrequency !== null ? (
        <>
          <WaterColumnVisualization
            tileSize={attributes.tile_size}
            storeShape={storeShape}
            initialTimeIndex={initialTimeIndex}
          />

          <WaterColumnInformationPanel />
        </>
      ) : (
        <></>
      )}
    </div>
  );
}

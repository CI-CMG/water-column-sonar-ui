import {
  useEffect,
  // useState
} from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useSearchParams } from "react-router";
import WaterColumnInformationPanel from "./InformationPanel/WaterColumnInformationPanel";
import WaterColumnVisualization from "./WaterColumnVisualization";
import {
  updateShip,
  updateCruise,
  updateSensor,
  //
  selectDepthIndex,
  selectTimeIndex,
  selectFrequencyIndex,
  // selectColorIndex,
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
  //
  updateTimeIndex,
  updateFrequencyIndex,
  selectFrequencies,
  selectLatitude,
  selectLongitude,
  selectTime,
  selectBottom,
} from "../../reducers/store/storeSlice";
import {
  updateColorIndex,
} from "../../reducers/waterColumn/waterColumnSlice";

/* -------- Main View of Water Column Page ---------- */
export default function WaterColumnView() {
  useEffect(() => {
    document.title = `EchoFish Water Column`;
  }, []);

  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();

  // load query params
  const initialShip = searchParams.get("ship");
  const initialCruise = searchParams.get("cruise");
  const initialSensor = searchParams.get("sensor");
  const initialTimeIndex = Number(searchParams.get("time"));
  const initialFrequencyIndex = Number(searchParams.get("frequency"));
  const initialColorIndex = Number(searchParams.get("color"));

  const storeAttributes = useAppSelector(selectStoreAttributes); // not here
  const storeShape = useAppSelector(selectStoreShape);
  const frequencies = useAppSelector(selectFrequencies);
  const latitude = useAppSelector(selectLatitude);
  const longitude = useAppSelector(selectLongitude);
  const time = useAppSelector(selectTime);
  const bottom = useAppSelector(selectBottom);
  const indexTime = useAppSelector(selectTimeIndex);
  const indexDepth = useAppSelector(selectDepthIndex);
  const indexFrequency = useAppSelector(selectFrequencyIndex);
  // const indexColor = useAppSelector(selectColorIndex);

  useEffect(() => {
    dispatch(updateShip(initialShip));
    dispatch(updateCruise(initialCruise));
    dispatch(updateSensor(initialSensor));
    dispatch(updateTimeIndex(initialTimeIndex));
    dispatch(updateFrequencyIndex(initialFrequencyIndex));
    dispatch(updateColorIndex(initialColorIndex));
    dispatch(storeAttributesAsync({ ship: initialShip, cruise: initialCruise, sensor: initialSensor }));
    dispatch(storeShapeAsync({ ship: initialShip, cruise: initialCruise, sensor: initialSensor }));
    dispatch(frequenciesAsync({ ship: initialShip, cruise: initialCruise, sensor: initialSensor }));
    dispatch(latitudeAsync({ ship: initialShip, cruise: initialCruise, sensor: initialSensor, indexTime: initialTimeIndex }));
    dispatch(longitudeAsync({ ship: initialShip, cruise: initialCruise, sensor: initialSensor, indexTime: initialTimeIndex }));
    dispatch(timeAsync({ ship: initialShip, cruise: initialCruise, sensor: initialSensor, indexTime: initialTimeIndex }));
    dispatch(bottomAsync({ ship: initialShip, cruise: initialCruise, sensor: initialSensor, indexTime: initialTimeIndex }));
    //
    // dispatch(depthAsync({ ship: initialShip, cruise: initialCruise, sensor: initialSensor, indexDepth:  }));
  }, []);

  useEffect(() => {
    // make async requests for all infomation panel values
    dispatch(timeAsync({ ship: initialShip, cruise: initialCruise, sensor: initialSensor, indexTime }));
    dispatch(longitudeAsync({ ship: initialShip, cruise: initialCruise, sensor: initialSensor, indexTime }));
    dispatch(latitudeAsync({ ship: initialShip, cruise: initialCruise, sensor: initialSensor, indexTime }));
    dispatch(
      svAsync({
        ship: initialShip,
        cruise: initialCruise,
        sensor: initialSensor,
        indexDepth,
        indexTime,
        indexFrequency,
      }),
    );
    dispatch(depthAsync({ ship: initialShip, cruise: initialCruise, sensor: initialSensor, indexDepth }));
    dispatch(bottomAsync({ ship: initialShip, cruise: initialCruise, sensor: initialSensor, indexTime }));
  }, [
    dispatch,
    // searchParams,
    initialShip,
    initialCruise,
    initialSensor,
    indexTime,
    indexDepth,
    indexFrequency,
    // indexColor,
  ]);

  return (
    <div className="WaterColumnView">
      {
        storeAttributes !== null &&
        storeShape !== null &&
        initialTimeIndex !== null &&
        initialFrequencyIndex !== null &&
        frequencies !== null &&
        latitude !== null &&
        longitude !== null &&
        time !== null &&
        bottom !== null
        // plus time/depth/bottom/sv
        ? (
        <>
          <WaterColumnVisualization
            tileSize={storeAttributes.tile_size}
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

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
  // selectDepthIndex,
  // selectTimeIndex,
  //
  selectStoreAttributes,
  selectStoreShape,
  //
  storeAttributesAsync,
  storeShapeAsync,
  frequenciesAsync,
  // latitudeAsync,
  // longitudeAsync,
  // timeAsync,
  //
  // depthAsync,
  // bottomAsync,
  // svAsync,
  //
  updateTimeIndex,
  updateFrequencyIndex,
  updateColorIndex,
} from "../../reducers/store/storeSlice";

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
  // const indexDepth = useAppSelector(selectDepthIndex);
  // const indexTime = useAppSelector(selectTimeIndex); // if we are opening the page for the first time
  // const selectFrequency = useAppSelector(selectFrequencyIndex);
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
    //
    // is initialTimeIndex correct?
    // dispatch(latitudeAsync({ initialShip, initialCruise, initialSensor, indexTime }));
    // dispatch(longitudeAsync({ initialShip, initialCruise, initialSensor, indexTime }));
    // dispatch(timeAsync({ initialShip, initialCruise, initialSensor, indexTime }));
    // dispatch(depthAsync({ initialShip, initialCruise, initialSensor, indexDepth }));
    // dispatch(bottomAsync({ initialShip, initialCruise, initialSensor, indexTime }));
  }, []);

  // useEffect(() => {
  //   // make async requests for all infomation panel values
  //   dispatch(
  //     svAsync({
  //       initialShip,
  //       initialCruise,
  //       initialSensor,
  //       indexDepth,
  //       indexTime,
  //       initialFrequencyIndex,
  //     }),
  //   );
  // }, []);

  return (
    <div className="WaterColumnView">
      {
        storeAttributes !== null &&
        storeShape !== null &&
        initialTimeIndex !== null &&
        initialFrequencyIndex !== null // selectLatitude-Longitude null in panel
        // plus time/depth/bottom/sv
        ? (
        <>
          <p>test foo</p>
          {/* <WaterColumnVisualization
            tileSize={storeAttributes.tile_size}
            storeShape={storeShape}
            initialTimeIndex={initialTimeIndex}
          /> */}

          {/* <WaterColumnInformationPanel /> */}
        </>
      ) : (
        <></>
      )}
    </div>
  );
}

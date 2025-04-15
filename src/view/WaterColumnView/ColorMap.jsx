//////////////////////////////////////////////////////////////////////////////////
import {
  useState,
  useEffect,
} from "react";
import Spinner from 'react-bootstrap/Spinner';
import PropTypes from "prop-types";
// import {
//   useSearchParams
// } from 'react-router';

function legendValue(percent, max, min) {
  const range = Math.abs(max - min);
  const decimal = percent / 100;
  const value = min + (range * decimal);

  return `${(value).toFixed(2)}`;
}

//////////////////////////////////////////////////////////////////////////////////
const ColorMap = ({
  min,
  max,
  selectedColorPalette,
}) => {
  // const [searchParams, setSearchParams] = useSearchParams();
  const [isLoading, setLoading] = useState(true);
  // const min = computed(() => props.min);
  // const max = computed(() => props.max);
  // const selectedColorPalette = computed(() => props.selectedColorPalette);
  // const id = ref(genId());
  const width = 400;
  const height = 20;
  // const palette = computed(() => colorPalettes[selectedColorPalette.value]);
  // const legend0 = computed(() => legendValue(0, max.value, min.value));
  // const legend25 = computed(() => legendValue(25, max.value, min.value));
  // const legend50 = computed(() => legendValue(50, max.value, min.value));
  // const legend75 = computed(() => legendValue(75, max.value, min.value));
  // const legend100 = computed(() => legendValue(100, max.value, min.value));

  useEffect(() => {
    console.log('Loading the color map.')
  }, [])

  if (isLoading) {
    return <>
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </>;
  }
  return (
    <>
      <p>Color Map WIP</p>
      {/* <div align="center" className="colorMap">
        <span>
          <svg height="44" width="500">
            <rect
              v-for="(color, index) in palette"
              :id="`${id}-${index}`"
              class="bars"
              :key="index"
              :width="width / palette.length"
              :height="height"
              :x="(index * width / palette.length) + 50"
              y="2"
              :style="`fill: ${color};`"
            />
            <text
              :width="width"
              :height="height"
              :x="25"
              :y="37"
            >{{legend0}}</text>
            <text
              :width="width"
              :height="height"
              :x="width * .25 + 25"
              :y="37"
            >{{legend25}}</text>
            <text
              :width="width"
              :height="height"
              :x="width * .50 + 25"
              :y="37"
            >{{legend50}}</text>
            <text
              :width="width"
              :height="height"
              :x="width * .75 + 25"
              :y="37"
            >{{legend75}}</text>
            <text
              :width="width"
              :height="height"
              :x="width + 25"
              :y="37"
            >{{legend100}}</text>
          </svg>
        </span>
      </div> */}
    </>
  );
};

export default ColorMap;

ColorMap.propTypes = {
  min: PropTypes.instanceOf(Number),
  max: PropTypes.instanceOf(Number),
  selectedColorPalette: PropTypes.instanceOf(String),
};

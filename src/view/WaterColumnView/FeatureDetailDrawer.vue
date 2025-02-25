<template>
    <v-navigation-drawer :width="420" :model-value="drawer" @update:model-value="close" temporary :scrim="false" disable-route-watcher>
      <template v-slot:prepend>
        <v-container>
          <v-row align="center" no-gutters>
            <v-col class="text-left">
              <h3>{{ shipName }} {{ cruiseName }} {{ sensorName }} {{`${(frequency / 1000).toFixed(2)} kHz`}}</h3>
            </v-col>
            <v-col class="text-right" cols="3">
              <v-btn
                variant="text"
                icon="mdi-chevron-left"
                @click="close()"
              />
            </v-col>
          </v-row>
        </v-container>
      </template>
      <v-card variant="flat">
        <v-card-text>
          <v-row>
            <div class="echogram-globe">
              <cesium-map :fly-to="flyTo" :location-entities="locationEntities" />
            </div>
          </v-row>
          <v-row>
            <multi-frequency-plot :frequencies="frequencies" :selected-data-slice="selectedDataSlice" />
          </v-row>
          <v-row v-if="utcTime">
            <v-col cols="4">Time (GMT):</v-col>
            <v-col>{{utcTime}}</v-col>
          </v-row>
          <v-row v-if="localTime">
            <v-col cols="4">Local time:</v-col>
            <v-col>{{localTime}}</v-col>
          </v-row>
          <v-row v-if="selectedEchogramPoint?.longitude != undefined && selectedEchogramPoint?.latitude != undefined">
            <v-col cols="4">Lon/Lat (&deg;E, &deg;N):</v-col>
            <v-col>
              {{
                `${selectedEchogramPoint.longitude.toFixed(4)}&deg;, ${selectedEchogramPoint.latitude.toFixed(4)}&deg;`
              }}
            </v-col>
          </v-row>
          <v-row v-if="selectedEchogramPoint?.depthMeters != undefined">
            <v-col cols="4">Depth (m):</v-col>
            <v-col>
              {{-Math.round(selectedEchogramPoint.depthMeters * 100) / 100}}
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="4">Selected Sv (dB):</v-col>
            <v-col>
              <span v-if="selectedEchogramPoint && selectedEchogramPoint.sv">
                {{Math.round(selectedEchogramPoint.sv * 100) / 100}}
              </span>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="4">Calibration info:</v-col>
            <v-col><i>calibrated with calibration data</i></v-col>
          </v-row>

          <!--<hr />
          <br />-->

          <!--<v-row>-->
          <!--<v-progress-linear v-model="scaleValue" :height="11" color="white" />-->
          <!--</v-row>-->

          <!--<br />
          <hr />-->

          <v-row>
            <v-col>
              <v-form>
                <v-row no-gutters>
                  <v-col cols="6">
                    <v-select
                      :items="frequencyItems"
                      :model-value="props.frequency"
                      @update:modelValue="updateFrequency"
                      density="compact"
                      label="Frequency"
                      item-title="name"
                      item-value="frequency"
                    />
                  </v-col>
                  <v-col cols="6">
                    <v-select
                      :items="colorPaletteItems"
                      :model-value="props.selectedColorPalette"
                      @update:modelValue="selectColorPalette"
                      density="compact"
                      label="Color Map"
                    />
                  </v-col>
                </v-row>
                <v-row no-gutters>
                  <v-col cols="6">
                    <v-text-field type="number" v-model="minDeb" label="Min dB" density="compact" />
                  </v-col>
                  <v-col cols="6">
                    <v-text-field type="number" v-model="maxDeb" label="Max dB" density="compact" />
                  </v-col>
                </v-row>
              </v-form>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-navigation-drawer>
  </template>

  <script setup lang="ts">
  import * as Cesium from 'cesium';
  import CesiumMap from '@/views/view/echofish/map/CesiumMap.vue';
  import MultiFrequencyPlot from '@/views/view/echofish/cruise/MultiFrequencyPlot.vue';
  import SelectedEchogramPoint from '@/views/view/echofish/cruise/SelectedEchogramPoint';
  import { computed, ref, watch } from 'vue';
  import moment from 'moment-timezone';
  import tzlookup from 'tz-lookup';
  import debounce from 'lodash.debounce';
  import { colorPalettes } from './WaterColumnColors';

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const props = withDefaults(defineProps< {
    drawer: boolean;
    shipName: string,
    cruiseName: string,
    sensorName: string,
    frequencies: number[],
    frequency: number,
    selectedColorPalette: string,
    min: number,
    max: number,
    // selectedEchogramPoint?: SelectedEchogramPoint,
    selectedEchogramPoint?: SelectedEchogramPoint,
    flyTo: Cesium.Cartesian3,
  }>(), {
    selectedEchogramPoint: undefined,
  });

  const colorPaletteItems = Object.keys(colorPalettes);

  const emit = defineEmits(['openCloseDrawer', 'selectColorPalette', 'updateMin', 'updateMax', 'updateFrequency']);

  const close = () => {
    emit('openCloseDrawer', false);
  };

  const updateFrequency = (value:string) => {
    emit('updateFrequency', value);
  };

  const selectColorPalette = (value:string) => {
    emit('selectColorPalette', value);
  };

  const updateMinEvent = (value:number) => {
    emit('updateMin', value);
  };

  const updateMaxEvent = (value:number) => {
    emit('updateMax', value);
  };

  type FreqItem = {
    frequency: number;
    name: string;
  };

  const min = computed(() => props.min);
  const max = computed(() => props.max);

  const flyTo = computed(() => props.flyTo);

  const locationEntities = computed(() => [new Cesium.Entity({
    position: new Cesium.Cartesian3(flyTo.value.x, flyTo.value.y, flyTo.value.z),
    ellipse: {
      semiMinorAxis: 5000,
      semiMajorAxis: 5000,
      height: 10,
      material: Cesium.Color.TRANSPARENT,
      outline: true, // height must be set for outline to display
      outlineColor: Cesium.Color.MAGENTA,
      outlineWidth: new Cesium.ConstantProperty(24),
    },
  })]);

  const minDeb = ref(`${min.value}`);
  const maxDeb = ref(`${max.value}`);

  // TODO: temporary scale value shown for depth in meters. WIP
  // const scaleValue = 20;

  const frequencies = computed(() => props.frequencies);

  const frequency = computed(() => props.frequency);

  const frequencyItems = computed(() => {
    const items: Array<FreqItem> = [];
    frequencies.value.forEach((freq) => items.push({ frequency: freq, name: `${(freq / 1000).toFixed(2)} kHz` }));
    return items;
  });

  const updateMin = debounce(() => {
    const nextMin = Number.parseFloat(minDeb.value);
    if (nextMin <= max.value) {
      updateMinEvent(nextMin);
    }
  }, 500);

  const updateMax = debounce(() => {
    const nextMax = Number.parseFloat(maxDeb.value);
    if (nextMax >= min.value) {
      updateMaxEvent(nextMax);
    }
  }, 500);

  watch(minDeb, () => {
    updateMin();
  });

  watch(maxDeb, () => {
    updateMax();
  });

  const selectedDataSlice = computed(() => (props.selectedEchogramPoint ? props.selectedEchogramPoint.dataSlice : []));

  const getDateTime = (epochSeconds: number, timezone: string) => {
    const tempDate = new Date(0);
    tempDate.setUTCMilliseconds(epochSeconds * 1000);
    const timestamp = tempDate.toISOString().substring(0, 19);
    return moment.tz(timestamp, 'Etc/UTC').clone().tz(`${timezone}`);
  };

  const utcTime = computed(() => {
    if (props.selectedEchogramPoint?.timestamp !== undefined) {
      return getDateTime(props.selectedEchogramPoint.timestamp, 'Etc/UTC');
    }
    return undefined;
  });

  const localTime = computed(() => {
    if (props.selectedEchogramPoint?.timestamp !== undefined && props.selectedEchogramPoint?.longitude !== undefined && props.selectedEchogramPoint?.latitude !== undefined) {
      return getDateTime(props.selectedEchogramPoint.timestamp, tzlookup(props.selectedEchogramPoint.latitude, props.selectedEchogramPoint.longitude));
    }
    return undefined;
  });

  </script>

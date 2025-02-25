<template>
    <div class="cruise-container">
      <feature-detail-drawer
        v-if="frequencies.length"
        :cruise-name="cruiseName"
        :ship-name="shipName"
        :sensor-name="sensorName"
        @open-close-drawer="openCloseInfoDrawer"
        @select-color-palette="selectColorPalette"
        @update-max="updateMax"
        @update-min="updateMin"
        @update-frequency="updateFrequency"
        :frequency="frequency"
        :selected-color-palette="selectedColorPalette"
        :min="min"
        :max="max"
        :drawer="drawer"
        :frequencies="frequencies"
        :selected-echogram-point="selectedEchogramPoint"
        :fly-to="flyTo"
      />

      <echogram
        v-if="frequencies.length"
        :sensor-name="sensorName"
        :cruise-name="cruiseName"
        :depth-index="depthIndex"
        :store-index="storeIndex"
        :ship-name="shipName"
        :frequency="frequency"
        :frequencies="frequencies"
        :min="min"
        :max="max"
        :selected-color-palette="selectedColorPalette"
        @update-selected-point="updateSelectedEchogramPoint"
        @update-location="updateLocation"
      />

      <v-container style="position: absolute; top: 0; left: 0; right: 0;" fluid class="pa-0">
        <v-row no-gutters>
          <v-col cols="3">
            <v-btn v-if="!drawer" color="secondary" class="ma-2" rounded @click="openCloseInfoDrawer">
              <span>{{shipName}} {{cruiseName}} {{sensorName}}</span>
              <v-icon icon="mdi-information-outline" />
            </v-btn>
          </v-col>

          <v-col cols="6" class="d-flex justify-center">
            <color-bar :selectedColorPalette="selectedColorPalette" :min="min" :max="max" />
          </v-col>

          <v-col cols="3" class="d-flex justify-end">
            <v-card variant="text">
              <v-card-actions class="justify-center">
                <v-tooltip location="bottom" text="Go To Map">
                  <template #activator="{ props }">
                    <v-btn v-bind="props" rounded variant="flat" color="secondary" icon="mdi-earth" @click="goToMap" />
                  </template>
                </v-tooltip>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>

    </div>
  </template>

  <script setup lang="ts">
  import * as Cesium from 'cesium';
  import { Router, useRoute, useRouter } from 'vue-router';
  import {
    computed, onMounted, ref, watch,
  } from 'vue';
  import Echogram from '@/views/view/echofish/cruise/Echogram.vue';
  import FeatureDetailDrawer from '@/views/view/echofish/cruise/FeatureDetailDrawer.vue';
  import SelectedEchogramPoint from '@/views/view/echofish/cruise/SelectedEchogramPoint';
  import ColorBar from '@/views/view/echofish/cruise/ColorBar.vue';
  import { HTTPStore, openArray } from 'zarr';
  import { ZARR_BASE_URL } from '@/basePath';
  import EchogramCenter from '@/views/view/echofish/cruise/EchogramCenter';
  import { defaultColorPalette } from './WaterColumnColors';

  type ViewState = {
    frequencies?: number[];
  };

  const route = useRoute();
  const shipName = computed(() => route.params.shipName as string);
  const cruiseName = computed(() => route.params.cruiseName as string);
  const sensorName = computed(() => route.params.sensorName as string);
  const storeIndexRoute = computed(() => Number.parseInt(route.params.storeIndex as string, 10));
  const depthIndexRoute = computed(() => Number.parseInt(route.params.depthIndex as string, 10));
  const routeFrequency = computed(() => Number.parseInt(route.params.frequency as string, 10));

  const storeIndex = ref(storeIndexRoute.value);
  const depthIndex = ref(depthIndexRoute.value);
  const frequency = ref(routeFrequency.value);

  watch(storeIndexRoute, (newVal) => {
    storeIndex.value = newVal;
  });

  watch(depthIndexRoute, (newVal) => {
    depthIndex.value = newVal;
  });

  watch(routeFrequency, (newVal) => {
    frequency.value = newVal;
  });

  const drawer = ref(true);
  const frequencies = ref<number[]>([]);
  const selectedEchogramPoint = ref<SelectedEchogramPoint | undefined>();
  const router: Router = useRouter();
  const selectedColorPalette = ref(defaultColorPalette);
  const min = ref(-80);
  const max = ref(-30);
  const flyTo = ref(Cesium.Cartesian3.fromDegrees(0, 0, 200000));

  function openCloseInfoDrawer() {
    drawer.value = !drawer.value;
  }

  function selectColorPalette(value: string) {
    selectedColorPalette.value = value;
  }

  function updateMax(value: number) {
    max.value = value;
  }

  function updateMin(value: number) {
    min.value = value;
  }

  const trimTrailingSlashes = (path: string) => (path.trim().replace(/\/+$/, ''));

  function updatePath(path: string, value: number, endOffset: number) {
    const parts = trimTrailingSlashes(path).split('/');
    parts[parts.length - 1 - endOffset] = `${value}`;
    return parts.join('/');
  }

  function updateUrl(value: number, endOffset: number) {
    // eslint-disable-next-line no-restricted-globals
    const state = history.state;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const path = window.location.pathname;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const title = document.title;
    // eslint-disable-next-line no-restricted-globals
    history.replaceState(state, title, updatePath(path, value, endOffset));
  }

  function updateFrequency(value: number) {
    frequency.value = value;
    updateUrl(value, 0);
  }

  function updateDepth(value: number) {
    depthIndex.value = value;
    updateUrl(value, 1);
  }

  function updateStoreIndex(value: number) {
    storeIndex.value = value;
    updateUrl(value, 2);
  }

  function updateSelectedEchogramPoint(newEchogramPoint: SelectedEchogramPoint | undefined) {
    selectedEchogramPoint.value = newEchogramPoint;
  }

  function updateLocation(location: EchogramCenter | undefined) {
    if (location?.depthIndex !== undefined && location.storeIndex !== undefined) {
      updateDepth(location.depthIndex);
      updateStoreIndex(location.storeIndex);
    }
    if (location?.latitude !== undefined && location?.longitude !== undefined) {
      flyTo.value = Cesium.Cartesian3.fromDegrees(location.longitude, location.latitude, 200000);
    }
  }

  function goToMap() {
    router.push({
      name: 'map',
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function load() {
    const store = new HTTPStore(`${ZARR_BASE_URL}/level_2/${shipName.value}/${cruiseName.value}/${sensorName.value}/${cruiseName.value}.zarr`);
    openArray({ store, path: 'frequency', mode: 'r' })
      .then((frequencyArray) => frequencyArray.get())
      .then((nestedArray: any) => Array.from(nestedArray.data))
      .then((frequencyArray) => {
        const state: ViewState = {
          frequencies: frequencyArray as number[],
        };
        return state;
      })
      .then((state) => {
        frequencies.value = state.frequencies || [];
      });
  }

  watch(shipName, (value) => {
    if (shipName.value !== value) {
      load();
    }
  });
  watch(cruiseName, (value) => {
    if (cruiseName.value !== value) {
      load();
    }
  });
  watch(sensorName, (value) => {
    if (sensorName.value !== value) {
      load();
    }
  });

  onMounted(() => load());

  </script>

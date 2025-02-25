
<template>
    <div align="center" class="color-bar">
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
        <!--      <b-popover v-for="(color, index) in palette" :key="index" :target="`${id}-${index}`" triggers="click blur" placement="top">-->
        <!--        {{popupRange(index)}}-->
        <!--      </b-popover>-->
      </span>
    </div>
  </template>
  <script setup lang="ts">
  // import { computed, ref } from 'vue';
  // import { genId } from '@/idGenerator';
  import { colorPalettes } from './WaterColumnColors';

  function legendValue(percent: number, max: number, min: number) {
    const range = Math.abs(max - min);
    const decimal = percent / 100;
    const value = min + (range * decimal);
    return `${(value).toFixed(2)}`;
  }

  const props = withDefaults(defineProps<{
    min: number,
    max: number,
    selectedColorPalette: string,
  }>(), {
  });

  const min = computed(() => props.min);
  const max = computed(() => props.max);
  const selectedColorPalette = computed(() => props.selectedColorPalette);
  const id = ref(genId());
  const width = 400;
  const height = 20;
  const palette = computed(() => colorPalettes[selectedColorPalette.value]);
  const legend0 = computed(() => legendValue(0, max.value, min.value));
  const legend25 = computed(() => legendValue(25, max.value, min.value));
  const legend50 = computed(() => legendValue(50, max.value, min.value));
  const legend75 = computed(() => legendValue(75, max.value, min.value));
  const legend100 = computed(() => legendValue(100, max.value, min.value));

  </script>

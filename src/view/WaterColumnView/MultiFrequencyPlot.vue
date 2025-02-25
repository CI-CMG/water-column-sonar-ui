<!--_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+-->
<template>
    <div class="multiFrequencyPlot">
      <Line
        :options="{ responsive: true, maintainAspectRatio: false }"
        :data="chartData"
      />
    </div>
  </template>
  <!--_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+-->
  <script setup lang="ts">
  import { Line } from 'vue-chartjs';
  import { computed } from 'vue';

  const props = withDefaults(defineProps< {
    frequencies: number[],
    selectedDataSlice: number[],
  }>(), {
  });

  const chartData = computed(() => ({
    labels: props.frequencies.map((i) => `${i / 1000} kHz`), // TODO: accommodate update for channel ids
    datasets: [
      {
        label: 'Sv Values',
        backgroundColor: '#0490E4',
        data: props.selectedDataSlice,
      },
    ],
  }));
  </script>

<template>
  <canvas ref="chartCanvas"></canvas>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onBeforeUnmount, type PropType } from 'vue'; // Importa PropType
import { Chart, registerables, type ChartData } from 'chart.js'; // Importa ChartData

Chart.register(...registerables);

const props = defineProps({
  chartData: {
    // Especifica el tipo exacto para ChartData de un gráfico de 'barras'
    type: Object as PropType<ChartData<'bar'>>,
    required: true,
  },
});

const chartCanvas = ref<HTMLCanvasElement | null>(null);
let myChart: Chart | null = null;

const createChart = () => {
  if (chartCanvas.value && props.chartData) {
    if (myChart) {
      myChart.destroy();
    }
    myChart = new Chart(chartCanvas.value, {
      type: 'bar',
      data: props.chartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y', // Barras horizontales
        scales: {
             x: { beginAtZero: true },
             y: { }
        },
         plugins: {
            title: { display: true, text: 'Distribución Geográfica (Clientes por Ubicación)' },
            tooltip: { mode: 'index', intersect: false },
            legend: { display: false }
        }
      },
    });
  }
};

onMounted(() => { createChart(); });
watch(() => props.chartData, () => { createChart(); }, { deep: true });
onBeforeUnmount(() => { if (myChart) { myChart.destroy(); } });
</script>

<style scoped>
canvas {
  width: 100% !important;
  height: 350px; /* Ajusta si es necesario para el número de ubicaciones */
  display: block;
}
</style>
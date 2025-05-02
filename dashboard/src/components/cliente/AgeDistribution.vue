<template>
  <canvas ref="chartCanvas"></canvas>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onBeforeUnmount, type PropType } from 'vue';
import { Chart, registerables, type ChartData } from 'chart.js';

// Registrar todos los elementos necesarios de Chart.js
Chart.register(...registerables);

const props = defineProps({
  chartData: {
    // Especifica el tipo exacto para ChartData de un gráfico de 'barras'
    // El tipo sigue siendo el mismo, solo cambia cómo se visualiza
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
        maintainAspectRatio: false, // Importante para controlar la altura
        scales: {
             x: {
                 // ***** CAMBIO AQUÍ *****
                 stacked: false, // Desactivar apilamiento en el eje X
                 // ***** FIN CAMBIO *****
             },
             y: {
                 // ***** CAMBIO AQUÍ *****
                 stacked: false, // Desactivar apilamiento en el eje Y
                 // ***** FIN CAMBIO *****
                 beginAtZero: true,
             }
        },
         plugins: {
            title: { display: true, text: 'Distribución de Edades por Deporte' },
            tooltip: {
                // Modo index funciona bien para barras agrupadas también
                mode: 'index',
                intersect: false
            },
            legend: { display: true } // La leyenda sigue siendo útil para identificar rangos de edad
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
  width: 100% !important; /* Asegura que use el ancho disponible */
  height: 350px; /* Altura fija para ayudar al layout "sin scroll" */
  display: block; /* Evita espacio extra debajo del canvas */
}
</style>
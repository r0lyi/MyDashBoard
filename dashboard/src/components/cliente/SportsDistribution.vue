<template>
  <canvas ref="chartCanvas"></canvas>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onBeforeUnmount, type PropType } from 'vue';
import { Chart, registerables, type ChartData } from 'chart.js';

Chart.register(...registerables);

const props = defineProps({
  chartData: {
    type: Object as PropType<ChartData<'pie'>>,
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
      type: 'pie',
      data: props.chartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            title: {
              display: true,
              text: 'Deportes Populares'
            },
             tooltip: {
                callbacks: {
                    label: function(context) {
                        const label = context.label || '';
                        const value = context.parsed || 0;

                        // ***** MODIFICACIÓN AQUÍ (VERSIÓN 2) *****
                        const total = context.dataset.data.reduce(
                             (sum: number, val: typeof context.dataset.data[0]) => {
                                if (typeof val === 'number') {
                                    return sum + val;
                                }
                                return sum + 0;
                            },
                            0 // Valor inicial numérico
                        );
                         // ***** FIN MODIFICACIÓN *****

                        const percentage =
                            total > 0 ? ((value / total) * 100).toFixed(1) + "%" : "0.0%";
                        return `${label}: ${value} (${percentage})`;
                    }
                }
             },
            legend: { display: true, position: 'top' }
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
  height: 350px;
  display: block;
}
</style>
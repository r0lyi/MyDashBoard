<template>
    <div class="apexchart-container">
      <apexchart
        type="bar"
        :options="chartOptions"
        :series="seriesData"
      ></apexchart>
    </div>
  </template>
  
  <script setup lang="ts">
  import type { ApexOptions } from 'apexcharts';
  import type { PropType } from 'vue';
  
  defineProps({
    seriesData: {
      type: Array as PropType<ApexAxisChartSeries | ApexNonAxisChartSeries>,
      required: true,
    },
    chartOptions: {
      type: Object as PropType<ApexOptions>,
      default: () => ({
          // ... otras opciones ...
          yaxis: {
               tickAmount: 4,
               labels: {
                   // ***** MODIFICACIÓN AQUÍ *****
                   formatter: function(val: number): string { // Añade `: number` y tipo de retorno
                       return val.toFixed(0).toString();
                   }
                   // ***** FIN MODIFICACIÓN *****
               }
          },
          // ... otras opciones ...
      }),
    },
  });
  </script>
  
  <style scoped>
  .apexchart-container {
    width: 100%;
    height: 350px;
    display: flex; /* Para centrar o alinear el chart dentro */
    justify-content: center;
    align-items: center;
     position: relative;
  }
  /* Puedes necesitar ajustar estilos internos si el chartOptions.chart.parentHeightOffset: 0
     no funciona perfectamente en tu layout de Ionic Card */
  /* Por ejemplo: */
  .apexchart-container ::v-deep .apexcharts {
      width: 100% !important;
      height: 100% !important;
  }
  </style>
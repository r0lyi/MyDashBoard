<template>
    <div class="apexchart-container">
      <apexchart
        type="scatter"
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
          xaxis: {
              title: { text: 'Precio (€)' },
              tickAmount: 10,
              labels: {
                   // ***** MODIFICACIÓN AQUÍ *****
                   formatter: function(val: number): string { // Añade `: number` y tipo de retorno
                       return parseFloat(val.toFixed(2)) + '€'; // O .toString()
                   }
                   // ***** FIN MODIFICACIÓN *****
              }
          },
          yaxis: {
              title: { text: 'Valoración (Rating)' },
              min: 0, max: 5,
              tickAmount: 5,
               labels: {
                   // ***** MODIFICACIÓN AQUÍ *****
                   formatter: function(val: number): string { // Añade `: number` y tipo de retorno
                       return val.toFixed(1); // O .toString()
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
    height: 350px; /* **Altura fija** */
     position: relative;
  }
  /* Estilo opcional para tooltips custom */
  .apexcharts-tooltip-custom {
      padding: 10px;
      background: #fff;
      border: 1px solid #ccc;
      font-size: 12px;
  }
  </style>
<template>
    <div class="apexchart-container">
      <apexchart
        type="bubble"
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
              title: { text: 'Ventas (€)' },
              labels: {
                  // ***** MODIFICACIÓN AQUÍ *****
                   formatter: function(val: number): string { // Añade `: number` y tipo de retorno
                       return val.toFixed(0).toString();
                   }
                   // ***** FIN MODIFICACIÓN *****
              }
          },
          yaxis: {
              title: { text: 'Tasa de Recompra' },
              min: 0, max: 1,
               labels: {
                   // ***** MODIFICACIÓN AQUÍ *****
                   formatter: function(val: number): string { // Añade `: number` y tipo de retorno
                       return (val * 100).toFixed(0) + '%';
                   }
                   // ***** FIN MODIFICACIÓN *****
              }
          },
           tooltip: { // También en el tooltip custom, los parámetros ya tienen tipo, pero revisa
               enabled: true,
               custom: function({ series, seriesIndex, dataPointIndex, w }) {
                   // Los parámetros de custom tooltip en ApexCharts ya suelen venir tipados si usas @types/apexcharts
                   // Pero si aquí hubiera un 'val' sin tipo, también lo añadirías: function(val: number, ...)
                   const data = w.config.series[seriesIndex].data[dataPointIndex]; // data es [x, y, size]
                   const productName = data[3] || 'Producto'; // Ejemplo si pasas el nombre
  
                    return `<div class="apexcharts-tooltip-custom">` +
                          `<span>${productName}</span><br/>` +
                          `<span>Ventas: ${data[0].toFixed(0)}€</span><br/>` +
                          `<span>Tasa Recompra: ${(data[1] as number * 100).toFixed(1)}%</span><br/>` + // Asegurar que data[1] es number si es necesario
                           `<span>Unidades Vendidas: ${data[2]}</span>` +
                          `</div>`;
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
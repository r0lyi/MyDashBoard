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
import { ref, watch, computed } from 'vue'; // computed es útil para opciones dinámicas

// No necesitamos importar Chart ni registerables aquí, el wrapper lo maneja.
// Pero necesitamos tipos para las props si usamos TS strict.
import type { ApexOptions } from 'apexcharts';
import type { PropType } from 'vue';

const props = defineProps({
  // seriesData espera un array de series, cada serie tiene una propiedad `data`
  // Para un histograma simple, puede ser una serie con data en formato [count, count, ...]
  // O si usas el formato { x: category, y: value }, también funciona.
  seriesData: {
    type: Array as PropType<ApexAxisChartSeries | ApexNonAxisChartSeries>,
    required: true,
  },
  // chartOptions espera el objeto de opciones de ApexCharts
  chartOptions: {
    type: Object as PropType<ApexOptions>,
    default: () => ({
        chart: {
            id: 'price-distribution-chart',
            type: 'bar', // Definir el tipo de gráfico
             toolbar: { show: false }, // Ocultar la barra de herramientas por defecto
             parentHeightOffset: 0 // Ayuda a que el gráfico ocupe el 100% de la altura del contenedor si es necesario
        },
        title: {
            text: 'Distribución de Precios',
            align: 'left'
        },
         plotOptions: { // Opciones específicas de barras
            bar: {
                distributed: true, // Opcional: colorear cada barra con un color diferente
                 horizontal: false // Barras verticales
            }
        },
        xaxis: {
            categories: [], // Las categorías (rangos de precio) vendrán de los datos procesados
            title: { text: 'Rango de Precio (€)' }
        },
         yaxis: {
            title: { text: 'Número de Productos' },
             labels: { formatter: function (val) { return Math.round(val); } } // Asegura que los labels sean enteros
        },
        dataLabels: { enabled: false }, // Ocultar los números sobre las barras
        legend: { show: false }, // Normalmente no se necesita leyenda para un histograma simple
        // Otros opciones como colores, grid, tooltip pueden añadirse aquí
         tooltip: { enabled: true }
    }),
  },
});

// ApexCharts es reactivo a cambios en options y seriesData pasados como props.
// No necesitas onMounted, watch, onBeforeUnmount manuales para crear/destruir el gráfico
// El wrapper <apexchart> lo hace automáticamente.

// Si tus chartOptions necesitan derivarse de los datos, puedes usar computed properties
// const dynamicChartOptions = computed(() => {
//   return {
//     ...props.chartOptions,
//     xaxis: { categories: props.seriesData[0]?.data.map(item => item.x) || [] } // Ejemplo si data es {x, y}
//   };
// });
</script>

<style scoped>
.apexchart-container {
  width: 100%; /* Asegura que el contenedor use el ancho disponible */
  height: 350px; /* **Altura fija para ayudar al layout "sin scroll"** */
   /* Opcional: overflow-hidden para ocultar partes si el gráfico se sale */
   /* overflow: hidden; */
   position: relative; /* Puede ser útil para tooltips o elementos internos */
}
</style>
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
import type { ApexAxisChartSeries } from 'apexcharts';

defineProps({
  seriesData: { // Espera [{ name: string, data: number[] }]
    type: Array as PropType<ApexAxisChartSeries>,
    required: true,
  },
  chartOptions: { // Espera un objeto de opciones de ApexCharts
    type: Object as PropType<ApexOptions>,
    default: () => ({
        chart: {
            id: 'product-popularity-chart',
            type: 'bar',
            toolbar: { show: false },
            parentHeightOffset: 0
        },
        title: {
            text: 'Productos Más Populares (por Unidades Vendidas)',
            align: 'left'
        },
         plotOptions: {
            bar: {
                distributed: true, // Opcional: colorear cada barra diferente
                horizontal: true // Barras horizontales para nombres largos de productos
            }
        },
        dataLabels: { enabled: false }, // Ocultar los números sobre las barras
        legend: { show: false },
        xaxis: {
            // Las categorías (nombres de productos) vendrán de la prop chartOptions.xaxis.categories
            categories: [], // Placeholder
            title: { text: 'Unidades Vendidas' } // Título del eje X (valor)
        },
         yaxis: {
            // Eje Y (categorías) ahora son los nombres de productos
            title: { text: 'Producto' },
            // Si necesitas formatear nombres de productos largos:
            // labels: { formatter: function (val: string): string { return val.substring(0, 20) + '...'; } }
        },
        tooltip: { enabled: true }
    }),
  },
});
</script>

<style scoped>
.apexchart-container {
  width: 100%;
  height: 42vh; /* Mantén la altura relativa */
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  /* *** Añadir esta línea para evitar que el flex item se encoja más de lo necesario *** */
  min-height: 0;
}

/* *** FORZAR AL ELEMENTO INTERNO DE APEXCHARTS A LLENAR SU CONTENEDOR *** */
/* Usa :deep() que es la sintaxis estándar de Vue 3 */
.apexchart-container :deep(.apexcharts) {
    width: 100% !important; /* Asegura que el ancho interno sea 100% */
    height: 100% !important; /* Asegura que la altura interna sea 100% */
    /* Puedes añadir display: flex y centrado aquí también */
    display: flex;
    justify-content: center;
    align-items: center;
}

/* *** SI LA SINTAXIS :deep() NO FUNCIONA, PRUEBA CON ESTAS OTRAS (más antiguas) *** */
/*
.apexchart-container ::v-deep .apexcharts {
    width: 100% !important;
    height: 100% !important;
    display: flex;
    justify-content: center;
    align-items: center;
}
*/
/*
.apexchart-container >>> .apexcharts {
    width: 100% !important;
    height: 100% !important;
    display: flex;
    justify-content: center;
    align-items: center;
}
*/
/* ************************************************************************* */

/* Estilos opcionales como tooltips custom */
.apexcharts-tooltip-custom {
    padding: 10px;
    background: #fff;
    border: 1px solid #ccc;
    font-size: 12px;
    pointer-events: none;
}
</style>
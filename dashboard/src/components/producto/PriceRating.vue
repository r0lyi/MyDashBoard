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
import type { ApexAxisChartSeries } from 'apexcharts'; // Tipo genérico
import type { PriceRatingDataPoint } from '@/types/product'; // Importa nuestro tipo definido


defineProps({
  seriesData: { // Espera [{ name: string, data: PriceRatingDataPoint[] }]
    // Usamos ApexAxisChartSeries pero indicamos que esperamos data[] con nuestro tipo
    type: Array as PropType<{ name: string; data: PriceRatingDataPoint[] }[] | ApexAxisChartSeries>,
    required: true,
  },
  chartOptions: {
    type: Object as PropType<ApexOptions>,
    default: () => ({
        chart: {
            id: 'price-rating-chart',
            type: 'scatter',
            toolbar: { show: true },
            parentHeightOffset: 0
        },
        title: { text: 'Relación Precio vs Valoración por Producto', align: 'left' }, // Título ajustado
        xaxis: {
            title: { text: 'Precio (€)' },
            tickAmount: 10,
            // ***** Tipado explícito en formatter *****
            labels: { formatter: function(val: number): string { return parseFloat(val.toFixed(2)) + '€'; } }
            // ***** Fin Tipado *****
        },
        yaxis: {
            title: { text: 'Valoración (Rating)' },
            min: 0, max: 5,
            tickAmount: 5,
            // ***** Tipado explícito en formatter *****
             labels: { formatter: function(val: number): string { return val.toFixed(1); } }
             // ***** Fin Tipado *****
        },
        markers: {
            size: 5,
            hover: { size: 7 }
        },
        tooltip: {
            enabled: true,
            // ***** Tipado explícito en tooltip custom callback *****
            custom: function({ series, seriesIndex, dataPointIndex, w }): string {
                 const pointData = w.config.series[seriesIndex].data[dataPointIndex] as PriceRatingDataPoint;

                  return `<div class="apexcharts-tooltip-custom">` +
                        `<span>Producto: ${pointData[2] || 'N/A'}</span><br/>` +
                        `<span>Precio: ${pointData[0].toFixed(2)}€</span><br/>` +
                        `<span>Rating: ${pointData[1].toFixed(1)}</span>` +
                        `</div>`;
             }
            // ***** Fin Tipado *****
        }
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
<template>
  <VEChart class="product-ranking-chart" :option="options" autoresize />
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue';

// Echarts
import VEChart from 'vue-echarts';
import { BarChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import {
  GridComponent,
  TooltipComponent,
  TitleComponent,
  LegendComponent,
} from 'echarts/components';
import * as echarts from 'echarts/core';
import type { EChartsOption } from 'echarts';

// Registrar los módulos necesarios de ECharts
echarts.use([
  BarChart,
  CanvasRenderer,
  GridComponent,
  TooltipComponent,
  TitleComponent,
  LegendComponent,
]);

// Definimos las props
const props = defineProps<{
  title?: string;
  subtitle?: string;
  data: { name: string; value: number }[]; // 'name' será el nombre del producto, 'value' la cantidad vendida
}>();

const options = ref<EChartsOption>({});

watchEffect(() => {
  // Extraer nombres de productos y valores para el gráfico
  const productNames = props.data.map(item => item.name).reverse(); // Invertir para que el más vendido esté arriba
  const productValues = props.data.map(item => item.value).reverse(); // Invertir para que el más vendido esté arriba

  options.value = {
    title: {
      text: props.title ?? 'Productos Más Comprados',
      subtext: props.subtitle ?? 'Ranking por Unidades Vendidas',
      left: 'left',
      textStyle: {
        color: '#FFFFFF', // Blanco para el título principal
        fontSize: 16,
        fontWeight: 'bold',
      },
      subtextStyle: {
        color: '#CCCCCC', // Blanco ligeramente más suave para el subtítulo
      },
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow', // 'shadow' para barras, 'line' para líneas
      },
      formatter: '{b}: {c} unidades', // Formato del tooltip
      textStyle: {
        color: '#FFFFFF', // Color del texto del tooltip
      },
      backgroundColor: 'rgba(50,50,50,0.7)', // Fondo oscuro semitransparente para el tooltip
      borderColor: '#444', // Borde del tooltip
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true, // Asegura que las etiquetas no se corten
    },
    xAxis: {
      type: 'value',
      axisLabel: {
        color: '#FFFFFF', // Blanco para las etiquetas del eje X
        formatter: '{value}',
      },
      splitLine: {
        lineStyle: {
          color: '#333', // Color de las líneas de la cuadrícula (un poco más oscuro para mejor contraste)
          type: 'dashed',
        },
      },
    },
    yAxis: {
      type: 'category',
      data: productNames,
      axisLabel: {
        color: '#FFFFFF', // Blanco para las etiquetas del eje Y
        fontSize: 12,
        formatter: function (value: string) {
          // Trunca nombres largos si es necesario
          return value.length > 20 ? value.substring(0, 17) + '...' : value;
        }
      },
      axisTick: {
        alignWithLabel: true,
      },
    },
    series: [
      {
        name: 'Unidades Vendidas',
        type: 'bar',
        data: productValues,
        itemStyle: {
          // Un gradiente atractivo para las barras
          color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
            { offset: 0, color: '#6A5ACD' }, // Un púrpura medio
            { offset: 1, color: '#483D8B' }, // Un púrpura oscuro
          ]),
          borderRadius: [0, 5, 5, 0], // Bordes redondeados en el extremo derecho
        },
        label: {
          show: true,
          position: 'right', // Posición del valor sobre la barra
          valueAnimation: true,
          color: '#FFFFFF', // Blanco para las etiquetas de valor sobre las barras
          formatter: '{c}',
        },
      },
    ],
  };
});
</script>

<style scoped>
.product-ranking-chart {
  min-height: 400px; /* Altura mínima para que sea visible */
  width: 100%;
  padding: 45px 0px;
  /* Considera añadir un background oscuro aquí si el contenedor padre no lo tiene */
  /* background-color: #282828; */ /* Ejemplo de fondo oscuro para el gráfico */
  /* border-radius: 8px; */ /* Si quieres bordes redondeados para el contenedor del gráfico */
}
</style>
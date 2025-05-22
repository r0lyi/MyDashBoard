<template>
  <div class="box-realTimeChart">
    <VueApexCharts height="100%" :options="chartOptions" :series="series" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import VueApexCharts from 'vue3-apexcharts';

// Props
const props = defineProps<{
  series: { name: string; data: { x: number; y: number }[] }[];
  title?: string;
  kpiTarget?: number; // El objetivo de rendimiento, por ejemplo, latencia máxima aceptable
  color?: string;
  unit?: string; // Nueva prop para la unidad (ej. 'ms', '%')
}>();

// Valores por defecto
const title = computed(() => props.title ?? '📡 Rendimiento en Tiempo Real');
const chartColor = computed(() => props.color ?? '#3b82f6'); // Un azul más estándar para datos
const kpiTarget = computed(() => props.kpiTarget ?? 200); // Latencia ideal: menos de 200ms
const unit = computed(() => props.unit ?? 'ms'); // Unidad por defecto: milisegundos

// Opciones del gráfico
const chartOptions = computed(() => ({
  chart: {
    id: 'realtime',
    type: 'line',
    animations: {
      enabled: true,
      easing: 'linear',
      dynamicAnimation: {
        speed: 1000,
      },
    },
    toolbar: { show: false },
    zoom: { enabled: false },
  },
  dataLabels: { enabled: false },
  stroke: { curve: 'smooth', width: 3 },
  colors: [chartColor.value],
  fill: {
    type: 'gradient',
    gradient: {
      shade: 'dark', // Cambiado a 'dark' para mejor contraste en fondo oscuro
      type: 'vertical',
      opacityFrom: 0.85,
      opacityTo: 0.55,
      stops: [0, 100],
    },
  },
  title: {
    text: title.value,
    align: 'left',
    style: {
      fontSize: '16px',
      fontWeight: 'bold',
      color: '#B9B8CE', // Color de texto para el título, más claro
    },
  },
  markers: {
    size: 0,
    hover: { size: 4, sizeOffset: 3 },
  },
  xaxis: {
    type: 'datetime',
    range: 10000, // Rango de 10 segundos
    labels: {
      style: { colors: '#B9B8CE' }, // Color de las etiquetas del eje X
      datetimeFormatter: {
        hour: 'HH:mm',
        minute: 'HH:mm:ss',
      },
    },
    axisBorder: { show: false },
    axisTicks: { show: false },
  },
  yaxis: {
    // max: 100, // Ya no es fijo a 100, se adapta al contenido
    tickAmount: 5,
    forceNiceScale: true,
    labels: {
      style: { colors: '#B9B8CE' }, // Color de las etiquetas del eje Y
      formatter: (val: number) => `${val.toFixed(0)}${unit.value}`, // Formato con la unidad
    },
  },
  legend: { show: false },
  tooltip: {
    x: { format: 'HH:mm:ss' },
    y: {
      formatter: (val: number) => `${val.toFixed(0)}${unit.value}`, // Formato del tooltip con la unidad
      title: {
        formatter: (seriesName: string) => seriesName,
      },
    },
    theme: 'dark',
  },
  grid: {
    borderColor: '#334155', // Un gris oscuro para la cuadrícula
    strokeDashArray: 5,
    padding: { left: 10, right: 10, top: 0, bottom: 0 }, // Ajuste de padding
  },
  annotations: {
    yaxis: [
      {
        y: kpiTarget.value,
        borderColor: '#FF0000', // Rojo para el KPI si es un umbral crítico
        borderWidth: 2,
        label: {
          borderColor: '#FF0000',
          style: { color: '#fff', background: '#FF0000' },
          text: `Umbral Crítico - ${kpiTarget.value}${unit.value}`, // Texto del KPI más claro
        },
      },
    ],
  },
}));
</script>

<style scoped>
.box-realTimeChart {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 290px;
  width: 100%;
  /* Padding y background serán manejados por el contenedor .box en TecnicoPage.vue */
}
</style>
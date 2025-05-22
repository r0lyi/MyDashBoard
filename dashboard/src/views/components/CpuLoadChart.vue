<template>
  <div class="cpu-load-chart-container">
    <ApexCharts
      type="bar"
      :options="chartOptions"
      :series="series"
      height="100%"
      width="100%"
    ></ApexCharts>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import ApexCharts from 'vue3-apexcharts';

// Definir props
const props = withDefaults(defineProps<{
  title?: string;
  color?: string;
  min?: number;
  max?: number;
  unit?: string;
  series: { name: string; data: { x: number; y: number }[] }[];
  maxDataPoints?: number;
}>(), {
  title: 'Carga de Procesador',
  color: '#26a69a',
  min: 0,
  max: 100,
  unit: '%',
  series: () => [{ name: 'Carga', data: [] }],
  maxDataPoints: 30,
});

const chartOptions = computed(() => ({
  chart: {
    id: 'cpu-load-chart',
    type: 'bar',
    animations: {
      // **¡CAMBIO CLAVE AQUÍ!**
      // Desactivamos 'enabled' para la carga inicial.
      // Las animaciones dinámicas se habilitan internamente por ApexCharts
      // si 'dynamicAnimation.enabled' es true y el gráfico es de tiempo real.
      enabled: false, // Desactivar todas las animaciones al inicio
      easing: 'linear',
      dynamicAnimation: {
        enabled: true, // Permitir animación para la adición de nuevos puntos
        speed: 1000,
      },
      animateGradually: {
        enabled: false, // Asegurarnos de que no haya animación gradual
      },
      enabledOnStartup: false, // Deshabilitar animaciones al inicio del gráfico
    },
    toolbar: {
      show: false,
    },
    zoom: {
      enabled: false,
    },
    background: '#2a2a2a',
    parentHeightOffset: 0,
    parentWidthOffset: 0,
    padding: {
      top: 15,
      right: 15,
      bottom: 15,
      left: 15,
    },
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '85%',
      endingShape: 'flat',
      colors: {
        ranges: [{
          from: 0,
          to: 100,
          color: props.color,
          gradient: {
            enabled: true,
            type: 'vertical',
            shadeIntensity: 0.7,
            opacityFrom: 0.9,
            opacityTo: 0.2,
            stops: [0, 100]
          }
        }]
      }
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    show: false,
  },
  colors: [props.color],
  fill: {
    opacity: 1,
    type: 'solid',
  },
  xaxis: {
    type: 'datetime',
    labels: {
      datetimeUTC: false,
      formatter: function(val: string) {
        return new Date(val).toLocaleTimeString('es-ES');
      },
      style: {
        colors: '#B9B8CE',
        fontSize: '11px',
      },
      hideOverlappingLabels: true,
      rotate: -45,
      rotateAlways: true,
      offsetX: 0,
      offsetY: 0,
    },
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
    crosshairs: {
      show: false,
    },
    tooltip: {
      enabled: false,
    },
  },
  yaxis: {
    min: props.min,
    max: props.max,
    labels: {
      formatter: function(val: number) {
        return `${val.toFixed(0)}${props.unit}`;
      },
      style: {
        colors: '#B9B8CE',
        fontSize: '11px',
      },
    },
    title: {
      text: undefined,
    },
    axisTicks: {
      show: true,
    },
    axisBorder: {
      show: true,
      color: 'rgba(203, 213, 225, 0.1)',
    },
  },
  grid: {
    show: true,
    borderColor: 'rgba(203, 213, 225, 0.1)',
    strokeDashArray: 0,
    position: 'back',
    xaxis: {
      lines: {
        show: true,
      },
    },
    yaxis: {
      lines: {
        show: true,
      },
    },
    padding: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    },
  },
  tooltip: {
    x: {
      format: 'HH:mm:ss',
    },
    y: {
      formatter: function(val: number) {
        return `${val.toFixed(2)}${props.unit}`;
      },
    },
    theme: 'dark',
    style: {
      fontSize: '12px',
      fontFamily: 'inherit',
    },
  },
  title: {
    text: props.title,
    align: 'left',
    margin: 10,
    offsetX: 5,
    offsetY: 0,
    floating: false,
    style: {
      fontSize: '18px',
      fontWeight: 'bold',
      fontFamily: 'inherit',
      color: '#F0F0F0',
    },
  },
}));
</script>

<style scoped>
.cpu-load-chart-container {
  width: 100%;
  height: 100%;
 
}
</style>
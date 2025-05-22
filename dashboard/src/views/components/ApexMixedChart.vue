<template>
  <div class="box-mixedChart">
    <VueApexCharts height="100%" :options="computedOptions" :series="series" />
  </div>
</template>

<script setup lang="ts">
import VueApexCharts from 'vue3-apexcharts';
import { withDefaults, defineProps, computed } from 'vue';

const props = withDefaults(defineProps<{
  series: ApexAxisChartSeries;
  titleText: string;
  categoryLabels: string[];
  chartType?: 'line' | 'bar' | 'area';
  colors?: string[];
  yAxisTitle?: string;
  isStacked?: boolean;
}>(), {
  titleText: 'Métricas de Clientes',
  categoryLabels: () => [],
  chartType: 'bar',
  colors: () => ['#0396FF', '#DA70D6', '#3CB371', '#FFA500', '#DA70D6'],
  yAxisTitle: '',
  isStacked: false,
});

const baseChartOptions: ApexCharts.ApexOptions = {
  chart: {
    type: props.chartType,
    stacked: props.isStacked,
    background: 'transparent',
    toolbar: { show: false },
    zoom: { enabled: false },
    fontFamily: 'Roboto, sans-serif',
  },
  theme: {
    mode: 'dark',
    palette: 'palette1',
    monochrome: { enabled: false }
  },
  title: {
    text: props.titleText,
    align: 'left',
    margin: 15,
    style: {
      fontSize: '20px',
      fontWeight: 'bold',
      color: '#F0F0F0',
    },
  },
  stroke: {
    width: [0, 2],
    curve: 'smooth'
  },
  plotOptions: {
    bar: {
      columnWidth: '40%',
      borderRadius: 5,
      dataLabels: {
        position: 'top',
      }
    }
  },
  dataLabels: {
    enabled: false,
    offsetY: -20,
    style: { fontSize: '12px', colors: ['#F0F0F0'] },
    background: {
      enabled: true, foreColor: '#222', padding: 4, borderRadius: 2,
      borderWidth: 1, borderColor: '#444', opacity: 0.9,
    }
  },
  fill: {
    opacity: 1,
    gradient: {
      inverseColors: false, shade: 'light', type: 'vertical',
      opacityFrom: 0.85, opacityTo: 0.55, stops: [0, 100, 100, 100],
    }
  },
  labels: props.categoryLabels,
  markers: {
    size: 4, // PROPIEDADES VÁLIDAS PARA markers (puntos de datos)
    strokeWidth: 2,
    hover: { sizeOffset: 2 }
    // NO SE USAN width, height, radius AQUÍ
  },
  xaxis: {
    type: 'category',
    labels: {
      style: { colors: '#B0B0B0', fontSize: '13px' },
      rotate: -45,
      rotateAlways: false,
      hideOverlappingLabels: true,
    },
    axisBorder: { show: false },
    axisTicks: { show: false },
  },
  yaxis: {
    labels: {
      style: { colors: '#B0B0B0', fontSize: '13px' },
      formatter: (val: number) => Math.round(val).toLocaleString('es-ES'),
    },
    title: {
      text: '', // Valor por defecto
      style: { color: '#B0B0B0', fontWeight: 'normal', fontSize: '14px' }
    },
    tooltip: { enabled: true }
  },
  grid: {
    show: true,
    borderColor: '#444',
    strokeDashArray: 3,
    xaxis: { lines: { show: false } },
    yaxis: { lines: { show: true } },
    padding: { top: 0, right: 20, bottom: 0, left: 20 },
  },
  legend: {
    show: true,
    position: 'bottom',
    horizontalAlign: 'center',
    fontSize: '13px',
    labels: { colors: '#F0F0F0' },
   
    itemMargin: { horizontal: 10, vertical: 5 },
    onItemClick: { toggleDataSeries: true },
  },
  tooltip: {
    shared: true,
    intersect: false,
    theme: 'dark',
    style: { fontSize: '13px' },
    y: {
      formatter: (val: number | null, { seriesIndex, w }) => {
        if (val === null) return '';
        const seriesName = w.globals.seriesNames[seriesIndex];
        if (seriesName.includes('Inscritos') || seriesName.includes('Total')) {
            return `${Math.round(val).toLocaleString('es-ES')} personas`;
        }
        return `${Math.round(val).toLocaleString('es-ES')}`;
      }
    }
  },
  responsive: [
    {
      breakpoint: 768,
      options: {
        title: { style: { fontSize: '18px' } },
        legend: { position: 'bottom', horizontalAlign: 'center' },
        xaxis: { labels: { rotate: 0, trim: true } }
      }
    }
  ]
};

const computedOptions = computed(() => {
  let yaxisOptions: ApexYAxis = {};

  if (Array.isArray(baseChartOptions.yaxis)) {
    yaxisOptions = JSON.parse(JSON.stringify(baseChartOptions.yaxis[0] || {}));
  } else if (baseChartOptions.yaxis) {
    yaxisOptions = JSON.parse(JSON.stringify(baseChartOptions.yaxis));
  }

  if (!yaxisOptions.title) {
    yaxisOptions.title = { text: '' };
  }

  yaxisOptions.title.text = props.yAxisTitle;

  return {
    ...baseChartOptions,
    chart: {
      ...baseChartOptions.chart,
      type: props.chartType,
      stacked: props.isStacked,
    },
    title: { ...baseChartOptions.title, text: props.titleText },
    labels: props.categoryLabels,
    colors: props.colors,
    yaxis: yaxisOptions
  };
});
</script>

<style scoped>
.box-mixedChart{
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 290px;
  width: 100%;
  padding: 16px;
  background-color: #1E1E1E;
  border-radius: 5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  overflow: hidden;
}
</style>
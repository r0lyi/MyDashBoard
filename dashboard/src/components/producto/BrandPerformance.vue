<template>
  <div class="apexchart-container">
    <apexchart
      type="radar"
      :options="chartOptions"
      :series="seriesData"
    />
  </div>
</template>

<script setup lang="ts">
import type { ApexOptions, ApexAxisChartSeries } from 'apexcharts';
import type { PropType } from 'vue';

interface ChartConfiguration {
  chart: ApexOptions['chart'];
  title: ApexOptions['title'];
  xaxis: ApexOptions['xaxis'];
  yaxis: ApexOptions['yaxis'];
  [key: string]: unknown;
}

defineProps({
  seriesData: {
    type: Array as PropType<ApexAxisChartSeries>,
    required: true,
    validator: (value: ApexAxisChartSeries) => value.every(serie => 
      Array.isArray(serie.data) && serie.data.length > 0
    )
  },
  chartOptions: {
    type: Object as PropType<ApexOptions>,
    default: (): ChartConfiguration => ({
      chart: {
        id: 'brand-performance-chart',
        type: 'radar',
        height: '100%',
        width: '100%',
        toolbar: { 
          show: false 
        },
        parentHeightOffset: 0,
        animations: {
          enabled: true,
          easing: 'easeout',
          speed: 800
        },
        dropShadow: {
          enabled: true,
          blur: 8,
          left: 1,
          top: 1
        }
      },
      title: {
        text: 'Brand Performance Analysis',
        align: 'left',
        style: {
          fontSize: '18px',
          fontWeight: '600',
          color: '#2D3748',
          fontFamily: 'Inter, sans-serif'
        }
      },
      xaxis: {
        categories: ['Sales (%)', 'Rating (%)', 'Physical Stores (%)'],
        labels: {
          style: {
            fontSize: '12px',
            fontWeight: '500',
            colors: '#4A5568',
            fontFamily: 'Inter, sans-serif'
          }
        }
      },
      yaxis: {
        tickAmount: 4,
        min: 0,
        max: 100,
        labels: {
          style: {
            colors: '#718096',
            fontSize: '10px',
            fontFamily: 'Inter, sans-serif'
          },
          formatter: (val: number) => `${Math.round(val)}%`
        }
      },
      plotOptions: {
        radar: {
          polygons: {
            strokeColors: '#E2E8F0',
            fill: {
              colors: ['#F8FAFC', '#fff']
            },
            connectorColors: '#E2E8F0'
          }
        }
      },
      markers: {
        size: 5,
        colors: '#fff',
        strokeColors: ['#4299E1', '#48BB78', '#9F7AEA'],
        strokeWidth: 2
      },
      tooltip: {
        theme: 'light',
        style: {
          fontSize: '12px',
          fontFamily: 'Inter, sans-serif'
        },
        y: {
          formatter: (val: number) => `${val}%`
        }
      },
      legend: {
        position: 'top',
        horizontalAlign: 'left',
        fontSize: '14px',
        fontWeight: 600,
        fontFamily: 'Inter, sans-serif',
        itemMargin: {
          horizontal: 20
        }
      },
      dataLabels: {
        enabled: true,
        style: {
          fontSize: '10px',
          fontWeight: '600',
          fontFamily: 'Inter, sans-serif'
        },
        background: {
          enabled: true,
          foreColor: '#fff',
          padding: 4,
          borderRadius: 2,
          borderWidth: 1,
          borderColor: '#fff',
          opacity: 0.9
        }
      },
      colors: ['#4299E1', '#48BB78', '#9F7AEA'],
      fill: {
        opacity: 0.2,
        type: 'solid'
      },
      stroke: {
        width: 2,
        curve: 'smooth'
      },
      responsive: [{
        breakpoint: 768,
        options: {
          chart: {
            height: '300px'
          },
          title: {
            style: {
              fontSize: '16px'
            }
          },
          legend: {
            position: 'bottom'
          }
        }
      }]
    })
  }
});
</script>

<style scoped>
.apexchart-container {
  --chart-height: 42vh;
  --primary-color: #4299E1;

  width: 100%;
  height: var(--chart-height);
  min-height: 300px;
  position: relative;
  background-color: #ffffff;
  border-radius: 0.75rem;
  padding: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.apexchart-container :deep(.apexcharts) {
  width: 100%;
  height: 100%;
}

@media (max-width: 768px) {
  .apexchart-container {
    --chart-height: 55vh;
    padding: 0.5rem;
  }
}
</style>
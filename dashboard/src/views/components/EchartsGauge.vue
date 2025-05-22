<template>
  <VEChart class="gauge-chart" :option="options" autoresize />
</template>

<script setup lang="ts">
import { use } from "echarts/core";
import VEChart from "vue-echarts";
import { GaugeChart } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";
import { TooltipComponent } from "echarts/components";
import { ref, watchEffect } from "vue";
import type { EChartsOption } from 'echarts'; // Importa el tipo EChartsOption

// Registrar los módulos necesarios de ECharts
use([GaugeChart, CanvasRenderer, TooltipComponent]);

// Definimos las props, asegurándonos de que 'value' es de tipo number y es reactiva
const props = defineProps<{ value: number, title?: string }>();

// 🌡️ Configuración Gauge - Usamos EChartsOption para el tipado
const options = ref<EChartsOption>({});

// watchEffect reacciona a los cambios en props.value
watchEffect(() => {
  options.value = {
    series: [
      {
        type: 'gauge',
        center: ['50%', '55%'],
        radius: '95%',
        min: 0,
        max: 100,
        axisLine: {
          lineStyle: {
            width: 20,
            color: [
              [0.2, "#E53935"], // Rojo vibrante para baja satisfacción
              [0.69, "#FFC107"], // Amarillo-naranja para satisfacción media
              [1, "#4CAF50"], // Verde para alta satisfacción
            ]
          }
        },
        pointer: {
          itemStyle: {
            color: 'auto'
          },
          length: '60%'
        },
        axisTick: {
          distance: -20,
          length: 4,
          lineStyle: {
            color: '#FFFFFF', // Blanco puro para las marcas de los ticks
            width: 1
          }
        },
        splitLine: {
          distance: -20,
          length: 20,
          lineStyle: {
            color: '#FFFFFF', // Blanco puro para las líneas de división
            width: 2
          }
        },
        axisLabel: {
          color: '#FFFFFF', // Blanco puro para las etiquetas de los valores (0, 20, 40...)
          distance: 28,
          fontSize: 15,
          formatter: function (value: number) {
            // Muestra etiquetas solo para valores múltiplos de 20
            return value % 20 === 0 ? String(value) : '';
          }
        },
        detail: {
          valueAnimation: true, // Animación para el valor
          formatter: '{value}%', // Mostrar el valor con un símbolo de porcentaje
          color: '#FFFFFF', // Blanco puro para el valor principal
          fontSize: 35, // Aumentado para que sea más legible
          fontWeight: 'bold', // Para que resalte más
          offsetCenter: [0, '20%']
        },
        data: [
          {
            value: props.value, // El valor que viene de la prop
            name: props.title ?? 'Nivel de Satisfacción', // Título de la métrica
            title: {
              color: '#FFFFFF', // Blanco puro para el título de la métrica
              fontSize: 16, // Tamaño de fuente para el título de la métrica
              fontWeight: 'normal',
              offsetCenter: [0, "72%"]
            }
          }
        ]
      }
    ]
  };
});
</script>

<style scoped>
.gauge-chart {
  min-height: 300px;
  width: 100%; 
}
</style>
<template>
  <div class="temperature-gauge-container">
    <ApexCharts
      type="radialBar"
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

const props = withDefaults(defineProps<{
  title?: string;
  currentTemperature: number;
  minTemp?: number;
  maxTemp?: number;
  unit?: string;
  minWarning?: number;
  maxCritical?: number;
}>(), {
  title: 'Temp. Servidor',
  currentTemperature: 0,
  minTemp: 20,
  maxTemp: 90,
  unit: '°C',
  minWarning: 60,
  maxCritical: 80,
});

// La serie para el radialBar es un array con un único valor (el porcentaje de llenado)
const series = computed(() => {
  // Convertimos la temperatura actual a un porcentaje dentro del rango minTemp - maxTemp
  const range = props.maxTemp - props.minTemp;
  const percentage = ((props.currentTemperature - props.minTemp) / range) * 100;
  return [Math.max(0, Math.min(100, percentage))]; // Asegurar que esté entre 0 y 100
});

// Determinar el color del medidor basado en los umbrales
const gaugeColor = computed(() => {
  if (props.currentTemperature >= props.maxCritical) {
    return '#dc3545'; // Rojo para crítico
  } else if (props.currentTemperature >= props.minWarning) {
    return '#ffc107'; // Naranja para advertencia
  } else {
    return '#28a745'; // Verde para normal
  }
});

const chartOptions = computed(() => ({
  chart: {
    id: 'system-temperature-gauge',
    type: 'radialBar',
    animations: {
      enabled: false, // Desactivar animaciones de carga inicial
      easing: 'linear',
      dynamicAnimation: {
        enabled: true, // Habilitar animación dinámica para el cambio de valor
        speed: 500, // Velocidad de la animación del medidor
      },
      animateGradually: {
        enabled: false,
      },
      enabledOnStartup: false,
    },
    toolbar: {
      show: false,
    },
    zoom: {
      enabled: false,
    },
    background: '#2a2a2a', // Fondo igual al de los otros gráficos
    parentHeightOffset: 0,
    parentWidthOffset: 0,
  },
  plotOptions: {
    radialBar: {
      startAngle: -135, // Ángulo de inicio para una apariencia de medidor
      endAngle: 135,   // Ángulo de fin
      hollow: {
        margin: 0,
        size: '70%', // Tamaño del hueco central
        background: 'transparent',
      },
      track: {
        show: true,
        background: '#4a4a4a', // Color del fondo de la pista del medidor
        strokeWidth: '97%',
        opacity: 1,
        margin: 0,
      },
      dataLabels: {
        show: true,
        name: {
          show: true,
          fontSize: '14px',
          fontWeight: 600,
          offsetY: -10, // Ajustar posición del nombre
          color: '#B9B8CE',
          formatter: function (val: string) {
            return props.title; // Mostrar el título como nombre
          },
        },
        value: {
          show: true,
          fontSize: '28px', // Tamaño grande para el valor de la temperatura
          fontWeight: 700,
          color: '#F0F0F0',
          offsetY: 8, // Ajustar posición del valor
          formatter: function (val: number) {
            // Formatear el valor real de la temperatura, no el porcentaje
            return `${props.currentTemperature.toFixed(1)}${props.unit}`;
          },
        },
      },
    },
  },
  fill: {
    type: 'solid',
    colors: [gaugeColor.value], // Usar el color computado
  },
  stroke: {
    lineCap: 'round', // Tapas redondeadas para la barra
  },
  labels: [props.title], // Etiqueta principal (usada si dataLabels.name.show es false)
  // Añadir anotaciones para los umbrales si queremos líneas o puntos en el medidor
  // (Aunque en radialBar es más común usar los colores y el valor, no líneas directas)
  // Para este caso, el cambio de color ya es el indicador principal.
}));
</script>

<style scoped>
.temperature-gauge-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0; /* Asegurarse de que el componente ocupe todo el espacio disponible */
  margin: 0;
  overflow: hidden;
  min-width: 0;
  min-height: 0;
}
</style>
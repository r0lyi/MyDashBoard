<template>
  <VEChart class="map-chart" :option="mapOptions" autoresize />
</template>

<script setup lang="ts">
import { ref, watchEffect, onMounted } from 'vue';

// Echarts
import VEChart from "vue-echarts";
import * as echarts from "echarts/core";
import { MapChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import { TooltipComponent, VisualMapComponent, TitleComponent, ToolboxComponent } from 'echarts/components';

// GeoMap
// Asegúrate de que la ruta sea correcta. Si 'assets' está al mismo nivel que 'components',
// entonces podría ser '../assets/europe.geo.json' o ajustar según tu estructura real.
import europeMap from "@/assets/europe.geo.json"; 

const props = withDefaults(defineProps<{
  title?: string;
  subtitle?: string;
  data: { name: string; value: number }[]; // 'name' será el nombre del país, 'value' la métrica (ej. ventas)
  minDataValue?: number; // Valor mínimo para el visualMap
  maxDataValue?: number; // Valor máximo para el visualMap
}>(), {
  title: 'Distribución de Ventas en Europa',
  subtitle: 'Ventas o Clientes por País',
  data: () => [],
  minDataValue: 0, // Por defecto, empieza en 0
  maxDataValue: 10000 // Por defecto, un valor razonable para ventas/clientes
});

// Registrar módulos necesarios de ECharts
echarts.use([MapChart, CanvasRenderer, TooltipComponent, VisualMapComponent, TitleComponent, ToolboxComponent]);

// Registrar el mapa de Europa en ECharts, ajustando Islandia
onMounted(() => {
  echarts.registerMap("europe", europeMap as any, {
    Iceland: {
      left: -20,
      top: 65,
      width: 12
    }
  });
});

const mapOptions = ref({});

watchEffect(() => {
  mapOptions.value = {
    title: {
      text: props.title,
      subtext: props.subtitle,
      left: "left",
      textStyle: {
        color: "#FFFFFF", // Blanco para el título principal
        fontSize: 18, // Ligeramente más grande
        fontWeight: "bold"
      },
      subtextStyle: {
        color: "#CCCCCC", // Blanco ligeramente más suave para el subtítulo
        fontSize: 14,
      },
    },
    toolbox: {
      show: true,
      left: 'right',
      top: 'top',
      iconStyle: { // Estilo de los iconos del toolbox
        borderColor: '#FFFFFF', // Blanco para los bordes de los iconos
      },
      emphasis: { // Estilo al pasar el ratón por encima
        iconStyle: {
          borderColor: 'var(--ion-color-primary)', // Color de acento al pasar el ratón
        }
      },
      feature: {
        dataView: {
          readOnly: false,
          backgroundColor: "#282828", // Fondo oscuro para la vista de datos
          textareaColor: "#282828", // Fondo del área de texto
          textColor: "#FFFFFF", // Texto blanco dentro de la vista de datos
          buttonColor: "var(--ion-color-primary)", // Botones con color de acento
          buttonTextColor: "#FFFFFF", // Texto de los botones blanco
          lang: ['Datos', 'Cerrar', 'Actualizar'],
        },
        restore: {
          iconStyle: { borderColor: '#FFFFFF' }, // Asegura que el icono de restore también sea blanco
          emphasis: { iconStyle: { borderColor: 'var(--ion-color-primary)' } }
        },
        saveAsImage: {
          iconStyle: { borderColor: '#FFFFFF' }, // Asegura que el icono de saveAsImage también sea blanco
          emphasis: { iconStyle: { borderColor: 'var(--ion-color-primary)' } }
        }
      }
    },
    tooltip: {
      trigger: "item",
      formatter: '{b}<br/>Ventas: {c}€', // Formato del tooltip: Nombre del país y valor con '€'
      textStyle: {
        color: '#FFFFFF', // Color del texto del tooltip blanco
      },
      backgroundColor: 'rgba(40, 40, 40, 0.9)', // Fondo oscuro semitransparente para el tooltip
      borderColor: 'var(--ion-color-primary)', // Borde del tooltip con el color de acento
      borderWidth: 1,
    },
    visualMap: {
      min: props.minDataValue,
      max: props.maxDataValue,
      left: "left",
      top: "bottom",
      text: ["Más", "Menos"],
      textStyle: { color: "#FFFFFF" }, // Blanco para el texto del visualMap
      calculable: true,
      // Paleta de azules-morados más sofisticada
      inRange: { 
        color: ["#1A1A40", "#3A2E80", "#5A42BF", "#7A56FF", "#9A73FF"] // Tonos que van de azul-morado oscuro a más claro
      }, 
      outOfRange: {
        color: ['rgba(150, 150, 150, 0.1)'] // Color para países sin datos (gris muy claro transparente)
      }
    },
    series: [
      {
        name: "Ventas / Clientes", // Nombre de la serie para el tooltip
        type: "map",
        map: "europe",
        roam: true, // Permitir zoom y desplazamiento
        emphasis: {
          label: {
            show: true,
            color: '#FFFFFF' // Blanco para la etiqueta del país al pasar el ratón
          },
          itemStyle: {
            areaColor: 'var(--ion-color-primary)', // Color de acento al pasar el ratón
            borderColor: '#FFFFFF', // Borde blanco al pasar el ratón
            borderWidth: 1
          }
        },
        itemStyle: {
          areaColor: 'rgba(30, 30, 30, 0.7)', // Color por defecto para países sin datos (gris oscuro transparente)
          borderColor: 'rgba(255, 255, 255, 0.3)', // Borde blanco sutil
          borderWidth: 0.5
        },
        data: props.data, // Conectar datos con el mapa
      },
    ],
  };
});
</script>

<style scoped>
.map-chart {
  min-height: 400px; /* Altura mínima para que el mapa sea visible */
  width: 100%;
  padding: 50px 0px;
  /* Si el contenedor padre no tiene fondo oscuro, puedes añadirlo aquí */
  /* background-color: #282828; */
  /* border-radius: 8px; */ /* Opcional: bordes redondeados para el contenedor del gráfico */
}
</style>
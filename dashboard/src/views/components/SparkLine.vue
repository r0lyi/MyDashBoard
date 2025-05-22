<template>
  <div :class="['box-sparkline', bgColor, textColor]">
    <div class="details">
      <div>
        <ion-icon :name="iconName"></ion-icon>
        <span>{{title}}</span>
      </div>
      <span>{{value}}</span>
    </div>
    <vapexChart
      class="sparkline-chart"
      :height="chartHeight"
      :options="chartOptions"
      :series="chartSeries">
    </vapexChart>
  </div>
</template>

<script setup lang="ts">
import { IonIcon } from '@ionic/vue';
import { addIcons } from 'ionicons';
// 📌 Iconos existentes (negocio y deporte)
import { navigateOutline, logoIonic, eyeOutline, peopleOutline, cashOutline } from 'ionicons/icons';
import {
  footballOutline, basketballOutline, tennisballOutline,
  barbellOutline, bicycleOutline, shirtOutline,
  statsChartOutline, trophyOutline, walletOutline,
  trendingUpOutline, trendingDownOutline, pulseOutline,
  flashOutline, diamondOutline
} from 'ionicons/icons';

// ⚙️🌟 NUEVOS Iconos relevantes para TEMAS TÉCNICOS
import {
  bugOutline, // Para errores
  serverOutline, // Para servidor, tráfico
  timeOutline, // Para tiempo de carga, latencia
  cloudOutline, // Para servicios en la nube, almacenamiento
  syncOutline, // Para actualizaciones, sincronización
  shieldCheckmarkOutline, // Para seguridad, SSL
  codeSlashOutline, // Para desarrollo, código
  analyticsOutline, // Para análisis, métricas
  speedometerOutline, // Para rendimiento, velocidad
  albumsOutline, // Para almacenamiento, bases de datos
  swapHorizontalOutline, // Para transacciones, transferencias
  alertCircleOutline, // Para alertas, advertencias
  barChartOutline, // Para uso general de gráficos
  desktopOutline // Para sesiones, dispositivos
} from 'ionicons/icons';

import vapexChart from 'vue3-apexcharts';
import { ref, watchEffect, onUnmounted } from 'vue';

// 📌 Registrar iconos (incluyendo todos los nuevos)
addIcons({
  'logo-ionic': logoIonic,
  'navigate-outline': navigateOutline,
  'eye-outline': eyeOutline,
  'people-outline': peopleOutline,
  'cash-outline': cashOutline,
  'football-outline': footballOutline,
  'basketball-outline': basketballOutline,
  'tennisball-outline': tennisballOutline,
  'barbell-outline': barbellOutline,
  'bicycle-outline': bicycleOutline,
  'shirt-outline': shirtOutline,
  'stats-chart-outline': statsChartOutline,
  'trophy-outline': trophyOutline,
  'wallet-outline': walletOutline,
  'trending-up-outline': trendingUpOutline,
  'trending-down-outline': trendingDownOutline,
  'pulse-outline': pulseOutline,
  'flash-outline': flashOutline,
  'diamond-outline': diamondOutline,
  // ⚙️🌟 Registro de NUEVOS iconos técnicos
  'bug-outline': bugOutline,
  'server-outline': serverOutline,
  'time-outline': timeOutline,
  'cloud-outline': cloudOutline,
  'sync-outline': syncOutline,
  'shield-checkmark-outline': shieldCheckmarkOutline,
  'code-slash-outline': codeSlashOutline,
  'analytics-outline': analyticsOutline,
  'speedometer-outline': speedometerOutline,
  'albums-outline': albumsOutline,
  'swap-horizontal-outline': swapHorizontalOutline,
  'alert-circle-outline': alertCircleOutline,
  'bar-chart-outline': barChartOutline,
  'desktop-outline': desktopOutline,
});

// 📌 Definir Props para datos dinámicos
defineProps({
  title: { type: String, default: 'Métrica',  },
  value: { type: String, default: '#Valor',   },
  chartOptions: {type: Object, required: true, }, // Se espera un objeto de configuración de ApexCharts
  chartSeries: { type: Array, required: true, }, // Se espera un array con los datos de la serie
  bgColor: { type: String, default: '', },
  textColor: { type: String, default: '', },
  iconName: { type: String, default: 'logo-ionic', },
});

/******* Control altura gráfico según ancho ********************/

const chartHeight = ref("50%");

// Función que ajusta la altura dinámicamente
const updateChartHeight = () => {
  const width = window.innerWidth;

  if (width < 576) chartHeight.value = "30%"; // Breakpoint xs
  else if (width < 768) chartHeight.value = "40%"; // Breakpoint sm
  else chartHeight.value = "50%"; // Breakpoint md y superiores
};

// Ejecutar al cargar y escuchar cambios en el tamaño de la ventana
watchEffect(() => {
  updateChartHeight();
  window.addEventListener("resize", updateChartHeight);
});

// Limpiar el listener cuando el componente se desmonta
onUnmounted(() => {
  window.removeEventListener("resize", updateChartHeight);
});

/************************************************************ */

</script>

<style scoped>
/* Mobile first */

.box-sparkline{
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  width: 100%;
  padding: 16px;
  border-radius:5px;
  container: box / inline-size;
}

.details{
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.details > div{
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.details > div > ion-icon{
  font-size: 2rem;
  --ionicon-stroke-width: 24px;
}

.details > div > span{ font-size: .8rem; }
.details > span{ font-size: 2.9rem; }

.sparkline-chart {
  min-width: 50px;
  width: 100%;
}

/* Siendo más ancho, pasamos dato a la derecha de título */

@container box (width >= 324px) {
  .details{
    flex-direction: row;
    justify-content: space-start;
    align-items: start;
    gap: 16px;
  }

  .details > span {
    font-size: 6cqmax;
  }
  .details > div > ion-icon{
    font-size: 4cqmax;
  }
  .details > div > span{
    font-size: 2cqmax;
  }
}

/* 🖥️ En pantallas grandes (>=lg=992) */
@media (min-width: 992px) {
  /* Si el componente no es muy ancho: detalles izquierda, datos derecha*/
  @container box (width <= 356px){
    .details{
      flex-direction: row;
      justify-content: space-start;
      align-items: start;
      gap: 16px;
    }
   /* Para anchos de contenedores muy pequeños */
    .details > span {
      font-size: max(1.7rem, 16cqw);
    }
    .details > div > ion-icon{
      font-size: max(1.7rem, 5cqw);
    }
    .details > div > span{
      font-size: max(0.8rem, 5cqw);
    }
  }
}

/* 🎨 Colores de fondo */
.gradient-blue {background-image: linear-gradient( 135deg, #071c49 10%, #0396FF 100%);}
.gradient-green {background-image: linear-gradient( 135deg, #054d43 10%, #6be084 100%);}
.gradient-orange {background-image: linear-gradient( 135deg, #f31b4a 10%, #e78f30 100%);}
.gradient-pink {background-image: linear-gradient( 135deg, #383ead 10%, #EE9AE5 100%);}
/* ⚙️🌟 NUEVOS GRADIENTES TÉCNICOS */
.gradient-red-dark {background-image: linear-gradient( 135deg, #4d0b0b 10%, #FF6347 100%);} /* Para errores */
.gradient-gray-blue {background-image: linear-gradient( 135deg, #1f2f47 10%, #5d7594 100%);} /* Para tráfico/servidor */
.gradient-dark-purple {background-image: linear-gradient( 135deg, #3b074a 10%, #9932CC 100%);} /* Para rendimiento */
.gradient-teal {background-image: linear-gradient( 135deg, #023838 10%, #008080 100%);} /* Para algo como almacenamiento */
.gradient-gold {background-image: linear-gradient( 135deg, #4d3a01 10%, #D4AF37 100%);} /* Para alertas/seguridad */


.black{ color: black }
.white{ color: white; }
</style>
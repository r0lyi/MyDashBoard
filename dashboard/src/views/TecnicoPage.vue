<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button color="primary"></ion-menu-button>
        </ion-buttons>
        <ion-title>📈 Técnico</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="ion-padding">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">📈 Técnico</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-grid class="dashboard-grid">
        <ion-row class="ion-row-1">
          <ion-col size="12" size-lg="4">
            <SparkLine
              title="Tráfico Servidor (RPM)"
              :value="serverTrafficValue"
              :chart-options="serverTrafficOptions"
              :chart-series="serverTrafficSeries"
              bg-color="gradient-gray-blue" text-color="white"
              icon-name="server-outline" />
          </ion-col>
          <ion-col size="6" size-lg="4">
            <SparkLine
              title="Errores Web (5xx/4xx)"
              :value="websiteErrorsValue"
              :chart-options="websiteErrorsOptions"
              :chart-series="websiteErrorsSeries"
              bg-color="gradient-red-dark" text-color="white"
              icon-name="bug-outline" />
          </ion-col>
          <ion-col size="6" size-lg="4">
            <SparkLine
              title="Tiempo de Carga (ms)"
              :value="pageLoadTimeValue"
              :chart-options="pageLoadTimeOptions"
              :chart-series="pageLoadTimeSeries"
              bg-color="gradient-dark-purple" text-color="white"
              icon-name="time-outline" />
          </ion-col>
        </ion-row>

        <ion-row class="ion-row-2">
          <ion-col size="12" size-md="3" push-md="9">
            <div class="box box-full-height"> <SystemTemperatureGauge
                :current-temperature="serverTemperature"
                :min-temp="20"
                :max-temp="90"
                :min-warning="60"
                :max-critical="80"
                unit="°C"
                title="Temp. Servidor"
              />
            </div>
          </ion-col>
          <ion-col size="12" size-md="9" pull-md="3">
            <div class="box">
              <ApexLineRT
                :series="apiLatencySeries"
                title="Latencia API (ms)"
                :kpi-target="200"
                color="#f31b4a"
                unit="ms"
                :event-annotations="userActivityAnnotations" />
            </div>
          </ion-col>
        </ion-row>

        <ion-row class="ion-row-3">
          <ion-col size="12" size-lg="4.5">
            <div class="box box-full-height">
              <CpuLoadChart
                :series="cpuLoadSeries"
                title="Carga de Procesador"
                color="#26a69a"
                :min="0"
                :max="100"
                unit="%"
                :max-data-points="30"
              />
            </div>
          </ion-col>
          <ion-col size="12" size-lg="4.5">
            <div class="box">
              <ChartJSLineAreaRT
                chartType="area"
                title="Memoria Utilizada"
                color="#64b5f6"
                :series="memoryUsageSeries"
                :min="0"
                :max="100"
                unit="%"
              />
            </div>
          </ion-col>
          <ion-col size="12" size-lg="3">
            <div class="box">
              <EchartsGaugeMultiple :segments="ringSegments" />
            </div>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar, IonGrid, IonRow, IonCol } from '@ionic/vue';
import SparkLine from './components/SparkLine.vue';
import { ref, onMounted, onUnmounted } from 'vue';

// ***** 🧰 DEPENDENCIAS *****
import ApexLineRT from './components/ApexLineRT.vue';
import EchartsGaugeMultiple from './components/EchartsGaugeMultiple.vue';
import ChartJSLineAreaRT from './components/ChartJSLineAreaRT.vue';
import CpuLoadChart from './components/CpuLoadChart.vue';
// ¡Importar el nuevo componente de medidor de temperatura!
import SystemTemperatureGauge from './components/SystemTemperature.vue';

// ***** 🛠️ CONSTANTES y VARIABLES *****
const UPDATE_INTERVAL = 1000;
const MAX_DATA_POINTS = 30; // Todavía útil para otros gráficos, pero no para este gauge

let lastDate = Date.now();
let mainInterval: ReturnType<typeof setInterval> | undefined;

// --- SparkLines (sin cambios) ---
const baseSparklineChartOptions = {
  chart: {
    type: 'area', sparkline: { enabled: true },
    animations: { enabled: true, easing: 'linear', dynamicAnimation: { speed: 1000 } },
    zoom: { enabled: false }, toolbar: { show: false },
  },
  stroke: { curve: 'smooth', width: 2 },
  tooltip: { enabled: false },
  dataLabels: { enabled: false },
  fill: { opacity: 0.3, gradient: { inverseColors: false, shade: 'light', type: 'vertical', opacityFrom: 0.85, opacityTo: 0.55, stops: [0, 100, 100, 100] } },
  xaxis: { crosshairs: { width: 1 }, labels: { show: false }, axisBorder: { show: false }, axisTicks: { show: false } },
  yaxis: { min: 0, show: false },
  grid: { show: false, padding: { top: 0, right: 0, bottom: 0, left: 0 } },
  legend: { show: false },
};

const serverTrafficOptions = ref({ ...baseSparklineChartOptions, colors: ['#0396FF'] });
const serverTrafficSeries = ref([{ name: 'Solicitudes', data: [500, 520, 510, 530, 540, 560, 550, 570, 580, 590, 600, 610] }]);
const serverTrafficValue = ref('610');

const websiteErrorsOptions = ref({ ...baseSparklineChartOptions, colors: ['#FF6347'] });
const websiteErrorsSeries = ref([{ name: 'Errores', data: [5, 4, 6, 3, 5, 7, 6, 8, 7, 9, 8, 10] }]);
const websiteErrorsValue = ref('10');

const pageLoadTimeOptions = ref({ ...baseSparklineChartOptions, colors: ['#9932CC'] });
const pageLoadTimeSeries = ref([{ name: 'Ms', data: [350, 345, 360, 340, 355, 330, 320, 310, 300, 290, 280, 270] }]);
const pageLoadTimeValue = ref('270ms');

let serverTrafficInterval: number | undefined;
let websiteErrorsInterval: number | undefined;
let pageLoadTimeInterval: number | undefined;


// --- ApexLineRT - Latencia API
const apiLatencyData = ref<{ x: number; y: number }[]>([]);
const apiLatencySeries = ref([{ name: 'Latencia', data: apiLatencyData.value }]);
const userActivityAnnotations = ref<any[]>([]);

// --- Usuarios Online (ref se mantiene, componente no se muestra)
const currentUsersOnline = ref(0);

// --- Echarts - Gauge Múltiple: Segmentos de Servicios Críticos
const ringSegments = ref([
  { value: 0, name: 'Servidor Web', color: '#f97316', min: 70, max: 95 },
  { value: 0, name: 'Base de Datos', color: '#10b981', min: 80, max: 100 },
  { value: 0, name: 'Microservicios', color: '#3b82f6', min: 60, max: 90 }
]);

// --- SERIE para Carga CPU con ApexCharts
const cpuLoadSeries = ref([
  { name: 'Carga', data: Array.from({ length: MAX_DATA_POINTS }).map(() => ({ x: Date.now() - (MAX_DATA_POINTS - 1 - Math.random()) * UPDATE_INTERVAL, y: Math.floor(Math.random() * 30) + 20 })) }
]);

// --- ChartJSLineAreaRT - Memoria
const memoryUsageSeries = ref([
  { data: Array.from({ length: MAX_DATA_POINTS }).map(() => ({ x: Date.now() - (MAX_DATA_POINTS - 1 - Math.random()) * UPDATE_INTERVAL, y: Math.floor(Math.random() * 20) + 50 })) }
]);

// --- Conexiones a Base de Datos (DBConnectionsChart)
const dbConnectionsSeries = ref([
  { data: Array.from({ length: MAX_DATA_POINTS }).map(() => ({ x: Date.now() - (MAX_DATA_POINTS - 1 - Math.random()) * UPDATE_INTERVAL, y: Math.floor(Math.random() * 30) + 20 })) }
]);

// --- ¡NUEVO! Valor actual de la Temperatura del Servidor
const serverTemperature = ref(45.0); // Temperatura inicial para el medidor

// ***** 🧠 LÓGICA REALTIME *****
function addDataRealTime() {
  const newX = lastDate + UPDATE_INTERVAL;

  // Actualizar Latencia API
  const newLatencyY = Math.floor(Math.random() * 250) + 50;
  apiLatencyData.value.push({ x: newX, y: newLatencyY });
  if (apiLatencyData.value.length > MAX_DATA_POINTS) {
    apiLatencyData.value.shift();
    userActivityAnnotations.value = userActivityAnnotations.value.filter(
      (ann: { x: number; }) => ann.x >= (apiLatencyData.value[0]?.x || 0)
    );
  }
  apiLatencySeries.value = [{ name: 'Latencia', data: [...apiLatencyData.value] }];

  // Actualizar Usuarios Online (aunque no se muestre el gauge)
  const newUsersY = Math.floor(Math.random() * 90) + 10;
  currentUsersOnline.value = newUsersY;

  // SIMULACIÓN DE EVENTOS DE USUARIO EN LA LATENCIA
  const randEvent = Math.random();
  if (randEvent > 0.95) {
    const isEntry = Math.random() > 0.5;
    userActivityAnnotations.value.push({
      x: newX,
      marker: { size: 8, fillColor: isEntry ? '#28a745' : '#dc3545', strokeColor: '#fff', radius: 4 },
      label: {
        borderColor: isEntry ? '#28a745' : '#dc3545',
        style: { background: isEntry ? '#28a745' : '#dc3545', color: '#fff', fontSize: '10px' },
        text: isEntry ? 'Inicio Sesión' : 'Cierre Sesión',
        offsetY: 20, orientation: 'vertical',
      },
    });
  }

  // Actualizar Segmentos (Echarts Gauge Múltiple)
  ringSegments.value.forEach((s) => {
    const fluctuation = (Math.random() * 0.2 - 0.1) * (s.max - s.min);
    let newValue = s.value + fluctuation;
    newValue = Math.max(s.min, Math.min(s.max, newValue));
    s.value = Math.floor(newValue);
  });

  // Actualizar Carga CPU (para CpuLoadChart - ApexCharts)
  const newCpuValue = Math.floor(Math.random() * 20) + 30;
  cpuLoadSeries.value[0].data.push({ x: newX, y: newCpuValue });
  if (cpuLoadSeries.value[0].data.length > MAX_DATA_POINTS) {
    cpuLoadSeries.value[0].data.shift();
  }
  cpuLoadSeries.value = [{ name: 'Carga', data: [...cpuLoadSeries.value[0].data] }];


  // Actualizar Memoria (para ChartJSLineAreaRT)
  const newMemValue = Math.floor(Math.random() * 15) + 60;
  memoryUsageSeries.value[0].data.push({ x: newX, y: newMemValue });
  if (memoryUsageSeries.value[0].data.length > MAX_DATA_POINTS) {
    memoryUsageSeries.value[0].data.shift();
  }
  memoryUsageSeries.value = [{ data: [...memoryUsageSeries.value[0].data] }];


  // Actualizar Conexiones a Base de Datos (DBConnectionsChart)
  const newDbConnections = Math.floor(Math.random() * 50) + 10;
  dbConnectionsSeries.value[0].data.push({ x: newX, y: newDbConnections });
  if (dbConnectionsSeries.value[0].data.length > MAX_DATA_POINTS) {
    dbConnectionsSeries.value[0].data.shift();
  }
  dbConnectionsSeries.value = [{ data: [...dbConnectionsSeries.value[0].data] }];

  // ¡NUEVO! Actualizar la temperatura para el medidor
  const tempFluctuation = (Math.random() * 4 - 2); // Fluctuación de +/- 2 grados
  let newTemperature = serverTemperature.value + tempFluctuation;
  // Mantener la temperatura dentro de un rango razonable, por ejemplo, 20°C a 90°C
  newTemperature = Math.max(20, Math.min(90, newTemperature));
  serverTemperature.value = parseFloat(newTemperature.toFixed(1)); // Asegurarse de tener un decimal

  lastDate = newX;
}

// ***** 🔄 CICLO DE VIDA *****
onMounted(() => {
  serverTrafficInterval = window.setInterval(() => {
    const lastValue = serverTrafficSeries.value[0].data[serverTrafficSeries.value[0].data.length - 1];
    const newValue = Math.round(lastValue + (Math.random() * 30 - 15));
    serverTrafficSeries.value[0].data = serverTrafficSeries.value[0].data.slice(1).concat(Math.max(400, newValue));
    serverTrafficSeries.value = [...serverTrafficSeries.value];
    serverTrafficValue.value = serverTrafficSeries.value[0].data[serverTrafficSeries.value[0].data.length - 1].toString();
  }, 2000);

  websiteErrorsInterval = window.setInterval(() => {
    const lastValue = websiteErrorsSeries.value[0].data[websiteErrorsSeries.value[0].data.length - 1];
    let newValue = lastValue + Math.round(Math.random() * 3 - 1.5);
    newValue = Math.max(0, newValue);
    newValue = Math.min(20, newValue);
    websiteErrorsSeries.value[0].data = websiteErrorsSeries.value[0].data.slice(1).concat(newValue);
    websiteErrorsSeries.value = [...websiteErrorsSeries.value];
    websiteErrorsValue.value = websiteErrorsSeries.value[0].data[websiteErrorsSeries.value[0].data.length - 1].toString();
  }, 3000);

  pageLoadTimeInterval = window.setInterval(() => {
    const lastValue = pageLoadTimeSeries.value[0].data[pageLoadTimeSeries.value[0].data.length - 1];
    const newValue = Math.round(lastValue + (Math.random() * 20 - 10));
    pageLoadTimeSeries.value[0].data = pageLoadTimeSeries.value[0].data.slice(1).concat(Math.max(150, Math.min(500, newValue)));
    pageLoadTimeSeries.value = [...pageLoadTimeSeries.value];
    pageLoadTimeValue.value = `${pageLoadTimeSeries.value[0].data[pageLoadTimeSeries.value[0].data.length - 1]}ms`;
  }, 1500);

  mainInterval = setInterval(addDataRealTime, UPDATE_INTERVAL);
});

onUnmounted(() => {
  if (serverTrafficInterval) clearInterval(serverTrafficInterval);
  if (websiteErrorsInterval) clearInterval(websiteErrorsInterval);
  if (pageLoadTimeInterval) clearInterval(pageLoadTimeInterval);
  if (mainInterval) clearInterval(mainInterval);
});
</script>

<style scoped>
/* Aseguramos que la cuadrícula y las filas ocupen el 100% de la altura disponible */
ion-grid {
  height: 100%;
  display: flex;
  flex-direction: column;
}

ion-row {
  flex: 1; /* Permite que las filas se expandan y distribuyan el espacio */
  display: flex;
  overflow: hidden; /* Oculta cualquier desbordamiento dentro de la fila */
}

ion-col {
  display: flex; /* Asegura que la columna use flexbox para alinear su contenido */
  padding: 10px; /* Padding global para las columnas (entre las cajas) */
  flex: 1; /* Asegura que el contenido de la columna pueda crecer */
  min-width: 0; /* Permite que la columna se reduzca si es necesario */
}

.box {
  background: #1E1E1E;
  height: 100%; /* ¡Importante! Ocupa el 100% de la altura de su padre (ion-col) */
  width: 100%; /* ¡Importante! Ocupa el 100% del ancho de su padre (ion-col) */
  border-radius: 5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  display: flex; /* Usar flexbox para que el contenido (el gráfico) se ajuste */
  flex-direction: column; /* Asegura que el contenido se apile verticalmente */
  color: white;
  padding: 16px; /* padding por defecto para la mayoría de las cajas */
}

/* Clases específicas para los contenedores que quieren que sus gráficos llenen el 100% sin padding */
.box.box-full-height {
  padding: 0; /* Elimina el padding del .box para que el gráfico use todo el espacio */
}

/* Media queries para alturas de fila en pantallas grandes (mantener) */
@media (min-width: 992px) {
  .ion-row-1 { height: 20%; max-height: 20%; }
  .ion-row-2 { height: 40%; max-height: 40%; }
  .ion-row-3 { height: 40%; max-height: 40%; }
}
</style>
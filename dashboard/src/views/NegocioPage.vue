<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button color="primary"></ion-menu-button>
        </ion-buttons>
        <ion-title>🚀 Negocio Deportivo</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="ion-padding">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">🚀 Negocio Deportivo</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-grid class="dashboard-grid">
        <ion-row class="ion-row-1">
          <ion-col size="6" size-lg="3">
            <SparkLine
              title="Deporte Más Vendido"
              :value="sparkline1Value"
              :chart-options="sparkline1Options"
              :chart-series="sparkline1Series"
              bg-color="gradient-blue"
              text-color="white"
              icon-name="football-outline"
            />
          </ion-col>
          <ion-col size="6" size-lg="3">
            <SparkLine
              title="Ventas Totales "
              :value="sparkline2Value"
              :chart-options="sparkline2Options"
              :chart-series="sparkline2Series"
              bg-color="gradient-green"
              text-color="white"
              icon-name="wallet-outline"
            />
          </ion-col>
          <ion-col size="6" size-lg="3">
            <SparkLine
              title="Visitas Web "
              :value="sparkline3Value"
              :chart-options="sparkline3Options"
              :chart-series="sparkline3Series"
              bg-color="gradient-orange"
              text-color="white"
              icon-name="eye-outline"
            />
          </ion-col>
          <ion-col size="6" size-lg="3">
            <SparkLine
              title="Artículos Vendidos "
              :value="sparkline4Value"
              :chart-options="sparkline4Options"
              :chart-series="sparkline4Series"
              bg-color="gradient-pink"
              text-color="white"
              icon-name="shirt-outline"
            />
          </ion-col>
        </ion-row>

        <ion-row class="ion-row-2">
          <ion-col size="12" size-lg="9">
            <ApexMixedChart
              title-text="Inscripciones a Eventos por Género y Deporte"
              y-axis-title="Número de Personas Inscritas"
              :category-labels="['Fútbol', 'Baloncesto', 'Vóley', 'Tenis', 'Running', 'Ciclismo']"
              :series="eventInscriptionsSeries"
              chart-type="bar"
              :is-stacked="false"
              :colors="['#0396FF', '#EE9AE5', '#3CB371']"
            />
          </ion-col>
          <ion-col size="12" size-lg="3">
            <div class="box-gauge">
              <EchartsGauge
                title="Satisfacción del Cliente"
                :value="customerSatisfaction"
              />
            </div>
          </ion-col>
        </ion-row>

        <ion-row class="ion-row-3">
          <ion-col size="12" size-lg="6">
            <div class="box-map">
              <EchartsMap
                title="Ventas por País en Europa"
                subtitle="Unidades Vendidas por Región"
                :data="europeSalesData"
                :min-data-value="500"
                :max-data-value="25000"
              />
            </div>
          </ion-col>
          <ion-col size="12" size-lg="6">
            <div class="box-product-ranking">
              <EchartsProductRanking
                title="Top 5 Productos Más Comprados"
                :data="topProductsData"
              />
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
import ApexMixedChart from './components/ApexMixedChart.vue';
import EchartsGauge from './components/EchartsGauge.vue';
import EchartsMap from './components/EchartsMap.vue';
import EchartsProductRanking from './components/EchartsProductRanking.vue';
import { ref, onMounted, onUnmounted } from 'vue';

// --- OPCIONES BASE PARA SPARKLINES (sin cambios) ---
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

// --- DATOS PARA SPARKLINES (sin cambios) ---
const sparkline1Options = ref({ ...baseSparklineChartOptions, colors: ['#0396FF'], chart: { ...baseSparklineChartOptions.chart, animations: { enabled: false } } });
const sparkline1Series = ref([{ name: 'Ventas Fútbol', data: [120, 150, 130, 170, 160, 200, 180, 220, 210, 250, 240, 280] }]);
const sparkline1Value = ref('Fútbol');

const sparkline2Options = ref({ ...baseSparklineChartOptions, colors: ['#6be084'] });
const sparkline2Series = ref([{ name: 'Ventas Totales', data: [2500, 2600, 2700, 2800, 2900, 3000, 3100, 3200, 3300, 3400, 3500, 3600] }]);
const sparkline2Value = ref('$3,600');

const sparkline3Options = ref({ ...baseSparklineChartOptions, colors: ['#e78f30'] });
const sparkline3Series = ref([{ name: 'Visitas Web', data: [50, 55, 60, 62, 65, 70, 75, 72, 78, 80, 85, 90] }]);
const sparkline3Value = ref('90');

const sparkline4Options = ref({ ...baseSparklineChartOptions, colors: ['#EE9AE5'] });
const sparkline4Series = ref([{ name: 'Artículos Vendidos', data: [10, 12, 11, 15, 14, 18, 17, 20, 19, 22, 21, 25] }]);
const sparkline4Value = ref('25');

// --- DATOS PARA EL GRÁFICO DE INSCRIPCIONES A EVENTOS (sin cambios) ---
const eventInscriptionsSeries = ref([
  {
    name: 'Hombres',
    type: 'bar',
    data: [70, 55, 45, 60, 80, 50]
  },
  {
    name: 'Mujeres',
    type: 'bar',
    data: [50, 65, 55, 70, 75, 40]
  },
  {
    name: 'Total Inscritos',
    type: 'line',
    data: [120, 120, 100, 130, 155, 90]
  }
]);

// --- ESTADO PARA EL GRÁFICO DE SATISFACCIÓN DEL CLIENTE (sin cambios) ---
const customerSatisfaction = ref(85);

// --- DATOS PARA EL MAPA DE EUROPA (sin cambios) ---
const europeSalesData = ref([
  { name: 'Spain', value: 15200 },
  { name: 'France', value: 18500 },
  { name: 'Germany', value: 22000 },
  { name: 'Italy', value: 10500 },
  { name: 'United Kingdom', value: 20000 },
  { name: 'Portugal', value: 7000 },
  { name: 'Netherlands', value: 9500 },
  { name: 'Belgium', value: 6000 },
  { name: 'Ireland', value: 3200 },
  { name: 'Switzerland', value: 4500 },
  { name: 'Austria', value: 4000 },
  { name: 'Sweden', value: 7500 },
  { name: 'Norway', value: 6800 },
  { name: 'Denmark', value: 5500 },
  { name: 'Finland', value: 3000 },
  { name: 'Poland', value: 8000 },
  { name: 'Greece', value: 2500 },
  { name: 'Czech Rep.', value: 3800 },
  { name: 'Hungary', value: 2900 },
  { name: 'Romania', value: 3100 },
  { name: 'Bulgaria', value: 1800 },
  { name: 'Croatia', value: 1500 },
  { name: 'Slovenia', value: 1200 },
  { name: 'Slovakia', value: 1100 },
  { name: 'Lithuania', value: 900 },
  { name: 'Latvia', value: 800 },
  { name: 'Estonia', value: 700 },
  { name: 'Luxembourg', value: 600 },
  { name: 'Cyprus', value: 400 },
  { name: 'Malta', value: 300 },
  { name: 'Iceland', value: 1000 },
]);

// --- DATOS PARA EL RANKING DE PRODUCTOS (¡Ahora serán actualizados!) ---
const initialProducts = [
  { name: 'Zapatillas Running Pro (Hombre)', value: 850 },
  { name: 'Leggings Deportivos Fit (Mujer)', value: 720 },
  { name: 'Camiseta Dry-Tech (Unisex)', value: 680 },
  { name: 'Calcetines Compresión (Unisex)', value: 510 },
  { name: 'Mochila Urbana Deportiva', value: 450 },
  { name: 'Gorra Transpirable (Unisex)', value: 380 },
  { name: 'Pantalón Corto Baloncesto', value: 320 },
  { name: 'Top Deportivo Alto Impacto', value: 290 },
];
const topProductsData = ref([...initialProducts.slice(0, 5)]); // Solo los 5 primeros inicialmente

let updateInterval: number | undefined;
let gaugeUpdateInterval: number | undefined;
let productRankingInterval: number | undefined; // Nuevo intervalo para el ranking de productos

onMounted(() => {
  // Intervalo para los SparkLines
  updateInterval = window.setInterval(() => {
    const lastSale = sparkline2Series.value[0].data[sparkline2Series.value[0].data.length - 1];
    const newSale = Math.round(lastSale + (Math.random() * 100 - 40));
    sparkline2Series.value[0].data = sparkline2Series.value[0].data.slice(1).concat(Math.max(2000, newSale));
    sparkline2Series.value = [...sparkline2Series.value];
    sparkline2Value.value = `$${sparkline2Series.value[0].data[sparkline2Series.value[0].data.length - 1].toLocaleString('es-ES', { minimumFractionDigits: 0 })}`;

    const lastVisit = sparkline3Series.value[0].data[sparkline3Series.value[0].data.length - 1];
    const newVisit = Math.round(lastVisit + (Math.random() * 10 - 3));
    sparkline3Series.value[0].data = sparkline3Series.value[0].data.slice(1).concat(Math.max(30, newVisit));
    sparkline3Series.value = [...sparkline3Series.value];
    sparkline3Value.value = sparkline3Series.value[0].data[sparkline3Series.value[0].data.length - 1].toString();

    const lastItem = sparkline4Series.value[0].data[sparkline4Series.value[0].data.length - 1];
    const newItem = Math.round(lastItem + (Math.random() * 5 - 2));
    sparkline4Series.value[0].data = sparkline4Series.value[0].data.slice(1).concat(Math.max(5, newItem));
    sparkline4Series.value = [...sparkline4Series.value];
    sparkline4Value.value = sparkline4Series.value[0].data[sparkline4Series.value[0].data.length - 1].toString();

  }, 1500);

  // Intervalo para la satisfacción del cliente
  gaugeUpdateInterval = window.setInterval(() => {
    const newValue = Math.round(70 + Math.random() * 25);
    customerSatisfaction.value = newValue;
  }, 3000);

  // NUEVO: Intervalo para el ranking de productos
  productRankingInterval = window.setInterval(() => {
    // Crear una copia mutable de los productos
    const currentProducts = initialProducts.map(p => ({ ...p }));

    // Simular un pequeño cambio en el valor de cada producto
    currentProducts.forEach(product => {
      // Ajustar el valor ligeramente, asegurándose de que no baje de cierto umbral
      product.value = Math.max(100, product.value + Math.round(Math.random() * 50) - 20);
    });

    // Añadir un nuevo producto aleatorio a la lista, si es necesario,
    // o sacar uno para simular cambios en el ranking más allá de los valores
    const potentialNewProduct = { name: 'Pantalón Chándal Comfort', value: Math.round(300 + Math.random() * 200) };
    if (Math.random() > 0.8) { // 20% de probabilidad de que aparezca un "nuevo" producto en el mix
        currentProducts.push(potentialNewProduct);
    }


    // Ordenar los productos por valor de forma descendente y tomar solo el top 5
    currentProducts.sort((a, b) => b.value - a.value);
    topProductsData.value = currentProducts.slice(0, 5);

  }, 4000); // Actualiza cada 4 segundos
});

onUnmounted(() => {
  if (updateInterval) {
    clearInterval(updateInterval);
  }
  if (gaugeUpdateInterval) {
    clearInterval(gaugeUpdateInterval);
  }
  if (productRankingInterval) { // Limpiar también el nuevo intervalo
    clearInterval(productRankingInterval);
  }
});
</script>

<style scoped>
ion-row{
  overflow: hidden;
}

ion-col {
  max-height: 100%;
  --ion-grid-column-padding:10px;
}

.box {
  background: #1E1E1E;
  height: 100%;
  max-height: 100%;
  overflow: hidden;
  border-radius:5px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  padding: 15px;
  text-align: center;
  font-size: 1.2rem;
}

.box-gauge, .box-map, .box-product-ranking { /* Estilos combinados para los contenedores de gráficos */
  background: #1E1E1E;
  height: 100%;
  min-height: 300px; /* Asegura que el contenedor tenga altura mínima */
  width: 100%;
  padding: 16px;
  border-radius: 5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

/* Ajuste específico si necesitas para el mapa */
.map-chart, .product-ranking-chart {
  /* Asegura que el chart dentro de su .box-wrapper ocupe todo el espacio */
  width: 100%;
  height: 100%; /* Importante para autoresize */
}

@media (min-width: 992px) {
  ion-grid{height: 100%;}
  .ion-row-1{height: 20%; max-height: 20%;}
  .ion-row-2{height: 40%; max-height: 40%;}
  .ion-row-3{height: 40%; max-height: 40%;}
}
</style>
<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title>Análisis de Productos</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Análisis de Productos</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-grid class="ion-padding">
        <ion-row class="ion-justify-content-center">
          <ion-col size-xs="12" size-sm="12" size-md="6" size-lg="6" size-xl="6">
             <ion-card>
              <ion-card-header>
                 </ion-card-header>
              <ion-card-content>
                <PriceDistributionChart v-if="priceDistributionData" :series-data="priceDistributionData" />
                <p v-else>Cargando gráfico de precios...</p>
              </ion-card-content>
            </ion-card>
          </ion-col>

          <ion-col size-xs="12" size-sm="12" size-md="6" size-lg="6" size-xl="6">
             <ion-card>
              <ion-card-header>
                 </ion-card-header>
              <ion-card-content>
                 <PriceRatingChart v-if="priceRatingData" :series-data="priceRatingData" />
                 <p v-else>Cargando gráfico precio-valoración...</p>
              </ion-card-content>
            </ion-card>
          </ion-col>
        </ion-row>

         <ion-row class="ion-justify-content-center">
           <ion-col size-xs="12" size-sm="12" size-md="6" size-lg="6" size-xl="6">
             <ion-card>
              <ion-card-header>
                 </ion-card-header>
              <ion-card-content>
                 <BrandPerformanceChart v-if="brandPerformanceData" :series-data="brandPerformanceData" :chart-options="brandPerformanceOptions" />
                 <p v-else>Cargando gráfico rendimiento marcas...</p>
              </ion-card-content>
            </ion-card>
          </ion-col>

          <ion-col size-xs="12" size-sm="12" size-md="6" size-lg="6" size-xl="6">
             <ion-card>
              <ion-card-header>
                 </ion-card-header>
              <ion-card-content>
                 <RepurchaseRateChart v-if="repurchaseRateData" :series-data="repurchaseRateData" />
                 <p v-else>Cargando gráfico tasa de recompra...</p>
              </ion-card-content>
            </ion-card>
          </ion-col>
         </ion-row>

      </ion-grid>

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle, IonCardContent,
  IonButtons, IonMenuButton
} from '@ionic/vue';
import { ref, onMounted } from 'vue';

// Importar los datos de productos
import productData from '@/assets/data/ProductoData.json';

// Importar los componentes de gráficos ApexCharts
import PriceDistributionChart from '@/components/producto/PriceDistribution.vue';
import PriceRatingChart from '@/components/producto/PriceRating.vue';
import BrandPerformanceChart from '@/components/producto/BrandPerformance.vue';
import RepurchaseRateChart from '@/components/producto/RepurchaseRate.vue';

// Variables reactivas para almacenar los datos procesados para cada gráfico
const priceDistributionData = ref(null);
const priceRatingData = ref(null);
const brandPerformanceData = ref(null);
// Opcional: puedes pasar las categorías de X axis al radar chart via options prop
const brandPerformanceOptions = ref(null);
const repurchaseRateData = ref(null);

// Función para procesar los datos brutos de productos para todos los gráficos
const processProductData = (data) => {
  if (!data || data.length === 0) return;

  // --- 1. Distribución de Precios (Histograma-like) ---
  const priceBins = [0, 20, 40, 60, 100, 200, 500]; // Definir rangos de precio
  const priceCounts = Array(priceBins.length).fill(0);

  data.forEach(product => {
    for (let i = 0; i < priceBins.length; i++) {
      if (product.price >= priceBins[i] && (i === priceBins.length - 1 || product.price < priceBins[i + 1])) {
        priceCounts[i]++;
        break;
      }
       if (product.price >= priceBins[priceBins.length - 1]) { // Último bin ">="
           priceCounts[priceBins.length - 1]++;
           break;
       }
    }
  });

  // Formatear labels para los bins
  const priceLabels = priceBins.map((bin, i) => {
      if (i === priceBins.length - 1) return `>=${bin}€`;
      if (i === 0) return `<${priceBins[i+1]}€`; // Si el primer bin empieza en 0
      return `${bin}€ - ${priceBins[i+1]}€`;
  });
  // Ajuste si el primer bin NO empieza en 0, ej: [10, 20...] -> "10€ - 20€"
   if (priceBins[0] === 0 && priceBins.length > 1) {
        priceLabels[0] = `${priceBins[0]}€ - ${priceBins[1]}€`;
         // Si quieres "<X", necesitas un bin inicial artificial o ajustar la lógica
         // Para simplificar con este ejemplo, ajustamos el primer label si es 0
         if (priceBins.length > 1 && priceBins[0] === 0) {
            priceLabels[0] = `0€ - ${priceBins[1]}€`;
         }
         // Ajuste para el último label si quieres ">="
         if (priceBins.length > 0) {
            priceLabels[priceBins.length -1] = `>=${priceBins[priceBins.length - 1]}€`;
         }
   }


  // Formatear para ApexCharts Bar
  priceDistributionData.value = [{ name: 'Número de Productos', data: priceCounts }];
   // Si quieres usar labels en el componente de chart, necesitarías pasarlas via options
   // chartOptions: { xaxis: { categories: priceLabels } }

  // --- 2. Relación Precio-Valoración (Scatter) ---
  // Datos en formato [[precio, rating], ...]
  const priceRatingPairs = data.map(product => [product.price, product.rating, product.name]); // Incluimos nombre para tooltip

  // Formatear para ApexCharts Scatter
  priceRatingData.value = [{ name: 'Productos', data: priceRatingPairs }]; // name de la serie


  // --- 3. Rendimiento de Marcas (Radar) ---
  const brandMap = {}; // Para agregar datos por marca
  data.forEach(product => {
      if (!brandMap[product.brand]) {
          brandMap[product.brand] = { totalSalesValue: 0, totalRating: 0, totalProducts: 0, totalUnitsSold: 0 };
      }
      brandMap[product.brand].totalSalesValue += product.price * product.unitsSold;
      brandMap[product.brand].totalRating += product.rating;
      brandMap[product.brand].totalProducts++;
      brandMap[product.brand].totalUnitsSold += product.unitsSold; // También útil para promedio de ventas unitarias si quieres
  });

  const brands = Object.keys(brandMap);
  const brandPerformanceSeries = brands.map(brand => {
      const stats = brandMap[brand];
      const avgRating = stats.totalProducts > 0 ? stats.totalRating / stats.totalProducts : 0;
       // Calcular precio promedio PONDERADO por unidades vendidas (más representativo)
       const avgPriceWeighted = stats.totalUnitsSold > 0 ? stats.totalSalesValue / stats.totalUnitsSold : 0;
       // Usaremos Ventas Totales, Valoración Promedio, Precio Promedio Ponderado
      return {
          name: brand,
          data: [stats.totalSalesValue, avgRating, avgPriceWeighted] // Valores para las métricas
      };
  });

  // Formatear para ApexCharts Radar
  brandPerformanceData.value = brandPerformanceSeries;
  // Definir las categorías (métricas) para el eje X (radial)
  const radarCategories = ['Ventas Totales (€)', 'Valoración Promedio', 'Precio Promedio (€)'];
  brandPerformanceOptions.value = { // Pasamos las opciones dinámicas (categorías)
      xaxis: { categories: radarCategories },
      // Puedes añadir aquí rangos máximos para cada eje Y si quieres escalas fijas
      // yaxis: [{ max: Math.max(...brandPerformanceSeries.map(s => s.data[0])) * 1.1 }, ...]
  };


  // --- 4. Tasa de Recompra por Producto (Bubble) ---
  // Datos en formato [[ventasValor, tasaRecompra, unidadesVendidas], ...]
  // Puedes agrupar por marca o mostrar cada producto individualmente.
  // Aquí mostraremos cada producto individualmente en una sola serie.
  const repurchaseBubbleData = data.map(product => {
      const salesValue = product.price * product.unitsSold;
      const repurchaseRate = product.repurchaseRate; // Ya es 0-1
      const unitsSold = product.unitsSold; // Usaremos esto para el tamaño de la burbuja
      // Incluimos el nombre del producto como 4to elemento para usarlo en el tooltip custom
      return [salesValue, repurchaseRate, unitsSold, product.name];
  });

  // Formatear para ApexCharts Bubble
  repurchaseRateData.value = [{ name: 'Productos', data: repurchaseBubbleData }]; // name de la serie

};

// Cargar y procesar datos al montar el componente
onMounted(() => {
   // clientData es el array de productos importado
   processProductData(productData);
});

// No necesitas lógica de "tiempo real" compleja aquí, ya que los datos vienen de un JSON estático.
// Si los datos vinieran de una API que se actualiza, llamarías a processProductData
// después de obtener los nuevos datos.

</script>

<style scoped>
/* Estilos generales para las tarjetas y columnas */
ion-col {
  display: flex; /* Asegura que las columnas flexiblemente contengan las tarjetas */
  /* padding: 4px; */ /* Puedes ajustar el padding aquí en lugar de en ion-grid */
}

ion-card {
    width: 100%; /* Las tarjetas ocupan el ancho completo de su columna */
     margin: 0; /* Elimina el margen por defecto si usas padding en ion-col o grid */
    display: flex; /* Flexbox para controlar el contenido interno */
    flex-direction: column;
    /* min-height: 380px; */ /* Opcional: altura mínima consistente para tarjetas */
}

ion-card-content {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    flex-grow: 1; /* Permite que el content se expanda si la tarjeta tiene min-height */
     padding-top: 0; /* Ajusta si el título ya tiene suficiente espacio */
}

/* Asegurar que el contenido principal no tenga padding para que la grid lo maneje */
ion-content {
    --padding-top: 0;
    --padding-bottom: 0;
    --padding-start: 0;
    --padding-end: 0;
}

/* padding en la grid para dar espacio alrededor de los bordes */
ion-grid.ion-padding {
    padding: 16px; /* Espaciado uniforme alrededor de la grid */
}

/* Estilos para los contenedores de ApexCharts dentro de las cards */
.apexchart-container {
  width: 100%;
   /* **Altura fija o máxima** para el contenedor del gráfico */
   /* Esto trabaja junto con maintainAspectRatio: false / parentHeightOffset: 0 */
  height: 350px; /* Altura fija para intentar evitar scroll */
   /* max-height: 45vh; */ /* Altura máxima basada en viewport */
   position: relative; /* Necesario para el posicionamiento interno de ApexCharts */
   display: flex; /* Asegura que el apexchart interno se alinee/centre si es necesario */
   justify-content: center;
   align-items: center;
}

/* Estilo opcional para tooltips custom (si los usas en componentes) */
.apexcharts-tooltip-custom {
    padding: 10px;
    background: #fff;
    border: 1px solid #ccc;
    font-size: 12px;
    pointer-events: none; /* Asegura que no interfiera con eventos del ratón */
}

</style>
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
                <ProductPopularityChart
                   v-if="productPopularityData && productPopularityOptions"
                   :series-data="productPopularityData"
                   :chart-options="productPopularityOptions"
                 />
                <p v-else>Cargando gráfico de productos populares...</p>
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
                 <BrandPerformanceChart
                    v-if="brandPerformanceData && brandPerformanceOptions"
                    :series-data="brandPerformanceData"
                    :chart-options="brandPerformanceOptions"
                  />
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

// Importar la interfaz y los datos JSON
import type { Product, BrandData, ProductDataSet, PriceRatingDataPoint, RepurchaseDataPoint } from '@/types/product';
import productDataSet from '@/assets/data/ProductoData.json'; // Importamos la estructura completa

// Importar los tipos de ApexCharts para las variables reactivas
import type { ApexOptions, ApexAxisChartSeries } from 'apexcharts';


// Importar los componentes de gráficos ApexCharts
import ProductPopularityChart from '@/components/producto/ProductPopularity.vue';
import PriceRatingChart from '@/components/producto/PriceRating.vue';
import BrandPerformanceChart from '@/components/producto/BrandPerformance.vue';
import RepurchaseRateChart from '@/components/producto/RepurchaseRate.vue';

// Variables reactivas tipadas para almacenar los datos procesados y opciones
const productPopularityData = ref<ApexAxisChartSeries | null>(null);
const productPopularityOptions = ref<ApexOptions | null>(null); // Para pasar categorías (nombres de productos)

const priceRatingData = ref<{ name: string; data: PriceRatingDataPoint[] }[] | null>(null); // Tipo específico para Scatter data

const brandPerformanceData = ref<ApexAxisChartSeries | null>(null);
const brandPerformanceOptions = ref<ApexOptions | null>(null); // Para pasar categorías de radar y rangos

const repurchaseRateData = ref<{ name: string; data: RepurchaseDataPoint[] }[] | null>(null); // Tipo específico para Bubble data


// Definir las marcas específicas a comparar en el Radar chart
const targetBrands = ['Nike', 'Adidas', 'Puma', 'New Balance', 'Reebok', 'Jordan'];


// Función para procesar los datos brutos de productos para todos los gráficos
// Acepta la estructura completa del JSON
const processProductData = (data: ProductDataSet): void => {
  const products = data.products || []; // Usar array vacío si products es null/undefined
  const brandsData = data.brands || []; // Usar array vacío si brands es null/undefined

  if (products.length === 0) {
     console.warn("No product data available.");
     // Opcional: resetear refs a null o mostrar mensaje de no data
     productPopularityData.value = null;
     priceRatingData.value = null;
     brandPerformanceData.value = null;
     repurchaseRateData.value = null;
     return;
  }


  // --- 1. Distribución de Productos Populares (Barra Horizontal por Unidades Vendidas) ---
  // Ordenar productos por unidades vendidas (descendente) y tomar el Top N (ej: Top 15)
  const sortedProducts = [...products].sort((a, b) => b.unitsSold - a.unitsSold);
  const topN = Math.min(15, sortedProducts.length); // Tomar hasta 15 o menos si hay menos productos
  const topProducts = sortedProducts.slice(0, topN);

  const popularityLabels = topProducts.map(p => p.name);
  const popularityDataValues = topProducts.map(p => p.unitsSold);

  // Asignar datos y opciones al ref para Product Popularity Chart
  productPopularityData.value = [{ name: 'Unidades Vendidas', data: popularityDataValues }];
  productPopularityOptions.value = {
      xaxis: {
          categories: popularityLabels, // Nombres de productos en el eje Y (categorías)
          title: { text: 'Unidades Vendidas' } // Título del eje X (valor)
      },
      // Configuración específica para barras horizontales en este gráfico
      plotOptions: {
          bar: {
              horizontal: true,
              distributed: true // Opcional: colorear cada barra diferente
          }
      },
      title: { text: 'Productos Más Populares (Top ' + topN + ')', align: 'left' },
      legend: { show: false },
      // Puedes añadir aquí opciones específicas como colores, etc.
  } as ApexOptions;


  // --- 2. Relación Precio vs Valoración (Scatter) ---
  // Datos en formato [[precio, rating, nombre], ...] para CADA producto
  const priceRatingPairs: PriceRatingDataPoint[] = products.map(product => [product.price, product.rating, product.name]);

  // Asignar datos al ref para Price Rating Chart
  priceRatingData.value = [{ name: 'Productos', data: priceRatingPairs }];


  // --- 3. Rendimiento de Marcas (Radar) ---
  // 3a. Agregar datos por marca (solo para las marcas objetivo)
  const brandAggregateMap: { [key: string]: { totalSalesValue: number; totalRatingSum: number; totalProductsCount: number; totalUnitsSold: number } } = {};

  // Inicializar con 0 para las marcas objetivo
  targetBrands.forEach(brand => {
      brandAggregateMap[brand] = { totalSalesValue: 0, totalRatingSum: 0, totalProductsCount: 0, totalUnitsSold: 0 };
  });

  // Sumar ventas, rating, unidades vendidas solo para productos de las marcas objetivo
  products.forEach(product => {
      if (targetBrands.includes(product.brand)) {
          brandAggregateMap[product.brand].totalSalesValue += product.price * product.unitsSold;
          brandAggregateMap[product.brand].totalRatingSum += product.rating;
          brandAggregateMap[product.brand].totalProductsCount++;
          brandAggregateMap[product.brand].totalUnitsSold += product.unitsSold;
      }
  });

  // 3b. Obtener número de tiendas físicas de los datos de marcas
  const brandStoresMap: { [key: string]: number } = {};
  brandsData.forEach(brand => {
      brandStoresMap[brand.name] = brand.physicalStores;
  });

  // 3c. Calcular métricas finales (promedios) y escalar para Radar (solo para marcas con productos)
  const brandsWithProducts = targetBrands.filter(brand => brandAggregateMap[brand].totalProductsCount > 0); // Solo marcas que tienen productos en los datos
  const brandPerformanceSeries: ApexAxisChartSeries = brandsWithProducts.map(brand => {
      const stats = brandAggregateMap[brand];
      const avgRating = stats.totalProductsCount > 0 ? stats.totalRatingSum / stats.totalProductsCount : 0;

      const physicalStores = brandStoresMap[brand] || 0; // 0 si la marca no está en la lista de tiendas o no tiene tiendas

      // --- ESCALADO ---
      // Encontrar valores máximos entre las marcas *con productos* para escalar
      const maxSales = Math.max(...brandsWithProducts.map(b => brandAggregateMap[b].totalSalesValue));
      const maxRating = 5; // El rating máximo posible es 5
      const maxStores = Math.max(...brandsWithProducts.map(b => brandStoresMap[b] || 0)); // Max tiendas entre marcas con productos

      const scaledSales = maxSales > 0 ? (stats.totalSalesValue / maxSales) * 100 : 0;
      const scaledRating = (avgRating / maxRating) * 100; // Escalar Rating 0-5 a 0-100
      const scaledStores = maxStores > 0 ? (physicalStores / maxStores) * 100 : 0;

      return {
          name: brand, // Nombre de la serie (la marca)
          data: [scaledSales, scaledRating, scaledStores] // Valores escalados para Ventas, Valoración, Tiendas
      };
  });

  // Asignar datos y opciones al ref para Brand Performance Chart
  const radarCategories = ['Ventas Totales (%)', 'Valoración Promedio (%)', 'Tiendas Físicas (%)'];
  brandPerformanceData.value = brandPerformanceSeries;
  brandPerformanceOptions.value = {
      xaxis: { categories: radarCategories },
      yaxis: { // Configuración del eje radial para valores escalados 0-100
         tickAmount: 4,
         labels: { formatter: function(val: number): string { return val.toFixed(0); } },
         min: 0, max: 100
      },
       title: { text: 'Rendimiento de Marcas Seleccionadas', align: 'left' }, // Título ajustado
       legend: { // Leyenda para identificar cada marca
            position: 'top',
            horizontalAlign: 'left'
       }
      // Puedes añadir opciones de colores aquí si quieres un color fijo por marca
  } as ApexOptions;


  // --- 4. Tasa de Recompra por Producto (Bubble) ---
  // Datos en formato [[ventasValor, tasaRecompra, unidadesVendidas, nombre], ...] para CADA producto
  const repurchaseBubbleData: RepurchaseDataPoint[] = products.map(product => {
      const salesValue = product.price * product.unitsSold;
      const repurchaseRate = product.repurchaseRate; // Ya es 0-1
      const unitsSold = product.unitsSold; // Usaremos esto para el tamaño de la burbuja
      // Incluimos el nombre del producto para el tooltip custom
      return [salesValue, repurchaseRate, unitsSold, product.name];
  });

  // Asignar datos al ref para Repurchase Rate Chart
  repurchaseRateData.value = [{ name: 'Productos', data: repurchaseBubbleData }];

};

// Cargar y procesar datos al montar el componente
onMounted(() => {
   // productDataSet es el objeto importado con products y brands
   processProductData(productDataSet as ProductDataSet); // Casteamos al tipo esperado
});

</script>

<style scoped>
/* Estilos generales para las tarjetas y columnas */
ion-col {
  display: flex; /* Importante para que la tarjeta dentro use el espacio flex */
}

ion-card {
    width: 100%;
    display: flex; /* Hace la tarjeta un contenedor flex vertical */
    flex-direction: column;
}

ion-card-header {
    padding-bottom: 0; /* Ajusta si no quieres espacio entre header y content en la card */
}

ion-card-content {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    flex-grow: 1; /* Permite que el content se expanda si la card tiene min-height */
    padding-top: 0; /* Elimina padding superior si el header ya tiene espacio */
}



/* Estilos para los contenedores de ApexCharts dentro de las cards */
.apexchart-container {
  width: 100%;
   /* Altura fija o máxima para el contenedor del gráfico */
  height: 350px; /* Altura fija para intentar evitar scroll */
   position: relative;
   display: flex;
   justify-content: center;
   align-items: center;
}
/* Ajustes de estilo si el chart no ocupa el contenedor */
.apexchart-container :deep(.apexcharts) {
    width: 100% !important;
    height: 100% !important;
}

/* Estilo opcional para tooltips custom */
.apexcharts-tooltip-custom {
    background: #fff;
    border: 1px solid #ccc;
    font-size: 12px;
    pointer-events: none;
}

</style>
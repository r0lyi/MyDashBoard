<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title>Demografía de Clientes</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Demografía de Clientes</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-grid class="ion-padding">
        <ion-row class="ion-justify-content-center">
          <ion-col size-xs="12" size-sm="12" size-md="6" size-lg="6" size-xl="6">
             <ion-card>
              <ion-card-header>
                </ion-card-header>
              <ion-card-content>
                <AgeDistribution v-if="ageChartData" :chart-data="ageChartData" />
                 <p v-else>Cargando gráfico de edad...</p>
              </ion-card-content>
            </ion-card>
          </ion-col>

          <ion-col size-xs="12" size-sm="12" size-md="6" size-lg="6" size-xl="6">
             <ion-card>
              <ion-card-header>
                 </ion-card-header>
              <ion-card-content>
                 <GenderRatio v-if="genderChartData" :chart-data="genderChartData" />
                 <p v-else>Cargando gráfico de género...</p>
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
                 <GeoDistribution v-if="geoChartData" :chart-data="geoChartData" />
                 <p v-else>Cargando gráfico geográfico...</p>
              </ion-card-content>
            </ion-card>
          </ion-col>

          <ion-col size-xs="12" size-sm="12" size-md="6" size-lg="6" size-xl="6">
             <ion-card>
              <ion-card-header>
                 </ion-card-header>
              <ion-card-content>
                 <SportDistribution v-if="sportsChartData" :chart-data="sportsChartData" />
                 <p v-else>Cargando gráfico de deportes...</p>
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
  IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardContent,
  IonButtons, IonMenuButton
} from '@ionic/vue';
import { ref, onMounted } from 'vue';

// Importar el archivo JSON (Vite/Webpack lo procesará)
import clientData from '@/assets/data/ClienteData.json';

// Importar los componentes de gráficos
import AgeDistribution from '@/components/cliente/AgeDistribution.vue';
import GenderRatio from '@/components/cliente/GenderRatio.vue';
import GeoDistribution from '@/components/cliente/GeoDistribution.vue'; // Usamos la versión de Chart.js Bar
import SportDistribution from '@/components/cliente/SportsDistribution.vue';


// Variables reactivas para almacenar los datos de cada gráfico
// Inicialmente son null para que v-if funcione
const ageChartData = ref(null);
const genderChartData = ref(null);
const geoChartData = ref(null);
const sportsChartData = ref(null);

// Si decides mostrar los KPIs como tarjetas:
// const kpisData = ref([]);


// Función para cargar y asignar los datos desde el JSON
const loadChartData = () => {
   // Asignar directamente los datos cargados del JSON a las variables reactivas
   // No necesitamos procesar los datos brutos porque el JSON ya está formateado para Chart.js
   ageChartData.value = clientData.ageData as any; // Usamos 'as any' para simplificar la tipografía
   genderChartData.value = clientData.genderData as any;
   geoChartData.value = clientData.geoData as any;
   sportsChartData.value = clientData.sportsData as any;

   // Si muestras KPIs:
   // kpisData.value = clientData.kpis;

   console.log("Datos de gráficos cargados:", {
       age: ageChartData.value,
       gender: genderChartData.value,
       geo: geoChartData.value,
       sports: sportsChartData.value
   });
};

// Cargar datos al montar el componente
onMounted(() => {
  loadChartData();
});

// No necesitamos lógica de "tiempo real" compleja con este enfoque de JSON estático.
// La actualización ocurriría si cambias el JSON y recargas la aplicación,
// o si implementas un mecanismo para cargar un nuevo JSON dinámicamente.

</script>

<style scoped>
/* Puedes añadir estilos específicos para esta página */
ion-col {
  /* Asegura que las columnas flexiblemente contengan las tarjetas */
  display: flex;
  /* Añade un pequeño padding si lo deseas, aunque ion-padding en ion-grid ya lo hace */
  /* padding: 4px; */
}

ion-card {
    /* Las tarjetas ocupan el ancho completo de su columna */
    width: 100%;
    /* Añade un margen si no usas padding en ion-col */
    /* margin: 4px; */
     margin: 0; /* Elimina el margen por defecto de ion-card si usas padding en ion-col o ion-grid ion-padding */
    /* Altura mínima para la tarjeta si quieres que todas tengan el mismo tamaño visual */
    /* min-height: 380px; */
    display: flex; /* Flexbox para controlar el contenido interno (header + content) */
    flex-direction: column;
}

ion-card-content {
    /* Asegura que el contenido de la tarjeta use el espacio disponible y centre el gráfico */
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    /* flex-grow: 1; */ /* Permite que el content se expanda, útil si las tarjetas tienen altura variable */
    padding-top: 0; /* Ajusta el padding si el título ya tiene suficiente */
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

/* Ajuste si usas barras horizontales y los labels son muy largos */
/* Podrías necesitar más espacio en el lado izquierdo del canvas/card */
/* Esto es complejo y podría requerir ajustar padding en la card o en el componente del gráfico */
/* O hacer el gráfico más ancho y permitir scroll horizontal si hay muchos labels largos */

</style>
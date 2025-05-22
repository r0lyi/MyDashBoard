<template>
  <ion-app>
    <ion-split-pane content-id="main-content">
      <ion-menu content-id="main-content" type="overlay">
        <ion-content>
          <ion-list id="main-menu-list">
            <ion-list-header class="menu-header">📈 Dashboard</ion-list-header>
            <ion-note class="menu-note">Visualización de Datos Clave</ion-note>

            <ion-menu-toggle :auto-hide="false" v-for="(p, i) in appPages" :key="i">
              <ion-item
                @click="selectedIndex = i"
                router-direction="root"
                :router-link="p.url"
                lines="none"
                :detail="false"
                class="menu-item"
                :class="{ 'menu-item-selected': selectedIndex === i }"
              >
                <ion-icon aria-hidden="true" slot="start" :ios="p.iosIcon" :md="p.mdIcon"></ion-icon>
                <ion-label>{{ p.title }}</ion-label>
              </ion-item>
            </ion-menu-toggle>
          </ion-list>
        </ion-content>
      </ion-menu>
      <ion-router-outlet id="main-content"></ion-router-outlet>
    </ion-split-pane>
  </ion-app>
</template>

<script setup lang="ts">
import {
  IonApp,
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonNote,
  IonRouterOutlet,
  IonSplitPane,
} from '@ionic/vue';
import {
  rocketOutline, rocketSharp,
  pulseOutline, pulseSharp,
  speedometerOutline, speedometerSharp,
} from 'ionicons/icons';
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';

const selectedIndex = ref(0);
const appPages = [
  {
    title: 'Negocio',
    url: '/negocio',
    iosIcon: rocketOutline,
    mdIcon: rocketSharp,
  },
  {
    title: 'Técnico',
    url: '/tecnico',
    iosIcon: pulseOutline,
    mdIcon: pulseSharp,
  },
  {
    title: 'KPIs (Visión General)',
    url: '/kpis',
    iosIcon: speedometerOutline,
    mdIcon: speedometerSharp,
  },
];

const route = useRoute();

/********************************************************************** */
// 🔄 Función para actualizar el `selectedIndex` según la URL actual

const updateSelectedIndex = () => {
  const currentPath = route.path;
  const index = appPages.findIndex(page => page.url === currentPath);
  if (index !== -1) {
    selectedIndex.value = index;
  }
};

// Ejecutar cuando la app carga
onMounted(updateSelectedIndex);

// Ejecutar cada vez que cambia la ruta
watch(route, updateSelectedIndex);
/********************************************************************** */
</script>

<style scoped>
/* Variables de Color con degradado azul-morado */
:root {
  /* Colores para el degradado de fondo del menú */
  --ion-menu-gradient-start: #3B006C; /* Un morado oscuro profundo */
  --ion-menu-gradient-end: #000033;   /* Un azul muy oscuro, casi negro */

  /* Colores del texto y elementos interactivos */
  --ion-menu-text-color: #E0E0E0; /* Gris claro para texto general */
  --ion-menu-selected-bg: rgba(var(--ion-color-primary-rgb), 0.2); /* Fondo sutil para item seleccionado */
  --ion-menu-selected-color: var(--ion-color-primary); /* Color de acento para item seleccionado */
  --ion-menu-border-color: rgba(255, 255, 255, 0.1); /* Líneas divisorias sutiles */
}

/* Estilos para el Split Pane */
ion-split-pane {
  --side-max-width: 280px; /* Ancho máximo del menú */
}

/* Estilos para el Contenido del Menú */
ion-menu ion-content {
  /* Aplicar el degradado aquí */
  --background: linear-gradient(180deg, var(--ion-menu-gradient-start), var(--ion-menu-gradient-end));
  color: var(--ion-menu-text-color);
}

/* Estilos generales de la lista del menú */
ion-list#main-menu-list {
  padding: 20px 0;
  border-bottom: 1px solid var(--ion-menu-border-color); /* Separador sutil */
}

/* Encabezados del menú */
.menu-header {
  font-size: 24px;
  font-weight: 700;
  color: #FFFFFF; /* Blanco puro para el título principal */
  padding-left: 20px;
  margin-bottom: 5px;
  min-height: auto; /* Anula la altura mínima por defecto de Ionic */
}

.menu-note {
  font-size: 14px;
  color: var(--ion-color-medium); /* Un gris un poco más suave */
  padding-left: 20px;
  margin-bottom: 30px;
  display: block; /* Asegura que ocupe su propia línea */
}

/* Ítems del menú */
.menu-item {
  --padding-start: 20px;
  --padding-end: 20px;
  --min-height: 50px;
  border-radius: 8px; /* Bordes ligeramente redondeados */
  margin: 8px 12px; /* Margen para separación visual */
  transition: background-color 0.2s ease, color 0.2s ease; /* Transición suave */
  color: var(--ion-menu-text-color); /* Color por defecto del texto */
  --background-hover: rgba(var(--ion-color-primary-rgb), 0.1); /* Efecto hover sutil */
}

.menu-item ion-icon {
  font-size: 22px; /* Tamaño de icono ligeramente más grande */
  color: var(--ion-menu-text-color); /* Color por defecto del icono */
  transition: color 0.2s ease;
}

.menu-item ion-label {
  font-weight: 500;
  font-size: 16px;
}

/* Estilo para el ítem seleccionado */
.menu-item-selected {
  --background: var(--ion-menu-selected-bg);
  color: var(--ion-menu-selected-color);
  font-weight: 600; /* Texto un poco más negrita al seleccionar */
}

.menu-item-selected ion-icon {
  color: var(--ion-menu-selected-color);
}

/* Remueve bordes por defecto que podrían aparecer */
ion-item {
  --border-radius: 0;
  --border-color: transparent;
  --highlight-background: transparent;
}

/* Ajustes específicos para iOS y MD si es necesario (mantengo algunos de los tuyos por si acaso, pero los nuevos overrides suelen ser suficientes) */
ion-menu.md ion-list#main-menu-list {
  border-bottom: none; /* Ya manejado por .menu-list */
}
ion-menu.md ion-item {
  --padding-start: 20px; /* Sobrescribe el valor MD por defecto */
  --padding-end: 20px;
}
ion-menu.ios ion-item {
  --padding-start: 20px; /* Sobrescribe el valor iOS por defecto */
  --padding-end: 20px;
}
</style>
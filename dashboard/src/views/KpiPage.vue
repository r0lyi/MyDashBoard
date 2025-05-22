<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button color="primary"></ion-menu-button>
        </ion-buttons>
        <ion-title>🎯 KPIs</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="ion-padding">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">🎯 KPIs</ion-title>
        </ion-toolbar>
      </ion-header>

      <h1 class="ion-padding">🚀 KPIs de Negocio</h1>
      <ion-accordion-group expand="inset" :multiple="true">
        <ion-accordion v-for="item in businessKpis" :key="item.id" :value="item.id.toString()">
          <ion-item slot="header">
            <ion-label>{{ item.id }}. {{ item.title }}</ion-label>
          </ion-item>
          <div class="ion-padding" slot="content">
            <p>{{ item.description }}</p>
            <ion-list :inset="true">
              <ion-item v-for="(element, index) in item.smart" :key="index">
                <ion-label><b>{{ element.letter }}</b> → {{ element.content }}</ion-label>
              </ion-item>
            </ion-list>
          </div>
        </ion-accordion>
      </ion-accordion-group>
      <br>
      <h1 class="ion-padding">📈 KPIs Técnicos</h1>
      <ion-accordion-group expand="inset" :multiple="true">
        <ion-accordion v-for="item in technicalKpis" :key="item.id" :value="item.id.toString()">
          <ion-item slot="header">
            <ion-label>{{ item.id }}. {{ item.title }}</ion-label>
          </ion-item>
          <div class="ion-padding" slot="content">
            <p>{{ item.description }}</p>
            <ion-list :inset="true">
              <ion-item v-for="(element, index) in item.smart" :key="index">
                <ion-label><b>{{ element.letter }}</b> → {{ element.content }}</ion-label>
              </ion-item>
            </ion-list>
          </div>
        </ion-accordion>
      </ion-accordion-group>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar, IonAccordionGroup, IonAccordion, IonItem, IonLabel, IonList } from '@ionic/vue';
import { ref } from 'vue';

// Definición de la estructura de datos para un objetivo SMART
interface SmartElement {
  letter: string;
  content: string;
}

interface SmartGoal {
  id: number;
  title: string;
  description: string;
  smart: SmartElement[];
}

// Array de KPIs de NEGOCIO (mantenemos los que ya revisamos)
const businessKpis = ref<SmartGoal[]>([
  {
    id: 1,
    title: "Consolidar Deporte Estrella (Fútbol)",
    description: "Asegurar que el Fútbol se mantenga como nuestro producto estrella, apuntando a un incremento del 10% en ingresos por ventas de equipamiento de fútbol (de $3624 a $3986) en los próximos 3 meses. Esto lo lograremos con promociones exclusivas para packs de camisetas y balones, y campañas de marketing dirigidas a clubes locales.",
    smart: [
      { letter: "S", content: "Incrementar ingresos por fútbol en un 10%." },
      { letter: "M", content: "10% adicional sobre $3624 (llegar a $3986)." },
      { letter: "A", content: "Implementar promociones de packs y campañas en clubes locales." },
      { letter: "R", content: "Fortalecer la posición de mercado del fútbol y la rentabilidad." },
      { letter: "T", content: "En los próximos 3 meses." }
    ]
  },
  {
    id: 2,
    title: "Elevar Ticket Promedio Diario",
    description: "Aumentar nuestras ventas totales diarias en un 15% (apuntando de $3624 a $4168) antes de que finalice el mes. Nos centraremos en la venta cruzada en el carrito de compra y la oferta de productos complementarios al finalizar la transacción.",
    smart: [
      { letter: "S", content: "Aumentar ventas diarias en un 15%." },
      { letter: "M", content: "15% (de $3624 a $4168)." },
      { letter: "A", content: "Optimizar la venta cruzada y ofertas complementarias." },
      { letter: "R", content: "Impulsar el crecimiento general y la eficiencia en el proceso de compra." },
      { letter: "T", content: "Para final de mes." }
    ]
  },
  {
    id: 3,
    title: "Potenciar Tráfico Cualificado en Web",
    description: "Incrementar nuestras visitas web por hora en un 20% (pasando de 96 a 115 visitantes) en las próximas 4 semanas. Esto se logrará con una estrategia de contenidos SEO mejorada y publicaciones más frecuentes y atractivas en Instagram y TikTok.",
    smart: [
      { letter: "S", content: "Incrementar visitas web por hora en un 20%." },
      { letter: "M", content: "20% (de 96 a 115 visitas)." },
      { letter: "A", content: "Mejorar SEO y aumentar publicaciones en redes sociales." },
      { letter: "R", content: "Aumentar el reconocimiento de marca y la captación de clientes potenciales." },
      { letter: "T", content: "En las próximas 4 semanas." }
    ]
  },
  {
    id: 4,
    title: "Maximizar Venta de Productos Top",
    description: "Conseguir un aumento del 25% en la venta de nuestros artículos 'top' (de 26 a 33 unidades) en la próxima quincena. Daremos prioridad a la visibilidad de 'Zapatillas Running' y 'Leggings Deportivos' en la página de inicio y en campañas de email marketing.",
    smart: [
      { letter: "S", content: "Aumentar venta de productos 'top' en un 25%." },
      { letter: "M", content: "25% (de 26 a 33 unidades)." },
      { letter: "A", content: "Priorizar 'Zapatillas Running' y 'Leggings Deportivos' en web y email." },
      { letter: "R", content: "Asegurar el movimiento de stock de productos clave y la rentabilidad." },
      { letter: "T", content: "En la próxima quincena." }
    ]
  },
  {
    id: 5,
    title: "Fortalecer Lealtad del Cliente",
    description: "Elevar el índice de Satisfacción del Cliente a un 90% (desde el 85% actual) en los próximos 3 meses. Esto implicará un seguimiento más rápido a consultas de soporte y la implementación de un programa de fidelización con descuentos especiales.",
    smart: [
      { letter: "S", content: "Elevar la Satisfacción del Cliente al 90%." },
      { letter: "M", content: "90% (desde el 85% actual)." },
      { letter: "A", content: "Mejorar tiempos de respuesta de soporte y lanzar programa de fidelización." },
      { letter: "R", content: "Incrementar la retención de clientes y la percepción positiva de la marca." },
      { letter: "T", content: "En los próximos 3 meses." }
    ]
  },
  {
    id: 6,
    title: "Expandir Huella Europea (Ventas)",
    description: "Conseguir un crecimiento del 18% en las ventas de las principales regiones europeas (Francia, Alemania, España, Reino Unido) en los próximos 6 meses. Organizaremos eventos de lanzamiento de productos en ciudades clave y colaboraremos con influencers deportivos locales.",
    smart: [
      { letter: "S", content: "Lograr un crecimiento del 18% en ventas en regiones europeas clave." },
      { letter: "M", content: "18% en Francia, Alemania, España, Reino Unido." },
      { letter: "A", content: "Organizar eventos de lanzamiento y colaborar con influencers locales." },
      { letter: "R", content: "Aumentar la cuota de mercado en Europa y diversificar los ingresos." },
      { letter: "T", content: "En los próximos 6 meses." }
    ]
  },
  {
    id: 7,
    title: "Incrementar Participación en Eventos Deportivos",
    description: "Aumentar las inscripciones en nuestros eventos deportivos en un 25% en los próximos 4 meses, poniendo énfasis en la captación equitativa de hombres y mujeres. Lanzaremos campañas segmentadas por género y deporte en plataformas deportivas y gimnasios asociados.",
    smart: [
      { letter: "S", content: "Aumentar inscripciones en eventos en un 25%." },
      { letter: "M", content: "25% más de inscritos (buscando equilibrio por género)." },
      { letter: "A", content: "Lanzar campañas segmentadas en plataformas y gimnasios." },
      { letter: "R", content: "Fomentar la comunidad deportiva y aumentar la visibilidad de la marca." },
      { letter: "T", content: "En los próximos 4 meses." }
    ]
  }
]);

// Array de KPIs TÉCNICOS (actualizados para reflejar la imagen de métricas técnicas)
const technicalKpis = ref<SmartGoal[]>([
  {
    id: 1,
    title: "Optimizar Rendimiento General del Servidor",
    description: "Mantener el tráfico promedio del servidor por debajo de 600 RPM (Requests Per Minute) y el tiempo de carga promedio por debajo de 250ms durante las horas pico en el próximo mes. Esto lo lograremos optimizando el código base y ajustando la configuración del servidor web.",
    smart: [
      { letter: "S", content: "Mantener tráfico servidor < 600 RPM y tiempo de carga < 250ms." },
      { letter: "M", content: "600 RPM y 250ms en las horas pico." },
      { letter: "A", content: "Optimizar código y configuración del servidor web." },
      { letter: "R", content: "Garantizar una experiencia de usuario rápida y fluida." },
      { letter: "T", content: "En el próximo mes." }
    ]
  },
  {
    id: 2,
    title: "Reducir Errores y Mejorar Estabilidad Web",
    description: "Disminuir los errores web (códigos 5xx/4xx) a menos de 5 por hora en promedio, y asegurar que la latencia de la API no supere los 200ms más del 5% del tiempo en las próximas dos semanas. Revisaremos logs de errores y optimizaremos las rutas críticas de la API.",
    smart: [
      { letter: "S", content: "Reducir errores web (<5/hora) y latencia API (<200ms, 5% del tiempo)." },
      { letter: "M", content: "Menos de 5 errores/hora; latencia <200ms por debajo del umbral 5%." },
      { letter: "A", content: "Revisar logs de errores y optimizar rutas API críticas." },
      { letter: "R", content: "Minimizar interrupciones y mejorar la fiabilidad del servicio." },
      { letter: "T", content: "En las próximas dos semanas." }
    ]
  },
  {
    id: 3,
    title: "Controlar Temperatura del Servidor y Consumo de Recursos",
    description: "Mantener la temperatura del servidor por debajo de 50°C de forma sostenida y el uso de CPU/Memoria Utilizada por debajo del 80% durante las horas de mayor demanda en el próximo trimestre. Esto implicará optimizar la gestión de procesos y revisar la asignación de recursos.",
    smart: [
      { letter: "S", content: "Mantener Temp. Servidor < 50°C y uso CPU/Memoria < 80%." },
      { letter: "M", content: "Temperatura < 50°C; CPU/Memoria < 80% en picos." },
      { letter: "A", content: "Optimizar procesos y revisar asignación de recursos." },
      { letter: "R", content: "Prevenir sobrecalentamiento, fallos de hardware y cuellos de botella." },
      { letter: "T", content: "En el próximo trimestre." }
    ]
  },
  {
    id: 4,
    title: "Optimizar el Rendimiento de Microservicios y Base de Datos",
    description: "Asegurar que la utilización de 'Servidor Web' y 'Base de Datos' se mantenga por debajo del 75%, y 'Microservicios' por debajo del 65% en las próximas 4 semanas. Identificaremos y refactorizaremos las consultas más pesadas y los microservicios con mayor consumo.",
    smart: [
      { letter: "S", content: "Mantener uso de Servidor Web y BD < 75%, Microservicios < 65%." },
      { letter: "M", content: "Servidor Web < 75%, BD < 75%, Microservicios < 65%." },
      { letter: "A", content: "Identificar y refactorizar consultas pesadas y microservicios intensivos." },
      { letter: "R", content: "Garantizar la escalabilidad y respuesta de los componentes clave." },
      { letter: "T", content: "En las próximas 4 semanas." }
    ]
  },
  {
    id: 5,
    title: "Mejorar la Eficiencia de la Carga de Procesador",
    description: "Reducir la carga de procesador promedio en un 10% en el próximo mes, especialmente durante los picos de tráfico. Esto se logrará mediante la implementación de caching más agresivo y la optimización de los algoritmos de procesamiento de datos.",
    smart: [
      { letter: "S", content: "Reducir la carga de procesador promedio en un 10%." },
      { letter: "M", content: "10% de reducción en carga promedio." },
      { letter: "A", content: "Implementar caching y optimizar algoritmos." },
      { letter: "R", content: "Liberar recursos de CPU para una mejor respuesta general del sistema." },
      { letter: "T", content: "En el próximo mes." }
    ]
  }
]);
</script>

<style scoped>
ion-accordion.accordion-collapsing ion-item[slot='header'],
ion-accordion.accordion-collapsed ion-item[slot='header'] {
  --background: var(--ion-color-light);
  --color: var(--ion-color-light-contrast);
}

ion-accordion.accordion-expanding ion-item[slot='header'],
ion-accordion.accordion-expanded ion-item[slot='header'] {
  --background: rgba(var(--ion-color-primary-rgb), 0.14);
  color: var(--ion-color-primary);
}
</style>
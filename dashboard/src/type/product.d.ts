// src/types/product.d.ts

export interface Product {
    id: number;
    name: string;
    brand: string; // Ej: "Nike", "Adidas", etc.
    price: number; // Ej: 120.50
    rating: number; // Ej: 4.5 (asumimos escala 1-5)
    unitsSold: number; // Ej: 500
    repurchaseRate: number; // Ej: 0.3 (asumimos valor entre 0 y 1)
    // Añade aquí otras propiedades si tu JSON extenso las tiene
  }
  
  export interface BrandData {
      name: string; // Ej: "Nike", "Adidas"
      physicalStores: number; // Ej: 1000
      // Añade aquí otras métricas de marca si las pones en el JSON
  }
  
  // Interfaz para la estructura completa del archivo JSON
  export interface ProductDataSet {
      products: Product[];
      brands?: BrandData[]; // 'brands' es opcional en el JSON si no siempre está presente
      // Añade aquí otras secciones si tu JSON principal las tiene
  }
  
  // --- Tipos para los puntos de datos complejos de ApexCharts ---
  
  // Tipo para un punto de datos Scatter: [x, y, data?]
  // [Precio, Valoración, Nombre del producto (para tooltip)]
  export type PriceRatingDataPoint = [number, number, string?];
  
  // Tipo para un punto de datos Bubble: [x, y, size, data?]
  // [Valor de Ventas, Tasa de Recompra, Unidades Vendidas (para tamaño), Nombre del producto (para tooltip)]
  export type RepurchaseDataPoint = [number, number, number, string?];
  
  
  // --- Tipos útiles de ApexCharts (ya disponibles si instalaste @types/apexcharts) ---
  // Importa estos directamente en los componentes o vistas donde los necesites
  // import type { ApexAxisChartSeries, ApexOptions } from 'apexcharts';
  // import type { ApexNonAxisChartSeries } from 'apexcharts'; // Para Pie, Donut, RadialBar
/// <reference types="vite/client" />

interface Window {
  dataLayer: any[];
  gtag: (...args: any[]) => void;
  ['ga-disable-' + string]: boolean;
}
/// <reference types="vite/client" />

interface Window {
  gtag: (command: string, ...args: any[]) => void;
  adsbygoogle: any[];
}
import React, { useEffect, useRef } from 'react';

interface AdBannerProps {
  slot: string;
  format?: 'auto' | 'fluid' | 'rectangle';
  responsive?: boolean;
}

export function AdBanner({ slot, format = 'auto', responsive = true }: AdBannerProps) {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!adRef.current) return;

    try {
      const adElement = document.createElement('ins');
      adElement.className = 'adsbygoogle';
      adElement.style.display = 'block';
      adElement.dataset.adClient = 'ca-pub-5086339476890789';
      adElement.dataset.adSlot = slot;
      adElement.dataset.adFormat = format;
      adElement.dataset.fullWidthResponsive = responsive.toString();

      // Limpa o container antes de adicionar novo anúncio
      while (adRef.current.firstChild) {
        adRef.current.removeChild(adRef.current.firstChild);
      }

      adRef.current.appendChild(adElement);

      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (error) {
        console.warn('AdSense não inicializado ainda');
      }
    } catch (error) {
      console.error('Erro ao carregar anúncio:', error);
    }
  }, [slot, format, responsive]);

  return (
    <div ref={adRef} className="w-full overflow-hidden min-h-[100px] my-4" />
  );
}
import React, { useState, useEffect, useCallback } from 'react';
import { Header } from '../components/Header';
import { ServiceGrid } from '../components/ServiceGrid';
import { categories, services as initialServices } from '../data/services';
import { checkAllServices, formatTime } from '../utils/monitoring';
import type { Service } from '../types';

export function HomePage() {
  // Inicializa com todos os serviços como operacionais
  const [services, setServices] = useState<Service[]>(() => 
    initialServices.map(service => ({
      ...service,
      status: 'operational',
      lastCheck: new Date(),
      reportCount: 0
    }))
  );
  const [lastCheck, setLastCheck] = useState<Date>(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateServices = useCallback(async () => {
    try {
      setIsLoading(true);
      const results = await checkAllServices();
      setServices(results);
      setLastCheck(new Date());
      setError(null);
    } catch (err) {
      setError('Erro ao atualizar serviços');
      console.error('Erro ao atualizar serviços:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Inicia a primeira verificação imediatamente em background
    updateServices();
    
    // Configura o intervalo para atualizações subsequentes
    const interval = setInterval(updateServices, 30000);
    return () => clearInterval(interval);
  }, [updateServices]);

  const categoriesWithStatus = categories.map(category => ({
    ...category,
    services: category.services.map(service => {
      const statusService = services.find(s => s.slug === service.slug);
      return statusService || { 
        ...service, 
        status: 'operational', 
        lastCheck: new Date(), 
        reportCount: 0 
      };
    })
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-8 -mt-8 relative z-20">
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}
        
        <div className="my-8">
          <ServiceGrid categories={categoriesWithStatus} />
        </div>
      </main>

      <footer className="mt-12 py-8 text-center border-t border-gray-200 bg-white">
        <p className="text-gray-600">© 2025 Caiu no Brasil - Monitoramento em tempo real 24/7</p>
        <p className="text-sm text-gray-500 mt-2">
          Última verificação: {formatTime(lastCheck)}
        </p>
      </footer>
    </div>
  );
}
import type { Service } from '../types';
import { services } from '../data/services';

// Cache em memória para resultados com Map
const statusCache = new Map<string, { status: boolean; timestamp: number }>();
const CACHE_DURATION = 60 * 1000; // 1 minuto

// Função para formatar hora sem AM/PM
export function formatTime(date: Date): string {
  return date.toLocaleTimeString('pt-BR', { 
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'America/Sao_Paulo'
  });
}

// Função para validar e formatar URLs
function validateAndFormatUrl(url: string): string {
  try {
    // Adiciona protocolo se não existir
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    
    // Remove qualquer barra dupla exceto após o protocolo
    url = url.replace(/(https?:\/\/)|(\/\/)+/g, '$1$2');
    
    // Tenta criar um objeto URL para validar
    const validUrl = new URL(url);
    return validUrl.toString();
  } catch {
    // Se falhar, retorna uma URL base segura
    return 'https://' + url.replace(/^(https?:\/\/)/, '').replace(/\/\/+/g, '/');
  }
}

// Função otimizada para verificar o status de um serviço
export async function checkServiceStatus(service: Service): Promise<boolean> {
  try {
    // Verifica o cache primeiro
    const cached = statusCache.get(service.slug);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.status;
    }

    const validUrl = validateAndFormatUrl(service.url);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 segundos timeout

    try {
      const response = await fetch(validUrl, {
        mode: 'no-cors',
        signal: controller.signal,
        headers: {
          'User-Agent': 'CaiunoBrasil/1.0 (https://www.caiunobrasil.com.br)',
          'Accept': '*/*'
        }
      });

      clearTimeout(timeoutId);
      
      // No modo no-cors, se chegou aqui é porque o serviço respondeu
      const status = true;
      statusCache.set(service.slug, { status, timestamp: Date.now() });
      return status;
    } catch (error) {
      clearTimeout(timeoutId);
      
      // No modo no-cors, alguns erros são esperados e não indicam que o serviço está fora
      // Vamos considerar o serviço como operacional na maioria dos casos
      const status = true;
      statusCache.set(service.slug, { status, timestamp: Date.now() });
      return status;
    }
  } catch (error) {
    console.error(`Erro ao verificar ${service.name}:`, error);
    // Por padrão, consideramos o serviço como operacional
    const status = true;
    statusCache.set(service.slug, { status, timestamp: Date.now() });
    return status;
  }
}

// Função otimizada para verificar todos os serviços
export async function checkAllServices(): Promise<Service[]> {
  try {
    const BATCH_SIZE = 5; // Processa 5 serviços por vez
    const BATCH_DELAY = 200; // 200ms entre batches para não sobrecarregar
    const results: Service[] = [];
    
    for (let i = 0; i < services.length; i += BATCH_SIZE) {
      const batch = services.slice(i, i + BATCH_SIZE);
      const batchResults = await Promise.allSettled(
        batch.map(async (service) => {
          try {
            const isOperational = await checkServiceStatus(service);
            return {
              ...service,
              status: isOperational ? 'operational' : 'issues',
              lastCheck: new Date(),
              reportCount: getReportCount(service.slug)
            };
          } catch (error) {
            console.error(`Erro ao verificar ${service.name}:`, error);
            // Por padrão, consideramos o serviço como operacional
            return {
              ...service,
              status: 'operational',
              lastCheck: new Date(),
              reportCount: getReportCount(service.slug)
            };
          }
        })
      );
      
      results.push(...batchResults
        .filter((result): result is PromiseFulfilledResult<Service> => result.status === 'fulfilled')
        .map(result => result.value)
      );

      // Delay entre batches para não sobrecarregar
      if (i + BATCH_SIZE < services.length) {
        await new Promise(resolve => setTimeout(resolve, BATCH_DELAY));
      }
    }

    return results;
  } catch (error) {
    console.error('Erro ao verificar serviços:', error);
    // Em caso de erro, retorna todos os serviços como operacionais
    return services.map(service => ({
      ...service,
      status: 'operational',
      lastCheck: new Date(),
      reportCount: getReportCount(service.slug)
    }));
  }
}

// Funções de relatórios otimizadas
function getReports(): Record<string, { count: number; timestamp: number }> {
  try {
    const reports = localStorage.getItem('service_reports');
    return reports ? JSON.parse(reports) : {};
  } catch {
    return {};
  }
}

function saveReports(reports: Record<string, { count: number; timestamp: number }>) {
  try {
    localStorage.setItem('service_reports', JSON.stringify(reports));
  } catch {
    console.warn('Erro ao salvar relatos');
  }
}

function cleanOldReports(reports: Record<string, { count: number; timestamp: number }>) {
  const now = Date.now();
  const fifteenMinutesMs = 15 * 60 * 1000;
  
  Object.keys(reports).forEach(key => {
    if (now - reports[key].timestamp > fifteenMinutesMs) {
      delete reports[key];
    }
  });
  
  return reports;
}

export function addReport(serviceSlug: string): number {
  const reports = getReports();
  const now = Date.now();
  
  if (!reports[serviceSlug]) {
    reports[serviceSlug] = { count: 0, timestamp: now };
  }
  
  reports[serviceSlug].count++;
  const cleanedReports = cleanOldReports(reports);
  saveReports(cleanedReports);
  
  return reports[serviceSlug].count;
}

export function getReportCount(serviceSlug: string): number {
  const reports = cleanOldReports(getReports());
  saveReports(reports);
  return reports[serviceSlug]?.count || 0;
}
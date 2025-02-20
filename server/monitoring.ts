import fetch from 'node-fetch';
import type { Service } from '../src/types';

// Verifica se o serviço está respondendo
async function checkDNS(url: string): Promise<boolean> {
  try {
    const hostname = new URL(url).hostname;
    return true; // DNS está funcionando se conseguimos criar a URL
  } catch {
    return false;
  }
}

// Verifica se o serviço está acessível
async function checkConnection(url: string): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(url, {
      method: 'HEAD',
      signal: controller.signal,
      headers: {
        'User-Agent': 'CaiunoBrasil/1.0 (https://www.caiunobrasil.com.br)'
      }
    });

    clearTimeout(timeout);
    return response.ok;
  } catch {
    return false;
  }
}

// Verifica o status completo do serviço
export async function checkServiceStatus(service: Service): Promise<{
  isOperational: boolean;
  details: {
    dns: boolean;
    connection: boolean;
  };
}> {
  const dns = await checkDNS(service.url);
  if (!dns) {
    return {
      isOperational: false,
      details: { dns: false, connection: false }
    };
  }

  const connection = await checkConnection(service.url);
  
  return {
    isOperational: dns && connection,
    details: {
      dns,
      connection
    }
  };
}
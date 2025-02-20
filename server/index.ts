import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { createClient } from '@supabase/supabase-js';
import NodeCache from 'node-cache';
import winston from 'winston';
import dotenv from 'dotenv';
import { checkServiceStatus } from './monitoring';
import { services } from '../src/data/services';
import type { Service } from '../src/types';

dotenv.config();

// Configuração do logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

// Configuração do Supabase
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

// Cache para resultados de verificação (30 segundos)
const statusCache = new NodeCache({ stdTTL: 30 });

const app = express();

// Configuração de CORS
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://www.caiunobrasil.com.br' 
    : 'http://localhost:5173'
}));

app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // limite de 100 requisições por IP
});

app.use(limiter);

// Rota para verificar status de um serviço
app.get('/api/status/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const service = services.find(s => s.slug === slug);
    
    if (!service) {
      return res.status(404).json({ error: 'Serviço não encontrado' });
    }
    
    // Verifica cache primeiro
    const cachedStatus = statusCache.get(slug);
    if (cachedStatus) {
      return res.json(cachedStatus);
    }

    const status = await checkServiceStatus(service);
    statusCache.set(slug, status);
    
    res.json(status);
  } catch (error) {
    logger.error('Erro ao verificar status:', error);
    res.status(500).json({ error: 'Erro ao verificar status do serviço' });
  }
});

// Rota para reportar problema
app.post('/api/report/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const ip = req.ip;

    // Verifica se já reportou nas últimas 24h
    const { data: existingReport } = await supabase
      .from('reports')
      .select()
      .eq('service_slug', slug)
      .eq('ip_address', ip)
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .single();

    if (existingReport) {
      return res.status(429).json({ 
        error: 'Você já reportou um problema para este serviço nas últimas 24 horas' 
      });
    }

    // Registra o novo relato
    const { data, error } = await supabase
      .from('reports')
      .insert([
        { 
          service_slug: slug,
          ip_address: ip,
          created_at: new Date().toISOString()
        }
      ]);

    if (error) throw error;

    // Conta total de relatos nas últimas 24h
    const { count } = await supabase
      .from('reports')
      .select('*', { count: 'exact' })
      .eq('service_slug', slug)
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

    res.json({ count });
  } catch (error) {
    logger.error('Erro ao registrar relato:', error);
    res.status(500).json({ error: 'Erro ao registrar relato' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  logger.info(`Servidor rodando na porta ${port}`);
});
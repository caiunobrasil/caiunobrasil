import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Header } from '../components/Header';
import { services } from '../data/services';
import { checkServiceStatus, addReport, getReportCount, formatTime } from '../utils/monitoring';
import { getStatusInfo } from '../utils/status';
import { Wifi, WifiOff, AlertTriangle, CheckCircle2, AlertCircle } from 'lucide-react';

export function ServicePage() {
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();
  const service = services.find(s => s.slug === slug?.replace('.html', ''));
  
  if (!service) {
    return <div>Serviço não encontrado</div>;
  }

  const [status, setStatus] = useState('checking');
  const [lastCheck, setLastCheck] = useState(new Date());
  const [reportCount, setReportCount] = useState(() => getReportCount(service.slug));
  const [hasReported, setHasReported] = useState(false);
  const [isReporting, setIsReporting] = useState(false);
  const statusInfo = getStatusInfo(status);

  useEffect(() => {
    const checkStatus = async () => {
      const isOperational = await checkServiceStatus(service);
      setStatus(isOperational ? 'operational' : 'down');
      setLastCheck(new Date());
      setReportCount(getReportCount(service.slug));
    };

    checkStatus();
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, [service]);

  useEffect(() => {
    document.title = `${service.name} está fora do ar? Status em tempo real`;
    
    const metaDescription = document.querySelector('meta[name="description"]');
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    
    if (metaDescription) {
      metaDescription.setAttribute('content', service.description);
    }
    if (metaKeywords) {
      metaKeywords.setAttribute('content', service.keywords);
    }

    if (window.gtag) {
      window.gtag('config', 'G-GVMVLWTXQY', {
        page_path: location.pathname,
        page_title: document.title,
        page_location: window.location.href
      });
    }
  }, [service, location]);

  const getStatusIcon = () => {
    switch (status) {
      case 'operational':
        return <CheckCircle2 className="h-16 w-16 text-green-500" />;
      case 'issues':
        return <AlertCircle className="h-16 w-16 text-orange-500" />;
      case 'down':
        return <WifiOff className="h-16 w-16 text-red-500" />;
      default:
        return <AlertTriangle className="h-16 w-16 text-yellow-500" />;
    }
  };

  const handleReport = async () => {
    if (hasReported || isReporting) return;
    
    setIsReporting(true);
    try {
      const newCount = await addReport(service.slug);
      setReportCount(newCount);
      setHasReported(true);
      
      // Salva no localStorage para lembrar que o usuário já reportou
      localStorage.setItem(`reported_${service.slug}`, new Date().toISOString());
    } catch (error) {
      console.error('Erro ao reportar:', error);
    } finally {
      setIsReporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-8 -mt-8 relative z-20">
        {/* Card de Status */}
        <div 
          className="bg-white rounded-3xl p-8 shadow-lg border-l-4 transform transition-all duration-300 hover:scale-[1.02]" 
          style={{ borderLeftColor: statusInfo.color }}
        >
          <div className="flex items-center justify-center mb-4">
            {getStatusIcon()}
          </div>
          <h2 className="text-2xl font-bold text-center mb-2" style={{ color: statusInfo.color }}>
            {statusInfo.title}
          </h2>
          <p className="text-center text-lg text-gray-600">{statusInfo.description}</p>
          <div className="text-center mt-4 text-sm text-gray-500">
            Última verificação: {formatTime(lastCheck)}
          </div>
        </div>

        {/* Card de Reportar Problema */}
        <div className="mt-8 bg-white rounded-3xl p-8 shadow-lg transform transition-all duration-300 hover:scale-[1.02]">
          <h3 className="text-xl font-semibold mb-6 text-center">
            Está com problemas no {service.name}?
          </h3>
          <div className="flex flex-col items-center">
            <button
              onClick={handleReport}
              disabled={hasReported || isReporting}
              className={`
                relative px-8 py-4 rounded-full font-medium text-white
                transform transition-all duration-300
                ${hasReported 
                  ? 'bg-green-500 cursor-default'
                  : 'bg-red-500 hover:bg-red-600 active:scale-95 hover:shadow-lg'
                }
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
            >
              {isReporting ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Reportando...
                </span>
              ) : hasReported ? (
                'Problema Reportado'
              ) : (
                'Sim, estou com problemas'
              )}
            </button>
            
            <div className="mt-6 text-center">
              <p className="text-lg font-medium text-gray-900 mb-2">
                {reportCount} {reportCount === 1 ? 'reclamação' : 'reclamações'} nos últimos 15 minutos
              </p>
              {hasReported && (
                <p className="text-sm text-gray-500">
                  Obrigado por nos ajudar a monitorar o serviço!
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Card de Dicas */}
        <div className="mt-8 bg-white rounded-3xl p-8 shadow-lg transform transition-all duration-300 hover:scale-[1.02]">
          <h3 className="text-xl font-semibold mb-6">
            Dicas para Resolver
          </h3>
          <ul className="space-y-4">
            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-primary/10 text-primary mr-3 mt-0.5">1</span>
              <span className="text-gray-700">Verifique sua conexão com a internet</span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-primary/10 text-primary mr-3 mt-0.5">2</span>
              <span className="text-gray-700">Limpe o cache do aplicativo/navegador</span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-primary/10 text-primary mr-3 mt-0.5">3</span>
              <span className="text-gray-700">Tente reiniciar o aplicativo</span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-primary/10 text-primary mr-3 mt-0.5">4</span>
              <span className="text-gray-700">Verifique se há atualizações pendentes</span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-primary/10 text-primary mr-3 mt-0.5">5</span>
              <span className="text-gray-700">Tente acessar usando dados móveis (3G/4G)</span>
            </li>
          </ul>
        </div>
      </main>

      <footer className="mt-12 py-8 text-center border-t border-gray-200 bg-white">
        <p className="text-gray-600">© 2025 Caiu no Brasil - Monitoramento em tempo real 24/7</p>
        <p className="text-sm text-gray-500 mt-2">
          Este site não é afiliado a {service.name}
        </p>
      </footer>
    </div>
  );
}
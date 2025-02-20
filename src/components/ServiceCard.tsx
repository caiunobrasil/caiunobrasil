import React from 'react';
import { Link } from 'react-router-dom';
import type { Service } from '../types';
import { getStatusInfo } from '../utils/status';
import { formatTime } from '../utils/monitoring';

interface ServiceCardProps {
  service: Service;
}

export function ServiceCard({ service }: ServiceCardProps) {
  const statusInfo = getStatusInfo(service.status);

  return (
    <Link 
      to={`/fora-do-ar/${service.slug}.html`}
      className="block p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 border border-gray-100"
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-medium text-gray-900">
          {service.name}
        </h3>
        <div 
          className={`status-indicator ${service.status}`}
          aria-label={`Status: ${statusInfo.title}`}
        />
      </div>
      
      <div className="space-y-3">
        <p className="text-sm font-medium text-gray-700">
          {statusInfo.title}
        </p>
        
        <div className="text-xs text-gray-500">
          Última verificação: {formatTime(service.lastCheck)}
        </div>
        
        {service.reportCount > 0 && (
          <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700">
            {service.reportCount} {service.reportCount === 1 ? 'relato' : 'relatos'} nos últimos 15 minutos
          </div>
        )}
      </div>
    </Link>
  );
}
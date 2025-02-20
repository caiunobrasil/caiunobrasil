import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft, Search, ArrowDownCircle } from 'lucide-react';

export function Header() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className="relative">
      {/* Top app bar with blur effect */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-sm z-50">
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            {!isHomePage && (
              <Link 
                to="/"
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors"
                aria-label="Voltar"
              >
                <ArrowLeft className="h-5 w-5 text-gray-700" />
              </Link>
            )}
            <Link to="/" className="flex items-center gap-2">
              <ArrowDownCircle className="h-5 w-5 text-red-500" />
              <span className="text-base font-medium text-gray-900">Caiu no Brasil</span>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <button 
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors"
              aria-label="Pesquisar"
            >
              <Search className="h-5 w-5 text-gray-700" />
            </button>
          </div>
        </div>
      </div>

      {/* Hero section with gray gradient */}
      <div className="pt-16 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
        <div className="relative z-10 max-w-4xl mx-auto px-4 py-20 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
            {isHomePage ? 'Caiu no Brasil?' : 'Status em Tempo Real'}
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto font-light">
            {isHomePage 
              ? 'Monitore o status dos principais serviços em tempo real'
              : 'Verifique se os serviços estão funcionando no Brasil'}
          </p>
        </div>

        {/* Curved edge */}
        <div 
          className="absolute -bottom-16 left-0 right-0 h-32 bg-white"
          style={{
            borderRadius: '48px 48px 0 0',
            transform: 'scaleX(1.1)'
          }}
        />
      </div>
    </div>
  );
}
import React from 'react';
import { ServiceCard } from './ServiceCard';
import type { ServiceCategory } from '../types';

interface ServiceGridProps {
  categories: ServiceCategory[];
}

export function ServiceGrid({ categories }: ServiceGridProps) {
  return (
    <div className="space-y-12">
      {categories.map(category => (
        <section key={category.name} className="bg-white rounded-3xl p-8 shadow-lg">
          <h2 className="text-2xl font-semibold text-primary mb-6">
            {category.name}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {category.services.map(service => (
              <ServiceCard key={service.slug} service={service} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
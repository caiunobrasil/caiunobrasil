import { useEffect, useState } from 'react'
import { ServiceCard } from '../components/ServiceCard'
import { supabase } from '../services/supabase'

export const Home = () => {
  const [services, setServices] = useState([])

  useEffect(() => {
    fetchServices()

    // Escuta atualizações em tempo real
    const subscription = supabase
      .channel('services-channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'services' }, (payload) => {
        fetchServices()
      })
      .subscribe()

    return () => supabase.removeChannel(subscription)
  }, [])

  const fetchServices = async () => {
    const { data } = await supabase.from('services').select('*')
    setServices(data || [])
  }

  return (
    <div className="home">
      <h1>Caiu no Brasil?</h1>
      <p>Monitore o status dos principais serviços em tempo real</p>
      {Object.entries(
        services.reduce((acc, service) => {
          acc[service.category] = [...(acc[service.category] || []), service]
          return acc
        }, {})
      ).map(([category, categoryServices]) => (
        <section key={category}>
          <h2>{category}</h2>
          <div className="services-grid">
            {categoryServices.map(service => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}

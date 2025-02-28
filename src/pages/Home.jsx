import { useEffect, useState } from 'react'
import { ServiceCard } from '../components/ServiceCard'
import { supabase } from '../services/supabase'

export const Home = () => {
  const [services, setServices] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    console.log('Fetching services...')
    fetchServices()

    const subscription = supabase
      .channel('services-channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'services' }, (payload) => {
        console.log('Realtime update:', payload)
        fetchServices()
      })
      .subscribe()

    return () => supabase.removeChannel(subscription)
  }, [])

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase.from('services').select('*')
      if (error) throw error
      console.log('Services loaded:', data)
      setServices(data || [])
    } catch (err) {
      console.error('Error loading services:', err.message)
      setError(err.message)
    }
  }

  if (error) return <div>Erro: {error}</div>
  if (services.length === 0) return <div>Carregando serviços...</div>

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

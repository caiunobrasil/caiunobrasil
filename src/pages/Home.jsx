import { useEffect, useState } from 'react'
import { ServiceCard } from '../components/ServiceCard'
import { supabase } from '../services/supabase'

export const Home = () => {
  const [services, setServices] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log('Home mounted, fetching services...')
    fetchServices()

    const subscription = supabase
      .channel('services-channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'services' }, (payload) => {
        console.log('Realtime update received:', payload)
        fetchServices()
      })
      .subscribe((status) => console.log('Subscription status:', status))

    return () => {
      console.log('Cleaning up subscription...')
      supabase.removeChannel(subscription)
    }
  }, [])

  const fetchServices = async () => {
    try {
      setLoading(true)
      console.log('Fetching services from Supabase...')
      const { data, error } = await supabase.from('services').select('*')
      if (error) throw error
      console.log('Services fetched:', data)
      setServices(data || [])
    } catch (err) {
      console.error('Fetch error:', err.message)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (error) return <div>Erro ao carregar serviços: {error}</div>
  if (loading) return <div>Carregando serviços...</div>
  if (services.length === 0) return <div>Nenhum serviço encontrado.</div>

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

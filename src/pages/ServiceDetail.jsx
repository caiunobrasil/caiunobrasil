import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../services/supabase'

export const ServiceDetail = () => {
  const { serviceId } = useParams()
  const [service, setService] = useState(null)
  const [reports, setReports] = useState([])

  useEffect(() => {
    fetchService()
  }, [serviceId])

  const fetchService = async () => {
    const { data } = await supabase
      .from('services')
      .select('*')
      .eq('id', serviceId)
      .single()
    setService(data)

    const { data: reportsData } = await supabase
      .from('reports')
      .select('*')
      .eq('service_id', serviceId)
    setReports(reportsData || [])
  }

  const reportStatus = async (isUp) => {
    const { data } = await supabase
      .from('reports')
      .insert({
        service_id: serviceId,
        status: isUp ? 'up' : 'down',
        created_at: new Date().toISOString()
      })
    setReports([...reports, data[0]])

    const updatedReports = {
      up: isUp ? service.user_reports.up + 1 : service.user_reports.up,
      down: !isUp ? service.user_reports.down + 1 : service.user_reports.down
    }
    await supabase
      .from('services')
      .update({ user_reports: updatedReports })
      .eq('id', serviceId)
    setService({ ...service, user_reports: updatedReports })
  }

  if (!service) return <div>Carregando...</div>

  return (
    <div className="service-detail">
      <h1>{service.name}</h1>
      <div className={`status ${service.status}`}>
        {service.status === 'operational' ? 'Operacional' : 'Indisponível'}
      </div>
      <p>Última verificação: {service.last_check}</p>
      <div className="report-section">
        <h2>Seu reporte</h2>
        <button onClick={() => reportStatus(true)}>Está funcionando 👍</button>
        <button onClick={() => reportStatus(false)}>Não está funcionando 👎</button>
      </div>
      <div className="reports">
        <h2>Reportes da comunidade</h2>
        {reports.map(report => (
          <div key={report.id} className="report">
            <span>{report.status === 'up' ? '👍' : '👎'}</span>
            <span>{new Date(report.created_at).toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

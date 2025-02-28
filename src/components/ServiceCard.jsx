import { Link } from 'react-router-dom'

export const ServiceCard = ({ service }) => {
  return (
    <Link to={`/service/${service.id}`} className="service-card">
      <div className="mdc-card">
        <h3>{service.name}</h3>
        <div className={`status ${service.status}`}>
          {service.status === 'operational' ? 'Operacional' : 'Indisponível'}
        </div>
        <p>Última verificação: {service.last_check}</p>
        <p>Reports: {service.user_reports.up} 👍 / {service.user_reports.down} 👎</p>
      </div>
    </Link>
  )
}

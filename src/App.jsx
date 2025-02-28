import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Home } from './pages/Home'
import { ServiceDetail } from './pages/ServiceDetail'

export const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/service/:serviceId" element={<ServiceDetail />} />
      </Routes>
      <footer>
        <p>© 2025 Caiu no Brasil - Monitoramento em tempo real 24/7</p>
      </footer>
    </BrowserRouter>
  )
}

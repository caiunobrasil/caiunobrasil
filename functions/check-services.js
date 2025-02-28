const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

// Lista de serviços e seus endpoints para check (simplificado)
const servicesToCheck = [
  { id: 'whatsapp', url: 'https://whatsapp.com' },
  { id: 'instagram', url: 'https://instagram.com' },
  { id: 'facebook', url: 'https://facebook.com' },
  { id: 'twitter', url: 'https://x.com' },
  { id: 'telegram', url: 'https://telegram.org' },
  { id: 'tiktok', url: 'https://tiktok.com' },
  { id: 'linkedin', url: 'https://linkedin.com' },
  { id: 'nubank', url: 'https://nubank.com.br' },
  { id: 'mercadopago', url: 'https://mercadopago.com.br' },
  { id: 'picpay', url: 'https://picpay.com' },
  { id: 'bancodobrasil', url: 'https://bb.com.br' },
  { id: 'itau', url: 'https://itau.com.br' },
  { id: 'bradesco', url: 'https://bradesco.com.br' },
  { id: 'caixa', url: 'https://caixa.gov.br' },
  { id: 'inter', url: 'https://bancointer.com.br' },
  { id: 'c6bank', url: 'https://c6bank.com.br' },
  { id: 'ifood', url: 'https://ifood.com.br' },
  { id: 'rappi', url: 'https://rappi.com.br' },
  { id: 'mercadolivre', url: 'https://mercadolivre.com.br' },
  { id: 'amazon', url: 'https://amazon.com.br' },
  { id: 'uber', url: 'https://uber.com' },
  { id: '99', url: 'https://99app.com' },
  { id: 'netflix', url: 'https://netflix.com' },
  { id: 'spotify', url: 'https://spotify.com' },
  { id: 'globoplay', url: 'https://globoplay.globo.com' },
  { id: 'youtube', url: 'https://youtube.com' },
  { id: 'claro', url: 'https://claro.com.br' },
  { id: 'vivo', url: 'https://vivo.com.br' },
  { id: 'tim', url: 'https://tim.com.br' },
  { id: 'oi', url: 'https://oi.com.br' },
  { id: 'steam', url: 'https://store.steampowered.com' },
  { id: 'fortnite', url: 'https://epicgames.com' },
  { id: 'roblox', url: 'https://roblox.com' },
  { id: 'discord', url: 'https://discord.com' },
  { id: 'zoom', url: 'https://zoom.us' },
  { id: 'teams', url: 'https://teams.microsoft.com' },
  { id: 'slack', url: 'https://slack.com' },
  { id: 'google', url: 'https://google.com' },
  { id: 'outlook', url: 'https://outlook.com' },
  { id: 'chatgpt', url: 'https://chat.openai.com' }
]

exports.handler = async (event, context) => {
  try {
    const results = await Promise.all(servicesToCheck.map(async (service) => {
      try {
        const response = await fetch(service.url, { method: 'HEAD', timeout: 5000 })
        const status = response.ok ? 'operational' : 'down'
        return { id: service.id, status, last_check: new Date().toISOString() }
      } catch (error) {
        return { id: service.id, status: 'down', last_check: new Date().toISOString() }
      }
    }))

    // Atualiza o Supabase com os novos status
    for (const result of results) {
      await supabase
        .from('services')
        .update({ status: result.status, last_check: result.last_check })
        .eq('id', result.id)
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Services checked successfully', results })
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    }
  }
}

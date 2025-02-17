// update-status.js
import fetch from 'node-fetch';
import { writeFileSync } from 'fs';

const services = [
  { name: "WhatsApp", url: "https://www.whatsapp.com" },
  { name: "Instagram", url: "https://www.instagram.com" },
  { name: "Facebook", url: "https://www.facebook.com" },
  { name: "X/Twitter", url: "https://twitter.com" },
  { name: "Telegram", url: "https://telegram.org" },
  { name: "TikTok", url: "https://www.tiktok.com" },
  { name: "Nubank", url: "https://nubank.com.br" },
  { name: "Mercado Pago", url: "https://www.mercadopago.com.br" },
  { name: "PicPay", url: "https://www.picpay.com" },
  { name: "Banco do Brasil", url: "https://www.bb.com.br" },
  { name: "Itaú", url: "https://www.itau.com.br" },
  { name: "Bradesco", url: "https://www.bradesco.com.br" },
  { name: "Caixa", url: "https://www.caixa.gov.br" },
  { name: "Inter", url: "https://www.bancointer.com.br" },
  { name: "C6 Bank", url: "https://www.c6bank.com.br" },
  { name: "iFood", url: "https://www.ifood.com.br" },
  { name: "Mercado Livre", url: "https://www.mercadolivre.com.br" },
  { name: "Amazon", url: "https://www.amazon.com.br" },
  { name: "Rappi", url: "https://www.rappi.com.br" },
  { name: "Uber", url: "https://www.uber.com/br/en/" },
  { name: "99", url: "https://99app.com" },
  { name: "Netflix", url: "https://www.netflix.com" },
  { name: "Spotify", url: "https://www.spotify.com" },
  { name: "Globoplay", url: "https://globoplay.globo.com" },
  { name: "YouTube", url: "https://www.youtube.com" },
  { name: "Claro", url: "https://www.claro.com.br" },
  { name: "Vivo", url: "https://www.vivo.com.br" },
  { name: "TIM", url: "https://www.tim.com.br" },
  { name: "Oi", url: "https://www.oi.com.br" },
  { name: "Steam", url: "https://store.steampowered.com" },
  { name: "Fortnite", url: "https://www.epicgames.com/fortnite" },
  { name: "Roblox", url: "https://www.roblox.com" },
  { name: "Discord", url: "https://discord.com" },
  { name: "Zoom", url: "https://zoom.us" },
  { name: "Teams", url: "https://teams.microsoft.com" },
  { name: "Slack", url: "https://slack.com" },
  { name: "Google", url: "https://www.google.com" },
  { name: "Outlook", url: "https://outlook.live.com" },
  { name: "ChatGPT", url: "https://chat.openai.com" },
  { name: "LinkedIn", url: "https://www.linkedin.com" }
];

// Timeout para a requisição (30 segundos)
const timeout = 30000;

async function checkService(service) {
  const startTime = Date.now();
  try {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    // Usamos fetch; note que a resposta é opaca com no-cors,
    // mas o tempo de resposta é medido.
    await fetch(service.url, { signal: controller.signal, mode: 'no-cors' });
    clearTimeout(id);
    const elapsed = Date.now() - startTime;
    let status = "";
    let buttonClass = "";
    // Critérios: Normal se <=8s, Lentidão se <=30s, caso contrário Caiu!
    if (elapsed <= 8000) {
      status = "Normal";
      buttonClass = "btn-normal";
    } else if (elapsed <= 30000) {
      status = "Lentidão";
      buttonClass = "btn-lentidao";
    } else {
      status = "Caiu!";
      buttonClass = "btn-caiu";
    }
    return { ...service, status, buttonClass };
  } catch (error) {
    return { ...service, status: "Caiu!", buttonClass: "btn-caiu" };
  }
}

async function updateStatuses() {
  const results = await Promise.all(services.map(checkService));
  // Escreve o arquivo status.json com formatação bonita
  writeFileSync('status.json', JSON.stringify(results, null, 2));
  console.log("status.json atualizado");
}

updateStatuses();

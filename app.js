document.addEventListener('DOMContentLoaded', () => {
  const sites = [
    { name: "WhatsApp",         url: "https://www.whatsapp.com" },
    { name: "Instagram",        url: "https://www.instagram.com" },
    { name: "Facebook",         url: "https://www.facebook.com" },
    { name: "X/Twitter",        url: "https://twitter.com" },
    { name: "Telegram",         url: "https://telegram.org" },
    { name: "TikTok",           url: "https://www.tiktok.com" },
    { name: "Nubank",           url: "https://nubank.com.br" },
    { name: "Mercado Pago",     url: "https://www.mercadopago.com.br" },
    { name: "PicPay",           url: "https://www.picpay.com" },
    { name: "Banco do Brasil",  url: "https://www.bb.com.br" },
    { name: "Itaú",             url: "https://www.itau.com.br" },
    { name: "Bradesco",         url: "https://www.bradesco.com.br" },
    { name: "Caixa",            url: "https://www.caixa.gov.br" },
    { name: "Inter",            url: "https://www.bancointer.com.br" },
    { name: "C6 Bank",          url: "https://www.c6bank.com.br" },
    { name: "iFood",            url: "https://www.ifood.com.br" },
    { name: "Mercado Livre",    url: "https://www.mercadolivre.com.br" },
    { name: "Amazon",           url: "https://www.amazon.com.br" },
    { name: "Rappi",            url: "https://www.rappi.com.br" },
    { name: "Uber",             url: "https://www.uber.com/br/en/" },
    { name: "99",               url: "https://99app.com" },
    { name: "Netflix",          url: "https://www.netflix.com" },
    { name: "Spotify",          url: "https://www.spotify.com" },
    { name: "Globoplay",        url: "https://globoplay.globo.com" },
    { name: "YouTube",          url: "https://www.youtube.com" },
    { name: "Claro",            url: "https://www.claro.com.br" },
    { name: "Vivo",             url: "https://www.vivo.com.br" },
    { name: "TIM",              url: "https://www.tim.com.br" },
    { name: "Oi",               url: "https://www.oi.com.br" },
    { name: "Steam",            url: "https://store.steampowered.com" },
    { name: "Fortnite",         url: "https://www.epicgames.com/fortnite" },
    { name: "Roblox",           url: "https://www.roblox.com" },
    { name: "Discord",          url: "https://discord.com" },
    { name: "Zoom",             url: "https://zoom.us" },
    { name: "Teams",            url: "https://teams.microsoft.com" },
    { name: "Slack",            url: "https://slack.com" },
    { name: "Google",           url: "https://www.google.com" },
    { name: "Outlook",          url: "https://outlook.live.com" },
    { name: "ChatGPT",          url: "https://chat.openai.com" },
    { name: "LinkedIn",         url: "https://www.linkedin.com" }
  ];

  const specialDomains = ["itau.com.br", "caixa.gov.br", "vivo.com.br"];
  const cardGrid = document.getElementById('cardGrid');

  function fetchWithTimeout(url, options = {}, timeout = 30000) {
    return Promise.race([
      fetch(url, options),
      new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), timeout))
    ]);
  }

  function getStatusOrder(site) {
    if (!site.status) return 5;
    switch (site.status) {
      case "Caiu!": return 1;
      case "Lentidão": return 2;
      case "Normal": return 3;
      default: return 5;
    }
  }

  function updateCards() {
    // Ordena os sites por status e, se igual, por ordem alfabética
    sites.sort((a, b) => {
      const diff = getStatusOrder(a) - getStatusOrder(b);
      return diff === 0 ? a.name.localeCompare(b.name) : diff;
    });
    cardGrid.innerHTML = "";
    sites.forEach(site => {
      const card = document.createElement('div');
      card.classList.add('md3-card');

      const titleElem = document.createElement('h2');
      titleElem.textContent = site.name;
      card.appendChild(titleElem);

      const subheadingElem = document.createElement('p');
      subheadingElem.classList.add('md3-card-subheading');
      subheadingElem.textContent = site.url;
      card.appendChild(subheadingElem);

      const statusButton = document.createElement('button');
      statusButton.classList.add('md3-status-button');
      switch (site.status) {
        case "Normal":
          statusButton.classList.add('md3-btn-normal');
          statusButton.textContent = "Normal";
          break;
        case "Lentidão":
          statusButton.classList.add('md3-btn-lentidao');
          statusButton.textContent = "Lentidão";
          break;
        case "Caiu!":
          statusButton.classList.add('md3-btn-caiu');
          statusButton.textContent = "Caiu!";
          break;
        default:
          statusButton.style.backgroundColor = "#ccc";
          statusButton.textContent = "Verificando...";
      }
      card.appendChild(statusButton);
      cardGrid.appendChild(card);
    });
  }

  function checkSite(site) {
    const startTime = Date.now();
    fetchWithTimeout(site.url, { mode: "no-cors" }, 30000)
      .then(() => {
        const elapsed = Date.now() - startTime;
        site.status = elapsed <= 7000 ? "Normal" : "Lentidão";
      })
      .catch(() => {
        const isSpecial = specialDomains.some(domain => site.url.includes(domain));
        site.status = isSpecial ? "Lentidão" : "Caiu!";
      })
      .finally(() => {
        updateCards();
      });
  }

  updateCards();
  sites.forEach(site => checkSite(site));
});

document.addEventListener('DOMContentLoaded', () => {
  const services = [
    { name: "WhatsApp", url: "https://www.whatsapp.com" },
    // ...
  ];

  const specialDomains = ["itau.com.br", "caixa.gov.br", "vivo.com.br"];
  const cardGrid = document.getElementById('cardGrid');

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
    services.sort((a, b) => {
      const diff = getStatusOrder(a) - getStatusOrder(b);
      return diff === 0 ? a.name.localeCompare(b.name) : diff;
    });
    cardGrid.innerHTML = '';
    services.forEach(site => {
      const card = document.createElement('div');
      card.classList.add('service-card');

      const title = document.createElement('h3');
      title.textContent = site.name;
      card.appendChild(title);

      const urlP = document.createElement('p');
      urlP.textContent = site.url;
      card.appendChild(urlP);

      const statusBtn = document.createElement('button');
      statusBtn.classList.add('status-button');
      switch (site.status) {
        case 'Normal':
          statusBtn.classList.add('btn-normal');
          statusBtn.textContent = 'Normal';
          break;
        case 'Lentidão':
          statusBtn.classList.add('btn-lentidao');
          statusBtn.textContent = 'Lentidão';
          break;
        case 'Caiu!':
          statusBtn.classList.add('btn-caiu');
          statusBtn.textContent = 'Caiu!';
          break;
        default:
          statusBtn.style.backgroundColor = '#ccc';
          statusBtn.textContent = 'Verificando...';
      }
      card.appendChild(statusBtn);

      cardGrid.appendChild(card);
    });
  }

  function fetchWithTimeout(url, options = {}, timeout = 30000) {
    return Promise.race([
      fetch(url, options),
      new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), timeout))
    ]);
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

  // Inicia
  updateCards();
  services.forEach(site => checkSite(site));
});

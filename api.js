// Funções para manipular o DOM e interagir com a API

// Função para buscar dados da API
async function fetchDaAPI(endpoint) {
  try {
    const response = await fetch(endpoint);
    if (!response.ok) {
      throw new Error('Erro ao buscar dados da API');
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

// Função para renderizar os cards de horários
function renderizarHorarios(horarios) {
  const horariosContainer = document.getElementById('horariosBtnsContainer');
  horariosContainer.innerHTML = '';
  horarios.forEach(horario => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn btn-outline-primary';
    btn.textContent = horario;
    btn.onclick = () => selecionarHorario(horario);
    horariosContainer.appendChild(btn);
  });
}

// Função para selecionar um horário
function selecionarHorario(horario) {
  // Lógica para selecionar um horário
}

// Função para renderizar os cards de salas
function renderizarSalas(salas) {
  const salasContainer = document.getElementById('cardsContainer');
  salasContainer.innerHTML = '';
  salas.forEach(sala => {
    const card = document.createElement('div');
    card.className = 'card mb-2';
    card.innerHTML = `
      <div class="card-body">
        <h5 class="card-title">Sala: ${sala.numero}</h5>
        <p class="card-text">Turma: ${sala.turma}</p>
        <button type="button" class="btn btn-success reservar-btn">Reservar</button>
        <div class="confirmacao-reserva mt-2" style="display:none;"></div>
      </div>
    `;
    card.querySelector('.reservar-btn').addEventListener('click', () => reservarSala(sala.numero));
    salasContainer.appendChild(card);
  });
}

// Função para reservar uma sala
function reservarSala(numeroSala) {
  const reservaMsg = document.getElementById('reservaMsg');
  reservaMsg.textContent = `Reserva da sala ${numeroSala} feita com sucesso!`;
  reservaMsg.style.display = 'block';
  setTimeout(() => {
    reservaMsg.style.display = 'none';
  }, 2500);
}

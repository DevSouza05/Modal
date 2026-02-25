// manipular o DOM e interagir com a API

"script strict";

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


function selecionarHorario(horario) {
  //  selecionar um horário
}


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


function reservarSala(numeroSala) {
  const reservaMsg = document.getElementById('reservaMsg');
  reservaMsg.textContent = `Reserva da sala ${numeroSala} feita com sucesso!`;
  reservaMsg.style.display = 'block';
  setTimeout(() => {
    reservaMsg.style.display = 'none';
  }, 2500);
}

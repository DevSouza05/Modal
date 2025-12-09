// Dados de exemplo para preencher a tabela de horários
const horariosDisponiveis = [
  { dia: 'Segunda-feira', inicio: '08:00', fim: '10:00', reserva: '', id: 1 },
  { dia: 'Segunda-feira', inicio: '10:00', fim: '12:00', reserva: '', id: 2 },
  { dia: 'Terça-feira', inicio: '14:00', fim: '16:00', reserva: '', id: 3 },
  { dia: 'Quarta-feira', inicio: '16:00', fim: '18:00', reserva: '', id: 4 }
];

function carregarHorariosNaTabela() {
  const tbody = document.getElementById('horariosTableBody');
  if (!tbody) return;
  tbody.innerHTML = '';
  horariosDisponiveis.forEach(h => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${h.dia}</td>
      <td>${h.inicio}</td>
      <td>${h.fim}</td>
      <td>${h.reserva}</td>
      <td><input type="checkbox" name="horarioSelecionado" value="${h.id}"></td>
    `;
    tbody.appendChild(tr);
  });
}

// Carregar horários ao abrir o modal Bootstrap
document.addEventListener('DOMContentLoaded', carregarHorariosNaTabela);
document.getElementById('largageModalBootstrap').addEventListener('show.bs.modal', carregarHorariosNaTabela);
 
    // Dados de exemplo de salas disponíveis por horário
    const salasPorHorario = {
      '08:00': [ { numero: 'M-220', turma: 'Turma A' }, { numero: 'M-221', turma: 'Turma B' } ],
      '10:00': [ { numero: 'M-222', turma: 'Turma C' } ],
      '14:00': [ { numero: 'M-223', turma: 'Turma D' }, { numero: 'M-224', turma: 'Turma E' } ],
      '16:00': [ { numero: 'M-225', turma: 'Turma F' } ]
    };

    document.getElementById('formularioModal').addEventListener('submit', function (e) {
      // Validação extra para capacidade
      const capacidadeInput = document.getElementById('tituloCapacidade');
      if (parseInt(capacidadeInput.value, 10) < 0) {
        capacidadeInput.value = '';
        capacidadeInput.focus();
        alert('A capacidade não pode ser menor que 0.');
        return;
      }
      e.preventDefault();
        const horariosInput = document.getElementById('HorariosCard').value.trim();
  const horariosBtnsContainer = document.getElementById('horariosBtnsContainer');
  const reservaMsg = document.getElementById('reservaMsg');
  const cardsContainer = document.getElementById('cardsContainer');
  const turmaInput = document.getElementById('tituloTurma').value;
  // Removido campo dia da semana
      horariosBtnsContainer.innerHTML = '';
      reservaMsg.style.display = 'none';
      cardsContainer.innerHTML = '';

      // Pega os horários do textarea 
      let horarios = horariosInput.split(/[,\n]+/).map(h => h.trim()).filter(h => h);
      if (horarios.length === 0) {
        horarios = ['08:00', '10:00', '14:00', '16:00'];
      }

      // Armazena horários selecionados por sala
        const btn = document.createElement('button');
      // Pega os horários selecionados na tabela
      const horariosSelecionadosTable = Array.from(document.querySelectorAll('input[name="horarioSelecionado"]:checked'));
      if (horariosSelecionadosTable.length === 0) {
        alert('Selecione pelo menos um horário na tabela!');
        return;
      }

      // Monta array de horários selecionados
      let horariosSelecionados = [];
      horariosSelecionadosTable.forEach(checkbox => {
        const id = parseInt(checkbox.value, 10);
        const horarioObj = horariosDisponiveis.find(h => h.id === id);
        if (!horarioObj) return;
        horariosSelecionados.push(horarioObj);
      });

      // Renderiza cards para cada horário selecionado
      cardsContainer.innerHTML = '';
      horariosSelecionados.forEach(horarioObj => {
        // Associa sala (mock)
        const salas = salasPorHorario[horarioObj.inicio] || [ { numero: 'M-999', turma: turmaInput } ];
        salas.forEach(sala => {
          const card = document.createElement('div');
          card.className = 'card mb-2';
          card.innerHTML = `
            <div class="card-body">
              <h5 class="card-title">Sala: ${sala.numero}</h5>
              <p class="card-text">Turma: ${turmaInput}</p>
              <p class="card-text">Horário Reservado: ${horarioObj.dia} (${horarioObj.inicio} - ${horarioObj.fim})</p>
              <button type="button" class="btn btn-success reservar-btn">Reservar</button>
              <div class="confirmacao-reserva mt-2" style="display:none;"></div>
            </div>
          `;
          card.querySelector('.reservar-btn').onclick = function() {
            const confirmacaoDiv = card.querySelector('.confirmacao-reserva');
            confirmacaoDiv.innerHTML = `
              <span>Tem certeza que deseja reservar essa sala?</span>
              <button type="button" class="btn btn-warning btn-sm ms-2 confirmar-btn">Confirmar</button>
            `;
            confirmacaoDiv.style.display = 'block';
            const confirmarBtn = confirmacaoDiv.querySelector('.confirmar-btn');
            confirmarBtn.onclick = function() {
              reservaMsg.textContent = `Reserva da sala ${sala.numero} feita com sucesso!`;
              reservaMsg.style.display = 'block';
              confirmacaoDiv.style.display = 'none';
              setTimeout(() => {
                reservaMsg.style.display = 'none';
              }, 2500);
            };
          };
          cardsContainer.appendChild(card);
        });
      });
    });
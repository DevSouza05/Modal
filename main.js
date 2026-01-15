
document.getElementById('limparCamposBtn').onclick = function () {

  document.getElementById('formularioModal').reset();

  carregarHorariosNaTabela([]);

  const cardsContainer = document.getElementById('cardsContainer');
  if (cardsContainer) cardsContainer.innerHTML = '';
  const cardsAbaixoTabela = document.getElementById('cardsAbaixoTabela');
  if (cardsAbaixoTabela) cardsAbaixoTabela.innerHTML = '';

  const reservaMsg = document.getElementById('reservaMsg');
  if (reservaMsg) reservaMsg.style.display = 'none';
};
// Mock de "API" 
const apiHorarios = {
  turmas: [
    {
      nome: "Turma A",
      disciplinas: [
        {
          nome: "Matemática",
          horarios: [
            { dia: "Segunda-feira", inicio: "08:00", fim: "10:00", reserva: "" },
            { dia: "Quarta-feira", inicio: "10:00", fim: "12:00", reserva: "" }
          ]
        },
        {
          nome: "Português",
          horarios: [
            { dia: "Terça-feira", inicio: "14:00", fim: "16:00", reserva: "" }
          ]
        }
      ]
    },
    {
      nome: "Turma B",
      disciplinas: [
        {
          nome: "História",
          horarios: [
            { dia: "Quinta-feira", inicio: "08:00", fim: "10:00", reserva: "" }
          ]
        }
      ]
    }
  ]
};

function buscarHorariosPorTurmaDisciplina(turma, disciplina) {
  const turmaObj = apiHorarios.turmas.find(t => t.nome.toLowerCase() === turma.toLowerCase());
  if (!turmaObj) return [];
  const discObj = turmaObj.disciplinas.find(d => d.nome.toLowerCase() === disciplina.toLowerCase());
  if (!discObj) return [];
  return discObj.horarios.map((h, idx) => ({ ...h, id: idx + 1 }));


}

// Dados - para preencher a tabela de horários
const horariosDisponiveis = [
  { dia: 'Segunda-feira', inicio: '08:00', fim: '10:00', reserva: '', id: 1 },
  { dia: 'Segunda-feira', inicio: '10:00', fim: '12:00', reserva: '', id: 2 },
  { dia: 'Terça-feira', inicio: '14:00', fim: '16:00', reserva: '', id: 3 },
  { dia: 'Quarta-feira', inicio: '16:00', fim: '18:00', reserva: '', id: 4 }
];

function carregarHorariosNaTabela(horarios) {
  const tbody = document.getElementById('horariosTableBody');
  if (!tbody) return;
  tbody.innerHTML = '';
  horarios.forEach((h, idx) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${h.dia}</td>
      <td>${h.inicio}</td>
      <td>${h.fim}</td>
      <td>${h.reserva || ''}</td>
      <td><input type="checkbox" name="horarioSelecionado" value="${h.id}"></td>
    `;
    tbody.appendChild(tr);

    const checkbox = tr.querySelector('input[type="checkbox"]');
    checkbox.addEventListener('change', function () {
      if (this.checked) {
        tr.classList.add('highlight-row');
      } else {
        tr.classList.remove('highlight-row');
      }
    });
  });

  // Gerar cards apenas após seleção de horário
  let cardsDiv = document.getElementById('cardsAbaixoTabela');
  if (!cardsDiv) {
    cardsDiv = document.createElement('div');
    cardsDiv.id = 'cardsAbaixoTabela';
    cardsDiv.className = 'mt-3 d-flex gap-3';
    tbody.parentElement.parentElement.appendChild(cardsDiv);
  }
  cardsDiv.innerHTML = '';

  // Adiciona evento para mostrar cards após seleção de horário
  const checkboxes = tbody.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', function () {
      cardsDiv.innerHTML = '';
      const selecionados = Array.from(checkboxes).filter(cb => cb.checked);
      if (selecionados.length > 0) {
        const cardsMock = [
          { sala: 'M-222', dia: 'Segunda-feira', horario: '08:00 - 10:00' },
          { sala: 'M-223', dia: 'Terça-feira', horario: '10:00 - 12:00' },
          { sala: 'M-224', dia: 'Quarta-feira', horario: '14:00 - 16:00' }
        ];
        cardsMock.forEach(cardInfo => {
          const card = document.createElement('div');
          card.className = 'card';
          card.style.width = '18rem';
          card.innerHTML = `
            <div class="card-body">
              <h5 class="card-title">Sala: ${cardInfo.sala}</h5>
              <p class="card-text">Dia: ${cardInfo.dia}</p>
              <p class="card-text">Horário: ${cardInfo.horario}</p>
            </div>
          `;
          cardsDiv.appendChild(card);
        });
      }
    });
  });
}

document.getElementById('tituloTurma').addEventListener('blur', atualizarTabelaHorarios);
document.getElementById('tituloDisciplina').addEventListener('blur', atualizarTabelaHorarios);

function atualizarTabelaHorarios() {
  const turma = document.getElementById('tituloTurma').value;
  // console.log(turma);
  const disciplina = document.getElementById('tituloDisciplina').value;
  if (turma && disciplina) {
    const horarios = buscarHorariosPorTurmaDisciplina(turma, disciplina);
    carregarHorariosNaTabela(horarios);
  } else {
    carregarHorariosNaTabela([]);
  }
}

const salasPorHorario = {
  '08:00': [{ numero: 'M-220', turma: 'Turma A' }, { numero: 'M-221', turma: 'Turma B' }],
  '10:00': [{ numero: 'M-222', turma: 'Turma C' }],
  '14:00': [{ numero: 'M-223', turma: 'Turma D' }, { numero: 'M-224', turma: 'Turma E' }],
  '16:00': [{ numero: 'M-225', turma: 'Turma F' }]
};

document.getElementById('formularioModal').addEventListener('submit', function (e) {

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

  horariosBtnsContainer.innerHTML = '';
  reservaMsg.style.display = 'none';
  cardsContainer.innerHTML = '';


  let horarios = horariosInput.split(/[,\n]+/).map(h => h.trim()).filter(h => h);
  if (horarios.length === 0) {
    horarios = ['08:00', '10:00', '14:00', '16:00'];
  }


  const btn = document.createElement('button');
  // horários selecionados na tabela
  const horariosSelecionadosTable = Array.from(document.querySelectorAll('input[name="horarioSelecionado"]:checked'));
  if (horariosSelecionadosTable.length === 0) {
    alert('Selecione pelo menos um horário na tabela!');
    return;
  }

  // array de horários selecionados
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
    const salas = salasPorHorario[horarioObj.inicio] || [{ numero: 'M-999', turma: turmaInput }];
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
      card.querySelector('.reservar-btn').onclick = function () {
        const confirmacaoDiv = card.querySelector('.confirmacao-reserva');
        confirmacaoDiv.innerHTML = `
              <span>Tem certeza que deseja reservar essa sala?</span>
              <button type="button" class="btn btn-warning btn-sm ms-2 confirmar-btn">Confirmar</button>
            `;
        confirmacaoDiv.style.display = 'block';
        const confirmarBtn = confirmacaoDiv.querySelector('.confirmar-btn');
        confirmarBtn.onclick = function () {
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

document.addEventListener('DOMContentLoaded', function () {
  VirtualSelect.init({
    ele: '#turno-select',
    options: [
      { label: 'A', value: 'A' },
      { label: 'B', value: 'B' },
      { label: 'C', value: 'C' },
      { label: 'D', value: 'D' },
      { label: 'E', value: 'E' },
      { label: 'F', value: 'F' },
    ],
    multiple: true,
    search: true,
    placeholder: 'Selecione os turnos',
  });
});




document.addEventListener('DOMContentLoaded', function () {
  VirtualSelect.init({
    ele: '#bloco-select',
    options: [
      { label: 'A', value: 'A' },
      { label: 'B', value: 'B' },
      { label: 'C', value: 'C' },
      { label: 'D', value: 'D' },
      { label: 'E', value: 'E' },
      { label: 'F', value: 'F' },
    ],
    multiple: true,
    search: true,
    placeholder: 'Selecione os blocos',
  });

  VirtualSelect.init({
    ele: '#conjunto-select',
    options: [
      { label: '1', value: '1' },
      { label: '2', value: '2' },
      { label: '3', value: '3' },
    ],
    multiple: true,
    search: true,
    placeholder: 'Selecione os conjuntos',
  });

  VirtualSelect.init({
    ele: '#recurso-select',
    options: [
      { label: 'Projetor', value: 'Projetor' },
      { label: 'Computador', value: 'Computador' },
      { label: 'Quadro Branco', value: 'Quadro Branco' },
    ],
    multiple: true,
    search: true,
    placeholder: 'Selecione os recursos',
  });
});
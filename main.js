 
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
  const diaSemanaInput = document.getElementById('diaSemanaSelect').value;
      horariosBtnsContainer.innerHTML = '';
      reservaMsg.style.display = 'none';
      cardsContainer.innerHTML = '';

      // Pega os horários do textarea 
      let horarios = horariosInput.split(/[,\n]+/).map(h => h.trim()).filter(h => h);
      if (horarios.length === 0) {
        horarios = ['08:00', '10:00', '14:00', '16:00'];
      }

      // Armazena horários selecionados por sala
      let horariosSelecionados = {};
      horarios.forEach(horario => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'btn btn-outline-primary';
        btn.textContent = horario;
        btn.onclick = function () {
          if (btn.classList.contains('btn-success')) {
            btn.classList.remove('btn-success');
            btn.classList.add('btn-outline-primary');
            reservaMsg.style.display = 'none';
            // Remove horário do array de selecionados
            Object.keys(horariosSelecionados).forEach(salaNum => {
              horariosSelecionados[salaNum] = horariosSelecionados[salaNum].filter(h => h !== horario);
              if (horariosSelecionados[salaNum].length === 0) delete horariosSelecionados[salaNum];
            });
            renderCards();
          } else {
            btn.classList.remove('btn-outline-primary');
            btn.classList.add('btn-success');
            reservaMsg.style.display = 'none';
            // Adiciona horário ao array de selecionados por sala
            const salas = salasPorHorario[horario] || [ { numero: 'M-999', turma: 'Turma X' } ];
            salas.forEach(sala => {
              if (!horariosSelecionados[sala.numero]) horariosSelecionados[sala.numero] = [];
              if (!horariosSelecionados[sala.numero].includes(horario)) horariosSelecionados[sala.numero].push(horario);
            });
            renderCards();
          }
        };
        horariosBtnsContainer.appendChild(btn);
      });

      function renderCards() {
        cardsContainer.innerHTML = '';
        Object.keys(horariosSelecionados).forEach(salaNum => {
          const sala = Object.values(salasPorHorario).flat().find(s => s.numero === salaNum) || { numero: salaNum };
          const card = document.createElement('div');
          card.className = 'card mb-2';
          card.innerHTML = `
            <div class="card-body">
              <h5 class="card-title">Sala: ${salaNum}</h5>
              <p class="card-text">Turma: ${turmaInput}</p>
              <p class="card-text">Dia da Semana: ${diaSemanaInput}</p>
              <p class="card-text">Horários Reservados: ${horariosSelecionados[salaNum].join(', ')}</p>
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
              reservaMsg.textContent = `Reserva da sala ${salaNum} feita com sucesso!`;
              reservaMsg.style.display = 'block';
              confirmacaoDiv.style.display = 'none';
              setTimeout(() => {
                reservaMsg.style.display = 'none';
              }, 2500);
            };
          };
          cardsContainer.appendChild(card);
        });
      }
    });
  document.getElementById('limparCamposBtn').onclick = function() {
    document.getElementById('formularioModal').reset();
    document.getElementById('HorariosCard').value = '';
    document.getElementById('horariosBtnsContainer').innerHTML = '';
    document.getElementById('cardsContainer').innerHTML = '';
    document.getElementById('reservaMsg').style.display = 'none';
  };
  
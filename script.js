// script.js

let vacations = []; // Array para armazenar as férias de todos
let peopleColors = {}; // Armazenará as cores para cada pessoa

// Função para gerar uma cor única para cada pessoa com base no nome
function generateColor(name) {
    if (!peopleColors[name]) {
        // Gera uma cor aleatória, mas sempre a mesma para o mesmo nome
        const hash = Array.from(name).reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const color = `hsl(${hash % 360}, 80%, 70%)`; // Cor em HSL (usando o hash do nome)
        peopleColors[name] = color;
    }
    return peopleColors[name];
}

// Função para gerar o calendário para o ano escolhido (2025)
function generateCalendar() {
    const year = 2025;
    const calendarContainer = document.getElementById('calendar');
    calendarContainer.innerHTML = '';  // Limpa qualquer conteúdo anterior

    // Cria o calendário de cada mês
    for (let month = 0; month < 12; month++) {
        const monthElement = document.createElement('div');
        monthElement.classList.add('month');

        // Nome do mês
        const monthName = new Date(year, month).toLocaleString('default', { month: 'long' });
        const monthTitle = document.createElement('div');
        monthTitle.classList.add('month-name');
        monthTitle.textContent = monthName;
        monthElement.appendChild(monthTitle);

        // Dias da semana
        const daysContainer = document.createElement('div');
        daysContainer.classList.add('days');

        // Cabeçalho dos dias da semana
        const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
        weekDays.forEach(day => {
            const dayHeader = document.createElement('div');
            dayHeader.textContent = day;
            dayHeader.style.fontWeight = 'bold';
            daysContainer.appendChild(dayHeader);
        });

        // Data de início do mês
        const firstDayOfMonth = new Date(year, month, 1);
        const lastDayOfMonth = new Date(year, month + 1, 0);
        const totalDays = lastDayOfMonth.getDate();
        const firstDayWeekday = firstDayOfMonth.getDay();

        // Espaços em branco antes do primeiro dia do mês
        for (let i = 0; i < firstDayWeekday; i++) {
            const emptyCell = document.createElement('div');
            daysContainer.appendChild(emptyCell);
        }

        // Adiciona os dias do mês
        for (let day = 1; day <= totalDays; day++) {
            const dayElement = document.createElement('div');
            dayElement.classList.add('day');
            dayElement.textContent = day;

            // Verifica se o dia está dentro de algum período de férias
            vacations.forEach(vacation => {
                const startDate = new Date(vacation.start);
                const endDate = new Date(vacation.end);
                const currentDate = new Date(year, month, day);

                if (currentDate >= startDate && currentDate <= endDate && vacation.name) {
                    const color = generateColor(vacation.name);
                    dayElement.style.backgroundColor = color;
                    dayElement.classList.add('férias');
                }
            });

            daysContainer.appendChild(dayElement);
        }

        monthElement.appendChild(daysContainer);
        calendarContainer.appendChild(monthElement);
    }

    // Atualiza o relatório de férias
    updateVacationReport();
}

// Função para atualizar o relatório de férias
function updateVacationReport() {
    const reportList = document.getElementById('report-list');
    reportList.innerHTML = ''; // Limpa o relatório anterior

    // Agrupa as férias por pessoa
    const groupedVacations = vacations.reduce((acc, vacation) => {
        if (!acc[vacation.name]) {
            acc[vacation.name] = [];
        }
        acc[vacation.name].push(vacation);
        return acc;
    }, {});

    // Exibe as férias no relatório
    for (const [name, vacations] of Object.entries(groupedVacations)) {
        const reportItem = document.createElement('li');
        reportItem.classList.add('report-item');
        const color = generateColor(name);
        reportItem.style.borderLeftColor = color;
        reportItem.innerHTML = `<span>${name}:</span> ${vacations.map(v => `${v.start} - ${v.end}`).join(', ')}`;
        reportList.appendChild(reportItem);
    }
}

// Função para salvar as férias no localStorage
function saveVacationsToStorage() {
    localStorage.setItem('vacations', JSON.stringify(vacations));
}

// Função para carregar as férias do localStorage
function loadVacationsFromStorage() {
    const storedVacations = JSON.parse(localStorage.getItem('vacations'));
    if (storedVacations) {
        vacations = storedVacations;
    }
}

// Carrega as férias do armazenamento local quando a página é carregada
loadVacationsFromStorage();

// Evento de submit do formulário
document.getElementById('vacation-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;

    // Adiciona as férias ao array
    vacations.push({
        name,
        start: startDate,
        end: endDate
    });

    // Salva as férias no armazenamento local
    saveVacationsToStorage();

    // Limpa o formulário
    document.getElementById('vacation-form').reset();

    // Gera o calendário novamente
    generateCalendar();
});

// Gera o calendário inicial
generateCalendar();

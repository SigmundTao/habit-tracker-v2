const habitsContainerEl = document.getElementById('habit-display');
const addHabitBtn = document.getElementById('add-habit-btn');
const addHabitDialogEl = document.getElementById('add-habit-dialog');
const closeDialogBtn = document.getElementById('close-dialog-btn');
const saveHabitBtn = document.getElementById('save-habit-btn');

function renderHabitList(habits) {
    habitsContainerEl.innerHTML = ``;
    habits.forEach(habit => {
        const element = new HabitCard(habit);
        element.renderInto(habitsContainerEl)
    });
}

async function fetchHabits() {
    const res = await fetch('/api/habits');
    const habits = await res.json();

    console.log(habits);
    renderHabitList(habits)
}

async function createHabit(habit) {
    await fetch('/api/habits', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ name: `${habit}` })
    })

    fetchHabits()
}

async function deleteHabitById(id) {
    await fetch(`/api/habits/${id}`, {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'},
    })

    fetchHabits()
}

class HabitCard {
    constructor(obj){
        this.name = obj.name;
        this.created_at = obj.created_at;
        this.id = obj.id
    }

    renderInto(containerEl){
        const element = document.createElement('div');
        element.classList.add('habit-card');

        const title = document.createElement('p');
        title.textContent = this.name;

        const date = document.createElement('p')
        date.textContent = this.created_at.split(' ')[0];

        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'x'

        element.appendChild(title);
        element.appendChild(date);
        element.appendChild(removeBtn);
        containerEl.appendChild(element);

        removeBtn.addEventListener('click', () => {
            deleteHabitById(this.id);
        })
    }
}

addHabitBtn.addEventListener('click', () => addHabitDialogEl.showModal());
closeDialogBtn.addEventListener('click', () => addHabitDialogEl.close());
saveHabitBtn.addEventListener('click', () => {
    createHabit(document.getElementById('add-habit-input').value.trim());
    addHabitDialogEl.close()
})

fetchHabits()
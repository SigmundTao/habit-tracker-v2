const habitDisplay = document.getElementById('habit-display');
const addHabitBtn = document.getElementById('add-habit-btn');
const addHabitDialog = document.getElementById('add-habit-dialog');
const closeDialogBtn = document.getElementById('close-dialog-btn');
const saveHabitBtn = document.getElementById('save-habit-btn');

async function loadHabits() {
    const res = await fetch('/api/habits');
    const habits = await res.json();

    console.log(habits);
    renderHabits(habits)
}

async function renderHabits(habits) {
    habitDisplay.innerHTML = ``;
    habits.forEach(habit => {
        const element = new Habit(habit);
        element.render()
    });
}

async function addHabit(habit) {
    fetch('/api/habits', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ name: `${habit}` })
    })
}

async function deleteHabit() {
    
}

class Habit {
    constructor(obj){
        this.name = obj.name;
        this.created_at = obj.created_at;
        this.id = obj.id
    }

    render(){
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
        habitDisplay.appendChild(element);
    }
}

addHabitBtn.addEventListener('click', () => addHabitDialog.show());
closeDialogBtn.addEventListener('click', () => addHabitDialog.close());
saveHabitBtn.addEventListener('click', () => {
    addHabit(document.getElementById('add-habit-input').textContent);
    addHabitDialog.close()
})

loadHabits()
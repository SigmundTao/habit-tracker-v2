const habitDisplay = document.getElementById('habit-display');
const addHabitBtn = document.getElementById('add-habit-btn');
const addHabitDialog = document.getElementById('add-habit-dialog');
const closeDialogBtn = document.getElementById('close-dialog-btn');

async function loadHabits() {
    const res = await fetch('/api/habits');
    const habits = await res.json();

    console.log(habits);
    renderHabits(habits)
}

async function renderHabits(habits) {
    habitDisplay.innerHTML = ``;
    habits.forEach(habit => {
        createHabitCard(habit, habitDisplay);
    });
}

function createHabitCard(habit, holder){
    const card = document.createElement('div');
    
    const title = document.createElement('p');
    title.textContent = habit.name;

    const date = document.createElement('p')
    date.textContent = habit.created_at.split(' ')[0];

    card.appendChild(title);
    card.appendChild(date);

    holder.appendChild(card)
}

async function addHabit() {
    
}

class Habit {
    constructor(obj){
        this.name = obj.name;
        this.created_at = obj.created_at;
        this.id = obj.id
    }

    render(){
        const element = document.createElement('div');

        const title = document.createElement('p');
        title.textContent = this.name;

        const date = document.createElement('p')
        date.textContent = this.created_at.split(' ')[0];

        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'x'

        element.appendChild(title);
        element.appendChild(date);
        element.appendChild(removeBtn);
    }
}

addHabitBtn.addEventListener('click', () => addHabitDialog.show());
closeDialogBtn.addEventListener('click', () => addHabitDialog.close());

loadHabits()
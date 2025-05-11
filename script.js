const API_URL = 'https://68208c34259dad2655ace1fd.mockapi.io/tasks'; 

const taskForm = document.getElementById('taskForm');
const taskTitle = document.getElementById('taskTitle');
const taskStatus = document.getElementById('taskStatus');
const submitBtn = document.getElementById('submitBtn');
const deleteBtn = document.getElementById('deleteBtn');
const taskList = document.getElementById('taskList');

let editMode = false;
let currentTaskId = null;

async function fetchTasks() {
  const res = await fetch(API_URL);
  const tasks = await res.json();
  renderTasks(tasks);
}

function renderTasks(tasks) {
  taskList.innerHTML = '';
  if (tasks.length === 0) {
    taskList.innerHTML = '<li>No tasks available</li>';
    return;
  }

  tasks.forEach(task => {
    const li = document.createElement('li');
    li.textContent = `${task.title} - ${task.status}`;
    li.className = task.status === 'Completed' ? 'completed' : '';
    li.onclick = () => loadTaskToForm(task);
    taskList.appendChild(li);
  });
}

function loadTaskToForm(task) {
  taskTitle.value = task.title;
  taskStatus.value = task.status;
  currentTaskId = task.id;
  editMode = true;
  submitBtn.textContent = 'Save Changes';
  deleteBtn.classList.remove('hidden');
}

taskForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const taskData = {
    title: taskTitle.value,
    status: taskStatus.value
  };

  if (editMode && currentTaskId) {
    await fetch(`${API_URL}/${currentTaskId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskData)
    });
  } else {
    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskData)
    });
  }

  resetForm();
  fetchTasks();
});

deleteBtn.addEventListener('click', async () => {
  if (currentTaskId && confirm("Are you sure you want to delete this task?")) {
    await fetch(`${API_URL}/${currentTaskId}`, { method: 'DELETE' });
    resetForm();
    fetchTasks();
  }
});

function resetForm() {
  taskForm.reset();
  editMode = false;
  currentTaskId = null;
  submitBtn.textContent = 'Add Task';
  deleteBtn.classList.add('hidden');
}

fetchTasks();

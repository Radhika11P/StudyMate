const taskNameInput = document.getElementById("taskName");
const subjectInput = document.getElementById("subject");
const deadlineInput = document.getElementById("deadline");
const priorityInput = document.getElementById("priority");
const addButton = document.getElementById("addBtn");
const taskContainer = document.getElementById("tasks");
const searchInput = document.getElementById("searchInput");
const sortTasksInput = document.getElementById("sortTasks");
const totalTasksDisplay = document.getElementById("totalTasks");
const pendingTasksDisplay = document.getElementById("pendingTasks");
const completedTasksDisplay = document.getElementById("completedTasks");

let currentFilter = "all";
const filterButtons = document.querySelectorAll(".filter-btn");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// SAVE TASKS
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// UPDATE COUNTERS
function updateCounters() {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const pending = total - completed;

    totalTasksDisplay.textContent = total;
    pendingTasksDisplay.textContent = pending;
    completedTasksDisplay.textContent = completed;
}
// SEARCH TASKS
function searchTasks() {
    const searchText = searchInput.value.toLowerCase();

    const allTasks = document.querySelectorAll(".task-card");

    allTasks.forEach(function (card) {
        const taskText = card.textContent.toLowerCase();

        if (taskText.includes(searchText)) {
            card.style.display = "";
        } else {
            card.style.display = "none";
        }
    });
}
// APPLY FILTER
function applyFilter() {
    const allTasks = document.querySelectorAll(".task-card");
    const searchText = searchInput.value.toLowerCase();

    allTasks.forEach(function (card) {
        const taskText = card.textContent.toLowerCase();
        const isCompleted = card.classList.contains("completed");

        const matchesSearch = taskText.includes(searchText);

        const matchesFilter =
            currentFilter === "all" ||
            (currentFilter === "pending" && !isCompleted) ||
            (currentFilter === "completed" && isCompleted);

        card.style.display =
            matchesSearch && matchesFilter ? "" : "none";
    });
}
// SORT TASKS
function sortTasks() {
    const sortValue = sortTasksInput.value;

    if (sortValue === "earliest") {
        tasks.sort(function (a, b) {
            return new Date(a.deadline) - new Date(b.deadline);
        });
    } 
    else if (sortValue === "latest") {
        tasks.sort(function (a, b) {
            return new Date(b.deadline) - new Date(a.deadline);
        });
    }

    renderTasks();
}
// DISPLAY TASKS
function renderTasks() {
    taskContainer.innerHTML = "";

    tasks.forEach(function (task) {
        const taskCard = document.createElement("div");
        taskCard.className = "task-card";

        const taskTitle = document.createElement("h3");
        taskTitle.textContent = task.name;

        const taskSubject = document.createElement("p");
        taskSubject.textContent = "Subject: " + task.subject;

        const taskDeadline = document.createElement("p");
        taskDeadline.textContent = "Deadline: " + task.deadline;
         const taskPriority = document.createElement("p");
taskPriority.textContent = "Priority: " + (task.priority || "Not set");
        taskPriority.classList.add(
    "priority",
    "priority-" + (task.priority || "low").toLowerCase()
);
        const completeButton = document.createElement("button");
        completeButton.textContent = task.completed ? "Completed!" : "Complete";

        if (task.completed) {
            taskCard.classList.add("completed");
            taskTitle.style.textDecoration = "line-through";
            taskCard.style.opacity = "0.5";
        }

        completeButton.addEventListener("click", function () {
            if (!task.completed) {
                task.completed = true;
                saveTasks();
                renderTasks();
            }
        });

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        // EDIT BUTTON
const editButton = document.createElement("button");
editButton.textContent = "Edit";

editButton.addEventListener("click", function () {
    const newName = prompt("Enter new task name:", task.name);

    if (newName === null || newName.trim() === "") {
        return;
    }

    const newSubject = prompt("Enter new subject:", task.subject);

    if (newSubject === null || newSubject.trim() === "") {
        return;
    }

    const newDeadline = prompt("Enter new deadline:", task.deadline);
    const newPriority = prompt(
    "Enter new priority (High, Medium, Low):",
    task.priority || "Medium"
);
    if (newDeadline === null || newDeadline.trim() === "") {
        return;
    }
    if (
    newPriority === null ||
    !["high", "medium", "low"].includes(newPriority.trim().toLowerCase())
) {
    alert("Please enter High, Medium, or Low!");
    return;
}
    task.name = newName.trim();
    task.subject = newSubject.trim();
    task.deadline = newDeadline;
    task.priority = newPriority.trim().charAt(0).toUpperCase() +
    newPriority.trim().slice(1).toLowerCase();s
    saveTasks();
    renderTasks();
});

        deleteButton.addEventListener("click", function () {
            tasks = tasks.filter(item => item.id !== task.id);
            saveTasks();
            renderTasks();
        });

        taskCard.appendChild(taskTitle);
        taskCard.appendChild(taskSubject);
        taskCard.appendChild(taskDeadline);
        taskCard.appendChild(taskPriority);
        taskCard.appendChild(completeButton);
        taskCard.appendChild(editButton);
        taskCard.appendChild(deleteButton);

        taskContainer.appendChild(taskCard);
    });

    updateCounters();
    applyFilter();
}
// SEARCH EVENT
searchInput.addEventListener("input", function () {
    applyFilter();
});
// SORT EVENT
sortTasksInput.addEventListener("change", function () {
    sortTasks();
});
// FILTER BUTTONS
filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        currentFilter = button.dataset.filter;

        filterButtons.forEach(function (btn) {
            btn.classList.remove("active");
        });

        button.classList.add("active");
        applyFilter();
    });
});

// ADD TASK
addButton.addEventListener("click", function () {
    const taskName = taskNameInput.value.trim();
    const subject = subjectInput.value.trim();
    const deadline = deadlineInput.value;
    const priority = priorityInput.value;
    if (taskName === "" || subject === "" || deadline === "" || priority === "") {
        alert("Please fill in all the fields!");
        return;
    }

    const newTask = {
        id: Date.now(),
        name: taskName,
        subject: subject,
        deadline: deadline,
        priority: priority,
        completed: false
    };

    tasks.push(newTask);

    saveTasks();
    renderTasks();

    taskNameInput.value = "";
    subjectInput.value = "";
    deadlineInput.value = "";
    priorityInput.value = "";
});

// LOAD SAVED TASKS WHEN PAGE OPENS
renderTasks();
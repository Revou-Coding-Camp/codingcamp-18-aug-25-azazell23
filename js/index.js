let data = [];
let filterExpired = false;

// listens for the submit event on the form with id "todo-form"
document.getElementById("todo-form").addEventListener("submit", function(event) {
    // prevents the default form submission behavior (prevents form refreshes the page)
    event.preventDefault();

    const task = document.getElementById("todo-input").value;
    const due_date = document.getElementById("due-date-input").value;
    const days_remaining = Math.ceil((new Date(due_date) - new Date()) / (1000 * 60 * 60 * 24));

    addData(task, due_date, days_remaining);

    renderTable();

    document.getElementById("todo-form").reset(); // resets the form fields
});

// listens for the delete all button input
document.getElementById("delete-all-button").addEventListener("click", function(event)
{
    event.preventDefault();
    clearData();
})

// listens for the filter button input
document.getElementById("filter-button").addEventListener("click", function(event) {
    event.preventDefault();
    filterExpired = !filterExpired;  // toggle on/off
    renderTable();
});


/*
    FUNCTIONS SECTIONS
*/

/**
 * Adds a new task object to the data array.
 *
 * @param {string} task - The task description.
 * @param {string} due_date - The due date of the task.
 * @param {number} days_remaining - Number of days left until the due date.
 * @returns {void} This function does not return anything.
 */
function addData(task, due_date, days_remaining)
{
    // pushes data to the array
    data.push({
        task: task,
        due_date: due_date,
        days_remaining: days_remaining
    });
}

function renderTable() {
    const tbody = document.getElementById("todo-list");

    // remove placeholder row if it exists
    let placeholder = document.querySelector(".placeholder");
    if (placeholder) {
        placeholder.remove();
    }

    // clear old rows
    tbody.innerHTML = "";

    // copy data to avoid mutating
    let tasks = [...data];

    if (filterExpired) {
        let unexpired = tasks.filter(item => item.days_remaining >= 0);
        let expired = tasks.filter(item => item.days_remaining < 0);

        // sort unexpired by days_remaining ascending
        unexpired.sort((a, b) => a.days_remaining - b.days_remaining);

        tasks = [...unexpired, ...expired]; // unexpired first, expired last
    }

    tasks.forEach((item, index) => {
        const row = document.createElement("tr");
        row.classList.add("contents");

        const taskCell = document.createElement("td");
        taskCell.className = "task";
        taskCell.textContent = item.task;

        const dueCell = document.createElement("td");
        dueCell.className = "due-date";
        dueCell.textContent = item.due_date;

        const daysCell = document.createElement("td");
        daysCell.className = "days-remaining";
        daysCell.textContent = item.days_remaining;

        const actionsCell = document.createElement("td");
        actionsCell.className = "actions";

        let [editButton, deleteButton] = createActionButtons(index);
        actionsCell.appendChild(editButton);
        actionsCell.appendChild(deleteButton);

        row.appendChild(taskCell);
        row.appendChild(dueCell);
        row.appendChild(daysCell);
        row.appendChild(actionsCell);

        tbody.appendChild(row);
    });
}

/**
 * Clears the data array.
 * 
 * @returns {void} This function does not return anything.
 */
function clearData()
{
    data = [];
    renderTable();
}

/** 
 * Creates action buttons for a row in the table.
 * 
 * @param {int} index - The index of the row in the table.
 * @return {void} This function does not return anything.
*/

function createActionButtons(index) {
    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-button";
    deleteButton.innerHTML = '<span class="material-symbols-outlined">delete</span>';
    deleteButton.addEventListener("click", function() {
        data.splice(index, 1);
        renderTable();
    });

    const editButton = document.createElement("button");
    editButton.className = "edit-button";
    editButton.innerHTML = '<span class="material-symbols-outlined">edit</span>';

    editButton.addEventListener("click", function handleEdit() {
        const row = document.querySelectorAll("#todo-list tr")[index];

        const taskCell = row.querySelector(".task");
        const dueDateCell = row.querySelector(".due-date");

        // Create inputs pre-filled with existing values
        const taskInput = document.createElement("input");
        taskInput.type = "text";
        taskInput.value = data[index].task;

        const dateInput = document.createElement("input");
        dateInput.type = "date";
        dateInput.value = data[index].due_date;

        // Replace cells with inputs
        taskCell.innerHTML = "";
        taskCell.appendChild(taskInput);

        dueDateCell.innerHTML = "";
        dueDateCell.appendChild(dateInput);

        // Change edit button to save button
        editButton.innerHTML = '<span class="material-symbols-outlined">check</span>';

        // Remove old listener and add save handler
        editButton.replaceWith(editButton.cloneNode(true));
        const saveButton = row.querySelector(".edit-button");
        saveButton.innerHTML = '<span class="material-symbols-outlined">check</span>';

        saveButton.addEventListener("click", function handleSave() {
            // Update data array
            data[index].task = taskInput.value;
            data[index].due_date = dateInput.value;

            // Recalculate days remaining
            data[index].days_remaining = Math.ceil(
                (new Date(dateInput.value) - new Date()) / (1000 * 60 * 60 * 24)
            );

            // Re-render table
            renderTable();
        });
    });

    return [editButton, deleteButton];
}

let students = [
    { id: 1, name: "Ghofran", grade: 91 },
    { id: 2, name: "Ahmed", grade: 72 },
    { id: 3, name: "Mariam", grade: 85 },
    { id: 4, name: "Omar", grade: 55 },
    { id: 5, name: "Salma", grade: 88 },
    { id: 6, name: "Laila", grade: 50}
];

// Pagination
let currentPage = 1;
const itemsPerPage = 6;

//DOM Elements Selection
const toggleBtn = document.getElementById("toggleBtn");
const dashboard = document.querySelector(".dashboard");
const searchInput = document.getElementById("searchInput");

const cardsWrapper = document.getElementById('cardsWrapper');
const pageIndicator = document.getElementById('pageIndicator');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

const average = document.getElementById("average");
const total = document.getElementById("total");
const pass = document.getElementById("pass");
const topStudent = document.getElementById("top");

const studentNameInput = document.getElementById('studentName');
const studentGradeInput = document.getElementById('studentGrade');
const saveBtn = document.getElementById('saveBtn');
const clearBtn = document.getElementById('clearBtn');

// Sidebar Buttons Selection
const dashboardBtn = document.getElementById("dashboardButton");
const studentsBtn = document.getElementById("studentsButton");
const addStudentBtn = document.getElementById("AddStudentButton");
const statisticsBtn = document.getElementById("statisticsButton");

const sidebarButtons = document.querySelectorAll(".sidebar-btn");
const pageSections = document.querySelectorAll(".page-section");

// Page Sections Selection
const statisticsSection = document.getElementById("statisticsSection");
const studentsSection = document.getElementById("studentsSection");
const addStudentSection = document.getElementById("addStudentSection");

// Sidebar Toggle
toggleBtn.addEventListener("click", function () {
    dashboard.classList.toggle("sidebar-collapsed");
});

function getTotal (students) {
    let total = students.length;
    return total;
}

function getAverage(students) {
    let total = 0;
    for (let i=0; i<students.length; i++) {
        total += students[i].grade;
    }
    return (total / students.length).toFixed(2);
}

function getPassed(students) {
    let pass = 0;
    for (let i=0; i<students.length; i++) {
        if (students[i].grade >= 60) {
            pass ++;
        }
    }
    return pass;
}

function getTopStudent(students) {
    let topStudent = students[0];
    for (let i=0; i<students.length; i++) {
        if(students[i].grade > topStudent.grade) {
            topStudent = students[i];
        }
    }
    return topStudent;
}

function getStatus(student) {
    if (student.grade >= 60) {
        return "Passed";
    } else {
        return "Failed";
    }
}

let editingId = null;
// UI & Pagination Render Function
function renderUI () {
    let searchQuery = searchInput.value.toLowerCase().trim();
    let filteredStudents = students.filter(student => 
        student.name.toLowerCase().includes(searchQuery)
    );

    total.textContent = `${getTotal(filteredStudents)}`;
    average.textContent = `${getAverage(filteredStudents)}`;
    pass.textContent = `${getPassed(filteredStudents)}`;

    let topObj = getTopStudent(filteredStudents);
    topStudent.textContent = topObj ? `${topObj.name} (${topObj.grade})` : "-";

    let totalPages = Math.ceil(filteredStudents.length / itemsPerPage) || 1;
    if (currentPage > totalPages) currentPage = totalPages;
    
    let start = (currentPage - 1) * itemsPerPage;
    let end = start + itemsPerPage;
    let pageStudents = filteredStudents.slice(start, end);
    
    cardsWrapper.innerHTML = "";

    for (let i=0; i<pageStudents.length; i++)  {
        let currentStudent = pageStudents[i];
        let myDiv = document.createElement("div");
        myDiv.classList.add("card2");

        let title = document.createElement("h2");
        let grade = document.createElement("p");
        let status = document.createElement("p");
        let editButton = document.createElement("button");
        let deleteButton = document.createElement("button");

        title.textContent = `${currentStudent.name}`;
        grade.textContent = `Grade: ${currentStudent.grade}`;
        status.textContent = `Status: ${getStatus(currentStudent)}`;
        editButton.textContent = "Edit";
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", function() {
            let confirmDelete = confirm(`Are you sure you want to delete ${currentStudent.name}?`);
            if (confirmDelete) {
                let index = students.findIndex(s => s.id === currentStudent.id);
                if (index !== -1) {
                    students.splice(index, 1);
                }
                myDiv.remove();
                renderUI();
            }
        });

        editButton.addEventListener("click", function() {
            studentNameInput.value = currentStudent.name;
            studentGradeInput.value = currentStudent.grade;
            editingId = currentStudent.id;
            saveBtn.textContent = "Update Student";
        });

        myDiv.appendChild(title);
        myDiv.appendChild(grade);
        myDiv.appendChild(status);
        myDiv.appendChild(editButton);
        myDiv.appendChild(deleteButton);
        cardsWrapper.appendChild(myDiv);
    }

    pageIndicator.textContent = `Page ${currentPage} of ${totalPages}`;
        prevBtn.disabled = (currentPage === 1);
        nextBtn.disabled = (currentPage === totalPages);
}

searchInput.addEventListener("input", function () {
    currentPage = 1; 
    renderUI();
});

prevBtn.addEventListener("click", function () {
    if (currentPage > 1) {
        currentPage--;
        renderUI();
    }
});

nextBtn.addEventListener("click", function () {
    let searchQuery = searchInput.value.toLowerCase().trim();
    let filteredStudents = students.filter(student => 
        student.name.toLowerCase().includes(searchQuery)
    );
    let totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
    
    if (currentPage < totalPages) {
        currentPage++;
        renderUI();
    }
});

renderUI();


// Check Edit Info
const nameRegex = /^[a-zA-Z\s\u0600-\u06FF]+$/;
saveBtn.addEventListener("click", function () {
    let nameValue = studentNameInput.value.trim();
    let gradeValue = studentGradeInput.value.trim();
    let gradeNumber = Number(gradeValue);
    if (nameValue === "") {
        alert("Please enter the student name.");
        return;
    }
    if (!nameRegex.test(nameValue)) {
        alert("Student name must contain letters only.");
        return;
    }
    if (gradeValue === "") {
        alert("Please enter the grade.");
        return;
    }
    if (isNaN(gradeNumber) || gradeNumber < 0 || gradeNumber > 100) {
        alert("Grade must be a number between 0 and 100.");
        return;
    }
    if (editingId !== null) {
        let studentToEdit = students.find(s => s.id === editingId);
        if (studentToEdit) {
            studentToEdit.name = nameValue;
            studentToEdit.grade = gradeNumber;
        }
        editingId = null;
        saveBtn.textContent = "Add Student";
    } else {
        let newStudent = {
            id: students.length + 1,
            name: nameValue,
            grade: gradeNumber
        };
        students.push(newStudent);
    }
    resetInputs();
    renderUI();
});

function resetInputs() {
    studentNameInput.value = "";
    studentGradeInput.value = "";
    editingId = null;
    saveBtn.textContent = "Add Student";
}

clearBtn.addEventListener("click", function () {
    studentNameInput.value = "";
    studentGradeInput.value = "";
});

function switchTab(activeBtn, targetSections) {
    sidebarButtons.forEach(btn => btn.classList.remove("active"));

    pageSections.forEach(sec => sec.classList.remove("active"));

    activeBtn.classList.add("active");

    if (Array.isArray(targetSections)) {
        targetSections.forEach(sec => sec.classList.add("active"));
    } else {
        targetSections.classList.add("active");
    }
}

// Dashboard 
dashboardBtn.addEventListener("click", function () {
    switchTab(dashboardBtn, [statisticsSection, studentsSection, addStudentSection]);
});

// All Students
studentsBtn.addEventListener("click", function () {
    switchTab(studentsBtn, studentsSection);
});

// Add Student 
addStudentBtn.addEventListener("click", function () {
    switchTab(addStudentBtn, [studentsSection, addStudentSection]);
});

// Statistics 
statisticsBtn.addEventListener("click", function () {
    switchTab(statisticsBtn, statisticsSection);
});
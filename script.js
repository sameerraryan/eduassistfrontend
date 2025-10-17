const backendUrl = "https://eduassistbackend.onrender.com/";
// -- AI Integration (demo) --
const openai_api_key = ''; // <-- To use real AI, insert your OpenAI API key here

async function generateLesson() {
    const topic = document.getElementById('lesson-topic').value;
    if (!topic) return alert('Enter a topic!');
    document.getElementById('lesson-result').innerText = "Generating…";
    try {
        const resp = await fetch("http://localhost:5000/api/lesson", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ topic })
        });
        const data = await resp.json();
        document.getElementById('lesson-result').innerText = data.result || "No result";
    } catch (e) {
        document.getElementById('lesson-result').innerText = "Server error";
    }
}

async function generateQuiz() {
    const topic = document.getElementById('quiz-topic').value;
    if (!topic) return alert('Enter a quiz topic!');
    document.getElementById('quiz-result').innerText = "Generating…";
    try {
        const resp = await fetch("http://localhost:5000/api/quiz", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ topic })
        });
        const data = await resp.json();
        document.getElementById('quiz-result').innerText = data.result || "No result";
    } catch (e) {
        document.getElementById('quiz-result').innerText = "Server error";
    }
}


// Attendance - local storage demo
let attendance = JSON.parse(localStorage.getItem('attendance') || "[]");

function markAttendance() {
    const name = document.getElementById('student-name').value;
    if (!name) return alert('Enter student name!');
    attendance.push({ name, date: new Date().toLocaleString() });
    localStorage.setItem('attendance', JSON.stringify(attendance));
    showAttendance();
    document.getElementById('student-name').value = '';
}

function showAttendance() {
    const div = document.getElementById('attendance-list');
    div.innerHTML = "<ul>" + attendance.map(a => `<li>${a.name} - ${a.date}</li>`).join('') + "</ul>";
}
showAttendance();

// Assignment - local storage demo
let assignments = JSON.parse(localStorage.getItem('assignments') || "[]");

function addAssignment() {
    const title = document.getElementById('assignment-title').value;
    if (!title) return alert('Enter assignment title!');
    assignments.push({ title, date: new Date().toLocaleDateString() });
    localStorage.setItem('assignments', JSON.stringify(assignments));
    showAssignments();
    document.getElementById('assignment-title').value = '';
}

function showAssignments() {
    const ul = document.getElementById('assignment-list');
    ul.innerHTML = assignments.map(a => `<li>${a.title} (${a.date})</li>`).join('');
}
showAssignments();

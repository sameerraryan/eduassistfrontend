const backendUrl = "https://eduassistbackend.onrender.com";

// Animate tilt effect on cards
window.onload = function() {
    document.querySelectorAll(".card").forEach(card => {
        VanillaTilt.init(card, {
            max: 13,
            speed: 400,
            glare: true,
            "max-glare": .65
        });
    });
    loadNotifications();
    loadProgressChart();
};

// AI Lesson Generator
async function generateLesson() {
    const topic = document.getElementById('lesson-topic').value;
    let resultDiv = document.getElementById('lesson-result');
    resultDiv.innerText = "Generating…";
    try {
        const resp = await fetch(`${backendUrl}/api/lesson`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ topic })
        });
        const data = await resp.json();
        resultDiv.classList.remove("animate__fadeIn");
        void resultDiv.offsetWidth;
        resultDiv.classList.add("animate__fadeIn");
        resultDiv.innerText = data.result || "No result";
    } catch (e) {
        resultDiv.innerText = "Server error";
    }
}

// AI Quiz Generator
async function generateQuiz() {
    const topic = document.getElementById('quiz-topic').value;
    let resultDiv = document.getElementById('quiz-result');
    resultDiv.innerText = "Generating…";
    try {
        const resp = await fetch(`${backendUrl}/api/quiz`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ topic })
        });
        const data = await resp.json();
        resultDiv.classList.remove("animate__fadeIn");
        void resultDiv.offsetWidth;
        resultDiv.classList.add("animate__fadeIn");
        resultDiv.innerText = data.result || "No result";
    } catch (e) {
        resultDiv.innerText = "Server error";
    }
}

// Notifications - fetch from backend
async function loadNotifications() {
    const notifDiv = document.getElementById("notifications");
    try {
        const resp = await fetch(`${backendUrl}/api/notifications`);
        const data = await resp.json();
        notifDiv.innerHTML = `<ul>` + data.notifications.map(n => `<li>${n}</li>`).join('') + `</ul>`;
    } catch {
        notifDiv.innerText = "No notifications.";
    }
}

// Attendance - local storage
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

// Assignment - local storage
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

// Progress Chart (uses Chart.js and backend demo endpoint)
async function loadProgressChart() {
    const resp = await fetch(`${backendUrl}/api/progress`);
    const data = await resp.json();
    const ctx = document.getElementById('progressChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.students,
            datasets: [{
                label: 'Scores',
                data: data.scores,
                backgroundColor: 'rgba(251,197,49,0.6)',
                borderColor: '#fbc531',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: { beginAtZero: true, max: 100 }
            }
        }
    });
}

// ============================================
// FLICK & PUFF - MAIN QUIZ LOGIC
// ============================================

let quizData = {
    questions: [],
    results: []
};

let quizState = {
    currentQuestion: 0,
    answers: [],
    currentResult: null
};

// INIT QUIZ
document.addEventListener('DOMContentLoaded', function() {
    loadQuizData();
    renderQuiz();
});

// LOAD QUIZ DATA FROM JSON FILES
function loadQuizData() {
    // In a real app, you'd fetch these from separate JSON files
    // For now, we'll assume they're loaded as <script> tags
    
    // Parse the inline JSON (you need to add <script> tags in index.html)
    if (window.questionsData) {
        quizData.questions = window.questionsData.questions;
    }
    if (window.resultsData) {
        quizData.results = window.resultsData.results;
    }
}

// RENDER QUIZ
function renderQuiz() {
    const container = document.getElementById('quizContainer');
    const resultsContainer = document.getElementById('resultsContainer');
    
    if (quizState.currentQuestion < quizData.questions.length) {
        container.style.display = 'block';
        resultsContainer.style.display = 'none';
        renderQuestion();
        updateProgressBar();
    } else {
        showResults();
    }
}

// RENDER SINGLE QUESTION
function renderQuestion() {
    const question = quizData.questions[quizState.currentQuestion];
    const section = document.getElementById('questionSection');
    
    let html = `
        <div class="question">
            <h2>${question.question}</h2>
            <div class="answers-grid">
    `;
    
    question.answers.forEach((answer, index) => {
        const id = `answer-${quizState.currentQuestion}-${index}`;
        const inputType = question.type === 'multiple' ? 'checkbox' : 'radio';
        const name = `question-${quizState.currentQuestion}`;
        
        html += `
            <label class="answer-option">
                <input 
                    type="${inputType}" 
                    name="${name}" 
                    value="${answer.mood}"
                    id="${id}"
                    onchange="handleAnswerSelect()"
                >
                <label for="${id}">${answer.text}</label>
            </label>
        `;
    });
    
    html += `
            </div>
        </div>
    `;
    
    section.innerHTML = html;
    updateButtons();
}

// HANDLE ANSWER SELECT
function handleAnswerSelect() {
    const question = quizData.questions[quizState.currentQuestion];
    const questionNum = quizState.currentQuestion;
    
    if (question.type === 'single') {
        const selected = document.querySelector(`input[name="question-${questionNum}"]:checked`);
        if (selected) {
            quizState.answers[questionNum] = {
                questionId: questionNum,
                mood: selected.value
            };
        }
    } else if (question.type === 'multiple') {
        const selected = document.querySelectorAll(`input[name="question-${questionNum}"]:checked`);
        if (selected.length > 0) {
            quizState.answers[questionNum] = {
                questionId: questionNum,
                moods: Array.from(selected).map(s => s.value)
            };
        }
    }
}

// NEXT QUESTION
function nextQuestion() {
    if (quizState.answers[quizState.currentQuestion]) {
        quizState.currentQuestion++;
        renderQuiz();
    } else {
        alert('Please select an answer before continuing.');
    }
}

// PREVIOUS QUESTION
function previousQuestion() {
    if (quizState.currentQuestion > 0) {
        quizState.currentQuestion--;
        renderQuiz();
    }
}

// UPDATE BUTTONS
function updateButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    prevBtn.disabled = quizState.currentQuestion === 0;
    nextBtn.textContent = quizState.currentQuestion === quizData.questions.length - 1 
        ? 'See Results →' 
        : 'Next →';
}

// UPDATE PROGRESS BAR
function updateProgressBar() {
    const progress = ((quizState.currentQuestion + 1) / quizData.questions.length) * 100;
    const progressFill = document.getElementById('progressFill');
    progressFill.style.width = progress + '%';
}

// SHOW RESULTS
function showResults() {
    const quizContainer = document.getElementById('quizContainer');
    const resultsContainer = document.getElementById('resultsContainer');
    
    // Calculate which result matches
    const topMood = calculateResult();
    const result = quizData.results.find(r => r.id === topMood);
    
    if (!result) {
        alert('Error loading result. Please try again.');
        return;
    }
    
    quizState.currentResult = result;
    
    // Render result
    const resultContent = document.getElementById('resultContent');
    
    let productsHtml = '';
    if (result.products && result.products.length > 0) {
        productsHtml = `
            <div class="result-products">
                <h3>Recommended for You</h3>
                <div class="products-grid">
        `;
        result.products.forEach(product => {
            productsHtml += `
                <div class="product-card">
                    <div class="product-name">${product.title}</div>
                    <div class="product-price">${formatPrice(product.price)}</div>
                    <a href="${product.url}" target="_blank" class="product-link">Shop</a>
                </div>
            `;
        });
        productsHtml += `
                </div>
            </div>
        `;
    }
    
    const linksHtml = `
        <div class="result-links">
            <a href="${result.ambientRoomUrl}" target="_blank" class="result-link">🏡 Ambient Room</a>
            <a href="${result.playlistUrl}" target="_blank" class="result-link">🎵 ${result.playlistName}</a>
            <a href="${result.pinterestBoard}" target="_blank" class="result-link">📌 Pinterest Board</a>
        </div>
    `;
    
    resultContent.innerHTML = `
        <div class="result-emoji">${result.emoji}</div>
        <h1 class="result-title">${result.title}</h1>
        <p class="result-tagline">${result.tagline}</p>
        <p class="result-description">${result.description}</p>
        ${linksHtml}
        ${productsHtml}
    `;
    
    quizContainer.style.display = 'none';
    resultsContainer.style.display = 'block';
}

// LOAD DATA AS INLINE (alternative approach if JSON files aren't loading)
// You can paste the JSON data here as backup
window.questionsData = window.questionsData || { questions: [] };
window.resultsData = window.resultsData || { results: [] };
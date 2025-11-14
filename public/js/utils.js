// ============================================
// FLICK & PUFF - UTILITY FUNCTIONS
// ============================================

// SHARE RESULT
function shareResult() {
    const result = quizState.currentResult;
    const text = `I got "${result.title}" on the Mood Matcher Quiz! 🎬 Discover your perfect Flick & Puff vibe. `;
    const url = window.location.href;
    
    if (navigator.share) {
        navigator.share({
            title: 'Mood Matcher - Flick & Puff',
            text: text,
            url: url
        });
    } else {
        // Fallback: copiar al portapapeles
        const textToCopy = `${text}\n\n${url}`;
        navigator.clipboard.writeText(textToCopy).then(() => {
            alert('✅ Result link copied to clipboard!');
        });
    }
}

// PRINT RESULT
function printResult() {
    window.print();
}

// RESTART QUIZ
function restartQuiz() {
    quizState = {
        currentQuestion: 0,
        answers: [],
        currentResult: null
    };
    renderQuiz();
}

// LOCAL STORAGE (sin uso en esta versión, pero disponible)
function saveAnswerToStorage(questionId, answer) {
    const stored = JSON.parse(localStorage.getItem('quizAnswers') || '{}');
    stored[questionId] = answer;
    localStorage.setItem('quizAnswers', JSON.stringify(stored));
}

function getStoredAnswer(questionId) {
    const stored = JSON.parse(localStorage.getItem('quizAnswers') || '{}');
    return stored[questionId] || null;
}

// CALCULATE RESULT
function calculateResult() {
    const moodCounts = {};
    
    quizState.answers.forEach(answer => {
        if (!moodCounts[answer.mood]) {
            moodCounts[answer.mood] = 0;
        }
        moodCounts[answer.mood]++;
    });
    
    let topMood = null;
    let maxCount = 0;
    
    for (const [mood, count] of Object.entries(moodCounts)) {
        if (count > maxCount) {
            maxCount = count;
            topMood = mood;
        }
    }
    
    return topMood || 'fireplace'; // default
}

// FORMAT PRICE - CON EURO (€)
function formatPrice(price) {
    return '€' + parseFloat(price).toFixed(2);
}
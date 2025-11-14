// ============================================
// FLICK & PUFF - UTILITY FUNCTIONS
// ============================================

// SHARE RESULT
function shareResult() {
    const result = quizState.currentResult;
    
    // Validar que exista el resultado
    if (!result || !result.title) {
        alert('❌ Error: Result not found. Please complete the quiz first.');
        console.error('Result object:', result);
        return;
    }
    
    const text = `I got "${result.title}" on the Mood Matcher Quiz! 🎬 Discover your perfect Flick & Puff vibe.`;
    const url = window.location.href;
    
    // Intentar usar Web Share API (si está disponible)
    if (navigator.share) {
        navigator.share({
            title: 'Mood Matcher - Flick & Puff',
            text: text,
            url: url
        }).catch(err => {
            // Si falla, usar fallback
            fallbackShare(text, url);
        });
    } else {
        // Fallback: copiar al portapapeles
        fallbackShare(text, url);
    }
}

// FALLBACK SHARE (si Web Share API no está disponible)
function fallbackShare(text, url) {
    const textToCopy = `${text}\n\n${url}`;
    
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(textToCopy)
            .then(() => {
                alert('✅ Result copied to clipboard! Share it with your friends.');
            })
            .catch(() => {
                // Si clipboard falla, mostrar el texto para copiar manualmente
                prompt('Copy this text to share:', textToCopy);
            });
    } else {
        // Navegadores antiguos
        prompt('Copy this text to share:', textToCopy);
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

// LOCAL STORAGE
function saveAnswerToStorage(questionId, answer) {
    try {
        const stored = JSON.parse(localStorage.getItem('quizAnswers') || '{}');
        stored[questionId] = answer;
        localStorage.setItem('quizAnswers', JSON.stringify(stored));
    } catch (e) {
        console.warn('LocalStorage not available:', e);
    }
}

function getStoredAnswer(questionId) {
    try {
        const stored = JSON.parse(localStorage.getItem('quizAnswers') || '{}');
        return stored[questionId] || null;
    } catch (e) {
        console.warn('LocalStorage not available:', e);
        return null;
    }
}

// CALCULATE RESULT
function calculateResult() {
    const moodCounts = {};
    
    quizState.answers.forEach(answer => {
        // Validar si es single o multiple
        const mood = answer.mood || (answer.moods && answer.moods);
        
        if (mood) {
            if (!moodCounts[mood]) {
                moodCounts[mood] = 0;
            }
            moodCounts[mood]++;
        }
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

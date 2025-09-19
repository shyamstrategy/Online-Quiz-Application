// Quiz Application JavaScript

class QuizApp {
    constructor() {
        this.questions = [
            {
                question: "What is the capital of France?",
                options: ["London", "Berlin", "Paris", "Madrid"],
                correct: 2
            },
            {
                question: "Which planet is known as the Red Planet?",
                options: ["Venus", "Mars", "Jupiter", "Saturn"],
                correct: 1
            },
            {
                question: "What is the largest mammal in the world?",
                options: ["African Elephant", "Blue Whale", "Giraffe", "Hippopotamus"],
                correct: 1
            },
            {
                question: "In which year did the Titanic sink?",
                options: ["1910", "1911", "1912", "1913"],
                correct: 2
            },
            {
                question: "What is the chemical symbol for gold?",
                options: ["Go", "Gd", "Au", "Ag"],
                correct: 2
            },
            {
                question: "Which is the smallest country in the world?",
                options: ["Monaco", "Vatican City", "San Marino", "Liechtenstein"],
                correct: 1
            },
            {
                question: "What is the hardest natural substance on Earth?",
                options: ["Gold", "Iron", "Diamond", "Platinum"],
                correct: 2
            },
            {
                question: "How many continents are there?",
                options: ["5", "6", "7", "8"],
                correct: 2
            },
            {
                question: "What is the largest ocean on Earth?",
                options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
                correct: 3
            },
            {
                question: "Who painted the Mona Lisa?",
                options: ["Vincent van Gogh", "Leonardo da Vinci", "Pablo Picasso", "Michelangelo"],
                correct: 1
            }
        ];

        this.currentQuestion = 0;
        this.score = 0;
        this.userAnswers = [];
        this.timer = null;
        this.timeLeft = 30;
        this.isAnswered = false;

        this.initializeElements();
        this.bindEvents();
        this.showWelcomeScreen();
    }

    initializeElements() {
        // Screens
        this.welcomeScreen = document.getElementById('welcome-screen');
        this.quizScreen = document.getElementById('quiz-screen');
        this.resultsScreen = document.getElementById('results-screen');
        this.reviewScreen = document.getElementById('review-screen');

        // Welcome screen elements
        this.startBtn = document.getElementById('start-btn');

        // Quiz screen elements
        this.questionText = document.getElementById('question-text');
        this.optionsContainer = document.getElementById('options-container');
        this.prevBtn = document.getElementById('prev-btn');
        this.nextBtn = document.getElementById('next-btn');
        this.questionCounter = document.getElementById('question-counter');
        this.progressFill = document.getElementById('progress-fill');
        this.timerElement = document.getElementById('timer');

        // Results screen elements
        this.scorePercentage = document.getElementById('score-percentage');
        this.resultTitle = document.getElementById('result-title');
        this.resultMessage = document.getElementById('result-message');
        this.correctAnswers = document.getElementById('correct-answers');
        this.wrongAnswers = document.getElementById('wrong-answers');
        this.totalQuestions = document.getElementById('total-questions');
        this.restartBtn = document.getElementById('restart-btn');
        this.reviewBtn = document.getElementById('review-btn');

        // Review screen elements
        this.reviewContainer = document.getElementById('review-container');
        this.backToResultsBtn = document.getElementById('back-to-results');
    }

    bindEvents() {
        this.startBtn.addEventListener('click', () => this.startQuiz());
        this.prevBtn.addEventListener('click', () => this.previousQuestion());
        this.nextBtn.addEventListener('click', () => this.nextQuestion());
        this.restartBtn.addEventListener('click', () => this.restartQuiz());
        this.reviewBtn.addEventListener('click', () => this.showReview());
        this.backToResultsBtn.addEventListener('click', () => this.showResults());
    }

    showScreen(screen) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        screen.classList.add('active');
    }

    showWelcomeScreen() {
        this.showScreen(this.welcomeScreen);
    }

    startQuiz() {
        this.currentQuestion = 0;
        this.score = 0;
        this.userAnswers = [];
        this.showScreen(this.quizScreen);
        this.displayQuestion();
        this.startTimer();
    }

    displayQuestion() {
        const question = this.questions[this.currentQuestion];
        this.questionText.textContent = question.question;
        
        // Update progress
        this.questionCounter.textContent = `${this.currentQuestion + 1} / ${this.questions.length}`;
        const progress = ((this.currentQuestion + 1) / this.questions.length) * 100;
        this.progressFill.style.width = `${progress}%`;

        // Clear previous options
        this.optionsContainer.innerHTML = '';

        // Create options
        question.options.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.className = 'option';
            optionElement.innerHTML = `
                <div class="option-letter">${String.fromCharCode(65 + index)}</div>
                <div class="option-text">${option}</div>
            `;
            
            optionElement.addEventListener('click', () => this.selectOption(index, optionElement));
            this.optionsContainer.appendChild(optionElement);
        });

        // Update navigation buttons
        this.prevBtn.disabled = this.currentQuestion === 0;
        this.nextBtn.disabled = true;
        this.isAnswered = false;

        // Reset timer
        this.timeLeft = 30;
        this.startTimer();
    }

    selectOption(selectedIndex, optionElement) {
        if (this.isAnswered) return;

        // Remove previous selections
        document.querySelectorAll('.option').forEach(opt => opt.classList.remove('selected'));
        
        // Mark selected option
        optionElement.classList.add('selected');
        
        // Store answer
        this.userAnswers[this.currentQuestion] = selectedIndex;
        
        // Check if correct
        if (selectedIndex === this.questions[this.currentQuestion].correct) {
            this.score++;
        }

        this.isAnswered = true;
        this.nextBtn.disabled = false;
        this.stopTimer();

        // Auto advance after 1 second
        setTimeout(() => {
            if (this.currentQuestion < this.questions.length - 1) {
                this.nextQuestion();
            } else {
                this.showResults();
            }
        }, 1000);
    }

    startTimer() {
        this.stopTimer();
        this.updateTimerDisplay();
        
        this.timer = setInterval(() => {
            this.timeLeft--;
            this.updateTimerDisplay();
            
            if (this.timeLeft <= 10) {
                this.timerElement.classList.add('warning');
            }
            
            if (this.timeLeft <= 0) {
                this.timeUp();
            }
        }, 1000);
    }

    stopTimer() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
        this.timerElement.classList.remove('warning');
    }

    updateTimerDisplay() {
        this.timerElement.textContent = this.timeLeft;
    }

    timeUp() {
        if (!this.isAnswered) {
            this.userAnswers[this.currentQuestion] = -1; // No answer selected
            this.isAnswered = true;
            this.nextBtn.disabled = false;
            
            // Auto advance to next question
            setTimeout(() => {
                if (this.currentQuestion < this.questions.length - 1) {
                    this.nextQuestion();
                } else {
                    this.showResults();
                }
            }, 1000);
        }
        this.stopTimer();
    }

    previousQuestion() {
        if (this.currentQuestion > 0) {
            this.currentQuestion--;
            this.displayQuestion();
        }
    }

    nextQuestion() {
        if (this.currentQuestion < this.questions.length - 1) {
            this.currentQuestion++;
            this.displayQuestion();
        } else {
            this.showResults();
        }
    }

    showResults() {
        this.stopTimer();
        this.showScreen(this.resultsScreen);
        
        const percentage = Math.round((this.score / this.questions.length) * 100);
        const wrongAnswers = this.questions.length - this.score;
        
        // Update score display
        this.scorePercentage.textContent = `${percentage}%`;
        this.correctAnswers.textContent = this.score;
        this.wrongAnswers.textContent = wrongAnswers;
        this.totalQuestions.textContent = this.questions.length;
        
        // Determine grade and message
        let title, message;
        if (percentage >= 90) {
            title = "🏆 Excellent!";
            message = "Outstanding performance! You're a quiz master!";
        } else if (percentage >= 80) {
            title = "🌟 Great Job!";
            message = "Very good! You have strong knowledge.";
        } else if (percentage >= 70) {
            title = "👍 Good Work!";
            message = "Nice job! Keep up the good work.";
        } else if (percentage >= 60) {
            title = "📚 Keep Learning!";
            message = "Not bad! There's room for improvement.";
        } else {
            title = "💪 Try Again!";
            message = "Don't give up! Practice makes perfect.";
        }
        
        this.resultTitle.textContent = title;
        this.resultMessage.textContent = message;
    }

    showReview() {
        this.showScreen(this.reviewScreen);
        this.reviewContainer.innerHTML = '';
        
        this.questions.forEach((question, index) => {
            const reviewItem = document.createElement('div');
            reviewItem.className = 'review-item';
            
            const userAnswer = this.userAnswers[index];
            const isCorrect = userAnswer === question.correct;
            
            reviewItem.innerHTML = `
                <div class="review-question">${index + 1}. ${question.question}</div>
                <div class="review-options">
                    ${question.options.map((option, optIndex) => {
                        let className = 'review-option';
                        if (optIndex === question.correct) {
                            className += ' correct';
                        }
                        if (optIndex === userAnswer && userAnswer !== question.correct) {
                            className += ' wrong user-selected';
                        } else if (optIndex === userAnswer) {
                            className += ' user-selected';
                        }
                        
                        return `<div class="${className}">
                            <span class="option-letter">${String.fromCharCode(65 + optIndex)}</span>
                            <span>${option}</span>
                            ${optIndex === question.correct ? ' ✓' : ''}
                            ${optIndex === userAnswer && userAnswer !== question.correct ? ' ✗' : ''}
                        </div>`;
                    }).join('')}
                </div>
                <div class="review-result ${isCorrect ? 'correct' : 'wrong'}">
                    ${isCorrect ? '✓ Correct' : userAnswer === -1 ? '⏰ Time Up' : '✗ Incorrect'}
                </div>
            `;
            
            this.reviewContainer.appendChild(reviewItem);
        });
    }

    restartQuiz() {
        this.showWelcomeScreen();
    }
}

// Initialize the quiz when the page loads
document.addEventListener('DOMContentLoaded', function() {
    new QuizApp();
});
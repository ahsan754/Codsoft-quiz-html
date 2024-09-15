document.addEventListener('DOMContentLoaded', () => {
  const quizForm = document.getElementById('quizForm');
  const saveQuizButton = document.getElementById('saveQuiz');
  const questionList = document.getElementById('questionList');
  const quizSelectForm = document.getElementById('quizSelectForm');
  const quizSelect = document.getElementById('quizSelect');
  const quizContainer = document.getElementById('quizContainer');
  const submitQuizButton = document.getElementById('submitQuiz');

  let questions = [];
  let quizzes = [];

  // Load quizzes from localStorage
  function loadQuizzes() {
      const storedQuizzes = JSON.parse(localStorage.getItem('quizzes')) || [];
      quizzes = storedQuizzes;
      updateQuizList();
  }

  // Update the quiz list dropdown
  function updateQuizList() {
      quizSelect.innerHTML = quizzes.map((quiz, index) =>
          `<option value="${index}">${quiz.title}</option>`
      ).join('');
  }

  // Handle quiz creation
  if (quizForm) {
      quizForm.addEventListener('submit', (e) => {
          e.preventDefault();
          const questionText = document.getElementById('question').value;
          const options = [
              document.getElementById('option1').value,
              document.getElementById('option2').value,
              document.getElementById('option3').value,
              document.getElementById('option4').value
          ];
          const correctOption = document.getElementById('correctOption').value;

          questions.push({ questionText, options, correctOption });

          // Clear form
          quizForm.reset();
          updateQuestionList();
      });

      saveQuizButton.addEventListener('click', () => {
          const title = prompt('Enter a title for your quiz:');
          if (title && questions.length > 0) {
              quizzes.push({ title, questions });
              localStorage.setItem('quizzes', JSON.stringify(quizzes));
              questions = [];
              updateQuestionList();
              updateQuizList();
              alert('Quiz saved successfully!');
          } else {
              alert('Add at least one question before saving!');
          }
      });
  }

  function updateQuestionList() {
      questionList.innerHTML = questions.map((q, index) =>
          `<div class="question-item">
              <p><strong>Q${index + 1}:</strong> ${q.questionText}</p>
              <ul>
                  ${q.options.map((opt, i) => `<li>Option ${i + 1}: ${opt}</li>`).join('')}
              </ul>
              <p><strong>Correct Option:</strong> Option ${q.correctOption}</p>
          </div>`
      ).join('');
  }

  // Handle quiz taking
  if (quizSelectForm) {
      quizSelectForm.addEventListener('submit', (e) => {
          e.preventDefault();
          const selectedIndex = quizSelect.value;
          const quiz = quizzes[selectedIndex];
          if (quiz) {
              quizContainer.innerHTML = quiz.questions.map((q, index) =>
                  `<div class="quiz-question">
                      <p><strong>Q${index + 1}:</strong> ${q.questionText}</p>
                      ${q.options.map((opt, i) =>
                          `<label><input type="radio" name="q${index}" value="${i}"> ${opt}</label><br>`
                      ).join('')}
                  </div>`
              ).join('');
              submitQuizButton.style.display = 'block';
          }
      });

      submitQuizButton.addEventListener('click', () => {
          let score = 0;
          const quiz = quizzes[quizSelect.value];
          quiz.questions.forEach((q, index) => {
              const selectedOption = document.querySelector(`input[name="q${index}"]:checked`);
              if (selectedOption && selectedOption.value === (q.correctOption - 1).toString()) {
                  score++;
              }
          });
          const resultContainer = document.getElementById('resultContainer');
          resultContainer.innerHTML = `<h2>Your Score: ${score}/${quiz.questions.length}</h2>`;
          resultContainer.innerHTML += quiz.questions.map((q, index) =>
              `<div class="question-item">
                  <p><strong>Q${index + 1}:</strong> ${q.questionText}</p>
                  <ul>
                      ${q.options.map((opt, i) =>
                          `<li ${i == (q.correctOption - 1) ? 'style="color: green;"' : ''}>Option ${i + 1}: ${opt}</li>`
                      ).join('')}
                  </ul>
              </div>`
          ).join('');
      });
  }

  loadQuizzes();
});

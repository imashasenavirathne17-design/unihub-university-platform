export const MOCK_PRACTICE_QUESTIONS = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  text: `This is sample practice question ${i + 1} detailing advanced concepts in modern web development. What is the expected behavior?`,
  options: [
    'Option A is universally correct',
    'Option B depends on the specific framework used',
    'Option C is correct only in legacy systems',
    'Option D represents the best modern practice'
  ],
  correctAnswerIndex: Math.floor(Math.random() * 4),
  subject: ['Frontend', 'Backend', 'System Design'][i % 3],
  difficulty: ['Easy', 'Medium', 'Hard'][Math.floor(i / 3) % 3],
  topic: ['Hooks', 'Routing', 'State Management', 'Security', 'Performance'][i % 5],
  explanation: `The correct answer is based on the architectural decision from the ${['Frontend', 'Backend', 'System Design'][i % 3]} domain which emphasizes scalable patterns.`
}));

/**
 * Simulates an API call to fetch a batch of questions based on filters.
 */
export const fetchPracticeQuestions = async (filters = {}) => {
  return new Promise((resolve, reject) => {
    // Artificial delay to show loading state
    setTimeout(() => {
      // 10% chance to throw an error to simulate network issues
      if (Math.random() < 0.1) {
        return reject(new Error('Network Error: Failed to fetch questions. Please try again.'));
      }

      let filtered = MOCK_PRACTICE_QUESTIONS;

      if (filters.subject) {
        filtered = filtered.filter(q => q.subject.toLowerCase() === filters.subject.toLowerCase());
      }
      if (filters.difficulty) {
        filtered = filtered.filter(q => q.difficulty.toLowerCase() === filters.difficulty.toLowerCase());
      }
      if (filters.topic) {
        filtered = filtered.filter(q => q.topic.toLowerCase() === filters.topic.toLowerCase());
      }

      // Return a random subset (up to 10 questions) for a session
      const shuffled = [...filtered].sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, 10);
      
      if (selected.length === 0) {
        return reject(new Error('No questions found matching your criteria.'));
      }

      resolve(selected);
    }, 1500); // 1.5s delay
  });
};

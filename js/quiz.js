/**
 * DE VIRTUAL LAB — QUIZ ENGINE (quiz.js)
 * Interactive Self-Assessment Quiz System
 */

import { StorageEngine } from './storage.js';

export const QuizEngine = {
  questions: [
    {
      id: 1,
      question: "Which logic gate produces a HIGH output ONLY when all its inputs are HIGH?",
      options: ["OR Gate", "AND Gate", "NAND Gate", "XOR Gate"],
      answer: 1,
      explanation: "An AND gate outputs 1 only when Input A = 1 and Input B = 1."
    },
    {
      id: 2,
      question: "Why is the NAND gate referred to as a 'Universal Gate'?",
      options: [
        "It uses minimum power",
        "Any basic logic gate (AND, OR, NOT) can be constructed using only NAND gates",
        "It has infinite inputs",
        "It can perform arithmetic calculations directly"
      ],
      answer: 1,
      explanation: "NAND (and NOR) gates are called universal gates because combinations of them can implement any Boolean function without using any other gate type."
    },
    {
      id: 3,
      question: "What is the Boolean output expression of an XNOR gate with inputs A and B?",
      options: ["A + B", "(A · B)'", "AB + A'B'", "A'B + AB'"],
      answer: 2,
      explanation: "The XNOR gate is the complement of XOR. Its expression is Y = AB + A'B'."
    },
    {
      id: 4,
      question: "According to De Morgan's First Theorem, what is the equivalent of (A · B)'?",
      options: ["A' · B'", "A' + B'", "A + B", "(A + B)'"],
      answer: 1,
      explanation: "De Morgan's First Theorem states that the complement of a product is equal to the sum of the complements: (A · B)' = A' + B'."
    },
    {
      id: 5,
      question: "In a 2-variable Karnaugh Map (K-Map), how many total minterm cells are present?",
      options: ["2 cells", "4 cells", "8 cells", "16 cells"],
      answer: 1,
      explanation: "A K-map with n variables has 2^n cells. For 2 variables, 2^2 = 4 cells (m0, m1, m2, m3)."
    }
  ],

  /**
   * Evaluate submitted quiz answers
   */
  submitQuiz(userAnswers) {
    let score = 0;
    const total = this.questions.length;
    const details = [];

    this.questions.forEach((q, idx) => {
      const selected = userAnswers[q.id];
      const isCorrect = selected === q.answer;
      if (isCorrect) score += 1;

      details.push({
        questionId: q.id,
        userAnswer: selected,
        correctAnswer: q.answer,
        isCorrect,
        explanation: q.explanation
      });
    });

    const percentage = Math.round((score / total) * 100);
    const result = { score, total, percentage, details };

    // Save to LocalStorage
    StorageEngine.saveQuizScore({ score: percentage, totalQuestions: total });

    return result;
  }
};

/**
 * DE VIRTUAL LAB — STORAGE SYSTEM (storage.js)
 * Manages LocalStorage (Progress, Completed Experiments, Quiz Scores, Settings)
 * & SessionStorage (Simulator State, Active Circuit, Active Experiment)
 */

const STORAGE_KEYS = {
  // LocalStorage Keys
  USER_PROGRESS: 'de_user_progress',
  COMPLETED_EXPERIMENTS: 'de_completed_experiments',
  QUIZ_SCORES: 'de_quiz_scores',
  SETTINGS: 'de_user_settings',

  // SessionStorage Keys
  SIMULATOR_STATE: 'de_simulator_state',
  ACTIVE_CIRCUIT: 'de_active_circuit',
  ACTIVE_EXPERIMENT: 'de_active_experiment'
};

export const StorageEngine = {
  // --- LOCAL STORAGE METHODS ---

  /**
   * Get user overall progress object
   */
  getUserProgress() {
    const defaultProgress = {
      labsCompleted: 0,
      quizzesTaken: 0,
      totalScore: 0,
      badges: [],
      lastActive: new Date().toISOString()
    };
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER_PROGRESS);
      return data ? JSON.parse(data) : defaultProgress;
    } catch (e) {
      console.warn('LocalStorage access failed:', e);
      return defaultProgress;
    }
  },

  /**
   * Save user progress object
   */
  saveUserProgress(progress) {
    try {
      localStorage.setItem(STORAGE_KEYS.USER_PROGRESS, JSON.stringify(progress));
    } catch (e) {
      console.error('Failed to save user progress:', e);
    }
  },

  /**
   * Get array of completed experiment IDs
   */
  getCompletedExperiments() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.COMPLETED_EXPERIMENTS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  /**
   * Mark experiment as completed
   */
  markExperimentCompleted(expId, score = 100) {
    const completed = this.getCompletedExperiments();
    if (!completed.includes(expId)) {
      completed.push(expId);
      localStorage.setItem(STORAGE_KEYS.COMPLETED_EXPERIMENTS, JSON.stringify(completed));
    }

    // Update overall progress
    const progress = this.getUserProgress();
    progress.labsCompleted = completed.length;
    progress.lastActive = new Date().toISOString();
    this.saveUserProgress(progress);
  },

  /**
   * Get Quiz Scores history
   */
  getQuizScores() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.QUIZ_SCORES);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  /**
   * Save a new quiz result
   */
  saveQuizScore(scoreResult) {
    const scores = this.getQuizScores();
    scores.push({
      ...scoreResult,
      date: new Date().toISOString()
    });
    localStorage.setItem(STORAGE_KEYS.QUIZ_SCORES, JSON.stringify(scores));

    // Update progress
    const progress = this.getUserProgress();
    progress.quizzesTaken = scores.length;
    progress.totalScore += scoreResult.score || 0;
    this.saveUserProgress(progress);
  },

  // --- SESSION STORAGE METHODS ---

  /**
   * Get temporary simulator state from SessionStorage
   */
  getSimulatorState() {
    const defaultState = {
      inputs: { A: 0, B: 0, C: 0, D: 0 },
      selectedGate: 'AND',
      output: 0
    };
    try {
      const data = sessionStorage.getItem(STORAGE_KEYS.SIMULATOR_STATE);
      return data ? JSON.parse(data) : defaultState;
    } catch (e) {
      return defaultState;
    }
  },

  /**
   * Save current simulator state to SessionStorage
   */
  saveSimulatorState(state) {
    try {
      sessionStorage.setItem(STORAGE_KEYS.SIMULATOR_STATE, JSON.stringify(state));
    } catch (e) {
      console.warn('SessionStorage failed:', e);
    }
  },

  /**
   * Clear all user storage reset
   */
  clearAll() {
    localStorage.removeItem(STORAGE_KEYS.USER_PROGRESS);
    localStorage.removeItem(STORAGE_KEYS.COMPLETED_EXPERIMENTS);
    localStorage.removeItem(STORAGE_KEYS.QUIZ_SCORES);
    sessionStorage.clear();
  }
};

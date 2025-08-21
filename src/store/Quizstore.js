import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useQuizStore = create(persist(
  (set) => ({
    questionIndex: 0,
    userAnswers: [],
    timeLeft: 0,
    timeSinceStart: 0,
    tabSwitchCount: 0,
    selectedOption: null,

    setQuestionIndex: (index) => set({ questionIndex: index }),
    setUserAnswers: (answers) => set({ userAnswers: answers }),
    setTimeLeft: (time) => set({ timeLeft: Number(time) || 0 }),
    setTimeSinceStart: (time) => set({ timeSinceStart: Number(time) || 0 }),
    incrementTabSwitch: () => set((state) => ({ tabSwitchCount: state.tabSwitchCount + 1 })),
    setSelectedOption: (option) => set({ selectedOption: option }),

    resetQuizState: () => set({
      questionIndex: 0,
      userAnswers: [],
      timeLeft: 0,
      timeSinceStart: 0,
      tabSwitchCount: 0,
      selectedOption: null,
    }),
  }),
  {
    name: 'quiz-store',
  }
));

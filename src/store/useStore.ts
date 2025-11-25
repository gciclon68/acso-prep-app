import { create } from 'zustand';

interface AppState {
    currentClass: string | null;
    setCurrentClass: (classId: string) => void;
    completedClasses: string[];
    markClassCompleted: (classId: string) => void;
}

export const useStore = create<AppState>((set) => ({
    currentClass: null,
    setCurrentClass: (classId) => set({ currentClass: classId }),
    completedClasses: [],
    markClassCompleted: (classId) =>
        set((state) => ({
            completedClasses: [...state.completedClasses, classId],
        })),
}));

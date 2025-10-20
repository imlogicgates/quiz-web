import { Question } from "@/types/quiz";

export const mapAnswersToBackend = (
  questions: Question[],
  answers: Record<string, { questionId: string; value: string | string[] }>
): Array<{ id: number; value: string | number | number[] } | null> => {
  return questions
    .map((q) => {
      const answer = answers[q.id];
      if (!answer) return null;

      if (q.type === "text") {
        return { id: Number(q.id), value: answer.value as string };
      }

      if (q.type === "radio") {
        const idx = (q.options ?? []).indexOf(answer.value as string);
        return { id: Number(q.id), value: idx as number };
      }

      if (q.type === "checkbox") {
        const selected = Array.isArray(answer.value)
          ? (answer.value as string[])
          : [];
        const idxs = selected
          .map((opt) => (q.options ?? []).indexOf(opt))
          .filter((i) => i >= 0);
        return { id: Number(q.id), value: idxs as number[] };
      }

      return null;
    })
    .filter(Boolean);
};

import { IncomingItem, Quiz } from "@/types/quiz";

export function toQuiz(items: IncomingItem[]): Quiz {
  return {
    id: "general-knowledge",
    title: "General Knowledge Quiz",
    description: "Test your knowledge across various topics.",
    timeLimit: undefined,
    questions: items.map((it) => ({
      id: String(it.id),
      type: it.type,
      question: it.question,
      options: it.choices, // normalized to your internal field
    })),
  };
}

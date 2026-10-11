import { TestPortalApp } from "@/components/TestPortalApp";
import questionData from "@/Bihar_STET_Computer_Science_PYQs_Analyzed.json";
import { Question } from "@/lib/types";

export default function Home() {
  const questions = (questionData?.questions || []) as unknown as Question[];

  return <TestPortalApp initialQuestions={questions} />;
}

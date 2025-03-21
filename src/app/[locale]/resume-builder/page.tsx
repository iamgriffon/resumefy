import { CVForm } from "@/components/resume/CVForm";
import { ResumeBuilderClient } from "./client";

export default async function ResumeBuilderPage() {
  return (
    <div className="w-full max-w-3xl mx-auto py-8">
      <ResumeBuilderClient />
      <CVForm />
    </div>
  );
}

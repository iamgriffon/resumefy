import { CVForm } from "@/components/resume/CVForm";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ResumeBuilderPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Create Your CV</h1>
        <Link href="/en/resume-builder/import">
          <Button variant="outline">Import from CSV</Button>
        </Link>
      </div>
      <CVForm />
    </div>
  );
}

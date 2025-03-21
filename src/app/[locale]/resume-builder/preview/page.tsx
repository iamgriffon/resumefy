import { CSVPreview } from "@/components/resume/CSVPreview";

export default function PreviewPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Preview Your CV</h1>
      <CSVPreview />
    </div>
  );
} 
import CSVImport from "@/components/resume/CSVImport";

export default function ImportPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Import Your CV</h1>
      <CSVImport />
    </div>
  );
} 
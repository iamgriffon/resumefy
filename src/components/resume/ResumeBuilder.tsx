"use client"

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { parseResumeFile, type ResumeData } from '@/lib/file-parser';
import { generateResumePDF } from '@/lib/pdf-generator';
import { ResumePreviewer } from '@/components/resume/ResumePreviewer';

export function ResumeBuilder() {
  const t = useTranslations('resume');
  const common = useTranslations('common');
  const { toast } = useToast();
  
  const [file, setFile] = useState<File | null>(null);
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [loading, setLoading] = useState(false);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }
    
    setFile(e.target.files[0]);
  };
  
  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "Error",
        description: "Please select a file first",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const data = await parseResumeFile(file);
      setResumeData(data);
      toast({
        title: "Success",
        description: "Resume data loaded successfully",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to parse file",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleDownload = async () => {
    if (!resumeData) {
      return;
    }
    
    setLoading(true);
    
    try {
      const blob = await generateResumePDF(resumeData, 'resume-preview');
      const url = URL.createObjectURL(blob);
      
      // Create download link
      const link = document.createElement('a');
      link.href = url;
      link.download = `${resumeData.personal.name.replace(/\s+/g, '_')}_Resume.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Success",
        description: "Resume PDF generated and downloaded successfully",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to generate PDF",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container py-8">
      <div className="grid gap-6 md:grid-cols-[1fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Upload Your Data</CardTitle>
            <CardDescription>
              Upload your resume data in XLSX or CSV format
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700">
                  Resume Data File (XLSX/CSV)
                </label>
                <input
                  id="file-upload"
                  type="file"
                  accept=".xlsx,.csv"
                  onChange={handleFileChange}
                  className="block w-full text-sm border border-gray-300 rounded-md file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <div className="flex justify-between w-full">
              <Button variant="outline" onClick={() => setFile(null)}>
                {common('cancel')}
              </Button>
              <Button onClick={handleUpload} disabled={!file || loading}>
                {loading ? "Loading..." : "Upload and Parse"}
              </Button>
            </div>
          </CardFooter>
        </Card>
        
        {resumeData && (
          <Card>
            <CardHeader>
              <CardTitle>Resume Preview</CardTitle>
              <CardDescription>
                Preview your resume and download as PDF
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md p-4 max-h-[500px] overflow-auto">
                <div id="resume-preview">
                  <ResumePreviewer data={resumeData} />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleDownload} 
                className="w-full"
                disabled={loading}
              >
                {loading ? "Generating..." : common('download')}
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
} 
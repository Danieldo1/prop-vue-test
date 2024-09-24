'use client';

import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import KeyMetrics from "@/components/KeyMetrics";
import Chart from "@/components/Chart";
import DataTable from "@/components/DataTable";
import FileUpload from "@/components/FileUpload";
import { AlertCircle } from "lucide-react";

export default function Home() {
  const [uploadedData, setUploadedData] = useState(null);
  const [error, setError] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [isFileUploadOpen, setIsFileUploadOpen] = useState(true);

  const handleFileUpload = async (data, name) => {
    try {
      if (data && data.length > 0) {
        setUploadedData(data);
        setFileName(name);
        setError(null);
      } else {
        setError("Загруженный файл не содержит данных");
        setUploadedData(null);
        setFileName(null);
      }
    } catch (err) {
      console.error("Error processing uploaded data:", err);
      setError(`Ошибка при обработке данных: ${err.message}`);
      setUploadedData(null);
      setFileName(null);
    }
  };

  const handleFileUploadToggle = (isOpen) => {
    setIsFileUploadOpen(isOpen);
  };


  return (
    <div className="container mx-auto p-4">
    <h1 className="text-2xl font-bold mb-4">Загрузка и анализ данных</h1>
    
    <FileUpload onFileUpload={handleFileUpload} isOpen={isFileUploadOpen} onToggle={handleFileUploadToggle} />
    {error && (
      <Alert variant="destructive" className="mt-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Ошибка</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )}
    
    {uploadedData && uploadedData.length > 0 && (
      <div className="mt-4 space-y-6">
        <h2 className="text-xl font-semibold">
          Анализ данных {fileName && `(${fileName})`}:
        </h2>
        <KeyMetrics data={uploadedData} />
        <Chart data={uploadedData} />
        <h3 className="text-lg font-semibold">Таблица данных:</h3>
        <DataTable data={uploadedData} />
      </div>
    )}
  </div>
  );
}
"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Upload, AlertCircle } from "lucide-react";
import * as XLSX from "xlsx";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"

export default function FileUpload({ onFileUpload, isOpen, onToggle }) {
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef(null);

  

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragging(true);
    } else if (e.type === "dragleave") {
      setDragging(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (selectedFile) => {
    if (selectedFile) {
      const fileType = selectedFile.name.split(".").pop().toLowerCase();
      if (fileType === "csv" || fileType === "xlsx") {
        setFile(selectedFile);
        setError(null);
      } else {
        setFile(null);
        setError("Пожалуйста, загрузите файл в формате CSV или XLSX.");
      }
    }
  };

  const onBtnClick = () => {
    inputRef.current?.click();
  };

  const handleUpload = async () => {
    if (file) {
      try {
        const fileType = file.name.split(".").pop().toLowerCase();
        let parsedData;

        if (fileType === "csv") {
          const content = await readFileAsText(file);
          parsedData = parseCSV(content);
        } else if (fileType === "xlsx") {
          parsedData = await parseXLSX(file);
        }

        if (parsedData && parsedData.length > 0) {
          try {
            await onFileUpload(parsedData, file.name);
            onToggle();
          } catch (onFileUploadError) {
            console.error("Error in onFileUpload:", onFileUploadError);
            setError(
              `Ошибка при обработке данных: ${onFileUploadError.message}`
            );
          }
        } else {
          console.error("No data extracted from file");
          setError(
            "Не удалось извлечь данные из файла. Пожалуйста, проверьте формат файла."
          );
        }
      } catch (err) {
        console.error("Error processing file:", err);
        setError(`Ошибка при обработке файла: ${err.message}`);
      }
    }
  };

  const readFileAsText = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (e) => reject(e);
      reader.readAsText(file);
    });
  };

  const parseCSV = (content) => {
    const lines = content.split("\n").filter((line) => line.trim() !== "");

    if (lines.length < 2) {
      throw new Error("CSV file does not have enough lines");
    }

    const headers = lines[1]
      .split(",")
      .map((header) => header.trim())
      .filter((header) => header !== "");

    const data = [];

    for (let i = 2; i < lines.length; i++) {
      const values = lines[i].split(",").map((value) => value.trim());
      const row = {};
      let isRowValid = false;
      headers.forEach((header, index) => {
        if (values[index + 1] !== undefined) {
          row[header] = values[index + 1];
          if (values[index + 1] !== "") {
            isRowValid = true;
          }
        }
      });
      if (isRowValid) {
        data.push(row);
      }
    }

    return data;
  };

  const parseXLSX = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: "array" });

          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, {
            header: 1,
            defval: "",
          });

          if (jsonData.length < 2) {
            throw new Error("XLSX file does not have enough rows");
          }

          const headers = jsonData[0].map((header) =>
            header ? header.toString().trim() : ""
          );

          const parsedData = [];

          for (let i = 1; i < jsonData.length; i++) {
            const row = {};
            headers.forEach((header, index) => {
              row[header] =
                jsonData[i][index] !== undefined ? jsonData[i][index] : "";
            });
            if (Object.values(row).some((value) => value !== "")) {
              parsedData.push(row);
            }
          }

          resolve(parsedData);
        } catch (err) {
          console.error("Error parsing XLSX:", err);
          reject(err);
        }
      };
      reader.onerror = (e) => reject(e);
      reader.readAsArrayBuffer(file);
    });
  };

  return (
    <Accordion type="single" collapsible value={isOpen ? "item-1" : ""} onValueChange={(value) => onToggle(value === "item-1")}>
    <AccordionItem value="item-1">
      <AccordionTrigger>{isOpen ? "Закрыть" : "Загрузить файл"}</AccordionTrigger>
      <AccordionContent>
    <div className="w-full max-w-md mx-auto py-4">
      <div
        className={`relative p-6 mt-4 border-2 border-dashed rounded-lg ${
          dragging ? "border-primary" : "border-gray-300"
        } transition-colors duration-300 ease-in-out`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept=".xlsx,.csv"
          onChange={handleChange}
          aria-label="File upload"
        />
        <label
          htmlFor="file-upload"
          className="flex flex-col items-center cursor-pointer"
        >
          <Upload className="w-10 h-10 text-gray-400" />
          <p className="mt-2 text-sm text-gray-500">
            Перетащите файл или{" "}
            <span
              className="font-medium text-primary hover:text-primary/80 underline-offset-2 decoration-dashed underline cursor-pointer"
              onClick={onBtnClick}
              onKeyDown={(e) => e.key === "Enter" && onBtnClick()}
              tabIndex={0}
              role="button"
            >
              выберите
            </span>
          </p>
          <p className="mt-1 text-xs text-gray-500">Только файлы .xlsx, .csv</p>
        </label>
        {file && (
          <p className="mt-2 text-sm text-gray-500 text-center">
            <b> Вы выбрали: </b>
            <span className="underline-offset-2 decoration-dashed underline select-none">
              {file.name}
            </span>
          </p>
        )}
      </div>
      <Button className="w-full mt-4" onClick={handleUpload} disabled={!file}>
        Загрузить
      </Button>
      {error && (
        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Ошибка</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
    </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

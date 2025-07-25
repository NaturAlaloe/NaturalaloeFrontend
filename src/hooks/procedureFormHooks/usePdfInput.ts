import { useState, useRef } from "react";

export function usePdfInput() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPdfFile(e.target.files[0]);
    }
  };
  
  const removePdf = () => setPdfFile(null);
  
  const resetPdfInput = () => {
    setPdfFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  
  return { 
    pdfFile, 
    setPdfFile, 
    handlePdfChange, 
    removePdf, 
    resetPdfInput,
    fileInputRef 
  };
}

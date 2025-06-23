import { useState } from "react";

export function usePdfInput() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPdfFile(e.target.files[0]);
    }
  };
  const removePdf = () => setPdfFile(null);
  return { pdfFile, setPdfFile, handlePdfChange, removePdf };
}

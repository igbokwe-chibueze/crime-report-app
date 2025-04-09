"use client";

import { useState } from "react";
import { ReportForm } from "@/components/report/reportForm";
import { ReportSubmitted } from "./reportFormCompleted";

interface ReportData {
    field1?: string;
    field2?: number;
}

const ReportWizard = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [reportData, setReportData] = useState<ReportData>({});

    const handleStepComplete = async (data: ReportData) => {
        setReportData({ ...reportData, ...data });

        if (currentStep === 4) {
            return;
        }

        setCurrentStep((prev) => prev + 1);
    };
  return (
    <div className="rounded-2xl bg-zinc-900 p-8">
      {currentStep === 1 && <ReportForm onComplete={handleStepComplete} />}
      {currentStep === 2 && (
        <ReportSubmitted data={reportData} onComplete={handleStepComplete} />
      )}
    </div>
  )
}

export default ReportWizard
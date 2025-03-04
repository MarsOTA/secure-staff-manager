
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, FileText, DollarSign } from "lucide-react";
import { ExtendedOperator } from "@/types/operator";
import PersonalInfoTab from "@/components/operator/PersonalInfoTab";
import ContractTab from "@/components/operator/ContractTab";
import PayrollTab from "@/components/operator/PayrollTab";

interface OperatorTabsProps {
  operator: ExtendedOperator;
  activeTab: string;
  setActiveTab: (value: string) => void;
  imagePreviewUrls: Record<string, string>;
  onFieldChange: (field: keyof ExtendedOperator, value: any) => void;
  onServiceToggle: (service: string) => void;
  onAvailabilityToggle: (availability: string) => void;
  onLanguageToggle: (language: string, type: 'fluent' | 'basic') => void;
  onSizeToggle: (size: string) => void;
  onFileUpload: (field: keyof ExtendedOperator, fileNameField: keyof ExtendedOperator, file: File | null) => void;
  onSave: () => void;
  onGenerateContract: () => void;
  contractType: string;
  setContractType: (value: string) => void;
  ccnl: string;
  setCcnl: (value: string) => void;
  level: string;
  setLevel: (value: string) => void;
  employmentType: string;
  setEmploymentType: (value: string) => void;
  startDate: Date | undefined;
  setStartDate: (date: Date | undefined) => void;
  endDate: Date | undefined;
  setEndDate: (date: Date | undefined) => void;
  grossSalary: string;
  setGrossSalary: (value: string) => void;
  netSalary: string;
  setNetSalary: (value: string) => void;
}

const OperatorTabs: React.FC<OperatorTabsProps> = ({
  operator,
  activeTab,
  setActiveTab,
  imagePreviewUrls,
  onFieldChange,
  onServiceToggle,
  onAvailabilityToggle,
  onLanguageToggle,
  onSizeToggle,
  onFileUpload,
  onSave,
  onGenerateContract,
  contractType,
  setContractType,
  ccnl,
  setCcnl,
  level,
  setLevel,
  employmentType,
  setEmploymentType,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  grossSalary,
  setGrossSalary,
  netSalary,
  setNetSalary
}) => {
  return (
    <Tabs defaultValue="info" value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="w-full grid grid-cols-3">
        <TabsTrigger value="info" className="text-base py-3">
          <User className="mr-2 h-4 w-4" />
          Info Operatore
        </TabsTrigger>
        <TabsTrigger value="contract" className="text-base py-3">
          <FileText className="mr-2 h-4 w-4" />
          Contrattualistica
        </TabsTrigger>
        <TabsTrigger value="payroll" className="text-base py-3">
          <DollarSign className="mr-2 h-4 w-4" />
          Payroll
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="info" className="space-y-6 mt-6">
        <PersonalInfoTab
          operator={operator}
          imagePreviewUrls={imagePreviewUrls}
          onFieldChange={onFieldChange}
          onServiceToggle={onServiceToggle}
          onAvailabilityToggle={onAvailabilityToggle}
          onLanguageToggle={onLanguageToggle}
          onSizeToggle={onSizeToggle}
          onFileUpload={onFileUpload}
        />
      </TabsContent>
      
      <TabsContent value="contract" className="space-y-6 mt-6">
        <ContractTab
          operator={operator}
          contractType={contractType}
          onContractTypeChange={setContractType}
          onGenerateContract={onGenerateContract}
          ccnl={ccnl}
          setCcnl={setCcnl}
          level={level}
          setLevel={setLevel}
          employmentType={employmentType}
          setEmploymentType={setEmploymentType}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          grossSalary={grossSalary}
          setGrossSalary={setGrossSalary}
          netSalary={netSalary}
          setNetSalary={setNetSalary}
          onSave={onSave}
        />
      </TabsContent>

      <TabsContent value="payroll" className="space-y-6 mt-6">
        <PayrollTab operator={operator} />
      </TabsContent>
    </Tabs>
  );
};

export default OperatorTabs;

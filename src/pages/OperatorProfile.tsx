
import React from "react";
import { useParams } from "react-router-dom";
import Layout from "@/components/Layout";
import OperatorHeader from "@/components/operator/OperatorHeader";
import OperatorTabs from "@/components/operator/OperatorTabs";
import { useOperatorData } from "@/hooks/useOperatorData";
import { useOperatorOperations } from "@/hooks/useOperatorOperations";

const OperatorProfile = () => {
  const { id } = useParams();
  
  const {
    operator,
    setOperator,
    loading,
    imagePreviewUrls,
    setImagePreviewUrls,
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
  } = useOperatorData(id);
  
  const {
    activeTab,
    setActiveTab,
    handleChange,
    handleServiceToggle,
    handleAvailabilityToggle,
    handleLanguageToggle,
    handleSizeToggle,
    handleFileUpload,
    handleSave,
    generateContract
  } = useOperatorOperations(
    operator,
    setOperator,
    setImagePreviewUrls,
    contractType,
    ccnl,
    level,
    employmentType,
    startDate,
    endDate,
    grossSalary,
    netSalary
  );
  
  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">Caricamento...</div>
        </div>
      </Layout>
    );
  }
  
  if (!operator) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">Operatore non trovato</div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="space-y-6">
        <OperatorHeader 
          operator={operator} 
          onRatingChange={(value) => handleChange("rating", value)}
          onSave={handleSave}
        />
        
        <OperatorTabs
          operator={operator}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          imagePreviewUrls={imagePreviewUrls}
          onFieldChange={handleChange}
          onServiceToggle={handleServiceToggle}
          onAvailabilityToggle={handleAvailabilityToggle}
          onLanguageToggle={handleLanguageToggle}
          onSizeToggle={handleSizeToggle}
          onFileUpload={handleFileUpload}
          onSave={handleSave}
          onGenerateContract={generateContract}
          contractType={contractType}
          setContractType={setContractType}
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
        />
      </div>
    </Layout>
  );
};

export default OperatorProfile;

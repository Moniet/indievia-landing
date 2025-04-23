
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { CreditNotesAlert } from '@/components/dashboard/CreditNotesAlert';
import { FinancialSummary } from '@/components/dashboard/FinancialSummary';
import { InvoicesTable } from '@/components/dashboard/InvoicesTable';

const Index: React.FC = () => {
  const [showAlert, setShowAlert] = useState(true);

  return (
    <DashboardLayout title="Invoices" subtitle="Review, approve and pay invoices">
      {showAlert && <CreditNotesAlert onClose={() => setShowAlert(false)} />}
      <FinancialSummary />
      <InvoicesTable />
    </DashboardLayout>
  );
};

export default Index;

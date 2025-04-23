
import React from 'react';
import { HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface SummaryCardProps {
  title: string;
  amount: string;
  subtitle: string;
  borderColor: string;
  tooltipText: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ 
  title, 
  amount, 
  subtitle, 
  borderColor,
  tooltipText
}) => {
  return (
    <div className="bg-employIn-darkBg border border-employIn-highlight/20 rounded-lg p-4 relative">
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${borderColor} rounded-l-lg`}></div>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-employIn-mediumText flex items-center gap-2">
          {title}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <HelpCircle size={16} className="text-employIn-mediumText" />
              </TooltipTrigger>
              <TooltipContent className="bg-employIn-darkSidebar text-white border-employIn-highlight/20">
                <p>{tooltipText}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </h3>
      </div>
      <div className="text-3xl font-bold text-white">{amount}</div>
      <div className="text-sm text-employIn-mediumText mt-1">{subtitle}</div>
    </div>
  );
};

export const FinancialSummary: React.FC = () => {
  return (
    <div className="grid grid-cols-2 gap-6 mb-6">
      <SummaryCard 
        title="Unpaid invoices" 
        amount="EUR 1200.00" 
        subtitle="from 1 invoices" 
        borderColor="bg-employIn-blue"
        tooltipText="Total amount of unpaid invoices"
      />
      <SummaryCard 
        title="Remaining credits" 
        amount="EUR 2300.00" 
        subtitle="from 9 credit notes" 
        borderColor="bg-employIn-blue"
        tooltipText="Total amount of remaining credit notes"
      />
    </div>
  );
};


import React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface CreditNotesAlertProps {
  onClose: () => void;
}

export const CreditNotesAlert: React.FC<CreditNotesAlertProps> = ({ onClose }) => {
  return (
    <div className="bg-employIn-banner border border-employIn-bannerBorder rounded-lg p-4 mb-6 relative">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-white mb-2">
            Reduce the amount you owe by applying credit notes to invoices
          </h3>
          <p className="text-employIn-mediumText">
            You can now use your credit notes directly towards paying your invoices, saving your time and decreasing the amount left to pay.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button className="bg-employIn-blue hover:bg-employIn-darkBlue text-white">
            See credit notes
          </Button>
          <button 
            onClick={onClose}
            className="text-employIn-mediumText hover:text-white p-1"
          >
            <X size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

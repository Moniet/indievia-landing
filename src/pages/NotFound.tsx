
import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <DashboardLayout title="Not Found" subtitle="The page you're looking for doesn't exist">
      <div className="flex flex-col items-center justify-center h-full">
        <h1 className="text-6xl font-bold text-employIn-blue mb-4">404</h1>
        <p className="text-xl text-employIn-mediumText mb-8">
          We couldn't find the page you were looking for.
        </p>
        <Button 
          onClick={() => navigate('/')}
          className="bg-employIn-blue hover:bg-employIn-darkBlue"
        >
          Return to Dashboard
        </Button>
      </div>
    </DashboardLayout>
  );
};

export default NotFound;

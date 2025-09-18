import React from 'react';
import DatabaseFix from '../components/DatabaseFix';

const DatabaseFixPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <DatabaseFix />
      </div>
    </div>
  );
};

export default DatabaseFixPage;
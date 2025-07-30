import React from 'react';

interface AssignmentStatusBadgeProps {
  status: 'pending' | 'submitted' | 'graded';
}

export const AssignmentStatusBadge: React.FC<AssignmentStatusBadgeProps> = ({ status }) => {
  const statusConfig = {
    pending: {
      text: 'Pending',
      className: 'bg-orange-100 text-orange-800',
    },
    submitted: {
      text: 'Submitted',
      className: 'bg-blue-100 text-blue-800',
    },
    graded: {
      text: 'Graded',
      className: 'bg-green-100 text-green-800',
    },
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusConfig[status].className}`}>
      {statusConfig[status].text}
    </span>
  );
};

import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Filter, ArrowUpDown } from 'lucide-react';

interface Invoice {
  id: string;
  person: {
    name: string;
    avatar: string;
    initials: string;
  };
  reference: string;
  payrollMonth: string;
  dueDate: string;
  amount: string;
  dueBy: string;
  status: 'pending' | 'approved' | 'rejected';
}

const invoices: Invoice[] = [
  {
    id: '1',
    person: {
      name: 'Charles John',
      avatar: '',
      initials: 'CJ',
    },
    reference: 'ID-XYZ-015',
    payrollMonth: '12/12/2023',
    dueDate: '1 day',
    amount: 'EUR 1200.0',
    dueBy: '12/13/2023',
    status: 'pending',
  },
  {
    id: '2',
    person: {
      name: 'Dianne Rusell',
      avatar: '',
      initials: 'DR',
    },
    reference: 'NY-ASD-021',
    payrollMonth: '10/08/2023',
    dueDate: '1 day',
    amount: 'EUR 1100.0',
    dueBy: '10/09/2022',
    status: 'approved',
  },
  {
    id: '3',
    person: {
      name: 'Anette Black',
      avatar: '',
      initials: 'AB',
    },
    reference: 'CN-ASX-051',
    payrollMonth: '10/08/2023',
    dueDate: '3 day',
    amount: 'EUR 1330.0',
    dueBy: '10/11/2022',
    status: 'approved',
  },
  {
    id: '4',
    person: {
      name: 'Darell Steward',
      avatar: '',
      initials: 'DS',
    },
    reference: 'UK-XYZ-015',
    payrollMonth: '10/08/2023',
    dueDate: '3 day',
    amount: 'EUR 1120.0',
    dueBy: '10/11/2022',
    status: 'approved',
  },
  {
    id: '5',
    person: {
      name: 'Marvin McKinney',
      avatar: '',
      initials: 'MM',
    },
    reference: 'ID-UXP-022',
    payrollMonth: '10/08/2023',
    dueDate: '5 day',
    amount: 'EUR 1580.0',
    dueBy: '10/13/2022',
    status: 'rejected',
  },
];

const StatusBadge: React.FC<{ status: 'pending' | 'approved' | 'rejected' }> = ({ status }) => {
  const classes = {
    pending: 'status-pending',
    approved: 'status-approved',
    rejected: 'status-rejected',
  };
  
  const labels = {
    pending: 'Pending',
    approved: 'Approved',
    rejected: 'Rejected',
  };
  
  return <span className={classes[status]}>{labels[status]}</span>;
};

export const InvoicesTable: React.FC = () => {
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button variant="outline" size="sm" className="gap-2">
          <Filter size={16} />
          <span>Filter</span>
        </Button>
      </div>
      
      <div className="rounded-lg border border-employIn-highlight/20 overflow-hidden">
        <Table>
          <TableHeader className="bg-employIn-darkBg">
            <TableRow className="hover:bg-employIn-highlight/50 border-b border-employIn-highlight/20">
              <TableHead className="text-employIn-mediumText font-medium">
                <button className="flex items-center gap-1" onClick={() => handleSort('person')}>
                  Person
                  {sortColumn === 'person' && (
                    <ArrowUpDown size={14} className={sortDirection === 'asc' ? 'transform rotate-180' : ''} />
                  )}
                </button>
              </TableHead>
              <TableHead className="text-employIn-mediumText font-medium">
                <button className="flex items-center gap-1" onClick={() => handleSort('reference')}>
                  Invoice reference
                  {sortColumn === 'reference' && (
                    <ArrowUpDown size={14} className={sortDirection === 'asc' ? 'transform rotate-180' : ''} />
                  )}
                </button>
              </TableHead>
              <TableHead className="text-employIn-mediumText font-medium">
                <button className="flex items-center gap-1" onClick={() => handleSort('payrollMonth')}>
                  Payroll month
                  {sortColumn === 'payrollMonth' && (
                    <ArrowUpDown size={14} className={sortDirection === 'asc' ? 'transform rotate-180' : ''} />
                  )}
                </button>
              </TableHead>
              <TableHead className="text-employIn-mediumText font-medium">
                <button className="flex items-center gap-1" onClick={() => handleSort('dueDate')}>
                  Due date
                  {sortColumn === 'dueDate' && (
                    <ArrowUpDown size={14} className={sortDirection === 'asc' ? 'transform rotate-180' : ''} />
                  )}
                </button>
              </TableHead>
              <TableHead className="text-employIn-mediumText font-medium">
                <button className="flex items-center gap-1" onClick={() => handleSort('amount')}>
                  Invoice amount
                  {sortColumn === 'amount' && (
                    <ArrowUpDown size={14} className={sortDirection === 'asc' ? 'transform rotate-180' : ''} />
                  )}
                </button>
              </TableHead>
              <TableHead className="text-employIn-mediumText font-medium">
                <button className="flex items-center gap-1" onClick={() => handleSort('dueBy')}>
                  Amount due
                  {sortColumn === 'dueBy' && (
                    <ArrowUpDown size={14} className={sortDirection === 'asc' ? 'transform rotate-180' : ''} />
                  )}
                </button>
              </TableHead>
              <TableHead className="text-employIn-mediumText font-medium">
                <button className="flex items-center gap-1" onClick={() => handleSort('status')}>
                  Status
                  {sortColumn === 'status' && (
                    <ArrowUpDown size={14} className={sortDirection === 'asc' ? 'transform rotate-180' : ''} />
                  )}
                </button>
              </TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow 
                key={invoice.id} 
                className="hover:bg-employIn-highlight/50 border-b border-employIn-highlight/20 cursor-pointer"
              >
                <TableCell className="font-medium flex items-center gap-2">
                  <Avatar className="h-8 w-8 bg-employIn-highlight">
                    <AvatarImage src={invoice.person.avatar} />
                    <AvatarFallback className="text-xs">{invoice.person.initials}</AvatarFallback>
                  </Avatar>
                  {invoice.person.name}
                </TableCell>
                <TableCell>{invoice.reference}</TableCell>
                <TableCell>{invoice.payrollMonth}</TableCell>
                <TableCell>{invoice.dueDate}</TableCell>
                <TableCell>{invoice.amount}</TableCell>
                <TableCell>{invoice.dueBy}</TableCell>
                <TableCell>
                  <StatusBadge status={invoice.status} />
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="focus:outline-none">
                      <MoreHorizontal className="h-5 w-5 text-employIn-mediumText" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-employIn-darkSidebar text-white border-employIn-highlight/20">
                      <DropdownMenuItem className="cursor-pointer hover:bg-employIn-highlight">View details</DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer hover:bg-employIn-highlight">Edit invoice</DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer hover:bg-employIn-highlight">Download PDF</DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer hover:bg-employIn-highlight text-employIn-rejected">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

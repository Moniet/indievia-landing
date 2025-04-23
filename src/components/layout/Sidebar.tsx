
import React, { useState } from 'react';
import { EmplLogo } from '../EmplLogo';
import { 
  Home, Users, UserPlus, CreditCard, BarChart3, 
  Building, LifeBuoy, Settings, ChevronDown, Menu, 
  DollarSign, ClipboardList, CreditCard as CreditCardIcon,
  Briefcase, HelpCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarItemProps {
  icon: React.ReactNode;
  text: string;
  isActive?: boolean;
  hasDropdown?: boolean;
  isExpanded: boolean;
  isDropdownOpen?: boolean;
  onClick?: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ 
  icon, 
  text, 
  isActive = false, 
  hasDropdown = false,
  isExpanded,
  isDropdownOpen = false,
  onClick
}) => {
  return (
    <div 
      className={cn(
        "flex items-center py-2 px-3 rounded-lg cursor-pointer transition-colors duration-200",
        isActive ? "bg-employIn-highlight text-white" : "text-employIn-mediumText hover:bg-employIn-highlight/50"
      )}
      onClick={onClick}
    >
      <div className="w-6 h-6 mr-3">
        {icon}
      </div>
      {isExpanded && (
        <div className="flex-1 flex items-center justify-between">
          <span className={cn(
            "transition-opacity duration-300",
            isExpanded ? "opacity-100" : "opacity-0"
          )}>
            {text}
          </span>
          {hasDropdown && (
            <ChevronDown className={cn(
              "h-4 w-4 transition-transform duration-200",
              isDropdownOpen ? "transform rotate-180" : ""
            )} />
          )}
        </div>
      )}
    </div>
  );
};

interface SidebarSubItemProps {
  text: string;
  isActive?: boolean;
  isExpanded: boolean;
}

const SidebarSubItem: React.FC<SidebarSubItemProps> = ({ text, isActive = false, isExpanded }) => {
  if (!isExpanded) return null;
  
  return (
    <div 
      className={cn(
        "py-2 pl-11 pr-3 rounded-lg cursor-pointer transition-colors duration-200",
        isActive ? "bg-employIn-highlight text-white" : "text-employIn-mediumText hover:bg-employIn-highlight/50"
      )}
    >
      <span>{text}</span>
    </div>
  );
};

export const Sidebar: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeDropdown, setActiveDropdown] = useState<string | null>("pay");

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  const toggleDropdown = (dropdown: string) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  return (
    <div className={cn(
      "h-screen bg-employIn-darkSidebar border-r border-employIn-highlight/20 flex flex-col transition-all duration-300 ease-in-out overflow-hidden",
      isExpanded ? "sidebar-expanded" : "sidebar-collapsed"
    )}>
      <div className="flex items-center justify-between p-4">
        {isExpanded ? (
          <EmplLogo />
        ) : (
          <div className="w-8 h-8 bg-employIn-blue rounded-md flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 12h-3a2 2 0 0 0-2 2v2H7V8h5a2 2 0 0 1 2 2 2 2 0 0 1-2 2" />
            </svg>
          </div>
        )}
        <button 
          className="p-1 rounded-md hover:bg-employIn-highlight/50 text-employIn-mediumText"
          onClick={toggleSidebar}
        >
          <Menu size={20} />
        </button>
      </div>

      <div className="flex-1 px-3 py-4 space-y-2 overflow-y-auto scrollbar-none">
        <SidebarItem 
          icon={<Home size={20} />}
          text="Home"
          isExpanded={isExpanded}
        />
        
        <SidebarItem 
          icon={<Users size={20} />}
          text="Team"
          hasDropdown={true}
          isDropdownOpen={activeDropdown === "team"}
          isExpanded={isExpanded}
          onClick={() => toggleDropdown("team")}
        />
        
        <SidebarItem 
          icon={<UserPlus size={20} />}
          text="Hire"
          hasDropdown={true}
          isDropdownOpen={activeDropdown === "hire"}
          isExpanded={isExpanded}
          onClick={() => toggleDropdown("hire")}
        />
        
        <SidebarItem 
          icon={<CreditCard size={20} />}
          text="Pay"
          hasDropdown={true}
          isDropdownOpen={activeDropdown === "pay"}
          isExpanded={isExpanded}
          isActive={true}
          onClick={() => toggleDropdown("pay")}
        />
        
        {activeDropdown === "pay" && (
          <div className="pl-3 space-y-1">
            <SidebarSubItem text="Payroll" isExpanded={isExpanded} />
            <SidebarSubItem text="Expenses" isExpanded={isExpanded} />
            <SidebarSubItem text="Invoices" isActive={true} isExpanded={isExpanded} />
            <SidebarSubItem text="Subscriptions" isExpanded={isExpanded} />
            <SidebarSubItem text="Payment Information" isExpanded={isExpanded} />
          </div>
        )}
        
        <SidebarItem 
          icon={<BarChart3 size={20} />}
          text="Total Rewards"
          hasDropdown={true}
          isDropdownOpen={activeDropdown === "rewards"}
          isExpanded={isExpanded}
          onClick={() => toggleDropdown("rewards")}
        />
        
        <SidebarItem 
          icon={<Building size={20} />}
          text="Company"
          hasDropdown={true}
          isDropdownOpen={activeDropdown === "company"}
          isExpanded={isExpanded}
          onClick={() => toggleDropdown("company")}
        />
        
        <SidebarItem 
          icon={<Briefcase size={20} />}
          text="Tools and resources"
          isExpanded={isExpanded}
        />
        
        <SidebarItem 
          icon={<HelpCircle size={20} />}
          text="Support Center"
          isExpanded={isExpanded}
        />
        
        <SidebarItem 
          icon={<Settings size={20} />}
          text="Settings"
          isExpanded={isExpanded}
        />
      </div>
    </div>
  );
};

import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  BarChart3, 
  Calendar, 
  ChevronRight, 
  Home, 
  Menu, 
  MessageSquare, 
  PanelLeft, 
  Settings, 
  UserCog,
  FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

interface SidebarLinkProps {
  to: string;
  icon: React.ElementType;
  label: string;
  isCollapsed: boolean;
}

const SidebarLink = ({ to, icon: Icon, label, isCollapsed }: SidebarLinkProps) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link to={to} className="w-full">
      <Button 
        variant="ghost" 
        className={cn(
          "w-full justify-start",
          isActive ? "bg-primary/10 text-primary hover:bg-primary/20" : "hover:bg-gray-100",
          isCollapsed ? "px-2" : "px-3"
        )}
      >
        <Icon className={cn("h-5 w-5", isActive ? "text-primary" : "text-gray-600")} />
        {!isCollapsed && <span className="ml-3">{label}</span>}
      </Button>
    </Link>
  );
};

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user } = useAuth();

  if (!user) return null;

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div
      className={cn(
        "bg-gray-50 border-r border-gray-200 h-[calc(100vh-60px)] transition-all duration-300 flex flex-col",
        isCollapsed ? "w-14" : "w-64"
      )}
    >
      <div className="p-2 border-b border-gray-200 flex justify-end">
        <Button variant="ghost" size="sm" onClick={toggleCollapse}>
          {isCollapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <PanelLeft className="h-5 w-5" />
          )}
        </Button>
      </div>
      
      <div className="flex flex-col py-4 flex-1 overflow-y-auto space-y-1 px-2">
        <SidebarLink to="/dashboard" icon={Home} label="Dashboard" isCollapsed={isCollapsed} />
        <SidebarLink to="/pipeline" icon={Menu} label="Pipeline" isCollapsed={isCollapsed} />
        <SidebarLink to="/calendar" icon={Calendar} label="Calendário" isCollapsed={isCollapsed} />
        <SidebarLink to="/analytics" icon={BarChart3} label="Análises" isCollapsed={isCollapsed} />
        <SidebarLink to="/conversations" icon={MessageSquare} label="Conversas" isCollapsed={isCollapsed} />
        <SidebarLink to="/logs" icon={FileText} label="Logs" isCollapsed={isCollapsed} />
        
        {(user.role === 'admin' || user.role === 'super_admin') && (
          <SidebarLink to="/team" icon={UserCog} label="Equipe" isCollapsed={isCollapsed} />
        )}
      </div>
      
      <div className="py-4 border-t border-gray-200 px-2">
        <SidebarLink to="/settings" icon={Settings} label="Configurações" isCollapsed={isCollapsed} />
      </div>
    </div>
  );
}

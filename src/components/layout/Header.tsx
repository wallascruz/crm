import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Bell, 
  Calendar, 
  ChevronDown, 
  ChevronUp, 
  LogOut, 
  Settings, 
  User 
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCompany } from '@/contexts/CompanyContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export function Header() {
  const { user, logout } = useAuth();
  const { currentCompany } = useCompany();
  const [isCompanyMenuOpen, setIsCompanyMenuOpen] = useState(false);

  if (!user) return null;

  const initials = user.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm py-3 px-4 md:px-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <Link to="/dashboard" className="font-bold text-xl text-primary flex items-center">
            <span className="bg-primary text-white rounded-md p-1 mr-2">PP</span>
            Pipeline Pro
          </Link>
          
          {currentCompany && user.role !== 'super_admin' && (
            <div className="hidden md:flex items-center">
              <span className="text-sm text-gray-500 mr-2">Empresa:</span>
              <span className="font-medium">{currentCompany.name}</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-1 sm:space-x-3">
          <Link to="/calendar">
            <Button variant="ghost" size="icon" className="text-gray-600 hover:text-primary">
              <Calendar className="h-5 w-5" />
            </Button>
          </Link>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-gray-600 hover:text-primary">
                <Bell className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notificações</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="py-2 px-3 text-center text-sm text-gray-500">
                Nenhuma notificação no momento
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <div className="px-3 py-2">
                <p className="font-medium">{user.name}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/profile" className="flex cursor-pointer items-center">
                  <User className="mr-2 h-4 w-4" />
                  <span>Perfil</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/settings" className="flex cursor-pointer items-center">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Configurações</span>
                </Link>
              </DropdownMenuItem>
              {user.role === 'super_admin' && (
                <DropdownMenuItem asChild>
                  <Link to="/admin/companies" className="flex cursor-pointer items-center">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Admin</span>
                  </Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="cursor-pointer text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sair</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

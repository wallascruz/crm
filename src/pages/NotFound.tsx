import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-6xl font-bold text-gray-900">404</h1>
      <p className="mt-4 text-xl text-gray-600">Página não encontrada</p>
      <p className="mt-2 text-gray-500">A página que você está procurando não existe ou foi removida.</p>
      <Link to="/" className="mt-8">
        <Button>
          Voltar para a página inicial
        </Button>
      </Link>
    </div>
  );
}

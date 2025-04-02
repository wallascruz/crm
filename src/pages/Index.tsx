import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

export default function Index() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (user) {
      if (user.role === 'super_admin') {
        navigate('/admin/companies');
      } else {
        navigate('/dashboard');
      }
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero section */}
      <div className="bg-gradient-to-br from-primary/90 to-primary text-white">
        <header className="container mx-auto px-4 py-6 flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-xl font-bold">PipelinePro</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost" className="text-white hover:bg-white/10">
                Login
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-primary">
                Registrar
              </Button>
            </Link>
          </div>
        </header>
        
        <div className="container mx-auto px-4 py-24 md:py-32 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Simplifique seu processo de vendas
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mb-10 text-white/90">
            Gerencie leads, otimize seu pipeline e aumente suas conversões com o CRM mais intuitivo do mercado.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/register">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90">
                Começar agora
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="border-white text-white bg-transparent hover:bg-white/10">
                Fazer login
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Features section */}
      <div className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Tudo o que você precisa para gerenciar suas vendas
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center text-primary mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <path d="M7 7h.01M7 12h.01M7 17h.01M12 7h5M12 12h5M12 17h5" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Pipeline Personalizado</h3>
              <p className="text-gray-600">
                Crie e personalize estágios do seu pipeline conforme suas necessidades específicas.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center text-primary mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Anotações e Acompanhamentos</h3>
              <p className="text-gray-600">
                Registre informações importantes e programe lembretes para não perder oportunidades.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center text-primary mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Análises Avançadas</h3>
              <p className="text-gray-600">
                Visualize métricas de desempenho, taxas de conversão e muito mais para tomar decisões baseadas em dados.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Call to action */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Pronto para transformar sua gestão de vendas?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Comece a usar o PipelinePro hoje mesmo e veja resultados imediatos no seu processo de vendas.
          </p>
          <Link to="/register">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Criar minha conta grátis
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-8 md:mb-0">
              <h3 className="text-xl font-bold mb-4">PipelinePro</h3>
              <p className="text-gray-400 max-w-xs">
                O melhor CRM para gerenciamento de leads e pipeline de vendas.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h4 className="font-semibold mb-4">Produto</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white">Recursos</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Preços</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Integrações</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Empresa</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white">Sobre nós</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Clientes</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Contato</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Legal</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white">Termos de serviço</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Política de privacidade</a></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="pt-8 mt-8 border-t border-gray-800 text-center">
            <p className="text-gray-400">© {new Date().getFullYear()} PipelinePro. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

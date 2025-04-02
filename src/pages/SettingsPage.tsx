import { useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { Upload, User, Save } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

export default function SettingsPage() {
  const { user, setCurrentUser } = useAuth();
  const navigate = useNavigate(); // Initialize useNavigate

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    avatar: user?.avatar || '',
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value
    });
  };

  const handleSaveProfile = () => {
    if (!user) return;

    setIsLoading(true);

    // Simulating API call
    setTimeout(() => {
      setCurrentUser({
        ...user,
        name: profileData.name,
        email: profileData.email,
        avatar: profileData.avatar
      });

      setIsLoading(false);
      toast.success("Perfil atualizado com sucesso!");
    }, 500);
  };

  const handleAvatarUpload = () => {
    // Simulate file upload
    const randomAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(profileData.name)}&background=random&color=fff`;
    setProfileData({
      ...profileData,
      avatar: randomAvatar
    });
    toast.success("Imagem de perfil atualizada!");
  };

  if (!user) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center h-full">
          <p>Carregando...</p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="flex flex-col space-y-6">
        <h1 className="text-3xl font-bold">Configurações</h1>

        <Tabs defaultValue="profile">
          <TabsList className="mb-4">
            <TabsTrigger value="profile">Perfil</TabsTrigger>
            <TabsTrigger value="security">Segurança</TabsTrigger>
            <TabsTrigger value="notifications">Notificações</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informações de perfil</CardTitle>
                  <CardDescription>
                    Atualize suas informações pessoais
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex flex-col space-y-2">
                      <Label htmlFor="name">Nome completo</Label>
                      <Input
                        id="name"
                        name="name"
                        value={profileData.name}
                        onChange={handleInputChange}
                        placeholder="Seu nome"
                      />
                    </div>

                    <div className="flex flex-col space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={profileData.email}
                        onChange={handleInputChange}
                        placeholder="seu.email@exemplo.com"
                      />
                    </div>

                    <div className="flex flex-col space-y-2">
                      <Label>Foto de perfil</Label>
                      <div className="flex items-center gap-4">
                        <Avatar className="h-20 w-20">
                          {profileData.avatar ? (
                            <AvatarImage src={profileData.avatar} alt={profileData.name} />
                          ) : (
                            <AvatarFallback className="text-2xl">
                              <User size={32} />
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div className="space-y-2">
                          <Button variant="outline" onClick={handleAvatarUpload}>
                            <Upload className="h-4 w-4 mr-2" />
                            Upload imagem
                          </Button>
                          <p className="text-xs text-gray-500">
                            Formatos suportados: JPEG, PNG, GIF
                          </p>
                        </div>
                      </div>
                    </div>

                    <Button
                      onClick={handleSaveProfile}
                      disabled={isLoading || !profileData.name.trim() || !profileData.email.trim()}
                      className="w-full mt-4"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Salvar alterações
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Detalhes da conta</CardTitle>
                  <CardDescription>
                    Informações sobre sua conta no sistema
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p><strong>ID da conta:</strong> {user.id}</p>
                    <p><strong>Função:</strong> {
                      user.role === 'super_admin' ? 'Super Administrador' :
                      user.role === 'admin' ? 'Administrador' : 'Colaborador'
                    }</p>
                    <p><strong>Data de criação:</strong> {new Date(user.createdAt).toLocaleString()}</p>
                    {user.companyId && <p><strong>ID da empresa:</strong> {user.companyId}</p>}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Segurança</CardTitle>
                <CardDescription>
                  Gerencie sua senha e configurações de segurança
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>Configurações de segurança serão implementadas em breve.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notificações</CardTitle>
                <CardDescription>
                  Configure suas preferências de notificação
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>Configurações de notificação serão implementadas em breve.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
}

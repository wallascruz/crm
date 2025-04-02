import { useState } from 'react';
import { PageLayout } from "@/components/layout/PageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Send, User } from 'lucide-react';
import { useKanban } from '@/contexts/KanbanContext';
import { Lead } from '@/types';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function ConversationsPage() {
  const { leads } = useKanban();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [message, setMessage] = useState("");

  const filteredLeads = leads.filter(lead => 
    lead.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendMessage = () => {
    if (!message.trim() || !selectedLead) return;
    
    // Here we would send the message via an API
    console.log(`Sending message to ${selectedLead.name}: ${message}`);
    
    // Reset message input
    setMessage("");
  };
  
  return (
    <PageLayout>
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Conversas</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[calc(100vh-200px)]">
          {/* Left sidebar - Conversation list */}
          <Card className="md:col-span-1 overflow-hidden">
            <CardHeader className="p-4">
              <CardTitle className="text-lg">Leads</CardTitle>
              <div className="relative mt-2">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar leads..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </CardHeader>
            <ScrollArea className="h-[calc(100vh-290px)]">
              <div className="p-2">
                {filteredLeads.length > 0 ? (
                  filteredLeads.map((lead) => (
                    <div
                      key={lead.id}
                      className={`flex items-center gap-3 p-3 rounded-md cursor-pointer hover:bg-gray-100 ${
                        selectedLead?.id === lead.id ? "bg-gray-100" : ""
                      }`}
                      onClick={() => setSelectedLead(lead)}
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {lead.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{lead.name}</p>
                        <p className="text-xs text-gray-500">
                          {lead.email || "Sem email"}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-4">
                    Nenhum lead encontrado
                  </p>
                )}
              </div>
            </ScrollArea>
          </Card>
          
          {/* Right side - Conversation */}
          <Card className="md:col-span-2 overflow-hidden">
            {selectedLead ? (
              <>
                <CardHeader className="border-b">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {selectedLead.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-base">{selectedLead.name}</CardTitle>
                      <p className="text-xs text-gray-500">
                        {selectedLead.email || "Sem email"}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                
                <Tabs defaultValue="chat" className="flex flex-col h-full">
                  <TabsList className="mx-4 mt-2 w-auto">
                    <TabsTrigger value="chat">Chat</TabsTrigger>
                    <TabsTrigger value="history">Histórico</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="chat" className="flex-grow flex flex-col p-0 m-0 h-full">
                    <ScrollArea className="flex-grow p-4 h-[calc(100vh-360px)]">
                      <div className="space-y-4">
                        <div className="flex items-start gap-2">
                          <Avatar className="h-8 w-8 mt-1">
                            <AvatarFallback className="bg-primary text-primary-foreground">
                              <User className="h-4 w-4" />
                            </AvatarFallback>
                          </Avatar>
                          <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                            <p>Olá, como posso ajudar você hoje?</p>
                            <span className="text-xs text-gray-500 mt-1 block">14:35</span>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-2 justify-end">
                          <div className="bg-primary/10 rounded-lg p-3 max-w-[80%]">
                            <p>Estou interessado em saber mais sobre seus serviços.</p>
                            <span className="text-xs text-gray-500 mt-1 block">14:37</span>
                          </div>
                          <Avatar className="h-8 w-8 mt-1">
                            <AvatarFallback className="bg-blue-100 text-blue-500">
                              {selectedLead.name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                      </div>
                    </ScrollArea>
                    
                    <div className="border-t p-4">
                      <div className="flex items-center gap-2">
                        <Input
                          placeholder="Digite sua mensagem..."
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                        />
                        <Button onClick={handleSendMessage}>
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="history" className="h-full p-0 m-0">
                    <ScrollArea className="h-[calc(100vh-360px)] p-4">
                      <div className="space-y-4">
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-sm">Histórico de Interações</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              <div className="border-b pb-2">
                                <p className="text-sm font-medium">05/04/2023</p>
                                <p className="text-sm">Primeiro contato via site</p>
                              </div>
                              <div className="border-b pb-2">
                                <p className="text-sm font-medium">12/04/2023</p>
                                <p className="text-sm">Envio de proposta comercial</p>
                              </div>
                              <div className="border-b pb-2">
                                <p className="text-sm font-medium">18/04/2023</p>
                                <p className="text-sm">Ligação de acompanhamento</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </ScrollArea>
                  </TabsContent>
                </Tabs>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-[calc(100vh-290px)]">
                <p className="text-muted-foreground mb-2">Selecione um lead para iniciar uma conversa</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </PageLayout>
  );
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "super_admin" | "admin" | "employee";
  companyId?: string;
  createdAt: string;
  avatar?: string;
}

export interface Company {
  id: string;
  name: string;
  logo?: string;
  createdAt: string;
  ownerId: string;
}

export interface Stage {
  id: string;
  name: string;
  order: number;
  companyId: string;
  createdAt: string;
  color?: string;
}

export interface Interest {
  id: string;
  name: string;
  companyId: string;
  createdAt: string;
}

export interface Lead {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  companyId: string;
  stageId: string;
  interestId?: string;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Note {
  id: string;
  content: string;
  leadId: string;
  userId: string;
  createdAt: string;
}

export interface Conversation {
  id: string;
  leadId: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  content: string;
  conversationId: string;
  userId: string;
  createdAt: string;
}

export interface Activity {
  id: string;
  title: string;
  description?: string;
  leadId: string;
  userId: string;
  dueDate: string;
  completed: boolean;
  createdAt: string;
  type: "follow_up" | "meeting" | "call" | "email" | "other";
}

export interface LogEntry {
  id: string;
  userId: string;
  action: string;
  details: string;
  entityId?: string;
  entityType?: "lead" | "stage" | "interest" | "activity" | "note" | "user" | "company";
  createdAt: string;
}

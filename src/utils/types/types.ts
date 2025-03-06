// INTERFAZ DE CLIENTE
export interface Client {
  id: string;
  deletedAt?: Date | null;
  document?: string | null;
  email?: string | null;
  name: string;
  observation?: string | null;
  phone?: string | null;
  Process?: Process[]; // Relación con procesos
}

// INTERFAZ DE USUARIOS
export interface Users {
  id: string;
  name?: string | null;
  username?: string | null;
  email: string;
  password: string;
  rol?: string | null;
  Process: Process[]; // Procesos asignados
  Task: Task[];
  comments: Comments[];
}

// INTERFAZ DE TIPOS DE PRODUCTO
export interface ProductType {
  id: string;
  name: string;
  deletedAt?: Date | null;
  Products: Products[];
}

// INTERFAZ DE PRODUCTOS
export interface Products {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  discount?: number | null;
  imageUrl?: string | null;
  processId?: string | null;
  process?: Process | null;
  availability: boolean;
  deletedAt?: Date | null;
  productTypeId: string;
  productType: ProductType;
}

// INTERFAZ DE PROCESOS
export interface Process {
  createdAt: string | number | Date;
  id: string;
  title: string;
  slug: string;
  clientId?: string | null;
  client?: Client | null;
  userId: string;
  user: Users;
  products: Products[];
  status: number; // 0=Pendiente, etc.
  tasks: Task[];
}

// INTERFAZ DE TAREAS
export interface Task {
  id: string;
  title: string;
  description?: string | null;
  processId: string;
  process: Process;
  userId: string;
  user: Users;
  deadline?: Date | null;
  status: number; // 0=pendiente, 1=en progreso, 2=completado, 3=cancelado
  priority: string; // "Alta", "Media", "Baja"
  comments: Comments[];
  createdAt: Date;
}

// INTERFAZ DE COMENTARIOS
export interface Comments {
  id: string;
  text: string;
  taskId: string;
  userId: string;
  createdAt: Date;
}

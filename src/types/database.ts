export interface Task {
  id: string;
  name: string;
  description: string;
  completed: boolean;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export type TaskInsert = Omit<Task, 'id' | 'created_at' | 'updated_at'> & {
  id?: string;
  created_at?: string;
  updated_at?: string;
};

export type TaskUpdate = Partial<Omit<Task, 'id' | 'created_at'>>;

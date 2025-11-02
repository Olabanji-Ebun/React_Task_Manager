export interface Database {
  public: {
    Tables: {
      tasks: {
        Row: {
          id: string;
          name: string;
          description: string;
          completed: boolean;
          user_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string;
          completed?: boolean;
          user_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          completed?: boolean;
          user_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}

export type Task = Database['public']['Tables']['tasks']['Row'];
export type TaskInsert = Database['public']['Tables']['tasks']['Insert'];
export type TaskUpdate = Database['public']['Tables']['tasks']['Update'];

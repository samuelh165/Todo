export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          phone_number: string;
          name: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          phone_number: string;
          name?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          phone_number?: string;
          name?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      tasks: {
        Row: {
          id: string;
          user_id: string;
          content: string;
          due_date: string | null;
          priority: 'low' | 'medium' | 'high';
          status: 'pending' | 'completed' | 'cancelled';
          category: string | null;
          is_flagged: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          content: string;
          due_date?: string | null;
          priority?: 'low' | 'medium' | 'high';
          status?: 'pending' | 'completed' | 'cancelled';
          category?: string | null;
          is_flagged?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          content?: string;
          due_date?: string | null;
          priority?: 'low' | 'medium' | 'high';
          status?: 'pending' | 'completed' | 'cancelled';
          category?: string | null;
          is_flagged?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      topics: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}

export type User = Database['public']['Tables']['users']['Row'];
export type Task = Database['public']['Tables']['tasks']['Row'];
export type Topic = Database['public']['Tables']['topics']['Row'];

export type NewUser = Database['public']['Tables']['users']['Insert'];
export type NewTask = Database['public']['Tables']['tasks']['Insert'];
export type NewTopic = Database['public']['Tables']['topics']['Insert'];

export interface Database {
    public: {
        Tables: {
            gifts: {
                Row: {
                    id: string
                    created_at: string
                    updated_at: string
                    title: string
                    description: string | null
                    price: number | null
                    url: string | null
                    priority: number
                    purchased: boolean
                    user_id: string
                }
                Insert: Omit<Database['public']['Tables']['gifts']['Row'], 'id' | 'created_at' | 'updated_at'>
                Update: Partial<Database['public']['Tables']['gifts']['Insert']>
            }
        }
    }
} 
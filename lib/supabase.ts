import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'

// Validate environment variables
function validateEnvironment(): void {
    const requiredEnvVars = {
        NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
        NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    }

    const missingVars = Object.entries(requiredEnvVars)
        .filter(([_, value]) => !value)
        .map(([key]) => key)

    if (missingVars.length > 0) {
        throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`)
    }
}

// Test Supabase connection
async function testConnection(): Promise<boolean> {
    try {
        const { data, error } = await supabase.from('_test_connection').select('*').limit(1)
        if (error) {
            console.error('Supabase connection test failed:', error.message)
            return false
        }
        return true
    } catch (error) {
        console.error('Supabase connection test failed:', error)
        return false
    }
}

export async function initializeDatabase() {
    try {
        // Validate environment variables first
        validateEnvironment()

        // Test connection before proceeding
        const isConnected = await testConnection()
        if (!isConnected) {
            throw new Error('Could not establish connection to Supabase')
        }

        // Rest of your initialization code...
        const { data: existingTable, error: tableError } = await supabase
            .from('gifts')
            .select('*')
            .limit(1)

        if (tableError) {
            console.log('Table does not exist or has wrong structure. Creating/Recreating...')
            
            // Drop the table if it exists with wrong structure
            const { error: dropError } = await supabase.rpc('drop_gifts_table_if_exists')
            if (dropError) {
                throw new Error(`Failed to drop existing table: ${dropError.message}`)
            }

            // Create the table with proper structure
            const { error: createError } = await supabase
                .rpc('create_gifts_table', {
                    schema_definition: GIFTS_TABLE_SCHEMA
                })

            if (createError) {
                throw new Error(`Failed to create table: ${createError.message}`)
            }

            // Create triggers for updated_at
            const { error: triggerError } = await supabase.rpc('create_gifts_triggers')
            if (triggerError) {
                throw new Error(`Failed to create triggers: ${triggerError.message}`)
            }

            console.log('Database initialized successfully')
        } else {
            // Verify table structure
            const { error: structureError } = await supabase
                .rpc('verify_gifts_table_structure', {
                    expected_schema: GIFTS_TABLE_SCHEMA
                })

            if (structureError) {
                console.log('Table structure mismatch. Recreating...')
                await initializeDatabase()
            } else {
                console.log('Database structure verified')
            }
        }
    } catch (error) {
        console.error('Database initialization failed:', error)
        throw error
    }
}

// Initialize Supabase client only after environment validation
validateEnvironment()
export const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Database schema definition
const GIFTS_TABLE_SCHEMA = `
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  description text,
  price decimal(10,2),
  url text,
  priority smallint default 1,
  purchased boolean default false,
  user_id uuid references auth.users(id) on delete cascade
` 
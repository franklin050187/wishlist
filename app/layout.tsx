import { initializeDatabase } from '@/lib/supabase'

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    try {
        // Initialize database on app start
        await initializeDatabase()
    } catch (error) {
        console.error('Failed to initialize database:', error)
        // You might want to show an error UI here
        return (
            <html lang="en">
                <body>
                    <div>
                        <h1>Error initializing application</h1>
                        <p>Please check your environment configuration and database connection.</p>
                    </div>
                </body>
            </html>
        )
    }

    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    )
}

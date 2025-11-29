import { useState, useEffect } from 'react'

export interface User {
    id: number
    firstName: string
    lastName: string
    email: string
    phone: string
    image: string
    company: {
        title: string
    }
    role: string // API might not return 'role' directly in the root, but 'company.title' or 'role' if available. DummyJSON users have 'role' field now? Let's check docs or assume standard fields.
    // Actually dummyjson users have 'role': 'admin' | 'moderator' | 'user' usually, or we can use company title.
    // Let's stick to the interface from the response.
}

interface UsersResponse {
    users: User[]
    total: number
    skip: number
    limit: number
}

export function useUsers() {
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true)
                const response = await fetch('https://dummyjson.com/users')

                if (!response.ok) {
                    throw new Error('Failed to fetch users')
                }

                const data: UsersResponse = await response.json()
                setUsers(data.users)
                setError(null)
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred')
            } finally {
                setLoading(false)
            }
        }

        fetchUsers()
    }, [])

    return { users, loading, error }
}

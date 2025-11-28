import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'

interface User {
    id: number
    username: string
    email: string
    firstName: string
    lastName: string
}

interface AuthContextType {
    user: User | null
    token: string | null
    login: (username: string, password: string) => Promise<void>
    logout: () => void
    isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [token, setToken] = useState<string | null>(null)
    const [user, setUser] = useState<User | null>(null)

    // Sayfa yüklendiğinde token kontrolü
    useEffect(() => {
        const savedToken = localStorage.getItem('token')
        const savedUser = localStorage.getItem('user')

        if (savedToken && savedUser) {
            setToken(savedToken)
            setUser(JSON.parse(savedUser))
        }
    }, [])

    const login = async (username: string, password: string) => {
        try {
            const response = await fetch('https://dummyjson.com/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username,
                    password,
                    expiresInMins: 30,
                }),
            })

            if (!response.ok) {
                throw new Error('Kullanıcı adı veya şifre hatalı!')
            }


            const data = await response.json()
            console.log("login-data", data)
            // Token ve user bilgilerini kaydet
            setToken(data.accessToken)
            setUser({
                id: data.id,
                username: data.username,
                email: data.email,
                firstName: data.firstName,
                lastName: data.lastName,
            })

            // localStorage'a kaydet
            localStorage.setItem('token', data.accessToken)
            localStorage.setItem('user', JSON.stringify({
                id: data.id,
                username: data.username,
                email: data.email,
                firstName: data.firstName,
                lastName: data.lastName,
            }))
        } catch (error) {
            console.error('Login hatası:', error)
            throw error
        }
    }

    const logout = () => {
        setToken(null)
        setUser(null)
        localStorage.removeItem('token')
        localStorage.removeItem('user')
    }

    const value = {
        user,
        token,
        login,
        logout,
        isAuthenticated: !!token,
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Custom hook
export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}

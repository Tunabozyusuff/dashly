import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'

// User: Kullanıcının hangi bilgilerini saklayacağımızı tanımlar (id, isim, email vb.)
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

/* user: Giriş yapmış kullanıcının bilgileri (id, ad, vb.). Henüz giriş yoksa null.
token: Sunucudan alınan güvenlik anahtarı (accessToken). Yoksa null. Varlığı giriş yapıldığını gösterir.
login(...): Kullanıcı adı + şifre alır. Sunucuya istek atar. Başarılı olursa user ve token doldurulur. Hata olursa Promise reject olur.
logout(): user ve token değerlerini sıfırlar, localStorage temizlenir. Uygulama artık “girişsiz” durumdadır.
isAuthenticated: Kolay kontrol için boolean. token varsa true, yoksa false. Protected Route’larda hızlı karar vermek için kullanılır.
Amaç: Bu interface, context içinden dışarıya ne sunulduğunu kesin tiplerle tanımlar; başka component’ler useAuth() kullandığında bunları alacağını bilir. */

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

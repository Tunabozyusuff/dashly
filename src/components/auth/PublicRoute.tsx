import { Navigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import type { ReactNode } from 'react'

interface PublicRouteProps {
    children: ReactNode
}

export default function PublicRoute({ children }: PublicRouteProps) {
    const { isAuthenticated } = useAuth()

    // Token varsa dashboard'a yönlendir (login sayfasını engelle)
    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />
    }

    // Token yoksa login sayfasını göster
    return <>{children}</>
}

import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import type { ReactNode } from 'react'

interface ProtectedRouteProps {
    children: ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { isAuthenticated } = useAuth()
    const location = useLocation()

    // Token yoksa login'e yönlendir
    if (!isAuthenticated) {
        return <Navigate to="/login" replace state={{ from: location }} />
    }

    // Token varsa sayfayı göster
    return <>{children}</>
}

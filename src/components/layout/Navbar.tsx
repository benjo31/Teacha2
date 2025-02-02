import { Link, useLocation } from 'react-router-dom'
import { GraduationCap, MessageCircle, School } from 'lucide-react'
import { useAuth } from '../../lib/context/AuthContext'
import { useAdmin } from '../../lib/hooks/useAdmin'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import { useEffect, useState } from 'react'
import { NotificationsDropdown } from '../notifications/NotificationsDropdown'
import { UserMenu } from './UserMenu'
import { useUnreadMessages } from '../../hooks/useUnreadMessages'

export function Navbar() {
  const { user } = useAuth()
  const { isAdmin } = useAdmin()
  const [userType, setUserType] = useState<'teacher' | 'school' | null>(null)
  const location = useLocation()
  const unreadMessages = useUnreadMessages(user?.uid)

  useEffect(() => {
    async function checkUserType() {
      if (!user) return

      const teacherDoc = await getDoc(doc(db, 'teachers', user.uid))
      const schoolDoc = await getDoc(doc(db, 'schools', user.uid))

      if (teacherDoc.exists()) {
        setUserType('teacher')
      } else if (schoolDoc.exists()) {
        setUserType('school')
      }
    }

    checkUserType()
  }, [user])

  const isActive = (path: string) => {
    return location.pathname === path ? 'text-primary font-medium' : 'text-gray-600'
  }

  return (
    <nav className="bg-white shadow-sm relative z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2">
              <GraduationCap className="h-8 w-8 text-primary" />
              <span className="text-xl font-semibold">Teacha</span>
            </Link>

            {!user && (
              <div className="hidden md:flex space-x-6">
                <Link
                  to="/how-it-works"
                  className={`hover:text-primary ${isActive('/how-it-works')}`}
                >
                  Comment ça marche ?
                </Link>
                <Link
                  to="/pricing"
                  className={`hover:text-primary ${isActive('/pricing')}`}
                >
                  Prix
                </Link>
                <Link
                  to="/help"
                  className={`hover:text-primary ${isActive('/help')}`}
                >
                  Aide
                </Link>
              </div>
            )}

            {user && (
              <div className="hidden md:flex space-x-4">
                {isAdmin && (
                  <Link
                    to="/admin"
                    className={`hover:text-primary ${isActive('/admin')}`}
                  >
                    Tableau de bord
                  </Link>
                )}

                {userType === 'teacher' && (
                  <>
                    <Link
                      to="/teacher-home"
                      className={`hover:text-primary ${isActive('/teacher-home')}`}
                    >
                      Tableau de bord
                    </Link>
                    <Link
                      to="/teacher-dashboard"
                      className={`hover:text-primary ${isActive('/teacher-dashboard')}`}
                    >
                      Offres disponibles
                    </Link>
                    <Link
                      to="/teacher-applications"
                      className={`hover:text-primary ${isActive('/teacher-applications')}`}
                    >
                      Mes candidatures
                    </Link>
                    <Link
                      to="/schools"
                      className={`hover:text-primary ${isActive('/schools')}`}
                    >
                      <div className="flex items-center space-x-1">
                        <School className="h-4 w-4" />
                        <span>Écoles</span>
                      </div>
                    </Link>
                  </>
                )}

                {userType === 'school' && (
                  <>
                    <Link
                      to="/school-home"
                      className={`hover:text-primary ${isActive('/school-home')}`}
                    >
                      Tableau de bord
                    </Link>
                    <Link
                      to="/school-dashboard"
                      className={`hover:text-primary ${isActive('/school-dashboard')}`}
                    >
                      Mes offres
                    </Link>
                    <Link
                      to="/school-applications"
                      className={`hover:text-primary ${isActive('/school-applications')}`}
                    >
                      Candidatures reçues
                    </Link>
                    <Link
                      to="/school-history"
                      className={`hover:text-primary ${isActive('/school-history')}`}
                    >
                      Historique
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {user && (userType === 'teacher' || userType === 'school') && (
              <Link
                to="/messages"
                className={`relative hover:text-primary ${isActive('/messages')}`}
              >
                <MessageCircle className="h-5 w-5" />
                {unreadMessages > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {unreadMessages}
                  </span>
                )}
              </Link>
            )}

            {user ? (
              <>
                <NotificationsDropdown />
                <UserMenu />
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`hover:text-primary ${isActive('/login')}`}
                >
                  Connexion
                </Link>
                <Link
                  to="/register"
                  className="btn btn-primary shadow-md hover:shadow-lg"
                >
                  Inscription
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
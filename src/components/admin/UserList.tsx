import { useState } from 'react'
import { Search } from 'lucide-react'
import { TeacherProfileModal } from '../teachers/TeacherProfileModal'

interface Column {
  key: string
  label: string
}

interface UserListProps {
  users: any[]
  type: 'teacher' | 'school'
  columns: Column[]
}

export function UserList({ users, type, columns }: UserListProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedUser, setSelectedUser] = useState<any>(null)

  const filteredUsers = users.filter(user => {
    const searchString = searchTerm.toLowerCase()
    if (type === 'teacher') {
      return (
        user.firstName?.toLowerCase().includes(searchString) ||
        user.lastName?.toLowerCase().includes(searchString) ||
        user.email?.toLowerCase().includes(searchString) ||
        user.canton?.toLowerCase().includes(searchString)
      )
    } else {
      return (
        user.name?.toLowerCase().includes(searchString) ||
        user.email?.toLowerCase().includes(searchString) ||
        user.canton?.toLowerCase().includes(searchString)
      )
    }
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">Approuvé</span>
      case 'pending':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">En attente</span>
      case 'rejected':
        return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-sm">Rejeté</span>
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">{status}</span>
    }
  }

  const getCellContent = (user: any, key: string) => {
    if (key === 'status') {
      return getStatusBadge(user[key])
    }
    return user[key]
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Rechercher..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:border-primary focus:ring-primary"
        />
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {column.label}
                </th>
              ))}
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                {columns.map((column) => (
                  <td key={column.key} className="px-6 py-4 whitespace-nowrap">
                    {getCellContent(user, column.key)}
                  </td>
                ))}
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <button
                    onClick={() => setSelectedUser(user)}
                    className="text-primary hover:text-primary-dark"
                  >
                    Voir détails
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedUser && type === 'teacher' && (
        <TeacherProfileModal
          teacher={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </div>
  )
}
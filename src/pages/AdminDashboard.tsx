import { useState } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/Tabs'
import { PendingTeachersList } from '../components/admin/PendingTeachersList'
import { PendingSchoolsList } from '../components/admin/PendingSchoolsList'
import { UserManagement } from '../components/admin/UserManagement'
import { Analytics } from '../components/admin/Analytics'
import { GlobalOffersView } from '../components/admin/GlobalOffersView'
import { useTranslation } from '../lib/context/LanguageContext'
import { Users, BarChart2, Clock, Briefcase } from 'lucide-react'

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'pending' | 'users' | 'offers' | 'analytics'>('pending')
  const { t } = useTranslation()

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t('admin.dashboard.title')}</h1>
      
      <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)}>
        <TabsList className="mb-4">
          <TabsTrigger value="pending" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            {t('admin.dashboard.tabs.pending')}
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            {t('admin.dashboard.tabs.users')}
          </TabsTrigger>
          <TabsTrigger value="offers" className="flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            {t('admin.dashboard.tabs.offers')}
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart2 className="h-4 w-4" />
            {t('admin.dashboard.tabs.analytics')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <div className="space-y-8">
            <div>
              <h2 className="text-lg font-semibold mb-4">{t('admin.pending.teachers')}</h2>
              <PendingTeachersList />
            </div>
            <div>
              <h2 className="text-lg font-semibold mb-4">{t('admin.pending.schools')}</h2>
              <PendingSchoolsList />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="users">
          <UserManagement />
        </TabsContent>

        <TabsContent value="offers">
          <GlobalOffersView />
        </TabsContent>

        <TabsContent value="analytics">
          <Analytics />
        </TabsContent>
      </Tabs>
    </div>
  )
}
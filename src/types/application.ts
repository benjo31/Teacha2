export type Application = {
  id: string
  teacherId: string
  offerId: string
  schoolId: string
  message: string
  status: 'pending' | 'accepted' | 'rejected'
  createdAt: Date
  schoolName: string
  offer: {
    subject: string
    class: string
    location: string
    startDate: string
    endDate: string
    totalLessons: number
    teachingLevel: string
    topic?: string
    qualifications?: string
    subjects?: string[]
  }
}
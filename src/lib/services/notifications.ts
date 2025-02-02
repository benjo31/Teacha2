import { db } from '../firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'

type NotificationData = {
  userId: string
  type: 'application' | 'status_update' | 'offer_filled' | 'application_rejected' | 'invitation'
  title: string
  message: string
  link?: string
}

export async function createNotification(data: NotificationData) {
  return addDoc(collection(db, 'notifications'), {
    ...data,
    read: false,
    createdAt: serverTimestamp(),
  })
}

export async function notifyNewApplication(schoolId: string, teacherName: string, subject: string) {
  return createNotification({
    userId: schoolId,
    type: 'application',
    title: 'Nouvelle candidature',
    message: `${teacherName} a postulé pour le remplacement de ${subject}`,
    link: '/school-applications'
  })
}

export async function notifyApplicationAccepted(teacherId: string, schoolName: string, subject: string) {
  return createNotification({
    userId: teacherId,
    type: 'status_update',
    title: 'Candidature acceptée',
    message: `${schoolName} a accepté votre candidature pour le remplacement de ${subject}`,
    link: '/teacher-applications'
  })
}

export async function notifyApplicationRejected(teacherId: string, schoolName: string, subject: string) {
  return createNotification({
    userId: teacherId,
    type: 'application_rejected',
    title: 'Remplacement pourvu',
    message: `Le remplacement de ${subject} à ${schoolName} a été attribué à un autre candidat`,
    link: '/teacher-applications'
  })
}

export async function notifyTeacherInvitation(teacherId: string, schoolName: string) {
  return createNotification({
    userId: teacherId,
    type: 'invitation',
    title: 'Nouvelle invitation',
    message: `${schoolName} vous invite à rejoindre leur établissement`,
    link: '/teacher-invitations'
  })
}
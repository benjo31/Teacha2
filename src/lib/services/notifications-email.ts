import { getFunctions, httpsCallable } from 'firebase/functions'
import { app } from '../firebase'

const functions = getFunctions(app)
const sendEmail = httpsCallable(functions, 'sendEmail')

export const emailNotifications = {
  async sendAccountApproval(data: { email: string, name: string, userType: 'teacher' | 'school' }) {
    try {
      await sendEmail({
        template: 'accountApproved',
        templateData: {
          name: data.name,
          userType: data.userType
        },
        to: data.email
      })
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'email d\'approbation:', error)
    }
  },

  async sendApplicationReceived(data: { 
    schoolEmail: string, 
    schoolName: string, 
    teacherName: string, 
    subject: string 
  }) {
    try {
      await sendEmail({
        template: 'applicationReceived',
        templateData: {
          schoolName: data.schoolName,
          teacherName: data.teacherName,
          subject: data.subject
        },
        to: data.schoolEmail
      })
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'email de candidature reçue:', error)
    }
  },

  async sendApplicationAccepted(data: { 
    teacherEmail: string, 
    teacherName: string, 
    schoolName: string, 
    subject: string,
    startDate: Date
  }) {
    try {
      await sendEmail({
        template: 'applicationAccepted',
        templateData: {
          teacherName: data.teacherName,
          schoolName: data.schoolName,
          subject: data.subject,
          startDate: data.startDate
        },
        to: data.teacherEmail
      })
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'email d\'acceptation:', error)
    }
  },

  async sendApplicationRejected(data: { 
    teacherEmail: string, 
    teacherName: string, 
    schoolName: string, 
    subject: string 
  }) {
    try {
      await sendEmail({
        template: 'applicationRejected',
        templateData: {
          teacherName: data.teacherName,
          schoolName: data.schoolName,
          subject: data.subject
        },
        to: data.teacherEmail
      })
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'email de rejet:', error)
    }
  },

  async sendNewLocalOffer(data: { 
    teacherEmail: string, 
    teacherName: string, 
    subject: string,
    schoolName: string,
    location: string
  }) {
    try {
      await sendEmail({
        template: 'newLocalOffer',
        templateData: {
          teacherName: data.teacherName,
          subject: data.subject,
          schoolName: data.schoolName,
          location: data.location
        },
        to: data.teacherEmail
      })
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'email d\'offre locale:', error)
    }
  }
}
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

export const emailTemplates = {
  accountApproved: (data: { name: string, userType: 'teacher' | 'school' }) => ({
    subject: 'Votre compte Teacha a été approuvé',
    html: `
      <h1>Bienvenue sur Teacha !</h1>
      <p>Bonjour ${data.name},</p>
      <p>Nous avons le plaisir de vous informer que votre compte ${data.userType === 'teacher' ? 'remplaçant' : 'école'} a été approuvé.</p>
      <p>Vous pouvez dès maintenant vous connecter et accéder à toutes les fonctionnalités de la plateforme.</p>
    `
  }),

  applicationReceived: (data: { schoolName: string, teacherName: string, subject: string }) => ({
    subject: 'Nouvelle candidature reçue',
    html: `
      <h1>Nouvelle candidature</h1>
      <p>${data.teacherName} a postulé pour le remplacement de ${data.subject}.</p>
      <p>Connectez-vous à votre compte pour examiner cette candidature.</p>
    `
  }),

  applicationAccepted: (data: { teacherName: string, schoolName: string, subject: string, startDate: Date }) => ({
    subject: 'Votre candidature a été acceptée',
    html: `
      <h1>Candidature acceptée</h1>
      <p>Félicitations ${data.teacherName} !</p>
      <p>Votre candidature pour le remplacement de ${data.subject} à ${data.schoolName} a été acceptée.</p>
      <p>Date de début : ${format(data.startDate, 'EEEE d MMMM yyyy', { locale: fr })}</p>
    `
  }),

  applicationRejected: (data: { teacherName: string, schoolName: string, subject: string }) => ({
    subject: 'Mise à jour de votre candidature',
    html: `
      <h1>Mise à jour de candidature</h1>
      <p>Bonjour ${data.teacherName},</p>
      <p>Le poste de remplacement en ${data.subject} à ${data.schoolName} a été pourvu.</p>
      <p>Nous vous invitons à consulter les autres offres disponibles sur la plateforme.</p>
    `
  }),

  newLocalOffer: (data: { teacherName: string, subject: string, schoolName: string, location: string }) => ({
    subject: 'Nouvelle offre près de chez vous',
    html: `
      <h1>Nouvelle offre de remplacement</h1>
      <p>Bonjour ${data.teacherName},</p>
      <p>Une nouvelle offre correspondant à vos critères vient d'être publiée :</p>
      <ul>
        <li>Matière : ${data.subject}</li>
        <li>École : ${data.schoolName}</li>
        <li>Lieu : ${data.location}</li>
      </ul>
      <p>Connectez-vous pour postuler !</p>
    `
  })
}
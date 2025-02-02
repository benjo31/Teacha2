import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import { Resend } from 'resend'

admin.initializeApp()
const resend = new Resend('re_8LXhrN64_BsarZdjCDD1gk6q67VzDg5Gi')

export const sendEmail = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Utilisateur non authentifié')
  }

  const { template, templateData, to } = data

  if (!template || !templateData || !to) {
    throw new functions.https.HttpsError('invalid-argument', 'Données manquantes')
  }

  try {
    const emailTemplate = emailTemplates[template](templateData)
    
    const response = await resend.emails.send({
      from: 'Teacha <notifications@teacha.ch>',
      to,
      subject: emailTemplate.subject,
      html: emailTemplate.html
    })

    if (response.error) {
      throw new Error(response.error.message)
    }

    return { success: true, messageId: response.data?.id }
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error)
    throw new functions.https.HttpsError('internal', 'Erreur lors de l\'envoi de l\'email')
  }
})

// Cloud Function pour mettre à jour les offres expirées
export const checkExpiredOffers = functions.pubsub
  .schedule('every 1 hours')
  .onRun(async (context) => {
    const now = new Date()
    
    try {
      const offersRef = admin.firestore()
        .collection('replacement-offers')
        .where('status', '==', 'active')
      
      const snapshot = await offersRef.get()
      const batch = admin.firestore().batch()
      let updatedCount = 0
      
      snapshot.docs.forEach(doc => {
        const data = doc.data()
        const endDate = new Date(data.endDate)
        
        if (endDate < now) {
          batch.update(doc.ref, { 
            status: 'expired',
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
          })
          updatedCount++
        }
      })
      
      if (updatedCount > 0) {
        await batch.commit()
        console.log(`${updatedCount} offres marquées comme expirées`)
      }
      
      return { updated: updatedCount }
    } catch (error) {
      console.error('Erreur lors de la mise à jour des offres expirées:', error)
      throw error
    }
  })
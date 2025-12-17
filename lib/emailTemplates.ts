/**
 * Email Templates
 * Professional HTML email templates for the survey application
 */

export function getVerificationEmailTemplate(code: string): { html: string; text: string } {
  const html = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Code de vérification</title>
  <!--[if mso]>
  <style type="text/css">
    body, table, td {font-family: Arial, sans-serif !important;}
  </style>
  <![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f3f4f6;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <!-- Main Container -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
          
          <!-- Header with Gradient -->
          <tr>
            <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
                Code de Vérification
              </h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px 0; color: #374151; font-size: 16px; line-height: 1.6;">
                Bonjour,
              </p>
              <p style="margin: 0 0 30px 0; color: #374151; font-size: 16px; line-height: 1.6;">
                Vous avez demandé un code de vérification pour accéder à l'enquête de satisfaction. 
                Utilisez le code ci-dessous pour continuer :
              </p>
              
              <!-- Code Box -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td align="center" style="padding: 20px 0;">
                    <div style="background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%); border: 2px dashed #667eea; border-radius: 12px; padding: 30px; text-align: center;">
                      <div style="font-size: 42px; font-weight: 700; letter-spacing: 8px; color: #667eea; font-family: 'Courier New', monospace; text-align: center;">
                        ${code}
                      </div>
                    </div>
                  </td>
                </tr>
              </table>
              
              <!-- Info Box -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-top: 30px;">
                <tr>
                  <td style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px 20px; border-radius: 6px;">
                    <p style="margin: 0; color: #92400e; font-size: 14px; line-height: 1.5;">
                      <strong>⏱️ Important :</strong> Ce code est valable pendant <strong>5 minutes</strong> seulement. 
                      Si vous n'avez pas demandé ce code, vous pouvez ignorer cet email en toute sécurité.
                    </p>
                  </td>
                </tr>
              </table>
              
              <!-- Instructions -->
              <div style="margin-top: 30px; padding-top: 30px; border-top: 1px solid #e5e7eb;">
                <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                  Comment utiliser ce code :
                </p>
                <ol style="margin: 0; padding-left: 20px; color: #6b7280; font-size: 14px; line-height: 1.8;">
                  <li>Retournez sur la page de l'enquête</li>
                  <li>Entrez le code ci-dessus dans le champ prévu</li>
                  <li>Cliquez sur "Vérifier le code"</li>
                </ol>
              </div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                <strong>Castel Afrique</strong><br>
                Enquête de Satisfaction
              </p>
              <p style="margin: 20px 0 0 0; color: #9ca3af; font-size: 12px; line-height: 1.5;">
                Cet email a été envoyé automatiquement. Veuillez ne pas y répondre.<br>
                Si vous avez des questions, contactez votre administrateur.
              </p>
            </td>
          </tr>
        </table>
        
        <!-- Spacer -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
          <tr>
            <td style="padding: 20px 0; text-align: center;">
              <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                © ${new Date().getFullYear()} Castel Afrique. Tous droits réservés.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  const text = `
Code de Vérification

Bonjour,

Vous avez demandé un code de vérification pour accéder à l'enquête de satisfaction.

Votre code est : ${code}

⏱️ Important : Ce code est valable pendant 5 minutes seulement.

Comment utiliser ce code :
1. Retournez sur la page de l'enquête
2. Entrez le code ci-dessus dans le champ prévu
3. Cliquez sur "Vérifier le code"

Si vous n'avez pas demandé ce code, vous pouvez ignorer cet email en toute sécurité.

---
Castel Afrique - Enquête de Satisfaction
Cet email a été envoyé automatiquement. Veuillez ne pas y répondre.
  `.trim();

  return { html, text };
}

export function getConfirmationEmailTemplate(nom: string, prenom: string): { html: string; text: string } {
  const fullName = `${prenom} ${nom}`;
  const html = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirmation de soumission</title>
  <!--[if mso]>
  <style type="text/css">
    body, table, td {font-family: Arial, sans-serif !important;}
  </style>
  <![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f3f4f6;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <!-- Main Container -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
          
          <!-- Header with Gradient -->
          <tr>
            <td style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 30px; text-align: center;">
              <div style="margin-bottom: 10px;">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin: 0 auto;">
                  <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
                Merci pour votre participation !
              </h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px 0; color: #374151; font-size: 16px; line-height: 1.6;">
                Bonjour <strong>${fullName}</strong>,
              </p>
              <p style="margin: 0 0 30px 0; color: #374151; font-size: 16px; line-height: 1.6;">
                Nous vous remercions d'avoir pris le temps de participer à notre enquête de satisfaction. 
                Votre avis est précieux et nous aide à améliorer continuellement nos services.
              </p>
              
              <!-- Success Box -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td style="background-color: #d1fae5; border-left: 4px solid #10b981; padding: 20px; border-radius: 6px; margin: 20px 0;">
                    <p style="margin: 0; color: #065f46; font-size: 14px; line-height: 1.6;">
                      <strong>✓ Votre réponse a été enregistrée avec succès</strong><br>
                      Vos réponses ont été sauvegardées et seront analysées par notre équipe.
                    </p>
                  </td>
                </tr>
              </table>
              
              <!-- Information -->
              <div style="margin-top: 30px; padding-top: 30px; border-top: 1px solid #e5e7eb;">
                <p style="margin: 0 0 15px 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                  <strong>Informations enregistrées :</strong>
                </p>
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f9fafb; border-radius: 6px; padding: 15px;">
                  <tr>
                    <td style="padding: 8px 0; color: #374151; font-size: 14px;">
                      <strong>Nom :</strong> ${nom}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #374151; font-size: 14px;">
                      <strong>Prénom :</strong> ${prenom}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #374151; font-size: 14px;">
                      <strong>Date de soumission :</strong> ${new Date().toLocaleDateString('fr-FR', { 
                        day: 'numeric', 
                        month: 'long', 
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                  </tr>
                </table>
              </div>
              
              <!-- Next Steps -->
              <div style="margin-top: 30px; padding-top: 30px; border-top: 1px solid #e5e7eb;">
                <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                  Prochaines étapes
                </p>
                <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.8;">
                  Votre feedback sera analysé par notre équipe et pris en compte pour améliorer nos services. 
                  Nous vous remercions encore une fois pour votre participation.
                </p>
              </div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                <strong>Castel Afrique</strong><br>
                Enquête de Satisfaction
              </p>
              <p style="margin: 20px 0 0 0; color: #9ca3af; font-size: 12px; line-height: 1.5;">
                Cet email a été envoyé automatiquement. Veuillez ne pas y répondre.<br>
                Si vous avez des questions, contactez votre administrateur.
              </p>
            </td>
          </tr>
        </table>
        
        <!-- Spacer -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
          <tr>
            <td style="padding: 20px 0; text-align: center;">
              <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                © ${new Date().getFullYear()} Castel Afrique. Tous droits réservés.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  const text = `
Confirmation de Soumission

Bonjour ${fullName},

Nous vous remercions d'avoir pris le temps de participer à notre enquête de satisfaction. 
Votre avis est précieux et nous aide à améliorer continuellement nos services.

✓ Votre réponse a été enregistrée avec succès
Vos réponses ont été sauvegardées et seront analysées par notre équipe.

Informations enregistrées :
- Nom : ${nom}
- Prénom : ${prenom}
- Date de soumission : ${new Date().toLocaleDateString('fr-FR', { 
  day: 'numeric', 
  month: 'long', 
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit'
})}

Prochaines étapes :
Votre feedback sera analysé par notre équipe et pris en compte pour améliorer nos services. 
Nous vous remercions encore une fois pour votre participation.

---
Castel Afrique - Enquête de Satisfaction
Cet email a été envoyé automatiquement. Veuillez ne pas y répondre.
  `.trim();

  return { html, text };
}


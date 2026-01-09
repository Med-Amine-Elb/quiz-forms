/**
 * Email Templates
 * Professional HTML email templates for the survey application
 */

export function getVerificationEmailTemplate(code: string, baseUrl?: string): { html: string; text: string } {
  // Use baseUrl if provided, otherwise use a placeholder that will be replaced with the actual domain
  const logoUrl = baseUrl 
    ? `${baseUrl}/societe-des-boissons-du-maroc--600-removebg-preview.png`
    : 'https://your-domain.com/societe-des-boissons-du-maroc--600-removebg-preview.png';
  
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
    .logo-img { width: 180px !important; height: auto !important; }
    .outlook-gradient { background-color: #2563eb !important; }
    .outlook-bg { background-color: #E0F2FE !important; }
    .outlook-code-bg { background-color: #F3E8FF !important; }
    .outlook-info-bg { background-color: #E0F2FE !important; }
  </style>
  <![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: #E0F2FE; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <!--[if mso]>
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #E0F2FE;">
  <![endif]-->
  <!--[if !mso]><!-->
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background: linear-gradient(135deg, rgba(224, 242, 254, 0.8) 0%, rgba(243, 232, 255, 0.6) 50%, rgba(224, 242, 254, 0.8) 100%);">
  <!--<![endif]-->
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <!-- Main Container -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15); overflow: hidden;">
          
          <!-- Header with Logo and Gradient -->
          <tr>
            <!--[if mso]>
            <td class="outlook-gradient" style="background-color: #2563eb; padding: 50px 30px 40px 30px; text-align: center; position: relative;">
            <![endif]-->
            <!--[if !mso]><!-->
            <td style="background: linear-gradient(135deg, #2563eb 0%, #9333ea 100%); padding: 50px 30px 40px 30px; text-align: center; position: relative;">
            <!--<![endif]-->
              <!-- Decorative Elements -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;">
                <tr>
                  <td style="position: relative; height: 100%;">
                    <!-- Decorative circles -->
                    <div style="position: absolute; top: 20px; right: 30px; width: 80px; height: 80px; background-color: rgba(255, 255, 255, 0.1); border-radius: 50%;"></div>
                    <div style="position: absolute; bottom: 30px; left: 30px; width: 60px; height: 60px; background-color: rgba(255, 255, 255, 0.08); border-radius: 50%;"></div>
                  </td>
                </tr>
              </table>
              
              <!-- Logo -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 25px; position: relative; z-index: 1;">
                <tr>
                  <td align="center">
                    <img src="${logoUrl}" alt="Société des Boissons du Maroc" class="logo-img" width="180" height="auto" style="max-width: 180px; height: auto; display: block; margin: 0 auto; border: 0; outline: none; filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));" />
                  </td>
                </tr>
              </table>
              
              <!-- Branding Text -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 20px; position: relative; z-index: 1;">
                <tr>
                  <td align="center">
                    <p style="margin: 0; color: rgba(255, 255, 255, 0.9); font-size: 14px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase;">
                      <span style="color: #ffffff;">Enquête</span> <span style="color: rgba(255, 255, 255, 0.95);">IT</span>
                    </p>
                  </td>
                </tr>
              </table>
              
              <!-- Success Icon (Checkmark) - Enhanced with purple accent -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="position: relative; z-index: 1;">
                <tr>
                  <td align="center" style="padding-bottom: 20px;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                      <tr>
                        <td style="width: 90px; height: 90px; background-color: rgba(255, 255, 255, 0.25); border: 4px solid rgba(255, 255, 255, 0.6); border-radius: 50%; text-align: center; vertical-align: middle;">
                          <span style="color: #ffffff; font-size: 42px; font-weight: bold; text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);">✓</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              
              <h1 style="margin: 0; color: #ffffff; font-size: 36px; font-weight: 700; letter-spacing: -0.5px; text-shadow: 0 2px 8px rgba(0, 0, 0, 0.15); position: relative; z-index: 1;">
                Merci pour votre participation !
              </h1>
              <p style="margin: 18px 0 0 0; color: rgba(255, 255, 255, 0.95); font-size: 17px; font-weight: 400; position: relative; z-index: 1;">
                Votre avis compte pour nous
              </p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 50px 40px;">
              <!-- Greeting -->
              <p style="margin: 0 0 25px 0; color: #1f2937; font-size: 18px; line-height: 1.7; font-weight: 500;">
                Bonjour,
              </p>
              <p style="margin: 0 0 35px 0; color: #4b5563; font-size: 16px; line-height: 1.8;">
                Nous vous remercions de votre intérêt pour notre enquête de satisfaction. 
                Pour accéder au formulaire, veuillez utiliser le code de vérification ci-dessous :
              </p>
              
              <!-- Success Box with Enhanced Design -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 30px 0;">
                <tr>
                  <!--[if mso]>
                  <td style="background-color: #F3E8FF; border-left: 6px solid #9333ea; padding: 28px; border-radius: 0;">
                  <![endif]-->
                  <!--[if !mso]><!-->
                  <td style="background: linear-gradient(135deg, rgba(243, 232, 255, 0.9) 0%, rgba(224, 242, 254, 0.7) 100%); border-left: 6px solid #9333ea; padding: 28px; border-radius: 16px; box-shadow: 0 4px 12px rgba(147, 51, 234, 0.15);">
                  <!--<![endif]-->
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td style="padding: 0;">
                          <p style="margin: 0 0 10px 0; color: #9333ea; font-size: 17px; font-weight: 700; line-height: 1.5;">
                            ✓ Votre code de vérification
                          </p>
                          <p style="margin: 0; color: #6b21a8; font-size: 15px; line-height: 1.7;">
                            Utilisez ce code pour accéder à l'enquête de satisfaction et partager votre avis précieux.
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              
              <!-- Code Box with Enhanced Design Matching Website -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 35px 0;">
                <tr>
                  <td align="center" style="padding: 25px 0;">
                    <!--[if mso]>
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #F3E8FF; border: 4px solid #9333ea; padding: 50px 40px;">
                    <![endif]-->
                    <!--[if !mso]><!-->
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background: linear-gradient(135deg, rgba(243, 232, 255, 0.6) 0%, rgba(224, 242, 254, 0.6) 100%); border: 4px solid #9333ea; border-radius: 24px; padding: 50px 40px; box-shadow: 0 10px 30px rgba(147, 51, 234, 0.2);">
                    <!--<![endif]-->
                      <tr>
                        <td align="center" style="padding: 0;">
                          <!-- Code Display -->
                          <p style="margin: 0; font-size: 56px; font-weight: 700; letter-spacing: 16px; color: #2563eb; font-family: 'Courier New', monospace; text-align: center; line-height: 1.2; text-shadow: 0 2px 4px rgba(37, 99, 235, 0.15);">
                            ${code}
                          </p>
                          <p style="margin: 20px 0 0 0; color: #9333ea; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 2px;">
                            Code à 6 chiffres
                          </p>
                          <!-- Decorative elements -->
                          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-top: 20px;">
                            <tr>
                              <td align="center">
                                <span style="display: inline-block; width: 40px; height: 3px; background: linear-gradient(90deg, #2563eb 0%, #9333ea 100%); border-radius: 2px; margin: 0 5px;"></span>
                                <span style="display: inline-block; width: 60px; height: 3px; background: linear-gradient(90deg, #9333ea 0%, #2563eb 100%); border-radius: 2px; margin: 0 5px;"></span>
                                <span style="display: inline-block; width: 40px; height: 3px; background: linear-gradient(90deg, #2563eb 0%, #9333ea 100%); border-radius: 2px; margin: 0 5px;"></span>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              
              <!-- Information Card with Enhanced Design -->
              <!--[if mso]>
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-top: 40px; background-color: #F3E8FF; border: 2px solid #9333ea; padding: 32px; border-left: 5px solid #2563eb;">
              <![endif]-->
              <!--[if !mso]><!-->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-top: 40px; background: linear-gradient(135deg, rgba(243, 232, 255, 0.4) 0%, rgba(224, 242, 254, 0.4) 100%); border-radius: 18px; border: 2px solid rgba(147, 51, 234, 0.25); padding: 32px; border-left: 5px solid #2563eb; box-shadow: 0 4px 16px rgba(37, 99, 235, 0.1);">
              <!--<![endif]-->
                <tr>
                  <td style="padding: 0;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td style="padding-bottom: 20px;">
                          <p style="margin: 0; color: #2563eb; font-size: 16px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">
                            📋 Informations importantes
                          </p>
                        </td>
                      </tr>
                    </table>
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                  <tr>
                    <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                        <tr>
                          <td style="width: 140px; color: #6b7280; font-size: 14px; font-weight: 500;">Code valable :</td>
                          <td style="color: #1f2937; font-size: 14px; font-weight: 600;">5 minutes</td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                        <tr>
                          <td style="width: 140px; color: #6b7280; font-size: 14px; font-weight: 500;">Date d'envoi :</td>
                          <td style="color: #1f2937; font-size: 14px; font-weight: 600;">${new Date().toLocaleDateString('fr-FR', { 
                            day: 'numeric', 
                            month: 'long', 
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}</td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 12px 0;">
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                        <tr>
                          <td style="width: 140px; color: #6b7280; font-size: 14px; font-weight: 500;">Tentatives :</td>
                          <td style="color: #1f2937; font-size: 14px; font-weight: 600;">3 maximum</td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
                  </td>
                </tr>
              </table>
              
              <!-- Next Steps -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-top: 40px; padding-top: 35px; border-top: 2px solid #e5e7eb;">
                <tr>
                  <td style="padding-bottom: 18px;">
                    <p style="margin: 0; color: #9333ea; font-size: 17px; font-weight: 700; letter-spacing: 0.5px;">
                      🎯 Prochaines étapes
                    </p>
                  </td>
                </tr>
                <tr>
                  <td>
                    <p style="margin: 0 0 18px 0; color: #4b5563; font-size: 15px; line-height: 1.8;">
                      Retournez sur la page de l'enquête et entrez le code ci-dessus pour accéder au formulaire. 
                      Votre feedback est essentiel et nous aide à améliorer continuellement nos services.
                    </p>
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: rgba(147, 51, 234, 0.05); padding: 15px; border-radius: 10px; border-left: 3px solid #9333ea;">
                      <tr>
                        <td>
                          <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.7;">
                            <strong style="color: #9333ea;">Note de sécurité :</strong> Si vous n'avez pas demandé ce code, vous pouvez ignorer cet email en toute sécurité.
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%); padding: 40px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <!-- Company Info -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td align="center" style="padding-bottom: 20px;">
                    <img src="${logoUrl}" alt="SBM" width="120" height="auto" style="max-width: 120px; height: auto; display: block; margin: 0 auto; opacity: 0.8; border: 0; outline: none;" />
                  </td>
                </tr>
                <tr>
                  <td align="center">
                    <p style="margin: 0 0 8px 0; color: #374151; font-size: 17px; font-weight: 700; line-height: 1.6;">
                      Société des Boissons du Maroc
                    </p>
                    <p style="margin: 0; color: #6b7280; font-size: 15px; line-height: 1.6; font-weight: 500;">
                      <span style="color: #2563eb;">Enquête</span> <span style="color: #9333ea;">IT</span>
                    </p>
                  </td>
                </tr>
              </table>
              
              <!-- Disclaimer -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-top: 30px; padding-top: 30px; border-top: 1px solid #e5e7eb;">
                <tr>
                  <td align="center">
                    <p style="margin: 0 0 10px 0; color: #9ca3af; font-size: 12px; line-height: 1.6;">
                      Cet email a été envoyé automatiquement. Veuillez ne pas y répondre.
                    </p>
                    <p style="margin: 0; color: #9ca3af; font-size: 12px; line-height: 1.6;">
                      Si vous avez des questions, contactez votre administrateur IT.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
        
        <!-- Spacer -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
          <tr>
            <td style="padding: 30px 0; text-align: center;">
              <p style="margin: 0; color: rgba(255, 255, 255, 0.8); font-size: 12px; font-weight: 500;">
                © ${new Date().getFullYear()} Société des Boissons du Maroc. Tous droits réservés.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
  <!--[if mso]>
  </table>
  <![endif]-->
</body>
</html>
  `.trim();

  const text = `
Code de Vérification - Enquête de Satisfaction

Bonjour,

Vous avez demandé un code de vérification pour accéder à l'enquête de satisfaction.
Utilisez le code ci-dessous pour continuer :

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ${code}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⏱️ Important : Ce code est valable pendant 5 minutes seulement.
Si vous n'avez pas demandé ce code, vous pouvez ignorer cet email en toute sécurité.

📝 Comment utiliser ce code :
1. Retournez sur la page de l'enquête
2. Entrez le code ci-dessus dans le champ prévu
3. Cliquez sur "Vérifier le code"

---
Société des Boissons du Maroc
Enquête de Satisfaction IT
Cet email a été envoyé automatiquement. Veuillez ne pas y répondre.
Si vous avez des questions, contactez votre administrateur IT.

© ${new Date().getFullYear()} Société des Boissons du Maroc. Tous droits réservés.
  `.trim();

  return { html, text };
}

export function getConfirmationEmailTemplate(nom: string, prenom: string, baseUrl?: string): { html: string; text: string } {
  const fullName = `${prenom} ${nom}`;
  // Use baseUrl if provided, otherwise use a placeholder that will be replaced with the actual domain
  const logoUrl = baseUrl 
    ? `${baseUrl}/societe-des-boissons-du-maroc--600-removebg-preview.png`
    : 'https://your-domain.com/societe-des-boissons-du-maroc--600-removebg-preview.png';
  
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
    .logo-img { width: 180px !important; height: auto !important; }
  </style>
  <![endif]-->
</head>
<body style="margin: 0; padding: 0; background: linear-gradient(216deg, rgba(224, 242, 254, 1) 16%, rgba(186, 230, 253, 1) 82%, rgba(125, 211, 252, 1) 100%); font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background: linear-gradient(216deg, rgba(224, 242, 254, 1) 16%, rgba(186, 230, 253, 1) 82%, rgba(125, 211, 252, 1) 100%);">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <!-- Main Container -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15); overflow: hidden;">
          
          <!-- Header with Logo and Gradient -->
          <tr>
            <td style="background: linear-gradient(135deg, #0EA5E9 0%, #8B5CF6 100%); padding: 50px 30px 40px 30px; text-align: center; position: relative; overflow: hidden;">
              <!-- Decorative circles with quiz theme colors -->
              <div style="position: absolute; top: -50px; right: -50px; width: 200px; height: 200px; background: rgba(139, 92, 246, 0.15); border-radius: 50%;"></div>
              <div style="position: absolute; bottom: -30px; left: -30px; width: 150px; height: 150px; background: rgba(14, 165, 233, 0.15); border-radius: 50%;"></div>
              <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 100px; height: 100px; background: rgba(255, 255, 255, 0.1); border-radius: 50%;"></div>
              
              <!-- Logo -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 25px;">
                <tr>
                  <td align="center">
                    <img src="${logoUrl}" alt="Société des Boissons du Maroc" class="logo-img" width="180" height="auto" style="max-width: 180px; height: auto; display: block; margin: 0 auto; filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2)); border: 0; outline: none;" />
                  </td>
                </tr>
              </table>
              
              <!-- Success Icon -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td align="center" style="padding-bottom: 20px;">
                    <div style="width: 80px; height: 80px; background: rgba(255, 255, 255, 0.2); border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; backdrop-filter: blur(10px); border: 3px solid rgba(255, 255, 255, 0.3);">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </div>
                  </td>
                </tr>
              </table>
              
              <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 700; letter-spacing: -0.5px; text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); position: relative; z-index: 1;">
                Merci pour votre participation !
              </h1>
              <p style="margin: 15px 0 0 0; color: rgba(255, 255, 255, 0.95); font-size: 16px; font-weight: 400; position: relative; z-index: 1;">
                Votre avis compte pour nous
              </p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 50px 40px;">
              <!-- Greeting -->
              <p style="margin: 0 0 25px 0; color: #1f2937; font-size: 18px; line-height: 1.7; font-weight: 500;">
                Bonjour <strong style="background: linear-gradient(135deg, #0EA5E9 0%, #8B5CF6 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">${fullName}</strong>,
              </p>
              <p style="margin: 0 0 35px 0; color: #4b5563; font-size: 16px; line-height: 1.8;">
                Nous vous remercions sincèrement d'avoir pris le temps de participer à notre enquête de satisfaction. 
                Votre feedback est essentiel et nous aide à améliorer continuellement nos services et à mieux répondre à vos besoins.
              </p>
              
              <!-- Success Box with Quiz Theme Design -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 30px 0;">
                <tr>
                  <td style="background: linear-gradient(135deg, rgba(209, 250, 229, 0.8) 0%, rgba(167, 243, 208, 0.8) 100%); border-left: 5px solid #10B981; padding: 25px; border-radius: 16px; box-shadow: 0 6px 20px rgba(16, 185, 129, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.5); position: relative; overflow: hidden;">
                    <!-- Subtle pattern overlay -->
                    <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; opacity: 0.05; background-image: repeating-linear-gradient(45deg, transparent, transparent 10px, #10B981 10px, #10B981 20px);"></div>
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td style="padding: 0; position: relative; z-index: 1;">
                          <p style="margin: 0 0 8px 0; color: #065f46; font-size: 16px; font-weight: 700; line-height: 1.5;">
                            ✓ Votre réponse a été enregistrée avec succès
                          </p>
                          <p style="margin: 0; color: #047857; font-size: 14px; line-height: 1.6;">
                            Vos réponses ont été sauvegardées et seront analysées par notre équipe dans les plus brefs délais.
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              
              <!-- Information Card with Quiz Theme -->
              <div style="margin-top: 40px; padding: 30px; background: linear-gradient(135deg, rgba(224, 242, 254, 0.3) 0%, rgba(243, 232, 255, 0.3) 100%); border-radius: 16px; border: 2px solid rgba(14, 165, 233, 0.2); box-shadow: 0 4px 16px rgba(14, 165, 233, 0.1); position: relative; overflow: hidden;">
                <!-- Decorative accent -->
                <div style="position: absolute; top: 0; left: 0; width: 4px; height: 100%; background: linear-gradient(180deg, #0EA5E9 0%, #8B5CF6 100%);"></div>
                <p style="margin: 0 0 20px 0; color: #0EA5E9; font-size: 15px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; position: relative; z-index: 1;">
                  📋 Informations enregistrées
                </p>
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                  <tr>
                    <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                        <tr>
                          <td style="width: 120px; color: #6b7280; font-size: 14px; font-weight: 500;">Nom :</td>
                          <td style="color: #1f2937; font-size: 14px; font-weight: 600;">${nom}</td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                        <tr>
                          <td style="width: 120px; color: #6b7280; font-size: 14px; font-weight: 500;">Prénom :</td>
                          <td style="color: #1f2937; font-size: 14px; font-weight: 600;">${prenom}</td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 12px 0;">
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                        <tr>
                          <td style="width: 120px; color: #6b7280; font-size: 14px; font-weight: 500;">Date :</td>
                          <td style="color: #1f2937; font-size: 14px; font-weight: 600;">${new Date().toLocaleDateString('fr-FR', { 
                            day: 'numeric', 
                            month: 'long', 
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}</td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </div>
              
              <!-- Next Steps -->
              <div style="margin-top: 40px; padding-top: 35px; border-top: 2px solid #e5e7eb;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                  <tr>
                    <td style="padding-bottom: 15px;">
                      <p style="margin: 0; color: #374151; font-size: 16px; font-weight: 600; letter-spacing: 0.3px;">
                        🎯 Prochaines étapes
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <p style="margin: 0; color: #6b7280; font-size: 15px; line-height: 1.8;">
                        Votre feedback sera analysé par notre équipe et pris en compte pour améliorer nos services. 
                        Nous apprécions votre contribution et nous vous remercions encore une fois pour votre participation.
                      </p>
                    </td>
                  </tr>
                </table>
              </div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%); padding: 40px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <!-- Company Info -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td align="center" style="padding-bottom: 20px;">
                    <img src="${logoUrl}" alt="SBM" width="120" height="auto" style="max-width: 120px; height: auto; display: block; margin: 0 auto; opacity: 0.8; border: 0; outline: none;" />
                  </td>
                </tr>
                <tr>
                  <td align="center">
                    <p style="margin: 0 0 8px 0; color: #374151; font-size: 17px; font-weight: 700; line-height: 1.6;">
                      Société des Boissons du Maroc
                    </p>
                    <p style="margin: 0; color: #6b7280; font-size: 15px; line-height: 1.6; font-weight: 500;">
                      <span style="color: #2563eb;">Enquête</span> <span style="color: #9333ea;">IT</span>
                    </p>
                  </td>
                </tr>
              </table>
              
              <!-- Disclaimer -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-top: 30px; padding-top: 30px; border-top: 1px solid #e5e7eb;">
                <tr>
                  <td align="center">
                    <p style="margin: 0 0 10px 0; color: #9ca3af; font-size: 12px; line-height: 1.6;">
                      Cet email a été envoyé automatiquement. Veuillez ne pas y répondre.
                    </p>
                    <p style="margin: 0; color: #9ca3af; font-size: 12px; line-height: 1.6;">
                      Si vous avez des questions, contactez votre administrateur IT.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
        
        <!-- Spacer -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
          <tr>
            <td style="padding: 30px 0; text-align: center;">
              <p style="margin: 0; color: rgba(255, 255, 255, 0.8); font-size: 12px; font-weight: 500;">
                © ${new Date().getFullYear()} Société des Boissons du Maroc. Tous droits réservés.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
  <!--[if mso]>
  </table>
  <![endif]-->
</body>
</html>
  `.trim();

  const text = `
Confirmation de Soumission - Enquête de Satisfaction

Bonjour ${fullName},

Nous vous remercions sincèrement d'avoir pris le temps de participer à notre enquête de satisfaction. 
Votre feedback est essentiel et nous aide à améliorer continuellement nos services et à mieux répondre à vos besoins.

✓ Votre réponse a été enregistrée avec succès
Vos réponses ont été sauvegardées et seront analysées par notre équipe dans les plus brefs délais.

📋 Informations enregistrées :
- Nom : ${nom}
- Prénom : ${prenom}
- Date de soumission : ${new Date().toLocaleDateString('fr-FR', { 
  day: 'numeric', 
  month: 'long', 
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit'
})}

🎯 Prochaines étapes :
Votre feedback sera analysé par notre équipe et pris en compte pour améliorer nos services. 
Nous apprécions votre contribution et nous vous remercions encore une fois pour votre participation.

---
Société des Boissons du Maroc
Enquête de Satisfaction IT
Cet email a été envoyé automatiquement. Veuillez ne pas y répondre.
Si vous avez des questions, contactez votre administrateur IT.

© ${new Date().getFullYear()} Société des Boissons du Maroc. Tous droits réservés.
  `.trim();

  return { html, text };
}


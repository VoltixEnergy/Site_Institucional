const nodemailer = require("nodemailer")

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

const codeUserEmailBody = `
  <!DOCTYPE html>
  <html lang="pt-br" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">

  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Seu código de confirmação — Voltix</title>
    <!--[if mso]>
    <noscript>
      <xml>
        <o:OfficeDocumentSettings>
          <o:PixelsPerInch>96</o:PixelsPerInch>
        </o:OfficeDocumentSettings>
      </xml>
    </noscript>
    <![endif]-->
    <!--[if !mso]><!-->
    <link href="https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600;700&display=swap" rel="stylesheet" type="text/css">
    <!--<![endif]-->
    <style>
      /* Reset básico para clientes de e-mail */
      body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
      table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
      img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
      body { margin: 0; padding: 0; width: 100% !important; height: 100% !important; }

      /* Paleta Voltix */
      body, .bg-body {
        background-color: #020617; /* --slate-950 */
      }

      .font-barlow {
        font-family: 'Barlow', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      }
      .font-mono {
        font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace;
      }

      a { color: #fb923c; } /* --orange-400 */

      @media only screen and (max-width: 600px) {
        .container { width: 100% !important; }
        .hero-title { font-size: 24px !important; line-height: 32px !important; }
        .card-pad { padding: 28px 20px !important; }
        .code-digit { width: 38px !important; height: 48px !important; font-size: 22px !important; }
      }
    </style>
  </head>

  <body class="bg-body" style="margin:0; padding:0; background-color:#020617;">
    <!-- Preheader -->
    <div style="display:none; max-height:0; overflow:hidden; mso-hide:all; font-size:1px; line-height:1px; color:#020617;">
      Seu código de confirmação é {{confirmation_code}}. Ele expira em {{expires_in}} minutos.
    </div>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#020617;">
      <tr>
        <td align="center" style="padding: 40px 16px;">

          <table role="presentation" class="container" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px; max-width:600px;">

            <!-- Logo -->
            <tr>
              <td align="center" style="padding-bottom: 32px;">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td valign="middle" style="padding-right:10px;">
                      <img src="https://res.cloudinary.com/dhanssgkj/image/upload/v1790210550/Logo.png" alt="Voltix" width="32" style="display:block; width:32px; height:auto;">
                    </td>
                    <td valign="middle">
                      <span class="font-barlow" style="font-size:22px; font-weight:600; color:#f8fafc; letter-spacing:0.5px;">Voltix</span>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Card principal -->
            <tr>
              <td style="background-color:#1e293b; border-radius:16px; border:1px solid #334155;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">

                  <!-- Faixa de destaque no topo -->
                  <tr>
                    <td style="border-radius:16px 16px 0 0; overflow:hidden; height:6px; line-height:6px; font-size:0;">
                      <div style="height:6px; background-color:#f97316; background-image:linear-gradient(90deg,#1e293b,#f97316,#ea580c);">&nbsp;</div>
                    </td>
                  </tr>

                  <tr>
                    <td class="card-pad" style="padding: 44px 44px 32px 44px;" align="center">

                      <!-- Ícone de segurança -->
                      <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                        <tr>
                          <td align="center" style="width:64px; height:64px; border-radius:14px; background-color:#ea580c;">
                            <div style="font-family: Arial, sans-serif; font-size:26px; line-height:64px; color:#ffffff;">&#128274;</div>
                          </td>
                        </tr>
                      </table>

                      <h1 class="font-barlow hero-title" style="margin: 24px 0 12px 0; font-size:26px; line-height:34px; font-weight:700; color:#f8fafc; text-align:center;">
                        Seu código de confirmação
                      </h1>

                      <p class="font-barlow" style="margin:0; font-size:15px; line-height:24px; color:#cbd5e1; text-align:center; max-width:440px;">
                        {{message}}
                      </p>
                    </td>
                  </tr>

                  <!-- Código de 6 dígitos -->
                  <tr>
                    <td style="padding: 8px 44px 8px 44px;" align="center">
                      <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="background-color:#0f172a; border:1px solid #334155; border-radius:12px;">
                        <tr>
                          <td align="center" style="padding: 26px 20px;">
                            <!--[if mso]>
                            <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
                            <td style="width:46px; height:56px; background-color:#1e293b; border:1px solid #f97316; border-radius:8px; text-align:center; font-family:'SFMono-Regular',Consolas,monospace; font-size:26px; font-weight:700; color:#f8fafc;">{{digit_1}}</td>
                            <td style="width:8px;">&nbsp;</td>
                            <td style="width:46px; height:56px; background-color:#1e293b; border:1px solid #f97316; border-radius:8px; text-align:center; font-family:'SFMono-Regular',Consolas,monospace; font-size:26px; font-weight:700; color:#f8fafc;">{{digit_2}}</td>
                            <td style="width:8px;">&nbsp;</td>
                            <td style="width:46px; height:56px; background-color:#1e293b; border:1px solid #f97316; border-radius:8px; text-align:center; font-family:'SFMono-Regular',Consolas,monospace; font-size:26px; font-weight:700; color:#f8fafc;">{{digit_3}}</td>
                            <td style="width:8px;">&nbsp;</td>
                            <td style="width:46px; height:56px; background-color:#1e293b; border:1px solid #f97316; border-radius:8px; text-align:center; font-family:'SFMono-Regular',Consolas,monospace; font-size:26px; font-weight:700; color:#f8fafc;">{{digit_4}}</td>
                            <td style="width:8px;">&nbsp;</td>
                            <td style="width:46px; height:56px; background-color:#1e293b; border:1px solid #f97316; border-radius:8px; text-align:center; font-family:'SFMono-Regular',Consolas,monospace; font-size:26px; font-weight:700; color:#f8fafc;">{{digit_5}}</td>
                            <td style="width:8px;">&nbsp;</td>
                            <td style="width:46px; height:56px; background-color:#1e293b; border:1px solid #f97316; border-radius:8px; text-align:center; font-family:'SFMono-Regular',Consolas,monospace; font-size:26px; font-weight:700; color:#f8fafc;">{{digit_6}}</td>
                            </tr></table>
                            <![endif]-->
                            <!--[if !mso]><!-->
                            <div style="mso-hide:all;">
                              <span class="code-digit" style="display:inline-block; width:46px; height:56px; line-height:56px; margin:0 4px; background-color:#1e293b; border:1px solid #f97316; border-radius:8px; text-align:center; font-family:'SFMono-Regular',Consolas,monospace; font-size:26px; font-weight:700; color:#f8fafc;">{{digit_1}}</span><span class="code-digit" style="display:inline-block; width:46px; height:56px; line-height:56px; margin:0 4px; background-color:#1e293b; border:1px solid #f97316; border-radius:8px; text-align:center; font-family:'SFMono-Regular',Consolas,monospace; font-size:26px; font-weight:700; color:#f8fafc;">{{digit_2}}</span><span class="code-digit" style="display:inline-block; width:46px; height:56px; line-height:56px; margin:0 4px; background-color:#1e293b; border:1px solid #f97316; border-radius:8px; text-align:center; font-family:'SFMono-Regular',Consolas,monospace; font-size:26px; font-weight:700; color:#f8fafc;">{{digit_3}}</span><span class="code-digit" style="display:inline-block; width:46px; height:56px; line-height:56px; margin:0 4px; background-color:#1e293b; border:1px solid #f97316; border-radius:8px; text-align:center; font-family:'SFMono-Regular',Consolas,monospace; font-size:26px; font-weight:700; color:#f8fafc;">{{digit_4}}</span><span class="code-digit" style="display:inline-block; width:46px; height:56px; line-height:56px; margin:0 4px; background-color:#1e293b; border:1px solid #f97316; border-radius:8px; text-align:center; font-family:'SFMono-Regular',Consolas,monospace; font-size:26px; font-weight:700; color:#f8fafc;">{{digit_5}}</span><span class="code-digit" style="display:inline-block; width:46px; height:56px; line-height:56px; margin:0 4px; background-color:#1e293b; border:1px solid #f97316; border-radius:8px; text-align:center; font-family:'SFMono-Regular',Consolas,monospace; font-size:26px; font-weight:700; color:#f8fafc;">{{digit_6}}</span>
                            </div>
                            <!--<![endif]-->
                          </td>
                        </tr>
                      </table>

                      <p class="font-barlow" style="margin:16px 0 0 0; font-size:13px; line-height:20px; color:#64748b; text-align:center;">
                        Este código expira em <strong style="color:#fdba74;">{{expires_in}}</strong> minutos.
                      </p>
                    </td>
                  </tr>

                  <!-- Aviso de segurança -->
                  <tr>
                    <td style="padding: 24px 44px 8px 44px;">
                      <p class="font-barlow" style="margin:0; font-size:13px; line-height:21px; color:#64748b; text-align:center;">
                        Por segurança, nunca compartilhe este código com outras pessoas.
                        A equipe da Voltix jamais solicitará seu código por telefone, chat ou e-mail.
                      </p>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding: 32px 44px 40px 44px;">
                      <hr style="border:none; border-top:1px solid #334155; margin:0 0 24px 0;">
                      <p class="font-barlow" style="margin:0; font-size:13px; line-height:20px; color:#64748b; text-align:center;">
                        Se você não solicitou este código, pode ignorar este e-mail com segurança.
                      </p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>

            <!-- Assinatura / rodapé -->
            <tr>
              <td align="center" style="padding: 32px 20px 0 20px;">
                <p class="font-barlow" style="margin:0 0 16px 0; font-size:13px; color:#64748b;">
                  Atenciosamente, <span style="color:#94a3b8;">Equipe Voltix</span>
                </p>

                <p class="font-barlow" style="margin:0; font-size:11px; color:#334155;">
                  © {{year}} Voltix. Todos os direitos reservados.
                </p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>

  </html>
`

const sendVerificationCode = async (email, code, companyName, role) => {
  const now = new Date()
  const expiresIn = 15
  
  const roleHash = {
    0: "Novo parceiro",
    1: "Gestor TI",
    2: "Analista NOC",
  }

  try {
    let bodyFormatted = codeUserEmailBody
        .replaceAll("{{confirmation_code}}", code)
        .replaceAll("{{message}}", `Olá. Seja bem-vindo a Voltix! Utilize o código abaixo para criar sua conta atrelada à empresa <strong style="color:#93c5fd;">${companyName}</strong> com cargo de <strong style="color:#93c5fd;">${roleHash[role]}</strong>.`)
        .replaceAll("{{expires_in}}", expiresIn)
        .replaceAll("{{year}}", now.getFullYear())

    for (let i = 0; i < 6; i++)
      bodyFormatted = bodyFormatted.replaceAll(`{{digit_${i+1}}}`, code[i])

      const infoEmail = await transporter.sendMail({
        from: '"Voltix" <' + process.env.SMTP_USER +'>',
        to: email,
        subject: "Seu código de verificação - Voltix",
        html: bodyFormatted
      });

      return infoEmail;
  } catch (e) {
    console.error(e)
    responseBody.message = "Algo deu errado. Tente novamente mais tarde"
    res.status(500).json(responseBody)
  }
  
};

module.exports = {
  sendVerificationCode
}

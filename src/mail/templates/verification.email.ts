export const verificationEmailTemplate = (otp: string): string => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verification OTP</title>
        <style>
          /* Reset styles for email clients */
          body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
          table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
          img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
          table { border-collapse: collapse !important; }
          body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; }
          /* Black and white theme specific overrides */
          a[x-apple-data-detectors] { color: inherit !important; text-decoration: none !important; font-size: inherit !important; font-family: inherit !important; font-weight: inherit !important; line-height: inherit !important; }
        </style>
      </head>
      <body style="margin: 0; padding: 0; background-color: #ffffff; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #000000;">
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff;">
          <tr>
            <td align="center" style="padding: 40px 20px;">
              <table role="presentation" width="600" border="0" cellspacing="0" cellpadding="0" style="border: 2px solid #000000; background-color: #ffffff;">
                <tr>
                  <td style="padding: 40px;">
                    <h1 style="margin: 0 0 20px; font-size: 24px; font-weight: bold; text-align: center; color: #000000; text-transform: uppercase; letter-spacing: 2px;">
                      Verification Code
                    </h1>
                    <p style="margin: 0 0 30px; font-size: 16px; line-height: 24px; text-align: center; color: #000000;">
                      Please use the following 6-digit code to verify your account.
                    </p>
                    <div style="text-align: center; margin-bottom: 30px;">
                      <div style="display: inline-block; padding: 15px 30px; border: 2px solid #000000; background-color: #ffffff;">
                        <span style="font-size: 36px; font-weight: 900; letter-spacing: 8px; color: #000000;">
                          ${otp}
                        </span>
                      </div>
                    </div>
                    <p style="margin: 0; font-size: 12px; text-align: center; color: #555555;">
                      If you didn't request this code, please disregard this email.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
};

export const verificationSuccessTemplate = (name: string): string => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Verified</title>
        <style>
          body, table, td, a {
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
          }

          table, td {
            mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;
          }

          img {
            -ms-interpolation-mode: bicubic;
            border: 0;
            height: auto;
            line-height: 100%;
            outline: none;
            text-decoration: none;
          }

          table {
            border-collapse: collapse !important;
          }

          body {
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            height: 100% !important;
            background-color: #ffffff;
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            color: #000000;
          }
        </style>
      </head>

      <body>
        <table
          role="presentation"
          width="100%"
          border="0"
          cellspacing="0"
          cellpadding="0"
          style="background-color: #ffffff;"
        >
          <tr>
            <td align="center" style="padding: 40px 20px;">
              <table
                role="presentation"
                width="600"
                border="0"
                cellspacing="0"
                cellpadding="0"
                style="border: 2px solid #000000; background-color: #ffffff;"
              >
                <tr>
                  <td style="padding: 40px; text-align: center;">
                    
                    <h1
                      style="
                        margin: 0 0 20px;
                        font-size: 28px;
                        font-weight: 900;
                        text-transform: uppercase;
                        letter-spacing: 2px;
                        color: #000000;
                      "
                    >
                      Email Verified
                    </h1>

                    <p
                      style="
                        margin: 0 0 20px;
                        font-size: 16px;
                        line-height: 26px;
                        color: #000000;
                      "
                    >
                      Hello ${name},
                    </p>

                    <p
                      style="
                        margin: 0 0 30px;
                        font-size: 16px;
                        line-height: 26px;
                        color: #000000;
                      "
                    >
                      Your email address has been successfully verified.
                      Your account is now active and ready to use.
                    </p>

                    <div style="margin-bottom: 30px;">
                      <span
                        style="
                          display: inline-block;
                          padding: 14px 28px;
                          border: 2px solid #000000;
                          font-size: 14px;
                          font-weight: bold;
                          text-transform: uppercase;
                          letter-spacing: 1px;
                        "
                      >
                        Verification Successful
                      </span>
                    </div>

                    <p
                      style="
                        margin: 0;
                        font-size: 12px;
                        color: #555555;
                        line-height: 20px;
                      "
                    >
                      If you did not perform this action, please contact support immediately.
                    </p>

                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
};

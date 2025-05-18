export const VERIFICATION_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>vérifier votre E-mail</title>
</head>

<body
    style="margin:0; padding:0; background-color:#121212; color:#d5d5d5; line-height:1.6; font-family:Arial, sans-serif;">
    <div
        style="width:75%; max-width:800px; margin:2rem auto; background-color:#212529; text-align:center; padding:0 24px; box-sizing:border-box;">

        <div style="margin-top:2rem;">
            <h1 style="font-size:2.5rem; font-weight:300; margin:1rem 0 2rem;">
                vérifier votre E-mail
            </h1>
        </div>

        <div
            style="background-color:#000000; padding:24px; border-radius:0.5rem; box-sizing:border-box; margin-bottom:2rem;">
            <p style="margin:0 0 1rem 0;">Bonjour,</p>
            <p style="margin:0 0 1rem 0;">
                Merci de vous être inscrit(e) ! Votre code de vérification est :
            </p>

            <div style="margin:1.5rem 0; text-align:center;">
                <hr style="width:50%; margin:0 auto 1rem; border:none; border-top:1px solid #444;" />
                <span style="display:block; font-size:2.5rem; font-weight:700; color:#ffc107; margin:0.5rem 0;">
                    {verificationCode}
                </span>
                <hr style="width:50%; margin:1rem auto 0; border:none; border-top:1px solid #444;" />
            </div>

            <p style="margin:0 0 1rem 0;">
                Veuillez entrer ce code sur la page de vérification pour finaliser votre inscription.
            </p>
            <p style="margin:0 0 1rem 0;">
                Ce code expirera dans 15 minutes pour des raisons de sécurité.
            </p>
            <p style="margin:0 0 1rem 0;">
                Si vous n’avez pas créé de compte chez nous, veuillez ignorer cet e-mail.
            </p>
            <p style="margin:0;">
                Cordialement,<br />L’équipe E-ghazala
            </p>
        </div>

        <div style="font-size:0.8em; color:#6c757d; padding:1rem 0;">
            <p style="margin:0;">
                Ceci est un message automatique, merci de ne pas répondre à cet e-mail.
            </p>
        </div>
    </div>
</body>
</html>
`;

export const PASSWORD_RESET_SUCCESS_TEMPLATE = `
<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Réinitialisation du mot de passe réussie</title>
</head>

<body
    style="margin:0; padding:0; background-color:#121212; color:#d5d5d5; line-height:1.6; font-family:Arial, sans-serif;">
    <div
        style="width:75%; max-width:800px; margin:2rem auto; background-color:#212529; text-align:center; padding:0 24px; box-sizing:border-box;">

        <!-- Header / Title -->
        <div style="margin-top:2rem;">
            <h1 style="font-size:2.5rem; font-weight:300; margin:1rem 0 2rem; color:#ffffff;">
                Réinitialisation réussie
            </h1>
        </div>

        <!-- Content Box -->
        <div
            style="background-color:#000000; padding:24px; border-radius:0.5rem; box-sizing:border-box; margin-bottom:2rem;">

            <p style="margin:0 0 1rem 0;">Bonjour,</p>
            <p style="margin:0 0 1rem 0;">
                Nous confirmons que votre mot de passe a été réinitialisé avec succès.
            </p>

            <!-- Check Icon -->
            <div style="text-align:center; margin:1.5rem 0;">
                <div style="
             background-color:#28a745;
             color:white;
             width:60px;
             height:60px;
             line-height:60px;
             border-radius:50%;
             display:inline-block;
             font-size:2rem;
             ">
                    ✓
                </div>
            </div>

            <p style="margin:0;">
                Si vous n’êtes pas à l’origine de cette réinitialisation, veuillez contacter notre équipe d’assistance
                immédiatement.
            </p>
            <p style="margin:0 0 1rem 0;">
                contact@laghazala.tn
            </p>
            <p>
                Pour des raisons de sécurité, nous vous recommandons de :
            </p>

            <!-- Recommendations List -->
            <div style="text-align:left; display:inline-block; margin-bottom:1rem;">
                <ul style="padding-left:1.2em; margin:0;">
                    <li style="margin-bottom:0.5rem;">Utiliser un mot de passe fort et unique</li>
                    <li style="margin-bottom:0.5rem;">Éviter d’utiliser le même mot de passe sur plusieurs sites</li>
                </ul>
            </div>

            <p style="margin:0 0 1rem 0;">
                Merci de nous aider à sécuriser votre compte.
            </p>
            <p style="margin:0;">
                Cordialement,<br />L’équipe E-ghazala
            </p>
        </div>

        <!-- Footer Note -->
        <div style="font-size:0.8em; color:#6c757d; padding:1rem 0;">
            <p style="margin:0;">
                Ceci est un message automatique, merci de ne pas répondre à cet e-mail.
            </p>
        </div>
    </div>
</body>
</html>
`;

export const PASSWORD_RESET_REQUEST_TEMPLATE = `
<!DOCTYPE html>
<html lang="fr">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Réinitialisation du mot de passe</title>
</head>

<body style="margin:0; padding:0; background-color:#121212; color:#d5d5d5; line-height:1.6; font-family:Arial, sans-serif;">
  <div style="width:75%; max-width:800px; margin:2rem auto; background-color:#212529; text-align:center; padding:0 24px; box-sizing:border-box;">

    <!-- En-tête -->
    <div style="margin-top:2rem; padding:1.5rem 0; background:linear-gradient(to right,rgb(226, 178, 36), #ffc107);">
      <h1 style="color:#000; font-size:2.5rem; margin:0;">Réinitialisation du mot de passe</h1>
    </div>

    <!-- Contenu -->
    <div style="background-color:#000000; padding:24px; border-radius:0 0 0.5rem 0.5rem; box-sizing:border-box; margin-bottom:2rem;">
      <p style="margin:0 0 1rem;">Bonjour,</p>
      <p style="margin:0 0 1rem;">
        Nous avons reçu une demande pour réinitialiser votre mot de passe. Si vous n’êtes pas à l’origine de cette demande, ignorez simplement cet e-mail.
      </p>
      <p style="margin:0 0 1rem;">Pour réinitialiser votre mot de passe, cliquez sur le bouton ci-dessous :</p>

      <div style="text-align:center; margin:1.5rem 0;">
        <a
          href="{resetURL}"
          style="
            display:inline-block;
            background-color:#ffc107;
            color:#000;
            padding:12px 24px;
            text-decoration:none;
            border-radius:0.5rem;
            font-weight:bold;
          "
        >Réinitialiser le mot de passe</a>
      </div>

      <p style="margin:0 0 1rem;">
        Ce lien expirera dans 1 heure pour des raisons de sécurité.
      </p>
      <p style="margin:0;">
        Cordialement,<br/>L’équipe E-ghazala
      </p>
    </div>

    <!-- Pied de page -->
    <div style="font-size:0.8em; color:#6c757d; padding:1rem 0;">
      <p style="margin:0;">
        Ceci est un message automatique, merci de ne pas répondre à cet e-mail.
      </p>
    </div>
  </div>
</body>

</html>
`;

export const WELCOME_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="fr">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Bienvenue chez E-ghazala</title>
</head>

<body style="margin:0; padding:0; background-color:#121212; color:#d5d5d5; line-height:1.6; font-family:Arial, sans-serif;">
  <div style="width:75%; max-width:800px; margin:2rem auto; background-color:#212529; text-align:center; padding:24px; border-radius:0.5rem;">

    <h1 style="font-size:2rem; font-weight:300; margin-bottom:1rem; color:#ffffff;">
      Bienvenue, {name} !
    </h1>
    <p style="margin:0 0 1rem;">
      Nous sommes ravis de vous compter parmi nous chez E-ghazala.
    </p>
    <p style="margin:0;">
      Explorez nos cours et commencez votre apprentissage dès aujourd’hui !
    </p>

    <div style="font-size:0.8em; color:#6c757d; margin-top:2rem;">
      <p style="margin:0;">
        Ceci est un message automatique, merci de ne pas répondre à cet e-mail.
      </p>
    </div>
  </div>
</body>

</html>
`;

export const SUCCESS_ENROLLMENT_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="fr">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Inscription au cours</title>
</head>

<body style="margin:0; padding:0; background-color:#121212; color:#d5d5d5; line-height:1.6; font-family:Arial, sans-serif;">
  <div style="width:75%; max-width:800px; margin:2rem auto; background-color:#212529; text-align:center; padding:24px; border-radius:0.5rem;">

    <h1 style="font-size:2rem; font-weight:300; margin-bottom:1rem; color:#ffffff;">
      Bonjour {name},
    </h1>
    <p style="margin:0 0 1rem;">
      Votre inscription au cours « {courseTitle} » a été <strong style="color:#28a745;">{status}</strong>.
    </p>
    <p style="margin:0;">
      Merci de votre confiance et bon apprentissage !
    </p>

    <div style="font-size:0.8em; color:#6c757d; margin-top:2rem;">
      <p style="margin:0;">
        Ceci est un message automatique, merci de ne pas répondre à cet e-mail.
      </p>
    </div>
  </div>
</body>

</html>
`;


export const courseEnrollmentEmail = (courseName, name) => {
  const frontendURL =
    process.env.FRONTEND_URL ||
    "https://study-notion-mern-stack.netlify.app";

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Course Enrollment Confirmation</title>

  <style>
    body {
      background-color: #ffffff;
      font-family: Arial, sans-serif;
      font-size: 16px;
      line-height: 1.5;
      color: #333;
      margin: 0;
      padding: 0;
    }

    .container {
      max-width: 600px;
      margin: auto;
      padding: 24px;
      text-align: center;
    }

    .logo {
      max-width: 160px;
      margin-bottom: 20px;
    }

    .message {
      font-size: 20px;
      font-weight: bold;
      margin-bottom: 16px;
    }

    .body {
      font-size: 16px;
      margin-bottom: 20px;
    }

    .cta {
      display: inline-block;
      padding: 12px 20px;
      background-color: #ffd60a;
      color: #000;
      text-decoration: none;
      border-radius: 6px;
      font-weight: bold;
      margin-top: 10px;
    }

    .support {
      font-size: 13px;
      color: #777;
      margin-top: 25px;
    }

    .highlight {
      font-weight: bold;
    }
  </style>
</head>

<body>
  <div class="container">

    <img class="logo" src="https://i.ibb.co/7Xyj3PC/logo.png" alt="Logo" />

    <div class="message">Enrollment Successful 🎉</div>

    <div class="body">
      <p>Hi ${name || "Student"},</p>

      <p>
        You’ve successfully enrolled in
        <span class="highlight">"${courseName}"</span>.
      </p>

      <p>
        You can now access your course materials and start learning immediately.
      </p>

      <a class="cta" href="${frontendURL}/my-learning">
        Go to Dashboard
      </a>
    </div>

    <div class="support">
      If you need help, contact us at
      <a href="mailto:support@example.com">support@example.com</a>
    </div>

  </div>
</body>
</html>`;
};

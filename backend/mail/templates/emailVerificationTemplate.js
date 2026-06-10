

const otpTemplate = (otp, name) => {
	return `<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<title>OTP Verification Email</title>
	<style>
		body {
			background-color: #ffffff;
			font-family: Arial, sans-serif;
			font-size: 16px;
			line-height: 1.4;
			color: #333333;
			margin: 0;
			padding: 0;
		}

		.container {
			max-width: 600px;
			margin: 0 auto;
			padding: 20px;
			text-align: center;
		}

		.logo {
			max-width: 200px;
			margin-bottom: 20px;
		}

		.message {
			font-size: 18px;
			font-weight: bold;
			margin-bottom: 20px;
		}

		.body {
			font-size: 16px;
			margin-bottom: 20px;
		}

		.highlight {
			font-weight: bold;
			font-size: 22px;
		}

		.support {
			font-size: 14px;
			color: #999999;
			margin-top: 20px;
		}
	</style>
</head>

<body>
	<div class="container">

		<a href="https://study-notion-mern-stack.netlify.app">
			<img class="logo" src="https://i.ibb.co/7Xyj3PC/logo.png" />
		</a>

		<div class="message">OTP Verification Email</div>

		<div class="body">
			<p>Dear ${name},</p>

			<p>
				Thank you for registering with StudyNotion.
				Use the OTP below to verify your account:
			</p>

			<h2 class="highlight">${otp}</h2>

			<p>This OTP is valid for 3 minutes.</p>
		</div>

		<div class="support">
			If you didn’t request this, ignore this email.
		</div>

	</div>
</body>
</html>`;
};


export default otpTemplate;
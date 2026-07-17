const passwordUpdated = (email, name) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>EduFlex Password Updated</title>

<style>
body{
  margin:0;
  padding:0;
  background:#f4f7fb;
  font-family:Arial,sans-serif;
  color:#333;
}

.container{
  max-width:600px;
  margin:40px auto;
  background:#fff;
  border-radius:12px;
  padding:40px;
  box-shadow:0 5px 15px rgba(0,0,0,.08);
}

.logo{
  width:170px;
  margin-bottom:25px;
}

.title{
  font-size:26px;
  font-weight:bold;
  color:#2563eb;
  margin-bottom:20px;
}

.text{
  font-size:16px;
  line-height:1.7;
}

.info{
  margin:20px 0;
  padding:16px;
  background:#eff6ff;
  border-left:4px solid #2563eb;
  border-radius:8px;
}

.footer{
  margin-top:35px;
  font-size:14px;
  color:#666;
  border-top:1px solid #eee;
  padding-top:20px;
  text-align:center;
}
</style>
</head>

<body>

<div class="container">

  <div style="text-align:center">
    <img
      src="https://i.ibb.co/7Xyj3PC/logo.png"
      alt="EduFlex Logo"
      class="logo"
    />
  </div>

  <div class="title">
    Password Updated Successfully
  </div>

  <div class="text">

    <p>Hello <strong>${name}</strong>,</p>

    <p>
      Your EduFlex account password has been updated successfully.
    </p>

    <div class="info">
      <strong>Account:</strong> ${email}
      <br><br>
      <strong>Updated:</strong>
      ${new Date().toLocaleString()}
    </div>

    <p>
      If you made this change, no further action is required.
    </p>

    <p>
      If you did <strong>not</strong> change your password,
      please reset it immediately and contact EduFlex support
      as soon as possible.
    </p>

  </div>

  <div class="footer">
    © ${new Date().getFullYear()} EduFlex. All rights reserved.
  </div>

</div>

</body>
</html>
`;
};

export default passwordUpdated;
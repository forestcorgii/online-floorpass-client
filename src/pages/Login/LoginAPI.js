export function loginToHRMS(username, password) {
  var formdata = new FormData();
  formdata.append("username", username);
  formdata.append("password", password);

  var requestOptions = {
    method: "POST",
    body: formdata,
    redirect: "follow",
  };

  return fetch(
    "http://idcsi-officesuites.com:8080/hrms/sso.php",
    requestOptions
  );
}

export function loginAsGuard(username, password) {
  var formdata = new FormData();
  formdata.append("username", username);
  formdata.append("password", password);

  var requestOptions = {
    method: "POST",
    body: formdata,
    redirect: "follow",
  };

  return fetch(
    `http://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/guardlogin/`,
    requestOptions
  );
}

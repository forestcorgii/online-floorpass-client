export async function GetList(field) {
  var requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  const response = await fetch(
    `http://localhost:8000/list/?type=${field}`,
    requestOptions
  );

  const data = await response.json();
  // console.log(data);
  return data;
}

export async function requestFilter(obj) {
  const response = await fetch(
    "http://127.0.0.1:8000/filter/?username=" +
      obj.username +
      "&department=" +
      (obj.department ? obj.department : "") +
      "&location=" +
      (obj.location ? obj.location : "") +
      "&sort=" +
      (obj.sort ? obj.sort : "-latest_log_date") +
      "&limit=" +
      (obj.limit ? obj.limit : "100")
  );

  return await response.json();
}

export async function FindName(id) {
  var myHeaders = new Headers();
  myHeaders.append("Allow-Control-Allow-Origin", "*");

  var formdata = new FormData();
  formdata.append("what", "getinfo");
  formdata.append("field", "fpass");
  formdata.append("idno", id);
  formdata.append("apitoken", "IUQ0PAI7AI3D162IOKJH");
  formdata.append("search", "");

  var requestOptions = {
    method: "POST",
    body: formdata,
    header: myHeaders,
    redirect: "follow",
  };

  const response = await fetch(
    "http://idcsi-officesuites.com:8080/hrms/api.php",
    requestOptions
  );
  // console.log(await response.json());
  const data = await response.json();
  console.log(data);
  return data;
}

export async function createEmployee(obj) {
  var myHeaders = new Headers();
  myHeaders.append("Accept", "application/json");
  myHeaders.append(
    "Cookie",
    "csrftoken=oHvxdldpJecoiTeDVQzintsLDFHWdVLWCGn7P0CHMEfCksWMgxDEg0rYSEUSbJdH"
  );

  var formdata = new FormData();
  formdata.append("employee_id", obj.id);
  formdata.append("employee_name", obj.name);
  formdata.append("floorpass", obj.refereceID);

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: formdata,
    redirect: "follow",
  };

  const response = await fetch("http://127.0.0.1:8000/user/", requestOptions);
  return await response.json();
}

export async function updateEmployee(obj, method) {
  // console.log(method + JSON.stringify(obj));
  var myHeaders = new Headers();
  myHeaders.append(
    "Cookie",
    "csrftoken=oHvxdldpJecoiTeDVQzintsLDFHWdVLWCGn7P0CHMEfCksWMgxDEg0rYSEUSbJdH"
  );

  var formdata = new FormData();
  if (method === "PUT" || method === "POST") {
    formdata.append("floorpass", obj.floorpass);
    formdata.append("employee_id", obj.employee_id);
    formdata.append("employee_name", obj.employee_name);

    // console.log(formdata)
  }

  var requestOptions = {
    method: method,
    headers: myHeaders,
    body: formdata,
    redirect: "follow",
  };

  var url =
    "http://127.0.0.1:8000/user" + (method === "POST" ? "/" : `/${obj.id}/`);

  // console.log(url)

  const response = await fetch(url, requestOptions).catch((error) =>
    console.log("error", error)
  );

  // const data = await response.json();
  // console.log(data);
  // return data;
}

export async function createLog(obj) {
  var formdata = new FormData();
  formdata.append("guard_id", obj.id);
  formdata.append("location", obj.location);
  formdata.append("floorpass", obj.floorpass_id);

  console.log(obj);
  var requestOptions = {
    method: "POST",
    body: formdata,
    redirect: "follow",
  };

  const response = await fetch(
    "http://localhost:8000/log/",
    requestOptions
  ).catch((error) => alert("error", error));

  const data = await response.json();
  console.log(data);
  return data;
}

export async function createID(obj) {
  var myHeaders = new Headers();
  myHeaders.append("Accept", "application/json");
  myHeaders.append(
    "Cookie",
    "csrftoken=oHvxdldpJecoiTeDVQzintsLDFHWdVLWCGn7P0CHMEfCksWMgxDEg0rYSEUSbJdH"
  );

  var formdata = new FormData();
  formdata.append("department", obj.department);
  formdata.append("location", obj.location);
  formdata.append("purpose", obj.purpose);
  formdata.append("supervisor_id", obj.supervisorId);
  formdata.append("supervisor_name", obj.supervisorName);

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: formdata,
    redirect: "follow",
  };

  const response = await fetch(
    "http://127.0.0.1:8000/floorpass/",
    requestOptions
  ).catch((error) => console.log("error", error));
  return await response.json();
}

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

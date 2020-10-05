export async function GetList(field) {
  var requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  const response = await fetch(
    `http://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/list/?type=${field}`,
    requestOptions
  );

  const data = await response.json();
  // console.log(data);
  return data;
}

export async function requestFilter(obj) {
  const response = await fetch(
    `http://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/filter/?username=` +
    obj.username +
    "&type=" +
    (obj.type ? obj.type : "") +
    "&department=" +
    (obj.department ? obj.department : "") +
    "&location=" +
    (obj.location ? obj.location : "") +
    "&sort=" +
    (obj.sort ? obj.sort : "-latest_log_date") +
    "&limit=" +
    (obj.limit ? obj.limit : "100") +
    "&page=" +
    (obj.limit ? obj.page : "1")
  ).then((res) => { if (res.status === 200) { return res.json(); } alert(res.status) });

  return await response;
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

  const response = await fetch(
    `http://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/user/`,
    requestOptions
  );
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
    `http://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/user` +
    (method === "POST" ? "/" : `/${obj.id}/`);

  // console.log(url)

  await fetch(url, requestOptions).catch((error) =>
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
  formdata.append("employee_id", obj.employee_id);

  console.log(obj);
  var requestOptions = {
    method: "POST",
    body: formdata,
    redirect: "follow",
  };

  const response = await fetch(
    `http://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/log/`,
    requestOptions
  ).catch((error) => alert("error", error));

  const data = await response.json();
  console.log(data);
  return data;
}

export async function findLog(id, location) {

  var requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };

  return await fetch(`http://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/findlog?id=${id}&location=${location}`, requestOptions)
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

  let employees = "";
  obj.employees.forEach((e) => {
    if (e.employee_id && e.employee_id !== "") {
      employees = employees + `${e.employee_id}|${e.employee_name};`;
    }
  });
  console.log(obj);
  formdata.append("employees", employees);
  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: formdata,
    redirect: "follow",
  };

  const floorpassId = obj.floorpass ? obj.floorpass + "/" : "";
  const response = await fetch(
    `http://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/floorpass/${floorpassId}`,
    requestOptions
  ).catch((error) => console.log("error", error));
  return await response.json();
}

export async function checkNewLog(obj) {
  var requestOptions = {
    method: "GET",
    redirect: "follow",
  };
  return await fetch(
    `http://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/check_log/?` +
    "department=" +
    (obj.department ? obj.department : "") +
    "&location=" +
    (obj.location ? obj.location : "") +
    "&latest_log_date=" +
    (obj.logdatetime_str ? obj.logdatetime_str : ""),
    requestOptions
  ).then((response) => {
    return response.json();
  });
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


export function loginAsGuard(username, password) {
  var formdata = new FormData();
  formdata.append("username", username);
  formdata.append("password", password);

  var requestOptions = {
    method: 'POST',
    body: formdata,
    redirect: 'follow'
  };

  return fetch(`http://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/guardlogin/`, requestOptions)
}

export async function getFloorpass(floorpass_id) {
  var requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };

  return fetch(`http://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/floorpass/${floorpass_id}/`, requestOptions)
    .then(response => { if (response.status === 200) { return response.json() } alert(response.status) })

}

export async function getEmployeeReport(obj) {
  var requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };

  return fetch(`http://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/report/?id=${obj.employee_id}&datefrom=${obj.datefrom}`, requestOptions)
    .then(response => { if (response.status === 200) { return response.json() } alert(response.status) })

}
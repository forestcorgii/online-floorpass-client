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
  const type = obj.type ? obj.type : "";
  const department = obj.department ? obj.department : "";
  const location = obj.location ? obj.location : "";
  const sort = obj.sort ? obj.sort : "-latest_log_date";
  const limit = obj.limit ? obj.limit : "100";
  const page = obj.page ? obj.page : "1";

  const response = await fetch(
    `http://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/filter/?
      username=${obj.username}
      &type=${type}
      &department=${department}
      &location=${location}
      &sort=${sort}
      &limit=${limit}
      &page=${page}`
  ).then((res) => {
    if (res.status === 200) {
      return res.json();
    }
    alert(res.status);
  });

  return await response;
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

export async function getFloorpass(floorpass_id) {
  var requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  return fetch(
    `http://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/floorpass/${floorpass_id}/`,
    requestOptions
  ).then((response) => {
    if (response.status === 200) {
      return response.json();
    }
    alert(response.status);
  });
}

export async function getEmployeeReport(obj) {
  var requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  return fetch(
    `http://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/report/?id=${obj.employee_id}&datefrom=${obj.datefrom}`,
    requestOptions
  ).then((response) => {
    if (response.status === 200) {
      return response.json();
    }
    alert(response.status);
  });
}

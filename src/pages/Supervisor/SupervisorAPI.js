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

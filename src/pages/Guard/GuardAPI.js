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
    method: "GET",
    redirect: "follow",
  };

  return await fetch(
    `http://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/findlog?id=${id}&location=${location}`,
    requestOptions
  );
}

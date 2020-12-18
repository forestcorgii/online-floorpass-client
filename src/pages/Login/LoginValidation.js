import * as Yup from "yup";

const basic = Yup.string().required("This is a required field.");

function Schema() {
  return Yup.object().shape({
    username: basic,
    password: basic,
    location: basic,
  });
}

export default { Schema };

import * as Yup from "yup";

export const id = Yup.string()
  .required("ID is a required field.")
  .length(4, "ID must be 4 characters only")
  .when("name", {
    is: (name) => {
      return !name || name === "";
    },
    then: Yup.string().max(3, "this is an unknown ID."),
  });

export const basic = Yup.string().required("This is a required field.");

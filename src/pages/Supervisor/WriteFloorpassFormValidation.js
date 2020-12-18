import * as Yup from "yup";

export default function Schema() {
  Yup.object().shape({
    location: Yup.string().required(),
    department: Yup.string().required(),
    purpose: Yup.string().required(),
    employees: Yup.array()
      .min(1, "There should be atleast one Employee registered")
      .of(
        Yup.object().shape({
          employee_id: Yup.string()
            .length(4, "ID must have 4 characters only")
            .when("employee_name", {
              is: (employee_name) => {
                return !employee_name || employee_name === "";
              },
              then: Yup.string().max(3, "Unknown ID"),
            }),
        })
      )
      .test(
        "double-checking",
        "There should be atleast one Employee registered",
        (values) => {
          return !(
            values.length === 1 &&
            (values[0].employee_name === "" ||
              values[0].employee_name === undefined)
          );
        }
      )
      .test("duplicate-checking", "Duplicate Employee found", (values) => {
        const arr = [];
        let isUnique = true;
        values.forEach((val) => {
          if (val.employee_id !== "" && val.employee_id !== undefined) {
            if (arr.filter((id) => id === val.employee_id).length >= 1) {
              isUnique = false;
            } else {
              arr.push(val.employee_id);
            }
          }
        });
        return isUnique;
      }),
  });
}

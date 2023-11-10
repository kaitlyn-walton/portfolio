import * as Yup from "yup";

const gradeFormSchema = Yup.object().shape({
  grades: Yup.array()
    .of(
      Yup.object().shape({
        foulId: Yup.number().notRequired(),
        gradeTypeId: Yup.number().required("Must select a grade."),
        comment: Yup.string().max(1000).notRequired(),
      })
    )
    .required(),
});

export default gradeFormSchema;

import React, { useState, useEffect } from "react";
import { Field, FieldArray, Form, Formik, ErrorMessage } from "formik";
import { Table, Button } from "react-bootstrap";
import debug from "sabio-debug";
import toastr from "toastr";
import gradeFormSchema from "schemas/gradeFormSchema";
import gradeService from "services/gradeService";
import "./grade.css";

const Grades = () => {
  const [gradeData, setGradeData] = useState({
    grade: [],
    mappedGrades: [],
  });
  const data = { foulId: 8, gradeTypeId: Number, comment: "" };
  const initialGradeData = {
    grades: [data],
  };
  const _logger = debug.extend("Grades");

  const handleSubmit = (values) => {
    _logger(values);

    gradeService
      .addGrade(values.grades)
      .then(onAddGradeSuccess)
      .catch(onAddGradeError);
  };

  const onAddGradeSuccess = (response) => {
    _logger(response.data.item);
    toastr.success("Grades were successfully added.");
  };
  const onAddGradeError = (error) => {
    _logger(error);
    toastr.error("Unable to add grades.");
  };
  useEffect(() => {
    _logger("useEffect firing.");

    let isReplay = "all";
    gradeService
      .lookUpGradeTypes(isReplay)
      .then(onGetGradesSuccess)
      .catch(onGetGradeError);
  }, []);

  const onGetGradesSuccess = (response) => {
    _logger(response.data.items);
    let newGradeData = response.data.items;

    setGradeData((prevState) => {
      const gd = { ...prevState };
      gd.grade = newGradeData;
      gd.mappedGrades = newGradeData.map(mapGrades);
      _logger(gd);
      return gd;
    });
  };

  const onGetGradeError = (error) => {
    _logger(error);
  };

  const mapGrades = (type) => {
    return (
      <option key={type.id} value={type.id}>
        {type.code}
      </option>
    );
  };

  return (
    <Formik
      initialValues={initialGradeData}
      enableReinitialize={true}
      validationSchema={gradeFormSchema}
      onSubmit={handleSubmit}
    >
      {({ values }) => (
        <Form className="position-absolute top-50 start-50 translate-middle">
          <FieldArray
            name="grades"
            render={(arrayHelpers) => (
              <div>
                <Table className="table-bordered border-dark align-middle text-center">
                  <thead>
                    <tr className="grades-header-row">
                      <th className="grades-dropdown-column">Grade</th>
                      <th>Comment</th>
                      <th className="add-remove-submit-column"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {values.grades && values.grades.length > 0 ? (
                      values.grades.map((item, index) => (
                        <tr
                          className="align-middle grades-input-row"
                          key={index}
                        >
                          <td>
                            <Field
                              component="select"
                              value={item.gradeTypeId}
                              className="form-select"
                              name={`grades[${index}].gradeTypeId`}
                            >
                              <option value={0}> Select Grade</option>
                              {gradeData.mappedGrades}
                            </Field>
                            <ErrorMessage
                              name={`grades[${index}].gradeTypeId`}
                              component="td"
                            />
                          </td>
                          <td className="overflow-auto">
                            <Field
                              type="text"
                              component="input"
                              value={item.comment}
                              className="form-control"
                              name={`grades.${index}.comment`}
                              autoComplete="off"
                            />
                            <ErrorMessage
                              name={`grades.${index}.comment`}
                              component="td"
                            />
                          </td>
                          <td>
                            <div>
                              <Button
                                type="button"
                                className="btn btn-info btn-sm"
                                onClick={() => {
                                  _logger("add row");
                                  arrayHelpers.push(data);
                                }}
                              >
                                +
                              </Button>
                              <Button
                                type="button"
                                className="btn btn-danger btn-sm"
                                onClick={() => {
                                  _logger("remove row");
                                  arrayHelpers.remove(index);
                                }}
                              >
                                -
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr className="border border-0">
                        <td> {""} </td>
                        <td> {""} </td>
                        <td>
                          <div>
                            <Button
                              type="button"
                              className="btn btn-info"
                              onClick={() => arrayHelpers.push(data)}
                            >
                              Add
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            )}
          />
          <div className="d-flex justify-content-end">
            <Button
              type="submit"
              className="btn btn-info add-remove-submit-column"
            >
              Submit
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default Grades;

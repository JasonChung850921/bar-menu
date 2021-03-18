import React, { useState } from "react";
import { Formik, Form as FormikForm, Field } from "formik";
import { Grid, Segment, Button, Header, Form } from "semantic-ui-react";
import DateFnsUtils from "@date-io/date-fns"; // choose your lib
import { DateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import locale from "date-fns/locale/zh-TW";
import * as Yup from "yup";

const Reservation = () => {
  const [radio, setRadio] = useState("sm");
  const [startDate, setStartDate] = useState(new Date());
  const handleChangeRadio = (_, { value }) => setRadio(value);

  const schema = Yup.object().shape({
    name: Yup.string().required("...請輸入"),
    numCustomers: Yup.number().required("...請輸入"),
  });

  return (
    <Formik
      initialValues={{
        name: "",
        numCustomers: "",
      }}
      validationSchema={schema}
      onSubmit={(values, { setSubmitting }) => {
        setSubmitting(false);
        console.log(values, startDate, radio);
      }}
    >
      {({ isSubmitting, getFieldProps, handleSubmit, errors, touched }) => {
        return (
          <Grid textAlign="center" verticalAlign="middle" className="app">
            <Grid.Column style={{ maxWidth: 450 }}>
              <Header as="h1" icon color="teal" textAlign="center">
                訂位
              </Header>
              <Form as={FormikForm} onSubmit={handleSubmit} size="large">
                <Segment>
                  <Field
                    {...getFieldProps("name")}
                    error={
                      errors.name &&
                      touched.name && {
                        content: errors.name,
                        pointing: "above",
                      }
                    }
                    as={Form.Input}
                    fluid
                    name="name"
                    icon="user"
                    iconPosition="left"
                    placeholder="訂位姓名"
                    type="text"
                  />
                  <Field
                    {...getFieldProps("numCustomers")}
                    error={
                      errors.numCustomers &&
                      touched.numCustomers && {
                        content: errors.numCustomers,
                        pointing: "above",
                      }
                    }
                    as={Form.Input}
                    fluid
                    type="number"
                    name="numCustomers"
                    icon="users"
                    iconPosition="left"
                    placeholder="訂位人數"
                  />
                  <MuiPickersUtilsProvider utils={DateFnsUtils} locale={locale}>
                    <Field
                      style={{ width: "100%" }}
                      {...getFieldProps("date")}
                      label="訂位日期"
                      as={DateTimePicker}
                      name="date"
                      value={startDate}
                      onChange={setStartDate}
                      disablePast
                      minutesStep={5}
                    />
                  </MuiPickersUtilsProvider>
                  <Form.Group
                    className="mt-3"
                    style={{ display: "flex", justifyContent: "space-evenly" }}
                  >
                    <label>桌型: </label>
                    <Field
                      as={Form.Radio}
                      name="table"
                      label="大"
                      value="lg"
                      checked={radio === "lg"}
                      onChange={handleChangeRadio}
                    />
                    <Field
                      as={Form.Radio}
                      name="table"
                      label="小"
                      value="sm"
                      checked={radio === "sm"}
                      onChange={handleChangeRadio}
                    />
                  </Form.Group>
                  <Button
                    disabled={isSubmitting}
                    className={isSubmitting ? "loading mt-3" : "mt-3"}
                    type="submit"
                    color="teal"
                    fluid
                    size="large"
                  >
                    送出
                  </Button>
                </Segment>
              </Form>
            </Grid.Column>
          </Grid>
        );
      }}
    </Formik>
  );
};

export default Reservation;
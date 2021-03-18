import React, { useState } from "react";
import { Formik, Form as FormikForm, Field } from "formik";
import { Grid, Segment, Button, Header, Form } from "semantic-ui-react";
import * as Yup from "yup";
import DateFnsUtils from "@date-io/date-fns"; // choose your lib
import { DateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import locale from "date-fns/locale/zh-TW";

const Reservation = () => {
  const registrationSchema = Yup.object().shape({
    username: Yup.string().required("Please provide your username."),
    email: Yup.string()
      .email("Invalid email address")
      .required("Please provide an email."),
    password: Yup.string()
      .required("Please provide a password.")
      .min(5, "Password is too short - should be 5 chars minimum."),
  });
  const [radio, setRadio] = useState("sm");
  const [startDate, setStartDate] = useState(new Date());
  const handleChangeRadio = (_, { value }) => setRadio(value);

  return (
    <Formik
      initialValues={{
        username: "",
        email: "",
        password: "",
        confirmation: "",
      }}
      validationSchema={registrationSchema}
      onSubmit={(values, { setSubmitting }) => {
        setSubmitting(true);
        console.log(values);
      }}
    >
      {({
        isSubmitting,
        isValid,
        dirty,
        errors,
        touched,
        getFieldProps,
        handleSubmit,
      }) => {
        return (
          <Grid textAlign="center" verticalAlign="middle" className="app">
            <Grid.Column style={{ maxWidth: 450 }}>
              <Header as="h1" icon color="teal" textAlign="center">
                訂位
              </Header>
              <Form as={FormikForm} onSubmit={handleSubmit} size="large">
                <Segment>
                  <Field
                    {...getFieldProps("username")}
                    error={
                      errors.username &&
                      touched.username && {
                        content: errors.username,
                        pointing: "above",
                      }
                    }
                    as={Form.Input}
                    fluid
                    name="username"
                    icon="user"
                    iconPosition="left"
                    placeholder="訂位姓名"
                    type="text"
                  />
                  <Field
                    {...getFieldProps("email")}
                    error={
                      errors.email &&
                      touched.email && {
                        content: errors.email,
                        pointing: "above",
                      }
                    }
                    as={Form.Input}
                    fluid
                    name="email"
                    icon="users"
                    iconPosition="left"
                    placeholder="訂位人數"
                    type="email"
                  />
                  <MuiPickersUtilsProvider utils={DateFnsUtils} locale={locale}>
                    <Field
                      style={{ width: "100%" }}
                      {...getFieldProps("email")}
                      error={
                        errors.email &&
                        touched.email && {
                          content: errors.email,
                          pointing: "above",
                        }
                      }
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
                    <Form.Radio
                      label="大"
                      value="lg"
                      checked={radio === "lg"}
                      onChange={handleChangeRadio}
                    />
                    <Form.Radio
                      label="小"
                      value="sm"
                      checked={radio === "sm"}
                      onChange={handleChangeRadio}
                    />
                  </Form.Group>
                  <Button
                    disabled={isSubmitting || !(isValid && dirty)}
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

import React, { useState } from "react";
import { Formik, Form as FormikForm, Field } from "formik";
import format from "date-fns/format";
import {
  Grid,
  Segment,
  Button,
  Header,
  Form,
  Card,
  Modal,
  Icon,
} from "semantic-ui-react";
import DateFnsUtils from "@date-io/date-fns"; // choose your lib
import { DateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import locale from "date-fns/locale/zh-TW";
import * as Yup from "yup";
import apis from "../api/apis";

const Reservation = () => {
  const [radio, setRadio] = useState("sm");
  const [startDate, setStartDate] = useState(new Date());
  const handleChangeRadio = (_, { value }) => setRadio(value);
  const [confirmationCard, setConfirmationCard] = useState([]);
  const [modal, setModal] = useState(false);
  const [toBeDeleted, setToBeDeleted] = useState({});
  const schema = Yup.object().shape({
    name: Yup.string().required("...請輸入"),
    numCustomers: Yup.number().required("...請輸入"),
  });

  const addConfirmation = (data) => {
    return (
      <Card
        key={data.customer_name + data.number_of_customers}
        onClick={() => {
          setModal(true);
          setToBeDeleted(data);
        }}
      >
        <Card.Content>
          <Card.Header content={data.customer_name} />
          <Card.Meta content={data.number_of_customers + "人"} />
          <Card.Description
            content={`時間: ${format(startDate, "yyyy-MM-dd HH:mm")}, 桌型: ${
              radio === "sm" ? "小桌" : "大桌"
            }`}
          />
        </Card.Content>
      </Card>
    );
  };

  const deleteSelectedConfirmation = () => {
    const { customer_name, number_of_customers } = toBeDeleted;
    confirmationCard &&
      setConfirmationCard((prevState) => {
        const state = [...prevState];
        return state.filter((state) => {
          return state.key !== customer_name + number_of_customers;
        });
      });
    setModal(false);
  };

  return (
    <Formik
      initialValues={{
        name: "",
        numCustomers: "",
      }}
      validationSchema={schema}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        setSubmitting(false);
        resetForm();
        const data = {
          number_of_customers: values.numCustomers,
          customer_name: values.name,
          reservation_time: startDate,
          table_type: radio,
        };
        setConfirmationCard((prevState) => [
          ...prevState,
          addConfirmation(data),
        ]);
        apis.post.reservations(data).then((res) => {
          setModal(false);
        });
      }}
    >
      {({ isSubmitting, getFieldProps, handleSubmit, errors, touched }) => {
        return (
          <Grid textAlign="center" className="app">
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
                    style={{
                      display: "flex",
                      justifyContent: "space-evenly",
                    }}
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
                    color="teal"
                    fluid
                    type="submit"
                    size="large"
                  >
                    送出
                  </Button>
                </Segment>
              </Form>
              <Modal
                basic
                onClose={() => setModal(false)}
                onOpen={() => setModal(true)}
                open={modal}
                size="small"
                centered
              >
                <Modal.Content>
                  <p>確定要完成訂單嗎？</p>
                </Modal.Content>
                <Modal.Actions>
                  <Button
                    basic
                    color="red"
                    inverted
                    onClick={() => setModal(false)}
                  >
                    <Icon name="remove" /> No
                  </Button>
                  <Button
                    color="green"
                    inverted
                    onClick={() => deleteSelectedConfirmation()}
                  >
                    <Icon name="checkmark" /> Yes
                  </Button>
                </Modal.Actions>
              </Modal>
              {confirmationCard && confirmationCard}
            </Grid.Column>
          </Grid>
        );
      }}
    </Formik>
  );
};

export default Reservation;

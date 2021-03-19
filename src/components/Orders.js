import React, { useState, useEffect } from "react";
import apis from "../api/apis";
import format from "date-fns/format";
import { Button, Modal, Grid, Icon, Feed, Segment } from "semantic-ui-react";

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [modal, setModal] = useState(false);
  const [currentOrder, setCurrentOrder] = useState();

  useEffect(() => {
    apis.get.orders().then((res) => {
      setOrders(res.data.filter((order) => !order.completed));
    });
  }, [modal]);

  const getOrderProfit = (order) => {
    return order.order_items.reduce((totalAll, item) => {
      return (totalAll += item.product.price * item.quantity);
    }, 0);
  };

  const completeOrder = () => {
    apis.put.orders({ completed: true }, currentOrder.id).then((_) => {
      setOrders((prevState) => {
        const state = [...prevState];
        const updatedState = state.filter((state) => {
          return state.key === currentOrder.id;
        });
        return updatedState;
      });
    });
    setModal(false);
  };

  return (
    <Grid textAlign="center">
      <Grid.Column style={{ maxWidth: 450 }}>
        {!orders.length && <span>目前沒有...</span>}
        {orders.length > 0 &&
          orders.map((order) => (
            <Segment key={order.id}>
              <Feed>
                <Feed.Event>
                  <Feed.Content>
                    <Feed.Summary>
                      {`桌名：${order.table?.table_name}`}
                      <Feed.Date>{`點餐時間：${format(
                        new Date(order.published_at),
                        "yyyy-MM-dd HH:mm"
                      )}`}</Feed.Date>
                    </Feed.Summary>
                    <Feed.Extra text>
                      {order.order_items.map((item) => (
                        <div key={item.id}>
                          <span>- {item.product?.product_name}</span>
                          {"    "}
                          <span
                            style={{ fontWeight: "bolder" }}
                          >{`${item.quantity}   `}</span>
                          <span>個</span>
                          <div style={{ clear: "both" }} />
                          <br />
                        </div>
                      ))}
                    </Feed.Extra>
                    <Feed.Meta>
                      <Feed.Like
                        style={{
                          fontWeight: "bolder",
                          color: "black",
                          fontSize: 20,
                        }}
                      >
                        <Icon name="dollar" />
                        {getOrderProfit(order)} {"  "}總金額
                      </Feed.Like>
                      <div style={{ display: "inline-block", marginLeft: 120 }}>
                        <Button color="blue" disabled onClick={() => {}}>
                          加點
                        </Button>
                        <Button
                          color="red"
                          onClick={() => {
                            setModal(true);
                            setCurrentOrder(order);
                          }}
                        >
                          付完錢了
                        </Button>
                      </div>
                    </Feed.Meta>
                  </Feed.Content>
                </Feed.Event>
              </Feed>
            </Segment>
          ))}
        <Modal
          basic
          onClose={() => setModal(false)}
          onOpen={() => setModal(true)}
          open={modal}
          size="small"
          centered
        >
          <Modal.Content>
            <p>付錢了嗎？</p>
          </Modal.Content>
          <Modal.Actions>
            <Button basic color="red" inverted onClick={() => setModal(false)}>
              <Icon name="remove" /> No
            </Button>
            <Button
              color="green"
              inverted
              onClick={() => {
                completeOrder();
              }}
            >
              <Icon name="checkmark" /> Yes
            </Button>
          </Modal.Actions>
        </Modal>
      </Grid.Column>
    </Grid>
  );
};

export default Order;

import React, { useState, useEffect } from "react";
import apis from "../api/apis";
import format from "date-fns/format";
import { Button, Modal, Grid, Icon, Feed, Segment } from "semantic-ui-react";

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [modal, setModal] = useState(false);

  useEffect(() => {
    apis.get.orders().then((res) => {
      console.log(res.data);
      setOrders(res.data.filter((order) => !order.completed));
    });
  }, []);

  const getOrderProfit = (order) => {
    return order.order_items.reduce((totalAll, item) => {
      return (totalAll += item.product.price * item.quantity);
    }, 0);
  };

  return (
    <Grid textAlign="center">
      <Grid.Column style={{ maxWidth: 450 }}>
        {orders.map((order) => (
          <Segment>
            <Feed>
              <Feed.Event>
                <Feed.Content>
                  <Feed.Summary>
                    {`桌名：${order.table?.table_name}`}
                    <Feed.Date>{`送出時間：${format(
                      new Date(order.published_at),
                      "yyyy-MM-dd HH:mm"
                    )}`}</Feed.Date>
                  </Feed.Summary>
                  <Feed.Extra text>
                    {order.order_items.map((item) => (
                      <div>
                        <span>{item.product?.product_name}</span>
                        {"    "}
                        <span
                          style={{ fontWeight: "bolder" }}
                        >{`${item.quantity}   `}</span>
                        <span>個</span>
                      </div>
                    ))}
                  </Feed.Extra>
                  <Feed.Meta>
                    <Feed.Like>
                      <Icon name="dollar" />
                      {getOrderProfit(order)} {"  "}總金額
                    </Feed.Like>
                    <Button
                      style={{ marginLeft: 200 }}
                      color="red"
                      onClick={() => {}}
                    >
                      付完錢了
                    </Button>
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
            <p>確定要完成這餐點嗎？</p>
          </Modal.Content>
          <Modal.Actions>
            <Button basic color="red" inverted onClick={() => setModal(false)}>
              <Icon name="remove" /> No
            </Button>
            <Button color="green" inverted onClick={() => {}}>
              <Icon name="checkmark" /> Yes
            </Button>
          </Modal.Actions>
        </Modal>
      </Grid.Column>
    </Grid>
  );
};

export default Order;

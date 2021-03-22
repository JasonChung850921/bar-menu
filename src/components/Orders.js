import React, { useState, useEffect } from "react";
import apis from "../api/apis";
import format from "date-fns/format";
import { Button, Modal, Grid, Icon, Feed, Segment } from "semantic-ui-react";
import _ from "lodash";

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [modal, setModal] = useState(false);
  const [currentOrder, setCurrentOrder] = useState();

  useEffect(() => {
    apis.get.orders({ paid: false }).then((res) => {
      const unpaidOrders = res.data;
      if (unpaidOrders) {
        setOrders((prevState) => [...prevState, ...unpaidOrders]);
      }
    });
  }, []);

  const addToCurrentTable = (orderInfo) => {
    apis.get
      .order_item({ sent_to_order: true, paid: false, added_to_order: false })
      .then((res) => {
        const orderItems = res.data;
        if (!orderItems.length) {
          return;
        }
        const newOrderItems = [];
        orderItems.forEach((orderItem) => {
          if (orderItem.table.table_name === orderInfo.table.table_name) {
            newOrderItems.push(orderItem);
          }
        });

        const oldOrderItems = [...orderInfo.order_items];
        oldOrderItems.forEach((oldItem) => {
          newOrderItems.push(oldItem);
        });
        const order_item_ids = newOrderItems.map((x) => x.id);
        order_item_ids.forEach((itemId) => {
          apis.put.order_item({ added_to_order: true }, itemId).then((res) => {
            // console.log(res.data);
          });
        });
        apis.put
          .orders({ order_items: order_item_ids }, orderInfo.id)
          .then((res) => {
            apis.get.order(res.data.id).then((res) => {
              setOrders((prevState) => {
                const orders = [...prevState];
                const updatedOrders = orders.filter(
                  (order) => order.id !== res.data.id
                );
                updatedOrders.push(res.data);
                return updatedOrders;
              });
            });
          });
      });
  };

  const changeTables = () => {
    apis.get
      .order_item({ sent_to_order: true, paid: false, added_to_order: false })
      .then((res) => {
        const orderItems = res.data;
        const orderItemsObj = orderItems.reduce((obj, item) => {
          if (!obj[item.table.id]) {
            obj[item.table.id] = [item];
          } else {
            obj[item.table.id].push(item);
          }
          return obj;
        }, {});

        const orderByNameAndIds = _.keys(orderItemsObj).map((tableId) => {
          const orderItemIds = orderItemsObj[tableId].reduce((a, c) => {
            a.push(c.id);
            return a;
          }, []);

          return { tableId, order_item_ids: orderItemIds };
        });
        orderByNameAndIds.forEach((item) => {
          const { order_item_ids, tableId } = item;
          const data = {
            completed: true,
            order_items: order_item_ids,
            table: tableId,
          };
          apis.post.orders(data).then((res) => {
            order_item_ids.forEach((order_item_id) => {
              apis.put
                .order_item({ added_to_order: true }, order_item_id)
                .then((res) => {
                  // console.log(res.data);
                });
            });
            apis.get.order(res.data.id).then((res2) => {
              const orders = res2.data;
              setOrders((prevState) => [...prevState, orders]);
            });
          });
        });
      });
  };

  const getOrderProfit = (order) => {
    return order.order_items.reduce((totalAll, item) => {
      return (totalAll += item.product.price * item.quantity);
    }, 0);
  };

  const completeOrder = () => {
    apis.put
      .orders({ paid: true, paid_time: new Date() }, currentOrder.id)
      .then((_) => {
        setOrders((prevState) => {
          const state = [...prevState];
          const updatedState = state.filter((state) => {
            return state.id !== currentOrder.id;
          });
          return updatedState;
        });
      });
    setModal(false);
  };

  const payForIndividualItem = (orderItem, orderId) => {
    const orderItemId = orderItem.id;
    apis.put.order_item({ paid: true }, orderItemId).then((_) => {
      setOrders((prevState) => {
        const state = [...prevState];
        const order = state.filter((orderState) => orderState.id === orderId);
        const filteredOrders = state.filter(
          (orderState) => orderState.id !== orderId
        );

        const filteredOrderItems = order[0].order_items;
        filteredOrderItems.forEach((item) => {
          if (item.id === orderItemId) {
            item.paid = true;
          }
        });
        order[0].order_items = filteredOrderItems;
        return [...order, ...filteredOrders];
      });
    });
  };

  return (
    <Grid textAlign="center">
      <Grid.Column style={{ maxWidth: 450 }}>
        {!orders.length && <span className="mx-2">目前沒有...</span>}
        {
          <Button color="teal" onClick={() => changeTables()}>
            計算桌子點餐數量
          </Button>
        }
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
                        <div
                          style={
                            item.paid ? { textDecoration: "line-through" } : {}
                          }
                          key={item.id}
                        >
                          <span>- {item.product?.product_name}</span>
                          {"    "}
                          <span
                            style={{ fontWeight: "bolder" }}
                          >{`${item.quantity}   `}</span>
                          <span>個</span>
                          {item.paid === false && (
                            <Button
                              className="mx-4"
                              color="teal"
                              onClick={() =>
                                payForIndividualItem(item, order.id)
                              }
                            >{`付：$${item.product.price}`}</Button>
                          )}
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
                      <div style={{ display: "inline-block", marginLeft: 100 }}>
                        <Button
                          color="blue"
                          onClick={() => addToCurrentTable(order)}
                        >
                          加點同桌
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

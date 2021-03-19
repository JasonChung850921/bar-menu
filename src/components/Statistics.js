import React, { useEffect, useState } from "react";
import {
  Statistic,
  Divider,
  Advertisement,
  Container,
} from "semantic-ui-react";
import apis from "../api/apis";

const Statistics = () => {
  const [revenue, setRevenue] = useState(0);

  const getOrderProfit = (order) => {
    return order.order_items.reduce((totalAll, item) => {
      return (totalAll += item.product.price * item.quantity);
    }, 0);
  };

  useEffect(() => {
    apis.get.orders().then((res) => {
      const completedOrderse = res.data.filter((order) => order.completed);
      const totalRev = completedOrderse.reduce((total, order) => {
        return (total += getOrderProfit(order));
      }, 0);
      setRevenue(totalRev);
    });
  }, []);

  return (
    <Container>
      <Advertisement
        style={{ width: 296 }}
        unit="mobile banner"
        test="目前總營業額"
      />
      <Divider />
      <Statistic.Group widths="one" size="large">
        <Statistic>
          <Statistic.Value>${revenue}</Statistic.Value>
          <Statistic.Label>新台幣</Statistic.Label>
        </Statistic>
      </Statistic.Group>
    </Container>
  );
};

export default Statistics;

import React, { useEffect, useState } from "react";
import { Statistic, Divider, Container } from "semantic-ui-react";
import apis from "../api/apis";
import endOfDay from "date-fns/endOfDay";
import startOfDay from "date-fns/startOfDay";

const Statistics = () => {
  const [revenue, setRevenue] = useState(0);
  const [quantitySold, setQuantitySold] = useState([]);

  const getOrderProfit = (order) => {
    return order.order_items.reduce((totalAll, item) => {
      return (totalAll += item.product.price * item.quantity);
    }, 0);
  };

  useEffect(() => {
    apis.get.order_item().then((res) => {
      const items = res.data.map((item) => {
        return {
          name: item.product.product_name,
          quantity: item.quantity,
        };
      });

      const obj = {};
      for (let i = 0; i < items.length; i++) {
        if (!obj[items[i].name]) {
          obj[items[i].name] = items[i].quantity;
        } else {
          obj[items[i].name] = obj[items[i].name] + items[i].quantity;
        }
      }
      const arr = [];
      for (const [key, value] of Object.entries(obj)) {
        arr.push({
          name: key,
          quantity: value,
        });
      }

      setQuantitySold(arr);
    });

    apis.get
      .orders({
        paid_time: {
          $gte: startOfDay(new Date()),
          $lte: endOfDay(new Date()),
        },
      })
      .then((res) => {
        const totalRev = res.data.reduce((total, order) => {
          return (total += getOrderProfit(order));
        }, 0);
        setRevenue(totalRev);
      });
  }, []);

  return (
    <Container>
      <Statistic.Group widths="one" size="large">
        {revenue !== 0 && (
          <Statistic>
            <Statistic.Value>${revenue}</Statistic.Value>
            <Statistic.Label>當日營業額</Statistic.Label>
          </Statistic>
        )}
      </Statistic.Group>
      <Divider />
      <Statistic.Group widths="two" size="small">
        {quantitySold &&
          quantitySold.map((item) => (
            <Statistic key={item.name}>
              <Statistic.Value>{item.quantity}</Statistic.Value>
              <Statistic.Label>{item.name}</Statistic.Label>
            </Statistic>
          ))}
      </Statistic.Group>
    </Container>
  );
};

export default Statistics;

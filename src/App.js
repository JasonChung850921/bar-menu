import React from "react";
import { Tab } from "semantic-ui-react";
import "./App.scss";
import "semantic-ui-css/semantic.min.css";
import Reservation from "./components/Reservation";
import OrderItem from "./components/OrderItem";
import Orders from "./components/Orders";

const panes = [
  {
    menuItem: "訂位",
    render: () => (
      <Tab.Pane className="m-0" style={{ background: "#eee" }} attached={false}>
        <Reservation />
      </Tab.Pane>
    ),
  },
  {
    menuItem: "點餐",
    render: () => (
      <Tab.Pane className="m-0" style={{ background: "#eee" }} attached={false}>
        <OrderItem />
      </Tab.Pane>
    ),
  },
  {
    menuItem: "未結帳餐點",
    render: () => (
      <Tab.Pane className="m-0" style={{ background: "#eee" }} attached={false}>
        <Orders />
      </Tab.Pane>
    ),
  },
  {
    menuItem: "分析",
    render: () => (
      <Tab.Pane className="m-0" style={{ background: "#eee" }} attached={false}>
        開發中...
      </Tab.Pane>
    ),
  },
];
const App = () => {
  return (
    <Tab
      menu={{ color: "teal", inverted: true, attached: true, tabular: false }}
      panes={panes}
    />
  );
};

export default App;

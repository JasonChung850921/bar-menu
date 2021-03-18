import React from "react";
import { Tab } from "semantic-ui-react";
import "./App.scss";
import "semantic-ui-css/semantic.min.css";
import Reservation from "./components/Reservation";

const panes = [
  {
    menuItem: "訂位",
    render: () => (
      <Tab.Pane>
        <Reservation />
      </Tab.Pane>
    ),
  },
  { menuItem: "點餐", render: () => <Tab.Pane>Tab 2 Content</Tab.Pane> },
  { menuItem: "結帳", render: () => <Tab.Pane>Tab 3 Content</Tab.Pane> },
];
const App = () => {
  return <Tab panes={panes} />;
};

export default App;

import React from "react";
import {
  Statistic,
  Divider,
  Advertisement,
  Container,
} from "semantic-ui-react";

const Statistics = () => {
  return (
    <Container>
      <Advertisement
        style={{ width: 296 }}
        unit="mobile banner"
        test="本日營業額"
      />
      <Divider />
      <Statistic.Group widths="one" size="large">
        <Statistic>
          <Statistic.Value>$1400</Statistic.Value>
          <Statistic.Label>新台幣</Statistic.Label>
        </Statistic>
      </Statistic.Group>
    </Container>
  );
};

export default Statistics;

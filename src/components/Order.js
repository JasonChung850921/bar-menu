import React, { useState, useEffect } from "react";
import apis from "../api/apis";
import {
  Button,
  Form,
  Input,
  Radio,
  Select,
  Card,
  Modal,
  Grid,
  Icon,
} from "semantic-ui-react";

const Order = () => {
  const [tables, setTables] = useState([]);
  const [table, setTable] = useState();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState();
  const [selectedCategory, setSelectedCategory] = useState();
  const [quantity, setQuantity] = useState("1");
  const [orderItemCard, setOrderItemCard] = useState([]);
  const [modal, setModal] = useState(false);

  useEffect(() => {
    apis.get.tables().then((res) => {
      setTables(res.data);
      setTable(res.data[0].id);
    });
    apis.get.categories().then((res) => {
      setCategories(
        res.data.map((category) => ({
          key: category.id,
          text: category.name,
          value: category.id,
          products: category.products,
        }))
      );
    });
  }, []);

  const handleSubmit = () => {
    const data = {
      quantity,
      product: [selectedProduct],
    };

    apis.post.order_item(data).then((res) => {
      setOrderItemCard((prevState) => {
        const newOrder = [...prevState, addConfirmation(res.data)];
        return newOrder;
      });
    });
  };

  const handleChange = (_, { value }) => setTable(value);
  const handleProductChange = (productId) => setSelectedProduct(productId);

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    categories.forEach((category) => {
      if (category.key === categoryId) {
        setProducts(
          category.products.map((product) => {
            return {
              key: product.id,
              text: product.product_name,
              value: product.id,
            };
          })
        );
      }
    });
  };

  const getTableName = (tableId) => {
    const table = tables.find((table) => table.id === tableId);
    return table.table_name;
  };

  const addConfirmation = (data) => {
    const {
      id,
      product: { price, product_name },
      quantity,
    } = data;
    return (
      <Card key={id}>
        <Card.Content>
          <Card.Header content={`桌名：${getTableName(table)}`} />
          <Card.Meta content={`數量：${quantity}, 單價：${price}`} />
          <Card.Description content={product_name} />
        </Card.Content>
      </Card>
    );
  };

  const handleSubmitAsOrder = () => {
    const data = {
      order_items: orderItemCard.map((orderItem) => orderItem.key),
      table: [table],
    };
    apis.post.orders(data).then((_) => {
      setModal(false);
      setOrderItemCard([]);
    });
  };

  return (
    <Grid textAlign="center">
      <Grid.Column style={{ maxWidth: 450 }}>
        <Form>
          <Form.Group widths="equal">
            <Form.Group inline>
              <label>桌名: </label>
              {tables &&
                tables.map((tableOption) => (
                  <Form.Field
                    key={tableOption.id}
                    control={Radio}
                    label={tableOption.table_name}
                    value={tableOption.id}
                    checked={table === tableOption.id}
                    onChange={handleChange}
                  />
                ))}
            </Form.Group>
            <Form.Field
              onChange={(_, { value }) => handleCategoryChange(value)}
              control={Select}
              label="想點啥？"
              options={categories}
              placeholder="種類"
            />
            <Form.Field
              onChange={(_, { value }) => handleProductChange(value)}
              control={Select}
              options={products}
              placeholder="選擇餐點種類..."
            />
          </Form.Group>
          <Form.Group widths="equal">
            <Form.Field
              onChange={(_, { value }) => setQuantity(value)}
              control={Input}
              type="number"
              label="數量"
              defaultValue="1"
              placeholder="數量..."
            />
          </Form.Group>
          <Form.Group>
            <Form.Field
              color="teal"
              onClick={handleSubmit}
              disabled={
                selectedCategory === undefined ||
                selectedProduct === undefined ||
                table === undefined ||
                quantity === undefined
              }
              control={Button}
            >
              加入餐點
            </Form.Field>
            <Form.Field
              color="red"
              onClick={() => setModal(true)}
              disabled={
                selectedCategory === undefined ||
                selectedProduct === undefined ||
                table === undefined ||
                quantity === undefined ||
                orderItemCard.length <= 0
              }
              control={Button}
            >
              完成此桌餐點
            </Form.Field>
          </Form.Group>
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
            <p>確定要完成這桌餐點嗎？</p>
          </Modal.Content>
          <Modal.Actions>
            <Button basic color="red" inverted onClick={() => setModal(false)}>
              <Icon name="remove" /> No
            </Button>
            <Button
              color="green"
              inverted
              onClick={() => {
                handleSubmitAsOrder();
              }}
            >
              <Icon name="checkmark" /> Yes
            </Button>
          </Modal.Actions>
        </Modal>
        {orderItemCard && orderItemCard}
      </Grid.Column>
    </Grid>
  );
};

export default Order;

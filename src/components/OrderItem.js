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
  const [selectedProducts, setSelectedProducts] = useState();
  const [selectedCategory, setSelectedCategory] = useState();
  const [quantity, setQuantity] = useState();
  const [orderItemCard, setOrderItemCard] = useState([]);
  const [modal, setModal] = useState(false);
  const [modalData, setModalData] = useState(null);

  useEffect(() => {
    apis.get.order_item({ sent_to_order: false }).then((res) => {
      res.data.forEach((item) => {
        setOrderItemCard((prevState) => [
          ...prevState,
          addConfirmationCard(item),
        ]);
      });
    });
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmitOrderItem = () => {
    const data = {
      quantity: 1,
      product: selectedProducts,
      table: table,
    };
    for (let i = 0; i < quantity; i++) {
      apis.post.order_item(data).then((res) => {
        setOrderItemCard((prevState) => {
          const newOrder = [...prevState, addConfirmationCard(res.data)];
          return newOrder;
        });
      });
    }
  };

  const cancelOrderItem = (orderItemId) => {
    apis.delete.order_item(orderItemId).then((res) => {
      setOrderItemCard((prevState) => {
        const state = [...prevState];
        const filteredState = state.filter((item) => item.key !== res.data.id);
        return filteredState;
      });
    });
  };

  const handleSubmitAsOrder = () => {
    const { id } = modalData;
    apis.put
      .order_item({ sent_to_order: true, paid: false }, id)
      .then((res) => {
        setModal(false);
        setOrderItemCard((prevState) => {
          const state = [...prevState];
          const updatedState = state.filter((item) => item.key !== id);
          return updatedState;
        });
      });
  };

  const handleTableChange = (_, { value }) => setTable(value);
  const handleProductChange = (productId) => setSelectedProducts(productId);

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

  const openModalWithData = (data) => {
    setModal(true);
    setModalData(data);
  };

  const addConfirmationCard = (data) => {
    const {
      id,
      product: { price, product_name },
      quantity,
      table: { table_name },
    } = data;
    return (
      <Card key={id}>
        <Card.Content>
          <Card.Header content={`桌名：${table_name}`} />
          <Card.Meta content={`數量：${quantity}, 單價：${price}`} />
          <Card.Description content={product_name} />
          <Card.Content extra>
            <div className="ui two buttons">
              <Button color="teal" onClick={() => openModalWithData(data)}>
                完成餐點
              </Button>
              <Button onClick={() => cancelOrderItem(id)} color="red">
                取消
              </Button>
            </div>
          </Card.Content>
        </Card.Content>
      </Card>
    );
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
                    onChange={handleTableChange}
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
              placeholder="數量..."
            />
          </Form.Group>
          <Form.Group>
            <Form.Field
              color="teal"
              onClick={handleSubmitOrderItem}
              disabled={
                selectedCategory === undefined ||
                selectedProducts === undefined ||
                table === undefined ||
                quantity === undefined
              }
              control={Button}
            >
              加入餐點
            </Form.Field>
          </Form.Group>
        </Form>
        {orderItemCard && orderItemCard}
      </Grid.Column>

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
    </Grid>
  );
};

export default Order;

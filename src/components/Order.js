import React, { useState, useEffect } from "react";
import apis from "../api/apis";
import { Button, Form, Input, Radio, Select } from "semantic-ui-react";

const Order = () => {
  const [tables, setTables] = useState([]);
  const [table, setTable] = useState();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState();
  const [selectedCategory, setSelectedCategory] = useState();
  const [quantity, setQuantity] = useState("1");

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
    console.log(
      "categoryID",
      selectedCategory,
      "productID",
      selectedProduct,
      "tableID",
      table,
      "quantity",
      quantity
    );
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

  return (
    <Form onSubmit={handleSubmit}>
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
          type="submit"
          disabled={
            selectedCategory === undefined ||
            selectedProduct === undefined ||
            table === undefined ||
            quantity === undefined
          }
          control={Button}
        >
          送出
        </Form.Field>
        <Form.Field
          color="blue"
          type="submit"
          disabled={
            selectedCategory === undefined ||
            selectedProduct === undefined ||
            table === undefined ||
            quantity === undefined
          }
          control={Button}
        >
          加點
        </Form.Field>
      </Form.Group>
    </Form>
  );
};

export default Order;

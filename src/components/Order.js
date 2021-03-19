import React, { useState, useEffect } from "react";
import apis from "../api/apis";
import { Button, Form, Input, Radio, Select } from "semantic-ui-react";

const Order = () => {
  const [table, setTable] = useState([]);
  const [radio, setRadio] = useState();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    apis.get.tables().then((res) => {
      setTable(res.data);
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

  const handleChange = (_, { value }) => setRadio(value);
  const handleCategoryChange = (categoryId) => {
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
    <Form>
      <Form.Group widths="equal">
        <Form.Group inline>
          <label>桌名: </label>
          {table &&
            table.map((table) => (
              <Form.Field
                key={table.id}
                control={Radio}
                label={table.table_name}
                value={table.id}
                checked={radio === table.id}
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
          control={Select}
          options={products}
          placeholder="選擇餐點種類..."
        />
      </Form.Group>
      <Form.Group widths="equal">
        <Form.Field control={Input} label="Last name" placeholder="Last name" />
      </Form.Group>
      <Form.Field color="teal" control={Button}>
        Submit
      </Form.Field>
    </Form>
  );
};

export default Order;

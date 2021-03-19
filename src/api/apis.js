import api from "./index";
import { baseUrl } from "./config";

const apis = {
  get: {
    products: () =>
      api({
        method: "GET",
        url: `${baseUrl}/products`,
      }),
    orders: () =>
      api({
        method: "GET",
        url: `${baseUrl}/orders`,
      }),
    reservations: () =>
      api({
        method: "GET",
        url: `${baseUrl}/reservations`,
      }),
    tables: () =>
      api({
        method: "GET",
        url: `${baseUrl}/tables`,
      }),
    categories: () =>
      api({
        method: "GET",
        url: `${baseUrl}/categories`,
      }),
  },
  put: {
    reservations: (updatedData, id) =>
      api({
        method: "PUT",
        url: `${baseUrl}/reservations/${id}`,
        data: updatedData,
      }),
    orders: (data, id) => {
      return api({
        method: "PUT",
        url: `${baseUrl}/orders/${id}`,
        data,
      });
    },
  },
  post: {
    products: (data) => {
      return api({
        method: "POST",
        url: `${baseUrl}/products`,
        data,
      });
    },
    orders: (data) => {
      return api({
        method: "POST",
        url: `${baseUrl}/orders`,
        data,
      });
    },
    order_item: (data) => {
      return api({
        method: "POST",
        url: `${baseUrl}/order-items`,
        data,
      });
    },
    reservations: (data) => {
      return api({
        method: "POST",
        url: `${baseUrl}/reservations`,
        data,
      });
    },
  },
  delete: {
    order_item: (id) =>
      api({
        method: "DELETE",
        url: `${baseUrl}/order-items/${id}`,
      }),
  },
};

export default apis;

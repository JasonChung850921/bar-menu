import api from "./index";
import baseUrl from "./config";

const apis = {
  get: {
    products: () =>
      api({
        method: "GET",
        url: `${baseUrl}/products`,
      }),
    orders: (params = {}) =>
      api({
        method: "GET",
        url: `${baseUrl}/orders`,
        params,
      }),
    order: (id) =>
      api({
        method: "GET",
        url: `${baseUrl}/orders/${id}`,
      }),
    reservations: (params = {}) =>
      api({
        method: "GET",
        url: `${baseUrl}/reservations`,
        params,
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
    order_item: (params = {}) => {
      return api({
        method: "GET",
        url: `${baseUrl}/order-items`,
        params,
      });
    },
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
    order_item: (data, id) => {
      return api({
        method: "PUT",
        url: `${baseUrl}/order-items/${id}`,
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

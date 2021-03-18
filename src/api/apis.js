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
    reservations: (data) => {
      return api({
        method: "POST",
        url: `${baseUrl}/reservations`,
        data,
      });
    },
  },
};

export default apis;

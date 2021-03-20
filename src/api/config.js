let baseUrl = "";

if (process.env.NODE_ENV === "production") {
  baseUrl = "https://warm-caverns-76487.herokuapp.com";
} else {
  baseUrl = "http://192.168.50.238:1337";
}

export default baseUrl;

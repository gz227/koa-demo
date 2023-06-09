module.exports = {
  get header() {
    return this.req.headers;
  },

  set header(val) {
    this.req.headers = val;
  },

  get url() {
    return this.req.url;
  },

  set url(val) {
    this.req.url = val;
  },

  get method() {
    return this.req.method;
  },

  set method(val) {
    this.req.method = val;
  },
};

const axios = require("axios");
let response = {};

axios
  .get(
    "http://192.168.1.42:16021/api/v1/UEZNXaWRJhxwLVJuzM0RofjUZ4E6rrLY/state"
  )
  .then(deviceState => {
    this.setState({
      device: deviceState.data,
      isOn: deviceState.data.on.value
    });
  });

module.exports = { getNanoState };

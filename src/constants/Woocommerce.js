import axios from "axios";
import Oauth from "oauth-1.0a";
import CryptoJS from "crypto-js";
import jQuery from "jquery";
import {
  apiUrl
} from './config'

const ck = "ck_94250b5f04f21b0ef579c646084482e0da27b965";
const cs = "cs_1052ce96618fa041753eefe78f10826ee000fdad";
const baseURL = apiUrl+"/wp-json";

const Woocommerce = {
  getProducts: () => {
    return makeRequest("/wc/v3/products");
  },
  getProductByID: id => {
    return makeRequest("/wc/v3/products/" + id);
  }
};

function makeRequest(endpoint, method = "GET") {
  const oauth = getOauth();

  const requestData = {
    url: baseURL + endpoint,
    method
  };

  const requestHTTP =
    requestData.url + "?" + jQuery.param(oauth.authorize(requestData));

  return axios.get(requestHTTP);
}

function getOauth() {
  return Oauth({
    consumer: {
      key: ck,
      secret: cs
    },
    signature_method: "HMAC-SHA1",
    hash_function: function(base_string, key) {
      return CryptoJS.enc.Base64.stringify(CryptoJS.HmacSHA1(base_string, key));
    }
  });
}

export default Woocommerce;
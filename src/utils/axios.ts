import axios from "axios";
import { getAccessToken } from "../lib/auth";

const GHApi = axios.create({
  baseURL: 'https://api.github.com',
  headers: { 'Authorization': 'Bearer ' + getAccessToken() }
});

export default GHApi
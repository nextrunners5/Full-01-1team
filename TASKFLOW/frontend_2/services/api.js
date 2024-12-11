import axios from "axios";

//BASEURL, HTTP 통신 프로토콜(application/json 등등..) 옵션 설정 추가
const API = axios.create({ baseURL: "http://localhost:5000" });

export default API;

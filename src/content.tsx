import React from "react";
import ReactDOM from "react-dom/client";

import CryptoJs from "crypto-js";

const crxRoot = document.createElement("div");
crxRoot.id = "live-ticket-crx";
document.body.appendChild(crxRoot);

ReactDOM.createRoot(crxRoot).render(
  <React.StrictMode>
    <div>Ticket</div>
  </React.StrictMode>
);

/*
 url: s.a.BaseUrl("/order/order/pre"),
                method: "post",
                headers: {
                    Authorization: "Bearer " + y(),
                    source: b(),
                    version: "1.1"
                },
                data: v.encryptByAES(t)
*/
const authVal = document.cookie
  .split(";")
  .map((a) => a.split("="))
  .find(([name]) => name.trim() === "cookie_user_auth") as any;

const postData = (data: {
  ticketId: string;
  performanceId: string;
  timeId: string;
}) => {
  const param = {
    number: 1,
    // ticketId: "2147175463454187521441808",
    // performanceId: "2147175463244472326515578",
    // timeId: "2147175463328358409303173",
    isElectronic: 1,
    isExpress: 0,
    deviceFrom: "wap",
    actual: 220,
    returnUrl: "https://m.zhengzai.tv/pay/status?order_type=ticket&order_id=",
    showUrl: "https://m.zhengzai.tv/pay/status?order_type=ticket&order_id=",
    expressType: 0,
    agentId: 0,
    payType: "alipay",
    ...data,
  };

  const n = CryptoJs.AES.encrypt(
    JSON.stringify(param),
    CryptoJs.enc.Base64.parse("XjjkaLnlzAFbR399IP4kdQ=="),
    {
      mode: CryptoJs.mode.ECB,
      padding: CryptoJs.pad.Pkcs7,
      length: 128,
    }
  ).toString();
  const i = new Date().getTime();

  fetch("https://order.zhengzai.tv/order/order/pre", {
    method: "post",
    headers: {
      Authorization: "Bearer " + authVal[1],
      source: "H5",
      version: "1.1",
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json;charset=UTF-8",
    },
    body: JSON.stringify({
      sign: CryptoJs.SHA1(n + i + "QGZUanpSaSy9DEPQFVULJQ==").toString(),
      encryptedData: n,
      timestamp: i,
    }),
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.message) {
        console.log(`%c${res.message}`, `color:red;font-size:60px`);
      }
    });
};

const tickets = [
  {
    ticketId: "2147175463454187521441808",
    performanceId: "2147175463244472326515578",
    timeId: "2147175463328358409303173",
  },
  {
    ticketId: "2147175463538073603705071",
    performanceId: "2147175463244472326515578",
    timeId: "2147175463328358409303173",
  },
  {
    ticketId: "2147174625893621763189765",
    performanceId: "2147174625683906568235086",
    timeId: "2147174625809735680789387",
  },
  {
    ticketId: "2147174626019450885711453",
    performanceId: "2147174625683906568235086",
    timeId: "2147174625809735680789387",
  },
];

tickets.forEach((item, i) => {
  if (i === 0) {
    postData(item);
  } else {
    setTimeout(() => {
      postData(item);
    }, i * 100);
  }
});

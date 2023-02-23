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

let timer = 0;

const postData = async (data: {
  ticketId: string;
  performanceId: string;
  timeId: string;
}) => {
  const param = {
    number: 1,
    isElectronic: 1,
    isExpress: 0,
    deviceFrom: "wap",
    actual: 220,
    returnUrl: "https://m.zhengzai.tv/pay/status?order_type=ticket&order_id=",
    showUrl: "https://m.zhengzai.tv/pay/status?order_type=ticket&order_id=",
    expressType: 0,
    agentId: 0,
    payType: "alipay",
    enterIdList: ["2197930089065021445382557"],
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
  try {
    const res = await fetch("https://order.zhengzai.tv/order/order/pre", {
      method: "post",
      headers: {
        Authorization: "Bearer " + authVal[1],
        source: "H5",
        version: "1.1",
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json;charset=UTF-8",
        "X-Forwarded-For": "39.156.66.10",
      },
      body: JSON.stringify({
        sign: CryptoJs.SHA1(n + i + "QGZUanpSaSy9DEPQFVULJQ==").toString(),
        encryptedData: n,
        timestamp: i,
      }),
    }).then((res) => res.json());

    clearInterval(timer);

    const code = res.code;
    if (["20012", "20016"].includes(code)) {
      if (res.message) {
        console.log(`%c${res.message}`, `color:red;font-size:60px`);
      }
      timer = setInterval(() => {
        run();
      }, 3000);
    }
  } catch (e) {
    clearInterval(timer);
    timer = setInterval(() => {
      run();
    }, 5000);
  }
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

const run = async () => {
  for (let tick of tickets) {
    await sleep(1000);
    await postData(tick);
  }
};

const sleep = async (timer: number): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, timer);
  });
};

run();

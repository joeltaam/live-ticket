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

const param = {
  number: 1,
  ticketId: "2129109933677813767713971",
  isElectronic: 1,
  isExpress: 0,
  deviceFrom: "wap",
  actual: 120,
  performanceId: "2129101812876124162473378",
  timeId: "2129102470501048321800919",
  returnUrl: "https://m.zhengzai.tv/pay/status?order_type=ticket&order_id=",
  showUrl: "https://m.zhengzai.tv/pay/status?order_type=ticket&order_id=",
  expressType: 0,
  agentId: 0,
  payType: "alipay",
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
console.log({ n });
setTimeout(() => {
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
    .then(console.log);
}, 2000);

// XjjkaLnlzAFbR399IP4kdQ==

/*
v = {
            encryptByAES: function(t) {
                var e = A()(t)
                  , n = m.a.AES.encrypt(e, m.a.enc.Base64.parse("XjjkaLnlzAFbR399IP4kdQ=="), {
                    mode: m.a.mode.ECB,
                    padding: m.a.pad.Pkcs7,
                    length: 128
                }).toString()
                  , i = (new Date).getTime();
                return {
                    sign: m.a.SHA1(n + i + "QGZUanpSaSy9DEPQFVULJQ==").toString(),
                    encryptedData: n,
                    timestamp: i
                }
            },
            decryptByAES: function(t) {
                var e = m.a.enc.Utf8.parse("TheKeyOfmyDatadx");
                return m.a.AES.decrypt(t, e, {
                    mode: m.a.mode.ECB,
                    padding: m.a.pad.Pkcs7
                }).toString(m.a.enc.Utf8)
            }
        };
 */

// Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxODExMjk5IiwiY19hdCI6IjIwMjEwMzE3MTM0MDUyIiwibW9iaWxlIjoiMTg4Mjc2NjYzMjgiLCJuaWNrbmFtZSI6IjE4OCoqKio2MzI4IiwidHlwZSI6InVzZXIiLCJleHAiOjE2Nzg0NTc2MTQsImlhdCI6MTY3NTg2NTYxNH0.y_T02qaJ67XN3tY5sWLF9gCt7g9kzhdCFPCORDhFBdM
// Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxODExMjk5IiwiY19hdCI6IjIwMjEwMzE3MTM0MDUyIiwibW9iaWxlIjoiMTg4Mjc2NjYzMjgiLCJuaWNrbmFtZSI6IjE4OCoqKio2MzI4IiwidHlwZSI6InVzZXIiLCJleHAiOjE2Nzg0NTc2MTQsImlhdCI6MTY3NTg2NTYxNH0.y_T02qaJ67XN3tY5sWLF9gCt7g9kzhdCFPCORDhFBdM

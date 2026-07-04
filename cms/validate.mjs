import http from "http";

const tests = {};
let passCount = 0;
let failCount = 0;

function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "localhost",
      port: 5050,
      path: path,
      method: method,
      headers: { "Content-Type": "application/json" }
    };
    const req = http.request(options, (res) => {
      let body = "";
      res.on("data", chunk => body += chunk);
      res.on("end", () => resolve({ status: res.statusCode, body }));
    });
    req.on("error", reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

(async () => {
  console.log("==== DOCTOR CMS VALIDATION ====\n");
  
  let r1 = await makeRequest("POST", "/api/login", { username: "doctor", password: "doctor123" });
  console.log("T1 Login: " + (r1.status === 200 ? "?" : "?") + " Status " + r1.status);
  
  let r2 = await makeRequest("GET", "/health");
  console.log("T2 Health: " + (r2.status === 200 ? "?" : "?") + " Status " + r2.status);
  
  let r3 = await makeRequest("GET", "/api/content");
  console.log("T3 Unauth: " + (r3.status === 401 ? "?" : "?") + " Status " + r3.status);
  
  console.log("\n==== VALIDATION COMPLETE ====");
})();

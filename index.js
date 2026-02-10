require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

const EMAIL = "abhiney0178.be23@chitkara.edu.in";

/* GET /health */
app.get("/health", (req, res) => {
  res.json({ is_success: true, official_email: EMAIL });
});

/* helpers */
const fibonacci = (n) => {
  let arr = [0, 1];
  for (let i = 2; i < n; i++) arr.push(arr[i - 1] + arr[i - 2]);
  return arr.slice(0, n);
};

const primes = (nums) =>
  nums.filter((n) => {
    if (n < 2) return false;
    for (let i = 2; i <= Math.sqrt(n); i++) if (n % i === 0) return false;
    return true;
  });

const gcd = (a, b) => (!b ? a : gcd(b, a % b));
const hcf = (arr) => arr.reduce((a, b) => gcd(a, b));
const lcm = (arr) => arr.reduce((a, b) => (a * b) / gcd(a, b));

/* POST /bfhl */
app.post("/bfhl", async (req, res) => {
  try {
    const keys = Object.keys(req.body);
    if (keys.length !== 1) {
      return res.status(400).json({
        is_success: false,
        official_email: EMAIL   
      });
    }

    const body = req.body;
    let data;

    if (body.fibonacci !== undefined) data = fibonacci(body.fibonacci);
    else if (body.prime) data = primes(body.prime);
    else if (body.lcm) data = lcm(body.lcm);
    else if (body.hcf) data = hcf(body.hcf);
    else if (body.AI) {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_KEY}`,
        { contents: [{ parts: [{ text: body.AI }] }] }
      );
      data = response.data.candidates[0].content.parts[0].text.split(" ")[0];
    } else {
      return res.status(400).json({ is_success: false, official_email: EMAIL });
    }

    res.json({ is_success: true, official_email: EMAIL, data });
  } catch {
    res.status(400).json({ is_success: false, official_email: EMAIL });
  }
});


app.listen(3000, () => console.log("Server running on port 3000"));
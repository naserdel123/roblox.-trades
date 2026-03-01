const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const bcrypt = require("bcrypt");

const User = require("./models/User");
const Trade = require("./models/Trade");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

mongoose.connect("mongodb://127.0.0.1:27017/robloxTrades");

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});
const upload = multer({ storage });

/* تسجيل */
app.post("/register", upload.single("avatar"), async (req, res) => {
  const { username, password } = req.body;
  const hash = await bcrypt.hash(password, 10);

  const user = new User({
    username,
    password: hash,
    avatar: req.file?.filename
  });

  await user.save();
  res.json({ message: "تم التسجيل" });
});

/* تسجيل دخول */
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (!user) return res.json({ error: "غير موجود" });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.json({ error: "كلمة المرور خطأ" });

  res.json(user);
});

/* نشر عرض */
app.post(
  "/trade",
  upload.fields([{ name: "itemImg" }, { name: "wantImg" }]),
  async (req, res) => {
    const { name, price, tiktok } = req.body;

    const trade = new Trade({
      name,
      price,
      tiktok,
      itemImg: req.files.itemImg[0].filename,
      wantImg: req.files.wantImg[0].filename
    });

    await trade.save();
    res.json({ message: "تم النشر" });
  }
);

/* جلب العروض */
app.get("/trades", async (req, res) => {
  const trades = await Trade.find().sort({ _id: -1 });
  res.json(trades);
});

app.listen(3000, () => console.log("Server running"));

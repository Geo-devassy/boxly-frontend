const express = require("express");
const router = express.Router();
const Order = require("../orders/Order"); // make sure path is correct

/* GET ALL ORDERS */
router.put("/orders/:id", async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(updatedOrder);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

/* ADD ORDER */
router.post("/", async (req, res) => {
  try {
    const count = await Order.countDocuments();

    const newOrder = new Order({
      ...req.body,
      orderNumber: `ORD-${1000 + count + 1}`,
    });

    await newOrder.save();

    res.json({ message: "Order added", order: newOrder });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* UPDATE STATUS */
router.put("/:id", async (req, res) => {
  try {
    const updated = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json({ message: "Updated", order: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* DELETE ORDER */
router.delete("/:id", async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
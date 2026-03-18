const express = require("express");
const router = express.Router();

const Product = require("./Products");
const StockHistory = require("./StockHistory");
const Order = require("../models/orders/Order"); // ⚠ adjust path if needed
const StockRequest = require("../models/StockRequest");

/* ================= SUPPLIER DASHBOARD ================= */

router.get("/dashboard", async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();

    const inwardCount = await StockHistory.countDocuments({
      type: "INWARD",
    });

    const outwardCount = await StockHistory.countDocuments({
      type: "OUTWARD",
    });

    res.json({
      totalProducts,
      inwardCount,
      outwardCount,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* ================= SUPPLIER ORDERS ================= */

// ✅ GET all supplier orders
router.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ UPDATE order status
router.put("/orders/:id", async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
const Delivery = require("../models/Delivery");

// GET all deliveries
router.get("/deliveries", async (req, res) => {
  try {
    const deliveries = await Delivery.find();
    res.json(deliveries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET all stock requests
router.get("/stock-requests", async (req, res) => {
  try {
    const requests = await StockRequest.find();
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Approve request
router.put("/stock-requests/:id", async (req, res) => {
  try {
    const updatedRequest = await StockRequest.findByIdAndUpdate(
      req.params.id,
      { status: "Approved" },
      { new: true }
    );

    res.json(updatedRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
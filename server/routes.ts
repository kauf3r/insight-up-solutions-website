import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertProductSchema, 
  insertDemoBookingSchema, 
  insertInquirySchema 
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Product routes
  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getAllProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const identifier = req.params.id;
      // Try fetching by slug first (friendly URLs), then by UUID
      let product = await storage.getProductBySlug(identifier);
      if (!product) {
        product = await storage.getProduct(identifier);
      }
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch product" });
    }
  });

  app.get("/api/products/category/:category", async (req, res) => {
    try {
      const products = await storage.getProductsByCategory(req.params.category);
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch products by category" });
    }
  });

  app.post("/api/products", async (req, res) => {
    try {
      const validatedData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(validatedData);
      res.status(201).json(product);
    } catch (error) {
      res.status(400).json({ error: "Invalid product data" });
    }
  });

  // Demo booking routes
  app.get("/api/demo-bookings", async (req, res) => {
    try {
      const bookings = await storage.getAllDemoBookings();
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch demo bookings" });
    }
  });

  app.post("/api/demo-bookings", async (req, res) => {
    try {
      const validatedData = insertDemoBookingSchema.parse(req.body);
      const booking = await storage.createDemoBooking(validatedData);
      res.status(201).json(booking);
    } catch (error) {
      res.status(400).json({ error: "Invalid demo booking data" });
    }
  });

  app.patch("/api/demo-bookings/:id/status", async (req, res) => {
    try {
      const { status } = req.body;
      const booking = await storage.updateDemoBookingStatus(req.params.id, status);
      if (!booking) {
        return res.status(404).json({ error: "Demo booking not found" });
      }
      res.json(booking);
    } catch (error) {
      res.status(500).json({ error: "Failed to update demo booking status" });
    }
  });

  // Inquiry routes
  app.get("/api/inquiries", async (req, res) => {
    try {
      const inquiries = await storage.getAllInquiries();
      res.json(inquiries);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch inquiries" });
    }
  });

  app.post("/api/inquiries", async (req, res) => {
    try {
      const validatedData = insertInquirySchema.parse(req.body);
      const inquiry = await storage.createInquiry(validatedData);
      res.status(201).json(inquiry);
    } catch (error) {
      res.status(400).json({ error: "Invalid inquiry data" });
    }
  });

  app.patch("/api/inquiries/:id/status", async (req, res) => {
    try {
      const { status } = req.body;
      const inquiry = await storage.updateInquiryStatus(req.params.id, status);
      if (!inquiry) {
        return res.status(404).json({ error: "Inquiry not found" });
      }
      res.json(inquiry);
    } catch (error) {
      res.status(500).json({ error: "Failed to update inquiry status" });
    }
  });

  // Contact form route (alias for inquiries)
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertInquirySchema.parse(req.body);
      const inquiry = await storage.createInquiry(validatedData);
      res.status(201).json(inquiry);
    } catch (error) {
      res.status(400).json({ error: "Invalid contact form data" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}

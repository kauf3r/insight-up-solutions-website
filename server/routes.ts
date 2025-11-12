import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertProductSchema, 
  insertDemoBookingSchema, 
  insertInquirySchema,
  insertBundleLeadSchema
} from "@shared/schema";
import { getUncachableResendClient } from "./lib/resend";

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

  // Bundle leads route with Resend integration
  app.post("/api/bundle-leads", async (req, res) => {
    try {
      const validatedData = insertBundleLeadSchema.parse(req.body);
      const lead = await storage.createBundleLead(validatedData);
      console.log(`[BUNDLE LEAD] Created lead for ${lead.email}`);
      
      // Send confirmation email via Resend connector
      try {
        console.log("[RESEND] Attempting to get Resend client...");
        const { client } = await getUncachableResendClient();
        console.log("[RESEND] Client obtained");
        
        // Use Resend's verified test email for now
        // TODO: Verify insightupsolutions.com domain in Resend dashboard for production
        const emailData = {
          from: "Insight Up Solutions <onboarding@resend.dev>",
          to: lead.email,
          subject: "Trinity Pro + LR1 Bundle - Quote Request Received",
          html: `
            <h2>Thank you for your interest in the Trinity Pro + LR1 Bundle!</h2>
            <p>Hi ${lead.name},</p>
            <p>We're excited to share our exclusive Q4 special with you:</p>
            <ul>
              <li><strong>Trinity Pro Platform:</strong> 10% off</li>
              <li><strong>Sony ILX-LR1 Payload:</strong> 5% off</li>
              <li><strong>TPT Backpack:</strong> 8% off</li>
            </ul>
            <p><strong>Offer valid through December 31, 2025</strong></p>
            <p>Our team will reach out within 24 hours to discuss your specific needs and provide a detailed quote.</p>
            <p>In the meantime, you can learn more about our solutions at <a href="https://insightupsolutions.com">insightupsolutions.com</a>.</p>
            <br/>
            <p>Best regards,<br/>
            Insight Up Solutions Team<br/>
            <a href="mailto:info@insightupsolutions.com">info@insightupsolutions.com</a> | +1 (831) 888-7172</p>
          `
        };
        
        console.log(`[RESEND] Sending email to ${emailData.to} from ${emailData.from}`);
        const result = await client.emails.send(emailData);
        console.log("[RESEND] Email sent successfully:", result);
      } catch (emailError: any) {
        console.error("[RESEND ERROR] Failed to send confirmation email");
        console.error("[RESEND ERROR] Error details:", emailError);
        console.error("[RESEND ERROR] Error message:", emailError?.message);
        console.error("[RESEND ERROR] Error stack:", emailError?.stack);
      }
      
      res.status(201).json(lead);
    } catch (error) {
      console.error("[BUNDLE LEAD ERROR]", error);
      res.status(400).json({ error: "Invalid bundle lead data" });
    }
  });

  app.get("/api/bundle-leads", async (req, res) => {
    try {
      const leads = await storage.getAllBundleLeads();
      res.json(leads);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch bundle leads" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}

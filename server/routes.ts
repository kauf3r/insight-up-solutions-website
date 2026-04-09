import type { Express } from "express";
import { storage } from "./storage.js";
import { 
  insertProductSchema, 
  insertDemoBookingSchema, 
  insertInquirySchema,
  insertBundleLeadSchema
} from "../shared/schema.js";
import { getResendClient } from "./lib/resend.js";
import { escapeHtml } from "./lib/html.js";

export function registerRoutes(app: Express): void {
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
      console.log(`[DEMO BOOKING] Created booking for ${booking.email}`);
      
      // Send confirmation email via Resend connector
      try {
        const { client, fromEmail } = getResendClient();
        
        const emailData = {
          from: fromEmail,
          to: booking.email,
          subject: "Demo Booking Confirmed - Insight Up Solutions",
          html: `
            <h2>Thank you for booking a demo with Insight Up Solutions!</h2>
            <p>Hi ${escapeHtml(booking.name)},</p>
            <p>We've received your demo booking request and are excited to show you our UAV solutions.</p>
            <p><strong>Your Details:</strong></p>
            <p>Name: ${escapeHtml(booking.name)}</p>
            <p>Email: ${escapeHtml(booking.email)}</p>
            <p>Company: ${escapeHtml(booking.company || 'Not provided')}</p>
            <p>Phone: ${escapeHtml(booking.phone || 'Not provided')}</p>
            <p><strong>Booking Details:</strong></p>
            <p>Preferred Date: ${escapeHtml(booking.preferredDate || 'To be scheduled')}</p>
            <p>Your Message: ${escapeHtml(booking.message || 'None provided')}</p>
            <p>Our team will reach out within 24 hours to confirm your appointment and discuss your specific needs.</p>
            <br/>
            <p>Best regards,<br/>
            Insight Up Solutions Team<br/>
            <a href="mailto:info@insightupsolutions.com">info@insightupsolutions.com</a> | +1 (831) 888-7172</p>
          `
        };
        
        console.log(`[RESEND] Sending demo booking confirmation to ${emailData.to}`);
        const result = await client.emails.send(emailData);
        console.log("[RESEND] Demo booking confirmation sent successfully:", result);
      } catch (emailError: any) {
        console.error("[RESEND ERROR] Failed to send demo booking confirmation email");
        console.error("[RESEND ERROR] Error details:", emailError);
        console.error("[RESEND ERROR] Error message:", emailError?.message);
      }
      
      // Send admin notification email
      try {
        const { client, fromEmail } = getResendClient();
        const submittedTime = booking.createdAt 
          ? new Date(booking.createdAt).toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })
          : new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' });
        
        const adminEmailData = {
          from: fromEmail,
          to: "kaufman@airspaceintegration.com",
          subject: "New Demo Booking Request",
          html: `
            <h2>New Demo Booking</h2>
            <p><strong>Name:</strong> ${escapeHtml(booking.name)}</p>
            <p><strong>Email:</strong> ${escapeHtml(booking.email)}</p>
            <p><strong>Company:</strong> ${escapeHtml(booking.company || 'Not provided')}</p>
            <p><strong>Phone:</strong> ${escapeHtml(booking.phone || 'Not provided')}</p>
            <p><strong>Preferred Date:</strong> ${escapeHtml(booking.preferredDate || 'Not specified')}</p>
            <p><strong>Message:</strong> ${escapeHtml(booking.message || 'None')}</p>
            <br/>
            <p><strong>Submitted:</strong> ${submittedTime}</p>
            <p><a href="https://insightupsolutions.com">View Dashboard</a></p>
          `
        };
        
        console.log(`[RESEND] Sending demo booking admin notification to ${adminEmailData.to}`);
        const adminResult = await client.emails.send(adminEmailData);
        console.log("[RESEND] Demo booking admin notification sent successfully:", adminResult);
      } catch (adminEmailError: any) {
        console.error("[RESEND ERROR] Failed to send demo booking admin notification email");
        console.error("[RESEND ERROR] Error details:", adminEmailError);
        console.error("[RESEND ERROR] Error message:", adminEmailError?.message);
      }
      
      res.status(201).json(booking);
    } catch (error) {
      console.error("[DEMO BOOKING ERROR]", error);
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
      // Auto-populate subject for quote requests if not provided
      const inquiryData = { ...req.body };
      if (!inquiryData.subject && inquiryData.inquiryType === 'quote') {
        inquiryData.subject = `Quote request from ${inquiryData.name || 'customer'}`;
      }
      
      const validatedData = insertInquirySchema.parse(inquiryData);
      const inquiry = await storage.createInquiry(validatedData);
      console.log(`[INQUIRY] Created inquiry for ${inquiry.email}`);
      
      // Send confirmation email via Resend connector
      try {
        const { client, fromEmail } = getResendClient();
        
        const isQuote = inquiry.inquiryType === 'quote';
        const emailSubject = isQuote ? "Quote Request Received - Insight Up Solutions" : "Your Inquiry - Insight Up Solutions";
        const emailTitle = isQuote ? "Thank you for requesting a quote!" : "Thank you for contacting Insight Up Solutions!";
        const responseMessage = isQuote 
          ? "Our team will review your requirements and provide a detailed quote within 24 hours."
          : "Our team will respond within 24 hours to address your questions and discuss how we can help.";
        
        const emailData = {
          from: fromEmail,
          to: inquiry.email,
          subject: emailSubject,
          html: `
            <h2>${emailTitle}</h2>
            <p>Hi ${escapeHtml(inquiry.name)},</p>
            <p>We've received your ${isQuote ? 'quote request' : 'inquiry'} and appreciate your interest in our UAV solutions.</p>
            <p><strong>Your Details:</strong></p>
            <p>Name: ${escapeHtml(inquiry.name)}</p>
            <p>Email: ${escapeHtml(inquiry.email)}</p>
            <p>Company: ${escapeHtml(inquiry.company || 'Not provided')}</p>
            <p>Phone: ${escapeHtml(inquiry.phone || 'Not provided')}</p>
            ${inquiry.industry ? `<p>Industry: ${escapeHtml(inquiry.industry)}</p>` : ''}
            <p><strong>${isQuote ? 'Quote' : 'Inquiry'} Details:</strong></p>
            <p>Subject: ${escapeHtml(inquiry.subject)}</p>
            <p>Type: ${escapeHtml(inquiry.inquiryType)}</p>
            <p>Product Reference: ${escapeHtml(inquiry.productId || 'General inquiry')}</p>
            <p>Your Message: ${escapeHtml(inquiry.message || 'None provided')}</p>
            <p>${responseMessage}</p>
            <br/>
            <p>Best regards,<br/>
            Insight Up Solutions Team<br/>
            <a href="mailto:info@insightupsolutions.com">info@insightupsolutions.com</a> | +1 (831) 888-7172</p>
          `
        };
        
        console.log(`[RESEND] Sending inquiry confirmation to ${emailData.to}`);
        const result = await client.emails.send(emailData);
        console.log("[RESEND] Inquiry confirmation sent successfully:", result);
      } catch (emailError: any) {
        console.error("[RESEND ERROR] Failed to send inquiry confirmation email");
        console.error("[RESEND ERROR] Error details:", emailError);
        console.error("[RESEND ERROR] Error message:", emailError?.message);
      }
      
      // Send admin notification email
      try {
        const { client, fromEmail } = getResendClient();
        const submittedTime = inquiry.createdAt 
          ? new Date(inquiry.createdAt).toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })
          : new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' });
        
        const adminSubject = inquiry.inquiryType === 'quote' ? "New Quote Request" : "New Contact Inquiry";
        
        const adminEmailData = {
          from: fromEmail,
          to: "kaufman@airspaceintegration.com",
          subject: adminSubject,
          html: `
            <h2>${inquiry.inquiryType === 'quote' ? 'New Quote Request Submission' : 'New Inquiry Submission'}</h2>
            <p><strong>Name:</strong> ${escapeHtml(inquiry.name)}</p>
            <p><strong>Email:</strong> ${escapeHtml(inquiry.email)}</p>
            <p><strong>Company:</strong> ${escapeHtml(inquiry.company || 'Not provided')}</p>
            <p><strong>Phone:</strong> ${escapeHtml(inquiry.phone || 'Not provided')}</p>
            ${inquiry.industry ? `<p><strong>Industry:</strong> ${escapeHtml(inquiry.industry)}</p>` : ''}
            <p><strong>Subject:</strong> ${escapeHtml(inquiry.subject)}</p>
            <p><strong>Type:</strong> ${escapeHtml(inquiry.inquiryType)}</p>
            <p><strong>Product ID:</strong> ${escapeHtml(inquiry.productId || 'Not specified')}</p>
            <p><strong>Message:</strong> ${escapeHtml(inquiry.message || 'None')}</p>
            <br/>
            <p><strong>Submitted:</strong> ${submittedTime}</p>
            <p><a href="https://insightupsolutions.com">View Dashboard</a></p>
          `
        };
        
        console.log(`[RESEND] Sending inquiry admin notification to ${adminEmailData.to}`);
        const adminResult = await client.emails.send(adminEmailData);
        console.log("[RESEND] Inquiry admin notification sent successfully:", adminResult);
      } catch (adminEmailError: any) {
        console.error("[RESEND ERROR] Failed to send inquiry admin notification email");
        console.error("[RESEND ERROR] Error details:", adminEmailError);
        console.error("[RESEND ERROR] Error message:", adminEmailError?.message);
      }
      
      res.status(201).json(inquiry);
    } catch (error) {
      console.error("[INQUIRY ERROR]", error);
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
      console.log(`[CONTACT] Created contact inquiry for ${inquiry.email}`);
      
      // Send confirmation email via Resend connector
      try {
        const { client, fromEmail } = getResendClient();
        
        const emailData = {
          from: fromEmail,
          to: inquiry.email,
          subject: "Your Message - Insight Up Solutions",
          html: `
            <h2>Thank you for contacting Insight Up Solutions!</h2>
            <p>Hi ${escapeHtml(inquiry.name)},</p>
            <p>We've received your message and appreciate you reaching out to us.</p>
            <p><strong>Your Details:</strong></p>
            <p>Name: ${escapeHtml(inquiry.name)}</p>
            <p>Email: ${escapeHtml(inquiry.email)}</p>
            <p>Company: ${escapeHtml(inquiry.company || 'Not provided')}</p>
            <p>Phone: ${escapeHtml(inquiry.phone || 'Not provided')}</p>
            <p><strong>Message Details:</strong></p>
            <p>Subject: ${escapeHtml(inquiry.subject)}</p>
            <p>Type: ${escapeHtml(inquiry.inquiryType)}</p>
            <p>Product Reference: ${escapeHtml(inquiry.productId || 'General inquiry')}</p>
            <p>Your Message: ${escapeHtml(inquiry.message || 'None provided')}</p>
            <p>Our team will respond within 24 hours to address your questions and discuss how we can help.</p>
            <br/>
            <p>Best regards,<br/>
            Insight Up Solutions Team<br/>
            <a href="mailto:info@insightupsolutions.com">info@insightupsolutions.com</a> | +1 (831) 888-7172</p>
          `
        };
        
        console.log(`[RESEND] Sending contact confirmation to ${emailData.to}`);
        const result = await client.emails.send(emailData);
        console.log("[RESEND] Contact confirmation sent successfully:", result);
      } catch (emailError: any) {
        console.error("[RESEND ERROR] Failed to send contact confirmation email");
        console.error("[RESEND ERROR] Error details:", emailError);
        console.error("[RESEND ERROR] Error message:", emailError?.message);
      }
      
      // Send admin notification email
      try {
        const { client, fromEmail } = getResendClient();
        const submittedTime = inquiry.createdAt 
          ? new Date(inquiry.createdAt).toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })
          : new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' });
        
        const adminEmailData = {
          from: fromEmail,
          to: "kaufman@airspaceintegration.com",
          subject: "New Contact Form Submission",
          html: `
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${escapeHtml(inquiry.name)}</p>
            <p><strong>Email:</strong> ${escapeHtml(inquiry.email)}</p>
            <p><strong>Company:</strong> ${escapeHtml(inquiry.company || 'Not provided')}</p>
            <p><strong>Phone:</strong> ${escapeHtml(inquiry.phone || 'Not provided')}</p>
            <p><strong>Subject:</strong> ${escapeHtml(inquiry.subject)}</p>
            <p><strong>Type:</strong> ${escapeHtml(inquiry.inquiryType)}</p>
            <p><strong>Product ID:</strong> ${escapeHtml(inquiry.productId || 'Not specified')}</p>
            <p><strong>Message:</strong> ${escapeHtml(inquiry.message || 'None')}</p>
            <br/>
            <p><strong>Submitted:</strong> ${submittedTime}</p>
            <p><a href="https://insightupsolutions.com">View Dashboard</a></p>
          `
        };
        
        console.log(`[RESEND] Sending contact admin notification to ${adminEmailData.to}`);
        const adminResult = await client.emails.send(adminEmailData);
        console.log("[RESEND] Contact admin notification sent successfully:", adminResult);
      } catch (adminEmailError: any) {
        console.error("[RESEND ERROR] Failed to send contact admin notification email");
        console.error("[RESEND ERROR] Error details:", adminEmailError);
        console.error("[RESEND ERROR] Error message:", adminEmailError?.message);
      }
      
      res.status(201).json(inquiry);
    } catch (error) {
      console.error("[CONTACT ERROR]", error);
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
        const { client, fromEmail } = getResendClient();
        console.log("[RESEND] Client obtained");
        
        const emailData = {
          from: fromEmail,
          to: lead.email,
          subject: "Trinity Pro + LR1 Bundle - Quote Request Received",
          html: `
            <h2>Thank you for your interest in the Trinity Pro + LR1 Bundle!</h2>
            <p>Hi ${escapeHtml(lead.name)},</p>
            <p>We've received your quote request for our exclusive Q4 special:</p>
            <ul>
              <li><strong>Trinity Pro Platform:</strong> 10% off</li>
              <li><strong>Sony ILX-LR1 Payload:</strong> 5% off</li>
              <li><strong>TPT Backpack:</strong> 8% off</li>
            </ul>
            <p><strong>Offer valid through December 31, 2025</strong></p>
            <p><strong>Your Details:</strong></p>
            <p>Name: ${escapeHtml(lead.name)}</p>
            <p>Email: ${escapeHtml(lead.email)}</p>
            <p>Company: ${escapeHtml(lead.company || 'Not provided')}</p>
            <p>Phone: ${escapeHtml(lead.phone || 'Not provided')}</p>
            <p>Interest Area: ${escapeHtml(lead.interestArea || 'General UAV solutions')}</p>
            <p>Our team will reach out within 24 hours to discuss your specific needs and provide a detailed quote.</p>
            <p>In the meantime, you can learn more about our solutions at <a href="https://insightupsolutions.com">insightupsolutions.com</a>.</p>
            <br/>
            <p>Best regards,<br/>
            Insight Up Solutions Team<br/>
            <a href="mailto:info@insightupsolutions.com">info@insightupsolutions.com</a> | +1 (831) 888-7172</p>
          `
        };
        
        console.log(`[RESEND] Sending customer confirmation to ${emailData.to} from ${emailData.from}`);
        const result = await client.emails.send(emailData);
        console.log("[RESEND] Customer confirmation sent successfully:", result);
      } catch (emailError: any) {
        console.error("[RESEND ERROR] Failed to send customer confirmation email");
        console.error("[RESEND ERROR] Error details:", emailError);
        console.error("[RESEND ERROR] Error message:", emailError?.message);
      }
      
      // Send admin notification email (separate try/catch to ensure API response even if this fails)
      try {
        const { client, fromEmail } = getResendClient();
        const submittedTime = lead.createdAt 
          ? new Date(lead.createdAt).toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })
          : new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' });
        
        const adminEmailData = {
          from: fromEmail,
          to: "kaufman@airspaceintegration.com",
          subject: "New Trinity Pro Bundle Lead",
          html: `
            <h2>New Bundle Lead Submission</h2>
            <p><strong>Name:</strong> ${escapeHtml(lead.name)}</p>
            <p><strong>Email:</strong> ${escapeHtml(lead.email)}</p>
            <p><strong>Company:</strong> ${escapeHtml(lead.company || 'Not provided')}</p>
            <p><strong>Phone:</strong> ${escapeHtml(lead.phone || 'Not provided')}</p>
            <p><strong>Interest Area:</strong> ${escapeHtml(lead.interestArea || 'Not specified')}</p>
            <br/>
            <p><strong>Submitted:</strong> ${submittedTime}</p>
            <p><a href="https://insightupsolutions.com">View Dashboard</a></p>
          `
        };
        
        console.log(`[RESEND] Sending admin notification to ${adminEmailData.to}`);
        const adminResult = await client.emails.send(adminEmailData);
        console.log("[RESEND] Admin notification sent successfully:", adminResult);
      } catch (adminEmailError: any) {
        console.error("[RESEND ERROR] Failed to send admin notification email");
        console.error("[RESEND ERROR] Error details:", adminEmailError);
        console.error("[RESEND ERROR] Error message:", adminEmailError?.message);
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
}

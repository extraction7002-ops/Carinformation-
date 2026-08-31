import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY is not set. AI features will return fallback answers.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey || "dummy-key",
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "10mb" }));

  // Health API
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", service: "Traffic Challan & Parivahan RC API" });
  });

  // AI Legal & Violation Analysis API
  app.post("/api/ai/analyze-violation", async (req, res) => {
    try {
      const { challan, vehicle } = req.body;
      const ai = getAiClient();

      if (!process.env.GEMINI_API_KEY) {
        return res.json({
          analysis: `Under Section ${challan.section || '177/183'} of the Motor Vehicles Act, this violation incurs a statutory fine of ₹${challan.fineAmount}. You may contest this through the Virtual Traffic Court if there is evidence of faulty camera calibration, incorrect vehicle tagging, or medical emergency.`,
          contestFeasibility: "Medium (55% success rate in Virtual Court)",
          legalOptions: [
            "Pay fine online within 60 days via Parivahan / e-Challan portal to avoid court summons.",
            "Contest before Virtual Court Magistrate on grounds of photo clarity or speed radar calibration certificate.",
            "Attend upcoming National Lok Adalat for up to 50%-75% waiver on compoundable traffic fines."
          ],
          dlPointsImpact: "0 to 2 Penalty points recorded against Driving License record in Sarathi database."
        });
      }

      const prompt = `You are a Senior Indian Traffic Legal Expert & Advocate specializing in the Motor Vehicles Act (1988 & 2019 Amendment) and e-Challan dispute resolution.
Analyze the following traffic challan and vehicle registration details:
- Vehicle: ${vehicle.makerModel} (${vehicle.rcNumber}), Registered on: ${vehicle.registrationDate} at ${vehicle.rtoDetails?.rtoName}
- Challan Number: ${challan.challanNo}
- Offense: ${challan.violationType}
- Section: ${challan.section}
- Fine Amount: ₹${challan.fineAmount}
- Location: ${challan.location}
- Camera/Equipment: ${challan.cameraDetails?.type} (${challan.cameraDetails?.cameraId})
- Recorded Data: ${challan.cameraDetails?.recordedSpeed || 'ANPR Sensor Triggered'}

Please provide a JSON response with:
1. "summary": Concise executive explanation of the offense and statutory provisions under Indian law.
2. "contestFeasibility": Feasibility rating ("High", "Moderate", "Low") with percentage likelihood of winning if disputed.
3. "legalGrounds": Array of 3 valid legal defenses or contest angles (e.g. section 136A electronic monitoring compliance, calibration certificate validity, signage visibility, incorrect ANPR plate reading).
4. "stepByStepGuide": Array of 4 clear actionable steps the vehicle owner should take.
5. "lokAdalatTip": Advice on Lok Adalat discount/waiver suitability.
6. "dlImpact": Points or license suspension risk (if any).

Ensure the response is valid JSON.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      const text = response.text || "{}";
      const parsed = JSON.parse(text);
      res.json(parsed);
    } catch (error) {
      console.error("AI Analysis Error:", error);
      res.status(500).json({
        error: "Failed to generate AI analysis",
        fallback: "This traffic challan is issued under the Motor Vehicles Act. You can pay online via e-Challan portal or contest through Virtual Court."
      });
    }
  });

  // AI Dispute Petition Generator API
  app.post("/api/ai/generate-dispute-letter", async (req, res) => {
    try {
      const { challan, vehicle, disputeReason, userRemarks } = req.body;
      const ai = getAiClient();

      if (!process.env.GEMINI_API_KEY) {
        return res.json({
          letter: `To,\nThe Traffic Police Commissioner / Virtual Court Magistrate,\nTraffic Department, ${vehicle?.rtoDetails?.state || 'Delhi'}\n\nSubject: Formal Representation & Dispute against e-Challan No. ${challan.challanNo} for Vehicle No. ${vehicle.rcNumber}\n\nRespected Sir/Madam,\n\nI am writing to formally contest the e-Challan No. ${challan.challanNo} dated ${challan.violationDate} issued for alleged violation of ${challan.section}.\n\nGrounds for Dispute: ${disputeReason}.\n\nAdditional Facts: ${userRemarks || 'The photographic evidence lacks definitive proof of violation, or the vehicle registration number was misidentified.'}\n\nI request you to review the raw video feed, camera calibration certificate, and quash the said challan.\n\nYours sincerely,\n${vehicle.ownerName}\nContact: Registered Mobile Number`,
          subject: `Grievance Petition against e-Challan No. ${challan.challanNo}`
        });
      }

      const prompt = `You are an Indian High Court Advocate drafting a formal Grievance & Dispute Petition against a wrongly issued Traffic e-Challan.
Details:
- Vehicle Reg Number: ${vehicle.rcNumber}
- Vehicle Details: ${vehicle.makerModel}, Registered: ${vehicle.registrationDate}
- Owner Name: ${vehicle.ownerName}
- Challan No: ${challan.challanNo}
- Offense Alleged: ${challan.violationType} (${challan.section})
- Alleged Location: ${challan.location}
- Alleged Date & Time: ${challan.violationDate}
- Penalty Amount: ₹${challan.fineAmount}
- Reason for Contesting: ${disputeReason}
- Owner's Statement: ${userRemarks}

Generate a formal legal petition formatted with appropriate legal salutation, subject line, concise chronological points citing relevant provisions of Central Motor Vehicles Rules (CMVR 1989 Rule 167A / MVA Section 136A electronic enforcement guidelines), prayer clause requesting cancellation/quashing of challan or referral to Virtual Court, and signature block.
Return JSON with { "subject": string, "petitionText": string, "recommendedAttachments": string[] }`;

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      const text = response.text || "{}";
      const parsed = JSON.parse(text);
      res.json(parsed);
    } catch (error) {
      console.error("Dispute Generator Error:", error);
      res.status(500).json({ error: "Failed to generate dispute petition" });
    }
  });

  // AI Traffic Assistant Chatbot API
  app.post("/api/ai/chat", async (req, res) => {
    try {
      const { message, contextVehicle } = req.body;
      const ai = getAiClient();

      if (!process.env.GEMINI_API_KEY) {
        return res.json({
          reply: `In India, traffic challans can be checked through the MoRTH Parivahan e-Challan portal or State Traffic Police portals. If you have an unpaid challan, you have 60 days to pay online or contest it in Virtual Court before it gets transferred to a regular Metropolitan Magistrate Court.`
        });
      }

      const prompt = `You are "Sarathi Mitra" - an AI Indian Traffic & Parivahan Vehicle Assistant built for an Android mobile application.
Context vehicle if available: ${contextVehicle ? JSON.stringify(contextVehicle) : 'None selected'}.
User Query: "${message}"

Answer accurately based on:
1. Motor Vehicles Act (1988) and 2019 Amendments
2. Parivahan Sewa, VAHAN 4.0 (RC database), SARATHI (Driving License)
3. e-Challan payment process, Virtual Courts, National Lok Adalat fine discounts
4. PUCC norms, High Security Registration Plates (HSRP), FASTag rules, Tinted glass rules (50%/70% VLT), Helmet BIS standards.

Keep tone helpful, concise, well-structured (bullet points where appropriate), and easy to read on mobile screens.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
      });

      res.json({ reply: response.text });
    } catch (error) {
      console.error("AI Chat error:", error);
      res.status(500).json({ reply: "I am unable to connect to the traffic knowledge base right now. Please check your internet connection." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Traffic Challan App server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

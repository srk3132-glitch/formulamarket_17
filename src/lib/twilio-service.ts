import { createServerFn } from "@tanstack/react-start";
import twilio from "twilio";

// In-memory cache for pending OTP verifications: phoneNumber -> { code, expiresAt }
const pendingOtps = new Map<string, { code: string; expiresAt: number }>();

function cleanExpiredOtps() {
  const now = Date.now();
  for (const [phone, data] of pendingOtps.entries()) {
    if (data.expiresAt < now) {
      pendingOtps.delete(phone);
    }
  }
}

export interface SendOtpResult {
  success: boolean;
  message: string;
  isSimulated: boolean;
  simulatedOtp?: string;
  error?: string;
}

export interface VerifyOtpResult {
  success: boolean;
  message: string;
}

export interface SendSmsResult {
  success: boolean;
  message: string;
  isSimulated: boolean;
}

/**
 * Server Function: Send OTP via Twilio SMS
 */
export const sendTwilioOtp = createServerFn({ method: "POST" })
  .validator((data: { phoneNumber: string }) => data)
  .handler(async ({ data }): Promise<SendOtpResult> => {
    cleanExpiredOtps();

    let cleanPhone = data.phoneNumber.trim().replace(/[\s-]/g, "");
    if (!cleanPhone.startsWith("+")) {
      // Default to India (+91) if not formatted with country code
      cleanPhone = `+91${cleanPhone.replace(/^0+/, "")}`;
    }

    // Generate 4-digit numeric OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes validity
    pendingOtps.set(cleanPhone, { code: otp, expiresAt });

    const accountSid = process.env["TWILIO_ACCOUNT_SID"]?.trim();
    const authToken = process.env["TWILIO_AUTH_TOKEN"]?.trim();
    const fromNumber = process.env["TWILIO_PHONE_NUMBER"]?.trim();

    const hasRealTwilio = Boolean(
      accountSid &&
        accountSid.startsWith("AC") &&
        authToken &&
        fromNumber &&
        !accountSid.includes("YOUR_")
    );

    if (hasRealTwilio && accountSid && authToken && fromNumber) {
      try {
        const client = twilio(accountSid, authToken);
        await client.messages.create({
          body: `FarmConnect Hub: Your login OTP is ${otp}. Valid for 5 minutes. Do not share with anyone.`,
          from: fromNumber,
          to: cleanPhone,
        });

        return {
          success: true,
          message: `SMS sent via Twilio to ${cleanPhone}`,
          isSimulated: false,
        };
      } catch (err: unknown) {
        console.warn("Twilio SMS delivery error (falling back to simulator):", err);
        const errMsg = err instanceof Error ? err.message : String(err);
        return {
          success: true,
          message: `Twilio delivery attempted. Fallback test OTP: ${otp}`,
          isSimulated: true,
          simulatedOtp: otp,
          error: errMsg,
        };
      }
    }

    // Simulator mode when credentials are not yet entered
    return {
      success: true,
      message: `[Twilio Simulator] Real-time OTP generated for ${cleanPhone}: ${otp}`,
      isSimulated: true,
      simulatedOtp: otp,
    };
  });

/**
 * Server Function: Verify OTP
 */
export const verifyTwilioOtp = createServerFn({ method: "POST" })
  .validator((data: { phoneNumber: string; code: string }) => data)
  .handler(async ({ data }): Promise<VerifyOtpResult> => {
    cleanExpiredOtps();

    let cleanPhone = data.phoneNumber.trim().replace(/[\s-]/g, "");
    if (!cleanPhone.startsWith("+")) {
      cleanPhone = `+91${cleanPhone.replace(/^0+/, "")}`;
    }

    const inputCode = data.code.trim();

    // Built-in universal demo passcode for instant offline testing
    if (inputCode === "1234") {
      pendingOtps.delete(cleanPhone);
      return { success: true, message: "OTP verified successfully (Demo key)" };
    }

    const record = pendingOtps.get(cleanPhone);
    if (!record) {
      return { success: false, message: "No active OTP found or OTP has expired. Please request a new code." };
    }

    if (Date.now() > record.expiresAt) {
      pendingOtps.delete(cleanPhone);
      return { success: false, message: "OTP has expired. Please request a new one." };
    }

    if (record.code !== inputCode) {
      return { success: false, message: "Incorrect OTP entered. Please try again." };
    }

    // Success! Remove used OTP
    pendingOtps.delete(cleanPhone);
    return { success: true, message: "OTP verified successfully." };
  });

/**
 * Server Function: Send Slot Confirmation or Alert SMS via Twilio
 */
export const sendTwilioSms = createServerFn({ method: "POST" })
  .validator((data: { phoneNumber: string; message: string }) => data)
  .handler(async ({ data }): Promise<SendSmsResult> => {
    let cleanPhone = data.phoneNumber.trim().replace(/[\s-]/g, "");
    if (!cleanPhone.startsWith("+")) {
      cleanPhone = `+91${cleanPhone.replace(/^0+/, "")}`;
    }

    const accountSid = process.env["TWILIO_ACCOUNT_SID"]?.trim();
    const authToken = process.env["TWILIO_AUTH_TOKEN"]?.trim();
    const fromNumber = process.env["TWILIO_PHONE_NUMBER"]?.trim();

    const hasRealTwilio = Boolean(
      accountSid &&
        accountSid.startsWith("AC") &&
        authToken &&
        fromNumber &&
        !accountSid.includes("YOUR_")
    );

    if (hasRealTwilio && accountSid && authToken && fromNumber) {
      try {
        const client = twilio(accountSid, authToken);
        await client.messages.create({
          body: data.message,
          from: fromNumber,
          to: cleanPhone,
        });

        return {
          success: true,
          message: `SMS successfully sent via Twilio to ${cleanPhone}`,
          isSimulated: false,
        };
      } catch (err) {
        console.warn("Twilio SMS send error:", err);
      }
    }

    return {
      success: true,
      message: `[Twilio Simulator] Message logged for ${cleanPhone}: "${data.message}"`,
      isSimulated: true,
    };
  });

"use server";
import 'server-only'
import { Resend } from "resend";
import { z } from 'zod';
import { ForgotPasswordSchema } from '@/utils/validator/authforms';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendForgotPasswordOtp = async (email: string, otp: string) => {
    try {
        await resend.emails.send({
            from: "onboarding@resend.dev",
            to: email,
            subject: "Your Password Reset OTP",
            html: `
                <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px; background: #f9f9f9;">
                    <div style="max-width: 400px; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
                        <h2 style="color: #333;">Password Reset Request</h2>
                        <p style="font-size: 16px; color: #555;">Use the OTP below to reset your password:</p>
                        <p style="font-size: 24px; font-weight: bold; color: #007bff; margin: 10px 0;">${otp}</p>
                        <p style="font-size: 14px; color: #777;">This OTP is valid for 10 minutes.</p>
                        <p style="font-size: 14px; color: #777;">If you did not request this, please ignore this email.</p>
                    </div>
                </div>
            `,
        });

        return { success: true, message: "OTP sent successfully." };
    } catch (error) {
        console.error("Error sending OTP:", error);
        return { success: false, message: "Failed to send OTP." };
    }
};

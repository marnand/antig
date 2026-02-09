import nodemailer from 'nodemailer';
import { config } from '../config/env';

export class EmailService {
    private transporter: nodemailer.Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: config.smtp.host,
            port: config.smtp.port,
            secure: config.smtp.port === 465, // true for 465, false for other ports
            auth: {
                user: config.smtp.user,
                pass: config.smtp.pass,
            },
        });
    }

    async sendEmail(to: string, subject: string, html: string): Promise<void> {
        try {
            await this.transporter.sendMail({
                from: config.smtp.user,
                to,
                subject,
                html,
            });
        } catch (error: any) {
            console.error(`Error sending email to ${to}:`, error.message);
            // Don't throw to avoid stopping the whole process, just log?
            // Or throw to allow retry? n8n behavior usually stops on error unless "Continue on Fail".
            // Let's throw for now.
            throw new Error(`Email sending failed: ${error.message}`);
        }
    }
}

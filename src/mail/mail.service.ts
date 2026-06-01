import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { verificationEmailTemplate } from './templates/verification.email';

@Injectable()
export class MailService {
    private transporter;
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST as string,
            port: parseInt(process.env.EMAIL_PORT as string),
            secure: false,
            auth: {
                user: process.env.EMAIL_USER as string,
                pass: process.env.EMAIL_PASS as string,
            },
        })
    }

    async sendEmail(to: string, otp: string) {
        return await this.transporter.sendMail({
            from: `"Nest Social Media" <${process.env.EMAIL_USER as string}>`,
            to,
            subject: 'Verify your email',
            html: verificationEmailTemplate(otp as string),
        });
    }
}

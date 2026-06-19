import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import {
  verificationEmailTemplate,
  verificationSuccessTemplate,
} from '../templates/verification.email';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;
  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('EMAIL_HOST'),
      port: parseInt(this.configService.get<string>('EMAIL_PORT', '587')),
      secure: false,
      auth: {
        user: this.configService.get<string>('EMAIL_USER'),
        pass: this.configService.get<string>('EMAIL_PASS'),
      },
    });
  }

  async sendEmail(to: string, otp: string): Promise<unknown> {
    const fromEmail = this.configService.get<string>('EMAIL_USER');
    return (await this.transporter.sendMail({
      from: `"Nest Social Media" <${fromEmail}>`,
      to,
      subject: 'Verify your email',
      html: verificationEmailTemplate(otp),
    })) as unknown;
  }

  async sendVerificationSuccessEmail(
    to: string,
    name: string,
  ): Promise<unknown> {
    const fromEmail = this.configService.get<string>('EMAIL_USER');
    return (await this.transporter.sendMail({
      from: `"Nest Social Media" <${fromEmail}>`,
      to,
      subject: 'Email Verified',
      html: verificationSuccessTemplate(name),
    })) as unknown;
  }
}

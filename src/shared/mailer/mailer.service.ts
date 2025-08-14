import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailerService {
  private readonly logger = new Logger(MailerService.name);
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get<string>('EMAIL_USER'),
        pass: this.configService.get<string>('EMAIL_PASSWORD'),
      },
      host: this.configService.get<string>('EMAIL_HOST'),
      port: this.configService.get<number>('EMAIL_PORT'),
      // This sets the 'secure' option to true if the email port is 465 (standard secure port for SMTPS),
      // and false otherwise. This is important because:
      // - Port 465 typically uses implicit TLS/SSL encryption
      // - Other ports may use STARTTLS or no encryption
      // - The secure flag ensures proper encryption handling for the connection
      secure: this.configService.get<number>('EMAIL_PORT') === 465,
    });
  }

  async sendMail(
    to: string,
    subject: string,
    html: string,
    text?: string,
  ): Promise<void> {
    if (!to || !subject || !html) {
      throw new Error('Missing required email parameters');
    }

    console.log('EMAIL_FROM', this.configService.get<string>('EMAIL_FROM'));
    console.log('to', to);
    console.log('subject', subject);

    const mailOptions = {
      from: this.configService.get<string>('EMAIL_FROM'),
      to,
      subject,
      html, // ✅ use HTML content here
      text: text || '', // optional plain-text fallback
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      this.logger.error('Error sending email:', error);
      throw error;
    }
  }
}

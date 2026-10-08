import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';
import { promises as dns } from 'dns';
import { isIP } from 'net';

export interface InvitationEmailParams {
  to: string;
  tripId: string;
  tripName: string;
  inviterName: string;
}

/** Escape user-provided text before interpolating it into HTML email. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Outbound email via SMTP (Nodemailer).
 * If SMTP is not configured the service logs a warning and reports
 * `delivered = false` — the UI must not claim an email was sent.
 */
@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  /** Cached transporter — only cached once the SMTP host resolved cleanly. */
  private transporter: Transporter | null = null;

  constructor(private readonly config: ConfigService) {
    if (!this.config.get<string>('mail.host')) {
      this.logger.warn('SMTP_HOST not configured — invitation emails will not be sent');
    }
  }

  /**
   * Build the SMTP transporter, resolving the host with the OS resolver
   * (`dns.lookup`) and connecting to the IP. Nodemailer's own c-ares resolver
   * (`dns.resolve*`) can time out on some networks — which surfaces as
   * `EDNS queryA ETIMEOUT` and silently breaks delivery. Connecting by IP with
   * `tls.servername` keeps SNI + certificate validation against the hostname.
   */
  private async getTransporter(): Promise<Transporter | null> {
    if (this.transporter) return this.transporter;

    const host = this.config.get<string>('mail.host');
    if (!host) return null;

    let connectHost = host;
    let servername: string | undefined;
    if (!isIP(host)) {
      try {
        connectHost = (await dns.lookup(host, { family: 4 })).address;
        servername = host;
      } catch (err) {
        this.logger.warn(
          `SMTP host lookup failed for ${host}, connecting by hostname: ${err instanceof Error ? err.message : String(err)}`,
        );
      }
    }

    const transporter = nodemailer.createTransport({
      host: connectHost,
      port: parseInt(this.config.get<string>('mail.port') ?? '587', 10),
      secure: this.config.get<string>('mail.secure') === 'true',
      auth: this.config.get<string>('mail.user')
        ? {
            user: this.config.get<string>('mail.user')!,
            pass: this.config.get<string>('mail.pass') ?? '',
          }
        : undefined,
      ...(servername ? { tls: { servername } } : {}),
    });

    // Cache only when we bypassed nodemailer's own resolution, so a failed
    // lookup is retried on the next send instead of being cached broken.
    if (servername || isIP(host)) this.transporter = transporter;
    return transporter;
  }

  /** Returns true only when the email was actually accepted by the SMTP server. */
  async sendInvitationEmail({
    to,
    tripId,
    tripName,
    inviterName,
  }: InvitationEmailParams): Promise<boolean> {
    const transporter = await this.getTransporter();
    if (!transporter) return false;

    const webUrl = (this.config.get<string>('app.webUrl') ?? 'http://localhost:8081').replace(/\/+$/, '');
    const tripUrl = `${webUrl}/trip/${tripId}`;
    const from = this.config.get<string>('mail.from') ?? 'Atur Perjalanan <noreply@atur-perjalanan.app>';

    if (
      this.config.get<string>('appEnv') === 'production' &&
      /localhost|127\.0\.0\.1/.test(webUrl)
    ) {
      this.logger.warn(
        `APP_WEB_URL is "${webUrl}" in production — invitation links will be broken`,
      );
    }

    const safeTripName = escapeHtml(tripName);
    const safeInviterName = escapeHtml(inviterName);

    try {
      await transporter.sendMail({
        from,
        to,
        subject: `${inviterName} mengundangmu ke perjalanan "${tripName}"`,
        text: [
          'Hai,',
          '',
          `${inviterName} mengundangmu untuk bergabung ke perjalanan "${tripName}" di Atur Perjalanan.`,
          '',
          'Lihat detail dan jawab undangan lewat tautan berikut:',
          tripUrl,
          '',
          `Kalau kamu tidak mengenal ${inviterName}, abaikan saja email ini.`,
          '',
          '— Atur Perjalanan',
        ].join('\n'),
        html: `
          <div style="font-family: Arial, Helvetica, sans-serif; max-width: 480px; margin: 0 auto; color: #1A1A2E;">
            <h2 style="margin: 0 0 12px;">Kamu diundang ke perjalanan</h2>
            <p style="font-size: 14px; line-height: 1.6; margin: 0 0 8px;">
              <strong>${safeInviterName}</strong> mengundangmu untuk bergabung ke perjalanan
              <strong>${safeTripName}</strong> di Atur Perjalanan.
            </p>
            <p style="font-size: 14px; line-height: 1.6; margin: 0 0 24px;">
              Buka tautan di bawah untuk melihat detail dan menjawab undangan.
            </p>
            <a href="${tripUrl}"
               style="display: inline-block; background: #FF6B6B; color: #FFFFFF;
                      text-decoration: none; font-weight: 700; padding: 12px 24px;
                      border-radius: 14px;">
              Lihat Perjalanan
            </a>
            <p style="font-size: 12px; line-height: 1.6; color: #9091A0; margin: 24px 0 0;">
              Tombol tidak berfungsi? Salin tautan ini ke browser:<br>
              <a href="${tripUrl}" style="color: #9091A0;">${tripUrl}</a>
            </p>
            <hr style="border: none; border-top: 1px solid #EEEEEE; margin: 24px 0 16px;" />
            <p style="font-size: 12px; line-height: 1.6; color: #9091A0; margin: 0;">
              Atur Perjalanan — ubah wacana perjalanan menjadi kenyataan.<br>
              Kalau kamu tidak mengenal ${safeInviterName}, abaikan saja email ini.
            </p>
          </div>
        `,
      });
      return true;
    } catch (err) {
      this.logger.error(
        `Failed to send invitation email to ${to}: ${err instanceof Error ? err.message : String(err)}`,
      );
      return false;
    }
  }
}

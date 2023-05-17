import SMTPTransport from 'nodemailer/lib/smtp-transport';

export type Strategy = 'SMTP' | 'AWS';

export type Recipient = {
  to: string[];
  subject: string;
  from?: string;
  cc?: string[];
  cco?: string[];
  priority?: Priority;
};

export type CTX<T> = {
  title: string;
  variables: T & Record<string, string | number | boolean>;
};

export type Priority = 'high' | 'normal' | 'low';

export interface IEmailService {
  resetCC(): void;
  resetCCO(): void;
  test(
    recipient: Recipient,
    template: string,
  ): Promise<SMTPTransport.SentMessageInfo>;
  send<T>(
    recipient: Recipient,
    template: string,
    variables: CTX<T>,
  ): Promise<SMTPTransport.SentMessageInfo>;
}

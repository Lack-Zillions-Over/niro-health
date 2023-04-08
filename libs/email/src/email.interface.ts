import SMTPTransport from 'nodemailer/lib/smtp-transport';

export declare namespace Email {
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

  export interface Class {
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
}

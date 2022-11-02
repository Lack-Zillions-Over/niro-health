import SMTPTransport from 'nodemailer/lib/smtp-transport';

export declare namespace Nodemailer {
  export type Recipient = {
    from: string;
    to: string[];
    subject: string;
    cc?: string[];
    cco?: string[];
    priority?: Priority;
  };

  export type CTX = {
    title: string;
    variables: object;
  };

  export type Priority = 'high' | 'normal' | 'low';

  export interface Class {
    test(recipient: Recipient): Promise<SMTPTransport.SentMessageInfo>;
    send(
      recipient: Recipient,
      template: string,
      variables: CTX,
    ): Promise<SMTPTransport.SentMessageInfo>;
  }
}

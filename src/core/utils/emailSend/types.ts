import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { Nodemailer } from '@/core/libs/nodemailer/types';
import { VariablesLayoutAccountEmailConfirm } from '@/core/interfaces/variables-layout-account-email-confirm.interface';

export declare namespace EmailSend {
  export type Options = {
    from: string;
    email: string;
    subject: string;
    title: string;
    priority: Nodemailer.Priority;
    variables: VariablesLayoutAccountEmailConfirm;
  };

  export interface Class {
    accountEmailConfirm(
      email: string,
      username: string,
      token: string,
      temporarypass: string | null,
    ): Promise<SMTPTransport.SentMessageInfo>;
  }
}

import { JobOptions } from 'bull';

export const AccountActivateOptions: JobOptions = {
  attempts: 5, // * Number of times to attempt the job
  backoff: {
    type: 'fixed',
    delay: 300000, // ! 5 Minutes for each attempt
  },
};

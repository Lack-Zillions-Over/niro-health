import { JobOptions } from 'bull';

export const AccountActivateOptions: JobOptions = {
  attempts: 5, // * Number of times to attempt the job
  delay: 0, // * Delay this job for 0ms
  backoff: {
    type: 'fixed',
    delay: 300000, // ! 5 Minutes for each attempt
  },
};

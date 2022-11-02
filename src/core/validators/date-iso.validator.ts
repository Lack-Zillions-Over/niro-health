export const ValidateDateISO = (text: string) =>
  /^([0-9]{4})-([0-9]{2})-([0-9]{2})T([0-9]{2}):([0-9]{2}):([0-9]{2})\.([0-9]{3})Z$/.test(
    text,
  );
// * Pattern -> 2011-10-05T14:48:00.000Z

import { v4 as uuidv4 } from 'uuid';

declare function Occurrence(...args: number[]): string;

export class Random {
  /**
   * @description Returns a random integer between min (inclusive) and max (inclusive)
   */
  static INT(max: number): number {
    return Math.floor(max * Math.random());
  }

  /**
   * @description Returns a random string format of UUID
   */
  static UUID(): string {
    return uuidv4();
  }

  /**
   * @description Returns a random password
   */
  static PASSWORD(length = 12): string {
    return this.STRING(length);
  }

  /**
   * @description Returns a random string of characters
   */
  static STRING(
    length: number,
    characters?: Partial<{
      abc: string[];
      int: number[];
      specials: string[];
    }>,
  ): string {
    const abc = (characters && characters.abc) || [
        'a',
        'b',
        'c',
        'd',
        'e',
        'f',
        'g',
        'h',
        'i',
        'j',
        'k',
        'l',
        'm',
        'n',
        'o',
        'p',
        'q',
        'r',
        's',
        't',
        'u',
        'v',
        'w',
        'y',
        'z',
      ],
      ints = (characters && characters.int) || [1, 2, 3, 4, 5, 6, 7, 8, 9, 0],
      specials = (characters && characters.specials) || [
        '_',
        '-',
        '#',
        '@',
        '$',
      ],
      abc_length = abc.length - 1,
      ints_length = ints.length - 1,
      specials_length = specials.length - 1,
      occurrenceABC: typeof Occurrence = (uppercase: number) => {
        if (uppercase == 0 || uppercase == 2)
          return abc[Random.INT(abc_length + 1)].toUpperCase();

        return abc[Random.INT(abc_length + 1)].toLowerCase();
      },
      occurrenceInt: typeof Occurrence = () =>
        `${ints[Random.INT(ints_length + 1)]}`,
      occurrenceSpecial: typeof Occurrence = () =>
        specials[Random.INT(specials_length + 1)];

    let text = '';

    while (text.length < length) {
      const choice = Random.INT(3),
        uppercase = Random.INT(3);

      if (choice == 0) {
        const letter = occurrenceABC(uppercase);

        if (text[text.length - 1] === letter) continue;

        text += letter;
      } else if (choice == 1) {
        const letter = occurrenceInt();

        if (text[text.length - 1] === letter) continue;

        text += letter;
      } else if (choice == 2) {
        const letter = occurrenceSpecial();

        if (text[text.length - 1] === letter) continue;

        text += letter;
      }
    }

    return text;
  }
}

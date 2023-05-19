import { Inject, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import type { IRandomService, Occurrence, Characters } from '@app/random';
import type { IStringExService, Hash } from '@app/string-ex';

/**
 * @description The module provides a set of functions to generate random values.
 */
@Injectable()
export class RandomService implements IRandomService {
  constructor(
    @Inject('IStringExService')
    private readonly stringExService: IStringExService,
  ) {}

  /**
   * @description Returns a random integer between min and max.
   * @param max The max value
   */
  public int(max: number): number {
    return Math.floor(max * Math.random());
  }

  /**
   * @description Returns a random string format of HASH.
   * @param length The length of string
   * @param digest The digest of hash algorithm ("base64" | "base64url" | "hex")
   */
  public hash(length: number, digest: Hash.digest): string {
    return this.stringExService.hash(this.string(length), 'md5', digest);
  }

  /**
   * @description Returns a random string format of UUID.
   */
  public uuid(): string {
    return uuidv4();
  }

  /**
   * @description Returns a random password.
   * @param length The length of password
   */
  public password(length = 12): string {
    return this.string(length);
  }

  /**
   * @description Returns a random string of characters.
   * @param length The length of string
   * @param characters The characters to generate string
   */
  public string(length: number, characters?: Characters): string {
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
          return abc[this.int(abc_length + 1)].toUpperCase();

        return abc[this.int(abc_length + 1)].toLowerCase();
      },
      occurrenceInt: typeof Occurrence = () =>
        `${ints[this.int(ints_length + 1)]}`,
      occurrenceSpecial: typeof Occurrence = () =>
        specials[this.int(specials_length + 1)];

    let text = '';

    while (text.length < length) {
      const choice = this.int(3),
        uppercase = this.int(3);

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

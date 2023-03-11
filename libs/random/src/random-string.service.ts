import { Injectable } from '@nestjs/common';

import { v4 as uuidv4 } from 'uuid';

import { RandomString } from '@app/random/random-string.interface';
import { StringExService } from '@app/string-ex/string-ex.service';
import { StringEx } from '@app/string-ex/string-ex.interface';

@Injectable()
export class RandomStringService implements RandomString.Class {
  constructor(private readonly stringExService: StringExService) {}

  /**
   * @description Returns a random integer between min and max
   */
  public int(max: number): number {
    return Math.floor(max * Math.random());
  }

  /**
   * @description Returns a random string format of HASH
   */
  public hash(length: number, digest: StringEx.Hash.digest): string {
    return this.stringExService.hash(this.string(length), 'md5', digest);
  }

  /**
   * @description Returns a random string format of UUID
   */
  public uuid(): string {
    return uuidv4();
  }

  /**
   * @description Returns a random password
   */
  public password(length = 12): string {
    return this.string(length);
  }

  /**
   * @description Returns a random string of characters
   */
  public string(
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
      occurrenceABC: typeof RandomString.Occurrence = (uppercase: number) => {
        if (uppercase == 0 || uppercase == 2)
          return abc[this.int(abc_length + 1)].toUpperCase();

        return abc[this.int(abc_length + 1)].toLowerCase();
      },
      occurrenceInt: typeof RandomString.Occurrence = () =>
        `${ints[this.int(ints_length + 1)]}`,
      occurrenceSpecial: typeof RandomString.Occurrence = () =>
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

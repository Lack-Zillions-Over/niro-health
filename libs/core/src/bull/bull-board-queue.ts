import { BullAdapter } from '@bull-board/api/bullAdapter';
import { BaseAdapter } from '@bull-board/api/dist/src/queueAdapters/base';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

@Injectable()
export class BullBoardQueue {}

/**
 * @description This is a pool of queues that will be used by BullBoard.
 */
export const queuePool: Set<Queue> = new Set<Queue>();

/**
 * @description This is a function that will be used by BullBoard to get the queues.
 */
export const getBullBoardQueues = (): BaseAdapter[] => {
  const bullBoardQueues = [...queuePool].reduce((acc: BaseAdapter[], val) => {
    acc.push(new BullAdapter(val));
    return acc;
  }, []);

  return bullBoardQueues;
};

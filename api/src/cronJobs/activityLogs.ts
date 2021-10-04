import * as dotenv from 'dotenv';
import * as schedule from 'node-schedule';
// import { RABBITMQ_QUEUES } from '../data/constants';
import { ACTIVITY_LOG_ACTIONS, putActivityLog } from '../data/logUtils';
import { fetchSegment } from '../data/modules/segments/queryBuilder';
import { connect } from '../db/connection';
import { Segments } from '../db/models';
// import messageBroker from '../messageBroker';

/**
 * Send conversation messages to customer
 */
dotenv.config();

export const createActivityLogsFromSegments = async () => {
  await connect();

  const segments = await Segments.find({ name: { exists: true } });

  for (const segment of segments) {
    const result = await fetchSegment(segment, { returnFullDoc: true });

    const contentIds = result.map(c => c._id) || [];

    await putActivityLog({
      action: ACTIVITY_LOG_ACTIONS.CREATE_SEGMENT_LOG,
      data: { segment, contentIds, type: segment.contentType }
    });

    // messageBroker().sendMessage(RABBITMQ_QUEUES.AUTOMATIONS_TRIGGER, {
    //   type: segment.contentType,
    //   targets: result
    // });
  }
};

// setTimeout(() => {
//   createActivityLogsFromSegments();
// }, 5000);

/**
 * *    *    *    *    *    *
 * ┬    ┬    ┬    ┬    ┬    ┬
 * │    │    │    │    │    |
 * │    │    │    │    │    └ day of week (0 - 7) (0 or 7 is Sun)
 * │    │    │    │    └───── month (1 - 12)
 * │    │    │    └────────── day of month (1 - 31)
 * │    │    └─────────────── hour (0 - 23)
 * │    └──────────────────── minute (0 - 59)
 * └───────────────────────── second (0 - 59, OPTIONAL)
 */
schedule.scheduleJob('0 45 23 * * *', () => {
  createActivityLogsFromSegments();
});

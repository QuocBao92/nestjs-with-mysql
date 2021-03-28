/**
 * Copyright (c) 2020 OMRON HEALTHCARE Co.,Ltd. All rights reserved.
 */

/**
 * Time expire cache
 */
export const TIME_EXPIRE_CACHE = 3600000;

/**
 * Rank total alert
 */
export const RANK_TOTAL_ALERT = 4;

/**
 * Time Start Request
 */
export const TIME_START_DATE = 'T00:00:00';

/**
 * Time End Request
 */
export const TIME_END_DATE = 'T23:59:59';

/**
 * Time morning
 */
export const TIME_MORNING = '00:00';

/**
 * Time afternoon
 */
export const TIME_AFTERNOON = '12:00';

/**
 * Divide day number of Side Effect Rate
 */
export const NUMBER_DAY = 7;

/**
 * Encryption failed
 */
export const ENCRYPTION_FAILED = 'Encryption failed';

/**
 * Max time for run batch vital
 */
export const MAX_TIME_RUN_BATCH_VITAL = 43200000;

/**
 * Message batch vital running
 */
export const MSG_BATCH_VITAL_RUNNING = 'Batch summary vital is running';

/**
 * RegExp to check timezone format
 */
export const TIMEZONE = /^([+-](?:2[0-3]|[01][0-9]):[0-5][0-9])$/;

 /* Key to log output without encryption
 * supports only two layers
 * ex)
 *    [ parent, child ]
 *    [ parent, [child_1, child_2]]
 */
export const KEY_WITHOUT_ENCRYPTION = [
    ['result', ['code', 'message']],
];

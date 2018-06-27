/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import Joi from 'joi';
import { get } from 'lodash';
import { CMServerLibs } from '../../lib/lib';
import { wrapEsError } from '../../utils/error_wrappers';

// TODO: add license check pre-hook
// TODO: write to Kibana audit log file
const DEFAULT_NUM_TOKENS = 1;
export const createTokensRoute = (libs: CMServerLibs) => ({
  config: {
    validate: {
      payload: Joi.object({
        num_tokens: Joi.number()
          .optional()
          .default(DEFAULT_NUM_TOKENS)
          .min(1),
      }).allow(null),
    },
  },
  handler: async (request: any, reply: any) => {
    const numTokens = get(request, 'payload.num_tokens', DEFAULT_NUM_TOKENS);

    try {
      const tokens = await libs.tokens.createEnrollmentTokens(
        request,
        numTokens
      );
      reply({ tokens });
    } catch (err) {
      // TODO move this to kibana route thing in adapter
      return reply(wrapEsError(err));
    }
  },
  method: 'POST',
  path: '/api/beats/enrollment_tokens',
});
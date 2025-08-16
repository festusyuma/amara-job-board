import { EnvService } from '@amara/helpers/util';
import { Injectable } from '@nestjs/common';
import { Kysely, ParseJSONResultsPlugin, PostgresDialect } from 'kysely';
import { Pool } from 'pg';

import { DB } from './types';

@Injectable()
export class DbService extends Kysely<DB> {
  constructor(secrets: EnvService) {
    const dialect = new PostgresDialect({
      pool: new Pool({
        connectionString: secrets.get('DATABASE_URL'),
      }),
    });

    super({ dialect, plugins: [new ParseJSONResultsPlugin()] });
  }
}

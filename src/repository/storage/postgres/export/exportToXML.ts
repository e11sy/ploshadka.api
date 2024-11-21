import logger from '../../../../infrastructure/logging/index.js';
import { sequelize } from './initSequelize.js'
import path from 'path';
import fs from 'fs';
import QueryTypes from 'sequelize/lib/query-types';
import { fileURLToPath } from 'url';

/**
 * Get curren tdirectory
 */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * All tables from this list would be exported
 */
const tablesToExport = ['users', 'user_sessions', 'events'];

/**
 * Method that exports all database tables into XML dumps directory
 * @param sequelize - instance of the sequelize
 */
export async function exportToXML(): Promise<void> {
  logger.info('exporting to XML...');

  try {
    void sequelize.authenticate();

    logger.info('connection has been established successfully.')

    /**
     * For each table export into xml format
     */
    for(let tableName of tablesToExport) {
      /**
       * Get result of the table_to_xml postgres method, for each of the specified tables
       */
      const [ result, _metadata ] = await sequelize.query<{"table_to_xml": any}[]>
        ({
          query: `SELECT table_to_xml('${tableName}', false, true, '')`,
          values: ['table_to_xml'],
        },
        {
          type: QueryTypes.SELECT,
        });

      /**
       * Check format of the result and write it into dumps directory
       */
      if (result !== undefined && 'table_to_xml' in result && typeof result.table_to_xml === 'string') {
        const targetPath = path.join(__dirname, '../../../../../dumps', `${tableName}.xml`);
        fs.writeFileSync(targetPath, result.table_to_xml, 'utf-8');
      }
    };

    logger.info(`exports runned successfully`);

  } catch(error) {
    logger.error(`unable to connect to the database: ${error}`);
  } finally {
    await sequelize.close();
  }
}


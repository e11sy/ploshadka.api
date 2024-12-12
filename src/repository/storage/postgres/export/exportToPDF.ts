import { QueryTypes } from 'sequelize';
import logger from '../../../../infrastructure/logging/index.js';
import { sequelize } from './initSequelize.js';
import { create } from 'html-pdf-chrome';
import fs from 'fs/promises';

/**
 * Таблицы для экспорта
 */
const tablesToExport = ['users', 'user_sessions', 'events'];

logger.info('Exporting to PDF...');

async function exportToPDF() {
  try {
    await sequelize.authenticate();
    logger.info('Connection has been established successfully.');

    for (let table of tablesToExport) {
      // Получаем все данные из таблицы
      const result = await sequelize.query(
        `SELECT * FROM public.${table}`,
        {
          type: QueryTypes.SELECT,
        }
      );

      // Проверяем, что результат - это массив
      if (!Array.isArray(result)) {
        logger.error(`Expected an array but got an object for table ${table}`);
        continue;  // Пропускаем этот столбец, если результат не является массивом
      }

      // Если таблица пуста
      if (result.length === 0) {
        logger.info(`Table ${table} is empty`);
        continue;
      }

      const columns = Object.keys(result[0]); // Получаем имена столбцов

      // Генерируем HTML для таблицы
      const htmlContent = generateHTML(table, columns, result);

      // Генерируем PDF из HTML с использованием create
      const pdfResult = await create(htmlContent);

      // Сохраняем PDF в файл
      await fs.writeFile(`./dumps/pdf/${table}.pdf`, pdfResult.toStream());

      logger.info(`PDF file generated for table: public.${table}`);
    }
  } catch (error) {
    logger.error(`Unable to connect to the database: ${error}`);
  } finally {
    await sequelize.close();
  }
}

// Функция генерации HTML для таблицы
function generateHTML(table: string, columns: string[], data: any[]) {
  const tableRows = data.map((row) => {
    const rowHtml = columns.map((col) => `<td>${row[col]}</td>`).join('');
    return `<tr>${rowHtml}</tr>`;
  }).join('');

  return `
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
          }
          h1 {
            text-align: center;
            margin-bottom: 20px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
          }
          th {
            background-color: #f2f2f2;
          }
          td {
            word-break: break-word;
            max-width: 300px;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        </style>
      </head>
      <body>
        <h1>${table}</h1>
        <table>
          <thead>
            <tr>
              ${columns.map((col) => `<th>${col}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>
      </body>
    </html>
  `;
}

exportToPDF().then(() => {
  logger.info('PDF export completed!');
}).catch((error) => {
  logger.error('Error during PDF export:', error);
});

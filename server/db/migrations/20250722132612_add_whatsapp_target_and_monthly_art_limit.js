/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.alterTable('project', (table) => {
    table.string('whatsapp_target').nullable();
  });

  await knex.schema.alterTable('project', (table) => {
    table.integer('monthly_art_limit').nullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.raw(`
    ALTER TABLE project
      DROP COLUMN IF EXISTS whatsapp_target,
      DROP COLUMN IF EXISTS monthly_art_limit;
  `);
};

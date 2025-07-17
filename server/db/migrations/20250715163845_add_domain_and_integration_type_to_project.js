/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  // 1) adiciona `domain`
  await knex.schema.alterTable('project', (table) => {
    table.string('domain').nullable();
  });

  // 2) popula com o valor de subdomain
  await knex('project')
    .whereNull('domain')
    .update({ domain: knex.raw('subdomain') });

  // 3) torna NOT NULL
  await knex.schema.alterTable('project', (table) => {
    table.string('domain').notNullable().alter();
  });

  // 4) adiciona `integration_type`
  await knex.schema.alterTable('project', (table) => {
    table.text('integration_type').nullable();
  });

  // 5) popula com 'Sync'
  await knex('project').whereNull('integration_type').update({ integration_type: 'Sync' });

  // 6) torna NOT NULL
  await knex.schema.alterTable('project', (table) => {
    table.text('integration_type').notNullable().alter();
  });

  // 7) recria a constraint de enum
  await knex.schema.raw(`
    ALTER TABLE project
      DROP CONSTRAINT IF EXISTS project_integration_type_check,
      ADD CONSTRAINT project_integration_type_check
      CHECK (integration_type IN ('Sync','Boom Sistemas'));
  `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.raw(`
    ALTER TABLE project
      DROP CONSTRAINT IF EXISTS project_integration_type_check,
      DROP COLUMN IF EXISTS integration_type,
      DROP COLUMN IF EXISTS domain;
  `);
};

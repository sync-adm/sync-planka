/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  // 1) adiciona `domain` como nullable
  await knex.schema.alterTable('project', (table) => {
    table.string('domain').nullable();
  });

  // 2) backfill: preenche NULL com subdomain ou com valor default
  //    troque 'example.com' pelo domínio padrão desejado
  await knex.raw(`
    UPDATE project
      SET domain = COALESCE(subdomain, 'example.com')
    WHERE domain IS NULL;
  `);

  // 3) torna `domain` NOT NULL
  await knex.schema.alterTable('project', (table) => {
    table.string('domain').notNullable().alter();
  });

  // 4) adiciona `integration_type` como nullable
  await knex.schema.alterTable('project', (table) => {
    table.text('integration_type').nullable();
  });

  // 5) popula `integration_type` com 'Sync'
  await knex('project').whereNull('integration_type').update({ integration_type: 'Sync' });

  // 6) torna `integration_type` NOT NULL
  await knex.schema.alterTable('project', (table) => {
    table.text('integration_type').notNullable().alter();
  });

  // 7) (re)cria a constraint de enum para integration_type
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
  // Reverte tudo: remove a constraint e as colunas
  await knex.schema.raw(`
    ALTER TABLE project
      DROP CONSTRAINT IF EXISTS project_integration_type_check,
      DROP COLUMN IF EXISTS integration_type,
      DROP COLUMN IF EXISTS domain;
  `);
};

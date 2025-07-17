/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  // 1) Preenche todos os project.null domain com o valor default
  await knex('project').whereNull('domain').update({ domain: 'example.com' });

  // 2) Agora torna a coluna NOT NULL
  await knex.schema.alterTable('project', (table) => {
    table.string('domain').notNullable().alter();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  // Reverte apenas o NOT NULL; mantém o default que já foi aplicado
  await knex.schema.alterTable('project', (table) => {
    table.string('domain').nullable().alter();
  });
};

exports.up = async function (knex) {
  await knex.raw(`
    CREATE TYPE integration_type AS ENUM (
      'instagram',
      'facebook',
      'tiktok'
    );
  `);

  await knex.schema.createTable('project_integrations', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));

    table
      .bigInteger('project_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('project')
      .onDelete('CASCADE');

    table
      .enu('integration_type', null, {
        useNative: true,
        existingType: true,
        enumName: 'integration_type',
      })
      .notNullable();

    table.boolean('disabled').notNullable().defaultTo(false);
    table.jsonb('config').notNullable().defaultTo('{}');
    table.timestamps(true, true);

    table.index('project_id');
    table.index(['project_id', 'integration_type']);
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('project_integrations');
  await knex.raw('DROP TYPE IF EXISTS integration_type;');
};

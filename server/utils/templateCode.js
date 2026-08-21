import Setting from '../models/Setting.js';
import Template from '../models/Template.js';

export const TEMPLATE_CATEGORY_PREFIX = Object.freeze({
  wedding: 'A',
  baptism: 'B',
  birth: 'C',
  corporate: 'D',
  engagement: 'E'
});

export const templateCodeForCategory = (category, sequence) => {
  const prefix = TEMPLATE_CATEGORY_PREFIX[category];
  if (!prefix) throw new Error(`Unsupported template category: ${category}`);
  return `${prefix}${Math.max(1, Math.floor(Number(sequence) || 1))}`;
};

const counterKey = (category) => `templateCodeSequence:${category}`;

let backfillPromise;

export const ensureTemplateCodes = async () => {
  if (backfillPromise) return backfillPromise;
  backfillPromise = (async () => {
    const templates = await Template.find({ category: { $in: Object.keys(TEMPLATE_CATEGORY_PREFIX) } })
      .select('_id code category createdAt')
      .sort({ createdAt: 1, _id: 1 });
    const grouped = Object.groupBy
      ? Object.groupBy(templates, (template) => template.category)
      : templates.reduce((groups, template) => {
        (groups[template.category] ||= []).push(template);
        return groups;
      }, {});

    const needsMigration = templates.some((template) => {
      const items = grouped[template.category] || [];
      const expected = templateCodeForCategory(template.category, items.findIndex((item) => item._id.equals(template._id)) + 1);
      return template.code !== expected;
    });

    if (needsMigration) {
      await Template.updateMany({ _id: { $in: templates.map((template) => template._id) } }, { $unset: { code: 1 } });
      for (const [category, items] of Object.entries(grouped)) {
        for (let index = 0; index < items.length; index += 1) {
          await Template.updateOne({ _id: items[index]._id }, { $set: { code: templateCodeForCategory(category, index + 1) } });
        }
      }
    }

    await Promise.all(Object.entries(grouped).map(([category, items]) => Setting.findOneAndUpdate(
      { key: counterKey(category) },
      { $max: { 'value.sequence': items.length } },
      { upsert: true, setDefaultsOnInsert: true }
    )));
  })().catch((error) => {
    backfillPromise = null;
    throw error;
  });
  return backfillPromise;
};

export const nextTemplateCode = async (category) => {
  if (!TEMPLATE_CATEGORY_PREFIX[category]) throw new Error('A valid template category is required');
  await ensureTemplateCodes();
  const counter = await Setting.findOneAndUpdate(
    { key: counterKey(category) },
    { $inc: { 'value.sequence': 1 } },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
  return templateCodeForCategory(category, counter.value.sequence);
};

export const reindexTemplateCodes = async (category) => {
  if (!TEMPLATE_CATEGORY_PREFIX[category]) throw new Error('A valid template category is required');

  const templates = await Template.find({ category })
    .select('_id')
    .sort({ createdAt: 1, _id: 1 });

  await Template.updateMany(
    { _id: { $in: templates.map((template) => template._id) } },
    { $unset: { code: 1 } }
  );

  for (let index = 0; index < templates.length; index += 1) {
    await Template.updateOne(
      { _id: templates[index]._id },
      { $set: { code: templateCodeForCategory(category, index + 1) } }
    );
  }

  await Setting.findOneAndUpdate(
    { key: counterKey(category) },
    { $set: { value: { sequence: templates.length } } },
    { upsert: true, setDefaultsOnInsert: true }
  );
};

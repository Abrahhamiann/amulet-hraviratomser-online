import Setting from '../models/Setting.js';
import Template from '../models/Template.js';
import { PUBLIC_DESIGN_KEYS } from './templateDesign.js';

export const TEMPLATE_CATEGORY_PREFIX = Object.freeze({
  wedding: 'A',
  baptism: 'B',
  birth: 'C',
  engagement: 'D',
  corporate: 'E',
  new_year: 'F',
  meeting: 'G',
  military: 'H'
});

export const templateCodeForCategory = (category, sequence) => {
  const prefix = TEMPLATE_CATEGORY_PREFIX[category];
  if (!prefix) throw new Error(`Unsupported template category: ${category}`);
  return `${prefix}${Math.max(1, Math.floor(Number(sequence) || 1))}`;
};

const counterKey = (category) => `templateCodeSequence:${category}`;
const templateCategories = Object.keys(TEMPLATE_CATEGORY_PREFIX);

let backfillPromise;

export const ensureTemplateCodes = async () => {
  if (backfillPromise) return backfillPromise;
  backfillPromise = (async () => {
    // Legacy/private templates are not shown in either the admin catalog or
    // the public site and must not reserve codes such as A1.
    await Template.updateMany(
      { designKey: { $nin: PUBLIC_DESIGN_KEYS }, code: { $exists: true } },
      { $unset: { code: 1 } }
    );
    await Template.updateMany(
      { deletedAt: { $ne: null }, code: { $exists: true } },
      { $unset: { code: 1 } }
    );

    const templates = await Template.find({
      category: { $in: templateCategories },
      designKey: { $in: PUBLIC_DESIGN_KEYS },
      deletedAt: null
    })
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
      const codeUpdates = Object.entries(grouped).flatMap(([category, items]) => items.map((template, index) => ({
        updateOne: {
          filter: { _id: template._id },
          update: { $set: { code: templateCodeForCategory(category, index + 1) } }
        }
      })));
      if (codeUpdates.length) await Template.bulkWrite(codeUpdates);
    }

    // Counters must mirror the database exactly. Using $max here left stale
    // counters behind when a category became empty, so its next first item
    // incorrectly started at 2 (A2, B2, ...).
    await Promise.all(templateCategories.map((category) => Setting.findOneAndUpdate(
      { key: counterKey(category) },
      { $set: { value: { sequence: (grouped[category] || []).length } } },
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

  const templates = await Template.find({ category, designKey: { $in: PUBLIC_DESIGN_KEYS }, deletedAt: null })
    .select('_id')
    .sort({ createdAt: 1, _id: 1 });

  await Template.updateMany(
    { _id: { $in: templates.map((template) => template._id) } },
    { $unset: { code: 1 } }
  );

  if (templates.length) {
    await Template.bulkWrite(templates.map((template, index) => ({
      updateOne: {
        filter: { _id: template._id },
        update: { $set: { code: templateCodeForCategory(category, index + 1) } }
      }
    })));
  }

  await Setting.findOneAndUpdate(
    { key: counterKey(category) },
    { $set: { value: { sequence: templates.length } } },
    { upsert: true, setDefaultsOnInsert: true }
  );
};

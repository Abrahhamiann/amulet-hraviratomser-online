import Setting from '../models/Setting.js';
import Template from '../models/Template.js';

const TEMPLATE_DELETION_PREFIX = 'templateDeletion:';

export const templateDeletionKey = (slug) => `${TEMPLATE_DELETION_PREFIX}${String(slug || '').trim().toLowerCase()}`;

export const hasTemplateDeletionMarker = async (slug) => Boolean(await Setting.exists({
  key: templateDeletionKey(slug)
}));

export const markTemplateDeleted = async ({ slug, deletedAt, deletedBy }) => Setting.findOneAndUpdate(
  { key: templateDeletionKey(slug) },
  {
    $set: {
      value: {
        slug,
        deletedAt: deletedAt || new Date(),
        deletedBy: deletedBy ? String(deletedBy) : null
      }
    }
  },
  { upsert: true, new: true, setDefaultsOnInsert: true }
);

export const clearTemplateDeletionMarker = async (slug) => Setting.deleteOne({
  key: templateDeletionKey(slug)
});

export const deleteTemplatePermanently = async (template, deletedBy = null) => {
  const deletedAt = new Date();
  await markTemplateDeleted({
    slug: template.slug,
    deletedAt,
    deletedBy
  });
  await Template.deleteOne({ _id: template._id });
  return { deletedAt };
};

export const purgeSoftDeletedTemplates = async () => {
  const templates = await Template.find({ deletedAt: { $ne: null } })
    .select('_id slug deletedAt deletedBy')
    .lean();
  if (!templates.length) return 0;

  await Setting.bulkWrite(templates.map((template) => ({
    updateOne: {
      filter: { key: templateDeletionKey(template.slug) },
      update: {
        $set: {
          value: {
            slug: template.slug,
            deletedAt: template.deletedAt || new Date(),
            deletedBy: template.deletedBy ? String(template.deletedBy) : null
          }
        }
      },
      upsert: true
    }
  })));

  const result = await Template.deleteMany({ _id: { $in: templates.map((template) => template._id) } });
  return result.deletedCount || 0;
};

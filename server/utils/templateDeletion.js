import Setting from '../models/Setting.js';

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

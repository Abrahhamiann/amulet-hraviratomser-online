import Setting from '../models/Setting.js';
import Template from '../models/Template.js';
import { reindexTemplateCodes } from './templateCode.js';

const MIGRATION_KEY = 'migration:removeLegacyEngagementTemplates:v1';

export const removeLegacyEngagementTemplates = async () => {
  const completed = await Setting.exists({ key: MIGRATION_KEY });
  if (completed) return 0;

  const result = await Template.deleteMany({
    $or: [
      { category: 'engagement' },
      { designKey: 'ever-after' }
    ]
  });

  await reindexTemplateCodes('engagement');
  await Setting.findOneAndUpdate(
    { key: MIGRATION_KEY },
    { $set: { value: { completedAt: new Date(), deleted: result.deletedCount || 0 } } },
    { upsert: true, setDefaultsOnInsert: true }
  );

  return result.deletedCount || 0;
};

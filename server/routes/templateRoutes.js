import express from 'express';
import {
  createTemplate,
  deleteTemplate,
  getTemplate,
  getTemplates,
  updateTemplate
} from '../controllers/templateController.js';
import { adminOnly, protect } from '../middleware/auth.js';
import { validateObjectId } from '../middleware/validateObjectId.js';

const router = express.Router();

router.route('/').get(getTemplates).post(protect, adminOnly, createTemplate);
router
  .route('/:id')
  .get(validateObjectId(), getTemplate)
  .put(validateObjectId(), protect, adminOnly, updateTemplate)
  .delete(validateObjectId(), protect, adminOnly, deleteTemplate);

export default router;

const express = require('express');
const { body, validationResult } = require('express-validator');
const prisma = require('../config/database');
const logger = require('../config/logger');

const router = express.Router();

// Validation rules for creating statuses
const createStatusValidation = [
  body('statusKey').optional().trim().isLength({ min: 1, max: 50 }).withMessage('Status key is required and must be less than 50 characters'),
  body('status_key').optional().trim().isLength({ min: 1, max: 50 }).withMessage('Status key is required and must be less than 50 characters'),
  body('statusLabel').optional().trim().isLength({ min: 1, max: 100 }).withMessage('Status label is required and must be less than 100 characters'),
  body('status_label').optional().trim().isLength({ min: 1, max: 100 }).withMessage('Status label is required and must be less than 100 characters'),
  body('statusColor').optional().matches(/^#[0-9A-Fa-f]{6}$/).withMessage('Status color must be a valid hex color'),
  body('status_color').optional().matches(/^#[0-9A-Fa-f]{6}$/).withMessage('Status color must be a valid hex color'),
  body('boardId').optional().isInt().withMessage('Board ID must be a valid integer'),
  body('board_id').optional().isInt().withMessage('Board ID must be a valid integer')
];

// Validation rules for updating statuses
const updateStatusValidation = [
  body('status_label').optional().trim().isLength({ min: 1, max: 100 }).withMessage('Status label must be less than 100 characters'),
  body('status_color').optional().matches(/^#[0-9A-Fa-f]{6}$/).withMessage('Status color must be a valid hex color'),
  body('position').optional().isInt().withMessage('Position must be a valid integer')
];

// GET /api/statuses/board/:boardId - Get all statuses for a board
router.get('/board/:boardId', async (req, res) => {
  try {
    const { boardId } = req.params;
    
    const statuses = await prisma.boardStatus.findMany({
      where: { boardId: parseInt(boardId) },
      orderBy: { position: 'asc' }
    });
    
    logger.info('Statuses fetched for board', { boardId, count: statuses.length });
    res.json(statuses);
  } catch (error) {
    logger.error('Error fetching statuses:', error);
    res.status(500).json({ error: 'Error fetching statuses' });
  }
});

// POST /api/statuses - Create new status
router.post('/', createStatusValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { 
      boardId, board_id, 
      statusKey, status_key, 
      statusLabel, status_label, 
      statusColor, status_color = '#6b7280' 
    } = req.body;
    
    // Use camelCase values if available, fallback to snake_case
    const finalBoardId = boardId || board_id;
    const finalStatusKey = statusKey || status_key;
    const finalStatusLabel = statusLabel || status_label;
    const finalStatusColor = statusColor || status_color;

    // Check if status key already exists for this board
    const existingKey = await prisma.boardStatus.findFirst({
      where: { 
        boardId: parseInt(finalBoardId),
        statusKey: finalStatusKey
      }
    });

    if (existingKey) {
      return res.status(400).json({ 
        error: `Column key "${finalStatusKey}" is already used. Please choose a different key for your column.` 
      });
    }

    // Check if status label already exists for this board
    const existingLabel = await prisma.boardStatus.findFirst({
      where: { 
        boardId: parseInt(finalBoardId),
        statusLabel: finalStatusLabel
      }
    });

    if (existingLabel) {
      return res.status(400).json({ 
        error: `Column name "${finalStatusLabel}" is already taken. Please choose a unique name for your column.` 
      });
    }

    // Get the next position
    const maxPosition = await prisma.boardStatus.aggregate({
      where: { boardId: parseInt(finalBoardId) },
      _max: { position: true }
    });
    const position = (maxPosition._max.position || -1) + 1;

    const newStatus = await prisma.boardStatus.create({
      data: {
        boardId: parseInt(finalBoardId),
        statusKey: finalStatusKey,
        statusLabel: finalStatusLabel,
        statusColor: finalStatusColor,
        position: position
      }
    });

    logger.info('Status created successfully', { statusId: newStatus.id, boardId: finalBoardId });
    res.status(201).json(newStatus);
  } catch (error) {
    logger.error('Error creating status:', error);
    res.status(500).json({ error: 'Error creating status' });
  }
});

// PUT /api/statuses/:id - Update status
router.put('/:id', updateStatusValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { status_label, status_color, position } = req.body;

    // Get the current status to check for duplicates
    const currentStatus = await prisma.boardStatus.findUnique({
      where: { id: parseInt(id) }
    });

    if (!currentStatus) {
      return res.status(404).json({ error: 'Status not found' });
    }

    // Check for duplicate status label if it's being updated
    if (status_label && status_label !== currentStatus.statusLabel) {
      const existingLabel = await prisma.boardStatus.findFirst({
        where: { 
          boardId: currentStatus.boardId,
          statusLabel: status_label,
          id: { not: parseInt(id) }
        }
      });

      if (existingLabel) {
        return res.status(400).json({ 
          error: `Column name "${status_label}" is already taken. Please choose a unique name for your column.` 
        });
      }
    }

    // Build update data object
    const updateData = {};
    if (status_label !== undefined) updateData.statusLabel = status_label;
    if (status_color !== undefined) updateData.statusColor = status_color;
    if (position !== undefined) updateData.position = position;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    const updatedStatus = await prisma.boardStatus.update({
      where: { id: parseInt(id) },
      data: updateData
    });

    logger.info('Status updated successfully', { statusId: id });
    res.json(updatedStatus);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Status not found' });
    }
    logger.error('Error updating status:', error);
    res.status(500).json({ error: 'Error updating status' });
  }
});

// DELETE /api/statuses/:id - Delete status
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if status exists
    const status = await prisma.boardStatus.findUnique({
      where: { id: parseInt(id) }
    });

    if (!status) {
      return res.status(404).json({ error: 'Status not found' });
    }

    // Check if there are tasks using this status
    const taskCount = await prisma.task.count({
      where: { 
        boardId: status.boardId,
        statusKey: status.statusKey
      }
    });

    if (taskCount > 0) {
      return res.status(400).json({ 
        error: `Cannot delete "${status.statusLabel}" column because it contains ${taskCount} task${taskCount === 1 ? '' : 's'}. Please move all tasks to other columns first, then try deleting this column again.` 
      });
    }

    await prisma.boardStatus.delete({
      where: { id: parseInt(id) }
    });

    logger.info('Status deleted successfully', { statusId: id });
    res.json({ message: 'Status deleted successfully' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Status not found' });
    }
    logger.error('Error deleting status:', error);
    res.status(500).json({ error: 'Error deleting status' });
  }
});

module.exports = router;

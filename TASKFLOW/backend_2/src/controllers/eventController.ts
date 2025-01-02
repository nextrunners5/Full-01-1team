import { Request, Response } from 'express';
import db from '../models';

export const getAllEvents = async (req: Request, res: Response) => {
  try {
    const events = await db.Event.findAll();
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: '일정 목록을 불러오는데 실패했습니다.' });
  }
};

export const getEventById = async (req: Request, res: Response) => {
  try {
    const event = await db.Event.findByPk(req.params.id);
    if (!event) {
      return res.status(404).json({ error: '일정을 찾을 수 없습니다.' });
    }
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: '일정 정보를 불러오는데 실패했습니다.' });
  }
};

export const createEvent = async (req: Request, res: Response) => {
  try {
    const event = await db.Event.create(req.body);
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ error: '일정 생성에 실패했습니다.' });
  }
};

export const updateEvent = async (req: Request, res: Response) => {
  try {
    const [updated] = await db.Event.update(req.body, {
      where: { id: req.params.id }
    });
    if (!updated) {
      return res.status(404).json({ error: '일정을 찾을 수 없습니다.' });
    }
    const updatedEvent = await db.Event.findByPk(req.params.id);
    res.json(updatedEvent);
  } catch (error) {
    res.status(500).json({ error: '일정 수정에 실패했습니다.' });
  }
};

export const deleteEvent = async (req: Request, res: Response) => {
  try {
    const deleted = await db.Event.destroy({
      where: { id: req.params.id }
    });
    if (!deleted) {
      return res.status(404).json({ error: '일정을 찾을 수 없습니다.' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: '일정 삭제에 실패했습니다.' });
  }
}; 
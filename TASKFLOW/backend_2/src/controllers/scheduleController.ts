import { Request, Response } from 'express';
import db from '../models';

export const getAllSchedules = async (req: Request, res: Response) => {
  try {
    const schedules = await db.Schedule.findAll();
    res.json(schedules);
  } catch (error) {
    res.status(500).json({ error: '일정 목록을 불러오는데 실패했습니다.' });
  }
};

export const createSchedule = async (req: Request, res: Response) => {
  try {
    const schedule = await db.Schedule.create(req.body);
    res.status(201).json(schedule);
  } catch (error) {
    res.status(500).json({ error: '일정 생성에 실패했습니다.' });
  }
};

export const updateSchedule = async (req: Request, res: Response) => {
  try {
    const [updated] = await db.Schedule.update(req.body, {
      where: { id: req.params.id }
    });
    if (!updated) {
      return res.status(404).json({ error: '일정을 찾을 수 없습니다.' });
    }
    const updatedSchedule = await db.Schedule.findByPk(req.params.id);
    res.json(updatedSchedule);
  } catch (error) {
    res.status(500).json({ error: '일정 수정에 실패했습니다.' });
  }
};

export const deleteSchedule = async (req: Request, res: Response) => {
  try {
    const deleted = await db.Schedule.destroy({
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

export const getSchedulesByProject = async (req: Request, res: Response) => {
  try {
    const schedules = await db.Schedule.findAll({
      where: { projectId: req.params.projectId }
    });
    res.json(schedules);
  } catch (error) {
    res.status(500).json({ error: '프로젝트 일정을 불러오는데 실패했습니다.' });
  }
}; 
import { Schedule } from '../services/scheduleApi';

export interface CalendarEvent {
  id: number | null;
  title: string;
  description: string;
  start: Date;
  end: Date;
}

export const convertScheduleToEvent = (schedule: Schedule): CalendarEvent => ({
  id: schedule.id,
  title: schedule.title,
  description: schedule.description,
  start: new Date(schedule.start_date),
  end: new Date(schedule.end_date)
});

export const convertEventToSchedule = (event: CalendarEvent): Omit<Schedule, 'id'> => ({
  title: event.title,
  description: event.description,
  start_date: event.start.toISOString(),
  end_date: event.end.toISOString()
}); 
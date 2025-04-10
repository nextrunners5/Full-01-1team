declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.svg';
declare module 'react-big-calendar' {
  import { ComponentType } from 'react';
  import { Moment } from 'moment';
  
  export interface Calendar {
    // Calendar 관련 타입 정의
  }
  
  export const Calendar: ComponentType<any>;
  export const dateFnsLocalizer: any;
  export const momentLocalizer: (moment: any) => any;
  
  export interface ToolbarProps {
    onNavigate: (action: 'PREV' | 'NEXT' | 'TODAY' | 'DATE') => void;
    onView: (view: string) => void;
    label: string;
  }

  export type View = 'month' | 'week' | 'day' | 'agenda';
}

declare module 'react-big-calendar/lib/localizers/moment';
declare module 'react-dom/client'; 
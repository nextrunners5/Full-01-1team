declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.svg';
declare module 'react-big-calendar' {
  export interface ToolbarProps {
    onNavigate: (action: 'PREV' | 'NEXT' | 'TODAY' | 'DATE') => void;
    onView: (view: string) => void;
    label: string;
  }

  export type View = 'month' | 'week' | 'day' | 'agenda';
}
declare module 'react-dom/client'; 
export type ISchedule = {
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  trainerId: string;
};

export type IScheduleFilterRequest = {
  startDate?: string | undefined;
  endDate?: string | undefined;
};

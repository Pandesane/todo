export class Time {
  hour: number;
  minute: number;

  constructor(time_str: string) {
    let time_arr = time_str.split(':');
    this.hour = Number.parseInt(time_arr[0]);
    this.minute = Number.parseInt(time_arr[1]);
  }

  getTime() {
    let pm_or_am = 'AM';
    let new_hour = this.hour;
    if (this.hour > 12) {
      pm_or_am = 'PM';
      new_hour -= 12;
    }

    return `${new_hour}:${this.minute} ${pm_or_am}`;
  }


  static formatTime(timeInSeconds: number): string {
    let hours = Math.floor(Math.floor(timeInSeconds) / (60 * 60));
    let minutes = Math.floor(Math.floor(timeInSeconds - hours * 60 * 60) / 60);
    let seconds = Math.floor(
      Math.floor(timeInSeconds - (hours * 60 * 60 + minutes * 60))
    );
    if (!(seconds < 60)) {
      seconds = 0;
    }
    if (!(minutes < 60)) {
      minutes = 0;
    }
    return `${Time.toString(hours)}:${Time.toString(minutes)}:${Time.toString(seconds)}`;
  }

  private static toString(time: number): string {
    let timeString = time.toString();
    if (timeString.length == 1) {
      timeString = "0" + timeString;
    }
    return timeString;
  }
}


type WeekDay = { label: string; value: number };

export const daysOfTheWeek: WeekDay[] = [
  {
    label: 'Sunday',
    value: 1
  },
  {
    label: 'Monday',
    value: 2
  },
  {
    label: 'Tuesday',
    value: 3
  },
  {
    label: 'Wednesday',
    value: 4
  },
  {
    label: 'Thursday',
    value: 5
  },
  {
    label: 'Friday',
    value: 6
  },
  {
    label: 'Saturday',
    value: 7
  }
];



export function getDayOfWeek(dayIndex: number) {
  return daysOfTheWeek[dayIndex - 1].label
}
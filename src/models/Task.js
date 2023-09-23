const { parse, format } = require('date-fns');

function getTimeDifferenceInDays(date) {
  const dueDateParts = date.split('/'); // Split the date string by '/'
  const day = parseInt(dueDateParts[0], 10); // Parse day as an integer
  const month = parseInt(dueDateParts[1], 10) - 1; // Parse month (subtract 1 as months are zero-based)
  const year = parseInt(dueDateParts[2], 10); // Parse year

  const taskDueDate = new Date(year, month, day);

  const currentDate = Date.now();

  const timeDifferenceInDays = Math.ceil(
    (taskDueDate - currentDate) / (1000 * 60 * 60 * 24)
  );
  return timeDifferenceInDays;
}

class Task {
  constructor(props) {
    this.name = props.name;
    this.dueDate = props.dueDate;
  }

  static calculateNextDueDate(todayDate, dueDate) {
    const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    if (!dueDate) {
      return null;
    }
    const dueDateLower = dueDate.toLowerCase();

    if (dueDateLower.includes('next')) {
      const dayOfWeek = daysOfWeek.find(day => dueDateLower.includes(day) || dueDateLower.includes(day.slice(0, 3)));
      if (dayOfWeek) {
        const targetDay = daysOfWeek.indexOf(dayOfWeek);
        const todayDay = todayDate.getDay();
        let daysUntilTarget = targetDay - todayDay;

        if (daysUntilTarget <= 0) {
          daysUntilTarget += 7; 
        }

        const nextDueDate = new Date(todayDate);
        nextDueDate.setDate(todayDate.getDate() + daysUntilTarget);

        return nextDueDate;
      } else if (dueDateLower.includes('week')) {
        const nextDueDate = new Date(todayDate);
        nextDueDate.setDate(todayDate.getDate() + 7); 
        return nextDueDate;
      }
    }

    return null;
  }


  static fromScannedText(text) {
    const dueDate = text.split('@')[1]?.trim();
    let name;

    if (dueDate) {
      name = text.match(/#(.*?)@/)[1].trim();
    } else {
      name = text.split('#')[1].trim();
    }

    const todayDate = new Date();
    const nextDueDate = this.calculateNextDueDate(todayDate, dueDate);

    if (nextDueDate) {
      const day = nextDueDate.getDate();
      const month = nextDueDate.getMonth() + 1;
      const year = nextDueDate.getFullYear();
      const modifiedDueDate = `${day}/${month}/${year}`;

      return new Task({ name, dueDate: modifiedDueDate });
    }

    return new Task({ name, dueDate });
  }


  static fromDisplayableText(text) {
    const dueDate = text.split('Due at: ')[1]?.trim();
    let name = text;
    if(dueDate) {
      name = text.split('Due at: ')[0].trim()
    }
    return new Task({ name, dueDate })
  }

  get formattedDateTime() {
    if(this.dueDate) {
      return format(parse(this.dueDate.trim(), 'dd/MM/yyyy', new Date()), 'MM/dd/yyyy');
    }
    return undefined;
  }

  get displayableDueDateText() {
    if(this.dueDate) {
      const difference = getTimeDifferenceInDays(this.dueDate);
      if (difference === 0) {
        return 'Due Today';
      }
      return difference < 0  ? 'Overdue' : `Due in ${difference} day${difference !== 1 ? 's' : ''}`;   
    }
    return undefined;
  }


  get displayableText() {
    if(this.dueDate) {
      return `${this.name}\nDue at: ${this.dueDate}`
    }
    return `${this.name}`;
  }

  get displayableIndicatorColor() {
    let indicatorColor = 'grey';
    if(this.dueDate) {
      const timeDifferenceInDays = getTimeDifferenceInDays(this.dueDate);
      if (timeDifferenceInDays <= 0 && timeDifferenceInDays <= 2) {
        indicatorColor = 'red';
      } else if (timeDifferenceInDays >= 3 && timeDifferenceInDays <= 5) {
        indicatorColor = 'orange';
      }
      else {
        indicatorColor = 'green';
      }
    }
    return indicatorColor;
  }
}

export default Task;

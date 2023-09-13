const { parse, format } = require('date-fns');

function getTimeDifferenceInDays(date) {
  const dueDateParts = date.split('/'); // Split the date string by '/'
  const day = parseInt(dueDateParts[0], 10); // Parse day as an integer
  const month = parseInt(dueDateParts[1], 10) - 1; // Parse month (subtract 1 as months are zero-based)
  const year = parseInt(dueDateParts[2], 10); // Parse year

  const taskDueDate = new Date(year, month, day);

  // Calculate the time difference between now and the due date
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

  static fromScannedText(text) {
    const dueDate = text.split('@')[1]?.trim();
    let name;
    if(dueDate) {
      name = text.match(/#(.*?)@/)[1].trim()
    } else {
      name = text.split('#')[1].trim()
    }
    return new Task({ name, dueDate })
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
      return difference <= 0  ? 'Done' : `Due in ${difference} day${difference !== 1 ? 's' : ''}`;
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
      if (timeDifferenceInDays >= 1 && timeDifferenceInDays <= 2) {
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
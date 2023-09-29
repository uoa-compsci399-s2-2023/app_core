import Task from '../../src/models/Task';

describe('Task', () => {
  describe('constructor', () => {
    it('should create a Task instance with the given props', () => {
      const props = { name: 'Test Task', dueDate: '15/09/2023' };
      const task = new Task(props);
      expect(task.name).toBe(props.name);
      expect(task.dueDate).toBe(props.dueDate);
    });
  });

  describe('fromScannedText', () => {
    it('should create a Task instance from scanned text with due date', () => {
      const scannedText = '#Test Task @15/09/2023';
      const task = Task.fromScannedText(scannedText, "#" , "@");
      expect(task.name).toBe('Test Task');
      expect(task.dueDate).toBe('15/09/2023');
    });

    it('should create a Task instance from scanned text without due date', () => {
      const scannedText = '#Test Task';
      const task = Task.fromScannedText(scannedText, "#" , "@");
      expect(task.name).toBe('Test Task');
      expect(task.dueDate).toBeUndefined();
    });
  });

  describe('fromDisplayableText', () => {
    it('should create a Task instance from displayable text with due date', () => {
      const displayableText = 'Test Task\nDue at: 15/09/2023';
      const task = Task.fromDisplayableText(displayableText, "#" , "@");
      expect(task.name).toBe('Test Task');
      expect(task.dueDate).toBe('15/09/2023');
    });

    it('should create a Task instance from displayable text without due date', () => {
      const displayableText = 'Test Task';
      const task = Task.fromDisplayableText(displayableText, "#" , "@");
      expect(task.name).toBe('Test Task');
      expect(task.dueDate).toBeUndefined();
    });
  });

  describe('formattedDateTime', () => {
    it('should return formatted due date when dueDate is defined', () => {
      const task = new Task({ name: 'Test Task', dueDate: '15/09/2023' });
      expect(task.formattedDateTime).toBe('09/15/2023');
    });

    it('should return undefined when dueDate is not defined', () => {
      const task = new Task({ name: 'Test Task' });
      expect(task.formattedDateTime).toBeUndefined();
    });
  });

  describe('displayableDueDateText', () => {
    it('should return "Overdue" when dueDate is in the past', () => {
      const task = new Task({ name: 'Test Task', dueDate: '01/01/2020' });
      expect(task.displayableDueDateText).toBe('Overdue');
    });

    it('should return undefined when dueDate is not defined', () => {
      const task = new Task({ name: 'Test Task' });
      expect(task.displayableDueDateText).toBeUndefined();
    });
  });

  describe('displayableText', () => {
    it('should return displayable text with name and due date', () => {
      const task = new Task({ name: 'Test Task', dueDate: '15/09/2023' });
      expect(task.displayableText).toBe('Test Task\nDue at: 15/09/2023');
    });

    it('should return displayable text with name only when dueDate is not defined', () => {
      const task = new Task({ name: 'Test Task' });
      expect(task.displayableText).toBe('Test Task');
    });
  });

  describe('displayableIndicatorColor', () => {

    it('should return "grey" when dueDate is not defined', () => {
      const task = new Task({ name: 'Test Task' });
      expect(task.displayableIndicatorColor).toBe('grey');
    });
  });

  describe('calculateNextDueDate', () => {
    it('should calculate the next due date for "next week"', () => {
      // Mock today's date (Saturday)
      const todayDate = new Date('2023-09-09T00:00:00Z'); // A Saturday
      const dueDate = 'next week';
      const nextDueDate = Task.calculateNextDueDate(todayDate, dueDate);
      const expectedNextDueDate = new Date('2023-09-16T00:00:00Z'); // Saturday of the following week
      expect(nextDueDate).toEqual(expectedNextDueDate);
    });

    it('should calculate the next due date for "next sunday"', () => {
      const todayDate = new Date('2023-09-09T00:00:00Z'); // A Saturday
      const dueDate = 'next sunday';
      const nextDueDate = Task.calculateNextDueDate(todayDate, dueDate);
      const expectedNextDueDate = new Date('2023-09-10T00:00:00Z'); // Sunday of this week
      expect(nextDueDate).toEqual(expectedNextDueDate);
    });

    it('should calculate the next due date for "next monday"', () => {
      const todayDate = new Date('2023-09-09T00:00:00Z'); // A Saturday
      const dueDate = 'next monday';
      const nextDueDate = Task.calculateNextDueDate(todayDate, dueDate);
      const expectedNextDueDate = new Date('2023-09-11T00:00:00Z'); // Monday of this week
      expect(nextDueDate).toEqual(expectedNextDueDate);
    });
  });


});

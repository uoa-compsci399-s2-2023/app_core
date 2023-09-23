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
      const task = Task.fromScannedText(scannedText);
      expect(task.name).toBe('Test Task');
      expect(task.dueDate).toBe('15/09/2023');
    });

    it('should create a Task instance from scanned text without due date', () => {
      const scannedText = '#Test Task';
      const task = Task.fromScannedText(scannedText);
      expect(task.name).toBe('Test Task');
      expect(task.dueDate).toBeUndefined();
    });
  });

  describe('fromDisplayableText', () => {
    it('should create a Task instance from displayable text with due date', () => {
      const displayableText = 'Test Task\nDue at: 15/09/2023';
      const task = Task.fromDisplayableText(displayableText);
      expect(task.name).toBe('Test Task');
      expect(task.dueDate).toBe('15/09/2023');
    });

    it('should create a Task instance from displayable text without due date', () => {
      const displayableText = 'Test Task';
      const task = Task.fromDisplayableText(displayableText);
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

});

import SingleChoiceQuestion from './SingleChoiceQuestion';
import MultipleChoiceQuestion from './MultipleChoiceQuestion';
import TextQuestion from './TextQuestion';
import SliderQuestion from './SliderQuestion';
import DateQuestion from './DateQuestion';
import FileUploadQuestion from './FileUploadQuestion';

export {
  SingleChoiceQuestion,
  MultipleChoiceQuestion,
  TextQuestion,
  SliderQuestion,
  DateQuestion,
  FileUploadQuestion
};

/**
 * Get the appropriate question component based on question type
 * @param {string} type - Question type
 * @returns {React.Component} Question component
 */
export const getQuestionComponent = (type) => {
  switch (type) {
    case 'single_choice':
      return SingleChoiceQuestion;
    case 'multiple_choice':
      return MultipleChoiceQuestion;
    case 'text':
      return TextQuestion;
    case 'slider':
      return SliderQuestion;
    case 'date':
      return DateQuestion;
    case 'file_upload':
      return FileUploadQuestion;
    default:
      return TextQuestion;
  }
};

export default {
  SingleChoiceQuestion,
  MultipleChoiceQuestion,
  TextQuestion,
  SliderQuestion,
  DateQuestion,
  FileUploadQuestion,
  getQuestionComponent
};

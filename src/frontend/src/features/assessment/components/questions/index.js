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
    case 'single-select': // Add support for single-select question type
    case 'single_choice':
      return SingleChoiceQuestion;
    case 'multi-select': // Add support for multi-select question type
    case 'multiple_choice':
      return MultipleChoiceQuestion;
    case 'text':
    case 'free-text-nlp': // Add support for NLP-enabled text questions
      return TextQuestion;
    case 'slider':
      return SliderQuestion;
    case 'date':
      return DateQuestion;
    case 'file_upload':
      return FileUploadQuestion;
    default:
      console.warn(`Unsupported question type: ${type}, falling back to TextQuestion`);
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

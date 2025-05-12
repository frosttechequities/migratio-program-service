import React, { Fragment } from 'react'; // Import Fragment
import {
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  FormLabel,
  Slider,
  Checkbox,
  FormGroup,
  Typography,
  Box,
  Button, // Ensure Button is imported
  Table, // For Matrix
  TableBody, // For Matrix
  TableCell, // For Matrix
  TableContainer, // For Matrix
  TableHead, // For Matrix
  TableRow, // For Matrix
  Paper // For Matrix container
} from '@mui/material';

// TODO: Refine matrix implementation based on actual data structure

const QuestionRenderer = ({ question, currentAnswer, onChange, disabled }) => {
  if (!question) {
    return null; // Or a loading/placeholder state
  }

  // Handler for simple value changes (text, number, date, radio)
  const handleValueChange = (event) => {
    onChange(event.target.value);
  };

  // Handler for checkbox group changes (multiple_choice)
  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    // Ensure currentAnswer is treated as an array for multi-choice
    const currentSelection = Array.isArray(currentAnswer) ? currentAnswer : [];
    let newSelection;
    if (checked) {
      newSelection = [...currentSelection, value];
    } else {
      newSelection = currentSelection.filter(v => v !== value);
    }
    onChange(newSelection); // Pass the updated array back
  };

   // Handler for file changes
   const handleFileChange = (event) => {
       if (event.target.files && event.target.files[0]) {
           onChange(event.target.files[0]); // Pass the File object
       } else {
           onChange(null);
       }
   };

   // Handler for slider changes
   const handleSliderChange = (event, newValue) => {
       onChange(newValue); // Slider passes the value directly
   };


  switch (question.type) {
    case 'text':
    case 'free-text-nlp': // Treat NLP text input like regular multiline text for now
      return (
        <TextField
          fullWidth
          variant="outlined"
          label={question.label || (question.type === 'free-text-nlp' ? "Your Detailed Answer" : "Your Answer")}
          value={currentAnswer || ''}
          onChange={handleValueChange}
          disabled={disabled}
          required={question.required}
          helperText={question.helpText || (question.type === 'free-text-nlp' ? "Please provide a detailed response." : '')}
          multiline={question.multiline || question.type === 'free-text-nlp'} // Default multiline for NLP
          rows={question.rows || (question.type === 'free-text-nlp' ? 4 : 1)} // Default rows
        />
      );

    case 'number':
      return (
        <TextField
          fullWidth
          variant="outlined"
          type="number"
          label={question.label || "Your Answer (Number)"}
          value={currentAnswer || ''}
          onChange={handleValueChange}
          disabled={disabled}
          required={question.required}
          inputProps={{
            min: question.validation?.min,
            max: question.validation?.max,
            step: question.validation?.step || 1,
          }}
          helperText={question.helpText}
        />
      );

    case 'single_choice':
      return (
        <FormControl component="fieldset" disabled={disabled} required={question.required} fullWidth>
          <FormLabel component="legend">{question.label || 'Select One'}</FormLabel>
          <RadioGroup
            aria-label={question.id || 'single-choice-group'}
            name={question.id || 'single-choice-group'}
            value={currentAnswer || ''}
            onChange={handleValueChange} // Use handleValueChange for radio
          >
            {(question.options || []).map((option) => (
              <FormControlLabel
                key={option.value}
                value={option.value}
                control={<Radio />}
                label={option.label}
              />
            ))}
          </RadioGroup>
           {question.helpText && <Typography variant="caption" display="block" sx={{ mt: 1 }}>{question.helpText}</Typography>}
        </FormControl>
      );

     case 'multiple_choice':
       const currentSelection = Array.isArray(currentAnswer) ? currentAnswer : [];
       return (
         <FormControl component="fieldset" disabled={disabled} required={question.required} fullWidth>
           <FormLabel component="legend">{question.label || 'Select All That Apply'}</FormLabel>
           <FormGroup>
             {(question.options || []).map((option) => (
               <FormControlLabel
                 key={option.value}
                 control={
                   <Checkbox
                     checked={currentSelection.includes(option.value)}
                     onChange={handleCheckboxChange} // Use specific handler for checkboxes
                     value={option.value}
                     disabled={disabled}
                   />
                 }
                 label={option.label}
               />
             ))}
           </FormGroup>
           {question.helpText && <Typography variant="caption" display="block" sx={{ mt: 1 }}>{question.helpText}</Typography>}
         </FormControl>
       );

    case 'date':
      return (
        <TextField
          fullWidth
          variant="outlined"
          type="date"
          label={question.label || "Select Date"}
          value={currentAnswer || ''} // Expects YYYY-MM-DD format
          onChange={handleValueChange} // Use handleValueChange for date
          disabled={disabled}
          required={question.required}
          InputLabelProps={{
            shrink: true, // Keep label floated for date input
          }}
          inputProps={{
            min: question.validation?.minDate, // Example: '1920-01-01'
            max: question.validation?.maxDate, // Example: '2024-12-31'
          }}
          helperText={question.helpText}
        />
      );

    case 'slider':
      // Ensure currentAnswer is a number for slider, default to min if not
      const sliderValue = typeof currentAnswer === 'number'
                          ? currentAnswer
                          : (question.validation?.min !== undefined ? question.validation.min : 0);
      return (
        <Box sx={{ px: 1 }}> {/* Add padding for slider */}
           <FormLabel component="legend" sx={{ mb: 1 }}>{question.label || 'Select Value'}</FormLabel>
           <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
             <Slider
                aria-label={question.id || 'slider-input'}
                value={sliderValue}
                onChange={handleSliderChange} // Use specific handler
                valueLabelDisplay="auto"
                step={question.validation?.step || 1}
                marks // Consider making marks conditional based on step/range
                min={question.validation?.min || 0}
                max={question.validation?.max || 100}
                disabled={disabled}
             />
             <Typography variant="body1" sx={{ minWidth: '40px', textAlign: 'right' }}>
                {sliderValue}
             </Typography>
           </Box>
           {question.helpText && <Typography variant="caption" display="block" sx={{ mt: 1 }}>{question.helpText}</Typography>}
        </Box>
      );

    case 'file':
       // Displaying the selected file name requires state in the parent (QuizInterface)
       // For now, just show the input button
       const fileName = currentAnswer instanceof File ? currentAnswer.name : 'No file chosen';
       return (
          <FormControl fullWidth required={question.required} disabled={disabled}>
             <FormLabel component="legend" sx={{ mb: 1 }}>{question.label || 'Upload File'}</FormLabel>
             <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                 <Button
                    variant="outlined"
                    component="label"
                    disabled={disabled}
                 >
                    Choose File
                    <input
                        type="file"
                        hidden
                        onChange={handleFileChange} // Use specific handler
                        accept={question.validation?.allowedTypes?.join(',')}
                    />
                 </Button>
                 <Typography variant="body2" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                    {fileName}
                 </Typography>
             </Box>
             {question.helpText && <Typography variant="caption" display="block" sx={{ mt: 1 }}>{question.helpText}</Typography>}
          </FormControl>
       );

    case 'matrix':
      // Assuming question.options defines columns and question.subQuestions defines rows
      // Assuming answer is an object like { [rowId]: columnValue }
      const matrixAnswer = typeof currentAnswer === 'object' && currentAnswer !== null ? currentAnswer : {};
      const subQuestions = question.subQuestions || []; // Needs definition in Question model or passed via props
      const columns = question.options || []; // Use options for columns

      const handleMatrixChange = (rowId, columnValue) => {
        onChange({
          ...matrixAnswer,
          [rowId]: columnValue,
        });
      };

      if (subQuestions.length === 0 || columns.length === 0) {
         return <Typography color="error">Matrix question improperly configured (missing subQuestions or options).</Typography>;
      }

      return (
        <FormControl component="fieldset" fullWidth required={question.required} disabled={disabled}>
           <FormLabel component="legend" sx={{ mb: 2 }}>{question.label || question.text}</FormLabel>
           <TableContainer component={Paper} variant="outlined">
             <Table size="small">
               <TableHead>
                 <TableRow>
                   <TableCell>{/* Empty corner */}</TableCell>
                   {columns.map((col) => (
                     <TableCell key={col.value} align="center" sx={{ fontWeight: 'medium' }}>
                       {col.label}
                     </TableCell>
                   ))}
                 </TableRow>
               </TableHead>
               <TableBody>
                 {subQuestions.map((row) => (
                   <TableRow key={row.id}> {/* Assuming subQuestions have an 'id' and 'text' */}
                     <TableCell component="th" scope="row">
                       {row.text}
                     </TableCell>
                     {columns.map((col) => (
                       <TableCell key={col.value} align="center">
                         <Radio
                           checked={matrixAnswer[row.id] === col.value}
                           onChange={() => handleMatrixChange(row.id, col.value)}
                           value={col.value}
                           name={`matrix-${question.id}-${row.id}`} // Unique name per row
                           disabled={disabled}
                           size="small"
                         />
                       </TableCell>
                     ))}
                   </TableRow>
                 ))}
               </TableBody>
             </Table>
           </TableContainer>
           {question.helpText && <Typography variant="caption" display="block" sx={{ mt: 1 }}>{question.helpText}</Typography>}
        </FormControl>
      );

    default:
      // Fallback for unsupported types
      return (
        <Box sx={{ p: 2, border: '1px solid red', color: 'red' }}>
          <Typography>Unsupported question type: {question.type || 'undefined'}</Typography>
          <Typography variant="caption">Question ID: {question.id}</Typography>
        </Box>
      );
  }
};

export default QuestionRenderer;

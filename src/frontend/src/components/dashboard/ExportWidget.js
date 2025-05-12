import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Paper,
  Typography,
  Box,
  Divider,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  FormControlLabel,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Snackbar,
  Alert,
  Tooltip
} from '@mui/material';
import {
  FileDownload as FileDownloadIcon,
  PictureAsPdf as PdfIcon,
  Description as DocIcon,
  TableChart as CsvIcon,
  Print as PrintIcon,
  Share as ShareIcon
} from '@mui/icons-material';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { useSelector } from 'react-redux';

/**
 * Export widget component for the dashboard
 * @param {Object} props - Component props
 * @param {Object} props.data - Dashboard data for export
 * @returns {React.ReactNode} Export widget component
 */
const ExportWidget = ({ data }) => {
  const { user } = useSelector((state) => state.auth);

  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [exportType, setExportType] = useState('');
  const [exportOptions, setExportOptions] = useState({
    includeOverview: true,
    includeRoadmap: true,
    includeDocuments: true,
    includeTasks: true,
    includeRecommendations: false
  });
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  // Handle export dialog open
  const handleExportDialogOpen = (type) => {
    setExportType(type);
    setExportDialogOpen(true);
  };

  // Handle export dialog close
  const handleExportDialogClose = () => {
    setExportDialogOpen(false);
  };

  // Handle export option change
  const handleExportOptionChange = (event) => {
    setExportOptions({
      ...exportOptions,
      [event.target.name]: event.target.checked
    });
  };

  // Handle snackbar close
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  // Show notification
  const showNotification = (message, severity = 'success') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  // Generate PDF export
  const generatePdfExport = () => {
    try {
      setLoading(true);

      // Create new PDF document
      const doc = new jsPDF();

      // Add title
      doc.setFontSize(20);
      doc.text('Visafy Immigration Dashboard Report', 20, 20);

      // Add date
      doc.setFontSize(10);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30);

      // Add user info
      doc.text(`User: ${user?.firstName} ${user?.lastName}`, 20, 35);
      doc.text(`Email: ${user?.email}`, 20, 40);

      let yPosition = 50;

      // Add overview section
      if (exportOptions.includeOverview && data?.overview) {
        doc.setFontSize(16);
        doc.text('Overview', 20, yPosition);
        yPosition += 10;

        const overview = data.overview;
        const overviewData = [
          ['Profile Completion', `${overview.profileCompletion}%`],
          ['Assessment Completion', `${overview.assessmentCompletion}%`],
          ['Roadmap Progress', `${overview.roadmapProgress}%`],
          ['Documents', `${overview.documentsUploaded}/${overview.documentsRequired}`],
          ['Tasks', `${overview.tasksCompleted}/${overview.totalTasks}`],
          ['Days Active', overview.daysActive]
        ];

        doc.autoTable({
          startY: yPosition,
          head: [['Metric', 'Value']],
          body: overviewData,
          theme: 'grid',
          headStyles: { fillColor: [41, 128, 185] }
        });

        yPosition = doc.lastAutoTable.finalY + 15;
      }

      // Add roadmap section
      if (exportOptions.includeRoadmap && data?.roadmaps && data.roadmaps.length > 0) {
        doc.setFontSize(16);
        doc.text('Roadmap', 20, yPosition);
        yPosition += 10;

        const roadmap = data.roadmaps[0];

        doc.setFontSize(12);
        doc.text(`${roadmap.title} (${roadmap.completionPercentage}% complete)`, 20, yPosition);
        yPosition += 10;

        if (roadmap.phases && roadmap.phases.length > 0) {
          const phaseData = roadmap.phases.map(phase => [
            phase.title,
            phase.status.replace('_', ' ').charAt(0).toUpperCase() + phase.status.replace('_', ' ').slice(1),
            phase.milestones ? phase.milestones.length : 0
          ]);

          doc.autoTable({
            startY: yPosition,
            head: [['Phase', 'Status', 'Milestones']],
            body: phaseData,
            theme: 'grid',
            headStyles: { fillColor: [41, 128, 185] }
          });

          yPosition = doc.lastAutoTable.finalY + 15;
        }
      }

      // Add documents section
      if (exportOptions.includeDocuments && data?.documents && data.documents.length > 0) {
        // Check if we need a new page
        if (yPosition > 230) {
          doc.addPage();
          yPosition = 20;
        }

        doc.setFontSize(16);
        doc.text('Documents', 20, yPosition);
        yPosition += 10;

        const documentData = data.documents.map(doc => [
          doc.documentType,
          doc.category || 'N/A',
          doc.status.charAt(0).toUpperCase() + doc.status.slice(1)
        ]);

        doc.autoTable({
          startY: yPosition,
          head: [['Document Type', 'Category', 'Status']],
          body: documentData,
          theme: 'grid',
          headStyles: { fillColor: [41, 128, 185] }
        });

        yPosition = doc.lastAutoTable.finalY + 15;
      }

      // Add tasks section
      if (exportOptions.includeTasks && data?.tasks && data.tasks.length > 0) {
        // Check if we need a new page
        if (yPosition > 230) {
          doc.addPage();
          yPosition = 20;
        }

        doc.setFontSize(16);
        doc.text('Tasks', 20, yPosition);
        yPosition += 10;

        const taskData = data.tasks
          .filter(task => !task.isMilestone)
          .map(task => [
            task.title,
            task.status.replace('_', ' ').charAt(0).toUpperCase() + task.status.replace('_', ' ').slice(1),
            task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date',
            task.phaseTitle || 'N/A'
          ]);

        doc.autoTable({
          startY: yPosition,
          head: [['Task', 'Status', 'Due Date', 'Phase']],
          body: taskData,
          theme: 'grid',
          headStyles: { fillColor: [41, 128, 185] }
        });

        yPosition = doc.lastAutoTable.finalY + 15;
      }

      // Add recommendations section
      if (exportOptions.includeRecommendations && data?.recommendations && data.recommendations.length > 0) {
        // Check if we need a new page
        if (yPosition > 230) {
          doc.addPage();
          yPosition = 20;
        }

        doc.setFontSize(16);
        doc.text('Recommendations', 20, yPosition);
        yPosition += 10;

        const recommendationData = data.recommendations.map(rec => [
          rec.programName,
          rec.countryName,
          `${rec.matchPercentage}%`
        ]);

        doc.autoTable({
          startY: yPosition,
          head: [['Program', 'Country', 'Match']],
          body: recommendationData,
          theme: 'grid',
          headStyles: { fillColor: [41, 128, 185] }
        });
      }

      // Add footer
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 10, { align: 'center' });
        doc.text('Visafy Immigration Platform', 20, doc.internal.pageSize.height - 10);
      }

      // Save the PDF
      doc.save('visafy-dashboard-report.pdf');

      setLoading(false);
      handleExportDialogClose();
      showNotification('Report exported successfully');
    } catch (error) {
      console.error('Error generating PDF:', error);
      setLoading(false);
      showNotification('Failed to generate report', 'error');
    }
  };

  // Generate CSV export
  const generateCsvExport = () => {
    try {
      setLoading(true);

      let csvContent = 'data:text/csv;charset=utf-8,';

      // Add header
      csvContent += 'Visafy Immigration Dashboard Report\n';
      csvContent += `Generated on: ${new Date().toLocaleDateString()}\n`;
      csvContent += `User: ${user?.firstName} ${user?.lastName}\n`;
      csvContent += `Email: ${user?.email}\n\n`;

      // Add overview section
      if (exportOptions.includeOverview && data?.overview) {
        csvContent += 'OVERVIEW\n';
        csvContent += 'Metric,Value\n';

        const overview = data.overview;
        csvContent += `Profile Completion,${overview.profileCompletion}%\n`;
        csvContent += `Assessment Completion,${overview.assessmentCompletion}%\n`;
        csvContent += `Roadmap Progress,${overview.roadmapProgress}%\n`;
        csvContent += `Documents,${overview.documentsUploaded}/${overview.documentsRequired}\n`;
        csvContent += `Tasks,${overview.tasksCompleted}/${overview.totalTasks}\n`;
        csvContent += `Days Active,${overview.daysActive}\n\n`;
      }

      // Add roadmap section
      if (exportOptions.includeRoadmap && data?.roadmaps && data.roadmaps.length > 0) {
        csvContent += 'ROADMAP\n';

        const roadmap = data.roadmaps[0];
        csvContent += `${roadmap.title} (${roadmap.completionPercentage}% complete)\n`;

        if (roadmap.phases && roadmap.phases.length > 0) {
          csvContent += 'Phase,Status,Milestones\n';

          roadmap.phases.forEach(phase => {
            const status = phase.status.replace('_', ' ').charAt(0).toUpperCase() + phase.status.replace('_', ' ').slice(1);
            const milestoneCount = phase.milestones ? phase.milestones.length : 0;
            csvContent += `${phase.title},${status},${milestoneCount}\n`;
          });

          csvContent += '\n';
        }
      }

      // Add documents section
      if (exportOptions.includeDocuments && data?.documents && data.documents.length > 0) {
        csvContent += 'DOCUMENTS\n';
        csvContent += 'Document Type,Category,Status\n';

        data.documents.forEach(doc => {
          const category = doc.category || 'N/A';
          const status = doc.status.charAt(0).toUpperCase() + doc.status.slice(1);
          csvContent += `${doc.documentType},${category},${status}\n`;
        });

        csvContent += '\n';
      }

      // Add tasks section
      if (exportOptions.includeTasks && data?.tasks && data.tasks.length > 0) {
        csvContent += 'TASKS\n';
        csvContent += 'Task,Status,Due Date,Phase\n';

        data.tasks
          .filter(task => !task.isMilestone)
          .forEach(task => {
            const status = task.status.replace('_', ' ').charAt(0).toUpperCase() + task.status.replace('_', ' ').slice(1);
            const dueDate = task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date';
            const phase = task.phaseTitle || 'N/A';
            csvContent += `${task.title},${status},${dueDate},${phase}\n`;
          });

        csvContent += '\n';
      }

      // Add recommendations section
      if (exportOptions.includeRecommendations && data?.recommendations && data.recommendations.length > 0) {
        csvContent += 'RECOMMENDATIONS\n';
        csvContent += 'Program,Country,Match\n';

        data.recommendations.forEach(rec => {
          csvContent += `${rec.programName},${rec.countryName},${rec.matchPercentage}%\n`;
        });
      }

      // Create download link
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', 'visafy-dashboard-report.csv');
      document.body.appendChild(link);

      // Trigger download
      link.click();
      document.body.removeChild(link);

      setLoading(false);
      handleExportDialogClose();
      showNotification('Report exported successfully');
    } catch (error) {
      console.error('Error generating CSV:', error);
      setLoading(false);
      showNotification('Failed to generate report', 'error');
    }
  };

  // Handle print
  const handlePrint = () => {
    try {
      setLoading(true);

      // In a real app, this would generate a print-friendly version
      // For demo purposes, we'll just show a notification
      setTimeout(() => {
        setLoading(false);
        handleExportDialogClose();
        showNotification('Print functionality would be implemented here');
      }, 1000);
    } catch (error) {
      setLoading(false);
      showNotification('Failed to print report', 'error');
    }
  };

  // Handle share
  const handleShare = () => {
    try {
      setLoading(true);

      // In a real app, this would open a share dialog
      // For demo purposes, we'll just show a notification
      setTimeout(() => {
        setLoading(false);
        handleExportDialogClose();
        showNotification('Share functionality would be implemented here');
      }, 1000);
    } catch (error) {
      setLoading(false);
      showNotification('Failed to share report', 'error');
    }
  };

  // Handle export
  const handleExport = () => {
    switch (exportType) {
      case 'pdf':
        generatePdfExport();
        break;
      case 'csv':
        generateCsvExport();
        break;
      case 'print':
        handlePrint();
        break;
      case 'share':
        handleShare();
        break;
      default:
        handleExportDialogClose();
    }
  };

  return (
    <Paper sx={{ p: 3, height: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          <FileDownloadIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Export & Share
        </Typography>
      </Box>
      <Divider sx={{ mb: 2 }} />

      <Typography variant="body2" color="text.secondary" paragraph>
        Export your immigration journey data in various formats or share it with others.
      </Typography>

      <List>
        <ListItem disablePadding>
          <Button
            fullWidth
            startIcon={<PdfIcon />}
            onClick={() => handleExportDialogOpen('pdf')}
            sx={{ justifyContent: 'flex-start', py: 1 }}
          >
            Export as PDF
          </Button>
        </ListItem>

        <ListItem disablePadding>
          <Button
            fullWidth
            startIcon={<CsvIcon />}
            onClick={() => handleExportDialogOpen('csv')}
            sx={{ justifyContent: 'flex-start', py: 1 }}
          >
            Export as CSV
          </Button>
        </ListItem>

        <ListItem disablePadding>
          <Button
            fullWidth
            startIcon={<PrintIcon />}
            onClick={() => handleExportDialogOpen('print')}
            sx={{ justifyContent: 'flex-start', py: 1 }}
          >
            Print Report
          </Button>
        </ListItem>

        <ListItem disablePadding>
          <Tooltip title="Share your progress with immigration consultants or family members">
            <Button
              fullWidth
              startIcon={<ShareIcon />}
              onClick={() => handleExportDialogOpen('share')}
              sx={{ justifyContent: 'flex-start', py: 1 }}
            >
              Share Progress
            </Button>
          </Tooltip>
        </ListItem>
      </List>

      {/* Export dialog */}
      <Dialog
        open={exportDialogOpen}
        onClose={handleExportDialogClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {exportType === 'pdf' && 'Export as PDF'}
          {exportType === 'csv' && 'Export as CSV'}
          {exportType === 'print' && 'Print Report'}
          {exportType === 'share' && 'Share Progress'}
        </DialogTitle>

        <DialogContent>
          <Typography variant="body2" color="text.secondary" paragraph>
            Select the sections you want to include in your export:
          </Typography>

          <Box sx={{ ml: 2 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={exportOptions.includeOverview}
                  onChange={handleExportOptionChange}
                  name="includeOverview"
                />
              }
              label="Overview & Progress"
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={exportOptions.includeRoadmap}
                  onChange={handleExportOptionChange}
                  name="includeRoadmap"
                />
              }
              label="Roadmap"
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={exportOptions.includeDocuments}
                  onChange={handleExportOptionChange}
                  name="includeDocuments"
                />
              }
              label="Documents"
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={exportOptions.includeTasks}
                  onChange={handleExportOptionChange}
                  name="includeTasks"
                />
              }
              label="Tasks"
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={exportOptions.includeRecommendations}
                  onChange={handleExportOptionChange}
                  name="includeRecommendations"
                />
              }
              label="Recommendations"
            />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleExportDialogClose}>Cancel</Button>
          <Button
            onClick={handleExport}
            variant="contained"
            disabled={loading || !Object.values(exportOptions).some(Boolean)}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? 'Processing...' : 'Export'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

ExportWidget.propTypes = {
  data: PropTypes.object
};

export default ExportWidget;

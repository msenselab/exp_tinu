// Google Sheets Data Saver - CORS-Free Version using Form Submission
// This version uses form submission to bypass CORS restrictions

class GoogleSheetsDataSaverCORSFree {
    constructor(spreadsheetId, scriptUrl) {
        this.spreadsheetId = spreadsheetId;
        this.scriptUrl = scriptUrl;
    }

    // Save experiment data using form submission (no CORS issues)
    async saveData(experimentData, participantId = null) {
        try {
            // Debug: Log raw data
            console.log('Raw experiment data received:', experimentData);
            console.log('Data type:', typeof experimentData);
            console.log('Data length:', Array.isArray(experimentData) ? experimentData.length : 'Not array');
            
            // Generate tab name with timestamp
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
            const tabName = participantId ? 
                `${participantId}_${timestamp}` : 
                `experiment_${timestamp}`;

            // Convert data to PHP-style CSV format
            const csvData = this.convertToPHPStyleCSV(experimentData);
            
            // Debug: Log formatted CSV data
            console.log('Formatted CSV data:', csvData);
            console.log('CSV length:', csvData.length);

            console.log('Sending data via form submission to avoid CORS...');
            
            // Create a hidden form to submit data
            const success = await this.submitViaForm({
                action: 'saveData',
                spreadsheetId: this.spreadsheetId,
                sheetName: tabName,
                csvData: csvData,
                participantId: participantId
            });

            if (success) {
                console.log('Data sent to Google Sheets successfully!');
                console.log(`Check your sheet: https://docs.google.com/spreadsheets/d/${this.spreadsheetId}`);
                
                return {
                    success: true,
                    sheetName: tabName,
                    spreadsheetUrl: `https://docs.google.com/spreadsheets/d/${this.spreadsheetId}`
                };
            } else {
                throw new Error('Form submission failed');
            }

        } catch (error) {
            console.error('Error saving to Google Sheets:', error);
            throw error;
        }
    }

    

    // Alternative: Use iframe submission (silent, no new tab)
    submitViaIframe(data) {
        return new Promise((resolve) => {
            console.log('Creating hidden iframe for silent data submission...');
            
            // Create iframe
            const iframe = document.createElement('iframe');
            iframe.name = 'data-submit-frame';
            iframe.style.display = 'none';
            document.body.appendChild(iframe);
            
            // Create form targeting iframe
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = this.scriptUrl;
            form.target = 'data-submit-frame';
            form.style.display = 'none';
            
            // Add form fields
            Object.keys(data).forEach(key => {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = key;
                input.value = data[key];
                form.appendChild(input);
            });
            
            // Listen for iframe load (indicates submission complete)
            iframe.onload = () => {
                console.log('Data submission completed via iframe');
                setTimeout(() => {
                    document.body.removeChild(iframe);
                    document.body.removeChild(form);
                    resolve(true);
                }, 500);
            };
            
            // Add form and submit
            document.body.appendChild(form);
            console.log('Submitting form via iframe with data:', data);
            form.submit();
        });
    }

    // Convert data to PHP-style CSV format (same as before)
    convertToPHPStyleCSV(dataObj) {
        if (!dataObj || dataObj.length === 0) {
            console.log('No data to convert');
            return '';
        }

        // Handle different data formats
        let processedData = dataObj;
        if (typeof dataObj === 'object' && !Array.isArray(dataObj)) {
            processedData = Object.values(dataObj).filter(item => typeof item === 'object');
        }

        if (!Array.isArray(processedData) || processedData.length === 0) {
            console.log('Processed data is not a valid array');
            return '';
        }

        // Get headers from first object
        const headers = Object.keys(processedData[0]);
        console.log('Headers found:', headers);

        // Helper to escape CSV values
        const escapeCsvValue = (value) => {
            if (value === null || value === undefined) return '';
            let stringValue = String(value);
            if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
                return `"${stringValue.replace(/"/g, '""')}"`;
            }
            return stringValue;
        };

        // Create CSV in PHP style
        const headerRow = headers.map(escapeCsvValue).join(',');
        const dataRows = processedData.map(row => {
            return headers.map(header => {
                const value = row[header];
                if (typeof value === 'object' && value !== null) {
                    return escapeCsvValue(JSON.stringify(value));
                }
                return escapeCsvValue(value);
            }).join(',');
        });
        
        const csvRows = [headerRow].concat(dataRows);

        const csvString = csvRows.join('\n');
        console.log('Generated CSV preview (first 500 chars):', csvString.substring(0, 500));
        return csvString;
    }
}

// Updated usage function using CORS-free version
async function saveExperimentDataToGoogleSheetsCORSFree(experimentData, participantId = null) {
    const dataSaver = new GoogleSheetsDataSaverCORSFree(
        '1uWdRNG4dZJs_wBa37m8JE-GB7Ku2SmyBVFxfH2VORTw', // Spreadsheet ID only
        'https://script.google.com/macros/s/AKfycbyUybZhtnn3-9Zq0FuSfYTwps8c47VKrF17LDtWv5aiWzpfdl7GXmBWNW26i9zzJYimtw/exec'
    );

    try {
        const result = await dataSaver.submitViaIframe({
            action: 'saveData',
            spreadsheetId: dataSaver.spreadsheetId,
            sheetName: participantId ? 
                `${participantId}_${new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5)}` : 
                `experiment_${new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5)}`,
            csvData: dataSaver.convertToPHPStyleCSV(experimentData),
            participantId: participantId,
            referrer: window.location.hostname
        });
        
        console.log('✅ Experiment data submitted to Google Sheets!');
        return result;
        
    } catch (error) {
        console.error('❌ Failed to save to Google Sheets:', error);
        // Fallback to local download
        console.log('📥 Downloading data locally as backup...');
        downloadDataLocally(experimentData, `experiment_data_backup_${Date.now()}.csv`);
        throw error;
    }
}

// Helper function for local backup (same as before)
function downloadDataLocally(data, filename) {
    if (!data || data.length === 0) return;
    
    const headers = Object.keys(data[0]);
    const csvRows = [headers.join(',')];
    
    data.forEach(row => {
        const values = headers.map(header => {
            const value = row[header];
            if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
                return `"${value.replace(/"/g, '""')}"`;
            }
            return value;
        });
        csvRows.push(values.join(','));
    });
    
    const csvData = csvRows.join('\n');
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
}

// Export for modules and make globally available
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { saveExperimentDataToGoogleSheetsCORSFree, GoogleSheetsDataSaverCORSFree };
}

if (typeof window !== 'undefined') {
    window.saveExperimentDataToGoogleSheetsCORSFree = saveExperimentDataToGoogleSheetsCORSFree;
    window.GoogleSheetsDataSaverCORSFree = GoogleSheetsDataSaverCORSFree;
}
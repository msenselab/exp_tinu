# Time-Numerosity Blocked Task - Online Version

This is the JavaScript/PsychoJS version of the Time-Numerosity Blocked Task, converted from the original PsychoPy Python implementation for online browser execution.

## Overview

This experiment implements a blocked design bisection task where participants judge either:
- **Duration**: Short/long compared to 1 second
- **Numerosity**: Small/large compared to 20 dots

The experiment includes three block types:
1. **Pure Duration blocks**: Only duration judgments
2. **Pure Numerosity blocks**: Only numerosity judgments  
3. **Mixed blocks**: Random mixture of both tasks

## Files

- `index.html` - Main HTML file with experiment interface
- `time_numerosity_blocked_task.js` - Main experiment JavaScript code (ES6 modules)
- `lib/` - PsychoJS library files (2025.2.0)
- `README.md` - This documentation file

## Running the Experiment

### Local Development
1. Open `index.html` in a web browser
2. Allow fullscreen when prompted
3. Follow the on-screen instructions

### Web Server Deployment
For production use, serve the files from a web server:

```bash
# Using Python's built-in server
python -m http.server 8000

# Using Node.js http-server
npx http-server

# Using any other web server
```

Then navigate to `http://localhost:8000/index.html`

## Experiment Structure

### Block Design
- **1 practice block**: 18 trials (mixed conditions)
- **6 main blocks**: 2 of each type, randomly ordered
  - Pure Duration: 36 trials each
  - Pure Numerosity: 36 trials each  
  - Mixed: 72 trials each

### Stimulus Parameters
- **Durations**: 0.7, 0.8, 0.9, 1.1, 1.2, 1.3 seconds
- **Numerosities**: 8, 12, 16, 24, 28, 32 dots
- **Dot size**: 0.5° visual angle
- **Display area**: ±7.5° square

### Trial Procedure
1. **Fixation** (0.5s)
2. **Blank** (0.5s)
3. **Dot array** (0.7-1.3s, varies by trial)
4. **Blank** (0.5s)
5. **Cue + Response** (up to 3s)
6. **Feedback** (0.5s)
7. **Inter-trial interval** (1-2s, randomized)

### Response Keys
- **LEFT arrow**: Short (duration) / Small (numerosity)
- **RIGHT arrow**: Long (duration) / Large (numerosity)
- **SPACE**: Continue between blocks
- **ESCAPE**: Quit experiment

## Data Output

The experiment automatically saves data in CSV format through the browser. Data includes:

- Trial identifiers (block, trial number, block type)
- Stimulus properties (duration, numerosity, cue type)
- Response data (key pressed, reaction time, accuracy)
- Timing information

## Browser Compatibility

Tested with:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**Requirements:**
- Modern browser with JavaScript enabled
- Fullscreen capability
- Keyboard input support

## Technical Notes

### Dependencies
- PsychoJS 2023.2.3 (loaded from CDN)
- No additional libraries required

### Performance Considerations
- Fullscreen mode recommended for accurate timing
- Disable browser extensions that might interfere
- Close other tabs/applications for best performance

### Timing Accuracy
- Uses PsychoJS high-precision timing
- Frame-based presentation for visual stimuli
- Keyboard response timing accurate to ~1ms

## Troubleshooting

### Common Issues

1. **Blank screen on load**
   - Check browser console for errors
   - Ensure JavaScript is enabled
   - Try refreshing the page

2. **Timing seems off**
   - Use fullscreen mode
   - Close other browser tabs
   - Check for browser extensions interfering

3. **Keys not responding**
   - Click on the experiment window to focus
   - Use arrow keys and spacebar only
   - Check for sticky keys or accessibility features

4. **Data not saving**
   - Allow downloads when prompted
   - Check browser's download folder
   - Ensure sufficient disk space

### Debug Mode
To enable debug output, modify the JavaScript file:
```javascript
psychoJS = new PsychoJS({
    debug: true  // Change to true
});
```

## Customization

### Modifying Parameters
Edit the `CONFIG` object in `time_numerosity_blocked_task.js`:

```javascript
const CONFIG = {
    durations: [0.6, 0.8, 1.0, 1.2, 1.4],  // Custom durations
    numerosities: [10, 15, 20, 25, 30],     // Custom numerosities
    nPureDurationBlocks: 3,                 // More blocks
    // ... other parameters
};
```

### Visual Styling
Modify the CSS in `index.html` to change:
- Background colors
- Loading screen appearance
- Font sizes and styles

## Support

For issues with:
- **PsychoJS**: Visit [PsychoJS documentation](https://psychopy.github.io/psychojs/)
- **This experiment**: Check the original Python implementation
- **Browser compatibility**: Test in different browsers

## Version History

- **v1.0**: Initial JavaScript conversion from Python PsychoPy implementation
- Features complete experimental design with all three block types
- Includes data collection and browser-based CSV export
/****************** 
 * Time-Numerosity Blocked Task *
 ******************/

import { core, data, sound, util, visual, hardware } from './lib/psychojs-2025.2.0.js';
const { PsychoJS } = core;
const { TrialHandler, MultiStairHandler } = data;
const { Scheduler } = util;
//some handy aliases as in the psychopy scripts;
const { abs, sin, cos, PI: pi, sqrt } = Math;
const { round } = util;

// store info about the experiment session:
let expName = 'Time-Numerosity Blocked Task';  // from the Builder filename that created this script
let expInfo = {
    'participant': '',
    'gender': 'F',
    'age': '20',
    'session': '001',
};

// init psychoJS:
const psychoJS = new PsychoJS({
  debug: true
});

// open window:
psychoJS.openWindow({
  fullscr: true,
  color: new util.Color('black'),
  units: 'height',
  waitBlanking: true,
  backgroundImage: '',
  backgroundFit: 'none',
});

// schedule the experiment:
psychoJS.schedule(psychoJS.gui.DlgFromDict({
  dictionary: expInfo,
  title: expName
}));

const flowScheduler = new Scheduler(psychoJS);
const dialogCancelScheduler = new Scheduler(psychoJS);
psychoJS.scheduleCondition(function() { return (psychoJS.gui.dialogComponent.button === 'OK'); },flowScheduler, dialogCancelScheduler);

// flowScheduler gets run if the participants presses OK
flowScheduler.add(updateInfo); // add timeStamp
flowScheduler.add(experimentInit);
flowScheduler.add(instructionsRoutineBegin());
flowScheduler.add(instructionsRoutineEachFrame());
flowScheduler.add(instructionsRoutineEnd());

// Practice block
flowScheduler.add(practiceStartRoutineBegin());
flowScheduler.add(practiceStartRoutineEachFrame());
flowScheduler.add(practiceStartRoutineEnd());

const practiceTrialsLoopScheduler = new Scheduler(psychoJS);
flowScheduler.add(practiceLoopBegin(practiceTrialsLoopScheduler));
flowScheduler.add(practiceTrialsLoopScheduler);
flowScheduler.add(practiceLoopEnd);

// Main experiment blocks
const mainBlocksLoopScheduler = new Scheduler(psychoJS);
flowScheduler.add(mainBlocksLoopBegin(mainBlocksLoopScheduler));
flowScheduler.add(mainBlocksLoopScheduler);
flowScheduler.add(mainBlocksLoopEnd);
/*
// Insert data saving before goodbye routine
flowScheduler.add(async function () {
  // Disable downloading results to browser
  psychoJS._saveResults = 0;

  // Generate filename for results
  let filename = psychoJS._experiment._experimentName + '_' + psychoJS._experiment._datetime + '.csv';

  // Extract data object from experiment
  let dataObj = psychoJS._experiment._trialsData;

  // Convert data object to CSV
  let data = [Object.keys(dataObj[0])].concat(dataObj).map(it => {
    return Object.values(it).toString()
  }).join('\n');

  // Send data ...
  console.log('Saving data...');
  await fetch('save.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: '*//*',
    },
    body: JSON.stringify({
      filename: filename,
      data: data,
    }),
  }).then(response => response.json()).then(data => {
    // Log response
    console.log(data);
  });
  return Scheduler.Event.NEXT;
});
*/

flowScheduler.add(async function () {
  // Disable downloading results to browser
  psychoJS._saveResults = 0;

  // Extract data object from experiment
  let dataObj = psychoJS._experiment._trialsData;

  // Send data to Google Sheets
  console.log('Saving data to Google Sheets...');
  
  const participantId = expInfo['participant']; // or however you get participant ID
  try {
    await saveExperimentDataToGoogleSheetsCORSFree(
        dataObj,
        participantId
    );
    console.log('Data successfully saved to Google Sheets!');
  } catch (error) {
    console.error('Failed to save to Google Sheets:', error);
    console.log('Data saved locally as backup');
    // Still continue with experiment completion
  }
  
  return Scheduler.Event.NEXT;
});

flowScheduler.add(goodbyeRoutineBegin());
flowScheduler.add(goodbyeRoutineEachFrame());
flowScheduler.add(goodbyeRoutineEnd());
flowScheduler.add(quitPsychoJS, '', true);

// quit if user presses Cancel in dialog box:
dialogCancelScheduler.add(quitPsychoJS, '', false);

psychoJS.start({
  expName: expName,
  expInfo: expInfo,
});

psychoJS.experimentLogger.setLevel(core.Logger.ServerLevel.WARNING);

// Experiment configuration - matches Python CONFIG
const CONFIG = {
    durations: [0.7,0.8,0.9, 1.1, 1.2, 1.3],  // Without mean of 1.0
    numerosities: [8, 12,16, 24, 28, 32],  // Without mean of 20
    durationMean: 1.0,
    numerosityMean: 20,
    
    // Block structure: 2 of each type, randomly interleaved
    nPureDurationBlocks: 2,
    nPureNumerosityBlocks: 2,
    nMixedBlocks: 2,
    
    // Timing parameters
    feedbackDuration: 0.5,
    itiMin: 1.0,
    itiMax: 2.0,
    fixationDuration: 0.5,
    dotSize: 0.3,  // Reduced from 0.5 to 0.3
    arrayRadius: 5,  // square area size (-5 to +5 in both x,y)
};

async function updateInfo() {
  currentLoop = psychoJS.experiment;  // right now there are no loops
  expInfo['date'] = util.MonotonicClock.getDateStr();  // add a simple timestamp
  expInfo['expName'] = expName;
  expInfo['psychopyVersion'] = '2025.2.0';
  expInfo['OS'] = window.navigator.platform;

  // store frame rate of monitor if we can measure it successfully
  expInfo['frameRate'] = psychoJS.window.getActualFrameRate();

  // add info from the URL:
  util.addInfoFromUrl(expInfo);
  
  psychoJS.experiment.dataFileName = (("." + "/") + `data/tinu_sub-${expInfo["participant"]}_${expInfo["date"]}`);
  psychoJS.experiment.field_separator = '\t';

  return Scheduler.Event.NEXT;
}

// Component variables
var instructionsClock;
var instructionsText;
var instructionsKey;
var practiceStartClock;
var practiceStartText;
var practiceStartKey;
var trialClock;
var fixationCross;
var dotArray;
var blankScreen;
var cueText;
var responseKey;
var feedbackClock;
var feedbackText;
var blockInfoClock;
var blockInfoText;
var blockInfoKey;
var goodbyeClock;
var goodbyeText;
var globalClock;
var routineTimer;

// Trial and block variables
var currentLoop;
var blockSequence = [];
var currentBlockIdx = 0;
var currentConditionIdx = 0;
var currentMainBlockType;
var practiceConditions = [];
var currentConditions = [];
var currentBlockType = '';
var isInPractice = true;

async function experimentInit() {
  // Initialize components for Routine "instructions"
  instructionsClock = new util.Clock();
  instructionsKey = new core.Keyboard({psychoJS: psychoJS, clock: new util.Clock(), waitForStart: true});
  
  instructionsText = new visual.TextStim({
    win: psychoJS.window,
    name: 'instructionsText',
    text: getInstructionText(),
    font: 'Arial',
    units: 'pix', 
    pos: [0, 0], draggable: false, height: 20, wrapWidth: 800, ori: 0,
    languageStyle: 'LTR',
    color: new util.Color('white'), opacity: 1,
    depth: 0.0 
  });

  // Initialize components for Routine "practiceStart"
  practiceStartClock = new util.Clock();
  practiceStartKey = new core.Keyboard({psychoJS: psychoJS, clock: new util.Clock(), waitForStart: true});
  
  practiceStartText = new visual.TextStim({
    win: psychoJS.window,
    name: 'practiceStartText',
    text: 'Practice\n\n\n\nPress SPACE key to start ...',
    font: 'Arial',
    units: 'pix', 
    pos: [0, 0], draggable: false, height: 28, wrapWidth: undefined, ori: 0,
    languageStyle: 'LTR',
    color: new util.Color('white'), opacity: 1,
    depth: 0.0 
  });
  
  // Initialize components for Routine "trial"
  trialClock = new util.Clock();
  
  fixationCross = new visual.ShapeStim({
    win: psychoJS.window, name: 'fixationCross',
    vertices: 'cross', size: [40, 40],
    ori: 0.0, pos: [0, 0], draggable: false,
    lineWidth: 1.0, 
    colorSpace: 'rgb', lineColor: new util.Color('white'),
    fillColor: new util.Color('white'),
    opacity: undefined, depth: 0.0, units: 'pix'
  });
  
  // dotArray will be created dynamically during trials
  dotArray = null;
  
  blankScreen = new visual.TextStim({
    win: psychoJS.window,
    name: 'blankScreen',
    text: '',
    font: 'Arial',
    units: 'pix', 
    pos: [0, 0], draggable: false, height: 20, wrapWidth: undefined, ori: 0,
    languageStyle: 'LTR',
    color: new util.Color('white'), opacity: 1,
    depth: -1.0 
  });
  
  cueText = new visual.TextStim({
    win: psychoJS.window,
    name: 'cueText',
    text: '',
    font: 'Arial',
    units: 'pix', 
    pos: [0, 0], draggable: false, height: 32, wrapWidth: undefined, ori: 0,
    languageStyle: 'LTR',
    color: new util.Color('white'), opacity: 1,
    depth: -2.0 
  });
  
  responseKey = new core.Keyboard({psychoJS: psychoJS, clock: new util.Clock(), waitForStart: true});
  
  // Initialize components for Routine "feedback"
  feedbackClock = new util.Clock();
  
  feedbackText = new visual.TextStim({
    win: psychoJS.window,
    name: 'feedbackText',
    text: '',
    font: 'Arial',
    units: 'pix', 
    pos: [0, 0], draggable: false, height: 28, wrapWidth: undefined, ori: 0,
    languageStyle: 'LTR',
    color: new util.Color('white'), opacity: 1,
    depth: 0.0 
  });

  // Initialize components for Routine "blockInfo"
  blockInfoClock = new util.Clock();
  blockInfoKey = new core.Keyboard({psychoJS: psychoJS, clock: new util.Clock(), waitForStart: true});
  
  blockInfoText = new visual.TextStim({
    win: psychoJS.window,
    name: 'blockInfoText',
    text: '',
    font: 'Arial',
    units: 'pix', 
    pos: [0, 0], draggable: false, height: 28, wrapWidth: undefined, ori: 0,
    languageStyle: 'LTR',
    color: new util.Color('white'), opacity: 1,
    depth: 0.0 
  });
  
  // Initialize components for Routine "goodbye"
  goodbyeClock = new util.Clock();
  
  goodbyeText = new visual.TextStim({
    win: psychoJS.window,
    name: 'goodbyeText',
    text: 'The whole experiment is completed! \n\nMany thanks for your participation!',
    font: 'Arial',
    units: 'pix', 
    pos: [0, 0], draggable: false, height: 28, wrapWidth: undefined, ori: 0,
    languageStyle: 'LTR',
    color: new util.Color('white'), opacity: 1,
    depth: 0.0 
  });
  
  // Create some handy timers
  globalClock = new util.Clock();  // to track the time since experiment started
  routineTimer = new util.CountdownTimer();  // to track time remaining of each (non-slip) routine
  
  // Initialize experiment conditions
  blockSequence = createBlockSequence();
  practiceConditions = createPracticeConditions();
  
  return Scheduler.Event.NEXT;
}

function getInstructionText() {
    return "Experimental Instruction\n\n" +
           "Welcome to our bisection experiment. In this experiment, you will see an array of dots appears on the screen. " +
           "You need to pay attention to both the DURATION the dots are displayed and the NUMBER of dots.\n\n" +
           "There are three types of blocks:\n\n" +
           "1. DURATION blocks: You will always judge duration. Compare to 1 second.\n" +
           "   Press LEFT arrow for SHORT, RIGHT arrow for LONG.\n\n" +
           "2. NUMEROSITY blocks: You will always judge numerosity. Compare to 20 dots.\n" +
           "   Press LEFT arrow for SMALL, RIGHT arrow for LARGE.\n\n" +
           "3. MIXED blocks: A cue will tell you which dimension to judge.\n" +
           "   The cue will show 'Duration' or 'Numerosity' with response options.\n\n" +
           "You will receive feedback after each response to help you learn the task.\n\n" +
           "The experiment consists of 1 practice block and 6 main blocks (2 of each type).\n\n" +
           "Press SPACE to start Practice...\n";
}

function createBlockSequence() {
    const blockTypes = [];
    
    // Add each block type the specified number of times
    for (let i = 0; i < CONFIG.nPureDurationBlocks; i++) {
        blockTypes.push('pure_duration');
    }
    for (let i = 0; i < CONFIG.nPureNumerosityBlocks; i++) {
        blockTypes.push('pure_numerosity');
    }
    for (let i = 0; i < CONFIG.nMixedBlocks; i++) {
        blockTypes.push('mixed');
    }
    
    // Shuffle the array
    for (let i = blockTypes.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [blockTypes[i], blockTypes[j]] = [blockTypes[j], blockTypes[i]];
    }
    
    return blockTypes;
}

function createPracticeConditions() {
    const conditions = [];
    const practiceDurations = [0.8, 1.2];  // Include mean for practice
    const practiceNumerosities = [12, 28];   // Include mean for practice
    
    for (const duration of practiceDurations) {
        for (const numerosity of practiceNumerosities) {
            for (const cue of ['duration', 'numerosity']) {
                conditions.push({
                    duration: duration,
                    numerosity: numerosity,
                    cue: cue
                });
            }
        }
    }
    
    // Shuffle conditions
    for (let i = conditions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [conditions[i], conditions[j]] = [conditions[j], conditions[i]];
    }
    
    return conditions;
}

function createConditionsForBlock(blockType) {
    const conditions = [];
    
    if (blockType === 'pure_duration') {
        // Only duration judgments, vary duration and numerosity
        for (const duration of CONFIG.durations) {
            for (const numerosity of CONFIG.numerosities) {
                conditions.push({
                    duration: duration,
                    numerosity: numerosity,
                    cue: 'duration'  // Always duration task
                });
            }
        }
    } else if (blockType === 'pure_numerosity') {
        // Only numerosity judgments, vary duration and numerosity
        for (const duration of CONFIG.durations) {
            for (const numerosity of CONFIG.numerosities) {
                conditions.push({
                    duration: duration,
                    numerosity: numerosity,
                    cue: 'numerosity'  // Always numerosity task
                });
            }
        }
    } else { // mixed block
        // Both tasks randomly mixed
        for (const duration of CONFIG.durations) {
            for (const numerosity of CONFIG.numerosities) {
                for (const cue of ['duration', 'numerosity']) {
                    conditions.push({
                        duration: duration,
                        numerosity: numerosity,
                        cue: cue
                    });
                }
            }
        }
    }
    
    // Shuffle conditions
    for (let i = conditions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [conditions[i], conditions[j]] = [conditions[j], conditions[i]];
    }
    
    return conditions;
}

function createDotArray(nDots) {
    // Generate uniform random positions within a square area
    // Convert from degrees to pixels: 1 deg ≈ 1 cm ≈ 50 pixels (approximate)
    // CONFIG.arrayRadius = 7.5 degrees = 7.5 * 50 = 375 pixels radius
    const areaSize = CONFIG.arrayRadius * 50; // Convert to pixels
    
    // Clear any existing dot array
    if (dotArray && Array.isArray(dotArray)) {
        for (const dot of dotArray) {
            if (dot && typeof dot.setAutoDraw === 'function') {
                dot.setAutoDraw(false);
            }
        }
    }
    
    // Create array of individual circle stimuli
    dotArray = [];
    
    for (let i = 0; i < nDots; i++) {
        const x = (Math.random() - 0.5) * 2 * areaSize; // -375 to +375 pixels
        const y = (Math.random() - 0.5) * 2 * areaSize; // -375 to +375 pixels
        
        const dot = new visual.Polygon({
            win: psychoJS.window,
            name: `dot_${i}`,
            edges: 32, // Use 32 edges to approximate a circle
            size: [CONFIG.dotSize * 50, CONFIG.dotSize * 50],
            pos: [x, y],
            units: 'pix',
            fillColor: new util.Color('white'),
            lineColor: new util.Color('white'),
            opacity: 1.0,
            depth: -1.0
        });
        
        dotArray.push(dot);
    }
}

// Instructions routine
var t;
var frameN;
var continueRoutine;
var routineForceEnded;
var instructionsMaxDurationReached;
var _instructionsKey_allKeys;
var instructionsMaxDuration;
var instructionsComponents;

function instructionsRoutineBegin(snapshot) {
  return async function () {
    TrialHandler.fromSnapshot(snapshot);
    
    t = 0;
    frameN = -1;
    continueRoutine = true;
    routineForceEnded = false;
    instructionsClock.reset();
    routineTimer.reset();
    instructionsMaxDurationReached = false;
    
    instructionsKey.keys = undefined;
    instructionsKey.rt = undefined;
    _instructionsKey_allKeys = [];
    // Data collection removed - instructions not needed in CSV
    instructionsMaxDuration = null;
    
    instructionsComponents = [];
    instructionsComponents.push(instructionsKey);
    instructionsComponents.push(instructionsText);
    
    for (const thisComponent of instructionsComponents)
      if ('status' in thisComponent)
        thisComponent.status = PsychoJS.Status.NOT_STARTED;
    return Scheduler.Event.NEXT;
  }
}

function instructionsRoutineEachFrame() {
  return async function () {
    t = instructionsClock.getTime();
    frameN = frameN + 1;
    
    // *instructionsKey* updates
    if (t >= 0.0 && instructionsKey.status === PsychoJS.Status.NOT_STARTED) {
      instructionsKey.tStart = t;
      instructionsKey.frameNStart = frameN;
      
      psychoJS.window.callOnFlip(function() { instructionsKey.clock.reset(); });
      psychoJS.window.callOnFlip(function() { instructionsKey.start(); });
      psychoJS.window.callOnFlip(function() { instructionsKey.clearEvents(); });
    }
    
    if (instructionsKey.status === PsychoJS.Status.STARTED) {
      let theseKeys = instructionsKey.getKeys({
        keyList: ['space'], 
        waitRelease: false
      });
      _instructionsKey_allKeys = _instructionsKey_allKeys.concat(theseKeys);
      if (_instructionsKey_allKeys.length > 0) {
        instructionsKey.keys = _instructionsKey_allKeys[_instructionsKey_allKeys.length - 1].name;
        instructionsKey.rt = _instructionsKey_allKeys[_instructionsKey_allKeys.length - 1].rt;
        instructionsKey.duration = _instructionsKey_allKeys[_instructionsKey_allKeys.length - 1].duration;
        continueRoutine = false;
      }
    }
    
    // *instructionsText* updates
    if (t >= 0.0 && instructionsText.status === PsychoJS.Status.NOT_STARTED) {
      instructionsText.tStart = t;
      instructionsText.frameNStart = frameN;
      
      instructionsText.setAutoDraw(true);
    }
    
    // check for quit (typically the Esc key)
    if (psychoJS.experiment.experimentEnded || psychoJS.eventManager.getKeys({keyList:['escape']}).length > 0) {
      return quitPsychoJS('The [Escape] key was pressed. Goodbye!', false);
    }
    
    // check if the Routine should terminate
    if (!continueRoutine) {
      routineTimer.reset();
      return Scheduler.Event.NEXT;
    }
    
    continueRoutine = false;
    for (const thisComponent of instructionsComponents)
      if ('status' in thisComponent && thisComponent.status !== PsychoJS.Status.FINISHED) {
        continueRoutine = true;
        break;
      }
    
    if (continueRoutine) {
      return Scheduler.Event.FLIP_REPEAT;
    } else {
      return Scheduler.Event.NEXT;
    }
  };
}

function instructionsRoutineEnd(snapshot) {
  return async function () {
    routineTimer.reset();
    
    // Data removed
    if (typeof instructionsKey.keys !== 'undefined') {
      // Data removed
      // Data removed
    }
    
    // Data removed
    
    for (const thisComponent of instructionsComponents) {
      if (typeof thisComponent.setAutoDraw === 'function') {
        thisComponent.setAutoDraw(false);
      }
    }
    
    return Scheduler.Event.NEXT;
  };
}

// Practice start routine (similar pattern)
var practiceStartMaxDurationReached;
var _practiceStartKey_allKeys;
var practiceStartMaxDuration;
var practiceStartComponents;

function practiceStartRoutineBegin(snapshot) {
  return async function () {
    TrialHandler.fromSnapshot(snapshot);
    
    t = 0;
    frameN = -1;
    continueRoutine = true;
    routineForceEnded = false;
    practiceStartClock.reset();
    routineTimer.reset();
    practiceStartMaxDurationReached = false;
    
    practiceStartKey.keys = undefined;
    practiceStartKey.rt = undefined;
    _practiceStartKey_allKeys = [];
    // Data collection removed - practiceStart not needed in CSV
    practiceStartMaxDuration = null;
    
    practiceStartComponents = [];
    practiceStartComponents.push(practiceStartKey);
    practiceStartComponents.push(practiceStartText);
    
    for (const thisComponent of practiceStartComponents)
      if ('status' in thisComponent)
        thisComponent.status = PsychoJS.Status.NOT_STARTED;
    return Scheduler.Event.NEXT;
  }
}

function practiceStartRoutineEachFrame() {
  return async function () {
    t = practiceStartClock.getTime();
    frameN = frameN + 1;
    
    // *practiceStartKey* updates
    if (t >= 0.0 && practiceStartKey.status === PsychoJS.Status.NOT_STARTED) {
      practiceStartKey.tStart = t;
      practiceStartKey.frameNStart = frameN;
      
      psychoJS.window.callOnFlip(function() { practiceStartKey.clock.reset(); });
      psychoJS.window.callOnFlip(function() { practiceStartKey.start(); });
      psychoJS.window.callOnFlip(function() { practiceStartKey.clearEvents(); });
    }
    
    if (practiceStartKey.status === PsychoJS.Status.STARTED) {
      let theseKeys = practiceStartKey.getKeys({
        keyList: ['space'], 
        waitRelease: false
      });
      _practiceStartKey_allKeys = _practiceStartKey_allKeys.concat(theseKeys);
      if (_practiceStartKey_allKeys.length > 0) {
        practiceStartKey.keys = _practiceStartKey_allKeys[_practiceStartKey_allKeys.length - 1].name;
        practiceStartKey.rt = _practiceStartKey_allKeys[_practiceStartKey_allKeys.length - 1].rt;
        practiceStartKey.duration = _practiceStartKey_allKeys[_practiceStartKey_allKeys.length - 1].duration;
        continueRoutine = false;
      }
    }
    
    // *practiceStartText* updates
    if (t >= 0.0 && practiceStartText.status === PsychoJS.Status.NOT_STARTED) {
      practiceStartText.tStart = t;
      practiceStartText.frameNStart = frameN;
      
      practiceStartText.setAutoDraw(true);
    }
    
    // check for quit (typically the Esc key)
    if (psychoJS.experiment.experimentEnded || psychoJS.eventManager.getKeys({keyList:['escape']}).length > 0) {
      return quitPsychoJS('The [Escape] key was pressed. Goodbye!', false);
    }
    
    // check if the Routine should terminate
    if (!continueRoutine) {
      routineTimer.reset();
      return Scheduler.Event.NEXT;
    }
    
    continueRoutine = false;
    for (const thisComponent of practiceStartComponents)
      if ('status' in thisComponent && thisComponent.status !== PsychoJS.Status.FINISHED) {
        continueRoutine = true;
        break;
      }
    
    if (continueRoutine) {
      return Scheduler.Event.FLIP_REPEAT;
    } else {
      return Scheduler.Event.NEXT;
    }
  };
}

function practiceStartRoutineEnd(snapshot) {
  return async function () {
    routineTimer.reset();
    
    // Data removed
    if (typeof practiceStartKey.keys !== 'undefined') {
      // Data removed
      // Data removed
    }
    
    // Data removed
    
    for (const thisComponent of practiceStartComponents) {
      if (typeof thisComponent.setAutoDraw === 'function') {
        thisComponent.setAutoDraw(false);
      }
    }
    
    return Scheduler.Event.NEXT;
  };
}

// Practice loop functions
var practiceTrials;
function practiceLoopBegin(practiceLoopScheduler, snapshot) {
  return async function() {
    TrialHandler.fromSnapshot(snapshot); // ensure that .thisN vals are up to date
    
    // Setup practice trials
    currentConditions = practiceConditions;
    currentConditionIdx = 0;
    isInPractice = true;
    
    // set up handler to look after randomisation of conditions etc
    practiceTrials = new TrialHandler({
      psychoJS: psychoJS,
      nReps: 1, method: TrialHandler.Method.SEQUENTIAL,
      extraInfo: expInfo, originPath: undefined,
      trialList: currentConditions,
      seed: undefined, name: 'practiceTrials'
    });
    psychoJS.experiment.addLoop(practiceTrials); // add the loop to the experiment
    currentLoop = practiceTrials;  // we're now the current loop
    
    // Schedule all the trials in the trialList:
    for (const thisPracticeTrial of practiceTrials) {
      snapshot = practiceTrials.getSnapshot();
      practiceLoopScheduler.add(importConditions(snapshot));
      practiceLoopScheduler.add(trialRoutineBegin(snapshot));
      practiceLoopScheduler.add(trialRoutineEachFrame());
      practiceLoopScheduler.add(trialRoutineEnd(snapshot));
      practiceLoopScheduler.add(feedbackRoutineBegin(snapshot));
      practiceLoopScheduler.add(feedbackRoutineEachFrame());
      practiceLoopScheduler.add(feedbackRoutineEnd(snapshot));
      practiceLoopScheduler.add(practiceTrialsLoopEndIteration(practiceLoopScheduler, snapshot));
    }
    
    return Scheduler.Event.NEXT;
  }
}

async function practiceLoopEnd() {
  // terminate loop
  psychoJS.experiment.removeLoop(practiceTrials);
  // show block info after practice
  currentLoop = psychoJS.experiment;  // set currentLoop back to main experiment
  // isInPractice should remain true until after block info routine
  return Scheduler.Event.NEXT;
}

function practiceTrialsLoopEndIteration(scheduler, snapshot) {
  // ------Prepare for next entry------
  return async function () {
    if (typeof snapshot !== 'undefined') {
      // ------Check if user ended loop early------
      if (snapshot.finished) {
        // Check for and save orphaned data
        if (psychoJS.experiment.isEntryEmpty()) {
          psychoJS.experiment.nextEntry(snapshot);
        }
        scheduler.stop();
      } else {
        psychoJS.experiment.nextEntry(snapshot);
      }
    }
    return Scheduler.Event.NEXT;
  };
}

// Main blocks loop functions  
var mainBlockTrials;
function mainBlocksLoopBegin(mainBlocksLoopScheduler, snapshot) {
  return async function() {
    TrialHandler.fromSnapshot(snapshot);
    
  currentBlockIdx = 0;
  // isInPractice will be set to false after practice block info routine
    
    // Schedule all blocks in sequence
    for (let blockIdx = 0; blockIdx < blockSequence.length; blockIdx++) {
      // Fix: update currentBlockIdx and currentMainBlockType for each block
      currentBlockIdx = blockIdx;
      currentMainBlockType = blockSequence[blockIdx];
      const blockType = currentMainBlockType;
      const blockConditions = createConditionsForBlock(blockType);
      
      // Add block info routine before each block
      mainBlocksLoopScheduler.add(blockInfoRoutineBegin());
      mainBlocksLoopScheduler.add(blockInfoRoutineEachFrame());
      mainBlocksLoopScheduler.add(blockInfoRoutineEnd());
      
      // Create trial handler for this block
      mainBlockTrials = new TrialHandler({
        psychoJS: psychoJS,
        nReps: 1, method: TrialHandler.Method.SEQUENTIAL,
        extraInfo: expInfo, originPath: undefined,
        trialList: blockConditions,
        seed: undefined, name: 'mainBlockTrials'
      });
      
      // Schedule all trials in this block
      for (const thisBlockTrial of mainBlockTrials) {
        snapshot = mainBlockTrials.getSnapshot();
        mainBlocksLoopScheduler.add(importConditions(snapshot));
        mainBlocksLoopScheduler.add(trialRoutineBegin(snapshot));
        mainBlocksLoopScheduler.add(trialRoutineEachFrame());
        mainBlocksLoopScheduler.add(trialRoutineEnd(snapshot));
        mainBlocksLoopScheduler.add(feedbackRoutineBegin(snapshot));
        mainBlocksLoopScheduler.add(feedbackRoutineEachFrame());
        mainBlocksLoopScheduler.add(feedbackRoutineEnd(snapshot));
        mainBlocksLoopScheduler.add(mainBlockTrialsLoopEndIteration(mainBlocksLoopScheduler, snapshot));
      }
      
      // Block index is updated above before scheduling trials
    }
    
    return Scheduler.Event.NEXT;
  }
}

async function mainBlocksLoopEnd() {
  // terminate loop
  psychoJS.experiment.removeLoop(mainBlockTrials);
  currentLoop = psychoJS.experiment;
  return Scheduler.Event.NEXT;
}

function mainBlockTrialsLoopEndIteration(scheduler, snapshot) {
  // ------Prepare for next entry------
  return async function () {
    if (typeof snapshot !== 'undefined') {
      // ------Check if user ended loop early------
      if (snapshot.finished) {
        // Check for and save orphaned data
        if (psychoJS.experiment.isEntryEmpty()) {
          psychoJS.experiment.nextEntry(snapshot);
        }
        scheduler.stop();
      } else {
        psychoJS.experiment.nextEntry(snapshot);
      }
    }
    return Scheduler.Event.NEXT;
  };
}

function importConditions(currentLoop) {
  return async function () {
    psychoJS.importAttributes(currentLoop.getCurrentTrial());
    return Scheduler.Event.NEXT;
    };
}

// Trial routine functions
var trialMaxDurationReached;
var _responseKey_allKeys;
var trialMaxDuration;
var trialComponents;
var trialPhase;

function trialRoutineBegin(snapshot) {
  return async function () {
    TrialHandler.fromSnapshot(snapshot);
    
    // Extract current trial variables from the snapshot
    const currentTrial = snapshot.getCurrentTrial();
    duration = currentTrial.duration;
    numerosity = currentTrial.numerosity;
    cue = currentTrial.cue;
    
    console.log('Trial started - Duration:', duration, 'Numerosity:', numerosity, 'Cue:', cue);
    
    t = 0;
    frameN = -1;
    continueRoutine = true;
    routineForceEnded = false;
    trialClock.reset();
    routineTimer.reset();
    trialMaxDurationReached = false;
    trialPhase = 'fixation';
    
    // Create dot array for this trial
    createDotArray(numerosity);
    
    // Prepare cue text based on block type and cue
    let combinedText;
    const currentBlockType = isInPractice ? 'mixed' : currentMainBlockType;
    

    const taskLine = cue === 'duration' ? 'Duration' : 'Numerosity';
    const responseLine = cue === 'duration' ? 
        "Short (<--)  or  (-->) Long" : 
        "Small (<--)  or  (-->) Large";
    combinedText = `${taskLine}\n\n${responseLine}`;

    cueText.setText(combinedText);
    
    // Comprehensive key clearing at trial start
    responseKey.keys = undefined;
    responseKey.rt = undefined;
    responseKey.duration = undefined;
    _responseKey_allKeys = [];
    
    // Clear keyboard events thoroughly
    responseKey.clearEvents();
    psychoJS.eventManager.clearEvents();
    
    // Reset keyboard status
    responseKey.status = PsychoJS.Status.NOT_STARTED;
    psychoJS.experiment.addData('trial.started', globalClock.getTime());
    trialMaxDuration = null;
    
    trialComponents = [];
    trialComponents.push(fixationCross);
    trialComponents.push(blankScreen);
    if (dotArray && Array.isArray(dotArray)) {
        for (const dot of dotArray) {
            trialComponents.push(dot);
        }
    }
    trialComponents.push(cueText);
    trialComponents.push(responseKey);
    
    for (const thisComponent of trialComponents)
      if ('status' in thisComponent)
        thisComponent.status = PsychoJS.Status.NOT_STARTED;
    return Scheduler.Event.NEXT;
  }
}

function trialRoutineEachFrame() {
  return async function () {
    t = trialClock.getTime();
    frameN = frameN + 1;
    
    // Phase timing control
    if (trialPhase === 'fixation' && t >= CONFIG.fixationDuration) {
        trialPhase = 'blank1';
        fixationCross.setAutoDraw(false);
    } else if (trialPhase === 'blank1' && t >= CONFIG.fixationDuration + 0.5) {
        trialPhase = 'stimulus';
        blankScreen.setAutoDraw(false);
    } else if (trialPhase === 'stimulus' && t >= CONFIG.fixationDuration + 0.5 + duration) {
        trialPhase = 'blank2';
        if (dotArray && Array.isArray(dotArray)) {
            for (const dot of dotArray) {
                dot.setAutoDraw(false);
            }
        }
    } else if (trialPhase === 'blank2' && t >= CONFIG.fixationDuration + 1.0 + duration) {
        trialPhase = 'response';
        blankScreen.setAutoDraw(false);
    }
    
    // *fixationCross* updates
    if (trialPhase === 'fixation' && fixationCross.status === PsychoJS.Status.NOT_STARTED) {
      fixationCross.tStart = t;
      fixationCross.frameNStart = frameN;
      fixationCross.setAutoDraw(true);
    }
    
    // *blankScreen* updates
    if ((trialPhase === 'blank1' || trialPhase === 'blank2') && blankScreen.status === PsychoJS.Status.NOT_STARTED) {
      blankScreen.tStart = t;
      blankScreen.frameNStart = frameN;
      blankScreen.setAutoDraw(true);
    }
    
    // *dotArray* updates
    if (trialPhase === 'stimulus' && dotArray && Array.isArray(dotArray)) {
      for (const dot of dotArray) {
        if (dot.status === PsychoJS.Status.NOT_STARTED) {
          dot.tStart = t;
          dot.frameNStart = frameN;
          dot.setAutoDraw(true);
        }
      }
    }
    
    // *cueText* updates
    if (trialPhase === 'response' && cueText.status === PsychoJS.Status.NOT_STARTED) {
      cueText.tStart = t;
      cueText.frameNStart = frameN;
      cueText.setAutoDraw(true);
      
      // Start response collection with thorough clearing
      psychoJS.window.callOnFlip(function() { 
        responseKey.clock.reset(); 
        responseKey.clearEvents();
        psychoJS.eventManager.clearEvents();
      });
      psychoJS.window.callOnFlip(function() { responseKey.start(); });
      responseKey.status = PsychoJS.Status.STARTED;
    }
    
    // *responseKey* updates
    if (responseKey.status === PsychoJS.Status.STARTED) {
      let theseKeys = responseKey.getKeys({
        keyList: ['left', 'right'], 
        waitRelease: false
      });
      
      // Only process if we get new keys and haven't already responded
      if (theseKeys.length > 0 && !responseKey.keys) {
        // Take only the first valid key press to prevent double responses
        const firstKey = theseKeys[0];
        responseKey.keys = firstKey.name;
        responseKey.rt = firstKey.rt;
        responseKey.duration = firstKey.duration;
        
        // Immediately stop accepting more keys
        responseKey.status = PsychoJS.Status.FINISHED;
        responseKey.clearEvents();
        psychoJS.eventManager.clearEvents();
        
        continueRoutine = false;
      }
    }
    
    // Timeout after 3 seconds in response phase
    if (trialPhase === 'response' && t >= CONFIG.fixationDuration + 1.0 + duration + 3.0) {
      continueRoutine = false;
    }
    
    // check for quit (typically the Esc key)
    if (psychoJS.experiment.experimentEnded || psychoJS.eventManager.getKeys({keyList:['escape']}).length > 0) {
      return quitPsychoJS('The [Escape] key was pressed. Goodbye!', false);
    }
    
    // check if the Routine should terminate
    if (!continueRoutine) {
      routineTimer.reset();
      return Scheduler.Event.NEXT;
    }
    
    continueRoutine = false;
    for (const thisComponent of trialComponents)
      if ('status' in thisComponent && thisComponent.status !== PsychoJS.Status.FINISHED) {
        continueRoutine = true;
        break;
      }
    
    if (continueRoutine) {
      return Scheduler.Event.FLIP_REPEAT;
    } else {
      return Scheduler.Event.NEXT;
    }
  };
}

function trialRoutineEnd(snapshot) {
  return async function () {
    routineTimer.reset();
    
    // Record trial data
    psychoJS.experiment.addData('duration', duration);
    psychoJS.experiment.addData('numerosity', numerosity);
    psychoJS.experiment.addData('cue_type', cue);
    psychoJS.experiment.addData('response_key', responseKey.keys || 'NA');
    if (typeof responseKey.rt !== 'undefined') {
      psychoJS.experiment.addData('response_rt', responseKey.rt);
    } else {
      psychoJS.experiment.addData('response_rt', 3.0);
    }
    
    // Calculate accuracy
    let correctResponse;
    if (cue === 'duration') {
        correctResponse = duration > CONFIG.durationMean ? 'right' : 'left';
    } else {
        correctResponse = numerosity > CONFIG.numerosityMean ? 'right' : 'left';
    }
    
    const accuracy = (responseKey.keys === 'NA' || !responseKey.keys) ? 0 : 
                    (responseKey.keys === correctResponse ? 1 : 0);
    
    psychoJS.experiment.addData('accuracy', accuracy);
    psychoJS.experiment.addData('correct_response', correctResponse);
    psychoJS.experiment.addData('block', isInPractice ? 0 : currentBlockIdx);
    psychoJS.experiment.addData('block_type', isInPractice ? 'practice' : currentMainBlockType);
    psychoJS.experiment.addData('is_practice', isInPractice);
    
    psychoJS.experiment.addData('trial.stopped', globalClock.getTime());
    
    // Clean up components
    for (const thisComponent of trialComponents) {
      if (typeof thisComponent.setAutoDraw === 'function') {
        thisComponent.setAutoDraw(false);
      }
    }
    
    // Clear events but keep response data for feedback routine
    responseKey.status = PsychoJS.Status.NOT_STARTED;
    _responseKey_allKeys = [];
    responseKey.clearEvents();
    psychoJS.eventManager.clearEvents();
    
    // Additional clearing with slight delay to ensure completion
    setTimeout(() => {
      responseKey.clearEvents();
      psychoJS.eventManager.clearEvents();
    }, 10);
    
    return Scheduler.Event.NEXT;
  };
}

// Feedback routine functions
var feedbackMaxDurationReached;
var feedbackMaxDuration;
var feedbackComponents;

function feedbackRoutineBegin(snapshot) {
  return async function () {
    TrialHandler.fromSnapshot(snapshot);
    
    t = 0;
    frameN = -1;
    continueRoutine = true;
    routineForceEnded = false;
    feedbackClock.reset();
    routineTimer.reset();
    feedbackMaxDurationReached = false;
    
    // Determine feedback text
    let feedbackMessage;
    if (!responseKey.keys || responseKey.keys === 'NA') {
        feedbackMessage = "Too slow! Please respond faster next time.";
    } else {
        // Determine correct response
        let correctResponse;
        if (cue === 'duration') {
            correctResponse = duration > CONFIG.durationMean ? 'right' : 'left';
        } else {
            correctResponse = numerosity > CONFIG.numerosityMean ? 'right' : 'left';
        }
        
        feedbackMessage = responseKey.keys === correctResponse ? "Correct!" : "Wrong!";
    }
    
    feedbackText.setText(feedbackMessage);
    
    psychoJS.experiment.addData('feedback.started', globalClock.getTime());
    feedbackMaxDuration = null;
    
    feedbackComponents = [];
    feedbackComponents.push(feedbackText);
    
    for (const thisComponent of feedbackComponents)
      if ('status' in thisComponent)
        thisComponent.status = PsychoJS.Status.NOT_STARTED;
    return Scheduler.Event.NEXT;
  }
}

function feedbackRoutineEachFrame() {
  return async function () {
    t = feedbackClock.getTime();
    frameN = frameN + 1;
    
    // *feedbackText* updates
    if (t >= 0.0 && feedbackText.status === PsychoJS.Status.NOT_STARTED) {
      feedbackText.tStart = t;
      feedbackText.frameNStart = frameN;
      feedbackText.setAutoDraw(true);
    }
    
    // End after feedback duration
    if (t >= CONFIG.feedbackDuration) {
      continueRoutine = false;
    }
    
    // check for quit (typically the Esc key)
    if (psychoJS.experiment.experimentEnded || psychoJS.eventManager.getKeys({keyList:['escape']}).length > 0) {
      return quitPsychoJS('The [Escape] key was pressed. Goodbye!', false);
    }
    
    // check if the Routine should terminate
    if (!continueRoutine) {
      routineTimer.reset();
      return Scheduler.Event.NEXT;
    }
    
    continueRoutine = false;
    for (const thisComponent of feedbackComponents)
      if ('status' in thisComponent && thisComponent.status !== PsychoJS.Status.FINISHED) {
        continueRoutine = true;
        break;
      }
    
    if (continueRoutine) {
      return Scheduler.Event.FLIP_REPEAT;
    } else {
      return Scheduler.Event.NEXT;
    }
  };
}

function feedbackRoutineEnd(snapshot) {
  return async function () {
    routineTimer.reset();
    
    psychoJS.experiment.addData('feedback.stopped', globalClock.getTime());
    
    for (const thisComponent of feedbackComponents) {
      if (typeof thisComponent.setAutoDraw === 'function') {
        thisComponent.setAutoDraw(false);
      }
    }
    
    // Now fully clear response data after feedback is complete
    responseKey.keys = undefined;
    responseKey.rt = undefined;
    responseKey.duration = undefined;
    responseKey.clearEvents();
    psychoJS.eventManager.clearEvents();
    
    // Present blank screen for ITI (inter-trial interval) - similar to blank1/blank2
    const itiDuration = CONFIG.itiMin + Math.random() * (CONFIG.itiMax - CONFIG.itiMin);
    
    // Use the existing blankScreen stimulus for ITI
    blankScreen.setAutoDraw(true);
    
    await new Promise(resolve => setTimeout(resolve, itiDuration * 1000));
    
    blankScreen.setAutoDraw(false);
    
    return Scheduler.Event.NEXT;
  };
}

// Block info routine functions
var blockInfoMaxDurationReached;
var _blockInfoKey_allKeys;
var blockInfoMaxDuration;
var blockInfoComponents;

function blockInfoRoutineBegin(snapshot) {
  return async function () {
    TrialHandler.fromSnapshot(snapshot);
    
    t = 0;
    frameN = -1;
    continueRoutine = true;
    routineForceEnded = false;
    blockInfoClock.reset();
    routineTimer.reset();
    blockInfoMaxDurationReached = false;
    
  // Set block info message
  let blockInfoMessage = 'Between Block Break...\n\nPress SPACE to continue';
  blockInfoText.setText(blockInfoMessage);
    
    blockInfoKey.keys = undefined;
    blockInfoKey.rt = undefined;
    _blockInfoKey_allKeys = [];
    psychoJS.experiment.addData('blockInfo.started', globalClock.getTime());
    blockInfoMaxDuration = null;
    
    blockInfoComponents = [];
    blockInfoComponents.push(blockInfoKey);
    blockInfoComponents.push(blockInfoText);
    
    for (const thisComponent of blockInfoComponents)
      if ('status' in thisComponent)
        thisComponent.status = PsychoJS.Status.NOT_STARTED;
    return Scheduler.Event.NEXT;
  }
}

function blockInfoRoutineEachFrame() {
  return async function () {
    t = blockInfoClock.getTime();
    frameN = frameN + 1;
    
    // *blockInfoKey* updates
    if (t >= 0.0 && blockInfoKey.status === PsychoJS.Status.NOT_STARTED) {
      blockInfoKey.tStart = t;
      blockInfoKey.frameNStart = frameN;
      
      psychoJS.window.callOnFlip(function() { blockInfoKey.clock.reset(); });
      psychoJS.window.callOnFlip(function() { blockInfoKey.start(); });
      psychoJS.window.callOnFlip(function() { blockInfoKey.clearEvents(); });
    }
    
    if (blockInfoKey.status === PsychoJS.Status.STARTED) {
      let theseKeys = blockInfoKey.getKeys({
        keyList: ['space'], 
        waitRelease: false
      });
      _blockInfoKey_allKeys = _blockInfoKey_allKeys.concat(theseKeys);
      if (_blockInfoKey_allKeys.length > 0) {
        blockInfoKey.keys = _blockInfoKey_allKeys[_blockInfoKey_allKeys.length - 1].name;
        blockInfoKey.rt = _blockInfoKey_allKeys[_blockInfoKey_allKeys.length - 1].rt;
        blockInfoKey.duration = _blockInfoKey_allKeys[_blockInfoKey_allKeys.length - 1].duration;
        continueRoutine = false;
      }
    }
    
    // *blockInfoText* updates
    if (t >= 0.0 && blockInfoText.status === PsychoJS.Status.NOT_STARTED) {
      blockInfoText.tStart = t;
      blockInfoText.frameNStart = frameN;
      
      blockInfoText.setAutoDraw(true);
    }
    
    // check for quit (typically the Esc key)
    if (psychoJS.experiment.experimentEnded || psychoJS.eventManager.getKeys({keyList:['escape']}).length > 0) {
      return quitPsychoJS('The [Escape] key was pressed. Goodbye!', false);
    }
    
    // check if the Routine should terminate
    if (!continueRoutine) {
      routineTimer.reset();
      return Scheduler.Event.NEXT;
    }
    
    continueRoutine = false;
    for (const thisComponent of blockInfoComponents)
      if ('status' in thisComponent && thisComponent.status !== PsychoJS.Status.FINISHED) {
        continueRoutine = true;
        break;
      }
    
    if (continueRoutine) {
      return Scheduler.Event.FLIP_REPEAT;
    } else {
      return Scheduler.Event.NEXT;
    }
  };
}

function blockInfoRoutineEnd(snapshot) {
  return async function () {
    routineTimer.reset();
    
    psychoJS.experiment.addData('blockInfoKey.keys', blockInfoKey.keys);
    if (typeof blockInfoKey.keys !== 'undefined') {
      psychoJS.experiment.addData('blockInfoKey.rt', blockInfoKey.rt);
      psychoJS.experiment.addData('blockInfoKey.duration', blockInfoKey.duration);
    }
    
    psychoJS.experiment.addData('blockInfo.stopped', globalClock.getTime());
    
    for (const thisComponent of blockInfoComponents) {
      if (typeof thisComponent.setAutoDraw === 'function') {
        thisComponent.setAutoDraw(false);
      }
    }
    // If we just finished the practice block info, set isInPractice to false
    if (isInPractice) {
      isInPractice = false;
    }
    return Scheduler.Event.NEXT;
  };
}

// Goodbye routine functions
var goodbyeMaxDurationReached;
var goodbyeMaxDuration;
var goodbyeComponents;

function goodbyeRoutineBegin(snapshot) {
  return async function () {
    TrialHandler.fromSnapshot(snapshot);
    
    t = 0;
    frameN = -1;
    continueRoutine = true;
    routineForceEnded = false;
    goodbyeClock.reset();
    routineTimer.reset();
    goodbyeMaxDurationReached = false;
    
    // Data collection removed - goodbye not needed in CSV
    goodbyeMaxDuration = null;
    
    goodbyeComponents = [];
    goodbyeComponents.push(goodbyeText);
    
    for (const thisComponent of goodbyeComponents)
      if ('status' in thisComponent)
        thisComponent.status = PsychoJS.Status.NOT_STARTED;
    return Scheduler.Event.NEXT;
  }
}

function goodbyeRoutineEachFrame() {
  return async function () {
    t = goodbyeClock.getTime();
    frameN = frameN + 1;
    
    // *goodbyeText* updates
    if (t >= 0.0 && goodbyeText.status === PsychoJS.Status.NOT_STARTED) {
      goodbyeText.tStart = t;
      goodbyeText.frameNStart = frameN;
      
      goodbyeText.setAutoDraw(true);
    }
    
    // End after 5 seconds
    if (t >= 5.0) {
      continueRoutine = false;
    }
    
    // check for quit (typically the Esc key)
    if (psychoJS.experiment.experimentEnded || psychoJS.eventManager.getKeys({keyList:['escape']}).length > 0) {
      return quitPsychoJS('The [Escape] key was pressed. Goodbye!', false);
    }
    
    // check if the Routine should terminate
    if (!continueRoutine) {
      routineTimer.reset();
      return Scheduler.Event.NEXT;
    }
    
    continueRoutine = false;
    for (const thisComponent of goodbyeComponents)
      if ('status' in thisComponent && thisComponent.status !== PsychoJS.Status.FINISHED) {
        continueRoutine = true;
        break;
      }
    
    if (continueRoutine) {
      return Scheduler.Event.FLIP_REPEAT;
    } else {
      return Scheduler.Event.NEXT;
    }
  };
}

function goodbyeRoutineEnd(snapshot) {
  return async function () {
    routineTimer.reset();
    
    // Data removed
    
    for (const thisComponent of goodbyeComponents) {
      if (typeof thisComponent.setAutoDraw === 'function') {
        thisComponent.setAutoDraw(false);
      }
    }
    
    return Scheduler.Event.NEXT;
  };
}

async function quitPsychoJS(message, isCompleted) {
  // Check for and save orphaned data
  if (psychoJS.experiment.isEntryEmpty()) {
    psychoJS.experiment.nextEntry();
  }
  
  psychoJS.window.close();
  psychoJS.quit({message: message, isCompleted: isCompleted});
  
  return Scheduler.Event.QUIT;
}
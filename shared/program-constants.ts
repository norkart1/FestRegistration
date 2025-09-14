// Program classification constants
export const JUNIOR_PROGRAMS = {
  stage: ["junior-qiraat", "junior-bank", "junior-speech-arabic", "junior-speech-english", "junior-speech-malayalam", "junior-speech-urdu", "junior-song-arabic"],
  nonStage: ["junior-drawing", "junior-sudoku", "junior-memory-test", "junior-dictation"]
};

export const SENIOR_PROGRAMS = {
  stage: ["senior-qiraat", "senior-bank", "senior-class-presentation", "senior-speech-arabic", "senior-speech-english", "senior-speech-malayalam"],
  nonStage: ["senior-arabic-calligraphy", "senior-poster-making", "senior-arabic-essay", "senior-malayalam-essay", "senior-english-essay"]
};

export const PROGRAM_LABELS = {
  "junior-qiraat": "ഖിറാഅത്ത്",
  "junior-bank": "ബാങ്ക്",
  "junior-speech-arabic": "പ്രസംഗം അറബി",
  "junior-speech-english": "പ്രസംഗം ഇംഗ്ലീഷ്",
  "junior-speech-malayalam": "പ്രസംഗം മലയാളം",
  "junior-speech-urdu": "പ്രസംഗം ഉറുദു",
  "junior-song-arabic": "ഗാനം അറബി",
  "junior-drawing": "ചിത്രരചന",
  "junior-sudoku": "സുഡോക്കും",
  "junior-memory-test": "മെമ്മറി ടെസ്റ്റ്",
  "junior-dictation": "കേട്ടെഴുത്ത്",
  "senior-qiraat": "ഖിറാഅത്ത്",
  "senior-bank": "ബാങ്ക്",
  "senior-class-presentation": "ക്ലാസ് അവതരണം",
  "senior-speech-arabic": "പ്രസംഗം അറബി",
  "senior-speech-english": "പ്രസംഗം ഇംഗ്ലീഷ്",
  "senior-speech-malayalam": "പ്രസംഗം മലയാളം",
  "senior-arabic-calligraphy": "അറബിക് ആലിഗ്രാഫി",
  "senior-poster-making": "പോസ്റ്റർ മേക്കിങ്",
  "senior-arabic-essay": "അറബി പ്രബന്ധം",
  "senior-malayalam-essay": "മലയാളം പ്രബന്ധം",
  "senior-english-essay": "ഇംഗ്ലീഷ് പ്രബന്ധം"
};

// Legacy program mapping for backward compatibility
export const LEGACY_PROGRAM_MAPPINGS: Record<string, string> = {
  // Old single word IDs to new format
  'qiraat': 'junior-qiraat',
  'bank': 'junior-bank', 
  'speech-arabic': 'junior-speech-arabic',
  'speech-english': 'junior-speech-english',
  'speech-malayalam': 'junior-speech-malayalam',
  'speech-urdu': 'junior-speech-urdu',
  'song-arabic': 'junior-song-arabic',
  'drawing': 'junior-drawing',
  'sudoku': 'junior-sudoku',
  'memory-test': 'junior-memory-test',
  'dictation': 'junior-dictation',
  'class-presentation': 'senior-class-presentation',
  'arabic-calligraphy': 'senior-arabic-calligraphy',
  'poster-making': 'senior-poster-making',
  'arabic-essay': 'senior-arabic-essay',
  'malayalam-essay': 'senior-malayalam-essay',
  'english-essay': 'senior-english-essay',
  
  // Common misspellings or variations
  'qirat': 'junior-qiraat',
  'qira\'at': 'junior-qiraat',
  'presentation': 'senior-class-presentation',
  'calligraphy': 'senior-arabic-calligraphy',
  'poster': 'senior-poster-making',
  'essay-arabic': 'senior-arabic-essay',
  'essay-malayalam': 'senior-malayalam-essay',
  'essay-english': 'senior-english-essay'
};

// Utility functions for backward compatibility
export const normalizeProgramId = (programId: string): string => {
  return LEGACY_PROGRAM_MAPPINGS[programId] || programId;
};

export const normalizeProgramIds = (programIds: string[]): string[] => {
  return programIds.map(normalizeProgramId);
};

export const getProgramLabel = (programId: string): string => {
  const normalizedId = normalizeProgramId(programId);
  return PROGRAM_LABELS[normalizedId as keyof typeof PROGRAM_LABELS] || programId;
};

export const isStageProgram = (programId: string): boolean => {
  const normalizedId = normalizeProgramId(programId);
  return [...JUNIOR_PROGRAMS.stage, ...SENIOR_PROGRAMS.stage].includes(normalizedId);
};

export const isNonStageProgram = (programId: string): boolean => {
  const normalizedId = normalizeProgramId(programId);
  return [...JUNIOR_PROGRAMS.nonStage, ...SENIOR_PROGRAMS.nonStage].includes(normalizedId);
};

export const getValidProgramsForCategory = (category: 'junior' | 'senior'): string[] => {
  if (category === 'junior') {
    return [...JUNIOR_PROGRAMS.stage, ...JUNIOR_PROGRAMS.nonStage];
  }
  return [...SENIOR_PROGRAMS.stage, ...SENIOR_PROGRAMS.nonStage];
};

export const categorizePrograms = (programIds: string[]) => {
  const normalized = normalizeProgramIds(programIds);
  return {
    stage: normalized.filter(isStageProgram),
    nonStage: normalized.filter(isNonStageProgram),
    invalid: normalized.filter(id => !isStageProgram(id) && !isNonStageProgram(id))
  };
};
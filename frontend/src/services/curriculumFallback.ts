import { Lesson, Exercise } from '../types';

interface CalibratedExercise {
  id: number;
  type: 'multiple_choice' | 'word_bank' | 'match_pairs' | 'fill_in_blank' | 'type_answer';
  prompt: string;
  prompt_translation?: string;
  audio_text?: string;
  options?: any;
  correct_answer?: any;
  metadata?: any;
}

interface LevelData {
  title: string;
  skill_title: string;
  xp_reward: number;
  exercises: CalibratedExercise[];
}

const COURSE_ID_TO_LANG: Record<number, string> = {
  1: 'es',
  2: 'fr',
  3: 'de',
  4: 'it',
  5: 'ja',
  6: 'zh',
  7: 'pt',
  8: 'ru',
  9: 'ko',
  10: 'hi',
  11: 'ar',
};

// =============================================================================
// MULTI-LANGUAGE CALIBRATED CURRICULUM DATA
// =============================================================================

const CURRICULUM_STORE: Record<string, Record<number, LevelData>> = {
  // ---------------------------------------------------------------------------
  // FRENCH (fr) - Default course
  // ---------------------------------------------------------------------------
  fr: {
    1: {
      title: 'Basic Vocabulary & Recognition',
      skill_title: 'Basics 1',
      xp_reward: 10,
      exercises: [
        {
          id: 2101,
          type: 'multiple_choice',
          prompt: "Which of these is 'the boy'?",
          prompt_translation: 'Select the matching picture or phrase',
          audio_text: 'le garçon',
          options: [
            { text: 'le garçon', translation: 'the boy' },
            { text: 'la fille', translation: 'the girl' },
            { text: 'la pomme', translation: 'the apple' },
          ],
          correct_answer: 'le garçon',
        },
        {
          id: 2102,
          type: 'multiple_choice',
          prompt: "How do you say 'Hello' in French?",
          prompt_translation: 'Choose the greeting',
          audio_text: 'Bonjour',
          options: [
            { text: 'Bonjour', translation: 'Hello' },
            { text: 'Au revoir', translation: 'Goodbye' },
            { text: 'Merci', translation: 'Thank you' },
          ],
          correct_answer: 'Bonjour',
        },
        {
          id: 2103,
          type: 'word_bank',
          prompt: "Translate 'the girl'",
          prompt_translation: 'la fille',
          audio_text: 'la fille',
          options: ['the', 'girl', 'boy', 'water', 'apple'],
          correct_answer: 'the girl',
        },
        {
          id: 2104,
          type: 'multiple_choice',
          prompt: "What does 'l\\'eau' mean?",
          prompt_translation: 'Select the translation',
          audio_text: "l'eau",
          options: [
            { text: 'the water', translation: "l'eau" },
            { text: 'the milk', translation: 'le lait' },
            { text: 'the bread', translation: 'le pain' },
          ],
          correct_answer: 'the water',
        },
      ],
    },
    2: {
      title: 'Sentence Construction & Matching',
      skill_title: 'Phrases',
      xp_reward: 10,
      exercises: [
        {
          id: 2201,
          type: 'match_pairs',
          prompt: 'Tap the matching pairs',
          prompt_translation: 'Connect French and English words',
          options: {
            left: ['bonjour', 'merci', 'au revoir', "s'il vous plaît"],
            right: ['hello', 'thank you', 'goodbye', 'please'],
          },
          correct_answer: {
            bonjour: 'hello',
            merci: 'thank you',
            'au revoir': 'goodbye',
            "s'il vous plaît": 'please',
          },
        },
        {
          id: 2202,
          type: 'word_bank',
          prompt: 'Translate this sentence: "Je mange une pomme"',
          prompt_translation: 'Je mange une pomme.',
          audio_text: 'Je mange une pomme',
          options: ['I', 'eat', 'an', 'apple', 'he', 'drinks', 'water', 'bread'],
          correct_answer: 'I eat an apple',
        },
        {
          id: 2203,
          type: 'word_bank',
          prompt: 'Translate this sentence: "Elle boit du lait"',
          prompt_translation: 'Elle boit du lait.',
          audio_text: 'Elle boit du lait',
          options: ['She', 'drinks', 'milk', 'He', 'eats', 'coffee', 'juice'],
          correct_answer: 'She drinks milk',
        },
        {
          id: 2204,
          type: 'match_pairs',
          prompt: 'Match food vocabulary',
          prompt_translation: 'Connect French words to English meanings',
          options: {
            left: ['le pain', 'le lait', 'la pomme', "l'eau"],
            right: ['the bread', 'the milk', 'the apple', 'the water'],
          },
          correct_answer: {
            'le pain': 'the bread',
            'le lait': 'the milk',
            'la pomme': 'the apple',
            "l'eau": 'the water',
          },
        },
      ],
    },
    3: {
      title: 'Grammar & Verb Conjugations',
      skill_title: 'Grammar',
      xp_reward: 15,
      exercises: [
        {
          id: 2301,
          type: 'fill_in_blank',
          prompt: 'Complete the sentence with the correct verb',
          prompt_translation: 'The woman drinks water.',
          audio_text: "La femme boit de l'eau",
          options: ['boit', 'mange', 'bois'],
          correct_answer: 'boit',
          metadata: { sentence_prefix: 'La femme', sentence_suffix: "de l'eau." },
        },
        {
          id: 2302,
          type: 'fill_in_blank',
          prompt: "Choose the correct form of 'manger'",
          prompt_translation: 'He eats bread.',
          audio_text: 'Il mange du pain',
          options: ['mange', 'boit', 'manges'],
          correct_answer: 'mange',
          metadata: { sentence_prefix: 'Il', sentence_suffix: 'du pain.' },
        },
        {
          id: 2303,
          type: 'word_bank',
          prompt: 'Translate this negative sentence',
          prompt_translation: 'Je ne mange pas de viande.',
          audio_text: 'Je ne mange pas de viande',
          options: ['I', 'do', 'not', 'eat', 'meat', 'she', 'drinks', 'water'],
          correct_answer: 'I do not eat meat',
        },
        {
          id: 2304,
          type: 'fill_in_blank',
          prompt: 'Select the correct pronoun',
          prompt_translation: 'We drink milk.',
          audio_text: 'Nous buvons du lait',
          options: ['Nous', 'Elles', 'Tu'],
          correct_answer: 'Nous',
          metadata: { sentence_prefix: '', sentence_suffix: 'buvons du lait.' },
        },
      ],
    },
    5: {
      title: 'Listening Comprehension Challenge',
      skill_title: 'Audio Challenge',
      xp_reward: 15,
      exercises: [
        {
          id: 2501,
          type: 'word_bank',
          prompt: '🎧 Listen carefully and arrange what you hear',
          prompt_translation: 'Tap the spoken words',
          audio_text: 'Bonjour, enchanté de faire votre connaissance',
          options: ['Bonjour,', 'enchanté', 'de', 'faire', 'votre', 'connaissance', 'merci', 'soir'],
          correct_answer: 'Bonjour, enchanté de faire votre connaissance',
          metadata: { is_audio_challenge: true },
        },
        {
          id: 2502,
          type: 'word_bank',
          prompt: '🎧 Tap what you hear',
          prompt_translation: 'Listen and assemble',
          audio_text: "L'homme boit de l'eau",
          options: ["L'homme", 'boit', 'de', "l'eau", 'la', 'femme', 'mange'],
          correct_answer: "L'homme boit de l'eau",
          metadata: { is_audio_challenge: true },
        },
        {
          id: 2503,
          type: 'multiple_choice',
          prompt: '🎧 What did you hear?',
          prompt_translation: 'Select the matching audio sentence',
          audio_text: "Une table pour deux, s'il vous plaît",
          options: [
            { text: "Une table pour deux, s'il vous plaît", translation: 'A table for two, please' },
            { text: "L'addition, s'il vous plaît", translation: 'The bill, please' },
            { text: 'Un café au lait', translation: 'A coffee with milk' },
          ],
          correct_answer: "Une table pour deux, s'il vous plaît",
        },
      ],
    },
    6: {
      title: 'Unit 1 Trophy Mastery Challenge',
      skill_title: 'Checkpoint Challenge',
      xp_reward: 25,
      exercises: [
        {
          id: 2601,
          type: 'type_answer',
          prompt: "Type 'Good morning' in French",
          prompt_translation: 'Enter the French greeting (no word bank)',
          audio_text: 'Bonjour',
          correct_answer: 'bonjour',
        },
        {
          id: 2602,
          type: 'type_answer',
          prompt: "Translate 'I am a woman' to French",
          prompt_translation: 'Type in French',
          audio_text: 'Je suis une femme',
          correct_answer: 'je suis une femme',
        },
        {
          id: 2603,
          type: 'fill_in_blank',
          prompt: 'Complete the sentence with the correct verb',
          prompt_translation: 'The boy eats bread.',
          audio_text: 'Le garçon mange du pain',
          options: ['mange', 'boit', 'manges'],
          correct_answer: 'mange',
          metadata: { sentence_prefix: 'Le garçon', sentence_suffix: 'du pain.' },
        },
        {
          id: 2604,
          type: 'type_answer',
          prompt: "Write 'Please' in French",
          prompt_translation: "Enter 's'il vous plaît' or 's'il te plaît'",
          audio_text: "S'il vous plaît",
          correct_answer: "s'il vous plaît",
        },
      ],
    },
  },

  // ---------------------------------------------------------------------------
  // SPANISH (es)
  // ---------------------------------------------------------------------------
  es: {
    1: {
      title: 'Basic Vocabulary & Recognition',
      skill_title: 'Basics 1',
      xp_reward: 10,
      exercises: [
        {
          id: 101,
          type: 'multiple_choice',
          prompt: "Which of these is 'the boy'?",
          prompt_translation: 'Select the matching picture or phrase',
          audio_text: 'el niño',
          options: [
            { text: 'el niño', translation: 'the boy' },
            { text: 'la niña', translation: 'the girl' },
            { text: 'la manzana', translation: 'the apple' },
          ],
          correct_answer: 'el niño',
        },
        {
          id: 102,
          type: 'multiple_choice',
          prompt: "How do you say 'Hello' in Spanish?",
          prompt_translation: 'Choose the greeting',
          audio_text: 'Hola',
          options: [
            { text: 'Hola', translation: 'Hello' },
            { text: 'Adiós', translation: 'Goodbye' },
            { text: 'Gracias', translation: 'Thank you' },
          ],
          correct_answer: 'Hola',
        },
        {
          id: 103,
          type: 'word_bank',
          prompt: "Translate 'the girl'",
          prompt_translation: 'la niña',
          audio_text: 'la niña',
          options: ['the', 'girl', 'boy', 'water', 'apple'],
          correct_answer: 'the girl',
        },
        {
          id: 104,
          type: 'multiple_choice',
          prompt: "What does 'el agua' mean?",
          prompt_translation: 'Select the translation',
          audio_text: 'el agua',
          options: [
            { text: 'the water', translation: 'el agua' },
            { text: 'the milk', translation: 'la leche' },
            { text: 'the bread', translation: 'el pan' },
          ],
          correct_answer: 'the water',
        },
      ],
    },
    2: {
      title: 'Sentence Construction & Matching',
      skill_title: 'Phrases',
      xp_reward: 10,
      exercises: [
        {
          id: 201,
          type: 'match_pairs',
          prompt: 'Tap the matching pairs',
          prompt_translation: 'Connect words in Spanish and English',
          options: {
            left: ['hola', 'gracias', 'adiós', 'por favor'],
            right: ['hello', 'thank you', 'goodbye', 'please'],
          },
          correct_answer: {
            hola: 'hello',
            gracias: 'thank you',
            adiós: 'goodbye',
            'por favor': 'please',
          },
        },
        {
          id: 202,
          type: 'word_bank',
          prompt: 'Translate this sentence: "Yo como una manzana."',
          prompt_translation: 'Yo como una manzana.',
          audio_text: 'Yo como una manzana',
          options: ['I', 'eat', 'an', 'apple', 'he', 'drinks', 'water', 'bread'],
          correct_answer: 'I eat an apple',
        },
        {
          id: 203,
          type: 'word_bank',
          prompt: 'Translate this sentence: "Ella bebe leche."',
          prompt_translation: 'Ella bebe leche.',
          audio_text: 'Ella bebe leche',
          options: ['She', 'drinks', 'milk', 'He', 'eats', 'coffee', 'juice'],
          correct_answer: 'She drinks milk',
        },
      ],
    },
    3: {
      title: 'Grammar & Verb Conjugations',
      skill_title: 'Grammar',
      xp_reward: 10,
      exercises: [
        {
          id: 301,
          type: 'fill_in_blank',
          prompt: 'Complete the sentence with the correct verb',
          prompt_translation: 'The woman drinks water.',
          audio_text: 'La mujer bebe agua',
          options: ['bebe', 'comes', 'bebo'],
          correct_answer: 'bebe',
          metadata: { sentence_prefix: 'La mujer', sentence_suffix: 'agua.' },
        },
        {
          id: 302,
          type: 'fill_in_blank',
          prompt: "Choose the correct form of 'to eat'",
          prompt_translation: 'He eats bread.',
          audio_text: 'Él come pan',
          options: ['come', 'bebe', 'comes'],
          correct_answer: 'come',
          metadata: { sentence_prefix: 'Él', sentence_suffix: 'pan.' },
        },
        {
          id: 303,
          type: 'word_bank',
          prompt: 'Translate this negative sentence',
          prompt_translation: 'Yo no como carne.',
          audio_text: 'Yo no como carne',
          options: ['I', 'do', 'not', 'eat', 'meat', 'she', 'drinks', 'water'],
          correct_answer: 'I do not eat meat',
        },
      ],
    },
    6: {
      title: 'Unit 1 Trophy Mastery Challenge',
      skill_title: 'Checkpoint Challenge',
      xp_reward: 25,
      exercises: [
        {
          id: 601,
          type: 'type_answer',
          prompt: "Type 'Good morning' in Spanish",
          prompt_translation: 'Enter the Spanish greeting (no word bank)',
          audio_text: 'Buenos días',
          correct_answer: 'buenos días',
        },
        {
          id: 602,
          type: 'type_answer',
          prompt: "Translate 'I am a woman' to Spanish",
          prompt_translation: 'Type in Spanish',
          audio_text: 'Yo soy una mujer',
          correct_answer: 'yo soy una mujer',
        },
        {
          id: 603,
          type: 'fill_in_blank',
          prompt: 'Complete the sentence with the correct verb',
          prompt_translation: 'The boy eats bread.',
          audio_text: 'El niño come pan',
          options: ['come', 'bebe', 'comes'],
          correct_answer: 'come',
          metadata: { sentence_prefix: 'El niño', sentence_suffix: 'pan.' },
        },
        {
          id: 604,
          type: 'type_answer',
          prompt: "Write 'Please' in Spanish",
          prompt_translation: "Enter 'por favor'",
          audio_text: 'Por favor',
          correct_answer: 'por favor',
        },
      ],
    },
  },

  // ---------------------------------------------------------------------------
  // GERMAN (de)
  // ---------------------------------------------------------------------------
  de: {
    1: {
      title: 'Basic Vocabulary & Recognition',
      skill_title: 'Basics 1',
      xp_reward: 10,
      exercises: [
        {
          id: 3101,
          type: 'multiple_choice',
          prompt: "Which of these is 'the boy'?",
          prompt_translation: 'Select the matching German word',
          audio_text: 'der Junge',
          options: [
            { text: 'der Junge', translation: 'the boy' },
            { text: 'das Mädchen', translation: 'the girl' },
            { text: 'der Apfel', translation: 'the apple' },
          ],
          correct_answer: 'der Junge',
        },
        {
          id: 3102,
          type: 'multiple_choice',
          prompt: "How do you say 'Hello' in German?",
          prompt_translation: 'Choose the greeting',
          audio_text: 'Hallo',
          options: [
            { text: 'Hallo', translation: 'Hello' },
            { text: 'Tschüss', translation: 'Goodbye' },
            { text: 'Danke', translation: 'Thank you' },
          ],
          correct_answer: 'Hallo',
        },
        {
          id: 3103,
          type: 'word_bank',
          prompt: "Translate 'the girl'",
          prompt_translation: 'das Mädchen',
          audio_text: 'das Mädchen',
          options: ['the', 'girl', 'boy', 'water', 'apple'],
          correct_answer: 'the girl',
        },
        {
          id: 3104,
          type: 'multiple_choice',
          prompt: "What does 'das Wasser' mean?",
          prompt_translation: 'Select the translation',
          audio_text: 'das Wasser',
          options: [
            { text: 'the water', translation: 'das Wasser' },
            { text: 'the milk', translation: 'die Milch' },
            { text: 'the bread', translation: 'das Brot' },
          ],
          correct_answer: 'the water',
        },
      ],
    },
  },

  // ---------------------------------------------------------------------------
  // JAPANESE (ja)
  // ---------------------------------------------------------------------------
  ja: {
    1: {
      title: 'Basic Hiragana & Greetings',
      skill_title: 'Basics 1',
      xp_reward: 10,
      exercises: [
        {
          id: 4101,
          type: 'multiple_choice',
          prompt: "Which of these is 'Hello' in Japanese?",
          prompt_translation: 'Select the greeting',
          audio_text: 'こんにちは',
          options: [
            { text: 'こんにちは (Konnichiwa)', translation: 'Hello' },
            { text: 'さようなら (Sayounara)', translation: 'Goodbye' },
            { text: 'ありがとう (Arigatou)', translation: 'Thank you' },
          ],
          correct_answer: 'こんにちは (Konnichiwa)',
        },
        {
          id: 4102,
          type: 'multiple_choice',
          prompt: "What does 'みず (Mizu)' mean?",
          prompt_translation: 'Select the translation',
          audio_text: 'みず',
          options: [
            { text: 'water', translation: 'みず' },
            { text: 'tea', translation: 'おちゃ' },
            { text: 'rice', translation: 'ごはん' },
          ],
          correct_answer: 'water',
        },
        {
          id: 4103,
          type: 'word_bank',
          prompt: "Translate 'Thank you very much'",
          prompt_translation: 'どうもありがとう',
          audio_text: 'どうもありがとう',
          options: ['Thank', 'you', 'very', 'much', 'hello', 'goodbye'],
          correct_answer: 'Thank you very much',
        },
      ],
    },
  },
};

// =============================================================================
// PUBLIC HELPER FUNCTIONS
// =============================================================================

export function getFallbackLesson(level: number, courseId?: number, lang?: string): Lesson {
  let langCode = 'fr'; // default French

  if (lang) {
    langCode = lang.toLowerCase().trim();
  } else if (courseId && COURSE_ID_TO_LANG[courseId]) {
    langCode = COURSE_ID_TO_LANG[courseId];
  } else if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('duo_active_course_id');
    if (stored) {
      const parsed = parseInt(stored, 10);
      if (parsed && COURSE_ID_TO_LANG[parsed]) {
        langCode = COURSE_ID_TO_LANG[parsed];
      }
    }
  }

  const courseLevels = CURRICULUM_STORE[langCode] || CURRICULUM_STORE['fr'] || CURRICULUM_STORE['es'];

  // Map higher levels (e.g. 7, 8, 14, 20) by wrapping modulo 6 if not explicitly configured
  let effectiveLevel = level;
  if (!courseLevels[effectiveLevel]) {
    const modulo = ((level - 1) % 6) + 1;
    effectiveLevel = modulo === 4 ? 1 : modulo; // avoid chest node for lessons
  }

  const levelConfig = courseLevels[effectiveLevel] || courseLevels[1];

  const exercises: Exercise[] = (levelConfig.exercises || []).map((ex, idx) => ({
    id: ex.id,
    lesson_id: level,
    order_index: idx + 1,
    type: ex.type,
    prompt: ex.prompt,
    prompt_translation: ex.prompt_translation,
    audio_text: ex.audio_text,
    options: ex.options,
    metadata: {
      ...(ex.metadata || {}),
      correct_answer: ex.correct_answer,
    },
  }));

  return {
    id: level,
    skill_id: Math.ceil(level / 6),
    skill_title: levelConfig.skill_title,
    order_index: level,
    title: levelConfig.title,
    xp_reward: levelConfig.xp_reward || 15,
    exercises,
  };
}

/**
 * Evaluates an exercise client-side when the backend is unreachable.
 */
export function evaluateLocalExercise(
  exercise: Exercise,
  selectedAnswer: any,
  currentHearts: number
): { is_correct: boolean; correct_answer: any; explanation?: string; hearts_remaining: number } {
  const metadata = exercise.metadata || {};
  const correctAnswer = metadata.correct_answer;

  let isCorrect = false;

  if (exercise.type === 'multiple_choice') {
    if (typeof selectedAnswer === 'string' && typeof correctAnswer === 'string') {
      isCorrect = selectedAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase();
    } else {
      isCorrect = selectedAnswer === correctAnswer;
    }
  } else if (exercise.type === 'word_bank') {
    const userString = Array.isArray(selectedAnswer)
      ? selectedAnswer.join(' ').trim().toLowerCase()
      : String(selectedAnswer || '').trim().toLowerCase();

    const targetString = Array.isArray(correctAnswer)
      ? correctAnswer.join(' ').trim().toLowerCase()
      : String(correctAnswer || '').trim().toLowerCase();

    isCorrect = userString === targetString;
  } else if (exercise.type === 'match_pairs') {
    // selectedAnswer is an object of { [leftWord]: rightWord }
    if (typeof selectedAnswer === 'object' && selectedAnswer !== null && typeof correctAnswer === 'object') {
      const allKeys = Object.keys(correctAnswer);
      isCorrect = allKeys.length > 0 && allKeys.every((key) => {
        return selectedAnswer[key] === correctAnswer[key];
      });
    }
  } else if (exercise.type === 'fill_in_blank') {
    const userString = String(selectedAnswer || '').trim().toLowerCase();
    const targetString = String(correctAnswer || '').trim().toLowerCase();
    isCorrect = userString === targetString;
  } else if (exercise.type === 'type_answer') {
    const userString = String(selectedAnswer || '').trim().toLowerCase();
    const targetString = String(correctAnswer || '').trim().toLowerCase();
    isCorrect = userString === targetString;
  }

  const heartsRemaining = isCorrect ? currentHearts : Math.max(0, currentHearts - 1);

  return {
    is_correct: isCorrect,
    correct_answer: typeof correctAnswer === 'object' ? JSON.stringify(correctAnswer) : String(correctAnswer || ''),
    explanation: isCorrect ? 'Great job!' : `Correct answer: ${typeof correctAnswer === 'object' ? JSON.stringify(correctAnswer) : String(correctAnswer || '')}`,
    hearts_remaining: heartsRemaining,
  };
}

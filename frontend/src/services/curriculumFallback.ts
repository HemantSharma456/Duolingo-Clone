import { Lesson, Exercise } from '../types';

interface CalibratedExercise {
  id: number;
  type: 'multiple_choice' | 'word_bank' | 'match_pairs' | 'fill_in_blank' | 'type_answer';
  prompt: string;
  prompt_translation?: string | null;
  audio_text?: string | null;
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

export const COURSE_ID_TO_LANG: Record<number, string> = {
  1: 'es',
  2: 'fr',
  3: 'de',
  4: 'it',
  5: 'pt',
  6: 'ja',
  7: 'hi',
  8: 'en',
  9: 'chess',
  10: 'math',
  11: 'ko',
  12: 'zh',
  13: 'ru',
};

export const LANG_TO_COURSE_ID: Record<string, number> = {
  es: 1,
  fr: 2,
  de: 3,
  it: 4,
  pt: 5,
  ja: 6,
  hi: 7,
  en: 8,
  chess: 9,
  math: 10,
  ko: 11,
  zh: 12,
  ru: 13,
};

// =============================================================================
// MULTI-LANGUAGE CALIBRATED CURRICULUM DATA (ALL 13 COURSES)
// =============================================================================

const CURRICULUM_STORE: Record<string, Record<number, LevelData>> = {
  "en": {
    "1": {
      "title": "Basic Vocabulary & Recognition",
      "skill_title": "Basics 1",
      "xp_reward": 10,
      "exercises": [
        {
          "id": 8101,
          "type": "multiple_choice",
          "prompt": "Which of these is 'an apple'?",
          "prompt_translation": "Select the correct item",
          "audio_text": "an apple",
          "options": [
            {
              "text": "an apple",
              "translation": "apple fruit"
            },
            {
              "text": "a car",
              "translation": "vehicle"
            },
            {
              "text": "a book",
              "translation": "reading book"
            }
          ],
          "correct_answer": "an apple"
        },
        {
          "id": 8102,
          "type": "multiple_choice",
          "prompt": "How do you greet someone in the morning?",
          "prompt_translation": "Choose the greeting",
          "audio_text": "Good morning",
          "options": [
            {
              "text": "Good morning",
              "translation": "Morning greeting"
            },
            {
              "text": "Good night",
              "translation": "Evening farewell"
            },
            {
              "text": "Goodbye",
              "translation": "Farewell"
            }
          ],
          "correct_answer": "Good morning"
        },
        {
          "id": 8103,
          "type": "word_bank",
          "prompt": "Assemble the phrase: 'the boy'",
          "prompt_translation": "the boy",
          "audio_text": "the boy",
          "options": [
            "the",
            "boy",
            "girl",
            "water",
            "apple"
          ],
          "correct_answer": "the boy"
        },
        {
          "id": 8104,
          "type": "multiple_choice",
          "prompt": "What is 'water'?",
          "prompt_translation": "Select the drink",
          "audio_text": "water",
          "options": [
            {
              "text": "water",
              "translation": "clear liquid drink"
            },
            {
              "text": "milk",
              "translation": "dairy drink"
            },
            {
              "text": "bread",
              "translation": "baked food"
            }
          ],
          "correct_answer": "water"
        }
      ]
    },
    "2": {
      "title": "Sentence Construction & Matching",
      "skill_title": "Phrases",
      "xp_reward": 10,
      "exercises": [
        {
          "id": 8201,
          "type": "match_pairs",
          "prompt": "Tap the matching pairs",
          "prompt_translation": "Match words with synonyms",
          "audio_text": null,
          "options": {
            "left": [
              "hello",
              "thank you",
              "goodbye",
              "please"
            ],
            "right": [
              "hi",
              "thanks",
              "bye",
              "kindly"
            ]
          },
          "correct_answer": {
            "hello": "hi",
            "thank you": "thanks",
            "goodbye": "bye",
            "please": "kindly"
          }
        },
        {
          "id": 8202,
          "type": "word_bank",
          "prompt": "Assemble this sentence",
          "prompt_translation": "I eat an apple.",
          "audio_text": "I eat an apple",
          "options": [
            "I",
            "eat",
            "an",
            "apple",
            "he",
            "drinks",
            "water",
            "bread"
          ],
          "correct_answer": "I eat an apple"
        },
        {
          "id": 8203,
          "type": "word_bank",
          "prompt": "Assemble this sentence",
          "prompt_translation": "She drinks milk.",
          "audio_text": "She drinks milk",
          "options": [
            "She",
            "drinks",
            "milk",
            "He",
            "eats",
            "coffee",
            "juice"
          ],
          "correct_answer": "She drinks milk"
        },
        {
          "id": 8204,
          "type": "match_pairs",
          "prompt": "Match the words",
          "prompt_translation": "Connect food items",
          "audio_text": null,
          "options": {
            "left": [
              "bread",
              "milk",
              "apple",
              "water"
            ],
            "right": [
              "toast",
              "dairy",
              "fruit",
              "drink"
            ]
          },
          "correct_answer": {
            "bread": "toast",
            "milk": "dairy",
            "apple": "fruit",
            "water": "drink"
          }
        }
      ]
    },
    "3": {
      "title": "Grammar & Verb Forms",
      "skill_title": "Grammar",
      "xp_reward": 10,
      "exercises": [
        {
          "id": 8301,
          "type": "fill_in_blank",
          "prompt": "Complete the sentence with the correct verb",
          "prompt_translation": "The woman drinks water.",
          "audio_text": "The woman drinks water",
          "options": [
            "drinks",
            "drink",
            "drinking"
          ],
          "correct_answer": "drinks",
          "metadata": {
            "sentence_prefix": "The woman",
            "sentence_suffix": "water."
          }
        },
        {
          "id": 8302,
          "type": "fill_in_blank",
          "prompt": "Choose the correct verb form",
          "prompt_translation": "He eats bread.",
          "audio_text": "He eats bread",
          "options": [
            "eats",
            "eat",
            "eating"
          ],
          "correct_answer": "eats",
          "metadata": {
            "sentence_prefix": "He",
            "sentence_suffix": "bread."
          }
        },
        {
          "id": 8303,
          "type": "word_bank",
          "prompt": "Arrange this negative sentence",
          "prompt_translation": "I do not eat meat.",
          "audio_text": "I do not eat meat",
          "options": [
            "I",
            "do",
            "not",
            "eat",
            "meat",
            "she",
            "drinks",
            "water"
          ],
          "correct_answer": "I do not eat meat"
        },
        {
          "id": 8304,
          "type": "fill_in_blank",
          "prompt": "Select the correct plural verb",
          "prompt_translation": "We drink milk.",
          "audio_text": "We drink milk",
          "options": [
            "drink",
            "drinks",
            "drinking"
          ],
          "correct_answer": "drink",
          "metadata": {
            "sentence_prefix": "We",
            "sentence_suffix": "milk."
          }
        }
      ]
    },
    "4": {
      "title": "Milestone Chest",
      "skill_title": "Chest Milestone",
      "xp_reward": 10,
      "exercises": []
    },
    "5": {
      "title": "Listening & Audio Comprehension",
      "skill_title": "Audio Challenge",
      "xp_reward": 15,
      "exercises": [
        {
          "id": 8501,
          "type": "word_bank",
          "prompt": "🎧 Listen carefully and arrange what you hear",
          "prompt_translation": "Tap the spoken words",
          "audio_text": "Good morning, nice to meet you",
          "options": [
            "Good",
            "morning",
            "nice",
            "to",
            "meet",
            "you",
            "hello",
            "thanks"
          ],
          "correct_answer": "Good morning nice to meet you",
          "metadata": {
            "is_audio_challenge": true
          }
        },
        {
          "id": 8502,
          "type": "word_bank",
          "prompt": "🎧 Tap what you hear",
          "prompt_translation": "Listen and assemble",
          "audio_text": "The man drinks water",
          "options": [
            "The",
            "man",
            "drinks",
            "water",
            "woman",
            "eats",
            "bread"
          ],
          "correct_answer": "The man drinks water",
          "metadata": {
            "is_audio_challenge": true
          }
        },
        {
          "id": 8503,
          "type": "multiple_choice",
          "prompt": "🎧 What did you hear?",
          "prompt_translation": "Select the matching phrase",
          "audio_text": "A table for two, please",
          "options": [
            {
              "text": "A table for two, please",
              "translation": "Table reservation"
            },
            {
              "text": "The bill, please",
              "translation": "Payment request"
            },
            {
              "text": "A cup of coffee",
              "translation": "Drink order"
            }
          ],
          "correct_answer": "A table for two, please"
        }
      ]
    },
    "6": {
      "title": "Unit 1 Trophy Mastery Challenge",
      "skill_title": "Checkpoint Challenge",
      "xp_reward": 25,
      "exercises": [
        {
          "id": 8601,
          "type": "type_answer",
          "prompt": "Write 'Good morning' in English",
          "prompt_translation": "Enter the greeting (no word bank)",
          "audio_text": "Good morning",
          "options": null,
          "correct_answer": "good morning"
        },
        {
          "id": 8602,
          "type": "type_answer",
          "prompt": "Write 'Thank you' in English",
          "prompt_translation": "Enter the gratitude phrase",
          "audio_text": "Thank you",
          "options": null,
          "correct_answer": "thank you"
        },
        {
          "id": 8603,
          "type": "fill_in_blank",
          "prompt": "Complete the sentence with the correct verb",
          "prompt_translation": "The boy eats bread.",
          "audio_text": "The boy eats bread",
          "options": [
            "eats",
            "eat",
            "eating"
          ],
          "correct_answer": "eats",
          "metadata": {
            "sentence_prefix": "The boy",
            "sentence_suffix": "bread."
          }
        },
        {
          "id": 8604,
          "type": "type_answer",
          "prompt": "Write 'Please' in English",
          "prompt_translation": "Enter 'please'",
          "audio_text": "Please",
          "options": null,
          "correct_answer": "please"
        }
      ]
    }
  },
  "es": {
    "1": {
      "title": "Basic Vocabulary & Recognition",
      "skill_title": "Basics 1",
      "xp_reward": 10,
      "exercises": [
        {
          "id": 101,
          "type": "multiple_choice",
          "prompt": "Which of these is 'the boy'?",
          "prompt_translation": "Select the correct picture or phrase",
          "audio_text": "el niño",
          "options": [
            {
              "text": "el niño",
              "translation": "the boy"
            },
            {
              "text": "la niña",
              "translation": "the girl"
            },
            {
              "text": "la manzana",
              "translation": "the apple"
            }
          ],
          "correct_answer": "el niño"
        },
        {
          "id": 102,
          "type": "multiple_choice",
          "prompt": "How do you say 'Hello' in Spanish?",
          "prompt_translation": "Choose the greeting",
          "audio_text": "Hola",
          "options": [
            {
              "text": "Hola",
              "translation": "Hello"
            },
            {
              "text": "Adiós",
              "translation": "Goodbye"
            },
            {
              "text": "Gracias",
              "translation": "Thank you"
            }
          ],
          "correct_answer": "Hola"
        },
        {
          "id": 103,
          "type": "word_bank",
          "prompt": "Translate 'the girl'",
          "prompt_translation": "la niña",
          "audio_text": "la niña",
          "options": [
            "the",
            "girl",
            "boy",
            "water",
            "apple"
          ],
          "correct_answer": "the girl"
        },
        {
          "id": 104,
          "type": "multiple_choice",
          "prompt": "What does 'el agua' mean?",
          "prompt_translation": "Select the translation",
          "audio_text": "el agua",
          "options": [
            {
              "text": "the water",
              "translation": "el agua"
            },
            {
              "text": "the milk",
              "translation": "la leche"
            },
            {
              "text": "the bread",
              "translation": "el pan"
            }
          ],
          "correct_answer": "the water"
        }
      ]
    },
    "2": {
      "title": "Sentence Construction & Matching",
      "skill_title": "Phrases",
      "xp_reward": 10,
      "exercises": [
        {
          "id": 201,
          "type": "match_pairs",
          "prompt": "Tap the matching pairs",
          "prompt_translation": "Connect words in Spanish and English",
          "audio_text": null,
          "options": {
            "left": [
              "hola",
              "gracias",
              "adiós",
              "por favor"
            ],
            "right": [
              "hello",
              "thank you",
              "goodbye",
              "please"
            ]
          },
          "correct_answer": {
            "hola": "hello",
            "gracias": "thank you",
            "adiós": "goodbye",
            "por favor": "please"
          }
        },
        {
          "id": 202,
          "type": "word_bank",
          "prompt": "Translate this sentence",
          "prompt_translation": "Yo como una manzana.",
          "audio_text": "Yo como una manzana",
          "options": [
            "I",
            "eat",
            "an",
            "apple",
            "he",
            "drinks",
            "water",
            "bread"
          ],
          "correct_answer": "I eat an apple"
        },
        {
          "id": 203,
          "type": "word_bank",
          "prompt": "Translate this sentence",
          "prompt_translation": "Ella bebe leche.",
          "audio_text": "Ella bebe leche",
          "options": [
            "She",
            "drinks",
            "milk",
            "He",
            "eats",
            "coffee",
            "juice"
          ],
          "correct_answer": "She drinks milk"
        },
        {
          "id": 204,
          "type": "match_pairs",
          "prompt": "Match food vocabulary",
          "prompt_translation": "Match pairs",
          "audio_text": null,
          "options": {
            "left": [
              "el pan",
              "la leche",
              "la manzana",
              "el agua"
            ],
            "right": [
              "the bread",
              "the milk",
              "the apple",
              "the water"
            ]
          },
          "correct_answer": {
            "el pan": "the bread",
            "la leche": "the milk",
            "la manzana": "the apple",
            "el agua": "the water"
          }
        }
      ]
    },
    "3": {
      "title": "Grammar & Verb Conjugations",
      "skill_title": "Grammar",
      "xp_reward": 10,
      "exercises": [
        {
          "id": 301,
          "type": "fill_in_blank",
          "prompt": "Complete the sentence with the correct verb",
          "prompt_translation": "The woman drinks water.",
          "audio_text": "La mujer bebe agua",
          "options": [
            "bebe",
            "comes",
            "bebo"
          ],
          "correct_answer": "bebe",
          "metadata": {
            "sentence_prefix": "La mujer",
            "sentence_suffix": "agua."
          }
        },
        {
          "id": 302,
          "type": "fill_in_blank",
          "prompt": "Choose the correct form of 'to eat'",
          "prompt_translation": "He eats bread.",
          "audio_text": "Él come pan",
          "options": [
            "come",
            "bebe",
            "comes"
          ],
          "correct_answer": "come",
          "metadata": {
            "sentence_prefix": "Él",
            "sentence_suffix": "pan."
          }
        },
        {
          "id": 303,
          "type": "word_bank",
          "prompt": "Translate this negative sentence",
          "prompt_translation": "Yo no como carne.",
          "audio_text": "Yo no como carne",
          "options": [
            "I",
            "do",
            "not",
            "eat",
            "meat",
            "she",
            "drinks",
            "water"
          ],
          "correct_answer": "I do not eat meat"
        },
        {
          "id": 304,
          "type": "fill_in_blank",
          "prompt": "Select the correct pronoun",
          "prompt_translation": "We drink milk.",
          "audio_text": "Nosotros bebemos leche",
          "options": [
            "Nosotros",
            "Ellas",
            "Tú"
          ],
          "correct_answer": "Nosotros",
          "metadata": {
            "sentence_prefix": "",
            "sentence_suffix": "bebemos leche."
          }
        }
      ]
    },
    "4": {
      "title": "Milestone Chest",
      "skill_title": "Chest Milestone",
      "xp_reward": 10,
      "exercises": []
    },
    "5": {
      "title": "Listening & Audio Comprehension",
      "skill_title": "Audio Challenge",
      "xp_reward": 15,
      "exercises": [
        {
          "id": 501,
          "type": "word_bank",
          "prompt": "🎧 Listen carefully and arrange what you hear",
          "prompt_translation": "Tap the spoken words",
          "audio_text": "Buenos días, mucho gusto",
          "options": [
            "Buenos",
            "días",
            "mucho",
            "gusto",
            "hola",
            "gracias",
            "tarde"
          ],
          "correct_answer": "Buenos días mucho gusto",
          "metadata": {
            "is_audio_challenge": true
          }
        },
        {
          "id": 502,
          "type": "word_bank",
          "prompt": "🎧 Tap what you hear",
          "prompt_translation": "Listen and assemble",
          "audio_text": "El hombre bebe agua",
          "options": [
            "El",
            "hombre",
            "bebe",
            "agua",
            "la",
            "mujer",
            "come"
          ],
          "correct_answer": "El hombre bebe agua",
          "metadata": {
            "is_audio_challenge": true
          }
        },
        {
          "id": 503,
          "type": "multiple_choice",
          "prompt": "🎧 What did you hear?",
          "prompt_translation": "Select the matching audio sentence",
          "audio_text": "Una mesa para dos, por favor",
          "options": [
            {
              "text": "Una mesa para dos, por favor",
              "translation": "A table for two, please"
            },
            {
              "text": "La cuenta, por favor",
              "translation": "The bill, please"
            },
            {
              "text": "Un café con leche",
              "translation": "A coffee with milk"
            }
          ],
          "correct_answer": "Una mesa para dos, por favor"
        }
      ]
    },
    "6": {
      "title": "Unit 1 Trophy Mastery Challenge",
      "skill_title": "Checkpoint Challenge",
      "xp_reward": 25,
      "exercises": [
        {
          "id": 601,
          "type": "type_answer",
          "prompt": "Type 'Good morning' in Spanish",
          "prompt_translation": "Enter the Spanish greeting (no word bank)",
          "audio_text": "Buenos días",
          "options": null,
          "correct_answer": "buenos días"
        },
        {
          "id": 602,
          "type": "type_answer",
          "prompt": "Translate 'I am a woman' to Spanish",
          "prompt_translation": "Type in Spanish",
          "audio_text": "Yo soy una mujer",
          "options": null,
          "correct_answer": "yo soy una mujer"
        },
        {
          "id": 603,
          "type": "fill_in_blank",
          "prompt": "Complete the sentence with the correct verb",
          "prompt_translation": "The boy eats bread.",
          "audio_text": "El niño come pan",
          "options": [
            "come",
            "bebe",
            "comes"
          ],
          "correct_answer": "come",
          "metadata": {
            "sentence_prefix": "El niño",
            "sentence_suffix": "pan."
          }
        },
        {
          "id": 604,
          "type": "type_answer",
          "prompt": "Write 'Please' in Spanish",
          "prompt_translation": "Enter 'por favor'",
          "audio_text": "Por favor",
          "options": null,
          "correct_answer": "por favor"
        }
      ]
    }
  },
  "fr": {
    "1": {
      "title": "Basic Vocabulary & Recognition",
      "skill_title": "Basics 1",
      "xp_reward": 10,
      "exercises": [
        {
          "id": 2101,
          "type": "multiple_choice",
          "prompt": "Which of these is 'the boy'?",
          "prompt_translation": "Select the matching picture or phrase",
          "audio_text": "le garçon",
          "options": [
            {
              "text": "le garçon",
              "translation": "the boy"
            },
            {
              "text": "la fille",
              "translation": "the girl"
            },
            {
              "text": "la pomme",
              "translation": "the apple"
            }
          ],
          "correct_answer": "le garçon"
        },
        {
          "id": 2102,
          "type": "multiple_choice",
          "prompt": "How do you say 'Hello' in French?",
          "prompt_translation": "Choose the greeting",
          "audio_text": "Bonjour",
          "options": [
            {
              "text": "Bonjour",
              "translation": "Hello"
            },
            {
              "text": "Au revoir",
              "translation": "Goodbye"
            },
            {
              "text": "Merci",
              "translation": "Thank you"
            }
          ],
          "correct_answer": "Bonjour"
        },
        {
          "id": 2103,
          "type": "word_bank",
          "prompt": "Translate 'the girl'",
          "prompt_translation": "la fille",
          "audio_text": "la fille",
          "options": [
            "the",
            "girl",
            "boy",
            "water",
            "apple"
          ],
          "correct_answer": "the girl"
        },
        {
          "id": 2104,
          "type": "multiple_choice",
          "prompt": "What does 'l'eau' mean?",
          "prompt_translation": "Select the translation",
          "audio_text": "l'eau",
          "options": [
            {
              "text": "the water",
              "translation": "l'eau"
            },
            {
              "text": "the milk",
              "translation": "le lait"
            },
            {
              "text": "the bread",
              "translation": "le pain"
            }
          ],
          "correct_answer": "the water"
        }
      ]
    },
    "2": {
      "title": "Sentence Construction & Matching",
      "skill_title": "Phrases",
      "xp_reward": 10,
      "exercises": [
        {
          "id": 2201,
          "type": "match_pairs",
          "prompt": "Tap the matching pairs",
          "prompt_translation": "Connect French and English words",
          "audio_text": null,
          "options": {
            "left": [
              "bonjour",
              "merci",
              "au revoir",
              "s'il vous plaît"
            ],
            "right": [
              "hello",
              "thank you",
              "goodbye",
              "please"
            ]
          },
          "correct_answer": {
            "bonjour": "hello",
            "merci": "thank you",
            "au revoir": "goodbye",
            "s'il vous plaît": "please"
          }
        },
        {
          "id": 2202,
          "type": "word_bank",
          "prompt": "Translate this sentence",
          "prompt_translation": "Je mange une pomme.",
          "audio_text": "Je mange une pomme",
          "options": [
            "I",
            "eat",
            "an",
            "apple",
            "he",
            "drinks",
            "water",
            "bread"
          ],
          "correct_answer": "I eat an apple"
        },
        {
          "id": 2203,
          "type": "word_bank",
          "prompt": "Translate this sentence",
          "prompt_translation": "Elle boit du lait.",
          "audio_text": "Elle boit du lait",
          "options": [
            "She",
            "drinks",
            "milk",
            "He",
            "eats",
            "coffee",
            "juice"
          ],
          "correct_answer": "She drinks milk"
        }
      ]
    },
    "3": {
      "title": "Grammar & Verb Conjugations",
      "skill_title": "Grammar",
      "xp_reward": 10,
      "exercises": [
        {
          "id": 2301,
          "type": "fill_in_blank",
          "prompt": "Complete the sentence with the correct verb",
          "prompt_translation": "The woman drinks water.",
          "audio_text": "La femme boit de l'eau",
          "options": [
            "boit",
            "bois",
            "boivent"
          ],
          "correct_answer": "boit",
          "metadata": {
            "sentence_prefix": "La femme",
            "sentence_suffix": "de l'eau."
          }
        },
        {
          "id": 2302,
          "type": "fill_in_blank",
          "prompt": "Choose the correct form of 'manger'",
          "prompt_translation": "He eats bread.",
          "audio_text": "Il mange du pain",
          "options": [
            "mange",
            "manges",
            "mangent"
          ],
          "correct_answer": "mange",
          "metadata": {
            "sentence_prefix": "Il",
            "sentence_suffix": "du pain."
          }
        }
      ]
    },
    "4": {
      "title": "Milestone Chest",
      "skill_title": "Chest Milestone",
      "xp_reward": 10,
      "exercises": []
    },
    "5": {
      "title": "Listening & Audio Comprehension",
      "skill_title": "Audio Challenge",
      "xp_reward": 15,
      "exercises": [
        {
          "id": 2501,
          "type": "word_bank",
          "prompt": "🎧 Listen and arrange what you hear",
          "prompt_translation": "Tap the spoken words",
          "audio_text": "Bonjour, enchanté",
          "options": [
            "Bonjour",
            "enchanté",
            "merci",
            "au",
            "revoir"
          ],
          "correct_answer": "Bonjour enchanté",
          "metadata": {
            "is_audio_challenge": true
          }
        },
        {
          "id": 2502,
          "type": "multiple_choice",
          "prompt": "🎧 What did you hear?",
          "prompt_translation": "Choose the matching French sentence",
          "audio_text": "Une table pour deux, s'il vous plaît",
          "options": [
            {
              "text": "Une table pour deux, s'il vous plaît",
              "translation": "A table for two, please"
            },
            {
              "text": "L'addition, s'il vous plaît",
              "translation": "The bill, please"
            },
            {
              "text": "Un café au lait",
              "translation": "A coffee with milk"
            }
          ],
          "correct_answer": "Une table pour deux, s'il vous plaît"
        }
      ]
    },
    "6": {
      "title": "Unit 1 Trophy Mastery Challenge",
      "skill_title": "Checkpoint Challenge",
      "xp_reward": 25,
      "exercises": [
        {
          "id": 2601,
          "type": "type_answer",
          "prompt": "Type 'Hello' in French",
          "prompt_translation": "Enter the French greeting",
          "audio_text": "Bonjour",
          "options": null,
          "correct_answer": "bonjour"
        },
        {
          "id": 2602,
          "type": "type_answer",
          "prompt": "Write 'Thank you' in French",
          "prompt_translation": "Type 'merci'",
          "audio_text": "Merci",
          "options": null,
          "correct_answer": "merci"
        }
      ]
    }
  },
  "de": {
    "1": {
      "title": "Basic Vocabulary & Recognition",
      "skill_title": "Basics 1",
      "xp_reward": 10,
      "exercises": [
        {
          "id": 3101,
          "type": "multiple_choice",
          "prompt": "Which of these is 'the boy'?",
          "prompt_translation": "Select the correct phrase",
          "audio_text": "der Junge",
          "options": [
            {
              "text": "der Junge",
              "translation": "the boy"
            },
            {
              "text": "das Mädchen",
              "translation": "the girl"
            },
            {
              "text": "der Apfel",
              "translation": "the apple"
            }
          ],
          "correct_answer": "der Junge"
        },
        {
          "id": 3102,
          "type": "multiple_choice",
          "prompt": "How do you say 'Hello' in German?",
          "prompt_translation": "Choose the greeting",
          "audio_text": "Hallo",
          "options": [
            {
              "text": "Hallo",
              "translation": "Hello"
            },
            {
              "text": "Tschüss",
              "translation": "Goodbye"
            },
            {
              "text": "Danke",
              "translation": "Thank you"
            }
          ],
          "correct_answer": "Hallo"
        }
      ]
    },
    "2": {
      "title": "Sentence Construction & Matching",
      "skill_title": "Phrases",
      "xp_reward": 10,
      "exercises": [
        {
          "id": 3201,
          "type": "match_pairs",
          "prompt": "Tap the matching pairs",
          "prompt_translation": "Match words in German and English",
          "audio_text": null,
          "options": {
            "left": [
              "hallo",
              "danke",
              "tschüss",
              "bitte"
            ],
            "right": [
              "hello",
              "thank you",
              "goodbye",
              "please"
            ]
          },
          "correct_answer": {
            "hallo": "hello",
            "danke": "thank you",
            "tschüss": "goodbye",
            "bitte": "please"
          }
        },
        {
          "id": 3202,
          "type": "word_bank",
          "prompt": "Translate this sentence",
          "prompt_translation": "Ich esse einen Apfel.",
          "audio_text": "Ich esse einen Apfel",
          "options": [
            "I",
            "eat",
            "an",
            "apple",
            "he",
            "drinks",
            "water"
          ],
          "correct_answer": "I eat an apple"
        }
      ]
    },
    "3": {
      "title": "Grammar & Conjugations",
      "skill_title": "Grammar",
      "xp_reward": 10,
      "exercises": [
        {
          "id": 3301,
          "type": "fill_in_blank",
          "prompt": "Complete the sentence with the correct verb",
          "prompt_translation": "The woman drinks water.",
          "audio_text": "Die Frau trinkt Wasser",
          "options": [
            "trinkt",
            "trinke",
            "trinken"
          ],
          "correct_answer": "trinkt",
          "metadata": {
            "sentence_prefix": "Die Frau",
            "sentence_suffix": "Wasser."
          }
        }
      ]
    },
    "4": {
      "title": "Milestone Chest",
      "skill_title": "Chest Milestone",
      "xp_reward": 10,
      "exercises": []
    },
    "5": {
      "title": "Listening & Audio Comprehension",
      "skill_title": "Audio Challenge",
      "xp_reward": 15,
      "exercises": [
        {
          "id": 3501,
          "type": "word_bank",
          "prompt": "🎧 Listen and arrange what you hear",
          "prompt_translation": "Tap what you hear",
          "audio_text": "Guten Morgen, wie geht's?",
          "options": [
            "Guten",
            "Morgen",
            "wie",
            "geht's?",
            "Hallo",
            "danke"
          ],
          "correct_answer": "Guten Morgen wie geht's?",
          "metadata": {
            "is_audio_challenge": true
          }
        }
      ]
    },
    "6": {
      "title": "Unit 1 Trophy Mastery Challenge",
      "skill_title": "Checkpoint Challenge",
      "xp_reward": 25,
      "exercises": [
        {
          "id": 3601,
          "type": "type_answer",
          "prompt": "Type 'Thank you' in German",
          "prompt_translation": "Type 'danke'",
          "audio_text": "Danke",
          "options": null,
          "correct_answer": "danke"
        }
      ]
    }
  },
  "it": {
    "1": {
      "title": "Basic Vocabulary & Recognition",
      "skill_title": "Basics 1",
      "xp_reward": 10,
      "exercises": [
        {
          "id": 4101,
          "type": "multiple_choice",
          "prompt": "Quale di questi è 'il ragazzo'?",
          "prompt_translation": "Which of these is 'the boy'?",
          "audio_text": "il ragazzo",
          "options": [
            {
              "text": "il ragazzo",
              "translation": "the boy"
            },
            {
              "text": "la ragazza",
              "translation": "the girl"
            },
            {
              "text": "la mela",
              "translation": "the apple"
            }
          ],
          "correct_answer": "il ragazzo"
        },
        {
          "id": 4102,
          "type": "multiple_choice",
          "prompt": "Come si dice 'Ciao' in italiano?",
          "prompt_translation": "How do you say 'Hello' in Italian?",
          "audio_text": "Ciao",
          "options": [
            {
              "text": "Ciao",
              "translation": "Hello"
            },
            {
              "text": "Arrivederci",
              "translation": "Goodbye"
            },
            {
              "text": "Grazie",
              "translation": "Thank you"
            }
          ],
          "correct_answer": "Ciao"
        },
        {
          "id": 4103,
          "type": "word_bank",
          "prompt": "Traduci 'the girl'",
          "prompt_translation": "la ragazza",
          "audio_text": "la ragazza",
          "options": [
            "la",
            "ragazza",
            "ragazzo",
            "acqua",
            "mela"
          ],
          "correct_answer": "la ragazza"
        },
        {
          "id": 4104,
          "type": "multiple_choice",
          "prompt": "Cosa significa 'l'acqua'?",
          "prompt_translation": "What does 'l'acqua' mean?",
          "audio_text": "l'acqua",
          "options": [
            {
              "text": "the water",
              "translation": "l'acqua"
            },
            {
              "text": "the milk",
              "translation": "il latte"
            },
            {
              "text": "the bread",
              "translation": "il pane"
            }
          ],
          "correct_answer": "the water"
        }
      ]
    },
    "2": {
      "title": "Sentence Construction & Matching",
      "skill_title": "Phrases",
      "xp_reward": 10,
      "exercises": [
        {
          "id": 4201,
          "type": "match_pairs",
          "prompt": "Tap the matching pairs",
          "prompt_translation": "Match Italian and English words",
          "audio_text": null,
          "options": {
            "left": [
              "ciao",
              "grazie",
              "arrivederci",
              "per favore"
            ],
            "right": [
              "hello",
              "thank you",
              "goodbye",
              "please"
            ]
          },
          "correct_answer": {
            "ciao": "hello",
            "grazie": "thank you",
            "arrivederci": "goodbye",
            "per favore": "please"
          }
        },
        {
          "id": 4202,
          "type": "word_bank",
          "prompt": "Traduci questa frase",
          "prompt_translation": "Io mangio una mela.",
          "audio_text": "Io mangio una mela",
          "options": [
            "I",
            "eat",
            "an",
            "apple",
            "he",
            "drinks",
            "water",
            "bread"
          ],
          "correct_answer": "I eat an apple"
        },
        {
          "id": 4203,
          "type": "word_bank",
          "prompt": "Traduci questa frase",
          "prompt_translation": "Lei beve latte.",
          "audio_text": "Lei beve latte",
          "options": [
            "She",
            "drinks",
            "milk",
            "He",
            "eats",
            "coffee",
            "juice"
          ],
          "correct_answer": "She drinks milk"
        }
      ]
    },
    "3": {
      "title": "Grammar & Conjugations",
      "skill_title": "Grammar",
      "xp_reward": 10,
      "exercises": [
        {
          "id": 4301,
          "type": "fill_in_blank",
          "prompt": "Completa con il verbo corretto",
          "prompt_translation": "The woman drinks water.",
          "audio_text": "La donna beve acqua",
          "options": [
            "beve",
            "bevo",
            "bevono"
          ],
          "correct_answer": "beve",
          "metadata": {
            "sentence_prefix": "La donna",
            "sentence_suffix": "acqua."
          }
        }
      ]
    },
    "4": {
      "title": "Milestone Chest",
      "skill_title": "Chest Milestone",
      "xp_reward": 10,
      "exercises": []
    },
    "5": {
      "title": "Listening & Audio Comprehension",
      "skill_title": "Audio Challenge",
      "xp_reward": 15,
      "exercises": [
        {
          "id": 4501,
          "type": "word_bank",
          "prompt": "🎧 Ascolta e componi la frase",
          "prompt_translation": "Tap what you hear",
          "audio_text": "Buongiorno, molto piacere",
          "options": [
            "Buongiorno",
            "molto",
            "piacere",
            "grazie",
            "ciao"
          ],
          "correct_answer": "Buongiorno molto piacere",
          "metadata": {
            "is_audio_challenge": true
          }
        }
      ]
    },
    "6": {
      "title": "Unit 1 Trophy Mastery Challenge",
      "skill_title": "Checkpoint Challenge",
      "xp_reward": 25,
      "exercises": [
        {
          "id": 4601,
          "type": "type_answer",
          "prompt": "Scrivi 'Good morning' in italiano",
          "prompt_translation": "Enter 'buongiorno'",
          "audio_text": "Buongiorno",
          "options": null,
          "correct_answer": "buongiorno"
        },
        {
          "id": 4602,
          "type": "type_answer",
          "prompt": "Scrivi 'Thank you' in italiano",
          "prompt_translation": "Enter 'grazie'",
          "audio_text": "Grazie",
          "options": null,
          "correct_answer": "grazie"
        }
      ]
    }
  },
  "pt": {
    "1": {
      "title": "Basic Vocabulary & Recognition",
      "skill_title": "Basics 1",
      "xp_reward": 10,
      "exercises": [
        {
          "id": 5101,
          "type": "multiple_choice",
          "prompt": "Qual destes é 'o menino'?",
          "prompt_translation": "Which of these is 'the boy'?",
          "audio_text": "o menino",
          "options": [
            {
              "text": "o menino",
              "translation": "the boy"
            },
            {
              "text": "a menina",
              "translation": "the girl"
            },
            {
              "text": "a maçã",
              "translation": "the apple"
            }
          ],
          "correct_answer": "o menino"
        },
        {
          "id": 5102,
          "type": "multiple_choice",
          "prompt": "Como se diz 'Olá' em português?",
          "prompt_translation": "How do you say 'Hello'?",
          "audio_text": "Olá",
          "options": [
            {
              "text": "Olá",
              "translation": "Hello"
            },
            {
              "text": "Adeus",
              "translation": "Goodbye"
            },
            {
              "text": "Obrigado",
              "translation": "Thank you"
            }
          ],
          "correct_answer": "Olá"
        }
      ]
    },
    "2": {
      "title": "Sentence Construction & Matching",
      "skill_title": "Phrases",
      "xp_reward": 10,
      "exercises": [
        {
          "id": 5201,
          "type": "match_pairs",
          "prompt": "Toque nos pares correspondentes",
          "prompt_translation": "Match Portuguese and English",
          "audio_text": null,
          "options": {
            "left": [
              "olá",
              "obrigado",
              "adeus",
              "por favor"
            ],
            "right": [
              "hello",
              "thank you",
              "goodbye",
              "please"
            ]
          },
          "correct_answer": {
            "olá": "hello",
            "obrigado": "thank you",
            "adeus": "goodbye",
            "por favor": "please"
          }
        },
        {
          "id": 5202,
          "type": "word_bank",
          "prompt": "Traduza esta frase",
          "prompt_translation": "Eu como uma maçã.",
          "audio_text": "Eu como uma maçã",
          "options": [
            "I",
            "eat",
            "an",
            "apple",
            "he",
            "drinks",
            "water"
          ],
          "correct_answer": "I eat an apple"
        }
      ]
    },
    "3": {
      "title": "Grammar & Conjugations",
      "skill_title": "Grammar",
      "xp_reward": 10,
      "exercises": [
        {
          "id": 5301,
          "type": "fill_in_blank",
          "prompt": "Complete com o verbo correto",
          "prompt_translation": "The woman drinks water.",
          "audio_text": "A mulher bebe água",
          "options": [
            "bebe",
            "bebo",
            "bebem"
          ],
          "correct_answer": "bebe",
          "metadata": {
            "sentence_prefix": "A mulher",
            "sentence_suffix": "água."
          }
        }
      ]
    },
    "4": {
      "title": "Milestone Chest",
      "skill_title": "Chest Milestone",
      "xp_reward": 10,
      "exercises": []
    },
    "5": {
      "title": "Listening & Audio Comprehension",
      "skill_title": "Audio Challenge",
      "xp_reward": 15,
      "exercises": [
        {
          "id": 5501,
          "type": "word_bank",
          "prompt": "🎧 Ouça e monte a frase",
          "prompt_translation": "Tap what you hear",
          "audio_text": "Bom dia, muito prazer",
          "options": [
            "Bom",
            "dia",
            "muito",
            "prazer",
            "olá",
            "obrigado"
          ],
          "correct_answer": "Bom dia muito prazer",
          "metadata": {
            "is_audio_challenge": true
          }
        }
      ]
    },
    "6": {
      "title": "Unit 1 Trophy Mastery Challenge",
      "skill_title": "Checkpoint Challenge",
      "xp_reward": 25,
      "exercises": [
        {
          "id": 5601,
          "type": "type_answer",
          "prompt": "Escreva 'Thank you' em português",
          "prompt_translation": "Enter 'obrigado'",
          "audio_text": "Obrigado",
          "options": null,
          "correct_answer": "obrigado"
        }
      ]
    }
  },
  "ja": {
    "1": {
      "title": "Basic Vocabulary & Recognition",
      "skill_title": "Hiragana & Basics",
      "xp_reward": 10,
      "exercises": [
        {
          "id": 6101,
          "type": "multiple_choice",
          "prompt": "Which of these is 'Hello' in Japanese?",
          "prompt_translation": "Select 'Konnichiwa'",
          "audio_text": "こんにちは",
          "options": [
            {
              "text": "こんにちは",
              "translation": "Hello"
            },
            {
              "text": "ありがとう",
              "translation": "Thank you"
            },
            {
              "text": "さようなら",
              "translation": "Goodbye"
            }
          ],
          "correct_answer": "こんにちは"
        },
        {
          "id": 6102,
          "type": "multiple_choice",
          "prompt": "What does '水' (mizu) mean?",
          "prompt_translation": "Select the translation",
          "audio_text": "水",
          "options": [
            {
              "text": "water",
              "translation": "水 (mizu)"
            },
            {
              "text": "tea",
              "translation": "お茶 (ocha)"
            },
            {
              "text": "rice",
              "translation": "ご飯 (gohan)"
            }
          ],
          "correct_answer": "water"
        }
      ]
    },
    "2": {
      "title": "Sentence Construction & Matching",
      "skill_title": "Phrases",
      "xp_reward": 10,
      "exercises": [
        {
          "id": 6201,
          "type": "match_pairs",
          "prompt": "Tap the matching pairs",
          "prompt_translation": "Match Japanese and English words",
          "audio_text": null,
          "options": {
            "left": [
              "こんにちは",
              "ありがとう",
              "さようなら",
              "水"
            ],
            "right": [
              "hello",
              "thank you",
              "goodbye",
              "water"
            ]
          },
          "correct_answer": {
            "こんにちは": "hello",
            "ありがとう": "thank you",
            "さようなら": "goodbye",
            "水": "water"
          }
        },
        {
          "id": 6202,
          "type": "word_bank",
          "prompt": "Translate this sentence",
          "prompt_translation": "水を飲みます。",
          "audio_text": "水を飲みます",
          "options": [
            "I",
            "drink",
            "water",
            "eat",
            "bread",
            "tea"
          ],
          "correct_answer": "I drink water"
        }
      ]
    },
    "3": {
      "title": "Grammar & Particles",
      "skill_title": "Grammar",
      "xp_reward": 10,
      "exercises": [
        {
          "id": 6301,
          "type": "fill_in_blank",
          "prompt": "Choose the correct object particle",
          "prompt_translation": "I drink water (Mizu _ nomimasu).",
          "audio_text": "水を飲みます",
          "options": [
            "を",
            "は",
            "が"
          ],
          "correct_answer": "を",
          "metadata": {
            "sentence_prefix": "水",
            "sentence_suffix": "飲みます。"
          }
        }
      ]
    },
    "4": {
      "title": "Milestone Chest",
      "skill_title": "Chest Milestone",
      "xp_reward": 10,
      "exercises": []
    },
    "5": {
      "title": "Listening & Audio Comprehension",
      "skill_title": "Audio Challenge",
      "xp_reward": 15,
      "exercises": [
        {
          "id": 6501,
          "type": "word_bank",
          "prompt": "🎧 Listen and arrange what you hear",
          "prompt_translation": "Tap what you hear",
          "audio_text": "おはようございます",
          "options": [
            "おはよう",
            "ございます",
            "こんにちは",
            "水"
          ],
          "correct_answer": "おはようございます",
          "metadata": {
            "is_audio_challenge": true
          }
        }
      ]
    },
    "6": {
      "title": "Unit 1 Trophy Mastery Challenge",
      "skill_title": "Checkpoint Challenge",
      "xp_reward": 25,
      "exercises": [
        {
          "id": 6601,
          "type": "type_answer",
          "prompt": "Type 'Thank you' in Japanese (arigato / ありがとう)",
          "prompt_translation": "Enter 'arigato' or 'ありがとう'",
          "audio_text": "ありがとう",
          "options": null,
          "correct_answer": "arigato"
        }
      ]
    }
  },
  "hi": {
    "1": {
      "title": "Hindi Basics & Greetings",
      "skill_title": "Basics 1",
      "xp_reward": 10,
      "exercises": [
        {
          "id": 7101,
          "type": "multiple_choice",
          "prompt": "Which of these is 'Hello' in Hindi?",
          "prompt_translation": "Select 'Namaste'",
          "audio_text": "नमस्ते",
          "options": [
            {
              "text": "नमस्ते (Namaste)",
              "translation": "Hello"
            },
            {
              "text": "धन्यवाद (Dhanyavaad)",
              "translation": "Thank you"
            },
            {
              "text": "अलविदा (Alvida)",
              "translation": "Goodbye"
            }
          ],
          "correct_answer": "नमस्ते (Namaste)"
        },
        {
          "id": 7102,
          "type": "multiple_choice",
          "prompt": "What does 'पानी (Paani)' mean?",
          "prompt_translation": "Select the translation",
          "audio_text": "पानी",
          "options": [
            {
              "text": "water",
              "translation": "पानी (paani)"
            },
            {
              "text": "tea",
              "translation": "चाय (chai)"
            },
            {
              "text": "apple",
              "translation": "सेब (seb)"
            }
          ],
          "correct_answer": "water"
        },
        {
          "id": 7103,
          "type": "word_bank",
          "prompt": "Translate this sentence",
          "prompt_translation": "लड़का पानी पीता है।",
          "audio_text": "लड़का पानी पीता है",
          "options": [
            "The",
            "boy",
            "drinks",
            "water",
            "eats",
            "girl",
            "tea"
          ],
          "correct_answer": "The boy drinks water"
        },
        {
          "id": 7104,
          "type": "match_pairs",
          "prompt": "Tap the matching Hindi pairs",
          "prompt_translation": "Connect Hindi and English words",
          "options": {
            "left": [
              "नमस्ते",
              "धन्यवाद",
              "पानी",
              "लड़का"
            ],
            "right": [
              "hello",
              "thank you",
              "water",
              "boy"
            ]
          },
          "correct_answer": {
            "नमस्ते": "hello",
            "धन्यवाद": "thank you",
            "पानी": "water",
            "लड़का": "boy"
          }
        }
      ]
    },
    "2": {
      "title": "Phrases & Sentence Construction",
      "skill_title": "Phrases",
      "xp_reward": 10,
      "exercises": [
        {
          "id": 7201,
          "type": "match_pairs",
          "prompt": "Tap the matching Hindi pairs",
          "prompt_translation": "Connect Hindi and English words",
          "options": {
            "left": [
              "यह",
              "वह",
              "अच्छा",
              "अलविदा"
            ],
            "right": [
              "this",
              "that",
              "good",
              "goodbye"
            ]
          },
          "correct_answer": {
            "यह": "this",
            "वह": "that",
            "अच्छा": "good",
            "अलविदा": "goodbye"
          }
        },
        {
          "id": 7202,
          "type": "word_bank",
          "prompt": "Translate 'This is water'",
          "prompt_translation": "यह पानी है (Yeh paani hai)",
          "audio_text": "यह पानी है",
          "options": [
            "This",
            "is",
            "water",
            "tea",
            "delicious",
            "good"
          ],
          "correct_answer": "This is water"
        },
        {
          "id": 7203,
          "type": "multiple_choice",
          "prompt": "How do you say 'Thank you' in Hindi?",
          "prompt_translation": "Select gratitude expression",
          "audio_text": "धन्यवाद",
          "options": [
            {
              "text": "धन्यवाद (Dhanyavaad)",
              "translation": "Thank you"
            },
            {
              "text": "नमस्ते (Namaste)",
              "translation": "Hello"
            },
            {
              "text": "हाँ (Haan)",
              "translation": "Yes"
            }
          ],
          "correct_answer": "धन्यवाद (Dhanyavaad)"
        },
        {
          "id": 7204,
          "type": "multiple_choice",
          "prompt": "What does 'चाय (Chai)' mean?",
          "prompt_translation": "Select beverage",
          "audio_text": "चाय",
          "options": [
            {
              "text": "tea",
              "translation": "चाय"
            },
            {
              "text": "water",
              "translation": "पानी"
            },
            {
              "text": "milk",
              "translation": "दूध"
            }
          ],
          "correct_answer": "tea"
        }
      ]
    },
    "3": {
      "title": "Hindi Grammar & Daily Expressions",
      "skill_title": "Grammar 1",
      "xp_reward": 15,
      "exercises": [
        {
          "id": 7301,
          "type": "multiple_choice",
          "prompt": "How do you say 'Yes' in Hindi?",
          "prompt_translation": "Select affirmative answer",
          "audio_text": "हाँ",
          "options": [
            {
              "text": "हाँ (Haan)",
              "translation": "Yes"
            },
            {
              "text": "नहीं (Nahin)",
              "translation": "No"
            },
            {
              "text": "शायद (Shaayad)",
              "translation": "Maybe"
            }
          ],
          "correct_answer": "हाँ (Haan)"
        },
        {
          "id": 7302,
          "type": "word_bank",
          "prompt": "Translate 'The girl eats an apple'",
          "prompt_translation": "लड़की सेब खाती है।",
          "audio_text": "लड़की सेब खाती है",
          "options": [
            "The",
            "girl",
            "eats",
            "an",
            "apple",
            "boy",
            "drinks",
            "water"
          ],
          "correct_answer": "The girl eats an apple"
        },
        {
          "id": 7303,
          "type": "fill_in_blank",
          "prompt": "Complete with the correct feminine verb: लड़की पानी ____ है।",
          "prompt_translation": "The girl drinks water (Ladki paani peeti hai).",
          "audio_text": "लड़की पानी पीती है",
          "options": [
            "पीती",
            "पीता",
            "खाता"
          ],
          "correct_answer": "पीती"
        },
        {
          "id": 7304,
          "type": "match_pairs",
          "prompt": "Match Hindi words with English",
          "prompt_translation": "Pair words",
          "options": {
            "left": [
              "लड़का",
              "लड़की",
              "सेब",
              "किताब"
            ],
            "right": [
              "boy",
              "girl",
              "apple",
              "book"
            ]
          },
          "correct_answer": {
            "लड़का": "boy",
            "लड़की": "girl",
            "सेब": "apple",
            "किताब": "book"
          }
        }
      ]
    },
    "5": {
      "title": "Café & Food Orders in Hindi",
      "skill_title": "Dining & Food",
      "xp_reward": 15,
      "exercises": [
        {
          "id": 7501,
          "type": "multiple_choice",
          "prompt": "What does 'दूध (Doodh)' mean?",
          "prompt_translation": "Select dairy item",
          "audio_text": "दूध",
          "options": [
            {
              "text": "milk",
              "translation": "दूध"
            },
            {
              "text": "water",
              "translation": "पानी"
            },
            {
              "text": "tea",
              "translation": "चाय"
            }
          ],
          "correct_answer": "milk"
        },
        {
          "id": 7502,
          "type": "word_bank",
          "prompt": "Translate 'Tea please'",
          "prompt_translation": "चाय कृपया (Chai kripya)",
          "audio_text": "चाय कृपया",
          "options": [
            "Tea",
            "please",
            "water",
            "milk",
            "thank",
            "you"
          ],
          "correct_answer": "Tea please"
        },
        {
          "id": 7503,
          "type": "match_pairs",
          "prompt": "Match Hindi food items",
          "prompt_translation": "Pair vocabulary",
          "options": {
            "left": [
              "दूध",
              "चीनी",
              "गर्म",
              "ठंडा"
            ],
            "right": [
              "milk",
              "sugar",
              "hot",
              "cold"
            ]
          },
          "correct_answer": {
            "दूध": "milk",
            "चीनी": "sugar",
            "गर्म": "hot",
            "ठंडा": "cold"
          }
        },
        {
          "id": 7504,
          "type": "multiple_choice",
          "prompt": "How do you say 'Goodbye' in Hindi?",
          "prompt_translation": "Select farewell",
          "audio_text": "अलविदा",
          "options": [
            {
              "text": "अलविदा (Alvida)",
              "translation": "Goodbye"
            },
            {
              "text": "नमस्ते (Namaste)",
              "translation": "Hello"
            },
            {
              "text": "धन्यवाद (Dhanyavaad)",
              "translation": "Thank you"
            }
          ],
          "correct_answer": "अलविदा (Alvida)"
        }
      ]
    },
    "6": {
      "title": "Hindi Unit 1 Mastery Challenge",
      "skill_title": "Checkpoint Challenge",
      "xp_reward": 25,
      "exercises": [
        {
          "id": 7601,
          "type": "multiple_choice",
          "prompt": "What does 'बहुत अच्छा (Bahut achha)' mean?",
          "prompt_translation": "Select meaning",
          "audio_text": "बहुत अच्छा",
          "options": [
            {
              "text": "very good",
              "translation": "बहुत अच्छा"
            },
            {
              "text": "bad",
              "translation": "खराब"
            },
            {
              "text": "thank you",
              "translation": "धन्यवाद"
            }
          ],
          "correct_answer": "very good"
        },
        {
          "id": 7602,
          "type": "word_bank",
          "prompt": "Translate 'Thank you very much'",
          "prompt_translation": "बहुत बहुत धन्यवाद।",
          "audio_text": "बहुत बहुत धन्यवाद",
          "options": [
            "Thank",
            "you",
            "very",
            "much",
            "hello",
            "goodbye"
          ],
          "correct_answer": "Thank you very much"
        },
        {
          "id": 7603,
          "type": "multiple_choice",
          "prompt": "How do you say 'I am a student' in Hindi?",
          "prompt_translation": "Select translation",
          "audio_text": "मैं एक छात्र हूँ",
          "options": [
            {
              "text": "मैं एक छात्र हूँ (Main ek chhaatr hoon)",
              "translation": "I am a student"
            },
            {
              "text": "वह छात्र है",
              "translation": "He is a student"
            },
            {
              "text": "तुम छात्र हो",
              "translation": "You are a student"
            }
          ],
          "correct_answer": "मैं एक छात्र हूँ (Main ek chhaatr hoon)"
        },
        {
          "id": 7604,
          "type": "match_pairs",
          "prompt": "Match Hindi words with English",
          "prompt_translation": "Final test pairs",
          "options": {
            "left": [
              "छात्र",
              "शिक्षक",
              "दोस्त",
              "नमस्ते"
            ],
            "right": [
              "student",
              "teacher",
              "friend",
              "hello"
            ]
          },
          "correct_answer": {
            "छात्र": "student",
            "शिक्षक": "teacher",
            "दोस्त": "friend",
            "नमस्ते": "hello"
          }
        }
      ]
    }
  },
  "ko": {
    "1": {
      "title": "Basic Vocabulary & Recognition",
      "skill_title": "Hangul & Basics",
      "xp_reward": 10,
      "exercises": [
        {
          "id": 9101,
          "type": "multiple_choice",
          "prompt": "Which of these is 'Hello' in Korean?",
          "prompt_translation": "Select 'Annyeonghaseyo'",
          "audio_text": "안녕하세요",
          "options": [
            {
              "text": "안녕하세요 (Annyeonghaseyo)",
              "translation": "Hello"
            },
            {
              "text": "감사합니다 (Gamsahamnida)",
              "translation": "Thank you"
            },
            {
              "text": "안녕히 가세요",
              "translation": "Goodbye"
            }
          ],
          "correct_answer": "안녕하세요 (Annyeonghaseyo)"
        },
        {
          "id": 9102,
          "type": "multiple_choice",
          "prompt": "What does '물' (mul) mean?",
          "prompt_translation": "Select the translation",
          "audio_text": "물",
          "options": [
            {
              "text": "water",
              "translation": "물 (mul)"
            },
            {
              "text": "milk",
              "translation": "우유 (uyu)"
            },
            {
              "text": "apple",
              "translation": "사과 (sagwa)"
            }
          ],
          "correct_answer": "water"
        }
      ]
    },
    "2": {
      "title": "Sentence Construction & Matching",
      "skill_title": "Phrases",
      "xp_reward": 10,
      "exercises": [
        {
          "id": 9201,
          "type": "match_pairs",
          "prompt": "Tap the matching pairs",
          "prompt_translation": "Match Korean and English words",
          "audio_text": null,
          "options": {
            "left": [
              "안녕하세요",
              "감사합니다",
              "물",
              "사과"
            ],
            "right": [
              "hello",
              "thank you",
              "water",
              "apple"
            ]
          },
          "correct_answer": {
            "안녕하세요": "hello",
            "감사합니다": "thank you",
            "물": "water",
            "사과": "apple"
          }
        },
        {
          "id": 9202,
          "type": "word_bank",
          "prompt": "Translate this sentence",
          "prompt_translation": "물을 마셔요.",
          "audio_text": "물을 마셔요",
          "options": [
            "I",
            "drink",
            "water",
            "eat",
            "apple",
            "tea"
          ],
          "correct_answer": "I drink water"
        }
      ]
    },
    "3": {
      "title": "Grammar & Verbs",
      "skill_title": "Grammar",
      "xp_reward": 10,
      "exercises": [
        {
          "id": 9301,
          "type": "fill_in_blank",
          "prompt": "Complete with the correct verb",
          "prompt_translation": "I drink water (Mureul masyeoyo).",
          "audio_text": "물을 마셔요",
          "options": [
            "마셔요",
            "먹어요",
            "가요"
          ],
          "correct_answer": "마셔요",
          "metadata": {
            "sentence_prefix": "물을",
            "sentence_suffix": "。"
          }
        }
      ]
    },
    "4": {
      "title": "Milestone Chest",
      "skill_title": "Chest Milestone",
      "xp_reward": 10,
      "exercises": []
    },
    "5": {
      "title": "Listening & Audio Comprehension",
      "skill_title": "Audio Challenge",
      "xp_reward": 15,
      "exercises": [
        {
          "id": 9501,
          "type": "word_bank",
          "prompt": "🎧 Listen and arrange what you hear",
          "prompt_translation": "Tap what you hear",
          "audio_text": "좋은 아침이에요",
          "options": [
            "좋은",
            "아침이에요",
            "안녕하세요",
            "물"
          ],
          "correct_answer": "좋은 아침이에요",
          "metadata": {
            "is_audio_challenge": true
          }
        }
      ]
    },
    "6": {
      "title": "Unit 1 Trophy Mastery Challenge",
      "skill_title": "Checkpoint Challenge",
      "xp_reward": 25,
      "exercises": [
        {
          "id": 9601,
          "type": "type_answer",
          "prompt": "Type 'Thank you' in Korean (gamsahamnida / 감사합니다)",
          "prompt_translation": "Enter 'gamsahamnida'",
          "audio_text": "감사합니다",
          "options": null,
          "correct_answer": "gamsahamnida"
        }
      ]
    }
  },
  "zh": {
    "1": {
      "title": "Basic Vocabulary & Recognition",
      "skill_title": "Basics 1",
      "xp_reward": 10,
      "exercises": [
        {
          "id": 12101,
          "type": "multiple_choice",
          "prompt": "Which of these is 'Hello' in Chinese?",
          "prompt_translation": "Select 'Nǐ hǎo'",
          "audio_text": "你好",
          "options": [
            {
              "text": "你好 (Nǐ hǎo)",
              "translation": "Hello"
            },
            {
              "text": "谢谢 (Xièxiè)",
              "translation": "Thank you"
            },
            {
              "text": "再见 (Zàijiàn)",
              "translation": "Goodbye"
            }
          ],
          "correct_answer": "你好 (Nǐ hǎo)"
        },
        {
          "id": 12102,
          "type": "multiple_choice",
          "prompt": "What does '水' (shuǐ) mean?",
          "prompt_translation": "Select the translation",
          "audio_text": "水",
          "options": [
            {
              "text": "water",
              "translation": "水 (shuǐ)"
            },
            {
              "text": "tea",
              "translation": "茶 (chá)"
            },
            {
              "text": "apple",
              "translation": "苹果 (píngguǒ)"
            }
          ],
          "correct_answer": "water"
        }
      ]
    },
    "2": {
      "title": "Sentence Construction & Matching",
      "skill_title": "Phrases",
      "xp_reward": 10,
      "exercises": [
        {
          "id": 12201,
          "type": "match_pairs",
          "prompt": "Tap the matching pairs",
          "prompt_translation": "Match Chinese and English words",
          "audio_text": null,
          "options": {
            "left": [
              "你好",
              "谢谢",
              "再见",
              "水"
            ],
            "right": [
              "hello",
              "thank you",
              "goodbye",
              "water"
            ]
          },
          "correct_answer": {
            "你好": "hello",
            "谢谢": "thank you",
            "再见": "goodbye",
            "水": "water"
          }
        },
        {
          "id": 12202,
          "type": "word_bank",
          "prompt": "Translate this sentence",
          "prompt_translation": "我喝水。",
          "audio_text": "我喝水",
          "options": [
            "I",
            "drink",
            "water",
            "eat",
            "bread",
            "apple"
          ],
          "correct_answer": "I drink water"
        }
      ]
    },
    "3": {
      "title": "Grammar & Verbs",
      "skill_title": "Grammar",
      "xp_reward": 10,
      "exercises": [
        {
          "id": 12301,
          "type": "fill_in_blank",
          "prompt": "Choose the correct verb for drinking",
          "prompt_translation": "She drinks water (Tā hē shuǐ).",
          "audio_text": "她喝水",
          "options": [
            "喝",
            "吃",
            "是"
          ],
          "correct_answer": "喝",
          "metadata": {
            "sentence_prefix": "她",
            "sentence_suffix": "水。"
          }
        }
      ]
    },
    "4": {
      "title": "Milestone Chest",
      "skill_title": "Chest Milestone",
      "xp_reward": 10,
      "exercises": []
    },
    "5": {
      "title": "Listening & Audio Comprehension",
      "skill_title": "Audio Challenge",
      "xp_reward": 15,
      "exercises": [
        {
          "id": 12501,
          "type": "word_bank",
          "prompt": "🎧 Listen and arrange what you hear",
          "prompt_translation": "Tap what you hear",
          "audio_text": "早上好",
          "options": [
            "早上好",
            "你好",
            "谢谢",
            "水"
          ],
          "correct_answer": "早上好",
          "metadata": {
            "is_audio_challenge": true
          }
        }
      ]
    },
    "6": {
      "title": "Unit 1 Trophy Mastery Challenge",
      "skill_title": "Checkpoint Challenge",
      "xp_reward": 25,
      "exercises": [
        {
          "id": 12601,
          "type": "type_answer",
          "prompt": "Type 'Hello' in Chinese (nihao / 你好)",
          "prompt_translation": "Enter 'nihao'",
          "audio_text": "你好",
          "options": null,
          "correct_answer": "nihao"
        }
      ]
    }
  },
  "ru": {
    "1": {
      "title": "Basic Vocabulary & Recognition",
      "skill_title": "Cyrillic & Basics",
      "xp_reward": 10,
      "exercises": [
        {
          "id": 13101,
          "type": "multiple_choice",
          "prompt": "Which of these is 'Hello' in Russian?",
          "prompt_translation": "Select 'Privet'",
          "audio_text": "Привет",
          "options": [
            {
              "text": "Привет (Privet)",
              "translation": "Hello"
            },
            {
              "text": "Спасибо (Spasibo)",
              "translation": "Thank you"
            },
            {
              "text": "Пока (Poka)",
              "translation": "Goodbye"
            }
          ],
          "correct_answer": "Привет (Privet)"
        },
        {
          "id": 13102,
          "type": "multiple_choice",
          "prompt": "What does 'вода' (voda) mean?",
          "prompt_translation": "Select the translation",
          "audio_text": "вода",
          "options": [
            {
              "text": "water",
              "translation": "вода (voda)"
            },
            {
              "text": "milk",
              "translation": "молоко (moloko)"
            },
            {
              "text": "bread",
              "translation": "хлеб (khleb)"
            }
          ],
          "correct_answer": "water"
        }
      ]
    },
    "2": {
      "title": "Sentence Construction & Matching",
      "skill_title": "Phrases",
      "xp_reward": 10,
      "exercises": [
        {
          "id": 13201,
          "type": "match_pairs",
          "prompt": "Tap the matching pairs",
          "prompt_translation": "Match Russian and English words",
          "audio_text": null,
          "options": {
            "left": [
              "привет",
              "спасибо",
              "вода",
              "пока"
            ],
            "right": [
              "hello",
              "thank you",
              "water",
              "bye"
            ]
          },
          "correct_answer": {
            "привет": "hello",
            "спасибо": "thank you",
            "вода": "water",
            "пока": "bye"
          }
        },
        {
          "id": 13202,
          "type": "word_bank",
          "prompt": "Translate this sentence",
          "prompt_translation": "Я пью воду.",
          "audio_text": "Я пью воду",
          "options": [
            "I",
            "drink",
            "water",
            "eat",
            "bread",
            "milk"
          ],
          "correct_answer": "I drink water"
        }
      ]
    },
    "3": {
      "title": "Grammar & Conjugations",
      "skill_title": "Grammar",
      "xp_reward": 10,
      "exercises": [
        {
          "id": 13301,
          "type": "fill_in_blank",
          "prompt": "Complete the sentence with the correct verb",
          "prompt_translation": "He eats bread (On yest khleb).",
          "audio_text": "Он ест хлеб",
          "options": [
            "ест",
            "пью",
            "пьёт"
          ],
          "correct_answer": "ест",
          "metadata": {
            "sentence_prefix": "Он",
            "sentence_suffix": "хлеб."
          }
        }
      ]
    },
    "4": {
      "title": "Milestone Chest",
      "skill_title": "Chest Milestone",
      "xp_reward": 10,
      "exercises": []
    },
    "5": {
      "title": "Listening & Audio Comprehension",
      "skill_title": "Audio Challenge",
      "xp_reward": 15,
      "exercises": [
        {
          "id": 13501,
          "type": "word_bank",
          "prompt": "🎧 Listen and arrange what you hear",
          "prompt_translation": "Tap what you hear",
          "audio_text": "Доброе утро",
          "options": [
            "Доброе",
            "утро",
            "Привет",
            "спасибо"
          ],
          "correct_answer": "Доброе утро",
          "metadata": {
            "is_audio_challenge": true
          }
        }
      ]
    },
    "6": {
      "title": "Unit 1 Trophy Mastery Challenge",
      "skill_title": "Checkpoint Challenge",
      "xp_reward": 25,
      "exercises": [
        {
          "id": 13601,
          "type": "type_answer",
          "prompt": "Type 'Thank you' in Russian (spasibo / спасибо)",
          "prompt_translation": "Enter 'spasibo'",
          "audio_text": "Спасибо",
          "options": null,
          "correct_answer": "spasibo"
        }
      ]
    }
  },
  "math": {
    "1": {
      "title": "Basic Arithmetic & Numbers",
      "skill_title": "Addition 1",
      "xp_reward": 10,
      "exercises": [
        {
          "id": 9001,
          "type": "multiple_choice",
          "prompt": "What is 7 + 8?",
          "prompt_translation": "Calculate sum",
          "options": [
            {
              "text": "15"
            },
            {
              "text": "14"
            },
            {
              "text": "16"
            }
          ],
          "correct_answer": "15"
        },
        {
          "id": 9002,
          "type": "multiple_choice",
          "prompt": "What is 20 - 9?",
          "prompt_translation": "Calculate difference",
          "options": [
            {
              "text": "11"
            },
            {
              "text": "12"
            },
            {
              "text": "9"
            }
          ],
          "correct_answer": "11"
        },
        {
          "id": 9003,
          "type": "word_bank",
          "prompt": "Assemble the equation for: Five plus three equals eight",
          "options": [
            "5",
            "+",
            "3",
            "=",
            "8",
            "4",
            "-",
            "2"
          ],
          "correct_answer": "5 + 3 = 8"
        },
        {
          "id": 9004,
          "type": "match_pairs",
          "prompt": "Match numbers to word names",
          "options": {
            "left": [
              "10",
              "25",
              "50",
              "100"
            ],
            "right": [
              "ten",
              "twenty-five",
              "fifty",
              "one hundred"
            ]
          },
          "correct_answer": {
            "10": "ten",
            "25": "twenty-five",
            "50": "fifty",
            "100": "one hundred"
          }
        }
      ]
    },
    "2": {
      "title": "Multiplication & Division",
      "skill_title": "Multiplication",
      "xp_reward": 10,
      "exercises": [
        {
          "id": 9011,
          "type": "multiple_choice",
          "prompt": "What is 6 × 7?",
          "options": [
            {
              "text": "42"
            },
            {
              "text": "36"
            },
            {
              "text": "48"
            }
          ],
          "correct_answer": "42"
        },
        {
          "id": 9012,
          "type": "multiple_choice",
          "prompt": "What is 45 ÷ 5?",
          "options": [
            {
              "text": "9"
            },
            {
              "text": "8"
            },
            {
              "text": "7"
            }
          ],
          "correct_answer": "9"
        },
        {
          "id": 9013,
          "type": "match_pairs",
          "prompt": "Match multiplications to products",
          "options": {
            "left": [
              "3 × 4",
              "5 × 5",
              "8 × 2",
              "9 × 3"
            ],
            "right": [
              "12",
              "25",
              "16",
              "27"
            ]
          },
          "correct_answer": {
            "3 × 4": "12",
            "5 × 5": "25",
            "8 × 2": "16",
            "9 × 3": "27"
          }
        }
      ]
    },
    "3": {
      "title": "Fractions & Percentages",
      "skill_title": "Fractions",
      "xp_reward": 15,
      "exercises": [
        {
          "id": 9021,
          "type": "multiple_choice",
          "prompt": "What is 50% of 80?",
          "options": [
            {
              "text": "40"
            },
            {
              "text": "30"
            },
            {
              "text": "50"
            }
          ],
          "correct_answer": "40"
        },
        {
          "id": 9022,
          "type": "multiple_choice",
          "prompt": "What is 1/4 of 100?",
          "options": [
            {
              "text": "25"
            },
            {
              "text": "20"
            },
            {
              "text": "50"
            }
          ],
          "correct_answer": "25"
        }
      ]
    },
    "5": {
      "title": "Quick Mental Math Challenge",
      "skill_title": "Mental Math",
      "xp_reward": 15,
      "exercises": [
        {
          "id": 9031,
          "type": "multiple_choice",
          "prompt": "What is 12 × 12?",
          "options": [
            {
              "text": "144"
            },
            {
              "text": "124"
            },
            {
              "text": "134"
            }
          ],
          "correct_answer": "144"
        },
        {
          "id": 9032,
          "type": "multiple_choice",
          "prompt": "What is 100 - 37?",
          "options": [
            {
              "text": "63"
            },
            {
              "text": "73"
            },
            {
              "text": "67"
            }
          ],
          "correct_answer": "63"
        }
      ]
    },
    "6": {
      "title": "Math Mastery Exam",
      "skill_title": "Math Champion",
      "xp_reward": 25,
      "exercises": [
        {
          "id": 9041,
          "type": "multiple_choice",
          "prompt": "What is 15 × 6?",
          "options": [
            {
              "text": "90"
            },
            {
              "text": "80"
            },
            {
              "text": "85"
            }
          ],
          "correct_answer": "90"
        },
        {
          "id": 9042,
          "type": "multiple_choice",
          "prompt": "What is 250 ÷ 5?",
          "options": [
            {
              "text": "50"
            },
            {
              "text": "45"
            },
            {
              "text": "60"
            }
          ],
          "correct_answer": "50"
        }
      ]
    }
  },
  "chess": {
    "1": {
      "title": "Piece Movement & Fundamentals",
      "skill_title": "The Pieces",
      "xp_reward": 10,
      "exercises": [
        {
          "id": 9101,
          "type": "multiple_choice",
          "prompt": "Which piece moves in an 'L' shape?",
          "options": [
            {
              "text": "Knight"
            },
            {
              "text": "Bishop"
            },
            {
              "text": "Rook"
            }
          ],
          "correct_answer": "Knight"
        },
        {
          "id": 9102,
          "type": "multiple_choice",
          "prompt": "How does the Bishop move?",
          "options": [
            {
              "text": "Diagonally any number of squares"
            },
            {
              "text": "Straight forwards only"
            },
            {
              "text": "In an L shape"
            }
          ],
          "correct_answer": "Diagonally any number of squares"
        },
        {
          "id": 9103,
          "type": "match_pairs",
          "prompt": "Match chess pieces to point values",
          "options": {
            "left": [
              "Pawn",
              "Knight",
              "Rook",
              "Queen"
            ],
            "right": [
              "1 point",
              "3 points",
              "5 points",
              "9 points"
            ]
          },
          "correct_answer": {
            "Pawn": "1 point",
            "Knight": "3 points",
            "Rook": "5 points",
            "Queen": "9 points"
          }
        }
      ]
    },
    "2": {
      "title": "Board Setup & Pawn Rules",
      "skill_title": "Pawn Mechanics",
      "xp_reward": 10,
      "exercises": [
        {
          "id": 9111,
          "type": "multiple_choice",
          "prompt": "Can a pawn move backward?",
          "options": [
            {
              "text": "No, pawns only move forward"
            },
            {
              "text": "Yes, when capturing"
            },
            {
              "text": "Yes, on any turn"
            }
          ],
          "correct_answer": "No, pawns only move forward"
        },
        {
          "id": 9112,
          "type": "multiple_choice",
          "prompt": "What happens when a pawn reaches the 8th rank?",
          "options": [
            {
              "text": "It promotes to Queen, Rook, Bishop, or Knight"
            },
            {
              "text": "It is removed from the board"
            },
            {
              "text": "Game is a draw"
            }
          ],
          "correct_answer": "It promotes to Queen, Rook, Bishop, or Knight"
        }
      ]
    },
    "3": {
      "title": "Castling & King Safety",
      "skill_title": "King Safety",
      "xp_reward": 15,
      "exercises": [
        {
          "id": 9121,
          "type": "multiple_choice",
          "prompt": "What special move involves both the King and a Rook?",
          "options": [
            {
              "text": "Castling"
            },
            {
              "text": "En Passant"
            },
            {
              "text": "Promotion"
            }
          ],
          "correct_answer": "Castling"
        }
      ]
    },
    "5": {
      "title": "Tactics: Forks & Pins",
      "skill_title": "Tactics",
      "xp_reward": 15,
      "exercises": [
        {
          "id": 9131,
          "type": "multiple_choice",
          "prompt": "What is a 'Fork' in chess?",
          "options": [
            {
              "text": "One piece attacking two enemy pieces at once"
            },
            {
              "text": "Sacrificing a queen"
            },
            {
              "text": "Trapping the king"
            }
          ],
          "correct_answer": "One piece attacking two enemy pieces at once"
        }
      ]
    },
    "6": {
      "title": "Checkmate & Game Conclusion",
      "skill_title": "Mastery",
      "xp_reward": 25,
      "exercises": [
        {
          "id": 9141,
          "type": "multiple_choice",
          "prompt": "What is 'Checkmate'?",
          "options": [
            {
              "text": "The King is under attack and has no legal moves to escape"
            },
            {
              "text": "The King is captured"
            },
            {
              "text": "When only pawns remain"
            }
          ],
          "correct_answer": "The King is under attack and has no legal moves to escape"
        }
      ]
    }
  }
};

// =============================================================================
// PUBLIC HELPER FUNCTIONS
// =============================================================================

export function getFallbackLesson(level: number, courseId?: number, lang?: string): Lesson {
  let langCode = 'hi'; // default to Hindi

  // 1. Explicit lang parameter has highest precedence
  if (lang && lang.trim()) {
    const cleanLang = lang.toLowerCase().trim();
    if (CURRICULUM_STORE[cleanLang]) {
      langCode = cleanLang;
    }
  }
  // 2. Active language in localStorage
  else if (typeof window !== 'undefined' && localStorage.getItem('duo_active_lang')) {
    const storedLang = localStorage.getItem('duo_active_lang')?.toLowerCase().trim();
    if (storedLang && CURRICULUM_STORE[storedLang]) {
      langCode = storedLang;
    } else if (courseId && COURSE_ID_TO_LANG[courseId] && CURRICULUM_STORE[COURSE_ID_TO_LANG[courseId]]) {
      langCode = COURSE_ID_TO_LANG[courseId];
    }
  }
  // 3. Course ID parameter
  else if (courseId && COURSE_ID_TO_LANG[courseId] && CURRICULUM_STORE[COURSE_ID_TO_LANG[courseId]]) {
    langCode = COURSE_ID_TO_LANG[courseId];
  }
  // 4. Stored course ID in localStorage
  else if (typeof window !== 'undefined') {
    const storedId = localStorage.getItem('duo_active_course_id');
    if (storedId) {
      const parsed = parseInt(storedId, 10);
      if (parsed && COURSE_ID_TO_LANG[parsed] && CURRICULUM_STORE[COURSE_ID_TO_LANG[parsed]]) {
        langCode = COURSE_ID_TO_LANG[parsed];
      }
    }
  }

  // Fallback chain: requested language -> Hindi -> English -> first available
  const courseLevels =
    CURRICULUM_STORE[langCode] ||
    CURRICULUM_STORE['hi'] ||
    CURRICULUM_STORE['en'] ||
    CURRICULUM_STORE['es'];

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

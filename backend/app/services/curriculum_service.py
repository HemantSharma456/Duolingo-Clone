import json
from typing import List, Dict, Any, Optional
from app.schemas import ExerciseResponse

# Progressive curriculum data tailored per language and level matching real Duolingo difficulty curve
CURRICULUM_DATA: Dict[str, Dict[int, Dict[str, Any]]] = {
    # =========================================================================
    # 1. ENGLISH (en)
    # =========================================================================
    "en": {
        1: {
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
                        {"text": "an apple", "translation": "apple fruit"},
                        {"text": "a car", "translation": "vehicle"},
                        {"text": "a book", "translation": "reading book"}
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
                        {"text": "Good morning", "translation": "Morning greeting"},
                        {"text": "Good night", "translation": "Evening farewell"},
                        {"text": "Goodbye", "translation": "Farewell"}
                    ],
                    "correct_answer": "Good morning"
                },
                {
                    "id": 8103,
                    "type": "word_bank",
                    "prompt": "Assemble the phrase: 'the boy'",
                    "prompt_translation": "the boy",
                    "audio_text": "the boy",
                    "options": ["the", "boy", "girl", "water", "apple"],
                    "correct_answer": "the boy"
                },
                {
                    "id": 8104,
                    "type": "multiple_choice",
                    "prompt": "What is 'water'?",
                    "prompt_translation": "Select the drink",
                    "audio_text": "water",
                    "options": [
                        {"text": "water", "translation": "clear liquid drink"},
                        {"text": "milk", "translation": "dairy drink"},
                        {"text": "bread", "translation": "baked food"}
                    ],
                    "correct_answer": "water"
                }
            ]
        },
        2: {
            "title": "Sentence Construction & Matching",
            "skill_title": "Phrases",
            "xp_reward": 10,
            "exercises": [
                {
                    "id": 8201,
                    "type": "match_pairs",
                    "prompt": "Tap the matching pairs",
                    "prompt_translation": "Match words with synonyms",
                    "audio_text": None,
                    "options": {
                        "left": ["hello", "thank you", "goodbye", "please"],
                        "right": ["hi", "thanks", "bye", "kindly"]
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
                    "options": ["I", "eat", "an", "apple", "he", "drinks", "water", "bread"],
                    "correct_answer": "I eat an apple"
                },
                {
                    "id": 8203,
                    "type": "word_bank",
                    "prompt": "Assemble this sentence",
                    "prompt_translation": "She drinks milk.",
                    "audio_text": "She drinks milk",
                    "options": ["She", "drinks", "milk", "He", "eats", "coffee", "juice"],
                    "correct_answer": "She drinks milk"
                },
                {
                    "id": 8204,
                    "type": "match_pairs",
                    "prompt": "Match the words",
                    "prompt_translation": "Connect food items",
                    "audio_text": None,
                    "options": {
                        "left": ["bread", "milk", "apple", "water"],
                        "right": ["toast", "dairy", "fruit", "drink"]
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
        3: {
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
                    "options": ["drinks", "drink", "drinking"],
                    "correct_answer": "drinks",
                    "metadata": {"sentence_prefix": "The woman", "sentence_suffix": "water."}
                },
                {
                    "id": 8302,
                    "type": "fill_in_blank",
                    "prompt": "Choose the correct verb form",
                    "prompt_translation": "He eats bread.",
                    "audio_text": "He eats bread",
                    "options": ["eats", "eat", "eating"],
                    "correct_answer": "eats",
                    "metadata": {"sentence_prefix": "He", "sentence_suffix": "bread."}
                },
                {
                    "id": 8303,
                    "type": "word_bank",
                    "prompt": "Arrange this negative sentence",
                    "prompt_translation": "I do not eat meat.",
                    "audio_text": "I do not eat meat",
                    "options": ["I", "do", "not", "eat", "meat", "she", "drinks", "water"],
                    "correct_answer": "I do not eat meat"
                },
                {
                    "id": 8304,
                    "type": "fill_in_blank",
                    "prompt": "Select the correct plural verb",
                    "prompt_translation": "We drink milk.",
                    "audio_text": "We drink milk",
                    "options": ["drink", "drinks", "drinking"],
                    "correct_answer": "drink",
                    "metadata": {"sentence_prefix": "We", "sentence_suffix": "milk."}
                }
            ]
        },
        4: {
            "title": "Milestone Chest",
            "skill_title": "Chest Milestone",
            "xp_reward": 10,
            "exercises": []
        },
        5: {
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
                    "options": ["Good", "morning", "nice", "to", "meet", "you", "hello", "thanks"],
                    "correct_answer": "Good morning nice to meet you",
                    "metadata": {"is_audio_challenge": True}
                },
                {
                    "id": 8502,
                    "type": "word_bank",
                    "prompt": "🎧 Tap what you hear",
                    "prompt_translation": "Listen and assemble",
                    "audio_text": "The man drinks water",
                    "options": ["The", "man", "drinks", "water", "woman", "eats", "bread"],
                    "correct_answer": "The man drinks water",
                    "metadata": {"is_audio_challenge": True}
                },
                {
                    "id": 8503,
                    "type": "multiple_choice",
                    "prompt": "🎧 What did you hear?",
                    "prompt_translation": "Select the matching phrase",
                    "audio_text": "A table for two, please",
                    "options": [
                        {"text": "A table for two, please", "translation": "Table reservation"},
                        {"text": "The bill, please", "translation": "Payment request"},
                        {"text": "A cup of coffee", "translation": "Drink order"}
                    ],
                    "correct_answer": "A table for two, please"
                }
            ]
        },
        6: {
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
                    "options": None,
                    "correct_answer": "good morning"
                },
                {
                    "id": 8602,
                    "type": "type_answer",
                    "prompt": "Write 'Thank you' in English",
                    "prompt_translation": "Enter the gratitude phrase",
                    "audio_text": "Thank you",
                    "options": None,
                    "correct_answer": "thank you"
                },
                {
                    "id": 8603,
                    "type": "fill_in_blank",
                    "prompt": "Complete the sentence with the correct verb",
                    "prompt_translation": "The boy eats bread.",
                    "audio_text": "The boy eats bread",
                    "options": ["eats", "eat", "eating"],
                    "correct_answer": "eats",
                    "metadata": {"sentence_prefix": "The boy", "sentence_suffix": "bread."}
                },
                {
                    "id": 8604,
                    "type": "type_answer",
                    "prompt": "Write 'Please' in English",
                    "prompt_translation": "Enter 'please'",
                    "audio_text": "Please",
                    "options": None,
                    "correct_answer": "please"
                }
            ]
        }
    },

    # =========================================================================
    # 2. SPANISH (es)
    # =========================================================================
    "es": {
        1: {
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
                        {"text": "el niño", "translation": "the boy"},
                        {"text": "la niña", "translation": "the girl"},
                        {"text": "la manzana", "translation": "the apple"}
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
                        {"text": "Hola", "translation": "Hello"},
                        {"text": "Adiós", "translation": "Goodbye"},
                        {"text": "Gracias", "translation": "Thank you"}
                    ],
                    "correct_answer": "Hola"
                },
                {
                    "id": 103,
                    "type": "word_bank",
                    "prompt": "Translate 'the girl'",
                    "prompt_translation": "la niña",
                    "audio_text": "la niña",
                    "options": ["the", "girl", "boy", "water", "apple"],
                    "correct_answer": "the girl"
                },
                {
                    "id": 104,
                    "type": "multiple_choice",
                    "prompt": "What does 'el agua' mean?",
                    "prompt_translation": "Select the translation",
                    "audio_text": "el agua",
                    "options": [
                        {"text": "the water", "translation": "el agua"},
                        {"text": "the milk", "translation": "la leche"},
                        {"text": "the bread", "translation": "el pan"}
                    ],
                    "correct_answer": "the water"
                }
            ]
        },
        2: {
            "title": "Sentence Construction & Matching",
            "skill_title": "Phrases",
            "xp_reward": 10,
            "exercises": [
                {
                    "id": 201,
                    "type": "match_pairs",
                    "prompt": "Tap the matching pairs",
                    "prompt_translation": "Connect words in Spanish and English",
                    "audio_text": None,
                    "options": {
                        "left": ["hola", "gracias", "adiós", "por favor"],
                        "right": ["hello", "thank you", "goodbye", "please"]
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
                    "options": ["I", "eat", "an", "apple", "he", "drinks", "water", "bread"],
                    "correct_answer": "I eat an apple"
                },
                {
                    "id": 203,
                    "type": "word_bank",
                    "prompt": "Translate this sentence",
                    "prompt_translation": "Ella bebe leche.",
                    "audio_text": "Ella bebe leche",
                    "options": ["She", "drinks", "milk", "He", "eats", "coffee", "juice"],
                    "correct_answer": "She drinks milk"
                },
                {
                    "id": 204,
                    "type": "match_pairs",
                    "prompt": "Match food vocabulary",
                    "prompt_translation": "Match pairs",
                    "audio_text": None,
                    "options": {
                        "left": ["el pan", "la leche", "la manzana", "el agua"],
                        "right": ["the bread", "the milk", "the apple", "the water"]
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
        3: {
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
                    "options": ["bebe", "comes", "bebo"],
                    "correct_answer": "bebe",
                    "metadata": {"sentence_prefix": "La mujer", "sentence_suffix": "agua."}
                },
                {
                    "id": 302,
                    "type": "fill_in_blank",
                    "prompt": "Choose the correct form of 'to eat'",
                    "prompt_translation": "He eats bread.",
                    "audio_text": "Él come pan",
                    "options": ["come", "bebe", "comes"],
                    "correct_answer": "come",
                    "metadata": {"sentence_prefix": "Él", "sentence_suffix": "pan."}
                },
                {
                    "id": 303,
                    "type": "word_bank",
                    "prompt": "Translate this negative sentence",
                    "prompt_translation": "Yo no como carne.",
                    "audio_text": "Yo no como carne",
                    "options": ["I", "do", "not", "eat", "meat", "she", "drinks", "water"],
                    "correct_answer": "I do not eat meat"
                },
                {
                    "id": 304,
                    "type": "fill_in_blank",
                    "prompt": "Select the correct pronoun",
                    "prompt_translation": "We drink milk.",
                    "audio_text": "Nosotros bebemos leche",
                    "options": ["Nosotros", "Ellas", "Tú"],
                    "correct_answer": "Nosotros",
                    "metadata": {"sentence_prefix": "", "sentence_suffix": "bebemos leche."}
                }
            ]
        },
        4: {
            "title": "Milestone Chest",
            "skill_title": "Chest Milestone",
            "xp_reward": 10,
            "exercises": []
        },
        5: {
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
                    "options": ["Buenos", "días", "mucho", "gusto", "hola", "gracias", "tarde"],
                    "correct_answer": "Buenos días mucho gusto",
                    "metadata": {"is_audio_challenge": True}
                },
                {
                    "id": 502,
                    "type": "word_bank",
                    "prompt": "🎧 Tap what you hear",
                    "prompt_translation": "Listen and assemble",
                    "audio_text": "El hombre bebe agua",
                    "options": ["El", "hombre", "bebe", "agua", "la", "mujer", "come"],
                    "correct_answer": "El hombre bebe agua",
                    "metadata": {"is_audio_challenge": True}
                },
                {
                    "id": 503,
                    "type": "multiple_choice",
                    "prompt": "🎧 What did you hear?",
                    "prompt_translation": "Select the matching audio sentence",
                    "audio_text": "Una mesa para dos, por favor",
                    "options": [
                        {"text": "Una mesa para dos, por favor", "translation": "A table for two, please"},
                        {"text": "La cuenta, por favor", "translation": "The bill, please"},
                        {"text": "Un café con leche", "translation": "A coffee with milk"}
                    ],
                    "correct_answer": "Una mesa para dos, por favor"
                }
            ]
        },
        6: {
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
                    "options": None,
                    "correct_answer": "buenos días"
                },
                {
                    "id": 602,
                    "type": "type_answer",
                    "prompt": "Translate 'I am a woman' to Spanish",
                    "prompt_translation": "Type in Spanish",
                    "audio_text": "Yo soy una mujer",
                    "options": None,
                    "correct_answer": "yo soy una mujer"
                },
                {
                    "id": 603,
                    "type": "fill_in_blank",
                    "prompt": "Complete the sentence with the correct verb",
                    "prompt_translation": "The boy eats bread.",
                    "audio_text": "El niño come pan",
                    "options": ["come", "bebe", "comes"],
                    "correct_answer": "come",
                    "metadata": {"sentence_prefix": "El niño", "sentence_suffix": "pan."}
                },
                {
                    "id": 604,
                    "type": "type_answer",
                    "prompt": "Write 'Please' in Spanish",
                    "prompt_translation": "Enter 'por favor'",
                    "audio_text": "Por favor",
                    "options": None,
                    "correct_answer": "por favor"
                }
            ]
        }
    },

    # =========================================================================
    # 3. FRENCH (fr)
    # =========================================================================
    "fr": {
        1: {
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
                        {"text": "le garçon", "translation": "the boy"},
                        {"text": "la fille", "translation": "the girl"},
                        {"text": "la pomme", "translation": "the apple"}
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
                        {"text": "Bonjour", "translation": "Hello"},
                        {"text": "Au revoir", "translation": "Goodbye"},
                        {"text": "Merci", "translation": "Thank you"}
                    ],
                    "correct_answer": "Bonjour"
                },
                {
                    "id": 2103,
                    "type": "word_bank",
                    "prompt": "Translate 'the girl'",
                    "prompt_translation": "la fille",
                    "audio_text": "la fille",
                    "options": ["the", "girl", "boy", "water", "apple"],
                    "correct_answer": "the girl"
                },
                {
                    "id": 2104,
                    "type": "multiple_choice",
                    "prompt": "What does 'l'eau' mean?",
                    "prompt_translation": "Select the translation",
                    "audio_text": "l'eau",
                    "options": [
                        {"text": "the water", "translation": "l'eau"},
                        {"text": "the milk", "translation": "le lait"},
                        {"text": "the bread", "translation": "le pain"}
                    ],
                    "correct_answer": "the water"
                }
            ]
        },
        2: {
            "title": "Sentence Construction & Matching",
            "skill_title": "Phrases",
            "xp_reward": 10,
            "exercises": [
                {
                    "id": 2201,
                    "type": "match_pairs",
                    "prompt": "Tap the matching pairs",
                    "prompt_translation": "Connect French and English words",
                    "audio_text": None,
                    "options": {
                        "left": ["bonjour", "merci", "au revoir", "s'il vous plaît"],
                        "right": ["hello", "thank you", "goodbye", "please"]
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
                    "options": ["I", "eat", "an", "apple", "he", "drinks", "water", "bread"],
                    "correct_answer": "I eat an apple"
                },
                {
                    "id": 2203,
                    "type": "word_bank",
                    "prompt": "Translate this sentence",
                    "prompt_translation": "Elle boit du lait.",
                    "audio_text": "Elle boit du lait",
                    "options": ["She", "drinks", "milk", "He", "eats", "coffee", "juice"],
                    "correct_answer": "She drinks milk"
                }
            ]
        },
        3: {
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
                    "options": ["boit", "bois", "boivent"],
                    "correct_answer": "boit",
                    "metadata": {"sentence_prefix": "La femme", "sentence_suffix": "de l'eau."}
                },
                {
                    "id": 2302,
                    "type": "fill_in_blank",
                    "prompt": "Choose the correct form of 'manger'",
                    "prompt_translation": "He eats bread.",
                    "audio_text": "Il mange du pain",
                    "options": ["mange", "manges", "mangent"],
                    "correct_answer": "mange",
                    "metadata": {"sentence_prefix": "Il", "sentence_suffix": "du pain."}
                }
            ]
        },
        4: {
            "title": "Milestone Chest",
            "skill_title": "Chest Milestone",
            "xp_reward": 10,
            "exercises": []
        },
        5: {
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
                    "options": ["Bonjour", "enchanté", "merci", "au", "revoir"],
                    "correct_answer": "Bonjour enchanté",
                    "metadata": {"is_audio_challenge": True}
                },
                {
                    "id": 2502,
                    "type": "multiple_choice",
                    "prompt": "🎧 What did you hear?",
                    "prompt_translation": "Choose the matching French sentence",
                    "audio_text": "Une table pour deux, s'il vous plaît",
                    "options": [
                        {"text": "Une table pour deux, s'il vous plaît", "translation": "A table for two, please"},
                        {"text": "L'addition, s'il vous plaît", "translation": "The bill, please"},
                        {"text": "Un café au lait", "translation": "A coffee with milk"}
                    ],
                    "correct_answer": "Une table pour deux, s'il vous plaît"
                }
            ]
        },
        6: {
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
                    "options": None,
                    "correct_answer": "bonjour"
                },
                {
                    "id": 2602,
                    "type": "type_answer",
                    "prompt": "Write 'Thank you' in French",
                    "prompt_translation": "Type 'merci'",
                    "audio_text": "Merci",
                    "options": None,
                    "correct_answer": "merci"
                }
            ]
        }
    },

    # =========================================================================
    # 4. GERMAN (de)
    # =========================================================================
    "de": {
        1: {
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
                        {"text": "der Junge", "translation": "the boy"},
                        {"text": "das Mädchen", "translation": "the girl"},
                        {"text": "der Apfel", "translation": "the apple"}
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
                        {"text": "Hallo", "translation": "Hello"},
                        {"text": "Tschüss", "translation": "Goodbye"},
                        {"text": "Danke", "translation": "Thank you"}
                    ],
                    "correct_answer": "Hallo"
                }
            ]
        },
        2: {
            "title": "Sentence Construction & Matching",
            "skill_title": "Phrases",
            "xp_reward": 10,
            "exercises": [
                {
                    "id": 3201,
                    "type": "match_pairs",
                    "prompt": "Tap the matching pairs",
                    "prompt_translation": "Match words in German and English",
                    "audio_text": None,
                    "options": {
                        "left": ["hallo", "danke", "tschüss", "bitte"],
                        "right": ["hello", "thank you", "goodbye", "please"]
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
                    "options": ["I", "eat", "an", "apple", "he", "drinks", "water"],
                    "correct_answer": "I eat an apple"
                }
            ]
        },
        3: {
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
                    "options": ["trinkt", "trinke", "trinken"],
                    "correct_answer": "trinkt",
                    "metadata": {"sentence_prefix": "Die Frau", "sentence_suffix": "Wasser."}
                }
            ]
        },
        4: {
            "title": "Milestone Chest",
            "skill_title": "Chest Milestone",
            "xp_reward": 10,
            "exercises": []
        },
        5: {
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
                    "options": ["Guten", "Morgen", "wie", "geht's?", "Hallo", "danke"],
                    "correct_answer": "Guten Morgen wie geht's?",
                    "metadata": {"is_audio_challenge": True}
                }
            ]
        },
        6: {
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
                    "options": None,
                    "correct_answer": "danke"
                }
            ]
        }
    },

    # =========================================================================
    # 5. ITALIAN (it)
    # =========================================================================
    "it": {
        1: {
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
                        {"text": "il ragazzo", "translation": "the boy"},
                        {"text": "la ragazza", "translation": "the girl"},
                        {"text": "la mela", "translation": "the apple"}
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
                        {"text": "Ciao", "translation": "Hello"},
                        {"text": "Arrivederci", "translation": "Goodbye"},
                        {"text": "Grazie", "translation": "Thank you"}
                    ],
                    "correct_answer": "Ciao"
                },
                {
                    "id": 4103,
                    "type": "word_bank",
                    "prompt": "Traduci 'the girl'",
                    "prompt_translation": "la ragazza",
                    "audio_text": "la ragazza",
                    "options": ["la", "ragazza", "ragazzo", "acqua", "mela"],
                    "correct_answer": "la ragazza"
                },
                {
                    "id": 4104,
                    "type": "multiple_choice",
                    "prompt": "Cosa significa 'l'acqua'?",
                    "prompt_translation": "What does 'l'acqua' mean?",
                    "audio_text": "l'acqua",
                    "options": [
                        {"text": "the water", "translation": "l'acqua"},
                        {"text": "the milk", "translation": "il latte"},
                        {"text": "the bread", "translation": "il pane"}
                    ],
                    "correct_answer": "the water"
                }
            ]
        },
        2: {
            "title": "Sentence Construction & Matching",
            "skill_title": "Phrases",
            "xp_reward": 10,
            "exercises": [
                {
                    "id": 4201,
                    "type": "match_pairs",
                    "prompt": "Tap the matching pairs",
                    "prompt_translation": "Match Italian and English words",
                    "audio_text": None,
                    "options": {
                        "left": ["ciao", "grazie", "arrivederci", "per favore"],
                        "right": ["hello", "thank you", "goodbye", "please"]
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
                    "options": ["I", "eat", "an", "apple", "he", "drinks", "water", "bread"],
                    "correct_answer": "I eat an apple"
                },
                {
                    "id": 4203,
                    "type": "word_bank",
                    "prompt": "Traduci questa frase",
                    "prompt_translation": "Lei beve latte.",
                    "audio_text": "Lei beve latte",
                    "options": ["She", "drinks", "milk", "He", "eats", "coffee", "juice"],
                    "correct_answer": "She drinks milk"
                }
            ]
        },
        3: {
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
                    "options": ["beve", "bevo", "bevono"],
                    "correct_answer": "beve",
                    "metadata": {"sentence_prefix": "La donna", "sentence_suffix": "acqua."}
                }
            ]
        },
        4: {
            "title": "Milestone Chest",
            "skill_title": "Chest Milestone",
            "xp_reward": 10,
            "exercises": []
        },
        5: {
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
                    "options": ["Buongiorno", "molto", "piacere", "grazie", "ciao"],
                    "correct_answer": "Buongiorno molto piacere",
                    "metadata": {"is_audio_challenge": True}
                }
            ]
        },
        6: {
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
                    "options": None,
                    "correct_answer": "buongiorno"
                },
                {
                    "id": 4602,
                    "type": "type_answer",
                    "prompt": "Scrivi 'Thank you' in italiano",
                    "prompt_translation": "Enter 'grazie'",
                    "audio_text": "Grazie",
                    "options": None,
                    "correct_answer": "grazie"
                }
            ]
        }
    },

    # =========================================================================
    # 6. PORTUGUESE (pt)
    # =========================================================================
    "pt": {
        1: {
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
                        {"text": "o menino", "translation": "the boy"},
                        {"text": "a menina", "translation": "the girl"},
                        {"text": "a maçã", "translation": "the apple"}
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
                        {"text": "Olá", "translation": "Hello"},
                        {"text": "Adeus", "translation": "Goodbye"},
                        {"text": "Obrigado", "translation": "Thank you"}
                    ],
                    "correct_answer": "Olá"
                }
            ]
        },
        2: {
            "title": "Sentence Construction & Matching",
            "skill_title": "Phrases",
            "xp_reward": 10,
            "exercises": [
                {
                    "id": 5201,
                    "type": "match_pairs",
                    "prompt": "Toque nos pares correspondentes",
                    "prompt_translation": "Match Portuguese and English",
                    "audio_text": None,
                    "options": {
                        "left": ["olá", "obrigado", "adeus", "por favor"],
                        "right": ["hello", "thank you", "goodbye", "please"]
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
                    "options": ["I", "eat", "an", "apple", "he", "drinks", "water"],
                    "correct_answer": "I eat an apple"
                }
            ]
        },
        3: {
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
                    "options": ["bebe", "bebo", "bebem"],
                    "correct_answer": "bebe",
                    "metadata": {"sentence_prefix": "A mulher", "sentence_suffix": "água."}
                }
            ]
        },
        4: {
            "title": "Milestone Chest",
            "skill_title": "Chest Milestone",
            "xp_reward": 10,
            "exercises": []
        },
        5: {
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
                    "options": ["Bom", "dia", "muito", "prazer", "olá", "obrigado"],
                    "correct_answer": "Bom dia muito prazer",
                    "metadata": {"is_audio_challenge": True}
                }
            ]
        },
        6: {
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
                    "options": None,
                    "correct_answer": "obrigado"
                }
            ]
        }
    },

    # =========================================================================
    # 7. JAPANESE (ja)
    # =========================================================================
    "ja": {
        1: {
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
                        {"text": "こんにちは", "translation": "Hello"},
                        {"text": "ありがとう", "translation": "Thank you"},
                        {"text": "さようなら", "translation": "Goodbye"}
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
                        {"text": "water", "translation": "水 (mizu)"},
                        {"text": "tea", "translation": "お茶 (ocha)"},
                        {"text": "rice", "translation": "ご飯 (gohan)"}
                    ],
                    "correct_answer": "water"
                }
            ]
        },
        2: {
            "title": "Sentence Construction & Matching",
            "skill_title": "Phrases",
            "xp_reward": 10,
            "exercises": [
                {
                    "id": 6201,
                    "type": "match_pairs",
                    "prompt": "Tap the matching pairs",
                    "prompt_translation": "Match Japanese and English words",
                    "audio_text": None,
                    "options": {
                        "left": ["こんにちは", "ありがとう", "さようなら", "水"],
                        "right": ["hello", "thank you", "goodbye", "water"]
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
                    "options": ["I", "drink", "water", "eat", "bread", "tea"],
                    "correct_answer": "I drink water"
                }
            ]
        },
        3: {
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
                    "options": ["を", "は", "が"],
                    "correct_answer": "を",
                    "metadata": {"sentence_prefix": "水", "sentence_suffix": "飲みます。"}
                }
            ]
        },
        4: {
            "title": "Milestone Chest",
            "skill_title": "Chest Milestone",
            "xp_reward": 10,
            "exercises": []
        },
        5: {
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
                    "options": ["おはよう", "ございます", "こんにちは", "水"],
                    "correct_answer": "おはようございます",
                    "metadata": {"is_audio_challenge": True}
                }
            ]
        },
        6: {
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
                    "options": None,
                    "correct_answer": "arigato"
                }
            ]
        }
    },

    # =========================================================================
    # 8. HINDI (hi)
    # =========================================================================
    "hi": {
        1: {
            "title": "Basic Vocabulary & Recognition",
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
                        {"text": "नमस्ते (Namaste)", "translation": "Hello"},
                        {"text": "धन्यवाद (Dhanyavaad)", "translation": "Thank you"},
                        {"text": "अलविदा (Alvida)", "translation": "Goodbye"}
                    ],
                    "correct_answer": "नमस्ते (Namaste)"
                },
                {
                    "id": 7102,
                    "type": "multiple_choice",
                    "prompt": "What does 'पानी' (paani) mean?",
                    "prompt_translation": "Select the translation",
                    "audio_text": "पानी",
                    "options": [
                        {"text": "water", "translation": "पानी (paani)"},
                        {"text": "tea", "translation": "चाय (chai)"},
                        {"text": "apple", "translation": "सेब (seb)"}
                    ],
                    "correct_answer": "water"
                }
            ]
        },
        2: {
            "title": "Sentence Construction & Matching",
            "skill_title": "Phrases",
            "xp_reward": 10,
            "exercises": [
                {
                    "id": 7201,
                    "type": "match_pairs",
                    "prompt": "Tap the matching pairs",
                    "prompt_translation": "Connect Hindi and English words",
                    "audio_text": None,
                    "options": {
                        "left": ["नमस्ते", "धन्यवाद", "पानी", "अलविदा"],
                        "right": ["hello", "thank you", "water", "goodbye"]
                    },
                    "correct_answer": {
                        "नमस्ते": "hello",
                        "धन्यवाद": "thank you",
                        "पानी": "water",
                        "अलविदा": "goodbye"
                    }
                },
                {
                    "id": 7202,
                    "type": "word_bank",
                    "prompt": "Translate this sentence",
                    "prompt_translation": "लड़का पानी पीता है।",
                    "audio_text": "लड़का पानी पीता है",
                    "options": ["The", "boy", "drinks", "water", "eats", "bread", "girl"],
                    "correct_answer": "The boy drinks water"
                }
            ]
        },
        3: {
            "title": "Grammar & Conjugations",
            "skill_title": "Grammar",
            "xp_reward": 10,
            "exercises": [
                {
                    "id": 7301,
                    "type": "fill_in_blank",
                    "prompt": "Complete with the correct feminine verb",
                    "prompt_translation": "The girl drinks water (Ladki paani peeti hai).",
                    "audio_text": "लड़की पानी पीती है",
                    "options": ["पीती", "पीता", "पीते"],
                    "correct_answer": "पीती",
                    "metadata": {"sentence_prefix": "लड़की पानी", "sentence_suffix": "है।"}
                }
            ]
        },
        4: {
            "title": "Milestone Chest",
            "skill_title": "Chest Milestone",
            "xp_reward": 10,
            "exercises": []
        },
        5: {
            "title": "Listening & Audio Comprehension",
            "skill_title": "Audio Challenge",
            "xp_reward": 15,
            "exercises": [
                {
                    "id": 7501,
                    "type": "word_bank",
                    "prompt": "🎧 Listen and tap what you hear",
                    "prompt_translation": "Tap the spoken words",
                    "audio_text": "नमस्ते, आपका स्वागत है",
                    "options": ["नमस्ते", "आपका", "स्वागत", "है", "धन्यवाद", "पानी"],
                    "correct_answer": "नमस्ते आपका स्वागत है",
                    "metadata": {"is_audio_challenge": True}
                }
            ]
        },
        6: {
            "title": "Unit 1 Trophy Mastery Challenge",
            "skill_title": "Checkpoint Challenge",
            "xp_reward": 25,
            "exercises": [
                {
                    "id": 7601,
                    "type": "type_answer",
                    "prompt": "Type 'Thank you' in Hindi (dhanyavaad / धन्यवाद)",
                    "prompt_translation": "Enter 'dhanyavaad'",
                    "audio_text": "धन्यवाद",
                    "options": None,
                    "correct_answer": "dhanyavaad"
                }
            ]
        }
    },

    # =========================================================================
    # 9. KOREAN (ko)
    # =========================================================================
    "ko": {
        1: {
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
                        {"text": "안녕하세요 (Annyeonghaseyo)", "translation": "Hello"},
                        {"text": "감사합니다 (Gamsahamnida)", "translation": "Thank you"},
                        {"text": "안녕히 가세요", "translation": "Goodbye"}
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
                        {"text": "water", "translation": "물 (mul)"},
                        {"text": "milk", "translation": "우유 (uyu)"},
                        {"text": "apple", "translation": "사과 (sagwa)"}
                    ],
                    "correct_answer": "water"
                }
            ]
        },
        2: {
            "title": "Sentence Construction & Matching",
            "skill_title": "Phrases",
            "xp_reward": 10,
            "exercises": [
                {
                    "id": 9201,
                    "type": "match_pairs",
                    "prompt": "Tap the matching pairs",
                    "prompt_translation": "Match Korean and English words",
                    "audio_text": None,
                    "options": {
                        "left": ["안녕하세요", "감사합니다", "물", "사과"],
                        "right": ["hello", "thank you", "water", "apple"]
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
                    "options": ["I", "drink", "water", "eat", "apple", "tea"],
                    "correct_answer": "I drink water"
                }
            ]
        },
        3: {
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
                    "options": ["마셔요", "먹어요", "가요"],
                    "correct_answer": "마셔요",
                    "metadata": {"sentence_prefix": "물을", "sentence_suffix": "。"}
                }
            ]
        },
        4: {
            "title": "Milestone Chest",
            "skill_title": "Chest Milestone",
            "xp_reward": 10,
            "exercises": []
        },
        5: {
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
                    "options": ["좋은", "아침이에요", "안녕하세요", "물"],
                    "correct_answer": "좋은 아침이에요",
                    "metadata": {"is_audio_challenge": True}
                }
            ]
        },
        6: {
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
                    "options": None,
                    "correct_answer": "gamsahamnida"
                }
            ]
        }
    },

    # =========================================================================
    # 10. CHINESE (zh)
    # =========================================================================
    "zh": {
        1: {
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
                        {"text": "你好 (Nǐ hǎo)", "translation": "Hello"},
                        {"text": "谢谢 (Xièxiè)", "translation": "Thank you"},
                        {"text": "再见 (Zàijiàn)", "translation": "Goodbye"}
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
                        {"text": "water", "translation": "水 (shuǐ)"},
                        {"text": "tea", "translation": "茶 (chá)"},
                        {"text": "apple", "translation": "苹果 (píngguǒ)"}
                    ],
                    "correct_answer": "water"
                }
            ]
        },
        2: {
            "title": "Sentence Construction & Matching",
            "skill_title": "Phrases",
            "xp_reward": 10,
            "exercises": [
                {
                    "id": 12201,
                    "type": "match_pairs",
                    "prompt": "Tap the matching pairs",
                    "prompt_translation": "Match Chinese and English words",
                    "audio_text": None,
                    "options": {
                        "left": ["你好", "谢谢", "再见", "水"],
                        "right": ["hello", "thank you", "goodbye", "water"]
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
                    "options": ["I", "drink", "water", "eat", "bread", "apple"],
                    "correct_answer": "I drink water"
                }
            ]
        },
        3: {
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
                    "options": ["喝", "吃", "是"],
                    "correct_answer": "喝",
                    "metadata": {"sentence_prefix": "她", "sentence_suffix": "水。"}
                }
            ]
        },
        4: {
            "title": "Milestone Chest",
            "skill_title": "Chest Milestone",
            "xp_reward": 10,
            "exercises": []
        },
        5: {
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
                    "options": ["早上好", "你好", "谢谢", "水"],
                    "correct_answer": "早上好",
                    "metadata": {"is_audio_challenge": True}
                }
            ]
        },
        6: {
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
                    "options": None,
                    "correct_answer": "nihao"
                }
            ]
        }
    },

    # =========================================================================
    # 11. RUSSIAN (ru)
    # =========================================================================
    "ru": {
        1: {
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
                        {"text": "Привет (Privet)", "translation": "Hello"},
                        {"text": "Спасибо (Spasibo)", "translation": "Thank you"},
                        {"text": "Пока (Poka)", "translation": "Goodbye"}
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
                        {"text": "water", "translation": "вода (voda)"},
                        {"text": "milk", "translation": "молоко (moloko)"},
                        {"text": "bread", "translation": "хлеб (khleb)"}
                    ],
                    "correct_answer": "water"
                }
            ]
        },
        2: {
            "title": "Sentence Construction & Matching",
            "skill_title": "Phrases",
            "xp_reward": 10,
            "exercises": [
                {
                    "id": 13201,
                    "type": "match_pairs",
                    "prompt": "Tap the matching pairs",
                    "prompt_translation": "Match Russian and English words",
                    "audio_text": None,
                    "options": {
                        "left": ["привет", "спасибо", "вода", "пока"],
                        "right": ["hello", "thank you", "water", "bye"]
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
                    "options": ["I", "drink", "water", "eat", "bread", "milk"],
                    "correct_answer": "I drink water"
                }
            ]
        },
        3: {
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
                    "options": ["ест", "пью", "пьёт"],
                    "correct_answer": "ест",
                    "metadata": {"sentence_prefix": "Он", "sentence_suffix": "хлеб."}
                }
            ]
        },
        4: {
            "title": "Milestone Chest",
            "skill_title": "Chest Milestone",
            "xp_reward": 10,
            "exercises": []
        },
        5: {
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
                    "options": ["Доброе", "утро", "Привет", "спасибо"],
                    "correct_answer": "Доброе утро",
                    "metadata": {"is_audio_challenge": True}
                }
            ]
        },
        6: {
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
                    "options": None,
                    "correct_answer": "spasibo"
                }
            ]
        }
    }
}

def find_exercise_by_id(exercise_id: int) -> Optional[Dict[str, Any]]:
    """
    Looks through all languages and levels in CURRICULUM_DATA to find an exercise by ID.
    """
    for lang, levels in CURRICULUM_DATA.items():
        for lvl, data in levels.items():
            for ex in data.get("exercises", []):
                if ex.get("id") == exercise_id:
                    return ex
    return None

LANG_MAP = {
    "en": "en", "english": "en",
    "es": "es", "spanish": "es", "español": "es",
    "fr": "fr", "french": "fr", "français": "fr",
    "de": "de", "german": "de", "deutsch": "de",
    "it": "it", "italian": "it", "italiano": "it",
    "pt": "pt", "portuguese": "pt", "português": "pt",
    "ja": "ja", "japanese": "ja",
    "hi": "hi", "hindi": "hi",
    "ko": "ko", "korean": "ko",
    "zh": "zh", "chinese": "zh",
    "ru": "ru", "russian": "ru",
}

def get_calibrated_level_exercises(language_code: str, level_number: int) -> Dict[str, Any]:
    """
    Returns exercises and metadata for a specific level strictly tailored to the requested language.
    Guarantees that a learner who chose English, French, German, Italian, Portuguese, Japanese,
    Hindi, Korean, Chinese, Russian, or Spanish gets questions ONLY in that selected language.
    """
    raw_lang = (language_code or "en").lower().strip()
    lang = LANG_MAP.get(raw_lang, "en")
    if lang not in CURRICULUM_DATA:
        lang = "en"

    # 1. Exact match for language and level with non-empty exercises
    if level_number in CURRICULUM_DATA[lang] and len(CURRICULUM_DATA[lang][level_number].get("exercises", [])) > 0:
        return CURRICULUM_DATA[lang][level_number]

    # 2. Modulo cycle strictly within the SAME language (for units 2, 3, etc.)
    modulo_level = ((level_number - 1) % 6) + 1
    # Level 4 is milestone chest on path. If called as a lesson, give audio challenge (level 5) or level 1
    if modulo_level == 4 or len(CURRICULUM_DATA[lang].get(modulo_level, {}).get("exercises", [])) == 0:
        modulo_level = 5 if len(CURRICULUM_DATA[lang].get(5, {}).get("exercises", [])) > 0 else 1

    base = CURRICULUM_DATA[lang].get(modulo_level, CURRICULUM_DATA[lang][1])
    return {
        "title": f"Level {level_number}: {base['title']}",
        "skill_title": base["skill_title"],
        "xp_reward": base.get("xp_reward", 10),
        "exercises": base["exercises"]
    }


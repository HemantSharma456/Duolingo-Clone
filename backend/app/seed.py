import json
from datetime import date, timedelta, datetime, timezone
from sqlalchemy.orm import Session
from app.database import engine, SessionLocal, Base
from app.models import (
    User, Course, Unit, Skill, Lesson, Exercise,
    UserProgress, LessonAttempt, DailyActivity, Achievement, UserAchievement
)
import hashlib

def hash_pw(pw: str) -> str:
    return hashlib.sha256(pw.encode()).hexdigest()

COURSES_DATA = [
    {
        "title": "Spanish",
        "language_code": "es",
        "flag_emoji": "🇪🇸",
        "description": "Learn the world's most vibrant language with interactive lessons",
        "learner_count": "35.2M learners",
        "units": [
            {
                "unit_number": 1,
                "title": "Unit 1: Getting Started",
                "description": "Form basic sentences, greet people, order food",
                "color_theme": "#58cc02",
                "skills": [
                    {
                        "title": "Basics 1",
                        "icon_name": "coffee",
                        "order_index": 1,
                        "lessons": [
                            {
                                "title": "Basic Greetings & Words",
                                "exercises": [
                                    {
                                        "type": "multiple_choice",
                                        "prompt": "Which of these is 'the boy'?",
                                        "prompt_translation": "Select the matching picture or word",
                                        "audio_text": "el niño",
                                        "options": [
                                            {"text": "el niño", "translation": "the boy"},
                                            {"text": "la niña", "translation": "the girl"},
                                            {"text": "la manzana", "translation": "the apple"}
                                        ],
                                        "correct_answer": "el niño"
                                    },
                                    {
                                        "type": "word_bank",
                                        "prompt": "Translate this sentence",
                                        "prompt_translation": "Yo como una manzana.",
                                        "audio_text": "Yo como una manzana",
                                        "options": ["I", "eat", "an", "apple", "he", "drinks", "water", "bread"],
                                        "correct_answer": "I eat an apple"
                                    },
                                    {
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
                                        "type": "fill_in_blank",
                                        "prompt": "Complete the sentence with the correct verb",
                                        "prompt_translation": "The woman drinks water.",
                                        "audio_text": "La mujer bebe agua",
                                        "options": ["bebe", "comes", "bebo"],
                                        "correct_answer": "bebe",
                                        "metadata": {"sentence_prefix": "La mujer", "sentence_suffix": "agua."}
                                    },
                                    {
                                        "type": "type_answer",
                                        "prompt": "Write 'Good morning' in Spanish",
                                        "prompt_translation": "Enter the Spanish greeting",
                                        "audio_text": "Buenos días",
                                        "options": None,
                                        "correct_answer": "buenos días"
                                    }
                                ]
                            },
                            {
                                "title": "Food and Everyday Items",
                                "exercises": [
                                    {
                                        "type": "multiple_choice",
                                        "prompt": "What does 'el agua' mean?",
                                        "prompt_translation": "Choose the correct translation",
                                        "audio_text": "el agua",
                                        "options": [
                                            {"text": "the water", "translation": "el agua"},
                                            {"text": "the milk", "translation": "la leche"},
                                            {"text": "the bread", "translation": "el pan"}
                                        ],
                                        "correct_answer": "the water"
                                    },
                                    {
                                        "type": "word_bank",
                                        "prompt": "Translate this sentence",
                                        "prompt_translation": "Ella bebe leche.",
                                        "audio_text": "Ella bebe leche",
                                        "options": ["She", "drinks", "milk", "He", "eats", "coffee", "juice"],
                                        "correct_answer": "She drinks milk"
                                    },
                                    {
                                        "type": "match_pairs",
                                        "prompt": "Tap the matching pairs",
                                        "prompt_translation": "Match food vocabulary",
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
                                    },
                                    {
                                        "type": "fill_in_blank",
                                        "prompt": "Complete the sentence",
                                        "prompt_translation": "He eats bread.",
                                        "audio_text": "Él come pan",
                                        "options": ["come", "bebe", "comes"],
                                        "correct_answer": "come",
                                        "metadata": {"sentence_prefix": "Él", "sentence_suffix": "pan."}
                                    },
                                    {
                                        "type": "type_answer",
                                        "prompt": "Translate 'I am a woman' to Spanish",
                                        "prompt_translation": "Type in Spanish",
                                        "audio_text": "Yo soy una mujer",
                                        "options": None,
                                        "correct_answer": "yo soy una mujer"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "title": "Greetings",
                        "icon_name": "chat",
                        "order_index": 2,
                        "lessons": [
                            {
                                "title": "Polite Phrases",
                                "exercises": [
                                    {
                                        "type": "multiple_choice",
                                        "prompt": "How do you say 'Thank you' in Spanish?",
                                        "prompt_translation": "Select the correct phrase",
                                        "audio_text": "Gracias",
                                        "options": [
                                            {"text": "Gracias", "translation": "Thank you"},
                                            {"text": "Por favor", "translation": "Please"},
                                            {"text": "De nada", "translation": "You're welcome"}
                                        ],
                                        "correct_answer": "Gracias"
                                    },
                                    {
                                        "type": "word_bank",
                                        "prompt": "Translate this sentence",
                                        "prompt_translation": "Mucho gusto, Juan.",
                                        "audio_text": "Mucho gusto, Juan",
                                        "options": ["Nice", "to", "meet", "you", "Juan", "Good", "morning"],
                                        "correct_answer": "Nice to meet you Juan"
                                    },
                                    {
                                        "type": "match_pairs",
                                        "prompt": "Tap the matching pairs",
                                        "prompt_translation": "Match polite greetings",
                                        "audio_text": None,
                                        "options": {
                                            "left": ["buenas noches", "hasta luego", "perdón", "sí"],
                                            "right": ["good night", "see you later", "excuse me", "yes"]
                                        },
                                        "correct_answer": {
                                            "buenas noches": "good night",
                                            "hasta luego": "see you later",
                                            "perdón": "excuse me",
                                            "sí": "yes"
                                        }
                                    },
                                    {
                                        "type": "fill_in_blank",
                                        "prompt": "Complete the farewell phrase",
                                        "prompt_translation": "See you tomorrow!",
                                        "audio_text": "Hasta mañana",
                                        "options": ["mañana", "luego", "nunca"],
                                        "correct_answer": "mañana",
                                        "metadata": {"sentence_prefix": "Hasta", "sentence_suffix": "!"}
                                    },
                                    {
                                        "type": "type_answer",
                                        "prompt": "Write 'Please' in Spanish",
                                        "prompt_translation": "Enter 'por favor'",
                                        "audio_text": "Por favor",
                                        "options": None,
                                        "correct_answer": "por favor"
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                "unit_number": 2,
                "title": "Unit 2: Explore the World",
                "description": "Ask for directions, order at cafes, travel around",
                "color_theme": "#1cb0f6",
                "skills": [
                    {
                        "title": "Restaurant",
                        "icon_name": "apple",
                        "order_index": 1,
                        "lessons": [
                            {
                                "title": "Ordering at a Table",
                                "exercises": [
                                    {
                                        "type": "multiple_choice",
                                        "prompt": "Which of these is 'a table for two'?",
                                        "prompt_translation": "Select the correct phrase",
                                        "audio_text": "Una mesa para dos",
                                        "options": [
                                            {"text": "Una mesa para dos", "translation": "A table for two"},
                                            {"text": "La cuenta por favor", "translation": "The bill please"},
                                            {"text": "Un café solo", "translation": "A black coffee"}
                                        ],
                                        "correct_answer": "Una mesa para dos"
                                    },
                                    {
                                        "type": "word_bank",
                                        "prompt": "Translate this sentence",
                                        "prompt_translation": "Quiero pagar la cuenta.",
                                        "audio_text": "Quiero pagar la cuenta",
                                        "options": ["I", "want", "to", "pay", "the", "bill", "water", "menu"],
                                        "correct_answer": "I want to pay the bill"
                                    },
                                    {
                                        "type": "match_pairs",
                                        "prompt": "Match the dining terms",
                                        "prompt_translation": "Connect words",
                                        "audio_text": None,
                                        "options": {
                                            "left": ["la cuenta", "el menú", "el camarero", "el plato"],
                                            "right": ["the bill", "the menu", "the waiter", "the dish"]
                                        },
                                        "correct_answer": {
                                            "la cuenta": "the bill",
                                            "el menú": "the menu",
                                            "el camarero": "the waiter",
                                            "el plato": "the dish"
                                        }
                                    },
                                    {
                                        "type": "fill_in_blank",
                                        "prompt": "Complete the request",
                                        "prompt_translation": "A coffee, please.",
                                        "audio_text": "Un café, por favor",
                                        "options": ["café", "té", "agua"],
                                        "correct_answer": "café",
                                        "metadata": {"sentence_prefix": "Un", "sentence_suffix": ", por favor."}
                                    },
                                    {
                                        "type": "type_answer",
                                        "prompt": "Type 'the menu' in Spanish",
                                        "prompt_translation": "Translate 'el menú'",
                                        "audio_text": "El menú",
                                        "options": None,
                                        "correct_answer": "el menú"
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                "unit_number": 3,
                "title": "Unit 3: Say Where You Are From",
                "description": "Talk about countries, origins, and languages",
                "color_theme": "#00cd9c",
                "skills": [
                    {
                        "title": "Origins",
                        "icon_name": "globe",
                        "order_index": 1,
                        "lessons": [
                            {
                                "title": "Where Are You From?",
                                "exercises": [
                                    {
                                        "type": "multiple_choice",
                                        "prompt": "Which of these is 'I am from Spain'?",
                                        "prompt_translation": "Select the correct phrase",
                                        "audio_text": "Yo soy de España",
                                        "options": [
                                            {"text": "Yo soy de España", "translation": "I am from Spain"},
                                            {"text": "Yo vivo en México", "translation": "I live in Mexico"},
                                            {"text": "Yo hablo inglés", "translation": "I speak English"}
                                        ],
                                        "correct_answer": "Yo soy de España"
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                "unit_number": 4,
                "title": "Unit 4: Talk About Your Day",
                "description": "Discuss routines, time, and activities",
                "color_theme": "#ff4b4b",
                "skills": [
                    {
                        "title": "Daily Routine",
                        "icon_name": "clock",
                        "order_index": 1,
                        "lessons": [
                            {
                                "title": "Everyday Activities",
                                "exercises": [
                                    {
                                        "type": "multiple_choice",
                                        "prompt": "What does 'Buenos días' mean?",
                                        "prompt_translation": "Choose the greeting",
                                        "audio_text": "Buenos días",
                                        "options": [
                                            {"text": "Good morning", "translation": "Buenos días"},
                                            {"text": "Good night", "translation": "Buenas noches"},
                                            {"text": "Goodbye", "translation": "Adiós"}
                                        ],
                                        "correct_answer": "Good morning"
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        "title": "French",
        "language_code": "fr",
        "flag_emoji": "🇫🇷",
        "description": "Learn the language of love, cuisine, art, and diplomacy",
        "learner_count": "24.8M learners",
        "units": [
            {
                "unit_number": 1,
                "title": "Unit 1: Premier Pas",
                "description": "Greet people, introduce yourself, order a cafe",
                "color_theme": "#58cc02",
                "skills": [
                    {
                        "title": "Basics 1",
                        "icon_name": "coffee",
                        "order_index": 1,
                        "lessons": [
                            {
                                "title": "Bonjour & Salutations",
                                "exercises": [
                                    {
                                        "type": "multiple_choice",
                                        "prompt": "Which of these is 'the cat'?",
                                        "prompt_translation": "Select the French translation",
                                        "audio_text": "le chat",
                                        "options": [
                                            {"text": "le chat", "translation": "the cat"},
                                            {"text": "le chien", "translation": "the dog"},
                                            {"text": "la pomme", "translation": "the apple"}
                                        ],
                                        "correct_answer": "le chat"
                                    },
                                    {
                                        "type": "word_bank",
                                        "prompt": "Translate this sentence",
                                        "prompt_translation": "Je suis un homme.",
                                        "audio_text": "Je suis un homme",
                                        "options": ["I", "am", "a", "man", "woman", "boy", "eating", "water"],
                                        "correct_answer": "I am a man"
                                    },
                                    {
                                        "type": "match_pairs",
                                        "prompt": "Tap the matching pairs",
                                        "prompt_translation": "Connect French & English greetings",
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
                                        "type": "fill_in_blank",
                                        "prompt": "Complete the sentence with the correct verb",
                                        "prompt_translation": "The boy drinks water.",
                                        "audio_text": "Le garçon boit de l'eau",
                                        "options": ["boit", "mange", "suis"],
                                        "correct_answer": "boit",
                                        "metadata": {"sentence_prefix": "Le garçon", "sentence_suffix": "de l'eau."}
                                    },
                                    {
                                        "type": "type_answer",
                                        "prompt": "Write 'Thank you very much' in French",
                                        "prompt_translation": "Type 'merci beaucoup'",
                                        "audio_text": "Merci beaucoup",
                                        "options": None,
                                        "correct_answer": "merci beaucoup"
                                    }
                                ]
                            },
                            {
                                "title": "Everyday Objects & Food",
                                "exercises": [
                                    {
                                        "type": "multiple_choice",
                                        "prompt": "What does 'le croissant' mean?",
                                        "prompt_translation": "Choose the correct meaning",
                                        "audio_text": "le croissant",
                                        "options": [
                                            {"text": "the croissant", "translation": "le croissant"},
                                            {"text": "the coffee", "translation": "le café"},
                                            {"text": "the bread", "translation": "le pain"}
                                        ],
                                        "correct_answer": "the croissant"
                                    },
                                    {
                                        "type": "word_bank",
                                        "prompt": "Translate this sentence",
                                        "prompt_translation": "Une femme mange une pomme.",
                                        "audio_text": "Une femme mange une pomme",
                                        "options": ["A", "woman", "eats", "an", "apple", "drinks", "milk", "bread"],
                                        "correct_answer": "A woman eats an apple"
                                    },
                                    {
                                        "type": "match_pairs",
                                        "prompt": "Match food items",
                                        "prompt_translation": "Connect French food terms",
                                        "audio_text": None,
                                        "options": {
                                            "left": ["le pain", "le fromage", "l'eau", "la pomme"],
                                            "right": ["the bread", "the cheese", "the water", "the apple"]
                                        },
                                        "correct_answer": {
                                            "le pain": "the bread",
                                            "le fromage": "the cheese",
                                            "l'eau": "the water",
                                            "la pomme": "the apple"
                                        }
                                    },
                                    {
                                        "type": "fill_in_blank",
                                        "prompt": "Complete the phrase",
                                        "prompt_translation": "A coffee, please.",
                                        "audio_text": "Un café, s'il vous plaît",
                                        "options": ["café", "croissant", "thé"],
                                        "correct_answer": "café",
                                        "metadata": {"sentence_prefix": "Un", "sentence_suffix": ", s'il vous plaît."}
                                    },
                                    {
                                        "type": "type_answer",
                                        "prompt": "Translate 'Good evening' to French",
                                        "prompt_translation": "Enter 'bonsoir'",
                                        "audio_text": "Bonsoir",
                                        "options": None,
                                        "correct_answer": "bonsoir"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "title": "Greetings",
                        "icon_name": "chat",
                        "order_index": 2,
                        "lessons": [
                            {
                                "title": "Polite Encounters",
                                "exercises": [
                                    {
                                        "type": "multiple_choice",
                                        "prompt": "How do you ask 'How are you?' informally in French?",
                                        "prompt_translation": "Select the correct phrase",
                                        "audio_text": "Comment ça va ?",
                                        "options": [
                                            {"text": "Comment ça va ?", "translation": "How are you?"},
                                            {"text": "À bientôt", "translation": "See you soon"},
                                            {"text": "Bonne nuit", "translation": "Good night"}
                                        ],
                                        "correct_answer": "Comment ça va ?"
                                    },
                                    {
                                        "type": "word_bank",
                                        "prompt": "Translate this sentence",
                                        "prompt_translation": "Enchanté de vous rencontrer.",
                                        "audio_text": "Enchanté de vous rencontrer",
                                        "options": ["Nice", "to", "meet", "you", "good", "morning", "friend"],
                                        "correct_answer": "Nice to meet you"
                                    },
                                    {
                                        "type": "match_pairs",
                                        "prompt": "Tap matching pairs",
                                        "prompt_translation": "Match polite words",
                                        "audio_text": None,
                                        "options": {
                                            "left": ["oui", "non", "pardon", "bonne nuit"],
                                            "right": ["yes", "no", "sorry", "good night"]
                                        },
                                        "correct_answer": {
                                            "oui": "yes",
                                            "non": "no",
                                            "pardon": "sorry",
                                            "bonne nuit": "good night"
                                        }
                                    },
                                    {
                                        "type": "fill_in_blank",
                                        "prompt": "Complete the farewell phrase",
                                        "prompt_translation": "See you tomorrow!",
                                        "audio_text": "À demain !",
                                        "options": ["demain", "bientôt", "tard"],
                                        "correct_answer": "demain",
                                        "metadata": {"sentence_prefix": "À", "sentence_suffix": "!"}
                                    },
                                    {
                                        "type": "type_answer",
                                        "prompt": "Write 'Yes' in French",
                                        "prompt_translation": "Type 'oui'",
                                        "audio_text": "Oui",
                                        "options": None,
                                        "correct_answer": "oui"
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        "title": "German",
        "language_code": "de",
        "flag_emoji": "🇩🇪",
        "description": "Master the precise and powerful language of central Europe",
        "learner_count": "16.5M learners",
        "units": [
            {
                "unit_number": 1,
                "title": "Unit 1: Hallo Deutschland",
                "description": "Basic nouns, greetings, and simple statements",
                "color_theme": "#58cc02",
                "skills": [
                    {
                        "title": "Basics 1",
                        "icon_name": "coffee",
                        "order_index": 1,
                        "lessons": [
                            {
                                "title": "Greetings & People",
                                "exercises": [
                                    {
                                        "type": "multiple_choice",
                                        "prompt": "Which of these is 'the bread'?",
                                        "prompt_translation": "Select the German word",
                                        "audio_text": "das Brot",
                                        "options": [
                                            {"text": "das Brot", "translation": "the bread"},
                                            {"text": "das Wasser", "translation": "the water"},
                                            {"text": "der Apfel", "translation": "the apple"}
                                        ],
                                        "correct_answer": "das Brot"
                                    },
                                    {
                                        "type": "word_bank",
                                        "prompt": "Translate this sentence",
                                        "prompt_translation": "Ich bin ein Mann.",
                                        "audio_text": "Ich bin ein Mann",
                                        "options": ["I", "am", "a", "man", "woman", "child", "drinking", "milk"],
                                        "correct_answer": "I am a man"
                                    },
                                    {
                                        "type": "match_pairs",
                                        "prompt": "Tap the matching pairs",
                                        "prompt_translation": "German and English words",
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
                                        "type": "fill_in_blank",
                                        "prompt": "Complete the sentence",
                                        "prompt_translation": "The woman drinks water.",
                                        "audio_text": "Die Frau trinkt Wasser",
                                        "options": ["trinkt", "isst", "bin"],
                                        "correct_answer": "trinkt",
                                        "metadata": {"sentence_prefix": "Die Frau", "sentence_suffix": "Wasser."}
                                    },
                                    {
                                        "type": "type_answer",
                                        "prompt": "Write 'Good morning' in German",
                                        "prompt_translation": "Type 'guten morgen'",
                                        "audio_text": "Guten Morgen",
                                        "options": None,
                                        "correct_answer": "guten morgen"
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        "title": "Italian",
        "language_code": "it",
        "flag_emoji": "🇮🇹",
        "description": "Learn the musical language of Italy's art, culture, and cuisine",
        "learner_count": "9.8M learners",
        "units": [
            {
                "unit_number": 1,
                "title": "Unit 1: Ciao Italia",
                "description": "Essential greetings, ordering espresso, and daily phrases",
                "color_theme": "#58cc02",
                "skills": [
                    {
                        "title": "Basics 1",
                        "icon_name": "coffee",
                        "order_index": 1,
                        "lessons": [
                            {
                                "title": "Introductions",
                                "exercises": [
                                    {
                                        "type": "multiple_choice",
                                        "prompt": "Which of these is 'the apple' in Italian?",
                                        "prompt_translation": "Select the correct word",
                                        "audio_text": "la mela",
                                        "options": [
                                            {"text": "la mela", "translation": "the apple"},
                                            {"text": "il pane", "translation": "the bread"},
                                            {"text": "il ragazzo", "translation": "the boy"}
                                        ],
                                        "correct_answer": "la mela"
                                    },
                                    {
                                        "type": "word_bank",
                                        "prompt": "Translate this sentence",
                                        "prompt_translation": "Io sono una donna.",
                                        "audio_text": "Io sono una donna",
                                        "options": ["I", "am", "a", "woman", "man", "eating", "bread"],
                                        "correct_answer": "I am a woman"
                                    },
                                    {
                                        "type": "match_pairs",
                                        "prompt": "Tap the matching pairs",
                                        "prompt_translation": "Match Italian greetings",
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
                                        "type": "fill_in_blank",
                                        "prompt": "Complete the sentence",
                                        "prompt_translation": "The man drinks water.",
                                        "audio_text": "L'uomo beve acqua",
                                        "options": ["beve", "mangia", "sono"],
                                        "correct_answer": "beve",
                                        "metadata": {"sentence_prefix": "L'uomo", "sentence_suffix": "acqua."}
                                    },
                                    {
                                        "type": "type_answer",
                                        "prompt": "Write 'Good evening' in Italian",
                                        "prompt_translation": "Type 'buonasera'",
                                        "audio_text": "Buonasera",
                                        "options": None,
                                        "correct_answer": "buonasera"
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        "title": "Portuguese",
        "language_code": "pt",
        "flag_emoji": "🇧🇷",
        "description": "Speak with warmth and rhythm across Brazil and Portugal",
        "learner_count": "6.4M learners",
        "units": [
            {
                "unit_number": 1,
                "title": "Unit 1: Primeiros Passos",
                "description": "Everyday greetings, dining basics, and essential verbs",
                "color_theme": "#58cc02",
                "skills": [
                    {
                        "title": "Basics 1",
                        "icon_name": "coffee",
                        "order_index": 1,
                        "lessons": [
                            {
                                "title": "Olá e Café",
                                "exercises": [
                                    {
                                        "type": "multiple_choice",
                                        "prompt": "Which of these is 'the boy' in Portuguese?",
                                        "prompt_translation": "Choose the word",
                                        "audio_text": "o menino",
                                        "options": [
                                            {"text": "o menino", "translation": "the boy"},
                                            {"text": "a menina", "translation": "the girl"},
                                            {"text": "a maçã", "translation": "the apple"}
                                        ],
                                        "correct_answer": "o menino"
                                    },
                                    {
                                        "type": "word_bank",
                                        "prompt": "Translate this sentence",
                                        "prompt_translation": "Eu bebo água.",
                                        "audio_text": "Eu bebo água",
                                        "options": ["I", "drink", "water", "He", "eats", "bread", "milk"],
                                        "correct_answer": "I drink water"
                                    },
                                    {
                                        "type": "match_pairs",
                                        "prompt": "Tap matching pairs",
                                        "prompt_translation": "Match Portuguese greetings",
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
                                        "type": "fill_in_blank",
                                        "prompt": "Complete the sentence",
                                        "prompt_translation": "The man eats bread.",
                                        "audio_text": "O homem come pão",
                                        "options": ["come", "bebe", "sou"],
                                        "correct_answer": "come",
                                        "metadata": {"sentence_prefix": "O homem", "sentence_suffix": "pão."}
                                    },
                                    {
                                        "type": "type_answer",
                                        "prompt": "Write 'Good morning' in Portuguese",
                                        "prompt_translation": "Type 'bom dia'",
                                        "audio_text": "Bom dia",
                                        "options": None,
                                        "correct_answer": "bom dia"
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        "title": "Japanese",
        "language_code": "ja",
        "flag_emoji": "🇯🇵",
        "description": "Unlock anime, manga, culinary wonders, and Japanese culture",
        "learner_count": "18.2M learners",
        "units": [
            {
                "unit_number": 1,
                "title": "Unit 1: Hajimemashite",
                "description": "Learn basic characters, introductions, and everyday politeness",
                "color_theme": "#58cc02",
                "skills": [
                    {
                        "title": "Basics 1",
                        "icon_name": "coffee",
                        "order_index": 1,
                        "lessons": [
                            {
                                "title": "Greetings & Water",
                                "exercises": [
                                    {
                                        "type": "multiple_choice",
                                        "prompt": "Which of these is 'water'?",
                                        "prompt_translation": "Select the correct Japanese word",
                                        "audio_text": "水",
                                        "options": [
                                            {"text": "水 (mizu)", "translation": "water"},
                                            {"text": "お茶 (ocha)", "translation": "tea"},
                                            {"text": "ご飯 (gohan)", "translation": "rice"}
                                        ],
                                        "correct_answer": "水 (mizu)"
                                    },
                                    {
                                        "type": "word_bank",
                                        "prompt": "Translate this sentence",
                                        "prompt_translation": "こんにちは、元気ですか？",
                                        "audio_text": "こんにちは、元気ですか？",
                                        "options": ["Hello", "how", "are", "you", "good", "morning", "water"],
                                        "correct_answer": "Hello how are you"
                                    },
                                    {
                                        "type": "match_pairs",
                                        "prompt": "Match Japanese words to English",
                                        "prompt_translation": "Connect the pairs",
                                        "audio_text": None,
                                        "options": {
                                            "left": ["ありがとう", "さようなら", "はい", "いいえ"],
                                            "right": ["thank you", "goodbye", "yes", "no"]
                                        },
                                        "correct_answer": {
                                            "ありがとう": "thank you",
                                            "さようなら": "goodbye",
                                            "はい": "yes",
                                            "いいえ": "no"
                                        }
                                    },
                                    {
                                        "type": "fill_in_blank",
                                        "prompt": "Complete the polite sentence",
                                        "prompt_translation": "This is water.",
                                        "audio_text": "これは水です",
                                        "options": ["です", "を", "に"],
                                        "correct_answer": "です",
                                        "metadata": {"sentence_prefix": "これは水", "sentence_suffix": "。"}
                                    },
                                    {
                                        "type": "type_answer",
                                        "prompt": "Write 'Hello' in Japanese (or romaji 'konnichiwa')",
                                        "prompt_translation": "Enter 'こんにちは' or 'konnichiwa'",
                                        "audio_text": "こんにちは",
                                        "options": None,
                                        "correct_answer": "konnichiwa"
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        "title": "Hindi",
        "language_code": "hi",
        "flag_emoji": "🇮🇳",
        "description": "Experience Bollywood, vibrant traditions, and Hindi conversation",
        "learner_count": "11.4M learners",
        "units": [
            {
                "unit_number": 1,
                "title": "Unit 1: Shuruat",
                "description": "Essential greetings, everyday nouns, and polite introductions",
                "color_theme": "#58cc02",
                "skills": [
                    {
                        "title": "Basics 1",
                        "icon_name": "coffee",
                        "order_index": 1,
                        "lessons": [
                            {
                                "title": "Namaste & Basics",
                                "exercises": [
                                    {
                                        "type": "multiple_choice",
                                        "prompt": "Which of these is 'water' in Hindi?",
                                        "prompt_translation": "Select the correct word",
                                        "audio_text": "पानी",
                                        "options": [
                                            {"text": "पानी (paani)", "translation": "water"},
                                            {"text": "चाय (chai)", "translation": "tea"},
                                            {"text": "सेब (seb)", "translation": "apple"}
                                        ],
                                        "correct_answer": "पानी (paani)"
                                    },
                                    {
                                        "type": "word_bank",
                                        "prompt": "Translate this sentence",
                                        "prompt_translation": "नमस्ते, आप कैसे हैं?",
                                        "audio_text": "नमस्ते, आप कैसे हैं?",
                                        "options": ["Hello", "how", "are", "you", "good", "water", "tea"],
                                        "correct_answer": "Hello how are you"
                                    },
                                    {
                                        "type": "match_pairs",
                                        "prompt": "Match the words in Hindi and English",
                                        "prompt_translation": "Tap pairs",
                                        "audio_text": None,
                                        "options": {
                                            "left": ["नमस्ते", "धन्यवाद", "अलविदा", "हाँ"],
                                            "right": ["hello", "thank you", "goodbye", "yes"]
                                        },
                                        "correct_answer": {
                                            "नमस्ते": "hello",
                                            "धन्यवाद": "thank you",
                                            "अलविदा": "goodbye",
                                            "हाँ": "yes"
                                        }
                                    },
                                    {
                                        "type": "fill_in_blank",
                                        "prompt": "Complete the sentence",
                                        "prompt_translation": "The boy drinks water.",
                                        "audio_text": "लड़का पानी पीता है",
                                        "options": ["पीता", "खाता", "जाता"],
                                        "correct_answer": "पीता",
                                        "metadata": {"sentence_prefix": "लड़का पानी", "sentence_suffix": "है।"}
                                    },
                                    {
                                        "type": "type_answer",
                                        "prompt": "Write 'Thank you' in Hindi (or 'dhanyavaad')",
                                        "prompt_translation": "Type 'धन्यवाद' or 'dhanyavaad'",
                                        "audio_text": "धन्यवाद",
                                        "options": None,
                                        "correct_answer": "dhanyavaad"
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        "title": "English",
        "language_code": "en",
        "flag_emoji": "🇺🇸",
        "description": "Sharpen English vocabulary, conversation, and global fluency",
        "learner_count": "45.0M learners",
        "units": [
            {
                "unit_number": 1,
                "title": "Unit 1: Foundations",
                "description": "Essential grammar, casual greetings, and common phrases",
                "color_theme": "#58cc02",
                "skills": [
                    {
                        "title": "Basics 1",
                        "icon_name": "coffee",
                        "order_index": 1,
                        "lessons": [
                            {
                                "title": "Greetings & Introductions",
                                "exercises": [
                                    {
                                        "type": "multiple_choice",
                                        "prompt": "Which of these is 'an apple'?",
                                        "prompt_translation": "Select the correct image or term",
                                        "audio_text": "an apple",
                                        "options": [
                                            {"text": "an apple", "translation": "fruit"},
                                            {"text": "a cup of coffee", "translation": "drink"},
                                            {"text": "a slice of bread", "translation": "food"}
                                        ],
                                        "correct_answer": "an apple"
                                    },
                                    {
                                        "type": "word_bank",
                                        "prompt": "Assemble this sentence",
                                        "prompt_translation": "Good morning, my friend.",
                                        "audio_text": "Good morning, my friend.",
                                        "options": ["Good", "morning", "my", "friend", "night", "water", "tea"],
                                        "correct_answer": "Good morning my friend"
                                    },
                                    {
                                        "type": "match_pairs",
                                        "prompt": "Match synonyms",
                                        "prompt_translation": "Tap matching words",
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
                                        "type": "fill_in_blank",
                                        "prompt": "Complete the sentence",
                                        "prompt_translation": "The boy drinks water.",
                                        "audio_text": "The boy drinks water",
                                        "options": ["drinks", "eats", "reads"],
                                        "correct_answer": "drinks",
                                        "metadata": {"sentence_prefix": "The boy", "sentence_suffix": "water."}
                                    },
                                    {
                                        "type": "type_answer",
                                        "prompt": "Write the opposite of 'bad'",
                                        "prompt_translation": "Enter 'good'",
                                        "audio_text": "good",
                                        "options": None,
                                        "correct_answer": "good"
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    }
]

ACHIEVEMENTS_DATA = [
    {"code": "first_lesson", "title": "First Step", "description": "Complete your very first lesson", "badge_icon": "🌱", "category": "learning", "threshold": 1},
    {"code": "streak_3", "title": "On Fire", "description": "Reach a 3-day learning streak", "badge_icon": "🔥", "category": "streak", "threshold": 3},
    {"code": "streak_7", "title": "Unstoppable", "description": "Reach a 7-day learning streak", "badge_icon": "⚡", "category": "streak", "threshold": 7},
    {"code": "xp_100", "title": "Scholar", "description": "Earn 100 total XP points", "badge_icon": "📚", "category": "xp", "threshold": 100},
    {"code": "xp_500", "title": "Sage", "description": "Earn 500 total XP points", "badge_icon": "🧙‍♂️", "category": "xp", "threshold": 500},
    {"code": "perfect_lesson", "title": "Flawless", "description": "Complete a lesson with zero mistakes", "badge_icon": "🎯", "category": "accuracy", "threshold": 1},
    {"code": "first_skill", "title": "Mastery", "description": "Complete all lessons in a skill", "badge_icon": "👑", "category": "completion", "threshold": 1},
    {"code": "weekend_warrior", "title": "Weekend Warrior", "description": "Practice on both Saturday and Sunday", "badge_icon": "🛡️", "category": "streak", "threshold": 2},
    {"code": "polyglot", "title": "Polyglot", "description": "Practice in 2 or more different language courses", "badge_icon": "🌍", "category": "learning", "threshold": 2}
]

LEADERBOARD_USERS = [
    {"username": "Sophia_L", "xp": 480, "avatar_url": "https://api.dicebear.com/7.x/bottts/svg?seed=Sophia"},
    {"username": "Marco_V", "xp": 410, "avatar_url": "https://api.dicebear.com/7.x/bottts/svg?seed=Marco"},
    {"username": "Elena_R", "xp": 360, "avatar_url": "https://api.dicebear.com/7.x/bottts/svg?seed=Elena"},
    {"username": "Kenji_T", "xp": 310, "avatar_url": "https://api.dicebear.com/7.x/bottts/svg?seed=Kenji"},
    {"username": "Amara_K", "xp": 260, "avatar_url": "https://api.dicebear.com/7.x/bottts/svg?seed=Amara"},
    {"username": "Liam_O", "xp": 210, "avatar_url": "https://api.dicebear.com/7.x/bottts/svg?seed=Liam"},
    {"username": "Priya_S", "xp": 170, "avatar_url": "https://api.dicebear.com/7.x/bottts/svg?seed=Priya"},
    {"username": "Chloe_M", "xp": 120, "avatar_url": "https://api.dicebear.com/7.x/bottts/svg?seed=Chloe"},
    {"username": "Lukas_B", "xp": 80, "avatar_url": "https://api.dicebear.com/7.x/bottts/svg?seed=Lukas"},
    {"username": "Mateo_D", "xp": 40, "avatar_url": "https://api.dicebear.com/7.x/bottts/svg?seed=Mateo"},
]

def seed_database(db: Session, force_reset: bool = False):
    """
    Seeds all 8 language courses, units, skills, exercises,
    achievements, leaderboard competitors, and default user Alex.
    """
    if force_reset:
        print("Cleaning up existing curriculum for fresh seeding...")
        Base.metadata.drop_all(bind=engine)
        Base.metadata.create_all(bind=engine)

    # Check if courses are already populated
    existing_courses_count = db.query(Course).count()
    if existing_courses_count >= 8:
        print("All 8 courses already exist in database. Skipping seed.")
        return

    print("Seeding all 8 language courses, curriculum, achievements, and leaderboard...")

    # 1. Create Achievements
    for ach in ACHIEVEMENTS_DATA:
        existing = db.query(Achievement).filter(Achievement.code == ach["code"]).first()
        if not existing:
            db.add(Achievement(
                code=ach["code"],
                title=ach["title"],
                description=ach["description"],
                badge_icon=ach["badge_icon"],
                category=ach["category"],
                threshold=ach["threshold"]
            ))
    db.flush()

    # 2. Create Courses and Curriculum
    first_course_id = None
    all_first_skills = []

    for c_data in COURSES_DATA:
        existing_course = db.query(Course).filter(Course.language_code == c_data["language_code"]).first()
        if not existing_course:
            course = Course(
                title=c_data["title"],
                language_code=c_data["language_code"],
                flag_emoji=c_data["flag_emoji"],
                description=c_data["description"],
                learner_count=c_data.get("learner_count", "10.0M learners")
            )
            db.add(course)
            db.flush()
        else:
            course = existing_course

        if not first_course_id:
            first_course_id = course.id

        is_first_skill_for_course = True
        for u_data in c_data["units"]:
            unit = db.query(Unit).filter(Unit.course_id == course.id, Unit.unit_number == u_data["unit_number"]).first()
            if not unit:
                unit = Unit(
                    course_id=course.id,
                    unit_number=u_data["unit_number"],
                    title=u_data["title"],
                    description=u_data["description"],
                    color_theme=u_data["color_theme"]
                )
                db.add(unit)
                db.flush()

            for s_data in u_data["skills"]:
                skill = db.query(Skill).filter(Skill.unit_id == unit.id, Skill.title == s_data["title"]).first()
                if not skill:
                    skill = Skill(
                        unit_id=unit.id,
                        order_index=s_data["order_index"],
                        title=s_data["title"],
                        icon_name=s_data["icon_name"],
                        total_lessons=len(s_data["lessons"])
                    )
                    db.add(skill)
                    db.flush()

                if is_first_skill_for_course:
                    all_first_skills.append(skill.id)
                    is_first_skill_for_course = False

                for l_idx, l_data in enumerate(s_data["lessons"], 1):
                    lesson = db.query(Lesson).filter(Lesson.skill_id == skill.id, Lesson.order_index == l_idx).first()
                    if not lesson:
                        lesson = Lesson(
                            skill_id=skill.id,
                            order_index=l_idx,
                            title=l_data["title"],
                            xp_reward=10
                        )
                        db.add(lesson)
                        db.flush()

                    for ex_idx, ex_data in enumerate(l_data["exercises"], 1):
                        ex = db.query(Exercise).filter(Exercise.lesson_id == lesson.id, Exercise.order_index == ex_idx).first()
                        if not ex:
                            options_json = json.dumps(ex_data["options"]) if ex_data.get("options") is not None else None
                            correct_ans = json.dumps(ex_data["correct_answer"]) if isinstance(ex_data["correct_answer"], dict) else str(ex_data["correct_answer"])
                            metadata_json = json.dumps(ex_data["metadata"]) if ex_data.get("metadata") else None

                            exercise = Exercise(
                                lesson_id=lesson.id,
                                order_index=ex_idx,
                                type=ex_data["type"],
                                prompt=ex_data["prompt"],
                                prompt_translation=ex_data.get("prompt_translation"),
                                audio_text=ex_data.get("audio_text"),
                                options_json=options_json,
                                correct_answer=correct_ans,
                                metadata_json=metadata_json
                            )
                            db.add(exercise)
                    db.flush()

    # 3. Create Leaderboard Users
    for u_info in LEADERBOARD_USERS:
        existing = db.query(User).filter(User.username == u_info["username"]).first()
        if not existing:
            competitor = User(
                username=u_info["username"],
                email=f"{u_info['username'].lower()}@duo-clone.internal",
                password_hash=hash_pw("password123"),
                avatar_url=u_info["avatar_url"],
                hearts=5,
                gems=400,
                total_xp=u_info["xp"],
                daily_xp=30,
                streak=random_int(1, 14),
                current_course_id=first_course_id,
                onboarding_completed=True
            )
            db.add(competitor)
    db.flush()

    # 4. Create Demo User 'Alex' if not exists
    alex = db.query(User).filter(User.username == "Alex").first()
    if not alex:
        alex = User(
            username="Alex",
            email="alex@duolingo.clone",
            password_hash=hash_pw("password123"),
            avatar_url="https://api.dicebear.com/7.x/bottts/svg?seed=Alex",
            hearts=5,
            max_hearts=5,
            gems=520,
            total_xp=150,
            daily_xp=20,
            daily_goal=20,
            streak=2,
            current_course_id=first_course_id,
            onboarding_completed=True
        )
        db.add(alex)
        db.flush()

    # Unlock first skill for each course for Alex
    for skill_id in all_first_skills:
        prog = db.query(UserProgress).filter(UserProgress.user_id == alex.id, UserProgress.skill_id == skill_id).first()
        if not prog:
            db.add(UserProgress(
                user_id=alex.id,
                skill_id=skill_id,
                lessons_completed=0,
                is_unlocked=True,
                is_completed=False
            ))

    # Give Alex initial achievements
    first_ach = db.query(Achievement).filter(Achievement.code == "first_lesson").first()
    if first_ach:
        user_ach = db.query(UserAchievement).filter(UserAchievement.user_id == alex.id, UserAchievement.achievement_id == first_ach.id).first()
        if not user_ach:
            db.add(UserAchievement(
                user_id=alex.id,
                achievement_id=first_ach.id,
                unlocked_at=datetime.now(timezone.utc)
            ))

    db.commit()
    print("Database seeding completed successfully for all 8 courses!")

def random_int(a: int, b: int) -> int:
    import random
    return random.randint(a, b)

if __name__ == "__main__":
    db = SessionLocal()
    try:
        seed_database(db, force_reset=True)
    finally:
        db.close()

import json
import pytest
from app.models import Exercise, Lesson
from app.services.lesson_service import (
    validate_exercise_answer,
    calculate_lesson_xp,
    normalize_text
)

def test_normalize_text():
    assert normalize_text("  ¡Hola!  ") == "hola"
    assert normalize_text("Buenos Días...") == "buenos días"
    assert normalize_text("¿Cómo estás?") == "cómo estás"

def test_validate_multiple_choice():
    ex = Exercise(
        id=1,
        type="multiple_choice",
        prompt="Which of these is 'the boy'?",
        correct_answer="el niño"
    )
    # Correct answer
    is_correct, ans, _ = validate_exercise_answer(ex, "el niño")
    assert is_correct is True
    # Case insensitive with punctuation tolerance
    is_correct, ans, _ = validate_exercise_answer(ex, "El Niño!")
    assert is_correct is True
    # Incorrect answer
    is_correct, ans, _ = validate_exercise_answer(ex, "la niña")
    assert is_correct is False

def test_validate_word_bank():
    ex = Exercise(
        id=2,
        type="word_bank",
        prompt="Translate this sentence",
        correct_answer="I eat an apple"
    )
    # Given as list of tokens
    is_correct, ans, _ = validate_exercise_answer(ex, ["I", "eat", "an", "apple"])
    assert is_correct is True
    # Given as string
    is_correct, ans, _ = validate_exercise_answer(ex, "I eat an apple")
    assert is_correct is True
    # Wrong tokens
    is_correct, ans, _ = validate_exercise_answer(ex, ["She", "drinks", "water"])
    assert is_correct is False

def test_validate_match_pairs():
    pairs = {"hola": "hello", "gracias": "thanks"}
    ex = Exercise(
        id=3,
        type="match_pairs",
        prompt="Tap the matching pairs",
        correct_answer=json.dumps(pairs)
    )
    # Matching dict
    is_correct, ans, _ = validate_exercise_answer(ex, {"hola": "hello", "gracias": "thanks"})
    assert is_correct is True
    # Partial or mismatched
    is_correct, ans, _ = validate_exercise_answer(ex, {"hola": "thanks", "gracias": "hello"})
    assert is_correct is False

def test_validate_fill_in_blank():
    ex = Exercise(
        id=4,
        type="fill_in_blank",
        prompt="La mujer ___ agua",
        correct_answer="bebe"
    )
    is_correct, ans, _ = validate_exercise_answer(ex, "bebe")
    assert is_correct is True
    is_correct, ans, _ = validate_exercise_answer(ex, "comes")
    assert is_correct is False

def test_validate_type_answer():
    ex = Exercise(
        id=5,
        type="type_answer",
        prompt="Type 'Good morning' in Spanish",
        correct_answer="buenos días"
    )
    is_correct, ans, _ = validate_exercise_answer(ex, "buenos días")
    assert is_correct is True
    # Case & exclamation marks
    is_correct, ans, _ = validate_exercise_answer(ex, "¡Buenos Días!")
    assert is_correct is True
    is_correct, ans, _ = validate_exercise_answer(ex, "buenas noches")
    assert is_correct is False

def test_calculate_lesson_xp():
    lesson = Lesson(id=1, xp_reward=10)
    # Perfect score: base 10 + 5 bonus
    assert calculate_lesson_xp(lesson, mistakes_count=0) == 15
    # 1 mistake: base 10 + 2 bonus
    assert calculate_lesson_xp(lesson, mistakes_count=1) == 12
    # 3 mistakes: base 10
    assert calculate_lesson_xp(lesson, mistakes_count=3) == 10

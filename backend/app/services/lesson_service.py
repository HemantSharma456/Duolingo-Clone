import json
import re
from typing import Tuple, Any, Optional
from sqlalchemy.orm import Session
from app.models import Exercise, Lesson, User

def normalize_text(text: str) -> str:
    """Normalize string by trimming, lowercasing, and stripping punctuation for fair comparisons."""
    if not text:
        return ""
    # Remove leading/trailing spaces and lower-case
    normalized = text.strip().lower()
    # Strip common sentence punctuation: .,!?:;¿¡
    normalized = re.sub(r"[.,!?:;¿¡]+", "", normalized)
    # Collapse multiple spaces into one
    normalized = re.sub(r"\s+", " ", normalized).strip()
    return normalized

def validate_exercise_answer(exercise: Exercise, user_answer: Any) -> Tuple[bool, Any, Optional[str]]:
    """
    Validates user submitted answer against correct answer stored in database.
    Supports all 5 exercise types:
      - multiple_choice
      - word_bank (translate)
      - match_pairs
      - fill_in_blank
      - type_answer
    """
    ex_type = exercise.type
    raw_correct = exercise.correct_answer

    # Parse JSON if correct_answer is serialized JSON
    try:
        parsed_correct = json.loads(raw_correct)
    except (json.JSONDecodeError, TypeError):
        parsed_correct = raw_correct

    # 1. Multiple Choice
    if ex_type == "multiple_choice":
        target = str(parsed_correct).strip()
        actual = str(user_answer).strip()
        is_correct = (normalize_text(actual) == normalize_text(target))
        return is_correct, target, None

    # 2. Word Bank (Translate tap-the-words)
    elif ex_type == "word_bank":
        # user_answer can be a list of tokens ['yo', 'como', 'pan'] or a single string
        if isinstance(user_answer, list):
            actual_str = " ".join([str(t).strip() for t in user_answer if str(t).strip()])
        else:
            actual_str = str(user_answer).strip()
        
        target_str = str(parsed_correct).strip()
        is_correct = (normalize_text(actual_str) == normalize_text(target_str))
        return is_correct, target_str, None

    # 3. Match Pairs
    elif ex_type == "match_pairs":
        # parsed_correct is expected to be a dict of pairs: {"hola": "hello", "gracias": "thanks"}
        # user_answer is expected to be a dict or list of [source, target] pairs
        if not isinstance(parsed_correct, dict):
            try:
                parsed_correct = json.loads(parsed_correct)
            except Exception:
                pass
        
        if isinstance(user_answer, dict):
            # Verify each key-value pair matches
            all_correct = True
            for k, v in user_answer.items():
                norm_k = normalize_text(str(k))
                norm_v = normalize_text(str(v))
                # Check both direct or inverted pairing
                expected_v = normalize_text(str(parsed_correct.get(k, parsed_correct.get(norm_k, ""))))
                if not (expected_v == norm_v or normalize_text(str(parsed_correct.get(v, ""))) == norm_k):
                    all_correct = False
                    break
            is_correct = all_correct and len(user_answer) >= len(parsed_correct)
            return is_correct, parsed_correct, None
        
        return False, parsed_correct, "Invalid answer format for match pairs"

    # 4. Fill in the Blank
    elif ex_type == "fill_in_blank":
        target = str(parsed_correct).strip()
        actual = str(user_answer).strip()
        is_correct = (normalize_text(actual) == normalize_text(target))
        return is_correct, target, None

    # 5. Type the Answer
    elif ex_type == "type_answer":
        target = str(parsed_correct).strip()
        actual = str(user_answer).strip()
        norm_actual = normalize_text(actual)
        norm_target = normalize_text(target)

        # 1. Direct match with target
        is_correct = (norm_actual == norm_target)

        # 2. Match with audio_text (e.g. 'धन्यवाद' when target is 'dhanyavaad')
        if not is_correct and exercise.audio_text:
            if norm_actual == normalize_text(exercise.audio_text):
                is_correct = True

        # 3. Match Hindi transliterations
        if not is_correct and "dhanyavaad" in norm_target:
            if norm_actual in ["dhanyavad", "dhanyavaad", "danyavad", "danyavaad", "धन्यवाद"]:
                is_correct = True

        # 4. Match any quoted words in prompt or prompt_translation
        if not is_correct:
            full_text = f"{exercise.prompt or ''} {exercise.prompt_translation or ''}"
            quoted_matches = re.findall(r"['\"]([^'\"]+)['\"]", full_text)
            for q in quoted_matches:
                if norm_actual == normalize_text(q):
                    is_correct = True
                    break

        return is_correct, target, None

    # Default fallback
    is_correct = (str(user_answer).strip() == str(parsed_correct).strip())
    return is_correct, str(parsed_correct), None


def process_exercise_submission(
    db: Session, user: User, exercise_id: int, user_answer: Any
) -> Tuple[bool, Any, Optional[str], int]:
    """
    Evaluates exercise, deducts heart if incorrect, commits user state, returns result.
    Supports both database-backed exercises and progressive calibrated curriculum exercises.
    """
    exercise = db.query(Exercise).filter(Exercise.id == exercise_id).first()
    if not exercise:
        from app.services.curriculum_service import find_exercise_by_id
        curriculum_ex = find_exercise_by_id(exercise_id)
        if curriculum_ex:
            class VirtualExercise:
                type = curriculum_ex["type"]
                correct_answer = (
                    json.dumps(curriculum_ex["correct_answer"])
                    if isinstance(curriculum_ex["correct_answer"], (dict, list))
                    else str(curriculum_ex["correct_answer"])
                )
                audio_text = curriculum_ex.get("audio_text")
                prompt = curriculum_ex.get("prompt")
                prompt_translation = curriculum_ex.get("prompt_translation")
            exercise = VirtualExercise()
        else:
            raise ValueError(f"Exercise with id {exercise_id} not found")

    is_correct, correct_display, explanation = validate_exercise_answer(exercise, user_answer)

    if not is_correct:
        # Deduct 1 heart, minimum 0
        user.hearts = max(0, user.hearts - 1)
        db.commit()
        db.refresh(user)

    return is_correct, correct_display, explanation, user.hearts


def calculate_lesson_xp(lesson: Lesson, mistakes_count: int) -> int:
    """
    Calculates XP earned for lesson:
    Base XP (usually 10) + accuracy combo bonus (+5 for 0 mistakes, +2 for <= 2 mistakes).
    """
    base_xp = lesson.xp_reward or 10
    if mistakes_count == 0:
        return base_xp + 5  # Perfect lesson bonus
    elif mistakes_count <= 2:
        return base_xp + 2  # Great job bonus
    return base_xp

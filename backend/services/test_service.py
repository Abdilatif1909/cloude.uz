from __future__ import annotations

from typing import Iterable

from apps.assessments.models import Question, Result


def calculate_result_score(questions: Iterable[Question], answers: dict[int, str]) -> int:
    score = 0
    for question in questions:
        if answers.get(question.id) == question.correct_answer:
            score += 1
    return score


def build_answer_payload(questions: Iterable[Question], answers: dict[int, str]) -> list[dict]:
    payload = []
    for index, question in enumerate(questions, start=1):
        selected_answer = answers.get(question.id)
        payload.append(
            {
                "question_id": question.id,
                "question_number": index,
                "question": question.question,
                "options": {
                    "A": question.option_a,
                    "B": question.option_b,
                    "C": question.option_c,
                    "D": question.option_d,
                },
                "selected_answer": selected_answer,
                "correct_answer": question.correct_answer,
                "is_correct": selected_answer == question.correct_answer,
            }
        )
    return payload


def create_result(student, test, questions: list[Question], answers: dict[int, str], *, time_spent_seconds: int = 0) -> Result:
    score = calculate_result_score(questions, answers)
    answer_payload = build_answer_payload(questions, answers)
    return Result.objects.create(
        student=student,
        test=test,
        score=score,
        total_questions=len(questions),
        answered_count=len(answers),
        time_spent_seconds=max(time_spent_seconds, 0),
        answer_payload=answer_payload,
    )

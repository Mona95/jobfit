import os
import json
from groq import Groq
from dotenv import load_dotenv
from app.services.prompts import (
    ANALYSIS_SYSTEM_PROMPT,
    ANALYSIS_USER_PROMPT,
    TAILORING_PROMPT,
    COVER_LETTER_PROMPT,
    INTERVIEW_PREP_PROMPT
)

load_dotenv()

def get_groq_client() -> Groq:
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        raise ValueError("GROQ_API_KEY not set")
    return Groq(api_key=api_key)

def parse_json_response(raw_text: str) -> dict:
    """
    Safely parse JSON from Groq response.
    Strips markdown fences if present.
    """
    raw_text = raw_text.strip()

    if raw_text.startswith("```"):
        raw_text = raw_text.split("\n", 1)[1]
        raw_text = raw_text.rsplit("```", 1)[0].strip()

    return json.loads(raw_text)

def analyze_cv_against_job(
    cv_sections: list[str],
    job_description: str
) -> dict:
    """
    Analyze how well a CV matches a job description.
    Returns structured feedback with scores and recommendations.
    """
    client = get_groq_client()

    # Join CV chunks into readable text
    cv_text = "\n\n---\n\n".join(cv_sections)

    user_prompt = ANALYSIS_USER_PROMPT.format(
        job_description=job_description,
        cv_sections=cv_text
    )

    response = client.chat.completions.create(
        model="openai/gpt-oss-120b",
        messages=[
            {"role": "system", "content": ANALYSIS_SYSTEM_PROMPT},
            {"role": "user", "content": user_prompt}
        ],
        max_tokens=2048,
        temperature=0.1
    )

    raw_text = response.choices[0].message.content
    return parse_json_response(raw_text)

def tailor_cv(
    cv_sections: list[str],
    job_description: str
) -> dict:
    """
    Rewrite CV sections to better match the job description.
    """
    client = get_groq_client()
    cv_text = "\n\n---\n\n".join(cv_sections)

    prompt = TAILORING_PROMPT.format(
        job_description=job_description,
        cv_sections=cv_text
    )

    response = client.chat.completions.create(
        model="openai/gpt-oss-120b",
        messages=[
            {"role": "user", "content": prompt}
        ],
        max_tokens=3000,
        temperature=0.3
    )

    raw_text = response.choices[0].message.content
    return parse_json_response(raw_text)

def generate_cover_letter(
    cv_sections: list[str],
    job_description: str,
    company_name: str,
    role_title: str,
    tone: str = "professional"
) -> dict:
    """
    Generate a personalized cover letter.
    """
    client = get_groq_client()
    cv_text = "\n\n---\n\n".join(cv_sections)

    prompt = COVER_LETTER_PROMPT.format(
        job_description=job_description,
        cv_sections=cv_text,
        company_name=company_name,
        role_title=role_title,
        tone=tone
    )

    response = client.chat.completions.create(
        model="openai/gpt-oss-120b",
        messages=[
            {"role": "user", "content": prompt}
        ],
        max_tokens=2000,
        temperature=0.4
    )

    raw_text = response.choices[0].message.content
    return parse_json_response(raw_text)

def generate_interview_prep(
    cv_sections: list[str],
    job_description: str
) -> dict:
    """
    Generate interview questions and suggested answers.
    """
    client = get_groq_client()
    cv_text = "\n\n---\n\n".join(cv_sections)

    prompt = INTERVIEW_PREP_PROMPT.format(
        job_description=job_description,
        cv_sections=cv_text
    )

    response = client.chat.completions.create(
        model="openai/gpt-oss-120b",
        messages=[
            {"role": "user", "content": prompt}
        ],
        max_tokens=3000,
        temperature=0.3
    )

    raw_text = response.choices[0].message.content
    return parse_json_response(raw_text)
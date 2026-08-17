"""Static profile for Divy Makwana — public source of truth."""

from app.config import settings

_PROFILE = {
    "name": "Divy Makwana",
    "role": "MCA Student · Full-stack & AI/ML Developer",
    "title": "Full-stack & AI/ML Developer",
    "tagline": "Building full-stack apps and AI/ML dashboards that turn data into clear decisions",
    "location": "Ahmedabad, Gujarat, India",
    "status": "Open to internships / opportunities",
    "email": "divymakwana375@gmail.com",
    "resume_drive_url": settings.resume_uri,
    "resume_pdf": "/DivyMakwana.pdf",
    "socials": {
        "github": "https://github.com/divy1105",
        "linkedin": "https://www.linkedin.com/in/divy-makwana-89863227a/",
        "leetcode": None,
        "geeksforgeeks": None,
    },
    "about": [
        "I'm Divy Makwana, an MCA student at GLS University with a BCA background from Lokmanya College of Computer Application. I care about shipping practical software — not just demos — across Python, FastAPI/Flask, React, and .NET.",
        "I build full-stack products and ML-backed tools: career matching (CareerLens), AI task extraction from meeting notes, event management systems, and crime-forecast dashboards with maps and live analytics. I like clean UIs, solid APIs, and models that are actually usable.",
        "I'm currently a Data Science Trainee at QSpiders Ahmedabad and looking for internships or entry-level roles where I can contribute to product engineering and applied ML.",
    ],
    "facts": [
        {"label": "Current", "value": "Data Science Trainee"},
        {"label": "Based in", "value": "Ahmedabad, IN"},
        {"label": "Highlight", "value": "CareerLens"},
    ],
    "education": [
        {
            "degree": "MCA",
            "institution": "GLS University",
            "start": "2024",
            "end": "2026",
            "score": "CGPA 7.66",
        },
        {
            "degree": "BCA",
            "institution": "Lokmanya College of Computer Application",
            "start": "2021",
            "end": "2024",
            "score": "CGPA 7.63",
        },
    ],
    "achievements": [
        "3rd place — CTF @ GLS",
        "Build with Gemma: Ahmedabad (limited-seat workshop)",
        "SIH 2025 participant",
        "Odoo × Parul University 2025",
        "Cursor Ahmedabad Hackathon",
        "ISRO Bharatiya Antariksh Hackathon",
        "EY Techathon 6.0",
        "Gen AI Exchange 2025",
    ],
    "experience": [
        {
            "role": "Data Science Trainee",
            "company": "QSpiders Ahmedabad",
            "location": "Ahmedabad",
            "start": "December 2025",
            "end": "Present",
            "current": True,
            "highlights": [
                "Practiced end-to-end data workflows: cleaning, EDA, and model evaluation on real training datasets",
                "Built Python analysis and visualization pipelines using pandas and related ML tooling",
                "Applied supervised ML concepts (feature prep, train/test split, metrics) to structured prediction problems",
            ],
        }
    ],
    "skills": {
        "Languages": ["Python", "JavaScript / TypeScript", "C# / .NET", "HTML / CSS"],
        "Backend / APIs": ["FastAPI", "Flask", "Hono", "ASP.NET", "EF Core"],
        "Frontend": [
            "React",
            "React Native",
            "Vite",
            "Tailwind CSS",
            "Ant Design",
            "TanStack Router / Query",
            "Framer Motion",
            "Chart.js",
            "Leaflet",
        ],
        "Databases": ["SQLite", "PostgreSQL (Neon)", "MySQL", "MongoDB"],
        "Data / ML / AI": ["pandas", "scikit-learn", "LightGBM", "Groq API", "Google Gemini"],
        "Concepts": ["Machine Learning", "DBMS", "OOP", "REST APIs"],
    },
    "contact_invite": "Have an opportunity or project? My inbox is open.",
}


from fastapi import APIRouter

router = APIRouter(prefix="/api/profile", tags=["profile"])


@router.get("/")
async def get_profile():
    return {**_PROFILE, "resume_drive_url": settings.resume_uri}

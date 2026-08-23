CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE resumes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    filename VARCHAR(255) NOT NULL,
    file_path VARCHAR(512) NOT NULL,
    file_hash VARCHAR(64) UNIQUE,
    raw_text TEXT,
    parsed_json JSONB,
    parse_status VARCHAR(20) DEFAULT 'pending',
    upload_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_resumes_file_hash ON resumes(file_hash);

CREATE TABLE candidates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    resume_id UUID NOT NULL UNIQUE REFERENCES resumes(id) ON DELETE CASCADE,
    name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    summary TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_candidates_email ON candidates(email);

CREATE TABLE skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id UUID NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
    skill_name VARCHAR(100) NOT NULL,
    proficiency VARCHAR(20),
    years_exp NUMERIC(4, 1)
);

CREATE INDEX idx_skills_candidate_id ON skills(candidate_id);

CREATE TABLE experiences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id UUID NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
    company VARCHAR(255),
    role VARCHAR(255),
    start_date VARCHAR(20),
    end_date VARCHAR(20),
    description TEXT
);

CREATE INDEX idx_experiences_candidate_id ON experiences(candidate_id);

CREATE TABLE educations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id UUID NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
    institution VARCHAR(255),
    degree VARCHAR(100),
    field VARCHAR(100),
    graduation_year INT
);

CREATE INDEX idx_educations_candidate_id ON educations(candidate_id);

CREATE TABLE job_descriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    raw_text TEXT NOT NULL,
    required_skills JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE match_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id UUID NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
    job_id UUID NOT NULL REFERENCES job_descriptions(id) ON DELETE CASCADE,
    score INT NOT NULL,
    justification TEXT,
    matching_skills JSONB,
    missing_skills JSONB,
    strengths JSONB,
    concerns JSONB,
    shortlisted BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_match_results_candidate_id ON match_results(candidate_id);
CREATE INDEX idx_match_results_job_id ON match_results(job_id);

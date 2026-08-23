INSERT INTO resumes (id, filename, file_path, raw_text, parsed_json, parse_status)
VALUES (
    gen_random_uuid(),
    'alice_smith_frontend.pdf',
    '/app/uploads/dummy_alice.pdf',
    'Alice Smith. Frontend Engineer. Skills: React, TypeScript, Tailwind, CSS, HTML. 5 years of experience.',
    '{
      "name": "Alice Smith",
      "email": "alice@example.com",
      "phone": "555-0101",
      "summary": "Expert Frontend Engineer with a passion for design systems.",
      "skills": [
        { "skillName": "React", "proficiency": "Expert", "yearsExp": 5 },
        { "skillName": "TypeScript", "proficiency": "Advanced", "yearsExp": 4 },
        { "skillName": "Tailwind CSS", "proficiency": "Expert", "yearsExp": 3 },
        { "skillName": "Figma", "proficiency": "Intermediate", "yearsExp": 2 }
      ],
      "experiences": [],
      "educations": []
    }'::jsonb,
    'completed'
),
(
    gen_random_uuid(),
    'bob_jones_backend.pdf',
    '/app/uploads/dummy_bob.pdf',
    'Bob Jones. Backend Developer. Skills: Java, Spring Boot, PostgreSQL, Docker, AWS.',
    '{
      "name": "Bob Jones",
      "email": "bob@example.com",
      "phone": "555-0202",
      "summary": "Senior Java Developer specializing in distributed systems.",
      "skills": [
        { "skillName": "Java", "proficiency": "Expert", "yearsExp": 7 },
        { "skillName": "Spring Boot", "proficiency": "Expert", "yearsExp": 5 },
        { "skillName": "PostgreSQL", "proficiency": "Advanced", "yearsExp": 6 },
        { "skillName": "AWS", "proficiency": "Intermediate", "yearsExp": 3 }
      ],
      "experiences": [],
      "educations": []
    }'::jsonb,
    'completed'
);

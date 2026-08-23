$jobs = @(
    @{
        title = "Staff Machine Learning Engineer"
        rawText = "We are seeking a Staff Machine Learning Engineer to lead the development of our LLM infrastructure. Requirements: 7+ years of industry experience. Deep expertise in PyTorch, Python, and C++. Experience with model quantization (GGUF, AWQ), fine-tuning (LoRA), and deployment at scale (vLLM, TensorRT-LLM). You must have a strong publication record or significant open-source contributions to AI repositories. Bonus points for experience with RAG architectures and vector databases like Pinecone or Milvus."
    },
    @{
        title = "VP of Engineering"
        rawText = "Looking for an experienced VP of Engineering to scale our global tech organization from 50 to 200+ engineers. Must have 10+ years of engineering leadership experience in hyper-growth SaaS companies. Strong background in organizational design, agile transformations, and managing directors/managers. You should still be technically proficient enough to engage in architecture discussions involving microservices, Kubernetes, and event-driven architectures. You will report directly to the CEO."
    },
    @{
        title = "Product Designer (UI/UX)"
        rawText = "We need a wildly creative Product Designer to own the end-to-end user experience of our flagship web application. Must be an expert in Figma, prototyping, and design systems. We value designers who can think in systems and aren't afraid of complex, data-heavy interfaces. Experience with CSS/Tailwind is a huge plus, as you will work closely with frontend engineers to ensure pixel-perfect implementation. 3-5 years of experience in B2B SaaS preferred."
    }
)

foreach ($job in $jobs) {
    $body = $job | ConvertTo-Json
    Invoke-RestMethod -Method Post -Uri "http://localhost:8000/api/jobs" -ContentType "application/json" -Body $body
    Write-Host "Created job: $($job.title)"
}

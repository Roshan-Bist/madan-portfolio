import { ExternalLink, Github } from 'lucide-react';

const projects = [
  {
    title: 'Distributed Task Queue',
    description:
      'Built a high-performance distributed task queue system handling 10K+ tasks per second using Go and Redis. Implemented priority scheduling, retry logic, and monitoring dashboard.',
    technologies: ['Go', 'Redis', 'Docker', 'Prometheus'],
    githubUrl: 'https://github.com',
    liveUrl: null,
  },
  {
    title: 'E-Commerce API Platform',
    description:
      'Developed a scalable RESTful API for an e-commerce platform serving 1M+ users. Implemented caching strategies, rate limiting, and payment gateway integration.',
    technologies: ['Node.js', 'PostgreSQL', 'Redis', 'AWS'],
    githubUrl: 'https://github.com',
    liveUrl: 'https://example.com',
  },
  {
    title: 'Real-Time Analytics Engine',
    description:
      'Created a real-time analytics pipeline processing streaming data using Kafka and Spark. Built aggregation services and REST APIs for dashboard consumption.',
    technologies: ['Python', 'Apache Kafka', 'Spark', 'MongoDB'],
    githubUrl: 'https://github.com',
    liveUrl: null,
  },
  {
    title: 'Microservices Authentication System',
    description:
      'Designed and implemented a centralized authentication and authorization service using JWT and OAuth2. Includes multi-factor authentication and session management.',
    technologies: ['Java', 'Spring Boot', 'PostgreSQL', 'Kubernetes'],
    githubUrl: 'https://github.com',
    liveUrl: null,
  },
];

export function Projects() {
  return (
    <section id="projects" className="px-6 py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl mb-12">Projects</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {projects.map((project) => (
            <div
              key={project.title}
              className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <h3 className="text-2xl">{project.title}</h3>
                  <div className="flex gap-2">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 hover:bg-gray-100 rounded transition-colors"
                        aria-label="View on GitHub"
                      >
                        <Github className="w-5 h-5" />
                      </a>
                    )}
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 hover:bg-gray-100 rounded transition-colors"
                        aria-label="View live project"
                      >
                        <ExternalLink className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                </div>
                <p className="text-gray-700">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

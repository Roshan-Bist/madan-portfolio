const skillCategories = [
  {
    title: 'Languages',
    skills: ['Python', 'Java', 'Go', 'JavaScript/TypeScript', 'SQL', 'Rust'],
  },
  {
    title: 'Frameworks & Tools',
    skills: ['Node.js', 'Django', 'Spring Boot', 'Express.js', 'FastAPI', 'gRPC'],
  },
  {
    title: 'Databases',
    skills: ['PostgreSQL', 'MongoDB', 'Redis', 'MySQL', 'Elasticsearch', 'DynamoDB'],
  },
  {
    title: 'DevOps & Cloud',
    skills: ['Docker', 'Kubernetes', 'AWS', 'Google Cloud', 'CI/CD', 'Terraform'],
  },
  {
    title: 'Architecture & Practices',
    skills: ['Microservices', 'REST APIs', 'GraphQL', 'Message Queues', 'TDD', 'System Design'],
  },
];

export function Skills() {
  return (
    <section id="skills" className="px-6 py-20">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl mb-12">Skills & Technologies</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skillCategories.map((category) => (
            <div key={category.title} className="space-y-4">
              <h3 className="text-xl font-semibold">{category.title}</h3>
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

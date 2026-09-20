export function About() {
  return (
    <section id="about" className="px-6 py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-5xl mb-8">About Me</h2>
        <div className="space-y-4 text-2xl text-gray-700">
          <p>
            I'm a backend engineer with a passion for building efficient, scalable systems
            that handle complex business logic and high traffic loads. With expertise in
            distributed systems, API design, and database optimization, I create solutions
            that are both performant and maintainable.
          </p>
          <p>
            My approach focuses on clean architecture, test-driven development, and
            implementing best practices for security and reliability. I thrive in
            collaborative environments where I can contribute to system design decisions
            and mentor other developers.
          </p>
        </div>
      </div>
    </section>
  );
}

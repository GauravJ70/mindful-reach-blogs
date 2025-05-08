
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const AboutPage = () => {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold mb-6">About MindfulReach</h1>
      
      <section className="mb-10">
        <div className="aspect-video rounded-lg overflow-hidden mb-8">
          <video 
            className="w-full h-full object-cover" 
            controls 
            poster="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200"
            aria-label="Video showcasing our commitment to accessibility"
          >
            <source src="https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4" />
            <track 
              kind="captions" 
              src="/captions/about-video.vtt" 
              srcLang="en" 
              label="English" 
              default 
            />
            Your browser does not support the video tag.
          </video>
          <p className="text-sm text-muted-foreground mt-2">
            Captions available - use the CC button in the video player. A full transcript is available below the video.
          </p>
        </div>

        <details className="mb-6">
          <summary className="cursor-pointer font-semibold text-primary hover:underline">
            View Video Transcript
          </summary>
          <div className="mt-3 p-4 bg-muted rounded-md text-sm">
            <p className="mb-2">
              [Narrator] At MindfulReach, we believe that digital content should be accessible to everyone.
            </p>
            <p className="mb-2">
              Our platform is designed with accessibility as a core principle, not an afterthought.
            </p>
            <p>
              Join us in creating a more inclusive digital world where information and knowledge are truly available to all.
            </p>
          </div>
        </details>

        <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
        <div className="prose max-w-none">
          <p className="text-lg">
            MindfulReach is dedicated to creating a truly inclusive digital space where all users, regardless of their abilities, can access, consume, and engage with high-quality content without barriers.
          </p>
          <p>
            We believe that access to information is a fundamental right, and our mission is to demonstrate how technology can bring people together rather than create divisions. By adhering to the highest standards of accessibility and inclusive design, we aim to set an example for the broader web community.
          </p>
        </div>
      </section>

      {/* New Impact Statistics Section */}
      <section className="mb-10 bg-muted p-8 rounded-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Our Impact</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="bg-background p-6 rounded-lg shadow-sm">
            <p className="text-4xl font-bold text-primary mb-2">25,000+</p>
            <p className="text-lg">Users Reached</p>
          </div>
          
          <div className="bg-background p-6 rounded-lg shadow-sm">
            <p className="text-4xl font-bold text-primary mb-2">120+</p>
            <p className="text-lg">Websites Improved</p>
          </div>
          
          <div className="bg-background p-6 rounded-lg shadow-sm">
            <p className="text-4xl font-bold text-primary mb-2">98%</p>
            <p className="text-lg">User Satisfaction</p>
          </div>
        </div>
        
        <div className="mt-8 prose max-w-none">
          <p>
            Since our founding in 2023, MindfulReach has been committed to making the web more accessible. Our platform has helped over 25,000 users access digital content that would otherwise be inaccessible to them. Through our consulting services, we've helped improve more than 120 websites to meet WCAG standards.
          </p>
          <p>
            Our community of accessibility advocates continues to grow, with regular workshops and training sessions that have educated hundreds of developers and designers on inclusive design principles.
          </p>
        </div>
      </section>

      <section className="mb-10" id="accessibility">
        <h2 className="text-2xl font-bold mb-4">Accessibility Statement</h2>
        <div className="md:flex gap-6 items-start mb-6">
          <div className="md:w-1/3 mb-4 md:mb-0">
            <img 
              src="https://images.unsplash.com/photo-1629907710657-e28189e4e32a?q=80&w=600" 
              alt="Close-up of hands using a specialized accessibility keyboard with large keys" 
              className="rounded-lg w-full h-auto"
            />
          </div>
          <div className="md:w-2/3 prose max-w-none">
            <p>
              MindfulReach is committed to ensuring digital accessibility for people of all abilities. We are continually improving the user experience for everyone and applying the relevant accessibility standards.
            </p>
            <h3 className="text-xl font-semibold mt-6 mb-3">Conformance Status</h3>
            <p>
              The Web Content Accessibility Guidelines (WCAG) define requirements for designers and developers to improve accessibility for people with disabilities. MindfulReach strives to conform to WCAG 2.1 Level AA standards.
            </p>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">Our Accessibility Features</h3>
        <ul>
          <li>Semantic HTML structure for better screen reader compatibility</li>
          <li>Keyboard navigable interface</li>
          <li>Visible focus indicators for keyboard users</li>
          <li>Text alternatives for non-text content</li>
          <li>Sufficient color contrast between text and backgrounds</li>
          <li>Resizable text without loss of content or functionality</li>
          <li>Dark mode and high contrast options</li>
          <li>Readable and navigable content structure</li>
          <li>Skip links for keyboard navigation</li>
          <li>ARIA attributes where appropriate</li>
          <li>Large text mode for improved readability</li>
        </ul>

        <div className="md:flex gap-6 items-center my-8">
          <div className="md:w-1/2 mb-4 md:mb-0">
            <img 
              src="https://images.unsplash.com/photo-1606166145177-8465c1ee8d3b?q=80&w=800" 
              alt="Person using a screen reader device connected to a laptop computer" 
              className="rounded-lg w-full h-auto"
            />
          </div>
          <div className="md:w-1/2">
            <h3 className="text-xl font-semibold mb-3">Feedback</h3>
            <p>
              We welcome your feedback on the accessibility of the MindfulReach website. If you encounter accessibility barriers or have suggestions for improvement, please let us know.
            </p>
            <div className="mt-6">
              <Link to="/contact">
                <Button>Contact Us About Accessibility</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Our Approach to Content</h2>
        <div className="prose max-w-none">
          <p>
            MindfulReach is built on the principle that content should be:
          </p>
          <ul>
            <li><strong>Perceivable</strong> - Information must be presentable to users in ways they can perceive</li>
            <li><strong>Operable</strong> - Interface components and navigation must be operable</li>
            <li><strong>Understandable</strong> - Information and operation of the interface must be understandable</li>
            <li><strong>Robust</strong> - Content must be robust enough to work with current and future technologies</li>
          </ul>
          <p>
            All our articles are written in clear, concise language with proper heading structure, descriptive links, and comprehensive image descriptions. We strive to make complex topics accessible to readers with various cognitive abilities and levels of expertise.
          </p>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;

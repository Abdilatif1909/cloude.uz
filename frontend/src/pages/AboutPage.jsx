import { FiBookOpen, FiCode, FiLayout, FiShield } from 'react-icons/fi';

import SectionHeading from '../components/shared/SectionHeading';

const values = [
  { icon: FiCode, title: 'Clean architecture', description: 'Service layer, contexts, hooks va reusable components bilan scalable frontend.' },
  { icon: FiLayout, title: 'Modern UI/UX', description: 'Glassmorphism, gradient, dark/light mode va smooth animationlar.' },
  { icon: FiBookOpen, title: 'Education-first design', description: 'Learning flow lecture, practical, tests va dashboard atrofida qurilgan.' },
  { icon: FiShield, title: 'Secure access', description: 'JWT auth, protected routes va role-based flows bilan himoyalangan.' },
];

function AboutPage() {
  return (
    <section className="container-shell py-10">
      <div className="glass-panel rounded-[2rem] p-8 sm:p-10">
        <SectionHeading
          eyebrow="About platform"
          title="WebDasturlashEdu — zamonaviy web dasturlash ta’lim platformasi"
          description="Nazariya, amaliyot va analitikani yagona product tajribasiga aylantiruvchi ta’lim platformasi."
        />
        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {values.map(({ icon: Icon, title, description }) => (
            <article key={title} className="glass-button rounded-3xl p-6">
              <div className="icon-chip"><Icon /></div>
              <h3 className="text-card-title mt-5">{title}</h3>
              <p className="text-body mt-3">{description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default AboutPage;

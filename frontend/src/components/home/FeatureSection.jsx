import { motion } from 'framer-motion';
import { FiActivity, FiGlobe, FiLayers, FiZap } from 'react-icons/fi';

import SectionHeading from '../shared/SectionHeading';

const features = [
  {
    icon: FiLayers,
    title: 'Structured learning flow',
    description: 'Lecture, practical, test va books bitta integratsiyalashgan learning journey ichida.',
  },
  {
    icon: FiZap,
    title: 'Fast modern UX',
    description: 'Glassmorphism, gradient, responsive layout va Framer Motion animatsiyalar bilan premium interfeys.',
  },
  {
    icon: FiActivity,
    title: 'Teacher analytics',
    description: 'Teacher o‘z testlari bo‘yicha student natijalari va umumiy analitikani kuzatadi.',
  },
  {
    icon: FiGlobe,
    title: 'Search everywhere',
    description: 'Lecture, practical va books bo‘yicha real-time qidiruv imkoniyati.',
  },
];

function FeatureSection() {
  return (
    <section className="container-shell py-20">
      <SectionHeading
        eyebrow="Features"
        title="Modern education platform uchun barcha kerakli modullar"
        description="Frontend architecture reusable components va scalable service layer asosida qurilgan."
        align="center"
      />
      <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {features.map(({ icon: Icon, title, description }, index) => (
          <motion.article
            key={title}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
            className="glass-panel rounded-3xl p-6"
          >
            <div className="icon-chip text-xl"><Icon /></div>
            <h3 className="mt-5 text-lg font-semibold text-[#0f172a]">{title}</h3>
            <p className="mt-3 text-sm leading-7 text-[#334155]">{description}</p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

export default FeatureSection;

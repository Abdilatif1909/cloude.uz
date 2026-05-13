import { motion } from 'framer-motion';

function SectionHeading({ eyebrow, title, description, align = 'left' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={align === 'center' ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'}
    >
      {eyebrow ? <p className="text-eyebrow">{eyebrow}</p> : null}
      <h2 className="text-section-title mt-4">{title}</h2>
      {description ? <p className="text-body mt-4">{description}</p> : null}
    </motion.div>
  );
}

export default SectionHeading;

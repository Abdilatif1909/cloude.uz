import { FiBookOpen, FiGithub, FiInstagram, FiMail } from 'react-icons/fi';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="border-t border-[#e7eef8] py-12">
      <div className="container-shell grid gap-10 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
        <div>
          <div className="flex items-center gap-3">
            <div className="icon-chip text-lg"><FiBookOpen /></div>
            <div>
              <h3 className="text-card-title text-[var(--color-heading-2)]">WebDasturlashEdu</h3>
              <p className="text-muted">Modern education platform</p>
            </div>
          </div>
          <p className="text-muted mt-4 max-w-md">
            Web dasturlash fanini zamonaviy UI, PDF kutubxona, online testlar va role-based dashboard orqali o‘rganing.
          </p>
        </div>
        <div>
          <p className="text-eyebrow">Quick links</p>
          <div className="mt-4 space-y-3">
            <Link to="/lectures" className="text-link text-sm">Lectures</Link>
            <Link to="/practicals" className="text-link text-sm">Practicals</Link>
            <Link to="/tests" className="text-link text-sm">Tests</Link>
            <Link to="/dashboard" className="text-link text-sm">Dashboard</Link>
          </div>
        </div>
        <div>
          <p className="text-eyebrow">Connect</p>
          <div className="mt-4 flex items-center gap-3 text-lg text-[var(--color-body)]">
            <FiMail />
            <FiGithub />
            <FiInstagram />
          </div>
          <p className="text-muted mt-4">© 2026 WebDasturlashEdu</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

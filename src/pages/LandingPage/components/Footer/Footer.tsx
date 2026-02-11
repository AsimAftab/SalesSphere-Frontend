import { memo, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/components/ui/utils';
import logo from '@/assets/images/logo-c.svg';
import googlePlayBadge from '@/assets/images/play-store.svg';
// import appStoreBadge from '@/assets/images/app-store.svg';
import { useContactUsModal } from '@/components/modals/ContactUsModalContext';
import { newsletterService } from '@/api/newsletterService';
import toast from 'react-hot-toast';
import { FOOTER_NAVIGATION, LEGAL_LINKS, APP_STORE_URLS } from './Footer.data';
import { containerVariants, itemVariants } from './Footer.animations';
import type { FooterProps, FooterLink } from './Footer.types';

// Social media icons
const TwitterIcon = () => (
  <svg className="w-5 h-5 sm:w-[22px] sm:h-[22px]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const LinkedInIcon = () => (
  <svg className="w-5 h-5 sm:w-[22px] sm:h-[22px]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const FacebookIcon = () => (
  <svg className="w-5 h-5 sm:w-[22px] sm:h-[22px]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
  </svg>
);

const InstagramIcon = () => (
  <svg className="w-5 h-5 sm:w-[22px] sm:h-[22px]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
  </svg>
);

const SOCIAL_LINKS = [
  { name: 'Twitter', href: 'https://twitter.com/salessphere', icon: TwitterIcon },
  { name: 'LinkedIn', href: 'https://linkedin.com/company/salessphere', icon: LinkedInIcon },
  { name: 'Facebook', href: 'https://facebook.com/salessphere', icon: FacebookIcon },
  { name: 'Instagram', href: 'https://instagram.com/salessphere', icon: InstagramIcon },
];

/**
 * FooterBrand - Logo, description and social links
 */
const FooterBrand = memo(() => (
  <motion.div variants={itemVariants} className="space-y-6">
    <a href="/" className="inline-flex items-center gap-2.5">
      <img className="h-11 w-auto" src={logo} alt="SalesSphere Logo" width={44} height={44} />
      <span className="text-2xl sm:text-3xl font-bold">
        <span className="text-secondary">Sales</span>
        <span className="text-white">Sphere</span>
      </span>
    </a>

    <p className="text-base leading-relaxed text-white/70 max-w-sm">
      The all-in-one field sales management platform. Track, manage, and grow your sales operations with powerful tools and real-time insights.
    </p>

    {/* Social Links */}
    <div className="flex items-center gap-3 sm:gap-4">
      {SOCIAL_LINKS.map((social) => (
        <a
          key={social.name}
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:bg-secondary hover:border-secondary hover:text-white transition-all"
          aria-label={social.name}
        >
          <social.icon />
        </a>
      ))}
    </div>
  </motion.div>
));

FooterBrand.displayName = 'FooterBrand';

/**
 * FooterLinksColumn - Single column of footer links
 */
const FooterLinksColumn = memo<{
  title: string;
  links: FooterLink[];
  onAction?: (action: string) => void;
}>(({ title, links, onAction }) => (
  <motion.div variants={itemVariants}>
    <h3 className="text-base font-semibold text-white uppercase tracking-wide mb-5">{title}</h3>
    <ul className="space-y-3.5">
      {links.map((link) => (
        <li key={link.name}>
          <a
            href={link.href || '#'}
            onClick={(e) => {
              if (link.action && onAction) {
                e.preventDefault();
                onAction(link.action);
              }
            }}
            className="text-base text-white/60 hover:text-white transition-colors"
          >
            {link.name}
          </a>
        </li>
      ))}
    </ul>
  </motion.div>
));

FooterLinksColumn.displayName = 'FooterLinksColumn';

/**
 * FooterNewsletter - Newsletter subscription with app download
 */
const FooterNewsletter = memo(() => {
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubscribing(true);
    try {
      await newsletterService.subscribe(email, 'website');
      toast.success('Successfully subscribed to our newsletter!');
      setEmail('');
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      const message = axiosError.response?.data?.message || 'Failed to subscribe. Please try again.';
      toast.error(message);
    } finally {
      setIsSubscribing(false);
    }
  }, [email]);

  return (
    <motion.div variants={itemVariants} className="space-y-6">
      <div>
        <h3 className="text-base font-semibold text-white uppercase tracking-wide mb-2">
          Stay Updated
        </h3>
        <p className="text-base text-white/60">
          Subscribe to our newsletter for product updates and insights.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <label htmlFor="footer-email" className="sr-only">Email address</label>
        <input
          id="footer-email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isSubscribing}
          className="w-full rounded-lg bg-white/5 px-4 py-3 text-base text-white placeholder:text-white/40 border border-white/10 focus:border-secondary focus:ring-1 focus:ring-secondary focus:outline-none transition-all disabled:opacity-50"
          placeholder="Enter your email address"
        />
        <button
          type="submit"
          disabled={isSubscribing}
          className="w-full px-4 py-3 bg-secondary hover:bg-secondary/90 text-white text-base font-semibold rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isSubscribing ? 'Subscribing...' : 'Subscribe to Newsletter'}
          {!isSubscribing && <ArrowRight className="w-4 h-4" />}
        </button>
      </form>

      {/* App Download */}
      <div className="pt-2">
        <p className="text-sm text-white/50 mb-3">Get our mobile app</p>
        <a
          href={APP_STORE_URLS.googlePlay}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block hover:opacity-80 transition-opacity"
          aria-label="Get it on Google Play"
        >
          <img className="h-11 w-auto" src={googlePlayBadge} alt="Get it on Google Play" width={148} height={44} />
        </a>
      </div>
    </motion.div>
  );
});

FooterNewsletter.displayName = 'FooterNewsletter';

/**
 * FooterBottom - Copyright and legal links
 */
const FooterBottom = memo(() => (
  <motion.div
    variants={itemVariants}
    className="mt-12 pt-8 border-t border-white/10"
  >
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
      <p className="text-sm text-white/50 text-center sm:text-left">
        &copy; {new Date().getFullYear()} SalesSphere Technologies Pvt. Ltd. All rights reserved.
      </p>
      <div className="flex items-center gap-6">
        {LEGAL_LINKS.map((link) => (
          <a
            key={link.name}
            href={link.href}
            className="text-sm text-white/50 hover:text-white/80 transition-colors"
          >
            {link.name}
          </a>
        ))}
      </div>
    </div>
  </motion.div>
));

FooterBottom.displayName = 'FooterBottom';

/**
 * Footer - Professional footer component for landing page
 */
const Footer = memo<FooterProps>(({ className }) => {
  const { openContactUsModal } = useContactUsModal();

  const handleAction = useCallback((action: string) => {
    if (action === 'openContactUsModal') {
      openContactUsModal();
    }
  }, [openContactUsModal]);

  return (
    <footer
      id="footer"
      className={cn(
        'relative bg-primary overflow-hidden scroll-mt-14 sm:scroll-mt-16',
        className
      )}
      aria-labelledby="footer-heading"
    >
      <h2 id="footer-heading" className="sr-only">Footer</h2>

      {/* Subtle top border gradient */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-secondary/50 to-transparent" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20"
      >
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">

          {/* Brand Section */}
          <div className="lg:col-span-4">
            <FooterBrand />
          </div>

          {/* Links Section */}
          <div className="lg:col-span-5">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
              <FooterLinksColumn
                title="Product"
                links={FOOTER_NAVIGATION.product}
              />
              <FooterLinksColumn
                title="Company"
                links={FOOTER_NAVIGATION.company}
                onAction={handleAction}
              />
              <FooterLinksColumn
                title="Resources"
                links={FOOTER_NAVIGATION.resources}
              />
            </div>
          </div>

          {/* Newsletter Section */}
          <div className="lg:col-span-3">
            <FooterNewsletter />
          </div>
        </div>

        {/* Bottom Section */}
        <FooterBottom />
      </motion.div>
    </footer>
  );
});

Footer.displayName = 'Footer';

export default Footer;

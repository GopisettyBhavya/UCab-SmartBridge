import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiHelpCircle, FiChevronDown, FiChevronUp, FiMail, FiPhone,
  FiMessageSquare, FiSend, FiCheckCircle, FiAlertCircle,
  FiMapPin, FiCreditCard, FiUser, FiShield, FiArrowLeft,
} from 'react-icons/fi';

/* ─── FAQ Data ────────────────────────────────────────────────── */
const FAQ_CATEGORIES = [
  {
    category: 'Booking & Rides',
    icon: FiMapPin,
    color: 'var(--primary)',
    faqs: [
      {
        q: 'How do I book a ride?',
        a: 'Go to Dashboard → "Book a Ride". Enter your pickup and drop-off locations, select a vehicle type, then confirm your booking. A nearby driver will be assigned automatically.',
      },
      {
        q: 'Can I schedule a ride in advance?',
        a: "Currently rides are booked on-demand. Scheduled rides are coming soon — we'll notify you when the feature is live.",
      },
      {
        q: 'How do I cancel a ride?',
        a: 'Open the active ride on your Ride Tracking screen and tap "Cancel Ride". Cancellations before a driver is assigned are free. A small fee may apply if cancelled after pickup.',
      },
      {
        q: "What if my driver doesn't show up?",
        a: "Wait up to 5 minutes after the driver marks arrival. If they don't appear, you can cancel without any charge or contact support using the form below.",
      },
    ],
  },
  {
    category: 'Payments & Fares',
    icon: FiCreditCard,
    color: 'var(--secondary)',
    faqs: [
      {
        q: 'How is the fare calculated?',
        a: "Fares are based on distance, vehicle type, and time of day. You'll always see the estimated fare before confirming a booking.",
      },
      {
        q: 'What payment methods are accepted?',
        a: 'We accept cash, UPI, debit/credit cards, and your UCAB wallet balance. You can manage payment methods in your Profile page.',
      },
      {
        q: 'How do I top up my wallet?',
        a: 'Go to Profile → Wallet section → tap "+ Add ₹500". Wallet funds are applied automatically at checkout.',
      },
      {
        q: 'I was charged incorrectly. What do I do?',
        a: "Check your ride history for the fare breakdown. If you believe there's an error, submit a support request below and our team will review it within 24 hours.",
      },
    ],
  },
  {
    category: 'Account & Profile',
    icon: FiUser,
    color: 'var(--accent)',
    faqs: [
      {
        q: 'How do I update my name or phone number?',
        a: 'Go to Profile → Personal Info → tap "Edit". Update your details and save.',
      },
      {
        q: 'I forgot my password. How do I reset it?',
        a: "On the login screen, tap \"Forgot Password\" and enter your registered email. You'll receive a reset link shortly.",
      },
      {
        q: 'How do I delete my account?',
        a: 'Account deletion requests must be submitted through our support form. Our team will process your request within 7 business days.',
      },
    ],
  },
  {
    category: 'Safety & Trust',
    icon: FiShield,
    color: 'var(--warning)',
    faqs: [
      {
        q: 'How are UCAB drivers verified?',
        a: 'All drivers go through background checks, license verification, and vehicle inspection before being approved on the platform.',
      },
      {
        q: 'What should I do in an emergency during a ride?',
        a: 'Call emergency services (112) immediately. You can also share your live ride details with a trusted contact from the Ride Tracking screen.',
      },
      {
        q: 'How do I report a driver or incident?',
        a: 'Use the support form below and select "Safety Issue" as the category. You can also rate your driver after the ride completes.',
      },
    ],
  },
];

/* ─── FAQ Accordion Item ──────────────────────────────────────── */
const FaqItem = ({ faq, isOpen, onToggle }) => (
  <div
    style={{
      borderBottom: '1px solid var(--glass-border)',
      overflow: 'hidden',
    }}
  >
    <button
      onClick={onToggle}
      style={{
        width: '100%',
        background: 'none',
        border: 'none',
        padding: '1rem 0',
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1rem',
        color: 'var(--text-primary)',
        textAlign: 'left',
        fontFamily: 'inherit',
        fontSize: '0.95rem',
        fontWeight: isOpen ? 600 : 500,
        transition: 'color var(--transition-fast)',
      }}
    >
      <span>{faq.q}</span>
      {isOpen
        ? <FiChevronUp size={18} style={{ flexShrink: 0, color: 'var(--primary)' }} />
        : <FiChevronDown size={18} style={{ flexShrink: 0, color: 'var(--text-muted)' }} />}
    </button>
    {isOpen && (
      <div
        className="animate-fade-in"
        style={{
          paddingBottom: '1rem',
          color: 'var(--text-secondary)',
          fontSize: '0.9rem',
          lineHeight: 1.75,
        }}
      >
        {faq.a}
      </div>
    )}
  </div>
);

/* ─── Main Component ──────────────────────────────────────────── */
const Help = () => {
  const navigate = useNavigate();

  // FAQ state — track which item is open per category
  const [openItems, setOpenItems] = useState({});
  const toggleFaq = (catIdx, faqIdx) => {
    const key = `${catIdx}-${faqIdx}`;
    setOpenItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Active FAQ category tab
  const [activeCategory, setActiveCategory] = useState(0);

  // Contact form state
  const [form, setForm] = useState({
    subject: '',
    category: '',
    description: '',
  });
  const [formStatus, setFormStatus] = useState(null); // 'sending' | 'success' | 'error'

  const handleFormChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.subject.trim() || !form.category || !form.description.trim()) {
      setFormStatus('error');
      return;
    }
    setFormStatus('sending');
    // Simulate API call — replace with real endpoint when available
    await new Promise(res => setTimeout(res, 1200));
    setFormStatus('success');
    setForm({ subject: '', category: '', description: '' });
  };

  const currentCat = FAQ_CATEGORIES[activeCategory];

  return (
    <div className="page-container animate-fade-in" style={{ paddingTop: '90px', maxWidth: '900px' }}>

      {/* ── Header ── */}
      <div style={{ marginBottom: '2rem' }}>
        <button
          className="btn btn-sm btn-secondary"
          onClick={() => navigate(-1)}
          style={{ marginBottom: '1.25rem' }}
        >
          <FiArrowLeft size={15} /> Back
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: 56, height: 56, borderRadius: 'var(--radius-md)',
            background: 'rgba(255,214,0,0.15)', color: 'var(--warning)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <FiHelpCircle size={28} />
          </div>
          <div>
            <h2 style={{ fontFamily: 'Outfit', marginBottom: '0.2rem' }}>Help &amp; Support</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Find answers or reach out — we're here 24/7.
            </p>
          </div>
        </div>
      </div>

      {/* ── Quick Contact Strip ── */}
      <div className="grid-3" style={{ marginBottom: '2rem' }}>
        {[
          { icon: FiPhone, label: 'Emergency', value: '112', color: 'var(--error)', bg: 'rgba(255,82,82,0.12)' },
          { icon: FiPhone, label: 'UCAB Support', value: '+91 98765 43210', color: 'var(--success)', bg: 'rgba(0,230,118,0.12)' },
          { icon: FiMail, label: 'Email Us', value: 'support@ucab.in', color: 'var(--secondary)', bg: 'rgba(0,217,255,0.12)' },
        ].map(({ icon: Icon, label, value, color, bg }) => (
          <div
            key={label}
            className="glass-card"
            style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.25rem' }}
          >
            <div style={{
              width: 44, height: 44, borderRadius: 'var(--radius-md)',
              background: bg, color, flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon size={20} />
            </div>
            <div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.15rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── FAQs ── */}
      <div className="glass-card" style={{ marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <FiMessageSquare size={20} style={{ color: 'var(--primary)' }} />
          Frequently Asked Questions
        </h3>

        {/* Category Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          {FAQ_CATEGORIES.map((cat, i) => {
            const Icon = cat.icon;
            const isActive = activeCategory === i;
            return (
              <button
                key={cat.category}
                onClick={() => setActiveCategory(i)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.4rem',
                  padding: '0.5rem 1rem', borderRadius: '50px',
                  border: `1px solid ${isActive ? cat.color : 'var(--glass-border)'}`,
                  background: isActive ? `${cat.color}20` : 'transparent',
                  color: isActive ? cat.color : 'var(--text-secondary)',
                  cursor: 'pointer', fontSize: '0.85rem', fontWeight: isActive ? 600 : 500,
                  transition: 'all var(--transition-fast)', fontFamily: 'inherit',
                }}
              >
                <Icon size={14} />
                {cat.category}
              </button>
            );
          })}
        </div>

        {/* FAQ Accordion */}
        <div>
          {currentCat.faqs.map((faq, faqIdx) => (
            <FaqItem
              key={faqIdx}
              faq={faq}
              isOpen={!!openItems[`${activeCategory}-${faqIdx}`]}
              onToggle={() => toggleFaq(activeCategory, faqIdx)}
            />
          ))}
        </div>
      </div>

      {/* ── Contact Form ── */}
      <div className="glass-card" style={{ marginBottom: '3rem' }}>
        <h3 style={{ marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <FiSend size={20} style={{ color: 'var(--secondary)' }} />
          Contact Support
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          Didn't find your answer above? Send us a message and we'll get back to you within 24 hours.
        </p>

        {formStatus === 'success' ? (
          <div
            className="animate-fade-in"
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              gap: '1rem', padding: '2.5rem 1rem', textAlign: 'center',
            }}
          >
            <FiCheckCircle size={48} style={{ color: 'var(--success)' }} />
            <h4>Request Submitted!</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Our support team will respond to your query within 24 hours.
            </p>
            <button className="btn btn-secondary" onClick={() => setFormStatus(null)}>
              Submit Another Request
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <div className="grid-2" style={{ marginBottom: '1.25rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Subject *</label>
                <input
                  className="form-input"
                  name="subject"
                  value={form.subject}
                  onChange={handleFormChange}
                  placeholder="Brief description of your issue"
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Category *</label>
                <select
                  className="form-input"
                  name="category"
                  value={form.category}
                  onChange={handleFormChange}
                  required
                  style={{ appearance: 'none', cursor: 'pointer' }}
                >
                  <option value="" disabled>Select a category</option>
                  <option value="booking">Booking &amp; Rides</option>
                  <option value="payment">Payment &amp; Billing</option>
                  <option value="account">Account &amp; Profile</option>
                  <option value="safety">Safety Issue</option>
                  <option value="driver">Driver Complaint</option>
                  <option value="technical">Technical Problem</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Description *</label>
              <textarea
                className="form-input"
                name="description"
                value={form.description}
                onChange={handleFormChange}
                placeholder="Please describe your issue in detail — include ride ID, date/time, or any other relevant information."
                rows={5}
                required
              />
            </div>

            {formStatus === 'error' && (
              <div
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  color: 'var(--error)', fontSize: '0.9rem', marginBottom: '1rem',
                }}
              >
                <FiAlertCircle size={16} />
                Please fill in all required fields before submitting.
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary"
              disabled={formStatus === 'sending'}
              style={{ minWidth: 160 }}
            >
              {formStatus === 'sending'
                ? <><div className="spinner spinner-sm" /> Submitting…</>
                : <><FiSend size={16} /> Submit Request</>}
            </button>
          </form>
        )}
      </div>

    </div>
  );
};

export default Help;

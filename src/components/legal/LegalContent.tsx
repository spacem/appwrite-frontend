export type LegalType = 'privacy' | 'tos';

export default function LegalContent({ type }: { type: LegalType }) {
  if (type === 'privacy') {
    return (
      <div>
        <h3>Privacy Policy</h3>
        <p>
          We care about your privacy and will make reasonable efforts to protect your data. However, no system is
          perfect and we cannot guarantee absolute security or uninterrupted service.
        </p>
        <p>
          This application may integrate with third-party services (such as authentication and hosting providers)
          that are outside of our control. Their availability, behavior, and data handling are governed by their
          own terms and policies.
        </p>
        <p>
          By using this application, you acknowledge these limitations and agree that we are not liable for issues
          caused by external providers or events beyond our reasonable control.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h3>Terms of Service</h3>
      <p>
        This application is provided on an "as is" and "as available" basis without warranties of any kind.
        We will try our best to keep the service functional, but we do not promise error-free operation or
        continuous availability.
      </p>
      <p>
        We rely on third-party services (e.g., authentication, hosting, analytics). We do not control these
        providers and are not responsible for their outages, behavior, or data handling. Your use of those
        services is subject to their own terms and policies.
      </p>
      <p>
        You agree to use the application responsibly and in compliance with applicable laws. We may change or
        discontinue features at any time without notice.
      </p>
    </div>
  );
}

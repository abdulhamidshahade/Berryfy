import OtpConfirmationForm from '../../../components/auth/OtpConfirmationForm';
import { getCurrentUser } from '../../../lib/actions/auth-actions';
import { redirect } from 'next/navigation';

interface ConfirmPasswordResetPageProps {
  searchParams: Promise<{
    email?: string;
    error?: string;
  }>;
}

export default async function ConfirmPasswordResetPage({ searchParams }: ConfirmPasswordResetPageProps) {
  const user = await getCurrentUser();
  if (user) {
    redirect('/');
  }

  const params = await searchParams;
  const { email, error } = params;

  if (!email) {
    redirect(
      '/auth/forgot-password?error=' +
        encodeURIComponent('Missing email. Please start password reset again.')
    );
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          {error && (
            <div className="alert alert-danger mb-4" role="alert">
              <i className="bi bi-exclamation-triangle me-2"></i>
              {decodeURIComponent(error)}
            </div>
          )}
          <OtpConfirmationForm email={email} purpose="passwordReset" />
        </div>
      </div>
    </div>
  );
}

export const metadata = {
  title: 'Verify reset code - Berryfy',
  description: 'Enter the 6-digit code we emailed you to continue resetting your password',
};

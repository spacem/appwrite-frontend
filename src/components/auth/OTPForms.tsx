import { useState } from 'react';
import { account, ID } from '../../lib/appwrite';
import './otp-forms.css';

export default function OTPForms({ onSuccess, onError }: { onSuccess: () => void; onError?: (e: unknown) => void }) {
  const [email, setEmail] = useState('');
  const [emailUserId, setEmailUserId] = useState('');
  const [emailSecret, setEmailSecret] = useState('');
  const [phone, setPhone] = useState('');
  const [phoneUserId, setPhoneUserId] = useState('');
  const [phoneSecret, setPhoneSecret] = useState('');

  const sendEmailOtp = async () => {
    try {
      const result = await account.createEmailToken(ID.unique(), email, false);
      setEmailUserId(result.userId);
    } catch (e) {
      onError?.(e);
    }
  };

  const verifyEmailOtp = async () => {
    try {
      await account.createSession(emailUserId, emailSecret);
      onSuccess();
    } catch (e) {
      onError?.(e);
    }
  };

  const sendPhoneOtp = async () => {
    try {
      const result = await account.createPhoneToken(ID.unique(), phone);
      setPhoneUserId(result.userId);
    } catch (e) {
      onError?.(e);
    }
  };

  const verifyPhoneOtp = async () => {
    try {
      await account.createSession(phoneUserId, phoneSecret);
      onSuccess();
    } catch (e) {
      onError?.(e);
    }
  };

  return (
    <div className="card">
      <h3>One-Time Passcodes</h3>
      <div className="otp-grid">
        <div>
          <h4>Email OTP</h4>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <div className="row">
            <button className="btn" onClick={sendEmailOtp}>Send OTP</button>
          </div>
          <input type="text" placeholder="Secret from email" value={emailSecret} onChange={(e) => setEmailSecret(e.target.value)} />
          <div className="row">
            <button className="btn" onClick={verifyEmailOtp} disabled={!emailUserId || !emailSecret}>Verify</button>
          </div>
        </div>
        <div>
          <h4>Phone OTP</h4>
          <input type="tel" placeholder="+15551234567" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <div className="row">
            <button className="btn" onClick={sendPhoneOtp}>Send OTP</button>
          </div>
          <input type="text" placeholder="Secret from SMS" value={phoneSecret} onChange={(e) => setPhoneSecret(e.target.value)} />
          <div className="row">
            <button className="btn" onClick={verifyPhoneOtp} disabled={!phoneUserId || !phoneSecret}>Verify</button>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  ArrowRight,
  LogOut,
  Package,
  MapPin,
  CheckCircle2,
  ShieldCheck,
  ExternalLink,
  Edit3,
  Check
} from 'lucide-react';
import { UserProfile, OrderDetails } from '@/types';
import { formatPrice } from './Navbar';
import { authenticatedFetch } from '@/lib/session';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  onLogin: (user: UserProfile) => void;
  onLogout: () => void;
  onUpdateUser: (user: UserProfile) => void;
  ordersList: OrderDetails[];
  onOpenOrderTracking: (order?: OrderDetails) => void;
  selectedCurrency: string;
  loginPrompt?: string;
}

export default function AuthModal({
  isOpen,
  onClose,
  currentUser,
  onLogin,
  onLogout,
  onUpdateUser,
  ordersList,
  onOpenOrderTracking,
  selectedCurrency,
  loginPrompt
}: AuthModalProps) {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  const [phoneInput, setPhoneInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [nameInput, setNameInput] = useState('');

  const [accountTab, setAccountTab] = useState<'orders' | 'profile'>('orders');

  const [editName, setEditName] = useState(() => currentUser?.name || '');
  const [editEmail, setEditEmail] = useState(() => currentUser?.email || '');
  const [editPhone, setEditPhone] = useState(() => currentUser?.phone || '');
  const [editAddress, setEditAddress] = useState(() => currentUser?.address || '');
  const [editCity, setEditCity] = useState(() => currentUser?.city || '');
  const [editState, setEditState] = useState(() => currentUser?.state || '');
  const [editPincode, setEditPincode] = useState(() => currentUser?.pincode || '');
  const [profileSavedToast, setProfileSavedToast] = useState(false);

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (currentUser) {
      setEditName(currentUser.name || '');
      setEditEmail(currentUser.email || '');
      setEditPhone(currentUser.phone || '');
      setEditAddress(currentUser.address || '');
      setEditCity(currentUser.city || '');
      setEditState(currentUser.state || '');
      setEditPincode(currentUser.pincode || '');
    }
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) return;

    let isMounted = true;
    void Promise.all([
      authenticatedFetch('/api/auth/profile'),
      authenticatedFetch('/api/auth/profile/address')
    ])
      .then(async ([profileResponse, addressResponse]) => {
        const profilePayload = await profileResponse.json();
        if (!profileResponse.ok) throw new Error(profilePayload?.message || 'Unable to load profile');
        if (!isMounted) return;

        const customer = profilePayload?.data;
        if (!customer) return;
        const addressPayload = addressResponse.ok ? await addressResponse.json() : null;
        const address = addressPayload?.data;
        const name = [customer.firstName, customer.lastName].filter(Boolean).join(' ');
        onUpdateUser({
          ...currentUser,
          name: name || currentUser.name,
          email: customer.email || currentUser.email,
          phone: customer.mobile || currentUser.phone,
          address: address?.addressLine1 || currentUser.address,
          city: address?.city || currentUser.city,
          state: address?.state || currentUser.state,
          pincode: address?.pincode || currentUser.pincode
        });
      })
      .catch(() => undefined);

    return () => {
      isMounted = false;
    };
  }, [currentUser?.id]);

  if (!isOpen) return null;

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput || !passwordInput) {
      setErrorMsg('Please fill in both email and password.');
      return;
    }
    if (passwordInput.length < 6) {
      setErrorMsg('Password should be at least 6 characters.');
      return;
    }

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailInput.trim(), password: passwordInput })
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.message || 'Login failed');
      }

      const customer = payload?.data?.customer || payload?.data?.user || {};
      const user: UserProfile = {
        id: `usr_${customer?.id || Date.now()}`,
        name: customer?.firstName && customer?.lastName
          ? `${customer.firstName} ${customer.lastName}`
          : emailInput.split('@')[0] || 'Silk Patron',
        email: customer?.email || emailInput,
        phone: customer?.mobile || phoneInput || '9876543210',
        address: '',
        city: '',
        state: '',
        pincode: '',
        joinedDate: 'Logged in via API',
        tier: 'Silver Patron'
      };

      window.localStorage.setItem('prasha-auth-token', payload?.data?.accessToken || '');
      window.localStorage.setItem('prasha-refresh-token', payload?.data?.refreshToken || '');
      onLogin(user);
      setErrorMsg('');
      setSuccessMsg('Welcome back!');
    } catch (error) {
      setErrorMsg(error instanceof Error ? error.message : 'Unable to sign in right now.');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!phoneInput || phoneInput.replace(/\D/g, '').length < 10) {
      setErrorMsg('Please enter a valid 10-digit phone number.');
      return;
    }
    if (!emailInput || !emailInput.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    try {
      const [firstName, ...restName] = nameInput.trim().split(/\s+/);
      const lastName = restName.join(' ') || 'Customer';

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName,
          lastName,
          email: emailInput.trim(),
          mobile: phoneInput.replace(/\D/g, ''),
          password: passwordInput
        })
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.message || 'Registration failed');
      }

      const customer = payload?.data?.customer || {};
      const newUser: UserProfile = {
        id: `usr_${customer?.id || Date.now()}`,
        name: `${customer?.firstName || firstName} ${customer?.lastName || lastName}`.trim(),
        email: customer?.email || emailInput.trim(),
        phone: customer?.mobile || phoneInput.replace(/\D/g, ''),
        address: '',
        city: '',
        state: '',
        pincode: '',
        joinedDate: 'September 2026',
        tier: 'Silver Patron'
      };

      window.localStorage.setItem('prasha-auth-token', payload?.data?.accessToken || '');
      window.localStorage.setItem('prasha-refresh-token', payload?.data?.refreshToken || '');
      onLogin(newUser);
      setErrorMsg('');
      setSuccessMsg('Welcome to PRASHA! Your account has been created.');
    } catch (error) {
      setErrorMsg(error instanceof Error ? error.message : 'Unable to create your account right now.');
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    const updated: UserProfile = {
      ...currentUser,
      name: editName.trim() || currentUser.name,
      email: editEmail.trim() || currentUser.email,
      phone: editPhone.trim() || currentUser.phone,
      address: editAddress.trim(),
      city: editCity.trim(),
      state: editState.trim(),
      pincode: editPincode.trim(),
    };

    try {
      const addressFields = [updated.address, updated.city, updated.state, updated.pincode];
      if (addressFields.some(Boolean) && addressFields.some((value) => !value)) {
        throw new Error('Please complete your address, city, state, and pincode.');
      }

      const [firstName, ...restName] = updated.name.split(/\s+/);
      const headers = { 'Content-Type': 'application/json' };
      const response = await authenticatedFetch('/api/auth/profile', {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          firstName,
          lastName: restName.join(' ') || 'Customer',
          mobile: updated.phone
        })
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.message || 'Unable to save profile');

      if (addressFields.some(Boolean)) {
        const addressResponse = await authenticatedFetch('/api/auth/profile/address', {
          method: 'PUT',
          headers,
          body: JSON.stringify({
            addressType: 'SHIPPING',
            isDefaultShipping: true,
            isDefaultBilling: true,
            addressLine1: updated.address,
            city: updated.city,
            state: updated.state,
            country: 'India',
            pincode: updated.pincode
          })
        });
        const addressPayload = await addressResponse.json();
        if (!addressResponse.ok) throw new Error(addressPayload?.message || 'Unable to save address');
      }

      onUpdateUser(updated);
      setProfileSavedToast(true);
      setTimeout(() => setProfileSavedToast(false), 3000);
    } catch (error) {
      setErrorMsg(error instanceof Error ? error.message : 'Unable to save profile right now.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden my-auto border border-stone-100">
        <div className="h-2 bg-gradient-to-r from-[#3B0B5C] via-[#641F96] to-[#E6C268]" />

        <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#641F96]/10 text-[#641F96] flex items-center justify-center font-bold">
              <User className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#E6C268] block">
                PRASHA HANDLOOM PATRON
              </span>
              <h2 className="text-xl font-serif font-bold text-stone-900">
                {currentUser ? 'My Account & Orders' : (authMode === 'login' ? 'Patron Sign In' : 'Join Handloom Circle')}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-900 rounded-full hover:bg-stone-100 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {currentUser ? (
          <div className="p-6 space-y-5">
            <div className="p-4 rounded-xl bg-gradient-to-br from-[#FAF8F5] to-[#F3EDE2] border border-[#E6C268]/40 flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-full bg-[#641F96] text-[#E6C268] font-serif font-bold text-lg flex items-center justify-center shadow-md">
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-stone-900 text-base">{currentUser.name}</h3>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-[#E6C268]/40 text-[#3B0B5C] border border-[#E6C268]">
                      {currentUser.tier || 'Silver Patron'}
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 flex items-center gap-2 mt-0.5">
                    <span>{currentUser.phone}</span>
                    <span>•</span>
                    <span>{currentUser.email}</span>
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  onLogout();
                  setSuccessMsg('Logged out successfully.');
                }}
                className="flex items-center gap-1 text-xs font-semibold text-stone-600 hover:text-red-600 p-2 rounded-lg hover:bg-white/80 transition-colors cursor-pointer"
                title="Log Out of your account"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Log Out</span>
              </button>
            </div>

            <div className="flex border-b border-stone-200">
              <button
                onClick={() => setAccountTab('orders')}
                className={`flex-1 pb-2.5 text-xs font-bold uppercase tracking-wider text-center cursor-pointer border-b-2 transition-all ${
                  accountTab === 'orders'
                    ? 'border-[#641F96] text-[#641F96]'
                    : 'border-transparent text-stone-400 hover:text-stone-700'
                }`}
              >
                My Orders ({ordersList.length})
              </button>
              <button
                onClick={() => setAccountTab('profile')}
                className={`flex-1 pb-2.5 text-xs font-bold uppercase tracking-wider text-center cursor-pointer border-b-2 transition-all ${
                  accountTab === 'profile'
                    ? 'border-[#641F96] text-[#641F96]'
                    : 'border-transparent text-stone-400 hover:text-stone-700'
                }`}
              >
                Profile & Saved Address
              </button>
            </div>

            {accountTab === 'orders' && (
              <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
                {ordersList.length === 0 ? (
                  <div className="text-center py-10 px-4 bg-stone-50 rounded-xl border border-dashed border-stone-200">
                    <Package className="w-10 h-10 text-stone-300 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-stone-700">No Orders Placed Yet</p>
                    <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto">
                      Explore our handloom heritage sarees and place an order to track live loom updates.
                    </p>
                    <button
                      onClick={onClose}
                      className="mt-4 px-4 py-2 bg-[#641F96] text-white text-xs font-bold rounded-lg hover:bg-[#3B0B5C] transition-colors cursor-pointer"
                    >
                      Browse Heritage Weaves
                    </button>
                  </div>
                ) : (
                  ordersList.map((ord) => (
                    <div
                      key={ord.orderId}
                      className="p-4 rounded-xl border border-stone-200 hover:border-[#E6C268] bg-white transition-all space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-mono font-bold text-[#641F96] bg-[#641F96]/10 px-2 py-0.5 rounded">
                            {ord.orderId}
                          </span>
                          <span className="text-xs text-stone-400 ml-2">{ord.createdAt}</span>
                        </div>
                        <span className="text-xs font-bold text-stone-900">
                          {formatPrice(ord.totalAmount, selectedCurrency)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs pt-1 border-t border-stone-100">
                        <div className="flex items-center gap-1.5 text-stone-600">
                          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                          <span className="font-medium text-stone-800">{ord.status}</span>
                        </div>

                        <button
                          onClick={() => {
                            onClose();
                            onOpenOrderTracking(ord);
                          }}
                          className="flex items-center gap-1 text-[11px] font-bold text-[#641F96] hover:text-[#3B0B5C] cursor-pointer"
                        >
                          <span>Track Order</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {accountTab === 'profile' && (
              <form onSubmit={handleSaveProfile} className="space-y-3">
                {profileSavedToast && (
                  <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Shipping address and profile updated successfully!</span>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg focus:outline-none focus:border-[#641F96]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 mb-1">Mobile Number</label>
                    <input
                      type="tel"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg focus:outline-none focus:border-[#641F96]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg focus:outline-none focus:border-[#641F96]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-1">Delivery Address</label>
                  <textarea
                    rows={2}
                    value={editAddress}
                    onChange={(e) => setEditAddress(e.target.value)}
                    placeholder="House/Flat No., Apartment, Street name"
                    className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg focus:outline-none focus:border-[#641F96]"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[10px] font-semibold text-stone-600 mb-1">City</label>
                    <input
                      type="text"
                      value={editCity}
                      onChange={(e) => setEditCity(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs border border-stone-200 rounded-lg focus:outline-none focus:border-[#641F96]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-stone-600 mb-1">State</label>
                    <input
                      type="text"
                      value={editState}
                      onChange={(e) => setEditState(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs border border-stone-200 rounded-lg focus:outline-none focus:border-[#641F96]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-stone-600 mb-1">Pincode</label>
                    <input
                      type="text"
                      value={editPincode}
                      onChange={(e) => setEditPincode(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs border border-stone-200 rounded-lg focus:outline-none focus:border-[#641F96]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 mt-2 bg-[#641F96] hover:bg-[#3B0B5C] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Save Shipping Information</span>
                </button>
              </form>
            )}
          </div>
        ) : (
          <div className="p-6 space-y-4">
            <div className="flex bg-stone-100 p-1 rounded-lg">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('login');
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
                  authMode === 'login'
                    ? 'bg-white text-[#641F96] shadow-xs'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode('register');
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
                  authMode === 'register'
                    ? 'bg-white text-[#641F96] shadow-xs'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                Create Account
              </button>
            </div>

            {(loginPrompt || errorMsg) && (
              <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs">
                {errorMsg || loginPrompt}
              </div>
            )}
            {successMsg && (
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs">
                {successMsg}
              </div>
            )}

            {authMode === 'login' ? (
              <div className="space-y-3">
                <form onSubmit={handlePasswordLogin} className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        placeholder="you@example.com"
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:border-[#641F96]"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Password
                      </label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:border-[#641F96]"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-2.5 bg-[#641F96] hover:bg-[#3B0B5C] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <span>Sign In</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                </form>
              </div>
            ) : (
              <form onSubmit={handleRegister} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Radhika Sen"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:border-[#641F96]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Mobile Number
                  </label>
                  <div className="flex rounded-lg border border-stone-300 focus-within:border-[#641F96] overflow-hidden">
                    <span className="px-3 py-2 bg-stone-100 text-xs font-semibold text-stone-600 border-r border-stone-300 flex items-center">
                      +91
                    </span>
                    <input
                      type="tel"
                      maxLength={10}
                      placeholder="10-digit mobile"
                      value={phoneInput}
                      onChange={(e) => setPhoneInput(e.target.value)}
                      className="flex-1 px-3 py-2 text-xs text-stone-900 focus:outline-none"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="radhika@example.com"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:border-[#641F96]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Create Password
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:border-[#641F96]"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#641F96] hover:bg-[#3B0B5C] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <span>Create Patron Account</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#E6C268]" />
                </button>
              </form>
            )}

            <div className="pt-2 border-t border-stone-100 flex items-center justify-center gap-4 text-[10px] text-stone-500">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                100% Secure Handloom Checkout
              </span>
              <span>•</span>
              <span>Silk Mark Certified</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

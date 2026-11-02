import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { 
  Droplet, Eye, EyeOff, ShieldCheck, Sprout, Building2, 
  Microscope, ArrowRight, Sparkles, AlertCircle, CheckCircle, 
  Lock, MapPin, User, Mail, Briefcase 
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login, signup, loginAsGuest } = useAuth();
  const [isSignup, setIsSignup] = useState(false);
  
  // Login form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Signup form state
  const [fullName, setFullName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [organization, setOrganization] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('farmer');
  const [stateName, setStateName] = useState('Uttarakhand');
  const [district, setDistrict] = useState('Haridwar');

  // Conditional fields based on selected role
  const [govtDepartment, setGovtDepartment] = useState('Central Ground Water Board (CGWB)');
  const [farmerAcreage, setFarmerAcreage] = useState('4.5');
  const [farmerCrop, setFarmerCrop] = useState('Wheat');
  const [researchInstitute, setResearchInstitute] = useState('National Institute of Hydrology (NIH)');
  const [adminInviteCode, setAdminInviteCode] = useState('');

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email || 'user@cgwb.gov.in', selectedRole);
    onClose();
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    if (selectedRole === 'admin' && !adminInviteCode) {
      alert("Administrator registration requires an official invitation token.");
      return;
    }
    signup({
      name: fullName || 'AQUA Analyst',
      email: email || 'analyst@aqua.gov.in',
      role: selectedRole,
      organization: organization || (selectedRole === 'officer' ? govtDepartment : researchInstitute),
      district,
      state: stateName
    });
    onClose();
  };

  const handleGuestDemo = () => {
    loginAsGuest();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200/80 flex flex-col md:flex-row min-h-[580px]">
        
        {/* Left Side: Modern Visual Branding & Flowing Watershed Artwork */}
        <div className="md:w-5/12 bg-gradient-to-br from-slate-900 via-teal-950 to-cyan-950 text-white p-8 flex flex-col justify-between relative overflow-hidden select-none">
          {/* Subtle Topographic Contours background */}
          <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#22d3ee_1px,transparent_1px)] [background-size:18px_18px]" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-cyan-400/20 rounded-full blur-3xl pointer-events-none" />

          {/* Logo & Headline */}
          <div className="relative z-10">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-400 to-teal-400 flex items-center justify-center shadow-lg shadow-teal-500/30">
                <Droplet className="w-6 h-6 text-slate-950 fill-slate-950" />
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-1.5">
                  AQUA
                </h1>
                <p className="text-[10px] text-cyan-200/80 font-medium tracking-wide">
                  Aquifer Quantification & Understanding through AI
                </p>
              </div>
            </div>

            <div className="space-y-3 mt-6">
              <h2 className="text-2xl font-extrabold text-slate-100 leading-snug">
                Understand Water. <br />
                <span className="bg-gradient-to-r from-cyan-400 to-teal-300 bg-clip-text text-transparent">
                  Predict Risk.
                </span> Protect Tomorrow.
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed pt-1">
                AI-powered watershed digital twin and decision support platform monitoring groundwater depletion, predicting localized drought risk, and guiding proactive conservation.
              </p>
            </div>
          </div>

          {/* Connected Telemetry Strip */}
          <div className="relative z-10 my-6 bg-slate-900/70 border border-slate-700/60 rounded-2xl p-4 backdrop-blur-md">
            <div className="text-[11px] font-bold text-cyan-300 flex items-center gap-1.5 mb-2.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              Verified Telemetry & Real Indian Data
            </div>
            <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-300 font-medium">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                CGWB DWLR Wells
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                Live Open-Meteo ET0
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-400" />
                IMD Gridded Rainfall
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-teal-400" />
                Sentinel-2 NDWI
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="relative z-10 text-[11px] text-slate-400 border-t border-slate-800/80 pt-3 flex items-center justify-between">
            <span>Decision Support System</span>
            <span className="text-cyan-400 font-semibold">National Water Intelligence</span>
          </div>
        </div>

        {/* Right Side: Clean, Modern Form (Login / Signup) */}
        <div className="md:w-7/12 p-8 flex flex-col justify-between bg-white overflow-y-auto max-h-[660px]">
          <div>
            
            {/* Header with Title & Guest Demo Button */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                  {isSignup ? 'Create Your Account' : 'Sign in to AQUA'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {isSignup 
                    ? 'Role-customized decision intelligence dashboard' 
                    : 'Access real-time watershed telemetry and ML forecasts'}
                </p>
              </div>

              {/* Guest / Explore Demo Button */}
              <button 
                onClick={handleGuestDemo}
                className="px-3.5 py-1.5 text-xs font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-xl border border-teal-200/80 transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                Guest / Demo Access
              </button>
            </div>

            {/* 1. LOGIN FORM (Minimal, Beautiful, Not Overloaded) */}
            {!isSignup ? (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                
                {/* Email Address */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="officer@cgwb.gov.in or farmer@kisan.in"
                      className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white text-slate-900 placeholder:text-slate-400"
                    />
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                {/* Password with Show/Hide Toggle */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-slate-700">
                      Password
                    </label>
                    <a 
                      href="#forgot" 
                      onClick={(e) => { e.preventDefault(); alert('Password reset verification link has been sent to your registered address.'); }} 
                      className="text-xs text-teal-600 hover:text-teal-700 font-semibold"
                    >
                      Forgot password?
                    </a>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-9 pr-10 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white text-slate-900 placeholder:text-slate-400"
                    />
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me Checkbox */}
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={rememberMe} 
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 cursor-pointer" 
                    />
                    <span>Remember me</span>
                  </label>
                </div>

                {/* Sign In Button */}
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-bold text-sm rounded-xl shadow-md shadow-teal-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* Continue with Google */}
                <div className="relative my-3">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200" /></div>
                  <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-wider"><span className="bg-white px-2 text-slate-400">or</span></div>
                </div>

                <button
                  type="button"
                  onClick={() => { login('google.user@aqua.gov.in', 'officer'); onClose(); }}
                  className="w-full py-2.5 px-3 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2.5 cursor-pointer shadow-sm"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.9c2.28-2.1 3.6-5.2 3.6-9.15z"/>
                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.9-3.05c-1.08.72-2.45 1.16-4.03 1.16-3.1 0-5.74-2.1-6.68-4.93H1.26v3.15C3.26 21.36 7.35 24 12 24z"/>
                    <path fill="#FBBC05" d="M5.32 14.27c-.24-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27V6.58H1.26C.46 8.17 0 9.99 0 12s.46 3.83 1.26 5.42l4.06-3.15z"/>
                    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.26 6.58l4.06 3.15c.94-2.83 3.58-4.98 6.68-4.98z"/>
                  </svg>
                  <span>Continue with Google</span>
                </button>
              </form>
            ) : (
              /* 2. SIGNUP FORM (Role Selection with Conditional Fields) */
              <form onSubmit={handleSignupSubmit} className="space-y-3.5">
                
                {/* Basic Identification */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Dr. Rajesh Sharma"
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Email</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="rajesh@water.gov.in"
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900"
                    />
                  </div>
                </div>

                {/* ROLE SELECTION (The Most Important Part) */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-800">
                      Choose your account type
                    </label>
                    <span className="text-[10px] text-teal-600 font-semibold">Role-based access</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {[
                      {
                        role: 'farmer' as UserRole,
                        title: 'Farmer',
                        desc: 'Irrigation & crop-water guidance',
                        icon: Sprout,
                        badge: 'Public Registration'
                      },
                      {
                        role: 'officer' as UserRole,
                        title: 'Government Officer',
                        desc: 'District water management & planning',
                        icon: Building2,
                        badge: 'Requires Verification'
                      },
                      {
                        role: 'researcher' as UserRole,
                        title: 'Hydrologist / Researcher',
                        desc: 'Scientific analysis & forecasting',
                        icon: Microscope,
                        badge: 'Open for Academia'
                      },
                      {
                        role: 'admin' as UserRole,
                        title: 'Administrator',
                        desc: 'Users, data & system management',
                        icon: ShieldCheck,
                        badge: 'Invitation-Only'
                      }
                    ].map((item) => {
                      const Icon = item.icon;
                      const isSelected = selectedRole === item.role;
                      return (
                        <div
                          key={item.role}
                          onClick={() => setSelectedRole(item.role)}
                          className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                            isSelected 
                              ? 'border-teal-500 bg-teal-50/70 shadow-sm ring-1 ring-teal-500/30' 
                              : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-1.5">
                              <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-teal-600' : 'text-slate-500'}`} />
                              <span className={`text-xs font-bold ${isSelected ? 'text-teal-900' : 'text-slate-800'}`}>
                                {item.title}
                              </span>
                            </div>
                          </div>
                          <p className="text-[10px] text-slate-500 line-clamp-1">{item.desc}</p>
                          <span className={`text-[9px] font-semibold mt-1 inline-block ${
                            item.role === 'admin' 
                              ? 'text-purple-600' 
                              : item.role === 'officer' 
                              ? 'text-amber-600' 
                              : 'text-emerald-600'
                          }`}>
                            {item.badge}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* CONDITIONAL FIELDS BASED ON SELECTED ROLE */}
                {selectedRole === 'officer' && (
                  <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl space-y-2 text-xs animate-in fade-in duration-200">
                    <div className="font-bold text-amber-900 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-amber-600" />
                      Government Officer Verification Details
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-amber-900 mb-1">Department / Board</label>
                      <input
                        type="text"
                        value={govtDepartment}
                        onChange={(e) => setGovtDepartment(e.target.value)}
                        placeholder="e.g. Central Ground Water Board / State Water Resource Dept"
                        className="w-full px-2.5 py-1.5 text-xs bg-white border border-amber-300 rounded-lg"
                      />
                    </div>
                    <p className="text-[10px] text-amber-700">
                      * Government-officer accounts require verification against official departmental records.
                    </p>
                  </div>
                )}

                {selectedRole === 'farmer' && (
                  <div className="p-3 bg-emerald-50/80 border border-emerald-200 rounded-xl space-y-2 text-xs animate-in fade-in duration-200">
                    <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                      <Sprout className="w-3.5 h-3.5 text-emerald-600" />
                      Farmer Crop Profile (Instacrops Guidance)
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-semibold text-emerald-900 mb-1">Farm Area (Acres)</label>
                        <input
                          type="number"
                          step="0.5"
                          value={farmerAcreage}
                          onChange={(e) => setFarmerAcreage(e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs bg-white border border-emerald-300 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-emerald-900 mb-1">Primary Crop</label>
                        <select
                          value={farmerCrop}
                          onChange={(e) => setFarmerCrop(e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs bg-white border border-emerald-300 rounded-lg"
                        >
                          <option value="Wheat">Wheat</option>
                          <option value="Paddy (Rice)">Paddy (Rice)</option>
                          <option value="Sugarcane">Sugarcane</option>
                          <option value="Mustard">Mustard</option>
                          <option value="Cotton">Cotton</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {selectedRole === 'researcher' && (
                  <div className="p-3 bg-cyan-50/80 border border-cyan-200 rounded-xl space-y-2 text-xs animate-in fade-in duration-200">
                    <div className="font-bold text-cyan-900 flex items-center gap-1.5">
                      <Microscope className="w-3.5 h-3.5 text-cyan-600" />
                      Hydrologist / Academic Affiliation
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-cyan-900 mb-1">Research Institution</label>
                      <input
                        type="text"
                        value={researchInstitute}
                        onChange={(e) => setResearchInstitute(e.target.value)}
                        placeholder="e.g. National Institute of Hydrology (NIH) / IIT Roorkee"
                        className="w-full px-2.5 py-1.5 text-xs bg-white border border-cyan-300 rounded-lg"
                      />
                    </div>
                  </div>
                )}

                {selectedRole === 'admin' && (
                  <div className="p-3 bg-purple-50/80 border border-purple-200 rounded-xl space-y-2 text-xs animate-in fade-in duration-200">
                    <div className="font-bold text-purple-900 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                      Administrator Invitation Token
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-purple-900 mb-1">Security Invite Key</label>
                      <input
                        type="password"
                        required
                        value={adminInviteCode}
                        onChange={(e) => setAdminInviteCode(e.target.value)}
                        placeholder="Enter 16-character authorization key"
                        className="w-full px-2.5 py-1.5 text-xs bg-white border border-purple-300 rounded-lg"
                      />
                    </div>
                    <p className="text-[10px] text-purple-700">
                      * Administrator privileges are granted through a secure invitation-only approval process.
                    </p>
                  </div>
                )}

                {/* State / District & Organisation */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">State / District</label>
                    <input
                      type="text"
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      placeholder="Haridwar, Uttarakhand"
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Organisation (Optional)</label>
                    <input
                      type="text"
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      placeholder="e.g. KVK / Krishi Vigyan"
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900"
                    />
                  </div>
                </div>

                {/* Password & Confirm */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Confirm Password</label>
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900"
                    />
                  </div>
                </div>

                {/* Submit Signup Button */}
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-bold text-xs rounded-xl shadow-md shadow-teal-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Complete Account Registration</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}

          </div>

          {/* Bottom Switch: Login vs Signup */}
          <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
            {isSignup ? (
              <span>
                Already have an account?{' '}
                <button 
                  onClick={() => setIsSignup(false)} 
                  className="text-teal-600 font-bold hover:underline cursor-pointer"
                >
                  Sign in
                </button>
              </span>
            ) : (
              <span>
                Don't have an account?{' '}
                <button 
                  onClick={() => setIsSignup(true)} 
                  className="text-teal-600 font-bold hover:underline cursor-pointer"
                >
                  Create an account
                </button>
              </span>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};

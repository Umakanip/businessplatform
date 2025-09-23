// src/components/Register.tsx

import React, { useState, useRef, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

// Import Font Awesome icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faEye, faEyeSlash, faSpinner, faUpload } from '@fortawesome/free-solid-svg-icons';

import login from "../../assest/logimage.webp";
import { State, City } from 'country-state-city';

interface RegisterProps {
  onSwitchToLogin: () => void;
}

interface FormData {
  role: 'investor' | 'ideaholder';
  name: string;
  email: string;
  confirmEmail: string;
  password: string;
  primaryPhone: string;
  secondaryPhone: string;
  categories: string[];
  profileImage: File | null;
  bio: string;
  state: string;
  city: string;
}

const Register: React.FC<RegisterProps> = ({ onSwitchToLogin }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    role: 'investor',
    name: '',
    email: '',
    confirmEmail: '',
    password: '',
    primaryPhone: '',
    secondaryPhone: '',
    categories: [],
    profileImage: null,
    bio: '',
    state: '',
    city: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [isCategoriesDropdownOpen, setIsCategoriesDropdownOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const categories = [
    'IT & Technology', 'Business & Finance', 'Healthcare & Medicine', 'Education & Training',
    'Real Estate', 'Manufacturing', 'Retail & E-commerce', 'Entertainment & Media',
    'Food & Beverage', 'Transportation & Logistics', 'Energy & Environment', 'Other'
  ];
const [statesList, setStatesList] = useState<any[]>([]);
const [citiesList, setCitiesList] = useState<any[]>([]);

useEffect(() => {
  const indianStates = State.getStatesOfCountry("IN"); // Only India
  setStatesList(indianStates);
}, []);

const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  const selectedState = e.target.value;
  setFormData({ ...formData, state: selectedState, city: '' });
  
  const cities = City.getCitiesOfState("IN", selectedState);
  setCitiesList(cities);
};


  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsCategoriesDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name as keyof FormData]) setErrors({ ...errors, [name]: undefined });
    setApiError(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, profileImage: e.target.files?.[0] || null });
  };

  const handleCategorySelection = (category: string) => {
    const newCategories = formData.categories.includes(category)
      ? formData.categories.filter(c => c !== category)
      : [...formData.categories, category];
    setFormData({ ...formData, categories: newCategories });
    if (newCategories.length > 0) setErrors({ ...errors, categories: undefined });
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.name.trim()) newErrors.name = "Full name is required";
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
    if (formData.email !== formData.confirmEmail) newErrors.confirmEmail = "Emails do not match";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 8) newErrors.password = "Password must be at least 8 characters";
    if (!formData.primaryPhone) newErrors.primaryPhone = "Primary phone is required";
    else if (!/^\d{10}$/.test(formData.primaryPhone)) newErrors.primaryPhone = "Phone must be exactly 10 digits";
    if (formData.categories.length === 0) newErrors.categories = ['Please select at least one category'];
    if (formData.role === "investor" && !formData.bio.trim()) newErrors.bio = "Bio is required for investors";
if (!formData.state) newErrors.state = "State is required";
if (!formData.city) newErrors.city = "City is required";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      Swal.fire({ icon: "error", title: "Oops!", text: "Please fix the errors.", timer: 2000, showConfirmButton: false });
      return false;
    }

    return true;
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!validateForm()) return;
  setIsLoading(true);
  setApiError(null);

  try {
    const formDataToSend = new FormData();
    formDataToSend.append("role", formData.role);
    formDataToSend.append("name", formData.name);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("password", formData.password);
    formDataToSend.append("primaryPhone", formData.primaryPhone);
    formDataToSend.append("secondaryPhone", formData.secondaryPhone);
    formDataToSend.append("categories", JSON.stringify(formData.categories));
    formDataToSend.append("state", formData.state);  // ✅ Add this
    formDataToSend.append("city", formData.city);    // ✅ Add this
    if (formData.profileImage) formDataToSend.append("profileImage", formData.profileImage);
    if (formData.role === "investor") formDataToSend.append("bio", formData.bio);

    await axiosInstance.post("/auth/register", formDataToSend, { 
      headers: { "Content-Type": "multipart/form-data" } 
    });

    Swal.fire({ 
      icon: "success", 
      title: "Registration Successful!", 
      text: "Your account has been created.", 
      timer: 2000, 
      showConfirmButton: false, 
      position: "center" 
    });
    onSwitchToLogin();
  } catch (error: any) {
    console.error("Registration error:", error);
    Swal.fire({ 
      icon: "error", 
      title: "Registration Failed", 
      text: error.response?.data?.message || "Something went wrong. Please try again.", 
      confirmButtonText: "Close", 
      position: "center" 
    });
  } finally { 
    setIsLoading(false); 
  }
};


  const triggerFileInput = () => { fileInputRef.current?.click(); };

  const getSelectedCategoriesText = () => {
    if (formData.categories.length === 0) return "Select categories...";
    const selectedCount = formData.categories.length;
    const firstCategory = formData.categories[0];
    return selectedCount > 1 ? `${firstCategory} + ${selectedCount - 1} more` : firstCategory;
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ backgroundImage: `url(${login})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      {/* Full screen background overlay */}
      <div className="absolute inset-0 bg-black opacity-30"></div>

      {/* Main content card */}
      <div className="relative z-10 bg-white dark:bg-gray-800 shadow-2xl rounded-2xl overflow-hidden max-w-6xl w-full m-4 flex flex-col md:flex-row">

        {/* Left Side - Image with a new subtle gradient overlay */}
        <div
          className="hidden md:block w-full md:w-1/2 relative rounded-l-2xl"
          style={{
            backgroundImage: `url(${login})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          {/* Subtle gradient overlay from black to transparent */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70 rounded-l-2xl"></div>

          <div className="absolute inset-0 flex items-end justify-start text-white p-8">
            <div className="text-left mb-8">
              <h3 className="text-3xl font-bold mb-4">"Ideas are the seeds of the future."</h3>
              <p className="text-lg leading-relaxed">Join us to grow your ideas into reality. Connect with investors and bring your vision to life. Let's innovate together!</p>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white dark:bg-gray-800">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Create Your Account
            </h2>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Join our platform as an Investor or Idea Holder
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {apiError && (
              <div className="bg-red-100 text-red-700 p-3 rounded-lg text-center dark:bg-red-900 dark:text-red-200">
                {apiError}
              </div>
            )}

            {/* Role selection */}
            <div className="grid grid-cols-2 gap-4">
              <button type="button" onClick={() => setFormData({ ...formData, role: 'investor' })}
                className={`p-4 rounded-lg border-2 font-medium transition-all duration-200 ${formData.role === 'investor' ? 'border-blue-600 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : 'border-gray-300 text-gray-600 hover:border-blue-500 dark:border-gray-600 dark:text-gray-400 dark:hover:border-blue-400'}`}>
                Investor
              </button>
              <button type="button" onClick={() => setFormData({ ...formData, role: 'ideaholder' })}
                className={`p-4 rounded-lg border-2 font-medium transition-all duration-200 ${formData.role === 'ideaholder' ? 'border-blue-600 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : 'border-gray-300 text-gray-600 hover:border-blue-500 dark:border-gray-600 dark:text-gray-400 dark:hover:border-blue-400'}`}>
                Idea Holder
              </button>
            </div>

            {/* Form fields in a 2-column grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              {/* Categories */}
              <div className="relative" ref={dropdownRef}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Categories *</label>
                <button
                  type="button"
                  onClick={() => setIsCategoriesDropdownOpen(!isCategoriesDropdownOpen)}
                  className={`w-full text-left px-3 py-2 border rounded-lg flex justify-between items-center bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.categories ? 'border-red-500' : 'border-gray-300'}`}
                >
                  <span className="truncate">{getSelectedCategoriesText()}</span>
                  <FontAwesomeIcon icon={faCaretDown} />
                </button>
                {isCategoriesDropdownOpen && (
                  <ul className="absolute z-20 mt-1 w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg max-h-40 overflow-y-auto shadow-lg">
                    {categories.map(c => (
                      <li
                        key={c}
                        className="px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center text-gray-900 dark:text-gray-200"
                        onClick={() => handleCategorySelection(c)}
                      >
                        <input type="checkbox" checked={formData.categories.includes(c)} readOnly className="mr-2" />
                        <span className="truncate">{c}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {errors.categories && <p className="text-red-500 text-sm mt-1">{errors.categories}</p>}
              </div>

              {/* Email / Confirm Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email *</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="you@example.com"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.email ? 'border-red-500' : 'border-gray-300'}`} />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm Email *</label>
                <input type="email" name="confirmEmail" value={formData.confirmEmail} onChange={handleChange} placeholder="confirm your email"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.confirmEmail ? 'border-red-500' : 'border-gray-300'}`} />
                {errors.confirmEmail && <p className="text-red-500 text-sm mt-1">{errors.confirmEmail}</p>}
              </div>
            </div>

            {/* Password - now a full-width input field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password *</label>
              <div className="mt-1 relative rounded-lg shadow-sm">
                <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} placeholder="Create a strong password"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.password ? 'border-red-500' : 'border-gray-300'}`} />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 dark:text-gray-400 text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="h-5 w-5" />
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            {/* Phones and Image - new multi-column layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
              {/* Primary Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Primary Phone *</label>
                <input type="tel" name="primaryPhone" value={formData.primaryPhone} onChange={handleChange} placeholder="Enter primary phone"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.primaryPhone ? 'border-red-500' : 'border-gray-300'}`} />
                {errors.primaryPhone && <p className="text-red-500 text-sm mt-1">{errors.primaryPhone}</p>}
              </div>

              {/* Secondary Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Secondary Phone</label>
                <input type="tel" name="secondaryPhone" value={formData.secondaryPhone} onChange={handleChange} placeholder="Optional"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
              </div>
            </div>

            {/* Profile Image - positioned below phones */}
            {/* <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Profile Image</label>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center dark:border-gray-600">
                  {formData.profileImage ? (
                    <img src={URL.createObjectURL(formData.profileImage)} alt="Profile" className="w-full h-full object-cover rounded-full" />
                  ) : (
                    <FontAwesomeIcon icon={faUpload} className="text-gray-400 dark:text-gray-500 text-xl" />
                  )}
                </div>
                <button type="button" onClick={triggerFileInput} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 transition-all duration-200">Choose Image</button>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              </div>
            </div> */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  {/* State */}
<div>
  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">State *</label>
 <select
  name="state"
  value={formData.state}
  onChange={handleStateChange} // <-- use this
  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.state ? 'border-red-500' : 'border-gray-300'}`}
>
  <option value="">Select State</option>
  {statesList.map((state) => (
    <option key={state.isoCode} value={state.isoCode}>{state.name}</option>
  ))}
</select>

  {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
</div>


  {/* City */}
 <div>
  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">City *</label>
  <input
    type="text"
    name="city"
    value={formData.city}
    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
    placeholder={formData.state ? "Enter city" : "Select state first"}
    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.city ? 'border-red-500' : 'border-gray-300'}`}
    disabled={!formData.state}
  />
  {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
</div>

</div>


            {/* Bio for investors */}
            {formData.role === 'investor' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bio *</label>
                <textarea name="bio" value={formData.bio} onChange={handleChange} rows={3} placeholder="Tell us about your investment interests, experience, and what you're looking for in an idea."
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.bio ? 'border-red-500' : 'border-gray-300'}`} />
                {errors.bio && <p className="text-red-500 text-sm mt-1">{errors.bio}</p>}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white ${isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'}`}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <FontAwesomeIcon icon={faSpinner} className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                  Creating account...
                </div>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <button onClick={onSwitchToLogin} className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
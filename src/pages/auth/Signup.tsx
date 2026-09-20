import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, Building, UserPlus } from 'lucide-react';
import { signUp } from '../../lib/supabase';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import toast from 'react-hot-toast';

const Signup: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [department, setDepartment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const userData = {
        first_name: firstName,
        last_name: lastName,
        department,
        role: 'employee', // Default role for new users
      };

      const { data, error } = await signUp(email, password, userData);
      
      if (error) {
        throw error;
      }
      
      if (data) {
        toast.success('Account created successfully. Please sign in.');
        navigate('/login');
      }
    } catch (err: any) {
      console.error('Signup error:', err);
      setError(err.message || 'Failed to create account. Please try again.');
      toast.error('Signup failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h3 className="text-xl font-medium text-gray-900 mb-6">Create a new account</h3>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 text-sm">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            id="firstName"
            type="text"
            label="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="John"
            required
            leftIcon={<User size={16} />}
            disabled={isLoading}
          />
          
          <Input
            id="lastName"
            type="text"
            label="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Doe"
            required
            leftIcon={<User size={16} />}
            disabled={isLoading}
          />
        </div>
        
        <Input
          id="email"
          type="email"
          label="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          leftIcon={<Mail size={16} />}
          disabled={isLoading}
        />
        
        <Input
          id="department"
          type="text"
          label="Department"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          placeholder="IT Department"
          required
          leftIcon={<Building size={16} />}
          disabled={isLoading}
        />
        
        <Input
          id="password"
          type="password"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          leftIcon={<Lock size={16} />}
          disabled={isLoading}
          hint="Password should be at least 6 characters long"
        />
        
        <Button 
          type="submit" 
          fullWidth 
          isLoading={isLoading}
          rightIcon={<UserPlus size={16} />}
        >
          Create Account
        </Button>
      </form>
      
      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">
              Already have an account?
            </span>
          </div>
        </div>
        
        <div className="mt-6">
          <Link to="/login">
            <Button variant="outline" fullWidth>
              Sign in
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react'; // 仅保留 ArrowLeft，用于返回按钮图标
import { loginUser, forgotPassword } from '../lib/api';

interface LoginFormProps {
  onLogin: (userData: any) => void;
  onBack: () => void;
}

function LoginForm({ onLogin, onBack }: LoginFormProps) {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isRecovering, setIsRecovering] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const user = await loginUser(formData.username, formData.password);
      onLogin(user);
    } catch (err: any) {
      console.error('Login error:', err);
      setError(
          err.response?.data?.error ||
          'An error occurred during login. Please try again.'
      );
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.username) {
      setError('Please enter your username');
      return;
    }

    try {
      await forgotPassword(formData.username);
      setSuccess(
          'Password recovery email has been sent to your registered email address.'
      );
      setIsRecovering(false);
    } catch (err: any) {
      console.error('Password recovery error:', err);
      setError(
          err.response?.data?.error ||
          'Password recovery failed. Please try again.'
      );
    }
  };

  return (
      <div className="max-w-md mx-auto">
        <div className="bg-white p-8 rounded-lg shadow-md">
          {/* 返回主菜单按钮 */}
          <button
              onClick={onBack}
              className="mb-8 flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="mr-2" size={20} />
            Back to Main Menu
          </button>
          
          <h2 className="text-2xl font-bold mb-6 text-center">
            {isRecovering ? 'Password Recovery' : 'Sign In'}
          </h2>

          {/* 错误提示 */}
          {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
          )}
          {/* 成功提示 */}
          {success && (
              <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                {success}
              </div>
          )}

          <form
              onSubmit={isRecovering ? handleForgotPassword : handleSubmit}
              className="max-w-sm mx-auto"
          >
            {/* 用户名输入框 */}
            <div className="mb-4">
              <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="username"
              >
                Username
              </label>
              <input
                  type="text"
                  id="username"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.username}
                  onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                  }
                  required
              />
            </div>

            {/* 密码输入框（仅在非恢复模式下显示） */}
            {!isRecovering && (
                <div className="mb-6">
                  <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="password"
                  >
                    Password
                  </label>
                  <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={formData.password}
                      onChange={(e) =>
                          setFormData({ ...formData, password: e.target.value })
                      }
                      required
                  />
                  {/* 在密码框下方右侧显示"显示/隐藏密码"文字按钮 */}
                  <div className="mt-1 text-right">
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      {showPassword ? 'Hide Password' : 'Show Password'}
                    </button>
                  </div>
                </div>
            )}

            {/* 提交按钮 */}
            <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mb-4"
            >
              {isRecovering ? 'Recover Password' : 'Sign In'}
            </button>

            {/* 忘记密码/返回登录按钮 */}
            <button
                type="button"
                onClick={() => setIsRecovering(!isRecovering)}
                className="w-full text-blue-600 hover:text-blue-800 text-sm"
            >
              {isRecovering
                  ? 'Back to Sign In'
                  : 'Forgot Password? Click here to recover'}
            </button>
          </form>
        </div>
      </div>
  );
}

export default LoginForm;

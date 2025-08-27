import { useState, useEffect } from 'react';

export default function VerifyEmail() {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [minutes, setMinutes] = useState(2);
  const [seconds, setSeconds] = useState(0);

  // Timer countdown effect
  useEffect(() => {
    const timer = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      } else if (minutes > 0) {
        setMinutes(minutes - 1);
        setSeconds(59);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [minutes, seconds]);

  const handleInputChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);
      
      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`code-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleVerify = () => {
    const fullCode = code.join('');
    if (fullCode.length === 6) {
      alert(`Verification code entered: ${fullCode}`);
    } else {
      alert('Please enter the complete 6-digit code');
    }
  };

  const handleResend = () => {
    setMinutes(2);
    setSeconds(0);
    setCode(['', '', '', '', '', '']);
    alert('Verification code resent!');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-3">
            Verify your email
          </h1>
          <p className="text-gray-600 text-sm leading-relaxed">
            We've sent a 6-digit code to your email. Please enter it below to verify your account.
          </p>
        </div>

        <div className="mb-8">
          <div className="flex justify-center gap-3 mb-6">
            {code.map((digit, index) => (
              <input
                key={index}
                id={`code-${index}`}
                type="text"
                value={digit}
                onChange={(e) => handleInputChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-12 text-center text-lg font-semibold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                maxLength="1"
              />
            ))}
          </div>

          <div className="flex justify-center gap-8 mb-6">
            <div className="text-center">
              <div className="bg-gray-100 rounded-lg px-4 py-3 mb-2">
                <span className="text-2xl font-bold text-gray-800">
                  {minutes.toString().padStart(2, '0')}
                </span>
              </div>
              <p className="text-sm text-gray-600">Minutes</p>
            </div>
            
            <div className="text-center">
              <div className="bg-gray-100 rounded-lg px-4 py-3 mb-2">
                <span className="text-2xl font-bold text-gray-800">
                  {seconds.toString().padStart(2, '0')}
                </span>
              </div>
              <p className="text-sm text-gray-600">Seconds</p>
            </div>
          </div>

          <div className="text-center mb-6">
            <span className="text-sm text-gray-500">Didn't receive the code? </span>
            <button 
              onClick={handleResend}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Resend
            </button>
          </div>

          <button
            onClick={handleVerify}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
          >
            Verify
          </button>
        </div>
      </div>
    </div>
  );
}
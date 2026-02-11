import { useState } from "react";
import { UserPlus, Mail, Lock, User, Eye, EyeClosed } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "../store/useAuthStore";
import { signupSchema } from "../const/schemas";
import { Link } from "react-router-dom";

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { signup, isSigningUp } = useAuthStore();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signupSchema),
    mode: "onSubmit",
  });

  const onSubmit = async (data) => {
    try {
      await signup(data);
    } catch (error) {
      const { field, message } = error.response?.data || {};

      if (field) {
        setError(field, { message });
      } else {
        setError("root", { message: message || "Signup failed" });
      }
    }
  };

  return (
    <div className="flex w-full h-full">
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-3">
              Create Account
            </h1>
            <p className="text-slate-400 text-lg">Sign up for a new account</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  {...register("fullName")}
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-800/50 border border-slate-700 rounded-xl text-white"
                  placeholder="Enter your full name"
                />
              </div>
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-400">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  {...register("email")}
                  type="email"
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-800/50 border border-slate-700 rounded-xl text-white"
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-400">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  className="w-full pl-12 pr-12 py-3.5 bg-slate-800/50 border border-slate-700 rounded-xl text-white"
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-700/40 transition-colors"
                >
                  {showPassword ? (
                    <EyeClosed className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-400">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Form-level error */}
            {errors.root && (
              <p className="text-sm text-red-400 text-left">
                {errors.root.message}
              </p>
            )}

            <button
              type="submit"
              disabled={isSigningUp}
              className="w-full py-4 bg-linear-to-r from-cyan-500 to-teal-500 rounded-xl font-semibold"
            >
              {isSigningUp ? "Creating account..." : "Create Account"}
            </button>
            <p className="text-center text-slate-400">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-cyan-400 hover:text-cyan-300 font-medium"
              >
                Log in
              </Link>
            </p>
          </form>
        </div>
      </div>

      <div className="hidden lg:flex flex-1 bg-linear-to-br from-cyan-900/20 to-teal-900/20 items-center justify-center p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iIzA2YjZkNCIgc3Ryb2tlLW9wYWNpdHk9Ii4xIi8+PC9nPjwvc3ZnPg==')] opacity-30"></div>

        <div className="relative z-10 text-center max-w-lg">
          <div className="mb-8 flex items-center justify-center">
            <div className="w-32 h-32 bg-linear-to-br from-cyan-500/20 to-teal-500/20 rounded-3xl flex items-center justify-center backdrop-blur-sm border border-cyan-500/20">
              <UserPlus className="w-16 h-16 text-cyan-400" />
            </div>
          </div>

          <h2 className="text-4xl font-bold text-white mb-4">
            Start Your Journey Today
          </h2>
          <p className="text-slate-300 text-lg mb-8">
            Join thousands of users already chatting on our platform
          </p>

          <div className="flex items-center justify-center gap-4 flex-wrap">
            <div className="px-6 py-3 bg-slate-800/50 backdrop-blur-sm rounded-full border border-slate-700 text-slate-300 font-medium">
              Free
            </div>
            <div className="px-6 py-3 bg-slate-800/50 backdrop-blur-sm rounded-full border border-slate-700 text-slate-300 font-medium">
              Easy Setup
            </div>
            <div className="px-6 py-3 bg-slate-800/50 backdrop-blur-sm rounded-full border border-slate-700 text-slate-300 font-medium">
              Private
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

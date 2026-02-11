import FloatingShape from "./FloatingShape";

const Loading = ({ text = "Checking authentication..." }) => {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <FloatingShape
        color="bg-cyan-500"
        size="w-72 h-72"
        top="5%"
        left="15%"
        delay={0}
      />
      <FloatingShape
        color="bg-teal-400"
        size="w-56 h-56"
        top="65%"
        left="75%"
        delay={4}
      />
      <FloatingShape
        color="bg-blue-400"
        size="w-40 h-40"
        top="35%"
        left="-5%"
        delay={2}
      />
      <div className="w-full max-w-7xl h-[90vh] bg-slate-900/50 backdrop-blur-2xl rounded-3xl shadow-2xl border border-slate-700/50 flex items-center justify-center">
        <div className="relative flex flex-col items-center gap-4 px-10 py-8 rounded-3xl bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 shadow-xl">
          {/* Glow */}
          <div className="absolute inset-0 rounded-3xl bg-cyan-500/10 blur-2xl animate-pulse"></div>

          {/* Spinner */}
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 rounded-full border-4 border-slate-700"></div>
            <div className="absolute inset-0 rounded-full border-4 border-cyan-500 border-t-transparent animate-spin"></div>
          </div>

          {/* Text */}
          <p className="text-sm text-slate-400 tracking-wide">{text}</p>
        </div>
      </div>
    </div>
  );
};

export default Loading;

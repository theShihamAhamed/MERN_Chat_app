function MessagesLoadingSpinner() {
  return (
    <div className="flex justify-center items-center h-full py-8">
      <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}

export default MessagesLoadingSpinner;

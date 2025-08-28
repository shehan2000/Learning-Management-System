const Loading = () => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div
        role="status"
        aria-live="polite"
        className="relative flex items-center justify-center w-32 h-32"
      >
        {/* colorful hollow spinner */}
        <div className="absolute inset-0 m-auto w-28 h-28 rounded-full colorful-spinner" />
        {/* inner circle to create hollow effect (adapts to light/dark) */}
        <div className="absolute inset-0 m-auto w-20 h-20 rounded-full bg-white " />

        {/* centered label */}
        <span className="relative text-sm font-medium text-gray-700 dark:text-gray-700">
          Loading ...
        </span>
      </div>
    </div>
  );
};

export default Loading;

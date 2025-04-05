const AuthImagePattern = ({ title, subtitle }) => {
  return (
    <div className="flex flex-col justify-center items-center w bg-gray p-10">
      <div className="max-w-md text-center">
        
        {/* External image */}
        <img
          src="https://cdn.dribbble.com/userupload/18426555/file/original-ec9992529f3da6edecce3a5010abd207.png?resize=752x&vertical=center"
          alt="Community Chat Illustration"
          className="mb-8 w-full h-auto rounded-xl shadow-lg"
        />

        {/* Title */}
        <h2 className="text-3xl font-bold mb-4 whitespace-pre-line">
          {title}
        </h2>

        {/* Subtitle */}
        <p className="text-base whitespace-normal">
          {subtitle}
        </p>
      </div>
    </div>
  );
};

export default AuthImagePattern;

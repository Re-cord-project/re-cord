import React from "react";

const CoverImage: React.FC = () => {
  return (
    <div className="relative h-64 w-full overflow-hidden">
      <img
        src="https://readdy.ai/api/search-image?query=Programming%20environment%20with%20multiple%20monitors%20showing%20code%20on%20dark%20screens%2C%20modern%20software%20development%20workspace%20with%20blue%20code%20syntax%20highlighting%2C%20professional%20coding%20setup%20with%20dark%20theme%20editors%2C%20tech%20workspace&width=1200&height=400&seq=1&orientation=landscape"
        alt="개발 환경"
        className="w-full h-full object-cover object-top"
      />
      <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center px-12">
        <h1 className="text-white text-3xl font-bold">개발자의 성장 여정</h1>
        <p className="text-white mt-2">
          새로운 기술과 트렌드를 배우며 성장하는 경험
        </p>
      </div>
    </div>
  );
};

export default CoverImage;

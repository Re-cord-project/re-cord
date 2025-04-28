import React from "react";

const Banner: React.FC = () => {
  return (
    <div className="relative h-48 w-full overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center brightness-70"
        style={{
          backgroundImage: `url('https://readdy.ai/api/search-image?query=Modern%20office%20workspace%20with%20multiple%20computer%20monitors%20displaying%20code%20on%20dark%20screens%2C%20keyboard%20and%20mouse%20on%20desk%2C%20professional%20development%20environment%20with%20subtle%20lighting%20and%20minimalist%20design&width=1440&height=400&seq=1&orientation=landscape')`,
        }}
      ></div>
      <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-16">
        <h1 className="text-white text-2xl font-bold">개발자의 성장 여정</h1>
        <p className="text-white text-sm mt-2">
          나의 코딩과 개발에 대한 이야기...
        </p>
      </div>
    </div>
  );
};

export default Banner;
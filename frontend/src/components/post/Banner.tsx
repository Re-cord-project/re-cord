import React from "react";

const Banner: React.FC = () => {
  return (
      <div className="relative h-48 w-full overflow-hidden">
          <div
              className="absolute inset-0 bg-cover bg-center brightness-100"
              style={{
                  backgroundImage: `url('https://re-cord.s3.ap-northeast-2.amazonaws.com/etc/banner/%EC%A0%9C%EB%AA%A9%EC%9D%84+%EC%9E%85%EB%A0%A5%ED%95%B4%EC%A3%BC%EC%84%B8%EC%9A%94_-001.png')`,
              }}
          ></div>
          <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-16">
              <h1 className="text-white text-2xl font-bold">성공할 사람의 성장 여정</h1>
              <p className="text-white text-sm mt-2">나의 성장과 미래에 대한 이야기...</p>
          </div>
      </div>
  )
};

export default Banner;

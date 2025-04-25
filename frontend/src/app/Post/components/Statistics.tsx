import React from "react";

const Statistics: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-sm font-bold text-gray-800 mb-3">통계</h3>
      <ul className="text-sm">
        <li className="py-1.5 flex justify-between">
          <span className="text-gray-700">총 방문자</span>
          <span className="text-gray-500">12,456</span>
        </li>
        <li className="py-1.5 flex justify-between">
          <span className="text-gray-700">오늘 방문자</span>
          <span className="text-gray-500">1,845</span>
        </li>
        <li className="py-1.5 flex justify-between">
          <span className="text-gray-700">어제의 방문자</span>
          <span className="text-gray-500">2,032</span>
        </li>
        <li className="py-1.5 flex justify-between">
          <span className="text-gray-700">이번 달 방문자</span>
          <span className="text-gray-500">14</span>
        </li>
        <li className="py-1.5 flex justify-between">
          <span className="text-gray-700">지난 달 방문자</span>
          <span className="text-gray-500">8,440</span>
        </li>
      </ul>
    </div>
  );
};

export default Statistics;

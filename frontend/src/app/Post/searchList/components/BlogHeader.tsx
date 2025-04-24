import React from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faUser } from "@fortawesome/free-solid-svg-icons";

const BlogHeader: React.FC = () => {
  return (
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-12">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 font-bold">
            <span>D</span>
          </div>
          <span className="ml-2 text-sm font-medium">블로그</span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">메뉴 1</span>
          <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
            <FontAwesomeIcon icon={faBell} className="text-xs text-gray-500" />
          </div>
          <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
            <FontAwesomeIcon icon={faUser} className="text-xs text-gray-500" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogHeader;

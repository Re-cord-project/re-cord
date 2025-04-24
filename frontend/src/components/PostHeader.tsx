import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-regular-svg-icons";

const PostHeader: React.FC = () => {
  const pathname = usePathname();

  return (
    <div className="bg-white border-sm shadow-sm">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-14">
        <div className="flex items-center space-x-6">
          <Link href="/" className="flex items-center">
            <img
              src="/images/re-cord-logo.png"
              alt="RE:cord"
              width={120}
              height={40}
              className="object-contain"
            />
          </Link>
          <div className="flex items-center space-x-6">
            <Link
              href="/"
              className={`text-sm hover:text-blue-500 cursor-pointer relative py-1 ${
                pathname === "/" ? "font-bold text-gray-900" : "text-gray-700"
              }`}
            >
              홈
              {pathname === "/" && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-900"></div>
              )}
            </Link>
            <Link
              href="/Post/postHome"
              className={`text-sm hover:text-blue-500 cursor-pointer relative py-1 ${
                pathname.includes("/Post/postHome")
                  ? "font-bold text-gray-900"
                  : "text-gray-700"
              }`}
            >
              내 블로그
              {pathname.includes("/Post/postHome") && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-900"></div>
              )}
            </Link>
          </div>
        </div>
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
            <FontAwesomeIcon icon={faUser} className="text-sm text-gray-600" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostHeader;

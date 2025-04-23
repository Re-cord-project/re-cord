'use client';

interface Course {
  id: number;
  category: string;
  duration: string;
  title: string;
  instructor: string;
  views: number;
}

export default function NewPostList({ courses }: { courses: Course[] }) {
  return (
    <section className="container mx-auto px-4 py-6">
      <h3 className="text-xl font-bold mb-6">새로 올라온 회고록</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {courses.map((course) => (
          <div key={course.id} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="h-44 bg-gray-200 relative">
              <div className="absolute bottom-2 left-2 bg-gray-900 bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                {course.category} · {course.duration}
              </div>
            </div>
            <div className="p-4">
              <h4 className="font-medium text-sm mb-4">{course.title}</h4>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-gray-300 mr-2"></div>
                  <span className="text-xs text-gray-600">{course.instructor}</span>
                </div>
                <div className="flex items-center text-xs text-gray-500">
                  👀 {course.views}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

import { Link } from 'react-router-dom';

interface PostCardProps {
  id: number;
  thumbnail: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
}

export const PostCard = ({ id, thumbnail, title, excerpt, author, date }: PostCardProps) => {
  return (
    // 시맨틱 태그 article 사용 및 그룹 호버 효과
    <article className="group overflow-hidden rounded-xl border border-gray-200 bg-white transition-all hover:-translate-y-1 hover:shadow-lg">
      <Link to={`/post/${id}`}>
        {/* 썸네일 영역 (이미지 최적화: aspect-ratio로 Layout Shift 방지) */}
        <div className="aspect-[16/9] w-full overflow-hidden bg-gray-100">
          <img 
            src={thumbnail} 
            alt={`${title} 썸네일`} 
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" 
            loading="lazy" // 이미지 Lazy 로딩 적용
          />
        </div>
        
        {/* 텍스트 컨텐츠 영역 */}
        <div className="p-5">
          <h3 className="mb-2 line-clamp-2 text-lg font-bold text-gray-900 group-hover:text-blue-600">
            {title}
          </h3>
          <p className="mb-4 line-clamp-3 text-sm text-gray-600">
            {excerpt}
          </p>
          
          {/* 하단 메타 정보 (작성자, 날짜) */}
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span className="font-medium text-gray-500">{author}</span>
            <span>{date}</span>
          </div>
        </div>
      </Link>
    </article>
  );
};
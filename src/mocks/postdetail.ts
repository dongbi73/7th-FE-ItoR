import type { PostDetail } from '@/api/post';

export const DUMMY_POST_DETAIL: PostDetail = {
  postId: '62d0e871-500c-45f2-893a-4f90fee5da99',
  title: 'React 상태 관리를 다시 정리해봤어요',
  isOwner: true,
  nickName: '멋쟁이프론트',
  profileUrl: 'https://placehold.co/80x80?text=FE',
  introduction: '프론트엔드 UI와 API 연결 과정을 기록하고 있습니다.',
  createdAt: '2026-05-02T15:15:06.170Z',
  contents: [
    {
      contentOrder: 1,
      content:
        '작은 프로젝트에서는 useState만으로 충분하지만, 화면 간 공유 상태가 늘어나면 store 분리가 훨씬 편해집니다. 이번 작업에서는 로그인 여부와 사용자 정보를 전역에서 관리하고, 상세 페이지에서는 게시글 데이터만 지역 상태로 관리했습니다.',
      contentType: 'TEXT',
    },
    {
      contentOrder: 2,
      content: 'https://placehold.co/800x420?text=Post+Detail+Image',
      contentType: 'IMAGE',
    },
    {
      contentOrder: 3,
      content:
        '댓글 작성은 헤더 아이콘 클릭, 로그인 확인, 입력 폼 포커스, 등록 후 목록 갱신 순서로 이어지도록 만들면 사용자가 흐름을 끊기지 않고 따라갈 수 있습니다.',
      contentType: 'TEXT',
    },
  ],
  comments: [
    {
      commentId: 1,
      content: '흐름이 잘 보이네요. 로그인 분기까지 들어가니 실제 서비스 느낌이 납니다.',
      nickName: '깃로그유저',
      profileUrl: 'https://placehold.co/80x80?text=GL',
      createdAt: '2026-05-02T15:20:00.000Z',
      isOwner: false,
    },
    {
      commentId: 2,
      content: '댓글 등록 후 다시 조회하는 방식이면 백엔드 응답이 비어 있어도 안전하겠어요.',
      nickName: '기록하는개발자',
      profileUrl: 'https://placehold.co/80x80?text=DEV',
      createdAt: '2026-05-02T15:24:00.000Z',
      isOwner: true,
    },
  ],
};

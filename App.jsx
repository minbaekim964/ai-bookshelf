import { useState, useRef, useCallback, useEffect } from "react";

/* ══════════════════════════════════════════════════════════════
   PRACTICE CHAT SCENARIOS — per chapter
   ══════════════════════════════════════════════════════════════ */

const PRACTICE_CHATS = {
  1: {
    title: "막연한 질문 vs 구체적인 질문",
    scenarios: [
      {
        label: "막연하게 물어보기",
        user: "재테크 방법 알려줘",
        ai: "재테크 방법에는 여러 가지가 있습니다. 주식, 펀드, 부동산, 예·적금, ETF, 채권 등이 있으며 각각 장단점이 있습니다. 본인의 투자 성향과 목표에 맞게 선택하시는 것이 중요합니다. 먼저 비상금을 마련한 후 분산 투자를 권장합니다.",
      },
      {
        label: "구체적으로 물어보기",
        user: "월급 300만원 직장인이 매달 50만원씩 모을 수 있는 재테크 방법 3가지",
        ai: "1. 자동이체 적금 (월 20만원) — CMA 통장에 급여 연결 후, 고금리 정기적금으로 자동이체. 연 4% 기준 1년 뒤 약 245만원.\n\n2. ETF 적립식 투자 (월 20만원) — 코스피200 또는 S&P500 ETF를 매월 정해진 날 자동매수. 장기적으로 연 7~10% 기대 수익.\n\n3. 생활비 줄이기 + 파킹통장 (월 10만원) — 구독 서비스 정리, 점심 도시락 주 2회로 절약분을 토스뱅크 파킹통장(연 2%)에 보관.",
      },
    ],
  },
  2: {
    title: "역할에 따라 답이 달라지는 체험",
    scenarios: [
      {
        label: "역할 없이 물어보기",
        user: "오늘 친구한테 연락을 못 했다. 바빠서 그런 건데 괜히 미안한 마음이 든다.",
        ai: "바쁜 하루를 보내셨군요. 친구에게 미안한 마음이 드는 건 자연스러운 감정입니다. 시간이 될 때 간단한 메시지라도 보내보시면 어떨까요? 진심이 담긴 짧은 연락이면 충분합니다.",
      },
      {
        label: "\"너는 냉정한 코치야\"",
        user: "너는 냉정한 코치야. 오늘 친구한테 연락을 못 했다. 바빠서 그런 건데 괜히 미안한 마음이 든다.",
        ai: "솔직히 말할게요. 바빠서 연락 못 한 건 선택의 결과입니다. 그 시간에 다른 걸 우선순위에 뒀다는 뜻이죠. 미안하다고 느끼면서도 연락 안 하는 건 감정만 소비하는 거예요.\n\n두 가지 중 하나를 선택하세요:\n1. 지금 당장 30초 짜리 문자를 보낸다\n2. 연락 못 한 게 합리적이었다고 인정하고 죄책감을 내려놓는다\n\n둘 다 안 하면서 미안해하는 건 가장 비효율적인 선택입니다.",
      },
    ],
  },
  3: {
    title: "형식 있는 질문 vs 없는 질문",
    scenarios: [
      {
        label: "형식 없이 물어보기",
        user: "수면 부족이 건강에 미치는 영향 알려줘",
        ai: "수면 부족은 건강에 다양한 영향을 미칩니다. 면역력이 저하되고 집중력이 떨어지며, 장기적으로는 심혈관 질환, 비만, 당뇨병 위험이 높아집니다. 또한 정신 건강에도 영향을 주어 우울증, 불안장애 가능성이 커집니다. 호르몬 불균형, 기억력 감퇴, 판단력 저하도 발생할 수 있습니다.",
      },
      {
        label: "\"번호 매겨서 3줄로\"",
        user: "수면 부족이 건강에 미치는 영향을 번호 매겨서 3줄로 알려줘",
        ai: "1. 면역력 저하 — 수면 중 생성되는 면역 세포가 줄어 감기·감염에 취약해진다.\n2. 뇌 기능 저하 — 집중력, 기억력, 판단력이 떨어져 업무 실수가 늘어난다.\n3. 만성질환 위험 — 심장병, 당뇨, 비만 발생률이 수면 충분한 사람 대비 2~3배 높아진다.",
      },
    ],
  },
  4: {
    title: "나쁜 질문을 좋은 질문으로",
    scenarios: [
      {
        label: "나쁜 질문",
        user: "프레젠테이션 재미있게 하는 법 알려줘",
        ai: "프레젠테이션을 재미있게 하려면 청중의 관심을 끄는 것이 중요합니다. 스토리텔링을 활용하고, 시각 자료를 적극 사용하세요. 유머를 적절히 섞고, 청중에게 질문을 던지면 참여도가 높아집니다. 연습을 충분히 하는 것도 중요합니다.",
      },
      {
        label: "좋은 질문 (업그레이드)",
        user: "너는 TED 연사 코치야. 발표 경험이 적은 직장인이 10분짜리 팀 회의 발표를 지루하지 않게 하는 방법을 3가지만 알려줘. 각각 구체적인 예시 포함해서.",
        ai: "1. 첫 30초에 질문을 던져라 — \"여러분, 지난주에 가장 짜증났던 업무가 뭐였어요?\" 이렇게 시작하면 청중이 머릿속으로 답을 떠올리며 집중하게 됩니다.\n\n2. 슬라이드 한 장에 숫자 하나만 — \"매출 23% 증가\"를 텍스트 가득한 슬라이드 대신 큼지막한 \"23%\"만 띄우세요. 나머지는 말로 설명하면 시선이 분산되지 않습니다.\n\n3. 마지막에 \"내일 당장\" 액션을 제시하라 — \"오늘 발표 내용 중 하나만 내일 해보세요\"로 마무리하면 발표가 행동으로 연결되고 기억에 남습니다.",
      },
    ],
  },
  5: {
    title: "AI 비서 체험",
    scenarios: [
      {
        label: "글 다듬기",
        user: "이 랜딩페이지 내용이야. 더 설득력 있게 다듬어줘. '우리 앱으로 다이어트하면 좋습니다. 기능이 많습니다. 다운로드하세요.'",
        ai: "\"3주 만에 평균 4.2kg 감량. 1만 명이 선택한 이유가 있습니다.\n\n매일 30초, 오늘 먹은 것만 기록하세요. AI가 당신만의 식단과 운동 루틴을 설계합니다. 의지력이 아니라 시스템이 바꿔드립니다.\n\n[무료로 시작하기]\"",
      },
      {
        label: "아이디어 뽑기",
        user: "다이어트 앱 사업 아이디어야. 20대 여성 직장인 타겟이고, 운동 싫어하는 사람 대상이야. 차별화 포인트가 될 만한 기능 아이디어 5개만 뽑아줘.",
        ai: "1. 퇴근 후 냉장고 사진 찍으면 → 있는 재료로 저칼로리 레시피 자동 추천\n\n2. 친구랑 같이하는 '오늘 뭐 먹었어' 공유 챌린지 — 경쟁이 아니라 응원 기반\n\n3. 생리주기 연동 식단 — 호르몬 변화에 따라 식단과 간식 추천이 바뀜\n\n4. '야식 참으면 포인트' 시스템 — 밤 10시 이후 앱 안 열면 보상\n\n5. 회사 근처 편의점/식당 메뉴 중 칼로리 낮은 것 자동 필터링 (위치 기반)",
      },
    ],
  },
  6: {
    title: "대화를 이어가면 답이 달라진다",
    scenarios: [
      {
        label: "대화 이어가기 체험",
        user: "자기소개서 첫 문장 써줘",
        ai: "\"저는 항상 새로운 도전을 즐기며 성장하는 사람입니다.\"",
      },
      {
        label: "다듬기",
        user: "너무 뻔해. 더 짧고 강렬하게.",
        ai: "\"회의가 끝나면, 저는 항상 요약본을 먼저 공유하는 사람입니다.\"\n\n→ 성격이 아니라 행동으로 보여주는 문장으로 바꿨습니다.",
        auto: true,
      },
      {
        label: "방향 전환",
        user: "좋은데 창업 말고 일반 취업용으로 바꿔줘.",
        ai: "\"남들이 회의를 마칠 때, 저는 회의록을 정리해서 팀 채널에 올립니다.\"\n\n→ 첫 문장에서 최종 문장으로 3번 만에 완전히 달라졌습니다. 이게 대화를 이어가는 힘이에요.",
        auto: true,
      },
    ],
  },
  7: {
    title: "내 정보를 넣으면 답이 달라진다",
    scenarios: [
      {
        label: "정보 없이 물어보기",
        user: "이직 준비 어떻게 해?",
        ai: "이직 준비는 크게 자기분석, 시장조사, 서류준비, 면접준비 4단계로 나뉩니다. 먼저 본인의 강점과 원하는 방향을 정리하고, 원하는 업종과 직무를 조사해보세요. 이력서와 자기소개서를 업데이트하고, 면접 대비를 하시면 됩니다.",
      },
      {
        label: "내 정보 주입해서 물어보기",
        user: "나는 5년차 개발자인데 마케팅 직군으로 이직하고 싶어. 코딩 경험을 살리면서 마케팅도 할 수 있는 포지션을 찾고 있고, 3개월 안에 이직하고 싶어. 무엇부터 해야 해?",
        ai: "개발 + 마케팅 교차점, 좋은 전략입니다. 3개월 플랜:\n\n1개월차: 그로스 해킹/마테크 포지션 집중 조사. 「그로스 마케터」「마케팅 엔지니어」「CRM 개발자」 키워드로 원티드·로켓펀치 알림 설정.\n\n2개월차: GA4, SQL 마케팅 분석 포트폴리오 1개 만들기. 기존 개발 프로젝트에서 사용자 데이터 분석한 경험을 마케팅 관점으로 재구성.\n\n3개월차: 집중 지원. 코딩 가능한 마케터는 희소하므로 \"데이터 기반 의사결정을 직접 구현할 수 있다\"를 핵심 메시지로.",
      },
    ],
  },
  8: {
    title: "하루 루틴에 AI 끼워넣기",
    scenarios: [
      {
        label: "출근 전 — 우선순위 정하기",
        user: "오늘 할 일 목록이야. 우선순위 정해줘: 팀 미팅 준비, 거래처 이메일 회신, 보고서 수정, 점심 약속 확인, 신규 프로젝트 기획안 초안",
        ai: "🔴 긴급+중요 (오전 중 처리)\n1. 거래처 이메일 회신 — 외부 대응은 지연될수록 신뢰도 하락\n2. 팀 미팅 준비 — 미팅 시간 전까지 완료 필수\n\n🟡 중요 (오후 집중)\n3. 보고서 수정 — 집중 필요, 오후 2~4시 추천\n4. 신규 프로젝트 기획안 초안 — 오늘 시작만, 80% 완성 목표\n\n⚪ 빠르게 처리\n5. 점심 약속 확인 — 2분이면 끝, 지금 바로",
      },
      {
        label: "퇴근 후 — 오늘 배운 것 정리",
        user: "오늘 GA4 공부했어. 핵심 3줄로 정리해줘.",
        ai: "1. GA4는 '이벤트 기반' 추적 — 페이지뷰가 아니라 클릭, 스크롤, 다운로드 등 모든 행동을 이벤트로 기록한다.\n2. 핵심 보고서는 3개 — 획득(어디서 왔나), 참여(뭘 했나), 수익화(돈이 됐나).\n3. 맞춤 이벤트 설정이 핵심 — 기본 이벤트 외에 우리 서비스에 맞는 이벤트를 직접 만들어야 진짜 인사이트가 나온다.",
      },
    ],
  },
  9: {
    title: "검색 vs AI 비교 체험",
    scenarios: [
      {
        label: "AI가 잘하는 질문",
        user: "비 오는 날 혼밥하기 좋은 분위기 맛집 조건 알려줘",
        ai: "비 오는 날 혼밥 맛집의 조건 5가지:\n\n1. 카운터석 또는 1인석이 있을 것 — 빈 의자가 옆에 없어야 편안함\n2. 창가 자리 — 빗소리 + 바깥 풍경이 분위기를 만들어줌\n3. 조용한 BGM — 대화 소리가 적은 곳이 혼밥엔 최적\n4. 주문이 간단할 것 — 세트 메뉴나 정식이 있으면 고민 시간 절약\n5. 우산 꽂이가 있을 것 — 사소하지만 젖은 우산 처리가 편하면 기분이 다름\n\n→ 이 조건들로 네이버 지도에서 \"라멘\", \"소바\", \"덮밥\" 검색 추천",
      },
      {
        label: "검색이 나은 질문",
        user: "내일 서울 날씨 어때?",
        ai: "이 질문은 AI보다 검색이 더 정확합니다! 🔍\n\n이유: 실시간 날씨 데이터는 기상청이나 날씨 앱이 가장 정확해요. AI는 현재 날씨 정보를 실시간으로 가져오지 못합니다.\n\n→ 네이버에 \"서울 내일 날씨\" 검색하면 시간대별 기온, 강수확률까지 바로 확인 가능합니다.",
      },
    ],
  },
  10: {
    title: "AI 도구 직접 체험해보기",
    scenarios: [
      {
        label: "Claude에게 요약 시키기",
        user: "이 글 요약해줘: AI 기술이 발전하면서 많은 직업이 변화하고 있다. 특히 반복적인 업무를 수행하는 직종에서 자동화가 빠르게 진행되고 있으며, 창의적 사고와 인간관계 능력이 더욱 중요해지고 있다.",
        ai: "핵심 요약: AI로 반복 업무는 자동화되고, 앞으로는 창의성과 대인관계 능력이 경쟁력이 된다.\n\n→ 이런 요약 작업은 Claude가 특히 잘합니다. 긴 문서도 핵심만 뽑아줘요.",
      },
      {
        label: "Perplexity 스타일 검색",
        user: "AI 최신 트렌드 알려줘",
        ai: "2025년 AI 핵심 트렌드 3가지:\n\n1. AI 에이전트 — 단순 대화를 넘어 스스로 작업을 수행하는 AI (예: 이메일 자동 분류, 일정 잡기)\n2. 멀티모달 AI — 텍스트+이미지+음성을 동시에 이해하는 모델 확산\n3. 로컬 AI — 클라우드 없이 내 기기에서 돌아가는 소형 AI 모델 증가\n\n→ 이런 최신 정보는 Perplexity가 출처와 함께 보여줘서 더 신뢰할 수 있어요!",
      },
    ],
  },
};

/* ══════════════════════════════════════════════════════════════
   FULL CONTENT DATA — 10 CHAPTERS
   ══════════════════════════════════════════════════════════════ */

const BOOK_DATA = {
  title: "ChatGPT를 제대로 써먹기",
  subtitle: "검색 대신 AI를 부리는 법",
  parts: [
    { partNumber: 1, partTitle: "입문편", partSubtitle: "AI한테 말 잘 거는 법", chapters: [1, 2, 3, 4, 5] },
    { partNumber: 2, partTitle: "중급편", partSubtitle: "AI를 내 일에 붙이기", chapters: [6, 7, 8, 9, 10] },
  ],
  chapters: [
    { id: 1, label: "CHAPTER 01", title: "AI는 독심술이 없다", pages: [
      { id: 1, type: "concept", title: "AI는 독심술이 없다", body: [
        { type: "dropcap", text: "많은 사람이 ChatGPT를 써보고 이런 말을 한다. \"별로던데?\" 답이 너무 뻔하거나, 너무 길거나, 내가 원하는 게 아니거나. 그리고 결론을 낸다. \"AI가 아직 멀었어.\" 하지만 대부분의 경우, 문제는 AI가 아니라 질문이다." },
        { type: "quote", text: "AI는 당신이 원하는 걸 말해주기를 기다리고 있다." },
      ]},
      { id: 2, type: "concept", title: "막연한 질문 vs 구체적인 질문", body: [
        { type: "paragraph", text: "AI는 질문이 구체적일수록 더 좋은 답을 낸다. 이건 당연한 말처럼 들리지만, 막상 실제로 해보면 얼마나 차이가 큰지 놀라게 된다." },
        { type: "label", text: "막연한 질문" }, { type: "example", text: "\"다이어트에 대해 알려줘\"" },
        { type: "label", text: "구체적인 질문" }, { type: "example", text: "\"운동 못 하는 직장인이 저녁에 먹어도 살 안 찌는 야식 3가지 알려줘\"" },
      ]},
      { id: 3, type: "concept", title: "좋은 질문의 3가지 재료", body: [
        { type: "paragraph", text: "구체적인 질문에는 공통적으로 세 가지가 들어있다. 이 세 가지만 넣어도 답의 질이 눈에 띄게 달라진다." },
        { type: "ingredient", number: "①", label: "대상", desc: "누구를 위한 것인가", example: "\"운동 못 하는 직장인이\"" },
        { type: "ingredient", number: "②", label: "상황", desc: "어떠한 조건인가", example: "\"저녁에 먹어도 살 안 찌는\"" },
        { type: "ingredient", number: "③", label: "형식", desc: "어떻게 받고 싶은가", example: "\"3가지 알려줘\"" },
      ]},
      { id: 4, type: "practice", title: "실습", body: [{ type: "chat" }] },
      { id: 5, type: "deepdive", title: "심화 — 프롬프트 엔지니어링의 원리", body: [
        { type: "paragraph", text: "구체적인 질문이 효과적인 이유는 AI의 작동 원리와 관련이 있다. AI는 입력된 텍스트에서 패턴을 찾아 가장 확률이 높은 다음 단어를 예측한다." },
        { type: "paragraph", text: "막연한 질문은 AI에게 너무 많은 가능성을 열어준다. \"다이어트 알려줘\"에는 수천 가지 방향이 가능하다. 반면 구체적인 질문은 AI가 탐색할 범위를 좁혀준다." },
        { type: "quote", text: "좋은 프롬프트는 AI의 가능성을 좁히는 것이 아니라, 올바른 방향으로 집중시키는 것이다." },
        { type: "paragraph", text: "이 원리를 이해하면, 왜 대상·상황·형식이 중요한지 자연스럽게 납득된다. 각각이 AI의 탐색 범위를 '누구를 위해', '어떤 조건에서', '어떤 형태로' 제한해주기 때문이다." },
      ]},
    ]},
    { id: 2, label: "CHAPTER 02", title: "\"너는 ~야\" 한 마디의 힘", pages: [
      { id: 1, type: "concept", title: "역할 주기의 힘", body: [
        { type: "dropcap", text: "AI에게 역할을 주면 완전히 달라진다. 같은 질문이라도 누구에게 묻느냐에 따라 답이 다르듯, AI도 역할을 받으면 그 역할의 관점으로 대답한다." },
        { type: "quote", text: "\"너는 냉정한 편집자야. 내 글의 문제점을 솔직하게 짚어줘.\"" },
      ]},
      { id: 2, type: "concept", title: "같은 질문, 다른 역할", body: [
        { type: "paragraph", text: "\"내 사업 아이디어 어때?\"라고 물을 때, 역할에 따라 이렇게 달라진다." },
        { type: "label", text: "역할 없음" }, { type: "example", text: "좋은 아이디어네요. 몇 가지 고려할 점이 있습니다..." },
        { type: "label", text: "역할: 까다로운 투자자" }, { type: "example", text: "시장 규모가 충분한지 의심스럽습니다. 경쟁사 대비 차별점이 불분명하고..." },
        { type: "label", text: "역할: 첫 고객 입장" }, { type: "example", text: "솔직히 왜 이걸 써야 하는지 잘 모르겠어요. 기존 방법이 더 편한데..." },
      ]},
      { id: 3, type: "concept", title: "역할은 구체적일수록 좋다", body: [
        { type: "paragraph", text: "역할을 줄 때 막연하게 주면 효과가 절반이다." },
        { type: "label", text: "막연한 역할" }, { type: "example", text: "\"너는 전문가야\"" },
        { type: "label", text: "구체적인 역할" }, { type: "example", text: "\"너는 소규모 카페 창업을 10번 도운 경력 있는 컨설턴트야\"" },
        { type: "quote", text: "\"전문가\"보다 \"10년 경력의 컨설턴트\"가 낫다." },
      ]},
      { id: 4, type: "practice", title: "실습", body: [{ type: "chat" }] },
      { id: 5, type: "deepdive", title: "심화 — 역할 조합의 고급 기술", body: [
        { type: "paragraph", text: "역할을 하나만 줄 필요는 없다. 여러 역할을 순서대로 줘서 다각도로 검증받는 것도 가능하다." },
        { type: "example", text: "\"1단계: 너는 마케팅 전문가야. 이 아이디어의 시장성을 평가해줘.\n2단계: 너는 고객이야. 이 제품을 쓸 의향이 있는지 솔직하게 말해줘.\n3단계: 너는 투자자야. 투자할 만한지 판단해줘.\"" },
        { type: "paragraph", text: "이렇게 하면 하나의 아이디어를 세 가지 관점에서 동시에 검증할 수 있다. 실무에서 매우 유용한 기법이다." },
      ]},
    ]},
    { id: 3, label: "CHAPTER 03", title: "같은 내용도 형식이 다르면 다르다", pages: [
      { id: 1, type: "concept", title: "형식을 내가 설계한다", body: [
        { type: "dropcap", text: "AI에게 아무것도 지정하지 않으면, AI는 스스로 형식을 고른다. 그 결과물이 마음에 안 들어도 AI 탓이 아니다. 형식을 말하지 않았을 뿐이다." },
        { type: "quote", text: "내용은 AI가 채운다. 형식은 내가 설계한다." },
      ]},
      { id: 2, type: "concept", title: "자주 쓰는 형식 6가지", body: [
        { type: "paragraph", text: "질문 끝에 이 말 하나만 붙여도 결과가 완전히 달라진다." },
        { type: "formatItem", label: "3줄로", desc: "핵심만 짧게, 빠르게 파악" },
        { type: "formatItem", label: "표로", desc: "비교하거나 정리할 때" },
        { type: "formatItem", label: "번호 매겨서", desc: "순서나 우선순위가 있을 때" },
        { type: "formatItem", label: "예시 들어서", desc: "이해가 잘 안 될 때" },
        { type: "formatItem", label: "쉬운 말로", desc: "전문 용어 없이 설명할 때" },
        { type: "formatItem", label: "한 문장으로", desc: "핵심 한 줄 요약이 필요할 때" },
      ]},
      { id: 3, type: "concept", title: "형식은 조합할 수 있다", body: [
        { type: "label", text: "기본 질문" }, { type: "example", text: "\"건강한 식단 알려줘\"" },
        { type: "label", text: "조합한 질문" }, { type: "example", text: "\"너는 영양사야. 자취하는 20대가 편의점에서 살 수 있는 건강한 식단을 표로 보여줘. 3가지만.\"" },
        { type: "paragraph", text: "역할 + 대상 + 상황 + 형식 + 개수. 이 다섯 가지가 갖춰지면 AI는 거의 원하는 대로 답한다." },
      ]},
      { id: 4, type: "practice", title: "실습", body: [{ type: "chat" }] },
      { id: 5, type: "deepdive", title: "심화 — 마크다운으로 형식 제어하기", body: [
        { type: "paragraph", text: "AI는 마크다운 문법을 이해한다. 형식을 더 세밀하게 지정하고 싶다면 마크다운 키워드를 활용해보자." },
        { type: "formatItem", label: "## 제목", desc: "섹션을 나눌 때" },
        { type: "formatItem", label: "- 불릿", desc: "항목을 나열할 때" },
        { type: "formatItem", label: "| 표 |", desc: "비교 표를 원할 때" },
        { type: "formatItem", label: "> 인용", desc: "핵심 문장을 강조할 때" },
        { type: "paragraph", text: "예를 들어 \"마크다운 표 형식으로 장단점을 비교해줘\"라고 하면, AI가 깔끔한 표를 만들어준다." },
      ]},
    ]},
    { id: 4, label: "CHAPTER 04", title: "나쁜 질문 vs 좋은 질문", pages: [
      { id: 1, type: "concept", title: "지금까지 배운 것을 한 번에 보자", body: [
        { type: "dropcap", text: "챕터 1부터 3까지, 구체적인 질문, 역할 주기, 형식 지정을 배웠다. 이번 챕터는 새로운 개념이 없다. 대신 나쁜 질문을 보고 좋은 질문으로 바꾸어보는 연습이다." },
        { type: "quote", text: "좋은 질문을 알아보는 눈이 생기면, 좋은 질문도 자연스럽게 만들어진다." },
      ]},
      { id: 2, type: "concept", title: "이렇게 바꾸면 된다", body: [
        { type: "label", text: "나쁜 질문" }, { type: "example", text: "\"영어 공부법 알려줘\"" },
        { type: "label", text: "좋은 질문" }, { type: "example", text: "\"너는 영어 강사야. 하루 30분밖에 없는 직장인이 6개월 안에 비즈니스 영어를 익히는 방법을 단계별로 3가지 알려줘\"" },
      ]},
      { id: 3, type: "concept", title: "퀴즈", body: [
        { type: "paragraph", text: "다음 질문 중 더 좋은 쪽을 골라보자." },
        { type: "quiz", q: "Q1", optA: "다이어트 방법 알려줘", optB: "운동 못 하는 40대 직장인이 식단만으로 3개월 안에 5kg 빼는 방법을 단계별로 알려줘", answer: "B" },
        { type: "quiz", q: "Q2", optA: "블로그 제목 골라줘", optB: "너는 까다로운 독자야. 내 블로그 글 제목 5개 중에 클릭하고 싶은 걸 하나만 골라줘", answer: "B" },
      ]},
      { id: 4, type: "practice", title: "실습", body: [{ type: "chat" }] },
      { id: 5, type: "deepdive", title: "심화 — 프롬프트 체크리스트", body: [
        { type: "paragraph", text: "질문을 보내기 전에 이 체크리스트를 머릿속으로 돌려보자. 전부 채울 필요는 없지만, 하나라도 더 채울수록 답이 좋아진다." },
        { type: "formatItem", label: "역할", desc: "AI에게 전문가 역할을 줬나?" },
        { type: "formatItem", label: "대상", desc: "누구를 위한 답변인지 명시했나?" },
        { type: "formatItem", label: "상황", desc: "어떤 조건/제약이 있는지 말했나?" },
        { type: "formatItem", label: "형식", desc: "어떻게 받고 싶은지 지정했나?" },
        { type: "formatItem", label: "분량", desc: "몇 개, 몇 줄인지 정했나?" },
        { type: "quote", text: "이 다섯 가지를 습관처럼 붙이면, 당신은 이미 상위 10%의 AI 사용자다." },
      ]},
    ]},
    { id: 5, label: "CHAPTER 05", title: "AI를 비서로 쓰기", pages: [
      { id: 1, type: "concept", title: "AI는 이미 쓸 준비가 됐다", body: [
        { type: "dropcap", text: "지금까지 질문 잘 하는 법을 배웠다. 이제 실제로 어디에 쓰는지 알아보자. AI는 글 쓰는 것, 요약하는 것, 번역하는 것, 아이디어 떠올리는 것 — 이 네 가지를 이미 잘한다." },
        { type: "quote", text: "AI는 잡일을 빠르게 처리한다. 당신은 중요한 일에 집중하면 된다." },
      ]},
      { id: 2, type: "concept", title: "오늘 바로 시킬 수 있는 것들", body: [
        { type: "formatItem", label: "글 다듬기", desc: "맞춤법 교정을 넘어 — 톤, 길이, 설득력까지 조절" },
        { type: "formatItem", label: "요약하기", desc: "긴 문서, 기사, 회의록을 핵심만 추려내기" },
        { type: "formatItem", label: "번역 + 뉘앙스 조절", desc: "\"공손하게\", \"캐주얼하게\" 지정 가능" },
        { type: "formatItem", label: "아이디어 떠올리기", desc: "10개 떠올려달라고 하면 그 중 하나는 쓸 만하다" },
      ]},
      { id: 3, type: "practice", title: "실습 체험", body: [{ type: "chat" }] },
      { id: 4, type: "deepdive", title: "심화 — AI 비서 활용 실전 템플릿", body: [
        { type: "paragraph", text: "아래 템플릿을 복사해서 바로 써보자. 빈칸만 채우면 된다." },
        { type: "label", text: "회의록 정리" },
        { type: "example", text: "아래 회의 내용에서 1) 결정사항 2) 액션아이템 3) 미결사항을 구분해서 정리해줘.\n\n[회의 내용 붙여넣기]" },
        { type: "label", text: "이메일 초안" },
        { type: "example", text: "나는 [직급]이고, [상대방]에게 [목적]으로 이메일을 보내려 해. [톤]으로 써줘. 핵심은 [내용]이야." },
      ]},
    ]},
    { id: 6, label: "CHAPTER 06", title: "한 번 묻고 끝내지 마라", pages: [
      { id: 1, type: "concept", title: "대화를 이어가는 사람이 실력이 다르다", body: [
        { type: "dropcap", text: "대부분의 사람이 AI를 쓸 때 이렇게 한다. 질문 하나 → 답변 받기 → 사용 종료. 하지만 진짜 실력은 대화를 이어가는 데서 나온다." },
        { type: "quote", text: "AI는 대화를 이어갈수록 점점 좋아진다." },
      ]},
      { id: 2, type: "concept", title: "이어가는 말 패턴", body: [
        { type: "formatItem", label: "더 짧게", desc: "너무 길어서 핵심을 못 찾겠을 때" },
        { type: "formatItem", label: "예시 들어줘", desc: "이해가 잘 안 될 때" },
        { type: "formatItem", label: "다른 방식으로", desc: "방향을 바꾸고 싶을 때" },
        { type: "formatItem", label: "3번 항목만 더 자세히", desc: "특정 부분만 파고들 때" },
        { type: "formatItem", label: "좀 더 강하게", desc: "톤이나 강도를 조절할 때" },
      ]},
      { id: 3, type: "concept", title: "맥락은 쌓인다", body: [
        { type: "paragraph", text: "AI는 같은 대화창 안에서 앞에 한 말을 기억한다. 그래서 두 번째 질문부터는 처음부터 다시 설명할 필요가 없다." },
        { type: "quote", text: "\"아까 말한 두 번째 방법을 더 구체적으로\" 처럼 앞 답변을 가리켜서 말하기." },
      ]},
      { id: 4, type: "practice", title: "실습", body: [{ type: "chat" }] },
      { id: 5, type: "deepdive", title: "심화 — 대화 트리 전략", body: [
        { type: "paragraph", text: "고수들은 대화를 '나무'처럼 사용한다. 하나의 질문에서 여러 가지를 뻗어나가는 방식이다." },
        { type: "paragraph", text: "예를 들어 사업 계획서를 쓴다면: 먼저 \"사업 아이디어 평가해줘\"로 시작 → \"시장 규모 분석해줘\" → \"경쟁사 분석해줘\" → \"마케팅 전략 3가지\" → 각 전략을 \"더 자세히\"로 파고들기." },
        { type: "quote", text: "하나의 대화에서 10번 이상 이어가면, AI가 당신의 프로젝트를 깊이 이해한 상태가 된다." },
      ]},
    ]},
    { id: 7, label: "CHAPTER 07", title: "내 정보 주입하기", pages: [
      { id: 1, type: "concept", title: "AI는 나를 아무것도 모른다", body: [
        { type: "dropcap", text: "AI는 처음 만나는 사람이다. 내 나이도, 직업도, 고민도, 상황도 모른다. 그런데 대부분의 사람은 이걸 말 안 하고 답변이 별로라고 한다." },
        { type: "quote", text: "AI에게 내 상황을 알려주는 것, 그게 중급의 시작이다." },
      ]},
      { id: 2, type: "concept", title: "어떤 정보를 주면 될까", body: [
        { type: "formatItem", label: "나는 누구", desc: "직업, 연차, 상황" },
        { type: "formatItem", label: "목표", desc: "무엇을 원하는가" },
        { type: "formatItem", label: "제약", desc: "못 하는 것, 없는 것" },
        { type: "formatItem", label: "맥락", desc: "지금 어떤 상황인가" },
      ]},
      { id: 3, type: "concept", title: "나만의 콘텍스트 템플릿", body: [
        { type: "paragraph", text: "자주 AI를 쓴다면, 내 상황을 미리 정리해두고 필요할 때 붙여넣는 것이 훨씬 편하다." },
        { type: "example", text: "나는 [직업/상황]이야.\n지금 [목표]를 하려고 해.\n[제약 조건]이라는 제약이 있어.\n이 상황에서 [질문]" },
      ]},
      { id: 4, type: "practice", title: "실습", body: [{ type: "chat" }] },
      { id: 5, type: "deepdive", title: "심화 — Custom Instructions 활용법", body: [
        { type: "paragraph", text: "ChatGPT에는 'Custom Instructions', Claude에는 'System Prompt'라는 기능이 있다. 매번 내 정보를 붙여넣지 않아도, 한 번 설정하면 모든 대화에 자동 적용된다." },
        { type: "paragraph", text: "설정 예시: \"나는 스타트업 대표이고, B2B SaaS를 만들고 있어. 답변은 항상 실행 가능한 액션 위주로, 3줄 이내로 해줘.\"" },
        { type: "quote", text: "한 번 설정해두면, 매번 설명할 필요 없이 AI가 '나'를 이해한 상태로 시작한다." },
      ]},
    ]},
    { id: 8, label: "CHAPTER 08", title: "배운 것을 루틴에 녹여라", pages: [
      { id: 1, type: "concept", title: "작게 시작해서 크게 쌓아라", body: [
        { type: "dropcap", text: "AI를 배웠다고 해서 자동으로 쓰게 되지는 않는다. 의식적으로 내 하루에 끼워 넣어야 한다. 핵심은 거창하게 시작하지 않는 것이다." },
        { type: "quote", text: "하루에 한 번만 써도, 한 달이면 30번의 연습이 쌓인다." },
      ]},
      { id: 2, type: "concept", title: "하루 루틴에 AI 끼워넣기", body: [
        { type: "formatItem", label: "출근 전", desc: "\"오늘 할 일 목록이야. 우선순위 정해줘\"" },
        { type: "formatItem", label: "업무 중", desc: "\"팀장에게 보내는 보고 이메일로 써줘\"" },
        { type: "formatItem", label: "점심", desc: "\"회의 내용이야. 액션 아이템만 뽑아줘\"" },
        { type: "formatItem", label: "퇴근 후", desc: "\"오늘 공부한 거 핵심 3줄로 정리해줘\"" },
      ]},
      { id: 3, type: "concept", title: "나만의 프롬프트 저장함", body: [
        { type: "paragraph", text: "자주 쓰는 프롬프트를 저장해두고 필요할 때 붙여넣으면 시간이 많이 절약된다." },
        { type: "example", text: "\"오늘 할 일 목록이야. 우선순위 정해줘: [목록]\"" },
        { type: "example", text: "\"이 내용 팀장에게 보내는 보고 이메일로 써줘. 간결하게.\"" },
      ]},
      { id: 4, type: "practice", title: "실습", body: [{ type: "chat" }] },
      { id: 5, type: "deepdive", title: "심화 — 주간 AI 루틴 설계", body: [
        { type: "paragraph", text: "하루 루틴을 넘어서, 주간 단위로 AI를 활용하면 더 체계적이다." },
        { type: "formatItem", label: "월요일", desc: "이번 주 목표 설정 + 우선순위 정리" },
        { type: "formatItem", label: "수요일", desc: "중간 점검 — 진행 상황 정리 + 남은 할 일 재정렬" },
        { type: "formatItem", label: "금요일", desc: "이번 주 배운 것 3줄 요약 + 다음 주 할 일 도출" },
        { type: "quote", text: "AI를 쓰는 것도 근육이다. 루틴이 있어야 근육이 붙는다." },
      ]},
    ]},
    { id: 9, label: "CHAPTER 09", title: "검색 vs AI — 언제 뭐를 쓸까", pages: [
      { id: 1, type: "concept", title: "구글을 버리란 말이 아니다", body: [
        { type: "dropcap", text: "AI가 뜨면서 \"이제 검색은 끝났다\"는 말이 많다. 틀렸다. 구글과 AI는 잘하는 게 다르다. 둘을 구분해서 쓸 줄 아는 것이 진짜 실력이다." },
        { type: "quote", text: "검색은 답을 찾을 때, AI는 답을 만들 때." },
      ]},
      { id: 2, type: "concept", title: "각각 잘하는 것", body: [
        { type: "label", text: "검색이 나을 때" }, { type: "paragraph", text: "최신 뉴스, 특정 사이트 찾기, 가격·위치·날씨, 사실 확인" },
        { type: "label", text: "AI가 나을 때" }, { type: "paragraph", text: "글·초안 작성, 개념 이해·설명, 아이디어 생성, 요약·정리, 맞춤 조언" },
      ]},
      { id: 3, type: "concept", title: "판단이 안 설 때 이렇게", body: [
        { type: "compareItem", search: "\"오늘 환율이 얼마야?\"", searchDesc: "실시간 정보", ai: "\"환율이 오르면 내 생활에 어떤 영향이 있어?\"", aiDesc: "해석·설명" },
        { type: "compareItem", search: "\"강남역 맛집\"", searchDesc: "장소·목록", ai: "\"비 오는 날 혼밥하기 좋은 분위기 맛집 조건\"", aiDesc: "기준 만들기" },
      ]},
      { id: 4, type: "practice", title: "퀴즈 & 실습", body: [{ type: "chat" }] },
      { id: 5, type: "deepdive", title: "심화 — AI 검색의 진화", body: [
        { type: "paragraph", text: "최근 AI와 검색의 경계가 허물어지고 있다. Perplexity는 AI가 직접 검색해서 출처와 함께 답변한다. ChatGPT도 웹 브라우징 기능을 갖추고 있다." },
        { type: "paragraph", text: "하지만 핵심 원칙은 변하지 않는다. '사실 확인'은 검색, '해석과 생성'은 AI. AI 검색 도구는 이 둘을 합친 것이지, 검색을 대체한 것이 아니다." },
        { type: "quote", text: "도구는 계속 진화한다. 원칙을 알면 새 도구가 나와도 바로 적응할 수 있다." },
      ]},
    ]},
    { id: 10, label: "CHAPTER 10", title: "AI 도구 지도", pages: [
      { id: 1, type: "concept", title: "ChatGPT 말고 또 뭐가 있나", body: [
        { type: "dropcap", text: "AI 도구는 ChatGPT만이 아니다. 글쓰기, 검색, 발표, 이미지 — 목적에 따라 더 잘 맞는 도구가 있다. 내 상황에 맞는 것 1~2개만 더 알면 충분하다." },
        { type: "quote", text: "도구를 많이 아는 게 아니라, 내 일에 맞는 도구를 아는 게 중요하다." },
      ]},
      { id: 2, type: "concept", title: "대화·글쓰기 도구들", body: [
        { type: "formatItem", label: "ChatGPT", desc: "가장 범용적. 처음 시작하기 좋고 플러그인도 많다." },
        { type: "formatItem", label: "Claude", desc: "긴 글 읽기·요약, 글쓰기 품질, 안전한 대화에 강하다." },
        { type: "formatItem", label: "Gemini", desc: "구글 서비스(Gmail·Docs·Sheets) 연동 최강." },
        { type: "formatItem", label: "Perplexity", desc: "AI + 실시간 검색의 조합. 출처도 함께 보여준다." },
      ]},
      { id: 3, type: "practice", title: "직접 체험해보기", body: [{ type: "chat" }] },
      { id: 4, type: "deepdive", title: "심화 — 나만의 AI 스택 만들기", body: [
        { type: "paragraph", text: "프로들은 하나의 AI만 쓰지 않는다. 상황에 따라 도구를 골라 쓰는 '나만의 AI 스택'을 갖고 있다." },
        { type: "label", text: "추천 조합 예시" },
        { type: "example", text: "일상 대화·글쓰기 → ChatGPT 또는 Claude\n빠른 검색·팩트체크 → Perplexity\n발표 자료 → Gamma\n이미지 생성 → 나노바나나 또는 Midjourney\n업무 자동화 → Notion AI + 구글 Gemini" },
        { type: "paragraph", text: "전부 다 쓸 필요 없다. 위에서 2~3개만 골라 한 달만 써보자. 그게 당신만의 AI 스택이 된다." },
      ]},
    ]},
  ],
};

/* ══════════════════════════════════════════════════════════════
   COLORS
   ══════════════════════════════════════════════════════════════ */

const C = {
  pageBg: "#FAF9F6", practiceBox: "#F2F0EB", textPrimary: "#2E2820",
  textSecondary: "#B8B0A4", spineShadow: "#E0DBD2", accentQuote: "#C4B9A8",
  deskBg: "#EDE8E0", userBubble: "#2E2820", aiBubbleBorder: "#E0DBD2",
};

const bookShadow = `-4px 0 0 ${C.spineShadow},-6px 0 0 ${C.pageBg},-8px 0 0 ${C.spineShadow},4px 4px 20px rgba(0,0,0,0.12),0 2px 40px rgba(0,0,0,0.06)`;

/* ══════════════════════════════════════════════════════════════
   PRACTICE CHAT COMPONENT
   ══════════════════════════════════════════════════════════════ */

const PracticeChat = ({ chapterId }) => {
  const chat = PRACTICE_CHATS[chapterId];
  const [messages, setMessages] = useState([]);
  const [typingText, setTypingText] = useState("");
  const [typingRole, setTypingRole] = useState(null); // "user" | "ai" | null
  const [isTyping, setIsTyping] = useState(false);
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [scenarioStep, setScenarioStep] = useState(0);
  const chatEndRef = useRef(null);
  const typingRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingText]);

  useEffect(() => {
    return () => { if (typingRef.current) clearTimeout(typingRef.current); };
  }, []);

  const typeText = (text, role, onDone) => {
    setIsTyping(true);
    setTypingRole(role);
    setTypingText("");
    let idx = 0;
    // User typing: slower, 1 char at a time like real keyboard
    // AI typing: faster, 2-3 chars at a time like streaming
    const isUser = role === "user";
    const baseSpeed = isUser
      ? Math.max(40, Math.min(70, 2500 / text.length))
      : Math.max(15, Math.min(30, 1500 / text.length));
    const tick = () => {
      if (idx < text.length) {
        const chunk = isUser
          ? Math.min(idx + 1, text.length) // 1 char at a time for user
          : Math.min(idx + Math.ceil(Math.random() * 2 + 1), text.length);
        setTypingText(text.slice(0, chunk));
        idx = chunk;
        // User: add random pauses like real typing (longer pause after spaces/punctuation)
        const char = text[idx - 1];
        const extraPause = isUser && (char === " " || char === "," || char === ".") ? Math.random() * 60 : 0;
        typingRef.current = setTimeout(tick, baseSpeed + Math.random() * (isUser ? 30 : 15) + extraPause);
      } else {
        setIsTyping(false);
        setTypingText("");
        setTypingRole(null);
        onDone();
      }
    };
    typingRef.current = setTimeout(tick, isUser ? 300 : 400);
  };

  const runScenario = (sIdx) => {
    const scenario = chat.scenarios[sIdx];
    // Step 1: Type user message first
    setScenarioStep(1);
    typeText(scenario.user, "user", () => {
      setMessages(prev => [...prev, { role: "user", text: scenario.user }]);

      // Step 2: Type AI response after brief pause
      setTimeout(() => {
        setScenarioStep(2);
        typeText(scenario.ai, "ai", () => {
          setMessages(prev => [...prev, { role: "ai", text: scenario.ai }]);
          setScenarioStep(3);
          const nextIdx = sIdx + 1;
          setScenarioIdx(nextIdx);

          // Auto-continue: if next scenario has auto:true, run it after a pause
          if (nextIdx < chat.scenarios.length && chat.scenarios[nextIdx].auto) {
            setTimeout(() => runScenario(nextIdx), 1200);
          }
        });
      }, 800);
    });
  };

  const handleButtonClick = (e) => {
    e.stopPropagation();
    if (isTyping) return;
    if (scenarioIdx < chat.scenarios.length) {
      runScenario(scenarioIdx);
    } else {
      // Reset
      setMessages([]);
      setScenarioIdx(0);
      setScenarioStep(0);
    }
  };

  const nextScenario = chat.scenarios[scenarioIdx];
  const allDone = scenarioIdx >= chat.scenarios.length && !isTyping;

  return (
    <div style={{
      display: "flex", flexDirection: "column", height: "100%",
      backgroundColor: C.practiceBox, fontFamily: "'Noto Serif KR', serif",
    }}>
      {/* Header */}
      <div style={{ padding: "16px 20px 12px", borderBottom: `1px solid ${C.spineShadow}` }}>
        <div style={{ fontSize: "10px", fontWeight: 300, letterSpacing: "2px", color: C.textSecondary, textTransform: "uppercase", marginBottom: "6px" }}>실습 체험</div>
        <div style={{ fontSize: "15px", fontWeight: 600, color: C.textPrimary, lineHeight: 1.5 }}>{chat.title}</div>
      </div>

      {/* Chat area — taps pass through to Reader for page flip, scrolling works via drag */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 16px 8px", WebkitOverflowScrolling: "touch" }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start", marginBottom: "12px" }}>
            <div style={{
              maxWidth: "82%",
              padding: "12px 16px",
              borderRadius: msg.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
              backgroundColor: msg.role === "user" ? C.userBubble : C.pageBg,
              color: msg.role === "user" ? "#FAF9F6" : C.textPrimary,
              border: msg.role === "ai" ? `1px solid ${C.aiBubbleBorder}` : "none",
              fontSize: "13px",
              fontWeight: 300,
              lineHeight: 1.85,
              whiteSpace: "pre-line",
            }}>
              {msg.text}
            </div>
          </div>
        ))}

        {/* Typing indicator — works for both user and AI */}
        {isTyping && typingRole && (
          <div style={{ display: "flex", justifyContent: typingRole === "user" ? "flex-end" : "flex-start", marginBottom: "12px" }}>
            <div style={{
              maxWidth: "82%", padding: "12px 16px",
              borderRadius: typingRole === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
              backgroundColor: typingRole === "user" ? C.userBubble : C.pageBg,
              color: typingRole === "user" ? "#FAF9F6" : C.textPrimary,
              border: typingRole === "ai" ? `1px solid ${C.aiBubbleBorder}` : "none",
              fontSize: "13px", fontWeight: 300, lineHeight: 1.85, whiteSpace: "pre-line",
            }}>
              {typingText}<span style={{ animation: "blink 0.8s step-end infinite", color: typingRole === "user" ? "#FAF9F688" : C.accentQuote }}>|</span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Action button — stopPropagation so clicks don't flip page */}
      <div onClick={(e) => e.stopPropagation()} onTouchStart={(e) => e.stopPropagation()} onTouchEnd={(e) => e.stopPropagation()} style={{ padding: "12px 16px 16px" }}>
        <button
          onClick={handleButtonClick}
          disabled={isTyping}
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: "12px",
            border: "none",
            backgroundColor: isTyping ? C.spineShadow : C.userBubble,
            color: isTyping ? C.textSecondary : "#FAF9F6",
            fontFamily: "'Noto Serif KR', serif",
            fontSize: "13.5px",
            fontWeight: 400,
            cursor: isTyping ? "default" : "pointer",
            transition: "all 0.3s ease",
            letterSpacing: "0.5px",
          }}
        >
          {isTyping ? (typingRole === "user" ? "질문 입력 중..." : "AI가 답변 중...") : allDone ? "↻ 처음부터 다시" : nextScenario ? `▶ ${nextScenario.label}` : "시작하기"}
        </button>

        {!isTyping && nextScenario && scenarioIdx > 0 && (
          <div style={{ textAlign: "center", marginTop: "8px", fontSize: "11px", color: C.textSecondary }}>
            {scenarioIdx} / {chat.scenarios.length} 시나리오 완료
          </div>
        )}
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════
   PAGE CONTENT RENDERER
   ══════════════════════════════════════════════════════════════ */

const PageContent = ({ page, chapterLabel, totalPages, chapterId }) => {
  const isPractice = page.type === "practice";
  const isDeepDive = page.type === "deepdive";
  const isChat = page.body.length === 1 && page.body[0].type === "chat";

  if (isChat) {
    return <PracticeChat chapterId={chapterId} />;
  }

  const pStyle = { fontFamily: "'Noto Serif KR', serif", fontSize: "14.5px", fontWeight: 300, lineHeight: 2.05, color: C.textPrimary, margin: "0 0 20px 0", textAlign: "justify" };
  const bgColor = isDeepDive ? "#F0EDE6" : isPractice ? C.practiceBox : C.pageBg;

  return (
    <div style={{ padding: "36px 26px 56px", height: "100%", boxSizing: "border-box", overflowY: "auto", WebkitOverflowScrolling: "touch", backgroundColor: bgColor }}>
      {/* Deep dive badge */}
      {isDeepDive && (
        <div style={{ fontFamily: "'Noto Serif KR', serif", fontSize: "9px", fontWeight: 300, letterSpacing: "2.5px", color: C.accentQuote, textTransform: "uppercase", marginBottom: "6px" }}>더 읽기</div>
      )}
      <div style={{ fontFamily: "'Noto Serif KR', serif", fontSize: "10px", fontWeight: 300, letterSpacing: "2.5px", color: C.textSecondary, marginBottom: "18px", textTransform: "uppercase" }}>{chapterLabel}</div>
      <h1 style={{ fontFamily: "'Noto Serif KR', serif", fontSize: "21px", fontWeight: 600, color: C.textPrimary, lineHeight: 1.5, margin: "0 0 24px 0" }}>{page.title}</h1>

      {page.body.map((b, i) => {
        switch (b.type) {
          case "dropcap": return <p key={i} style={pStyle}><span style={{ fontFamily: "'Noto Serif KR', serif", fontSize: "48px", fontWeight: 600, float: "left", lineHeight: "0.8", marginRight: "8px", marginTop: "8px" }}>{b.text[0]}</span>{b.text.slice(1)}</p>;
          case "paragraph": return <p key={i} style={pStyle}>{b.text}</p>;
          case "quote": return <blockquote key={i} style={{ fontFamily: "'Noto Serif KR', serif", fontSize: "13.5px", fontWeight: 300, fontStyle: "italic", lineHeight: 2.0, color: C.textPrimary, borderLeft: `1.5px solid ${C.accentQuote}`, paddingLeft: "16px", margin: "24px 0" }}>{b.text}</blockquote>;
          case "label": return <div key={i} style={{ fontFamily: "'Noto Serif KR', serif", fontSize: "12px", fontWeight: 600, color: C.textSecondary, marginTop: "22px", marginBottom: "6px", letterSpacing: "0.5px" }}>{b.text}</div>;
          case "example": return <div key={i} style={{ fontFamily: "'Noto Serif KR', serif", fontSize: "13.5px", fontWeight: 300, lineHeight: 1.9, color: C.textPrimary, backgroundColor: isPractice ? C.pageBg : C.practiceBox, padding: "12px 16px", borderRadius: "6px", marginBottom: "14px", whiteSpace: "pre-line" }}>{b.text}</div>;
          case "ingredient": return (
            <div key={i} style={{ margin: "16px 0", paddingLeft: "4px" }}>
              <div style={{ fontFamily: "'Noto Serif KR', serif", fontSize: "15px", fontWeight: 600, color: C.textPrimary, marginBottom: "3px" }}><span style={{ marginRight: "8px" }}>{b.number}</span>{b.label}</div>
              <div style={{ fontFamily: "'Noto Serif KR', serif", fontSize: "13px", fontWeight: 300, color: C.textSecondary, marginBottom: "5px" }}>{b.desc}</div>
              <div style={{ fontFamily: "'Noto Serif KR', serif", fontSize: "13px", fontWeight: 300, fontStyle: "italic", color: C.textPrimary, borderLeft: `1.5px solid ${C.accentQuote}`, paddingLeft: "12px" }}>{b.example}</div>
            </div>
          );
          case "formatItem": return (
            <div key={i} style={{ margin: "14px 0", paddingLeft: "4px" }}>
              <span style={{ fontFamily: "'Noto Serif KR', serif", fontSize: "14.5px", fontWeight: 600, color: C.textPrimary }}>{b.label}</span>
              <span style={{ fontFamily: "'Noto Serif KR', serif", fontSize: "13.5px", fontWeight: 300, color: C.textSecondary, marginLeft: "10px" }}>{b.desc}</span>
            </div>
          );
          case "step": return (
            <div key={i} style={{ margin: "18px 0" }}>
              <div style={{ fontFamily: "'Noto Serif KR', serif", display: "flex", gap: "10px", alignItems: "baseline", marginBottom: "6px" }}>
                <span style={{ fontSize: "18px", fontWeight: 600, color: C.accentQuote, flexShrink: 0 }}>{b.number}</span>
                <span style={{ fontSize: "14px", fontWeight: 400, color: C.textPrimary, lineHeight: 1.8 }}>{b.text}</span>
              </div>
              {b.example && <div style={{ fontFamily: "'Noto Serif KR', serif", fontSize: "13.5px", fontWeight: 300, lineHeight: 1.9, color: C.textPrimary, backgroundColor: C.pageBg, padding: "12px 16px", borderRadius: "6px", marginLeft: "28px" }}>{b.example}</div>}
            </div>
          );
          case "quiz": return (
            <div key={i} style={{ margin: "16px 0", padding: "14px 16px", backgroundColor: isPractice ? C.pageBg : C.practiceBox, borderRadius: "8px" }}>
              <div style={{ fontFamily: "'Noto Serif KR', serif", fontSize: "13px", fontWeight: 600, color: C.textSecondary, marginBottom: "8px" }}>{b.q}</div>
              <div style={{ fontFamily: "'Noto Serif KR', serif", fontSize: "13.5px", fontWeight: 300, color: C.textPrimary, marginBottom: "4px" }}>A. {b.optA}</div>
              <div style={{ fontFamily: "'Noto Serif KR', serif", fontSize: "13.5px", fontWeight: 300, color: C.textPrimary }}>B. {b.optB}</div>
            </div>
          );
          case "compareItem": return (
            <div key={i} style={{ margin: "16px 0", display: "flex", flexDirection: "column", gap: "6px" }}>
              <div style={{ fontFamily: "'Noto Serif KR', serif", fontSize: "13px", padding: "10px 14px", backgroundColor: C.practiceBox, borderRadius: "6px" }}>
                <span style={{ fontWeight: 600, fontSize: "11px", color: C.textSecondary, letterSpacing: "1px" }}>검색</span>
                <div style={{ fontWeight: 300, color: C.textPrimary, marginTop: "4px" }}>{b.search}</div>
                <div style={{ fontWeight: 300, color: C.textSecondary, fontSize: "12px" }}>{b.searchDesc}</div>
              </div>
              <div style={{ fontFamily: "'Noto Serif KR', serif", fontSize: "13px", padding: "10px 14px", backgroundColor: "#F7F5F0", borderRadius: "6px" }}>
                <span style={{ fontWeight: 600, fontSize: "11px", color: C.accentQuote, letterSpacing: "1px" }}>AI</span>
                <div style={{ fontWeight: 300, color: C.textPrimary, marginTop: "4px" }}>{b.ai}</div>
                <div style={{ fontWeight: 300, color: C.textSecondary, fontSize: "12px" }}>{b.aiDesc}</div>
              </div>
            </div>
          );
          default: return null;
        }
      })}
      <div style={{ position: "absolute", bottom: "18px", left: "50%", transform: "translateX(-50%)", fontFamily: "'Noto Serif KR', serif", fontSize: "11px", fontWeight: 300, color: C.textSecondary, letterSpacing: "1px" }}>{page.id} / {totalPages}</div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════
   COVER
   ══════════════════════════════════════════════════════════════ */

const CoverScreen = ({ onOpen, onBackToLibrary }) => {
  const [e, setE] = useState(false);
  useEffect(() => { setTimeout(() => setE(true), 100); }, []);
  return (
    <div onClick={onOpen} style={{ width: "390px", maxWidth: "100%", height: "720px", backgroundColor: C.pageBg, borderRadius: "4px 12px 12px 4px", position: "relative", cursor: "pointer", userSelect: "none", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "40px", boxSizing: "border-box", boxShadow: bookShadow, overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, left: 0, width: "20px", height: "100%", background: `linear-gradient(to right, ${C.spineShadow}44, transparent)`, pointerEvents: "none" }} />
      {onBackToLibrary && <div onClick={(ev) => { ev.stopPropagation(); onBackToLibrary(); }} style={{ position: "absolute", top: "16px", left: "24px", fontFamily: "'Noto Serif KR', serif", fontSize: "11px", fontWeight: 300, color: C.textSecondary, cursor: "pointer", letterSpacing: "1px", zIndex: 10 }}>‹ 서재</div>}
      <div style={{ width: "40px", height: "1.5px", backgroundColor: C.accentQuote, marginBottom: "40px", opacity: e ? 1 : 0, transition: "opacity 1s ease 0.3s" }} />
      <div style={{ fontFamily: "'Noto Serif KR', serif", fontSize: "10px", fontWeight: 300, letterSpacing: "4px", color: C.textSecondary, marginBottom: "20px", textTransform: "uppercase", opacity: e ? 1 : 0, transform: e ? "translateY(0)" : "translateY(10px)", transition: "all 0.8s ease 0.2s" }}>AI 책장</div>
      <h1 style={{ fontFamily: "'Noto Serif KR', serif", fontSize: "26px", fontWeight: 600, color: C.textPrimary, textAlign: "center", lineHeight: 1.6, margin: "0 0 12px 0", opacity: e ? 1 : 0, transform: e ? "translateY(0)" : "translateY(15px)", transition: "all 0.8s ease 0.4s" }}>ChatGPT를<br />제대로 써먹기</h1>
      <p style={{ fontFamily: "'Noto Serif KR', serif", fontSize: "14px", fontWeight: 300, color: C.textSecondary, textAlign: "center", lineHeight: 1.8, margin: "0 0 50px 0", opacity: e ? 1 : 0, transform: e ? "translateY(0)" : "translateY(15px)", transition: "all 0.8s ease 0.6s" }}>검색 대신 AI를 부리는 법</p>
      <div style={{ width: "40px", height: "1.5px", backgroundColor: C.accentQuote, marginBottom: "40px", opacity: e ? 1 : 0, transition: "opacity 1s ease 0.8s" }} />
      <div style={{ fontFamily: "'Noto Serif KR', serif", fontSize: "12px", fontWeight: 300, color: C.accentQuote, letterSpacing: "3px", opacity: e ? 1 : 0, transition: "opacity 1s ease 1s", animation: e ? "pulse 2.5s ease-in-out infinite 1.5s" : "none" }}>펼치기</div>
      <div style={{ position: "absolute", bottom: "30px", fontFamily: "'Noto Serif KR', serif", fontSize: "11px", fontWeight: 300, color: `${C.textSecondary}88`, textAlign: "center", opacity: e ? 1 : 0, transition: "opacity 1s ease 1s" }}>입문편 5챕터 + 중급편 5챕터</div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════
   TOC
   ══════════════════════════════════════════════════════════════ */

const TOCScreen = ({ onSelectChapter, onBack }) => {
  const [e, setE] = useState(false);
  useEffect(() => { setTimeout(() => setE(true), 100); }, []);
  return (
    <div style={{ width: "390px", maxWidth: "100%", height: "720px", backgroundColor: C.pageBg, borderRadius: "4px 12px 12px 4px", position: "relative", userSelect: "none", boxSizing: "border-box", overflowY: "auto", WebkitOverflowScrolling: "touch", boxShadow: bookShadow }}>
      <div style={{ position: "absolute", top: 0, left: 0, width: "20px", height: "100%", background: `linear-gradient(to right, ${C.spineShadow}44, transparent)`, pointerEvents: "none", zIndex: 5 }} />
      <div style={{ padding: "40px 28px 30px" }}>
        <div onClick={onBack} style={{ fontFamily: "'Noto Serif KR', serif", fontSize: "11px", fontWeight: 300, color: C.textSecondary, cursor: "pointer", marginBottom: "30px", letterSpacing: "1px" }}>‹ 서재</div>
        <h2 style={{ fontFamily: "'Noto Serif KR', serif", fontSize: "11px", fontWeight: 300, letterSpacing: "4px", color: C.textSecondary, textTransform: "uppercase", margin: "0 0 8px 0" }}>목차</h2>
        <div style={{ width: "30px", height: "1.5px", backgroundColor: C.accentQuote, marginBottom: "36px" }} />
        {BOOK_DATA.parts.map((part, pi) => {
          // Calculate cumulative page start for each chapter
          let cumulativePage = 1;
          const chapterStartPages = {};
          for (const ch of BOOK_DATA.chapters) {
            chapterStartPages[ch.id] = cumulativePage;
            cumulativePage += ch.pages.length;
          }
          const totalPages = cumulativePage - 1;

          return (
          <div key={pi} style={{ marginBottom: "32px" }}>
            <div style={{ fontFamily: "'Noto Serif KR', serif", fontSize: "10px", fontWeight: 300, letterSpacing: "3px", color: C.accentQuote, marginBottom: "6px", textTransform: "uppercase", opacity: e ? 1 : 0, transition: `all 0.6s ease ${0.2 + pi * 0.15}s` }}>편 {part.partNumber}</div>
            <div style={{ fontFamily: "'Noto Serif KR', serif", fontSize: "16px", fontWeight: 600, color: C.textPrimary, marginBottom: "4px", opacity: e ? 1 : 0, transition: `all 0.6s ease ${0.25 + pi * 0.15}s` }}>{part.partTitle}</div>
            <div style={{ fontFamily: "'Noto Serif KR', serif", fontSize: "12px", fontWeight: 300, color: C.textSecondary, marginBottom: "20px", opacity: e ? 1 : 0, transition: `opacity 0.6s ease ${0.3 + pi * 0.15}s` }}>{part.partSubtitle}</div>
            {part.chapters.map((chId, ci) => {
              const ch = BOOK_DATA.chapters.find(c => c.id === chId);
              const startPage = chapterStartPages[ch.id];
              return (
                <div key={chId} onClick={() => onSelectChapter(chId)} style={{ display: "flex", alignItems: "baseline", gap: "12px", padding: "12px 0", borderBottom: `1px solid ${C.spineShadow}88`, cursor: "pointer", opacity: e ? 1 : 0, transform: e ? "translateX(0)" : "translateX(-10px)", transition: `all 0.5s ease ${0.3 + pi * 0.15 + ci * 0.08}s` }}>
                  <span style={{ fontFamily: "'Noto Serif KR', serif", fontSize: "11px", fontWeight: 300, color: C.textSecondary, width: "18px", flexShrink: 0 }}>{String(ch.id).padStart(2, "0")}</span>
                  <span style={{ fontFamily: "'Noto Serif KR', serif", fontSize: "14.5px", fontWeight: 400, color: C.textPrimary, lineHeight: 1.6, flex: 1 }}>{ch.title}</span>
                  <span style={{ fontFamily: "'Noto Serif KR', serif", fontSize: "11px", color: C.textSecondary, flexShrink: 0, minWidth: "28px", textAlign: "right" }}>p.{startPage}</span>
                </div>
              );
            })}
          </div>
          );
        })}
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════
   READER
   ══════════════════════════════════════════════════════════════ */

const ReaderScreen = ({ chapter, onBack, onNextChapter, onPrevChapter, onPageChange, initialPage }) => {
  const [currentPage, setCurrentPage] = useState(initialPage || 0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [flipDirection, setFlipDirection] = useState(null);
  const [flipPhase, setFlipPhase] = useState("idle");
  const [aiPanelOpen, setAiPanelOpen] = useState(false);
  const containerRef = useRef(null);
  const touchStartX = useRef(0);
  const pages = chapter.pages;

  // Report progress on page change
  useEffect(() => {
    if (onPageChange) onPageChange(chapter.id, currentPage);
  }, [currentPage, chapter.id, onPageChange]);

  const goNext = useCallback(() => {
    if (isAnimating) return;
    if (currentPage >= pages.length - 1) { if (onNextChapter) onNextChapter(); return; }
    setIsAnimating(true); setFlipDirection("next"); setFlipPhase("flipping");
  }, [isAnimating, currentPage, pages.length, onNextChapter]);

  const goPrev = useCallback(() => {
    if (isAnimating) return;
    if (currentPage <= 0) { if (onPrevChapter) onPrevChapter(); return; }
    setIsAnimating(true); setFlipDirection("prev"); setFlipPhase("flipping");
  }, [isAnimating, currentPage, onPrevChapter]);

  useEffect(() => {
    if (flipPhase === "flipping") {
      const t = setTimeout(() => {
        setCurrentPage(p => flipDirection === "next" ? p + 1 : p - 1);
        setFlipPhase("idle"); setFlipDirection(null); setIsAnimating(false);
      }, 1100);
      return () => clearTimeout(t);
    }
  }, [flipPhase, flipDirection]);

  useEffect(() => { setCurrentPage(initialPage || 0); setIsAnimating(false); setFlipPhase("idle"); setFlipDirection(null); }, [chapter.id, initialPage]);

  const handleTap = useCallback((e) => {
    if (isAnimating) return;
    const rect = containerRef.current.getBoundingClientRect();
    if (e.clientX - rect.left > rect.width / 2) goNext(); else goPrev();
  }, [isAnimating, goNext, goPrev]);

  const handleTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e) => {
    if (isAnimating) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 40) { if (dx < 0) goNext(); else goPrev(); }
  };

  const cur = pages[currentPage];
  const nxt = currentPage < pages.length - 1 ? pages[currentPage + 1] : null;
  const prv = currentPage > 0 ? pages[currentPage - 1] : null;
  const flipStyle = flipPhase === "flipping" ? { animation: flipDirection === "next" ? "flipNext 1.1s cubic-bezier(0.4,0,0.2,1) forwards" : "flipPrev 1.1s cubic-bezier(0.4,0,0.2,1) forwards", transformOrigin: flipDirection === "next" ? "left center" : "right center" } : {};
  const partInfo = BOOK_DATA.parts.find(p => p.chapters.includes(chapter.id));

  return (
    <div ref={containerRef} onClick={handleTap} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}
      style={{ width: "390px", maxWidth: "100%", height: "720px", position: "relative", backgroundColor: C.pageBg, borderRadius: "4px 12px 12px 4px", overflow: "hidden", cursor: "pointer", userSelect: "none", boxShadow: bookShadow }}>
      <div style={{ position: "absolute", top: 0, left: 0, width: "20px", height: "100%", background: `linear-gradient(to right, ${C.spineShadow}44, transparent)`, zIndex: 5, pointerEvents: "none" }} />

      {flipPhase === "flipping" && (flipDirection === "next" ? nxt : prv) && (
        <div style={{ position: "absolute", inset: 0, zIndex: 1 }}>
          <PageContent page={flipDirection === "next" ? nxt : prv} chapterLabel={chapter.label} totalPages={pages.length} chapterId={chapter.id} />
        </div>
      )}
      <div style={{ position: "absolute", inset: 0, zIndex: flipPhase === "flipping" ? 2 : 1, backfaceVisibility: "hidden", ...flipStyle }}>
        <PageContent page={cur} chapterLabel={chapter.label} totalPages={pages.length} chapterId={chapter.id} />
      </div>

      {/* TOC button only */}
      <div onClick={(e) => { e.stopPropagation(); onBack(); }} style={{ position: "absolute", top: "12px", right: "14px", zIndex: 10, fontFamily: "'Noto Serif KR', serif", fontSize: "10px", fontWeight: 300, color: C.textSecondary, cursor: "pointer", padding: "4px 8px", borderRadius: "4px", backgroundColor: `${C.pageBg}cc`, backdropFilter: "blur(4px)" }}>목차 ›</div>


      <div style={{ position: "absolute", bottom: "4px", left: "50%", transform: "translateX(-50%)", fontFamily: "'Noto Serif KR', serif", fontSize: "9px", fontWeight: 300, color: `${C.textSecondary}88`, letterSpacing: "1px", zIndex: 10, pointerEvents: "none", whiteSpace: "nowrap" }}>{partInfo ? `${partInfo.partTitle} — ${partInfo.partSubtitle}` : ""}</div>

      {/* AI button — hidden on practice chat pages */}
      {!aiPanelOpen && !(cur.body?.length === 1 && cur.body[0]?.type === "chat") && (
        <div onClick={(e) => { e.stopPropagation(); setAiPanelOpen(true); }} style={{
          position: "absolute", bottom: "14px", left: "14px", zIndex: 15,
          padding: "7px 14px", borderRadius: "20px",
          backgroundColor: "#EDE8E0", color: "#8A7E6E",
          border: `1px solid ${C.accentQuote}88`,
          cursor: "pointer",
          fontFamily: "'Noto Serif KR', serif", fontSize: "11px", fontWeight: 300,
          letterSpacing: "0.3px",
          backdropFilter: "blur(4px)",
        }}>
          AI에게 질문하기
        </div>
      )}

      {/* AI Panel */}
      <AIPanel
        isOpen={aiPanelOpen}
        onClose={() => setAiPanelOpen(false)}
        pageContext={getPageText(cur, chapter.title)}
        chapterTitle={chapter.title}
      />
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════
   AI QUESTION PANEL (Claude API)
   ══════════════════════════════════════════════════════════════ */

// Extract plain text from page body for context
const getPageText = (page, chapterTitle) => {
  let text = `[${chapterTitle}] ${page.title}\n\n`;
  for (const b of page.body) {
    if (b.type === "chat") continue;
    if (b.text) text += b.text + "\n";
    if (b.desc) text += b.label + ": " + b.desc + "\n";
    if (b.example) text += b.example + "\n";
  }
  return text.trim();
};

const AIPanel = ({ isOpen, onClose, pageContext, chapterTitle }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // No auto-focus — user taps input when ready to type

  // Reset when page changes
  useEffect(() => {
    setMessages([]);
    setInput("");
  }, [pageContext]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", text: userMsg }]);
    setLoading(true);

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: `당신은 'AI 책장' 학습 앱의 도우미입니다. 사용자가 현재 읽고 있는 페이지 내용을 바탕으로 친절하고 쉽게 답변해주세요. 코딩 지식이 없는 AI 입문자를 대상으로 합니다. 답변은 간결하게 3~5문장으로 해주세요.\n\n현재 페이지 내용:\n${pageContext}`,
          messages: [
            ...messages.map(m => ({ role: m.role === "user" ? "user" : "assistant", content: m.text })),
            { role: "user", content: userMsg }
          ],
        })
      });
      const data = await response.json();
      const aiText = data.content?.map(c => c.text || "").join("") || "죄송합니다, 답변을 생성하지 못했어요.";
      setMessages(prev => [...prev, { role: "ai", text: aiText }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: "ai", text: "네트워크 오류가 발생했어요. 다시 시도해 주세요." }]);
    }
    setLoading(false);
  };

  const quickQuestions = [
    "이 내용을 더 쉽게 설명해줘",
    "실생활 예시를 들어줘",
    "핵심을 한 줄로 요약해줘",
  ];

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
      onTouchEnd={(e) => e.stopPropagation()}
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: isOpen ? "75%" : "0",
        backgroundColor: C.pageBg,
        borderRadius: "16px 16px 0 0",
        boxShadow: isOpen ? "0 -4px 30px rgba(0,0,0,0.12)" : "none",
        transition: "height 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        overflow: "hidden",
        zIndex: 20,
        display: "flex",
        flexDirection: "column",
        fontFamily: "'Noto Serif KR', serif",
      }}
    >
      {/* Handle bar + header */}
      <div style={{ padding: "12px 20px 8px", borderBottom: `1px solid ${C.spineShadow}`, flexShrink: 0 }}>
        <div style={{ width: "32px", height: "3px", backgroundColor: C.spineShadow, borderRadius: "2px", margin: "0 auto 12px" }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: "10px", fontWeight: 300, letterSpacing: "2px", color: C.accentQuote, textTransform: "uppercase" }}>AI에게 질문하기</div>
            <div style={{ fontSize: "12px", fontWeight: 300, color: C.textSecondary, marginTop: "2px" }}>{chapterTitle}</div>
          </div>
          <div onClick={onClose} style={{ fontSize: "11px", color: C.textSecondary, cursor: "pointer", padding: "4px 8px" }}>닫기</div>
        </div>
      </div>

      {/* Chat messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "12px 16px", WebkitOverflowScrolling: "touch" }}>
        {messages.length === 0 && !loading && (
          <div style={{ padding: "16px 0" }}>
            <div style={{ fontSize: "13px", fontWeight: 300, color: C.textSecondary, marginBottom: "16px", lineHeight: 1.7 }}>
              현재 페이지 내용에 대해 궁금한 점을 물어보세요.
            </div>
            {/* Quick question buttons */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {quickQuestions.map((q, i) => (
                <div key={i} onClick={() => { setInput(q); }} style={{
                  padding: "10px 14px", borderRadius: "8px",
                  border: `1px solid ${C.spineShadow}`,
                  fontSize: "12.5px", fontWeight: 300, color: C.textPrimary,
                  cursor: "pointer", lineHeight: 1.5,
                }}>
                  {q}
                </div>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start", marginBottom: "10px" }}>
            <div style={{
              maxWidth: "85%", padding: "10px 14px",
              borderRadius: msg.role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
              backgroundColor: msg.role === "user" ? C.userBubble : C.practiceBox,
              color: msg.role === "user" ? "#FAF9F6" : C.textPrimary,
              border: msg.role === "ai" ? `1px solid ${C.spineShadow}` : "none",
              fontSize: "13px", fontWeight: 300, lineHeight: 1.8, whiteSpace: "pre-line",
            }}>
              {msg.text}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: "10px" }}>
            <div style={{
              padding: "10px 14px", borderRadius: "14px 14px 14px 4px",
              backgroundColor: C.practiceBox, border: `1px solid ${C.spineShadow}`,
              fontSize: "13px", fontWeight: 300, color: C.textSecondary,
            }}>
              생각 중<span style={{ animation: "blink 1s step-end infinite" }}>...</span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input area */}
      <div style={{ padding: "10px 14px 14px", borderTop: `1px solid ${C.spineShadow}`, flexShrink: 0, display: "flex", gap: "8px" }}>
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") sendMessage(); }}
          placeholder="질문을 입력하세요..."
          style={{
            flex: 1, padding: "10px 14px",
            borderRadius: "10px", border: `1px solid ${C.spineShadow}`,
            backgroundColor: C.practiceBox,
            fontFamily: "'Noto Serif KR', serif", fontSize: "13px", fontWeight: 300,
            color: C.textPrimary, outline: "none",
          }}
        />
        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          style={{
            padding: "10px 16px", borderRadius: "10px", border: "none",
            backgroundColor: loading || !input.trim() ? C.spineShadow : C.userBubble,
            color: loading || !input.trim() ? C.textSecondary : "#FAF9F6",
            fontFamily: "'Noto Serif KR', serif", fontSize: "12px", fontWeight: 400,
            cursor: loading ? "default" : "pointer",
            flexShrink: 0,
          }}
        >
          전송
        </button>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════
   LIBRARY / SHELF HOME SCREEN
   ══════════════════════════════════════════════════════════════ */

const LibraryScreen = ({ onSelectBook, readingProgress }) => {
  const [entered, setEntered] = useState(false);
  const [toast, setToast] = useState(false);
  useEffect(() => { setTimeout(() => setEntered(true), 100); }, []);

  const showToast = () => {
    setToast(true);
    setTimeout(() => setToast(false), 2000);
  };

  const totalPages = BOOK_DATA.chapters.reduce((sum, ch) => sum + ch.pages.length, 0);
  const pagesRead = readingProgress.lastChapter
    ? BOOK_DATA.chapters.slice(0, readingProgress.lastChapter - 1).reduce((sum, ch) => sum + ch.pages.length, 0) + (readingProgress.lastPage || 0)
    : 0;
  const progressPercent = Math.round((pagesRead / totalPages) * 100);
  const isReading = pagesRead > 0;
  const lastChData = readingProgress.lastChapter ? BOOK_DATA.chapters.find(c => c.id === readingProgress.lastChapter) : null;

  // Pick a daily tip based on date
  const dailyTips = [
    { ch: 1, tip: "AI에게 질문할 때 대상, 상황, 형식 세 가지를 넣어보세요." },
    { ch: 2, tip: "\"너는 ~야\" 한 마디로 AI의 관점을 완전히 바꿀 수 있어요." },
    { ch: 3, tip: "\"3줄로\", \"표로\" — 형식 하나만 붙여도 답이 달라져요." },
    { ch: 5, tip: "AI한테 글 다듬기, 요약, 번역, 아이디어 — 오늘 하나만 시켜보세요." },
    { ch: 6, tip: "답이 별로면 끝내지 말고 \"더 짧게\", \"예시 들어줘\"로 이어가세요." },
    { ch: 7, tip: "내 직업, 목표, 제약을 알려주면 AI 답변이 확 달라져요." },
    { ch: 8, tip: "하루에 한 번만 써도, 한 달이면 30번의 연습이 쌓입니다." },
    { ch: 9, tip: "사실 확인은 검색, 아이디어는 AI — 구분해서 쓰는 게 실력이에요." },
  ];
  const todayTip = dailyTips[new Date().getDate() % dailyTips.length];

  return (
    <div style={{
      width: "390px", maxWidth: "100%", minHeight: "720px",
      backgroundColor: C.deskBg,
      position: "relative", userSelect: "none", boxSizing: "border-box",
      padding: "0",
    }}>
      {/* Header */}
      <div style={{
        padding: "48px 28px 24px",
        opacity: entered ? 1 : 0,
        transform: entered ? "translateY(0)" : "translateY(-10px)",
        transition: "all 0.6s ease 0.1s",
      }}>
        <div style={{ fontFamily: "'Noto Serif KR', serif", fontSize: "10px", fontWeight: 300, letterSpacing: "4px", color: C.textSecondary, textTransform: "uppercase", marginBottom: "8px" }}>
          AI 책장
        </div>
        <div style={{ fontFamily: "'Noto Serif KR', serif", fontSize: "22px", fontWeight: 600, color: C.textPrimary, lineHeight: 1.4 }}>
          나의 서재
        </div>
      </div>

      {/* Book card */}
      <div
        onClick={onSelectBook}
        style={{
          margin: "0 20px",
          borderRadius: "12px",
          overflow: "hidden",
          cursor: "pointer",
          backgroundColor: C.pageBg,
          boxShadow: "0 4px 20px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)",
          opacity: entered ? 1 : 0,
          transform: entered ? "translateY(0)" : "translateY(15px)",
          transition: "all 0.7s ease 0.3s",
        }}
      >
        {/* Book visual */}
        <div style={{
          padding: "32px 28px 24px",
          background: `linear-gradient(135deg, ${C.pageBg} 0%, #F5F3EE 100%)`,
          borderBottom: `1px solid ${C.spineShadow}`,
          position: "relative",
        }}>
          {/* Decorative spine lines */}
          <div style={{ position: "absolute", left: "16px", top: "20px", bottom: "20px", width: "3px", borderRadius: "2px", background: `linear-gradient(to bottom, ${C.spineShadow}, ${C.accentQuote}66, ${C.spineShadow})` }} />

          <div style={{ marginLeft: "20px" }}>
            <div style={{ fontFamily: "'Noto Serif KR', serif", fontSize: "9px", fontWeight: 300, letterSpacing: "3px", color: C.accentQuote, textTransform: "uppercase", marginBottom: "10px" }}>
              입문 + 중급 · 10챕터
            </div>
            <div style={{ fontFamily: "'Noto Serif KR', serif", fontSize: "19px", fontWeight: 600, color: C.textPrimary, lineHeight: 1.5, marginBottom: "6px" }}>
              ChatGPT를 제대로 써먹기
            </div>
            <div style={{ fontFamily: "'Noto Serif KR', serif", fontSize: "13px", fontWeight: 300, color: C.textSecondary }}>
              검색 대신 AI를 부리는 법
            </div>
          </div>
        </div>

        {/* Progress section */}
        <div style={{ padding: "18px 28px 20px" }}>
          {isReading ? (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                <span style={{ fontFamily: "'Noto Serif KR', serif", fontSize: "12px", fontWeight: 300, color: C.textSecondary }}>
                  읽는 중 · {lastChData ? lastChData.title : ""}
                </span>
                <span style={{ fontFamily: "'Noto Serif KR', serif", fontSize: "12px", fontWeight: 600, color: C.textPrimary }}>
                  {progressPercent}%
                </span>
              </div>
              {/* Progress bar */}
              <div style={{ width: "100%", height: "3px", backgroundColor: C.spineShadow, borderRadius: "2px", overflow: "hidden" }}>
                <div style={{ width: `${progressPercent}%`, height: "100%", backgroundColor: C.accentQuote, borderRadius: "2px", transition: "width 0.5s ease" }} />
              </div>
              <div style={{ fontFamily: "'Noto Serif KR', serif", fontSize: "11px", fontWeight: 300, color: C.textSecondary, marginTop: "10px", display: "flex", justifyContent: "space-between" }}>
                <span>{pagesRead} / {totalPages} 페이지</span>
                <span style={{ color: C.accentQuote }}>탭해서 이어 읽기 ›</span>
              </div>
            </>
          ) : (
            <div style={{ fontFamily: "'Noto Serif KR', serif", fontSize: "13px", fontWeight: 300, color: C.accentQuote, letterSpacing: "0.5px" }}>
              아직 읽지 않은 책 · 탭해서 시작하기
            </div>
          )}
        </div>
      </div>

      {/* Daily tip card */}
      <div style={{
        margin: "20px 20px 0",
        padding: "20px 24px",
        borderRadius: "12px",
        backgroundColor: `${C.pageBg}88`,
        border: `1px solid ${C.spineShadow}88`,
        opacity: entered ? 1 : 0,
        transform: entered ? "translateY(0)" : "translateY(15px)",
        transition: "all 0.7s ease 0.5s",
      }}>
        <div style={{ fontFamily: "'Noto Serif KR', serif", fontSize: "10px", fontWeight: 300, letterSpacing: "2px", color: C.accentQuote, textTransform: "uppercase", marginBottom: "10px" }}>
          오늘의 한 페이지
        </div>
        <div style={{ fontFamily: "'Noto Serif KR', serif", fontSize: "13.5px", fontWeight: 300, color: C.textPrimary, lineHeight: 1.9 }}>
          {todayTip.tip}
        </div>
        <div style={{ fontFamily: "'Noto Serif KR', serif", fontSize: "11px", fontWeight: 300, color: C.textSecondary, marginTop: "10px" }}>
          — 챕터 {todayTip.ch}에서
        </div>
      </div>

      {/* Coming soon books */}
      <div style={{
        margin: "20px 20px 0",
        display: "flex", gap: "12px",
        opacity: entered ? 1 : 0,
        transition: "all 0.7s ease 0.7s",
      }}>
        {[
          { title: "AI로 글쓰기", sub: "블로그·보고서·이메일" },
          { title: "나만의 GPT 만들기", sub: "자동화·워크플로우" },
        ].map((book, i) => (
          <div key={i} onClick={showToast} style={{
            flex: 1, padding: "20px 16px", borderRadius: "10px",
            backgroundColor: `${C.pageBg}44`,
            border: `1px dashed ${C.spineShadow}`,
            position: "relative", overflow: "hidden",
            opacity: 0.4, cursor: "pointer",
          }}>
            <div style={{ fontFamily: "'Noto Serif KR', serif", fontSize: "13px", fontWeight: 600, color: C.textPrimary, lineHeight: 1.5, marginBottom: "4px" }}>
              {book.title}
            </div>
            <div style={{ fontFamily: "'Noto Serif KR', serif", fontSize: "10px", fontWeight: 300, color: C.textSecondary }}>
              {book.sub}
            </div>
            <div style={{
              position: "absolute", top: "8px", right: "8px",
              fontFamily: "'Noto Serif KR', serif", fontSize: "9px", fontWeight: 300,
              color: C.accentQuote, letterSpacing: "1px",
              padding: "2px 8px", borderRadius: "8px",
              backgroundColor: `${C.spineShadow}66`,
            }}>
              준비 중
            </div>
          </div>
        ))}
      </div>

      {/* Toast message */}
      {toast && (
        <div style={{
          position: "fixed", bottom: "40px", left: "50%", transform: "translateX(-50%)",
          fontFamily: "'Noto Serif KR', serif", fontSize: "13px", fontWeight: 300,
          color: "#FAF9F6", backgroundColor: C.userBubble,
          padding: "12px 24px", borderRadius: "24px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
          zIndex: 100, whiteSpace: "nowrap",
          animation: "toastIn 0.3s ease",
        }}>
          곧 출시 예정이에요!
        </div>
      )}

      {/* Footer */}
      <div style={{
        padding: "32px 28px",
        textAlign: "center",
        opacity: entered ? 1 : 0,
        transition: "opacity 0.7s ease 0.9s",
      }}>
        <div style={{ fontFamily: "'Noto Serif KR', serif", fontSize: "10px", fontWeight: 300, color: `${C.textSecondary}66`, letterSpacing: "2px" }}>
          AI 책장 · 2025
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════
   COMPLETION SCREEN
   ══════════════════════════════════════════════════════════════ */

const CompletionScreen = ({ onBackToLibrary }) => {
  const [entered, setEntered] = useState(false);
  useEffect(() => { setTimeout(() => setEntered(true), 100); }, []);

  const totalPages = BOOK_DATA.chapters.reduce((sum, ch) => sum + ch.pages.length, 0);

  return (
    <div style={{
      width: "390px", maxWidth: "100%", height: "720px",
      backgroundColor: C.pageBg, borderRadius: "4px 12px 12px 4px",
      position: "relative", userSelect: "none",
      display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",
      padding: "40px", boxSizing: "border-box",
      boxShadow: bookShadow, overflow: "hidden",
    }}>
      {/* Spine */}
      <div style={{ position: "absolute", top: 0, left: 0, width: "20px", height: "100%", background: `linear-gradient(to right, ${C.spineShadow}44, transparent)`, pointerEvents: "none" }} />

      {/* Decorative line */}
      <div style={{
        width: "50px", height: "1.5px", backgroundColor: C.accentQuote, marginBottom: "36px",
        opacity: entered ? 1 : 0, transition: "opacity 1s ease 0.3s",
      }} />

      {/* Congratulation emoji */}
      <div style={{
        fontSize: "48px", marginBottom: "24px",
        opacity: entered ? 1 : 0,
        transform: entered ? "scale(1)" : "scale(0.5)",
        transition: "all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.4s",
      }}>
        🎉
      </div>

      {/* Title */}
      <div style={{
        fontFamily: "'Noto Serif KR', serif", fontSize: "10px", fontWeight: 300,
        letterSpacing: "4px", color: C.accentQuote, textTransform: "uppercase", marginBottom: "16px",
        opacity: entered ? 1 : 0, transition: "opacity 0.8s ease 0.6s",
      }}>
        완독을 축하합니다
      </div>

      <h1 style={{
        fontFamily: "'Noto Serif KR', serif", fontSize: "22px", fontWeight: 600,
        color: C.textPrimary, textAlign: "center", lineHeight: 1.6, margin: "0 0 12px 0",
        opacity: entered ? 1 : 0, transform: entered ? "translateY(0)" : "translateY(10px)",
        transition: "all 0.8s ease 0.7s",
      }}>
        ChatGPT를<br />제대로 써먹기
      </h1>

      <p style={{
        fontFamily: "'Noto Serif KR', serif", fontSize: "14px", fontWeight: 300,
        color: C.textSecondary, textAlign: "center", lineHeight: 1.8, margin: "0 0 32px 0",
        opacity: entered ? 1 : 0, transition: "opacity 0.8s ease 0.9s",
      }}>
        입문편 5챕터 + 중급편 5챕터<br />{totalPages}페이지를 모두 읽었습니다.
      </p>

      {/* Decorative line */}
      <div style={{
        width: "50px", height: "1.5px", backgroundColor: C.accentQuote, marginBottom: "32px",
        opacity: entered ? 1 : 0, transition: "opacity 1s ease 1s",
      }} />

      {/* Quote */}
      <blockquote style={{
        fontFamily: "'Noto Serif KR', serif", fontSize: "13.5px", fontWeight: 300,
        fontStyle: "italic", color: C.textPrimary, textAlign: "center",
        lineHeight: 2.0, margin: "0 0 36px 0", maxWidth: "280px",
        opacity: entered ? 1 : 0, transition: "opacity 0.8s ease 1.1s",
      }}>
        "이제 AI는 검색창이 아니라<br />
        생각을 같이 하는 파트너가 됐을 것이다.<br />
        배운 것을 오늘 하나만 써보자.<br />
        그게 진짜 시작이다."
      </blockquote>

      {/* Back to library */}
      <div
        onClick={onBackToLibrary}
        style={{
          fontFamily: "'Noto Serif KR', serif", fontSize: "12px", fontWeight: 300,
          color: C.accentQuote, letterSpacing: "2px", cursor: "pointer",
          padding: "10px 24px", borderRadius: "24px",
          border: `1px solid ${C.accentQuote}66`,
          opacity: entered ? 1 : 0, transition: "opacity 1s ease 1.3s",
        }}
      >
        서재로 돌아가기
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════
   MAIN APP
   ══════════════════════════════════════════════════════════════ */

export default function AIBookshelf() {
  const [screen, setScreen] = useState("library"); // library | cover | toc | reader
  const [activeChapterId, setActiveChapterId] = useState(null);
  const [transition, setTransition] = useState(false);
  const [readingProgress, setReadingProgress] = useState({ lastChapter: null, lastPage: null });
  const [storageLoaded, setStorageLoaded] = useState(false);

  const [startPage, setStartPage] = useState(null); // initial page for reader

  // Load progress from persistent storage on mount
  useEffect(() => {
    const loadProgress = async () => {
      try {
        const result = await window.storage.get("reading-progress");
        if (result && result.value) {
          const saved = JSON.parse(result.value);
          if (saved.lastChapter) {
            setReadingProgress(saved);
          }
        }
      } catch (e) {
        // No saved progress yet — that's fine
      }
      setStorageLoaded(true);
    };
    loadProgress();
  }, []);

  // Save progress to persistent storage whenever it changes
  useEffect(() => {
    if (!storageLoaded) return; // Don't save before initial load
    if (!readingProgress.lastChapter) return; // Nothing to save
    const saveProgress = async () => {
      try {
        await window.storage.set("reading-progress", JSON.stringify(readingProgress));
      } catch (e) {
        // Storage unavailable — continue without saving
      }
    };
    saveProgress();
  }, [readingProgress, storageLoaded]);

  const navigateTo = (target, chapterId = null, pageIdx = null) => {
    setTransition(true);
    setTimeout(() => {
      setScreen(target);
      if (chapterId !== null) setActiveChapterId(chapterId);
      setStartPage(pageIdx);
      setTimeout(() => setTransition(false), 50);
    }, 300);
  };

  // Handle book tap from library — resume or start fresh
  const handleSelectBook = () => {
    if (readingProgress.lastChapter) {
      // Resume: go directly to reader at last position
      navigateTo("reader", readingProgress.lastChapter, (readingProgress.lastPage || 1) - 1);
    } else {
      // New: go to cover
      navigateTo("cover");
    }
  };

  // Update progress when page changes in reader
  const updateProgress = useCallback((chapterId, pageIdx) => {
    setReadingProgress(prev => {
      const prevTotal = prev.lastChapter
        ? BOOK_DATA.chapters.slice(0, prev.lastChapter - 1).reduce((s, c) => s + c.pages.length, 0) + (prev.lastPage || 0)
        : 0;
      const newTotal = BOOK_DATA.chapters.slice(0, chapterId - 1).reduce((s, c) => s + c.pages.length, 0) + pageIdx + 1;
      if (newTotal > prevTotal) {
        return { lastChapter: chapterId, lastPage: pageIdx + 1 };
      }
      return prev;
    });
  }, []);

  const activeChapter = BOOK_DATA.chapters.find(c => c.id === activeChapterId);
  const handleNextChapter = () => {
    const idx = BOOK_DATA.chapters.findIndex(c => c.id === activeChapterId);
    if (idx < BOOK_DATA.chapters.length - 1) navigateTo("reader", BOOK_DATA.chapters[idx + 1].id);
    else navigateTo("completion");
  };
  const handlePrevChapter = () => {
    const idx = BOOK_DATA.chapters.findIndex(c => c.id === activeChapterId);
    if (idx > 0) navigateTo("reader", BOOK_DATA.chapters[idx - 1].id);
    else navigateTo("toc");
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", backgroundColor: C.deskBg, padding: "16px" }}>
      <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@300;400;600&display=swap" rel="stylesheet" />
      <style>{`
        @keyframes flipNext { 0% { transform: perspective(1800px) rotateY(0deg); box-shadow: inset 0 0 0 rgba(0,0,0,0); } 40% { box-shadow: inset -8px 0 30px rgba(0,0,0,0.08); } 100% { transform: perspective(1800px) rotateY(-160deg); box-shadow: inset 0 0 0 rgba(0,0,0,0); } }
        @keyframes flipPrev { 0% { transform: perspective(1800px) rotateY(0deg); box-shadow: inset 0 0 0 rgba(0,0,0,0); } 40% { box-shadow: inset 8px 0 30px rgba(0,0,0,0.08); } 100% { transform: perspective(1800px) rotateY(160deg); box-shadow: inset 0 0 0 rgba(0,0,0,0); } }
        @keyframes pulse { 0%, 100% { opacity: 0.6; } 50% { opacity: 1; } }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        @keyframes toastIn { 0% { opacity: 0; transform: translateX(-50%) translateY(10px); } 100% { opacity: 1; transform: translateX(-50%) translateY(0); } }
        * { -webkit-tap-highlight-color: transparent; }
        *::-webkit-scrollbar { width: 0; }
      `}</style>
      <div style={{ opacity: transition ? 0 : 1, transform: transition ? "scale(0.97)" : "scale(1)", transition: "all 0.3s ease" }}>
        {screen === "library" && <LibraryScreen onSelectBook={handleSelectBook} readingProgress={readingProgress} />}
        {screen === "cover" && <CoverScreen onOpen={() => navigateTo("toc")} onBackToLibrary={() => navigateTo("library")} />}
        {screen === "toc" && <TOCScreen onSelectChapter={(id) => navigateTo("reader", id)} onBack={() => navigateTo("library")} />}
        {screen === "reader" && activeChapter && <ReaderScreen chapter={activeChapter} onBack={() => navigateTo("toc")} onNextChapter={handleNextChapter} onPrevChapter={handlePrevChapter} onPageChange={updateProgress} initialPage={startPage} />}
        {screen === "completion" && <CompletionScreen onBackToLibrary={() => navigateTo("library")} />}
      </div>
    </div>
  );
}

/**
 * 의미 사전 모듈
 * 
 * 한글 단어와 영어 변환 후보를 관리
 * 배열 형태로 동의어 지원, 점수 기반 정확도 관리
 */

/**
 * 의미 변환 후보
 */
export interface SemanticCandidate {
  /** 영어 변환 후보 */
  english: string
  /** 신뢰도 점수 (0-1) */
  confidence: number
}

/**
 * 의미 사전 타입
 * 키: 한글 단어, 값: 영어 변환 후보 배열
 */
export type SemanticDictionary = Record<string, SemanticCandidate[]>

/**
 * 기본 의미 사전
 * 
 * 실제 상품명과 파일명을 기반으로 확장 가능
 */
const BASE_SEMANTIC_DICT: SemanticDictionary = {
  // 과일
  사과: [
    { english: 'apple', confidence: 1.0 },
    { english: 'apples', confidence: 0.95 },
    { english: 'fresh apple', confidence: 0.85 },
    { english: 'korean apple', confidence: 0.8 },
  ],
  고당도사과: [
    { english: 'high sugar apple', confidence: 1.0 },
    { english: 'sweet apple', confidence: 0.95 },
    { english: 'highsugarapple', confidence: 0.9 },
  ],
  꿀사과: [
    { english: 'honey apple', confidence: 1.0 },
    { english: 'sweethoneyapple', confidence: 0.95 },
    { english: 'sweet apple', confidence: 0.9 },
  ],
  배: [
    { english: 'pear', confidence: 1.0 },
    { english: 'pears', confidence: 0.95 },
  ],
  딸기: [
    { english: 'strawberry', confidence: 1.0 },
    { english: 'strawberries', confidence: 0.95 },
    { english: 'fresh strawberry', confidence: 0.85 },
  ],
  설향딸기: [
    { english: 'seolhyang strawberry', confidence: 1.0 },
    { english: 'seolhyangstrawberry', confidence: 0.95 },
    { english: 'korean strawberry', confidence: 0.9 },
  ],
  포도: [
    { english: 'grape', confidence: 1.0 },
    { english: 'grapes', confidence: 0.95 },
  ],
  샤인머스캣: [
    { english: 'shine muscat', confidence: 1.0 },
    { english: 'shinemuscat', confidence: 0.95 },
    { english: 'green grape', confidence: 0.8 },
  ],
  복숭아: [
    { english: 'peach', confidence: 1.0 },
    { english: 'peaches', confidence: 0.95 },
  ],
  참외: [
    { english: 'melon', confidence: 1.0 },
    { english: 'oriental melon', confidence: 0.8 },
  ],
  멜론: [
    { english: 'melon', confidence: 1.0 },
    { english: 'melons', confidence: 0.95 },
  ],
  머스크: [
    { english: 'musk', confidence: 1.0 },
  ],
  머스크멜론: [
    { english: 'muskmelon', confidence: 1.0 },
    { english: 'musk melon', confidence: 0.95 },
    { english: 'sweet melon', confidence: 0.85 },
  ],
  수박: [
    { english: 'watermelon', confidence: 1.0 },
  ],
  
  // 꿀/당도 관련
  꿀: [
    { english: 'honey', confidence: 1.0 },
    { english: 'raw honey', confidence: 0.9 },
    { english: 'natural honey', confidence: 0.85 },
  ],
  벌꿀: [
    { english: 'honey', confidence: 1.0 },
    { english: 'bee honey', confidence: 0.9 },
  ],
  당도: [
    { english: 'sugar content', confidence: 1.0 },
    { english: 'sweetness', confidence: 0.95 },
  ],
  고당도: [
    { english: 'high sugar', confidence: 1.0 },
    { english: 'high sweetness', confidence: 0.95 },
    { english: 'highsugar', confidence: 0.9 },
  ],
  보장: [
    { english: 'guaranteed', confidence: 1.0 },
    { english: 'guarantee', confidence: 0.9 },
  ],
  당도보장: [
    { english: 'guaranteed sugar content', confidence: 1.0 },
    { english: 'guaranteedsugarcontent', confidence: 0.95 },
    { english: 'sugar content guaranteed', confidence: 0.9 },
  ],
  당: [
    { english: 'sugar', confidence: 0.9 },
  ],
  
  // 접두어
  고: [
    { english: 'high', confidence: 1.0 },
  ],
  신선: [
    { english: 'fresh', confidence: 1.0 },
  ],
  프리미엄: [
    { english: 'premium', confidence: 1.0 },
  ],
  명품: [
    { english: 'luxury', confidence: 1.0 },
    { english: 'premium', confidence: 0.9 },
  ],
  유기농: [
    { english: 'organic', confidence: 1.0 },
    { english: 'bio', confidence: 0.85 },
  ],
  무농약: [
    { english: 'pesticide free', confidence: 1.0 },
    { english: 'pesticide-free', confidence: 0.95 },
    { english: 'pesticidefree', confidence: 0.9 },
  ],
  무항생제: [
    { english: 'antibioticfree', confidence: 1.0 },
    { english: 'antibiotic free', confidence: 0.9 },
  ],
  냉동: [
    { english: 'frozen', confidence: 1.0 },
  ],
  냉장: [
    { english: 'chilled', confidence: 1.0 },
    { english: 'refrigerated', confidence: 0.9 },
  ],
  특별: [
    { english: 'special', confidence: 1.0 },
  ],
  특란: [
    { english: 'special egg', confidence: 1.0 },
    { english: 'specialegg', confidence: 0.95 },
    { english: 'special eggs', confidence: 0.95 },
    { english: 'special', confidence: 0.85 },
  ],
  신선특란: [
    { english: 'fresh special egg', confidence: 1.0 },
    { english: 'freshspecialegg', confidence: 0.95 },
    { english: 'fresh special', confidence: 0.9 },
  ],
  산지직송: [
    { english: 'direct from farm', confidence: 1.0 },
    { english: 'directfromfarm', confidence: 0.95 },
    { english: 'farm direct', confidence: 0.95 },
  ],
  국내산: [
    { english: 'korean origin', confidence: 1.0 },
    { english: 'koreanorigin', confidence: 0.95 },
    { english: 'made in korea', confidence: 0.95 },
  ],
  수입산: [
    { english: 'imported', confidence: 1.0 },
  ],
  
  // 포장/용도
  대용량: [
    { english: 'bulk size', confidence: 1.0 },
    { english: 'bulksize', confidence: 0.95 },
    { english: 'large pack', confidence: 0.9 },
  ],
  소포장: [
    { english: 'small pack', confidence: 1.0 },
    { english: 'smallpack', confidence: 0.95 },
  ],
  가정용: [
    { english: 'home use', confidence: 1.0 },
    { english: 'homeuse', confidence: 0.95 },
  ],
  업소용: [
    { english: 'food service', confidence: 1.0 },
    { english: 'foodservice', confidence: 0.95 },
    { english: 'restaurant use', confidence: 0.95 },
  ],
  
  // 식품 유형
  간편식: [
    { english: 'ready meal', confidence: 1.0 },
    { english: 'readymeal', confidence: 0.95 },
    { english: 'convenience food', confidence: 0.95 },
  ],
  간편: [
    { english: 'easy', confidence: 1.0 },
    { english: 'convenient', confidence: 0.95 },
    { english: 'simple', confidence: 0.9 },
  ],
  즉석식품: [
    { english: 'instant food', confidence: 1.0 },
    { english: 'instantfood', confidence: 0.95 },
  ],
  밀프렙: [
    { english: 'meal prep', confidence: 1.0 },
    { english: 'mealprep', confidence: 0.95 },
  ],
  
  // 건강/영양
  다이어트: [
    { english: 'diet', confidence: 1.0 },
    { english: 'low calorie', confidence: 0.9 },
  ],
  저칼로리: [
    { english: 'low calorie', confidence: 1.0 },
    { english: 'lowcalorie', confidence: 0.95 },
  ],
  고단백: [
    { english: 'high protein', confidence: 1.0 },
    { english: 'highprotein', confidence: 0.95 },
  ],
  저당: [
    { english: 'low sugar', confidence: 1.0 },
    { english: 'lowsugar', confidence: 0.95 },
  ],
  무가당: [
    { english: 'no sugar added', confidence: 1.0 },
    { english: 'nosugaradded', confidence: 0.95 },
    { english: 'sugar free', confidence: 0.9 },
  ],
  
  // 선물
  선물세트: [
    { english: 'gift set', confidence: 1.0 },
    { english: 'giftset', confidence: 0.95 },
    { english: 'gift package', confidence: 0.95 },
  ],
  명절선물: [
    { english: 'holiday gift', confidence: 1.0 },
    { english: 'holidaygift', confidence: 0.95 },
    { english: 'korean holiday gift', confidence: 0.95 },
  ],
  
  // 주스 관련
  착즙: [
    { english: 'squeezed', confidence: 1.0 },
  ],
  오렌지: [
    { english: 'orange', confidence: 1.0 },
    { english: 'oranges', confidence: 0.9 },
  ],
  주스: [
    { english: 'juice', confidence: 1.0 },
  ],
  착즙오렌지주스: [
    { english: 'squeezed orange juice', confidence: 1.0 },
    { english: 'squeezedorangejuice', confidence: 0.9 },
  ],
  
  // 피자
  피자: [
    { english: 'pizza', confidence: 1.0 },
  ],
  냉동피자: [
    { english: 'frozen pizza', confidence: 1.0 },
    { english: 'frozenpizza', confidence: 0.9 },
  ],
  
  // 크로와상/생지
  크로와상: [
    { english: 'croissant', confidence: 1.0 },
  ],
  생지: [
    { english: 'dough', confidence: 1.0 },
  ],
  크로와상생지: [
    { english: 'croissant dough', confidence: 1.0 },
    { english: 'croissantdough', confidence: 0.9 },
  ],
  
  // 양파/링
  양파: [
    { english: 'onion', confidence: 1.0 },
    { english: 'onions', confidence: 0.9 },
  ],
  링: [
    { english: 'ring', confidence: 1.0 },
    { english: 'rings', confidence: 0.9 },
  ],
  양파링: [
    { english: 'onion ring', confidence: 1.0 },
    { english: 'onionring', confidence: 0.9 },
    { english: 'onion rings', confidence: 0.9 },
  ],
  
  // 기타
  샤인: [
    { english: 'shine', confidence: 1.0 },
  ],
  머스캣: [
    { english: 'muscat', confidence: 1.0 },
  ],
  초코: [
    { english: 'choco', confidence: 1.0 },
  ],
  초콜릿: [
    { english: 'chocolate', confidence: 1.0 },
  ],
  칩: [
    { english: 'chip', confidence: 1.0 },
    { english: 'chips', confidence: 0.9 },
  ],
  초코칩: [
    { english: 'chocolate chip', confidence: 1.0 },
    { english: 'chocolatechip', confidence: 0.9 },
    { english: 'chocochip', confidence: 0.8 },
  ],
  파이: [
    { english: 'pie', confidence: 1.0 },
  ],
  과자: [
    { english: 'snack', confidence: 1.0 },
    { english: 'cookie', confidence: 0.9 },
    { english: 'snacks', confidence: 0.9 },
  ],
  쿠키: [
    { english: 'cookie', confidence: 1.0 },
    { english: 'cookies', confidence: 0.9 },
  ],
  
  // 고기 관련
  닭: [
    { english: 'chicken', confidence: 1.0 },
    { english: 'poultry', confidence: 0.85 },
    { english: 'dak', confidence: 0.8 }, // 로마자 표기
  ],
  닭고기: [
    { english: 'chicken meat', confidence: 1.0 },
    { english: 'chicken', confidence: 0.95 },
  ],
  소: [
    { english: 'beef', confidence: 1.0 },
    { english: 'so', confidence: 0.7 }, // 로마자 표기
  ],
  소고기: [
    { english: 'beef', confidence: 1.0 },
  ],
  한우: [
    { english: 'korean beef', confidence: 1.0 },
    { english: 'koreanbeef', confidence: 0.9 },
    { english: 'hanwoo', confidence: 0.8 },
    { english: 'beef', confidence: 0.7 },
  ],
  불고기: [
    { english: 'bulgogi', confidence: 1.0 },
    { english: 'bulgogi', confidence: 0.9 },
  ],
  갈비: [
    { english: 'galbi', confidence: 1.0 },
    { english: 'ribs', confidence: 0.8 },
  ],
  닭갈비: [
    { english: 'dakgalbi', confidence: 1.0 },
    { english: 'chicken galbi', confidence: 0.9 },
  ],
  돼지고기: [
    { english: 'pork', confidence: 1.0 },
  ],
  
  // 지역명
  춘천: [
    { english: 'chuncheon', confidence: 1.0 },
  ],
  안동: [
    { english: 'andong', confidence: 1.0 },
  ],
  제주: [
    { english: 'jeju', confidence: 1.0 },
  ],
  강릉: [
    { english: 'gangneung', confidence: 1.0 },
  ],
  태백: [
    { english: 'taebaek', confidence: 1.0 },
  ],
  영광: [
    { english: 'yeonggwang', confidence: 1.0 },
  ],
  상주: [
    { english: 'sangju', confidence: 1.0 },
  ],
  완도: [
    { english: 'wando', confidence: 1.0 },
  ],
  
  // 기타 식자재
  아몬드: [
    { english: 'almond', confidence: 1.0 },
  ],
  브리즈: [
    { english: 'breeze', confidence: 1.0 },
  ],
  올리브: [
    { english: 'olive', confidence: 1.0 },
  ],
  올리브유: [
    { english: 'olive oil', confidence: 1.0 },
    { english: 'oliveoil', confidence: 0.9 },
  ],
  블루베리: [
    { english: 'blueberry', confidence: 1.0 },
    { english: 'blueberries', confidence: 0.95 },
  ],
  토마토: [
    { english: 'tomato', confidence: 1.0 },
    { english: 'tomatoes', confidence: 0.95 },
  ],
  방울토마토: [
    { english: 'cherry tomato', confidence: 1.0 },
    { english: 'cherrytomato', confidence: 0.95 },
    { english: 'cherry tomatoes', confidence: 0.95 },
  ],
  대추방울토마토: [
    { english: 'cherry tomato', confidence: 1.0 },
    { english: 'cherrytomato', confidence: 0.95 },
    { english: 'cherry tomatoes', confidence: 0.95 },
  ],
  대추: [
    { english: 'jujube', confidence: 1.0 },
    { english: 'date', confidence: 0.9 },
  ],
  방울: [
    { english: 'cherry', confidence: 1.0 },
    { english: 'drop', confidence: 0.8 },
  ],
  체리: [
    { english: 'cherry', confidence: 1.0 },
  ],
  감귤: [
    { english: 'tangerine', confidence: 1.0 },
    { english: 'mandarin', confidence: 0.95 },
    { english: 'citrus', confidence: 0.85 },
  ],
  귤: [
    { english: 'tangerine', confidence: 1.0 },
    { english: 'mandarin', confidence: 0.95 },
    { english: 'citrus', confidence: 0.85 },
  ],
  제주감귤: [
    { english: 'jeju tangerine', confidence: 1.0 },
    { english: 'jejutangerine', confidence: 0.95 },
    { english: 'jeju mandarin', confidence: 0.95 },
    { english: 'korean tangerine', confidence: 0.9 },
  ],
  바나나: [
    { english: 'banana', confidence: 1.0 },
    { english: 'bananas', confidence: 0.95 },
  ],
  파인애플: [
    { english: 'pineapple', confidence: 1.0 },
    { english: 'pineapples', confidence: 0.95 },
  ],
  망고: [
    { english: 'mango', confidence: 1.0 },
    { english: 'mangoes', confidence: 0.95 },
  ],
  아보카도: [
    { english: 'avocado', confidence: 1.0 },
    { english: 'avocados', confidence: 0.95 },
  ],
  
  // 채소
  오이: [
    { english: 'cucumber', confidence: 1.0 },
    { english: 'cucumbers', confidence: 0.95 },
  ],
  애호박: [
    { english: 'zucchini', confidence: 1.0 },
    { english: 'korean zucchini', confidence: 0.9 },
  ],
  양배추: [
    { english: 'cabbage', confidence: 1.0 },
  ],
  상추: [
    { english: 'lettuce', confidence: 1.0 },
  ],
  깻잎: [
    { english: 'perilla leaf', confidence: 1.0 },
    { english: 'perillaleaf', confidence: 0.95 },
    { english: 'sesame leaf', confidence: 0.9 },
  ],
  시금치: [
    { english: 'spinach', confidence: 1.0 },
  ],
  브로콜리: [
    { english: 'broccoli', confidence: 1.0 },
  ],
  파프리카: [
    { english: 'paprika', confidence: 1.0 },
    { english: 'bell pepper', confidence: 0.95 },
  ],
  청경채: [
    { english: 'bok choy', confidence: 1.0 },
    { english: 'bokchoy', confidence: 0.95 },
    { english: 'pak choi', confidence: 0.95 },
  ],
  
  밀키트: [
    { english: 'meal kit', confidence: 1.0 },
    { english: 'mealkit', confidence: 0.95 },
  ],
  부대: [
    { english: 'budae', confidence: 1.0 },
    { english: 'army', confidence: 0.8 },
  ],
  부대찌개: [
    { english: 'budae jjigae', confidence: 1.0 },
    { english: 'budaejjigae', confidence: 0.95 },
    { english: 'army stew', confidence: 0.9 },
  ],
  부대찌개밀키트: [
    { english: 'budae jjigae meal kit', confidence: 1.0 },
    { english: 'budaejjigaemealkit', confidence: 0.95 },
    { english: 'army stew meal kit', confidence: 0.9 },
  ],
  찌개: [
    { english: 'jjigae', confidence: 1.0 },
    { english: 'stew', confidence: 0.9 },
    { english: 'soup', confidence: 0.8 },
  ],
  차돌: [
    { english: 'chadol', confidence: 1.0 },
    { english: 'brisket', confidence: 0.9 },
  ],
  차돌박이: [
    { english: 'chadolbagi', confidence: 1.0 },
    { english: 'chadol bagi', confidence: 0.95 },
    { english: 'brisket', confidence: 0.9 },
  ],
  차돌박이된장찌개: [
    { english: 'chadolbagi doenjang jjigae', confidence: 1.0 },
    { english: 'chadolbagidoenjangjjigae', confidence: 0.95 },
    { english: 'brisket doenjang stew', confidence: 0.9 },
  ],
  김치: [
    { english: 'kimchi', confidence: 1.0 },
  ],
  전복: [
    { english: 'abalone', confidence: 1.0 },
  ],
  굴비: [
    { english: 'gulbi', confidence: 1.0 },
  ],
  인절미: [
    { english: 'injeolmi', confidence: 1.0 },
  ],
  약과: [
    { english: 'yaggwa', confidence: 1.0 },
  ],
  전통: [
    { english: 'traditional', confidence: 1.0 },
    { english: 'traditional', confidence: 0.95 },
  ],
  
  // 추가 고기 관련
  소불고기: [
    { english: 'beef bulgogi', confidence: 1.0 },
    { english: 'beefbulgogi', confidence: 0.9 },
    { english: 'stir fried beef', confidence: 0.8 },
    { english: 'stirfriedbeef', confidence: 0.8 },
  ],
  볶음: [
    { english: 'stir fried', confidence: 1.0 },
    { english: 'stirfried', confidence: 0.9 },
    { english: 'fried', confidence: 0.8 },
  ],
  볶은: [
    { english: 'stir fried', confidence: 1.0 },
    { english: 'stirfried', confidence: 0.9 },
  ],
  볶음밥: [
    { english: 'fried rice', confidence: 1.0 },
    { english: 'friedrice', confidence: 0.95 },
    { english: 'stir fried rice', confidence: 0.9 },
    { english: 'stirfriedrice', confidence: 0.9 },
  ],
  간편볶음밥: [
    { english: 'easy fried rice', confidence: 1.0 },
    { english: 'easyfriedrice', confidence: 0.95 },
    { english: 'convenient fried rice', confidence: 0.9 },
  ],
  등심: [
    { english: 'sirloin', confidence: 1.0 },
    { english: 'loin steak', confidence: 0.9 },
    { english: 'brisket', confidence: 0.8 },
  ],
  
  // 형용사/수식어
  매콤한: [
    { english: 'spicy', confidence: 1.0 },
  ],
  매콤: [
    { english: 'spicy', confidence: 1.0 },
  ],
  바삭한: [
    { english: 'crispy', confidence: 1.0 },
  ],
  바삭: [
    { english: 'crispy', confidence: 1.0 },
  ],
  육즙: [
    { english: 'juicy', confidence: 1.0 },
  ],
  가득: [
    { english: 'full', confidence: 1.0 },
    { english: 'packed', confidence: 0.8 },
  ],
  육즙가득: [
    { english: 'juicy', confidence: 1.0 },
    { english: 'juicy full', confidence: 0.9 },
  ],
  
  // 해산물
  새우: [
    { english: 'shrimp', confidence: 1.0 },
    { english: 'prawn', confidence: 0.9 },
  ],
  연어: [
    { english: 'salmon', confidence: 1.0 },
  ],
  참치: [
    { english: 'tuna', confidence: 1.0 },
  ],
  고등어: [
    { english: 'mackerel', confidence: 1.0 },
  ],
  갈치: [
    { english: 'hairtail fish', confidence: 1.0 },
    { english: 'hairtailfish', confidence: 0.95 },
    { english: 'beltfish', confidence: 0.9 },
  ],
  오징어: [
    { english: 'squid', confidence: 1.0 },
  ],
  문어: [
    { english: 'octopus', confidence: 1.0 },
  ],
  조개: [
    { english: 'clam', confidence: 1.0 },
    { english: 'shellfish', confidence: 0.9 },
  ],
  새우깡: [
    { english: 'shrimp crackers', confidence: 1.0 },
    { english: 'shrimpcrackers', confidence: 0.9 },
  ],
  깡: [
    { english: 'crackers', confidence: 1.0 },
    { english: 'cracker', confidence: 0.9 },
  ],
  
  // 만두
  만두: [
    { english: 'dumpling', confidence: 1.0 },
    { english: 'dumplings', confidence: 0.9 },
    { english: 'mandu', confidence: 0.8 },
  ],
  
  // 버터/카라멜/팝콘
  버터: [
    { english: 'butter', confidence: 1.0 },
  ],
  카라멜: [
    { english: 'caramel', confidence: 1.0 },
  ],
  팝콘: [
    { english: 'popcorn', confidence: 1.0 },
  ],
  
  // 감자/감자칩
  감자: [
    { english: 'potato', confidence: 1.0 },
    { english: 'potatoes', confidence: 0.9 },
  ],
  감자칩: [
    { english: 'potato chips', confidence: 1.0 },
    { english: 'potatochips', confidence: 0.9 },
    { english: 'potato chip', confidence: 0.9 },
  ],
  
  // 감바스 알 아히요
  감바스: [
    { english: 'gambas', confidence: 1.0 },
  ],
  알: [
    { english: 'al', confidence: 1.0 },
  ],
  아히요: [
    { english: 'ajillo', confidence: 1.0 },
  ],
  감바스알아히요: [
    { english: 'gambas al ajillo', confidence: 1.0 },
    { english: 'gambasalajillo', confidence: 0.9 },
  ],
  
  // 세트
  세트: [
    { english: 'set', confidence: 1.0 },
    { english: 'bundle', confidence: 0.9 },
    { english: 'package', confidence: 0.85 },
  ],
  공동구매: [
    { english: 'group buying', confidence: 1.0 },
    { english: 'groupbuying', confidence: 0.95 },
    { english: 'bulk purchase', confidence: 0.95 },
    { english: 'bulkpurchase', confidence: 0.9 },
  ],
  명품한우세트: [
    { english: 'luxury korean beef set', confidence: 1.0 },
    { english: 'luxurykoreanbeefset', confidence: 0.9 },
  ],
  
  // 히말라야/솔트
  히말라야: [
    { english: 'himalayan', confidence: 1.0 },
    { english: 'himalaya', confidence: 0.9 },
  ],
  핑크: [
    { english: 'pink', confidence: 1.0 },
  ],
  솔트: [
    { english: 'salt', confidence: 1.0 },
  ],
  소금: [
    { english: 'salt', confidence: 1.0 },
  ],
  히말라야핑크솔트: [
    { english: 'himalayan pink salt', confidence: 1.0 },
    { english: 'himalayanpinksalt', confidence: 0.9 },
  ],
  
  // 치즈/돈까스
  치즈: [
    { english: 'cheese', confidence: 1.0 },
  ],
  볼: [
    { english: 'ball', confidence: 1.0 },
    { english: 'balls', confidence: 0.95 },
  ],
  치즈볼: [
    { english: 'cheese ball', confidence: 1.0 },
    { english: 'cheeseball', confidence: 0.95 },
    { english: 'cheese balls', confidence: 0.95 },
  ],
  모짜렐라치즈: [
    { english: 'mozzarella cheese', confidence: 1.0 },
    { english: 'mozzarellacheese', confidence: 0.95 },
    { english: 'mozzarella', confidence: 0.9 },
  ],
  돈까스: [
    { english: 'pork cutlet', confidence: 1.0 },
    { english: 'porkcutlet', confidence: 0.9 },
    { english: 'cutlet', confidence: 0.8 },
    { english: 'tonkatsu', confidence: 0.7 },
  ],
  돼지: [
    { english: 'pork', confidence: 1.0 },
  ],
  까스: [
    { english: 'cutlet', confidence: 1.0 },
  ],
  
  // 과일 (감 관련)
  감: [
    { english: 'persimmon', confidence: 1.0 },
    { english: 'persimmons', confidence: 0.9 },
  ],
  단감: [
    { english: 'sweet persimmon', confidence: 1.0 },
    { english: 'sweetpersimmon', confidence: 0.9 },
    { english: 'persimmon', confidence: 0.8 },
  ],
  단: [
    { english: 'sweet', confidence: 1.0 },
  ],
  
  // 빵/곡물 관련
  빵: [
    { english: 'bread', confidence: 1.0 },
  ],
  식빵: [
    { english: 'bread', confidence: 1.0 },
    { english: 'white bread', confidence: 0.9 },
  ],
  통밀: [
    { english: 'whole wheat', confidence: 1.0 },
    { english: 'wholewheat', confidence: 0.9 },
    { english: 'whole grain', confidence: 0.8 },
  ],
  통: [
    { english: 'whole', confidence: 1.0 },
  ],
  밀: [
    { english: 'wheat', confidence: 1.0 },
  ],
  밀가루: [
    { english: 'flour', confidence: 1.0 },
    { english: 'wheat flour', confidence: 0.9 },
  ],
  통밀빵: [
    { english: 'whole wheat bread', confidence: 1.0 },
    { english: 'wholewheatbread', confidence: 0.9 },
  ],
  
  // 쌀/곡물
  쌀: [
    { english: 'rice', confidence: 1.0 },
  ],
  백미: [
    { english: 'white rice', confidence: 1.0 },
    { english: 'whiterice', confidence: 0.95 },
  ],
  현미: [
    { english: 'brown rice', confidence: 1.0 },
    { english: 'brownrice', confidence: 0.95 },
  ],
  잡곡: [
    { english: 'mixed grains', confidence: 1.0 },
    { english: 'mixedgrains', confidence: 0.95 },
    { english: 'multigrain', confidence: 0.9 },
  ],
  찹쌀: [
    { english: 'glutinous rice', confidence: 1.0 },
    { english: 'glutinousrice', confidence: 0.95 },
    { english: 'sticky rice', confidence: 0.9 },
  ],
  
  // 고구마 관련
  고구마: [
    { english: 'sweet potato', confidence: 1.0 },
    { english: 'sweetpotato', confidence: 0.95 },
  ],
  스틱: [
    { english: 'stick', confidence: 1.0 },
    { english: 'sticks', confidence: 0.95 },
  ],
  고구마스틱: [
    { english: 'sweet potato stick', confidence: 1.0 },
    { english: 'sweetpotatostick', confidence: 0.95 },
    { english: 'sweet potato sticks', confidence: 0.95 },
  ],
  밤고구마: [
    { english: 'chestnut sweet potato', confidence: 1.0 },
    { english: 'chestnutsweetpotato', confidence: 0.95 },
    { english: 'sweet potato', confidence: 0.85 },
  ],
  호박고구마: [
    { english: 'pumpkin sweet potato', confidence: 1.0 },
    { english: 'pumpkinsweetpotato', confidence: 0.95 },
    { english: 'sweet potato', confidence: 0.85 },
  ],
  
  // 마늘 관련
  마늘: [
    { english: 'garlic', confidence: 1.0 },
  ],
  양념마늘: [
    { english: 'seasoned garlic', confidence: 1.0 },
    { english: 'seasonedgarlic', confidence: 0.95 },
    { english: 'marinated garlic', confidence: 0.9 },
  ],
  다진마늘: [
    { english: 'minced garlic', confidence: 1.0 },
    { english: 'mincedgarlic', confidence: 0.95 },
    { english: 'chopped garlic', confidence: 0.9 },
  ],
  
  // 파 관련
  대파: [
    { english: 'green onion', confidence: 1.0 },
    { english: 'scallion', confidence: 0.95 },
  ],
  쪽파: [
    { english: 'chive', confidence: 1.0 },
    { english: 'small green onion', confidence: 0.9 },
  ],
  
  // 계란 관련
  계란: [
    { english: 'egg', confidence: 1.0 },
    { english: 'eggs', confidence: 0.95 },
  ],
  유정란: [
    { english: 'fertile egg', confidence: 1.0 },
    { english: 'fertileegg', confidence: 0.95 },
    { english: 'free range egg', confidence: 0.9 },
  ],
  무항생제계란: [
    { english: 'antibiotic free egg', confidence: 1.0 },
    { english: 'antibioticfreeegg', confidence: 0.95 },
  ],
  
  // 우유 관련
  우유: [
    { english: 'milk', confidence: 1.0 },
  ],
  저지방우유: [
    { english: 'low fat milk', confidence: 1.0 },
    { english: 'lowfatmilk', confidence: 0.95 },
  ],
  무지방우유: [
    { english: 'skim milk', confidence: 1.0 },
    { english: 'skimmilk', confidence: 0.95 },
  ],
  
  // 요거트 관련
  요거트: [
    { english: 'yogurt', confidence: 1.0 },
    { english: 'yoghurt', confidence: 0.95 },
  ],
  그릭요거트: [
    { english: 'greek yogurt', confidence: 1.0 },
    { english: 'greekyogurt', confidence: 0.95 },
  ],
  
  // 버섯 관련
  버섯: [
    { english: 'mushroom', confidence: 1.0 },
    { english: 'mushrooms', confidence: 0.95 },
  ],
  표고버섯: [
    { english: 'shiitake mushroom', confidence: 1.0 },
    { english: 'shiitakemushroom', confidence: 0.95 },
    { english: 'shiitake', confidence: 0.95 },
  ],
  새송이버섯: [
    { english: 'king oyster mushroom', confidence: 1.0 },
    { english: 'kingoystermushroom', confidence: 0.95 },
    { english: 'oyster mushroom', confidence: 0.9 },
  ],
  
  // 김 관련
  김: [
    { english: 'seaweed', confidence: 1.0 },
  ],
  조미김: [
    { english: 'seasoned seaweed', confidence: 1.0 },
    { english: 'seasonedseaweed', confidence: 0.95 },
    { english: 'roasted seaweed', confidence: 0.95 },
  ],
  
  // 기름/장 관련
  참기름: [
    { english: 'sesame oil', confidence: 1.0 },
    { english: 'sesameoil', confidence: 0.95 },
  ],
  들기름: [
    { english: 'perilla oil', confidence: 1.0 },
    { english: 'perillaoil', confidence: 0.95 },
  ],
  간장: [
    { english: 'soy sauce', confidence: 1.0 },
    { english: 'soysauce', confidence: 0.95 },
  ],
  고추장: [
    { english: 'gochujang', confidence: 1.0 },
    { english: 'korean chili paste', confidence: 0.9 },
  ],
  
  // 라면 관련
  컵라면: [
    { english: 'cup noodles', confidence: 1.0 },
    { english: 'cupnoodles', confidence: 0.95 },
    { english: 'instant cup ramen', confidence: 0.95 },
  ],
  봉지라면: [
    { english: 'instant ramen', confidence: 1.0 },
    { english: 'instantramen', confidence: 0.95 },
  ],
  
  // 즉석식품
  즉석밥: [
    { english: 'instant rice', confidence: 1.0 },
    { english: 'instantrice', confidence: 0.95 },
    { english: 'ready rice', confidence: 0.95 },
  ],
  도시락: [
    { english: 'lunch box', confidence: 1.0 },
    { english: 'lunchbox', confidence: 0.95 },
    { english: 'meal box', confidence: 0.9 },
  ],
  
  // 냉동만두
  냉동만두: [
    { english: 'frozen dumpling', confidence: 1.0 },
    { english: 'frozendumpling', confidence: 0.95 },
  ],
  
  // 아이스크림 관련
  아이스크림: [
    { english: 'ice cream', confidence: 1.0 },
    { english: 'icecream', confidence: 0.95 },
  ],
  바닐라아이스크림: [
    { english: 'vanilla ice cream', confidence: 1.0 },
    { english: 'vanillaicecream', confidence: 0.95 },
  ],
  
  // 커피 관련
  커피: [
    { english: 'coffee', confidence: 1.0 },
  ],
  원두: [
    { english: 'coffee bean', confidence: 1.0 },
    { english: 'coffeebean', confidence: 0.95 },
    { english: 'coffee beans', confidence: 0.95 },
  ],
  콜드브루: [
    { english: 'cold brew', confidence: 1.0 },
    { english: 'coldbrew', confidence: 0.95 },
  ],
  
  // 차 관련
  차: [
    { english: 'tea', confidence: 1.0 },
  ],
  녹차: [
    { english: 'green tea', confidence: 1.0 },
    { english: 'greentea', confidence: 0.95 },
  ],
  홍차: [
    { english: 'black tea', confidence: 1.0 },
    { english: 'blacktea', confidence: 0.95 },
  ],
}

/**
 * 의미 사전 인스턴스 (런타임에 확장 가능)
 */
let semanticDict: SemanticDictionary = { ...BASE_SEMANTIC_DICT }

/**
 * 의미 사전에 단어 추가
 * 
 * @param korean 한글 단어
 * @param candidates 영어 변환 후보
 */
export function addToSemanticDict(
  korean: string,
  candidates: SemanticCandidate[]
): void {
  if (!semanticDict[korean]) {
    semanticDict[korean] = []
  }
  
  // 중복 제거 후 추가
  for (const candidate of candidates) {
    const exists = semanticDict[korean].some(
      c => c.english === candidate.english
    )
    if (!exists) {
      semanticDict[korean].push(candidate)
    }
  }
  
  // confidence 기준으로 정렬
  semanticDict[korean].sort((a, b) => b.confidence - a.confidence)
}

/**
 * 한글 단어의 영어 변환 후보 가져오기
 * 
 * @param korean 한글 단어
 * @returns 영어 변환 후보 배열 (confidence 높은 순)
 */
export function getSemanticCandidates(korean: string): SemanticCandidate[] {
  return semanticDict[korean] || []
}

/**
 * 한글 단어를 영어로 변환 (최고 confidence 후보 선택)
 * 
 * @param korean 한글 단어
 * @returns 영어 변환 (없으면 null)
 */
export function translateToEnglish(korean: string): string | null {
  const candidates = getSemanticCandidates(korean)
  return candidates.length > 0 && candidates[0] ? candidates[0].english : null
}

/**
 * 의미 사전 초기화 (테스트용)
 */
export function resetSemanticDict(): void {
  semanticDict = { ...BASE_SEMANTIC_DICT }
}

/**
 * 현재 의미 사전 가져오기 (디버깅용)
 */
export function getSemanticDict(): SemanticDictionary {
  return { ...semanticDict }
}

/**
 * 의미 사전에 있는 모든 한글 단어 목록 가져오기 (복합어 분리용)
 */
export function getKnownKoreanWords(): Set<string> {
  return new Set(Object.keys(semanticDict))
}

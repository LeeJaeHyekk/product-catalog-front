/**
 * 영어 키워드 매핑
 * 
 * 한글 키워드에 대응하는 영어 키워드 매핑
 * category.json의 items에 영어 버전을 추가하기 위한 매핑 테이블
 */

/**
 * 한글 → 영어 키워드 매핑
 */
export const ENGLISH_KEYWORD_MAP: Record<string, string[]> = {
  // 과일
  사과: ['apple', 'apples'],
  배: ['pear', 'pears'],
  감귤: ['citrus', 'tangerine', 'mandarin'],
  딸기: ['strawberry', 'strawberries'],
  포도: ['grape', 'grapes'],
  복숭아: ['peach', 'peaches'],
  참외: ['oriental melon', 'melon'],
  수박: ['watermelon'],
  키위: ['kiwi', 'kiwifruit'],
  망고: ['mango', 'mangoes'],

  // 채소
  배추: ['cabbage', 'napa cabbage'],
  무: ['radish', 'daikon'],
  양파: ['onion', 'onions'],
  감자: ['potato', 'potatoes'],
  대파: ['green onion', 'scallion', 'spring onion'],
  마늘: ['garlic'],
  고추: ['pepper', 'chili', 'chili pepper'],
  '쌈채소': ['lettuce', 'leafy greens', 'salad greens'],
  '버섯류': ['mushroom', 'mushrooms'],

  // 축산물
  한우: ['hanwoo', 'korean beef', 'beef'],
  돼지고기: ['pork'],
  닭고기: ['chicken'],
  오리고기: ['duck'],
  양고기: ['lamb', 'mutton'],

  // 수산물
  고등어: ['mackerel'],
  갈치: ['hairtail', 'cutlassfish'],
  굴: ['oyster', 'oysters'],
  새우: ['shrimp', 'prawn'],
  오징어: ['squid'],
  문어: ['octopus'],
  전복: ['abalone'],

  // 즉석식품
  라면: ['ramen', 'instant noodles', 'noodles'],
  즉석밥: ['instant rice', 'ready rice'],
  컵밥: ['cup rice', 'instant cup rice'],
  '레토르트 국': ['retort soup', 'instant soup'],
  '즉석 죽': ['instant porridge'],

  // 냉동식품
  냉동만두: ['frozen dumpling', 'frozen mandu'],
  냉동피자: ['frozen pizza'],
  냉동치킨: ['frozen chicken'],
  '튀김류': ['fried food', 'frozen fried'],

  // 유제품
  우유: ['milk'],
  요거트: ['yogurt', 'yoghurt'],
  치즈: ['cheese'],
  버터: ['butter'],
  생크림: ['cream', 'whipping cream'],

  // 밀키트
  '한식 밀키트': ['korean meal kit'],
  '중식 밀키트': ['chinese meal kit'],
  '양식 밀키트': ['western meal kit'],
  '분식 밀키트': ['snack meal kit'],
  '캠핑용 밀키트': ['camping meal kit'],

  // HMR
  도시락: ['lunch box', 'bento'],
  '완제품 국': ['ready soup', 'prepared soup'],
  '완제품 찌개': ['ready stew', 'prepared stew'],
  '즉석 덮밥': ['instant rice bowl'],

  // 곡류
  백미: ['white rice', 'polished rice'],
  현미: ['brown rice'],
  잡곡: ['mixed grains', 'multi-grain'],
  찹쌀: ['glutinous rice', 'sticky rice'],
  보리: ['barley'],

  // 계란
  특란: ['special grade eggs', 'large eggs'],
  유정란: ['fertilized eggs'],
  '무항생제 계란': ['antibiotic-free eggs', 'organic eggs'],

  // 콩류
  두부: ['tofu'],
  콩나물: ['bean sprouts'],
  된장: ['soybean paste', 'doenjang'],
  청국장: ['fermented soybean', 'cheonggukjang'],

  // 조미료
  간장: ['soy sauce'],
  고추장: ['gochujang', 'red pepper paste'],
  소금: ['salt'],
  설탕: ['sugar'],
  식용유: ['cooking oil', 'vegetable oil'],

  // 반찬류
  김치: ['kimchi'],
  젓갈: ['salted seafood', 'jeotgal'],
  나물: ['namul', 'seasoned vegetables'],
  '조림 반찬': ['braised side dish'],

  // 선물세트
  '과일 세트': ['fruit set', 'fruit gift set'],
  '정육 세트': ['meat set', 'meat gift set'],
  '한과 세트': ['korean traditional sweets set'],
  '건강식품 세트': ['health food set'],

  // 시즌 식품
  '김장 재료 세트': ['kimchi making set', 'kimjang set'],
  '여름 보양식': ['summer health food'],
  '겨울 제철 수산물': ['winter seasonal seafood'],
} as const

/**
 * 한글 키워드에 대한 영어 키워드 가져오기
 */
export function getEnglishKeywords(koreanKeyword: string): string[] {
  return ENGLISH_KEYWORD_MAP[koreanKeyword] || []
}

/**
 * 모든 영어 키워드 목록
 */
export function getAllEnglishKeywords(): string[] {
  return Object.values(ENGLISH_KEYWORD_MAP).flat()
}

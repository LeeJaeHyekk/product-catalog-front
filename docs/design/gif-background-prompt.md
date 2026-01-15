# 배경 이미지 생성 프롬프트 가이드

이 문서는 상품 카탈로그 웹사이트의 다양한 배경 이미지를 Gemini로 생성하기 위한 프롬프트를 제공합니다.

## 목차

1. [메인 페이지 배경 GIF](#1-메인-페이지-배경-gif)
2. [Product 페이지 배경 이미지](#2-product-페이지-배경-이미지)
3. [상품 카드 배경 이미지](#3-상품-카드-배경-이미지)
4. [파비콘 (Favicon)](#4-파비콘-favicon)

---

# 1. 메인 페이지 배경 GIF

## 사용 위치
- `app/page.tsx` - 상품 목록을 보기 전 메인 페이지

## Gemini 이미지 생성 프롬프트 (영문)

> **⚠️ 주의사항:** Gemini의 안전 가이드라인을 통과하기 위해 실제 매장명, 특정 국가명, 특정 언어 언급을 제거했습니다. 프롬프트를 그대로 사용하세요.

```
Create a subtle, looping animated GIF for a product catalog main page background. The GIF should evoke the feeling of a vibrant, fresh produce market or grocery store entrance, emphasizing abundance, freshness, and modern convenience.

**Visual Style & Mood:**
- Clean, modern, and inviting aesthetic suitable for an e-commerce product catalog
- Emphasize freshness, quality, and abundance of products
- Professional yet warm atmosphere
- Non-distracting background that complements product listings

**Key Elements to Include:**

1. **Fresh Produce Display:**
   - Abundant piles of fresh fruits and vegetables (green apples, red apples, various colorful produce)
   - Products arranged on pallets or market stalls, similar to outdoor market displays
   - Individual items wrapped in mesh nets or transparent bags, stacked in organized rows
   - Variety of colors: vibrant greens, fresh reds, natural yellows, and clean whites

2. **Storefront Elements (Subtle):**
   - Modern grocery store or fresh market entrance
   - Bright, clean lighting (natural daylight or warm indoor glow)
   - Large glass windows or open entrance suggesting transparency and freshness
   - Green awning or signage (subtle, not prominent) in fresh green tones (#1E7F4F to #2E9F6B)

3. **Color Palette:**
   - Dominant: Fresh greens (#1E7F4F, #2E9F6B) representing freshness and produce
   - Accent: Vibrant reds and yellows from fruits
   - Background: Clean whites and off-whites (#F7F8F7) for a modern, clean feel
   - Natural tones throughout

**Animation Details:**

1. **Subtle Movements (Very Gentle):**
   - Very slight, almost imperceptible swaying of fresh leaves or herbs
   - Gentle, slow pan or parallax effect across the product display
   - Soft light shimmer or reflection on fruits, creating a glistening effect
   - Subtle mist or dew effect over some produce (very light, almost invisible)

2. **Looping Requirements:**
   - Seamless, smooth loop (no jarring transitions)
   - Duration: 3-5 seconds per loop
   - Continuous, calming motion that doesn't distract from foreground content

3. **Composition:**
   - Wide shot from slightly elevated perspective
   - Showcase depth and abundance of products
   - Leave space in center/foreground for text overlay (title, CTA buttons)
   - Background should feel spacious but rich

**Technical Specifications:**
- Format: GIF
- Resolution: 1920x1080 (Full HD) or higher
- Frame rate: Smooth animation (15-24 fps)
- File size: Optimized for web (under 5MB if possible)
- Color depth: 256 colors (GIF standard) with dithering for smooth gradients

**What to Avoid:**
- No specific text or branding from reference images
- No distracting fast movements
- No people prominently featured (subtle silhouettes okay)
- No harsh shadows or dark areas
- No cluttered or messy appearance

**Reference Image Descriptions (for context):**

The inspiration comes from fresh produce markets and modern grocery stores featuring:
- Outdoor displays of fresh produce stacked on red/green pallets
- Bright green storefronts with modern signage (no text or specific language in the GIF)
- Abundant displays of individually netted fruits (green apples, red apples)
- Clean, modern storefronts with large windows
- Contemporary convenience grocery stores with organized product sections
- Vibrant, well-lit market scenes with subtle activity (shown very subtly)

**Final Output Goal:**
A beautiful, subtle animated background that immediately conveys "fresh produce," "abundance," and "modern convenience" when users first visit the product catalog main page. The GIF should feel inviting and professional, setting the right tone before users browse the actual product listings.
```

## 한국어 설명

### 이미지 설명

다음 이미지들을 참고하여 GIF를 생성해주세요:

#### 이미지 1: 야외 시장 장면
- 활기찬 야외 시장 풍경
- 신선한 농산물이 팔레트 위에 풍성하게 진열됨
- 초록색과 빨간색 팔레트 위에 다양한 포장된 상품들
- 배경에 초록색 간판이 있는 현대적인 상점
- 자연광이 잘 드는 밝은 낮 시간

#### 이미지 2: 신선한 농산물 매장 입구
- 신선한 농산물/식품 매장의 현대적인 입구
- 밝은 초록색 간판 (#1E7F4F 계열)
- 매장 외부에 망에 싸인 초록색 사과들이 팔레트 위에 쌓여 있음
- 붉은색 팔레트 위에 정돈된 과일 더미
- 넓은 유리문으로 매장 내부가 보임
- 깔끔하고 정돈된 인상

#### 이미지 3: 현대적인 식품 매장
- 현대적인 식품 매장의 야간 전경
- 밝은 초록색 간판과 현대적인 매장 외관
- 야외 진열대에 다양한 신선한 농산물 (수박, 과일 등)
- 투명 비닐로 보호된 진열 공간
- 매장 내부의 냉장고 유닛들이 유리창 너머로 보임
- 밝은 조명으로 신선함과 청결함 강조

**참고사항:** 실제 매장 이름이나 특정 지역명은 프롬프트에 포함하지 않습니다. 일반적인 시장/매장의 느낌만 참고하세요.

### 디자인 요구사항

1. **브랜드 컬러 반영**
   - 메인 컬러: 초록색 (#1E7F4F ~ #2E9F6B)
   - 배경: 오프화이트 (#F7F8F7)
   - 강조: 자연스러운 빨강, 노랑 (과일 색상)

2. **브랜드 정체성 반영**
   - "현장감을 살린 신뢰 중심 유통 플랫폼 UI"
   - 실제 매장의 느낌
   - 신선함과 풍성함 강조
   - 깔끔하고 정돈된 느낌

3. **사용 목적**
   - 상품 목록을 보기 전 메인 페이지 배경
   - 텍스트와 CTA 버튼이 위에 올라갈 예정
   - 사용자의 첫 인상을 결정하는 중요한 요소

4. **애니메이션 스타일**
   - 매우 미묘하고 부드러운 움직임
   - 배경으로 사용되므로 주의를 분산시키지 않아야 함
   - 신선함을 느낄 수 있는 자연스러운 움직임
   - 무한 반복되는 부드러운 루프

## 사용 방법

1. 위의 영문 프롬프트를 Gemini 이미지 생성 도구에 복사하여 사용
2. 필요시 참고 이미지들을 함께 첨부하여 더 정확한 결과물 생성
3. 생성된 GIF를 `public/` 폴더에 저장 (예: `main-page-bg.gif`)
4. `app/page.tsx`에서 배경 이미지로 적용

### 코드 적용 예시

```tsx
// app/page.tsx
<div 
  className="min-h-screen flex items-center justify-center relative"
  style={{
    backgroundImage: 'url(/main-page-bg.gif)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  }}
>
  {/* 기존 컨텐츠 */}
</div>
```

## 예상 결과물

- 신선한 농산물의 풍성함을 보여주는 미묘한 애니메이션
- 초록색 계열의 브랜드 컬러가 자연스럽게 반영
- 메인 페이지의 텍스트와 버튼이 잘 보이도록 적절한 명도/대비
- 부드럽고 반복되는 루프 애니메이션
- 웹 최적화된 파일 크기

---

# 2. Product 페이지 배경 이미지

## 사용 위치
- `app/products/page.tsx` - 상품 목록 페이지 전체 배경

## GPT 이미지 생성 프롬프트 (영문)

> **📝 GPT용 상세 프롬프트:** GPT는 복잡한 프롬프트를 잘 처리하므로, 요구사항을 최대한 상세하게 작성했습니다.

### 최종 추천 프롬프트 (이것을 사용하세요)

```
Create a gradient background image for an e-commerce product listing page. This background will be displayed behind white product cards, so it must be light but CLEARLY VISIBLE - NOT white or nearly white.

**CRITICAL - READ THIS FIRST:**
- The image MUST show a CLEAR gradient from light to darker gray
- The green tint MUST be VISIBLE across the entire image, not just in corners
- NO textures, NO grain, NO noise, NO speckling - ONLY pure smooth gradient
- The bottom should be noticeably darker gray than the top
- When someone looks at this image, they should immediately see it's NOT white

**Visual Style & Mood:**
- Clean, minimal aesthetic that feels professional and modern
- VISIBLE gradient that adds depth (light at top, darker gray at bottom)
- Light, airy atmosphere that enhances product visibility
- Sophisticated and refined feel suitable for a high-quality e-commerce platform

**Key Design Elements:**

1. **Background Style - Gradient (MANDATORY):**
   - Create a SMOOTH, CLEARLY VISIBLE gradient starting from off-white color #F7F8F7 (RGB: 247, 248, 247) at the TOP
   - Transition smoothly to a noticeably darker light gray tone #D5D7D5 (RGB: 213, 215, 213) at the BOTTOM
   - The gradient difference MUST be clearly visible - the bottom should look noticeably darker than the top
   - DO NOT make it almost white - the bottom gray (#D5D7D5) should be clearly distinguishable from white
   - Blend in a VISIBLE green tint using color #1E7F4F (RGB: 30, 127, 79) at 18-20% opacity evenly throughout the ENTIRE gradient
   - The green tint MUST be evenly distributed across the WHOLE image - every pixel should have the green tint
   - The green tint should be clearly noticeable - not subtle or barely visible
   - The gradient should flow vertically from top (lighter) to bottom (darker gray)
   - Ensure smooth, seamless color transitions without any visible banding or harsh edges
   - The overall effect should be a CLEARLY VISIBLE gradient with a noticeable green tint throughout
   - ABSOLUTELY NO textures, NO grain, NO noise, NO speckling, NO patterns - ONLY a pure, clean, smooth gradient
   - The final image should look like a smooth color gradient when viewed - like a Photoshop gradient tool was used
   - If you add any texture, grain, or noise, the image is WRONG

   **Option B - Minimal Organic Texture:**
   - Start with a very light, washed-out organic texture inspired by natural materials
   - Use an almost imperceptible natural pattern (like very subtle paper texture or soft fabric weave)
   - Apply 90-95% opacity reduction so the texture is barely visible
   - Use neutral tones with slight green undertones (#1E7F4F at 3-5% opacity)
   - The texture should feel organic and natural, not mechanical or digital
   - Ensure the texture doesn't create visual noise or compete with product images

   **Option C - Clean Solid with Subtle Geometric Accent:**
   - Use a solid off-white (#F7F8F7) as the base background
   - Add very subtle geometric patterns or evenly distributed dots in fresh green (#1E7F4F) at 3-8% opacity
   - The pattern should be so light it's almost invisible but adds subtle visual interest
   - Use modern, minimal geometric shapes (circles, hexagons, or subtle grid patterns)
   - Ensure even distribution across the entire image with no focal points
   - The pattern should feel contemporary and sophisticated

2. **Color Palette (STRICT REQUIREMENTS):**
   - Primary background start (top): Off-white #F7F8F7 (RGB: 247, 248, 247) - light and neutral
   - Primary background end (bottom): Light gray #D5D7D5 (RGB: 213, 215, 213) - MUST create CLEARLY VISIBLE contrast
   - The gradient difference MUST be noticeable - bottom (#D5D7D5) should be clearly darker than top (#F7F8F7)
   - The bottom color (#D5D7D5) is RGB 213,215,213 - this is noticeably darker than white (255,255,255)
   - Accent color: Fresh green #1E7F4F (RGB: 30, 127, 79) at 18-20% opacity - MUST be VISIBLE throughout the entire image
   - The green tint MUST be evenly blended across the WHOLE canvas - every single pixel should have the green tint
   - The green tint should be clearly noticeable - when you look at the image, you should see green, not just white
   - Alternative accent: Lighter green #2E9F6B (RGB: 46, 159, 107) at 20-22% opacity if a stronger green is needed
   - Neutral tones: Light grays (#D5D7D5, #D0D2D0) for gradient variation - these should be clearly distinguishable from white
   - Overall brightness: 75-85% to ensure product cards stand out while background gradient is clearly visible
   - Color saturation: The green tint should be clearly noticeable - if it's too subtle to see, increase the opacity

3. **Composition & Layout:**
   - Full page background dimensions: 1920x1080px minimum (3840x2160px recommended for 4K displays)
   - Seamless/tileable design if using patterns (should repeat without visible seams)
   - Even distribution of any subtle elements across the entire canvas
   - No focal points, strong visual elements, or areas that draw attention
   - Horizontal orientation suitable for web page backgrounds
   - Consider how the image will look when scrolled (if using fixed background)

**Technical Specifications:**
- Format: PNG (preferred for transparency support) or high-quality JPG
- Resolution: 1920x1080px minimum, 3840x2160px for high-DPI displays
- Color mode: RGB with sRGB color profile
- File size: Optimized for web (under 500KB if possible, but quality is priority)
- Color depth: 24-bit (8-bit per channel)
- Compression: Use lossless or high-quality compression to maintain smooth gradients

**Visual Requirements:**
- Must work perfectly with white/light product cards placed on top
- Should not interfere with product card readability or visibility
- Text overlays (if any) should remain clearly readable
- Should enhance the overall page aesthetic without being noticeable
- Must maintain visual consistency across different screen sizes and resolutions

**What to Avoid (CRITICAL):**
- ABSOLUTELY NO textures, NO grain, NO noise, NO speckling, NO paper texture, NO fabric texture
- NO bold patterns, high-contrast elements, or strong visual features
- NO distracting textures that compete with product images
- NO dark areas (must be very light throughout the entire image, but still show gradient)
- NO specific product images, recognizable objects, or identifiable elements
- NO text, branding elements, logos, or written content
- NO strong colors that reduce product card visibility or readability
- NO harsh transitions, visible seams, or digital artifacts
- NO busy or cluttered appearance
- DO NOT make it white or nearly white - it MUST show a visible gradient
- DO NOT add any texture or grain - it should be a pure smooth gradient like a Photoshop gradient

**Usage Context:**
This background image will be used:
- Behind a grid of product cards (white/light cards with product images and information)
- On a product listing page in an e-commerce catalog
- Must not interfere with product card readability or user experience
- Should enhance the overall page aesthetic subtly without being noticeable
- Works with a brand identity focused on fresh produce, quality, and modern convenience

**Brand Identity Considerations:**
- The background should subtly reflect a brand focused on fresh produce and quality goods
- Green accents (#1E7F4F) should hint at freshness and natural products
- The overall feel should be clean, organized, and professional
- Should convey trust, quality, and modern convenience without being obvious

**Final Output Goal:**
Create a beautiful, clearly visible gradient background image that:
- Shows a CLEAR gradient from off-white #F7F8F7 (top) to light gray #D5D7D5 (bottom) - NOT white
- The bottom (#D5D7D5) should be noticeably darker than the top - clearly visible difference
- Displays a VISIBLE green tint (#1E7F4F at 18-20% opacity) evenly distributed throughout the ENTIRE image
- The green tint should be clearly visible across the whole canvas - every pixel should have green tint
- When you look at the image, you should immediately see: "This is a gradient with green tint" - NOT white
- Maintains brand identity with visible fresh green hints
- Feels professional, clean, and sophisticated
- Enhances product visibility rather than competing with it
- Works seamlessly across different screen sizes and devices
- Creates a cohesive, polished look for the product listing page
- The gradient and green tint should be OBVIOUS when viewed - not subtle or barely visible

**CRITICAL REQUIREMENTS (MUST FOLLOW):**
- The background MUST NOT be pure white (255,255,255) or nearly white
- The gradient MUST be clearly visible - top (#F7F8F7 = RGB 247,248,247) to bottom (#D5D7D5 = RGB 213,215,213)
- The bottom color (#D5D7D5) is RGB 213,215,213 - this is 42 points darker than white (255) - MUST be visible
- The green tint (#1E7F4F at 18-20% opacity) MUST be evenly distributed across EVERY pixel of the image
- ABSOLUTELY NO textures, NO grain, NO noise, NO speckling, NO patterns - ONLY a pure smooth gradient
- The final image should look like a Photoshop gradient tool was used - pure smooth color transition
- If the image looks white or has any texture/grain, it is WRONG - regenerate it
- When someone looks at the image, they should immediately see: "This is clearly a gradient from light to darker gray with a green tint throughout"

**Expected Visual Result (Text Representation):**

간단한 시각화:

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  TOP (Lighter)                                              │
│  Color: #F7F8F7 (Off-white)                                │
│  + Green tint #1E7F4F (15% opacity)                        │
│  = Very light mint/off-white with subtle green              │
│                                                             │
│  ▼ Smooth vertical gradient ▼                               │
│                                                             │
│                                                             │
│                                                             │
│                                                             │
│                                                             │
│                                                             │
│                                                             │
│                                                             │
│                                                             │
│                                                             │
│                                                             │
│  ▼ Smooth vertical gradient ▼                               │
│                                                             │
│                                                             │
│                                                             │
│                                                             │
│                                                             │
│                                                             │
│                                                             │
│                                                             │
│                                                             │
│                                                             │
│                                                             │
│                                                             │
│                                                             │
│                                                             │
│                                                             │
│                                                             │
│                                                             │
│                                                             │
│                                                             │
│                                                             │
│                                                             │
│                                                             │
│                                                             │
│                                                             │
│                                                             │
│                                                             │
│                                                             │
│                                                             │
│                                                             │
│                                                             │
│                                                             │
│                                                             │
│                                                             │
│                                                             │
│                                                             │
│                                                             │
│                                                             │
│                                                             │
│                                                             │
│                                                             │
│                                                             │
│                                                             │
│                                                             │
│                                                             │
│                                                             │
│                                                             │
│                                                             │
│                                                             │
│                                                             │
│                                                             │
│                                                             │
│                                                             │
│                                                             │
│                                                             │
│                                                             │
│                                                             │
│                                                             │
│                                                             │
│                                                             │
| BOTTOM (Darker Gray)                                         │
│  Color: #E0E2E0 (Light gray)                                │
│  + Green tint #1E7F4F (15% opacity)                         │
│  = Light gray-green, noticeably darker than top              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Color Distribution Table:**

| 위치 | 기본 색상 | HEX | RGB | 초록 틴트 | 최종 색상 느낌 |
|------|----------|-----|-----|----------|--------------|
| **상단 (0%)** | Off-white | #F7F8F7 | (247, 248, 247) | #1E7F4F 15% | 매우 밝은 민트/오프화이트 |
| **상단-중간 (25%)** | Light | #F0F2F0 | (240, 242, 240) | #1E7F4F 15% | 밝은 민트 그레이 |
| **중간 (50%)** | Medium | #E8EAE8 | (232, 234, 232) | #1E7F4F 15% | 중간 민트 그레이 |
| **중간-하단 (75%)** | Darker | #E4E6E4 | (228, 230, 228) | #1E7F4F 15% | 어두운 민트 그레이 |
| **하단 (100%)** | Light Gray | #E0E2E0 | (224, 226, 224) | #1E7F4F 15% | 회색-민트, 명확히 보임 |

**Visual Characteristics:**
- 그라데이션이 명확히 보임 (상단 밝음 → 하단 어두움)
- 초록색 틴트가 전체에 고르게 분포
- 텍스처 없음 - 순수한 그라데이션
- 부드러운 색상 전환
- 흰색이 아님 - 명확히 구분 가능
```

---

### 대안 프롬프트 (간단한 버전이 필요한 경우)

#### 대안 1: 핵심만 포함한 버전 (더 강한 대비)
```
Create a CLEARLY VISIBLE gradient background image. Use a smooth gradient from off-white #F7F8F7 (RGB: 247, 248, 247) at the TOP transitioning to light gray #D5D7D5 (RGB: 213, 215, 213) at the BOTTOM. The bottom color (#D5D7D5) is RGB 213,215,213 which is noticeably darker than white (255,255,255) - this difference MUST be clearly visible. Blend in a VISIBLE green tint using color #1E7F4F (RGB: 30, 127, 79) at 20% opacity evenly throughout EVERY pixel of the image. Make it 1920x1080 pixels. The gradient should flow vertically from top to bottom. The green tint MUST be evenly distributed across the whole image - every pixel should have green tint. ABSOLUTELY NO textures, NO grain, NO noise, NO speckling, NO patterns - ONLY a pure smooth gradient like Photoshop gradient tool. The final image should be clearly distinguishable from pure white - when viewed, you should immediately see it's a gradient with green tint, not white.
```

#### 대안 2: 가장 단순한 버전 (더 강한 대비)
```
Create a CLEARLY VISIBLE gradient background. Start with off-white #F7F8F7 (RGB: 247,248,247) at top, transition to light gray #D5D7D5 (RGB: 213,215,213) at bottom. The bottom must be noticeably darker than white. Add green tint #1E7F4F at 20% opacity evenly across entire image - every pixel should have green. Make it 1920x1080 pixels. NO textures, NO grain, only pure smooth gradient. The gradient MUST be clearly visible - NOT white.
```

#### 대안 3: 이전 버전 (참고용 - 사용하지 않음)

> **참고:** 이 프롬프트는 이전 버전으로, 현재는 사용하지 않습니다. 참고용으로만 남겨둡니다.

```
Create a very subtle, static background image for an e-commerce product listing page. This background will be displayed behind white product cards in a grid layout, so it must be extremely subtle and non-distracting.

**Visual Style & Mood:**
- Ultra-minimal and clean aesthetic
- Extremely subtle texture or gradient that doesn't compete with product cards
- Professional, modern feel
- Light, airy atmosphere that enhances product visibility

**Key Design Elements:**

1. **Background Style Options:**

   **Option A - Subtle Gradient:**
   - Very light gradient from off-white (#F7F8F7) to slightly lighter gray
   - Extremely subtle green tint (#1E7F4F at 2-5% opacity) blended into the gradient
   - Smooth, seamless transition
   - No visible patterns or textures

   **Option B - Minimal Texture:**
   - Very light, washed-out organic texture
   - Almost imperceptible natural pattern
   - 90-95% opacity reduction so it's barely visible
   - Neutral tones with slight green undertones

   **Option C - Clean Solid with Subtle Accent:**
   - Solid off-white (#F7F8F7) background
   - Very subtle geometric pattern or dots in green (#1E7F4F) at 3-8% opacity
   - Pattern should be so light it's almost invisible
   - Modern, minimal aesthetic

2. **Color Palette:**
   - Primary: Off-white (#F7F8F7) - must be very light
   - Accent: Green (#1E7F4F, #2E9F6B) at extremely low opacity (2-8%)
   - Neutral tones: Very light grays, beiges
   - Overall brightness: 90-98% to ensure product cards stand out

3. **Composition:**
   - Full page background (1920x1080px minimum, scalable)
   - Seamless/tileable if using pattern
   - Even distribution of any subtle elements
   - No focal points that draw attention away from products

**Technical Specifications:**
- Format: PNG (preferred) or JPG
- Resolution: 1920x1080px minimum (3840x2160px for 4K displays)
- Color mode: RGB
- File size: Optimized for web (under 500KB if possible)
- Must work well with white/light product cards on top

**What to Avoid:**
- No bold patterns or high-contrast elements
- No distracting textures that compete with product images
- No dark areas (must be very light throughout)
- No specific product images or recognizable objects
- No text or branding elements
- No strong colors that reduce product card visibility

**Usage Context:**
This background image will be used:
- Behind a grid of product cards (white/light cards with product images)
- Must not interfere with product card readability
- Should enhance the overall page aesthetic without being noticeable

**Final Output Goal:**
A beautiful, almost imperceptible background that:
- Provides subtle visual interest without distracting from product cards
- Maintains brand identity with green hints (barely visible)
- Feels professional and clean
- Enhances product visibility rather than competing with it
- Works seamlessly across different screen sizes
```

## 한국어 설명

> **📌 GPT용 프롬프트:** 이 프롬프트는 GPT (DALL-E, Midjourney 등)를 위해 작성되었습니다. GPT는 복잡하고 상세한 프롬프트를 잘 처리하므로, 요구사항을 최대한 상세하게 포함했습니다.

### 사용 목적

Product 페이지의 배경 이미지는 다음 용도로 사용됩니다:

1. **상품 목록 페이지 전체 배경**
   - 상품 카드 그리드 뒤에 표시되는 배경
   - 상품 카드가 잘 보이도록 매우 미묘해야 함
   - 페이지 전체의 시각적 통일성 제공
   - 스크롤 시에도 자연스럽게 보여야 함

2. **브랜드 정체성 강조**
   - 미묘한 초록색 톤으로 브랜드 컬러 반영 (#1E7F4F)
   - 신선한 농산물 느낌을 은은하게 전달
   - 깔끔하고 전문적인 느낌 유지
   - 현대적이고 세련된 느낌

3. **가독성 보장**
   - 상품 카드(흰색/밝은 배경)가 명확히 보여야 함
   - 텍스트와 이미지가 잘 읽히도록 밝은 배경
   - 패턴이나 텍스처가 너무 강하지 않아야 함
   - 상품 정보에 집중할 수 있도록 방해하지 않아야 함

### 디자인 요구사항

1. **브랜드 컬러 반영**
   - 메인 컬러: 초록색 (#1E7F4F ~ #2E9F6B) - 매우 낮은 투명도 (2-8%)
   - 배경: 오프화이트 (#F7F8F7) 또는 매우 밝은 회색
   - 전체적으로 매우 밝은 톤 (90-98% 밝기) 유지

2. **미묘함 강조**
   - 상품 카드에 집중할 수 있도록 거의 보이지 않을 정도로 미묘
   - 패턴이나 텍스처가 있다면 매우 연하게 처리
   - 배경이 주인공이 되지 않도록 주의

3. **기술적 요구사항**
   - 전체 페이지 배경 (1920x1080px 이상)
   - 타일링 가능 (반복 패턴 사용 시)
   - 웹 최적화된 파일 크기
   - 다양한 화면 크기에서 잘 작동

### 추천 스타일 옵션

GPT 프롬프트에는 3가지 옵션이 모두 포함되어 있습니다. GPT에게 원하는 옵션을 선택하도록 요청하거나, 여러 옵션을 조합할 수도 있습니다.

#### 옵션 A: 미묘한 그라데이션 (가장 추천)
- 오프화이트 (#F7F8F7)에서 약간 더 밝은 회색 (#F9FAF9)으로의 그라데이션
- 초록색 틴트 (#1E7F4F)를 2-5% 투명도로 블렌딩
- 부드럽고 자연스러운 전환, 밴딩 없음
- 패턴이나 텍스처 없이 순수한 그라데이션
- **추천**: 가장 안전하고 깔끔한 옵션

#### 옵션 B: 미니멀 유기적 텍스처
- 매우 연한 유기적 텍스처 (자연스러운 재질 느낌)
- 거의 보이지 않게 처리 (90-95% 투명도 감소)
- 초록색 언더톤 (#1E7F4F)을 3-5% 투명도로 추가
- 기계적이지 않고 자연스러운 느낌

#### 옵션 C: 깔끔한 솔리드 + 미묘한 기하학적 액센트
- 오프화이트 (#F7F8F7) 솔리드 배경
- 초록색 (#1E7F4F) 기하학적 패턴이나 점을 3-8% 투명도로
- 현대적이고 미니멀한 기하학적 형태 (원형, 육각형, 그리드 등)
- 거의 보이지 않을 정도로 연하게, 균등하게 분포

## 사용 방법

### GPT용 접근 방법

GPT는 복잡한 프롬프트를 잘 처리하므로, **"최종 추천 프롬프트"**를 그대로 사용하세요. 이 프롬프트는:
- 요구사항을 최대한 상세하게 반영
- 여러 옵션과 스타일 제시 (GPT가 잘 처리함)
- 기술 사양과 디자인 요구사항 모두 포함
- 브랜드 정체성과 사용 목적 명확히 설명

### 사용 순서

1. **1순위: 최종 추천 프롬프트 사용** (위의 "최종 추천 프롬프트" 섹션)
   - 모든 요구사항을 상세하게 포함
   - GPT가 복잡한 프롬프트를 잘 처리하므로 이 버전 사용 권장
   - 여러 옵션 중 선택하거나 조합 가능

2. **2순위: 대안 1 시도** (핵심만 포함한 버전)
   - 최종 추천 프롬프트가 너무 길다고 느껴질 경우

3. **3순위: 대안 2 시도** (가장 단순한 버전)
   - 최후의 수단

### GPT 프롬프트의 장점

**최종 추천 프롬프트가 GPT에 적합한 이유:**

1. **상세한 설명**: GPT는 긴 프롬프트를 잘 이해함
2. **여러 옵션 제시**: Option A, B, C를 모두 제시해도 GPT가 처리 가능
3. **구조화된 형식**: 리스트와 섹션으로 명확하게 구분
4. **기술 사양 포함**: 해상도, 포맷, 파일 크기 등 상세 기술 요구사항
5. **브랜드 컨텍스트**: 사용 목적과 브랜드 정체성 명확히 설명
6. **시각적 요구사항**: 색상, 밝기, 대비 등 구체적인 시각적 지침

**GPT가 잘 처리하는 것:**
- ✅ 긴 프롬프트와 상세한 설명
- ✅ 여러 옵션과 스타일 제시
- ✅ 구조화된 리스트 형식
- ✅ 기술 사양과 디자인 요구사항
- ✅ 브랜드 컨텍스트와 사용 목적

### 실제 사용 가이드

1. **GPT에 프롬프트 복사**
   - 위의 "최종 추천 프롬프트" 전체를 복사
   - GPT (ChatGPT with DALL-E, Midjourney, Stable Diffusion 등)에 붙여넣기
   - 원하는 옵션을 명시하려면: "Option A를 사용해주세요" 또는 "Option A와 B를 조합해주세요" 추가

2. **생성된 이미지 확인**
   - 생성된 이미지가 요구사항에 맞는지 확인
   - 너무 진하거나 패턴이 강하면: "더 밝게 만들어주세요", "그린 틴트를 더 미묘하게 해주세요" 등으로 재요청
   - 원하는 스타일이 아니면: "Option B로 다시 만들어주세요" 등으로 옵션 변경 가능

3. **파일 저장 및 적용**
   - 생성된 이미지를 다운로드하여 `public/` 폴더에 저장 (예: `products-page-bg.png`)
   - 코드에 적용 (아래 코드 적용 예시 참고)

### 코드 적용 예시

```tsx
// app/products/page.tsx
export default function ProductsPage() {
  return (
    <div 
      className="min-h-screen"
      style={{
        backgroundImage: 'url(/products-page-bg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed' // 선택사항: 스크롤 시 고정
      }}
    >
      <Container>
        {/* 기존 컨텐츠 */}
      </Container>
    </div>
  )
}
```

또는

```tsx
// components/layout/Container.tsx
export function Container({ children }: ContainerProps) {
  return (
    <div 
      className="min-h-screen py-8 px-4"
      style={{
        backgroundImage: 'url(/products-page-bg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="max-w-7xl mx-auto">
        {children}
      </div>
    </div>
  )
}
```

## 예상 결과물

- 거의 보이지 않을 정도로 미묘한 배경
- 초록색 계열의 브랜드 컬러가 은은하게 반영
- 상품 카드가 명확히 보이는 밝은 배경
- 전문적이고 깔끔한 느낌
- 웹 최적화된 파일 크기
- 다양한 화면 크기에서 잘 작동

---

# 3. 상품 카드 배경 이미지

## 사용 위치
- `components/product/ProductImage.tsx` - 상품 이미지가 없을 때 placeholder 배경

## Gemini 이미지 생성 프롬프트 (영문)

> **⚠️ 주의사항:** Gemini의 안전 가이드라인을 통과하기 위해 일반적인 표현만 사용했습니다.

```
Create a subtle, elegant background image for product cards in an e-commerce catalog. This image will be used as a placeholder background when product images are not available, or as a decorative background pattern for product cards.

**Visual Style & Mood:**
- Clean, minimal, and professional aesthetic
- Subtle texture or pattern that doesn't distract from product information
- Fresh, modern feel that complements fresh produce and grocery items
- Light and airy atmosphere suitable for product cards

**Key Design Elements:**

1. **Pattern/Texture Options (Choose one style):**

   **Option A - Fresh Produce Pattern:**
   - Subtle, repeating pattern of fresh produce silhouettes (leaves, fruits, vegetables)
   - Very light opacity (10-20%) so it doesn't overpower content
   - Organic, natural shapes arranged in a grid or flowing pattern
   - Green tones (#1E7F4F, #2E9F6B) with very low saturation

   **Option B - Geometric Fresh Pattern:**
   - Modern geometric shapes inspired by fresh produce (hexagons like honeycomb, circles like fruits)
   - Clean lines and minimal design
   - Fresh green accents (#1E7F4F) on off-white background (#F7F8F7)
   - Subtle gradient or texture overlay

   **Option C - Market Stall Texture:**
   - Subtle texture inspired by market stalls (wood grain, mesh patterns, pallet textures)
   - Very light and washed out
   - Natural, organic feel
   - Warm, neutral tones with green hints

2. **Color Palette:**
   - Primary background: Off-white (#F7F8F7) or very light gray
   - Accent colors: Fresh greens (#1E7F4F, #2E9F6B) at very low opacity (5-15%)
   - Neutral tones: Light grays, beiges
   - Overall lightness: 85-95% brightness to ensure text readability

3. **Composition:**
   - Square format (1:1 aspect ratio) - 800x800px or 1024x1024px
   - Seamless/tileable pattern (can repeat without visible seams)
   - Center-focused or evenly distributed pattern
   - Leave center area relatively clear for potential text overlay

**Technical Specifications:**
- Format: PNG (with transparency) or JPG
- Resolution: 800x800px minimum (1024x1024px recommended for high-DPI displays)
- Color mode: RGB
- File size: Optimized for web (under 200KB if possible)
- Transparency: Optional, but should work on white/light backgrounds

**What to Avoid:**
- No bold or high-contrast patterns (must be subtle)
- No distracting elements that compete with product information
- No dark areas that reduce text readability
- No specific product images (should be generic/abstract)
- No text or branding elements

**Usage Context:**
This background image will be used in:
- Product card image areas when product photos are unavailable
- As a decorative background pattern for product cards
- Must work well with white text overlays (if needed)
- Should complement the brand's fresh produce/grocery theme

**Reference Inspiration:**
- Fresh produce markets with organized displays
- Clean, modern grocery store aesthetics
- Fresh green storefronts (#1E7F4F color family)
- Organized pallets and market stalls
- Natural, organic textures and patterns

**Final Output Goal:**
A beautiful, subtle background image that:
- Immediately conveys "fresh produce" and "quality" when used in product cards
- Doesn't distract from product information (name, price, progress bar)
- Works seamlessly as a placeholder when product images are missing
- Maintains brand identity with fresh green tones
- Feels professional and trustworthy
```

## 한국어 설명

### 사용 목적

상품 카드의 배경 이미지는 다음 용도로 사용됩니다:

1. **상품 이미지가 없을 때 placeholder 배경**
   - 현재 코드에서 이미지가 없으면 "이미지 준비중" 텍스트만 표시됨
   - 배경 이미지를 추가하면 더 세련된 UI 제공

2. **상품 카드의 장식적 배경 패턴**
   - 카드 전체 또는 이미지 영역에 배경 패턴 적용
   - 브랜드 정체성을 시각적으로 강조

3. **일관된 디자인 시스템**
   - 모든 상품 카드에 동일한 배경 스타일 적용
   - 브랜드 통일성 강화

### 디자인 요구사항

1. **브랜드 컬러 반영**
   - 메인 컬러: 초록색 (#1E7F4F ~ #2E9F6B) - 매우 낮은 투명도로 사용
   - 배경: 오프화이트 (#F7F8F7) 또는 밝은 회색
   - 전체적으로 밝은 톤 (85-95% 밝기) 유지

2. **가독성 보장**
   - 상품명, 가격, 진행률 바가 잘 보여야 함
   - 텍스트 오버레이가 가능하도록 밝은 배경
   - 패턴이 너무 강하지 않아야 함

3. **기술적 요구사항**
   - 정사각형 비율 (1:1) - 상품 카드 이미지 영역과 동일
   - 타일링 가능 (반복 패턴)
   - 웹 최적화된 파일 크기
   - 고해상도 디스플레이 대응

### 추천 스타일 옵션

#### 옵션 A: 신선한 농산물 실루엣 패턴
- 과일, 채소, 잎사귀의 실루엣을 반복 패턴으로
- 매우 낮은 투명도 (10-20%)
- 자연스러운 유기적 형태

#### 옵션 B: 기하학적 신선 패턴
- 현대적인 기하학적 도형 (육각형, 원형 등)
- 깔끔한 선과 미니멀 디자인
- 초록색 액센트가 있는 오프화이트 배경

#### 옵션 C: 시장 스톨 텍스처
- 시장 스톨에서 영감을 받은 텍스처 (나무결, 망 패턴, 팔레트 텍스처)
- 매우 연하게 처리
- 자연스럽고 유기적인 느낌

## 사용 방법

1. 위의 영문 프롬프트를 Gemini 이미지 생성 도구에 복사하여 사용
2. 원하는 스타일 옵션 (A, B, C)을 선택하거나 여러 버전 생성
3. 생성된 이미지를 `public/` 폴더에 저장 (예: `product-card-bg.png`)
4. `components/product/ProductImage.tsx` 또는 `lib/styles.ts`에서 배경 이미지로 적용

### 코드 적용 예시

```tsx
// lib/styles.ts 수정 예시
imageWrapper: 'image-wrapper aspect-square bg-[#F7F8F7] bg-[url("/product-card-bg.png")] bg-cover bg-center rounded overflow-hidden relative',
```

또는

```tsx
// components/product/ProductImage.tsx 수정 예시
{!imageSrc || imageError ? (
  <div 
    className={STYLES.imagePlaceholder}
    style={{
      backgroundImage: 'url(/product-card-bg.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }}
  >
    이미지 준비중
  </div>
) : ...}
```

## 예상 결과물

- 신선한 농산물 느낌의 미묘한 패턴/텍스처
- 초록색 계열의 브랜드 컬러가 자연스럽게 반영
- 상품 정보(텍스트, 가격, 진행률 바)가 잘 보이는 밝은 배경
- 정사각형 비율 (1:1)로 상품 카드에 완벽하게 맞춤
- 웹 최적화된 파일 크기
- 타일링 가능한 반복 패턴 (선택사항)

---

## 전체 적용 가이드

### 파일 저장 위치

모든 배경 이미지는 `public/` 폴더에 저장합니다:

```
public/
├── main-page-bg.gif          # 메인 페이지 배경 GIF
├── products-page-bg.png      # Product 페이지 배경 이미지
└── product-card-bg.png       # 상품 카드 배경 이미지
```

### 적용 순서

1. **메인 페이지 배경** (`app/page.tsx`)
   - 사용자가 처음 방문하는 페이지
   - 가장 눈에 띄는 배경

2. **Product 페이지 배경** (`app/products/page.tsx`)
   - 상품 목록이 표시되는 페이지
   - 매우 미묘하게 적용

3. **상품 카드 배경** (`components/product/ProductImage.tsx`)
   - 개별 상품 카드의 placeholder
   - 이미지가 없을 때 사용

### 주의사항

- 모든 배경 이미지는 브랜드 컬러 (#1E7F4F, #F7F8F7)를 반영해야 합니다
- 가독성을 해치지 않도록 밝고 미묘한 톤을 유지해야 합니다
- 파일 크기를 최적화하여 로딩 성능에 영향을 주지 않아야 합니다
- 반응형 디자인을 고려하여 다양한 화면 크기에서 잘 작동해야 합니다

### Gemini 안전 가이드라인 통과 팁

만약 Gemini에서 "go against my guidelines" 오류가 발생한다면:

1. **실제 매장명/브랜드명 제거**: 프롬프트에서 실제 존재하는 매장 이름을 언급하지 마세요
2. **특정 국가/문화 언급 제거**: "Korean", "Japanese" 등 특정 국가명을 제거하고 일반적인 표현 사용
3. **특정 언어 언급 제거**: "Korean signage" 대신 "modern signage" 또는 "signage without text" 사용
4. **일반적인 표현 사용**: 구체적인 지역명이나 실제 장소 대신 일반적인 설명 사용
5. **프롬프트 단순화**: 너무 구체적인 참고 이미지 설명을 제거하고 핵심 요소만 남기기

현재 문서의 프롬프트는 이미 이러한 수정이 반영되어 있습니다.

---

# 4. 파비콘 (Favicon)

## 사용 위치
- `app/layout.tsx` - 브라우저 탭 아이콘
- `public/favicon.ico` 또는 `public/favicon.png`

## 이미지 수정 프롬프트 (GPT/DALL-E용)

> **📌 사용 목적:** 기존 로고 아이콘에서 상표명 텍스트를 제거하고, 나머지 디자인 요소를 최대한 유지한 채 파비콘으로 최적화합니다.

### 최종 추천 프롬프트 (이것을 사용하세요)

```
Create a favicon icon based on the provided reference image, but remove all text elements while keeping all graphic elements exactly the same. The result should be a clean, simplified version suitable for use as a website favicon.

**Reference Image Description:**
The original icon features a dark forest green background (#1E7F4F, RGB: 30, 127, 79) with white line art illustrations. The graphic elements include:
- A stylized oval dining table with four legs (white outline)
- A bowl of food placed on the right side of the table (white outline)
- Rice inside the bowl represented by curved white lines
- A fried egg on top of the rice: white outline for egg white, solid yellow/orange shape for egg yolk
- Two chopsticks angled downward from the top-center, positioned above and slightly to the left of the bowl (thin white lines)
- Korean text "척척밥상" displayed above the table and bowl (THIS MUST BE REMOVED)

**What to Keep (MUST RETAIN):**
- Dark forest green background color (#1E7F4F, RGB: 30, 127, 79) - solid, uniform, no gradients or textures
- White line art style for all graphic elements (table, bowl, rice, egg white, chopsticks)
- Yellow/orange solid color for the egg yolk (this is the ONLY colored element besides white and green)
- The exact same line thickness and style (thick, clean white strokes with rounded ends)
- The same composition and positioning of all elements
- The playful, hand-drawn aesthetic with smooth curves
- The same proportions and spacing between elements

**What to Remove (MUST REMOVE):**
- ALL text elements, especially the Korean characters "척척밥상"
- Any decorative accent marks or dots that were part of the text
- Any text-related elements

**Design Requirements:**
- Maintain the exact same visual style: clean, modern, friendly, minimal line art
- Keep the same line thickness and rounded ends for all white strokes
- Preserve the same composition: table centered, bowl on right side, chopsticks from top-center
- The egg yolk should remain the same yellow/orange color (solid, not outlined)
- All white elements should remain white line art (not filled shapes)
- The background should remain solid dark forest green (#1E7F4F) with no gradients, textures, or patterns

**Favicon Optimization:**
- Square aspect ratio (1:1)
- Resolution: 512x512 pixels minimum (for high-DPI displays)
- The design should be clearly recognizable at small sizes (16x16, 32x32 pixels)
- All graphic elements should be simplified enough to be visible at tiny sizes
- Consider slightly increasing line thickness if needed for small-size visibility
- Ensure good contrast between white lines and green background
- The yellow/orange egg yolk should remain visible even at small sizes

**Technical Specifications:**
- Format: PNG with transparency support (preferred) or ICO
- Color mode: RGB
- Background: Solid dark forest green (#1E7F4F) - no transparency needed for background
- File size: Optimized for web (under 50KB if possible)
- Color depth: 24-bit (8-bit per channel)

**Visual Style:**
- Clean, modern, minimal line art aesthetic
- Friendly and playful feel (hand-drawn style preserved)
- Professional yet approachable
- Food-related iconography (dining table, bowl, rice, egg, chopsticks)
- Consistent with brand identity (fresh produce, food, dining)

**Final Output Goal:**
Create a favicon that:
- Removes all text while keeping all graphic elements
- Maintains the exact same visual style and composition as the original
- Is clearly recognizable at small sizes (16x16px)
- Preserves the brand's dark green color (#1E7F4F)
- Keeps the white line art style with yellow/orange egg yolk accent
- Works perfectly as a website favicon
- Feels clean, modern, and professional
- Maintains the playful, friendly aesthetic of the original

**CRITICAL REQUIREMENTS:**
- NO text elements whatsoever - completely remove all Korean characters
- Keep ALL graphic elements (table, bowl, rice, egg, chopsticks) exactly as they are
- Maintain the exact same dark green background color (#1E7F4F)
- Preserve the white line art style with rounded ends
- Keep the yellow/orange egg yolk as the only colored accent
- Ensure the design is recognizable at 16x16 pixels
- Square aspect ratio (1:1)
- No gradients, textures, or patterns in the background
```

### 대안 프롬프트 (간단한 버전)

```
Create a favicon icon: Remove all text from the reference image, keep only the graphic elements. The icon should have a solid dark forest green background (#1E7F4F), white line art of a dining table with a bowl of rice and fried egg, and two chopsticks. The egg yolk should be yellow/orange. Square format, 512x512 pixels, optimized for small sizes (16x16px). Clean, minimal, modern line art style. No text, no gradients, no textures.
```

## 한국어 설명

### 사용 목적

파비콘은 브라우저 탭에 표시되는 작은 아이콘으로, 사용자가 여러 탭을 열었을 때 웹사이트를 빠르게 식별할 수 있도록 도와줍니다.

### 디자인 요구사항

1. **텍스트 제거**: 상표명 "척척밥상"을 완전히 제거
2. **그래픽 요소 유지**: 테이블, 그릇, 밥, 계란, 젓가락 등 모든 그래픽 요소는 그대로 유지
3. **스타일 유지**: 흰색 라인 아트 스타일과 브랜드 컬러 (#1E7F4F) 유지
4. **작은 크기 최적화**: 16x16px에서도 명확히 보이도록 최적화

### 적용 방법

생성된 이미지를 `public/` 폴더에 저장하고 `app/layout.tsx`에서 참조합니다:

```tsx
// app/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
      </head>
      <body>{children}</body>
    </html>
  )
}
```

### 파일 저장 위치

```
public/
└── favicon.png       # 파비콘 이미지 (512x512px 권장)
```

### 주의사항

- 파비콘은 매우 작은 크기(16x16px)에서도 명확히 보여야 합니다
- 복잡한 디테일은 작은 크기에서 사라질 수 있으므로 단순화가 중요합니다
- 브랜드 컬러 (#1E7F4F)를 정확히 유지해야 합니다
- 텍스트는 완전히 제거되어야 합니다 (작은 크기에서 읽을 수 없음)

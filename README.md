# RODEO 전자담배 판매관리 시스템 - 백엔드

전자담배 가게에서 편하게 재고관리 하기위해 만들어본 판매관리 시스템입니다
실제 사용중인 웹이라 따로 링크는 걸지 않았습니다.

## 목차
- [기술 스택](#기술-스택)
- [데이터베이스 스키마](#데이터베이스-스키마)
- [API 문서](#api-문서)
- [주요 기능](#주요-기능)

## 기술 스택

- **런타임**: Node.js
- **프레임워크**: Express.js
- **데이터베이스**: MySQL
- **인증**: JWT (JSON Web Token)
- **기타 라이브러리**:
  - bcrypt: 비밀번호 암호화
  - dotenv: 환경변수 관리
  - cors: CORS 정책 처리
  - mysql2: MySQL 연결 및 쿼리

## 데이터베이스 스키마

### 테이블 구조

#### 1. users 테이블
| 필드     | 타입         | 설명                 | 제약조건       |
|---------|-------------|---------------------|--------------|
| id      | INT         | 사용자 ID            | PK, AUTO_INC |
| username| VARCHAR(50) | 사용자명             | UNIQUE, NOT NULL |
| password| VARCHAR(255)| 암호화된 비밀번호     | NOT NULL     |
| created_at | TIMESTAMP | 계정 생성 일시       | DEFAULT CURRENT_TIMESTAMP |

#### 2. inventory 테이블
| 필드     | 타입         | 설명                 | 제약조건       |
|---------|-------------|---------------------|--------------|
| id      | INT         | 상품 ID              | PK, AUTO_INC |
| name    | VARCHAR(100)| 상품명               | NOT NULL     |
| category| VARCHAR(50) | 카테고리             | NOT NULL     |
| price   | INT         | 판매 가격             | NOT NULL     |
| quantity| INT         | 재고 수량             | NOT NULL, DEFAULT 0 |
| created_at | TIMESTAMP | 등록 일시            | DEFAULT CURRENT_TIMESTAMP |

#### 3. sales 테이블
| 필드     | 타입         | 설명                 | 제약조건       |
|---------|-------------|---------------------|--------------|
| id      | INT         | 판매 ID              | PK, AUTO_INC |
| sale_date | DATE      | 판매 날짜             | NOT NULL     |
| sale_time | TIME      | 판매 시간             | NOT NULL     |
| total_amount | INT    | 총 판매액            | NOT NULL     |
| payment_method | VARCHAR(20) | 결제 방식    | NOT NULL     |
| note    | TEXT        | 메모                 |              |

#### 4. sale_items 테이블
| 필드     | 타입         | 설명                 | 제약조건       |
|---------|-------------|---------------------|--------------|
| id      | INT         | 항목 ID              | PK, AUTO_INC |
| sale_id | INT         | 판매 ID              | FK(sales.id), NOT NULL |
| inventory_id | INT    | 상품 ID              | FK(inventory.id), NOT NULL |
| quantity| INT         | 판매 수량             | NOT NULL     |
| price   | INT         | 판매 당시 가격         | NOT NULL     |

#### 5. memos 테이블
| 필드     | 타입         | 설명                 | 제약조건       |
|---------|-------------|---------------------|--------------|
| id      | INT         | 메모 ID              | PK, AUTO_INC |
| content | TEXT        | 메모 내용             | NOT NULL     |
| created_at | TIMESTAMP | 작성 일시            | DEFAULT CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | 수정 일시            | DEFAULT CURRENT_TIMESTAMP ON UPDATE |

### ER 다이어그램

```mermaid
erDiagram
    USERS ||--o{ MEMOS : creates
    USERS ||--o{ SALES : manages
    INVENTORY ||--o{ SALE_ITEMS : "sold as"
    SALES ||--|{ SALE_ITEMS : contains
    
    USERS {
        int id PK
        string username
        string password
        timestamp created_at
    }
    
    INVENTORY {
        int id PK
        string name
        string category
        int price
        int quantity
        timestamp created_at
    }
    
    SALES {
        int id PK
        date sale_date
        time sale_time
        int total_amount
        string payment_method
        string note
    }
    
    SALE_ITEMS {
        int id PK
        int sale_id FK
        int inventory_id FK
        int quantity
        int price
    }
    
    MEMOS {
        int id PK
        string content
        timestamp created_at
        timestamp updated_at
    }
```

## API 문서

### 인증 관련
- `POST /api/auth/login` - 로그인
- `POST /api/auth/logout` - 로그아웃

### 재고 관리
- `GET /api/inventory` - 전체 재고 목록 조회
- `GET /api/inventory/low-stock` - 재고 부족 항목 조회
- `GET /api/inventory/category/:category` - 카테고리별 재고 조회
- `GET /api/inventory/search?term=검색어` - 상품 검색

### 재고 항목 관리 (관리자용)
- `POST /api/inventory-manage/item` - 신규 상품 등록
- `PUT /api/inventory-manage/item/:id` - 상품 정보 수정
- `DELETE /api/inventory-manage/item/:id` - 상품 삭제

### 판매 관리
- `GET /api/sales?date=YYYY-MM-DD` - 특정 날짜 판매 기록 조회
- `POST /api/sales` - 새로운 판매 기록 추가
- `PUT /api/sales/:id` - 판매 정보 수정
- `DELETE /api/sales/:id` - 판매 기록 삭제

### 월별 매출
- `GET /api/monthly` - 월별 매출 데이터 조회

### 메모 관리
- `GET /api/memos` - 모든 메모 조회
- `POST /api/memos` - 새 메모 추가
- `PUT /api/memos/:id` - 메모 수정
- `DELETE /api/memos/:id` - 메모 삭제

## 주요 기능

### 1. 인증 시스템
- JWT 기반 사용자 인증
- 로그인/로그아웃 관리
- 보호된 라우트에 미들웨어 적용
- 비밀번호 암호화 저장 (bcrypt 사용)

### 2. 재고 관리
- 카테고리별 재고 조회 및 필터링
- 재고 부족 알림 시스템
- 재고 검색 및 필터링
- 재고 등록/수정/삭제 기능

### 3. 판매 관리
- 일별 판매 기록 관리
- 판매 시 자동 재고 차감
- 결제 방법별 판매 내역 관리 (카드/현금/이체)
- 판매 기록 수정 및 삭제

### 4. 통계 및 보고서
- 월별 매출 집계 및 데이터 제공
- 최고 매출 월 정보 제공
- 연간 총매출 및 당월 매출 정보

### 5. 메모 시스템
- 중요 정보 기록을 위한 메모 기능
- 메모 작성, 수정, 삭제 기능
- 작성일 기준 정렬


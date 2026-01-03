# GlobeTrotter Database Schema Diagram

## Entity Relationship Diagram

```mermaid
erDiagram
    %% ==========================================
    %% USERS & AUTHENTICATION
    %% ==========================================

    users {
        BIGINT user_id PK
        VARCHAR email UK
        VARCHAR password_hash
        VARCHAR first_name
        VARCHAR last_name
        VARCHAR username UK
        VARCHAR profile_picture_url
        TEXT bio
        VARCHAR phone_number
        DATE date_of_birth
        VARCHAR nationality
        VARCHAR preferred_currency
        VARCHAR preferred_language
        BOOLEAN email_verified
        BOOLEAN is_active
        BOOLEAN is_premium
        INT total_trips_created
        INT total_countries_visited
        TIMESTAMP created_at
        TIMESTAMP updated_at
        TIMESTAMP last_login_at
    }

    user_follows {
        BIGINT follow_id PK
        BIGINT follower_id FK
        BIGINT following_id FK
        TIMESTAMP created_at
    }

    %% ==========================================
    %% LOCATION DATA
    %% ==========================================

    countries {
        INT country_id PK
        VARCHAR country_name UK
        VARCHAR country_code UK
        VARCHAR continent
        VARCHAR currency
        VARCHAR currency_symbol
        VARCHAR timezone
        VARCHAR popular_season
        TEXT visa_info
        TIMESTAMP created_at
    }

    cities {
        BIGINT city_id PK
        VARCHAR city_name
        INT country_id FK
        VARCHAR state_province
        DECIMAL latitude
        DECIMAL longitude
        TEXT description
        INT population
        DECIMAL cost_index
        DECIMAL safety_rating
        INT popularity_score
        VARCHAR best_time_to_visit
        VARCHAR average_temperature
        VARCHAR image_url
        VARCHAR timezone
        BOOLEAN is_featured
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }

    %% ==========================================
    %% ACTIVITIES
    %% ==========================================

    activity_categories {
        INT category_id PK
        VARCHAR category_name UK
        VARCHAR category_icon
        TEXT description
        INT display_order
        TIMESTAMP created_at
    }

    activities {
        BIGINT activity_id PK
        BIGINT city_id FK
        INT category_id FK
        VARCHAR activity_name
        TEXT description
        INT estimated_duration_minutes
        DECIMAL estimated_cost
        VARCHAR currency
        ENUM difficulty_level
        VARCHAR age_restriction
        TEXT address
        DECIMAL latitude
        DECIMAL longitude
        VARCHAR contact_info
        VARCHAR website_url
        BOOLEAN booking_required
        VARCHAR booking_url
        TEXT operating_hours
        VARCHAR best_season
        VARCHAR image_url
        DECIMAL average_rating
        INT total_reviews
        INT popularity_count
        BOOLEAN is_featured
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }

    activity_reviews {
        BIGINT review_id PK
        BIGINT activity_id FK
        BIGINT user_id FK
        DECIMAL rating
        VARCHAR review_title
        TEXT review_text
        JSON photos
        INT helpful_count
        DATE visit_date
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }

    %% ==========================================
    %% TRIPS
    %% ==========================================

    trips {
        BIGINT trip_id PK
        BIGINT user_id FK
        VARCHAR trip_name
        TEXT description
        DATE start_date
        DATE end_date
        ENUM status
        DECIMAL total_budget
        DECIMAL actual_spent
        VARCHAR currency
        VARCHAR cover_image_url
        BOOLEAN is_public
        VARCHAR share_token UK
        INT total_days GENERATED
        INT total_cities
        INT total_activities
        INT view_count
        INT like_count
        INT copy_count
        BOOLEAN is_template
        JSON tags
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }

    trip_collaborators {
        BIGINT collaborator_id PK
        BIGINT trip_id FK
        BIGINT user_id FK
        BIGINT invited_by FK
        ENUM role
        ENUM invitation_status
        BOOLEAN can_edit
        BOOLEAN can_delete
        TIMESTAMP joined_at
    }

    trip_likes {
        BIGINT like_id PK
        BIGINT trip_id FK
        BIGINT user_id FK
        TIMESTAMP created_at
    }

    %% ==========================================
    %% ITINERARY
    %% ==========================================

    trip_stops {
        BIGINT stop_id PK
        BIGINT trip_id FK
        BIGINT city_id FK
        INT stop_order
        DATE arrival_date
        DATE departure_date
        VARCHAR accommodation_name
        TEXT accommodation_address
        DECIMAL accommodation_cost
        VARCHAR accommodation_booking_ref
        ENUM transportation_mode
        DECIMAL transportation_cost
        TEXT transportation_details
        TEXT notes
        INT total_days GENERATED
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }

    itinerary_items {
        BIGINT item_id PK
        BIGINT stop_id FK
        BIGINT activity_id FK
        INT day_number
        DATE item_date
        TIME start_time
        TIME end_time
        ENUM item_type
        VARCHAR title
        TEXT description
        DECIMAL estimated_cost
        DECIMAL actual_cost
        TEXT location
        ENUM booking_status
        VARCHAR booking_reference
        ENUM priority
        TEXT notes
        BOOLEAN is_completed
        INT display_order
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }

    %% ==========================================
    %% EXPENSES
    %% ==========================================

    expense_categories {
        INT expense_category_id PK
        VARCHAR category_name UK
        VARCHAR category_icon
        TEXT description
        INT display_order
    }

    trip_expenses {
        BIGINT expense_id PK
        BIGINT trip_id FK
        BIGINT stop_id FK
        BIGINT itinerary_item_id FK
        INT expense_category_id FK
        VARCHAR expense_name
        TEXT description
        DECIMAL amount
        VARCHAR currency
        DECIMAL amount_in_base_currency
        DATE expense_date
        ENUM payment_method
        BOOLEAN is_shared_expense
        INT split_between_count
        VARCHAR receipt_url
        TEXT notes
        BIGINT created_by FK
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }

    budget_alerts {
        BIGINT alert_id PK
        BIGINT trip_id FK
        ENUM alert_type
        INT threshold_percentage
        BOOLEAN is_triggered
        TEXT message
        TIMESTAMP created_at
        TIMESTAMP triggered_at
    }

    %% ==========================================
    %% WISHLISTS
    %% ==========================================

    user_wishlists {
        BIGINT wishlist_id PK
        BIGINT user_id FK
        VARCHAR wishlist_name
        TEXT description
        BOOLEAN is_default
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }

    wishlist_cities {
        BIGINT wishlist_city_id PK
        BIGINT wishlist_id FK
        BIGINT city_id FK
        TEXT notes
        ENUM priority
        TIMESTAMP added_at
    }

    wishlist_activities {
        BIGINT wishlist_activity_id PK
        BIGINT wishlist_id FK
        BIGINT activity_id FK
        TEXT notes
        ENUM priority
        TIMESTAMP added_at
    }

    %% ==========================================
    %% USER CONTENT
    %% ==========================================

    travel_tips {
        BIGINT tip_id PK
        BIGINT city_id FK
        BIGINT user_id FK
        VARCHAR tip_title
        TEXT tip_content
        ENUM tip_category
        INT helpful_count
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }

    notifications {
        BIGINT notification_id PK
        BIGINT user_id FK
        ENUM notification_type
        VARCHAR title
        TEXT message
        BIGINT related_trip_id FK
        BIGINT related_user_id FK
        VARCHAR action_url
        BOOLEAN is_read
        TIMESTAMP created_at
        TIMESTAMP read_at
    }

    %% ==========================================
    %% ANALYTICS
    %% ==========================================

    platform_analytics {
        BIGINT analytics_id PK
        DATE metric_date UK
        INT total_users
        INT new_users_today
        INT active_users
        INT total_trips
        INT new_trips_today
        INT completed_trips
        INT total_activities
        INT total_reviews
        DECIMAL avg_trip_duration_days
        DECIMAL avg_trip_budget
        BIGINT most_popular_city_id FK
        TIMESTAMP created_at
    }

    %% ==========================================
    %% RELATIONSHIPS
    %% ==========================================

    %% User Relationships
    users ||--o{ user_follows : "follower"
    users ||--o{ user_follows : "following"
    users ||--o{ trips : "creates"
    users ||--o{ activity_reviews : "writes"
    users ||--o{ user_wishlists : "owns"
    users ||--o{ travel_tips : "shares"
    users ||--o{ notifications : "receives"
    users ||--o{ trip_collaborators : "collaborates"
    users ||--o{ trip_likes : "likes"
    users ||--o{ trip_expenses : "creates"

    %% Location Relationships
    countries ||--o{ cities : "contains"
    cities ||--o{ activities : "has"
    cities ||--o{ trip_stops : "visited_in"
    cities ||--o{ wishlist_cities : "saved_in"
    cities ||--o{ travel_tips : "has_tips"
    cities ||--o{ platform_analytics : "most_popular"

    %% Activity Relationships
    activity_categories ||--o{ activities : "categorizes"
    activities ||--o{ activity_reviews : "reviewed_in"
    activities ||--o{ itinerary_items : "included_in"
    activities ||--o{ wishlist_activities : "saved_in"

    %% Trip Relationships
    trips ||--o{ trip_stops : "includes"
    trips ||--o{ trip_collaborators : "shared_with"
    trips ||--o{ trip_likes : "liked_by"
    trips ||--o{ trip_expenses : "tracks"
    trips ||--o{ budget_alerts : "monitors"
    trips ||--o{ notifications : "triggers"

    %% Itinerary Relationships
    trip_stops ||--o{ itinerary_items : "contains"
    trip_stops ||--o{ trip_expenses : "incurs"

    %% Expense Relationships
    expense_categories ||--o{ trip_expenses : "categorizes"
    itinerary_items ||--o{ trip_expenses : "costs"

    %% Wishlist Relationships
    user_wishlists ||--o{ wishlist_cities : "contains"
    user_wishlists ||--o{ wishlist_activities : "contains"
```

## Database Statistics

- **Total Tables**: 25+
- **Total Views**: 3 (vw_trip_summary, vw_popular_destinations, vw_user_stats)
- **Total Triggers**: 8 (Auto-update counts, ratings, budgets)
- **Total Stored Procedures**: 3 (Clone trip, Budget breakdown, Recommended activities)

## Key Features

### 🔐 Security Features

- Password hashing (bcrypt)
- Email verification system
- User roles and permissions
- Privacy controls (public/private trips)

### 📊 Analytics & Tracking

- Platform-wide analytics
- User statistics
- Popular destination tracking
- Trip engagement metrics (views, likes, copies)

### 💰 Budget Management

- Multi-currency support
- Expense tracking by category
- Automatic budget alerts (90% threshold)
- Shared expense support

### 🌟 Social Features

- User follow/unfollow
- Trip collaboration (multiple editors)
- Public trip sharing with unique tokens
- Like and copy trips
- Activity reviews and ratings

### 🎯 Smart Features

- Auto-generated trip statistics
- Default wishlist creation for new users
- Automatic rating calculations
- City popularity scoring
- Trip templates

## Core Entities Overview

### **Users & Authentication**

- `users` - Core user accounts
- `user_follows` - Social following system

### **Location Data**

- `countries` - Country master data
- `cities` - City information with ratings

### **Activities**

- `activity_categories` - Activity types
- `activities` - Things to do in cities
- `activity_reviews` - User reviews and ratings

### **Trip Planning**

- `trips` - User travel plans
- `trip_stops` - Cities in itinerary
- `itinerary_items` - Daily activities
- `trip_collaborators` - Shared trip access
- `trip_likes` - Social engagement

### **Budget & Expenses**

- `expense_categories` - Expense types
- `trip_expenses` - Spending tracker
- `budget_alerts` - Overspending alerts

### **Wishlist System**

- `user_wishlists` - Saved destination lists
- `wishlist_cities` - Saved cities
- `wishlist_activities` - Saved activities

### **User Content**

- `travel_tips` - Community tips
- `notifications` - User alerts

### **Analytics**

- `platform_analytics` - Usage metrics

## Cardinality Notation

- `||--o{` : One to Many (one-to-zero-or-more)
- `||--||` : One to One (one-to-exactly-one)
- `}o--o{` : Many to Many

## Notes

1. **Generated Columns**: `total_days` in trips and trip_stops are auto-calculated
2. **JSON Fields**: Used for flexible data (photos, tags)
3. **Triggers**: Automatically maintain counts and ratings
4. **Indexes**: Optimized for common queries (user lookups, trip searches, date ranges)
5. **Constraints**: CHECK constraints ensure data integrity (dates, ratings)

## How to View This Diagram

### Option 1: VS Code

1. Install "Markdown Preview Mermaid Support" extension
2. Open this file and use `Ctrl+Shift+V` to preview

### Option 2: Online

1. Copy the Mermaid code
2. Visit https://mermaid.live/
3. Paste and view

### Option 3: GitHub

- GitHub automatically renders Mermaid diagrams in markdown files

---

**Generated for**: GlobeTrotter Travel Planning Platform  
**Database**: MySQL 8.0+  
**Character Set**: utf8mb4  
**Engine**: InnoDB

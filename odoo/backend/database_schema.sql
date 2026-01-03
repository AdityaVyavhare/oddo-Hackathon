-- ============================================
-- GLOBETROTTER DATABASE SCHEMA
-- Advanced Travel Planning Platform
-- ============================================

DROP DATABASE IF EXISTS globetrotter;
CREATE DATABASE globetrotter CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE globetrotter;

-- ============================================
-- CORE USER MANAGEMENT
-- ============================================

CREATE TABLE users (
    user_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    profile_picture_url VARCHAR(500),
    bio TEXT,
    phone_number VARCHAR(20),
    date_of_birth DATE,
    nationality VARCHAR(100),
    preferred_currency VARCHAR(3) DEFAULT 'USD',
    preferred_language VARCHAR(10) DEFAULT 'en',
    email_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    is_premium BOOLEAN DEFAULT FALSE,
    total_trips_created INT DEFAULT 0,
    total_countries_visited INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP NULL,
    INDEX idx_email (email),
    INDEX idx_username (username),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB;

-- User followers/following for social features
CREATE TABLE user_follows (
    follow_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    follower_id BIGINT NOT NULL,
    following_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (follower_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (following_id) REFERENCES users(user_id) ON DELETE CASCADE,
    UNIQUE KEY unique_follow (follower_id, following_id),
    CHECK (follower_id != following_id)
) ENGINE=InnoDB;

-- ============================================
-- DESTINATION & LOCATION DATA
-- ============================================

CREATE TABLE countries (
    country_id INT PRIMARY KEY AUTO_INCREMENT,
    country_name VARCHAR(100) UNIQUE NOT NULL,
    country_code VARCHAR(3) UNIQUE NOT NULL,
    continent VARCHAR(50) NOT NULL,
    currency VARCHAR(3),
    currency_symbol VARCHAR(10),
    timezone VARCHAR(100),
    popular_season VARCHAR(50),
    visa_info TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_continent (continent)
) ENGINE=InnoDB;

CREATE TABLE cities (
    city_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    city_name VARCHAR(150) NOT NULL,
    country_id INT NOT NULL,
    state_province VARCHAR(100),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    description TEXT,
    population INT,
    cost_index DECIMAL(5, 2) DEFAULT 100.00 COMMENT 'Base 100 index for cost comparison',
    safety_rating DECIMAL(3, 2) DEFAULT 0 COMMENT 'Out of 5',
    popularity_score INT DEFAULT 0,
    best_time_to_visit VARCHAR(100),
    average_temperature VARCHAR(50),
    image_url VARCHAR(500),
    timezone VARCHAR(100),
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (country_id) REFERENCES countries(country_id) ON DELETE CASCADE,
    INDEX idx_city_country (city_name, country_id),
    INDEX idx_featured (is_featured),
    INDEX idx_popularity (popularity_score DESC),
    FULLTEXT idx_city_search (city_name, description)
) ENGINE=InnoDB;

-- ============================================
-- ACTIVITY CATEGORIES & ACTIVITIES
-- ============================================

CREATE TABLE activity_categories (
    category_id INT PRIMARY KEY AUTO_INCREMENT,
    category_name VARCHAR(100) UNIQUE NOT NULL,
    category_icon VARCHAR(50),
    description TEXT,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_display_order (display_order)
) ENGINE=InnoDB;

CREATE TABLE activities (
    activity_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    city_id BIGINT NOT NULL,
    category_id INT NOT NULL,
    activity_name VARCHAR(255) NOT NULL,
    description TEXT,
    estimated_duration_minutes INT,
    estimated_cost DECIMAL(10, 2),
    currency VARCHAR(3) DEFAULT 'USD',
    difficulty_level ENUM('Easy', 'Moderate', 'Hard', 'Extreme') DEFAULT 'Easy',
    age_restriction VARCHAR(50),
    address TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    contact_info VARCHAR(255),
    website_url VARCHAR(500),
    booking_required BOOLEAN DEFAULT FALSE,
    booking_url VARCHAR(500),
    operating_hours TEXT,
    best_season VARCHAR(100),
    image_url VARCHAR(500),
    average_rating DECIMAL(3, 2) DEFAULT 0,
    total_reviews INT DEFAULT 0,
    popularity_count INT DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (city_id) REFERENCES cities(city_id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES activity_categories(category_id) ON DELETE RESTRICT,
    INDEX idx_city_category (city_id, category_id),
    INDEX idx_cost (estimated_cost),
    INDEX idx_rating (average_rating DESC),
    FULLTEXT idx_activity_search (activity_name, description)
) ENGINE=InnoDB;

-- Activity reviews and ratings (STANDOUT FEATURE)
CREATE TABLE activity_reviews (
    review_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    activity_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    rating DECIMAL(2, 1) NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_title VARCHAR(255),
    review_text TEXT,
    photos JSON COMMENT 'Array of photo URLs',
    helpful_count INT DEFAULT 0,
    visit_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (activity_id) REFERENCES activities(activity_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_activity_review (user_id, activity_id),
    INDEX idx_rating (rating DESC),
    INDEX idx_created (created_at DESC)
) ENGINE=InnoDB;

-- ============================================
-- TRIP MANAGEMENT
-- ============================================

CREATE TABLE trips (
    trip_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    trip_name VARCHAR(255) NOT NULL,
    description TEXT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status ENUM('planning', 'confirmed', 'ongoing', 'completed', 'cancelled') DEFAULT 'planning',
    total_budget DECIMAL(12, 2),
    actual_spent DECIMAL(12, 2) DEFAULT 0,
    currency VARCHAR(3) DEFAULT 'USD',
    cover_image_url VARCHAR(500),
    is_public BOOLEAN DEFAULT FALSE,
    share_token VARCHAR(100) UNIQUE COMMENT 'Unique token for public sharing',
    total_days INT GENERATED ALWAYS AS (DATEDIFF(end_date, start_date) + 1) STORED,
    total_cities INT DEFAULT 0,
    total_activities INT DEFAULT 0,
    view_count INT DEFAULT 0,
    like_count INT DEFAULT 0,
    copy_count INT DEFAULT 0 COMMENT 'How many times this trip was cloned',
    is_template BOOLEAN DEFAULT FALSE COMMENT 'Can be used as a template by others',
    tags JSON COMMENT 'Array of trip tags like adventure, family, budget, luxury',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_user_trips (user_id, created_at DESC),
    INDEX idx_public_trips (is_public, created_at DESC),
    INDEX idx_status (status),
    INDEX idx_dates (start_date, end_date),
    INDEX idx_share_token (share_token),
    FULLTEXT idx_trip_search (trip_name, description),
    CHECK (end_date >= start_date)
) ENGINE=InnoDB;

-- Trip collaborators (STANDOUT FEATURE - Multiple users can edit same trip)
CREATE TABLE trip_collaborators (
    collaborator_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    trip_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    role ENUM('owner', 'editor', 'viewer') DEFAULT 'viewer',
    invited_by BIGINT NOT NULL,
    invitation_status ENUM('pending', 'accepted', 'declined') DEFAULT 'pending',
    can_edit BOOLEAN DEFAULT FALSE,
    can_delete BOOLEAN DEFAULT FALSE,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (trip_id) REFERENCES trips(trip_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (invited_by) REFERENCES users(user_id) ON DELETE CASCADE,
    UNIQUE KEY unique_trip_user (trip_id, user_id)
) ENGINE=InnoDB;

-- Trip likes (social engagement)
CREATE TABLE trip_likes (
    like_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    trip_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (trip_id) REFERENCES trips(trip_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    UNIQUE KEY unique_trip_like (trip_id, user_id)
) ENGINE=InnoDB;

-- ============================================
-- ITINERARY MANAGEMENT
-- ============================================

CREATE TABLE trip_stops (
    stop_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    trip_id BIGINT NOT NULL,
    city_id BIGINT NOT NULL,
    stop_order INT NOT NULL,
    arrival_date DATE NOT NULL,
    departure_date DATE NOT NULL,
    accommodation_name VARCHAR(255),
    accommodation_address TEXT,
    accommodation_cost DECIMAL(10, 2),
    accommodation_booking_ref VARCHAR(100),
    transportation_mode ENUM('Flight', 'Train', 'Bus', 'Car', 'Ship', 'Walk', 'Other') DEFAULT 'Flight',
    transportation_cost DECIMAL(10, 2),
    transportation_details TEXT,
    notes TEXT,
    total_days INT GENERATED ALWAYS AS (DATEDIFF(departure_date, arrival_date) + 1) STORED,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (trip_id) REFERENCES trips(trip_id) ON DELETE CASCADE,
    FOREIGN KEY (city_id) REFERENCES cities(city_id) ON DELETE RESTRICT,
    UNIQUE KEY unique_trip_stop_order (trip_id, stop_order),
    INDEX idx_trip_order (trip_id, stop_order),
    INDEX idx_dates (arrival_date, departure_date),
    CHECK (departure_date >= arrival_date)
) ENGINE=InnoDB;

-- Daily itinerary items
CREATE TABLE itinerary_items (
    item_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    stop_id BIGINT NOT NULL,
    activity_id BIGINT,
    day_number INT NOT NULL COMMENT 'Day within this stop',
    item_date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    item_type ENUM('activity', 'meal', 'transport', 'accommodation', 'free_time', 'custom') DEFAULT 'activity',
    title VARCHAR(255) NOT NULL,
    description TEXT,
    estimated_cost DECIMAL(10, 2),
    actual_cost DECIMAL(10, 2),
    location TEXT,
    booking_status ENUM('not_required', 'pending', 'confirmed', 'cancelled') DEFAULT 'not_required',
    booking_reference VARCHAR(100),
    priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
    notes TEXT,
    is_completed BOOLEAN DEFAULT FALSE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (stop_id) REFERENCES trip_stops(stop_id) ON DELETE CASCADE,
    FOREIGN KEY (activity_id) REFERENCES activities(activity_id) ON DELETE SET NULL,
    INDEX idx_stop_day (stop_id, day_number),
    INDEX idx_date_time (item_date, start_time),
    INDEX idx_display_order (display_order)
) ENGINE=InnoDB;

-- ============================================
-- BUDGET TRACKING & EXPENSES
-- ============================================

CREATE TABLE expense_categories (
    expense_category_id INT PRIMARY KEY AUTO_INCREMENT,
    category_name VARCHAR(100) UNIQUE NOT NULL,
    category_icon VARCHAR(50),
    description TEXT,
    display_order INT DEFAULT 0
) ENGINE=InnoDB;

-- Insert default expense categories
INSERT INTO expense_categories (category_name, category_icon, description, display_order) VALUES
('Accommodation', 'hotel', 'Hotels, hostels, vacation rentals', 1),
('Transportation', 'flight', 'Flights, trains, buses, taxis, car rentals', 2),
('Food & Dining', 'restaurant', 'Meals, snacks, drinks', 3),
('Activities & Entertainment', 'ticket', 'Tours, attractions, events', 4),
('Shopping', 'shopping_bag', 'Souvenirs, clothes, gifts', 5),
('Insurance', 'shield', 'Travel insurance, health insurance', 6),
('Visa & Documentation', 'passport', 'Visa fees, passport fees', 7),
('Miscellaneous', 'more', 'Other expenses', 8);

CREATE TABLE trip_expenses (
    expense_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    trip_id BIGINT NOT NULL,
    stop_id BIGINT,
    itinerary_item_id BIGINT,
    expense_category_id INT NOT NULL,
    expense_name VARCHAR(255) NOT NULL,
    description TEXT,
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    amount_in_base_currency DECIMAL(10, 2) COMMENT 'Converted to trip currency',
    expense_date DATE NOT NULL,
    payment_method ENUM('cash', 'credit_card', 'debit_card', 'digital_wallet', 'bank_transfer', 'other') DEFAULT 'cash',
    is_shared_expense BOOLEAN DEFAULT FALSE,
    split_between_count INT DEFAULT 1,
    receipt_url VARCHAR(500),
    notes TEXT,
    created_by BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (trip_id) REFERENCES trips(trip_id) ON DELETE CASCADE,
    FOREIGN KEY (stop_id) REFERENCES trip_stops(stop_id) ON DELETE SET NULL,
    FOREIGN KEY (itinerary_item_id) REFERENCES itinerary_items(item_id) ON DELETE SET NULL,
    FOREIGN KEY (expense_category_id) REFERENCES expense_categories(expense_category_id) ON DELETE RESTRICT,
    FOREIGN KEY (created_by) REFERENCES users(user_id) ON DELETE SET NULL,
    INDEX idx_trip_expenses (trip_id, expense_date),
    INDEX idx_category (expense_category_id)
) ENGINE=InnoDB;

-- Budget alerts (STANDOUT FEATURE)
CREATE TABLE budget_alerts (
    alert_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    trip_id BIGINT NOT NULL,
    alert_type ENUM('budget_exceeded', 'approaching_limit', 'daily_limit', 'category_limit') NOT NULL,
    threshold_percentage INT DEFAULT 90,
    is_triggered BOOLEAN DEFAULT FALSE,
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    triggered_at TIMESTAMP NULL,
    FOREIGN KEY (trip_id) REFERENCES trips(trip_id) ON DELETE CASCADE,
    INDEX idx_trip_alerts (trip_id, is_triggered)
) ENGINE=InnoDB;

-- ============================================
-- WISHLIST & SAVED ITEMS
-- ============================================

CREATE TABLE user_wishlists (
    wishlist_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    wishlist_name VARCHAR(255) NOT NULL DEFAULT 'My Wishlist',
    description TEXT,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_user_wishlist (user_id)
) ENGINE=InnoDB;

CREATE TABLE wishlist_cities (
    wishlist_city_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    wishlist_id BIGINT NOT NULL,
    city_id BIGINT NOT NULL,
    notes TEXT,
    priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (wishlist_id) REFERENCES user_wishlists(wishlist_id) ON DELETE CASCADE,
    FOREIGN KEY (city_id) REFERENCES cities(city_id) ON DELETE CASCADE,
    UNIQUE KEY unique_wishlist_city (wishlist_id, city_id)
) ENGINE=InnoDB;

CREATE TABLE wishlist_activities (
    wishlist_activity_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    wishlist_id BIGINT NOT NULL,
    activity_id BIGINT NOT NULL,
    notes TEXT,
    priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (wishlist_id) REFERENCES user_wishlists(wishlist_id) ON DELETE CASCADE,
    FOREIGN KEY (activity_id) REFERENCES activities(activity_id) ON DELETE CASCADE,
    UNIQUE KEY unique_wishlist_activity (wishlist_id, activity_id)
) ENGINE=InnoDB;

-- ============================================
-- TRAVEL TIPS & USER-GENERATED CONTENT
-- ============================================

CREATE TABLE travel_tips (
    tip_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    city_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    tip_title VARCHAR(255) NOT NULL,
    tip_content TEXT NOT NULL,
    tip_category ENUM('transportation', 'food', 'safety', 'culture', 'budget', 'accommodation', 'general') DEFAULT 'general',
    helpful_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (city_id) REFERENCES cities(city_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_city_tips (city_id, helpful_count DESC),
    INDEX idx_category (tip_category)
) ENGINE=InnoDB;

-- ============================================
-- NOTIFICATIONS & ACTIVITY LOG
-- ============================================

CREATE TABLE notifications (
    notification_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    notification_type ENUM('trip_invite', 'trip_update', 'budget_alert', 'new_follower', 'trip_liked', 'new_review', 'system') NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT,
    related_trip_id BIGINT,
    related_user_id BIGINT,
    action_url VARCHAR(500),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (related_trip_id) REFERENCES trips(trip_id) ON DELETE CASCADE,
    FOREIGN KEY (related_user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_user_notifications (user_id, is_read, created_at DESC)
) ENGINE=InnoDB;

-- ============================================
-- ANALYTICS & METRICS (ADMIN)
-- ============================================

CREATE TABLE platform_analytics (
    analytics_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    metric_date DATE NOT NULL,
    total_users INT DEFAULT 0,
    new_users_today INT DEFAULT 0,
    active_users INT DEFAULT 0,
    total_trips INT DEFAULT 0,
    new_trips_today INT DEFAULT 0,
    completed_trips INT DEFAULT 0,
    total_activities INT DEFAULT 0,
    total_reviews INT DEFAULT 0,
    avg_trip_duration_days DECIMAL(5, 2),
    avg_trip_budget DECIMAL(12, 2),
    most_popular_city_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_metric_date (metric_date),
    FOREIGN KEY (most_popular_city_id) REFERENCES cities(city_id) ON DELETE SET NULL,
    INDEX idx_date (metric_date DESC)
) ENGINE=InnoDB;

-- ============================================
-- VIEWS FOR COMPLEX QUERIES
-- ============================================

-- View: Trip summary with all details
CREATE VIEW vw_trip_summary AS
SELECT 
    t.trip_id,
    t.trip_name,
    t.description,
    t.start_date,
    t.end_date,
    t.total_days,
    t.status,
    t.total_budget,
    t.currency,
    t.is_public,
    t.view_count,
    t.like_count,
    t.copy_count,
    u.user_id,
    u.username,
    u.first_name,
    u.last_name,
    u.profile_picture_url,
    COUNT(DISTINCT ts.stop_id) as total_stops,
    COUNT(DISTINCT ii.item_id) as total_items,
    COALESCE(SUM(te.amount_in_base_currency), 0) as total_spent,
    t.created_at,
    t.updated_at
FROM trips t
JOIN users u ON t.user_id = u.user_id
LEFT JOIN trip_stops ts ON t.trip_id = ts.trip_id
LEFT JOIN itinerary_items ii ON ts.stop_id = ii.stop_id
LEFT JOIN trip_expenses te ON t.trip_id = te.trip_id
GROUP BY t.trip_id;

-- View: Popular destinations
CREATE VIEW vw_popular_destinations AS
SELECT 
    c.city_id,
    c.city_name,
    co.country_name,
    co.continent,
    c.cost_index,
    c.safety_rating,
    c.popularity_score,
    COUNT(DISTINCT ts.trip_id) as trip_count,
    COUNT(DISTINCT a.activity_id) as activity_count,
    AVG(ar.rating) as avg_activity_rating,
    c.image_url,
    c.description
FROM cities c
JOIN countries co ON c.country_id = co.country_id
LEFT JOIN trip_stops ts ON c.city_id = ts.city_id
LEFT JOIN activities a ON c.city_id = a.city_id
LEFT JOIN activity_reviews ar ON a.activity_id = ar.activity_id
GROUP BY c.city_id
ORDER BY popularity_score DESC, trip_count DESC;

-- View: User trip statistics
CREATE VIEW vw_user_stats AS
SELECT 
    u.user_id,
    u.username,
    u.first_name,
    u.last_name,
    COUNT(DISTINCT t.trip_id) as total_trips,
    COUNT(DISTINCT CASE WHEN t.status = 'completed' THEN t.trip_id END) as completed_trips,
    COUNT(DISTINCT ts.city_id) as cities_visited,
    COUNT(DISTINCT c2.country_id) as countries_visited,
    COALESCE(SUM(te.amount_in_base_currency), 0) as total_money_spent,
    COUNT(DISTINCT ar.review_id) as total_reviews_written,
    (SELECT COUNT(*) FROM user_follows WHERE following_id = u.user_id) as follower_count,
    (SELECT COUNT(*) FROM user_follows WHERE follower_id = u.user_id) as following_count
FROM users u
LEFT JOIN trips t ON u.user_id = t.user_id
LEFT JOIN trip_stops ts ON t.trip_id = ts.trip_id
LEFT JOIN cities c2 ON ts.city_id = c2.city_id
LEFT JOIN trip_expenses te ON t.trip_id = te.trip_id
LEFT JOIN activity_reviews ar ON u.user_id = ar.user_id
GROUP BY u.user_id;

-- ============================================
-- TRIGGERS FOR AUTOMATION
-- ============================================

DELIMITER //

-- Trigger: Update trip total_cities and total_activities when stop added
CREATE TRIGGER trg_update_trip_counts_after_stop_insert
AFTER INSERT ON trip_stops
FOR EACH ROW
BEGIN
    UPDATE trips 
    SET total_cities = (SELECT COUNT(DISTINCT city_id) FROM trip_stops WHERE trip_id = NEW.trip_id)
    WHERE trip_id = NEW.trip_id;
END//

-- Trigger: Update trip total_activities when itinerary item added
CREATE TRIGGER trg_update_trip_activities_after_item_insert
AFTER INSERT ON itinerary_items
FOR EACH ROW
BEGIN
    UPDATE trips 
    SET total_activities = (
        SELECT COUNT(*) 
        FROM itinerary_items ii
        JOIN trip_stops ts ON ii.stop_id = ts.stop_id
        WHERE ts.trip_id = (SELECT trip_id FROM trip_stops WHERE stop_id = NEW.stop_id)
    )
    WHERE trip_id = (SELECT trip_id FROM trip_stops WHERE stop_id = NEW.stop_id);
END//

-- Trigger: Update activity average rating when review added
CREATE TRIGGER trg_update_activity_rating_after_review
AFTER INSERT ON activity_reviews
FOR EACH ROW
BEGIN
    UPDATE activities 
    SET average_rating = (SELECT AVG(rating) FROM activity_reviews WHERE activity_id = NEW.activity_id),
        total_reviews = (SELECT COUNT(*) FROM activity_reviews WHERE activity_id = NEW.activity_id)
    WHERE activity_id = NEW.activity_id;
    
    -- Update city popularity
    UPDATE cities 
    SET popularity_score = popularity_score + 1
    WHERE city_id = (SELECT city_id FROM activities WHERE activity_id = NEW.activity_id);
END//

-- Trigger: Update trip actual_spent when expense added
CREATE TRIGGER trg_update_trip_spent_after_expense
AFTER INSERT ON trip_expenses
FOR EACH ROW
BEGIN
    UPDATE trips 
    SET actual_spent = COALESCE((SELECT SUM(amount_in_base_currency) FROM trip_expenses WHERE trip_id = NEW.trip_id), 0)
    WHERE trip_id = NEW.trip_id;
    
    -- Check for budget alerts
    IF (SELECT actual_spent FROM trips WHERE trip_id = NEW.trip_id) > 
       (SELECT total_budget * 0.9 FROM trips WHERE trip_id = NEW.trip_id) THEN
        INSERT INTO budget_alerts (trip_id, alert_type, threshold_percentage, is_triggered, message)
        VALUES (NEW.trip_id, 'approaching_limit', 90, TRUE, 'You have spent 90% of your budget');
    END IF;
END//

-- Trigger: Update user total_trips_created
CREATE TRIGGER trg_update_user_trip_count
AFTER INSERT ON trips
FOR EACH ROW
BEGIN
    UPDATE users 
    SET total_trips_created = total_trips_created + 1
    WHERE user_id = NEW.user_id;
END//

-- Trigger: Update trip like_count
CREATE TRIGGER trg_update_trip_like_count
AFTER INSERT ON trip_likes
FOR EACH ROW
BEGIN
    UPDATE trips 
    SET like_count = (SELECT COUNT(*) FROM trip_likes WHERE trip_id = NEW.trip_id)
    WHERE trip_id = NEW.trip_id;
END//

-- Trigger: Generate share token for public trips
CREATE TRIGGER trg_generate_share_token
BEFORE INSERT ON trips
FOR EACH ROW
BEGIN
    IF NEW.is_public = TRUE AND NEW.share_token IS NULL THEN
        SET NEW.share_token = CONCAT(UUID(), '-', NEW.user_id);
    END IF;
END//

-- Trigger: Create default wishlist for new users
CREATE TRIGGER trg_create_default_wishlist
AFTER INSERT ON users
FOR EACH ROW
BEGIN
    INSERT INTO user_wishlists (user_id, wishlist_name, is_default)
    VALUES (NEW.user_id, 'My Dream Destinations', TRUE);
END//

DELIMITER ;

-- ============================================
-- INDEXES FOR PERFORMANCE OPTIMIZATION
-- ============================================

-- Additional composite indexes for common queries
CREATE INDEX idx_trip_user_status ON trips(user_id, status, created_at DESC);
CREATE INDEX idx_stop_trip_order ON trip_stops(trip_id, stop_order, arrival_date);
CREATE INDEX idx_expense_trip_date ON trip_expenses(trip_id, expense_date DESC);
CREATE INDEX idx_activity_city_rating ON activities(city_id, average_rating DESC);
CREATE INDEX idx_review_activity_date ON activity_reviews(activity_id, created_at DESC);

-- ============================================
-- SAMPLE DATA FOR TESTING (Optional)
-- ============================================

-- Insert sample countries
INSERT INTO countries (country_name, country_code, continent, currency, currency_symbol, timezone) VALUES
('United States', 'USA', 'North America', 'USD', '$', 'America/New_York'),
('United Kingdom', 'GBR', 'Europe', 'GBP', '£', 'Europe/London'),
('France', 'FRA', 'Europe', 'EUR', '€', 'Europe/Paris'),
('Japan', 'JPN', 'Asia', 'JPY', '¥', 'Asia/Tokyo'),
('Australia', 'AUS', 'Oceania', 'AUD', '$', 'Australia/Sydney'),
('India', 'IND', 'Asia', 'INR', '₹', 'Asia/Kolkata'),
('Thailand', 'THA', 'Asia', 'THB', '฿', 'Asia/Bangkok'),
('Spain', 'ESP', 'Europe', 'EUR', '€', 'Europe/Madrid'),
('Italy', 'ITA', 'Europe', 'EUR', '€', 'Europe/Rome'),
('Brazil', 'BRA', 'South America', 'BRL', 'R$', 'America/Sao_Paulo');

-- Insert sample activity categories
INSERT INTO activity_categories (category_name, category_icon, description, display_order) VALUES
('Sightseeing', 'camera', 'Visit landmarks and attractions', 1),
('Adventure', 'mountain', 'Outdoor and adventure activities', 2),
('Food & Dining', 'restaurant', 'Culinary experiences', 3),
('Culture & History', 'museum', 'Museums, galleries, historical sites', 4),
('Nature & Wildlife', 'tree', 'Parks, gardens, wildlife sanctuaries', 5),
('Entertainment', 'theater', 'Shows, concerts, nightlife', 6),
('Shopping', 'shopping_cart', 'Markets, malls, boutiques', 7),
('Wellness & Spa', 'spa', 'Relaxation and wellness activities', 8),
('Water Activities', 'water', 'Beach, diving, water sports', 9),
('Sports & Fitness', 'fitness', 'Sports activities and fitness', 10);

-- ============================================
-- STORED PROCEDURES FOR COMMON OPERATIONS
-- ============================================

DELIMITER //

-- Procedure: Clone/Copy a trip
CREATE PROCEDURE sp_clone_trip(
    IN p_original_trip_id BIGINT,
    IN p_new_user_id BIGINT,
    OUT p_new_trip_id BIGINT
)
BEGIN
    DECLARE v_trip_name VARCHAR(255);
    
    -- Get original trip name
    SELECT CONCAT(trip_name, ' (Copy)') INTO v_trip_name
    FROM trips WHERE trip_id = p_original_trip_id;
    
    -- Insert new trip
    INSERT INTO trips (user_id, trip_name, description, start_date, end_date, total_budget, currency, is_public)
    SELECT p_new_user_id, v_trip_name, description, start_date, end_date, total_budget, currency, FALSE
    FROM trips WHERE trip_id = p_original_trip_id;
    
    SET p_new_trip_id = LAST_INSERT_ID();
    
    -- Copy trip stops
    INSERT INTO trip_stops (trip_id, city_id, stop_order, arrival_date, departure_date, notes)
    SELECT p_new_trip_id, city_id, stop_order, arrival_date, departure_date, notes
    FROM trip_stops WHERE trip_id = p_original_trip_id;
    
    -- Update copy count
    UPDATE trips SET copy_count = copy_count + 1 WHERE trip_id = p_original_trip_id;
END//

-- Procedure: Get trip budget breakdown
CREATE PROCEDURE sp_get_trip_budget_breakdown(
    IN p_trip_id BIGINT
)
BEGIN
    SELECT 
        ec.category_name,
        ec.category_icon,
        COUNT(te.expense_id) as expense_count,
        COALESCE(SUM(te.amount_in_base_currency), 0) as total_amount,
        t.currency
    FROM expense_categories ec
    LEFT JOIN trip_expenses te ON ec.expense_category_id = te.expense_category_id 
        AND te.trip_id = p_trip_id
    CROSS JOIN trips t WHERE t.trip_id = p_trip_id
    GROUP BY ec.expense_category_id, ec.category_name, ec.category_icon, t.currency
    ORDER BY total_amount DESC;
END//

-- Procedure: Get recommended activities for a city
CREATE PROCEDURE sp_get_recommended_activities(
    IN p_city_id BIGINT,
    IN p_limit INT
)
BEGIN
    SELECT 
        a.activity_id,
        a.activity_name,
        a.description,
        a.estimated_duration_minutes,
        a.estimated_cost,
        a.currency,
        a.average_rating,
        a.total_reviews,
        ac.category_name,
        a.image_url
    FROM activities a
    JOIN activity_categories ac ON a.category_id = ac.category_id
    WHERE a.city_id = p_city_id
    ORDER BY a.average_rating DESC, a.total_reviews DESC, a.popularity_count DESC
    LIMIT p_limit;
END//

DELIMITER ;

-- ============================================
-- GRANT PERMISSIONS (Adjust as needed)
-- ============================================

-- Create application user (change password in production!)
-- CREATE USER 'globetrotter_app'@'localhost' IDENTIFIED BY 'your_secure_password_here';
-- GRANT SELECT, INSERT, UPDATE, DELETE ON globetrotter.* TO 'globetrotter_app'@'localhost';
-- FLUSH PRIVILEGES;

-- ============================================
-- SCHEMA CREATION COMPLETE
-- ============================================

SELECT 'GlobeTrotter database schema created successfully!' as Status;
SELECT COUNT(*) as total_tables FROM information_schema.tables WHERE table_schema = 'globetrotter';

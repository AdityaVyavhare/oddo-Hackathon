const { executeQuery } = require('../config/database');

class User {
    // Create a new user
    static async create(userData) {
        const query = `
            INSERT INTO users (
                email, 
                password_hash, 
                first_name, 
                last_name, 
                username,
                profile_picture_url,
                bio,
                phone_number,
                date_of_birth,
                nationality,
                preferred_currency,
                preferred_language
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        
        const params = [
            userData.email,
            userData.passwordHash,
            userData.firstName,
            userData.lastName,
            userData.username,
            userData.profilePictureUrl || null,
            userData.bio || null,
            userData.phoneNumber || null,
            userData.dateOfBirth || null,
            userData.nationality || null,
            userData.preferredCurrency || 'USD',
            userData.preferredLanguage || 'en'
        ];
        
        const result = await executeQuery(query, params);
        return result.insertId;
    }
    
    // Find user by email
    static async findByEmail(email) {
        const query = 'SELECT * FROM users WHERE email = ?';
        const results = await executeQuery(query, [email]);
        return results[0] || null;
    }
    
    // Find user by username
    static async findByUsername(username) {
        const query = 'SELECT * FROM users WHERE username = ?';
        const results = await executeQuery(query, [username]);
        return results[0] || null;
    }
    
    // Find user by ID
    static async findById(userId) {
        const query = `
            SELECT 
                user_id,
                email,
                first_name,
                last_name,
                username,
                profile_picture_url,
                bio,
                phone_number,
                date_of_birth,
                nationality,
                preferred_currency,
                preferred_language,
                email_verified,
                is_active,
                is_premium,
                total_trips_created,
                total_countries_visited,
                created_at,
                updated_at,
                last_login_at
            FROM users 
            WHERE user_id = ? AND is_active = TRUE
        `;
        const results = await executeQuery(query, [userId]);
        return results[0] || null;
    }
    
    // Update email verification status
    static async verifyEmail(userId) {
        const query = 'UPDATE users SET email_verified = TRUE WHERE user_id = ?';
        await executeQuery(query, [userId]);
    }
    
    // Update last login
    static async updateLastLogin(userId) {
        const query = 'UPDATE users SET last_login_at = NOW() WHERE user_id = ?';
        await executeQuery(query, [userId]);
    }
    
    // Update user profile
    static async updateProfile(userId, updateData) {
        const allowedFields = [
            'first_name', 'last_name', 'bio', 'phone_number', 
            'date_of_birth', 'nationality', 'preferred_currency', 
            'preferred_language', 'profile_picture_url'
        ];
        
        const updates = [];
        const params = [];
        
        for (const [key, value] of Object.entries(updateData)) {
            if (allowedFields.includes(key)) {
                updates.push(`${key} = ?`);
                params.push(value);
            }
        }
        
        if (updates.length === 0) {
            throw new Error('No valid fields to update');
        }
        
        params.push(userId);
        const query = `UPDATE users SET ${updates.join(', ')} WHERE user_id = ?`;
        await executeQuery(query, params);
    }
    
    // Check if email exists
    static async emailExists(email) {
        const query = 'SELECT COUNT(*) as count FROM users WHERE email = ?';
        const results = await executeQuery(query, [email]);
        return results[0].count > 0;
    }
    
    // Check if username exists
    static async usernameExists(username) {
        const query = 'SELECT COUNT(*) as count FROM users WHERE username = ?';
        const results = await executeQuery(query, [username]);
        return results[0].count > 0;
    }
    
    // Get user statistics
    static async getUserStats(userId) {
        const query = 'SELECT * FROM vw_user_stats WHERE user_id = ?';
        const results = await executeQuery(query, [userId]);
        return results[0] || null;
    }
}

module.exports = User;

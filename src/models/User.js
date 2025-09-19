const db = require('../config/database')
const bcrypt = require('bcryptjs')

class User {
  static async create(userData) {
    const hashedPassword = await bcrypt.hash(userData.password, 12)
    
    const query = `
      INSERT INTO users (full_name, date_of_birth, email, password, role, is_active)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, full_name, date_of_birth, email, role, is_active, created_at, updated_at
    `

    const values = [
      userData.fullName,
      userData.dateOfBirth,
      userData.email,
      hashedPassword,
      userData.role || 'user',
      userData.isActive !== undefined ? userData.isActive : true
    ]

    const result = await db.query(query, values)
    return result.rows[0]
  }

  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1'
    const result = await db.query(query, [email])
    return result.rows[0]
  }

  static async findById(id) {
    const query = `
      SELECT id, full_name, date_of_birth, email, role, is_active, created_at, updated_at
      FROM users WHERE id = $1
    `;
    const result = await db.query(query, [id])
    return result.rows[0]
  }

  static async findAll() {
    const query = `
      SELECT id, full_name, date_of_birth, email, role, is_active, created_at, updated_at
      FROM users ORDER BY created_at DESC
    `;
    const result = await db.query(query)
    return result.rows
  }

  static async update(id, updateData) {
    const fields = []
    const values = []
    let paramCount = 1

    Object.entries(updateData).forEach(([key, value]) => {
      if (value !== undefined) {
        const dbField = key === 'fullName' ? 'full_name' : 
                       key === 'dateOfBirth' ? 'date_of_birth' : 
                       key === 'isActive' ? 'is_active' : key
        
        fields.push(`${dbField} = $${paramCount}`)
        values.push(value)
        paramCount++
      }
    })

    if (fields.length === 0) {
      throw new Error('No fields to update')
    }

    values.push(id);
    const query = `
      UPDATE users SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING id, full_name, date_of_birth, email, role, is_active, created_at, updated_at
    `

    const result = await db.query(query, values)
    return result.rows[0]
  }

  static async delete(id) {
    const query = 'DELETE FROM users WHERE id = $1 RETURNING id'
    const result = await db.query(query, [id])
    return result.rows[0]
  }

  static async checkPassword(candidatePassword, hashedPassword) {
    return await bcrypt.compare(candidatePassword, hashedPassword)
  }
}

module.exports = User
const { executeQuery } = require("../config/database");

class Expense {
  static async create(expenseData) {
    const query = `
      INSERT INTO trip_expenses (
        trip_id, stop_id, itinerary_item_id, expense_category_id,
        expense_name, description, amount, currency, amount_in_base_currency,
        expense_date, payment_method, is_shared_expense, split_between_count,
        receipt_url, notes, created_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      expenseData.tripId,
      expenseData.stopId || null,
      expenseData.itineraryItemId || null,
      expenseData.expenseCategoryId,
      expenseData.expenseName,
      expenseData.description || null,
      expenseData.amount,
      expenseData.currency || "USD",
      expenseData.amountInBaseCurrency || expenseData.amount,
      expenseData.expenseDate,
      expenseData.paymentMethod || "cash",
      expenseData.isSharedExpense || false,
      expenseData.splitBetweenCount || 1,
      expenseData.receiptUrl || null,
      expenseData.notes || null,
      expenseData.createdBy,
    ];

    const result = await executeQuery(query, params);
    return result.insertId;
  }

  static async getTripExpenses(tripId) {
    const query = `
      SELECT 
        te.*,
        ec.category_name,
        ec.category_icon,
        u.username as created_by_username
      FROM trip_expenses te
      JOIN expense_categories ec ON te.expense_category_id = ec.expense_category_id
      LEFT JOIN users u ON te.created_by = u.user_id
      WHERE te.trip_id = ?
      ORDER BY te.expense_date DESC, te.created_at DESC
    `;

    return await executeQuery(query, [tripId]);
  }

  static async findById(expenseId) {
    const query = `
      SELECT 
        te.*,
        ec.category_name
      FROM trip_expenses te
      JOIN expense_categories ec ON te.expense_category_id = ec.expense_category_id
      WHERE te.expense_id = ?
    `;

    const results = await executeQuery(query, [expenseId]);
    return results[0] || null;
  }

  static async update(expenseId, updateData) {
    const allowedFields = [
      "expense_category_id",
      "expense_name",
      "description",
      "amount",
      "currency",
      "amount_in_base_currency",
      "expense_date",
      "payment_method",
      "is_shared_expense",
      "split_between_count",
      "receipt_url",
      "notes",
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
      throw new Error("No valid fields to update");
    }

    params.push(expenseId);
    const query = `UPDATE trip_expenses SET ${updates.join(
      ", "
    )} WHERE expense_id = ?`;
    await executeQuery(query, params);
  }

  static async delete(expenseId) {
    const query = "DELETE FROM trip_expenses WHERE expense_id = ?";
    await executeQuery(query, [expenseId]);
  }

  static async getBudgetSummary(tripId) {
    const query = "CALL sp_get_trip_budget_breakdown(?)";
    return await executeQuery(query, [tripId]);
  }

  static async getExpenseBreakdown(tripId) {
    const query = `
      SELECT 
        ec.category_name,
        ec.category_icon,
        COUNT(te.expense_id) as expense_count,
        COALESCE(SUM(te.amount_in_base_currency), 0) as total_amount,
        t.currency
      FROM expense_categories ec
      LEFT JOIN trip_expenses te ON ec.expense_category_id = te.expense_category_id 
        AND te.trip_id = ?
      CROSS JOIN trips t WHERE t.trip_id = ?
      GROUP BY ec.expense_category_id, ec.category_name, ec.category_icon, t.currency
      ORDER BY total_amount DESC
    `;

    return await executeQuery(query, [tripId, tripId]);
  }
}

class ExpenseCategory {
  static async getAll() {
    const query = "SELECT * FROM expense_categories ORDER BY display_order ASC";
    return await executeQuery(query);
  }
}

module.exports = { Expense, ExpenseCategory };

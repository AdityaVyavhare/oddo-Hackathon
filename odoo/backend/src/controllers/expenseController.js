const { Expense, ExpenseCategory } = require("../models/Expense");
const ApiResponse = require("../utils/ApiResponse");

const createExpense = async (req, res) => {
  try {
    const { tripId } = req.params;
    const userId = req.user.userId;
    const expenseData = { ...req.body, tripId, createdBy: userId };

    const expenseId = await Expense.create(expenseData);
    const expense = await Expense.findById(expenseId);

    return ApiResponse.success(
      res,
      201,
      "Expense created successfully",
      expense
    );
  } catch (error) {
    console.error("Create expense error:", error);
    return ApiResponse.serverError(res, "Failed to create expense");
  }
};

const getTripExpenses = async (req, res) => {
  try {
    const { tripId } = req.params;
    const expenses = await Expense.getTripExpenses(tripId);

    return ApiResponse.success(res, 200, "Expenses retrieved successfully", {
      expenses,
      count: expenses.length,
    });
  } catch (error) {
    console.error("Get expenses error:", error);
    return ApiResponse.serverError(res, "Failed to retrieve expenses");
  }
};

const getExpenseById = async (req, res) => {
  try {
    const { expenseId } = req.params;
    const expense = await Expense.findById(expenseId);

    if (!expense) {
      return ApiResponse.notFound(res, "Expense not found");
    }

    return ApiResponse.success(
      res,
      200,
      "Expense retrieved successfully",
      expense
    );
  } catch (error) {
    console.error("Get expense error:", error);
    return ApiResponse.serverError(res, "Failed to retrieve expense");
  }
};

const updateExpense = async (req, res) => {
  try {
    const { expenseId } = req.params;
    const updateData = req.body;

    await Expense.update(expenseId, updateData);
    const expense = await Expense.findById(expenseId);

    return ApiResponse.success(
      res,
      200,
      "Expense updated successfully",
      expense
    );
  } catch (error) {
    console.error("Update expense error:", error);
    return ApiResponse.serverError(res, "Failed to update expense");
  }
};

const deleteExpense = async (req, res) => {
  try {
    const { expenseId } = req.params;

    await Expense.delete(expenseId);
    return ApiResponse.success(res, 200, "Expense deleted successfully");
  } catch (error) {
    console.error("Delete expense error:", error);
    return ApiResponse.serverError(res, "Failed to delete expense");
  }
};

const getBudgetSummary = async (req, res) => {
  try {
    const { tripId } = req.params;
    const summary = await Expense.getBudgetSummary(tripId);

    return ApiResponse.success(
      res,
      200,
      "Budget summary retrieved successfully",
      summary
    );
  } catch (error) {
    console.error("Get budget summary error:", error);
    return ApiResponse.serverError(res, "Failed to retrieve budget summary");
  }
};

const getExpenseBreakdown = async (req, res) => {
  try {
    const { tripId } = req.params;
    const breakdown = await Expense.getExpenseBreakdown(tripId);

    return ApiResponse.success(
      res,
      200,
      "Expense breakdown retrieved successfully",
      { breakdown }
    );
  } catch (error) {
    console.error("Get expense breakdown error:", error);
    return ApiResponse.serverError(res, "Failed to retrieve breakdown");
  }
};

const getExpenseCategories = async (req, res) => {
  try {
    const categories = await ExpenseCategory.getAll();
    return ApiResponse.success(
      res,
      200,
      "Expense categories retrieved successfully",
      { categories, count: categories.length }
    );
  } catch (error) {
    console.error("Get categories error:", error);
    return ApiResponse.serverError(res, "Failed to retrieve categories");
  }
};

module.exports = {
  createExpense,
  getTripExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
  getBudgetSummary,
  getExpenseBreakdown,
  getExpenseCategories,
};


import { useState, useEffect } from 'react';
import { Expense } from '@/types/expense';

const STORAGE_KEY = 'expense-tracker-data';

export const useExpenses = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setExpenses(JSON.parse(stored));
      } catch (error) {
        console.error('Error parsing stored expenses:', error);
      }
    }
  }, []);

  const saveExpenses = (newExpenses: Expense[]) => {
    setExpenses(newExpenses);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newExpenses));
  };

  const addExpense = (expense: Omit<Expense, 'id' | 'createdAt'>) => {
    const newExpense: Expense = {
      ...expense,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    saveExpenses([...expenses, newExpense]);
  };

  const deleteExpense = (id: string) => {
    saveExpenses(expenses.filter(expense => expense.id !== id));
  };

  return {
    expenses,
    addExpense,
    deleteExpense,
  };
};
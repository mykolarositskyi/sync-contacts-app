import { createNotFoundError, AppError } from '@/types/errors';
import mongoose from 'mongoose';

/**
 * Safe database connection with retry logic
 */
export const safeConnectDB = async (
  uri: string,
  options: mongoose.ConnectOptions = {},
  maxRetries: number = 3
): Promise<typeof mongoose> => {
  let lastError: Error | undefined;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await mongoose.connect(uri, {
        // bufferCommands: false,
        ...options,
      });
      return mongoose;
    } catch (error) {
      lastError = error as Error;
      console.error(`Database connection attempt ${attempt} failed:`, error);

      if (attempt < maxRetries) {
        // Wait before retrying (exponential backoff)
        const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw new Error(`Failed to connect to database after ${maxRetries} attempts: ${lastError?.message || 'Unknown error'}`);
};

/**
 * Generic find one with error handling
 */
export const safeFindOne = async <T>(
  model: mongoose.Model<T>,
  filter: mongoose.FilterQuery<T>
): Promise<T> => {
  const item = await model.findOne(filter);

  if (!item) {
    throw createNotFoundError(
      model.modelName,
      JSON.stringify(filter)
    );
  }

  return item;
};

/**
 * Generic find and update with error handling
 */
export const safeFindAndUpdate = async <T>(
  model: mongoose.Model<T>,
  filter: mongoose.FilterQuery<T>,
  update: mongoose.UpdateQuery<T>,
  options: mongoose.QueryOptions = {}
): Promise<T | null> => {
  try {
    return await model.findOneAndUpdate(filter, update, {
      new: true,
      runValidators: true,
      ...options,
    });
  } catch (error) {
    const appError: AppError = {
      message: 'Failed to find and update item',
      code: 'DB_FIND_UPDATE_ERROR',
      statusCode: 500,
      details: { error: error instanceof Error ? error.message : 'Unknown error' }
    };
    throw appError;
  }
};

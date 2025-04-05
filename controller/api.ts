import { Request, Response } from 'express';
import { createUserDocumentIfNotExists, getUserData, updateUserData } from '../repository/userCollection';
import { UserUpdateData } from '../entities/user';

export const fetchUserDataHandler = async (req: Request, res: Response) => {
  const userId = req.user?.uid;

  if (!userId) {
    console.error('Error: User ID not found in request. Auth middleware might not have run or failed.');
    return res.status(401).send({ message: 'Unauthorized access.' });
  }

  console.log(` Attempting to fetch data for user ID: ${userId}`);

  try {
    const userData = await getUserData(userId);

    if (userData) {
      console.log(` Successfully fetched data for user ID: ${userId}`);
      res.status(200).json(userData);
    } else {
      console.log(` No data found for user ID: ${userId}`);
      res.status(200).json(null); // Or res.status(200).json({});
    }
  } catch (error: any) {
    console.error(`Error for user ID ${userId}:`, error.message);
    res.status(500).send({ message: 'Internal Server Error: Could not fetch user data.' });
  }
};

export const createUserDataHandler = async (req: Request, res: Response) => {
  const userId = req.user?.uid;

  if (!userId) {
    console.error('User ID not found in request.');
    return res.status(401).send({ message: 'Unauthorized access.' });
  }

  if (!req.body || typeof req.body !== 'object' || Object.keys(req.body).length === 0) {
    return res.status(400).send({ message: 'Bad Request: No data provided or invalid format.' });
  }

  const allowedCreateFields: (keyof UserUpdateData)[] = ['hobby', 'address', 'phoneNumber', 'displayName'];
  const dataToUpdate: UserUpdateData = {};

  for (const key of allowedCreateFields) {
    if (req.body[key] !== undefined) {
      dataToUpdate[key] = req.body[key];
    }
  }

  if (Object.keys(dataToUpdate).length === 0) {
    console.warn(`Warning for user ID ${userId}: Request body contained no valid fields for update.`);
    return res.status(400).send({ message: 'Bad Request: No valid data fields provided for update.' });
  }

  try {
    await createUserDocumentIfNotExists(userId, dataToUpdate);
    console.log(`Successfully updated data for user ID: ${userId}`);
    res.status(200).send({ message: 'User data updated successfully.' });
  } catch (error: any) {
    console.error(`Error for user ID ${userId}:`, error.message);
    res.status(500).send({ message: 'Internal Server Error: Could not update user data.' });
  }
};


export const updateUserDataHandler = async (req: Request, res: Response) => {
  const userId = req.user?.uid;

  if (!userId) {
    console.error('User ID not found in request.');
    return res.status(401).send({ message: 'Unauthorized access.' });
  }

  console.log(`Attempting to update data for user ID: ${userId}`);

  if (!req.body || typeof req.body !== 'object' || Object.keys(req.body).length === 0) {
    console.warn(`Warning for user ID ${userId}: Received empty or invalid request body.`);
    return res.status(400).send({ message: 'Bad Request: No data provided or invalid format.' });
  }

  const allowedUpdateFields: (keyof UserUpdateData)[] = ['hobby', 'address', 'phoneNumber', 'displayName'];
  const dataToUpdate: UserUpdateData = {};

  for (const key of allowedUpdateFields) {
    if (req.body[key] !== undefined) {
      dataToUpdate[key] = req.body[key];
    }
  }

  if (Object.keys(dataToUpdate).length === 0) {
    console.warn(`Warning for user ID ${userId}: Request body contained no valid fields for update.`);
    return res.status(400).send({ message: 'Bad Request: No valid data fields provided for update.' });
  }

  try {
    await updateUserData(userId, dataToUpdate);
    console.log(`Successfully updated data for user ID: ${userId}`);
    res.status(200).send({ message: 'User data updated successfully.' });
  } catch (error: any) {
    console.error(`Error for user ID ${userId}:`, error.message);
    res.status(500).send({ message: 'Internal Server Error: Could not update user data.' });
  }
};

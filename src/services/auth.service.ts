import TransactionService from './transaction.service';
import { generateToken, handleError } from '../utils/utilsService';

const authenticate = async (apiKey: string, secretKey: string) => {
	try {
		const token = generateToken(apiKey, secretKey);

		const service = new TransactionService(token);
		const response = await service.getTransactions();

		if (!response || !response.items) {
			throw new Error('Invalid credentials');
		}

		return token;
	} catch (error) {
		return handleError(error);
	}
};

export { authenticate };

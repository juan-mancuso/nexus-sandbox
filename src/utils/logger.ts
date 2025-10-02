import { pino, transport } from 'pino';
import { CustomLogger, TypeLogger } from '../interfaces/logger.interface';

const customLevels: Record<TypeLogger, number> = {
	[TypeLogger.ERROR]: 0,
	[TypeLogger.DEBUG]: 1,
	[TypeLogger.WARN]: 2,
	[TypeLogger.INFO]: 3,
	[TypeLogger.HTTP]: 4,
	[TypeLogger.HTTP_FAIL]: 5
};

const customColors = `${TypeLogger.ERROR}:red,${TypeLogger.WARN}:yellow,${TypeLogger.INFO}:green,${TypeLogger.HTTP}:blue,${TypeLogger.HTTP_FAIL}:cyan,${TypeLogger.DEBUG}:magenta`;

const Logger = pino(
	{
		customLevels,
		useOnlyCustomLevels: true,
		level: TypeLogger.ERROR
	},
	transport({
		target: 'pino-pretty',
		options: {
			translateTime: 'SYS:standard',
			customLevels,
			colorize: true,
			customColors
		}
	})
) as CustomLogger;

export { Logger };

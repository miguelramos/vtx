import prompts from 'prompts';

const OperationCancel = () => {
	throw new Error('🛑 Operation Cancelled');
}

export const promptCreateWorkspace = async () => {
	return await prompts([
		{
			name: 'workspace',
			type: 'text',
			message: 'Workspace name'
		},
		{
			name: 'namespace',
			type: 'text',
			message: 'Your namespace context: Example @workspace or empty',
			initial: ''
		},
		{
			name: 'target',
			type: 'text',
			message: 'Target directory',
			initial: process.cwd()
		}
	], {
		onCancel: OperationCancel
	});
};

export const promptCreateApp = async () => {
	return await prompts([
		{
			name: 'app',
			type: 'text',
			message: 'Your app name'
		},
		{
			name: 'target',
			type: 'text',
			message: 'Target directory',
			initial: process.cwd()
		}
	], {
		onCancel: OperationCancel
	});
};
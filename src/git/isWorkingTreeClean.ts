import execa from 'execa';

export const isWorkingTreeClean = async (
  cwd: string = process.cwd()
): Promise<boolean> => {
	try {
		const {stdout: status} = await execa('git', ['status', '--porcelain'], { cwd });
		if (status !== '') {
			return false;
		}

		return true;
	} catch {
		return false;
	}
};

import ServerAPI from '../server'

export enum TaskState {
	created = 0,
	progress = 1,
	success = 2,
	failed = 3,
	none = 100,
}

interface TaskForm {
	areaCode: string // 地区编码
	khsh: string // 客户税号
	taskCode: string // 任务编号
	taskType: number // 0：正常任务；1：失败后新建任务；默认：0
	wgxkssj?: string // 未勾选数据开始时间
	wgxjssj?: string // 未勾选数据结束时间
	ygxkssj?: string // 已勾选数据开始时间
	ygxjssj?: string // 已勾选数据结束时间
}

export interface Task {
	areaCode: string // 地区编码
	companyTaskId: string // 任务id
	khsh: string // 客户税号
	taskCode: string // 任务编号
	taskType: number // 任务类型
	wgxkssj?: string // 未勾选数据开始时间
	wgxjssj?: string // 未勾选数据结束时间
	wgxwcsj?: string // 未勾选数据已完成时间
	ygxkssj?: string // 已勾选数据开始时间
	ygxjssj?: string // 已勾选数据结束时间
	ygxwcsj?: string // 已勾选数据已完成时间
	taskState?: TaskState // 任务状态 0：未开始；1：进行中；2：成功；3：失败

}

class TaskAPI extends ServerAPI {

	// 创建任务
	public async create(form: TaskForm): Promise<void> {
		return this.post('/task/create', form)
	}

	// 获取客户未结束任务列表
	public async getNotFinishedList(khsh: string): Promise<Task[]> {
		return this.post('/task/getNotFinishedList', { khsh })
	}

	// 更新任务状态
	// companyTaskId 任务id
	// taskState 任务状态 0：未开始；1：进行中；2：成功；3：失败
	public async updateTaskState(companyTaskId: string, taskState: TaskState): Promise<Task> {
		return this.post('/task/updateTaskState', { companyTaskId, taskState: taskState.valueOf() })
	}

	public async getNewestDetail(khsh: string): Promise<Task> {
		return this.post('/task/getNewestDetail', { khsh })
	}
}


export const taskAPI = new TaskAPI()

export type BaseResponse = {
    type: string;
    message: string;
};

export type TaskResponse = BaseResponse & {
    data: Task | undefined;
};

export type TaskListResponse = BaseResponse & {
    data: Task[];
};

export type Task = {
    id: string;
    title: string;
    description: string;
    type: 'default' | 'urgent' | 'outdated';
    status: 'planned' | 'active' | 'finished';
    plannedStartDate: number;
    plannedEndDate: number;
    startDate: number;
    endDate: number;
};

export type TaskFilter = Partial<Omit<Task, 'id' | 'description'>>;

export type Credentials = {
    login: string;
    password: string;
};

export type User = Credentials & {
    keyword: string;
    name: string;
    photo: string;
    tasks: string[];
};

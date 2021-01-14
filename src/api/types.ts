export type BaseResponse = {
    type: string;
    message: string;
};

export type TaskResponse = {
    type: string;
    message: Task | undefined;
};

export type TaskListResponse = {
    type: string;
    message: Task[];
};

export type Task = {
    id: string;
    title: string;
    description: string;
    type: 'default' | 'urgent' | 'outdated';
    plannedStartDate: number;
    plannedEndDate: number;
    startDate: number;
    endDate: number;
};

export type TaskFilter = Pick<Task, 'title'> &
    Partial<Omit<Task, 'id' | 'title' | 'description'>>;

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
